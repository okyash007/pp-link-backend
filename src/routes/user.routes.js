import express from "express";
import { getUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:visitor_id", getUser);

export default router;
