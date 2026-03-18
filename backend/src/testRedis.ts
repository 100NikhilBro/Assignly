import { redisConnection } from "./config/redis";

(async () => {
  try {
    await redisConnection.set("test", "hello");
    const value = await redisConnection.get("test");

    console.log("Redis working:", value);
    process.exit(0);
  } catch (error) {
    console.error("Redis error:", error);
  }
})();