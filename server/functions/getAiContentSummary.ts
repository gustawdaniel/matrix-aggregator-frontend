import { getOpenApiMessage } from "~/server/ai";
import {
  getSummaryPersona,
  getSummaryPrompt,
} from "~/server/functions/prompt/summary";

export async function getAiContentSummary(content: string): Promise<string> {
  const summary = await getOpenApiMessage([
    { role: "system", content: getSummaryPersona() },
    {
      role: "user",
      content: getSummaryPrompt() + "\n\n" + content,
    },
  ]);

  console.log('summary>>', summary, "<<summary");

  return summary;
}
