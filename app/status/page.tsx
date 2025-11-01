"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface HealthData {
  status: string;
  uptime?: string;
  models?: string[];
  resources?: Record<string, any>;
  legendary?: boolean;
  timestamp: string;
  message?: string;
}

interface TelemetryData {
  stats: {
    totalEvents: number;
    processing: {
      mode: string;
      enabled: boolean;
    };
    timeRange: {
      start: string;
      end: string;
    };
  };
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch health data
      const healthRes = await fetch('/.netlify/functions/health');
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setHealth(healthData);
      } else {
        throw new Error(`Health check failed: ${healthRes.status}`);
      }

      // Fetch telemetry data
      const telemetryRes = await fetch('/.netlify/functions/webhook-telemetry');
      if (telemetryRes.ok) {
        const telemetryData = await telemetryRes.json();
        setTelemetry(telemetryData);
      } else {
        throw new Error(`Telemetry fetch failed: ${telemetryRes.status}`);
      }

      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status data');
      console.error('Status fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every hour (3600000ms)
    const interval = setInterval(fetchData, 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧠 Sensory Cortex — Agent Mode Status Tracker
          </h1>
          <p className="text-gray-600">
            Observation mode active. Hourly telemetry updates.
          </p>
          <Link 
            href="/"
            className="inline-block mt-4 text-purple-600 hover:text-purple-800 font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Loading State */}
        {loading && !health && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-pulse">
              <div className="text-2xl mb-2">⏳</div>
              <p className="text-gray-600">Loading telemetry data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-900">Error Loading Status</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Health Status Card */}
        {health && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Health Status</h2>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-semibold">
                  {health.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {health.uptime && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Uptime</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {health.uptime}
                  </div>
                </div>
              )}

              {health.models && health.models.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Active Models</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {health.models.join(', ')}
                  </div>
                </div>
              )}

              {health.resources && (
                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                  <div className="text-sm text-gray-600 mb-1">Resources</div>
                  <div className="text-sm font-mono text-gray-900">
                    {JSON.stringify(health.resources, null, 2)}
                  </div>
                </div>
              )}

              {health.legendary && (
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    <span className="text-lg font-bold text-purple-900">
                      Legendary Mode Active
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Last checked: {new Date(health.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Telemetry Card */}
        {telemetry && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Telemetry Data
            </h2>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 mb-1">Processing Mode</div>
                <div className="text-lg font-semibold text-blue-900 capitalize">
                  {telemetry.stats.processing.mode}
                </div>
                <div className="text-sm text-blue-700 mt-1">
                  {telemetry.stats.processing.enabled ? '✓ Enabled' : '✗ Disabled'}
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 mb-1">Total Events</div>
                <div className="text-3xl font-bold text-green-900">
                  {telemetry.stats.totalEvents}
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-purple-600 mb-2">Time Range</div>
                <div className="space-y-1 text-sm font-mono text-purple-900">
                  <div>
                    <span className="text-purple-600">Start:</span>{' '}
                    {new Date(telemetry.stats.timeRange.start).toLocaleString()}
                  </div>
                  <div>
                    <span className="text-purple-600">End:</span>{' '}
                    {new Date(telemetry.stats.timeRange.end).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            System Information
          </h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Update:</span>
              <span className="font-semibold text-gray-900">
                {lastUpdate.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Auto-Refresh:</span>
              <span className="font-semibold text-gray-900">Every Hour</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <button
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Refreshing...' : 'Refresh Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>AdGenXAI Sensory Cortex v1.0</p>
          <p className="mt-1">
            Powered by Netlify Functions | Next.js 14
          </p>
        </div>
      </div>
    </div>
  );
}
