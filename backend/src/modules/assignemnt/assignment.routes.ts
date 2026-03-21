import express from "express";
import {
  createAssignmentController,
  getAssignmentController,
} from "./assignement.controller";

import { validate } from "../../middleware/validate.middleware";
import { createAssignmentSchema } from "../../schema/assignment.schema";

const router = express.Router();

// ✅ POST route - auth middleware already applied in index.ts
router.post("/", validate(createAssignmentSchema), createAssignmentController);

// ✅ GET route - no auth needed (public)
router.get("/:id", getAssignmentController);

export default router;