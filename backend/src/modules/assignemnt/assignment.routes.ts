import express from "express";
import {
  createAssignmentController,
  getAssignmentController,
} from "./assignement.controller";

import { validate } from "../../middleware/validate.middleware";
import { createAssignmentSchema } from "../../schema/assignment.schema";

const router = express.Router();

router.post("/", validate(createAssignmentSchema), createAssignmentController);

router.get("/:id", getAssignmentController);

export default router;