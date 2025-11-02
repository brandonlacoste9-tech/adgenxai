// Sentry server-side configuration for AdGenXAI
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Environment and release tracking
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    release: process.env.SENTRY_RELEASE || `adgenxai@${process.env.npm_package_version}`,
    
    // Performance Monitoring for server-side operations
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    
    // Server-specific integrations
    integrations: [
      Sentry.httpIntegration(),
    ],
    
    // Error filtering
    beforeSend(event, hint) {
      // Filter out expected errors
      const error = hint.originalException;
      if (error && typeof error === "object" && "message" in error) {
        const message = String(error.message);
        
        // Don't report expected business logic errors
        if (message.includes("ENOENT") || message.includes("ECONNREFUSED")) {
          return null;
        }
      }
      
      return event;
    },
  });
}
