# Quick Start Guide

Get your Warframe Cycle Bot running in 5 minutes! ⚡

## What You Need

1. A Discord server (where you're admin)
2. 5 minutes of your time
3. That's it! Everything else is free.

## Setup Steps

### 1️⃣ Install Dependencies (1 minute)

Open terminal in this folder and run:

```bash
npm install
```

### 2️⃣ Create Discord Webhook (2 minutes)

1. Open Discord → Your Server
2. Server Settings → Integrations → Webhooks
3. Click "New Webhook"
4. Name it "Warframe Cycles"
5. Choose a channel for notifications
6. Click "Copy Webhook URL"
7. Save it somewhere safe

### 3️⃣ Deploy to Vercel (2 minutes)

```bash
# Install Vercel CLI (one-time only)
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Follow the prompts (just press Enter for defaults).

### 4️⃣ Add Your Webhook (1 minute)

After deployment finishes:

1. Go to the Vercel URL shown in terminal
2. It will open your project dashboard
3. Go to **Settings** → **Environment Variables**
4. Add:
   - Name: `DISCORD_WEBHOOK_URL`
   - Value: Paste your webhook URL from step 2
5. Click Save

### 5️⃣ Redeploy

```bash
vercel --prod
```

## Done! 🎉

Your bot is now live! It will:
- Check Warframe cycles every 5 minutes
- Send notifications when cycles change
- Track all locations: Cetus, Fortuna, Deimos, Earth

## Verify It's Working

Check logs:

```bash
vercel logs --follow
```

You should see messages like:
```
⏰ Cron job triggered
📡 Fetching cycle data...
✅ Cron job completed successfully
```

## What's Next?

- Wait for a cycle change to see your first notification
- Check [README.md](README.md) for customization options
- See [DEPLOYMENT.md](DEPLOYMENT.md) for troubleshooting

## Need Help?

**No notifications?**
- Make sure webhook URL is correct in Vercel settings
- Check logs: `vercel logs`
- Test manually: Visit `https://your-project.vercel.app/api/cron`

**Questions?**
- Read the full [README.md](README.md)
- Check [DEPLOYMENT.md](DEPLOYMENT.md)

---

Enjoy! 🎮

