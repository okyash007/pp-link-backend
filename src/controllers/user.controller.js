import { getUserByVisitorId } from "../services/user.service.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/error.api.js";
import { ApiResponse } from "../utils/response.api.js";

export const getUser = catchAsync(async (req, res) => {
  const { visitor_id } = req.params;

  if (!visitor_id) {
    throw new ApiError(400, "Visitor ID is required");
  }

  const user = await getUserByVisitorId(visitor_id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json(new ApiResponse(200, user));
});
