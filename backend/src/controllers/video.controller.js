import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Video from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;
  const videoFile = req.files?.videoFile?.[0];
  const thumbnailFile = req.files?.thumbnail?.[0];

  if (!title?.trim()) {
    throw new ApiError(400, "Title is required");
  }

  if (!videoFile) {
    throw new ApiError(400, "Video file is required");
  }

  let videoUrl, thumbnailUrl, videoDuration = 0;

  try {
    // Upload video to Cloudinary
    const videoResponse = await uploadOnCloudinary(videoFile.path, 'videos');
    videoUrl = videoResponse.secure_url;
    // Cloudinary returns duration in seconds for videos
    videoDuration = videoResponse.duration || 0;

    // Upload thumbnail if provided
    if (thumbnailFile) {
      const thumbnailResponse = await uploadOnCloudinary(thumbnailFile.path, 'thumbnails');
      thumbnailUrl = thumbnailResponse.secure_url;
    }
  } catch (error) {
    throw new ApiError(500, "Failed to upload files to cloud storage");
  }

  const video = await Video.create({
    title: title.trim(),
    description: description?.trim() || '',
    thumbnail: thumbnailUrl || null,
    videoFile: videoUrl,
    duration: videoDuration,
    owner: req.userId,
    isPublished: Boolean(isPublished),
  });

  return res.status(201).json(new ApiResponse(201, video, "Video created successfully"));
});

export const getAllVideos = asyncHandler(async (req, res) => {
  const { owner, q, isPublished } = req.query;
  const filter = {};

  if (owner) filter.owner = owner;
  if (typeof isPublished !== "undefined") filter.isPublished = isPublished === "true";
  if (q) filter.title = { $regex: q, $options: "i" };

  const videos = await Video.find(filter).populate("owner", "username fullName avatar").sort({ createdAt: -1 });

  // Add subscribersCount for each video owner
  const videosWithSubscriberCount = await Promise.all(
    videos.map(async (video) => {
      const subscribersCount = await Subscription.countDocuments({
        channel: video.owner._id,
      });
      const videoData = video.toObject();
      videoData.owner.subscribersCount = subscribersCount;
      return videoData;
    })
  );

  return res.status(200).json(new ApiResponse(200, videosWithSubscriberCount, "Videos fetched successfully"));
});

export const getVideoById = asyncHandler(async (req, res) => {
  const { incrementViews } = req.query;
  const video = await Video.findById(req.params.videoId).populate("owner", "username fullName avatar");

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Only increment views if explicitly requested and video is published
  if (incrementViews === 'true' && video.isPublished) {
    video.views += 1;
    await video.save({ validateBeforeSave: false });
  }

  // Get subscriber count for the video owner
  const subscribersCount = await Subscription.countDocuments({
    channel: video.owner._id,
  });

  // Convert video to object and add subscribersCount
  const videoData = video.toObject();
  videoData.owner.subscribersCount = subscribersCount;

  return res.status(200).json(new ApiResponse(200, videoData, "Video fetched successfully"));
});

export const updateVideo = asyncHandler(async (req, res) => {
  const { title, description, thumbnail, videoFile, duration, isPublished } = req.body;
  const video = await Video.findById(req.params.videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (String(video.owner) !== String(req.userId)) {
    throw new ApiError(403, "You can update only your own videos");
  }

  if (title) video.title = title;
  if (description) video.description = description;
  if (thumbnail) video.thumbnail = thumbnail;
  if (videoFile) video.videoFile = videoFile;
  if (duration) video.duration = duration;
  if (typeof isPublished !== "undefined") video.isPublished = Boolean(isPublished);

  await video.save();

  return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (String(video.owner) !== String(req.userId)) {
    throw new ApiError(403, "You can delete only your own videos");
  }

  await video.deleteOne();
  return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
});

export const togglePublishStatus = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (String(video.owner) !== String(req.userId)) {
    throw new ApiError(403, "You can update only your own videos");
  }

  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video publish status toggled successfully"));
});
