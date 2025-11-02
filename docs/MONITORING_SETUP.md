# Production Monitoring & Analytics Setup Guide

## 📊 Overview
AdGenXAI now includes comprehensive production monitoring, error tracking, analytics, and observability features.

## 🔧 Setup Instructions

### 1. Sentry Configuration

**Add to Netlify Environment Variables:**
```bash
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_RELEASE=adgenxai@1.0.0
```

**Features Enabled:**
- ✅ Frontend error tracking
- ✅ Backend error tracking (Netlify Functions)
- ✅ Performance monitoring
- ✅ Session replay for debugging
- ✅ Release tracking
- ✅ Custom breadcrumbs

### 2. Analytics Configuration

**Optional: Google Analytics 4**
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Custom Analytics Endpoint:**
The system includes a built-in analytics endpoint at `/api/analytics` that tracks:
- Page views
- User actions
- Campaign events
- API usage
- Business metrics
- Web vitals

### 3. Alert Configuration

**Slack Notifications:**
```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**Discord Notifications:**
```bash
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/WEBHOOK/URL
```

**Email Alerts:**
```bash
EMAIL_ALERT_ENDPOINT=https://your-email-service.com/send
ALERT_EMAIL_RECIPIENTS=admin@example.com,ops@example.com
```

### 4. Service Health Monitoring

**Configure API Credentials:**
```bash
# Instagram/Facebook
FB_ACCESS_TOKEN=your_facebook_access_token

# TikTok
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token

# YouTube
YOUTUBE_API_KEY=your_youtube_api_key

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Bee Agent
BEE_API_URL=https://your-bee-agent.com

# Sensory Cortex
SENSORY_CORTEX_URL=https://your-cortex.netlify.app
NEXT_PUBLIC_SENSORY_CORTEX_URL=https://your-cortex.netlify.app
```

## 📈 Monitoring Endpoints

### Health Check
```bash
GET /.netlify/functions/health
GET /.netlify/functions/health?detailed=true
```

**Response:**
```json
{
  "status": "legendary",
  "uptime": "Always up",
  "models": ["GPT-4-Turbo", "Claude-3.5-Sonnet"],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "overall": "healthy",
    "checks": [...]
  }
}
```

### Monitoring Dashboard
```bash
GET /.netlify/functions/monitoring-dashboard
```

**Response:**
```json
{
  "status": "healthy",
  "health": { ... },
  "system": { ... },
  "performance": { ... },
  "business": { ... }
}
```

## 🎯 Key Features

### Error Tracking
- **Automatic error capture** with Sentry
- **Custom error boundaries** for React components
- **Breadcrumbs** for debugging context
- **Release tracking** for version correlation

### Performance Monitoring
- **Core Web Vitals** tracking (LCP, FID, CLS, FCP, TTFB)
- **API response time** monitoring
- **Function execution time** tracking
- **Memory usage** monitoring
- **Custom performance metrics**

### Analytics
- **Page view tracking**
- **User action tracking**
- **Campaign event tracking**
- **Conversion funnel analysis**
- **Business metrics tracking**
- **API usage analytics**

### Health Checks
- **Service availability** monitoring
- **API health checks** for third-party services
- **Latency tracking**
- **Degradation detection**

### Alerting
- **Configurable alert thresholds**
- **Multi-channel notifications** (Slack, Discord, Email)
- **Severity-based routing**
- **Automatic incident reporting**

### Security Monitoring
- **Failed authentication tracking**
- **Rate limit violation detection**
- **Suspicious API usage patterns**
- **DDoS attack detection**
- **Audit logging** for data access
- **Security incident alerts**

## 💻 Usage Examples

### Track Custom Events
```typescript
import { trackAnalyticsEvent } from '@/lib/monitoring';

trackAnalyticsEvent('campaign_created', {
  campaignId: 'abc123',
  platform: 'instagram',
  type: 'image_post',
});
```

### Track Errors
```typescript
import { captureError } from '@/lib/monitoring';

