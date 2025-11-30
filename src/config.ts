/**
 * Configuration management
 * Loads environment variables and configuration files
 */

import fs from 'fs/promises';
import path from 'path';
import { MessageIds } from './types/index.js';

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

/**
 * Get Discord bot token from environment
 * Required for bot authentication
 */
export function getDiscordToken(): string {
  const token = process.env.DISCORD_BOT_TOKEN;
  
  if (!token) {
    throw new Error(
      'DISCORD_BOT_TOKEN environment variable is not set. ' +
      'Please configure it in GitHub Secrets.'
    );
  }
  
  return token;
}

/**
 * Get Discord channel ID from environment (optional)
 * Can also be loaded from config file
 */
export function getChannelId(): string | undefined {
  return process.env.DISCORD_CHANNEL_ID;
}

// ============================================================================
// MESSAGE IDS CONFIGURATION
// ============================================================================

/**
 * Load message IDs from configuration file
 * This file contains the IDs of pinned messages for each world
 */
export async function loadMessageIds(): Promise<MessageIds> {
  const configPath = path.join(process.cwd(), 'config', 'message-ids.json');
  
  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(fileContent) as MessageIds;
    
    // Validate configuration
    if (!config.channelId) {
      throw new Error('channelId is missing in message-ids.json');
    }
    
    if (!config.messages) {
      throw new Error('messages object is missing in message-ids.json');
    }
    
    const requiredWorlds = ['cetus', 'vallis', 'cambion', 'earth', 'duviri'];
    for (const world of requiredWorlds) {
      if (!config.messages[world as keyof typeof config.messages]) {
        throw new Error(`Message ID for ${world} is missing in message-ids.json`);
      }
    }
    
    console.log('✅ Message IDs configuration loaded');
    return config;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(
        'config/message-ids.json not found. ' +
        'Please create this file with your Discord message IDs. ' +
        'See README.md for setup instructions.'
      );
    }
    throw error;
  }
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate all required configuration is present
 * Throws error if any required config is missing
 */
export async function validateConfig(): Promise<void> {
  console.log('🔍 Validating configuration...');
  
  // Check Discord token
  try {
    getDiscordToken();
    console.log('   ✅ Discord bot token found');
  } catch (error) {
    console.error('   ❌ Discord bot token missing');
    throw error;
  }
  
  // Check message IDs configuration
  try {
    await loadMessageIds();
    console.log('   ✅ Message IDs configuration valid');
  } catch (error) {
    console.error('   ❌ Message IDs configuration invalid');
    throw error;
  }
  
  console.log('✅ All configuration valid');
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Check if running in GitHub Actions
 */
export function isGitHubActions(): boolean {
  return process.env.GITHUB_ACTIONS === 'true';
}

/**
 * Get current environment info
 */
export function getEnvironmentInfo(): {
  isGitHubActions: boolean;
  nodeVersion: string;
  platform: string;
} {
  return {
    isGitHubActions: isGitHubActions(),
    nodeVersion: process.version,
    platform: process.platform,
  };
}
