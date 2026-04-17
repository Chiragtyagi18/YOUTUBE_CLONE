import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import User from "../models/user.model.js";

export const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (String(req.userId) === String(channelId)) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  const channel = await User.findById(channelId);
  if (!channel) throw new ApiError(404, "Channel not found");

  const existing = await Subscription.findOne({
    channel: channelId,
    subscriber: req.userId,
  });

  if (existing) {
    await existing.deleteOne();
    return res.status(200).json(new ApiResponse(200, { subscribed: false }, "Unsubscribed"));
  }

  await Subscription.create({ channel: channelId, subscriber: req.userId });
  return res.status(200).json(new ApiResponse(200, { subscribed: true }, "Subscribed"));
});

export const getChannelSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscription.find({ channel: req.params.channelId })
    .populate("subscriber", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Channel subscribers fetched successfully"));
});

export const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ subscriber: req.params.subscriberId })
    .populate("channel", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully"));
});
