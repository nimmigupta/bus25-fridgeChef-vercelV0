"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SettingsIcon, Trash2, Key, ExternalLink, Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DietaryPreference {
  id: string
  label: string
  description: string
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])
  const [openaiApiKey, setOpenaiApiKey] = useState("")
  const [geminiApiKey, setGeminiApiKey] = useState("")
  const [modelProvider, setModelProvider] = useState<"openai" | "gemini">("openai")
  const [showOpenaiKey, setShowOpenaiKey] = useState(false)
  const [showGeminiKey, setShowGeminiKey] = useState(false)
  const [isValidatingOpenai, setIsValidatingOpenai] = useState(false)
  const [isValidatingGemini, setIsValidatingGemini] = useState(false)
  const [openaiValidationStatus, setOpenaiValidationStatus] = useState<"idle" | "valid" | "invalid">("idle")
  const [geminiValidationStatus, setGeminiValidationStatus] = useState<"idle" | "valid" | "invalid">("idle")

  useEffect(() => {
    const saved = localStorage.getItem("dietaryPreferences")
    if (saved) {
      setSelectedPreferences(JSON.parse(saved))
    }
    const savedOpenaiKey = localStorage.getItem("openaiApiKey")
    if (savedOpenaiKey) {
      setOpenaiApiKey(savedOpenaiKey)
    }
    const savedGeminiKey = localStorage.getItem("geminiApiKey")
    if (savedGeminiKey) {
      setGeminiApiKey(savedGeminiKey)
    }
    const savedProvider = localStorage.getItem("modelProvider") as "openai" | "gemini" | null
    if (savedProvider) {
      setModelProvider(savedProvider)
    }
  }, [])

  const togglePreference = (id: string) => {
    const updated = selectedPreferences.includes(id)
      ? selectedPreferences.filter((p) => p !== id)
      : [...selectedPreferences, id]

    setSelectedPreferences(updated)
    localStorage.setItem("dietaryPreferences", JSON.stringify(updated))

    toast({
      title: "Preferences Updated",
      description: "Your dietary preferences have been saved.",
    })
  }

  const saveOpenaiKey = () => {
    if (!openaiApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      })
      return
    }

    localStorage.setItem("openaiApiKey", openaiApiKey.trim())
    setOpenaiValidationStatus("idle")
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved securely in your browser.",
    })
  }

  const saveGeminiKey = () => {
    if (!geminiApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      })
      return
    }

    localStorage.setItem("geminiApiKey", geminiApiKey.trim())
    setGeminiValidationStatus("idle")
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved securely in your browser.",
    })
  }

  const saveModelProvider = (provider: "openai" | "gemini") => {
    setModelProvider(provider)
    localStorage.setItem("modelProvider", provider)
    toast({
      title: "Model Provider Updated",
      description: `Switched to ${provider === "openai" ? "OpenAI" : "Google Gemini"} models.`,
    })
  }

  const validateOpenaiKey = async () => {
    if (!openaiApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key first.",
        variant: "destructive",
      })
      return
    }

    setIsValidatingOpenai(true)
    setOpenaiValidationStatus("idle")

    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${openaiApiKey.trim()}`,
        },
      })

      if (response.ok) {
        setOpenaiValidationStatus("valid")
        toast({
          title: "API Key Valid",
          description: "Your OpenAI API key is working correctly!",
        })
      } else {
        const error = await response.json()
        setOpenaiValidationStatus("invalid")
        toast({
          title: "API Key Invalid",
          description: error.error?.message || "The API key is not valid. Please check and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setOpenaiValidationStatus("invalid")
      toast({
        title: "Validation Failed",
        description: "Could not validate the API key. Please check your internet connection.",
        variant: "destructive",
      })
    } finally {
      setIsValidatingOpenai(false)
    }
  }

  const validateGeminiKey = async () => {
    if (!geminiApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key first.",
        variant: "destructive",
      })
      return
    }

    setIsValidatingGemini(true)
    setGeminiValidationStatus("idle")

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey.trim()}`,
        {
          method: "GET",
        },
      )

      if (response.ok) {
        setGeminiValidationStatus("valid")
        toast({
          title: "API Key Valid",
          description: "Your Gemini API key is working correctly!",
        })
      } else {
        const error = await response.json()
        setGeminiValidationStatus("invalid")
        toast({
          title: "API Key Invalid",
          description: error.error?.message || "The API key is not valid. Please check and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setGeminiValidationStatus("invalid")
      toast({
        title: "Validation Failed",
        description: "Could not validate the API key. Please check your internet connection.",
        variant: "destructive",
      })
    } finally {
      setIsValidatingGemini(false)
    }
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all saved data? This action cannot be undone.")) {
      localStorage.clear()
      sessionStorage.clear()
      setSelectedPreferences([])
      setOpenaiApiKey("")
      setGeminiApiKey("")
      setOpenaiValidationStatus("idle")
      setGeminiValidationStatus("idle")
      setModelProvider("openai")

      toast({
        title: "Data Cleared",
        description: "All saved recipes and preferences have been removed.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <SettingsIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
                  <p className="text-muted-foreground">Customize your FridgeChef experience</p>
                </div>
              </div>
            </div>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>AI Model Provider</CardTitle>
                <CardDescription>
                  Choose which AI provider to use for food recognition and recipe generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="model-provider" className="text-base font-semibold">
                    Select Provider
                  </Label>
                  <Select
                    value={modelProvider}
                    onValueChange={(value) => saveModelProvider(value as "openai" | "gemini")}
                  >
                    <SelectTrigger id="model-provider" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                      <SelectItem value="gemini">Google Gemini (Flash)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {modelProvider === "openai"
                      ? "Using OpenAI's GPT-4o for both food recognition and recipe generation"
                      : "Using Google's Gemini Flash for both food recognition and recipe generation"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  <CardTitle>API Configuration</CardTitle>
                </div>
                <CardDescription>
                  Configure your API keys to enable food recognition and recipe generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">How to get your OpenAI API Key:</h4>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                      <li>
                        Visit{" "}
                        <a
                          href="https://platform.openai.com/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          OpenAI API Keys page
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                      <li>Sign in or create an OpenAI account</li>
                      <li>Click "Create new secret key" and give it a name</li>
                      <li>Copy the API key and paste it below</li>
                      <li>Make sure you have credits in your OpenAI account</li>
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="openai-api-key" className="text-base font-semibold">
                      OpenAI API Key
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="openai-api-key"
                          type={showOpenaiKey ? "text" : "password"}
                          placeholder="sk-proj-..."
                          value={openaiApiKey}
                          onChange={(e) => {
                            setOpenaiApiKey(e.target.value)
                            setOpenaiValidationStatus("idle")
                          }}
                          className="pr-10 font-mono text-sm"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                        >
                          {showOpenaiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button onClick={saveOpenaiKey} className="shrink-0">
                        Save Key
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Required when using OpenAI as your model provider.</p>
                  </div>

                  {openaiApiKey && (
                    <div className="space-y-3">
                      <Button
                        onClick={validateOpenaiKey}
                        disabled={isValidatingOpenai}
                        variant="outline"
                        className="w-full sm:w-auto bg-transparent"
                      >
                        {isValidatingOpenai ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Validating...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Test OpenAI Key
                          </>
                        )}
                      </Button>

                      {openaiValidationStatus === "valid" && (
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-medium">API key is valid and working correctly</span>
                        </div>
                      )}

                      {openaiValidationStatus === "invalid" && (
                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                          <XCircle className="h-4 w-4" />
                          <span className="font-medium">API key is invalid or has insufficient permissions</span>
                        </div>
                      )}

                      {openaiValidationStatus === "idle" && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                          API key configured (not yet validated)
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t pt-6 space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">How to get your Gemini API Key:</h4>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                      <li>
                        Visit{" "}
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Google AI Studio
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                      <li>Sign in with your Google account</li>
                      <li>Click "Get API key" or "Create API key"</li>
                      <li>Copy the API key and paste it below</li>
                      <li>Gemini API has a generous free tier for testing</li>
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="gemini-api-key" className="text-base font-semibold">
                      Gemini API Key
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="gemini-api-key"
                          type={showGeminiKey ? "text" : "password"}
                          placeholder="AIza..."
                          value={geminiApiKey}
                          onChange={(e) => {
                            setGeminiApiKey(e.target.value)
                            setGeminiValidationStatus("idle")
                          }}
                          className="pr-10 font-mono text-sm"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowGeminiKey(!showGeminiKey)}
                        >
                          {showGeminiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button onClick={saveGeminiKey} className="shrink-0">
                        Save Key
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Required when using Gemini as your model provider.</p>
                  </div>

                  {geminiApiKey && (
                    <div className="space-y-3">
                      <Button
                        onClick={validateGeminiKey}
                        disabled={isValidatingGemini}
                        variant="outline"
                        className="w-full sm:w-auto bg-transparent"
                      >
                        {isValidatingGemini ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Validating...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Test Gemini Key
                          </>
                        )}
                      </Button>

                      {geminiValidationStatus === "valid" && (
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-medium">API key is valid and working correctly</span>
                        </div>
                      )}

                      {geminiValidationStatus === "invalid" && (
                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                          <XCircle className="h-4 w-4" />
                          <span className="font-medium">API key is invalid or has insufficient permissions</span>
                        </div>
                      )}

                      {geminiValidationStatus === "idle" && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                          API key configured (not yet validated)
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-md">
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    <strong>Security Note:</strong> Your API keys are stored locally in your browser and never sent to
                    our servers. They are only used to make direct requests to the respective AI providers on your
                    behalf.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dietary Preferences</CardTitle>
                <CardDescription>
                  Select your dietary restrictions and preferences to get personalized recipe recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPreferences.map((preference) => (
                  <div key={preference} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Label htmlFor={preference} className="font-semibold cursor-pointer">
                          {preference}
                        </Label>
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{/* Placeholder for preference description */}</p>
                    </div>
                    <Switch id={preference} checked={true} onCheckedChange={() => {}} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your saved recipes and app data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="font-semibold mb-1">Clear All Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Remove all saved recipes, preferences, and cached data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={clearAllData}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">About FridgeChef</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Version 1.0.0</p>
                <p>
                  FridgeChef uses AI to help you discover delicious recipes based on the ingredients you have at home.
                </p>
                <p className="text-xs">Built with Next.js and powered by OpenAI and Google Gemini</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
