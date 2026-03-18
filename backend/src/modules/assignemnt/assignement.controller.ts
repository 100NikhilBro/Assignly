import { Request, Response } from "express";
import mongoose from "mongoose";
import * as assignmentService from "./assignement.service";
import { cleanText } from "../../utils/sanitize";

export const createAssignmentController = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data.topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const sanitizedData = {
      ...data,
      topic: cleanText(data.topic),
      concepts: Array.isArray(data.concepts)
        ? data.concepts.map((c: string) => cleanText(c))
        : [],
    };

    const assignment = await assignmentService.createAssignment(sanitizedData);

    return res.status(201).json({
      success: true,
      data: assignment,
    });

  } catch (error) {
    console.error("Create Assignment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const getAssignmentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID",
      });
    }

    const assignment = await assignmentService.getAssignmentById(id as string);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: assignment,
    });

  } catch (error) {
    console.error("Get Assignment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};