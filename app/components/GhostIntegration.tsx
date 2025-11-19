'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface GhostConnection {
  url: string;
  contentApiKey: string;
  adminApiKey: string;
  connected: boolean;
  siteName?: string;
}

interface GhostIntegrationProps {
  onConnect?: (config: GhostConnection) => void;
  onDisconnect?: () => void;
}

/**
 * Ghost Integration Component
 * Allows users to connect their Ghost CMS site to AdGenXAI
 */
export default function GhostIntegration({ onConnect, onDisconnect }: GhostIntegrationProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connection, setConnection] = useState<GhostConnection | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    contentApiKey: '',
    adminApiKey: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Test the connection
      const response = await fetch('/api/ghost/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        const newConnection: GhostConnection = {
          ...formData,
          connected: true,
          siteName: result.siteName
        };
        setConnection(newConnection);
        setShowForm(false);
        onConnect?.(newConnection);
      } else {
        setError(result.error || 'Failed to connect to Ghost');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setConnection(null);
    setFormData({ url: '', contentApiKey: '', adminApiKey: '' });
    onDisconnect?.();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Ghost CMS
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Publish AI content to your Ghost site
            </p>
          </div>
        </div>
        
        {connection ? (
          <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
            Connected
          </span>
        ) : (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
            Not Connected
          </span>
        )}
      </div>

      {connection ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-800 dark:text-green-200 font-medium">
              ✓ Connected to {connection.siteName || connection.url}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              You can now publish AI-generated content to your Ghost site
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Disconnect
            </button>
            <button
              onClick={() => window.location.href = '/dashboard/ghost/publish'}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Publish Content
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {!showForm ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Connect your Ghost CMS to start publishing AI-generated content
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Connect Ghost Site
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ghost Site URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://your-ghost-site.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content API Key
                </label>
                <input
                  type="password"
                  value={formData.contentApiKey}
                  onChange={(e) => setFormData({ ...formData, contentApiKey: e.target.value })}
                  placeholder="Enter your Content API key"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin API Key
                </label>
                <input
                  type="password"
                  value={formData.adminApiKey}
                  onChange={(e) => setFormData({ ...formData, adminApiKey: e.target.value })}
                  placeholder="Enter your Admin API key"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Required for publishing content. Get it from Ghost Admin → Settings → Integrations
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleConnect}
                  disabled={isConnecting || !formData.url || !formData.contentApiKey}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setError(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
