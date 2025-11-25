/**
 * Cycle tracker utility
 * Detects cycle changes and manages state persistence
 */

import { CycleInfo, StoredCycleStates, CycleStateI } from '../types/index.js';
import { sendCycleChangeNotification } from '../services/discord.js';
import { loadStates, saveStates } from './state-storage.js';

/**
 * State storage - loaded from file on initialization
 */
let lastKnownStates: StoredCycleStates | null = null;

/**
 * Initialize the cycle tracker
 * This loads the last known states from storage file
 */
export function initializeCycleTracker(): void {
  console.log('🔄 Initializing cycle tracker...');
  
  // Load states from file
  lastKnownStates = loadStates();
  
  if (!lastKnownStates) {
    // First run - no previous states
    lastKnownStates = {
      lastUpdate: new Date().toISOString(),
    };
  }
}

/**
 * Check for cycle changes and send notifications
 * Compares current cycles with last known states
 * Sends Discord notifications for any changes detected
 */
export async function checkAndNotifyCycleChanges(currentCycles: CycleInfo[]): Promise<void> {
  console.log('🔍 Checking for cycle changes...');
  
  // If this is the first check, just store the states without notifying
  if (!lastKnownStates || !lastKnownStates.cetus) {
    console.log('📝 First check - storing initial states');
    updateStoredStates(currentCycles);
    return;
  }
  
  // Check each location for changes
  const changedCycles: CycleInfo[] = [];
  
  for (const cycle of currentCycles) {
    const lastState = getLastStateForLocation(cycle.id);
    
    if (lastState && lastState.currentState !== cycle.state) {
      // Cycle has changed! Store it for notification
      console.log(`🔔 Change detected in ${cycle.id}: ${lastState.currentState} → ${cycle.state}`);
      changedCycles.push(cycle);
    }
  }
  
  // Send notifications for all changed cycles
  if (changedCycles.length > 0) {
    console.log(`📢 Sending notifications for ${changedCycles.length} cycle change(s)`);
    
    // Send notifications one by one to avoid rate limiting
    for (const cycle of changedCycles) {
      try {
        await sendCycleChangeNotification(cycle);
        // Small delay between notifications to avoid rate limits
        await delay(1000);
      } catch (error) {
        console.error(`Failed to send notification for ${cycle.id}:`, error);
      }
    }
  } else {
    console.log('✅ No cycle changes detected');
  }
  
  // Update stored states with current cycles
  updateStoredStates(currentCycles);
}

/**
 * Get the last known state for a specific location
 */
function getLastStateForLocation(location: string): CycleStateI | null {
  if (!lastKnownStates) return null;
  
  switch (location) {
    case 'cetus':
      return lastKnownStates.cetus || null;
    case 'vallis':
      return lastKnownStates.vallis || null;
    case 'cambion':
      return lastKnownStates.cambion || null;
    case 'earth':
      return lastKnownStates.earth || null;
    default:
      return null;
  }
}

/**
 * Update stored states with current cycle information
 * In production, this would persist to Vercel Blob or a database
 */
function updateStoredStates(cycles: CycleInfo[]): void {
  const newStates: StoredCycleStates = {
    lastUpdate: new Date().toISOString(),
  };
  
  for (const cycle of cycles) {
    const stateData: CycleStateI = {
      location: cycle.id,
      currentState: cycle.state,
      lastCheck: new Date().toISOString(),
      expiry: cycle.expiry.toISOString(),
    };
    
    switch (cycle.id) {
      case 'cetus':
        newStates.cetus = stateData;
        break;
      case 'vallis':
        newStates.vallis = stateData;
        break;
      case 'cambion':
        newStates.cambion = stateData;
        break;
      case 'earth':
        newStates.earth = stateData;
        break;
    }
  }
  
  lastKnownStates = newStates;
  
  // Save to file for next run
  saveStates(newStates);
  console.log('💾 Updated stored states');
}

/**
 * Simple delay utility for rate limiting
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get current stored states (for debugging)
 */
export function getStoredStates(): StoredCycleStates | null {
  return lastKnownStates;
}

