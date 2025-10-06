import express from "express";
import userRoutes from "./user.routes.js";
import eventRoutes from "./event.routes.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/event", eventRoutes);

export default router;
