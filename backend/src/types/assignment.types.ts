import { Document, Types } from "mongoose";

export interface IAssignment extends Document {
  // 👨‍🏫 INPUT
  schoolName?: string;

  class: string;
  subject: string;
  topic: string;

  totalMarks: number;
  timeAllowed?: string;
  dueDate?: Date;

  instructions?: string;
  concepts?: string[];

  difficultyLevel?: "easy" | "balanced" | "tough";

  questionTypes?: string[];

  includeHints?: boolean;
  includeAnswers?: boolean;
  ensurePassing?: boolean;

  // 🔄 STATUS
  status: "pending" | "processing" | "completed" | "failed";
  errorMessage?: string;

  // ✅ ADD THESE - For tracking users
  userId?: Types.ObjectId | null;
  guestSessionId?: string | null;

  // 🤖 OUTPUT
  paper: {
    studentInfo: {
      name: string;
      rollNumber: string;
      section: string;
      class: string;
      subject: string;
      date: string;
    };

    instructions: string;

    sections: {
      title: string;
      subTitle: string;
      instruction: string;

      questions: {
        number: number;
        text: string;
        type: string;
        difficulty?: string;
        marks: number;
        hint?: string;
      }[];
    }[];

    answerKey?: {
      questionNumber: number;
      answer: string;
    }[];
  };

  createdAt: Date;
  updatedAt: Date;
}