// // export const buildPrompt = (assignment: any, config: any) => {
// //   const concepts = assignment.concepts?.length
// //     ? assignment.concepts.join(", ")
// //     : "general concepts";

// //   return `
// // You are a professional school teacher creating a real-world exam paper.

// // ================ INPUT =================
// // Subject: ${assignment.subject}
// // Class: ${assignment.class}
// // Topic: ${assignment.topic}
// // Concepts: ${concepts}

// // ================ PAPER STRUCTURE =================
// // - Section A → EASY questions
// // - Section B → MEDIUM questions
// // - Section C → HARD questions

// // ================ DISTRIBUTION =================
// // - Easy: ${config.distribution.easy} questions (${config.marks.easy} marks each)
// // - Medium: ${config.distribution.medium} questions (${config.marks.medium} marks each)
// // - Hard: ${config.distribution.hard} questions (${config.marks.hard} marks each)

// // ================ RULES =================

// // 1. Question Quality:
// // - Questions must be clear and meaningful
// // - Avoid exact duplicates
// // - Slight similarity is allowed
// // - Keep questions practical and exam-oriented

// // 2. Difficulty Control:
// // - EASY → basic definitions / understanding
// // - MEDIUM → application / comparison
// // - HARD → analysis / real-world scenarios

// // 3. Verb Variety:
// // - Use mix of verbs: Explain, Compare, Analyze, Discuss, Evaluate
// // - Do NOT repeat same starting phrase for all questions

// // 4. Hints:
// // ${assignment.includeHints ? "- Add hints ONLY for HARD questions" : "- Do NOT include hints"}

// // 5. STRICT RULES:
// // - Do NOT generate extra fields
// // - Do NOT change structure
// // - Do NOT fill student name, rollNumber etc (keep empty)
// // - Do NOT modify instructions
// // - Do NOT add markdown or explanation

// // ================ OUTPUT FORMAT (STRICT JSON) =================

// // {
// //   "studentInfo": {
// //     "name": "",
// //     "rollNumber": "",
// //     "section": "",
// //     "class": "${assignment.class}",
// //     "subject": "${assignment.subject}",
// //     "date": ""
// //   },
// //   "instructions": "${assignment.instructions}",
// //   "sections": [
// //     {
// //       "title": "Section A",
// //       "instruction": "Attempt all questions",
// //       "questions": []
// //     },
// //     {
// //       "title": "Section B",
// //       "instruction": "Attempt any questions",
// //       "questions": []
// //     },
// //     {
// //       "title": "Section C",
// //       "instruction": "Attempt any questions",
// //       "questions": []
// //     }
// //   ]
// // }

// // ================ IMPORTANT =================
// // - Return ONLY JSON
// // - No markdown
// // - No explanation
// // - Fill ALL sections properly
// // - Match question count EXACTLY
// // `;
// // };





// export const buildPrompt = (assignment: any, config: any) => {
//   const concepts = assignment.concepts?.length
//     ? assignment.concepts.join(", ")
//     : "general concepts";

//   const questionTypes = assignment.questionTypes?.length
//     ? assignment.questionTypes.join(", ")
//     : "mixed types";

//   return `
// You are an expert school exam paper setter with years of experience.

// Your goal is to create a high-quality, realistic, and well-structured question paper.

// ================ INPUT =================
// Subject: ${assignment.subject}
// Class: ${assignment.class}
// Topic: ${assignment.topic}
// Concepts: ${concepts}
// Question Types: ${questionTypes}

// ================ PAPER STRUCTURE =================
// - Section A → EASY questions
// - Section B → MEDIUM questions
// - Section C → HARD questions

// ================ DISTRIBUTION =================
// - Easy: ${config.distribution.easy} questions (${config.marks.easy} marks each)
// - Medium: ${config.distribution.medium} questions (${config.marks.medium} marks each)
// - Hard: ${config.distribution.hard} questions (${config.marks.hard} marks each)

// ================ RULES =================

// 1. Question Quality:
// - Questions must be clear, exam-oriented, and meaningful
// - Avoid duplicates or near-duplicates
// - Each question must test a different concept or angle
// - Minimum 15–20 words per question

