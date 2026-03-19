

// // // // // // // // // // export const validateAIOutput = (parsed: any, assignment: any): boolean => {
// // // // // // // // // //   try {
   
// // // // // // // // // //     if (!parsed || typeof parsed !== 'object') {
// // // // // // // // // //       console.log(" No valid object returned");
// // // // // // // // // //       return false;
// // // // // // // // // //     }

 
// // // // // // // // // //     if (!parsed.studentInfo) {
// // // // // // // // // //       console.log(" studentInfo missing");
// // // // // // // // // //       return false;
// // // // // // // // // //     }

// // // // // // // // // //     const requiredStudentFields = ["name", "rollNumber", "section", "class", "subject", "date"] as const;
// // // // // // // // // //     for (const field of requiredStudentFields) {
// // // // // // // // // //       if (!(field in parsed.studentInfo)) {
// // // // // // // // // //         console.log(` studentInfo.${field} missing`);
// // // // // // // // // //         return false;
// // // // // // // // // //       }
// // // // // // // // // //     }

  
// // // // // // // // // //     if (!parsed.instructions || typeof parsed.instructions !== 'string') {
// // // // // // // // // //       console.log("instructions missing");
// // // // // // // // // //       return false;
// // // // // // // // // //     }

  
// // // // // // // // // //     if (!parsed.sections || !Array.isArray(parsed.sections) || parsed.sections.length !== 3) {
// // // // // // // // // //       console.log(" sections must be array of 3");
// // // // // // // // // //       return false;
// // // // // // // // // //     }

   
// // // // // // // // // //     let totalQuestions = 0;
// // // // // // // // // //     const difficultyCount = { easy: 0, medium: 0, hard: 0 };
// // // // // // // // // //     type Difficulty = keyof typeof difficultyCount;

// // // // // // // // // //     for (let i = 0; i < parsed.sections.length; i++) {
// // // // // // // // // //       const section = parsed.sections[i];
     
// // // // // // // // // //       if (!section.title || !section.instruction || !section.questions) {
// // // // // // // // // //         console.log(` Section ${i+1} missing title/instruction/questions`);
// // // // // // // // // //         return false;
// // // // // // // // // //       }

 
// // // // // // // // // //       if (!Array.isArray(section.questions)) {
// // // // // // // // // //         console.log(` Section ${i+1} questions not array`);
// // // // // // // // // //         return false;
// // // // // // // // // //       }

  
// // // // // // // // // //       for (const q of section.questions) {
// // // // // // // // // //         if (!q.text || q.text.length < 5) {
// // // // // // // // // //           console.log(` Question missing text or too short`);
// // // // // // // // // //           return false;
// // // // // // // // // //         }

      
// // // // // // // // // //         const difficultyRaw = q.difficulty;
        
// // // // // // // // // //         if (typeof difficultyRaw !== 'string' || !["easy", "medium", "hard"].includes(difficultyRaw)) {
// // // // // // // // // //           console.log(`Question invalid difficulty: ${difficultyRaw}`);
// // // // // // // // // //           return false;
// // // // // // // // // //         }

// // // // // // // // // //         const difficulty = difficultyRaw as Difficulty;

// // // // // // // // // //         if (!q.marks || typeof q.marks !== 'number') {
// // // // // // // // // //           console.log(` Question missing marks`);
// // // // // // // // // //           return false;
// // // // // // // // // //         }

// // // // // // // // // //         if (assignment.includeHints && difficulty === "hard" && !q.hint) {
// // // // // // // // // //           console.log(` Hard question missing hint`);
// // // // // // // // // //           return false;
// // // // // // // // // //         }

// // // // // // // // // //         totalQuestions++;
// // // // // // // // // //         difficultyCount[difficulty]++;
// // // // // // // // // //       }
// // // // // // // // // //     }

 
// // // // // // // // // //     if (totalQuestions < assignment.totalQuestions) {
// // // // // // // // // //       console.log(` Only ${totalQuestions} questions, need ${assignment.totalQuestions}`);
// // // // // // // // // //       return false;
// // // // // // // // // //     }

// // // // // // // // // //     if (difficultyCount.easy < assignment.difficulty.easy) {
// // // // // // // // // //       console.log(` Easy questions: ${difficultyCount.easy} < ${assignment.difficulty.easy}`);
// // // // // // // // // //       return false;
// // // // // // // // // //     }

