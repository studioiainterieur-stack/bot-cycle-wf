#!/usr/bin/env node
/**
 * Standalone script to check Warframe cycles
 * This runs via GitHub Actions instead of Vercel cron
 */

import { fetchAllCycles } from './src/services/warframe.js';
import { checkAndNotifyCycleChanges, initializeCycleTracker } from './src/utils/cycle-tracker.js';
import { validateConfig } from './src/config.js';

/**
 * Main function to check cycles
 */
async function main() {
  console.log('⏰ Cycle check started:', new Date().toISOString());
  
  try {
    // Validate configuration
    if (!validateConfig()) {
      console.error('❌ Configuration validation failed');
      process.exit(1);
    }
    
    // Initialize tracker (loads stored states)
    initializeCycleTracker();
    
    // Fetch current cycle data from WarframeStat API
    console.log('📡 Fetching cycle data from WarframeStat API...');
    const cycles = await fetchAllCycles();
    
    console.log(`📊 Fetched ${cycles.length} cycles:`, 
      cycles.map(c => `${c.id}=${c.state}`).join(', ')
    );
    
    // Check for changes and send notifications
    await checkAndNotifyCycleChanges(cycles);
    
    console.log('✅ Cycle check completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error in cycle check:', error);
    process.exit(1);
  }
}

// Run the main function
main();

