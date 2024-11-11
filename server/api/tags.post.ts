import {connectDb} from "~/server/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const db = await connectDb();
  const tagsCollection = db.collection('tags');

  const newTag = {
    name: body.name,
    color: body.color,
  };

  const result = await tagsCollection.insertOne(newTag);
  return { _id: result.insertedId, ...newTag };
});
