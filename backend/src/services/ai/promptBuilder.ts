// // // // // // export const buildPrompt = (assignment: any) => {
// // // // // //   return `
// // // // // // You are a PROFESSIONAL EXAMINER.

// // // // // // Generate a NON-REPETITIVE, HIGH-QUALITY exam paper.
// // // // // // Strict Rules :
// // // // // // - Don't repeat same questions.
// // // // // // - Don't ask similiar patterns in question

// // // // // // ----------------------------------

// // // // // // TOTAL QUESTIONS: ${assignment.totalQuestions}

// // // // // // DIFFICULTY:
// // // // // // - Easy: ${assignment.difficulty.easy}
// // // // // // - Medium: ${assignment.difficulty.medium}
// // // // // // - Hard: ${assignment.difficulty.hard}

// // // // // // MARKS:
// // // // // // - Easy: ${assignment.marksPerQuestion.easy}
// // // // // // - Medium: ${assignment.marksPerQuestion.medium}
// // // // // // - Hard: ${assignment.marksPerQuestion.hard}

// // // // // // ----------------------------------

// // // // // // CONCEPTS:
// // // // // // ${assignment.concepts?.join(", ") || "General concepts"}

// // // // // //  Use ALL concepts
// // // // // //  Do NOT repeat patterns

// // // // // // ----------------------------------

// // // // // // QUESTION RULES:

// // // // // // - Each question MUST be UNIQUE
// // // // // // - Avoid repetition
// // // // // // - Avoid same sentence pattern

// // // // // //  BAD Example:
// // // // // // Explain Deadlock  
// // // // // // Explain Paging  

// // // // // //  GOOD Example:
// // // // // // Explain necessary conditions of deadlock with example  
// // // // // // Compare paging vs segmentation  
// // // // // // Analyze CPU scheduling impact  

// // // // // // ----------------------------------

// // // // // // SECTION RULES:

// // // // // // Section A:
// // // // // // - Only EASY
// // // // // // - ${assignment.difficulty.easy} questions

// // // // // // Section B:
// // // // // // - Only MEDIUM
// // // // // // - ${assignment.difficulty.medium} questions

// // // // // // Section C:
// // // // // // - Only HARD
// // // // // // - ${assignment.difficulty.hard} questions

// // // // // //  NO duplicate questions across sections
// // // // // //  Bad Example ::
// // // // // //  Section A:
// // // // // //  - What is thrashing ?
// // // // // //  Section B:
// // // // // //  - What is thrashing ?
// // // // // //  Good Example ::
// // // // // //  Section A:
// // // // // //  What is thrashing ?
// // // // // //  Section B :
// // // // // //  How can we prevent thrashing using locks, blocking queues ? 


// // // // // // ----------------------------------

// // // // // // OUTPUT:

// // // // // // Return ONLY JSON:

// // // // // // {
// // // // // //   "studentInfo": {
// // // // // //     "name": "",
// // // // // //     "rollNumber": "",
// // // // // //     "section": "",
// // // // // //     "class": "",
// // // // // //     "subject": "${assignment.topic}",
// // // // // //     "date": ""
// // // // // //   },
// // // // // //   "instructions": "${assignment.instructions || "Attempt all questions"}",
// // // // // //   "sections": [
// // // // // //     { "title": "Section A", "instruction": "", "questions": [] },
// // // // // //     { "title": "Section B", "instruction": "", "questions": [] },
// // // // // //     { "title": "Section C", "instruction": "", "questions": [] }
// // // // // //   ]
// // // // // // }

// // // // // // ----------------------------------

// // // // // // STRICT:
// // // // // // - No explanation
// // // // // // - No markdown
// // // // // // ${
// // // // // //   assignment.includeHints
// // // // // //     ? "- Add hints ONLY for hard questions"
// // // // // //     : "- Do NOT include hint field"
// // // // // // }
// // // // // // `;
// // // // // // };


// // // // // export const buildPrompt = (assignment: any, feedback?: any, attempt = 0) => {
// // // // //   const concepts = (assignment.concepts && assignment.concepts.length)
// // // // //     ? assignment.concepts
// // // // //     : ["General"];
// // // // //   const includeHints = !!assignment.includeHints;

