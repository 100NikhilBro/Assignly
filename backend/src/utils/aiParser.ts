// // // // // import { jsonrepair } from "jsonrepair";

// // // // // export const parseAIResponse = (raw: string): any => {
// // // // //   try {
// // // // //     if (!raw) throw new Error("Empty AI response");

  
// // // // //     let clean = raw
// // // // //       .replace(/```json\s*/g, "")  // ```json ke baad ka space bhi hatayega
// // // // //       .replace(/```\s*/g, "")      // ``` ke baad ka space bhi hatayega
// // // // //       .trim();

    
// // // // //     const firstBrace = clean.indexOf('{');
// // // // //     const lastBrace = clean.lastIndexOf('}');
    
// // // // //     if (firstBrace !== -1 && lastBrace !== -1) {
// // // // //       clean = clean.substring(firstBrace, lastBrace + 1);
// // // // //     }

  
// // // // //     try {
// // // // //       return JSON.parse(clean);
// // // // //     } catch (directParseError) {
// // // // //       console.log(" Direct parse failed, trying jsonrepair...");
      
   
// // // // //       try {
// // // // //         const repaired = jsonrepair(clean);
// // // // //         return JSON.parse(repaired);
// // // // //       } catch (repairError) {
// // // // //         console.log("⚠️ jsonrepair also failed, trying last resort...");
        
       
// // // // //         const lastResort = clean
// // // // //           .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control chars
// // // // //           .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
// // // // //           .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Ensure keys are quoted
// // // // //           .trim();
          
// // // // //         return JSON.parse(lastResort);
// // // // //       }
// // // // //     }

// // // // //   } catch (err: any) {
// // // // //     console.error("❌ FINAL JSON FAIL:");
// // // // //     console.error("Raw input (first 500 chars):", raw.substring(0, 500));
// // // // //     console.error("Error:", err.message);
    
    
// // // // //     throw new Error(`Failed to parse AI response: ${err.message}`);
// // // // //   }
// // // // // };


// // // // import { jsonrepair } from "jsonrepair";

// // // // export const parseAIResponse = (raw: string): any => {
// // // //   try {
// // // //     if (!raw) throw new Error("Empty AI response");

// // // //     // Remove markdown wrappers
// // // //     let clean = raw
// // // //       .replace(/```json\s*/gi, "")
// // // //       .replace(/```\s*/g, "")
// // // //       .trim();

// // // //     // Extract only JSON block
// // // //     const firstBrace = clean.indexOf("{");
// // // //     const lastBrace = clean.lastIndexOf("}");

// // // //     if (firstBrace === -1 || lastBrace === -1) {
// // // //       throw new Error("No valid JSON object found");
// // // //     }

// // // //     clean = clean.substring(firstBrace, lastBrace + 1);

// // // //     // Try direct parse first (strict)
// // // //     try {
// // // //       return JSON.parse(clean);
// // // //     } catch {
// // // //       console.log("Direct parse failed, attempting minimal repair...");

// // // //       // Only ONE repair attempt (controlled)
// // // //       const repaired = jsonrepair(clean);

// // // //       const parsed = JSON.parse(repaired);

// // // //       // Basic sanity check (important)
// // // //       if (!parsed || typeof parsed !== "object") {
// // // //         throw new Error("Parsed output is not an object");
// // // //       }

// // // //       return parsed;
// // // //     }

// // // //   } catch (err: any) {
// // // //     console.error("❌ JSON PARSE FAILED");
// // // //     console.error("Raw (first 300 chars):", raw?.slice(0, 300));
// // // //     console.error("Error:", err.message);

// // // //     // ❗ DO NOT silently fix beyond this
// // // //     throw new Error(`Invalid AI JSON output: ${err.message}`);
// // // //   }
// // // // };




// // // import { jsonrepair } from "jsonrepair";

// // // export const parseAIResponse = (raw: string): any => {
// // //   try {
// // //     if (!raw) throw new Error("Empty AI response");

// // //     // 1️⃣ Remove markdown wrappers
// // //     let clean = raw
// // //       .replace(/```json\s*/gi, "")
// // //       .replace(/```/g, "")
// // //       .trim();

