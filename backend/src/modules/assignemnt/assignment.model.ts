import mongoose, { Schema } from "mongoose";
import { IAssignment } from "../../types/assignment.types";

const assignmentSchema = new Schema<IAssignment>(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },

    difficulty: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
    },

    marksPerQuestion: {
      easy: { type: Number, default: 2 },
      medium: { type: Number, default: 5 },
      hard: { type: Number, default: 8 },
    },

    questionTypes: {
      type: [String],
      default: [],
    },

    instructions: {
      type: String,
      default: "Attempt all questions",
    },

    concepts: {
      type: [String],
      default: [],
    },

    blooms: {
      remember: { type: Number, default: 0 },
      understand: { type: Number, default: 0 },
      apply: { type: Number, default: 0 },
      analyze: { type: Number, default: 0 },
    },

    ensurePassing: {
      type: Boolean,
      default: false,
    },

    includeHints: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    paper: {
      studentInfo: {
        name: { type: String, default: "" },
        rollNumber: { type: String, default: "" },
        section: { type: String, default: "" },
        class: { type: String, default: "" },
        subject: { type: String, default: "" },
        date: { type: String, default: "" },
      },

      instructions: {
        type: String,
        default: "",
      },

      sections: {
        type: [Schema.Types.Mixed],
        default: [],
      },
    },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>(
  "Assignment",
  assignmentSchema
);