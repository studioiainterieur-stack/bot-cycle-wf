/**
 * Discord embed builders for each world
 * Creates beautiful, color-coded embeds with cycle information
 */

import {
  CycleInfo,
  EMBED_COLORS,
  WORLD_NAMES,
  WORLD_EMOJIS,
  STATE_NAMES,
  STATE_EMOJIS,
} from '../types/index.js';
import {
  formatTimeRemaining,
  formatTimestamp,
  createProgressBar,
} from '../cycles/calculator.js';
import {
  getCetusDescription,
  getCetusDetails,
  getVallisDescription,
  getVallisDetails,
  getCambionDescription,
  getCambionDetails,
  getEarthDescription,
  getEarthDetails,
  getDuviriDescription,
  getDuviriDetails,
  getEmotionTimeline,
} from '../cycles/index.js';

// ============================================================================
// EMBED INTERFACE
// ============================================================================

/**
 * Discord embed structure
 */
export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
  };
  timestamp?: string;
}

// ============================================================================
// CETUS EMBED
// ============================================================================

/**
 * Build embed for Cetus (Plains of Eidolon)
 */
export function buildCetusEmbed(cycle: CycleInfo): DiscordEmbed {
  const state = cycle.state as 'day' | 'night';
  const details = getCetusDetails(state);
  
  return {
    title: `${WORLD_EMOJIS.cetus} ${WORLD_NAMES.cetus}`,
    description: getCetusDescription(state),
    color: EMBED_COLORS[state],
    fields: [
      {
        name: 'État actuel',
        value: `${STATE_EMOJIS[state]} **${STATE_NAMES[state]}**`,
        inline: true,
      },
      {
        name: '⏰ Temps restant',
        value: `**${formatTimeRemaining(cycle.timeRemaining)}**`,
        inline: true,
      },
      {
        name: '\u200B', // Empty field for spacing
        value: '\u200B',
        inline: true,
      },
      {
        name: details.title,
        value: details.activities.join('\n'),
        inline: false,
      },
      {
        name: '📊 Progression du cycle',
        value: createProgressBar(cycle.cycleProgress),
        inline: false,
      },
      {
        name: '🕐 Prochaine transition',
        value: `${STATE_EMOJIS[cycle.nextState]} **${STATE_NAMES[cycle.nextState]}** à ${formatTimestamp(cycle.nextTransition)}`,
        inline: false,
      },
    ],
    footer: {
      text: 'Cycle complet : 2h30 (100m jour / 50m nuit) • Mise à jour automatique',
    },
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// VALLIS EMBED
// ============================================================================

/**
 * Build embed for Fortuna (Orb Vallis)
 */
export function buildVallisEmbed(cycle: CycleInfo): DiscordEmbed {
  const state = cycle.state as 'warm' | 'cold';
  const details = getVallisDetails(state);
  
  return {
    title: `${WORLD_EMOJIS.vallis} ${WORLD_NAMES.vallis}`,
    description: getVallisDescription(state),
    color: EMBED_COLORS[state],
    fields: [
      {
        name: 'État actuel',
        value: `${STATE_EMOJIS[state]} **${STATE_NAMES[state]}**`,
        inline: true,
      },
      {
        name: '⏰ Temps restant',
        value: `**${formatTimeRemaining(cycle.timeRemaining)}**`,
        inline: true,
      },
      {
        name: '\u200B',
        value: '\u200B',
        inline: true,
      },
      {
        name: details.title,
        value: details.activities.join('\n'),
        inline: false,
      },
      {
        name: '📊 Progression du cycle',
        value: createProgressBar(cycle.cycleProgress),
        inline: false,
      },
      {
        name: '🕐 Prochaine transition',
        value: `${STATE_EMOJIS[cycle.nextState]} **${STATE_NAMES[cycle.nextState]}** à ${formatTimestamp(cycle.nextTransition)}`,
        inline: false,
      },
    ],
    footer: {
      text: 'Cycle complet : 2h40 (106m chaud / 53m froid) • Mise à jour automatique',
    },
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// CAMBION EMBED
// ============================================================================

/**
 * Build embed for Deimos (Cambion Drift)
 */
export function buildCambionEmbed(cycle: CycleInfo): DiscordEmbed {
  const state = cycle.state as 'fass' | 'vome';
  const details = getCambionDetails(state);
  
  return {
    title: `${WORLD_EMOJIS.cambion} ${WORLD_NAMES.cambion}`,
    description: getCambionDescription(state),
    color: EMBED_COLORS[state],
    fields: [
      {
        name: 'État actuel',
        value: `${STATE_EMOJIS[state]} **${STATE_NAMES[state]}**`,
        inline: true,
      },
      {
        name: '⏰ Temps restant',
        value: `**${formatTimeRemaining(cycle.timeRemaining)}**`,
        inline: true,
      },
      {
        name: '\u200B',
        value: '\u200B',
        inline: true,
      },
      {
        name: details.title,
        value: details.activities.join('\n'),
        inline: false,
      },
      {
        name: '📊 Progression du cycle',
        value: createProgressBar(cycle.cycleProgress),
        inline: false,
      },
      {
        name: '🕐 Prochaine transition',
        value: `${STATE_EMOJIS[cycle.nextState]} **${STATE_NAMES[cycle.nextState]}** à ${formatTimestamp(cycle.nextTransition)}`,
        inline: false,
      },
    ],
    footer: {
      text: 'Cycle complet : 2h30 (50m Vome / 100m Fass) • Mise à jour automatique',
    },
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// EARTH EMBED
// ============================================================================

/**
 * Build embed for Earth
 */
export function buildEarthEmbed(cycle: CycleInfo): DiscordEmbed {
  const state = cycle.state as 'day' | 'night';
  const details = getEarthDetails(state);
  
  return {
    title: `${WORLD_EMOJIS.earth} ${WORLD_NAMES.earth}`,
    description: getEarthDescription(state),
    color: EMBED_COLORS[state],
    fields: [
      {
        name: 'État actuel',
        value: `${STATE_EMOJIS[state]} **${STATE_NAMES[state]}**`,
        inline: true,
      },
      {
        name: '⏰ Temps restant',
        value: `**${formatTimeRemaining(cycle.timeRemaining)}**`,
        inline: true,
      },
      {
        name: '\u200B',
        value: '\u200B',
        inline: true,
      },
      {
        name: details.title,
        value: details.activities.join('\n'),
        inline: false,
      },
      {
        name: '📊 Progression du cycle',
        value: createProgressBar(cycle.cycleProgress),
        inline: false,
      },
      {
        name: '🕐 Prochaine transition',
        value: `${STATE_EMOJIS[cycle.nextState]} **${STATE_NAMES[cycle.nextState]}** à ${formatTimestamp(cycle.nextTransition)}`,
        inline: false,
      },
    ],
    footer: {
      text: 'Cycle complet : 4h (120m jour / 120m nuit) • Mise à jour automatique',
    },
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// DUVIRI EMBED
// ============================================================================

/**
 * Build embed for Duviri (Spiral)
 */
export function buildDuviriEmbed(cycle: CycleInfo): DiscordEmbed {
  const emotion = cycle.state as 'joy' | 'anger' | 'envy' | 'sorrow' | 'fear';
  const details = getDuviriDetails(emotion);
  const timeline = getEmotionTimeline(emotion, cycle.timeRemaining);
  
  // Build upcoming emotions display
  const upcomingText = timeline.upcoming
    .slice(0, 2) // Show next 2 emotions
    .map(({ emotion: em, startsIn }) => {
      const emotionState = em as 'joy' | 'anger' | 'envy' | 'sorrow' | 'fear';
      return `⏳ ${STATE_EMOJIS[emotionState]} **${STATE_NAMES[emotionState]}** dans ${formatTimeRemaining(startsIn)}`;
    })
    .join('\n');
  
  return {
    title: `${WORLD_EMOJIS.duviri} ${WORLD_NAMES.duviri}`,
    description: getDuviriDescription(emotion),
    color: EMBED_COLORS[emotion],
    fields: [
      {
        name: 'Émotion actuelle',
        value: `${STATE_EMOJIS[emotion]} **${STATE_NAMES[emotion]}**`,
        inline: true,
      },
      {
        name: '⏰ Temps restant',
        value: `**${formatTimeRemaining(cycle.timeRemaining)}**`,
        inline: true,
      },
      {
        name: '\u200B',
        value: '\u200B',
        inline: true,
      },
      {
        name: details.title,
        value: details.activities.join('\n'),
        inline: false,
      },
      {
        name: '📊 Progression',
        value: createProgressBar(cycle.cycleProgress),
        inline: false,
      },
      {
        name: '🔮 Prochaines émotions',
        value: upcomingText,
        inline: false,
      },
    ],
    footer: {
      text: 'Cycle complet : 4h (48min par émotion × 5) • Mise à jour automatique',
    },
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// UNIVERSAL EMBED BUILDER
// ============================================================================

/**
 * Build the appropriate embed for any world
 * Universal function that routes to the correct builder
 */
export function buildEmbedForWorld(cycle: CycleInfo): DiscordEmbed {
  switch (cycle.world) {
    case 'cetus':
      return buildCetusEmbed(cycle);
    case 'vallis':
      return buildVallisEmbed(cycle);
    case 'cambion':
      return buildCambionEmbed(cycle);
    case 'earth':
      return buildEarthEmbed(cycle);
    case 'duviri':
      return buildDuviriEmbed(cycle);
    default:
      throw new Error(`Unknown world: ${cycle.world}`);
  }
}