// // // // // // // // // //     if (difficultyCount.medium < assignment.difficulty.medium) {
// // // // // // // // // //       console.log(` Medium questions: ${difficultyCount.medium} < ${assignment.difficulty.medium}`);
// // // // // // // // // //       return false;
// // // // // // // // // //     }

// // // // // // // // // //     if (difficultyCount.hard < assignment.difficulty.hard) {
// // // // // // // // // //       console.log(` Hard questions: ${difficultyCount.hard} < ${assignment.difficulty.hard}`);
// // // // // // // // // //       return false;
// // // // // // // // // //     }

// // // // // // // // // //     for (const q of parsed.sections.flatMap((s: any) => s.questions)) {
// // // // // // // // // //       const difficulty = q.difficulty as Difficulty;
// // // // // // // // // //       const expectedMarks = assignment.marksPerQuestion[difficulty];
      
// // // // // // // // // //       if (q.marks !== expectedMarks) {
// // // // // // // // // //         console.log(`${difficulty} question has ${q.marks} marks, should be ${expectedMarks}`);
// // // // // // // // // //         return false;
// // // // // // // // // //       }
// // // // // // // // // //     }



   
// // // // // // // // // // const questionTypesPresent = new Set();
// // // // // // // // // // for (const q of parsed.sections.flatMap((s: any) => s.questions)) {
// // // // // // // // // //   if (q.type) {
// // // // // // // // // //     questionTypesPresent.add(q.type);
// // // // // // // // // //   }
// // // // // // // // // // }

// // // // // // // // // // if (assignment.questionTypes?.length > 0) {
// // // // // // // // // //   const missingTypes = assignment.questionTypes.filter(
// // // // // // // // // //     (type: string) => !questionTypesPresent.has(type)
// // // // // // // // // //   );
  
// // // // // // // // // //   if (missingTypes.length > 0) {
// // // // // // // // // //     console.log(` Missing question types: ${missingTypes.join(", ")}`);
// // // // // // // // // //     return false;
// // // // // // // // // //   }
// // // // // // // // // // }

// // // // // // // // // // for (let i = 0; i < parsed.sections.length; i++) {
// // // // // // // // // //   const section = parsed.sections[i];
  
// // // // // // // // // //   if (i === 0 && !section.instruction.includes("all questions")) {
// // // // // // // // // //     console.log(` Section A instruction should say "Attempt all questions"`);
// // // // // // // // // //     return false;
// // // // // // // // // //   }
  
// // // // // // // // // //   if (i > 0 && !section.instruction.includes("any")) {
// // // // // // // // // //     console.log(`Section ${i === 1 ? 'B' : 'C'} instruction should say "Attempt any X questions"`);
// // // // // // // // // //     return false;
// // // // // // // // // //   }
// // // // // // // // // // }

// // // // // // // // // //     console.log("All validation passed!");
// // // // // // // // // //     return true;

// // // // // // // // // //   } catch (error) {
// // // // // // // // // //     console.log("Validation error:", error);
// // // // // // // // // //     return false;
// // // // // // // // // //   }
// // // // // // // // // // };



// // // // // // // // // export const validateAIOutput = (parsed: any, assignment: any): boolean => {
// // // // // // // // //   try {
// // // // // // // // //     if (!parsed || typeof parsed !== "object") {
// // // // // // // // //       console.log("No valid object returned");
// // // // // // // // //       return false;
// // // // // // // // //     }

// // // // // // // // //     // Validate studentInfo
// // // // // // // // //     if (!parsed.studentInfo) {
// // // // // // // // //       console.log("studentInfo missing");
// // // // // // // // //       return false;
// // // // // // // // //     }

// // // // // // // // //     const requiredStudentFields = ["name", "rollNumber", "section", "class", "subject", "date"] as const;
// // // // // // // // //     for (const field of requiredStudentFields) {
// // // // // // // // //       if (!(field in parsed.studentInfo)) {
// // // // // // // // //         console.log(`studentInfo.${field} missing`);
// // // // // // // // //         return false;
// // // // // // // // //       }
// // // // // // // // //     }

