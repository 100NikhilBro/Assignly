import express from "express";
import {
  getProfileController,
  updateProfileController,
  getUserAssignmentsController
} from "./user.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/profile", authMiddleware, getProfileController);

router.put("/profile", authMiddleware, updateProfileController);

router.get("/assignments", authMiddleware, getUserAssignmentsController);

export default router;