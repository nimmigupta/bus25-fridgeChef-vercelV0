"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { RecipeCard } from "@/components/recipe-card"
import { Heart } from "lucide-react"

interface Recipe {
  name: string
  description: string
  cookingTime: string
  difficulty: string
  ingredients: string[]
  instructions: string[]
  nutritionalHighlights: string
}

export default function SavedPage() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    loadSavedRecipes()

    const handleStorageChange = () => {
      loadSavedRecipes()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("savedRecipesUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("savedRecipesUpdated", handleStorageChange)
    }
  }, [])

  const loadSavedRecipes = () => {
    const recipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]")
    setSavedRecipes(recipes)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">Saved Recipes</h1>
              <p className="text-muted-foreground">Your collection of favorite recipes</p>
            </div>

            {savedRecipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Heart className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No saved recipes yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Start exploring recipes and save your favorites by clicking the heart icon
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {savedRecipes.map((recipe, index) => (
                  <RecipeCard key={index} recipe={recipe} onUpdate={loadSavedRecipes} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
