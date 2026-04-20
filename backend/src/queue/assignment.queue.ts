import { Queue } from "bullmq";

const connection = {
  host: "daring-amoeba-80260.upstash.io",
  port: 6379,
  username: "default",
  password: process.env.REDIS_PASSWORD,
  tls: {}
};


    // Add Console - for debugging

console.log("Initializing Queue...");
console.log("Redis Password exists:", !!process.env.REDIS_PASSWORD);

export const assignmentQueue = new Queue("assignmentQueue", {
  connection
});


assignmentQueue.on("error", (err: any) => {
  console.error(" Queue error:", err);
});

assignmentQueue.on("waiting", (job: any) => {
  console.log("Job waiting:", job?.id);
});

console.log("Queue initialized (sync)");
