const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const cohortChatGptIndex = pc.index("cohort-gpt");

// createMemory in Pinecone
async function createMemory({ vectors, messageId, metadata }) {
  await cohortChatGptIndex.upsert({
    records: [
      {
        id: messageId, // id
        values: vectors, // vectors
        metadata: metadata, // metadata (other data)
      },
    ],
  });
}

// queryMemory in Pinecone
async function queryMemory({ queryVector, limit = 5, metadata }) {
  const data = await cohortChatGptIndex.query({
    vector: queryVector, // vector data
    topK: limit, // number of results to return
    ...(metadata && { filter: metadata }),
    includeMetadata: true, // whether to include metadata in the results
  });

  return data.matches || []; // return the matches from the query results
}

// deleteMemory from Pinecone
async function deleteMemory({ chatId }) {
  try {
    await cohortChatGptIndex.deleteMany({
      filter: {
        fromChatId: { $eq: chatId },
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Pinecone Deletion Error:", error);
    throw new Error("Failed to delete vector embeddings");
  }
}

module.exports = {
  createMemory,
  queryMemory,
  deleteMemory,
};
