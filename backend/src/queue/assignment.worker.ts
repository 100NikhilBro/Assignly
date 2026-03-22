

// import { Worker, Job } from "bullmq";
// import { Assignment } from "../modules/assignemnt/assignment.model";
// import { generateWithAI } from "../services/ai/aiOrchestrator.service";
// import { parseAIResponse } from "../utils/aiParser";
// import { validateAIOutput } from "../utils/aiValidator";
// import { buildPrompt } from "../services/ai/promptBuilder";
// import { emitAssignmentUpdate } from "../socket/socket.emitter";



// const connection = {
//   host: "ruling-griffon-79931.upstash.io",
//   port: 6379,
//   username: "default",
//   password: process.env.REDIS_PASSWORD,
//   tls: {}
// };


//     // Add Console - for debugging

// console.log("Worker connecting to Redis...");
// console.log("Redis Password exists:", !!process.env.REDIS_PASSWORD);


// const generateDynamicConfig = (totalMarks: number) => {
//   const marks = { easy: 2, medium: 3, hard: 5 };
//   const weights = { easy: 1, medium: 2.5, hard: 1.5 };
//   const totalWeight = 5;

//   const targetMarks = {
//     easy: (weights.easy / totalWeight) * totalMarks,
//     medium: (weights.medium / totalWeight) * totalMarks,
//     hard: (weights.hard / totalWeight) * totalMarks,
//   };

//   let base = {
//     easy: Math.max(2, Math.floor(targetMarks.easy / marks.easy)),
//     medium: Math.max(2, Math.floor(targetMarks.medium / marks.medium)),
//     hard: Math.max(2, Math.floor(targetMarks.hard / marks.hard)),
//   };

//   let best = base;
//   let bestDiff = Infinity;

//   for (let de = -2; de <= 2; de++) {
//     for (let dm = -2; dm <= 2; dm++) {
//       for (let dh = -2; dh <= 2; dh++) {
//         const e = Math.max(2, base.easy + de);
//         const m = Math.max(2, base.medium + dm);
//         const h = Math.max(2, base.hard + dh);

//         const total = e * marks.easy + m * marks.medium + h * marks.hard;
//         const diff = Math.abs(total - totalMarks);

//         if (diff < bestDiff) {
//           bestDiff = diff;
//           best = { easy: e, medium: m, hard: h };
//         }
//       }
//     }
//   }

//   return { distribution: best, marks, tolerance: 2 };
// };

// const resolveConfig = (assignment: any) => {
//   return generateDynamicConfig(assignment.totalMarks);
// };



// const normalizePaper = (paper: any, config: any, assignment: any) => {
//   const difficulties = ["easy", "medium", "hard"];
//   const seen = new Set<string>();

//   return {
//     studentInfo: {
//       name: "",
//       rollNumber: "",
//       section: "",
//       class: assignment.class,
//       subject: assignment.subject,
//       date: "",
//     },
//     instructions: assignment.instructions,

//     sections: difficulties.map((difficulty, idx) => {
//       const target = config.distribution[difficulty];

//       let questions =
//         paper?.sections?.[idx]?.questions?.map((q: any) => {
//           let text =
//             typeof q === "string"
//               ? q.trim()
//               : q?.text?.trim() || q?.question?.trim();

//           if (!text || text.length < 20) return null;

//           const key = text.toLowerCase();

//           if (seen.has(key)) {
//             text += " (Explain with different example)";
//           }

//           seen.add(key);

//           return {
//             text,
//             difficulty,
//             marks: config.marks[difficulty],
//             type: assignment.questionTypes?.[0] || "theory",
//           };
//         }) || [];

//       questions = questions.filter(Boolean);

//       while (questions.length < target) {
//         questions.push({
//           text: `Explain ${assignment.topic} with example.`,
//           difficulty,
//           marks: config.marks[difficulty],
//           type: "theory",
//         });
//       }

//       questions = questions.slice(0, target);

//       questions.forEach((q: any, i: number) => (q.number = i + 1));

