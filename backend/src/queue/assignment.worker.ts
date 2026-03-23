

// // // // // import { Worker, Job } from "bullmq";
// // // // // import { Assignment } from "../modules/assignemnt/assignment.model";
// // // // // import { generateWithAI } from "../services/ai/aiOrchestrator.service";
// // // // // import { parseAIResponse } from "../utils/aiParser";
// // // // // import { validateAIOutput } from "../utils/aiValidator";
// // // // // import { buildPrompt } from "../services/ai/promptBuilder";
// // // // // import { emitAssignmentUpdate } from "../socket/socket.emitter";



// // // // // const connection = {
// // // // //   host: "ruling-griffon-79931.upstash.io",
// // // // //   port: 6379,
// // // // //   username: "default",
// // // // //   password: process.env.REDIS_PASSWORD,
// // // // //   tls: {}
// // // // // };


// // // // //     // Add Console - for debugging

// // // // // console.log("Worker connecting to Redis...");
// // // // // console.log("Redis Password exists:", !!process.env.REDIS_PASSWORD);


// // // // // const generateDynamicConfig = (totalMarks: number) => {
// // // // //   const marks = { easy: 2, medium: 3, hard: 5 };
// // // // //   const weights = { easy: 1, medium: 2.5, hard: 1.5 };
// // // // //   const totalWeight = 5;

// // // // //   const targetMarks = {
// // // // //     easy: (weights.easy / totalWeight) * totalMarks,
// // // // //     medium: (weights.medium / totalWeight) * totalMarks,
// // // // //     hard: (weights.hard / totalWeight) * totalMarks,
// // // // //   };

// // // // //   let base = {
// // // // //     easy: Math.max(2, Math.floor(targetMarks.easy / marks.easy)),
// // // // //     medium: Math.max(2, Math.floor(targetMarks.medium / marks.medium)),
// // // // //     hard: Math.max(2, Math.floor(targetMarks.hard / marks.hard)),
// // // // //   };

// // // // //   let best = base;
// // // // //   let bestDiff = Infinity;

// // // // //   for (let de = -2; de <= 2; de++) {
// // // // //     for (let dm = -2; dm <= 2; dm++) {
// // // // //       for (let dh = -2; dh <= 2; dh++) {
// // // // //         const e = Math.max(2, base.easy + de);
// // // // //         const m = Math.max(2, base.medium + dm);
// // // // //         const h = Math.max(2, base.hard + dh);

// // // // //         const total = e * marks.easy + m * marks.medium + h * marks.hard;
// // // // //         const diff = Math.abs(total - totalMarks);

// // // // //         if (diff < bestDiff) {
// // // // //           bestDiff = diff;
// // // // //           best = { easy: e, medium: m, hard: h };
// // // // //         }
// // // // //       }
// // // // //     }
// // // // //   }

// // // // //   return { distribution: best, marks, tolerance: 2 };
// // // // // };

// // // // // const resolveConfig = (assignment: any) => {
// // // // //   return generateDynamicConfig(assignment.totalMarks);
// // // // // };



// // // // // const normalizePaper = (paper: any, config: any, assignment: any) => {
// // // // //   const difficulties = ["easy", "medium", "hard"];
// // // // //   const seen = new Set<string>();

// // // // //   return {
// // // // //     studentInfo: {
// // // // //       name: "",
// // // // //       rollNumber: "",
// // // // //       section: "",
// // // // //       class: assignment.class,
// // // // //       subject: assignment.subject,
// // // // //       date: "",
// // // // //     },
// // // // //     instructions: assignment.instructions,

// // // // //     sections: difficulties.map((difficulty, idx) => {
// // // // //       const target = config.distribution[difficulty];

// // // // //       let questions =
// // // // //         paper?.sections?.[idx]?.questions?.map((q: any) => {
// // // // //           let text =
// // // // //             typeof q === "string"
// // // // //               ? q.trim()
// // // // //               : q?.text?.trim() || q?.question?.trim();

// // // // //           if (!text || text.length < 20) return null;

// // // // //           const key = text.toLowerCase();

// // // // //           if (seen.has(key)) {
// // // // //             text += " (Explain with different example)";
// // // // //           }

// // // // //           seen.add(key);

// // // // //           return {
// // // // //             text,
// // // // //             difficulty,
// // // // //             marks: config.marks[difficulty],
// // // // //             type: assignment.questionTypes?.[0] || "theory",
// // // // //           };
// // // // //         }) || [];

// // // // //       questions = questions.filter(Boolean);

// // // // //       while (questions.length < target) {
// // // // //         questions.push({
// // // // //           text: `Explain ${assignment.topic} with example.`,
// // // // //           difficulty,
// // // // //           marks: config.marks[difficulty],
// // // // //           type: "theory",
// // // // //         });
// // // // //       }

// // // // //       questions = questions.slice(0, target);

// // // // //       questions.forEach((q: any, i: number) => (q.number = i + 1));

// // // // //       return {
// // // // //         title: `Section ${String.fromCharCode(65 + idx)}`,
// // // // //         subTitle: "",
// // // // //         instruction:
// // // // //           idx === 0 ? "Attempt all questions" : "Attempt any questions",
// // // // //         questions,
// // // // //       };
// // // // //     }),
// // // // //   };
// // // // // };



// // // // // const calculateTotalMarks = (paper: any) => {
// // // // //   return paper.sections.reduce(
// // // // //     (sum: number, sec: any) =>
// // // // //       sum + sec.questions.reduce((s: number, q: any) => s + q.marks, 0),
// // // // //     0
// // // // //   );
// // // // // };



// // // // // export const generateValidAIResponse = async (
// // // // //   assignment: any,
// // // // //   assignmentId: string
// // // // // ) => {
// // // // //   const config = resolveConfig(assignment);
// // // // //   let attempts = 0;

// // // // //   while (attempts < 3) {
// // // // //     try {
// // // // //       console.log(`AI Attempt ${attempts + 1}`);

// // // // //       emitAssignmentUpdate(assignmentId, {
// // // // //         status: "ai_attempt",
// // // // //         attempt: attempts + 1,
// // // // //       });

// // // // //       const prompt = buildPrompt(assignment, config);
// // // // //       const raw = await generateWithAI(prompt);

// // // // //       const parsed = parseAIResponse(raw);
// // // // //       const normalized = normalizePaper(parsed, config, assignment);

// // // // //       if (!validateAIOutput(normalized)) throw new Error("Validation failed");

// // // // //       const total = calculateTotalMarks(normalized);
// // // // //       const diff = Math.abs(total - assignment.totalMarks);

// // // // //       console.log("Marks:", total);

// // // // //       if (diff <= config.tolerance) {
// // // // //         emitAssignmentUpdate(assignmentId, {
// // // // //           status: "ai_success",
// // // // //           marks: total,
// // // // //         });
// // // // //         return normalized;
// // // // //       }

