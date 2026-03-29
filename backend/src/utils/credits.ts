
// import { getRedisConnection } from "../config/redis";

// const GUEST_CREDITS_KEY = "guest:credits:";
// const DEFAULT_GUEST_CREDITS = 3;
// const SESSION_TTL = 24 * 60 * 60;

// const memoryStorage = new Map<string, { credits: number; ttl: number }>();

// const parseCredits = (value: unknown): number => {
//   if (typeof value === "string") return parseInt(value, 10);
//   if (typeof value === "number") return value;
//   return DEFAULT_GUEST_CREDITS;
// };


// export const getGuestCredits = async (sessionId: string): Promise<number> => {
//   try {
//     const redis = await getRedisConnection();

//     if (redis) {
//       const key = `${GUEST_CREDITS_KEY}${sessionId}`;
//       const credits = await redis.get(key);

//       if (!credits) {
//         await redis.setex(key, SESSION_TTL, DEFAULT_GUEST_CREDITS);
//         return DEFAULT_GUEST_CREDITS;
//       }

//       return parseCredits(credits);
//     }

//     const memData = memoryStorage.get(sessionId);

//     if (!memData) {
//       memoryStorage.set(sessionId, {
//         credits: DEFAULT_GUEST_CREDITS,
//         ttl: Date.now() + SESSION_TTL * 1000,
//       });
//       return DEFAULT_GUEST_CREDITS;
//     }

//     return memData.credits;

//   } catch (error) {
//     console.error("Redis get error:", error);
//     return DEFAULT_GUEST_CREDITS;
//   }
// };


// export const handleGuestCredits = async (sessionId: string): Promise<boolean> => {
//   try {
//     const redis = await getRedisConnection();

//     if (redis) {
//       const key = `${GUEST_CREDITS_KEY}${sessionId}`;
//       const current = await redis.get(key);

//       let credits = parseCredits(current);

//       if (!current) credits = DEFAULT_GUEST_CREDITS;

//       if (credits <= 0) return false;

//       await redis.setex(key, SESSION_TTL, credits - 1);
//       return true;
//     }

//     const memData = memoryStorage.get(sessionId);

//     if (!memData) {
//       memoryStorage.set(sessionId, {
//         credits: DEFAULT_GUEST_CREDITS - 1,
//         ttl: Date.now() + SESSION_TTL * 1000,
//       });
//       return true;
//     }

//     if (memData.credits <= 0) return false;

//     memData.credits -= 1;
//     memoryStorage.set(sessionId, memData);

//     return true;

//   } catch (error) {
//     console.error("Redis deduct error:", error);
//     return false;
//   }
// };


// export const getGuestCreditsInfo = async (sessionId: string) => {
//   try {
//     const redis = await getRedisConnection();

//     if (redis) {
//       const key = `${GUEST_CREDITS_KEY}${sessionId}`;
//       const credits = await redis.get(key);
//       const ttl = await redis.ttl(key);

//       return {
//         credits: credits ? parseCredits(credits) : DEFAULT_GUEST_CREDITS,
//         ttl: ttl > 0 ? ttl : SESSION_TTL,
//       };
//     }

//     const memData = memoryStorage.get(sessionId);

//     if (!memData) {
//       return { credits: DEFAULT_GUEST_CREDITS, ttl: SESSION_TTL };
//     }

//     return {
//       credits: memData.credits,
//       ttl: Math.max(0, Math.floor((memData.ttl - Date.now()) / 1000)),
//     };

//   } catch (error) {
//     return { credits: DEFAULT_GUEST_CREDITS, ttl: SESSION_TTL };
//   }
// };


    




import { getRedisConnection } from "../config/redis";

const GUEST_CREDITS_KEY = "guest:credits:";
const DEFAULT_GUEST_CREDITS = 3;
const SESSION_TTL = 24 * 60 * 60;

// safer parse
const parseCredits = (value: unknown): number => {
  const parsed =
    typeof value === "string"
      ? parseInt(value, 10)
      : typeof value === "number"
      ? value
      : DEFAULT_GUEST_CREDITS;

  return isNaN(parsed) ? DEFAULT_GUEST_CREDITS : parsed;
};

// =========================
// 🎯 GET CREDITS
// =========================

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

    // ⚠️ fallback (dev only)
    console.warn("⚠️ Redis not available, using fallback memory");
    return DEFAULT_GUEST_CREDITS;

  } catch (error) {
    console.error("Redis get error:", error);
    return DEFAULT_GUEST_CREDITS;
  }
};

// =========================
// 🔐 ATOMIC DEDUCT
// =========================

export const handleGuestCredits = async (sessionId: string): Promise<boolean> => {
  try {
    const redis = await getRedisConnection();
    const key = `${GUEST_CREDITS_KEY}${sessionId}`;

    if (!redis) {
      console.warn("⚠️ Redis not available, skipping credit control");
      return true;
    }

    // ensure key exists
    await redis.set(key, DEFAULT_GUEST_CREDITS, {
      EX: SESSION_TTL,
      NX: true,
    });

    // 🔥 atomic decrement
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

// =========================
// 📊 INFO
// =========================

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
