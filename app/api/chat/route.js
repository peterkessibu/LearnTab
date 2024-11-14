import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
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
      return NextResponse.json(
        { message: "Text is required" },
        { status: 400 },
      );
    }

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `You are a professional flashcard generator. Given a piece of text, identify the key subject matter and create the flashcards based on the information needed, it should be more than 4 but less than 15 concise and informative flashcards from it. Each flashcard should contain the following:

Front: A brief and clear topic sentence that highlights a key concept or question.
Back: A concise answer or explanation in less than 3 lines of text and should not overflow on the card generated, offering clear insights into the topic.
The final output should be formatted as a JSON object structured in a way that allows each flashcard to be easily flipped between the front and back when clicked. Use this format:

{
  "flashcards": {
    "flashcards": [
      {
        "front": "Topic or Question on the front",
        "back": "Answer or explanation in less than 5 lines"
      },
      // More flashcards...
    ]
  }
}
Ensure each flashcard is well-structured, informative, and concise, covering essential information on the topic.`,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(text);

    // Ensure the response is parsed correctly and in the expected format
    let flashcards;
    try {
      const responseText = await result.response.text();
      const parsedResponse = JSON.parse(responseText);

      // Ensure the response format is { "flashcards": { "flashcards": [...] } }
      if (
        parsedResponse.flashcards &&
        Array.isArray(parsedResponse.flashcards.flashcards)
      ) {
        flashcards = parsedResponse.flashcards.flashcards;
      } else {
        throw new Error(
          "Unexpected response format. Expected an array of flashcards.",
        );
      }
    } catch (e) {
      console.error("Error parsing JSON:", e);
      throw new Error("Error parsing flashcards JSON.");
    }

    return NextResponse.json({ flashcards: { flashcards } });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}
