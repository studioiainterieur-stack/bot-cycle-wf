/**
 * Fortuna (Orb Vallis) cycle calculator
 * 
 * Cycle pattern:
 * - Total: 160 minutes (2h 40m)
 * - Warm: 106 minutes 40 seconds
 * - Cold: 53 minutes 20 seconds
 * 
 * Epoch: November 1, 2018, 00:00 UTC
 */

import { CycleInfo, CycleConfig } from '../types/index.js';
import { calculateCycle } from './calculator.js';

// ============================================================================
// VALLIS CONFIGURATION
// ============================================================================

/**
 * Orb Vallis cycle configuration
 * Based on Warframe's official cycle timings
 */
const VALLIS_CONFIG: CycleConfig = {
  // Epoch: When the cycle pattern started
  // November 1, 2018, 00:00:00 UTC (Fortuna release)
  epoch: 1541030400,
  
  // Total cycle length: 160 minutes = 9600 seconds
  totalLength: 9600,
  
  // State definitions
  states: [
    {
      name: 'warm',
      start: 0,        // Warm starts at the beginning
      end: 6400,       // Warm ends at 106m 40s (6400 seconds)
    },
    {
      name: 'cold',
      start: 6400,     // Cold starts at 106m 40s
      end: 9600,       // Cold ends at 160 minutes (cycle repeats)
    },
  ],
};

// ============================================================================
// CALCULATION FUNCTION
// ============================================================================

/**
 * Calculate current Orb Vallis cycle
 * 
 * @param now - Current Unix timestamp in seconds (default: current time)
 * @returns Complete cycle information for Vallis
 */
export function calculateVallisCycle(now: number = Math.floor(Date.now() / 1000)): CycleInfo {
  // Use the common calculator with Vallis configuration
  const cycleData = calculateCycle(VALLIS_CONFIG, now);
  
  // Return with world identifier
  return {
    world: 'vallis',
    ...cycleData,
  };
}

// ============================================================================
// DESCRIPTION HELPERS
// ============================================================================

/**
 * Get French description for current Vallis state
 */
export function getVallisDescription(state: 'warm' | 'cold'): string {
  if (state === 'warm') {
    return 'Cycle chaud dans la Vallée d\'Orb. Températures élevées.';
  } else {
    return 'Cycle froid dans la Vallée d\'Orb. Attention aux températures glaciales !';
  }
}

/**
 * Get detailed info for Vallis embed
 */
export function getVallisDetails(state: 'warm' | 'cold'): {
  title: string;
  activities: string[];
} {
  if (state === 'warm') {
    return {
      title: 'Cycle chaud',
      activities: [
        '🌡️ Pas de protection thermique nécessaire',
        '🎯 Primes de Eudico disponibles',
        '⛏️ Farm de minerais optimisé',
      ],
    };
  } else {
    return {
      title: 'Cycle froid',
      activities: [
        '❄️ Protection thermique recommandée',
        '🦎 Apparition accrue de Raknoids',
        '💎 Cristaux rares plus fréquents',
      ],
    };
  }
}

