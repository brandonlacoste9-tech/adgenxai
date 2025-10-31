"use client";

import { useState, useEffect } from "react";

interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

interface Metric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
}

export default function RitualsPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual API call when Supabase schema is ready
    setTimeout(() => {
      setBadges([
        {
          id: "1",
          name: "First Campaign",
          description: "Created your first campaign",
          earned: true,
          earnedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          name: "Power User",
          description: "Completed 100 conversations",
          earned: true,
          earnedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          name: "Team Leader",
          description: "Invited 5 team members",
          earned: false,
        },
      ]);

      setMetrics([
        { id: "1", name: "Daily Conversations", value: 42, target: 50, unit: "chats" },
        { id: "2", name: "Weekly Revenue", value: 12500, target: 15000, unit: "$" },
        { id: "3", name: "Response Time", value: 1.2, target: 1.0, unit: "s" },
      ]);

      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading rituals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Rituals & Achievements
        </h1>

        {/* Badges Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Badges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${
                  badge.earned ? "border-2 border-green-500" : "opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">
                    {badge.earned ? "🏆" : "🔒"}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {badge.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {badge.description}
                    </p>
                    {badge.earned && badge.earnedDate && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Earned {new Date(badge.earnedDate).toLocaleDateString()}
                      </p>
                    )}
                    {!badge.earned && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Not yet earned
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {metric.name}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {metric.unit === "$" && "$"}
                    {metric.value.toLocaleString()}
                    {metric.unit !== "$" && ` ${metric.unit}`}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    / {metric.unit === "$" && "$"}{metric.target.toLocaleString()}{metric.unit !== "$" && ` ${metric.unit}`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (metric.value / metric.target) * 100 >= 80
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                    style={{
                      width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {((metric.value / metric.target) * 100).toFixed(0)}% of target
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm text-amber-600 dark:text-amber-400">
          Using mock data - Connect Supabase to see real rituals and metrics
        </p>
      </div>
    </div>
  );
}
