import { connectDb } from "~/server/db";
import { ObjectId } from "mongodb";
import { Article } from "~/types/Article";
import { clearArticleContent } from "~/server/functions/clearArticleContent";
import { getOpenApiMessage } from "~/server/ai";
import { analyzeAiSummary } from "~/server/functions/analyzeAiSummary";

async function getDefaultPersona(): Promise<string> {
  return `You are a stock marker broker focused on US stocks and commodity markets. You are a professional trader and have a deep understanding of the markets and the stocks. You are also a proficient writer and can write in a concise and clear manner. Your goal is to provide a summary of the article in a short and informative manner, highlighting the most important stock market tickers and their expected price influence. Your summary should be no longer than 100 words.`;
}

// TODO: get from database
async function getDefaultPrompt(): Promise<string> {
  return `Write max 1 sentence summary of article. Then list JSON array of stock market tickers and expected price influence only if they are significant. Please care about correct JSON structure For example

"""
Japanese PM Shigeru Ishiba will lead a fragile minority government amid rising tensions and economic challenges.

[
  {"code": "TSLA","name":"Tesla", "move": "down", "reason": "trade tension concerns with U.S."},
  {"code": "TOYOF","name":"Toyota", "move":"down", "reason": "potential trade measures by Trump"},
  {"code": "SNE", "name":"Sony", "move": "down", "reason": "economic uncertainty"}
]
"""`;
}

export default defineEventHandler(async (event) => {
  const { art_id } = event.context.params ?? {};

  // 1 fetch article from db
  if (!art_id) {
    return { statusCode: 400, body: { error: "Missing required parameters" } };
  }

  const db = await connectDb();

  // Connect to MongoDB
  const articlesCollection = db.collection<Article>("raw_articles"); // Assuming articles collection
  const article = await articlesCollection.findOne({
    _id: new ObjectId(art_id),
  });

  if (!article) {
    return { statusCode: 404, body: { error: `Article ${art_id} not found` } };
  }

  // 2 clear article content
  const content = clearArticleContent(article.markdown, article.source);
  // 3 create summary
  // if(article.summary) {
  //   return { statusCode: 200, body: { message: `Summary existed for article ${art_id}`, summary: article.summary } };
  // }

  const summaryWithTickers = await getOpenApiMessage([
    { role: "system", content: await getDefaultPersona() },
    {
      role: "user",
      content: await getDefaultPrompt() + '\n\n' + content,
    },
  ])

  console.log(summaryWithTickers);

  const {summary, tickers} = analyzeAiSummary(summaryWithTickers);

  const allTickers = article.tickers ? article.tickers.concat(tickers) : tickers;
  const rawSummaries = article.rawSummaries ? article.rawSummaries.concat([summaryWithTickers]) : [summaryWithTickers];

  // 4 update article with summary
  await articlesCollection.updateOne(
    { _id: new ObjectId(art_id) },
    {
      $set: {
        summary: article.summary ? (article.summary.length < summary.length ? article.summary : summary) : summary,
      },
      $push: {
        rawSummaries: summaryWithTickers,
        tickers: {
          $each: tickers,
        }
      }
    },
  );

  return { statusCode: 200, body: { message: `Summary created for article ${art_id}`, tickers: allTickers, summary, rawSummaries } };
})

