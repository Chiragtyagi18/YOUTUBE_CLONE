import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const healthcheck = asyncHandler(async (_req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { status: "ok" }, "Backend is healthy"));
});
