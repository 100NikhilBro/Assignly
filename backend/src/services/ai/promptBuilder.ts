export const buildPrompt = (assignment: any) => {
  return `
You are a PROFESSIONAL EXAMINER.

Generate a NON-REPETITIVE, HIGH-QUALITY exam paper.

----------------------------------

TOTAL QUESTIONS: ${assignment.totalQuestions}

DIFFICULTY:
- Easy: ${assignment.difficulty.easy}
- Medium: ${assignment.difficulty.medium}
- Hard: ${assignment.difficulty.hard}

MARKS:
- Easy: ${assignment.marksPerQuestion.easy}
- Medium: ${assignment.marksPerQuestion.medium}
- Hard: ${assignment.marksPerQuestion.hard}

----------------------------------

CONCEPTS:
${assignment.concepts?.join(", ") || "General concepts"}

 Use ALL concepts
 Do NOT repeat patterns

----------------------------------

QUESTION RULES:

- Each question MUST be UNIQUE
- Avoid repetition
- Avoid same sentence pattern

 BAD:
Explain Deadlock  
Explain Paging  

 GOOD:
Explain necessary conditions of deadlock with example  
Compare paging vs segmentation  
Analyze CPU scheduling impact  

----------------------------------

SECTION RULES:

Section A:
- Only EASY
- ${assignment.difficulty.easy} questions

Section B:
- Only MEDIUM
- ${assignment.difficulty.medium} questions

Section C:
- Only HARD
- ${assignment.difficulty.hard} questions

 NO duplicate questions across sections

----------------------------------

OUTPUT:

Return ONLY JSON:

{
  "studentInfo": {
    "name": "",
    "rollNumber": "",
    "section": "",
    "class": "",
    "subject": "${assignment.topic}",
    "date": ""
  },
  "instructions": "${assignment.instructions || "Attempt all questions"}",
  "sections": [
    { "title": "Section A", "instruction": "", "questions": [] },
    { "title": "Section B", "instruction": "", "questions": [] },
    { "title": "Section C", "instruction": "", "questions": [] }
  ]
}

----------------------------------

STRICT:
- No explanation
- No markdown
${
  assignment.includeHints
    ? "- Add hints ONLY for hard questions"
    : "- Do NOT include hint field"
}
`;
};