// import { Worker, Job } from "bullmq";
// import { env } from "../config/env";
// import { Assignment } from "../modules/assignemnt/assignment.model";
// import { generateWithAI } from "../services/ai/aiOrchestrator.service";
// import { parseAIResponse } from "../utils/aiParser";
// import { validateAIOutput } from "../utils/aiValidator";
// import { buildPrompt } from "../services/ai/promptBuilder";
// import { emitAssignmentUpdate } from "../socket/socket.emitter";

// /* ---------------- CONFIG ENGINE ---------------- */

// const generateDynamicConfig = (totalMarks: number) => {
//   console.log("⚙️ Generating RATIO config for:", totalMarks);

//   const marks = { easy: 2, medium: 5, hard: 10 };

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

//         const total = e * 2 + m * 5 + h * 10;
//         const diff = Math.abs(total - totalMarks);

//         if (diff < bestDiff) {
//           bestDiff = diff;
//           best = { easy: e, medium: m, hard: h };
//         }
//       }
//     }
//   }

//   console.log("✅ Distribution:", best);

//   return {
//     distribution: best,
//     marks,
//     tolerance: 2, // 🔥 industry tolerance
//   };
// };

// const resolveConfig = (assignment: any) => {
//   if (assignment.difficulty && assignment.marksPerQuestion) {
//     console.log("⚡ Using CUSTOM config");
//     return {
//       distribution: assignment.difficulty,
//       marks: assignment.marksPerQuestion,
//       tolerance: 2,
//     };
//   }

//   return generateDynamicConfig(assignment.totalMarks);
// };

// /* ---------------- NORMALIZER ---------------- */

// const normalizePaper = (paper: any, config: any, assignment: any) => {
//   console.log("🔄 Normalizing AI response...");

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
//             hint:
//               difficulty === "hard"
//                 ? q?.hint || `Think about ${assignment.topic} in real world`
//                 : undefined,
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
//         instruction:
//           idx === 0 ? "Attempt all questions" : "Attempt any questions",
//         questions,
//       };
//     }),
//   };
// };

// /* ---------------- MARKS CHECK ---------------- */

// const calculateTotalMarks = (paper: any) => {
//   return paper.sections.reduce(
//     (sum: number, sec: any) =>
//       sum +
//       sec.questions.reduce((s: number, q: any) => s + q.marks, 0),
//     0
//   );
// };

// /* ---------------- AI FLOW (WITH RETRY + TOLERANCE) ---------------- */

// const generateValidAIResponse = async (assignment: any) => {
//   const config = resolveConfig(assignment);

//   let attempts = 0;
//   const MAX_RETRIES = 3;

//   while (attempts < MAX_RETRIES) {
//     try {
//       console.log(`🧠 AI Attempt ${attempts + 1}`);

//       const prompt = buildPrompt(assignment, config);
//       const raw = await generateWithAI(prompt);

//       console.log("🧾 RAW:", raw?.slice(0, 150));

//       const parsed = parseAIResponse(raw);
//       const normalized = normalizePaper(parsed, config, assignment);

//       if (!validateAIOutput(normalized)) {
//         throw new Error("Validation failed");
//       }

//       const total = calculateTotalMarks(normalized);
//       const diff = Math.abs(total - assignment.totalMarks);

//       console.log("📊 Marks:", total, "| Expected:", assignment.totalMarks);

//       // ✅ tolerance check
//       if (diff <= config.tolerance) {
//         console.log("✅ ACCEPTED WITHIN TOLERANCE");
//         return normalized;
//       }

//       console.log("⚠️ Marks mismatch, retrying...");
//       attempts++;
//     } catch (err: any) {
//       console.log("❌ AI attempt failed:", err.message);
//       attempts++;
//     }
//   }

//   console.log("🛟 All retries failed → fallback");
//   return generateFallbackPaper(assignment, config);
// };

// /* ---------------- FALLBACK ---------------- */

// const generateFallbackPaper = (assignment: any, config: any) => {
//   console.log("🛟 Generating fallback paper...");

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

// /* ---------------- WORKER ---------------- */

