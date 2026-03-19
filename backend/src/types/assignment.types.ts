// import { Document } from "mongoose";

// export interface IAssignment extends Document {
//   topic: string;
//   totalQuestions: number;

//   difficulty: {
//     easy: number;
//     medium: number;
//     hard: number;
//   };

//   concepts?: string[];

//   blooms?: {
//     remember: number;
//     understand: number;
//     apply: number;
//     analyze: number;
//   };

//   ensurePassing?: boolean;
//   includeHints?: boolean;

//   status: "pending" | "processing" | "completed" | "failed";

//   paper: {
//     sections: any[];
//   };

//   createdAt: Date;
//   updatedAt: Date;
// }

import { Document } from "mongoose";

export interface IAssignment extends Document {
  topic: string;
  totalQuestions: number;

  difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };

  // 🔥 ADD THIS
  marksPerQuestion?: {
    easy: number;
    medium: number;
    hard: number;
  };

  // 🔥 ADD THIS
  questionTypes?: string[];

  // 🔥 ADD THIS
  instructions?: string;

  concepts?: string[];

  blooms?: {
    remember: number;
    understand: number;
    apply: number;
    analyze: number;
  };

  ensurePassing?: boolean;
  includeHints?: boolean;

  status: "pending" | "processing" | "completed" | "failed";

  paper: {
    sections: any[];
  };

  createdAt: Date;
  updatedAt: Date;
}