import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 9 flashcards.
The front should be a brief topic sentence withh the back being a less than 5 lines sentences.
You should return in the following JSON format such that when I click the front of the card the back shows and vice versa:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": 'localhost:3000', // Change to your production URL in production
    "X-Title": 'Headstarter', // Replace with your app's name
  }
})

export async function POST(request) {
  try {
    const text = await request.text()

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create flashcards from the following text: ${text}` }
      ],
    })

    const flashcards = JSON.parse(completion.choices[0].message.content).flashcards
    return NextResponse.json(flashcards)
  } catch (error) {
    console.error("Error generating flashcards:", error)
    return NextResponse.error("Error generating flashcards", { status: 500 })
  }
}
