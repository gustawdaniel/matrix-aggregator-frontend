import {connectDb} from "~/server/db";

export default defineEventHandler(async (event) => {
  const db = await connectDb();
  const tagsCollection = db.collection('tags');
  return  await tagsCollection.find().toArray();
});