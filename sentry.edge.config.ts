// Sentry edge configuration for AdGenXAI
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Environment and release tracking
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    release: process.env.SENTRY_RELEASE || `adgenxai@${process.env.npm_package_version}`,
    
    // Performance Monitoring for edge functions
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  });
}
