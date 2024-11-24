import { MongoClient, ObjectId } from "mongodb";
import { Article } from "~/types/Article";
import { connectDb } from "~/server/db";

export default defineEventHandler(async (event) => {
  const params = event.context.params;
  if (!params || !params.id) {
    throw new Error("Missing required parameter: id");
  }

  const id = params.id;

  const db = await connectDb();
  const collection = db.collection("raw_articles");

  return await collection.findOne<Article>({ _id: new ObjectId(id) });
});
