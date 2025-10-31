// Usage tracking API route
import { NextRequest, NextResponse } from "next/server";
import { calculateCost } from "@lib/providers/costs";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, model, promptTokens, completionTokens } = body;

    // Validate required fields
    if (!provider || !model) {
      return NextResponse.json(
        { error: "provider and model are required" },
        { status: 400 }
      );
    }

    if (typeof promptTokens !== "number" || typeof completionTokens !== "number") {
      return NextResponse.json(
        { error: "promptTokens and completionTokens must be numbers" },
        { status: 400 }
      );
    }

    // Calculate cost
    const cost = calculateCost(
      provider as "github" | "openai",
      model,
      promptTokens,
      completionTokens
    );

    // Here you would typically store usage data in a database
    // For now, we just return the calculated values
    const usage = {
      provider,
      model,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      estimatedCost: cost,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(usage);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Future: Return usage statistics
  // For now, return a placeholder
  return NextResponse.json({
    message: "Usage tracking endpoint",
    note: "POST to record usage, GET to retrieve statistics (not yet implemented)",
  });
}
