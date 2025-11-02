# AdgenxAI Fusion v2 - Orchestration Documentation

## Overview

AdgenxAI Fusion v2 is a comprehensive voice-enabled Gemini orchestration platform that provides enterprise-grade AI development capabilities with full automation, testing, and deployment support.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   AdgenxAI Fusion v2                        │
├─────────────────────────────────────────────────────────────┤
│  Frontend Layer                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ Voice Dashboard │  │ REST API Tests  │                  │
│  │ (HTML/JS/CSS)   │  │ (.rest/.http)   │                  │
│  └─────────────────┘  └─────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│  API Layer                                                  │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ FastAPI Server  │  │ Streaming APIs  │                  │
│  │ (app.py)        │  │ (SSE/WebSocket) │                  │
│  └─────────────────┘  └─────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│  AI Integration Layer                                       │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ Gemini 2.5 Pro  │  │ Voice Processing│                  │
│  │ (Chat/Stream)   │  │ (TTS/STT)       │                  │
│  └─────────────────┘  └─────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│  Orchestration Layer                                        │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ Rehearsal Suite │  │ Health Checks   │                  │
│  │ (rehearse.sh)   │  │ (Monitoring)    │                  │
│  └─────────────────┘  └─────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure Layer                                       │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ Docker Support  │  │ CI/CD Pipeline  │                  │
│  │ (Containerized) │  │ (GitHub Actions)│                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Voice-Enabled Dashboard (`app.py`)

The main FastAPI application providing:
- **Real-time streaming** responses from Gemini 2.5 Pro
- **Voice interaction** capabilities (TTS/STT)
- **Session management** with persistent logging
- **Performance metrics** tracking
- **Export functionality** for logs and analytics

**Key Endpoints:**
- `GET /` - Main dashboard interface
- `POST /chat` - Standard chat interaction
- `POST /stream` - Streaming responses
- `GET /health` - Health check
- `GET /rehearsal` - Trigger orchestration suite
- `GET /logs/export` - Export session logs

### 2. Orchestration Suite (`rehearse.sh`)

Comprehensive testing and validation system:
- **Environment validation** - Checks dependencies and configuration
- **Health monitoring** - Validates all endpoints
- **API testing** - Comprehensive endpoint validation
- **Performance testing** - Load and stress testing
- **Docker validation** - Container build and deployment tests
- **Reporting** - Detailed JSON reports with metrics
- **Notifications** - Slack integration for team alerts

**Phases:**
1. Environment Check
2. Application Health Check
3. API Endpoint Testing
4. Log Export Test
5. Rehearsal Endpoint Test
6. File Structure Validation
7. Docker Test
8. Report Generation
9. Slack Notification

### 3. Developer Tools

**VS Code Integration:**
- Custom terminal profile with auto-banner
- REST Client configuration for API testing
- Python debugging configuration
- Extension recommendations

**JetBrains Integration:**
- HTTP Client request files
- Docker integration
- Python environment configuration

### 4. Containerization

**Docker Support:**
- Multi-stage builds for optimization
- Health checks for monitoring
- Volume mounts for persistence
- Environment variable configuration

**Docker Compose:**
- Service orchestration
- Development and production profiles
- Automated rehearsal execution
- Log aggregation

### 5. CI/CD Pipeline

**GitHub Actions Workflow:**
- Automated testing on push/PR
- Scheduled daily rehearsals
- Security scanning with Trivy
- Artifact collection and storage
- Slack notifications for failures

## Usage Patterns

### Local Development

```bash
# Quick start
git clone <repository>
cd adgenxai-fusion
cp .env.example .env
make dev-setup
python app.py
```

### Orchestrated Testing

```bash
# Full rehearsal suite
make rehearse CONTEXT=dev

# Docker rehearsal
make docker-rehearse

# Endpoint testing only
make test
```

### Production Deployment

```bash
# Docker deployment
make deploy

# Manual deployment
docker compose up -d fusion
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Gemini API key | Required |
| `SLACK_WEBHOOK_URL` | Slack notifications | Optional |
| `PORT` | Application port | 8000 |
| `CONTEXT` | Runtime context | dev |
| `NOTIFY` | Enable notifications | true |

### Contexts

- **dev** - Development environment
- **staging** - Staging environment
- **production** - Production environment
- **ci** - Continuous integration
- **rehearsal** - Testing environment
- **docker** - Container environment

## Monitoring and Observability

### Health Checks

- Application startup validation
- Endpoint availability monitoring
- Gemini API connectivity
- Resource utilization tracking

### Logging

- Structured JSON logging
- Session-based log aggregation
- Performance metrics collection
- Error tracking and alerting

### Metrics

- Response latency tracking
- Token usage monitoring
- Session analytics
- Error rate calculation

## Security

### API Security

- Environment variable protection
- Input validation and sanitization
- Rate limiting ready
- CORS configuration

### Container Security

- Trivy vulnerability scanning
- Non-root user execution
- Minimal base images
- Security policy enforcement

## Troubleshooting

### Common Issues

1. **Gemini API Key Missing**
   - Symptom: Demo mode responses
   - Solution: Configure `GOOGLE_API_KEY` in `.env`

2. **Port Already in Use**
   - Symptom: Application startup failure
   - Solution: Change `PORT` in `.env` or stop conflicting service

3. **Docker Build Failures**
   - Symptom: Container build errors
   - Solution: Check Docker daemon and image dependencies

4. **Rehearsal Failures**
   - Symptom: Test suite errors
   - Solution: Review logs in `logs/` directory

### Debug Commands

```bash
# Check application logs
tail -f logs/fusion_*.log

# Test specific endpoint
curl -X GET http://localhost:8000/health

# Validate Docker setup
docker compose config

# Run minimal test
python -c "import app; print('App module OK')"
```

## Performance Optimization

### Recommended Settings

- **Production**: Use `uvicorn` with multiple workers
- **Development**: Enable hot reload with single worker
- **Testing**: Disable external notifications
- **CI**: Use minimal logging for speed

### Scaling Considerations

- Horizontal scaling with load balancer
- Database integration for session persistence
- Redis caching for frequently accessed data
- CDN integration for static assets

## Integration Points

### Supabase Codex

Store orchestration runbooks and documentation in Supabase with:
```sql
slug: "adgenxai_fusion_orchestration"
title: "Fusion v2 Orchestration Guide"
content: [This documentation]
```

### Notion Runbook

Embed this documentation in Notion workspace for team access.

### Public Documentation

Consider publishing sanitized version as GitHub Pages or public Gist.

## Roadmap

### Version 2.1 (Planned)

- WebSocket support for real-time collaboration
- Advanced voice commands and natural language control
- Integration with additional AI models
- Enhanced monitoring dashboard
- Multi-tenant support

### Version 2.2 (Future)

- Kubernetes deployment templates
- Advanced security features
- Performance analytics dashboard
- Plugin architecture for extensions
- Cloud provider integrations

---

**Last Updated:** November 2025  
**Version:** 2.0.0  
**Maintainer:** AdgenxAI Labs