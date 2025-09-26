"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Download, Share2, Zap, Grid3X3, Layers, Settings, History, Sparkles } from "lucide-react"

export default function FloorPlannerDashboard() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      // Replace with your actual API endpoint
      const response = await fetch("https://floor-plan-application.onrender.com/get_plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate floor plan")
      }

      // Assuming the API returns an image blob
      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setGeneratedImage(imageUrl)
    } catch (err) {
      setError("Failed to generate floor plan. Please try again.")
      console.error("Generation error:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a")
      link.href = generatedImage
      link.download = "floor-plan.png"
      link.click()
    }
  }

  const examplePrompts = [
    "Modern 3-bedroom apartment with open kitchen and living area",
    "Two-story house with garage and backyard patio",
    "Studio apartment with efficient space utilization",
    "Office layout with meeting rooms and collaborative spaces",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg animate-pulse">
                <Grid3X3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground animate-fade-in">Floor Plan AI</h1>
                <p className="text-sm text-muted-foreground animate-fade-in-delay">Professional 2D Floor Planning - by Mehar Umar</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-1 transition-all duration-300 hover:scale-105">
                <Sparkles className="w-3 h-3 animate-pulse" />
                Pro
              </Badge>
              <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-110 hover:bg-muted">
                <History className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-110 hover:bg-muted">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <Card className="p-6 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] animate-slide-in-left">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary animate-pulse" />
                  <h2 className="text-lg font-semibold">Generate Floor Plan</h2>
                </div>

                <div className="space-y-3">
                  <label htmlFor="prompt" className="text-sm font-medium text-foreground">
                    Describe your floor plan
                  </label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the layout, rooms, and features you want in your floor plan..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] resize-none transition-all duration-300 focus:scale-[1.02] focus:shadow-md"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span className="animate-pulse">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                      Generate Floor Plan
                    </>
                  )}
                </Button>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-slide-in-up">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Example Prompts */}
            <Card className="p-6 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] animate-slide-in-left-delay">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-medium">Example Prompts</h3>
                </div>
                <div className="space-y-2">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(example)}
                      className="w-full text-left p-3 text-sm bg-muted/50 hover:bg-muted rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Output Panel */}
          <div className="space-y-6">
            <Card className="p-6 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] animate-slide-in-right">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Generated Floor Plan</h2>
                  {generatedImage && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="transition-all duration-300 hover:scale-110 hover:shadow-md bg-transparent"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="transition-all duration-300 hover:scale-110 hover:shadow-md bg-transparent"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  )}
                </div>

                <div className="aspect-square bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center transition-all duration-500">
                  {isGenerating ? (
                    <div className="text-center space-y-3 animate-pulse">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                      <p className="text-sm text-muted-foreground animate-bounce">Generating your floor plan...</p>
                    </div>
                  ) : generatedImage ? (
                    <img
                      src={generatedImage || "/placeholder.svg"}
                      alt="Generated floor plan"
                      className="w-full h-full object-contain rounded-lg transition-all duration-500 hover:scale-105 animate-fade-in"
                    />
                  ) : (
                    <div className="text-center space-y-3 animate-fade-in">
                      <Grid3X3 className="w-12 h-12 text-muted-foreground mx-auto animate-pulse" />
                      <div>
                        <p className="text-sm font-medium text-foreground">No floor plan generated yet</p>
                        <p className="text-xs text-muted-foreground">Enter a prompt and click generate to start</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Stats/Info Panel */}
            <Card className="p-6 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] animate-slide-in-right-delay">
              <div className="space-y-4">
                <h3 className="font-medium">Generation Stats</h3>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium transition-all duration-300">
                      {isGenerating ? (
                        <span className="animate-pulse text-primary">Generating...</span>
                      ) : generatedImage ? (
                        <span className="text-green-500">Complete</span>
                      ) : (
                        "Ready"
                      )}
                    </p>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                    <p className="text-muted-foreground">Format</p>
                    <p className="font-medium">PNG</p>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                    <p className="text-muted-foreground">Resolution</p>
                    <p className="font-medium">1024x1024</p>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
                    <p className="text-muted-foreground">Model</p>
                    <p className="font-medium">FloorPlan-v2</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
