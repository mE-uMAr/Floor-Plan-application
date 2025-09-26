import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const response = await fetch("YOUR_AI_API_ENDPOINT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: `2D architectural floor plan: ${prompt}. Top-down view, clean lines, professional architectural drawing style, black and white with clear room labels.`,
        size: "1024x1024",
        response_format: "b64_json",
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate image")
    }

    const data = await response.json()

    // Convert base64 to buffer and return as image
    const imageBuffer = Buffer.from(data.data[0].b64_json, "base64")

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error generating floor plan:", error)
    return NextResponse.json({ error: "Failed to generate floor plan" }, { status: 500 })
  }
}
