// // import { Document } from "mongoose";

// // export interface IAssignment extends Document {
// //   topic: string;
// //   totalQuestions: number;

// //   difficulty: {
// //     easy: number;
// //     medium: number;
// //     hard: number;
// //   };

// //   concepts?: string[];

// //   blooms?: {
// //     remember: number;
// //     understand: number;
// //     apply: number;
// //     analyze: number;
// //   };

// //   ensurePassing?: boolean;
// //   includeHints?: boolean;

// //   status: "pending" | "processing" | "completed" | "failed";

// //   paper: {
// //     sections: any[];
// //   };

// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// import { Document } from "mongoose";

// export interface IAssignment extends Document {
//   topic: string;
//   totalQuestions: number;

//   difficulty: {
//     easy: number;
//     medium: number;
//     hard: number;
//   };

//   // 🔥 ADD THIS
//   marksPerQuestion?: {
//     easy: number;
//     medium: number;
//     hard: number;
//   };

//   // 🔥 ADD THIS
//   questionTypes?: string[];

//   // 🔥 ADD THIS
//   instructions?: string;

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