//       return {
//         title: `Section ${String.fromCharCode(65 + idx)}`,
//         subTitle: "",
//         instruction:
//           idx === 0 ? "Attempt all questions" : "Attempt any questions",
//         questions,
//       };
//     }),
//   };
// };



// const calculateTotalMarks = (paper: any) => {
//   return paper.sections.reduce(
//     (sum: number, sec: any) =>
//       sum + sec.questions.reduce((s: number, q: any) => s + q.marks, 0),
//     0
//   );
// };



// export const generateValidAIResponse = async (
//   assignment: any,
//   assignmentId: string
// ) => {
//   const config = resolveConfig(assignment);
//   let attempts = 0;

//   while (attempts < 3) {
//     try {
//       console.log(`AI Attempt ${attempts + 1}`);

//       emitAssignmentUpdate(assignmentId, {
//         status: "ai_attempt",
//         attempt: attempts + 1,
//       });

//       const prompt = buildPrompt(assignment, config);
//       const raw = await generateWithAI(prompt);

//       const parsed = parseAIResponse(raw);
//       const normalized = normalizePaper(parsed, config, assignment);

//       if (!validateAIOutput(normalized)) throw new Error("Validation failed");

//       const total = calculateTotalMarks(normalized);
//       const diff = Math.abs(total - assignment.totalMarks);

//       console.log("Marks:", total);

//       if (diff <= config.tolerance) {
//         emitAssignmentUpdate(assignmentId, {
//           status: "ai_success",
//           marks: total,
//         });
//         return normalized;
//       }

//       attempts++;
//     } catch (err: any) {
//       console.error("AI attempt failed:", err.message);
//       attempts++;
//     }
//   }

//   console.log("Fallback triggered");
//   return generateFallbackPaper(assignment, config);
// };


// const generateFallbackPaper = (assignment: any, config: any) => {
//   return {
//     studentInfo: {
//       name: "",
//       rollNumber: "",
//       section: "",
//       class: assignment.class,
//       subject: assignment.subject,
//       date: "",
//     },
//     instructions: assignment.instructions,
//     sections: ["easy", "medium", "hard"].map((d, idx) => ({
//       title: `Section ${String.fromCharCode(65 + idx)}`,
//       subTitle: "",
//       instruction:
//         idx === 0 ? "Attempt all questions" : "Attempt any questions",
//       questions: Array.from(
//         { length: config.distribution[d] },
//         (_, i) => ({
//           number: i + 1,
//           text: `Explain ${assignment.topic} with example.`,
//           difficulty: d,
//           marks: config.marks[d],
//           type: "theory",
//         })
//       ),
//     })),
//   };
// };



// const assignmentWorker = new Worker(
//   "assignmentQueue",
//   async (job: Job) => {
//     console.log(" JOB START:", job.data);

//     const { assignmentId } = job.data;
//     if (!assignmentId) return;

//     const start = Date.now();

//     try {
//       const assignment = await Assignment.findById(assignmentId);
//       if (!assignment) throw new Error("Assignment not found");

//       await Assignment.findByIdAndUpdate(assignmentId, {
//         status: "processing",
//       });

//       emitAssignmentUpdate(assignmentId, { status: "processing" });

//       const paper = await generateValidAIResponse(
//         assignment,
//         assignmentId
//       );

//       await Assignment.findByIdAndUpdate(assignmentId, {
//         status: "completed",
//         paper,
//         processingTime: Date.now() - start,
//       });

//       emitAssignmentUpdate(assignmentId, {
//         status: "completed",
//         data: paper,
//       });

//       console.log(" JOB COMPLETED:", assignmentId);

//     } catch (err: any) {
//       console.error(" JOB ERROR:", err.message);

//       await Assignment.findByIdAndUpdate(assignmentId, {
//         status: "failed",
//         errorMessage: err.message,
//       });

//       emitAssignmentUpdate(assignmentId, {
//         status: "failed",
//         error: err.message,
//       });
//     }
//   },
//   {
//     connection,
//     concurrency: 5
//   }
// );



