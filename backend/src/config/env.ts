import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",
  DB_URL: process.env.DB_URL as string,
  REDIS_URL:process.env.REDIS_URL as string,
  GEMINI_API_KEY:process.env.GEMINI_API_KEY as string,
  GROQ_API_KEY:process.env.GROQ_API_KEY as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  UPSTASH_REDIS_TOKEN:process.env.UPSTASH_REDIS_TOKEN 
};