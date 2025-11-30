/**
 * Common utilities for cycle calculations
 * Provides time formatting and helper functions
 */

import { CycleInfo, CycleConfig, CycleState } from '../types/index.js';

// ============================================================================
// TIME FORMATTING
// ============================================================================

/**
 * Format seconds into human-readable time
 * Examples: "2h 30m 15s", "45m 20s", "30s"
 */
export function formatTimeRemaining(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  // Format based on what units we have
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

/**
 * Format Unix timestamp into human-readable date/time
 * Example: "30/11/2025 21:05:30"
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// ============================================================================
// CYCLE CALCULATION CORE
// ============================================================================

/**
 * Calculate cycle information based on configuration
 * This is the main mathematical function used by all worlds
 * 
 * @param config - Cycle configuration with epoch and state patterns
 * @param now - Current Unix timestamp (in seconds)
 * @returns Complete cycle information
 */
export function calculateCycle(
  config: CycleConfig,
  now: number
): Omit<CycleInfo, 'world'> {
  // Calculate time elapsed since the epoch (starting point)
  const elapsed = now - config.epoch;
  
  // Find position within the current cycle
  // Using modulo to get repeating pattern
  const positionInCycle = elapsed % config.totalLength;
  
  // Find which state we're currently in
  let currentState: CycleState = config.states[0].name;
  let currentStateStart = 0;
  let currentStateEnd = config.totalLength;
  let nextState: CycleState = config.states[0].name;
  
  // Loop through states to find current and next
  for (let i = 0; i < config.states.length; i++) {
    const state = config.states[i];
    
    // Check if we're in this state
    if (positionInCycle >= state.start && positionInCycle < state.end) {
      currentState = state.name;
      currentStateStart = state.start;
      currentStateEnd = state.end;
      
      // Next state is the following one (or wrap to first)
      const nextIndex = (i + 1) % config.states.length;
      nextState = config.states[nextIndex].name;
      break;
    }
  }
  
  // Calculate time remaining until next transition
  const timeRemaining = currentStateEnd - positionInCycle;
  
  // Calculate when the next transition will occur
  const nextTransition = now + timeRemaining;
  
  // Calculate progress through current state (0-100%)
  const stateLength = currentStateEnd - currentStateStart;
  const stateProgress = positionInCycle - currentStateStart;
  const cycleProgress = (stateProgress / stateLength) * 100;
  
  return {
    state: currentState,
    timeRemaining,
    nextTransition,
    nextState,
    cycleProgress,
  };
}

// ============================================================================
// PROGRESS BAR
// ============================================================================

/**
 * Create a visual progress bar for Discord
 * Example: [████████░░░░░░░░] 45%
 * 
 * @param progress - Progress percentage (0-100)
 * @param length - Total length of bar (default 16)
 */
export function createProgressBar(progress: number, length: number = 16): string {
  const filledLength = Math.floor((progress / 100) * length);
  const emptyLength = length - filledLength;
  
  const filled = '█'.repeat(filledLength);
  const empty = '░'.repeat(emptyLength);
  
  return `[${filled}${empty}] ${Math.floor(progress)}%`;
}

// ============================================================================
// LOGGING HELPERS
// ============================================================================

/**
 * Log cycle information in a readable format
 * Used for debugging and GitHub Actions logs
 */
export function logCycleInfo(world: string, info: CycleInfo): void {
  console.log(`📊 ${world.toUpperCase()}:`);
  console.log(`   État: ${info.state}`);
  console.log(`   Temps restant: ${formatTimeRemaining(info.timeRemaining)}`);
  console.log(`   Prochaine transition: ${formatTimestamp(info.nextTransition)}`);
  console.log(`   Prochain état: ${info.nextState}`);
  console.log(`   Progression: ${Math.floor(info.cycleProgress)}%`);
}

