import { connectDb } from "~/server/db";
import { ObjectId } from "mongodb";
import { Prompt } from "~/types/Propmt";

export default defineEventHandler(async (event) => {
  const prompt = await readBody<Prompt>(event); // `significance` from the request body
  const db = await connectDb();

  // Connect to MongoDB
  const promptsCollection = db.collection("prompts"); // Assuming articles collection

  // Check if the article and tag exist
  const promptDoc = await promptsCollection.findOne({});

  if (!promptDoc) {
    await promptsCollection.insertOne(prompt);
    return { statusCode: 200, body: prompt };
  }

  try {
    await promptsCollection.updateOne(
      { _id: promptDoc._id },
      {
        $set: {
          ...prompt,
        },
      }, // Update significance
    );
    return { statusCode: 200, body: prompt };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: { error: "Failed to update prompt" },
    };
  }
});