// // // // // // // // //     // Validate instructions
// // // // // // // // //     if (!parsed.instructions || typeof parsed.instructions !== "string") {
// // // // // // // // //       console.log("instructions missing or invalid");
// // // // // // // // //       return false;
// // // // // // // // //     }

// // // // // // // // //     // Validate sections
// // // // // // // // //     if (!parsed.sections || !Array.isArray(parsed.sections) || parsed.sections.length !== 3) {
// // // // // // // // //       console.log("sections must be an array of 3");
// // // // // // // // //       return false;
// // // // // // // // //     }

// // // // // // // // //     let totalQuestions = 0;
// // // // // // // // //     const difficultyCount: Record<"easy" | "medium" | "hard", number> = { easy: 0, medium: 0, hard: 0 };
// // // // // // // // //     type Difficulty = keyof typeof difficultyCount;

// // // // // // // // //     for (let i = 0; i < parsed.sections.length; i++) {
// // // // // // // // //       const section = parsed.sections[i];

// // // // // // // // //       if (!section.title || !section.instruction || !section.questions || !Array.isArray(section.questions)) {
// // // // // // // // //         console.log(`Section ${i + 1} missing title/instruction/questions or questions not array`);
// // // // // // // // //         return false;
// // // // // // // // //       }

// // // // // // // // //       for (const q of section.questions) {
// // // // // // // // //         if (!q.text || q.text.length < 5) {
// // // // // // // // //           console.log(`Question missing text or too short`);
// // // // // // // // //           return false;
// // // // // // // // //         }

// // // // // // // // //         const difficultyRaw = q.difficulty;
// // // // // // // // //         if (typeof difficultyRaw !== "string" || !["easy", "medium", "hard"].includes(difficultyRaw)) {
// // // // // // // // //           console.log(`Question invalid difficulty: ${difficultyRaw}`);
// // // // // // // // //           return false;
// // // // // // // // //         }

// // // // // // // // //         const difficulty = difficultyRaw as Difficulty;

// // // // // // // // //         if (!q.marks || typeof q.marks !== "number") {
// // // // // // // // //           console.log("Question missing marks");
// // // // // // // // //           return false;
// // // // // // // // //         }

// // // // // // // // //         if (assignment.includeHints && difficulty === "hard" && !q.hint) {
// // // // // // // // //           console.log("Hard question missing hint");
// // // // // // // // //           return false;
// // // // // // // // //         }

// // // // // // // // //         totalQuestions++;
// // // // // // // // //         difficultyCount[difficulty]++;
// // // // // // // // //       }
// // // // // // // // //     }

// // // // // // // // //     // Check total and per-difficulty counts
// // // // // // // // //     if (totalQuestions < assignment.totalQuestions) {
// // // // // // // // //       console.log(`Only ${totalQuestions} questions, need ${assignment.totalQuestions}`);
// // // // // // // // //       return false;
// // // // // // // // //     }

// // // // // // // // //     if (difficultyCount.easy < assignment.difficulty.easy) {
// // // // // // // // //       console.log(`Easy questions: ${difficultyCount.easy} < ${assignment.difficulty.easy}`);
// // // // // // // // //       return false;
// // // // // // // // //     }
// // // // // // // // //     if (difficultyCount.medium < assignment.difficulty.medium) {
// // // // // // // // //       console.log(`Medium questions: ${difficultyCount.medium} < ${assignment.difficulty.medium}`);
// // // // // // // // //       return false;
// // // // // // // // //     }
// // // // // // // // //     if (difficultyCount.hard < assignment.difficulty.hard) {
// // // // // // // // //       console.log(`Hard questions: ${difficultyCount.hard} < ${assignment.difficulty.hard}`);
// // // // // // // // //       return false;
// // // // // // // // //     }

// // // // // // // // //     // Check marks consistency
// // // // // // // // //     for (const q of parsed.sections.flatMap((s: any) => s.questions)) {
// // // // // // // // //       const difficulty = q.difficulty as Difficulty;
// // // // // // // // //       const expectedMarks = assignment.marksPerQuestion[difficulty];
// // // // // // // // //       if (q.marks !== expectedMarks) {
// // // // // // // // //         console.log(`${difficulty} question has ${q.marks} marks, should be ${expectedMarks}`);
// // // // // // // // //         return false;
// // // // // // // // //       }
// // // // // // // // //     }

