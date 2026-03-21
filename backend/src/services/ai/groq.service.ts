import Groq from "groq-sdk";
import { env } from "../../config/env";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

export const generateWithGroq = async (
  prompt: string,
  options?: { temperature?: number }
): Promise<string> => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
          content:
            "You are a strict exam paper generator. Always follow instructions exactly and return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: options?.temperature ?? 0.7,
      top_p: 0.9,
      max_tokens: 2000,
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from Groq");
    }

    return content.trim();

  } catch (error: any) {
    console.error("Groq error:", error?.message || error);
    throw error;
  }
};