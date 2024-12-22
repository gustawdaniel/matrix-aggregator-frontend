import { Db } from "mongodb";

export function getDefaultCommand(): string {
  return `"Analyze the uploaded article and perform the following tasks:
1. Summarize the content in a single sentence.
2. Identify any U.S. stock tickers (e.g., NASDAQ, NYSE) only if the impact be very significant (more than 5% price change in 1D period) by the information in the article. If not, skip them.
3. Mark the U.S stock ticker if the information in the article is crucial for the stock (e.g. strike in the factory, death of the CEO etc.)
4. For each identified ticker, indicate the expected market impact using word (up or down) and provide a brief reason for your assessment."`;
}

export function getDefaultExample(): string {
  return `Output Example:

"""
The article discusses [key topic in one sentence].

[
  {"code": "AAPL","name":"Apple Inc.", "move": "up", "reason": "reason"},
  {"code": "TSLA","name":"Tesla Inc.", "move":"down", "reason": "reason"},
]
"""`;
}

export async function getDefaultPrompt(db: Db): Promise<string> {
  const promptsCollection = db.collection("prompts"); // Assuming articles collection
  const promptDoc = await promptsCollection.findOne({});
  if (promptDoc) {
    return `${promptDoc.command}

${promptDoc.example}`;
  }

  return `${getDefaultCommand()}

${getDefaultExample()}`;
}