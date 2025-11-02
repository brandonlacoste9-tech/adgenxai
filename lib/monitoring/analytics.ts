// lib/monitoring/analytics.ts - Analytics tracking utilities
import { addBreadcrumb } from "./sentry";

/**
 * Analytics event types
 */
export type AnalyticsEvent = 
  | "page_view"
  | "campaign_created"
  | "campaign_published"
  | "ad_generated"
  | "platform_connected"
  | "user_signup"
  | "user_login"
  | "subscription_started"
  | "subscription_cancelled"
  | "api_error"
  | "user_action";

/**
 * Track analytics event
 */
export function trackAnalyticsEvent(
  event: AnalyticsEvent,
  properties?: Record<string, any>
) {
  // Add breadcrumb for debugging
  addBreadcrumb(`Analytics: ${event}`, properties);
  
  // Send to analytics endpoint
  if (typeof window !== "undefined") {
    navigator.sendBeacon?.(
      "/api/analytics?action=track",
      JSON.stringify({
        type: "event",
        event,
        properties,
        timestamp: Date.now(),
        url: window.location.href,
        referrer: document.referrer,
      })
    );
  }
  
  // Send to Google Analytics if available
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, properties);
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string) {
  trackAnalyticsEvent("page_view", {
    path,
    title: title || document.title,
  });
}

/**
 * Track user action
 */
export function trackUserAction(action: string, properties?: Record<string, any>) {
  trackAnalyticsEvent("user_action", {
    action,
    ...properties,
  });
}

/**
 * Track campaign metrics
 */
export function trackCampaignEvent(
  action: "created" | "published" | "failed",
  campaignId: string,
  platform?: string
) {
  const event = action === "created" ? "campaign_created" : "campaign_published";
  
  trackAnalyticsEvent(event, {
    campaignId,
    platform,
    action,
  });
}

/**
 * Track conversion funnel
 */
export function trackFunnelStep(
  funnel: string,
  step: string,
  properties?: Record<string, any>
) {
  trackAnalyticsEvent("user_action", {
    funnel,
    step,
    ...properties,
  });
}

/**
 * Track API usage
 */
export function trackAPIUsage(
  endpoint: string,
  method: string,
  status: number,
  duration: number
) {
  if (typeof window !== "undefined") {
    navigator.sendBeacon?.(
      "/api/analytics?action=track",
      JSON.stringify({
        type: "api_usage",
        endpoint,
        method,
        status,
        duration,
        timestamp: Date.now(),
      })
    );
  }
}

/**
 * Track business metric
 */
export function trackBusinessMetric(
  metric: string,
  value: number,
  metadata?: Record<string, any>
) {
  if (typeof window !== "undefined") {
    navigator.sendBeacon?.(
      "/api/analytics?action=track",
      JSON.stringify({
        type: "business_metric",
        metric,
        value,
        metadata,
        timestamp: Date.now(),
      })
    );
  }
}

/**
 * Track error event
 */
export function trackError(
  error: Error | string,
  context?: Record<string, any>
) {
  const message = error instanceof Error ? error.message : error;
  
  trackAnalyticsEvent("api_error", {
    error: message,
    ...context,
  });
}

/**
 * Initialize analytics
 */
export function initAnalytics() {
  if (typeof window === "undefined") return;
  
  // Track initial page view
  trackPageView(window.location.pathname);
  
  // Track page visibility changes
  document.addEventListener("visibilitychange", () => {
    trackUserAction("visibility_change", {
      visible: !document.hidden,
    });
  });
  
  // Track before unload
  window.addEventListener("beforeunload", () => {
    trackUserAction("page_unload", {
      duration: performance.now(),
    });
  });
}
