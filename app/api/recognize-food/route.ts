import OpenAI from "openai"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: Request) {
  try {
    const modelProvider = request.headers.get("x-model-provider") || "openai"
    const openaiKey = request.headers.get("x-openai-api-key")
    const geminiKey = request.headers.get("x-gemini-api-key")

    const { image } = await request.json()

    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 })
    }

    if (modelProvider === "gemini") {
      if (!geminiKey) {
        return Response.json({ error: "Gemini API key is required. Please add it in Settings." }, { status: 401 })
      }

      const genAI = new GoogleGenerativeAI(geminiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

      // Convert base64 image to the format Gemini expects
      const base64Data = image.split(",")[1]
      const mimeType = image.split(";")[0].split(":")[1]

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        "Analyze this image and identify all the food ingredients you can see. List them in a clear, comma-separated format. Only list the ingredients, nothing else. If you see prepared dishes, try to identify the main ingredients. Be specific but concise.",
      ])

      const text = result.response.text()

      // Parse the ingredients from the response
      const ingredients = text
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)

      return Response.json({ ingredients })
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
            content: [
              {
                type: "text",
                text: "Analyze this image and identify all the food ingredients you can see. List them in a clear, comma-separated format. Only list the ingredients, nothing else. If you see prepared dishes, try to identify the main ingredients. Be specific but concise.",
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
      })

      const text = response.choices[0]?.message?.content || ""

      // Parse the ingredients from the response
      const ingredients = text
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)

      return Response.json({ ingredients })
    }
  } catch (error) {
    console.error("[v0] Error recognizing food:", error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to recognize food",
      },
      { status: 500 },
    )
  }
}
