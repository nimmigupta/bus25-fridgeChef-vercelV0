"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ChefHat, Heart, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Recipe {
  name: string
  description: string
  cookingTime: string
  difficulty: string
  ingredients: string[]
  instructions: string[]
  nutritionalHighlights: string
}

interface RecipeCardProps {
  recipe: Recipe
  onUpdate?: () => void
}

export function RecipeCard({ recipe, onUpdate }: RecipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]")
    const saved = savedRecipes.some((r: Recipe) => r.name === recipe.name)
    setIsSaved(saved)
  }, [recipe.name])

  const handleSave = () => {
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]")
    if (isSaved) {
      const filtered = savedRecipes.filter((r: Recipe) => r.name !== recipe.name)
      localStorage.setItem("savedRecipes", JSON.stringify(filtered))
      setIsSaved(false)
    } else {
      savedRecipes.push(recipe)
      localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes))
      setIsSaved(true)
    }

    window.dispatchEvent(new Event("savedRecipesUpdated"))
    onUpdate?.()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "hard":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{recipe.name}</CardTitle>
            <CardDescription className="text-base">{recipe.description}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSave} className="shrink-0">
            <Heart className={cn("h-5 w-5", isSaved && "fill-red-500 text-red-500")} />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {recipe.cookingTime}
          </Badge>
          <Badge variant="outline" className={cn("gap-1", getDifficultyColor(recipe.difficulty))}>
            <ChefHat className="h-3 w-3" />
            {recipe.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Nutritional Highlights</h4>
          <p className="text-sm text-muted-foreground">{recipe.nutritionalHighlights}</p>
        </div>

        <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <>
              Hide Details
              <ChevronUp className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              View Full Recipe
              <ChevronDown className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>

        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            <div>
              <h4 className="font-semibold mb-3">Ingredients</h4>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Instructions</h4>
              <ol className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="text-sm flex gap-3">
                    <span className="font-semibold text-primary shrink-0">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