// // // // //       attempts++;
// // // // //     } catch (err: any) {
// // // // //       console.error("AI attempt failed:", err.message);
// // // // //       attempts++;
// // // // //     }
// // // // //   }

// // // // //   console.log("Fallback triggered");
// // // // //   return generateFallbackPaper(assignment, config);
// // // // // };


// // // // // const generateFallbackPaper = (assignment: any, config: any) => {
// // // // //   return {
// // // // //     studentInfo: {
// // // // //       name: "",
// // // // //       rollNumber: "",
// // // // //       section: "",
// // // // //       class: assignment.class,
// // // // //       subject: assignment.subject,
// // // // //       date: "",
// // // // //     },
// // // // //     instructions: assignment.instructions,
// // // // //     sections: ["easy", "medium", "hard"].map((d, idx) => ({
// // // // //       title: `Section ${String.fromCharCode(65 + idx)}`,
// // // // //       subTitle: "",
// // // // //       instruction:
// // // // //         idx === 0 ? "Attempt all questions" : "Attempt any questions",
// // // // //       questions: Array.from(
// // // // //         { length: config.distribution[d] },
// // // // //         (_, i) => ({
// // // // //           number: i + 1,
// // // // //           text: `Explain ${assignment.topic} with example.`,
// // // // //           difficulty: d,
// // // // //           marks: config.marks[d],
// // // // //           type: "theory",
// // // // //         })
// // // // //       ),
// // // // //     })),
// // // // //   };
// // // // // };



// // // // // const assignmentWorker = new Worker(
// // // // //   "assignmentQueue",
// // // // //   async (job: Job) => {
// // // // //     console.log(" JOB START:", job.data);

// // // // //     const { assignmentId } = job.data;
// // // // //     if (!assignmentId) return;

// // // // //     const start = Date.now();

// // // // //     try {
// // // // //       const assignment = await Assignment.findById(assignmentId);
// // // // //       if (!assignment) throw new Error("Assignment not found");

// // // // //       await Assignment.findByIdAndUpdate(assignmentId, {
// // // // //         status: "processing",
// // // // //       });

// // // // //       emitAssignmentUpdate(assignmentId, { status: "processing" });

// // // // //       const paper = await generateValidAIResponse(
// // // // //         assignment,
// // // // //         assignmentId
// // // // //       );

// // // // //       await Assignment.findByIdAndUpdate(assignmentId, {
// // // // //         status: "completed",
// // // // //         paper,
// // // // //         processingTime: Date.now() - start,
// // // // //       });

// // // // //       emitAssignmentUpdate(assignmentId, {
// // // // //         status: "completed",
// // // // //         data: paper,
// // // // //       });

// // // // //       console.log(" JOB COMPLETED:", assignmentId);

// // // // //     } catch (err: any) {
// // // // //       console.error(" JOB ERROR:", err.message);

// // // // //       await Assignment.findByIdAndUpdate(assignmentId, {
// // // // //         status: "failed",
// // // // //         errorMessage: err.message,
// // // // //       });

// // // // //       emitAssignmentUpdate(assignmentId, {
// // // // //         status: "failed",
// // // // //         error: err.message,
// // // // //       });
// // // // //     }
// // // // //   },
// // // // //   {
// // // // //     connection,
// // // // //     concurrency: 5
// // // // //   }
// // // // // );



// // // // // assignmentWorker.on("ready", () => {
// // // // //   console.log("Worker connected to Redis");
// // // // // });

// // // // // assignmentWorker.on("error", (err) => {
// // // // //   console.error(" Worker error:", err);
// // // // // });

// // // // // assignmentWorker.on("completed", (job) => {
// // // // //   console.log(`Job ${job.id} completed`);
// // // // // });

// // // // // assignmentWorker.on("failed", (job, err) => {
// // // // //   console.error(` Job ${job?.id} failed:`, err);
// // // // // });

// // // // // console.log("Worker running");

// // // // // export { assignmentWorker };


// // // // // =========================================

// // // // import { Worker, Job } from "bullmq";
// // // // import { Assignment } from "../modules/assignemnt/assignment.model";
// // // // import { User } from "../modules/user/user.model";
// // // // import { handleGuestCredits } from "../utils/credits";

// // // // import { generateWithAI } from "../services/ai/aiOrchestrator.service";
// // // // import { parseAIResponse } from "../utils/aiParser";
// // // // import { validateAIOutput } from "../utils/aiValidator";
// // // // import { buildPrompt } from "../services/ai/promptBuilder";
// // // // import { emitAssignmentUpdate } from "../socket/socket.emitter";

// // // // const connection = {
// // // //   host: "ruling-griffon-79931.upstash.io",
// // // //   port: 6379,
// // // //   username: "default",
// // // //   password: process.env.REDIS_PASSWORD,
// // // //   tls: {},
// // // // };

// // // // console.log("Worker connecting to Redis...");
// // // // console.log("Redis Password exists:", !!process.env.REDIS_PASSWORD);

// // // // // =========================
// // // // // CONFIG LOGIC (UNCHANGED)
// // // // // =========================
// // // // const generateDynamicConfig = (totalMarks: number) => {
// // // //   const marks = { easy: 2, medium: 3, hard: 5 };
// // // //   const weights = { easy: 1, medium: 2.5, hard: 1.5 };
// // // //   const totalWeight = 5;

// // // //   const targetMarks = {
// // // //     easy: (weights.easy / totalWeight) * totalMarks,
// // // //     medium: (weights.medium / totalWeight) * totalMarks,
// // // //     hard: (weights.hard / totalWeight) * totalMarks,
// // // //   };

// // // //   let base = {
// // // //     easy: Math.max(2, Math.floor(targetMarks.easy / marks.easy)),
// // // //     medium: Math.max(2, Math.floor(targetMarks.medium / marks.medium)),
// // // //     hard: Math.max(2, Math.floor(targetMarks.hard / marks.hard)),
// // // //   };

// // // //   let best = base;
// // // //   let bestDiff = Infinity;

// // // //   for (let de = -2; de <= 2; de++) {
// // // //     for (let dm = -2; dm <= 2; dm++) {
// // // //       for (let dh = -2; dh <= 2; dh++) {
// // // //         const e = Math.max(2, base.easy + de);
// // // //         const m = Math.max(2, base.medium + dm);
// // // //         const h = Math.max(2, base.hard + dh);

// // // //         const total = e * marks.easy + m * marks.medium + h * marks.hard;
// // // //         const diff = Math.abs(total - totalMarks);

// // // //         if (diff < bestDiff) {
// // // //           bestDiff = diff;
// // // //           best = { easy: e, medium: m, hard: h };
// // // //         }
// // // //       }
// // // //     }
// // // //   }

