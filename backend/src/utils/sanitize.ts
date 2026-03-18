import sanitizeHtml from "sanitize-html";

export const cleanText = (input: string) => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
};