// lib/monitoring/health-checks.ts - Service health monitoring utilities

/**
 * Health check result
 */
export interface HealthCheckResult {
  status: "healthy" | "degraded" | "unhealthy";
  service: string;
  latency?: number;
  error?: string;
  timestamp: string;
}

/**
 * Check service health
 */
export async function checkServiceHealth(
  serviceName: string,
  checkFn: () => Promise<void>,
  timeoutMs: number = 5000
): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    await Promise.race([
      checkFn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Health check timeout")), timeoutMs)
      ),
    ]);
    
    const latency = Date.now() - startTime;
    
    return {
      status: latency < 1000 ? "healthy" : "degraded",
      service: serviceName,
      latency,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "unhealthy",
      service: serviceName,
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Check Instagram API health
 */
export async function checkInstagramHealth(): Promise<HealthCheckResult> {
  return checkServiceHealth("instagram", async () => {
    const token = process.env.FB_ACCESS_TOKEN;
    if (!token) throw new Error("No access token configured");
    
    const response = await fetch(
      `https://graph.facebook.com/v17.0/me?access_token=${token}`
    );
    
    if (!response.ok) {
      throw new Error(`Instagram API returned ${response.status}`);
    }
  });
}

/**
 * Check TikTok API health
 */
export async function checkTikTokHealth(): Promise<HealthCheckResult> {
  return checkServiceHealth("tiktok", async () => {
    // TikTok health check - currently a stub
    // In production, you would check the actual TikTok API
    const token = process.env.TIKTOK_ACCESS_TOKEN;
    if (!token) throw new Error("No access token configured");
  });
}

/**
 * Check YouTube API health
 */
export async function checkYouTubeHealth(): Promise<HealthCheckResult> {
  return checkServiceHealth("youtube", async () => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) throw new Error("No API key configured");
    
    // Simple health check - verify API key works
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API returned ${response.status}`);
    }
  });
}

/**
 * Check Supabase health
 */
export async function checkSupabaseHealth(): Promise<HealthCheckResult> {
  return checkServiceHealth("supabase", async () => {
    const url = process.env.SUPABASE_URL;
    if (!url) throw new Error("No Supabase URL configured");
    
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      },
    });
    
    if (!response.ok && response.status !== 404) {
      throw new Error(`Supabase returned ${response.status}`);
    }
  });
}

/**
 * Check Bee Agent API health
 */
export async function checkBeeAgentHealth(): Promise<HealthCheckResult> {
  return checkServiceHealth("bee-agent", async () => {
    const url = process.env.BEE_API_URL;
    if (!url) throw new Error("No Bee Agent URL configured");
    
    const response = await fetch(`${url}/health`);
    
    if (!response.ok) {
      throw new Error(`Bee Agent returned ${response.status}`);
    }
  });
}

/**
 * Check AI Sensory Cortex health
 */
export async function checkSensoryCortexHealth(): Promise<HealthCheckResult> {
  return checkServiceHealth("sensory-cortex", async () => {
    const url = process.env.SENSORY_CORTEX_URL || process.env.NEXT_PUBLIC_SENSORY_CORTEX_URL;
    if (!url) throw new Error("No Sensory Cortex URL configured");
    
    const response = await fetch(`${url}/health`);
    
    if (!response.ok) {
      throw new Error(`Sensory Cortex returned ${response.status}`);
    }
  });
}

/**
 * Run all health checks
 */
export async function runAllHealthChecks(): Promise<{
  overall: "healthy" | "degraded" | "unhealthy";
  checks: HealthCheckResult[];
}> {
  const checks = await Promise.all([
    checkInstagramHealth(),
    checkTikTokHealth(),
    checkYouTubeHealth(),
    checkSupabaseHealth(),
    checkBeeAgentHealth(),
    checkSensoryCortexHealth(),
  ]);
  
  const unhealthyCount = checks.filter(c => c.status === "unhealthy").length;
  const degradedCount = checks.filter(c => c.status === "degraded").length;
  
  let overall: "healthy" | "degraded" | "unhealthy" = "healthy";
  if (unhealthyCount > 0) {
    overall = unhealthyCount >= 3 ? "unhealthy" : "degraded";
  } else if (degradedCount > 2) {
    overall = "degraded";
  }
  
  return { overall, checks };
}
