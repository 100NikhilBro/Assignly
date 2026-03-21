import { generateWithGemini } from "./gemini.service";
import { generateWithGroq } from "./groq.service";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

type EmitFn = (payload: any) => void;

const safeCall = async (
  fn: () => Promise<string>,
  label: string,
  emit?: EmitFn
) => {
  try {
    const res = await fn();

    console.log(`\n ${label} RAW RESPONSE:\n`, res?.slice(0, 500));

    if (!res || res.length < 20) {
      throw new Error("Weak response");
    }

    return res;
  } catch (err: any) {
    console.log(` ${label} FAILED:`, err.message);

 
    emit?.({
      status: "provider_failed",
      provider: label,
      message: err.message,
    });

    throw err;
  }
};

export const generateWithAI = async (
  prompt: string,
  emit?: EmitFn 
): Promise<string> => {
  const groqPrompt =
    prompt +
    `

CRITICAL:
- Output MUST start with { and end with }
- Return ONLY JSON
- Each question MUST use key "text"
- DO NOT use "question"
`;


  try {
    console.log("Trying GEMINI...");

    emit?.({
      status: "ai_generating",
      provider: "gemini",
    });

    return await safeCall(
      () => generateWithGemini(prompt),
      "GEMINI",
      emit
    );
  } catch (err: any) {
    if (err.message?.includes("429")) {
      console.log("Gemini quota exceeded → skipping...");

      emit?.({
        status: "switching_provider",
        from: "gemini",
        to: "groq",
      });
    }
  }

  
  try {
    console.log("⚡ Trying GROQ...");

    emit?.({
      status: "ai_generating",
      provider: "groq",
    });

    return await safeCall(
      () => generateWithGroq(groqPrompt),
      "GROQ",
      emit
    );
  } catch (err: any) {
    console.log("GROQ also failed");

    emit?.({
      status: "failed",
      message: "All AI providers failed",
    });

    throw new Error("All AI providers failed");
  }
};
