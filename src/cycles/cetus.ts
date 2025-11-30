/**
 * Cetus (Plains of Eidolon) cycle calculator
 * 
 * Cycle pattern:
 * - Total: 150 minutes (2h 30m)
 * - Day: 100 minutes
 * - Night: 50 minutes
 * 
 * Epoch: January 1, 2018, 00:00 UTC
 */

import { CycleInfo, CycleConfig } from '../types/index.js';
import { calculateCycle } from './calculator.js';

// ============================================================================
// CETUS CONFIGURATION
// ============================================================================

/**
 * Cetus cycle configuration
 * Based on Warframe's official cycle timings
 */
const CETUS_CONFIG: CycleConfig = {
  // Epoch: When the cycle pattern started
  // January 1, 2018, 00:00:00 UTC (Plains of Eidolon release)
  epoch: 1514764800,
  
  // Total cycle length: 150 minutes = 9000 seconds
  totalLength: 9000,
  
  // State definitions
  states: [
    {
      name: 'day',
      start: 0,        // Day starts at the beginning
      end: 6000,       // Day ends at 100 minutes (6000 seconds)
    },
    {
      name: 'night',
      start: 6000,     // Night starts at 100 minutes
      end: 9000,       // Night ends at 150 minutes (cycle repeats)
    },
  ],
};

// ============================================================================
// CALCULATION FUNCTION
// ============================================================================

/**
 * Calculate current Cetus cycle
 * 
 * @param now - Current Unix timestamp in seconds (default: current time)
 * @returns Complete cycle information for Cetus
 */
export function calculateCetusCycle(now: number = Math.floor(Date.now() / 1000)): CycleInfo {
  // Use the common calculator with Cetus configuration
  const cycleData = calculateCycle(CETUS_CONFIG, now);
  
  // Return with world identifier
  return {
    world: 'cetus',
    ...cycleData,
  };
}

// ============================================================================
// DESCRIPTION HELPERS
// ============================================================================

/**
 * Get French description for current Cetus state
 */
export function getCetusDescription(state: 'day' | 'night'): string {
  if (state === 'day') {
    return 'C\'est le jour dans les Plaines. Période idéale pour farmer les ressources.';
  } else {
    return 'C\'est la nuit ! Les Eidolons sont actifs. Temps de chasse aux Téralysts !';
  }
}

/**
 * Get detailed info for Cetus embed
 */
export function getCetusDetails(state: 'day' | 'night'): {
  title: string;
  activities: string[];
} {
  if (state === 'day') {
    return {
      title: 'Activités diurnes',
      activities: [
        '⚒️ Farm de ressources optimisé',
        '🎯 Missions de prime Konzu',
        '🐟 Pêche dans les lacs',
      ],
    };
  } else {
    return {
      title: 'Activités nocturnes',
      activities: [
        '👻 Chasse aux Eidolons (Téralyst, Gantulyst, Hydrolyst)',
        '💎 Farm de Sentient cores',
        '🌟 Récolte de Wisps (plus fréquents la nuit)',
      ],
    };
  }
}

