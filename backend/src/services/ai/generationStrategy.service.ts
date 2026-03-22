// =========================
// 🎯 ADVANCED DISTRIBUTION
// =========================
export const getAdvancedDistribution = (totalMarks: number) => {
  // realistic exam marking pattern
  const marksPool = {
    easy: [1, 2],       // short answer
    medium: [3, 4],     // medium answer
    hard: [5, 6],       // long + analytical
  };

  // weight distribution (realistic)
  const weights = {
    easy: 1.9,
    medium: 2.7,
    hard: 1.5,
  };

  const totalWeight = weights.easy + weights.medium + weights.hard;

  const targetMarks = {
    easy: Math.round((weights.easy / totalWeight) * totalMarks),
    medium: Math.round((weights.medium / totalWeight) * totalMarks),
    hard: Math.round((weights.hard / totalWeight) * totalMarks),
  };

  return {
    marksPool,
    targetMarks,
  };
};

// =========================
// 📚 SECTION BUILDER (A, B, C, D)
// =========================
export const buildSectionsFromStrategy = () => {
  return [
    {
      title: "Section A",
      instruction: "Attempt all questions",
      difficulty: "easy",
      marksRange: [1, 2],
    },
    {
      title: "Section B",
      instruction: "Attempt all questions",
      difficulty: "medium",
      marksRange: [3, 4],
    },
    {
      title: "Section C",
      instruction: "Attempt all questions",
      difficulty: "hard",
      marksRange: [5],
    },
    {
      title: "Section D",
      instruction: "Attempt all questions",
      difficulty: "hard",
      marksRange: [6],
    },
  ];
};

// =========================
// 🔥 REGENERATION PROMPT ENHANCER
// =========================
export const enhancePromptForRegeneration = (prompt: string) => {
  return (
    prompt +
    `

================ REGENERATION MODE ================

You MUST generate a completely NEW question paper.

STRICT RULES:
- Do NOT repeat any previous questions
- Do NOT reuse same wording
- Change examples, case studies, and scenarios
- Use different verbs (Analyze, Evaluate, Compare, etc.)
- Ensure variation across all sections
- Maintain difficulty distribution properly

=================================================

`
  );
};

// =========================
// 🎲 RANDOM MARK PICKER (REALISTIC)
// =========================
export const getRandomMarkFromRange = (range: number[]) => {
  const index = Math.floor(Math.random() * range.length);
  return range[index];
};
