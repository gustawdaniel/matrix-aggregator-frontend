import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getOpenApiMessage(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });

    return completion.choices[0].message.content ?? '';
  } catch (error) {
    console.error("Error:", error);
    return '';
  }
}