// // // // //   const schema = `{
// // // // //   "preparation": {
// // // // //     "questionsNeeded": ["..."], 
// // // // //     "studyPlan": "...",
// // // // //     "adviceForExaminer": "..."
// // // // //   },
// // // // //   "studentInfo": { "name":"", "rollNumber":"", "section":"", "class":"", "subject":"${assignment.topic}", "date":"" },
// // // // //   "instructions": "${assignment.instructions || "Attempt all questions"}",
// // // // //   "sections": [
// // // // //     { "title":"Section A", "instruction":"", "questions":[ /* easy questions */ ] },
// // // // //     { "title":"Section B", "instruction":"", "questions":[ /* medium questions */ ] },
// // // // //     { "title":"Section C", "instruction":"", "questions":[ /* hard questions */ ] }
// // // // //   ]
// // // // // }`;

// // // // //   const constraints = [
// // // // //     `TOTAL QUESTIONS: ${assignment.totalQuestions}`,
// // // // //     `SECTION COUNTS: Section A (easy) = ${assignment.difficulty.easy}, Section B (medium) = ${assignment.difficulty.medium}, Section C (hard) = ${assignment.difficulty.hard}`,
// // // // //     `MARKS PER QUESTION: easy=${assignment.marksPerQuestion.easy}, medium=${assignment.marksPerQuestion.medium}, hard=${assignment.marksPerQuestion.hard}`,
// // // // //     `CONCEPTS (use ALL at least once): ${concepts.join(", ")}`,
// // // // //     `Do NOT repeat or produce near-duplicate questions.`,
// // // // //     `Each question must include: id (unique), text, difficulty, marks, type, conceptsUsed (subset of provided concepts).`,
// // // // //     `If includeHints is true, add "hint" ONLY for hard questions.`,
// // // // //     `Questions must be exam-level, specific, and varied in verbs and formats (compare, analyze, design, evaluate, implement, justify, derive, illustrate).`,
// // // // //     `Return ONLY valid JSON that matches the schema. No extra text, no markdown, no explanation.`
// // // // //   ];

// // // // //   const exampleQuestion = `Example question object:
// // // // // { "id":"A1", "text":"Compare paging and segmentation with a memory layout example and discuss trade-offs.", "difficulty":"easy", "marks":${assignment.marksPerQuestion.easy}, "type":"theory", "conceptsUsed":["paging","segmentation"] }`;

// // // // //   const attemptNotes = attempt === 0
// // // // //     ? ""
// // // // //     : attempt === 1
// // // // //     ? "\nIMPROVE: Avoid repetition; increase specificity; ensure all concepts are used."
// // // // //     : attempt === 2
// // // // //     ? "\nSTRICT: Remove near-duplicates; ensure unique ids; include conceptsUsed arrays."
// // // // //     : "\nFINAL: Make questions realistic exam-level; diversify verbs and formats; correct previous issues.";

// // // // //   const feedbackText = feedback
// // // // //     ? `\nFEEDBACK:\n- missingConcepts: ${JSON.stringify(feedback.missingConcepts || [])}\n- duplicatesFound: ${feedback.duplicatesFound || 0}\n- lowQualityQuestions: ${JSON.stringify(feedback.lowQualityQuestions || [])}\n- otherIssues: ${JSON.stringify(feedback.otherIssues || [])}\nPlease return corrected JSON only.`
// // // // //     : "";

// // // // //   /*
// // // // //     Special instruction to treat the model as a novice "student":
// // // // //     - The model must include a "preparation" object at the top of the JSON.
// // // // //     - "questionsNeeded" is a short list of clarifying points the model (as a student) would ask before attempting the paper.
// // // // //     - "studyPlan" is a concise 3-5 step plan the model (as a student) would follow to prepare for this paper.
// // // // //     - "adviceForExaminer" is 1-2 sentences where the model (as a student) suggests improvements or clarifications for the examiner.
// // // // //   */

// // // // //   return `
// // // // // You are a PROFESSIONAL EXAMINER and also simulate a NOVICE STUDENT who knows nothing about the subject.
// // // // // Produce a single JSON object that exactly matches the schema below.

