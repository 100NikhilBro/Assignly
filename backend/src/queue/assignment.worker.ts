import { Worker } from "bullmq";
import { Assignment } from "../modules/assignemnt/assignment.model";
import { env } from "../config/env";

export const assignmentWorker = new Worker(
  "assignmentQueue",
  async (job) => {
    const { assignmentId } = job.data;

    console.log("Processing assignment:", assignmentId);

    // Stp1: mark processing
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: "processing",
    });

    // Stp2: FAKE AI generation (temporary) - That we changed after the integration of Ai 
    const generatedPaper = {
      sections: [
        {
          title: "Section A",
          questions: [
            {
              text: "What is Deadlock?",
              difficulty: "easy",
              marks: 2,
            },
          ],
        },
      ],
    };

    //Stp3: save result
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: "completed",
      paper: generatedPaper,
    });

    console.log("Completed:", assignmentId);
  },
  {
    connection: {
        url:env.REDIS_URL // same here as well that we do in assignment.queue.ts
    },
  }
);