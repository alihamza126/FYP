"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Ruler, User } from "lucide-react"
import TopNavOne from "@/components/Header/TopNav/TopNavOne"
import MenuOne from "@/components/Header/Menu/MenuOne"
import Footer from "@/components/Footer/Footer"

// Remove the axios import line

interface SizeRecommendation {
  size: string
  confidence: number
  measurements: {
    height: number
    weight: number
    chest: number
    waist: number
  }
  method?: string
}

export default function SizeRecommendationApp() {
  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    chest: "",
    waist: "",
  })
  const [recommendation, setRecommendation] = useState<SizeRecommendation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setMeasurements((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    const { height, weight, chest, waist } = measurements
    if (!height || !weight || !chest || !waist) {
      setError("Please fill in all measurements")
      return
    }

    // Validate numeric ranges
    const h = Number.parseFloat(height)
    const w = Number.parseFloat(weight)
    const c = Number.parseFloat(chest)
    const wa = Number.parseFloat(waist)

    if (h < 140 || h > 220 || w < 40 || w > 150 || c < 70 || c > 130 || wa < 60 || wa > 120) {
      setError("Please enter valid measurements within the specified ranges")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Use fetch instead of axios for better compatibility
      const response = await fetch("/api/v1/ai/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          height: h,
          weight: w,
          chest: c,
          waist: wa,
        }),
      })

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text()
        console.error("Non-JSON response:", responseText.substring(0, 500))
        throw new Error("Server returned non-JSON response")
      }

      const result = await response.json()

      // Validate the result
      if (!result || typeof result !== "object") {
        console.error("Invalid response format:", result)
        throw new Error("Server returned an invalid response format")
      }

      // Create a valid recommendation object
      const validRecommendation: SizeRecommendation = {
        size: result.size || "M",
        confidence: typeof result.confidence === "number" ? result.confidence : 0.7,
        measurements: {
          height: h,
          weight: w,
          chest: c,
          waist: wa,
        },
        method: result.method || "default",
      }

      setRecommendation(validRecommendation)
    } catch (err: any) {
      console.error("Size recommendation error:", err)
      setError(`Failed to get size recommendation: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500"
    if (confidence >= 0.6) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <>
      <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
      <div id="header" className='relative w-full'>
        <MenuOne props="bg-transparent" />
\      </div>
      <div className="min-h-screen bg-gradient-to-br mt-10 from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Size Recommendation</h1>
            <p className="text-lg text-gray-600">Get personalized clothing size recommendations</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Measurements
                </CardTitle>
                <CardDescription>Enter your body measurements to get a size recommendation</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="170"
                        value={measurements.height}
                        onChange={(e) => handleInputChange("height", e.target.value)}
                        min="140"
                        max="220"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="70"
                        value={measurements.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        min="40"
                        max="150"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chest">Chest (cm)</Label>
                      <Input
                        id="chest"
                        type="number"
                        placeholder="90"
                        value={measurements.chest}
                        onChange={(e) => handleInputChange("chest", e.target.value)}
                        min="70"
                        max="130"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="waist">Waist (cm)</Label>
                      <Input
                        id="waist"
                        type="number"
                        placeholder="80"
                        value={measurements.waist}
                        onChange={(e) => handleInputChange("waist", e.target.value)}
                        min="60"
                        max="120"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-md">
                      <strong>Error:</strong> {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Ruler className="w-4 h-4 mr-2" />
                        Get Size Recommendation
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendation Result</CardTitle>
                <CardDescription>Size prediction based on your measurements</CardDescription>
              </CardHeader>
              <CardContent>
                {recommendation ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-indigo-600 mb-2">{recommendation.size}</div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-600">Confidence:</span>
                        <Badge className={`${getConfidenceColor(recommendation.confidence)} text-white`}>
                          {Math.round(recommendation.confidence * 100)}%
                        </Badge>
                      </div>
                      {recommendation.method && (
                        <div className="text-xs text-gray-500 mt-1">Method: {recommendation.method}</div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Your Measurements:</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Height:</span>
                          <span className="font-medium">{recommendation.measurements.height} cm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-medium">{recommendation.measurements.weight} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Chest:</span>
                          <span className="font-medium">{recommendation.measurements.chest} cm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Waist:</span>
                          <span className="font-medium">{recommendation.measurements.waist} cm</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Size Guide:</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <div>XS: Height 150-160cm, Chest 80-85cm</div>
                        <div>S: Height 160-170cm, Chest 85-90cm</div>
                        <div>M: Height 170-175cm, Chest 90-95cm</div>
                        <div>L: Height 175-180cm, Chest 95-100cm</div>
                        <div>XL: Height 180-185cm, Chest 100-105cm</div>
                        <div>XXL: Height 185+cm, Chest 105+cm</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Ruler className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Enter your measurements to get a size recommendation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Input Measurements</h4>
                  <p className="text-gray-600">Enter your height, weight, chest, and waist measurements</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">AI</span>
                  </div>
                  <h4 className="font-semibold mb-2">Analysis</h4>
                  <p className="text-gray-600">Our algorithm processes your data using advanced rules</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Ruler className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Size Recommendation</h4>
                  <p className="text-gray-600">Get your personalized size with confidence score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer/>
    </>
  )
}
