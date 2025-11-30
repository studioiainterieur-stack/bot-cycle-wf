/**
 * State management for cycle tracking
 * Persists cycle states between GitHub Actions runs
 */

import fs from 'fs/promises';
import path from 'path';
import { StoredStates, StoredWorldState, WorldType, CycleState } from '../types/index.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Path to the state file
const STATE_FILE_PATH = path.join(process.cwd(), 'states', 'cycle-states.json');

// ============================================================================
// STATE LOADING
// ============================================================================

/**
 * Load stored states from file
 * Returns empty state if file doesn't exist
 */
export async function loadStates(): Promise<StoredStates> {
  try {
    const fileContent = await fs.readFile(STATE_FILE_PATH, 'utf-8');
    const states = JSON.parse(fileContent) as StoredStates;
    
    console.log('📂 Loaded previous states from file');
    return states;
  } catch (error) {
    // File doesn't exist or is invalid - return empty state
    console.log('📂 No previous states found, starting fresh');
    return {
      lastUpdate: 0,
    };
  }
}

/**
 * Get the stored state for a specific world
 * Returns undefined if no state exists for that world
 */
export function getWorldState(
  states: StoredStates,
  world: WorldType
): StoredWorldState | undefined {
  return states[world];
}

// ============================================================================
// STATE SAVING
// ============================================================================

/**
 * Save states to file
 * Creates the states directory if it doesn't exist
 */
export async function saveStates(states: StoredStates): Promise<void> {
  try {
    // Ensure the states directory exists
    const statesDir = path.dirname(STATE_FILE_PATH);
    await fs.mkdir(statesDir, { recursive: true });
    
    // Update the lastUpdate timestamp
    states.lastUpdate = Math.floor(Date.now() / 1000);
    
    // Write to file with pretty formatting
    const fileContent = JSON.stringify(states, null, 2);
    await fs.writeFile(STATE_FILE_PATH, fileContent, 'utf-8');
    
    console.log('💾 States saved to file');
  } catch (error) {
    console.error('❌ Failed to save states:', error);
    throw error;
  }
}

/**
 * Update the state for a specific world
 */
export function updateWorldState(
  states: StoredStates,
  world: WorldType,
  newState: CycleState,
  transitionTime: number
): StoredStates {
  const now = Math.floor(Date.now() / 1000);
  
  return {
    ...states,
    [world]: {
      world,
      state: newState,
      lastCheck: now,
      lastTransition: transitionTime,
    },
  };
}

// ============================================================================
// CHANGE DETECTION
// ============================================================================

/**
 * Check if a world's state has changed
 * Compares current state with stored state
 * 
 * @param states - Stored states
 * @param world - World to check
 * @param currentState - Current state of the world
 * @returns true if state has changed, false otherwise
 */
export function hasStateChanged(
  states: StoredStates,
  world: WorldType,
  currentState: CycleState
): boolean {
  const storedState = getWorldState(states, world);
  
  // If no stored state exists, consider it a change
  // (first run or new world added)
  if (!storedState) {
    console.log(`🆕 ${world.toUpperCase()}: No previous state, treating as new`);
    return true;
  }
  
  // Compare states
  const changed = storedState.state !== currentState;
  
  if (changed) {
    console.log(`✨ ${world.toUpperCase()}: State changed from ${storedState.state} to ${currentState}`);
  } else {
    console.log(`   ${world.toUpperCase()}: No change (still ${currentState})`);
  }
  
  return changed;
}

/**
 * Check which worlds have changed
 * Returns array of worlds that have changed states
 */
export function detectChanges(
  states: StoredStates,
  currentStates: {
    cetus: CycleState;
    vallis: CycleState;
    cambion: CycleState;
    earth: CycleState;
    duviri: CycleState;
  }
): WorldType[] {
  const changedWorlds: WorldType[] = [];
  const worlds: WorldType[] = ['cetus', 'vallis', 'cambion', 'earth', 'duviri'];
  
  for (const world of worlds) {
    if (hasStateChanged(states, world, currentStates[world])) {
      changedWorlds.push(world);
    }
  }
  
  return changedWorlds;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize states for all worlds
 * Used for first run or when resetting
 */
export function initializeStates(
  currentStates: {
    cetus: CycleState;
    vallis: CycleState;
    cambion: CycleState;
    earth: CycleState;
    duviri: CycleState;
  }
): StoredStates {
  const now = Math.floor(Date.now() / 1000);
  
  return {
    cetus: {
      world: 'cetus',
      state: currentStates.cetus,
      lastCheck: now,
      lastTransition: now,
    },
    vallis: {
      world: 'vallis',
      state: currentStates.vallis,
      lastCheck: now,
      lastTransition: now,
    },
    cambion: {
      world: 'cambion',
      state: currentStates.cambion,
      lastCheck: now,
      lastTransition: now,
    },
    earth: {
      world: 'earth',
      state: currentStates.earth,
      lastCheck: now,
      lastTransition: now,
    },
    duviri: {
      world: 'duviri',
      state: currentStates.duviri,
      lastCheck: now,
      lastTransition: now,
    },
    lastUpdate: now,
  };
}

// ============================================================================
// LOGGING
// ============================================================================

/**
 * Log current states in a readable format
 */
export function logStates(states: StoredStates): void {
  console.log('📊 Current stored states:');
  
  const worlds: WorldType[] = ['cetus', 'vallis', 'cambion', 'earth', 'duviri'];
  
  for (const world of worlds) {
    const state = getWorldState(states, world);
    if (state) {
      const lastCheckDate = new Date(state.lastCheck * 1000);
      console.log(`   ${world.toUpperCase()}: ${state.state} (last checked: ${lastCheckDate.toISOString()})`);
    } else {
      console.log(`   ${world.toUpperCase()}: No data`);
    }
  }
  
  if (states.lastUpdate) {
    const lastUpdateDate = new Date(states.lastUpdate * 1000);
    console.log(`   Last update: ${lastUpdateDate.toISOString()}`);
  }
}

