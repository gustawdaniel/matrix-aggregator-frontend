import { Db } from "mongodb";

export async function getDefaultPersona(db: Db): Promise<string> {
  const promptsCollection = db.collection("prompts"); // Assuming articles collection
  const promptDoc = await promptsCollection.findOne({});
  if (promptDoc) {
    return promptDoc.persona;
  }
  return `You are a helpful assistant. Take care about correctness of json format.`;
}