import Groq from "groq-sdk";
import { env } from "../../config/env";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

export const generateWithGroq = async (prompt: string): Promise<string> => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from Groq");
    }

    return content;

  } catch (error) {
    console.error("Groq error:", error);
    throw error;
  }
};