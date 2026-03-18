import express from "express";
import { googleAuthController } from "./auth.controller";

const router = express.Router();

// 🔐 Google login (mock)
router.post("/google", googleAuthController);

export default router;