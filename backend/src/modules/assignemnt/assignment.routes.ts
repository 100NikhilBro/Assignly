import express from "express";
import {
  createAssignmentController,
  getAssignmentController,
  regenerateAssignmentController 
} from "./assignement.controller";

import { validate } from "../../middleware/validate.middleware";
import { createAssignmentSchema } from "../../schema/assignment.schema";
import {authMiddleware} from "../../middleware/auth.middleware";

const router = express.Router();


router.post("/", validate(createAssignmentSchema), createAssignmentController);

router.post("/:id/regenerate",authMiddleware,regenerateAssignmentController);

router.get("/:id", getAssignmentController);



export default router;
