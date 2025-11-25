# Project Structure

This document explains the structure of the Warframe Cycle Bot project.

## Directory Layout

```
/Users/zelenion/Desktop/BOT/
├── api/                      # Vercel serverless functions
│   └── cron.ts              # Main cron endpoint (runs every 5 minutes)
│
├── src/                      # Source code
│   ├── config.ts            # Configuration and environment variables
│   │
│   ├── services/            # External service integrations
│   │   ├── discord.ts       # Discord webhook notifications
│   │   └── warframe.ts      # WarframeStat API client
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # All types and constants
│   │
│   └── utils/               # Utility functions
│       └── cycle-tracker.ts # Cycle change detection logic
│
├── .env.local.example       # Environment variable template
├── .gitignore               # Git ignore rules
├── .npmrc                   # npm configuration
├── .vercelignore            # Vercel deployment ignore rules
├── DEPLOYMENT.md            # Detailed deployment guide
├── package.json             # Project dependencies and scripts
├── package-lock.json        # Locked dependency versions
├── QUICKSTART.md            # Quick 5-minute setup guide
├── README.md                # Main documentation
├── tsconfig.json            # TypeScript configuration
└── vercel.json              # Vercel deployment config with cron
```

## Key Files Explained

### Configuration Files

#### `vercel.json`
- Defines cron schedule (every 5 minutes)
- Sets function memory and timeout limits
- Critical for Vercel deployment

#### `tsconfig.json`
- TypeScript compiler settings
- Enables ES2022 features
- Configures module resolution

#### `.env.local.example`
- Template for environment variables
- Copy to `.env.local` for local development
- On Vercel, set in dashboard

### Source Code

#### `api/cron.ts`
- Entry point for Vercel cron job
- Runs every 5 minutes automatically
- Fetches cycles, detects changes, sends notifications

#### `src/config.ts`
- Reads environment variables
- Validates configuration
- Exports constants used throughout the app

#### `src/services/warframe.ts`
- Fetches data from WarframeStat API
- Parses cycle info for all 4 locations:
  - Cetus (Plains of Eidolon) - day/night
  - Vallis (Orb Vallis) - warm/cold
  - Cambion (Deimos) - fass/vome
  - Earth - day/night
- Returns standardized cycle data

#### `src/services/discord.ts`
- Sends notifications via Discord webhook
- Creates beautiful embeds with:
  - Color coding (gold for day, blue for night)
  - Emojis for each location
  - Time remaining
  - Current cycle state

#### `src/utils/cycle-tracker.ts`
- Stores last known cycle states
- Compares current vs previous states
- Detects when cycles change
- Triggers notifications only on changes

#### `src/types/index.ts`
- TypeScript interfaces and types
- Constants (colors, emojis, names)
- Ensures type safety throughout

## Data Flow

```
1. Vercel Cron (every 5 minutes)
   ↓
2. api/cron.ts handler
   ↓
3. src/services/warframe.ts (fetch API)
   ↓
4. src/utils/cycle-tracker.ts (detect changes)
   ↓
5. src/services/discord.ts (send notifications)
   ↓
6. Discord webhook → Your server
```

## How It Works

### Initialization
1. Cron job triggers every 5 minutes
2. Configuration is validated
3. Cycle tracker initializes (loads previous states)

### Cycle Check
1. Fetch current cycles from WarframeStat API
2. Compare with last known states
3. Identify which locations changed

### Notification
1. For each changed cycle:
   - Create formatted Discord embed
   - Send via webhook
   - Wait 1 second (rate limit protection)
2. Update stored states

### State Management
- Currently: In-memory (resets on cold starts)
- Future: Could use Vercel Blob for persistence
- Works well because:
  - Cycles change slowly (~50min - 4hrs)
  - Checks every 5 minutes
  - Missing one check is okay

## Extension Points

Want to add features? Here's where to start:

### Add new locations
- Update `src/services/warframe.ts` (add parser)
- Add types in `src/types/index.ts`
- Update display names and emojis

### Change notification format
- Edit `src/services/discord.ts`
- Modify `createCycleEmbed()` function

### Add slash commands
- Create new API endpoint in `api/`
- Use Discord interactions
- Add bot token to config

### Change check frequency
- Edit `vercel.json`
- Modify cron schedule
- See https://crontab.guru for syntax

### Add persistent storage
- Integrate Vercel Blob
- Update `src/utils/cycle-tracker.ts`
- Store/load states from blob

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Run locally
vercel dev

# Test endpoint
curl http://localhost:3000/api/cron

# Type check
npm run type-check
```

### Deployment
```bash
# Deploy to production
vercel --prod

# View logs
vercel logs --follow
```

## Dependencies

### Runtime
- **discord.js** - Discord API wrapper (for future features)
- **node-fetch** - HTTP client for API calls
- **@vercel/blob** - Vercel's blob storage (for future persistence)

### Development
- **typescript** - Type safety
- **@types/node** - Node.js type definitions
- **@vercel/node** - Vercel function types

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_WEBHOOK_URL` | ✅ Yes | Discord webhook for notifications |
| `DISCORD_BOT_TOKEN` | ❌ No | For future slash command features |
| `APPLICATION_ID` | ❌ No | For future Discord app features |

## Vercel Configuration

### Cron Job
- **Path:** `/api/cron`
- **Schedule:** `*/5 * * * *` (every 5 minutes)
- **Memory:** 1024 MB
- **Timeout:** 60 seconds

### Free Tier Limits
- 100 GB-Hours/month serverless execution
- Unlimited cron jobs
- 100 GB bandwidth
- This bot uses ~0.5 GB-Hours/month ✅

---

**Need help?** Check [README.md](README.md) or [DEPLOYMENT.md](DEPLOYMENT.md)

