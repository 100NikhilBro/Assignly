// // // // // import { Redis } from "ioredis";
// // // // // import { env } from "./env";

// // // // // if (!env.REDIS_URL) {
// // // // //   throw new Error("REDIS_URL is not defined");
// // // // // }

// // // // // export const redisConnection = new Redis(env.REDIS_URL, {
// // // // //   maxRetriesPerRequest: null,

// // // // //   retryStrategy: (times) => Math.min(times * 50, 2000),
// // // // // });

// // // // // redisConnection.on("connect", () => {
// // // // //   console.log("Redis connected");
// // // // // });

// // // // // redisConnection.on("error", (err) => {
// // // // //   console.error("Redis error:", err.message);
// // // // // });





// // // // import { Redis } from "ioredis";
// // // // import { env } from "./env";

// // // // if (!env.REDIS_URL) {
// // // //   throw new Error("REDIS_URL is not defined");
// // // // }

// // // // // Configure Redis connection with SSL support
// // // // const redisOptions: any = {
// // // //   maxRetriesPerRequest: null,
// // // //   retryStrategy: (times:any) => Math.min(times * 50, 2000),
// // // // };

// // // // // 🔥 IMPORTANT: Add TLS options for SSL connection (rediss://)
// // // // if (env.REDIS_URL.startsWith("rediss://")) {
// // // //   redisOptions.tls = {
// // // //     rejectUnauthorized: false, // Required for self-signed certs
// // // //   };
// // // //   console.log("🔒 Redis SSL mode enabled");
// // // // }

// // // // export const redisConnection = new Redis(env.REDIS_URL, redisOptions);

// // // // redisConnection.on("connect", () => {
// // // //   console.log("✅ Redis connected");
// // // // });

// // // // redisConnection.on("error", (err) => {
// // // //   console.error("❌ Redis error:", err.message);
// // // // });




// // // import { Redis } from "ioredis";
// // // import { env } from "./env";

// // // if (!env.REDIS_URL) {
// // //   throw new Error("REDIS_URL is not defined");
// // // }

// // // // Upstash Redis connection
// // // const redisOptions: any = {
// // //   maxRetriesPerRequest: null,
// // //   retryStrategy: (times:any) => Math.min(times * 50, 2000),
// // // };

// // // // Upstash uses redis:// but requires TLS
// // // // Add tls options for secure connection
// // // if (env.REDIS_URL.startsWith("redis://")) {
// // //   redisOptions.tls = {
// // //     rejectUnauthorized: false,
// // //   };
// // //   console.log("🔒 Redis TLS enabled for Upstash");
// // // }

// // // export const redisConnection = new Redis(env.REDIS_URL, redisOptions);

// // // redisConnection.on("connect", () => {
// // //   console.log("✅ Redis connected to Upstash");
// // // });

// // // redisConnection.on("error", (err) => {
// // //   console.error("❌ Redis error:", err.message);
// // // });



// // import { Redis } from "@upstash/redis";
// // import { env } from "./env";

// // if (!env.REDIS_URL) {
// //   throw new Error("REDIS_URL is not defined");
// // }

// // // Upstash REST API connection
// // export const redisConnection = new Redis({
// //   url: env.REDIS_URL,
// //   token: env.UPSTASH_REDIS_TOKEN, // Add this env variable
// // });

// // redisConnection.ping().then(() => {
// //   console.log("✅ Redis connected to Upstash");
// // }).catch((err) => {
// //   console.error("❌ Redis error:", err.message);
// // });


// import { Redis } from "@upstash/redis";
// import { env } from "./env";

// if (!env.REDIS_URL) {
//   throw new Error("REDIS_URL is not defined");
// }

// if (!env.UPSTASH_REDIS_TOKEN) {
//   throw new Error("UPSTASH_REDIS_TOKEN is not defined");
// }

// export const redisConnection = new Redis({
//   url: env.REDIS_URL,
//   token: env.UPSTASH_REDIS_TOKEN,
// });

// // Test connection
// redisConnection.ping().then(() => {
//   console.log("✅ Redis connected to Upstash");
// }).catch((err) => {
//   console.error("❌ Redis error:", err.message);
// });



import { Redis } from "@upstash/redis";
import { env } from "./env";

let redisConnection: any = null;

// Initialize Redis connection
const initRedis = async () => {
  try {
    if (!env.REDIS_URL) {
      console.warn("⚠️ REDIS_URL not defined");
      return null;
    }

    if (!env.UPSTASH_REDIS_TOKEN) {
      console.warn("⚠️ UPSTASH_REDIS_TOKEN not defined");
      return null;
    }

    // Convert URL if needed
    let redisUrl = env.REDIS_URL;
    if (redisUrl.startsWith("rediss://")) {
      redisUrl = redisUrl.replace("rediss://", "https://");
    }
    if (redisUrl.startsWith("redis://")) {
      redisUrl = redisUrl.replace("redis://", "https://");
    }
    redisUrl = redisUrl.replace(/:6379$/, "");

    const client = new Redis({
      url: redisUrl,
      token: env.UPSTASH_REDIS_TOKEN,
    });

    // Test connection
    await client.ping();
    console.log("✅ Redis connected to Upstash");
    return client;
  } catch (err: any) {
    console.error("❌ Redis error:", err.message);
    console.warn("⚠️ Redis not available, using in-memory fallback");
    return null;
  }
};

// Initialize and export
let initialized = false;

export const getRedisConnection = async () => {
  if (!initialized) {
    redisConnection = await initRedis();
    initialized = true;
  }
  return redisConnection;
};

// For backward compatibility
export { redisConnection };
