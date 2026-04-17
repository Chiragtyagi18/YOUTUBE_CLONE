import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decoded?.id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = user;
  req.userId = user._id;
  next();
});