// // // //   return { distribution: best, marks, tolerance: 2 };
// // // // };

// // // // const resolveConfig = (assignment: any) => {
// // // //   return generateDynamicConfig(assignment.totalMarks);
// // // // };

// // // // // =========================
// // // // // NORMALIZATION (UNCHANGED)
// // // // // =========================
// // // // const normalizePaper = (paper: any, config: any, assignment: any) => {
// // // //   const difficulties = ["easy", "medium", "hard"];
// // // //   const seen = new Set<string>();

// // // //   return {
// // // //     studentInfo: {
// // // //       name: "",
// // // //       rollNumber: "",
// // // //       section: "",
// // // //       class: assignment.class,
// // // //       subject: assignment.subject,
// // // //       date: "",
// // // //     },
// // // //     instructions: assignment.instructions,

// // // //     sections: difficulties.map((difficulty, idx) => {
// // // //       const target = config.distribution[difficulty];

// // // //       let questions =
// // // //         paper?.sections?.[idx]?.questions?.map((q: any) => {
// // // //           let text =
// // // //             typeof q === "string"
// // // //               ? q.trim()
// // // //               : q?.text?.trim() || q?.question?.trim();

// // // //           if (!text || text.length < 20) return null;

// // // //           const key = text.toLowerCase();

// // // //           if (seen.has(key)) {
// // // //             text += " (Explain with different example)";
// // // //           }

// // // //           seen.add(key);

// // // //           return {
// // // //             text,
// // // //             difficulty,
// // // //             marks: config.marks[difficulty],
// // // //             type: assignment.questionTypes?.[0] || "theory",
// // // //           };
// // // //         }) || [];

// // // //       questions = questions.filter(Boolean);

// // // //       while (questions.length < target) {
// // // //         questions.push({
// // // //           text: `Explain ${assignment.topic} with example.`,
// // // //           difficulty,
// // // //           marks: config.marks[difficulty],
// // // //           type: "theory",
// // // //         });
// // // //       }

// // // //       questions = questions.slice(0, target);

// // // //       questions.forEach((q: any, i: number) => (q.number = i + 1));

// // // //       return {
// // // //         title: `Section ${String.fromCharCode(65 + idx)}`,
// // // //         subTitle: "",
// // // //         instruction:
// // // //           idx === 0 ? "Attempt all questions" : "Attempt any questions",
// // // //         questions,
// // // //       };
// // // //     }),
// // // //   };
// // // // };

// // // // const calculateTotalMarks = (paper: any) => {
// // // //   return paper.sections.reduce(
// // // //     (sum: number, sec: any) =>
// // // //       sum + sec.questions.reduce((s: number, q: any) => s + q.marks, 0),
// // // //     0
// // // //   );
// // // // };

// // // // // =========================
// // // // // AI GENERATION
// // // // // =========================
// // // // export const generateValidAIResponse = async (
// // // //   assignment: any,
// // // //   assignmentId: string
// // // // ) => {
// // // //   const config = resolveConfig(assignment);
// // // //   let attempts = 0;

// // // //   while (attempts < 3) {
// // // //     try {
// // // //       emitAssignmentUpdate(assignmentId, {
// // // //         status: "ai_attempt",
// // // //         attempt: attempts + 1,
// // // //       });

// // // //       const prompt = buildPrompt(assignment, config);
// // // //       const raw = await generateWithAI(prompt);

// // // //       const parsed = parseAIResponse(raw);
// // // //       const normalized = normalizePaper(parsed, config, assignment);

// // // //       if (!validateAIOutput(normalized)) throw new Error("Validation failed");

// // // //       const total = calculateTotalMarks(normalized);
// // // //       const diff = Math.abs(total - assignment.totalMarks);

// // // //       if (diff <= config.tolerance) {
// // // //         emitAssignmentUpdate(assignmentId, {
// // // //           status: "ai_success",
// // // //           marks: total,
// // // //         });
// // // //         return normalized;
// // // //       }

// // // //       attempts++;
// // // //     } catch {
// // // //       attempts++;
// // // //     }
// // // //   }

// // // //   return generateFallbackPaper(assignment, config);
// // // // };

// // // // const generateFallbackPaper = (assignment: any, config: any) => {
// // // //   return {
// // // //     studentInfo: {
// // // //       name: "",
// // // //       rollNumber: "",
// // // //       section: "",
// // // //       class: assignment.class,
// // // //       subject: assignment.subject,
// // // //       date: "",
// // // //     },
// // // //     instructions: assignment.instructions,
// // // //     sections: ["easy", "medium", "hard"].map((d, idx) => ({
// // // //       title: `Section ${String.fromCharCode(65 + idx)}`,
// // // //       subTitle: "",
// // // //       instruction:
// // // //         idx === 0 ? "Attempt all questions" : "Attempt any questions",
// // // //       questions: Array.from({ length: config.distribution[d] }, (_, i) => ({
// // // //         number: i + 1,
// // // //         text: `Explain ${assignment.topic} with example.`,
// // // //         difficulty: d,
// // // //         marks: config.marks[d],
// // // //         type: "theory",
// // // //       })),
// // // //     })),
// // // //   };
// // // // };

// // // // // =========================
// // // // // WORKER (FIXED)
// // // // // =========================
// // // // const assignmentWorker = new Worker(
// // // //   "assignmentQueue",
// // // //   async (job: Job) => {
// // // //     const { assignmentId } = job.data;
// // // //     if (!assignmentId) return;

// // // //     const start = Date.now();

// // // //     try {
// // // //       const assignment = await Assignment.findById(assignmentId);
// // // //       if (!assignment) throw new Error("Assignment not found");

// // // //       // 🛑 Prevent duplicate processing
// // // //       if (assignment.status !== "pending") return;

// // // //       await Assignment.findByIdAndUpdate(assignmentId, {
// // // //         status: "processing",
// // // //       });

// // // //       emitAssignmentUpdate(assignmentId, { status: "processing" });

// // // //       const paper = await generateValidAIResponse(
// // // //         assignment,
// // // //         assignmentId
// // // //       );

// // // //       await Assignment.findByIdAndUpdate(assignmentId, {
// // // //         status: "completed",
// // // //         paper,
// // // //         processingTime: Date.now() - start,
// // // //       });

// // // //       // =========================
// // // //       // 💥 CREDIT DEDUCTION (FINAL FIX)
// // // //       // =========================
// // // //       if (assignment.userId) {
// // // //         await User.findByIdAndUpdate(assignment.userId, {
// // // //           $inc: { credits: -1 },
// // // //         });
// // // //       } else if (assignment.guestSessionId) {
// // // //         await handleGuestCredits(assignment.guestSessionId);
// // // //       }

// // // //       emitAssignmentUpdate(assignmentId, {
// // // //         status: "completed",
// // // //         data: paper,
// // // //       });

