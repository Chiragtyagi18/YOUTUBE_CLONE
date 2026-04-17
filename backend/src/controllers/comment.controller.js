import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Comment from "../models/comment.model.js";
import Video from "../models/video.model.js";
import Tweet from "../models/tweet.model.js";

const buildCommentTarget = async ({ videoId, tweetId }) => {
  if (!videoId && !tweetId) {
    throw new ApiError(400, "videoId or tweetId is required");
  }

  if (videoId) {
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");
    return { video: videoId, tweet: null };
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiError(404, "Tweet not found");
  return { video: null, tweet: tweetId };
};

export const createComment = asyncHandler(async (req, res) => {
  const { content, videoId, tweetId } = req.body;
  if (!content?.trim()) throw new ApiError(400, "Comment content is required");

  const target = await buildCommentTarget({ videoId, tweetId });
  const comment = await Comment.create({ content, owner: req.userId, ...target });

  // Populate owner details before returning
  const populatedComment = await comment.populate("owner", "username fullName avatar");

  return res.status(201).json(new ApiResponse(201, populatedComment, "Comment created successfully"));
});

export const getComments = asyncHandler(async (req, res) => {
  const target = await buildCommentTarget({
    videoId: req.query.videoId,
    tweetId: req.query.tweetId,
  });

  const comments = await Comment.find(target)
    .populate("owner", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

export const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) throw new ApiError(400, "Comment content is required");

  const comment = await Comment.findById(req.params.commentId);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (String(comment.owner) !== String(req.userId)) {
    throw new ApiError(403, "You can update only your own comment");
  }

  comment.content = content;
  await comment.save();
  return res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"));
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (String(comment.owner) !== String(req.userId)) {
    throw new ApiError(403, "You can delete only your own comment");
  }

  await comment.deleteOne();
  return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
});