// // // // // // // // //     // Check question types if specified
// // // // // // // // //     const questionTypesPresent = new Set<string>();
// // // // // // // // //     for (const q of parsed.sections.flatMap((s: any) => s.questions)) {
// // // // // // // // //       if (q.type) questionTypesPresent.add(q.type);
// // // // // // // // //     }
// // // // // // // // //     if (assignment.questionTypes?.length) {
// // // // // // // // //       const missingTypes = assignment.questionTypes.filter((t: string) => !questionTypesPresent.has(t));
// // // // // // // // //       if (missingTypes.length > 0) {
// // // // // // // // //         console.log(`Missing question types: ${missingTypes.join(", ")}`);
// // // // // // // // //         return false;
// // // // // // // // //       }
// // // // // // // // //     }

// // // // // // // // //     // Check section instructions
// // // // // // // // //     parsed.sections.forEach((section: any, idx: number) => {
// // // // // // // // //       if (idx === 0 && !section.instruction.toLowerCase().includes("all questions")) {
// // // // // // // // //         console.log(`Section A instruction should say "Attempt all questions"`);
// // // // // // // // //         return false;
// // // // // // // // //       }
// // // // // // // // //       if (idx > 0 && !section.instruction.toLowerCase().includes("any")) {
// // // // // // // // //         console.log(`Section ${idx === 1 ? "B" : "C"} instruction should include "any"`);
// // // // // // // // //         return false;
// // // // // // // // //       }
// // // // // // // // //     });

// // // // // // // // //     console.log("All validation passed!");
// // // // // // // // //     return true;

// // // // // // // // //   } catch (err) {
// // // // // // // // //     console.log("Validation error:", err);
// // // // // // // // //     return false;
// // // // // // // // //   }
// // // // // // // // // };



// // // // // // // // export const validateAIOutput = (parsed: any, assignment: any): boolean => {
// // // // // // // //   try {
// // // // // // // //     if (!parsed || typeof parsed !== "object") {
// // // // // // // //       console.log("No valid object returned");
// // // // // // // //       return false;
// // // // // // // //     }

// // // // // // // //     // Validate studentInfo
// // // // // // // //     if (!parsed.studentInfo) {
// // // // // // // //       console.log("studentInfo missing");
// // // // // // // //       return false;
// // // // // // // //     }

// // // // // // // //     const requiredStudentFields = ["name", "rollNumber", "section", "class", "subject", "date"] as const;
// // // // // // // //     for (const field of requiredStudentFields) {
// // // // // // // //       if (!(field in parsed.studentInfo)) {
// // // // // // // //         console.log(`studentInfo.${field} missing`);
// // // // // // // //         return false;
// // // // // // // //       }
// // // // // // // //     }

// // // // // // // //     // Validate instructions
// // // // // // // //     if (!parsed.instructions || typeof parsed.instructions !== "string") {
// // // // // // // //       console.log("instructions missing or invalid");
// // // // // // // //       return false;
// // // // // // // //     }

// // // // // // // //     // Validate sections
// // // // // // // //     if (!parsed.sections || !Array.isArray(parsed.sections) || parsed.sections.length !== 3) {
// // // // // // // //       console.log("sections must be an array of 3");
// // // // // // // //       return false;
// // // // // // // //     }

// // // // // // // //     let totalQuestions = 0;
// // // // // // // //     const difficultyCount: Record<"easy" | "medium" | "hard", number> = { easy: 0, medium: 0, hard: 0 };
// // // // // // // //     type Difficulty = keyof typeof difficultyCount;

// // // // // // // //     // Collect all question texts for duplicate detection
// // // // // // // //     const allQuestionsText: string[] = [];

// // // // // // // //     for (let i = 0; i < parsed.sections.length; i++) {
// // // // // // // //       const section = parsed.sections[i];

// // // // // // // //       if (!section.title || !section.instruction || !section.questions || !Array.isArray(section.questions)) {
// // // // // // // //         console.log(`Section ${i + 1} missing title/instruction/questions or questions not array`);
// // // // // // // //         return false;
// // // // // // // //       }

// // // // // // // //       for (const q of section.questions) {
// // // // // // // //         if (!q.text || q.text.trim().length < 5) {
// // // // // // // //           console.log(`Question missing text or too short`);
// // // // // // // //           return false;
// // // // // // // //         }