try {
  await riskyOperation();
} catch (error) {
  captureError(error, { 
    operation: 'riskyOperation',
    userId: user.id 
  });
}
```

### Monitor Performance
```typescript
import { measureExecutionTime } from '@/lib/monitoring';

const result = await measureExecutionTime(
  'data-fetch',
  () => fetchData()
);
```

### Track Security Events
```typescript
import { trackSecurityEvent } from '@/lib/monitoring';

trackSecurityEvent('failed_authentication', {
  ip: request.ip,
  userAgent: request.headers['user-agent'],
  attemptCount: 3,
});
```

### Add Error Boundary
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

function MyComponent() {
  return (
    <ErrorBoundary>
      <RiskyComponent />
    </ErrorBoundary>
  );
}
```

## 🔔 Alert Types

### Error Rate Alert
- **Threshold:** 5% error rate
- **Severity:** Error
- **Channels:** Slack, Discord

### Slow Response Time
- **Threshold:** 3000ms
- **Severity:** Warning
- **Channels:** Slack

### Service Down
- **Severity:** Critical
- **Channels:** Slack, Discord, Email

### High API Usage
- **Threshold:** 80% of rate limit
- **Severity:** Warning
- **Channels:** Slack

### Security Incident
- **Severity:** Critical
- **Channels:** Slack, Discord, Email

## 📊 Monitoring Dashboard

Access the monitoring dashboard at:
```
https://your-app.netlify.app/dashboard/analytics
```

View real-time metrics:
- Total requests
- Success rate
- Average latency
- Error rate
- Model performance
- Daily trends
- Cost analysis

## 🧪 Testing

### Test Health Check
```bash
curl https://your-app.netlify.app/.netlify/functions/health
```

### Test Monitoring Dashboard
```bash
curl https://your-app.netlify.app/.netlify/functions/monitoring-dashboard
```

### Test Alerts (Development)
```typescript
import { triggerAlert } from '@/lib/monitoring';

triggerAlert('HIGH_ERROR_RATE', 'Test alert message', {
  errorRate: '10%',
  threshold: '5%',
});
```

## 🎯 Success Metrics

✅ **Real-time error tracking** with < 1 minute detection time  
✅ **99.9% uptime monitoring** and alerting  
✅ **Performance baseline** established with trend analysis  
✅ **Security incidents** detected and logged  
✅ **Business metrics dashboard** provides actionable insights  
✅ **Cost optimization** based on usage analytics

## 📚 Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Netlify Functions Monitoring](https://docs.netlify.com/monitor-sites/analytics/)
- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)

## 🔐 Security Best Practices

1. **Never commit** Sentry DSN or webhook URLs to version control
2. **Use environment variables** for all sensitive configuration
3. **Rotate tokens** regularly for third-party services
4. **Enable HTTPS only** for webhook URLs
5. **Monitor alert channels** regularly
6. **Review security logs** weekly
7. **Test alerts** in staging before production

## 🚀 Deployment

The monitoring system is automatically enabled when you deploy to Netlify. Simply:

1. Add environment variables to Netlify dashboard
2. Deploy your application
3. Verify health check endpoint
4. Test alerts
5. Monitor dashboard for incoming data

## 🛠️ Troubleshooting

### No data in Sentry
- Verify `SENTRY_DSN` is set correctly
- Check browser console for initialization errors
- Ensure Sentry is not blocked by ad blockers

### Alerts not sending
- Verify webhook URLs are correct
- Test webhook URLs manually with curl
- Check function logs in Netlify dashboard

### Health checks failing
- Verify API credentials are set
- Check service status pages
- Review function logs for errors

### Performance data missing
- Ensure Web Vitals library is loaded
- Check `/api/analytics` endpoint
- Verify browser supports Performance API

## 📞 Support

For issues or questions:
1. Check function logs in Netlify dashboard
2. Review Sentry error dashboard
3. Check monitoring dashboard for system health
4. Contact support team via configured alert channels
