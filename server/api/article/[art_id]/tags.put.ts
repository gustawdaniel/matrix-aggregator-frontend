import { connectDb } from "~/server/db";
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
  const { art_id } = event.context.params ?? {}; // Article and Tag IDs from URL params
  const tagsString = await readBody(event); // `significance` from the request body

  const tags = JSON.parse(tagsString);

  if (!Array.isArray(tags)) {
    return { statusCode: 400, body: { error: "Tags must be an array" } };
  }

  if (!art_id) {
    return { statusCode: 400, body: { error: "Missing required parameters" } };
  }

  const db = await connectDb();

  // Connect to MongoDB
  const articlesCollection = db.collection("raw_articles"); // Assuming articles collection
  const tagsCollection = db.collection("tags"); // Assuming tags collection

  // Check if the article and tag exist
  const article = await articlesCollection.findOne({
    _id: new ObjectId(art_id),
  });

  if (!article) {
    return { statusCode: 404, body: { error: `Article ${art_id} not found` } };
  }

  try {
    await articlesCollection.updateOne(
      { _id: new ObjectId(art_id) },
      {
        $set: {
          tags: tags.map((tag) => ({
            tag_id: new ObjectId(tag.tag_id),
            significance: Number(tag.significance),
          })),
        },
      }, // Update significance
    );
    return { statusCode: 200, body: { message: "Tag significance updated" } };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: { error: "Failed to update tag significance" },
    };
  }
});
