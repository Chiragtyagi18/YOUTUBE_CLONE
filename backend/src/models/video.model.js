import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    thumbnail: {
      type: String,
      required: false,
      default: null,
    },
    videoFile: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: false,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);
export default Video;