// // // // // Schema:
// // // // // ${schema}

// // // // // Constraints:
// // // // // - ${constraints.join("\n- ")}

// // // // // ${exampleQuestion}

// // // // // Special student instructions:
// // // // // - Pretend you are a student who knows nothing. Before the questions, include a "preparation" object:
// // // // //   - "questionsNeeded": list 3 short clarifying questions the student would ask the examiner before attempting the paper.
// // // // //   - "studyPlan": a concise 3-step study plan the student would follow to prepare for this paper.
// // // // //   - "adviceForExaminer": 1-2 sentences where the student suggests how the paper could be clearer or fairer.
// // // // // - After "preparation", produce the exam JSON sections and questions.
// // // // // - Do NOT output any text outside the JSON object.

// // // // // ${attemptNotes}
// // // // // ${feedbackText}

// // // // // Return ONLY the JSON object and nothing else.
// // // // // `;
// // // // // };


// // // // // buildPrompt.ts

// // // // export const buildPrompt = (assignment: any, feedback?: any, attempt = 0) => {
// // // //   const concepts = (assignment.concepts && assignment.concepts.length)
// // // //     ? assignment.concepts
// // // //     : ["General"];
// // // //   const includeHints = !!assignment.includeHints;

// // // //   const schema = `{
// // // //   "preparation": {
// // // //     "questionsNeeded": ["..."], 
// // // //     "studyPlan": "...",
// // // //     "adviceForExaminer": "..."
// // // //   },
// // // //   "studentInfo": { "name":"", "rollNumber":"", "section":"", "class":"", "subject":"${assignment.topic}", "date":"" },
// // // //   "instructions": "${assignment.instructions || "Attempt all questions"}",
// // // //   "sections": [
// // // //     { "title":"Section A", "instruction":"", "questions":[ /* easy questions */ ] },
// // // //     { "title":"Section B", "instruction":"", "questions":[ /* medium questions */ ] },
// // // //     { "title":"Section C", "instruction":"", "questions":[ /* hard questions */ ] }
// // // //   ]
// // // // }`;

// // // //   const constraints = [
// // // //     `TOTAL QUESTIONS: ${assignment.totalQuestions}`,
// // // //     `SECTION COUNTS: Section A (easy) = ${assignment.difficulty.easy}, Section B (medium) = ${assignment.difficulty.medium}, Section C (hard) = ${assignment.difficulty.hard}`,
// // // //     `MARKS PER QUESTION: easy=${assignment.marksPerQuestion.easy}, medium=${assignment.marksPerQuestion.medium}, hard=${assignment.marksPerQuestion.hard}`,
// // // //     `CONCEPTS (use ALL at least once): ${concepts.join(", ")}`,
// // // //     `Do NOT repeat or produce near-duplicate questions.`,
// // // //     `Each question must include: id (unique), text, difficulty, marks, type, conceptsUsed (subset of provided concepts).`,
// // // //     `If includeHints is true, add "hint" ONLY for hard questions.`,
// // // //     `Questions must be exam-level, specific, and varied in verbs and formats (compare, analyze, design, evaluate, implement, justify, derive, illustrate).`,
// // // //     `Return ONLY valid JSON that matches the schema. No extra text, no markdown, no explanation.`
// // // //   ];

// // // //   const exampleQuestion = `Example question object:
// // // // { "id":"A1", "text":"Compare paging and segmentation with a memory layout example and discuss trade-offs.", "difficulty":"easy", "marks":${assignment.marksPerQuestion.easy}, "type":"theory", "conceptsUsed":["paging","segmentation"] }`;

// // // //   const attemptNotes = attempt === 0
// // // //     ? ""
// // // //     : attempt === 1
// // // //     ? "\nIMPROVE: Avoid repetition; increase specificity; ensure all concepts are used."
// // // //     : attempt === 2
// // // //     ? "\nSTRICT: Remove near-duplicates; ensure unique ids; include conceptsUsed arrays."
// // // //     : "\nFINAL: Make questions realistic exam-level; diversify verbs and formats; correct previous issues.";

