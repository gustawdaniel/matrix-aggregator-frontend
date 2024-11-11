import {connectDb} from "~/server/db";
import {ObjectId} from "mongodb";

export default defineEventHandler(async (event) => {
  const {art_id, tag_id} = event.context.params ?? {}; // Article and Tag IDs from URL params

  if (!art_id || !tag_id) {
    return {statusCode: 400, body: {error: 'Missing required parameters'}};
  }

  const db = await connectDb();

  // Connect to MongoDB
  const articlesCollection = db.collection('web_pages'); // Assuming articles collection

  console.log(art_id, tag_id);

  try {
    // Convert IDs to ObjectId
    const articleObjectId = new ObjectId(art_id);
    const tagObjectId = new ObjectId(tag_id);

    // Fetch the document first
    const article = await articlesCollection.findOne({ _id: articleObjectId });

    if (!article || !Array.isArray(article.tags)) {
      return {
        statusCode: 404,
        body: { message: 'Article or tags not found' },
      };
    }

    console.log('article.tags', article.tags);
    console.log('tagObjectId', tagObjectId);

    // Filter out the tag with the given tag_id
    const updatedTags = article.tags.filter(
        (tag: { tag_id: ObjectId }) => !tag.tag_id.equals(tagObjectId)
    );

    console.log('updatedTags',updatedTags);

    // Update the article with the filtered tags array
    const result = await articlesCollection.updateOne(
        { _id: articleObjectId },
        { $set: { tags: updatedTags } }
    );

    if (result.modifiedCount === 0) {
      return {
        statusCode: 500,
        body: { error: 'Failed to remove tag from article' },
      };
    }

    return { statusCode: 200, body: { message: 'Tag removed from article' } };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: { error: 'Failed to remove tag from article' } };
  }




})
