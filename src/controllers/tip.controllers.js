import { getTipsByCreatedAt } from "../services/tip.service.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/error.api.js";
import { ApiResponse } from "../utils/response.api.js";

export const getTips = catchAsync(async (req, res) => {
  const { creator_id } = req.params;
  const { created_at } = req.query;

  if (!creator_id) {
    throw new ApiError(400, "Creator ID is required");
  }

  const tips = await getTipsByCreatedAt(
    Math.floor(created_at ? created_at : (Date.now() - 600 * 1000) / 1000),
    creator_id
  );

  if (!tips) {
    throw new ApiError(404, "No new tips");
  }

  res.json(new ApiResponse(200, tips));
});
