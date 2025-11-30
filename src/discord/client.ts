/**
 * Discord client for bot communication
 * Handles connection and message editing via REST API
 */

import { DiscordEmbed } from './embeds.js';

// ============================================================================
// DISCORD API CLIENT
// ============================================================================

/**
 * Discord REST API client
 * Uses bot token for authentication
 */
export class DiscordClient {
  private token: string;
  private baseUrl = 'https://discord.com/api/v10';

  constructor(token: string) {
    this.token = token;
  }

  /**
   * Edit a message with new content
   * 
   * @param channelId - Discord channel ID
   * @param messageId - Discord message ID to edit
   * @param embed - Embed content to update
   */
  async editMessage(
    channelId: string,
    messageId: string,
    embed: DiscordEmbed
  ): Promise<void> {
    const url = `${this.baseUrl}/channels/${channelId}/messages/${messageId}`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bot ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to edit message: ${response.status} ${error}`);
    }

    console.log(`✅ Message ${messageId} edited successfully`);
  }

  /**
   * Send a new message (used for initial setup)
   * 
   * @param channelId - Discord channel ID
   * @param embed - Embed content to send
   * @returns Message ID of the sent message
   */
  async sendMessage(
    channelId: string,
    embed: DiscordEmbed
  ): Promise<string> {
    const url = `${this.baseUrl}/channels/${channelId}/messages`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send message: ${response.status} ${error}`);
    }

    const data = await response.json();
    console.log(`✅ Message sent successfully: ${data.id}`);
    return data.id;
  }

  /**
   * Pin a message in a channel
   * 
   * @param channelId - Discord channel ID
   * @param messageId - Discord message ID to pin
   */
  async pinMessage(channelId: string, messageId: string): Promise<void> {
    const url = `${this.baseUrl}/channels/${channelId}/pins/${messageId}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bot ${this.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to pin message: ${response.status} ${error}`);
    }

    console.log(`📌 Message ${messageId} pinned successfully`);
  }
}

/**
 * Create Discord client instance
 * Reads token from environment variable
 */
export function createDiscordClient(): DiscordClient {
  const token = process.env.DISCORD_BOT_TOKEN;
  
  if (!token) {
    throw new Error('DISCORD_BOT_TOKEN environment variable is not set');
  }

  return new DiscordClient(token);
}

