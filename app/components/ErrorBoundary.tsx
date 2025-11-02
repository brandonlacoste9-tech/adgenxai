"use client";

import React, { Component, ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component with Sentry integration
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
    
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div
          className="min-h-screen flex items-center justify-center p-8"
          style={{ background: "var(--bg)" }}
        >
          <div
            className="max-w-md w-full rounded-xl border p-8 text-center space-y-4"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="text-4xl">⚠️</div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Something went wrong
            </h1>
            <p className="text-sm opacity-70" style={{ color: "var(--text)" }}>
              We've been notified and are looking into it.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-2 rounded-lg font-medium transition hover:opacity-80"
              style={{
                background: "linear-gradient(135deg, #35E3FF 0%, #7C4DFF 100%)",
                color: "white",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Function component wrapper for error boundaries
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
