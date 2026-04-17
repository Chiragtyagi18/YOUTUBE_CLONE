import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import Video from "../models/video.model.js";
import Tweet from "../models/tweet.model.js";

export const getChannelStats = asyncHandler(async (req, res) => {
  const ownerId = req.userId;

  const [totalVideos, totalViewsAgg, totalSubscribers, totalTweets] = await Promise.all([
    Video.countDocuments({ owner: ownerId }),
    Video.aggregate([
      { $match: { owner: ownerId } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]),
    Subscription.countDocuments({ channel: ownerId }),
    Tweet.countDocuments({ owner: ownerId }),
  ]);

  const totalViews = totalViewsAgg[0]?.totalViews || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      { totalVideos, totalViews, totalSubscribers, totalTweets },
      "Channel stats fetched successfully"
    )
  );
});

export const getChannelVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({ owner: req.userId }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});
