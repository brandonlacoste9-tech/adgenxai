# 🐝 Bee Ship — Autonomous Creative Publishing

**Bee Ship** is your serverless swarm engine that generates, renders, and publishes creatives to Instagram, TikTok, and YouTube automatically.

---

## ⚡ Quick Start

### 1. Add Environment Variables

In **Netlify → Site Settings → Environment**, add:

```bash
BEE_API_URL=https://www.adgenxai.pro/api
BEE_API_KEY=<your-bee-api-key>
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
INSTAGRAM_ACCOUNT_ID=<instagram-business-id>
FB_ACCESS_TOKEN=<long-lived-token>
```

### 2. Create Supabase Storage Bucket

```sql
-- In Supabase SQL editor:
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true);
```

### 3. Deploy

```bash
git add netlify/functions/bee-ship.ts lib/ scripts/
git commit -m "feat(bee): add bee-ship autonomous publishing"
git push
```

Netlify will auto-deploy the function to:
```
https://your-site.netlify.app/.netlify/functions/bee-ship
```

### 4. Ship a Creative

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/bee-ship \
  -H "Content-Type: application/json" \
  -d '{"seed":"promo-summer","platforms":["instagram"]}'
```

---

## 🧱 Architecture

```
┌─────────────┐
│   Trigger   │ (cron, webhook, manual)
└──────┬──────┘
       │
       v
┌──────────────────┐
│   bee-ship.ts    │
│  (Netlify Fn)    │
└────┬─────────────┘
     │
     ├─► 1. Call Bee Agent API → get creative
     │
     ├─► 2. (Optional) Render video via microservice
     │
     ├─► 3. Upload to Supabase Storage
     │
     └─► 4. Publish to platforms:
         ├─ Instagram (Graph API)
         ├─ TikTok (Content Posting API)
         └─ YouTube (Data API v3)
```

---

## 📦 Files

| Path | Purpose |
|------|---------|
| `netlify/functions/bee-ship.ts` | Main serverless handler |
| `lib/platforms/instagram.ts` | Instagram Graph API helpers |
| `lib/platforms/tiktok.ts` | TikTok Content Posting API integration |
| `lib/platforms/youtube.ts` | YouTube API stub (use googleapis) |
| `lib/renderer.ts` | Optional external renderer client |
| `scripts/ship-swarm.sh` | Bash bulk deploy script |
| `scripts/ship-swarm.ps1` | PowerShell bulk deploy script |
| `.env.bee-ship` | Environment variable template |

---

## 🔐 Platform Setup

### Instagram / Facebook

1. Create a **Facebook App** at https://developers.facebook.com
2. Add **Instagram Basic Display** + **Instagram Content Publishing** products
3. Get a **long-lived Page Access Token**:
   ```bash
   # Short-lived token → Long-lived (60 days)
   curl "https://graph.facebook.com/v17.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
   ```
4. Get Instagram Business Account ID:
   ```bash
   curl "https://graph.facebook.com/v17.0/me/accounts?access_token=LONG_LIVED_TOKEN"
   # Then get IG account:
   curl "https://graph.facebook.com/v17.0/PAGE_ID?fields=instagram_business_account&access_token=LONG_LIVED_TOKEN"
   ```

### TikTok

1. Apply for **TikTok Developer** access: https://developers.tiktok.com
2. Create an app and enable **Content Posting API**
3. Complete the OAuth flow to capture the **user access token** and `open_id`
4. Store `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `TIKTOK_ACCESS_TOKEN`, and `TIKTOK_OPEN_ID` in Netlify

### YouTube

1. Create a **Google Cloud Project**: https://console.cloud.google.com
2. Enable **YouTube Data API v3**
3. Create **OAuth 2.0 credentials** (Web application)
4. Get refresh token via OAuth flow:
   ```bash
   # Use googleapis or manual OAuth flow
   # Store refresh token securely in Netlify env
   ```

---

## 🚀 Bulk Ship (Swarm Mode)

### Bash
```bash
chmod +x scripts/ship-swarm.sh
./scripts/ship-swarm.sh "https://your-site.netlify.app/.netlify/functions/bee-ship" "instagram"
```

### PowerShell
```powershell
.\scripts\ship-swarm.ps1 -ApiUrl "https://your-site.netlify.app/.netlify/functions/bee-ship" -Platforms "instagram"
```

---

## 🧪 Test Locally

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run functions locally
netlify dev

# Test function
curl -X POST http://localhost:8888/.netlify/functions/bee-ship \
  -H "Content-Type: application/json" \
  -d '{"seed":"test-campaign","platforms":["instagram"]}'
```

---

## 🔄 CI/CD Integration

### GitHub Actions (example)

```yaml
name: Ship Bee Swarm
on:
  schedule:
    - cron: "0 10 * * *" # Daily at 10am UTC
  workflow_dispatch:

jobs:
  ship:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Ship swarm
        run: ./scripts/ship-swarm.sh "${{ secrets.BEE_SHIP_URL }}" "instagram,tiktok"
```

---

## 🛡️ Security Notes

- **Never commit tokens** — use Netlify Environment Variables or secrets manager
- **Enable approval flow** for production (add a review step before publish)
- **Rate limits** — respect platform quotas (Instagram: 25 posts/day, TikTok varies)
- **Content policy** — ensure generated creatives comply with platform rules

---

## 📊 Monitoring

View function logs in Netlify:
```
Site Settings → Functions → bee-ship → Function log
```

Or tail locally:
```bash
netlify functions:tail bee-ship
```

---

## 🎯 Next Steps

1. ✅ Wire feedback loop: track impressions/CTR → feed to Bee agents
2. ✅ Add scheduling: use Netlify Scheduled Functions or external cron
3. ✅ Monitor TikTok/YouTube flows (both integrations ship in `lib/platforms/`)
4. ✅ Add approval UI: create dashboard for review before publish
5. ✅ Scale: deploy renderer microservice (puppeteer + ffmpeg) on Fly.io/Railway

---

## 💬 Support

Questions? Open an issue or reach out to the Beehive team.

**Happy shipping! 🐝**
