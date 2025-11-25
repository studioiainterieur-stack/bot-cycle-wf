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
    
    // Get current time from API
    const currentTime = data.daynight.time;
    
    // Process each cycle in the daynight data
    for (const cycleData of data.daynight.data) {
      const cycleInfo = parseTennoToolsCycle(cycleData, currentTime);
      if (cycleInfo) {
        cycles.push(cycleInfo);
      }
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
 * Get short description for location and state
 * Used in Discord embeds
 */
function getShortDescription(location: LocationType, isDay: boolean): string {
  const descriptions: Record<LocationType, { day: string; night: string }> = {
    cetus: {
      day: 'Day time in the Plains',
      night: 'Night time - Eidolons active!',
    },
    vallis: {
      day: 'Warm cycle in Orb Vallis',
      night: 'Cold cycle in Orb Vallis',
    },
    cambion: {
      day: 'Fass cycle - Wyrm tokens',
      night: 'Vome cycle - Fass tokens',
    },
    earth: {
      day: 'Day time on Earth',
      night: 'Night time on Earth',
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
