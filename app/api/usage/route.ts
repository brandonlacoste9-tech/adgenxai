import { NextRequest } from "next/server";
import { withErrorHandler, successResponse, errorResponse, validateFields } from "@/app/lib/api/error-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface UsageData {
  model: string;
  totalTokens: number;
  todayTokens: number;
  dailyLimit: number;
  percentageUsed: number;
  remainingTokens: number;
}

// In-memory store (production: use database)
interface StoredUsage {
  model: string;
  tokens: number;
  timestamp: number;
}

let usageLog: StoredUsage[] = [];

const DEFAULT_LIMITS: Record<string, number> = {
  "openai/gpt-5": 1000000,
  "openai/gpt-4o": 500000,
};

export const POST = withErrorHandler(async (req: NextRequest) => {
  const { model, tokens } = await req.json();

  const validationError = validateFields({ model, tokens }, ["model", "tokens"]);
  if (validationError) return validationError;

  // Record usage
  usageLog.push({
    model,
    tokens,
    timestamp: Date.now(),
  });

  // Keep recent logs only (last 10000 entries)
  if (usageLog.length > 10000) {
    usageLog = usageLog.slice(-10000);
  }

  return successResponse({ success: true, logged: true });
});

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");

  // If specific model requested
  if (model) {
    const stats = getModelStats(model);
    return successResponse(stats);
  }

  // All models
  const allModels = Object.keys(DEFAULT_LIMITS);
  const allStats = allModels.map((m) => getModelStats(m));

  return successResponse({
    models: allStats,
    totalTokens: allStats.reduce((sum, s) => sum + s.totalTokens, 0),
    timestamp: Date.now(),
  });
});

function getModelStats(model: string): UsageData {
  const limit = DEFAULT_LIMITS[model] || 1000000;
  const today = new Date().toDateString();

  // Single pass through logs for better performance
  let totalTokens = 0;
  let todayTokens = 0;

  for (const log of usageLog) {
    if (log.model === model) {
      totalTokens += log.tokens;
      if (new Date(log.timestamp).toDateString() === today) {
        todayTokens += log.tokens;
      }
    }
  }

  const percentageUsed = Math.min(100, Math.round((todayTokens / limit) * 100));
  const remainingTokens = Math.max(0, limit - todayTokens);

  return {
    model,
    totalTokens,
    todayTokens,
    dailyLimit: limit,
    percentageUsed,
    remainingTokens,
  };
}

// Admin endpoint to reset (for testing)
export const DELETE = withErrorHandler(async (req: NextRequest) => {
  usageLog = [];
  return successResponse({ success: true, message: "Usage log cleared" });
});
