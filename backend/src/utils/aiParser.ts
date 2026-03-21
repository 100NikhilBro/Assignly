import { jsonrepair } from "jsonrepair";

export const parseAIResponse = (raw: string): any => {
  try {
    if (!raw) throw new Error("Empty AI response");

    console.log("\n🧨 RAW BEFORE PARSE:\n", raw.slice(0, 300));

    let clean = raw.replace(/```json|```/g, "").trim();

    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON boundaries");
    }

    clean = clean.slice(start, end + 1);

    try {
      const parsed = JSON.parse(clean);
      console.log("✅ JSON parsed successfully");
      return parsed;
    } catch {
      console.log("⚠️ JSON parse failed → repairing...");
      const repaired = jsonrepair(clean);
      const parsed = JSON.parse(repaired);
      console.log("✅ JSON repaired successfully");
      return parsed;
    }
  } catch (err: any) {
    console.error("❌ PARSE FAILED:", err.message);
    throw new Error(`Parse failed: ${err.message}`);
  }
};