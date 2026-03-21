// import { Redis } from "ioredis";
// import { env } from "./env";

// if (!env.REDIS_URL) {
//   throw new Error("REDIS_URL is not defined");
// }

// export const redisConnection = new Redis(env.REDIS_URL, {
//   maxRetriesPerRequest: null,

//   retryStrategy: (times) => Math.min(times * 50, 2000),
// });

// redisConnection.on("connect", () => {
//   console.log("Redis connected");
// });

// redisConnection.on("error", (err) => {
//   console.error("Redis error:", err.message);
// });





import { Redis } from "ioredis";
import { env } from "./env";

if (!env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

// Configure Redis connection with SSL support
const redisOptions: any = {
  maxRetriesPerRequest: null,
  retryStrategy: (times:any) => Math.min(times * 50, 2000),
};

// 🔥 IMPORTANT: Add TLS options for SSL connection (rediss://)
if (env.REDIS_URL.startsWith("rediss://")) {
  redisOptions.tls = {
    rejectUnauthorized: false, // Required for self-signed certs
  };
  console.log("🔒 Redis SSL mode enabled");
}

export const redisConnection = new Redis(env.REDIS_URL, redisOptions);

redisConnection.on("connect", () => {
  console.log("✅ Redis connected");
});

redisConnection.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});