// assignmentWorker.on("ready", () => {
//   console.log("Worker connected to Redis");
// });

// assignmentWorker.on("error", (err) => {
//   console.error(" Worker error:", err);
// });

// assignmentWorker.on("completed", (job) => {
//   console.log(`Job ${job.id} completed`);
// });

// assignmentWorker.on("failed", (job, err) => {
//   console.error(` Job ${job?.id} failed:`, err);
// });

// console.log("Worker running");

// export { assignmentWorker };




import { Worker, Job } from "bullmq";
import { Assignment } from "../modules/assignemnt/assignment.model";
import { User } from "../modules/user/user.model";
import { handleGuestCredits } from "../utils/credits";

import { generateWithAI } from "../services/ai/aiOrchestrator.service";
import { parseAIResponse } from "../utils/aiParser";
import { validateAIOutput } from "../utils/aiValidator";
import { buildPrompt } from "../services/ai/promptBuilder";
import { emitAssignmentUpdate } from "../socket/socket.emitter";

const connection = {
  host: "ruling-griffon-79931.upstash.io",
  port: 6379,
  username: "default",
  password: process.env.REDIS_PASSWORD,
  tls: {},
};

console.log("Worker connecting to Redis...");
console.log("Redis Password exists:", !!process.env.REDIS_PASSWORD);

// =========================
// CONFIG LOGIC (UNCHANGED)
// =========================
const generateDynamicConfig = (totalMarks: number) => {
  const marks = { easy: 2, medium: 3, hard: 5 };
  const weights = { easy: 1, medium: 2.5, hard: 1.5 };
  const totalWeight = 5;

  const targetMarks = {
    easy: (weights.easy / totalWeight) * totalMarks,
    medium: (weights.medium / totalWeight) * totalMarks,
    hard: (weights.hard / totalWeight) * totalMarks,
  };

  let base = {
    easy: Math.max(2, Math.floor(targetMarks.easy / marks.easy)),
    medium: Math.max(2, Math.floor(targetMarks.medium / marks.medium)),
    hard: Math.max(2, Math.floor(targetMarks.hard / marks.hard)),
  };

  let best = base;
  let bestDiff = Infinity;

  for (let de = -2; de <= 2; de++) {
    for (let dm = -2; dm <= 2; dm++) {
      for (let dh = -2; dh <= 2; dh++) {
        const e = Math.max(2, base.easy + de);
        const m = Math.max(2, base.medium + dm);
        const h = Math.max(2, base.hard + dh);

        const total = e * marks.easy + m * marks.medium + h * marks.hard;
        const diff = Math.abs(total - totalMarks);

        if (diff < bestDiff) {
          bestDiff = diff;
          best = { easy: e, medium: m, hard: h };
        }
      }
    }
  }

  return { distribution: best, marks, tolerance: 2 };
};

const resolveConfig = (assignment: any) => {
  return generateDynamicConfig(assignment.totalMarks);
};

// =========================
// NORMALIZATION (UNCHANGED)
// =========================
const normalizePaper = (paper: any, config: any, assignment: any) => {
  const difficulties = ["easy", "medium", "hard"];
  const seen = new Set<string>();

  return {
    studentInfo: {
      name: "",
      rollNumber: "",
      section: "",
      class: assignment.class,
      subject: assignment.subject,
      date: "",
    },
    instructions: assignment.instructions,

    sections: difficulties.map((difficulty, idx) => {
      const target = config.distribution[difficulty];

      let questions =
        paper?.sections?.[idx]?.questions?.map((q: any) => {
          let text =
            typeof q === "string"
              ? q.trim()
              : q?.text?.trim() || q?.question?.trim();

          if (!text || text.length < 20) return null;

          const key = text.toLowerCase();

          if (seen.has(key)) {
            text += " (Explain with different example)";
          }

          seen.add(key);

          return {
            text,
            difficulty,
            marks: config.marks[difficulty],
            type: assignment.questionTypes?.[0] || "theory",
          };
        }) || [];

      questions = questions.filter(Boolean);

      while (questions.length < target) {
        questions.push({
          text: `Explain ${assignment.topic} with example.`,
          difficulty,
          marks: config.marks[difficulty],
          type: "theory",
        });
      }

      questions = questions.slice(0, target);

      questions.forEach((q: any, i: number) => (q.number = i + 1));

      return {
        title: `Section ${String.fromCharCode(65 + idx)}`,
        subTitle: "",
        instruction:
          idx === 0 ? "Attempt all questions" : "Attempt any questions",
        questions,
      };
    }),
  };
};

