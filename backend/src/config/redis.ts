import { Redis } from "ioredis";
import { env } from "./env";

if (!env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

export const redisConnection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,

  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redisConnection.on("connect", () => {
  console.log("Redis connected");
});

redisConnection.on("error", (err) => {
  console.error("Redis error:", err.message);
});