"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Camera, Clipboard, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function ImageUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read()
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type)
            const reader = new FileReader()
            reader.onload = (e) => {
              setSelectedImage(e.target?.result as string)
            }
            reader.readAsDataURL(blob)
            return
          }
        }
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    const modelProvider = localStorage.getItem("modelProvider") || "openai"
    const openaiKey = localStorage.getItem("openaiApiKey")
    const geminiKey = localStorage.getItem("geminiApiKey")

    // Check if the appropriate API key exists for the selected provider
    if (modelProvider === "openai" && !openaiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key in Settings to use this feature.",
        variant: "destructive",
      })
      router.push("/settings")
      return
    }

    if (modelProvider === "gemini" && !geminiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your Gemini API key in Settings to use this feature.",
        variant: "destructive",
      })
      router.push("/settings")
      return
    }

    setIsAnalyzing(true)
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-model-provider": modelProvider,
      }

      if (openaiKey) headers["x-openai-api-key"] = openaiKey
      if (geminiKey) headers["x-gemini-api-key"] = geminiKey

      const response = await fetch("/api/recognize-food", {
        method: "POST",
        headers,
        body: JSON.stringify({ image: selectedImage }),
      })

      if (response.status === 401) {
        const { error } = await response.json()
        toast({
          title: "Authentication Error",
          description: error || "Invalid API key. Please check your settings.",
          variant: "destructive",
        })
        router.push("/settings")
        return
      }

      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      const { ingredients } = await response.json()

      sessionStorage.setItem("ingredients", JSON.stringify(ingredients))
      sessionStorage.setItem("ingredientImage", selectedImage)
      router.push("/recipes")
    } catch (error) {
      console.error("[v0] Error analyzing image:", error)
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border",
          selectedImage && "border-solid",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-8 md:p-12">
          {selectedImage ? (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Selected food"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="flex-1" onClick={handleAnalyze} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Ingredients"
                  )}
                </Button>
                <Button size="lg" variant="outline" onClick={() => setSelectedImage(null)} disabled={isAnalyzing}>
                  Clear
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-12 w-12 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Upload Your Ingredients</h3>
                <p className="text-muted-foreground">Drag and drop an image, or choose from the options below</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-6 w-6" />
                  <span>Upload File</span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 bg-transparent"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="h-6 w-6" />
                  <span>Take Photo</span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 bg-transparent"
                  onClick={handlePaste}
                >
                  <Clipboard className="h-6 w-6" />
                  <span>Paste Image</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  )
}
