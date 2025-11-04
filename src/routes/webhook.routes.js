import express from "express";
import { razorpayWebhook, settlementWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/razorpay", razorpayWebhook);
router.post("/settlement", settlementWebhook);

export default router;
