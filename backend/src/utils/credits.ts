

// // import { getRedisConnection } from "../config/redis";

// // const GUEST_CREDITS_KEY = "guest:credits:";
// // const DEFAULT_GUEST_CREDITS = 3;
// // const SESSION_TTL = 24 * 60 * 60; // 24 hours in seconds


// // const memoryStorage = new Map<string, { credits: number; ttl: number }>();


// // const parseCredits = (value: unknown): number => {
// //   if (typeof value === 'string') {
// //     return parseInt(value, 10);
// //   }
// //   if (typeof value === 'number') {
// //     return value;
// //   }
// //   return DEFAULT_GUEST_CREDITS;
// // };


// // export const getGuestCredits = async (sessionId: string): Promise<number> => {
// //   try {
// //     const redis = await getRedisConnection();
    
// //     if (redis) {
// //       const key = `${GUEST_CREDITS_KEY}${sessionId}`;
// //       const credits = await redis.get(key);
      
// //       if (credits === null || credits === undefined) {
// //         await redis.setex(key, SESSION_TTL, DEFAULT_GUEST_CREDITS);
// //         return DEFAULT_GUEST_CREDITS;
// //       }
      
// //       return parseCredits(credits);
// //     }
    

// //     const memData = memoryStorage.get(sessionId);
// //     if (!memData) {
// //       memoryStorage.set(sessionId, { credits: DEFAULT_GUEST_CREDITS, ttl: Date.now() + SESSION_TTL * 1000 });
// //       return DEFAULT_GUEST_CREDITS;
// //     }
// //     return memData.credits;
    
// //   } catch (error) {
// //     console.error("Redis get guest credits error:", error);
// //     return DEFAULT_GUEST_CREDITS;
// //   }
// // };


// // export const handleGuestCredits = async (sessionId: string): Promise<boolean> => {
// //   try {
// //     const redis = await getRedisConnection();
    
// //     if (redis) {
// //       const key = `${GUEST_CREDITS_KEY}${sessionId}`;
// //       const currentCredits = await redis.get(key);
      
// //       if (currentCredits === null || currentCredits === undefined) {
// //         await redis.setex(key, SESSION_TTL, DEFAULT_GUEST_CREDITS - 1);
// //         return true;
// //       }
      
// //       const credits = parseCredits(currentCredits);
// //       if (credits <= 0) return false;
      
// //       const newCredits = credits - 1;
// //       await redis.setex(key, SESSION_TTL, newCredits);
// //       return true;
// //     }

// //     const memData = memoryStorage.get(sessionId);
// //     if (!memData) {
// //       memoryStorage.set(sessionId, { credits: DEFAULT_GUEST_CREDITS - 1, ttl: Date.now() + SESSION_TTL * 1000 });
// //       return true;
// //     }
    
// //     if (memData.credits <= 0) return false;
// //     memData.credits -= 1;
// //     memoryStorage.set(sessionId, memData);
// //     return true;
    
// //   } catch (error) {
// //     console.error("Redis handle guest credits error:", error);
// //     return false;
// //   }
// // };


// // export const resetGuestCredits = async (sessionId: string): Promise<void> => {
// //   try {
// //     const redis = await getRedisConnection();
    
// //     if (redis) {
// //       await redis.setex(`${GUEST_CREDITS_KEY}${sessionId}`, SESSION_TTL, DEFAULT_GUEST_CREDITS);
// //     } else {
// //       memoryStorage.set(sessionId, { credits: DEFAULT_GUEST_CREDITS, ttl: Date.now() + SESSION_TTL * 1000 });
// //     }
// //   } catch (error) {
// //     console.error("Redis reset guest credits error:", error);
// //   }
// // };


// // export const getGuestCreditsInfo = async (sessionId: string): Promise<{
// //   credits: number;
// //   ttl: number;
// // }> => {
// //   try {
// //     const redis = await getRedisConnection();
    
// //     if (redis) {
// //       const key = `${GUEST_CREDITS_KEY}${sessionId}`;
// //       const credits = await redis.get(key);
// //       const ttl = await redis.ttl(key);
      
// //       return {
// //         credits: credits ? parseCredits(credits) : DEFAULT_GUEST_CREDITS,
// //         ttl: typeof ttl === 'number' && ttl > 0 ? ttl : SESSION_TTL,
// //       };
// //     }
    

