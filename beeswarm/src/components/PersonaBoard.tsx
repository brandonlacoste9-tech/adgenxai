// PersonaBoard.tsx
// Interactive persona selection with animated glyphs and ceremonial transitions

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Persona {
  id: string;
  label: string;
  description: string;
  color: string;
  glyph: string;
  energy: number; // 0-100
  traits: string[];
}

interface PersonaBoardProps {
  personas?: Persona[];
  selected?: string;
  onSelect?: (persona: Persona) => void;
  className?: string;
}

export default function PersonaBoard({ 
  personas: customPersonas, 
  selected, 
  onSelect, 
  className = '' 
}: PersonaBoardProps) {
  const [selectedPersona, setSelectedPersona] = useState<string>(selected || '');
  const [hoveredPersona, setHoveredPersona] = useState<string>('');

  const defaultPersonas: Persona[] = [
    {
      id: 'bold',
      label: 'Bold',
      description: 'Confident and assertive creative energy',
      color: 'from-auroraGold to-auroraAmber',
      glyph: '⚡',
      energy: 95,
      traits: ['decisive', 'impactful', 'memorable']
    },
    {
      id: 'confident',
      label: 'Confident',
      description: 'Steady and assured creative presence',
      color: 'from-plasmaBlue to-auroraGold',
      glyph: '🔥',
      energy: 85,
      traits: ['reliable', 'strong', 'trustworthy']
    },
    {
      id: 'clear',
      label: 'Clear',
      description: 'Crystal communication and focus',
      color: 'from-auroraAmber to-plasmaBlue',
      glyph: '💎',
      energy: 90,
      traits: ['precise', 'focused', 'direct']
    },
    {
      id: 'aspirational',
      label: 'Aspirational',
      description: 'Inspiring and uplifting creative vision',
      color: 'from-plasmaBlue to-auroraAmber',
      glyph: '✨',
      energy: 88,
      traits: ['inspiring', 'uplifting', 'visionary']
    },
    {
      id: 'inventor',
      label: 'Inventor',
      description: 'Innovative and experimental approach',
      color: 'from-auroraGold to-plasmaBlue',
      glyph: '🔬',
      energy: 92,
      traits: ['creative', 'experimental', 'pioneering']
    },
    {
      id: 'urbanist',
      label: 'Urbanist',
      description: 'Modern and metropolitan perspective',
      color: 'from-auroraAmber to-auroraGold',
      glyph: '🏙️',
      energy: 87,
      traits: ['modern', 'sophisticated', 'current']
    }
  ];

  const personas = customPersonas || defaultPersonas;
  const activePersona = personas.find(p => p.id === selectedPersona);

  const handleSelect = (persona: Persona) => {
    setSelectedPersona(persona.id);
    onSelect?.(persona);
  };

  // Auto-select first persona if none selected
  useEffect(() => {
    if (!selectedPersona && personas.length > 0) {
      setSelectedPersona(personas[0].id);
    }
  }, [personas, selectedPersona]);

  return (
    <div className={`bg-hivePanel shadow-aurora rounded-xl p-8 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-mono text-auroraGold">Persona Board</h2>
        {activePersona && (
          <div className="flex items-center gap-3">
            <span className="text-2xl">{activePersona.glyph}</span>
            <div className="text-right">
              <div className="text-sm font-bold text-auroraGold">{activePersona.label}</div>
              <div className="text-xs opacity-70">Energy: {activePersona.energy}%</div>
            </div>
          </div>
        )}
      </div>

      {/* Persona Selection Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <AnimatePresence>
          {personas.map((persona, index) => {
            const isSelected = selectedPersona === persona.id;
            const isHovered = hoveredPersona === persona.id;
            
            return (
              <motion.button
                key={persona.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateX: 5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-4 rounded-lg font-bold text-lg transition-all duration-300 overflow-hidden group ${
                  isSelected 
                    ? 'bg-gradient-to-r from-auroraGold to-auroraAmber text-hiveDark scale-105 shadow-aurora' 
                    : 'bg-gradient-to-r from-plasmaBlue/30 to-auroraGold/30 text-auroraGold hover:from-auroraGold/40 hover:to-plasmaBlue/40'
                }`}
                onClick={() => handleSelect(persona)}
                onMouseEnter={() => setHoveredPersona(persona.id)}
                onMouseLeave={() => setHoveredPersona('')}
              >
                {/* Animated background glow */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${persona.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  animate={{
                    background: isSelected 
                      ? `linear-gradient(45deg, rgba(252, 203, 0, 0.3), rgba(26, 140, 255, 0.3))` 
                      : undefined
                  }}
                />

                {/* Honeycomb pattern overlay */}
                {(isSelected || isHovered) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 25% 25%, transparent 20%, rgba(255, 255, 255, 0.1) 21%, rgba(255, 255, 255, 0.1) 24%, transparent 25%),
                                       radial-gradient(circle at 75% 75%, transparent 20%, rgba(255, 255, 255, 0.1) 21%, rgba(255, 255, 255, 0.1) 24%, transparent 25%)`
                    }}
                  />
                )}

                {/* Glyph and label */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <motion.div
                    animate={{ 
                      scale: isSelected ? 1.2 : 1,
                      rotateZ: isSelected ? 360 : 0
                    }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl"
                  >
                    {persona.glyph}
                  </motion.div>
                  <span className="font-mono">{persona.label}</span>
                </div>

                {/* Energy indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-auroraGold to-plasmaBlue"
                    initial={{ width: 0 }}
                    animate={{ width: `${persona.energy}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  />
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-3 h-3 bg-hiveDark rounded-full flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 bg-auroraGold rounded-full animate-pulse" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Active Persona Details */}
      <AnimatePresence mode="wait">
        {activePersona && (
          <motion.div
            key={activePersona.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-hiveDark/50 rounded-lg p-4"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{activePersona.glyph}</div>
              <div className="flex-1">
                <h3 className="font-bold text-auroraGold mb-1">{activePersona.label}</h3>
                <p className="text-sm opacity-80 mb-3">{activePersona.description}</p>
                <div className="flex flex-wrap gap-2">
                  {activePersona.traits.map((trait, idx) => (
                    <motion.span
                      key={trait}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="px-2 py-1 bg-auroraGold/20 rounded text-xs font-mono text-auroraGold"
                    >
                      {trait}
                    </motion.span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-70 mb-1">Creative Energy</div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-hiveDark rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${activePersona.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${activePersona.energy}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className="text-xs font-mono">{activePersona.energy}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}