import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import assignmentRoutes from "../modules/assignemnt/assignment.routes";
import userRoutes from "../modules/user/user.route";
import authRoutes from "../modules/auth/auth.route";
import { getGuestCreditsController } from "../modules/assignemnt/assignement.controller";

const router = express.Router();

// Public routes
router.use("/auth", authRoutes);
router.get("/guest/credits", getGuestCreditsController);

// rotected routes - add authMiddleware
router.use("/assignment", authMiddleware, assignmentRoutes);
router.use("/user", authMiddleware, userRoutes);

export default router;
