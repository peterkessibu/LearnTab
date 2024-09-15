import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `
You are a professional flashcard generator. Given a piece of text, identify the key subject matter and create exactly 10 concise and informative flashcards from it. Each flashcard should contain the following:

Front: A brief and clear topic sentence that highlights a key concept or question.
Back: A detailed answer or explanation in less than 5 lines of text, offering clear insights into the topic.
The final output should be formatted as a JSON object structured in a way that allows each flashcard to be easily flipped between the front and back when clicked. Use this format:

{
  "flashcards": [
    {
      "front": "Topic or Question on the front",
      "back": "Answer or explanation in less than 5 lines"
    },
    ...
  ]
}
Ensure each flashcard is well-structured, informative, and concise, covering essential information on the topic.
`;

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
    'X-Title': 'learn-tab',
  },
});

export async function POST(request) {
  try {
    const { text } = await request.json(); // Ensure request is parsed as JSON

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create flashcards from the following text: ${text}` },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const flashcards = JSON.parse(content).flashcards;
    return NextResponse.json(flashcards);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { message: 'Error generating flashcards', error: error.message },
      { status: 500 }
    );
  }
}
