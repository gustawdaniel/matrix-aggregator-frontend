import { MongoClient, ObjectId } from "mongodb";
import { Article } from "~/types/Article";
import { connectDb } from "~/server/db";
import { getMarkdownContent } from "~/server/functions/getMarkdownContent";

export default defineEventHandler(async (event) => {
  const params = event.context.params;
  if (!params || !params.id) {
    throw new Error("Missing required parameter: id");
  }

  const id = params.id;

  const db = await connectDb();
  const collection = db.collection("raw_articles");

  const article = await collection.findOne<Article>({ _id: new ObjectId(id) });

  if (!article) {
    return { statusCode: 404, body: { error: `Article ${id} not found` } };
  }

  article.markdown = getMarkdownContent(article.html, article.source);
  article.html = '';
  return article;
});
