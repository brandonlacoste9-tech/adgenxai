# Telemetry PR Summary

**Title**: `feat(telemetry): add comprehensive video generation event tracking`

**Type**: Feature / Observability

**Status**: Ready for Review

---

## Overview

This PR implements a comprehensive telemetry infrastructure for video generation requests across all providers (LongCat, Sora, Runway, Pika). The system tracks request metadata, costs, latency, and errors to enable real-time production observability for the newly deployed LongCat adapter.

**Key Benefits:**
- ✅ Per-provider latency monitoring
- ✅ Request cost tracking and optimization
- ✅ Error correlation via unique `requestId`
- ✅ Structured event logging for analytics integration
- ✅ Zero performance impact (async fire-and-forget)

---

## Changes

### New Files

#### 1. `/lib/telemetry/video-generation.ts` (Core Module)
**Purpose**: Centralized video generation telemetry tracking

**Exports**:
```typescript
export interface VideoGenerationEvent {
  requestId: string;
  provider: 'longcat' | 'sora' | 'runway' | 'pika';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  promptLength: number;
  duration?: number;
  videoDurationSeconds?: number;
  latencyMs: number;
  costEstimate?: number;
  errorCode?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export function trackVideoGeneration(event: VideoGenerationEvent): void
export function estimateCost(provider: string, durationSeconds: number): number
export function generateRequestId(): string
```

**Implementation Details**:
- `trackVideoGeneration()`: Logs structured JSON to console (TODO: production backend integration with Segment/Datadog)
- `estimateCost()`: Per-provider pricing model:
  - LongCat: $0.12/sec
  - Sora: $0.15/sec
  - Runway: $0.10/sec
  - Pika: $0.08/sec
- `generateRequestId()`: Generates unique correlation IDs with timestamp (format: `req-{timestamp}-{random}`)

**Example Usage**:
```typescript
const requestId = generateRequestId();
const startTime = Date.now();

try {
  const response = await client.generateVideo(request);
  trackVideoGeneration({
    requestId,
    provider: 'longcat',
    status: 'completed',
    promptLength: request.prompt.length,
    duration: request.duration,
    latencyMs: Date.now() - startTime,
    costEstimate: estimateCost('longcat', request.duration),
  });
} catch (error) {
  trackVideoGeneration({
    requestId,
    provider: 'longcat',
    status: 'failed',
    latencyMs: Date.now() - startTime,
    errorCode: error.name,
    errorMessage: error.message,
  });
}
```

#### 2. `/lib/telemetry/__tests__/video-generation.test.ts` (Test Suite)
**Coverage**: 13 comprehensive test cases

**Test Categories**:
1. **`trackVideoGeneration()` Tests** (5 cases):
   - Tracks successful generation with all fields
   - Handles missing optional fields
   - Tracks errors with error details
   - Includes metadata in events
   - Logs structured JSON to console

2. **`estimateCost()` Tests** (4 cases):
   - Correct per-provider pricing
   - Edge cases (0 duration, very long durations)
   - Rounding to 2 decimal places
   - Unsupported provider defaults to LongCat pricing

3. **`generateRequestId()` Tests** (2 cases):
   - Generates unique IDs
   - Validates timestamp components

4. **Integration Tests** (2 cases):
   - Complete lifecycle tracking (request → success)
   - Error tracking with cost implications

**All Tests Passing**: ✅

---

### Modified Files

#### 1. `/netlify/functions/sora-generate.ts`
**Changes**: Integrated comprehensive telemetry tracking

**New Behavior**:
1. Generates unique `requestId` at handler entry
2. Validates request and tracks validation failures
3. Checks `USE_LONGCAT` feature flag
4. Calls LongCat client with timeout and retry logic
5. Tracks successful generation with:
   - Request metadata (duration, aspect ratio, style)
   - Latency measurement
   - Estimated cost calculation
6. Tracks errors with:
   - Error code and message
   - Latency at failure point
7. Returns `X-Request-ID` header for client correlation

**Code Example**:
```typescript
import { trackVideoGeneration, generateRequestId, estimateCost } from '../../lib/telemetry/video-generation';
import { LongCatClient } from '../../app/lib/providers/longcat-client';

const handler = async (event, context) => {
  const requestId = generateRequestId();
  const startTime = Date.now();
  
  try {
    // ... validation ...
    
    const response = await longcatClient.generateVideo({ ... });
    const latencyMs = Date.now() - startTime;
    
    trackVideoGeneration({
      requestId,
      provider: 'longcat',
      status: response.status || 'queued',
      promptLength: prompt?.length || 0,
      duration,
      latencyMs,
      costEstimate: estimateCost('longcat', duration),
      metadata: { style, aspectRatio },
    });
    
    return { statusCode: 200, headers: { 'X-Request-ID': requestId }, ... };
  } catch (error) {
    // ... track error ...
  }
};
```

---

## Testing

### Test Results
```
Test Files:  11 passed (11)
Tests:       90 passed (90)  [+13 new telemetry tests]
Duration:    ~20s
```

### Manual Testing

**Local Testing with `netlify dev`**:
```bash
# Start local development environment
netlify dev

# Test video generation with telemetry
curl -X POST http://localhost:8888/.netlify/functions/sora-generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A futuristic city at sunset",
    "duration": 10,
    "aspectRatio": "16:9",
    "style": "cinematic"
  }'

# Check console output for telemetry event:
# {
#   "requestId": "req-1730549200-abc123def",
#   "provider": "longcat",
#   "status": "queued",
#   "promptLength": 25,
#   "duration": 10,
#   "latencyMs": 245,
#   "costEstimate": 1.2,
#   "metadata": { "style": "cinematic", "aspectRatio": "16:9" }
# }
```