// 2. Difficulty Control:
// - EASY → definitions, recall, basic understanding
// - MEDIUM → explanation, comparison, reasoning
// - HARD → analytical, case-based, real-world application

// 3. Question Variety:
// - Use mix of formats:
//   → Theory
//   → Application
//   → Case-based
//   → Scenario-based
// - Use varied verbs:
//   Explain, Compare, Analyze, Discuss, Evaluate, Justify
// - Do NOT repeat same question pattern

// 4. Real-World Depth:
// - At least some MEDIUM and HARD questions must be practical or real-world based
// - Include examples or situations when possible

// 5. Hints:
// ${
//   assignment.includeHints
//     ? "- Add hints ONLY for HARD questions"
//     : "- Do NOT include hints"
// }

// 6. STRICT RULES:
// - Do NOT generate extra fields
// - Do NOT change structure
// - Do NOT include markdown
// - Do NOT include explanation
// - Do NOT include headings outside JSON

// ================ OUTPUT FORMAT (STRICT JSON) =================

// {
//   "studentInfo": {
//     "name": "",
//     "rollNumber": "",
//     "section": "",
//     "class": "${assignment.class}",
//     "subject": "${assignment.subject}",
//     "date": ""
//   },
//   "instructions": "${assignment.instructions}",
//   "sections": [
//     {
//       "title": "Section A",
//       "instruction": "Attempt all questions",
//       "questions": []
//     },
//     {
//       "title": "Section B",
//       "instruction": "Attempt any questions",
//       "questions": []
//     },
//     {
//       "title": "Section C",
//       "instruction": "Attempt any questions",
//       "questions": []
//     }
//   ]
// }

// ================ FINAL INSTRUCTIONS =================
// - Return ONLY valid JSON
// - No markdown, no explanation
// - Fill ALL sections completely
// - Match question count EXACTLY
// `;
// };



export const buildPrompt = (assignment: any, config: any) => {
  const concepts = assignment.concepts?.length
    ? assignment.concepts.join(", ")
    : "general concepts";

  const questionTypes = assignment.questionTypes?.length
    ? assignment.questionTypes.join(", ")
    : "mixed types";

  return `
You are an expert school exam paper setter.

Generate a high-quality, realistic, and well-structured question paper.

================ INPUT =================
Subject: ${assignment.subject}
Class: ${assignment.class}
Topic: ${assignment.topic}
Concepts: ${concepts}
Question Types: ${questionTypes}

================ PAPER STRUCTURE =================
- Section A → EASY questions
- Section B → MEDIUM questions
- Section C → HARD questions

================ DISTRIBUTION =================
- Easy: ${config.distribution.easy} questions (${config.marks.easy} marks each)
- Medium: ${config.distribution.medium} questions (${config.marks.medium} marks each)
- Hard: ${config.distribution.hard} questions (${config.marks.hard} marks each)

================ RULES =================

1. Question Quality:
- Clear, exam-oriented, meaningful
- No duplicates
- Minimum 15 words per question

2. Difficulty:
- EASY → basic concepts
- MEDIUM → reasoning
- HARD → analytical / real-world

3. STRICT QUESTION FORMAT (VERY IMPORTANT):

Each question MUST be an object like:

{
  "number": 1,
  "text": "Question text here",
  "marks": 2,
  "type": "short",
  "difficulty": "easy"
}

4. STRICT RULES:
- Do NOT return string questions
- Do NOT skip fields
- Do NOT change field names
- Do NOT add extra fields
- Do NOT include markdown or explanation

================ OUTPUT FORMAT =================

{
  "studentInfo": {
    "name": "",
    "rollNumber": "",
    "section": "",
    "class": "${assignment.class}",
    "subject": "${assignment.subject}",
    "date": ""
  },
  "instructions": "${assignment.instructions}",
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": []
    },
    {
      "title": "Section B",
      "instruction": "Attempt any questions",
      "questions": []
    },
    {
      "title": "Section C",
      "instruction": "Attempt any questions",
      "questions": []
    }
  ]
}

================ FINAL =================
- ONLY JSON
- NO explanation
- ALL sections filled
- EXACT question count
`;
};
