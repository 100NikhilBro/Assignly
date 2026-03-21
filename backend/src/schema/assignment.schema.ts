
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