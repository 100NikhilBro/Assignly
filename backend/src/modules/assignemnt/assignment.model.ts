// import mongoose, { Schema } from "mongoose";

// const assignmentSchema = new Schema(
//   {
//     // ─────────────────────────────
//     // 👨‍🏫 TEACHER INPUT
//     // ─────────────────────────────
//     schoolName: { type: String, default: "School Name" },

//     class: { type: String, required: true },
//     subject: { type: String, required: true },
//     topic: { type: String, required: true },

//     totalMarks: { type: Number, required: true },
//     timeAllowed: { type: String, default: "45 minutes" },

//     dueDate: { type: Date },

//     instructions: {
//       type: String,
//       default: "Attempt all questions",
//     },

//     concepts: {
//       type: [String],
//       default: [],
//     },

//     // 🎯 LIGHT CONTROL (AI-FRIENDLY)
//     difficultyLevel: {
//       type: String,
//       enum: ["easy", "balanced", "tough"],
//       default: "balanced",
//     },

//     questionTypes: {
//       type: [String],
//       default: ["short", "long"],
//     },

//     includeHints: { type: Boolean, default: false },
//     includeAnswers: { type: Boolean, default: false },

//     ensurePassing: { type: Boolean, default: true },

//     // ─────────────────────────────
//     // 🔄 STATUS
//     // ─────────────────────────────
//     status: {
//       type: String,
//       enum: ["pending", "processing", "completed", "failed"],
//       default: "pending",
//     },

//     errorMessage: { type: String, default: null },

//     // ─────────────────────────────
//     // 🤖 AI OUTPUT
//     // ─────────────────────────────
//     paper: {
//       studentInfo: {
//         name: { type: String, default: "" },
//         rollNumber: { type: String, default: "" },
//         section: { type: String, default: "" },
//         class: { type: String, default: "" },
//         subject: { type: String, default: "" },
//         date: { type: String, default: "" },
//       },

//       instructions: {
//         type: String,
//         default: "",
//       },

//       sections: [
//         {
//           title: String,       // Section A
//           subTitle: String,    // Short Answer
//           instruction: String, // Attempt all / any

//           questions: [
//             {
//               number: Number,
//               text: String,
//               type: String,        // short / long / mcq
//               difficulty: String,  // optional
//               marks: Number,
//               hint: String,        // optional
//             },
//           ],
//         },
//       ],

//       answerKey: [
//         {
//           questionNumber: Number,
//           answer: String,
//         },
//       ],
//     },
//   },
//   { timestamps: true }
// );

// export const Assignment = mongoose.model("Assignment", assignmentSchema);



import mongoose, { Schema } from "mongoose";
import { IAssignment } from "../../types/assignment.types";

const assignmentSchema = new Schema<IAssignment>(
  {
    schoolName: { type: String, default: "School Name" },

    class: { type: String, required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },

    totalMarks: { type: Number, required: true },
    timeAllowed: { type: String, default: "45 minutes" },

    dueDate: { type: Date },

    instructions: {
      type: String,
      default: "Attempt all questions",
    },

    concepts: {
      type: [String],
      default: [],
    },

    difficultyLevel: {
      type: String,
      enum: ["easy", "balanced", "tough"],
      default: "balanced",
    },

    questionTypes: {
      type: [String],
      default: ["short", "long"],
    },

    includeHints: { type: Boolean, default: false },
    includeAnswers: { type: Boolean, default: false },
    ensurePassing: { type: Boolean, default: true },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    errorMessage: { type: String, default: null },

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

      sections: [
        {
          title: { type: String, required: true },
          subTitle: { type: String, default: "" },
          instruction: { type: String, required: true },

          questions: [
            {
              number: { type: Number, required: true },
              text: { type: String, required: true },
              type: { type: String, required: true },
              difficulty: { type: String },
              marks: { type: Number, required: true },
              hint: { type: String },
            },
          ],
        },
      ],

      answerKey: [
        {
          questionNumber: { type: Number, required: true },
          answer: { type: String, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);

// 🔥 THIS IS IMPORTANT
export const Assignment = mongoose.model<IAssignment>(
  "Assignment",
  assignmentSchema
);