import { Navigation } from "@/components/navigation"
import { ImageUpload } from "@/components/image-upload"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">
              Turn Your Ingredients Into <span className="text-primary">Delicious Recipes</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Upload a photo of your ingredients and let AI discover amazing recipes tailored to your dietary
              preferences
            </p>
          </div>
          <ImageUpload />
        </div>
      </main>
    </div>
  )
}