// //     const memData = memoryStorage.get(sessionId);
// //     if (!memData) {
// //       return { credits: DEFAULT_GUEST_CREDITS, ttl: SESSION_TTL };
// //     }
// //     const remainingTTL = Math.max(0, Math.floor((memData.ttl - Date.now()) / 1000));
// //     return { credits: memData.credits, ttl: remainingTTL || SESSION_TTL };
    
// //   } catch (error) {
// //     console.error("Redis get guest credits info error:", error);
// //     return { credits: DEFAULT_GUEST_CREDITS, ttl: SESSION_TTL };
// //   }
// // };


// // export const getAllGuestSessions = async (): Promise<string[]> => {
// //   try {
// //     const redis = await getRedisConnection();
    
// //     if (redis) {
// //       const keys = await redis.keys(`${GUEST_CREDITS_KEY}*`);
// //       if (!keys || !Array.isArray(keys)) return [];
// //       return keys.map(key => key.replace(GUEST_CREDITS_KEY, ""));
// //     }
    
// //     return Array.from(memoryStorage.keys());
    
// //   } catch (error) {
// //     console.error("Redis get all guest sessions error:", error);
// //     return [];
// //   }
// // };



// // ======================================================


// import { getRedisConnection } from "../config/redis";

// const GUEST_CREDITS_KEY = "guest:credits:";
// const DEFAULT_GUEST_CREDITS = 3;
// const SESSION_TTL = 24 * 60 * 60; // 24 hours

// const memoryStorage = new Map<string, { credits: number; ttl: number }>();

// const parseCredits = (value: unknown): number => {
//   if (typeof value === "string") return parseInt(value, 10);
//   if (typeof value === "number") return value;
//   return DEFAULT_GUEST_CREDITS;
// };

// // =========================
// // ✅ GET CREDITS (NO CHANGE)
// // =========================
// export const getGuestCredits = async (sessionId: string): Promise<number> => {
//   try {
//     const redis = await getRedisConnection();

//     if (redis) {
//       const key = `${GUEST_CREDITS_KEY}${sessionId}`;
//       const credits = await redis.get(key);

//       if (credits === null || credits === undefined) {
//         await redis.setex(key, SESSION_TTL, DEFAULT_GUEST_CREDITS);
//         return DEFAULT_GUEST_CREDITS;
//       }

//       return parseCredits(credits);
//     }

//     // fallback memory
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
//     console.error("Redis get guest credits error:", error);
//     return DEFAULT_GUEST_CREDITS;
//   }
// };

// // =========================
// // 💥 DEDUCT CREDITS (USED IN WORKER)
// // =========================
// export const handleGuestCredits = async (sessionId: string): Promise<boolean> => {
//   try {
//     const redis = await getRedisConnection();

//     if (redis) {
//       const key = `${GUEST_CREDITS_KEY}${sessionId}`;
//       const currentCredits = await redis.get(key);

//       let credits = parseCredits(currentCredits);

//       // first time user
//       if (currentCredits === null || currentCredits === undefined) {
//         credits = DEFAULT_GUEST_CREDITS;
//       }

//       if (credits <= 0) return false;

//       const newCredits = credits - 1;

//       await redis.setex(key, SESSION_TTL, newCredits);

//       return true;
//     }

//     // fallback memory
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
//     console.error("Redis handle guest credits error:", error);
//     return false;
//   }
// };

// // =========================
// // OPTIONAL HELPERS
// // =========================
// export const resetGuestCredits = async (sessionId: string): Promise<void> => {
//   try {
//     const redis = await getRedisConnection();

//     if (redis) {
//       await redis.setex(
//         `${GUEST_CREDITS_KEY}${sessionId}`,
//         SESSION_TTL,
//         DEFAULT_GUEST_CREDITS
//       );
//     } else {
//       memoryStorage.set(sessionId, {
//         credits: DEFAULT_GUEST_CREDITS,
//         ttl: Date.now() + SESSION_TTL * 1000,
//       });
//     }
//   } catch (error) {
//     console.error("Redis reset guest credits error:", error);
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
//         ttl: typeof ttl === "number" && ttl > 0 ? ttl : SESSION_TTL,
//       };
//     }

//     const memData = memoryStorage.get(sessionId);

//     if (!memData) {
//       return { credits: DEFAULT_GUEST_CREDITS, ttl: SESSION_TTL };
//     }

//     const remainingTTL = Math.max(
//       0,
//       Math.floor((memData.ttl - Date.now()) / 1000)
//     );

