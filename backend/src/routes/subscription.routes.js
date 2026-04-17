import { Router } from "express";
import {
  getChannelSubscribers,
  getSubscribedChannels,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/c/:channelId").post(verifyJWT, toggleSubscription);
router.route("/c/:channelId/subscribers").get(getChannelSubscribers);
router.route("/u/:subscriberId/channels").get(getSubscribedChannels);

export default router;