---

## Environment Variables

**Required for Production**:
```bash
# Video Generation
LONGCAT_API_KEY=sk_live_xxxxx          # LongCat API key
USE_LONGCAT=1                           # Enable LongCat adapter (default: 0)
DEBUG_LONGCAT=0                         # Disable debug logging (default: 0)

# Telemetry (Future Backends)
# TELEMETRY_ENDPOINT=https://...       # For Segment/Datadog integration
# TELEMETRY_API_KEY=...                 # Analytics backend credentials
```

**Feature Flags**:
- `USE_LONGCAT=1`: Enable LongCat adapter (returns 501 if disabled)
- `DEBUG_LONGCAT=1`: Enable verbose logging for debugging (default: 0)

---

## Observability Queries

**Example Telemetry Metrics** (when integrated with backend):

### Cost Tracking
```json
{
  "metric": "video_generation_cost_usd",
  "provider": "longcat",
  "duration": 10,
  "value": 1.2,
  "timestamp": "2024-11-08T04:06:00Z"
}
```

### Latency Monitoring
```json
{
  "metric": "video_generation_latency_ms",
  "provider": "longcat",
  "p95": 450,
  "p99": 650,
  "mean": 245
}
```

### Error Tracking
```json
{
  "metric": "video_generation_errors",
  "provider": "longcat",
  "errorCode": "TIMEOUT",
  "count": 5,
  "timeWindow": "1h"
}
```

### Request Correlation
```json
{
  "requestId": "req-1730549200-abc123def",
  "provider": "longcat",
  "status": "completed",
  "latency": 245,
  "cost": 1.2,
  "timestamp": "2024-11-08T04:06:00Z"
}
```

---

## Production Rollout Plan

### Phase 1: Verification (30 minutes)
- [ ] Verify all tests pass: `npm run test`
- [ ] Check TypeScript: `npm run typecheck`
- [ ] Build success: `npm run build`
- [ ] Local testing: `netlify dev`

### Phase 2: Deployment (Automatic via GitHub Actions)
- [ ] Merge to main
- [ ] CI/CD pipeline runs
- [ ] CodeQL security check passes
- [ ] Netlify auto-deploys

### Phase 3: Smoke Tests (5-10 minutes)
```bash
# Test telemetry endpoint in production
curl -X POST https://adgenxai.netlify.app/.netlify/functions/sora-generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test", "duration": 5}'

# Verify requestId in response
# Verify X-Request-ID header in response
# Check logs for telemetry events
```

### Phase 4: Rollback Plan
If issues occur:
```bash
# Quick rollback: Disable LongCat adapter
netlify env:set USE_LONGCAT 0

# Full rollback: Revert commit
git revert 1e321b4 && git push
```

---

## Integration Roadmap

### Immediate (Next PR)
- [ ] Integrate with Segment/Datadog for production telemetry backend
- [ ] Set up dashboards for cost tracking and latency monitoring
- [ ] Configure alerts for error thresholds

### Short Term (Next 2 weeks)
- [ ] Add telemetry to LongCat client internals (retry logic, polling)
- [ ] Track video-status polling endpoint (`/.netlify/functions/sora-status`)
- [ ] Implement cost attribution per user/project

### Medium Term (Next 4 weeks)
- [ ] Add A/B testing support (provider randomization tracking)
- [ ] Implement provider failover telemetry
- [ ] Create admin dashboard for cost analysis

---

## Breaking Changes

**None** - This is purely additive telemetry. Existing functionality remains unchanged.

---

## Backwards Compatibility

✅ **Fully backwards compatible**:
- New telemetry module is optional
- Existing endpoints work unchanged
- Feature flag (`USE_LONGCAT`) provides safe fallback
- No database or schema changes

---

## Security Considerations

✅ **No sensitive data in telemetry**:
- RequestId is synthetic (not correlated to user data)
- Prompt content NOT logged (only length tracked)
- No authentication tokens in events
- All events fire-and-forget (no retention)

---

## Performance Impact

✅ **Negligible overhead**:
- Telemetry tracking is async/non-blocking
- JSON logging to console (minimal cost)
- No additional API calls for tracking
- Estimated overhead: < 1ms per request

---

## Related Issues

- **Depends on**: PR #101 (LongCat integration) ✅ Merged
- **Enables**: Production cost tracking and observability
- **Supports**: Future analytics dashboard

---

## Review Checklist

- [ ] Code quality and style
- [ ] Test coverage (90+ test cases total)
- [ ] Documentation clarity
- [ ] No sensitive data in logs
- [ ] Performance baseline acceptable
- [ ] TypeScript strict mode compliance
- [ ] Backwards compatibility verified

---

## Author Notes

This telemetry PR is designed as a "high value, low effort" follow-up to PR #101. It provides immediate visibility into video generation requests across all providers, enables cost tracking and optimization, and establishes a foundation for future analytics features.

**Key Design Decisions**:
1. **Fire-and-forget pattern**: Telemetry never blocks request handling
2. **Provider-agnostic**: Works with any video generation provider
3. **Cost modeling**: Per-provider pricing enables cost attribution
4. **RequestId correlation**: Enables full request tracing end-to-end

---

**Created**: 2024-11-08
**Status**: Ready for Review
**Estimated Review Time**: 10-15 minutes
**Estimated Merge Time**: < 2 minutes (squash merge)
