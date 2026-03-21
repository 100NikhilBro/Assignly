import { Redis } from "@upstash/redis";
import { env } from "./env";

let redisConnection: any = null;

const initRedis = async () => {
  try {
    if (!env.REDIS_URL) {
      console.warn("REDIS_URL not defined");
      return null;
    }

    if (!env.UPSTASH_REDIS_TOKEN) {
      console.warn("UPSTASH_REDIS_TOKEN not defined");
      return null;
    }

    
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


    await client.ping();
    console.log("Redis connected to Upstash");
    return client;
  } catch (err: any) {
    console.error("Redis error:", err.message);
    console.warn("Redis not available, using in-memory fallback");
    return null;
  }
};


let initialized = false;

export const getRedisConnection = async () => {
  if (!initialized) {
    redisConnection = await initRedis();
    initialized = true;
  }
  return redisConnection;
};


export { redisConnection };
