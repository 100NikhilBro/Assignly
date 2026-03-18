import express from "express";
import assignmentRoutes from "../modules/assignemnt/assignment.routes";

const router = express.Router();

router.use("/assignment", assignmentRoutes);

export default router;