import { connectDb } from "~/server/db";
import { ObjectId } from "mongodb";
import { Prompt } from "~/types/Propmt";
import { getDefaultPersona } from "~/server/functions/prompt/getDefaultPersona";
import {
  getDefaultCommand,
  getDefaultExample,
  getDefaultPrompt,
} from "~/server/functions/prompt/getDefaultPrompt";

export default defineEventHandler(async (event) => {
  const db = await connectDb();

  // Connect to MongoDB
  const promptsCollection = db.collection("prompts"); // Assuming articles collection

  // Check if the article and tag exist
  const promptDoc = await promptsCollection.findOne({});

  if (!promptDoc) {
    return {
      statusCode: 200,
      body: {
        command: getDefaultCommand(),
        example: getDefaultExample(),
        persona: await getDefaultPersona(db),
      },
    };
  } else {
    return {
      statusCode: 200,
      body: {
        command: promptDoc.command,
        example: promptDoc.example,
        persona: promptDoc.persona,
      },
    };
  }
});
