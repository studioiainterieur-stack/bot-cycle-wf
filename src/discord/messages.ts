/**
 * Discord message management
 * Handles updating pinned messages for each world
 */

import { CycleInfo, WorldType, MessageIds } from '../types/index.js';
import { DiscordClient } from './client.js';
import { buildEmbedForWorld } from './embeds.js';

// ============================================================================
// MESSAGE UPDATER
// ============================================================================

/**
 * Update a single world's pinned message
 * 
 * @param client - Discord client instance
 * @param config - Message IDs configuration
 * @param cycle - Current cycle info for the world
 */
export async function updateWorldMessage(
  client: DiscordClient,
  config: MessageIds,
  cycle: CycleInfo
): Promise<void> {
  const world = cycle.world;
  const messageId = config.messages[world];
  
  if (!messageId) {
    console.warn(`⚠️  No message ID configured for ${world}`);
    return;
  }

  console.log(`📝 Updating ${world} message...`);
  
  try {
    // Build the embed for this world
    const embed = buildEmbedForWorld(cycle);
    
    // Edit the pinned message
    await client.editMessage(config.channelId, messageId, embed);
    
    console.log(`✅ ${world.toUpperCase()} message updated successfully`);
  } catch (error) {
    console.error(`❌ Failed to update ${world} message:`, error);
    throw error;
  }
}

/**
 * Update multiple world messages
 * Only updates worlds that are provided
 * 
 * @param client - Discord client instance
 * @param config - Message IDs configuration
 * @param cycles - Array of cycle info to update
 */
export async function updateMultipleMessages(
  client: DiscordClient,
  config: MessageIds,
  cycles: CycleInfo[]
): Promise<void> {
  console.log(`📝 Updating ${cycles.length} world message(s)...`);
  
  // Update each world sequentially
  // We use sequential instead of parallel to avoid rate limits
  for (const cycle of cycles) {
    await updateWorldMessage(client, config, cycle);
    
    // Small delay between updates to respect Discord rate limits
    await delay(1000); // 1 second delay
  }
  
  console.log(`✅ All ${cycles.length} message(s) updated successfully`);
}

/**
 * Update all world messages regardless of changes
 * Useful for manual refresh or initial setup
 * 
 * @param client - Discord client instance
 * @param config - Message IDs configuration
 * @param allCycles - All cycle information
 */
export async function updateAllMessages(
  client: DiscordClient,
  config: MessageIds,
  allCycles: {
    cetus: CycleInfo;
    vallis: CycleInfo;
    cambion: CycleInfo;
    earth: CycleInfo;
    duviri: CycleInfo;
  }
): Promise<void> {
  console.log('📝 Updating all world messages...');
  
  const cycles = [
    allCycles.cetus,
    allCycles.vallis,
    allCycles.cambion,
    allCycles.earth,
    allCycles.duviri,
  ];
  
  await updateMultipleMessages(client, config, cycles);
}

// ============================================================================
// INITIAL SETUP HELPER
// ============================================================================

/**
 * Create initial pinned messages for all worlds
 * Run this once to set up the bot
 * 
 * @param client - Discord client instance
 * @param channelId - Discord channel ID where to create messages
 * @param allCycles - All cycle information
 * @returns Message IDs for each world
 */
export async function createInitialMessages(
  client: DiscordClient,
  channelId: string,
  allCycles: {
    cetus: CycleInfo;
    vallis: CycleInfo;
    cambion: CycleInfo;
    earth: CycleInfo;
    duviri: CycleInfo;
  }
): Promise<MessageIds> {
  console.log('🆕 Creating initial messages for all worlds...');
  
  const messageIds: Partial<MessageIds['messages']> = {};
  const worlds: WorldType[] = ['cetus', 'vallis', 'cambion', 'earth', 'duviri'];
  
  // Create a message for each world
  for (const world of worlds) {
    const cycle = allCycles[world];
    const embed = buildEmbedForWorld(cycle);
    
    console.log(`📤 Creating message for ${world}...`);
    const messageId = await client.sendMessage(channelId, embed);
    messageIds[world] = messageId;
    
    // Pin the message
    console.log(`📌 Pinning ${world} message...`);
    await client.pinMessage(channelId, messageId);
    
    // Delay between creations
    await delay(2000); // 2 seconds
  }
  
  const config: MessageIds = {
    channelId,
    messages: messageIds as MessageIds['messages'],
  };
  
  console.log('✅ All initial messages created and pinned!');
  console.log('📋 Save this configuration to config/message-ids.json:');
  console.log(JSON.stringify(config, null, 2));
  
  return config;
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

