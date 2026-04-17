import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Playlist from "../models/playlist.model.js";
import Video from "../models/video.model.js";

export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name?.trim()) throw new ApiError(400, "Playlist name is required");

  const playlist = await Playlist.create({
    name,
    description: description || "",
    owner: req.userId,
  });

  return res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

export const getPlaylistById = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.playlistId)
    .populate("owner", "username fullName avatar")
    .populate("videos");

  if (!playlist) throw new ApiError(404, "Playlist not found");
  return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

export const getUserPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ owner: req.params.userId }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

export const updatePlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const playlist = await Playlist.findById(req.params.playlistId);

  if (!playlist) throw new ApiError(404, "Playlist not found");
  if (String(playlist.owner) !== String(req.userId)) {
    throw new ApiError(403, "You can update only your own playlist");
  }

  if (name) playlist.name = name;
  if (typeof description !== "undefined") playlist.description = description;
  await playlist.save();

  return res.status(200).json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");
  if (String(playlist.owner) !== String(req.userId)) {
    throw new ApiError(403, "You can delete only your own playlist");
  }

  await playlist.deleteOne();
  return res.status(200).json(new ApiResponse(200, null, "Playlist deleted successfully"));
});

export const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");
  if (String(playlist.owner) !== String(req.userId)) {
    throw new ApiError(403, "You can update only your own playlist");
  }

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (!playlist.videos.find((id) => String(id) === String(videoId))) {
    playlist.videos.push(videoId);
    await playlist.save();
  }

  return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist"));
});

export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");
  if (String(playlist.owner) !== String(req.userId)) {
    throw new ApiError(403, "You can update only your own playlist");
  }

  playlist.videos = playlist.videos.filter((id) => String(id) !== String(videoId));
  await playlist.save();

  return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist"));
});
