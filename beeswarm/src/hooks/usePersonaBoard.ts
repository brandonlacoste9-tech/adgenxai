// usePersonaBoard.ts
// Hook for managing PersonaBoard state and integration with creative workflows

import { useState, useEffect, useCallback } from 'react';
import type { Persona } from '../components/PersonaBoard';

interface PersonaBoardState {
  selectedPersona: Persona | null;
  personas: Persona[];
  isLoading: boolean;
  error: string | null;
}

interface UsePersonaBoardOptions {
  defaultPersonaId?: string;
  apiEndpoint?: string;
  onPersonaChange?: (persona: Persona) => void;
  persistSelection?: boolean;
}

const STORAGE_KEY = 'beehive_selected_persona';

export function usePersonaBoard(options: UsePersonaBoardOptions = {}) {
  const {
    defaultPersonaId = 'bold',
    apiEndpoint = '/api/personas',
    onPersonaChange,
    persistSelection = true
  } = options;

  const [state, setState] = useState<PersonaBoardState>({
    selectedPersona: null,
    personas: [],
    isLoading: false,
    error: null
  });

  // Default personas configuration
  const defaultPersonas: Persona[] = [
    {
      id: 'bold',
      label: 'Bold',
      description: 'Confident and assertive creative energy that commands attention',
      color: 'from-auroraGold to-auroraAmber',
      glyph: '⚡',
      energy: 95,
      traits: ['decisive', 'impactful', 'memorable', 'powerful']
    },
    {
      id: 'confident',
      label: 'Confident',
      description: 'Steady and assured creative presence that inspires trust',
      color: 'from-plasmaBlue to-auroraGold',
      glyph: '🔥',
      energy: 85,
      traits: ['reliable', 'strong', 'trustworthy', 'stable']
    },
    {
      id: 'clear',
      label: 'Clear',
      description: 'Crystal communication and laser-focused creative direction',
      color: 'from-auroraAmber to-plasmaBlue',
      glyph: '💎',
      energy: 90,
      traits: ['precise', 'focused', 'direct', 'articulate']
    },
    {
      id: 'aspirational',
      label: 'Aspirational',
      description: 'Inspiring and uplifting creative vision that motivates action',
      color: 'from-plasmaBlue to-auroraAmber',
      glyph: '✨',
      energy: 88,
      traits: ['inspiring', 'uplifting', 'visionary', 'motivating']
    },
    {
      id: 'inventor',
      label: 'Inventor',
      description: 'Innovative and experimental approach to creative challenges',
      color: 'from-auroraGold to-plasmaBlue',
      glyph: '🔬',
      energy: 92,
      traits: ['creative', 'experimental', 'pioneering', 'innovative']
    },
    {
      id: 'urbanist',
      label: 'Urbanist',
      description: 'Modern metropolitan perspective with contemporary edge',
      color: 'from-auroraAmber to-auroraGold',
      glyph: '🏙️',
      energy: 87,
      traits: ['modern', 'sophisticated', 'current', 'metropolitan']
    }
  ];

  // Load personas from API or use defaults
  const loadPersonas = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(apiEndpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to load personas: ${response.statusText}`);
      }

      const data = await response.json();
      const personas = data.personas || data || defaultPersonas;

      setState(prev => ({
        ...prev,
        personas,
        isLoading: false
      }));

      return personas;
    } catch (error) {
      console.warn('API not available, using default personas:', error);
      
      setState(prev => ({
        ...prev,
        personas: defaultPersonas,
        isLoading: false,
        error: null // Don't show error for fallback to defaults
      }));

      return defaultPersonas;
    }
  }, [apiEndpoint]);

  // Select a persona
  const selectPersona = useCallback((persona: Persona) => {
    setState(prev => ({
      ...prev,
      selectedPersona: persona
    }));

    // Persist selection to localStorage
    if (persistSelection) {
      try {
        localStorage.setItem(STORAGE_KEY, persona.id);
      } catch (error) {
        console.warn('Failed to persist persona selection:', error);
      }
    }

    // Trigger callback
    onPersonaChange?.(persona);
  }, [persistSelection, onPersonaChange]);

  // Select persona by ID
  const selectPersonaById = useCallback((personaId: string) => {
    const persona = state.personas.find(p => p.id === personaId);
    if (persona) {
      selectPersona(persona);
    }
  }, [state.personas, selectPersona]);

  // Get persona by ID
  const getPersonaById = useCallback((personaId: string) => {
    return state.personas.find(p => p.id === personaId) || null;
  }, [state.personas]);

  // Load persisted selection
  const loadPersistedSelection = useCallback(() => {
    if (!persistSelection) return null;

    try {
      const savedPersonaId = localStorage.getItem(STORAGE_KEY);
      return savedPersonaId;
    } catch (error) {
      console.warn('Failed to load persisted persona selection:', error);
      return null;
    }
  }, [persistSelection]);

  // Initialize personas and selection
  useEffect(() => {
    const initializePersonaBoard = async () => {
      const personas = await loadPersonas();
      
      // Determine which persona to select initially
      let initialPersonaId = defaultPersonaId;
      
      // Try to load persisted selection first
      const persistedId = loadPersistedSelection();
      if (persistedId && personas.find(p => p.id === persistedId)) {
        initialPersonaId = persistedId;
      }

      // Select the initial persona
      const initialPersona = personas.find(p => p.id === initialPersonaId);
      if (initialPersona) {
        selectPersona(initialPersona);
      }
    };

    initializePersonaBoard();
  }, [defaultPersonaId, loadPersonas, loadPersistedSelection, selectPersona]);

  // Generate creative context based on selected persona
  const getCreativeContext = useCallback(() => {
    if (!state.selectedPersona) return null;

    const { selectedPersona } = state;
    
    return {
      persona: selectedPersona.label.toLowerCase(),
      tone: selectedPersona.description,
      traits: selectedPersona.traits,
      energy: selectedPersona.energy,
      glyph: selectedPersona.glyph,
      colorScheme: selectedPersona.color,
      // Additional context for AI generation
      promptModifiers: {
        style: `${selectedPersona.label.toLowerCase()} and ${selectedPersona.traits.join(', ')}`,
        mood: selectedPersona.description,
        intensity: Math.floor(selectedPersona.energy / 10) // 0-10 scale
      }
    };
  }, [state.selectedPersona]);

  // Get recommended personas based on current context
  const getRecommendedPersonas = useCallback((context?: string) => {
    const { personas } = state;
    
    if (!context) {
      // Return high-energy personas by default
      return personas.filter(p => p.energy >= 85).slice(0, 3);
    }

    // Simple keyword-based recommendations
    const contextLower = context.toLowerCase();
    const scored = personas.map(persona => {
      let score = 0;
      
      // Check if context matches traits
      persona.traits.forEach(trait => {
        if (contextLower.includes(trait)) score += 2;
      });
      
      // Check if context matches description
      if (persona.description.toLowerCase().includes(contextLower)) score += 1;
      
      // Check if context matches label
      if (contextLower.includes(persona.label.toLowerCase())) score += 3;
      
      return { persona, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.persona);
  }, [state.personas]);

  return {
    ...state,
    selectPersona,
    selectPersonaById,
    getPersonaById,
    getCreativeContext,
    getRecommendedPersonas,
    loadPersonas,
    // Computed values
    hasSelection: state.selectedPersona !== null,
    personaCount: state.personas.length,
    availableTraits: [...new Set(state.personas.flatMap(p => p.traits))],
    averageEnergy: state.personas.length > 0 
      ? Math.round(state.personas.reduce((sum, p) => sum + p.energy, 0) / state.personas.length)
      : 0
  };
}