// export const assignmentWorker = new Worker(
//   "assignmentQueue",
//   async (job: Job) => {
//     const { assignmentId } = job.data;

//     if (!assignmentId) return;

//     const start = Date.now();

//     try {
//       console.log("🚀 JOB START:", assignmentId);

//       const assignment = await Assignment.findById(assignmentId);
//       if (!assignment) throw new Error("Assignment not found");

//       await Assignment.findByIdAndUpdate(assignmentId, {
//         status: "processing",
//       });

//       emitAssignmentUpdate(assignmentId, { status: "processing" });

//       const paper = await generateValidAIResponse(assignment);

//       await Assignment.findByIdAndUpdate(assignmentId, {
//         status: "completed",
//         paper,
//         processingTime: Date.now() - start,
//       });

//       emitAssignmentUpdate(assignmentId, {
//         status: "completed",
//         data: paper,
//       });

//       console.log("🎉 DONE in", Date.now() - start, "ms");
//     } catch (err: any) {
//       console.error("💥 ERROR:", err.message);

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
//     connection: { url: env.REDIS_URL },
//     concurrency: 5,
//   }
// );

// console.log("🔥 FINAL INDUSTRY WORKER RUNNING...");




























// import { Worker, Job } from "bullmq";
// import { env } from "../config/env";
// import { Assignment } from "../modules/assignemnt/assignment.model";
// import { generateWithAI } from "../services/ai/aiOrchestrator.service";
// import { parseAIResponse } from "../utils/aiParser";
// import { validateAIOutput } from "../utils/aiValidator";
// import { buildPrompt } from "../services/ai/promptBuilder";
// import { emitAssignmentUpdate } from "../socket/socket.emitter";

// /* ---------------- CONFIG ENGINE ---------------- */

// const generateDynamicConfig = (totalMarks: number) => {
//   console.log("⚙️ Generating RATIO config for:", totalMarks);

//   const marks = { easy: 2, medium: 5, hard: 10 };

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

//         const total = e * 2 + m * 5 + h * 10;
//         const diff = Math.abs(total - totalMarks);

//         if (diff < bestDiff) {
//           bestDiff = diff;
//           best = { easy: e, medium: m, hard: h };
//         }
//       }
//     }
//   }

//   console.log("✅ Distribution:", best);

//   return {
//     distribution: best,
//     marks,
//     tolerance: 2,
//   };
// };

// const resolveConfig = (assignment: any) => {
//   if (assignment.difficulty && assignment.marksPerQuestion) {
//     console.log("⚡ Using CUSTOM config");
//     return {
//       distribution: assignment.difficulty,
//       marks: assignment.marksPerQuestion,
//       tolerance: 2,
//     };
//   }

//   return generateDynamicConfig(assignment.totalMarks);
// };

// /* ---------------- NORMALIZER ---------------- */

// const normalizePaper = (paper: any, config: any, assignment: any) => {
//   console.log("🔄 Normalizing AI response...");

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
//             hint:
//               difficulty === "hard"
//                 ? q?.hint || `Think about ${assignment.topic} in real world`
//                 : undefined,
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
//         instruction:
//           idx === 0 ? "Attempt all questions" : "Attempt any questions",
//         questions,
//       };
//     }),
//   };
// };

// /* ---------------- MARKS CHECK ---------------- */

// const calculateTotalMarks = (paper: any) => {
//   return paper.sections.reduce(
//     (sum: number, sec: any) =>
//       sum +
//       sec.questions.reduce((s: number, q: any) => s + q.marks, 0),
//     0
//   );
// };

// /* ---------------- AI FLOW ---------------- */

// const generateValidAIResponse = async (
//   assignment: any,
//   assignmentId: string // 🔥 ADD ONLY THIS
// ) => {
//   const config = resolveConfig(assignment);

//   let attempts = 0;
//   const MAX_RETRIES = 3;

//   while (attempts < MAX_RETRIES) {
//     try {
//       console.log(`🧠 AI Attempt ${attempts + 1}`);

//       // 🔥 EMIT ATTEMPT
//       emitAssignmentUpdate(assignmentId, {
//         status: "ai_attempt",
//         attempt: attempts + 1,
//       });

