import { getRedisConnection } from "../config/redis";

const GUEST_CREDITS_KEY = "guest:credits:";
const DEFAULT_GUEST_CREDITS = 3;
const SESSION_TTL = 24 * 60 * 60;


const parseCredits = (value: unknown): number => {
  const parsed =
    typeof value === "string"
      ? parseInt(value, 10)
      : typeof value === "number"
      ? value
      : DEFAULT_GUEST_CREDITS;

  return isNaN(parsed) ? DEFAULT_GUEST_CREDITS : parsed;
};



export const getGuestCredits = async (sessionId: string): Promise<number> => {
  try {
    const redis = await getRedisConnection();
    const key = `${GUEST_CREDITS_KEY}${sessionId}`;

    if (redis) {
      let credits = await redis.get(key);

      // first time init
      if (credits === null) {
        await redis.set(key, DEFAULT_GUEST_CREDITS, {
          EX: SESSION_TTL,
          NX: true,
        });
        return DEFAULT_GUEST_CREDITS;
      }

      return parseCredits(credits);
    }

    console.warn("Redis not available, using fallback memory");
    return DEFAULT_GUEST_CREDITS;

  } catch (error) {
    console.error("Redis get error:", error);
    return DEFAULT_GUEST_CREDITS;
  }
};


export const handleGuestCredits = async (sessionId: string): Promise<boolean> => {
  try {
    const redis = await getRedisConnection();
    const key = `${GUEST_CREDITS_KEY}${sessionId}`;

    if (!redis) {
      console.warn("Redis not available, skipping credit control");
      return true;
    }

    // ensure key exists
    await redis.set(key, DEFAULT_GUEST_CREDITS, {
      EX: SESSION_TTL,
      NX: true,
    });

    const remaining = await redis.decr(key);

    if (remaining < 0) {
      // rollback
      await redis.incr(key);
      return false;
    }

    return true;

  } catch (error) {
    console.error("Redis deduct error:", error);
    return false;
  }
};


export const getGuestCreditsInfo = async (sessionId: string) => {
  try {
    const redis = await getRedisConnection();
    const key = `${GUEST_CREDITS_KEY}${sessionId}`;

    if (redis) {
      const [credits, ttl] = await Promise.all([
        redis.get(key),
        redis.ttl(key),
      ]);

      return {
        credits: credits ? parseCredits(credits) : DEFAULT_GUEST_CREDITS,
        ttl: ttl > 0 ? ttl : SESSION_TTL,
      };
    }

    return {
      credits: DEFAULT_GUEST_CREDITS,
      ttl: SESSION_TTL,
    };

  } catch (error) {
    console.error("Credits info error:", error);

    return {
      credits: DEFAULT_GUEST_CREDITS,
      ttl: SESSION_TTL,
    };
  }
};