// // //     // 2️⃣ Extract FIRST valid JSON object (safer than lastIndexOf)
// // //     const firstBrace = clean.indexOf("{");
// // //     if (firstBrace === -1) {
// // //       throw new Error("No JSON object found");
// // //     }

// // //     let braceCount = 0;
// // //     let endIndex = -1;

// // //     for (let i = firstBrace; i < clean.length; i++) {
// // //       if (clean[i] === "{") braceCount++;
// // //       if (clean[i] === "}") braceCount--;

// // //       if (braceCount === 0) {
// // //         endIndex = i;
// // //         break;
// // //       }
// // //     }

// // //     if (endIndex === -1) {
// // //       throw new Error("Incomplete JSON object");
// // //     }

// // //     clean = clean.substring(firstBrace, endIndex + 1);

// // //     // 3️⃣ Try strict parse first
// // //     let parsed: any;
// // //     try {
// // //       parsed = JSON.parse(clean);
// // //     } catch {
// // //       console.log("⚠️ Direct parse failed → attempting repair");

// // //       const repaired = jsonrepair(clean);
// // //       parsed = JSON.parse(repaired);
// // //     }

// // //     // 4️⃣ Basic structure validation (VERY IMPORTANT)
// // //     if (!parsed || typeof parsed !== "object") {
// // //       throw new Error("Parsed result is not an object");
// // //     }

// // //     if (!parsed.sections || !Array.isArray(parsed.sections)) {
// // //       throw new Error("Invalid structure: 'sections' missing or not array");
// // //     }

// // //     // 5️⃣ Minimal safe defaults (do NOT over-fix)
// // //     if (!parsed.studentInfo) {
// // //       parsed.studentInfo = {
// // //         name: "",
// // //         rollNumber: "",
// // //         section: "",
// // //         class: "",
// // //         subject: "",
// // //         date: "",
// // //       };
// // //     }

// // //     if (!parsed.instructions) {
// // //       parsed.instructions = "Attempt all questions";
// // //     }

// // //     return parsed;

// // //   } catch (err: any) {
// // //     console.error("❌ JSON PARSE FAILED");
// // //     console.error("Raw (first 300 chars):", raw?.slice(0, 300));
// // //     console.error("Error:", err.message);

// // //     throw new Error(`Invalid AI JSON output: ${err.message}`);
// // //   }
// // // };



// // import { jsonrepair } from "jsonrepair";

// // export const parseAIResponse = (raw: string): any => {
// //   if (!raw) throw new Error("Empty AI response");

// //   try {
// //     let clean = raw.replace(/```json|```/g, "").trim();

// //     const start = clean.indexOf("{");
// //     const end = clean.lastIndexOf("}");

// //     if (start === -1 || end === -1) {
// //       throw new Error("Invalid JSON boundaries");
// //     }

// //     clean = clean.slice(start, end + 1);

// //     try {
// //       return JSON.parse(clean);
// //     } catch {
// //       const repaired = jsonrepair(clean);
// //       return JSON.parse(repaired);
// //     }
// //   } catch (err: any) {
// //     throw new Error(`Parse failed: ${err.message}`);
// //   }
// // };



// import { jsonrepair } from "jsonrepair";

// export const parseAIResponse = (raw: string): any => {
//   try {
//     if (!raw) throw new Error("Empty AI response");

//     console.log("\n🧨 RAW BEFORE PARSE:\n", raw.slice(0, 300));

//     let clean = raw.replace(/```json|```/g, "").trim();

//     const start = clean.indexOf("{");
//     const end = clean.lastIndexOf("}");

//     if (start === -1 || end === -1) {
//       throw new Error("Invalid JSON boundaries");
//     }

//     clean = clean.slice(start, end + 1);

//     try {
//       const parsed = JSON.parse(clean);
//       console.log("✅ JSON parsed successfully");
//       return parsed;
//     } catch {
//       console.log("⚠️ JSON parse failed → repairing...");
//       const repaired = jsonrepair(clean);
//       const parsed = JSON.parse(repaired);
//       console.log("✅ JSON repaired successfully");
//       return parsed;
//     }
//   } catch (err: any) {
//     console.error("❌ PARSE FAILED:", err.message);
//     throw new Error(`Parse failed: ${err.message}`);
//   }
// };


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