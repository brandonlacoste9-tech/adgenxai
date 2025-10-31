// Dashboard KPIs API endpoint
import { NextRequest, NextResponse } from "next/server";
import { isSupabaseServerConfigured, getSupabaseServerClientWithRLS } from "@lib/supabase/server";

export const runtime = "edge";

// Mock data for when Supabase is not configured
const mockKPIs = {
  totalUsers: 1247,
  activeAgents: 8,
  monthlyRevenue: 45230.50,
  conversationCount: 3421,
  avgResponseTime: 1.2,
  successRate: 94.5,
  topPerformingAgent: "Campaign Optimizer",
  recentActivity: [
    { id: 1, type: "conversation", timestamp: new Date().toISOString(), description: "New conversation started" },
    { id: 2, type: "agent", timestamp: new Date().toISOString(), description: "Agent performance improved" },
    { id: 3, type: "revenue", timestamp: new Date().toISOString(), description: "Monthly goal reached" },
  ],
};

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseServerConfigured()) {
      return NextResponse.json({
        ...mockKPIs,
        _note: "Using mock data - Supabase not configured",
      });
    }

    // Get Supabase client
    const supabase = getSupabaseServerClientWithRLS();

    // Fetch real KPIs from database
    // Note: These queries assume certain tables exist. Adjust based on actual schema.
    const [usersResult, agentsResult, conversationsResult] = await Promise.allSettled([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("agents").select("id", { count: "exact", head: true }),
      supabase.from("conversations").select("id", { count: "exact", head: true }),
    ]);

    // Extract counts with fallbacks
    const totalUsers = usersResult.status === "fulfilled" ? (usersResult.value.count || 0) : 0;
    const activeAgents = agentsResult.status === "fulfilled" ? (agentsResult.value.count || 0) : 0;
    const conversationCount = conversationsResult.status === "fulfilled" ? (conversationsResult.value.count || 0) : 0;

    // Return aggregated KPIs
    return NextResponse.json({
      totalUsers,
      activeAgents,
      conversationCount,
      monthlyRevenue: 0, // TODO: Calculate from transactions table
      avgResponseTime: 0, // TODO: Calculate from conversations table
      successRate: 0, // TODO: Calculate from conversations table
      topPerformingAgent: "N/A", // TODO: Query agent performance
      recentActivity: [], // TODO: Query activity log
      _source: "supabase",
    });
  } catch (error) {
    console.error("Error fetching KPIs:", error);
    
    // Return mock data on error with error info
    return NextResponse.json({
      ...mockKPIs,
      _note: "Using mock data - error fetching from Supabase",
      _error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
