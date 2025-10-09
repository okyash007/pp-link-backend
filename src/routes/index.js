import express from "express";
import eventRoutes from "./event.routes.js";
import webhookRoutes from "./webhook.routes.js";
import userRoutes from "./user.routes.js";
import tipRoutes from "./tip.routes.js";
import creatorRoutes from "./creator.routes.js";

const router = express.Router();

router.use("/event", eventRoutes);
router.use("/webhook", webhookRoutes);
router.use("/user", userRoutes);
router.use("/tip", tipRoutes);
router.use("/creator", creatorRoutes);

export default router;
