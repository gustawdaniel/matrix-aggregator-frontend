import { connectDb } from "~/server/db";
import { ObjectId } from "mongodb";
import { Article } from "~/types/Article";
import { clearArticleContent } from "~/server/functions/clearArticleContent";
import { getOpenApiMessage } from "~/server/ai";
import { analyzeAiSummary } from "~/server/functions/analyzeAiSummary";
import { getMarkdownContent } from "~/server/functions/getMarkdownContent";

async function getDefaultPersona(): Promise<string> {
  return `You are a helpful assistant. Take care about correctness of json format.`;
}

// TODO: get from database
async function getDefaultPrompt(): Promise<string> {
  return `"Analyze the uploaded article and perform the following tasks:
1. Summarize the content in a single sentence.
2. Identify any U.S. stock tickers (e.g., NASDAQ, NYSE) only if the impact be very significant (more than 5% price change in 1D period) by the information in the article. If not, skip them.
3. Mark the U.S stock ticker if the information in the article is crucial for the stock (e.g. strike in the factory, death of the CEO etc.)
4. For each identified ticker, indicate the expected market impact using word (up or down) and provide a brief reason for your assessment."

Output Example:

"""
The article discusses [key topic in one sentence].

[
  {"code": "AAPL","name":"Apple Inc.", "move": "up", "reason": "reason"},
  {"code": "TSLA","name":"Tesla Inc.", "move":"down", "reason": "reason"},
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

  const markdown = getMarkdownContent(article.html, article.source);
  // 2 clear article content
  const content = clearArticleContent(markdown, article.source);
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

