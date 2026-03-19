

export const validateAIOutput = (parsed: any, assignment: any): boolean => {
  try {
   
    if (!parsed || typeof parsed !== 'object') {
      console.log(" No valid object returned");
      return false;
    }

 
    if (!parsed.studentInfo) {
      console.log(" studentInfo missing");
      return false;
    }

    const requiredStudentFields = ["name", "rollNumber", "section", "class", "subject", "date"] as const;
    for (const field of requiredStudentFields) {
      if (!(field in parsed.studentInfo)) {
        console.log(` studentInfo.${field} missing`);
        return false;
      }
    }

  
    if (!parsed.instructions || typeof parsed.instructions !== 'string') {
      console.log("instructions missing");
      return false;
    }

  
    if (!parsed.sections || !Array.isArray(parsed.sections) || parsed.sections.length !== 3) {
      console.log(" sections must be array of 3");
      return false;
    }

   
    let totalQuestions = 0;
    const difficultyCount = { easy: 0, medium: 0, hard: 0 };
    type Difficulty = keyof typeof difficultyCount;

    for (let i = 0; i < parsed.sections.length; i++) {
      const section = parsed.sections[i];
     
      if (!section.title || !section.instruction || !section.questions) {
        console.log(` Section ${i+1} missing title/instruction/questions`);
        return false;
      }

 
      if (!Array.isArray(section.questions)) {
        console.log(` Section ${i+1} questions not array`);
        return false;
      }

  
      for (const q of section.questions) {
        if (!q.text || q.text.length < 5) {
          console.log(` Question missing text or too short`);
          return false;
        }

      
        const difficultyRaw = q.difficulty;
        
        if (typeof difficultyRaw !== 'string' || !["easy", "medium", "hard"].includes(difficultyRaw)) {
          console.log(`Question invalid difficulty: ${difficultyRaw}`);
          return false;
        }

        const difficulty = difficultyRaw as Difficulty;

        if (!q.marks || typeof q.marks !== 'number') {
          console.log(` Question missing marks`);
          return false;
        }

        if (assignment.includeHints && difficulty === "hard" && !q.hint) {
          console.log(` Hard question missing hint`);
          return false;
        }

        totalQuestions++;
        difficultyCount[difficulty]++;
      }
    }

 
    if (totalQuestions < assignment.totalQuestions) {
      console.log(` Only ${totalQuestions} questions, need ${assignment.totalQuestions}`);
      return false;
    }

    if (difficultyCount.easy < assignment.difficulty.easy) {
      console.log(` Easy questions: ${difficultyCount.easy} < ${assignment.difficulty.easy}`);
      return false;
    }

    if (difficultyCount.medium < assignment.difficulty.medium) {
      console.log(` Medium questions: ${difficultyCount.medium} < ${assignment.difficulty.medium}`);
      return false;
    }

    if (difficultyCount.hard < assignment.difficulty.hard) {
      console.log(` Hard questions: ${difficultyCount.hard} < ${assignment.difficulty.hard}`);
      return false;
    }

    for (const q of parsed.sections.flatMap((s: any) => s.questions)) {
      const difficulty = q.difficulty as Difficulty;
      const expectedMarks = assignment.marksPerQuestion[difficulty];
      
      if (q.marks !== expectedMarks) {
        console.log(`${difficulty} question has ${q.marks} marks, should be ${expectedMarks}`);
        return false;
      }
    }



   
const questionTypesPresent = new Set();
for (const q of parsed.sections.flatMap((s: any) => s.questions)) {
  if (q.type) {
    questionTypesPresent.add(q.type);
  }
}

if (assignment.questionTypes?.length > 0) {
  const missingTypes = assignment.questionTypes.filter(
    (type: string) => !questionTypesPresent.has(type)
  );
  
  if (missingTypes.length > 0) {
    console.log(` Missing question types: ${missingTypes.join(", ")}`);
    return false;
  }
}

for (let i = 0; i < parsed.sections.length; i++) {
  const section = parsed.sections[i];
  
  if (i === 0 && !section.instruction.includes("all questions")) {
    console.log(` Section A instruction should say "Attempt all questions"`);
    return false;
  }
  
  if (i > 0 && !section.instruction.includes("any")) {
    console.log(`Section ${i === 1 ? 'B' : 'C'} instruction should say "Attempt any X questions"`);
    return false;
  }
}

    console.log("All validation passed!");
    return true;

  } catch (error) {
    console.log("Validation error:", error);
    return false;
  }
};