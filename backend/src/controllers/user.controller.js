import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary, { deleteFromCloudinary } from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, username } = req.body;

  if ([fullName, email, password, username].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  const avatar = avatarLocalPath
    ? await uploadOnCloudinary(avatarLocalPath, "avatars")
    : null;
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath, "coverImages")
    : null;

  const user = await User.create({
    fullName,
    ...(avatar?.secure_url ? { avatar: avatar.secure_url } : {}),
    ...(coverImage?.secure_url ? { coverImage: coverImage.secure_url } : {}),
    email: email.toLowerCase(),
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    throw new ApiError(400, "Username or email and password are required");
  }

  const user = await User.findOne({
    $or: [{ username: username?.toLowerCase() }, { email: email?.toLowerCase() }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.userId, { $unset: { refreshToken: 1 } }, { new: true });

  return res
    .status(200)
    .clearCookie("refreshToken", cookieOptions)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?.id);
  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed successfully"
      )
    );
});

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user retrieved successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, username } = req.body;

  if (!fullName || !fullName.trim()) {
    throw new ApiError(400, "Full name is required");
  }

  const updateData = {
    fullName: fullName.trim(),
  };

  // If username is being updated, check if it's unique
  if (username && username.trim()) {
    const usernameToCheck = username.toLowerCase().trim();
    const existingUser = await User.findOne({
      username: usernameToCheck,
      _id: { $ne: req.userId },
    });

    if (existingUser) {
      throw new ApiError(409, "Username already taken");
    }

    updateData.username = usernameToCheck;
  }

  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      $set: updateData,
    },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path || req.files?.avatar?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const oldAvatar = await User.findById(req.userId).select("avatar");
  if (oldAvatar?.avatar) {
    await deleteFromCloudinary(oldAvatar.avatar);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath, "avatars");
  const user = await User.findByIdAndUpdate(
    req.userId,
    { avatar: avatar?.secure_url },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path || req.files?.coverImage?.[0]?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is required");
  }

  const oldCoverImage = await User.findById(req.userId).select("coverImage");
  if (oldCoverImage?.coverImage) {
    await deleteFromCloudinary(oldCoverImage.coverImage);
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath, "coverImages");
  const user = await User.findByIdAndUpdate(
    req.userId,
    { coverImage: coverImage?.secure_url },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username, userId } = req.params;

  let channelUser;

  if (userId) {
    // Route: /channel-id/:userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }
    channelUser = await User.findById(userId).select(
      "-password -refreshToken"
    );
  } else if (username) {
    // Route: /channel/:username
    if (!username?.trim()) {
      throw new ApiError(400, "Username is required");
    }
    channelUser = await User.findOne({ username: username.toLowerCase() }).select(
      "-password -refreshToken"
    );
  } else {
    throw new ApiError(400, "Username or user ID is required");
  }

  if (!channelUser) {
    throw new ApiError(404, "User not found");
  }

  const subscribersCount = await Subscription.countDocuments({
    channel: channelUser._id,
  });
  const subscribedToCount = await Subscription.countDocuments({
    subscriber: channelUser._id,
  });

  let isSubscribed = false;
  if (req.userId) {
    isSubscribed = Boolean(
      await Subscription.findOne({
        channel: channelUser._id,
        subscriber: req.userId,
      })
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...channelUser.toObject(),
        subscribersCount,
        subscribedToCount,
        isSubscribed,
      },
      "User channel profile retrieved successfully"
    )
  );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.userId) } },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [{ $project: { fullName: 1, username: 1, avatar: 1 } }],
            },
          },
          { $addFields: { owner: { $arrayElemAt: ["$owner", 0] } } },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, user[0]?.watchHistory ?? [], "Watch history retrieved"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentUserPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
