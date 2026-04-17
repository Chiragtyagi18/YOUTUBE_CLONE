import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Tweet from "../models/tweet.model.js";

export const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) {
    throw new ApiError(400, "Tweet content is required");
  }

  const tweet = await Tweet.create({ content, owner: req.userId });
  return res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

export const getTweets = asyncHandler(async (req, res) => {
  const filter = req.query.owner ? { owner: req.query.owner } : {};
  const tweets = await Tweet.find(filter).populate("owner", "username fullName avatar").sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

export const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) {
    throw new ApiError(400, "Tweet content is required");
  }

  const tweet = await Tweet.findById(req.params.tweetId);
  if (!tweet) throw new ApiError(404, "Tweet not found");
  if (String(tweet.owner) !== String(req.userId)) {
    throw new ApiError(403, "You can update only your own tweet");
  }

  tweet.content = content;
  await tweet.save();
  return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

export const deleteTweet = asyncHandler(async (req, res) => {
  const tweet = await Tweet.findById(req.params.tweetId);
  if (!tweet) throw new ApiError(404, "Tweet not found");
  if (String(tweet.owner) !== String(req.userId)) {
    throw new ApiError(403, "You can delete only your own tweet");
  }

  await tweet.deleteOne();
  return res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully"));
});
