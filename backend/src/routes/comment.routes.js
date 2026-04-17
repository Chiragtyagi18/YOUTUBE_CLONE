import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getComments).post(verifyJWT, createComment);
router.route("/:commentId").patch(verifyJWT, updateComment).delete(verifyJWT, deleteComment);

export default router;
