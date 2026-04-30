import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
Extract structured data from user query.

Return ONLY JSON:
{
  "device": "",
  "city": "",
  "condition": "",
  "availability": ""
}
        `,
      },
      { role: "user", content: message },
    ],
  });

  let text = response.choices[0].message.content || "{}";

  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  return NextResponse.json({ result: text });
}