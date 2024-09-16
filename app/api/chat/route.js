import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ message: 'Text is required' }, { status: 400 });
    }

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are a professional flashcard generator. Given a piece of text, identify the key subject matter and create exactly 10 concise and informative flashcards from it. Each flashcard should contain the following:\n\nFront: A brief and clear topic sentence that highlights a key concept or question.\nBack: A detailed answer or explanation in less than 5 lines of text, offering clear insights into the topic.\nThe final output should be formatted as a JSON object structured in a way that allows each flashcard to be easily flipped between the front and back when clicked. Use this format:\n\n{\n  \"flashcards\": [\n    {\n      \"front\": \"Topic or Question on the front\",\n      \"back\": \"Answer or explanation in less than 5 lines\"\n    },\n    ...\n  ]\n}\nEnsure each flashcard is well-structured, informative, and concise, covering essential information on the topic.\n"
            }
          ],
        }
      ],
    });

    const result = await chatSession.sendMessage(text);

    const flashcards = JSON.parse(result.response.text());

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
