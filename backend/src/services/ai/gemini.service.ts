import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export const generateWithGemini = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini");
    }

    return response.text;

  } catch (error) {
    console.error("Gemini error:", error);
    throw error;
  }
};