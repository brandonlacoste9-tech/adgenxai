import { NextRequest } from "next/server";
import { soraClient, SoraGenerationRequest } from "@/lib/sora/sora-client";
import { createErrorResponse } from "@/lib/api-utils";

export const runtime = "nodejs";

/**
 * POST /api/sora/generate
 * Request a video generation from Sora
 * Returns immediately with job ID (async processing)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, model, duration, quality, aspectRatio } = body as Partial<SoraGenerationRequest> & {
      aspectRatio?: string;
    };

    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      return createErrorResponse("Prompt is required", 400);
    }

    if (prompt.length > 10000) {
      return createErrorResponse("Prompt too long (max 10000 chars)", 400);
    }

    // Create generation request
    const request: SoraGenerationRequest = {
      prompt: prompt.trim(),
      model: (model as "sora-1" | "sora-1-hd") || "sora-1",
      duration: duration as any,
      quality: quality as any,
      aspectRatio: aspectRatio as any,
    };

    // Submit to Sora
    const job = await soraClient.generateVideo(request);

    return Response.json({
      jobId: job.id,
      status: job.status,
      createdAt: job.createdAt,
      message: "Video generation queued. Check status with /api/sora/status?jobId=...",
    });
  } catch (error) {
    return createErrorResponse((error as Error).message, 500);
  }
}