// // // // // // // //         const difficultyRaw = q.difficulty;
// // // // // // // //         if (typeof difficultyRaw !== "string" || !["easy", "medium", "hard"].includes(difficultyRaw)) {
// // // // // // // //           console.log(`Question invalid difficulty: ${difficultyRaw}`);
// // // // // // // //           return false;
// // // // // // // //         }
// // // // // // // //         const difficulty = difficultyRaw as Difficulty;

// // // // // // // //         if (!q.marks || typeof q.marks !== "number") {
// // // // // // // //           console.log("Question missing marks");
// // // // // // // //           return false;
// // // // // // // //         }

// // // // // // // //         // Hint check for hard questions
// // // // // // // //         if (assignment.includeHints && difficulty === "hard" && !q.hint) {
// // // // // // // //           console.log("Hard question missing hint");
// // // // // // // //           return false;
// // // // // // // //         }

// // // // // // // //         totalQuestions++;
// // // // // // // //         difficultyCount[difficulty]++;

// // // // // // // //         // Add question text to duplicate check
// // // // // // // //         allQuestionsText.push(q.text.trim());
// // // // // // // //       }
// // // // // // // //     }

// // // // // // // //     // Check total and per-difficulty counts
// // // // // // // //     if (totalQuestions < assignment.totalQuestions) {
// // // // // // // //       console.log(`Only ${totalQuestions} questions, need ${assignment.totalQuestions}`);
// // // // // // // //       return false;
// // // // // // // //     }

// // // // // // // //     if (difficultyCount.easy < assignment.difficulty.easy) {
// // // // // // // //       console.log(`Easy questions: ${difficultyCount.easy} < ${assignment.difficulty.easy}`);
// // // // // // // //       return false;
// // // // // // // //     }
// // // // // // // //     if (difficultyCount.medium < assignment.difficulty.medium) {
// // // // // // // //       console.log(`Medium questions: ${difficultyCount.medium} < ${assignment.difficulty.medium}`);
// // // // // // // //       return false;
// // // // // // // //     }
// // // // // // // //     if (difficultyCount.hard < assignment.difficulty.hard) {
// // // // // // // //       console.log(`Hard questions: ${difficultyCount.hard} < ${assignment.difficulty.hard}`);
// // // // // // // //       return false;
// // // // // // // //     }

// // // // // // // //     // Check marks consistency
// // // // // // // //     for (const q of parsed.sections.flatMap((s: any) => s.questions)) {
// // // // // // // //       const difficulty = q.difficulty as Difficulty;
// // // // // // // //       const expectedMarks = assignment.marksPerQuestion[difficulty];
// // // // // // // //       if (q.marks !== expectedMarks) {
// // // // // // // //         console.log(`${difficulty} question has ${q.marks} marks, should be ${expectedMarks}`);
// // // // // // // //         return false;
// // // // // // // //       }
// // // // // // // //     }

// // // // // // // //     // Check question types if specified
// // // // // // // //     if (assignment.questionTypes?.length) {
// // // // // // // //       const questionTypesPresent = new Set(parsed.sections.flatMap((s: any) => s.questions.map((q: any) => q.type)));
// // // // // // // //       const missingTypes = assignment.questionTypes.filter((t: string) => !questionTypesPresent.has(t));
// // // // // // // //       if (missingTypes.length > 0) {
// // // // // // // //         console.log(`Missing question types: ${missingTypes.join(", ")}`);
// // // // // // // //         return false;
// // // // // // // //       }
// // // // // // // //     }

// // // // // // // //     // Check section instructions
// // // // // // // //     parsed.sections.forEach((section: any, idx: number) => {
// // // // // // // //       if (idx === 0 && !section.instruction.toLowerCase().includes("all questions")) {
// // // // // // // //         console.log(`Section A instruction should say "Attempt all questions"`);
// // // // // // // //         return false;
// // // // // // // //       }
// // // // // // // //       if (idx > 0 && !section.instruction.toLowerCase().includes("any")) {
// // // // // // // //         console.log(`Section ${idx === 1 ? "B" : "C"} instruction should include "any"`);
// // // // // // // //         return false;
// // // // // // // //       }
// // // // // // // //     });