// // // //     } catch (err: any) {
// // // //       await Assignment.findByIdAndUpdate(assignmentId, {
// // // //         status: "failed",
// // // //         errorMessage: err.message,
// // // //       });

// // // //       emitAssignmentUpdate(assignmentId, {
// // // //         status: "failed",
// // // //         error: err.message,
// // // //       });
// // // //     }
// // // //   },
// // // //   {
// // // //     connection,
// // // //     concurrency: 5,
// // // //   }
// // // // );

// // // // assignmentWorker.on("ready", () => {
// // // //   console.log("Worker connected to Redis");
// // // // });

// // // // assignmentWorker.on("error", (err) => {
// // // //   console.error("Worker error:", err);
// // // // });

// // // // console.log("Worker running");

// // // // export { assignmentWorker };




// // // // =================New======




// // // import { Worker, Job } from "bullmq";
// // // import { Assignment } from "../modules/assignemnt/assignment.model";
// // // import { User } from "../modules/user/user.model";
// // // import { handleGuestCredits } from "../utils/credits";

// // // import { generateWithAI } from "../services/ai/aiOrchestrator.service";
// // // import { parseAIResponse } from "../utils/aiParser";
// // // import { validateAIOutput } from "../utils/aiValidator";
// // // import { buildPrompt } from "../services/ai/promptBuilder";
// // // import { emitAssignmentUpdate } from "../socket/socket.emitter";

// // // // ✅ NEW IMPORT (IMPORTANT)
// // // import {
// // //   getAdvancedDistribution,
// // //   enhancePromptForRegeneration
// // // } from "../services/ai/generationStrategy.service";

// // // const connection = {
// // //   host: "ruling-griffon-79931.upstash.io",
// // //   port: 6379,
// // //   username: "default",
// // //   password: process.env.REDIS_PASSWORD,
// // //   tls: {},
// // // };

// // // // =========================
// // // // CONFIG (same)
// // // // =========================
// // // const generateDynamicConfig = (totalMarks: number) => {
// // //   const marks = { easy: 2, medium: 3, hard: 5 };
// // //   const weights = { easy: 1, medium: 2.5, hard: 1.5 };
// // //   const totalWeight = 5;

// // //   const targetMarks = {
// // //     easy: (weights.easy / totalWeight) * totalMarks,
// // //     medium: (weights.medium / totalWeight) * totalMarks,
// // //     hard: (weights.hard / totalWeight) * totalMarks,
// // //   };

// // //   return {
// // //     distribution: {
// // //       easy: Math.max(2, Math.floor(targetMarks.easy / 2)),
// // //       medium: Math.max(2, Math.floor(targetMarks.medium / 3)),
// // //       hard: Math.max(2, Math.floor(targetMarks.hard / 5)),
// // //     },
// // //     marks,
// // //     tolerance: 2,
// // //   };
// // // };

// // // const resolveConfig = (assignment: any) => {
// // //   return generateDynamicConfig(assignment.totalMarks);
// // // };

// // // // =========================
// // // // NORMALIZE
// // // // =========================
// // // const normalizePaper = (paper: any, config: any, assignment: any) => {
// // //   const difficulties = ["easy", "medium", "hard"];
// // //   const seen = new Set<string>();

// // //   return {
// // //     studentInfo: {
// // //       name: "",
// // //       rollNumber: "",
// // //       section: "",
// // //       class: assignment.class,
// // //       subject: assignment.subject,
// // //       date: "",
// // //     },
// // //     instructions: assignment.instructions,

// // //     sections: difficulties.map((difficulty, idx) => {
// // //       const target = config.distribution[difficulty];

// // //       let questions =
// // //         paper?.sections?.[idx]?.questions?.map((q: any) => {
// // //           let text =
// // //             typeof q === "string"
// // //               ? q.trim()
// // //               : q?.text?.trim() || q?.question?.trim();

// // //           if (!text || text.length < 20) return null;

// // //           const key = text.toLowerCase();

// // //           if (seen.has(key)) {
// // //             text += " (Explain with different example)";
// // //           }

// // //           seen.add(key);

// // //           return {
// // //             text,
// // //             difficulty,
// // //             marks: config.marks[difficulty],
// // //             type: assignment.questionTypes?.[0] || "theory",
// // //           };
// // //         }) || [];

// // //       questions = questions.filter(Boolean);

// // //       while (questions.length < target) {
// // //         questions.push({
// // //           text: `Explain ${assignment.topic} with example.`,
// // //           difficulty,
// // //           marks: config.marks[difficulty],
// // //           type: "theory",
// // //         });
// // //       }

// // //       questions = questions.slice(0, target);

// // //       questions.forEach((q: any, i: number) => (q.number = i + 1));

// // //       return {
// // //         title: `Section ${String.fromCharCode(65 + idx)}`,
// // //         instruction: "Attempt all questions",
// // //         questions,
// // //       };
// // //     }),
// // //   };
// // // };

// // // const calculateTotalMarks = (paper: any) => {
// // //   return paper.sections.reduce(
// // //     (sum: number, sec: any) =>
// // //       sum + sec.questions.reduce((s: number, q: any) => s + q.marks, 0),
// // //     0
// // //   );
// // // };

// // // // =========================
// // // // 🔥 UPDATED AI GENERATION (WITH REGENERATE)
// // // // =========================
// // // export const generateValidAIResponse = async (
// // //   assignment: any,
// // //   assignmentId: string,
// // //   isRegenerate: boolean = false
// // // ) => {
// // //   let config = resolveConfig(assignment);
// // //   let attempts = 0;

// // //   // 🔥 regenerate case → better distribution
// // //   if (isRegenerate) {
// // //     const advanced = getAdvancedDistribution(assignment.totalMarks);

// // //     console.log("Using advanced distribution for regeneration");
// // //   }

// // //   while (attempts < 3) {
// // //     try {
// // //       emitAssignmentUpdate(assignmentId, {
// // //         status: "ai_attempt",
// // //         attempt: attempts + 1,
// // //       });

// // //       let prompt = buildPrompt(assignment, config);

// // //       // 🔥 REGENERATE PROMPT CHANGE
// // //       if (isRegenerate) {
// // //         prompt = enhancePromptForRegeneration(prompt);
// // //       }

// // //       const raw = await generateWithAI(prompt);

// // //       const parsed = parseAIResponse(raw);
// // //       const normalized = normalizePaper(parsed, config, assignment);

// // //       if (!validateAIOutput(normalized)) {
// // //         throw new Error("Validation failed");
// // //       }

// // //       const total = calculateTotalMarks(normalized);
// // //       const diff = Math.abs(total - assignment.totalMarks);