// // // //   const feedbackText = feedback
// // // //     ? `\nFEEDBACK:\n- missingConcepts: ${JSON.stringify(feedback.missingConcepts || [])}\n- duplicatesFound: ${feedback.duplicatesFound || 0}\n- lowQualityQuestions: ${JSON.stringify(feedback.lowQualityQuestions || [])}\n- otherIssues: ${JSON.stringify(feedback.otherIssues || [])}\nPlease return corrected JSON only.`
// // // //     : "";

// // // //   /*
// // // //     Special instruction to treat the model as a novice "student":
// // // //     - The model must include a "preparation" object at the top of the JSON.
// // // //     - "questionsNeeded" is a short list of clarifying points the model (as a student) would ask before attempting the paper.
// // // //     - "studyPlan" is a concise 3-5 step plan the model (as a student) would follow to prepare for this paper.
// // // //     - "adviceForExaminer" is 1-2 sentences where the model (as a student) suggests improvements or clarifications for the examiner.
// // // //   */

// // // //   return `
// // // // You are a PROFESSIONAL EXAMINER and also simulate a NOVICE STUDENT who knows nothing about the subject.
// // // // Produce a single JSON object that exactly matches the schema below.

// // // // Schema:
// // // // ${schema}

// // // // Constraints:
// // // // - ${constraints.join("\n- ")}

// // // // ${exampleQuestion}

// // // // Special student instructions:
// // // // - Pretend you are a student who knows nothing. Before the questions, include a "preparation" object:
// // // //   - "questionsNeeded": list 3 short clarifying questions the student would ask the examiner before attempting the paper.
// // // //   - "studyPlan": a concise 3-step study plan the student would follow to prepare for this paper.
// // // //   - "adviceForExaminer": 1-2 sentences where the student suggests how the paper could be clearer or fairer.
// // // // - After "preparation", produce the exam JSON sections and questions.
// // // // - Do NOT output any text outside the JSON object.

// // // // ${attemptNotes}
// // // // ${feedbackText}

// // // // Return ONLY the JSON object and nothing else.
// // // // `;
// // // // };



// // // export const buildPrompt = (assignment: any, feedback?: any, attempt = 0) => {
// // //   const concepts = (assignment.concepts && assignment.concepts.length)
// // //     ? assignment.concepts
// // //     : ["General"];
// // //   const includeHints = !!assignment.includeHints;

// // //   const schema = `{
// // //   "preparation": {
// // //     "questionsNeeded": ["..."], 
// // //     "studyPlan": "...",
// // //     "adviceForExaminer": "..."
// // //   },
// // //   "studentInfo": { "name":"", "rollNumber":"", "section":"", "class":"", "subject":"${assignment.topic}", "date":"" },
// // //   "instructions": "${assignment.instructions || "Attempt all questions"}",
// // //   "sections": [
// // //     { "title":"Section A", "instruction":"", "questions":[ /* easy questions */ ] },
// // //     { "title":"Section B", "instruction":"", "questions":[ /* medium questions */ ] },
// // //     { "title":"Section C", "instruction":"", "questions":[ /* hard questions */ ] }
// // //   ]
// // // }`;

// // //   const constraints = [
// // //     `TOTAL QUESTIONS: ${assignment.totalQuestions}`,
// // //     `SECTION COUNTS: Section A (easy) = ${assignment.difficulty.easy}, Section B (medium) = ${assignment.difficulty.medium}, Section C (hard) = ${assignment.difficulty.hard}`,
// // //     `MARKS PER QUESTION: easy=${assignment.marksPerQuestion.easy}, medium=${assignment.marksPerQuestion.medium}, hard=${assignment.marksPerQuestion.hard}`,
// // //     `CONCEPTS (use ALL at least once): ${concepts.join(", ")}`,
// // //     `Do NOT repeat or produce near-duplicate questions across ANY section.`,
// // //     `Each question must have: unique id, text, difficulty, marks, type, conceptsUsed (subset of provided concepts).`,
// // //     `If includeHints is true, add "hint" ONLY for hard questions.`,
// // //     `Questions must be exam-level, realistic, varied in verbs (compare, analyze, design, evaluate, implement, justify, derive, illustrate) and formats.`,
// // //     `Avoid starting multiple questions with the same phrase or verb across sections.`,
// // //     `Return ONLY valid JSON that matches the schema. No extra text, no markdown, no explanation.`
// // //   ];