//       const prompt = buildPrompt(assignment, config);

//       const raw = await generateWithAI(prompt, (payload) => {
//         emitAssignmentUpdate(assignmentId, payload);
//       });

//       console.log("🧾 RAW:", raw?.slice(0, 150));

//       const parsed = parseAIResponse(raw);
//       const normalized = normalizePaper(parsed, config, assignment);

//       if (!validateAIOutput(normalized)) {
//         throw new Error("Validation failed");
//       }

//       const total = calculateTotalMarks(normalized);
//       const diff = Math.abs(total - assignment.totalMarks);

//       console.log("📊 Marks:", total, "| Expected:", assignment.totalMarks);

//       if (diff <= config.tolerance) {
//         console.log("✅ ACCEPTED WITHIN TOLERANCE");

//         emitAssignmentUpdate(assignmentId, {
//           status: "ai_success",
//           marks: total,
//         });

//         return normalized;
//       }

//       emitAssignmentUpdate(assignmentId, {
//         status: "retrying",
//         reason: "marks_mismatch",
//       });

//       attempts++;
//     } catch (err: any) {
//       console.log("❌ AI attempt failed:", err.message);

//       emitAssignmentUpdate(assignmentId, {
//         status: "retrying",
//         reason: err.message,
//       });

//       attempts++;
//     }
//   }

//   console.log("🛟 All retries failed → fallback");

//   emitAssignmentUpdate(assignmentId, {
//     status: "fallback",
//     message: "Using fallback paper",
//   });

//   return generateFallbackPaper(assignment, config);
// };

// /* ---------------- FALLBACK ---------------- */

// const generateFallbackPaper = (assignment: any, config: any) => {
//   console.log("🛟 Generating fallback paper...");

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

// /* ---------------- WORKER ---------------- */

// export const assignmentWorker = new Worker(
//   "assignmentQueue",
//   async (job: Job) => {
//     const { assignmentId } = job.data;

//     if (!assignmentId) return;

//     const start = Date.now();

//     try {
//       console.log("🚀 JOB START:", assignmentId);

//       const assignment = await Assignment.findById(assignmentId);
//       if (!assignment) throw new Error("Assignment not found");

//       await Assignment.findByIdAndUpdate(assignmentId, {
//         status: "processing",
//       });

//       emitAssignmentUpdate(assignmentId, { status: "processing" });

//       const paper = await generateValidAIResponse(
//         assignment,
//         assignmentId // 🔥 ONLY CHANGE HERE
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

//       console.log("🎉 DONE in", Date.now() - start, "ms");
//     } catch (err: any) {
//       console.error("💥 ERROR:", err.message);

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
//     connection: { url: env.REDIS_URL },
//     concurrency: 5,
//   }
// );

// console.log("🔥 FINAL INDUSTRY WORKER RUNNING...");
































import { Worker, Job } from "bullmq";
import { env } from "../config/env";
import { Assignment } from "../modules/assignemnt/assignment.model";
import { generateWithAI } from "../services/ai/aiOrchestrator.service";
import { parseAIResponse } from "../utils/aiParser";
import { validateAIOutput } from "../utils/aiValidator";
import { buildPrompt } from "../services/ai/promptBuilder";
import { emitAssignmentUpdate } from "../socket/socket.emitter";

/* ---------------- CONFIG ENGINE ---------------- */

const generateDynamicConfig = (totalMarks: number) => {
  console.log("⚙️ Generating RATIO config for:", totalMarks);

  // 🔥 UPDATED MARKS
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

  console.log("✅ Distribution:", best);

  return {
    distribution: best,
    marks,
    tolerance: 2,
  };
};

const resolveConfig = (assignment: any) => {
  if (assignment.difficulty && assignment.marksPerQuestion) {
    console.log("⚡ Using CUSTOM config");
    return {
      distribution: assignment.difficulty,
      marks: assignment.marksPerQuestion,
      tolerance: 2,
    };
  }

  return generateDynamicConfig(assignment.totalMarks);
};

