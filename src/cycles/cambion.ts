/**
 * Deimos (Cambion Drift) cycle calculator
 * 
 * Cycle pattern:
 * - Total: 150 minutes (2h 30m)
 * - Fass: 100 minutes (Red - Wyrm tokens available)
 * - Vome: 50 minutes (Blue - Fass tokens available)
 * 
 * Epoch: September 1, 2020, 00:00 UTC
 */

import { CycleInfo, CycleConfig } from '../types/index.js';
import { calculateCycle } from './calculator.js';

// ============================================================================
// CAMBION CONFIGURATION
// ============================================================================

/**
 * Cambion Drift cycle configuration
 * Based on Warframe's official cycle timings
 */
const CAMBION_CONFIG: CycleConfig = {
  // Epoch: When the cycle pattern started
  // September 1, 2020, 00:00:00 UTC (Heart of Deimos release)
  epoch: 1598918400,
  
  // Total cycle length: 150 minutes = 9000 seconds
  // Same as Cetus but with Fass/Vome instead of Day/Night
  totalLength: 9000,
  
  // State definitions
  // Note: Pattern starts with Vome, then Fass
  states: [
    {
      name: 'vome',
      start: 0,        // Vome starts at the beginning
      end: 3000,       // Vome ends at 50 minutes (3000 seconds)
    },
    {
      name: 'fass',
      start: 3000,     // Fass starts at 50 minutes
      end: 9000,       // Fass ends at 150 minutes (cycle repeats)
    },
  ],
};

// ============================================================================
// CALCULATION FUNCTION
// ============================================================================

/**
 * Calculate current Cambion Drift cycle
 * 
 * @param now - Current Unix timestamp in seconds (default: current time)
 * @returns Complete cycle information for Cambion
 */
export function calculateCambionCycle(now: number = Math.floor(Date.now() / 1000)): CycleInfo {
  // Use the common calculator with Cambion configuration
  const cycleData = calculateCycle(CAMBION_CONFIG, now);
  
  // Return with world identifier
  return {
    world: 'cambion',
    ...cycleData,
  };
}

// ============================================================================
// DESCRIPTION HELPERS
// ============================================================================

/**
 * Get French description for current Cambion state
 */
export function getCambionDescription(state: 'fass' | 'vome'): string {
  if (state === 'fass') {
    return 'Cycle Fass actif ! Les jetons Wyrm sont disponibles pour les échanges Entrati.';
  } else {
    return 'Cycle Vome actif ! Les jetons Fass sont disponibles pour les échanges Entrati.';
  }
}

/**
 * Get detailed info for Cambion embed
 */
export function getCambionDetails(state: 'fass' | 'vome'): {
  title: string;
  activities: string[];
} {
  if (state === 'fass') {
    return {
      title: 'Cycle Fass (Rouge)',
      activities: [
        '🔴 Jetons Wyrm disponibles',
        '🦠 Récolte de ressources Fass',
        '💀 Necramech parts farming',
      ],
    };
  } else {
    return {
      title: 'Cycle Vome (Bleu)',
      activities: [
        '🔵 Jetons Fass disponibles',
        '🌿 Récolte de ressources Vome',
        '🎣 Pêche de poissons infestés optimale',
      ],
    };
  }
}

