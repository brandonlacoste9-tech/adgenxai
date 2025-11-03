import { NextRequest } from "next/server";
import { soraClient } from "@/lib/sora/sora-client";
import { createErrorResponse } from "@/lib/api-utils";

export const runtime = "nodejs";

/**
 * GET /api/sora/status?jobId=...
 * Poll the status of a Sora generation job
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return createErrorResponse("jobId query parameter required", 400);
  }

  try {
    const job = await soraClient.getJobStatus(jobId);

    if (!job) {
      return createErrorResponse("Job not found", 404);
    }

    return Response.json({
      jobId: job.id,
      status: job.status,
      prompt: job.prompt,
      model: job.model,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      videoUrl: job.videoUrl,
      error: job.error,
    });
  } catch (error) {
    return createErrorResponse((error as Error).message, 500);
  }
}
