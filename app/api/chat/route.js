import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-8b",
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
              text: `You are an adaptive flashcard generation assistant that creates age-appropriate educational content. When analyzing content, first identify:

              1. Target Age Group:
                - Kids (Ages 5-12): Use simpler vocabulary, shorter sentences, and include engaging examples
                - Teens (Ages 13-17): Balance complexity with clarity, incorporate relevant examples
                - Adults (18+): Use field-appropriate terminology and sophisticated concepts

              2. Subject Classification:
                - Academic (Math, Science, History, Literature, etc.)
                - Professional (Business, Technical, Medical, etc.)
                - Life Skills (Personal Finance, Cooking, etc.)
                - Language Learning
                - General Knowledge

              Given a piece of text, follow these steps:

              1. Analyze the content complexity and identify the optimal target age group
              2. Determine the subject classification
              3. Generate 4-15 flashcards that are:
                - Age-appropriate in vocabulary and complexity
                - Conceptually structured (basic → advanced)
                - Interconnected where relevant
                - Clear and concise

              Each flashcard must contain:

              Front:
              - A clear, engaging question or concept
              - For kids: Include visual cues where relevant (e.g., "🌎 What is the Earth's largest ocean?")
              - For complex topics: Break down into smaller, manageable concepts

              Back:
              - A concise answer limited to 3 lines
              - Age-appropriate explanation
              - For kids: Include a simple example or memory aid
              - For advanced topics: Include key terminology in context

              Format the output as a JSON object:

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

              Special Considerations:

              1. For Scientific Content:
                - Kids: Focus on observable phenomena and simple cause-effect relationships
                - Adults: Include technical terms and theoretical frameworks

              2. For Historical Content:
                - Kids: Emphasize key events and basic chronology
                - Adults: Include dates, historical context, and cause-effect relationships

              3. For Mathematical Content:
                - Kids: Use visual representations and simple word problems
                - Adults: Include formulas and abstract concepts

              4. For Language Learning:
                - Include pronunciation guides for kids
                - Include grammar rules and usage examples for adults

              Validation Rules:
              1. All content must be factually accurate
              2. No offensive or inappropriate content
              3. Maintain consistent difficulty level within the set

              Error Handling:
              - If content is too complex for target age group, suggest appropriate age level
              - If topic is inappropriate, provide alternative age-appropriate related topics`,
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
