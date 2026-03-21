// let guestCredits = 3;

// export const handleGuestCredits = () => {
//   if (guestCredits <= 0) {
//     throw new Error("Guest credits exhausted");
//   }

//   guestCredits--;
// };

// // reset (optional for testing)
// export const resetGuestCredits = () => {
//   guestCredits = 3;
// };



import { redisConnection } from "../config/redis";

const GUEST_CREDITS_KEY = "guest:credits:";
const DEFAULT_GUEST_CREDITS = 3;
const SESSION_TTL = 24 * 60 * 60; // 24 hours in seconds

// Get guest credits from Redis
export const getGuestCredits = async (sessionId: string): Promise<number> => {
  try {
    const credits = await redisConnection.get(`${GUEST_CREDITS_KEY}${sessionId}`);
    
    if (credits === null) {
      // New session, set default credits
      await redisConnection.setex(
        `${GUEST_CREDITS_KEY}${sessionId}`,
        SESSION_TTL,
        DEFAULT_GUEST_CREDITS
      );
      return DEFAULT_GUEST_CREDITS;
    }
    
    return parseInt(credits);
  } catch (error) {
    console.error("Redis get guest credits error:", error);
    return DEFAULT_GUEST_CREDITS; // Fallback
  }
};

// Handle guest credit usage (decrement)
export const handleGuestCredits = async (sessionId: string): Promise<boolean> => {
  try {
    const key = `${GUEST_CREDITS_KEY}${sessionId}`;
    const currentCredits = await redisConnection.get(key);
    
    if (currentCredits === null) {
      // New session, set default and decrement
      await redisConnection.setex(key, SESSION_TTL, DEFAULT_GUEST_CREDITS - 1);
      return true;
    }
    
    const credits = parseInt(currentCredits);
    
    if (credits <= 0) {
      return false;
    }
    
    // Decrement credits
    const newCredits = credits - 1;
    await redisConnection.setex(key, SESSION_TTL, newCredits);
    
    return true;
  } catch (error) {
    console.error("Redis handle guest credits error:", error);
    return false;
  }
};

// Reset guest credits for a session
export const resetGuestCredits = async (sessionId: string): Promise<void> => {
  try {
    await redisConnection.setex(
      `${GUEST_CREDITS_KEY}${sessionId}`,
      SESSION_TTL,
      DEFAULT_GUEST_CREDITS
    );
  } catch (error) {
    console.error("Redis reset guest credits error:", error);
  }
};

// Get remaining credits with TTL info
export const getGuestCreditsInfo = async (sessionId: string): Promise<{
  credits: number;
  ttl: number;
}> => {
  try {
    const key = `${GUEST_CREDITS_KEY}${sessionId}`;
    const credits = await redisConnection.get(key);
    const ttl = await redisConnection.ttl(key);
    
    return {
      credits: credits ? parseInt(credits) : DEFAULT_GUEST_CREDITS,
      ttl: ttl > 0 ? ttl : SESSION_TTL,
    };
  } catch (error) {
    console.error("Redis get guest credits info error:", error);
    return { credits: DEFAULT_GUEST_CREDITS, ttl: SESSION_TTL };
  }
};

// Clean up expired sessions (Redis handles automatically with TTL)
// No need for manual cleanup

// For testing/admin: get all active guest sessions
export const getAllGuestSessions = async (): Promise<string[]> => {
  try {
    const keys = await redisConnection.keys(`${GUEST_CREDITS_KEY}*`);
    return keys.map(key => key.replace(GUEST_CREDITS_KEY, ""));
  } catch (error) {
    console.error("Redis get all guest sessions error:", error);
    return [];
  }
};