// // //   const exampleQuestion = `Example question object:
// // // { "id":"A1", "text":"Compare paging and segmentation with a memory layout example and discuss trade-offs.", "difficulty":"easy", "marks":${assignment.marksPerQuestion.easy}, "type":"theory", "conceptsUsed":["paging","segmentation"] }`;

// // //   const attemptNotes = attempt === 0
// // //     ? ""
// // //     : attempt === 1
// // //     ? "\nIMPROVE: Ensure all questions are unique; avoid repeating patterns; increase specificity."
// // //     : attempt === 2
// // //     ? "\nSTRICT: Remove near-duplicates; enforce unique ids; include conceptsUsed arrays; vary verbs."
// // //     : "\nFINAL: Make questions realistic exam-level; diversify verbs and formats; correct previous duplicates.";

// // //   const feedbackText = feedback
// // //     ? `\nFEEDBACK:\n- missingConcepts: ${JSON.stringify(feedback.missingConcepts || [])}\n- duplicatesFound: ${feedback.duplicatesFound || 0}\n- lowQualityQuestions: ${JSON.stringify(feedback.lowQualityQuestions || [])}\n- otherIssues: ${JSON.stringify(feedback.otherIssues || [])}\nPlease return corrected JSON only.`
// // //     : "";

// // //   return `
// // // You are a PROFESSIONAL EXAMINER and simulate a NOVICE STUDENT.
// // // Produce a single JSON object exactly matching the schema below.

// // // Schema:
// // // ${schema}

// // // Constraints:
// // // - ${constraints.join("\n- ")}

// // // ${exampleQuestion}

// // // Special student instructions:
// // // - Pretend you are a student who knows nothing. Before the questions, include a "preparation" object:
// // //   - "questionsNeeded": list 3 short clarifying questions before attempting the paper.
// // //   - "studyPlan": 3-step study plan for this paper.
// // //   - "adviceForExaminer": 1-2 sentences suggesting improvements or clarifications.
// // // - After "preparation", produce the exam JSON sections and questions.
// // // - Do NOT repeat questions or question patterns across sections.
// // // - Use varied verbs and formats per difficulty.
// // // - Do NOT output any text outside the JSON object.

// // // ${attemptNotes}
// // // ${feedbackText}

// // // Return ONLY the JSON object and nothing else.
// // // `;
// // // };


// // // export const buildPrompt = (assignment: any, feedback?: any, attempt = 0) => {
// // //   const concepts = assignment.concepts?.length ? assignment.concepts : ["General"];
// // //   const includeHints = !!assignment.includeHints;

// // //   return `
// // // You are a PROFESSIONAL EXAMINER and simultaneously simulate a NOVICE STUDENT.
// // // Generate a JSON-only exam paper EXACTLY matching the schema below. No extra text or markdown.

// // // SCHEMA:
// // // {
// // //   "preparation": {
// // //     "questionsNeeded": ["..."],
// // //     "studyPlan": "...",
// // //     "adviceForExaminer": "..."
// // //   },
// // //   "studentInfo": { "name":"", "rollNumber":"", "section":"", "class":"", "subject":"${assignment.topic}", "date":"" },
// // //   "instructions": "${assignment.instructions || "Attempt all questions"}",
// // //   "sections": [
// // //     { "title":"Section A", "instruction":"Attempt all questions", "questions":[ /* easy questions */ ] },
// // //     { "title":"Section B", "instruction":"Attempt any questions", "questions":[ /* medium questions */ ] },
// // //     { "title":"Section C", "instruction":"Attempt any questions", "questions":[ /* hard questions */ ] }
// // //   ]
// // // }

// // // GENERAL RULES:
// // // 1. Total Questions & Marks:
// // //    - Section A: ${assignment.difficulty.easy} EASY questions, marks=${assignment.marksPerQuestion.easy}
// // //    - Section B: ${assignment.difficulty.medium} MEDIUM questions, marks=${assignment.marksPerQuestion.medium}
// // //    - Section C: ${assignment.difficulty.hard} HARD questions, marks=${assignment.marksPerQuestion.hard}
// // //    - Anti-Pattern: wrong number of questions or marks
// // //    - Good Pattern: correct count and marks per section

