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