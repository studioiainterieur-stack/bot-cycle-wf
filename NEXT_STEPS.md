# Next Steps 🚀

Your Warframe Cycle Bot is ready! Here's what to do next.

## Immediate Actions

### 1. Install Dependencies
```bash
cd /Users/zelenion/Desktop/BOT
npm install
```

### 2. Create Discord Webhook
1. Open Discord → Your Server
2. Server Settings → Integrations → Webhooks
3. New Webhook → Copy URL

### 3. Deploy to Vercel
```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 4. Add Environment Variable
In Vercel Dashboard:
- Settings → Environment Variables
- Add `DISCORD_WEBHOOK_URL` = your webhook URL
- Save and redeploy

## Testing

### Local Test (Optional)
```bash
# Create .env.local file
cp .env.local.example .env.local

# Add your webhook URL to .env.local
# DISCORD_WEBHOOK_URL=https://...

# Run locally
vercel dev

# Test in another terminal
curl http://localhost:3000/api/cron
```

### Production Test
```bash
# Check logs
vercel logs --follow

# Or manually trigger
curl https://your-project.vercel.app/api/cron
```

## What Happens Next

1. **Cron job starts** - Runs every 5 minutes automatically
2. **First check** - Stores baseline cycle states (no notification)
3. **Subsequent checks** - Compares and detects changes
4. **Notifications** - Sent when cycles change (day→night or night→day)

## Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Discord webhook created
- [ ] Deployed to Vercel (`vercel --prod`)
- [ ] Environment variable set in Vercel
- [ ] Redeployed after adding variable
- [ ] Logs show cron running every 5 minutes
- [ ] First notification received (wait for cycle change)

## Expected Behavior

### First Run
```
⏰ Cron job triggered
📡 Fetching cycle data...
📊 Fetched 4 cycles: cetus=day, vallis=night, cambion=day, earth=night
📝 First check - storing initial states
✅ Cron job completed successfully
```

### Subsequent Runs (No Change)
```
⏰ Cron job triggered
📡 Fetching cycle data...
📊 Fetched 4 cycles: cetus=day, vallis=night, cambion=day, earth=night
🔍 Checking for cycle changes...
✅ No cycle changes detected
✅ Cron job completed successfully
```

### When a Cycle Changes
```
⏰ Cron job triggered
📡 Fetching cycle data...
📊 Fetched 4 cycles: cetus=night, vallis=night, cambion=day, earth=night
🔍 Checking for cycle changes...
🔔 Change detected in cetus: day → night
📢 Sending notifications for 1 cycle change(s)
✅ Sent notification for cetus: night
✅ Cron job completed successfully
```

## Customization Options

### Change Check Frequency
Edit `vercel.json`:
```json
"schedule": "*/10 * * * *"  // Every 10 minutes instead of 5
```

### Modify Notification Style
Edit `src/services/discord.ts` → `createCycleEmbed()`

### Add Role Mentions
In `src/services/discord.ts`, add `content` field:
```typescript
const payload = {
  content: '<@&ROLE_ID> Cycle changed!',
  embeds: [embed],
};
```

### Track Specific Locations Only
Edit `src/services/warframe.ts` → `fetchAllCycles()` to filter locations

## Troubleshooting

### No notifications?
- Check webhook URL is correct
- Verify cron is active in Vercel dashboard
- Wait for a cycle to actually change
- Check logs: `vercel logs`

### Rate limiting?
- Increase delay in `src/utils/cycle-tracker.ts`
- Currently 1 second between notifications

### "Configuration error"?
- Add `DISCORD_WEBHOOK_URL` to Vercel environment variables
- Redeploy after adding

## Documentation

- **[README.md](README.md)** - Full documentation
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed deployment guide
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Code architecture

## Support

Need help?
1. Check the documentation files above
2. Review Vercel logs: `vercel logs`
3. Test the endpoint manually
4. Check [Vercel docs](https://vercel.com/docs)
5. Check [Discord.js docs](https://discord.js.org)

## Future Enhancements

Consider adding:
- 🎯 Slash commands to query cycles
- 📊 Statistics and history
- 🔔 Configurable notifications per location
- 💾 Persistent state with Vercel Blob
- 🎨 Customizable embed colors and messages
- 👥 Role mentions for specific cycles

---

**Ready?** Start with step 1: `npm install`

Good luck, Tenno! 🎮