// // // 2. Concept Coverage:
// // //    - All concepts must appear at least once.
// // //    - DO NOT ignore any concept.
// // //    - DO NOT repeat the same concept in consecutive questions.
// // //    - Anti-Pattern: "Explain CPU scheduling" ignores "Deadlock"
// // //    - Good Pattern: "Compare Deadlock and CPU scheduling in a scenario."

// // // 3. Question Structure:
// // //    - Fields: id(unique), text(min 30 chars), difficulty, marks, type, conceptsUsed
// // //    - Hints & rubrics only for HARD questions.
// // //    - DO NOT start multiple questions with same phrase.
// // //    - Anti-Pattern: "Explain Deadlock" repeated 3 times.
// // //    - Good Pattern: "Compare Deadlock scenarios in OS with practical example."

// // // 4. Section Specific Rules:
// // //    - Section A (Easy): focus on understanding
// // //      - Anti-Pattern: "Design multi-threaded scheduling" in EASY
// // //    - Section B (Medium): apply knowledge
// // //      - Anti-Pattern: "Define Deadlock" in MEDIUM
// // //    - Section C (Hard): complex analysis, applied problems
// // //      - Anti-Pattern: trivial questions
// // //      - Must include rubric and hint

// // // 5. Verb Variety:
// // //    - Allowed verbs: compare, analyze, design, evaluate, implement, justify, derive, illustrate, discuss
// // //    - DO NOT repeat verbs in consecutive questions
// // //    - Anti-Pattern: Q1: Compare X, Q2: Compare Y, Q3: Compare Z
// // //    - Good Pattern: Q1: Compare X, Q2: Analyze Y, Q3: Design Z

// // // 6. Hints:
// // //    - Only HARD questions
// // //    - DO NOT reveal solution
// // //    - Anti-Pattern: "Solution: Deadlock occurs..."
// // //    - Good Pattern: "Hint: Begin by identifying resource allocation order"

// // // 7. Rubrics:
// // //    - Only HARD questions
// // //    - Anti-Pattern: rubric in EASY question
// // //    - Good Pattern: ["Key points (4)", "Example (3)", "Clarity (3)"]

// // // 8. Prevent Repetition:
// // //    - DO NOT repeat text
// // //    - DO NOT produce near-duplicate questions
// // //    - Anti-Pattern: "Compare Deadlock" → "Define Deadlock"
// // //    - Good Pattern: unique scenarios per question

// // // 9. JSON Output Rules:
// // //    - Section A instruction: "Attempt all questions"
// // //    - Section B/C instruction: "Attempt any questions"
// // //    - Include preparation object
// // //    - Anti-Pattern: missing preparation, broken JSON
// // //    - Good Pattern: proper JSON, all fields present

// // // 10. Preparation Object:
// // //     - questionsNeeded: 3 clarifying questions
// // //     - studyPlan: 3-step plan
// // //     - adviceForExaminer: 1-2 sentences
// // //     - Anti-Pattern: missing preparation
// // //     - Good Pattern: fully filled object

// // // 11. Example Question Patterns:
// // //     - Bad: "Explain Paging" (too short, vague)
// // //     - Good: "Compare paging and segmentation; discuss trade-offs."
// // //     - Bad: "Explain Deadlock" (repeated)
// // //     - Good: "Analyze Deadlock conditions with practical scenario."

// // // 12. Feedback Incorporation (if provided):
// // //     - Address missing concepts
// // //     - Rephrase duplicated questions
// // //     - Improve low-quality questions
// // //     - Anti-Pattern: ignore feedback

// // // 13. Quality Control:
// // //     - Minimum 30 characters per question
// // //     - Use applied examples for HARD questions
// // //     - Anti-Pattern: vague or trivial questions
// // //     - Good Pattern: specific, scenario-based, exam-level

// // // 14. Strictness for Final Output:
// // //     - Unique IDs
// // //     - Unique text
// // //     - Cover all concepts
// // //     - Hints & rubrics for HARD only
// // //     - Verbs & formats varied
// // //     - Anti-Pattern: same opening phrase, same verb repeated
// // //     - Good Pattern: each question unique and diverse

