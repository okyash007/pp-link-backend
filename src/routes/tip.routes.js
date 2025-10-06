import express from "express";
import { getTips } from "../controllers/tip.controllers.js";

const router = express.Router();

router.get("/:creator_id", getTips);

export default router;
