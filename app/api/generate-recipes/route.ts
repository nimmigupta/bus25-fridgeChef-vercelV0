import OpenAI from "openai"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: Request) {
  try {
    const modelProvider = request.headers.get("x-model-provider") || "openai"
    const openaiKey = request.headers.get("x-openai-api-key")
    const geminiKey = request.headers.get("x-gemini-api-key")

    const { ingredients, dietaryPreferences } = await request.json()

    if (!ingredients || ingredients.length === 0) {
      return Response.json({ error: "No ingredients provided" }, { status: 400 })
    }

    const dietaryText = dietaryPreferences?.length
      ? `The user has the following dietary preferences: ${dietaryPreferences.join(", ")}. Please ensure all recipes respect these dietary restrictions.`
      : ""

    const prompt = `You are a professional chef. Generate 3 delicious recipes using these ingredients: ${ingredients.join(", ")}.

${dietaryText}

For each recipe, provide:
1. Recipe name
2. Brief description (1-2 sentences)
3. Cooking time
4. Difficulty level (Easy/Medium/Hard)
5. Ingredients list with quantities
6. Step-by-step instructions
7. Nutritional highlights

Format your response as a JSON array with this structure:
[
  {
    "name": "Recipe Name",
    "description": "Brief description",
    "cookingTime": "30 minutes",
    "difficulty": "Easy",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "instructions": ["step 1", "step 2"],
    "nutritionalHighlights": "High in protein, low in carbs"
  }
]

Only return the JSON array, no additional text.`

    if (modelProvider === "gemini") {
      if (!geminiKey) {
        return Response.json({ error: "Gemini API key is required. Please add it in Settings." }, { status: 401 })
      }

      const genAI = new GoogleGenerativeAI(geminiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

      const result = await model.generateContent(prompt)
      const text = result.response.text()

      // Clean up the response to extract JSON
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      const jsonText = jsonMatch ? jsonMatch[0] : text

      const recipes = JSON.parse(jsonText)

      return Response.json({ recipes })
    } else {
      // OpenAI flow
      if (!openaiKey) {
        return Response.json({ error: "OpenAI API key is required. Please add it in Settings." }, { status: 401 })
      }

      const openai = new OpenAI({
        apiKey: openaiKey,
      })

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      })

      const text = response.choices[0]?.message?.content || ""
      const recipes = JSON.parse(text)

      return Response.json({ recipes })
    }
  } catch (error) {
    console.error("[v0] Error generating recipes:", error)

    let errorMessage = "Failed to generate recipes"
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message

      // Check for rate limit errors
      if (
        errorMessage.includes("429") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("Resource exhausted")
      ) {
        statusCode = 429
      }
    }

    return Response.json({ error: errorMessage }, { status: statusCode })
  }
}