// // // 15. Anti-pattern Examples Table:
// // //     - EASY: trivial definitions, repeated verbs, same starting phrase
// // //     - MEDIUM: vague application, repeated scenario
// // //     - HARD: missing hints/rubric, repeated verbs, trivial analysis
// // //     - Good Pattern: clear, applied, diverse verbs, unique IDs, all concepts

// // // 16. Step-by-Step Generation:
// // //     - Section A first, then B, then C
// // //     - Rephrase each section to avoid repetition
// // //     - Anti-Pattern: copying same verb/pattern across sections
// // //     - Good Pattern: varied verbs, unique scenarios, logical flow

// // // 17. Verb & Format Variation Enforcement:
// // //     - Ensure at least 4 different verbs across paper
// // //     - Use scenario-based, applied, example-oriented questions
// // //     - Anti-Pattern: all questions start with "Explain"
// // //     - Good Pattern: start with Compare/Analyze/Design/Evaluate etc.

// // // 18. Marks Consistency:
// // //     - DO NOT assign wrong marks per difficulty
// // //     - Anti-Pattern: EASY question = 10 marks
// // //     - Good Pattern: marks match assignment configuration

// // // 19. Hints & Rubric Consistency:
// // //     - Hints only in HARD
// // //     - Rubrics only in HARD
// // //     - Anti-Pattern: EASY question has hint
// // //     - Good Pattern: proper hints and rubrics

// // // 20. Feedback Notes (if available):
// // // ${feedback ? `
// // // - Missing concepts: ${JSON.stringify(feedback.missingConcepts || [])}
// // // - Duplicate questions: ${feedback.duplicatesFound || 0}
// // // - Low-quality questions: ${JSON.stringify(feedback.lowQualityQuestions || [])}` : ""}

// // // Return ONLY JSON matching schema.
// // // Include preparation object.
// // // Ensure all sections, questions, hints, rubrics, and instructions follow rules.
// // // No extra text, no markdown, no explanations.
// // // `;

// // // };



// // export const buildPrompt = (assignment: any) => {
// //   const concepts = assignment.concepts?.length
// //     ? assignment.concepts.join(", ")
// //     : "general concepts";

// //   return `
// // You are an experienced teacher creating a real-world exam paper.

// // Create a balanced and practical question paper.

// // ========================
// // INPUT
// // ========================
// // Subject: ${assignment.subject}
// // Class: ${assignment.class}
// // Topic: ${assignment.topic}
// // Concepts: ${concepts}

// // Instructions: ${assignment.instructions || "Attempt all questions"}

// // Difficulty:
// // - Easy: ${assignment.difficulty.easy} questions (${assignment.marksPerQuestion.easy} marks each)
// // - Medium: ${assignment.difficulty.medium} questions (${assignment.marksPerQuestion.medium} marks each)
// // - Hard: ${assignment.difficulty.hard} questions (${assignment.marksPerQuestion.hard} marks each)

// // ========================
// // REQUIREMENTS
// // ========================

// // 1. Paper Structure:
// // - Section A → Easy questions
// // - Section B → Medium questions
// // - Section C → Hard questions

// // 2. Question Rules:
// // - Questions should be clear and meaningful
// // - Avoid repeating same question
// // - Slight similarity is acceptable
// // - Use mix of verbs (Explain, Compare, Analyze, Discuss, Evaluate)
// // - Not every question needs to be complex

// // 3. Difficulty:
// // - Easy → basic understanding
// // - Medium → application
// // - Hard → analysis / real-world thinking

// // 4. Hints:
// // ${assignment.includeHints ? "- Add hints ONLY for hard questions" : "- Do NOT include hints"}

// // 5. Real-world behavior:
// // - Paper does NOT need to be perfect
// // - Some simple questions are fine
// // - Some variation is enough
// // - Focus on usability, not perfection

// // ========================
// // OUTPUT FORMAT (STRICT JSON)
// // ========================

