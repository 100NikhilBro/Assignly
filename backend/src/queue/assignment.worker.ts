import { Worker, Job } from "bullmq";
import { env } from "../config/env";
import { Assignment } from "../modules/assignemnt/assignment.model";
import { generateWithAI } from "../services/ai/aiOrchestrator.service";
import { parseAIResponse } from "../utils/aiParser";
import { validateAIOutput } from "../utils/aiValidator";
import { buildPrompt } from "../services/ai/promptBuilder";
import { emitAssignmentUpdate } from "../socket/socket.emitter";


const checkDuplicates = (paper: any) => {
  const seen = new Set();

  for (const section of paper.sections) {
    for (const q of section.questions) {
      if (seen.has(q.text)) return false;
      seen.add(q.text);
    }
  }

  return true;
};

const checkConceptCoverage = (paper: any, concepts: string[]) => {
  if (!concepts || concepts.length === 0) return true;

  const usedConcepts = new Set<string>();

  for (const section of paper.sections) {
    for (const q of section.questions) {
      concepts.forEach((c) => {
        if (q.text.toLowerCase().includes(c.toLowerCase())) {
          usedConcepts.add(c);
        }
      });
    }
  }

  return usedConcepts.size >= Math.min(concepts.length, 2); 
};

const checkQuality = (paper: any) => {
  for (const section of paper.sections) {
    for (const q of section.questions) {
      if (q.text.length < 15) return false; 
      if (/^explain\s+\w+/i.test(q.text)) return false; 
    }
  }
  return true;
};


const generateValidAIResponse = async (assignment: any) => {
  let attempts = 0;
  const maxAttempts = 4;

  while (attempts < maxAttempts) {
    try {
      console.log(`\nAttempt ${attempts + 1}/${maxAttempts}`);

      let prompt = buildPrompt(assignment);

      if (attempts === 1) {
        prompt += `\n\n IMPROVE:
- Avoid repetition
- Use ALL concepts
- Make questions more detailed`;
      } else if (attempts === 2) {
        prompt += `\n\n STRICT:
- No duplicate questions
- Each question must be unique
- Include different concepts in each question`;
      } else if (attempts === 3) {
        prompt += `\n\n FINAL:
- Make questions realistic exam-level
- Avoid generic phrasing
- Add variety in verbs`;
      }

      const raw = await generateWithAI(prompt);
      const parsed = parseAIResponse(raw);

      const isValid = validateAIOutput(parsed, assignment);
      const noDuplicates = checkDuplicates(parsed);
      const hasConcepts = checkConceptCoverage(parsed, assignment.concepts);
      const goodQuality = checkQuality(parsed);

      if (isValid && noDuplicates && hasConcepts && goodQuality) {
        console.log("Perfect AI response");
        return parsed;
      }

      console.log("Failed quality checks:", {
        isValid,
        noDuplicates,
        hasConcepts,
        goodQuality,
      });

    } catch (err: any) {
      console.log(" Error:", err.message);
    }

    attempts++;
    await new Promise((res) => setTimeout(res, 2000 * attempts));
  }

  console.log("All AI attempts failed → fallback");
  return generateFallbackPaper(assignment);
};


const generateFallbackPaper = (assignment: any) => {
  const concepts = assignment.concepts || ["fundamentals"];

  const verbs = ["Explain", "Compare", "Analyze", "Evaluate"];

  const generateQuestion = (
    concept: string,
    difficulty: string,
    index: number
  ) => {
    const verb = verbs[index % verbs.length];

    return {
      text: `${verb} ${concept} with a practical example.`,
      difficulty,
      marks: assignment.marksPerQuestion[difficulty],
      type: "theory",
    };
  };

  const questions: any[] = [];

  for (let i = 0; i < assignment.difficulty.easy; i++) {
    questions.push(generateQuestion(concepts[i % concepts.length], "easy", i));
  }

  for (let i = 0; i < assignment.difficulty.medium; i++) {
    questions.push(generateQuestion(concepts[i % concepts.length], "medium", i));
  }

  for (let i = 0; i < assignment.difficulty.hard; i++) {
    questions.push(generateQuestion(concepts[i % concepts.length], "hard", i));
  }

  return {
    studentInfo: {
      name: "",
      rollNumber: "",
      section: "",
      class: "",
      subject: assignment.topic,
      date: "",
    },
    instructions: assignment.instructions,
    sections: [
      {
        title: "Section A",
        instruction: "Attempt all questions",
        questions: questions.filter((q) => q.difficulty === "easy"),
      },
      {
        title: "Section B",
        instruction: "Attempt any questions",
        questions: questions.filter((q) => q.difficulty === "medium"),
      },
      {
        title: "Section C",
        instruction: "Attempt any questions",
        questions: questions.filter((q) => q.difficulty === "hard"),
      },
    ],
  };
};


export const assignmentWorker = new Worker(
  "assignmentQueue",
  async (job: Job) => {
    const { assignmentId } = job.data;

    if (!assignmentId) throw new Error("No assignmentId");

    console.log(` Processing: ${assignmentId}`);
    const startTime = Date.now();

    try {
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) throw new Error("Assignment not found");

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "processing",
      });

      emitAssignmentUpdate(assignmentId, { status: "processing" });

      const finalPaper = await generateValidAIResponse(assignment);

      // sanitize hints
      if (!assignment.includeHints) {
        finalPaper.sections.forEach((s: any) =>
          s.questions.forEach((q: any) => delete q.hint)
        );
      }

      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "completed",
        paper: finalPaper,
        processingTime: Date.now() - startTime,
      });

      emitAssignmentUpdate(assignmentId, {
        status: "completed",
        data: finalPaper,
      });

      console.log(" Completed");

    } catch (error: any) {
      console.error(" Worker error:", error.message);

      await Assignment.findByIdAndUpdate(job.data.assignmentId, {
        status: "failed",
        error: error.message,
      });

      emitAssignmentUpdate(job.data.assignmentId, {
        status: "failed",
        error: error.message,
      });

      throw error;
    }
  },
  {
    connection: { url: env.REDIS_URL },
    concurrency: 5,
  }
);

assignmentWorker.on("completed", (job) => {
  console.log(` Job ${job.id} done`);
});

assignmentWorker.on("failed", (job, err) => {
  console.log(` Failed:`, err.message);
});

console.log("Worker running...");

