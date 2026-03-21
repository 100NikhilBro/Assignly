export const buildPrompt = (assignment: any, config: any) => {
  const concepts = assignment.concepts?.length
    ? assignment.concepts.join(", ")
    : "general concepts";

  return `
You are a professional school teacher creating a real-world exam paper.

================ INPUT =================
Subject: ${assignment.subject}
Class: ${assignment.class}
Topic: ${assignment.topic}
Concepts: ${concepts}

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
- Questions must be clear and meaningful
- Avoid exact duplicates
- Slight similarity is allowed
- Keep questions practical and exam-oriented

2. Difficulty Control:
- EASY → basic definitions / understanding
- MEDIUM → application / comparison
- HARD → analysis / real-world scenarios

3. Verb Variety:
- Use mix of verbs: Explain, Compare, Analyze, Discuss, Evaluate
- Do NOT repeat same starting phrase for all questions

4. Hints:
${assignment.includeHints ? "- Add hints ONLY for HARD questions" : "- Do NOT include hints"}

5. STRICT RULES:
- Do NOT generate extra fields
- Do NOT change structure
- Do NOT fill student name, rollNumber etc (keep empty)
- Do NOT modify instructions
- Do NOT add markdown or explanation

================ OUTPUT FORMAT (STRICT JSON) =================

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

================ IMPORTANT =================
- Return ONLY JSON
- No markdown
- No explanation
- Fill ALL sections properly
- Match question count EXACTLY
`;
};