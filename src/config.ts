/**
 * Configuration for the Warframe cycle bot
 */

// Discord webhook URL from environment variables
export const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

// Optional: Discord bot token (for future features)
export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';

// Optional: Application ID (for future features)
export const APPLICATION_ID = process.env.APPLICATION_ID || '';

// WarframeStat API endpoint
export const WARFRAMESTAT_API = 'https://api.warframestat.us/pc';

// Check interval (5 minutes in milliseconds)
export const CHECK_INTERVAL = 10 * 60 * 1000;

// Validate required configuration
export function validateConfig(): boolean {
  if (!DISCORD_WEBHOOK_URL) {
    console.error('ERROR: DISCORD_WEBHOOK_URL is not set in environment variables');
    return false;
  }
  return true;
}