// // // // // // // //     // -------------------------------
// // // // // // // //     // Duplicate question detection
// // // // // // // //     const duplicates = allQuestionsText.filter((item, index) => allQuestionsText.indexOf(item) !== index);
// // // // // // // //     if (duplicates.length > 0) {
// // // // // // // //       console.log("Duplicate questions found:", duplicates);
// // // // // // // //       return false;
// // // // // // // //     }

// // // // // // // //     console.log("All validation passed!");
// // // // // // // //     return true;

// // // // // // // //   } catch (err) {
// // // // // // // //     console.log("Validation error:", err);
// // // // // // // //     return false;
// // // // // // // //   }
// // // // // // // // };



// // // // // // // export const validateAIOutput = (parsed: any, assignment: any): boolean => {
// // // // // // //   try {
// // // // // // //     if (!parsed || typeof parsed !== "object") {
// // // // // // //       console.log("❌ Not an object");
// // // // // // //       return false;
// // // // // // //     }

// // // // // // //     // ✅ Basic structure check only
// // // // // // //     if (!parsed.sections || !Array.isArray(parsed.sections)) {
// // // // // // //       console.log("❌ Sections missing");
// // // // // // //       return false;
// // // // // // //     }

// // // // // // //     if (parsed.sections.length === 0) {
// // // // // // //       console.log("❌ No sections");
// // // // // // //       return false;
// // // // // // //     }

// // // // // // //     let totalQuestions = 0;

// // // // // // //     for (const section of parsed.sections) {
// // // // // // //       if (!section.questions || !Array.isArray(section.questions)) {
// // // // // // //         console.log("❌ Section has no questions");
// // // // // // //         return false;
// // // // // // //       }

// // // // // // //       for (const q of section.questions) {
// // // // // // //         // ✅ minimal checks only
// // // // // // //         if (!q.text || q.text.trim().length < 10) {
// // // // // // //           console.log("❌ Bad question text");
// // // // // // //           return false;
// // // // // // //         }

// // // // // // //         if (!q.marks || typeof q.marks !== "number") {
// // // // // // //           console.log("❌ Missing marks");
// // // // // // //           return false;
// // // // // // //         }

// // // // // // //         // ❌ DO NOT strictly validate difficulty
// // // // // // //         // ❌ DO NOT reject for hint missing
// // // // // // //         // ❌ DO NOT reject for type missing

// // // // // // //         totalQuestions++;
// // // // // // //       }
// // // // // // //     }

// // // // // // //     // ✅ soft total check (not strict)
// // // // // // //     if (assignment.totalMarks && totalQuestions === 0) {
// // // // // // //       console.log("❌ No questions generated");
// // // // // // //       return false;
// // // // // // //     }

// // // // // // //     console.log("✅ Basic validation passed");
// // // // // // //     return true;

// // // // // // //   } catch (err) {
// // // // // // //     console.log("Validation error:", err);
// // // // // // //     return false;
// // // // // // //   }
// // // // // // // };


// // // // // // export const validateAIOutput = (parsed: any): boolean => {
// // // // // //   try {
// // // // // //     if (!parsed || typeof parsed !== "object") return false;

// // // // // //     if (!parsed.sections || !Array.isArray(parsed.sections)) return false;

// // // // // //     let totalQuestions = 0;

// // // // // //     const allTexts = new Set<string>();

// // // // // //     for (const section of parsed.sections) {
// // // // // //       if (!section.questions || !Array.isArray(section.questions)) {
// // // // // //         return false;
// // // // // //       }

// // // // // //       for (const q of section.questions) {
// // // // // //         // ✅ only basic check
// // // // // //         if (!q.text || q.text.trim().length < 10) {
// // // // // //           console.log("❌ Bad question text");
// // // // // //           return false;
// // // // // //         }

// // // // // //         if (!q.marks || typeof q.marks !== "number") {
// // // // // //           return false;
// // // // // //         }

// // // // // //         // ✅ soft duplicate check
// // // // // //         const normalized = q.text.toLowerCase().trim();

// // // // // //         if (allTexts.has(normalized)) {
// // // // // //           console.log("⚠️ Duplicate detected (allowed)");
// // // // // //         }

// // // // // //         allTexts.add(normalized);

// // // // // //         totalQuestions++;
// // // // // //       }
// // // // // //     }

