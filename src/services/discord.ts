/**
 * Discord notification service
 * Sends formatted embed messages about cycle changes
 */

import { CycleInfo, EMBED_COLORS, LOCATION_NAMES, LOCATION_EMOJIS } from '../types/index.js';
import { DISCORD_WEBHOOK_URL } from '../config.js';

/**
 * Discord embed structure
 */
interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
  };
  timestamp?: string;
}

/**
 * Discord webhook payload
 */
interface WebhookPayload {
  embeds: DiscordEmbed[];
}

/**
 * Send a cycle change notification to Discord
 * This is called when a location changes from day to night or vice versa
 */
export async function sendCycleChangeNotification(cycle: CycleInfo): Promise<void> {
  if (!DISCORD_WEBHOOK_URL) {
    console.error('Discord webhook URL is not configured');
    return;
  }
  
  try {
    const embed = createCycleEmbed(cycle);
    const payload: WebhookPayload = {
      embeds: [embed],
    };
    
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
    }
    
    console.log(`✅ Sent notification for ${cycle.id}: ${cycle.state}`);
  } catch (error) {
    console.error('Error sending Discord notification:', error);
    throw error;
  }
}

/**
 * Create a Discord embed for a cycle change
 * The embed is formatted with colors, emojis, and relevant information
 */
function createCycleEmbed(cycle: CycleInfo): DiscordEmbed {
  const locationName = LOCATION_NAMES[cycle.id];
  const emoji = LOCATION_EMOJIS[cycle.id];
  const color = EMBED_COLORS[cycle.state];
  
  // Create title based on state
  const stateText = cycle.state === 'day' ? '☀️ Day Time' : '🌙 Night Time';
  
  return {
    title: `${emoji} ${locationName} - ${stateText}`,
    description: cycle.shortDesc,
    color: color,
    fields: [
      {
        name: 'Time Remaining',
        value: cycle.timeLeft,
        inline: true,
      },
      {
        name: 'Current Cycle',
        value: cycle.state === 'day' ? 'Day' : 'Night',
        inline: true,
      },
    ],
    footer: {
      text: 'Warframe Cycle Tracker',
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Send a batch notification for multiple cycle changes
 * This is useful when the bot starts up and detects multiple changes
 */
export async function sendBatchNotifications(cycles: CycleInfo[]): Promise<void> {
  if (!DISCORD_WEBHOOK_URL) {
    console.error('Discord webhook URL is not configured');
    return;
  }
  
  try {
    const embeds = cycles.map(createCycleEmbed);
    const payload: WebhookPayload = {
      embeds: embeds,
    };
    
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
    }
    
    console.log(`✅ Sent batch notification for ${cycles.length} cycles`);
  } catch (error) {
    console.error('Error sending Discord batch notification:', error);
    throw error;
  }
}

