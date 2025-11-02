"use client";

import { useState } from "react";

export default function CampaignOrchestrationDemo() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Campaign Orchestration Demo
        </h2>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          Orchestrate multi-platform campaigns with AI-powered content generation
        </p>
      </div>

      <div className="rounded-2xl border p-6" style={{ 
        background: "var(--card)", 
        borderColor: "var(--border)" 
      }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Campaign Manager</h3>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-4 py-2 rounded-lg font-semibold border"
            style={{ 
              background: "var(--card)", 
              borderColor: "var(--border)" 
            }}
          >
            {isRunning ? "Stop Campaign" : "Start Campaign"}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-lg border p-4" style={{ 
            background: "var(--card)", 
            borderColor: "var(--border)" 
          }}>
            <h4 className="font-semibold mb-2">Instagram</h4>
            <p className="text-sm opacity-70">
              {isRunning ? "Campaign running..." : "Ready to launch"}
            </p>
          </div>

          <div className="rounded-lg border p-4" style={{ 
            background: "var(--card)", 
            borderColor: "var(--border)" 
          }}>
            <h4 className="font-semibold mb-2">TikTok</h4>
            <p className="text-sm opacity-70">
              {isRunning ? "Campaign running..." : "Ready to launch"}
            </p>
          </div>

          <div className="rounded-lg border p-4" style={{ 
            background: "var(--card)", 
            borderColor: "var(--border)" 
          }}>
            <h4 className="font-semibold mb-2">YouTube</h4>
            <p className="text-sm opacity-70">
              {isRunning ? "Campaign running..." : "Ready to launch"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
