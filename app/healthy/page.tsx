"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Apple, Droplets, Flame, Heart, Leaf, Moon, Sun, Utensils } from "lucide-react"

export default function HealthyPage() {
  const nutritionTips = [
    {
      icon: Apple,
      title: "Eat the Rainbow",
      description:
        "Include a variety of colorful fruits and vegetables in your diet to ensure you get a wide range of nutrients and antioxidants.",
      color: "text-red-500",
    },
    {
      icon: Droplets,
      title: "Stay Hydrated",
      description:
        "Drink at least 8 glasses of water daily. Proper hydration supports digestion, energy levels, and overall health.",
      color: "text-blue-500",
    },
    {
      icon: Utensils,
      title: "Portion Control",
      description:
        "Use smaller plates and be mindful of serving sizes. Listen to your body's hunger and fullness cues.",
      color: "text-orange-500",
    },
    {
      icon: Leaf,
      title: "Choose Whole Foods",
      description:
        "Prioritize whole, unprocessed foods over packaged items. They're more nutritious and better for your health.",
      color: "text-green-500",
    },
    {
      icon: Flame,
      title: "Balance Macros",
      description:
        "Include a balance of proteins, healthy fats, and complex carbohydrates in each meal for sustained energy.",
      color: "text-yellow-500",
    },
    {
      icon: Moon,
      title: "Mindful Eating",
      description:
        "Eat slowly, without distractions. This helps with digestion and allows you to enjoy your food more fully.",
      color: "text-purple-500",
    },
  ]

  const mealPlanningTips = [
    {
      title: "Breakfast",
      time: "7:00 - 9:00 AM",
      suggestions: [
        "Oatmeal with berries and nuts",
        "Greek yogurt with granola",
        "Whole grain toast with avocado and eggs",
      ],
      icon: Sun,
    },
    {
      title: "Lunch",
      time: "12:00 - 2:00 PM",
      suggestions: ["Grilled chicken salad", "Quinoa bowl with vegetables", "Whole grain wrap with lean protein"],
      icon: Utensils,
    },
    {
      title: "Dinner",
      time: "6:00 - 8:00 PM",
      suggestions: [
        "Baked salmon with roasted vegetables",
        "Stir-fry with brown rice",
        "Lean protein with sweet potato",
      ],
      icon: Moon,
    },
  ]

  const healthyIngredients = [
    { name: "Leafy Greens", benefit: "Rich in vitamins A, C, K" },
    { name: "Berries", benefit: "High in antioxidants" },
    { name: "Nuts & Seeds", benefit: "Healthy fats and protein" },
    { name: "Whole Grains", benefit: "Fiber and sustained energy" },
    { name: "Lean Proteins", benefit: "Muscle building and repair" },
    { name: "Legumes", benefit: "Plant-based protein and fiber" },
    { name: "Fatty Fish", benefit: "Omega-3 fatty acids" },
    { name: "Avocado", benefit: "Healthy monounsaturated fats" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-balance">Healthy Eating Guide</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Discover tips, meal planning ideas, and nutritional guidance to support your wellness journey
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold mb-6">Nutrition Tips</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nutritionTips.map((tip, index) => {
                  const Icon = tip.icon
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${tip.color}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <CardTitle className="text-lg">{tip.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Daily Meal Planning</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {mealPlanningTips.map((meal, index) => {
                  const Icon = meal.icon
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="h-6 w-6 text-primary" />
                          <div>
                            <CardTitle>{meal.title}</CardTitle>
                            <CardDescription>{meal.time}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {meal.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Healthy Ingredients to Stock</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {healthyIngredients.map((ingredient, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-primary shrink-0" />
                          <h4 className="font-semibold text-sm">{ingredient.name}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6">{ingredient.benefit}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">Pro Tip: Meal Prep</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed">
                    Dedicate a few hours each week to prepare healthy meals in advance. This saves time, reduces stress,
                    and helps you stick to your nutrition goals.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Saves Time</Badge>
                    <Badge variant="secondary">Reduces Waste</Badge>
                    <Badge variant="secondary">Portion Control</Badge>
                    <Badge variant="secondary">Cost Effective</Badge>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
