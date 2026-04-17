import { Router } from "express";
import { createTweet, deleteTweet, getTweets, updateTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getTweets).post(verifyJWT, createTweet);
router.route("/:tweetId").patch(verifyJWT, updateTweet).delete(verifyJWT, deleteTweet);

export default router;
