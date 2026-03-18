import { Worker, Job } from "bullmq";
import { env } from "../config/env";
import { Assignment } from "../modules/assignemnt/assignment.model";

import { buildPrompt } from "../services/ai/promptBuilder";
import { generateWithAI } from "../services/ai/aiOrchestrator.service";

export const assignmentWorker = new Worker(
  "assignmentQueue",
  async (job: Job) => {
    const assignmentId = job.data?.assignmentId;

    if (!assignmentId) {
      throw new Error("Invalid job data: assignmentId missing");
    }

    console.log(`Processing assignment: ${assignmentId}`);

    try {
      // Fetch assignment
      const assignment = await Assignment.findById(assignmentId);

      if (!assignment) {
        throw new Error("Assignment not found");
      }

      // Update status (only once)
      if (assignment.status === "pending") {
        await Assignment.findByIdAndUpdate(assignmentId, {
          status: "processing",
        });
      }


      //       //   //  AI CALL (later)
// //     //   const generatedPaper = {
// //     //     sections: [
// //     //       {
// //     //         title: "Section A",
// //     //         questions: [
// //     //           {
// //     //             text: "What is Deadlock?",
// //     //             difficulty: "easy",
// //     //             marks: 2,
// //     //           },
// //     //         ],
// //     //       },
// //     //     ],
// //     //   };

      // Build AI prompt
      const prompt = buildPrompt(assignment);

      // AI CALL (Gemini → Groq fallback + timeout)
      const aiResponse = await Promise.race<string>([
        generateWithAI(prompt),
        new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error("AI timeout")), 10000)
        ),
      ]);

      //  Empty response check
      if (!aiResponse || aiResponse.trim().length < 10) {
        throw new Error("Empty AI response");
      }

      // Clean markdown (```json)
      const clean = aiResponse.replace(/```json|```/g, "").trim();

      let parsed: any;

      // Safe JSON parsing
      try {
        parsed = JSON.parse(clean);
      } catch (err) {
        console.error("❌ JSON parse failed:", clean);
        throw new Error("Invalid JSON from AI");
      }

      // Basic validation
      if (!parsed.sections || !Array.isArray(parsed.sections)) {
        throw new Error("Invalid paper structure");
      }

      // Save result
      await Assignment.findByIdAndUpdate(assignmentId, {
        $set: {
          status: "completed",
          paper: parsed,
        },
      });

      console.log(`Completed: ${assignmentId}`);

    } catch (error) {
      console.error(`Worker error for ${assignmentId}:`, error);
      throw error; // triggers retry
    }
  },
  {
    connection: {
      url: env.REDIS_URL,
    },
  }
);

// Final failure handler (after retries)
assignmentWorker.on("failed", async (job: Job | undefined) => {
  console.log(`Job failed after retries: ${job?.id}`);

  if (job && job.attemptsMade >= (job.opts.attempts || 1)) {
    await Assignment.findByIdAndUpdate(job.data.assignmentId, {
      status: "failed", // internal use only
    });
  }
});