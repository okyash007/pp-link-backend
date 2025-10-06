import express from "express";
import { createEventGet, createEventPost } from "../controllers/event.controllers.js";

const router = express.Router();

router.get("/", createEventGet);
router.post("/", createEventPost);

export default router;
