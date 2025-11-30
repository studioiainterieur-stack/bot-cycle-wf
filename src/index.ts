/**
 * Main entry point for Warframe Cycle Bot
 * 
 * This script:
 * 1. Calculates current cycles for all worlds (mathematical, no API)
 * 2. Loads previous states from storage
 * 3. Detects which worlds have changed state
 * 4. Updates only the Discord messages that need updating
 * 5. Saves new states for next run
 * 
 * Designed to run every 15 minutes via GitHub Actions
 */

import { validateConfig, loadMessageIds } from './config.js';
import { createDiscordClient } from './discord/client.js';
import { updateWorldMessage } from './discord/messages.js';
import {
  calculateCetusCycle,
  calculateVallisCycle,
  calculateCambionCycle,
  calculateEarthCycle,
  calculateDuviriCycle,
  logCycleInfo,
} from './cycles/index.js';
import {
  loadStates,
  saveStates,
  detectChanges,
  updateWorldState,
  logStates,
} from './storage/state-manager.js';
import { CycleInfo, WorldType } from './types/index.js';

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Main execution function
 * Orchestrates the entire cycle check and update process
 */
async function main(): Promise<void> {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 Warframe Cycle Bot - Starting...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🕐 Current time: ${new Date().toISOString()}`);
  console.log('');

  try {
    // ========================================================================
    // STEP 1: Validate configuration
    // ========================================================================
    console.log('📋 Step 1/6: Validating configuration...');
    await validateConfig();
    console.log('');

    // ========================================================================
    // STEP 2: Calculate all cycles mathematically
    // ========================================================================
    console.log('🔢 Step 2/6: Calculating cycles mathematically...');
    const now = Math.floor(Date.now() / 1000);
    
    const cetusCycle = calculateCetusCycle(now);
    const vallisCycle = calculateVallisCycle(now);
    const cambionCycle = calculateCambionCycle(now);
    const earthCycle = calculateEarthCycle(now);
    const duviriCycle = calculateDuviriCycle(now);
    
    console.log('✅ All cycles calculated');
    console.log('');
    
    // Log cycle information
    logCycleInfo('Cetus', cetusCycle);
    logCycleInfo('Vallis', vallisCycle);
    logCycleInfo('Cambion', cambionCycle);
    logCycleInfo('Earth', earthCycle);
    logCycleInfo('Duviri', duviriCycle);
    console.log('');

    // ========================================================================
    // STEP 3: Load previous states
    // ========================================================================
    console.log('📂 Step 3/6: Loading previous states...');
    const previousStates = await loadStates();
    logStates(previousStates);
    console.log('');

    // ========================================================================
    // STEP 4: Detect changes
    // ========================================================================
    console.log('🔍 Step 4/6: Detecting state changes...');
    const currentStates = {
      cetus: cetusCycle.state,
      vallis: vallisCycle.state,
      cambion: cambionCycle.state,
      earth: earthCycle.state,
      duviri: duviriCycle.state,
    };
    
    const changedWorlds = detectChanges(previousStates, currentStates);
    
    if (changedWorlds.length === 0) {
      console.log('✅ No state changes detected - no updates needed');
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ Cycle check completed - No changes');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return;
    }
    
    console.log(`✨ ${changedWorlds.length} world(s) have changed:`);
    for (const world of changedWorlds) {
      console.log(`   - ${world.toUpperCase()}`);
    }
    console.log('');

    // ========================================================================
    // STEP 5: Update Discord messages for changed worlds
    // ========================================================================
    console.log('📝 Step 5/6: Updating Discord messages...');
    
    // Load message configuration
    const messageConfig = await loadMessageIds();
    
    // Create Discord client
    const discordClient = createDiscordClient();
    
    // Map of all cycles for easy access
    const allCycles: Record<WorldType, CycleInfo> = {
      cetus: cetusCycle,
      vallis: vallisCycle,
      cambion: cambionCycle,
      earth: earthCycle,
      duviri: duviriCycle,
    };
    
    // Update only the changed worlds
    for (const world of changedWorlds) {
      const cycle = allCycles[world];
      await updateWorldMessage(discordClient, messageConfig, cycle);
      
      // Small delay between updates to respect rate limits
      if (changedWorlds.length > 1) {
        await delay(1000); // 1 second between updates
      }
    }
    
    console.log('✅ All Discord messages updated');
    console.log('');

    // ========================================================================
    // STEP 6: Save new states
    // ========================================================================
    console.log('💾 Step 6/6: Saving new states...');
    
    // Update states for all changed worlds
    let newStates = previousStates;
    for (const world of changedWorlds) {
      const cycle = allCycles[world];
      newStates = updateWorldState(
        newStates,
        world,
        cycle.state,
        cycle.nextTransition
      );
    }
    
    // Save to file
    await saveStates(newStates);
    console.log('✅ States saved successfully');
    console.log('');

    // ========================================================================
    // SUCCESS
    // ========================================================================
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Cycle check completed successfully!');
    console.log(`📊 Updated ${changedWorlds.length} world(s)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    // ========================================================================
    // ERROR HANDLING
    // ========================================================================
    console.error('');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ Error occurred:');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(error);
    console.error('');
    
    // Exit with error code for GitHub Actions
    process.exit(1);
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Delay helper for rate limiting
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// EXECUTION
// ============================================================================

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

