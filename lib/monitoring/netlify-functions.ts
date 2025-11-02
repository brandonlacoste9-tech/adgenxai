// lib/monitoring/netlify-functions.ts - Netlify Functions monitoring utilities
import * as Sentry from "@sentry/node";
import type { HandlerResponse } from "@netlify/functions";

/**
 * Response time tracker
 */
export class ResponseTimeTracker {
  private startTime: number;
  
  constructor() {
    this.startTime = Date.now();
  }
  
  finish(): number {
    return Date.now() - this.startTime;
  }
}

/**
 * Wrap Netlify function with monitoring
 */
export function withMonitoring<T = HandlerResponse>(
  handler: (event: any, context: any) => Promise<T>,
  functionName: string
) {
  return async (event: any, context: any): Promise<T> => {
    const tracker = new ResponseTimeTracker();
    
    try {
      const result = await Sentry.startSpan(
        { name: `function.${functionName}`, op: "serverless.function" },
        async () => {
          return await handler(event, context);
        }
      );
      
      const duration = tracker.finish();
      
      // Log metrics
      console.log(JSON.stringify({
        type: "function_execution",
        function: functionName,
        method: event.httpMethod,
        path: event.path,
        duration,
        status: "success",
        timestamp: new Date().toISOString(),
      }));
      
      return result;
    } catch (error) {
      const duration = tracker.finish();
      
      // Log error
      console.error(JSON.stringify({
        type: "function_error",
        function: functionName,
        method: event.httpMethod,
        path: event.path,
        duration,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      }));
      
      // Capture in Sentry
      Sentry.captureException(error, {
        contexts: {
          function: {
            name: functionName,
            httpMethod: event.httpMethod,
            path: event.path,
            duration,
          },
        },
      });
      
      throw error;
    }
  };
}

/**
 * Track function cold start
 */
let isColdStart = true;
export function trackColdStart(functionName: string) {
  if (isColdStart) {
    console.log(JSON.stringify({
      type: "cold_start",
      function: functionName,
      timestamp: new Date().toISOString(),
    }));
    
    Sentry.captureMessage(`Cold start: ${functionName}`, "info");
    isColdStart = false;
  }
}

/**
 * Track external API call
 */
export async function trackExternalAPI<T>(
  serviceName: string,
  endpoint: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await Sentry.startSpan(
      { name: `external.${serviceName}`, op: "http.client" },
      async () => {
        return await fn();
      }
    );
    
    const duration = Date.now() - startTime;
    
    console.log(JSON.stringify({
      type: "external_api_call",
      service: serviceName,
      endpoint,
      duration,
      status: "success",
      timestamp: new Date().toISOString(),
    }));
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(JSON.stringify({
      type: "external_api_error",
      service: serviceName,
      endpoint,
      duration,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }));
    
    Sentry.captureException(error, {
      contexts: {
        api: {
          service: serviceName,
          endpoint,
          duration,
        },
      },
    });
    
    throw error;
  }
}
