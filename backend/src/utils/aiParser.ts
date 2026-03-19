import { jsonrepair } from "jsonrepair";

export const parseAIResponse = (raw: string): any => {
  try {
    if (!raw) throw new Error("Empty AI response");

  
    let clean = raw
      .replace(/```json\s*/g, "")  // ```json ke baad ka space bhi hatayega
      .replace(/```\s*/g, "")      // ``` ke baad ka space bhi hatayega
      .trim();

    
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      clean = clean.substring(firstBrace, lastBrace + 1);
    }

  
    try {
      return JSON.parse(clean);
    } catch (directParseError) {
      console.log(" Direct parse failed, trying jsonrepair...");
      
   
      try {
        const repaired = jsonrepair(clean);
        return JSON.parse(repaired);
      } catch (repairError) {
        console.log("⚠️ jsonrepair also failed, trying last resort...");
        
       
        const lastResort = clean
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control chars
          .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Ensure keys are quoted
          .trim();
          
        return JSON.parse(lastResort);
      }
    }

  } catch (err: any) {
    console.error("❌ FINAL JSON FAIL:");
    console.error("Raw input (first 500 chars):", raw.substring(0, 500));
    console.error("Error:", err.message);
    
    
    throw new Error(`Failed to parse AI response: ${err.message}`);
  }
};