/**
 * Type definitions for Warframe cycle tracking
 * Using mathematical calculations instead of external API
 */

// ============================================================================
// CYCLE TYPES
// ============================================================================

// Possible cycle states for each world
export type CycleState = 'day' | 'night' | 'warm' | 'cold' | 'fass' | 'vome' | 
                         'joy' | 'anger' | 'envy' | 'sorrow' | 'fear';

// World identifiers
export type WorldType = 'cetus' | 'vallis' | 'cambion' | 'earth' | 'duviri';

// ============================================================================
// CYCLE INFORMATION
// ============================================================================

/**
 * Complete cycle information for a specific world
 * Calculated mathematically based on epoch and cycle patterns
 */
export interface CycleInfo {
  world: WorldType;           // Which world this cycle is for
  state: CycleState;          // Current state (day/night/etc)
  timeRemaining: number;      // Seconds until next transition
  nextTransition: number;     // Unix timestamp of next transition
  nextState: CycleState;      // What state comes next
  cycleProgress: number;      // Percentage of current cycle completed (0-100)
}

// ============================================================================
// CYCLE CONFIGURATION
// ============================================================================

/**
 * Configuration for calculating cycles mathematically
 * Each world has an epoch (starting point) and cycle pattern
 */
export interface CycleConfig {
  epoch: number;              // Unix timestamp when cycle pattern started
  totalLength: number;        // Total cycle length in seconds
  states: {
    name: CycleState;         // State name
    start: number;            // Seconds into cycle when this state starts
    end: number;              // Seconds into cycle when this state ends
  }[];
}

// ============================================================================
// STORED STATES
// ============================================================================

/**
 * Stored state for a world to detect changes
 * Saved between GitHub Actions runs
 */
export interface StoredWorldState {
  world: WorldType;
  state: CycleState;
  lastCheck: number;          // Unix timestamp of last check
  lastTransition: number;     // Unix timestamp of last state change
}

/**
 * Complete stored state for all worlds
 * Persisted in states/cycle-states.json
 */
export interface StoredStates {
  cetus?: StoredWorldState;
  vallis?: StoredWorldState;
  cambion?: StoredWorldState;
  earth?: StoredWorldState;
  duviri?: StoredWorldState;
  lastUpdate: number;         // Unix timestamp of last update
}

// ============================================================================
// DISCORD CONFIGURATION
// ============================================================================

/**
 * Discord message IDs for each world
 * These are the pinned messages that get edited
 */
export interface MessageIds {
  channelId: string;
  messages: {
    cetus: string;
    vallis: string;
    cambion: string;
    earth: string;
    duviri: string;
  };
}

// ============================================================================
// EMBED COLORS
// ============================================================================

/**
 * Discord embed colors for each state
 * Hexadecimal color codes
 */
export const EMBED_COLORS: Record<CycleState, number> = {
  // Cetus
  day: 0xFFD700,       // Gold - jour
  night: 0x191970,     // Midnight blue - nuit
  
  // Vallis
  warm: 0xFF8C00,      // Dark orange - chaud
  cold: 0x00CED1,      // Dark turquoise - froid
  
  // Cambion
  fass: 0xFF4500,      // Orange red - Fass
  vome: 0x8B00FF,      // Violet - Vome
  
  // Duviri emotions
  joy: 0xFFD700,       // Gold - Joie
  anger: 0xFF0000,     // Red - Colère
  envy: 0x00FF00,      // Green - Envie
  sorrow: 0x4169E1,    // Royal blue - Chagrin
  fear: 0x800080,      // Purple - Peur
};

// ============================================================================
// DISPLAY NAMES
// ============================================================================

/**
 * French display names for worlds
 */
export const WORLD_NAMES: Record<WorldType, string> = {
  cetus: 'CETUS - PLAINES D\'EIDOLON',
  vallis: 'FORTUNA - VALLÉE D\'ORB',
  cambion: 'DEIMOS - PUITS DE CAMBION',
  earth: 'TERRE - EARTH',
  duviri: 'DUVIRI - SPIRAL',
};

/**
 * Emojis for each world
 */
export const WORLD_EMOJIS: Record<WorldType, string> = {
  cetus: '🌅',
  vallis: '🏔️',
  cambion: '🦠',
  earth: '🌍',
  duviri: '🎭',
};

/**
 * French display names for states
 */
export const STATE_NAMES: Record<CycleState, string> = {
  // Cetus
  day: 'JOUR',
  night: 'NUIT',
  
  // Vallis
  warm: 'CHAUD',
  cold: 'FROID',
  
  // Cambion
  fass: 'FASS',
  vome: 'VOME',
  
  // Duviri
  joy: 'JOIE',
  anger: 'COLÈRE',
  envy: 'ENVIE',
  sorrow: 'CHAGRIN',
  fear: 'PEUR',
};

/**
 * Emojis for each state
 */
export const STATE_EMOJIS: Record<CycleState, string> = {
  // Cetus
  day: '☀️',
  night: '🌙',
  
  // Vallis
  warm: '🔥',
  cold: '❄️',
  
  // Cambion
  fass: '🔴',
  vome: '🔵',
  
  // Duviri
  joy: '💛',
  anger: '❤️',
  envy: '💚',
  sorrow: '💙',
  fear: '💜',
};
