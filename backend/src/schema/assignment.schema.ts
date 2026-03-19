
// import { z } from "zod";

// export const createAssignmentSchema = z.object({
//   topic: z.string().min(3),

//   totalQuestions: z.number().min(1),

//   difficulty: z.object({
//     easy: z.number().min(0),
//     medium: z.number().min(0),
//     hard: z.number().min(0),
//   }),


//   marksPerQuestion: z
//     .object({
//       easy: z.number().min(1),
//       medium: z.number().min(1),
//       hard: z.number().min(1),
//     })
//     .optional(),


//   questionTypes: z.array(z.string()).optional(),


//   instructions: z.string().optional(),

//   concepts: z.array(z.string()).optional(),

//   blooms: z
//     .object({
//       remember: z.number().min(0),
//       understand: z.number().min(0),
//       apply: z.number().min(0),
//       analyze: z.number().min(0),
//     })
//     .optional(),

//   ensurePassing: z.boolean().optional(),

//   includeHints: z.boolean().optional(),
// });


import { z } from "zod";

export const createAssignmentSchema = z.object({
  // 👨‍🏫 BASIC DETAILS
  schoolName: z.string().optional(),

  class: z.string().min(1, "Class is required"),
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(3, "Topic must be at least 3 characters"),

  totalMarks: z.number().min(1, "Total marks must be at least 1"),

  timeAllowed: z.string().optional(),
  dueDate: z.string().datetime().optional(),

  // 📝 INSTRUCTIONS + CONCEPTS
  instructions: z.string().optional(),
  concepts: z.array(z.string()).optional(),

  // 🎯 AI CONTROL (SIMPLE)
  difficultyLevel: z
    .enum(["easy", "balanced", "tough"])
    .optional(),

  questionTypes: z.array(z.string()).optional(),

  includeHints: z.boolean().optional(),
  includeAnswers: z.boolean().optional(),
  ensurePassing: z.boolean().optional(),
});