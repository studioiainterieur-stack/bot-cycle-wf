/**
 * Warframe API service
 * Fetches cycle data from WarframeStat API for all locations
 */

import { CycleInfo, LocationType, WarframeStatCycle } from '../types/index.js';
import { WARFRAMESTAT_API } from '../config.js';

/**
 * Fetch all cycle data from WarframeStat API
 * Returns cycle information for Cetus, Vallis, Cambion, and Earth
 */
export async function fetchAllCycles(): Promise<CycleInfo[]> {
  try {
    // Fetch data from WarframeStat API with proper headers
    const response = await fetch(WARFRAMESTAT_API, {
      headers: {
        'User-Agent': 'Warframe-Cycle-Bot/1.0 (Discord Bot)',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Parse each location's cycle data
    const cycles: CycleInfo[] = [];
    
    // Cetus (Plains of Eidolon) - uses cetusCycle
    if (data.cetusCycle) {
      cycles.push(parseCetusCycle(data.cetusCycle));
    }
    
    // Vallis (Orb Vallis) - uses vallisCycle
    if (data.vallisCycle) {
      cycles.push(parseVallisCycle(data.vallisCycle));
    }
    
    // Cambion Drift (Deimos) - uses cambionCycle
    if (data.cambionCycle) {
      cycles.push(parseCambionCycle(data.cambionCycle));
    }
    
    // Earth - uses earthCycle
    if (data.earthCycle) {
      cycles.push(parseEarthCycle(data.earthCycle));
    }
    
    return cycles;
  } catch (error) {
    console.error('Error fetching Warframe cycles:', error);
    throw error;
  }
}

/**
 * Parse Cetus cycle data
 * Cetus has simple day/night cycles
 */
function parseCetusCycle(data: WarframeStatCycle): CycleInfo {
  const isDay = data.isDay ?? false;
  
  return {
    id: 'cetus',
    state: isDay ? 'day' : 'night',
    timeLeft: data.timeLeft || 'Unknown',
    expiry: new Date(data.expiry),
    shortDesc: isDay ? 'Day time in the Plains' : 'Night time - Eidolons active!',
  };
}

/**
 * Parse Vallis (Orb Vallis) cycle data
 * Vallis has warm/cold cycles (we map warm=day, cold=night)
 */
function parseVallisCycle(data: WarframeStatCycle): CycleInfo {
  const state = data.state?.toLowerCase() || '';
  const isWarm = state === 'warm';
  
  return {
    id: 'vallis',
    state: isWarm ? 'day' : 'night',
    timeLeft: data.timeLeft || 'Unknown',
    expiry: new Date(data.expiry),
    shortDesc: isWarm ? 'Warm cycle in Orb Vallis' : 'Cold cycle in Orb Vallis',
  };
}

/**
 * Parse Cambion Drift cycle data
 * Cambion has fass/vome cycles (we map fass=day, vome=night)
 */
function parseCambionCycle(data: WarframeStatCycle): CycleInfo {
  const state = data.state?.toLowerCase() || '';
  const isFass = state === 'fass';
  
  return {
    id: 'cambion',
    state: isFass ? 'day' : 'night',
    timeLeft: data.timeLeft || 'Unknown',
    expiry: new Date(data.expiry),
    shortDesc: isFass ? 'Fass cycle - Wyrm tokens' : 'Vome cycle - Fass tokens',
  };
}

/**
 * Parse Earth cycle data
 * Earth has standard day/night cycles
 */
function parseEarthCycle(data: WarframeStatCycle): CycleInfo {
  const isDay = data.isDay ?? false;
  
  return {
    id: 'earth',
    state: isDay ? 'day' : 'night',
    timeLeft: data.timeLeft || 'Unknown',
    expiry: new Date(data.expiry),
    shortDesc: isDay ? 'Day time on Earth' : 'Night time on Earth',
  };
}

/**
 * Fetch cycle data for a specific location
 */
export async function fetchCycleForLocation(location: LocationType): Promise<CycleInfo | null> {
  const cycles = await fetchAllCycles();
  return cycles.find(c => c.id === location) || null;
}

