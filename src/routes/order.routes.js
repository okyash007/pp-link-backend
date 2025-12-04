import express from "express";
import { createRazorpayOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create", createRazorpayOrder);

export default router;

