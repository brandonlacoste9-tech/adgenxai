// useSwarmFeed.ts
// Hook for managing live SwarmFeed data and state

import { useState, useEffect, useCallback, useRef } from 'react';
import type { FeedItem } from '../components/SwarmFeed';

interface SwarmFeedState {
  items: FeedItem[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

interface UseSwarmFeedOptions {
  pollingInterval?: number; // milliseconds
  maxItems?: number;
  autoRefresh?: boolean;
  apiEndpoint?: string;
}

export function useSwarmFeed(options: UseSwarmFeedOptions = {}) {
  const {
    pollingInterval = 15000, // 15 seconds
    maxItems = 20,
    autoRefresh = true,
    apiEndpoint = '/api/swarm/feed'
  } = options;

  const [state, setState] = useState<SwarmFeedState>({
    items: [],
    isLoading: false,
    error: null,
    lastUpdate: null
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate mock feed data for development
  const generateMockFeedItem = useCallback((): FeedItem => {
    const types: FeedItem['type'][] = ['ad', 'storyboard', 'voice', 'sentiment'];
    const personas = ['bold', 'confident', 'clear', 'aspirational', 'inventor', 'urbanist'];
    const titles = [
      'Bold Campaign Launch', 'Storyboard Moment', 'Voice Synthesis Complete',
      'Sentiment Pulse Rising', 'Creative Breakthrough', 'Community Activation',
      'Brand Evolution', 'Artistic Vision', 'Cultural Shift', 'Innovation Wave'
    ];
    const subtitles = [
      'Urbanist collection revealed', 'Mirror sequence at 0:12', 'Aspirational tone activated',
      'Swarm energy amplified', 'Creative barriers dissolved', 'Collective inspiration',
      'Brand identity refined', 'Visual narrative enhanced', 'Cultural impact measured',
      'Innovation momentum building'
    ];

    const type = types[Math.floor(Math.random() * types.length)];
    const persona = personas[Math.floor(Math.random() * personas.length)];

    return {
      id: `feed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      image: '/assets/A-bright-cinematic.jpg',
      title: titles[Math.floor(Math.random() * titles.length)],
      subtitle: subtitles[Math.floor(Math.random() * subtitles.length)],
      persona,
      timestamp: new Date().toISOString(),
      type
    };
  }, []);

  // Fetch feed data from API
  const fetchFeedData = useCallback(async (): Promise<FeedItem[]> => {
    try {
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      
      const response = await fetch(apiEndpoint, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch feed data: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items || data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error; // Re-throw abort errors
      }

      // Fallback to mock data for development
      console.warn('API not available, using mock data:', error);
      
      // Generate 3-5 mock items
      const mockCount = Math.floor(Math.random() * 3) + 3;
      return Array.from({ length: mockCount }, () => generateMockFeedItem());
    }
  }, [apiEndpoint, generateMockFeedItem]);

  // Refresh feed data
  const refreshFeed = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const newItems = await fetchFeedData();
      
      setState(prev => {
        // Merge new items with existing, avoiding duplicates
        const existingIds = new Set(prev.items.map(item => item.id));
        const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
        
        // Combine and limit to maxItems
        const allItems = [...uniqueNewItems, ...prev.items]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, maxItems);

        return {
          items: allItems,
          isLoading: false,
          error: null,
          lastUpdate: new Date()
        };
      });
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
      }
    }
  }, [fetchFeedData, maxItems]);

  // Add new item manually (for testing or manual additions)
  const addFeedItem = useCallback((item: Omit<FeedItem, 'id' | 'timestamp'>) => {
    const newItem: FeedItem = {
      ...item,
      id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      items: [newItem, ...prev.items].slice(0, maxItems)
    }));
  }, [maxItems]);

  // Start/stop polling
  const startPolling = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      refreshFeed();
    }, pollingInterval);
  }, [refreshFeed, pollingInterval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Initialize and setup polling
  useEffect(() => {
    // Initial fetch
    refreshFeed();

    // Start polling if enabled
    if (autoRefresh) {
      startPolling();
    }

    // Cleanup on unmount
    return () => {
      stopPolling();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [refreshFeed, autoRefresh, startPolling, stopPolling]);

  // Pause/resume polling based on page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else if (autoRefresh) {
        startPolling();
        refreshFeed(); // Refresh immediately when page becomes visible
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [autoRefresh, startPolling, stopPolling, refreshFeed]);

  return {
    ...state,
    refreshFeed,
    addFeedItem,
    startPolling,
    stopPolling,
    isPolling: intervalRef.current !== null
  };
}