/**
 * Vercel Cron endpoint
 * This function runs every 5 minutes to check Warframe cycles
 * and send notifications when cycles change
 */

import { fetchAllCycles } from '../src/services/warframe.js';
import { checkAndNotifyCycleChanges, initializeCycleTracker } from '../src/utils/cycle-tracker.js';
import { validateConfig } from '../src/config.js';

// Type definitions for Vercel serverless functions
interface VercelRequest {
  query: { [key: string]: string | string[] };
  body: any;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
}

/**
 * Main cron handler
 * Called by Vercel cron every 5 minutes
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  console.log('⏰ Cron job triggered:', new Date().toISOString());
  
  try {
    // Validate configuration
    if (!validateConfig()) {
      console.error('❌ Configuration validation failed');
      res.status(500).json({ 
        error: 'Configuration error',
        message: 'Missing required environment variables'
      });
      return;
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
    
    console.log('✅ Cron job completed successfully');
    
    // Return success response
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      cycles: cycles.map(c => ({
        location: c.id,
        state: c.state,
        timeLeft: c.timeLeft,
      })),
    });
  } catch (error) {
    console.error('❌ Error in cron job:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}