// // //       if (diff <= config.tolerance) {
// // //         emitAssignmentUpdate(assignmentId, {
// // //           status: "ai_success",
// // //           marks: total,
// // //         });

// // //         return normalized;
// // //       }

// // //       attempts++;

// // //     } catch (err: any) {
// // //       console.error("AI attempt failed:", err.message);
// // //       attempts++;
// // //     }
// // //   }

// // //   return generateFallbackPaper(assignment, config);
// // // };

// // // // =========================
// // // // FALLBACK
// // // // =========================
// // // const generateFallbackPaper = (assignment: any, config: any) => {
// // //   return {
// // //     studentInfo: {
// // //       name: "",
// // //       rollNumber: "",
// // //       section: "",
// // //       class: assignment.class,
// // //       subject: assignment.subject,
// // //       date: "",
// // //     },
// // //     instructions: assignment.instructions,
// // //     sections: ["easy", "medium", "hard"].map((d, idx) => ({
// // //       title: `Section ${String.fromCharCode(65 + idx)}`,
// // //       instruction: "Attempt all questions",
// // //       questions: Array.from({ length: config.distribution[d] }, (_, i) => ({
// // //         number: i + 1,
// // //         text: `Explain ${assignment.topic} with example.`,
// // //         difficulty: d,
// // //         marks: config.marks[d],
// // //         type: "theory",
// // //       })),
// // //     })),
// // //   };
// // // };

// // // // =========================
// // // // 🚀 FINAL WORKER (WITH REGENERATE)
// // // // =========================
// // // const assignmentWorker = new Worker(
// // //   "assignmentQueue",
// // //   async (job: Job) => {
// // //     const { assignmentId, isRegenerate } = job.data;

// // //     if (!assignmentId) return;

// // //     const start = Date.now();

// // //     try {
// // //       const assignment = await Assignment.findById(assignmentId);
// // //       if (!assignment) throw new Error("Assignment not found");

// // //       // 🔥 IMPORTANT CHANGE
// // //       if (!isRegenerate && assignment.status !== "pending") return;

// // //       await Assignment.findByIdAndUpdate(assignmentId, {
// // //         status: "processing",
// // //       });

// // //       emitAssignmentUpdate(assignmentId, { status: "processing" });

// // //       const paper = await generateValidAIResponse(
// // //         assignment,
// // //         assignmentId,
// // //         isRegenerate
// // //       );

// // //       await Assignment.findByIdAndUpdate(assignmentId, {
// // //         status: "completed",
// // //         paper,
// // //         processingTime: Date.now() - start,
// // //       });

// // //       // 💥 CREDIT ONLY FOR REGENERATE (IMPORTANT FIX)
// // //       if (isRegenerate) {
// // //         if (assignment.userId) {
// // //           await User.findByIdAndUpdate(assignment.userId, {
// // //             $inc: { credits: -1 },
// // //           });
// // //         }
// // //       }

// // //       emitAssignmentUpdate(assignmentId, {
// // //         status: "completed",
// // //         data: paper,
// // //       });

// // //     } catch (err: any) {
// // //       await Assignment.findByIdAndUpdate(assignmentId, {
// // //         status: "failed",
// // //         errorMessage: err.message,
// // //       });

// // //       emitAssignmentUpdate(assignmentId, {
// // //         status: "failed",
// // //         error: err.message,
// // //       });
// // //     }
// // //   },
// // //   {
// // //     connection,
// // //     concurrency: 5,
// // //   }
// // // );

// // // assignmentWorker.on("ready", () => {
// // //   console.log("Worker connected to Redis");
// // // });

// // // assignmentWorker.on("error", (err) => {
// // //   console.error("Worker error:", err);
// // // });

// // // console.log("Worker running");

// // // export { assignmentWorker };






// // import { Worker, Job } from "bullmq";
// // import { Assignment } from "../modules/assignemnt/assignment.model";
// // import { User } from "../modules/user/user.model";
// // import { handleGuestCredits } from "../utils/credits";
// // import { getRedisConnection } from "../config/redis";

// // import { generateWithAI } from "../services/ai/aiOrchestrator.service";
// // import { parseAIResponse } from "../utils/aiParser";
// // import { validateAIOutput } from "../utils/aiValidator";
// // import { buildPrompt } from "../services/ai/promptBuilder";
// // import { emitAssignmentUpdate } from "../socket/socket.emitter";

// // import {
// //   getAdvancedDistribution,
// //   enhancePromptForRegeneration
// // } from "../services/ai/generationStrategy.service";

// // // =========================
// // // REDIS CONNECTION
// // // =========================
// // const connection = {
// //   host: "ruling-griffon-79931.upstash.io",
// //   port: 6379,
// //   username: "default",
// //   password: process.env.REDIS_PASSWORD,
// //   tls: {},
// // };

// // // =========================
// // // CONFIG
// // // =========================
// // const generateDynamicConfig = (totalMarks: number) => {
// //   const marks = { easy: 2, medium: 3, hard: 5 };
// //   const weights = { easy: 1, medium: 2.5, hard: 1.5 };
// //   const totalWeight = 5;

// //   const targetMarks = {
// //     easy: (weights.easy / totalWeight) * totalMarks,
// //     medium: (weights.medium / totalWeight) * totalMarks,
// //     hard: (weights.hard / totalWeight) * totalMarks,
// //   };

// //   return {
// //     distribution: {
// //       easy: Math.max(2, Math.floor(targetMarks.easy / 2)),
// //       medium: Math.max(2, Math.floor(targetMarks.medium / 3)),
// //       hard: Math.max(2, Math.floor(targetMarks.hard / 5)),
// //     },
// //     marks,
// //     tolerance: 2,
// //   };
// // };

// // const resolveConfig = (assignment: any) => {
// //   return generateDynamicConfig(assignment.totalMarks);
// // };

// // // =========================
// // // NORMALIZE
// // // =========================
// // const normalizePaper = (paper: any, config: any, assignment: any) => {
// //   const difficulties = ["easy", "medium", "hard"];
// //   const seen = new Set<string>();

// //   return {
// //     studentInfo: {
// //       name: "",
// //       rollNumber: "",
// //       section: "",
// //       class: assignment.class,
// //       subject: assignment.subject,
// //       date: "",
// //     },
// //     instructions: assignment.instructions,

// //     sections: difficulties.map((difficulty, idx) => {
// //       const target = config.distribution[difficulty];

// //       let questions =
// //         paper?.sections?.[idx]?.questions?.map((q: any) => {
// //           let text =
// //             typeof q === "string"
// //               ? q.trim()
// //               : q?.text?.trim() || q?.question?.trim();

// //           if (!text || text.length < 20) return null;

// //           const key = text.toLowerCase();

// //           if (seen.has(key)) {
// //             text += " (Explain with different example)";
// //           }

// //           seen.add(key);

