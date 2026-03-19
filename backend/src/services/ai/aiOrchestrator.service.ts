import { generateWithGemini } from "./gemini.service";
import { generateWithGroq } from "./groq.service";

export const generateWithAI = async (prompt: string): Promise<string> => {
  const errors: string[] = [];
  
  try {
    console.log(" Trying Gemini...");
    const result = await generateWithGemini(prompt);
    if (result && result.length > 0) {
      return result;
    }
    throw new Error("Empty response from Gemini");
  } catch (err: any) {
    console.log(" Gemini failed:", err.message);
    errors.push(`Gemini: ${err.message}`);
  }

  try {
    console.log("Trying Groq...");
    const result = await generateWithGroq(prompt);
    if (result && result.length > 0) {
      return result;
    }
    throw new Error("Empty response from Groq");
  } catch (err: any) {
    console.log(" Groq also failed:", err.message);
    errors.push(`Groq: ${err.message}`);
  }

  throw new Error(`All AI providers failed: ${errors.join(" | ")}`);
};