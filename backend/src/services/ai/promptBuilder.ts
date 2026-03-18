export const buildPrompt = (assignment: any) => {
  return `
You are an expert teacher.

Generate a structured question paper in JSON format.

Rules:
- Divide into sections (A, B, etc.)
- Include difficulty: easy, medium, hard
- Include marks
- Ensure total questions = ${assignment.totalQuestions}
- Topics: ${assignment.topic}
- Concepts: ${assignment.concepts?.join(", ")}

Return ONLY valid JSON in this format:

{
  "sections": [
    {
      "title": "Section A",
      "questions": [
        {
          "text": "Question text",
          "difficulty": "easy",
          "marks": 2
        }
      ]
    }
  ]
}
`;
};