// import { GoogleGenAI } from "@google/genai";
// import { env } from "../../config/env";

// const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// export const generateWithGemini = async (prompt: string): Promise<string> => {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//     });

//     if (!response.text) {
//       throw new Error("Empty response from Gemini");
//     }

//     return response.text;

//   } catch (error) {
//     console.error("Gemini error:", error);
//     throw error;
//   }
// };



import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export const generateWithGemini = async (
  prompt: string,
  options?: { temperature?: number }
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return text.trim();

  } catch (error: any) {
    console.error("Gemini error:", error?.message || error);
    throw error;
  }
};