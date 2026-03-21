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