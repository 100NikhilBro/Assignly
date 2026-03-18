import { generateWithGemini } from "./gemini.service";
import { generateWithGroq } from "./groq.service";

export const generateWithAI = async (prompt: string): Promise<string> => {
  try {
    console.log("Trying Gemini...");
    const res = await generateWithGemini(prompt);

    if (!res) throw new Error("Empty Gemini response");

    return res;

  } catch (error) {
    console.warn(" Gemini failed, switching to Groq...");

    try {
      const fallback = await generateWithGroq(prompt);

      if (!fallback) throw new Error("Empty Groq response");

      return fallback;

    } catch (fallbackError) {
      console.error("Both AI providers failed");

      throw new Error("All AI providers failed");
    }
  }
};