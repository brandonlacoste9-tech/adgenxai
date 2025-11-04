import { NextRequest } from "next/server";
import { longCatVideoClient, LongCatVideoRequest } from "@/lib/longcat/longcat-video-client";

export const runtime = "nodejs";

/**
 * POST /api/sora/generate (now using LongCat-Video)
 * Request a video generation from LongCat-Video (open-source replacement for Sora)
 * Returns immediately with job ID (async processing)
 * 
 * AdGenXAI Open-Source Model Stack - Priority P0 Model
 * Cost Savings: ~95% reduction vs Sora ($0.01-0.03/sec vs $1-3/sec)
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await req.json();
    const { 
      prompt, 
      duration = 10, 
      quality = "hd", 
      aspectRatio = "16:9",
      fps = 30,
      style = "commercial",
      seed
    } = body;

    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      return Response.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (prompt.length > 10000) {
      return Response.json(
        { error: "Prompt too long (max 10000 chars)" },
        { status: 400 }
      );
    }

    // LongCat-Video supports up to 5 minutes (300 seconds)
    if (duration > 300) {
      return Response.json(
        { error: "Duration too long (max 300 seconds for LongCat-Video)" },
        { status: 400 }
      );
    }

    // Create LongCat-Video generation request
    const request: LongCatVideoRequest = {
      prompt: prompt.trim(),
      duration,
      quality,
      aspectRatio,
      fps,
      style,
      seed,
    };

    // Submit to LongCat-Video
    const job = await longCatVideoClient.generateVideo(request);

    return Response.json({
      jobId: job.id,
      status: job.status,
      createdAt: job.createdAt,
      provider: "longcat-video",
      model: "LongCat-Video",
      modelStack: "open-source",
      estimatedCost: job.estimatedCost,
      maxDuration: 300, // 5 minutes
      costSavings: "~95% cost reduction vs proprietary models",
      message: `Video generation queued with LongCat-Video. Check status with /api/sora/status?jobId=${job.id}`,
      modelInfo: longCatVideoClient.getModelInfo(),
    });
  } catch (error) {
    return Response.json(
      { 
        error: (error as Error).message,
        provider: "longcat-video",
        modelStack: "open-source"
      },
      { status: 500 }
    );
  }
}
