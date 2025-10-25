import express from "express";
import { getCreatorController, getCreatorWithOverlayController, getCreatorWithLinkTreeController } from "../controllers/creator.controller.js";

const router = express.Router();

router.get("/:username", getCreatorController);
router.get("/:username/overlay", getCreatorWithOverlayController);
router.get("/:username/linktree", getCreatorWithLinkTreeController);

export default router;