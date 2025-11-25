# Warframe Day/Night Cycle Discord Bot

A Discord bot that automatically tracks and notifies about day/night cycle changes across all Warframe locations. Runs on GitHub Actions - 100% free with cron jobs every 5 minutes!

## Features

- 🌍 **Tracks all Warframe locations:**
  - Cetus (Plains of Eidolon) - Day/Night cycles
  - Fortuna (Orb Vallis) - Warm/Cold cycles
  - Deimos (Cambion Drift) - Fass/Vome cycles
  - Earth - Day/Night cycles

- 🔔 **Automatic notifications:** Sends Discord messages when cycles change
- ⏰ **Real-time monitoring:** Checks every 5 minutes via GitHub Actions
- 🎨 **Beautiful embeds:** Color-coded Discord embeds with emojis
- 🆓 **Free hosting:** Runs completely free on GitHub Actions (no credit card needed!)

## Setup Instructions

### 🚀 Quick Setup (5 minutes)

**See [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md) for detailed instructions!**

### 1. Create a Discord Webhook

1. Open your Discord server
2. Go to **Server Settings** > **Integrations** > **Webhooks**
3. Click **New Webhook**
4. Give it a name (e.g., "Warframe Cycle Bot")
5. Choose the channel where you want notifications
6. Click **Copy Webhook URL** and save it

### 2. Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `warframe-cycle-bot`
3. Make it **Public** (for free Actions)
4. Create repository

### 3. Push Code to GitHub

```bash
cd warframe-cycle-bot

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub (replace USERNAME)
git remote add origin https://github.com/USERNAME/warframe-cycle-bot.git
git branch -M main
git push -u origin main
```

### 4. Add Discord Webhook Secret

1. On GitHub: **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `DISCORD_WEBHOOK_URL`
4. Value: Your Discord webhook URL
5. Click **Add secret**

### 5. Enable GitHub Actions

1. Go to **Actions** tab
2. Enable workflows if asked
3. Click **Run workflow** to test immediately

### 6. Done! 🎉

The bot now runs automatically every 5 minutes!

## How It Works

1. **GitHub Actions** runs the bot every 5 minutes automatically
2. The bot fetches current cycle data from [WarframeStat API](https://api.warframestat.us)
3. It compares with the last known states stored in `.cycle-states.json`
4. When a cycle changes (day→night or night→day), it sends a notification
5. Discord webhook displays a beautiful embed with cycle information
6. The new state is saved for the next run

## Project Structure

```
/api
  /cron.ts              - Vercel cron endpoint (runs every 5 minutes)
/src
  /services
    /warframe.ts        - WarframeStat API integration
    /discord.ts         - Discord notification service
  /utils
    /cycle-tracker.ts   - Cycle change detection logic
  /types
    /index.ts           - TypeScript type definitions
  /config.ts            - Configuration management
/package.json           - Dependencies
/vercel.json            - Vercel configuration with cron schedule
/tsconfig.json          - TypeScript configuration
```

## Example Notification

When a cycle changes, you'll receive a Discord embed like this:

```
🌅 Cetus (Plains of Eidolon) - 🌙 Night Time
Night time - Eidolons active!

Time Remaining: 2h 30m
Current Cycle: Night

Warframe Cycle Tracker
[timestamp]
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_WEBHOOK_URL` | ✅ Yes | Discord webhook URL for notifications |
| `DISCORD_BOT_TOKEN` | ❌ No | Bot token (for future slash command features) |
| `APPLICATION_ID` | ❌ No | Application ID (for future features) |

### Cron Schedule

The bot checks cycles every 5 minutes by default. To change this:

1. Edit `vercel.json`
2. Modify the `schedule` value using [cron syntax](https://crontab.guru/)
3. Examples:
   - Every 5 minutes: `*/5 * * * *` (current)
   - Every 10 minutes: `*/10 * * * *`
   - Every hour: `0 * * * *`

## Troubleshooting

### No notifications received

1. Check Vercel logs: `vercel logs`
2. Verify webhook URL is correct in environment variables
3. Make sure the bot has permissions in your Discord channel
4. Test the endpoint manually: `curl https://your-domain.vercel.app/api/cron`

### "Configuration error" in logs

- Ensure `DISCORD_WEBHOOK_URL` is set in Vercel environment variables
- Redeploy after adding environment variables

### Rate limiting

- Discord webhooks have a rate limit of 30 requests per minute
- The bot includes 1-second delays between notifications to avoid this
- If you still hit limits, increase the delay in `cycle-tracker.ts`

## API Credits

This bot uses the [WarframeStat API](https://api.warframestat.us) to fetch cycle data.
Thanks to the WarframeStat team for providing this free API!

## Future Enhancements

- ✨ Add slash commands to query current cycles
- 📊 Add statistics tracking
- 🔔 Add role mentions for specific cycle changes
- 💾 Add Vercel Blob storage for persistent state
- 🎯 Add filters to only notify for specific locations

## License

MIT License - Feel free to use and modify!

## Support

If you encounter any issues:
1. Check the [Vercel documentation](https://vercel.com/docs)
2. Check the [Discord.js documentation](https://discord.js.org)
3. Open an issue on GitHub

---

**Enjoy tracking Warframe cycles! 🎮**

