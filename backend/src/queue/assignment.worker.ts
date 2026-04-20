

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



const connection = {
  host:"daring-amoeba-80260.upstash.io",
  port: 6379,
  username: "default",
  password: process.env.REDIS_PASSWORD,
  tls: {},
};



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
    tolerance: 5, 
  };
};

const resolveConfig = (assignment: any) => {
  return generateDynamicConfig(assignment.totalMarks);
};



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
            marks: config.marks[difficulty], 
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


const calculateTotalMarks = (paper: any) => {
  return paper.sections.reduce(
    (sum: number, sec: any) =>
      sum +
      sec.questions.reduce((s: number, q: any) => s + q.marks, 0),
    0
  );
};



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
      console.log(` AI Attempt ${attempts + 1}`);

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

      console.log(`Marks: ${total} | Expected: ${assignment.totalMarks}`);

      if (diff <= config.tolerance) {
        return normalized;
      }

      attempts++;
    } catch (err: any) {
      console.error(" AI FAIL:", err.message);
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



export const assignmentWorker = new Worker(
  "assignmentQueue",
  async (job: Job) => {
    const { assignmentId, isRegenerate } = job.data;

    if (!assignmentId) return;

    const start = Date.now();

    try {
      console.log(" JOB:", assignmentId);

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

  
      const redis = await getRedisConnection();
      if (redis) {
        await redis.del(`assignment:${assignmentId}`);
      }

      emitAssignmentUpdate(assignmentId, {
        status: "completed",
        data: paper,
      });

      console.log(" DONE:", Date.now() - start, "ms");
    } catch (err: any) {
      console.error(" ERROR:", err.message);

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

console.log(" PRODUCTION WORKER RUNNING...");
