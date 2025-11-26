/**
 * Warframe API service
 * Fetches cycle data from Tenno Tools API for all locations
 * (Previously used WarframeStat API, but it's no longer available)
 */

import { CycleInfo, LocationType, TennoToolsCycle, TennoToolsResponse } from '../types/index.js';
import { WARFRAMESTAT_API } from '../config.js';

/**
 * Fetch all cycle data from Tenno Tools API
 * Returns cycle information for Cetus, Vallis (Fortuna), and Earth
 */
export async function fetchAllCycles(): Promise<CycleInfo[]> {
  try {
    // Fetch data from Tenno Tools API with proper headers
    const response = await fetch(WARFRAMESTAT_API, {
      headers: {
        'User-Agent': 'Warframe-Cycle-Bot/1.0 (Discord Bot)',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data: TennoToolsResponse = await response.json();
    
    // Parse each location's cycle data
    const cycles: CycleInfo[] = [];
    
    // Use system time instead of API time (API time is cached and unreliable)
    // API returns timestamps in seconds, so we convert Date.now() to seconds
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Process each cycle in the daynight data
    for (const cycleData of data.daynight.data) {
      const cycleInfo = parseTennoToolsCycle(cycleData, currentTime);
      if (cycleInfo) {
        cycles.push(cycleInfo);
      }
    }
    
    // Add Cambion Drift (Deimos) cycle manually
    // API doesn't provide this, so we use hardcoded cycle parameters
    // Cycle identique à Cetus : 150 min total (100 min Fass / 50 min Vome)
    const cambionCycle: TennoToolsCycle = {
      id: 'cambion',
      start: 1598908800,  // 1 septembre 2020 00:00 UTC (lancement de Deimos)
      length: 9000,        // 150 minutes (2h30) en secondes
      dayStart: 3000,      // Fass commence à 50 minutes (après Vome)
      dayEnd: 9000,        // Fass termine à 150 minutes (durée : 100 min)
    };
    
    const cambionInfo = parseTennoToolsCycle(cambionCycle, currentTime);
    if (cambionInfo) {
      cycles.push(cambionInfo);
    }
    
    return cycles;
  } catch (error) {
    console.error('Error fetching Warframe cycles:', error);
    throw error;
  }
}

/**
 * Parse Tenno Tools cycle data
 * Calculates current state (day/night) and time remaining based on cycle patterns
 */
function parseTennoToolsCycle(data: TennoToolsCycle, currentTime: number): CycleInfo | null {
  // Map Tenno Tools IDs to our location types
  const locationMap: Record<string, LocationType> = {
    'cetus': 'cetus',
    'fortuna': 'vallis',
    'earth': 'earth',
    'cambion': 'cambion',
  };
  
  const locationId = locationMap[data.id];
  if (!locationId) {
    console.warn(`Unknown location ID: ${data.id}`);
    return null;
  }
  
  // Calculate current position in the cycle
  const elapsedSinceStart = currentTime - data.start;
  const positionInCycle = elapsedSinceStart % data.length;
  
  // Determine if it's day or night based on position in cycle
  const isDay = positionInCycle >= data.dayStart && positionInCycle < data.dayEnd;
  
  // Calculate time until next transition
  let timeUntilTransition: number;
  let nextIsDay: boolean;
  
  if (isDay) {
    // Currently day, calculate time until night
    timeUntilTransition = data.dayEnd - positionInCycle;
    nextIsDay = false;
  } else if (positionInCycle < data.dayStart) {
    // Currently night (before day starts)
    timeUntilTransition = data.dayStart - positionInCycle;
    nextIsDay = true;
  } else {
    // Currently night (after day ends)
    timeUntilTransition = data.length - positionInCycle + data.dayStart;
    nextIsDay = true;
  }
  
  // Convert seconds to human-readable format
  const timeLeft = formatTimeLeft(timeUntilTransition);
  
  // Calculate expiry timestamp
  const expiryTimestamp = currentTime + timeUntilTransition;
  const expiry = new Date(expiryTimestamp * 1000); // Convert to milliseconds
  
  // Create short description based on location and state
  const shortDesc = getShortDescription(locationId, isDay);
  
  return {
    id: locationId,
    state: isDay ? 'day' : 'night',
    timeLeft,
    expiry,
    shortDesc,
  };
}

/**
 * Format time in seconds to human-readable string
 * Examples: "2h 30m", "45m", "30s"
 */
function formatTimeLeft(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

/**
 * Obtenir une courte description pour un lieu et son état
 * Utilisé dans les embeds Discord
 */
function getShortDescription(location: LocationType, isDay: boolean): string {
  const descriptions: Record<LocationType, { day: string; night: string }> = {
    cetus: {
      day: 'C\'est le jour dans les Plaines',
      night: 'C\'est la nuit - Les Eidolons sont actifs !',
    },
    vallis: {
      day: 'Cycle chaud dans Orb Vallis',
      night: 'Cycle froid dans Orb Vallis',
    },
    cambion: {
      day: 'Cycle Fass - Jetons Wyrm disponibles',
      night: 'Cycle Vome - Jetons Fass disponibles',
    },
    earth: {
      day: 'C\'est le jour sur Terre',
      night: 'C\'est la nuit sur Terre',
    },
  };
  
  return isDay ? descriptions[location].day : descriptions[location].night;
}

/**
 * Fetch cycle data for a specific location
 */
export async function fetchCycleForLocation(location: LocationType): Promise<CycleInfo | null> {
  const cycles = await fetchAllCycles();
  return cycles.find(c => c.id === location) || null;
}
