import { NextRequest } from "next/server";

import { colonyEngine } from "@/lib/colony/engine";
import { COLONY_PHASES, TOKEN_ECONOMICS } from "@/lib/colony/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const view = searchParams.get("view");

  if (view === "tokenomics") {
    return Response.json(TOKEN_ECONOMICS);
  }

  if (view === "phases") {
    return Response.json(COLONY_PHASES);
  }

  return Response.json(colonyEngine.summarizeIntegration());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const action = body.action ?? "registerAgent";
  const payload = body.payload ?? {};

  try {
    if (action === "registerAgent") {
      const result = colonyEngine.registerAgent(payload);
      return Response.json(result);
    }

    if (action === "createTask") {
      const result = colonyEngine.createTask(payload);
      return Response.json(result);
    }

    if (action === "recordWorkflow") {
      const result = colonyEngine.recordWorkflow(payload);
      return Response.json(result);
    }

    if (action === "publishMotion") {
      const result = colonyEngine.publishMotion(payload);
      return Response.json(result);
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Colony OS request failed",
      }),
      { status: 400 },
    );
  }

  return new Response(
    JSON.stringify({ error: `Unknown Colony OS action: ${action}` }),
    { status: 400 },
  );
}
