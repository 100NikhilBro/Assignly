export const buildPrompt = (assignment: any, config: any) => {
  const concepts = assignment.concepts?.length
    ? assignment.concepts.join(", ")
    : "general concepts";

  const questionTypes = assignment.questionTypes?.length
    ? assignment.questionTypes.join(", ")
    : "mixed types";

  return `
You are an expert school exam paper setter with years of experience.

Your goal is to create a high-quality, realistic, and well-structured question paper.

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
- Questions must be clear, exam-oriented, and meaningful
- Avoid duplicates or near-duplicates
- Each question must test a different concept or angle
- Minimum 15–20 words per question

2. Difficulty Control:
- EASY → definitions, recall, basic understanding
- MEDIUM → explanation, comparison, reasoning
- HARD → analytical, case-based, real-world application

3. Question Variety:
- Use mix of formats:
  → Theory
  → Application
  → Case-based
  → Scenario-based
- Use varied verbs:
  Explain, Compare, Analyze, Discuss, Evaluate, Justify
- Do NOT repeat same question pattern

4. Real-World Depth:
- At least some MEDIUM and HARD questions must be practical or real-world based
- Include examples or situations when possible

5. Hints:
${
  assignment.includeHints
    ? "- Add hints ONLY for HARD questions"
    : "- Do NOT include hints"
}

6. STRICT RULES:
- Do NOT generate extra fields
- Do NOT change structure
- Do NOT include markdown
- Do NOT include explanation
- Do NOT include headings outside JSON

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

================ FINAL INSTRUCTIONS =================
- Return ONLY valid JSON
- No markdown, no explanation
- Fill ALL sections completely
- Match question count EXACTLY
`;
};