// // {
// //   "studentInfo": {
// //     "name": "",
// //     "rollNumber": "",
// //     "section": "",
// //     "class": "${assignment.class}",
// //     "subject": "${assignment.subject}",
// //     "date": ""
// //   },
// //   "instructions": "${assignment.instructions || "Attempt all questions"}",
// //   "sections": [
// //     {
// //       "title": "Section A",
// //       "instruction": "Attempt all questions",
// //       "questions": [
// //         {
// //           "text": "Question here",
// //           "difficulty": "easy",
// //           "marks": ${assignment.marksPerQuestion.easy},
// //           "type": "theory"
// //         }
// //       ]
// //     },
// //     {
// //       "title": "Section B",
// //       "instruction": "Attempt any questions",
// //       "questions": [
// //         {
// //           "text": "Question here",
// //           "difficulty": "medium",
// //           "marks": ${assignment.marksPerQuestion.medium},
// //           "type": "theory"
// //         }
// //       ]
// //     },
// //     {
// //       "title": "Section C",
// //       "instruction": "Attempt any questions",
// //       "questions": [
// //         {
// //           "text": "Question here",
// //           "difficulty": "hard",
// //           "marks": ${assignment.marksPerQuestion.hard},
// //           "type": "theory"
// //           ${assignment.includeHints ? ', "hint": "Helpful hint"' : ""}
// //         }
// //       ]
// //     }
// //   ]
// // }

// // ========================
// // IMPORTANT
// // ========================
// // - Return ONLY JSON
// // - Do NOT include explanations
// // - Do NOT include markdown
// // - Ensure all sections are filled properly
// // `;
// // };


// export const buildPrompt = (assignment: any, config: any) => {
//   const concepts = assignment.concepts?.length
//     ? assignment.concepts.join(", ")
//     : "general concepts";

//   return `
// You are an experienced teacher creating a real-world exam paper.

// ================ INPUT ================
// Subject: ${assignment.subject}
// Class: ${assignment.class}
// Topic: ${assignment.topic}
// Concepts: ${concepts}

// Difficulty:
// - Easy: ${config.distribution.easy} questions (${config.marks.easy} marks)
// - Medium: ${config.distribution.medium} questions (${config.marks.medium} marks)
// - Hard: ${config.distribution.hard} questions (${config.marks.hard} marks)

// ================ RULES ================
// - Avoid repetition
// - Use different verbs
// - Keep paper realistic (not perfect)
// - Easy = basic, Medium = applied, Hard = analytical
// ${assignment.includeHints ? "- Add hints ONLY in hard questions" : ""}

// ================ OUTPUT JSON ================
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

// IMPORTANT:
// - Return ONLY JSON
// - No markdown
// - No explanation
// `;
// };


// export const buildPrompt = (assignment: any, config: any) => {
//   const concepts = assignment.concepts?.length
//     ? assignment.concepts.join(", ")
//     : "general concepts";

//   return `
// You are an experienced teacher creating a practical exam paper.

// ================ INPUT ================
// Subject: ${assignment.subject}
// Class: ${assignment.class}
// Topic: ${assignment.topic}
// Concepts: ${concepts}

// Difficulty Distribution:
// - Easy: ${config.distribution.easy} questions (${config.marks.easy} marks each)
// - Medium: ${config.distribution.medium} questions (${config.marks.medium} marks each)
// - Hard: ${config.distribution.hard} questions (${config.marks.hard} marks each)

// ================ INSTRUCTIONS ================
// - Create a realistic exam paper (not perfect, but usable)
// - Avoid exact repetition of questions
// - Use a mix of verbs: Explain, Compare, Analyze, Discuss, Evaluate
// - Easy → basic understanding
// - Medium → application-based
// - Hard → analytical / real-world

// ${assignment.includeHints ? "- Add hints ONLY for hard questions" : ""}

// ================ OUTPUT FORMAT ================
// Return a JSON object like this:

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
//       "questions": [
//         {
//           "text": "Question here",
//           "difficulty": "easy",
//           "marks": ${config.marks.easy},
//           "type": "theory"
//         }
//       ]
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

// IMPORTANT:
// - Return ONLY JSON
// - Do NOT use markdown
// - Keep structure similar (small variations allowed)
// `;
// };


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