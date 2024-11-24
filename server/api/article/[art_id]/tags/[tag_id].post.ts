import { connectDb } from "~/server/db";
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
  const { art_id, tag_id } = event.context.params ?? {}; // Article and Tag IDs from URL params
  const { significance } = await readBody(event); // `significance` from the request body

  if (!art_id || !tag_id || !significance) {
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
  const tag = await tagsCollection.findOne({ _id: new ObjectId(tag_id) });

  if (!article) {
    return { statusCode: 404, body: { error: `Article ${art_id} not found` } };
  }
  if (!tag) {
    return { statusCode: 404, body: { error: `Tag ${tag_id} not found` } };
  }

  // Handle adding or updating/removing tags from the article

  // Check if the tag already exists in the article's tags array
  const existingTag = (article.tags ?? []).find(
    (t: { tag_id: ObjectId }) =>
      new ObjectId(t.tag_id).toString() === new ObjectId(tag_id).toString(),
  );

  if (existingTag) {
    // Update the significance of the existing tag if it's different
    if (existingTag.significance !== significance) {
      try {
        await articlesCollection.updateOne(
          { _id: new ObjectId(art_id), "tags.tag_id": new ObjectId(tag_id) },
          { $set: { "tags.$.significance": significance } }, // Update significance
        );
        return {
          statusCode: 200,
          body: { message: "Tag significance updated" },
        };
      } catch (err) {
        console.error(err);
        return {
          statusCode: 500,
          body: { error: "Failed to update tag significance" },
        };
      }
    } else {
      return {
        statusCode: 200,
        body: { message: "Tag significance is already up to date" },
      };
    }
  } else {
    // Add new tag if it doesn't exist in the article's tags
    try {
      await articlesCollection.updateOne(
        { _id: new ObjectId(art_id) },
        { $addToSet: { tags: { tag_id: new ObjectId(tag_id), significance } } }, // Adding tag with significance
      );
      return { statusCode: 200, body: { message: "Tag added to article" } };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        body: { error: "Failed to add tag to article" },
      };
    }
  }
});
