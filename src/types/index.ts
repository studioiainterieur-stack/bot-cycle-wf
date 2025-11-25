/**
 * Type definitions for Warframe cycle tracking
 */

// Cycle state for a location (day or night)
export type CycleState = 'day' | 'night';

// Warframe location identifier
export type LocationType = 'cetus' | 'vallis' | 'cambion' | 'earth';

// Cycle information for a specific location
export interface CycleInfo {
  id: LocationType;
  state: CycleState;
  timeLeft: string; // Human-readable time left (e.g., "2h 30m")
  expiry: Date; // When the current cycle ends
  shortDesc: string; // Short description for embeds
}

// Full cycle data from WarframeStat API (deprecated - API is down)
export interface WarframeStatCycle {
  id: string;
  expiry: string; // ISO date string
  activation?: string; // ISO date string
  isDay?: boolean; // For Cetus
  state?: string; // For Vallis/Cambion
  timeLeft?: string;
}

// Tenno Tools API cycle data structure
// This is the new API we use since WarframeStat is no longer available
export interface TennoToolsCycle {
  id: string; // 'cetus', 'fortuna', 'earth'
  start: number; // Unix timestamp when cycle pattern started
  length: number; // Total cycle length in seconds
  dayStart: number; // Seconds into cycle when day starts
  dayEnd: number; // Seconds into cycle when day ends
}

// Tenno Tools API response structure
export interface TennoToolsResponse {
  time: number; // Current Unix timestamp
  daynight: {
    time: number;
    data: TennoToolsCycle[];
  };
}

// Stored state for cycle tracking
export interface CycleStateI {
  location: LocationType;
  currentState: CycleState;
  lastCheck: string; // ISO date string
  expiry: string; // ISO date string
}

// All cycle states stored together
export interface StoredCycleStates {
  cetus?: CycleStateI;
  vallis?: CycleStateI;
  cambion?: CycleStateI;
  earth?: CycleStateI;
  lastUpdate: string; // ISO date string
}

// Discord embed color constants
export const EMBED_COLORS = {
  day: 0xFFD700, // Gold for day
  night: 0x191970, // Midnight blue for night
  info: 0x5865F2, // Discord blue for info
} as const;

// Noms d'affichage des lieux
export const LOCATION_NAMES: Record<LocationType, string> = {
  cetus: 'Cetus (Plaines d\'Eidolon)',
  vallis: 'Fortuna (Orb Vallis)',
  cambion: 'Deimos (Dérive de Cambion)',
  earth: 'Terre',
};

// Location emojis for Discord embeds
export const LOCATION_EMOJIS: Record<LocationType, string> = {
  cetus: '🌅',
  vallis: '❄️',
  cambion: '🦠',
  earth: '🌍',
};

