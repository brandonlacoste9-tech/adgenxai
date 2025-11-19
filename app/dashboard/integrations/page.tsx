'use client';

import { useState } from 'react';
import GhostIntegration from '@/components/GhostIntegration';

/**
 * Integrations Dashboard Page
 * Manage third-party integrations like Ghost CMS
 */
export default function IntegrationsPage() {
  const [ghostConnected, setGhostConnected] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Integrations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect AdGenXAI with your favorite tools and platforms
          </p>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ghost CMS Integration */}
          <GhostIntegration
            onConnect={(config) => {
              console.log('Ghost connected:', config);
              setGhostConnected(true);
            }}
            onDisconnect={() => {
              console.log('Ghost disconnected');
              setGhostConnected(false);
            }}
          />

          {/* Placeholder for future integrations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 opacity-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  More Integrations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Coming soon
                </p>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              More integrations will be available soon, including WordPress, Medium, and social media platforms.
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Need help with integrations?
          </h3>
          <p className="text-blue-800 dark:text-blue-200 mb-4">
            Check out our documentation for step-by-step guides on setting up integrations.
          </p>
          <a
            href="/docs/integrations/ghost"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            View Documentation
          </a>
        </div>
      </div>
    </div>
  );
}
