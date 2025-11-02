// SwarmFeed.tsx
// Live, rolling creative stream with plasma glow and honeycomb transitions

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FeedItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  persona: string;
  timestamp: string;
  type: 'ad' | 'storyboard' | 'voice' | 'sentiment';
}

interface SwarmFeedProps {
  feedItems?: FeedItem[];
  onItemClick?: (item: FeedItem) => void;
  className?: string;
}

export default function SwarmFeed({ feedItems = [], onItemClick, className = '' }: SwarmFeedProps) {
  const [isLoading, setIsLoading] = useState(false);

  const defaultFeedItems: FeedItem[] = [
    {
      id: 'feed1',
      image: '/assets/A-bright-cinematic.jpg',
      title: 'Bold Ad',
      subtitle: 'Urbanist Launch for Vibefach',
      persona: 'bold',
      timestamp: new Date().toISOString(),
      type: 'ad'
    },
    {
      id: 'feed2',
      image: '/assets/A-bright-cinematic.jpg',
      title: 'Storyboard Moment',
      subtitle: 'Inventor Mirror at 0:09',
      persona: 'inventor',
      timestamp: new Date().toISOString(),
      type: 'storyboard'
    },
    {
      id: 'feed3',
      image: '/assets/A-bright-cinematic.jpg',
      title: 'Voice Synthesis',
      subtitle: 'Aspirational tone activated',
      persona: 'aspirational',
      timestamp: new Date().toISOString(),
      type: 'voice'
    },
    {
      id: 'feed4',
      image: '/assets/A-bright-cinematic.jpg',
      title: 'Sentiment Pulse',
      subtitle: 'Community energy rising',
      persona: 'confident',
      timestamp: new Date().toISOString(),
      type: 'sentiment'
    }
  ];

  const displayItems = feedItems.length > 0 ? feedItems : defaultFeedItems;

  const getTypeIcon = (type: FeedItem['type']) => {
    switch (type) {
      case 'ad': return '📢';
      case 'storyboard': return '🎬';
      case 'voice': return '🎙️';
      case 'sentiment': return '💫';
      default: return '✨';
    }
  };

  const getTypeColor = (type: FeedItem['type']) => {
    switch (type) {
      case 'ad': return 'from-auroraGold to-auroraAmber';
      case 'storyboard': return 'from-plasmaBlue to-auroraGold';
      case 'voice': return 'from-auroraAmber to-plasmaBlue';
      case 'sentiment': return 'from-plasmaBlue to-auroraGold';
      default: return 'from-auroraGold to-plasmaBlue';
    }
  };

  return (
    <section className={`relative bg-hiveDark p-6 rounded-xl shadow-aurora animate-pulseGlow ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-mono text-auroraGold">SwarmFeed</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-auroraGold rounded-full animate-pulse"></div>
          <span className="text-xs opacity-70">Live</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-5 pb-4">
          <AnimatePresence>
            {displayItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -50 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                className="min-w-[240px] bg-hivePanel rounded-lg overflow-hidden shadow-md cursor-pointer relative group"
                onClick={() => onItemClick?.(item)}
              >
                {/* Honeycomb overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-br from-auroraGold/20 to-transparent" 
                       style={{
                         backgroundImage: `radial-gradient(circle at 20% 20%, transparent 20%, rgba(252, 203, 0, 0.1) 21%, rgba(252, 203, 0, 0.1) 24%, transparent 25%),
                                          radial-gradient(circle at 80% 80%, transparent 20%, rgba(252, 203, 0, 0.1) 21%, rgba(252, 203, 0, 0.1) 24%, transparent 25%)`
                       }}
                  />
                </div>

                {/* Type indicator */}
                <div className="absolute top-3 right-3 z-10">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getTypeColor(item.type)} flex items-center justify-center text-sm`}>
                    {getTypeIcon(item.type)}
                  </div>
                </div>

                {/* Main image */}
                <div className="h-40 bg-hiveDark/50 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-auroraGold/20 to-plasmaBlue/20 flex items-center justify-center">
                    <span className="text-4xl opacity-60">{getTypeIcon(item.type)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 text-auroraGold">
                  <div className="flex items-center justify-between mb-1">
                    <span className="block font-bold text-sm truncate">{item.title}</span>
                    <span className="text-xs opacity-60 ml-2">{item.persona}</span>
                  </div>
                  <span className="text-xs opacity-80 block">{item.subtitle}</span>
                  <div className="mt-2 text-xs opacity-50">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                {/* Plasma glow border */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-auroraGold/20 via-transparent to-plasmaBlue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add new item placeholder */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="min-w-[240px] h-[200px] bg-hivePanel/50 rounded-lg border-2 border-dashed border-auroraGold/30 flex flex-col items-center justify-center cursor-pointer hover:border-auroraGold/60 transition-colors"
          >
            <div className="text-2xl mb-2 opacity-50">+</div>
            <span className="text-xs opacity-70 text-center px-4">New ritual awaits</span>
          </motion.div>
        </div>
      </div>

      {/* Animated loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-hiveDark/80 rounded-xl flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-auroraGold border-t-transparent rounded-full animate-spin" />
            <span className="text-sm opacity-70">Channeling swarm energy...</span>
          </div>
        </div>
      )}
    </section>
  );
}