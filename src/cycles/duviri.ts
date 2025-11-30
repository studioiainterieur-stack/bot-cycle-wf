/**
 * Duviri (Spiral) emotion cycle calculator
 * 
 * Cycle pattern:
 * - Total: 240 minutes (4h) - rotation of 5 emotions
 * - Each emotion: 48 minutes
 * - Order: Joy → Anger → Envy → Sorrow → Fear (repeats)
 * 
 * Epoch: May 10, 2023, 00:00 UTC (Duviri Paradox release)
 */

import { CycleInfo, CycleConfig } from '../types/index.js';
import { calculateCycle } from './calculator.js';

// ============================================================================
// DUVIRI CONFIGURATION
// ============================================================================

/**
 * Duviri emotion cycle configuration
 * 5 emotions rotate every 48 minutes each
 */
const DUVIRI_CONFIG: CycleConfig = {
  // Epoch: When Duviri was released
  // May 10, 2023, 00:00:00 UTC (Duviri Paradox update)
  epoch: 1683676800,
  
  // Total cycle length: 240 minutes = 14400 seconds (4 hours for all 5 emotions)
  totalLength: 14400,
  
  // State definitions - 5 emotions
  // Each emotion lasts 48 minutes = 2880 seconds
  states: [
    {
      name: 'joy',
      start: 0,        // Joy: 0-48 minutes
      end: 2880,
    },
    {
      name: 'anger',
      start: 2880,     // Anger: 48-96 minutes
      end: 5760,
    },
    {
      name: 'envy',
      start: 5760,     // Envy: 96-144 minutes
      end: 8640,
    },
    {
      name: 'sorrow',
      start: 8640,     // Sorrow: 144-192 minutes
      end: 11520,
    },
    {
      name: 'fear',
      start: 11520,    // Fear: 192-240 minutes
      end: 14400,
    },
  ],
};

// ============================================================================
// CALCULATION FUNCTION
// ============================================================================

/**
 * Calculate current Duviri emotion cycle
 * 
 * @param now - Current Unix timestamp in seconds (default: current time)
 * @returns Complete cycle information for Duviri
 */
export function calculateDuviriCycle(now: number = Math.floor(Date.now() / 1000)): CycleInfo {
  // Use the common calculator with Duviri configuration
  const cycleData = calculateCycle(DUVIRI_CONFIG, now);
  
  // Return with world identifier
  return {
    world: 'duviri',
    ...cycleData,
  };
}

// ============================================================================
// DESCRIPTION HELPERS
// ============================================================================

/**
 * Get French description for current Duviri emotion
 */
export function getDuviriDescription(
  emotion: 'joy' | 'anger' | 'envy' | 'sorrow' | 'fear'
): string {
  const descriptions = {
    joy: 'Émotion Joie active ! Le Drifter est joyeux. Missions et décrets spécifiques disponibles.',
    anger: 'Émotion Colère active ! Le Drifter est en colère. Combat et défis intensifiés.',
    envy: 'Émotion Envie active ! Le Drifter envie. Récompenses spéciales disponibles.',
    sorrow: 'Émotion Chagrin active ! Le Drifter est triste. Missions contemplatives disponibles.',
    fear: 'Émotion Peur active ! Le Drifter a peur. Défis d\'horreur et survie disponibles.',
  };
  
  return descriptions[emotion];
}

/**
 * Get detailed info for Duviri embed
 */
export function getDuviriDetails(
  emotion: 'joy' | 'anger' | 'envy' | 'sorrow' | 'fear'
): {
  title: string;
  activities: string[];
} {
  const details = {
    joy: {
      title: 'Joie (Joy)',
      activities: [
        '💛 Décrets de joie actifs',
        '🎪 Événements festifs',
        '🎁 Bonus de récompenses sociales',
      ],
    },
    anger: {
      title: 'Colère (Anger)',
      activities: [
        '❤️ Décrets de combat intensifiés',
        '⚔️ Défis d\'arène disponibles',
        '🔥 Bonus de dégâts en combat',
      ],
    },
    envy: {
      title: 'Envie (Envy)',
      activities: [
        '💚 Décrets d\'acquisition',
        '💎 Récompenses rares augmentées',
        '🎯 Missions de collection optimales',
      ],
    },
    sorrow: {
      title: 'Chagrin (Sorrow)',
      activities: [
        '💙 Décrets contemplatifs',
        '🌊 Missions narratives disponibles',
        '📖 Lore et histoire développés',
      ],
    },
    fear: {
      title: 'Peur (Fear)',
      activities: [
        '💜 Décrets de survie',
        '👻 Défis d\'horreur actifs',
        '🌑 Ennemis plus dangereux',
      ],
    },
  };
  
  return details[emotion];
}

/**
 * Get the full emotion rotation timeline
 * Useful for showing upcoming emotions
 */
export function getEmotionTimeline(currentEmotion: string, timeRemaining: number): {
  current: string;
  upcoming: Array<{ emotion: string; startsIn: number }>;
} {
  const emotions = ['joy', 'anger', 'envy', 'sorrow', 'fear'];
  const emotionDuration = 2880; // 48 minutes in seconds
  
  const currentIndex = emotions.indexOf(currentEmotion);
  const upcoming = [];
  
  // Generate next 4 emotions
  for (let i = 1; i <= 4; i++) {
    const nextIndex = (currentIndex + i) % emotions.length;
    const startsIn = timeRemaining + (i - 1) * emotionDuration;
    upcoming.push({
      emotion: emotions[nextIndex],
      startsIn,
    });
  }
  
  return {
    current: currentEmotion,
    upcoming,
  };
}

