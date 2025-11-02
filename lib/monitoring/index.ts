// lib/monitoring/index.ts - Central export for all monitoring utilities

// Sentry monitoring
export {
  captureError,
  trackEvent,
  setUser,
  clearUser,
  addBreadcrumb,
  startTransaction,
  measurePerformance,
  trackAPICall,
} from "./sentry";

// Performance monitoring
export {
  initWebVitals,
  trackPerformance,
  measureExecutionTime,
  trackAPIResponseTime,
  getMemoryUsage,
  startMemoryMonitoring,
} from "./performance";

// Analytics
export {
  trackAnalyticsEvent,
  trackPageView,
  trackUserAction,
  trackCampaignEvent,
  trackFunnelStep,
  trackAPIUsage,
  trackBusinessMetric,
  trackError,
  initAnalytics,
} from "./analytics";

// Netlify Functions
export {
  ResponseTimeTracker,
  withMonitoring,
  trackColdStart,
  trackExternalAPI,
} from "./netlify-functions";

// Health Checks
export {
  checkServiceHealth,
  checkInstagramHealth,
  checkTikTokHealth,
  checkYouTubeHealth,
  checkSupabaseHealth,
  checkBeeAgentHealth,
  checkSensoryCortexHealth,
  runAllHealthChecks,
} from "./health-checks";

// Alerts
export {
  sendSlackAlert,
  sendDiscordAlert,
  sendEmailAlert,
  triggerAlert,
  checkErrorRate,
  checkResponseTime,
  reportServiceDown,
  reportSecurityIncident,
  ALERT_CONFIGS,
} from "./alerts";

// Security
export {
  trackSecurityEvent,
  trackFailedAuth,
  trackRateLimitViolation,
  trackSuspiciousAPI,
  auditDataAccess,
  trackUnauthorizedAccess,
  detectDDoS,
  sanitizeInput,
  validateTokenFormat,
  cleanupSecurityTracking,
} from "./security";

// Types
export type { AlertSeverity, AlertConfig } from "./alerts";
export type { HealthCheckResult } from "./health-checks";
export type { AnalyticsEvent } from "./analytics";
export type { SecurityEvent } from "./security";