// // // // // //     if (totalQuestions === 0) return false;

// // // // // //     console.log("✅ Validation passed");
// // // // // //     return true;

// // // // // //   } catch {
// // // // // //     return false;
// // // // // //   }
// // // // // // };


// // // // // export const validateAIOutput = (parsed: any): boolean => {
// // // // //   try {
// // // // //     if (!parsed || typeof parsed !== "object") {
// // // // //       console.log("❌ Invalid object");
// // // // //       return false;
// // // // //     }

// // // // //     if (!parsed.sections || !Array.isArray(parsed.sections)) {
// // // // //       console.log("❌ Sections missing");
// // // // //       return false;
// // // // //     }

// // // // //     let totalQuestions = 0;

// // // // //     for (const section of parsed.sections) {
// // // // //       if (!section.questions || !Array.isArray(section.questions)) {
// // // // //         console.log("❌ Questions missing in section");
// // // // //         return false;
// // // // //       }

// // // // //       for (const q of section.questions) {
// // // // //         // 🟢 Handle string questions (Groq case)
// // // // //         if (typeof q === "string") {
// // // // //           if (q.trim().length < 5) {
// // // // //             console.log("❌ Bad string question");
// // // // //             return false;
// // // // //           }
// // // // //           totalQuestions++;
// // // // //           continue;
// // // // //         }

// // // // //         // 🟢 Object question
// // // // //         if (!q.text || q.text.trim().length < 5) {
// // // // //           console.log("❌ Bad question text");
// // // // //           return false;
// // // // //         }

// // // // //         // marks optional (fallback safe)
// // // // //         if (q.marks && typeof q.marks !== "number") {
// // // // //           console.log("❌ Invalid marks");
// // // // //           return false;
// // // // //         }

// // // // //         totalQuestions++;
// // // // //       }
// // // // //     }

// // // // //     if (totalQuestions === 0) {
// // // // //       console.log("❌ No questions");
// // // // //       return false;
// // // // //     }

// // // // //     console.log("✅ Validation passed");
// // // // //     return true;

// // // // //   } catch (err) {
// // // // //     console.log("❌ Validation error", err);
// // // // //     return false;
// // // // //   }
// // // // // };


// // // // export const validateAIOutput = (parsed: any): boolean => {
// // // //   try {
// // // //     if (!parsed || typeof parsed !== "object") {
// // // //       console.log("❌ Invalid object");
// // // //       return false;
// // // //     }

// // // //     if (!Array.isArray(parsed.sections) || parsed.sections.length === 0) {
// // // //       console.log("❌ Sections missing");
// // // //       return false;
// // // //     }

// // // //     let totalQuestions = 0;

// // // //     for (const section of parsed.sections) {
// // // //       if (!Array.isArray(section.questions)) {
// // // //         console.log("❌ Questions missing in section");
// // // //         return false;
// // // //       }

// // // //       for (const q of section.questions) {
// // // //         const text =
// // // //           typeof q === "string"
// // // //             ? q.trim()
// // // //             : typeof q?.text === "string"
// // // //             ? q.text.trim()
// // // //             : null;

// // // //         // ❌ invalid text
// // // //         if (!text || text.length < 25) {
// // // //           console.log("❌ Low quality question");
// // // //           return false;
// // // //         }

// // // //         // ❌ generic garbage
// // // //         if (/^explain\s+concept$/i.test(text)) {
// // // //           console.log("❌ Generic question detected");
// // // //           return false;
// // // //         }

// // // //         // marks check (if exists)
// // // //         if (q?.marks && typeof q.marks !== "number") {
// // // //           console.log("❌ Invalid marks");
// // // //           return false;
// // // //         }

// // // //         totalQuestions++;
// // // //       }
// // // //     }

// // // //     if (totalQuestions < 3) {
// // // //       console.log("❌ Too few questions");
// // // //       return false;
// // // //     }

// // // //     console.log("✅ Validation passed");
// // // //     return true;

// // // //   } catch (err) {
// // // //     console.log("❌ Validation error", err);
// // // //     return false;
// // // //   }
// // // // };



// // // export const validateAIOutput = (parsed: any): boolean => {
// // //   try {
// // //     if (!parsed?.sections?.length) return false;

// // //     let validCount = 0;

