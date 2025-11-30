/**
 * Earth cycle calculator
 * 
 * Cycle pattern:
 * - Total: 240 minutes (4h)
 * - Day: 120 minutes (2h)
 * - Night: 120 minutes (2h)
 * 
 * Epoch: Unix epoch (January 1, 1970)
 */

import { CycleInfo, CycleConfig } from '../types/index.js';
import { calculateCycle } from './calculator.js';

// ============================================================================
// EARTH CONFIGURATION
// ============================================================================

/**
 * Earth cycle configuration
 * Based on Warframe's official cycle timings
 */
const EARTH_CONFIG: CycleConfig = {
  // Epoch: Unix epoch start
  // Earth cycle has been in game since the beginning
  epoch: 0,
  
  // Total cycle length: 240 minutes = 14400 seconds (4 hours)
  totalLength: 14400,
  
  // State definitions
  states: [
    {
      name: 'day',
      start: 0,        // Day starts at the beginning
      end: 7200,       // Day ends at 120 minutes (7200 seconds)
    },
    {
      name: 'night',
      start: 7200,     // Night starts at 120 minutes
      end: 14400,      // Night ends at 240 minutes (cycle repeats)
    },
  ],
};

// ============================================================================
// CALCULATION FUNCTION
// ============================================================================

/**
 * Calculate current Earth cycle
 * 
 * @param now - Current Unix timestamp in seconds (default: current time)
 * @returns Complete cycle information for Earth
 */
export function calculateEarthCycle(now: number = Math.floor(Date.now() / 1000)): CycleInfo {
  // Use the common calculator with Earth configuration
  const cycleData = calculateCycle(EARTH_CONFIG, now);
  
  // Return with world identifier
  return {
    world: 'earth',
    ...cycleData,
  };
}

// ============================================================================
// DESCRIPTION HELPERS
// ============================================================================

/**
 * Get French description for current Earth state
 */
export function getEarthDescription(state: 'day' | 'night'): string {
  if (state === 'day') {
    return 'C\'est le jour sur Terre. Missions standard disponibles.';
  } else {
    return 'C\'est la nuit sur Terre. Certains ennemis et ressources sont différents.';
  }
}

/**
 * Get detailed info for Earth embed
 */
export function getEarthDetails(state: 'day' | 'night'): {
  title: string;
  activities: string[];
} {
  if (state === 'day') {
    return {
      title: 'Missions diurnes',
      activities: [
        '☀️ Missions standard disponibles',
        '🌱 Apothics farming',
        '🎯 Spy missions optimales',
      ],
    };
  } else {
    return {
      title: 'Missions nocturnes',
      activities: [
        '🌙 Apparition de différents ennemis',
        '🦇 Ressources nocturnes disponibles',
        '🌸 Farm de plantes lunaires',
      ],
    };
  }
}

