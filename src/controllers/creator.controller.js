import { getFullCreatorByUsername, getCreatorWithOverlayByUsername, getCreatorWithLinkTreeByUsername } from "../services/creator.service.js";
import ApiError from "../utils/error.api.js";
import { ApiResponse } from "../utils/response.api.js";

export const getCreatorController = async (req, res) => {
  const { username } = req.params;
  const creator = await getFullCreatorByUsername(username);
  if (!creator) {
    throw new ApiError(404, "Creator not found");
  }
  res.json(new ApiResponse(200, creator));
};

export const getCreatorWithOverlayController = async (req, res) => {
  const { username } = req.params;
  const creator = await getCreatorWithOverlayByUsername(username);
  if (!creator) {
    throw new ApiError(404, "Creator not found");
  }
  res.json(new ApiResponse(200, creator));
};

export const getCreatorWithLinkTreeController = async (req, res) => {
  const { username } = req.params;
  const creator = await getCreatorWithLinkTreeByUsername(username);
  if (!creator) {
    throw new ApiError(404, "Creator not found");
  }
  res.json(new ApiResponse(200, creator));
};