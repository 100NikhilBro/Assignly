
import { z } from "zod";

export const createAssignmentSchema = z.object({
  topic: z.string().min(3),

  totalQuestions: z.number().min(1),

  difficulty: z.object({
    easy: z.number().min(0),
    medium: z.number().min(0),
    hard: z.number().min(0),
  }),


  marksPerQuestion: z
    .object({
      easy: z.number().min(1),
      medium: z.number().min(1),
      hard: z.number().min(1),
    })
    .optional(),


  questionTypes: z.array(z.string()).optional(),


  instructions: z.string().optional(),

  concepts: z.array(z.string()).optional(),

  blooms: z
    .object({
      remember: z.number().min(0),
      understand: z.number().min(0),
      apply: z.number().min(0),
      analyze: z.number().min(0),
    })
    .optional(),

  ensurePassing: z.boolean().optional(),

  includeHints: z.boolean().optional(),
});