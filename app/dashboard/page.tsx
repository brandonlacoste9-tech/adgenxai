"use client";

import { useState, useEffect } from "react";

interface KPIData {
  totalUsers: number;
  activeAgents: number;
  monthlyRevenue: number;
  conversationCount: number;
  avgResponseTime: number;
  successRate: number;
  topPerformingAgent: string;
  recentActivity: Array<{
    id: number;
    type: string;
    timestamp: string;
    description: string;
  }>;
  _note?: string;
  _source?: string;
}

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchKPIs() {
      try {
        const response = await fetch("/api/dashboard/kpis");
        if (!response.ok) {
          throw new Error("Failed to fetch KPIs");
        }
        const data = await response.json();
        setKpis(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-bold mb-2">Error loading dashboard</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          {kpis._note && (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              {kpis._note}
            </p>
          )}
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Users"
            value={kpis.totalUsers.toLocaleString()}
            icon="👥"
          />
          <KPICard
            title="Active Agents"
            value={kpis.activeAgents.toString()}
            icon="🤖"
          />
          <KPICard
            title="Monthly Revenue"
            value={`$${kpis.monthlyRevenue.toLocaleString()}`}
            icon="💰"
          />
          <KPICard
            title="Conversations"
            value={kpis.conversationCount.toLocaleString()}
            icon="💬"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Avg Response Time"
            value={`${kpis.avgResponseTime.toFixed(1)}s`}
          />
          <MetricCard
            title="Success Rate"
            value={`${kpis.successRate.toFixed(1)}%`}
          />
          <MetricCard
            title="Top Agent"
            value={kpis.topPerformingAgent}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          {kpis.recentActivity.length > 0 ? (
            <ul className="space-y-3">
              {kpis.recentActivity.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">{activity.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
      <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function getActivityIcon(type: string): string {
  switch (type) {
    case "conversation":
      return "💬";
    case "agent":
      return "🤖";
    case "revenue":
      return "💰";
    default:
      return "📊";
  }
}