// //           return {
// //             text,
// //             difficulty,
// //             marks: config.marks[difficulty],
// //             type: assignment.questionTypes?.[0] || "theory",
// //           };
// //         }) || [];

// //       questions = questions.filter(Boolean);

// //       while (questions.length < target) {
// //         questions.push({
// //           text: `Explain ${assignment.topic} with example.`,
// //           difficulty,
// //           marks: config.marks[difficulty],
// //           type: "theory",
// //         });
// //       }

// //       questions = questions.slice(0, target);

// //       questions.forEach((q: any, i: number) => (q.number = i + 1));

// //       return {
// //         title: `Section ${String.fromCharCode(65 + idx)}`,
// //         instruction: "Attempt all questions",
// //         questions,
// //       };
// //     }),
// //   };
// // };

// // const calculateTotalMarks = (paper: any) => {
// //   return paper.sections.reduce(
// //     (sum: number, sec: any) =>
// //       sum + sec.questions.reduce((s: number, q: any) => s + q.marks, 0),
// //     0
// //   );
// // };

// // // =========================
// // // AI GENERATION
// // // =========================
// // export const generateValidAIResponse = async (
// //   assignment: any,
// //   assignmentId: string,
// //   isRegenerate: boolean = false
// // ) => {
// //   let config = resolveConfig(assignment);
// //   let attempts = 0;

// //   // 🔥 Regenerate → better distribution (optional)
// //   if (isRegenerate) {
// //     getAdvancedDistribution(assignment.totalMarks);
// //   }

// //   while (attempts < 3) {
// //     try {
// //       emitAssignmentUpdate(assignmentId, {
// //         status: "ai_attempt",
// //         attempt: attempts + 1,
// //       });

// //       let prompt = buildPrompt(assignment, config);

// //       if (isRegenerate) {
// //         prompt = enhancePromptForRegeneration(prompt);
// //       }

// //       const raw = await generateWithAI(prompt);
// //       const parsed = parseAIResponse(raw);
// //       const normalized = normalizePaper(parsed, config, assignment);

// //       if (!validateAIOutput(normalized)) {
// //         throw new Error("Validation failed");
// //       }

// //       const total = calculateTotalMarks(normalized);
// //       const diff = Math.abs(total - assignment.totalMarks);

// //       if (diff <= config.tolerance) {
// //         emitAssignmentUpdate(assignmentId, {
// //           status: "ai_success",
// //           marks: total,
// //         });

// //         return normalized;
// //       }

// //       attempts++;

// //     } catch (err: any) {
// //       console.error("AI attempt failed:", err.message);
// //       attempts++;
// //     }
// //   }

// //   return generateFallbackPaper(assignment, config);
// // };

// // // =========================
// // // FALLBACK
// // // =========================
// // const generateFallbackPaper = (assignment: any, config: any) => {
// //   return {
// //     studentInfo: {
// //       name: "",
// //       rollNumber: "",
// //       section: "",
// //       class: assignment.class,
// //       subject: assignment.subject,
// //       date: "",
// //     },
// //     instructions: assignment.instructions,
// //     sections: ["easy", "medium", "hard"].map((d, idx) => ({
// //       title: `Section ${String.fromCharCode(65 + idx)}`,
// //       instruction: "Attempt all questions",
// //       questions: Array.from({ length: config.distribution[d] }, (_, i) => ({
// //         number: i + 1,
// //         text: `Explain ${assignment.topic} with example.`,
// //         difficulty: d,
// //         marks: config.marks[d],
// //         type: "theory",
// //       })),
// //     })),
// //   };
// // };

// // // =========================
// // // 🚀 FINAL WORKER
// // // =========================
// // const assignmentWorker = new Worker(
// //   "assignmentQueue",
// //   async (job: Job) => {
// //     const { assignmentId, isRegenerate } = job.data;

// //     if (!assignmentId) return;

// //     const start = Date.now();

// //     try {
// //       const assignment = await Assignment.findById(assignmentId);
// //       if (!assignment) throw new Error("Assignment not found");

// //       // prevent duplicate
// //       if (!isRegenerate && assignment.status !== "pending") return;

// //       await Assignment.findByIdAndUpdate(assignmentId, {
// //         status: "processing",
// //       });

// //       emitAssignmentUpdate(assignmentId, { status: "processing" });

// //       const paper = await generateValidAIResponse(
// //         assignment,
// //         assignmentId,
// //         isRegenerate
// //       );

// //       await Assignment.findByIdAndUpdate(assignmentId, {
// //         status: "completed",
// //         paper,
// //         processingTime: Date.now() - start,
// //       });

// //       // =========================
// //       // 💥 CREDIT DEDUCTION
// //       // =========================
// //       if (isRegenerate) {
// //         if (assignment.userId) {
// //           await User.findByIdAndUpdate(assignment.userId, {
// //             $inc: { credits: -1 },
// //           });
// //         }
// //       } else {
// //         if (assignment.guestSessionId) {
// //           await handleGuestCredits(assignment.guestSessionId);
// //         } else if (assignment.userId) {
// //           await User.findByIdAndUpdate(assignment.userId, {
// //             $inc: { credits: -1 },
// //           });
// //         }
// //       }

// //       // =========================
// //       // 🔥 CACHE INVALIDATION
// //       // =========================
// //       const redis = await getRedisConnection();
// //       if (redis) {
// //         await redis.del(`assignment:${assignmentId}`);
// //       }

// //       emitAssignmentUpdate(assignmentId, {
// //         status: "completed",
// //         data: paper,
// //       });

// //     } catch (err: any) {
// //       await Assignment.findByIdAndUpdate(assignmentId, {
// //         status: "failed",
// //         errorMessage: err.message,
// //       });

// //       emitAssignmentUpdate(assignmentId, {
// //         status: "failed",
// //         error: err.message,
// //       });
// //     }
// //   },
// //   {
// //     connection,
// //     concurrency: 5,
// //   }
// // );

// // // =========================
// // // EVENTS
// // // =========================
// // assignmentWorker.on("ready", () => {
// //   console.log("Worker connected to Redis");
// // });

// // assignmentWorker.on("error", (err) => {
// //   console.error("Worker error:", err);
// // });

// // assignmentWorker.on("completed", (job) => {
// //   console.log(`Job ${job.id} completed`);
// // });

// // assignmentWorker.on("failed", (job, err) => {
// //   console.error(`Job ${job?.id} failed:`, err);
// // });

// // console.log("Worker running");

// // export { assignmentWorker };




// import { Worker, Job } from "bullmq";
// import { Assignment } from "../modules/assignemnt/assignment.model";
// import { User } from "../modules/user/user.model";
// import { handleGuestCredits } from "../utils/credits";
// import { getRedisConnection } from "../config/redis";