const calculateTotalMarks = (paper: any) => {
  return paper.sections.reduce(
    (sum: number, sec: any) =>
      sum + sec.questions.reduce((s: number, q: any) => s + q.marks, 0),
    0
  );
};

// =========================
// AI GENERATION
// =========================
export const generateValidAIResponse = async (
  assignment: any,
  assignmentId: string
) => {
  const config = resolveConfig(assignment);
  let attempts = 0;

  while (attempts < 3) {
    try {
      emitAssignmentUpdate(assignmentId, {
        status: "ai_attempt",
        attempt: attempts + 1,
      });

      const prompt = buildPrompt(assignment, config);
      const raw = await generateWithAI(prompt);

      const parsed = parseAIResponse(raw);
      const normalized = normalizePaper(parsed, config, assignment);

      if (!validateAIOutput(normalized)) throw new Error("Validation failed");

      const total = calculateTotalMarks(normalized);
      const diff = Math.abs(total - assignment.totalMarks);

      if (diff <= config.tolerance) {
        emitAssignmentUpdate(assignmentId, {
          status: "ai_success",
          marks: total,
        });
        return normalized;
      }

      attempts++;
    } catch {
      attempts++;
    }
  }

  return generateFallbackPaper(assignment, config);
};

const generateFallbackPaper = (assignment: any, config: any) => {
  return {
    studentInfo: {
      name: "",
      rollNumber: "",
      section: "",
      class: assignment.class,
      subject: assignment.subject,
      date: "",
    },
    instructions: assignment.instructions,
    sections: ["easy", "medium", "hard"].map((d, idx) => ({
      title: `Section ${String.fromCharCode(65 + idx)}`,
      subTitle: "",
      instruction:
        idx === 0 ? "Attempt all questions" : "Attempt any questions",
      questions: Array.from({ length: config.distribution[d] }, (_, i) => ({
        number: i + 1,
        text: `Explain ${assignment.topic} with example.`,
        difficulty: d,
        marks: config.marks[d],
        type: "theory",
      })),
    })),
  };
};

// =========================
// WORKER (FIXED)
// =========================
const assignmentWorker = new Worker(
  "assignmentQueue",
  async (job: Job) => {
    const { assignmentId } = job.data;
    if (!assignmentId) return;

    const start = Date.now();

    try {
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) throw new Error("Assignment not found");

      // 🛑 Prevent duplicate processing
      if (assignment.status !== "pending") return;

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "processing",
      });

      emitAssignmentUpdate(assignmentId, { status: "processing" });

      const paper = await generateValidAIResponse(
        assignment,
        assignmentId
      );

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "completed",
        paper,
        processingTime: Date.now() - start,
      });

      // =========================
      // 💥 CREDIT DEDUCTION (FINAL FIX)
      // =========================
      if (assignment.userId) {
        await User.findByIdAndUpdate(assignment.userId, {
          $inc: { credits: -1 },
        });
      } else if (assignment.guestSessionId) {
        await handleGuestCredits(assignment.guestSessionId);
      }

      emitAssignmentUpdate(assignmentId, {
        status: "completed",
        data: paper,
      });

    } catch (err: any) {
      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "failed",
        errorMessage: err.message,
      });

      emitAssignmentUpdate(assignmentId, {
        status: "failed",
        error: err.message,
      });
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

assignmentWorker.on("ready", () => {
  console.log("Worker connected to Redis");
});

assignmentWorker.on("error", (err) => {
  console.error("Worker error:", err);
});

console.log("Worker running");

export { assignmentWorker };
