import { Router } from "express";
import {
  createVideo,
  deleteVideo,
  getAllVideos,
  getVideoById,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllVideos).post(verifyJWT, upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), createVideo);
router.route("/:videoId").get(getVideoById).patch(verifyJWT, updateVideo).delete(verifyJWT, deleteVideo);
router.route("/:videoId/toggle-publish").patch(verifyJWT, togglePublishStatus);

export default router;