// import { generateWithAI } from "../services/ai/aiOrchestrator.service";
// import { parseAIResponse } from "../utils/aiParser";
// import { validateAIOutput } from "../utils/aiValidator";
// import { buildPrompt } from "../services/ai/promptBuilder";
// import { emitAssignmentUpdate } from "../socket/socket.emitter";

// import {
//   getAdvancedDistribution,
//   enhancePromptForRegeneration
// } from "../services/ai/generationStrategy.service";

// // =========================
// // REDIS
// // =========================
// const connection = {
//   host: "ruling-griffon-79931.upstash.io",
//   port: 6379,
//   username: "default",
//   password: process.env.REDIS_PASSWORD,
//   tls: {},
// };

// // =========================
// // CONFIG
// // =========================
// const generateDynamicConfig = (totalMarks: number) => {
//   const marks = { easy: 2, medium: 3, hard: 5 };
//   const weights = { easy: 1, medium: 2.5, hard: 1.5 };
//   const totalWeight = 5;

//   const targetMarks = {
//     easy: (weights.easy / totalWeight) * totalMarks,
//     medium: (weights.medium / totalWeight) * totalMarks,
//     hard: (weights.hard / totalWeight) * totalMarks,
//   };

//   return {
//     distribution: {
//       easy: Math.max(2, Math.floor(targetMarks.easy / 2)),
//       medium: Math.max(2, Math.floor(targetMarks.medium / 3)),
//       hard: Math.max(2, Math.floor(targetMarks.hard / 5)),
//     },
//     marks,
//     tolerance: 2,
//   };
// };

// const resolveConfig = (assignment: any) => {
//   return generateDynamicConfig(assignment.totalMarks);
// };

// // =========================
// // 🔥 STRONG NORMALIZE
// // =========================
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
//         paper?.sections?.[idx]?.questions?.map((q: any, index: number) => {

//           let text = "";

//           if (typeof q === "string") {
//             text = q.trim();
//           } else if (typeof q === "object") {
//             text = (q.text || q.question || "").trim();
//           }

//           if (!text || text.length < 15) return null;

//           const key = text.toLowerCase();

//           if (seen.has(key)) {
//             text += " (Explain with different example)";
//           }

//           seen.add(key);

//           return {
//             number: index + 1,
//             text,
//             difficulty,
//             marks: config.marks[difficulty],
//             type: q?.type || assignment.questionTypes?.[0] || "theory",
//             options: Array.isArray(q?.options) ? q.options : [],
//             hint: q?.hint || "",
//           };
//         }) || [];

//       questions = questions.filter(Boolean);

//       // 🔥 fill missing
//       while (questions.length < target) {
//         questions.push({
//           number: questions.length + 1,
//           text: `Explain ${assignment.topic} with example.`,
//           difficulty,
//           marks: config.marks[difficulty],
//           type: "theory",
//           options: [],
//           hint: "",
//         });
//       }

//       questions = questions.slice(0, target);

//       return {
//         title: `Section ${String.fromCharCode(65 + idx)}`,
//         instruction: "Attempt all questions",
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

// // =========================
// // 🔥 AI GENERATION FIXED
// // =========================
// export const generateValidAIResponse = async (
//   assignment: any,
//   assignmentId: string,
//   isRegenerate: boolean = false
// ) => {
//   let config = resolveConfig(assignment);
//   let attempts = 0;

//   if (isRegenerate) {
//     getAdvancedDistribution(assignment.totalMarks);
//   }

//   while (attempts < 3) {
//     try {
//       console.log(`🔥 AI Attempt ${attempts + 1}`);

//       emitAssignmentUpdate(assignmentId, {
//         status: "ai_attempt",
//         attempt: attempts + 1,
//       });

//       let prompt = buildPrompt(assignment, config);

//       if (isRegenerate) {
//         prompt = enhancePromptForRegeneration(prompt);
//       }

//       const raw = await generateWithAI(prompt);

//       console.log("🧠 RAW AI:", raw?.slice(0, 200));

//       const parsed = parseAIResponse(raw);

//       console.log("✅ Parsed");

//       // 🔥 FIRST validate raw
//       if (!validateAIOutput(parsed)) {
//         console.log("❌ Raw validation failed");
//         throw new Error("Raw validation failed");
//       }

//       // 🔥 THEN normalize
//       const normalized = normalizePaper(parsed, config, assignment);

//       // 🔥 validate normalized (safety)
//       if (!validateAIOutput(normalized)) {
//         console.log("❌ Normalized validation failed");
//         throw new Error("Normalized validation failed");
//       }

//       const total = calculateTotalMarks(normalized);
//       const diff = Math.abs(total - assignment.totalMarks);

//       console.log(`📊 Marks: ${total} (diff: ${diff})`);

//       if (diff <= config.tolerance) {
//         console.log("✅ AI SUCCESS");

//         emitAssignmentUpdate(assignmentId, {
//           status: "ai_success",
//           marks: total,
//         });

//         return normalized;
//       }

//       attempts++;

//     } catch (err: any) {
//       console.error("❌ AI attempt failed:", err.message);
//       attempts++;
//     }
//   }

//   console.log("⚠️ Using fallback");

//   return generateFallbackPaper(assignment, config);
// };

// // =========================
// // FALLBACK
// // =========================
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
//       instruction: "Attempt all questions",
//       questions: Array.from({ length: config.distribution[d] }, (_, i) => ({
//         number: i + 1,
//         text: `Explain ${assignment.topic} with example.`,
//         difficulty: d,
//         marks: config.marks[d],
//         type: "theory",
//         options: [],
//         hint: "",
//       })),
//     })),
//   };
// };

// // =========================
// // WORKER
// // =========================
// const assignmentWorker = new Worker(
//   "assignmentQueue",
//   async (job: Job) => {
//     const { assignmentId, isRegenerate } = job.data;

//     if (!assignmentId) return;

//     const start = Date.now();

//     try {
//       const assignment = await Assignment.findById(assignmentId);
//       if (!assignment) throw new Error("Assignment not found");

//       if (!isRegenerate && assignment.status !== "pending") return;

//       await Assignment.findByIdAndUpdate(assignmentId, {
//         status: "processing",
//       });

//       emitAssignmentUpdate(assignmentId, { status: "processing" });

//       const paper = await generateValidAIResponse(
//         assignment,
//         assignmentId,
//         isRegenerate
//       );

//       await Assignment.findByIdAndUpdate(assignmentId, {
//         status: "completed",
//         paper,
//         processingTime: Date.now() - start,
//       });

//       // credits
//       if (isRegenerate) {
//         if (assignment.userId) {
//           await User.findByIdAndUpdate(assignment.userId, {
//             $inc: { credits: -1 },
//           });
//         }
//       } else {
//         if (assignment.guestSessionId) {
//           await handleGuestCredits(assignment.guestSessionId);
//         } else if (assignment.userId) {
//           await User.findByIdAndUpdate(assignment.userId, {
//             $inc: { credits: -1 },
//           });
//         }
//       }

