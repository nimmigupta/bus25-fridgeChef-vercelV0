"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { RecipeCard } from "@/components/recipe-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface Recipe {
  name: string
  description: string
  cookingTime: string
  difficulty: string
  ingredients: string[]
  instructions: string[]
  nutritionalHighlights: string
}

export default function RecipesPage() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [ingredientImage, setIngredientImage] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedIngredients = sessionStorage.getItem("ingredients")
    const storedImage = sessionStorage.getItem("ingredientImage")

    if (!storedIngredients) {
      router.push("/")
      return
    }

    const parsedIngredients = JSON.parse(storedIngredients)
    setIngredients(parsedIngredients)
    setIngredientImage(storedImage)

    generateRecipes(parsedIngredients)
  }, [router])

  const generateRecipes = async (ingredientsList: string[]) => {
    const modelProvider = localStorage.getItem("modelProvider") || "openai"
    const openaiKey = localStorage.getItem("openaiApiKey")
    const geminiKey = localStorage.getItem("geminiApiKey")

    if (modelProvider === "openai" && !openaiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key in Settings to generate recipes.",
        variant: "destructive",
      })
      router.push("/settings")
      return
    }

    if (modelProvider === "gemini" && !geminiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your Gemini API key in Settings to generate recipes.",
        variant: "destructive",
      })
      router.push("/settings")
      return
    }

    setIsLoading(true)
    try {
      const dietaryPreferences = JSON.parse(localStorage.getItem("dietaryPreferences") || "[]")

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-model-provider": modelProvider,
      }

      if (openaiKey) headers["x-openai-api-key"] = openaiKey
      if (geminiKey) headers["x-gemini-api-key"] = geminiKey

      const response = await fetch("/api/generate-recipes", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ingredients: ingredientsList,
          dietaryPreferences,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error occurred" }))
        const errorMessage = errorData.error || "Failed to generate recipes"

        // Handle specific error types
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: errorMessage,
            variant: "destructive",
          })
          router.push("/settings")
          return
        }

        // Check for rate limit errors
        if (
          errorMessage.includes("429") ||
          errorMessage.includes("rate limit") ||
          errorMessage.includes("Resource exhausted")
        ) {
          toast({
            title: "Rate Limit Reached",
            description: `${modelProvider === "gemini" ? "Gemini" : "OpenAI"} API rate limit exceeded. Please wait a few minutes and try again, or switch to a different model provider in Settings.`,
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        // Generic error handling
        throw new Error(errorMessage)
      }

      const { recipes: generatedRecipes } = await response.json()
      setRecipes(generatedRecipes)
    } catch (error) {
      console.error("[v0] Error generating recipes:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate recipes"
      toast({
        title: "Recipe Generation Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          {ingredientImage && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={ingredientImage || "/placeholder.svg"}
                  alt="Your ingredients"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Your Detected Ingredients</h1>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg text-muted-foreground">Generating delicious recipes for you...</p>
            </div>
          ) : recipes.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Recommended Recipes</h2>
              <div className="grid gap-6">
                {recipes.map((recipe, index) => (
                  <RecipeCard key={index} recipe={recipe} />
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">Unable to generate recipes at this time.</p>
              <Button onClick={() => generateRecipes(ingredients)}>Try Again</Button>
            </div>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  )
}
