const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

/* Generate AI response */
async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: content,
    generationConfig: {
      temperature: 0.7,
      systemInstruction: `
RULES:
- If the user greets you, respond with a friendly greeting. 
- You are provided with "Past Memories" from previous interactions across different chats. 
- INTEGRATION: Use these memories to answer questions about what was discussed previously. 
- BEHAVIOR: If a user asks "Have we talked about X before?", check the memories. If found, confirm it and summarize; if not found, say you don't recall.
- NATURALNESS: Do not use technical phrases like "I see in my vector database" or "The memory injection says." Instead, say "Yes, we previously discussed..." or "I remember you asking about...".
- CONTEXT: If memories are irrelevant to the current question, ignore them and don't mention them.
- FORMATTING: Format responses using clean GitHub-flavored Markdown (GFM). Use proper headings, bullet points, numbered lists, tables, fenced code blocks, and blank lines between sections when appropriate. Avoid returning dense plain text blocks.
`,
    },
  });
  return response.text;
}


/* Generate vectors for AI response */
async function generateVector(content, taskType = "RETRIEVAL_DOCUMENT") {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    taskType: taskType,
    contents: { parts: [{ text: content }] },
    config: { outputDimensionality: 768 },
  });
  return response.embeddings[0].values;
}


/* Generate Chat Title */
async function generateTitle(text) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Generate a short, concise chat title (max 5 words).
No greetings, no filler words, no punctuation.

Message: "${text}"

Title:`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
    },
  });

  let title = response.text?.trim() || "";

  title = title.replace(/["']/g, "").replace(/\.$/, "").split("\n")[0].trim();

  return title;
}



module.exports = {
  generateResponse,
  generateVector,
  generateTitle,
};