//       const redis = await getRedisConnection();
//       if (redis) {
//         await redis.del(`assignment:${assignmentId}`);
//       }

//       emitAssignmentUpdate(assignmentId, {
//         status: "completed",
//         data: paper,
//       });

//     } catch (err: any) {
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
//     concurrency: 5,
//   }
// );

// assignmentWorker.on("ready", () => {
//   console.log("Worker connected");
// });

// assignmentWorker.on("completed", (job) => {
//   console.log(`Job ${job.id} done`);
// });

// assignmentWorker.on("failed", (job, err) => {
//   console.error(`Job ${job?.id} failed`, err);
// });

// console.log("🚀 Worker running");

// export { assignmentWorker };









import { Worker, Job } from "bullmq";
import { Assignment } from "../modules/assignemnt/assignment.model";
import { User } from "../modules/user/user.model";
import { handleGuestCredits } from "../utils/credits";
import { getRedisConnection } from "../config/redis";

import { generateWithAI } from "../services/ai/aiOrchestrator.service";
import { parseAIResponse } from "../utils/aiParser";
import { validateAIOutput } from "../utils/aiValidator";
import { buildPrompt } from "../services/ai/promptBuilder";
import { emitAssignmentUpdate } from "../socket/socket.emitter";

import {
  getAdvancedDistribution,
  enhancePromptForRegeneration,
} from "../services/ai/generationStrategy.service";

/* ================= REDIS CONNECTION ================= */

const connection = {
  host: "ruling-griffon-79931.upstash.io",
  port: 6379,
  username: "default",
  password: process.env.REDIS_PASSWORD,
  tls: {},
};

/* ================= CONFIG ================= */

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

  return {
    distribution: best,
    marks,
    tolerance: 5, // 🔥 production safe
  };
};

const resolveConfig = (assignment: any) => {
  return generateDynamicConfig(assignment.totalMarks);
};

/* ================= NORMALIZER ================= */

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
        paper?.sections?.[idx]?.questions?.map((q: any, i: number) => {
          let text =
            typeof q === "string"
              ? q.trim()
              : q?.text?.trim() || q?.question?.trim();

          if (!text || text.length < 15) return null;

          const key = text.toLowerCase();
          if (seen.has(key)) {
            text += " (Explain with different example)";
          }
          seen.add(key);

          return {
            number: i + 1,
            text,
            difficulty,
            marks: config.marks[difficulty], // 🔥 FORCE FIX
            type: q?.type || assignment.questionTypes?.[0] || "theory",
            options: Array.isArray(q?.options) ? q.options : [],
            hint:
              difficulty === "hard"
                ? q?.hint || `Think about ${assignment.topic} in real world`
                : undefined,
          };
        }) || [];

      questions = questions.filter(Boolean);

      while (questions.length < target) {
        questions.push({
          number: questions.length + 1,
          text: `Explain ${assignment.topic} with example.`,
          difficulty,
          marks: config.marks[difficulty],
          type: "theory",
          options: [],
          hint: "",
        });
      }

      return {
        title: `Section ${String.fromCharCode(65 + idx)}`,
        instruction:
          idx === 0 ? "Attempt all questions" : "Attempt any questions",
        questions: questions.slice(0, target),
      };
    }),
  };
};

/* ================= MARKS ================= */

const calculateTotalMarks = (paper: any) => {
  return paper.sections.reduce(
    (sum: number, sec: any) =>
      sum +
      sec.questions.reduce((s: number, q: any) => s + q.marks, 0),
    0
  );
};

/* ================= AI CORE ================= */

const generateValidAIResponse = async (
  assignment: any,
  assignmentId: string,
  isRegenerate: boolean = false
) => {
  let config = resolveConfig(assignment);
  let attempts = 0;

  if (isRegenerate) {
    getAdvancedDistribution(assignment.totalMarks);
  }

  while (attempts < 3) {
    try {
      console.log(`🔥 AI Attempt ${attempts + 1}`);

      emitAssignmentUpdate(assignmentId, {
        status: "ai_attempt",
        attempt: attempts + 1,
      });

      let prompt = buildPrompt(assignment, config);

      if (isRegenerate) {
        prompt = enhancePromptForRegeneration(prompt);
      }

      const raw = await generateWithAI(prompt);

      const parsed = parseAIResponse(raw);

      if (!validateAIOutput(parsed)) {
        throw new Error("Raw validation failed");
      }

      const normalized = normalizePaper(parsed, config, assignment);

      const total = calculateTotalMarks(normalized);
      const diff = Math.abs(total - assignment.totalMarks);

      console.log(`📊 Marks: ${total} | Expected: ${assignment.totalMarks}`);

      if (diff <= config.tolerance) {
        return normalized;
      }

      attempts++;
    } catch (err: any) {
      console.error("❌ AI FAIL:", err.message);
      attempts++;
    }
  }

  return generateFallbackPaper(assignment, config);
};

/* ================= FALLBACK ================= */

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
          options: [],
          hint: "",
        })
      ),
    })),
  };
};

/* ================= WORKER ================= */

export const assignmentWorker = new Worker(
  "assignmentQueue",
  async (job: Job) => {
    const { assignmentId, isRegenerate } = job.data;

    if (!assignmentId) return;

    const start = Date.now();

    try {
      console.log("🚀 JOB:", assignmentId);

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) throw new Error("Assignment not found");

      if (!isRegenerate && assignment.status !== "pending") return;

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "processing",
      });

      emitAssignmentUpdate(assignmentId, { status: "processing" });

      const paper = await generateValidAIResponse(
        assignment,
        assignmentId,
        isRegenerate
      );

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "completed",
        paper,
        processingTime: Date.now() - start,
      });

      /* 🔥 CREDIT HANDLING */
      if (isRegenerate) {
        if (assignment.userId) {
          await User.findByIdAndUpdate(assignment.userId, {
            $inc: { credits: -1 },
          });
        }
      } else {
        if (assignment.guestSessionId) {
          await handleGuestCredits(assignment.guestSessionId);
        } else if (assignment.userId) {
          await User.findByIdAndUpdate(assignment.userId, {
            $inc: { credits: -1 },
          });
        }
      }

      /* 🔥 CACHE CLEAR */
      const redis = await getRedisConnection();
      if (redis) {
        await redis.del(`assignment:${assignmentId}`);
      }

      emitAssignmentUpdate(assignmentId, {
        status: "completed",
        data: paper,
      });

      console.log("🎉 DONE:", Date.now() - start, "ms");
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
    connection,
    concurrency: 5,
  }
);

console.log("🔥 PRODUCTION WORKER RUNNING...");
