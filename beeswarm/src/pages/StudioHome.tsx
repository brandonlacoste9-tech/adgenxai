// StudioHome.tsx
// Enhanced Studio Home with SwarmFeed and PersonaBoard integration

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuroraCanvas from '../ui/AuroraCanvas';
import SwarmParticleTrail from '../ui/SwarmParticleTrail';
import SwarmFeed from '../components/SwarmFeed';
import PersonaBoard from '../components/PersonaBoard';
import { useSwarmFeed } from '../hooks/useSwarmFeed';
import { usePersonaBoard } from '../hooks/usePersonaBoard';
import type { FeedItem } from '../components/SwarmFeed';
import type { Persona } from '../components/PersonaBoard';

// Storyboard data
const storyboardSnaps = [
  { time: '0:06', src: '/assets/A-bright-cinematic.jpg', title: 'Opening Scene' },
  { time: '0:09', src: '/assets/A-bright-cinematic.jpg', title: 'Product Reveal' },
  { time: '0:12', src: '/assets/A-bright-cinematic.jpg', title: 'Call to Action' }
];

export default function StudioHome() {
  const [selectedAdType, setSelectedAdType] = useState('urbanist');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSwarmFeed, setShowSwarmFeed] = useState(true);

  // Hooks for live data
  const swarmFeed = useSwarmFeed({
    pollingInterval: 12000, // 12 seconds
    maxItems: 15,
    autoRefresh: true
  });

  const personaBoard = usePersonaBoard({
    defaultPersonaId: 'bold',
    persistSelection: true,
    onPersonaChange: (persona) => {
      console.log('Persona changed to:', persona.label);
      // Trigger any persona-based updates here
    }
  });

  // Handle feed item clicks
  const handleFeedItemClick = (item: FeedItem) => {
    console.log('Feed item clicked:', item);
    // You can trigger actions based on the item type
    if (item.type === 'ad') {
      setSelectedAdType(item.persona);
    }
  };

  // Generate new ad based on selected persona
  const handleGenerateAd = async () => {
    if (!personaBoard.selectedPersona) return;

    setIsGenerating(true);
    
    // Simulate API call to generate ad
    setTimeout(() => {
      const newFeedItem: Omit<FeedItem, 'id' | 'timestamp'> = {
        image: '/assets/A-bright-cinematic.jpg',
        title: `${personaBoard.selectedPersona!.label} Campaign`,
        subtitle: `Generated with ${personaBoard.selectedPersona!.glyph} energy`,
        persona: personaBoard.selectedPersona!.id,
        type: 'ad'
      };

      swarmFeed.addFeedItem(newFeedItem);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <section className="relative min-h-screen bg-hiveDark font-sans overflow-x-hidden">
      {/* Background layers */}
      <AuroraCanvas />
      <SwarmParticleTrail />

      {/* Hero Background Image */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <img
          src="/assets/A-bright-cinematic.jpg"
          alt="AdGenXAI Studio"
          className="object-cover w-full h-full opacity-30 blur-2xl"
        />
      </div>

      <div className="relative z-10 pt-20 px-8 pb-8 space-y-12">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-7xl font-bold text-auroraGold drop-shadow-2xl mb-4">
            Studio
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Next-generation creative AI orchestration—where ads, personas, and swarm intelligence unite in mythic BeeHive flow
          </p>
        </motion.div>

        {/* Live SwarmFeed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-mono text-auroraGold">Live SwarmFeed</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSwarmFeed(!showSwarmFeed)}
                className="text-sm px-3 py-1 bg-auroraGold/20 rounded-full hover:bg-auroraGold/30 transition-colors"
              >
                {showSwarmFeed ? 'Hide' : 'Show'} Feed
              </button>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <div className="w-2 h-2 bg-auroraGold rounded-full animate-pulse" />
                <span>Live Updates</span>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {showSwarmFeed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <SwarmFeed
                  feedItems={swarmFeed.items}
                  onItemClick={handleFeedItemClick}
                  className="mb-8"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Main Creative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ad Generator */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-1 rounded-xl bg-hivePanel backdrop-blur-md p-8 shadow-aurora"
          >
            <h2 className="text-xl font-semibold text-auroraGold mb-6">Ad Generator</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 opacity-80">Campaign Type</label>
                <div className="flex gap-2 mb-4">
                  {['urbanist', 'inventor', 'creator'].map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedAdType(type)}
                      className={`py-2 px-3 rounded-full font-mono text-xs transition-all ${
                        selectedAdType === type
                          ? 'bg-auroraGold text-hiveDark'
                          : 'bg-plasmaBlue/20 text-plasmaBlue hover:bg-plasmaBlue/30'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 opacity-80">Current Persona</label>
                {personaBoard.selectedPersona && (
                  <div className="bg-hiveDark/50 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{personaBoard.selectedPersona.glyph}</span>
                      <div>
                        <div className="font-bold text-auroraGold">{personaBoard.selectedPersona.label}</div>
                        <div className="text-xs opacity-70">{personaBoard.selectedPersona.energy}% energy</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ad Preview */}
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-black/30 p-4 w-24 h-32 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src="/assets/A-bright-cinematic.jpg" 
                    alt="ad preview" 
                    className="object-cover h-full w-auto rounded-lg opacity-80" 
                  />
                  {isGenerating && (
                    <div className="absolute inset-0 bg-auroraGold/20 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-auroraGold border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-xs opacity-80 mb-2">
                    <strong>Launch Campaign</strong> — Level up your Vibefach smart mirror experience
                  </div>
                  <button
                    onClick={handleGenerateAd}
                    disabled={isGenerating || !personaBoard.selectedPersona}
                    className="bg-auroraGold text-hiveDark px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Ad'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Video Storyboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="rounded-xl bg-hivePanel backdrop-blur-md p-8 shadow-aurora"
          >
            <h2 className="text-xl font-semibold text-auroraGold mb-6">Video Storyboard</h2>
            
            <div className="grid grid-cols-3 gap-4">
              {storyboardSnaps.map((snap, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="relative rounded-lg bg-black/30 overflow-hidden shadow-inner group cursor-pointer"
                >
                  <div className="aspect-[3/4]">
                    <img 
                      src={snap.src} 
                      alt={`Storyboard ${snap.time}`} 
                      className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-hiveDark/80 to-transparent p-2">
                    <div className="text-xs font-mono text-auroraGold">{snap.time}</div>
                    <div className="text-xs opacity-70">{snap.title}</div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-auroraGold/10 to-plasmaBlue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="rounded-xl bg-hivePanel backdrop-blur-md p-8 shadow-aurora"
          >
            <h2 className="text-xl font-semibold text-auroraGold mb-6">Hive Pulse</h2>
            
            <div className="space-y-4">
              <div className="bg-hiveDark/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-80">Active Feed Items</span>
                  <span className="font-mono text-auroraGold">{swarmFeed.items.length}</span>
                </div>
                <div className="w-full h-2 bg-hiveDark rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-auroraGold to-plasmaBlue"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(swarmFeed.items.length * 5, 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              <div className="bg-hiveDark/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-80">Persona Energy</span>
                  <span className="font-mono text-auroraGold">
                    {personaBoard.selectedPersona?.energy || 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-hiveDark rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-plasmaBlue to-auroraGold"
                    initial={{ width: 0 }}
                    animate={{ width: `${personaBoard.selectedPersona?.energy || 0}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              <div className="bg-hiveDark/50 rounded-lg p-4">
                <div className="text-sm opacity-80 mb-2">Feed Status</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${swarmFeed.isLoading ? 'bg-auroraAmber animate-pulse' : 'bg-auroraGold'}`} />
                  <span className="text-xs font-mono">
                    {swarmFeed.isLoading ? 'Refreshing...' : 'Live'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* PersonaBoard Integration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <PersonaBoard
            personas={personaBoard.personas}
            selected={personaBoard.selectedPersona?.id}
            onSelect={personaBoard.selectPersona}
            className="mt-8"
          />
        </motion.div>

        {/* Honeycomb corner accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="fixed top-8 right-10 z-50"
        >
          <svg width="50" height="50" fill="none" viewBox="0 0 50 50" className="opacity-60 hover:opacity-100 transition-opacity">
            <g>
              <polygon 
                points="25,12 32,16 32,24 25,28 18,24 18,16" 
                stroke="#fccb00" 
                strokeWidth="1.5" 
                fill="none"
                className="animate-pulse"
              />
              <polygon 
                points="18,16 25,12 18,8 11,12 11,20 18,24" 
                stroke="#fccb00" 
                strokeWidth="1" 
                fill="none" 
                opacity="0.5" 
              />
              <polygon 
                points="32,16 39,12 39,20 32,24" 
                stroke="#fccb00" 
                strokeWidth="1" 
                fill="none" 
                opacity="0.5" 
              />
            </g>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}