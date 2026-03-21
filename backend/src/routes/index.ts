import express from "express";
import assignmentRoutes from "../modules/assignemnt/assignment.routes";

const router = express.Router();

router.use("/assignment", assignmentRoutes);


import userRoutes from "../modules/user/user.route";

router.use("/user", userRoutes);


import authRoutes from "../modules/auth/auth.route";

router.use("/auth", authRoutes);


import { getGuestCreditsController } from "../modules/assignemnt/assignement.controller";

router.get("/guest/credits", getGuestCreditsController);

export default router;