/* ---------------- NORMALIZER ---------------- */

const normalizePaper = (paper: any, config: any, assignment: any) => {
  console.log("🔄 Normalizing AI response...");

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
            marks: config.marks[difficulty], // 🔥 auto uses 2/3/5
            type: assignment.questionTypes?.[0] || "theory",
            hint:
              difficulty === "hard"
                ? q?.hint || `Think about ${assignment.topic} in real world`
                : undefined,
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
        instruction:
          idx === 0 ? "Attempt all questions" : "Attempt any questions",
        questions,
      };
    }),
  };
};

/* ---------------- MARKS CHECK ---------------- */

const calculateTotalMarks = (paper: any) => {
  return paper.sections.reduce(
    (sum: number, sec: any) =>
      sum +
      sec.questions.reduce((s: number, q: any) => s + q.marks, 0),
    0
  );
};

/* ---------------- AI FLOW ---------------- */

const generateValidAIResponse = async (
  assignment: any,
  assignmentId: string
) => {
  const config = resolveConfig(assignment);

  let attempts = 0;
  const MAX_RETRIES = 3;

  while (attempts < MAX_RETRIES) {
    try {
      console.log(`🧠 AI Attempt ${attempts + 1}`);

      emitAssignmentUpdate(assignmentId, {
        status: "ai_attempt",
        attempt: attempts + 1,
      });

      const prompt = buildPrompt(assignment, config);

      const raw = await generateWithAI(prompt, (payload: any) => {
        emitAssignmentUpdate(assignmentId, payload);
      });

      console.log("🧾 RAW:", raw?.slice(0, 150));

      const parsed = parseAIResponse(raw);
      const normalized = normalizePaper(parsed, config, assignment);

      if (!validateAIOutput(normalized)) {
        throw new Error("Validation failed");
      }

      const total = calculateTotalMarks(normalized);
      const diff = Math.abs(total - assignment.totalMarks);

      console.log("📊 Marks:", total, "| Expected:", assignment.totalMarks);

      if (diff <= config.tolerance) {
        console.log("✅ ACCEPTED WITHIN TOLERANCE");

        emitAssignmentUpdate(assignmentId, {
          status: "ai_success",
          marks: total,
        });

        return normalized;
      }

      emitAssignmentUpdate(assignmentId, {
        status: "retrying",
        reason: "marks_mismatch",
      });

      attempts++;
    } catch (err: any) {
      console.log("❌ AI attempt failed:", err.message);

      emitAssignmentUpdate(assignmentId, {
        status: "retrying",
        reason: err.message,
      });

      attempts++;
    }
  }

  console.log("🛟 All retries failed → fallback");

  emitAssignmentUpdate(assignmentId, {
    status: "fallback",
    message: "Using fallback paper",
  });

  return generateFallbackPaper(assignment, config);
};

/* ---------------- FALLBACK ---------------- */

const generateFallbackPaper = (assignment: any, config: any) => {
  console.log("🛟 Generating fallback paper...");

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
      instruction:
        idx === 0 ? "Attempt all questions" : "Attempt any questions",
      questions: Array.from(
        { length: config.distribution[d] },
        (_, i) => ({
          number: i + 1,
          text: `Explain ${assignment.topic} with example.`,
          difficulty: d,
          marks: config.marks[d],
          type: "theory",
        })
      ),
    })),
  };
};

/* ---------------- WORKER ---------------- */

export const assignmentWorker = new Worker(
  "assignmentQueue",
  async (job: Job) => {
    const { assignmentId } = job.data;

    if (!assignmentId) return;

    const start = Date.now();

    try {
      console.log("🚀 JOB START:", assignmentId);

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) throw new Error("Assignment not found");

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

      emitAssignmentUpdate(assignmentId, {
        status: "completed",
        data: paper,
      });

      console.log("🎉 DONE in", Date.now() - start, "ms");
    } catch (err: any) {
      console.error("💥 ERROR:", err.message);

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
    connection: { url: env.REDIS_URL },
    concurrency: 5,
  }
);

console.log("🔥 FINAL INDUSTRY WORKER RUNNING...");