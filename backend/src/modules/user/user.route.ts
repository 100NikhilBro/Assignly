import express from "express";
import {
  getProfileController,
  updateProfileController,
} from "./user.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/profile", authMiddleware, getProfileController);

router.put("/profile", authMiddleware, updateProfileController);

export default router;