//     return {
//       credits: memData.credits,
//       ttl: remainingTTL || SESSION_TTL,
//     };

//   } catch (error) {
//     console.error("Redis get guest credits info error:", error);
//     return { credits: DEFAULT_GUEST_CREDITS, ttl: SESSION_TTL };
//   }
// };

// export const getAllGuestSessions = async (): Promise<string[]> => {
//   try {
//     const redis = await getRedisConnection();

//     if (redis) {
//       const keys = await redis.keys(`${GUEST_CREDITS_KEY}*`);
//       if (!keys || !Array.isArray(keys)) return [];
//       return keys.map((key) => key.replace(GUEST_CREDITS_KEY, ""));
//     }

//     return Array.from(memoryStorage.keys());

//   } catch (error) {
//     console.error("Redis get all guest sessions error:", error);
//     return [];
//   }
// };





// ===========New===============

import { getRedisConnection } from "../config/redis";

const GUEST_CREDITS_KEY = "guest:credits:";
const DEFAULT_GUEST_CREDITS = 3;
const SESSION_TTL = 24 * 60 * 60;

const memoryStorage = new Map<string, { credits: number; ttl: number }>();

const parseCredits = (value: unknown): number => {
  if (typeof value === "string") return parseInt(value, 10);
  if (typeof value === "number") return value;
  return DEFAULT_GUEST_CREDITS;
};

// =========================
// GET CREDITS
// =========================
export const getGuestCredits = async (sessionId: string): Promise<number> => {
  try {
    const redis = await getRedisConnection();

    if (redis) {
      const key = `${GUEST_CREDITS_KEY}${sessionId}`;
      const credits = await redis.get(key);

      if (!credits) {
        await redis.setex(key, SESSION_TTL, DEFAULT_GUEST_CREDITS);
        return DEFAULT_GUEST_CREDITS;
      }

      return parseCredits(credits);
    }

    const memData = memoryStorage.get(sessionId);

    if (!memData) {
      memoryStorage.set(sessionId, {
        credits: DEFAULT_GUEST_CREDITS,
        ttl: Date.now() + SESSION_TTL * 1000,
      });
      return DEFAULT_GUEST_CREDITS;
    }

    return memData.credits;

  } catch (error) {
    console.error("Redis get error:", error);
    return DEFAULT_GUEST_CREDITS;
  }
};

// =========================
// 💥 DEDUCT CREDIT (MAIN FIX)
// =========================
export const handleGuestCredits = async (sessionId: string): Promise<boolean> => {
  try {
    const redis = await getRedisConnection();

    if (redis) {
      const key = `${GUEST_CREDITS_KEY}${sessionId}`;
      const current = await redis.get(key);

      let credits = parseCredits(current);

      if (!current) credits = DEFAULT_GUEST_CREDITS;

      if (credits <= 0) return false;

      await redis.setex(key, SESSION_TTL, credits - 1);
      return true;
    }

    const memData = memoryStorage.get(sessionId);

    if (!memData) {
      memoryStorage.set(sessionId, {
        credits: DEFAULT_GUEST_CREDITS - 1,
        ttl: Date.now() + SESSION_TTL * 1000,
      });
      return true;
    }

    if (memData.credits <= 0) return false;

    memData.credits -= 1;
    memoryStorage.set(sessionId, memData);

    return true;

  } catch (error) {
    console.error("Redis deduct error:", error);
    return false;
  }
};

// =========================
// INFO
// =========================
export const getGuestCreditsInfo = async (sessionId: string) => {
  try {
    const redis = await getRedisConnection();

    if (redis) {
      const key = `${GUEST_CREDITS_KEY}${sessionId}`;
      const credits = await redis.get(key);
      const ttl = await redis.ttl(key);

      return {
        credits: credits ? parseCredits(credits) : DEFAULT_GUEST_CREDITS,
        ttl: ttl > 0 ? ttl : SESSION_TTL,
      };
    }

    const memData = memoryStorage.get(sessionId);

    if (!memData) {
      return { credits: DEFAULT_GUEST_CREDITS, ttl: SESSION_TTL };
    }

    return {
      credits: memData.credits,
      ttl: Math.max(0, Math.floor((memData.ttl - Date.now()) / 1000)),
    };

  } catch (error) {
    return { credits: DEFAULT_GUEST_CREDITS, ttl: SESSION_TTL };
  }
};


    
