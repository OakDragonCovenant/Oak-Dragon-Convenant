# Railway Deployment for Strategos Protocol
# FREE 24/7 Trading Bot Setup

## Step 1: Prepare for Railway Deployment

### Create railway.json configuration
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}

### Environment Variables for Railway:
- COINBASE_API_KEY=a539d51e-b569-4852-bc0f-a8cd77b5d0fe
- COINBASE_API_SECRET=brJ6dqHsLrAkn7zsCobrY6T/TRyr8ebBcAbTd1h0Pq4YEG0AsqpwhmljCI82Kqs5Hqve7UwcWO7LbI3r3poxXg==
- NODE_ENV=production
- PORT=3000

## Step 2: Deploy to Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project
4. Connect your GitHub repository
5. Add environment variables
6. Deploy!

## Step 3: Monitor Your 24/7 Trading

Your bot will run continuously on Railway's infrastructure.
Monitor at: https://your-app.railway.app

## Alternative: Heroku (if Railway reaches limits)
- 1000 dyno hours free per month
- Add-ons available for database
- Easy Git-based deployment

## Cost Breakdown:
- Railway: FREE for first 500 hours (~20 days)
- After free tier: $5/month
- Database: Included in Railway
- Monitoring: Free tier available

## Scaling Strategy:
1. Start with Railway free tier
2. Monitor performance and costs
3. Upgrade to paid tiers as profits grow
4. Move to AWS when revenue justifies it
