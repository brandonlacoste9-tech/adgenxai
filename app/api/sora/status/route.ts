import { NextRequest } from "next/server";
import { longCatVideoClient } from "@/lib/longcat/longcat-video-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/sora/status?jobId=...
 * Poll the status of a LongCat-Video generation job
 * (Maintains Sora-compatible API for backward compatibility)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return Response.json(
      { error: "jobId query parameter required" },
      { status: 400 }
    );
  }

  try {
    const job = await longCatVideoClient.getJobStatus(jobId);

    if (!job) {
      return Response.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return Response.json({
      jobId: job.id,
      status: job.status,
      prompt: job.prompt,
      model: "LongCat-Video",
      provider: "longcat-video",
      modelStack: "open-source",
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      videoUrl: job.videoUrl,
      thumbnailUrl: job.thumbnailUrl,
      progress: job.progress,
      estimatedCost: job.estimatedCost,
      processingTimeMs: job.processingTimeMs,
      duration: job.duration,
      quality: job.quality,
      aspectRatio: job.aspectRatio,
      error: job.error,
      costSavings: "~95% cost reduction vs proprietary models",
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