// // //     for (const section of parsed.sections) {
// // //       for (const q of section.questions || []) {
// // //         const text =
// // //           typeof q === "string" ? q : q?.text;

// // //         if (!text || text.length < 20) continue;

// // //         validCount++;
// // //       }
// // //     }

// // //     return validCount >= 3;
// // //   } catch {
// // //     return false;
// // //   }
// // // };



// // export const validateAIOutput = (parsed: any): boolean => {
// //   try {
// //     if (!parsed?.sections?.length) {
// //       console.log("❌ No sections found");
// //       return false;
// //     }

// //     let validCount = 0;

// //     for (const section of parsed.sections) {
// //       if (!Array.isArray(section.questions)) {
// //         console.log("❌ Questions missing in section");
// //         return false;
// //       }

// //       for (const q of section.questions) {
// //         const text =
// //           typeof q === "string"
// //             ? q.trim()
// //             : typeof q?.text === "string"
// //             ? q.text.trim()
// //             : null;

// //         if (!text || text.length < 20) {
// //           console.log("❌ Invalid question:", text);
// //           continue;
// //         }

// //         validCount++;
// //       }
// //     }

// //     console.log(`✅ Valid questions count: ${validCount}`);

// //     if (validCount < 3) {
// //       console.log("❌ Too few valid questions");
// //       return false;
// //     }

// //     return true;
// //   } catch (err) {
// //     console.log("❌ Validation crashed:", err);
// //     return false;
// //   }
// // };



// export const validateAIOutput = (parsed: any): boolean => {
//   try {
//     if (!parsed?.sections?.length) {
//       console.log("❌ No sections found");
//       return false;
//     }

//     let validCount = 0;

//     for (const section of parsed.sections) {
//       if (!Array.isArray(section.questions)) {
//         console.log("❌ Questions missing in section");
//         return false;
//       }

//       for (const q of section.questions) {
//         const text =
//           typeof q === "string"
//             ? q.trim()
//             : typeof q?.text === "string"
//             ? q.text.trim()
//             : typeof q?.question === "string" // 🔥 FIX
//             ? q.question.trim()
//             : null;

//         if (!text || text.length < 20) {
//           console.log("❌ Invalid question:", q);
//           continue;
//         }

//         validCount++;
//       }
//     }

//     console.log(`✅ Valid questions count: ${validCount}`);

//     if (validCount < 3) {
//       console.log("❌ Too few valid questions");
//       return false;
//     }

//     return true;
//   } catch (err) {
//     console.log("❌ Validation crashed:", err);
//     return false;
//   }
// };


export const validateAIOutput = (parsed: any): boolean => {
  try {
    console.log("🔍 Starting AI validation...");

    // ❌ basic structure check
    if (!parsed || typeof parsed !== "object") {
      console.log("❌ Invalid object");
      return false;
    }

    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      console.log("❌ Sections missing or not array");
      return false;
    }

    if (parsed.sections.length === 0) {
      console.log("❌ No sections found");
      return false;
    }

    let validCount = 0;

    for (const section of parsed.sections) {
      if (!Array.isArray(section.questions)) {
        console.log("❌ Questions missing in section:", section?.title);
        return false;
      }

      for (const q of section.questions) {
        // 🔥 flexible text extraction
        const text =
          typeof q === "string"
            ? q.trim()
            : typeof q?.text === "string"
            ? q.text.trim()
            : typeof q?.question === "string"
            ? q.question.trim()
            : null;

        // ❌ invalid / empty / short
        if (!text || text.length < 20) {
          console.log("❌ Invalid question:", q);
          continue;
        }

        // ❌ generic garbage filter
        if (/^explain\s+concept$/i.test(text)) {
          console.log("❌ Generic question detected:", text);
          continue;
        }

        // ❌ marks validation (if exists)
        if (q?.marks !== undefined && typeof q.marks !== "number") {
          console.log("❌ Invalid marks type:", q);
          return false;
        }

        validCount++;
      }
    }

    console.log(`✅ Valid questions count: ${validCount}`);

    // ❌ too few valid questions
    if (validCount < 3) {
      console.log("❌ Too few valid questions");
      return false;
    }

    console.log("✅ Validation passed");

    return true;
  } catch (err) {
    console.log("❌ Validation crashed:", err);
    return false;
  }
};