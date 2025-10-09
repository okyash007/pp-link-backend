import express from "express";
import { getCreatorController } from "../controllers/creator.controller.js";

const router = express.Router();

router.get("/:username", getCreatorController);

export default router;