# Deployment Guide

This guide walks you through deploying your Warframe Cycle Bot to Vercel.

## Prerequisites

- Node.js 18+ installed
- A Discord server where you have admin permissions
- A free Vercel account ([sign up here](https://vercel.com/signup))

## Step-by-Step Deployment

### 1. Create Discord Webhook

This is how the bot sends notifications to your Discord server.

1. Open Discord and go to your server
2. Click on the server name → **Server Settings**
3. Go to **Integrations** → **Webhooks**
4. Click **New Webhook**
5. Configure:
   - **Name:** Warframe Cycle Bot (or any name you prefer)
   - **Channel:** Select the channel for notifications
   - **Avatar:** (optional) Add a custom icon
6. Click **Copy Webhook URL** - you'll need this later
7. Save the webhook

The URL looks like:
```
https://discord.com/api/webhooks/1234567890/abcdefghijklmnopqrstuvwxyz
```

### 2. Install Dependencies Locally

```bash
cd /Users/zelenion/Desktop/BOT
npm install
```

### 3. Test Locally (Optional but Recommended)

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your webhook URL:

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_TOKEN
```

Install Vercel CLI and test:

```bash
npm install -g vercel
vercel dev
```

In another terminal, test the cron endpoint:

```bash
curl http://localhost:3000/api/cron
```

You should see a notification in your Discord channel!

### 4. Deploy to Vercel

#### Option A: Deploy via Vercel CLI (Recommended)

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Select your account
- **Link to existing project?** No
- **Project name?** warframe-cycle-bot (or any name)
- **Directory?** ./ (press Enter)
- **Override settings?** No

#### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository (or upload the folder)
3. Configure project:
   - **Framework Preset:** Other
   - **Root Directory:** ./
   - **Build Command:** npm run build
4. Click **Deploy**

### 5. Add Environment Variables

After deployment, add your webhook URL:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (warframe-cycle-bot)
3. Go to **Settings** → **Environment Variables**
4. Add variable:
   - **Name:** `DISCORD_WEBHOOK_URL`
   - **Value:** Paste your Discord webhook URL
   - **Environment:** Production (check all environments if testing)
5. Click **Save**

### 6. Redeploy with Environment Variables

The environment variables only take effect after a new deployment:

```bash
vercel --prod
```

Or use the Vercel Dashboard:
1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Click **Redeploy**

### 7. Verify Cron Job is Active

1. In Vercel Dashboard, go to your project
2. Click **Settings** → **Cron Jobs**
3. You should see:
   - **Path:** `/api/cron`
   - **Schedule:** `*/5 * * * *` (every 5 minutes)
   - **Status:** Active ✅

### 8. Monitor Logs

Check if the bot is working:

```bash
vercel logs --follow
```

Or in the Dashboard:
1. Go to your project
2. Click **Logs** tab
3. You should see logs every 5 minutes like:
   ```
   ⏰ Cron job triggered: 2024-11-25T12:00:00.000Z
   📡 Fetching cycle data from WarframeStat API...
   📊 Fetched 4 cycles: cetus=day, vallis=night, cambion=day, earth=night
   ✅ No cycle changes detected
   ✅ Cron job completed successfully
   ```

## Verification Checklist

- [ ] Discord webhook is created and URL is saved
- [ ] Dependencies are installed (`npm install`)
- [ ] Project is deployed to Vercel
- [ ] `DISCORD_WEBHOOK_URL` environment variable is set in Vercel
- [ ] Project is redeployed after adding environment variables
- [ ] Cron job shows as "Active" in Vercel settings
- [ ] Logs show the cron job running every 5 minutes
- [ ] Test notification appears in Discord within 5 minutes (when a cycle changes)

## Troubleshooting

### No notifications appearing

**Check logs:**
```bash
vercel logs --follow
```

**Common issues:**
- Webhook URL is incorrect → Check environment variables
- Bot hasn't detected a cycle change yet → Wait for the next cycle change
- Cron job not running → Check Cron Jobs settings in Vercel

### "Configuration error" in logs

- Environment variable `DISCORD_WEBHOOK_URL` is not set
- Go to Settings → Environment Variables and add it
- Redeploy after adding

### Cron job not running

- Free Vercel accounts have cron jobs
- Make sure `vercel.json` exists with cron configuration
- Check Settings → Cron Jobs to see if it's active
- Redeploy if needed

### Rate limiting errors

- Too many notifications at once
- Increase delay in `src/utils/cycle-tracker.ts`
- Or reduce check frequency in `vercel.json`

## Manual Testing

You can manually trigger the cron endpoint to test:

```bash
# Using curl
curl https://your-project.vercel.app/api/cron

# Using browser
# Open: https://your-project.vercel.app/api/cron
```

This will immediately check cycles and send notifications if there are changes.

## Updating the Bot

To update the bot after making changes:

```bash
# Pull latest changes (if using Git)
git pull

# Redeploy
vercel --prod
```

## Cost

This bot runs **completely free** on Vercel:
- ✅ Serverless Functions: 100GB-Hrs/month free
- ✅ Cron Jobs: Unlimited on Hobby plan
- ✅ Bandwidth: 100GB/month free
- ✅ Invocations: Generous free tier

With checks every 5 minutes, you'll use:
- ~8,640 invocations/month
- ~1-2 seconds per invocation
- Well within free limits! 🎉

## Next Steps

Now that your bot is deployed:

1. Wait for the next cycle change to see your first notification
2. Monitor logs to ensure everything is working
3. Customize notification messages in `src/services/discord.ts`
4. Adjust check frequency in `vercel.json` if needed
5. Consider adding features like role mentions or slash commands

---

**Questions?** Check the README.md or Vercel documentation.

