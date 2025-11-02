# AdgenxAI Fusion v2 - Makefile
.PHONY: help install run rehearse docker-build docker-run docker-rehearse clean test

# Default target
help:
	@echo "🧠 AdgenxAI Fusion v2 - Available Commands"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  install         Install Python dependencies"
	@echo "  run             Run Fusion dashboard locally"
	@echo "  rehearse        Run orchestration rehearsal"
	@echo "  docker-build    Build Docker image"
	@echo "  docker-run      Run in Docker container"
	@echo "  docker-rehearse Run rehearsal in Docker"
	@echo "  test            Run endpoint tests"
	@echo "  clean           Clean logs and temporary files"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	pip install -r requirements.txt

# Run application
run:
	@echo "🚀 Starting Fusion v2..."
	python app.py

# Run rehearsal with context
# AdgenxAI Fusion v2 Makefile
CONTEXT ?= dev
EVENT_ID ?= adgenxai_fusion
PORT ?= 8000
NOTIFY ?= true

# Default Rehearsal Workflow
rehearse:
	@echo "Starting AdgenxAI Fusion rehearsal (context=$(CONTEXT))"
	@CONTEXT=$(CONTEXT) EVENT_ID=$(EVENT_ID) PORT=$(PORT) NOTIFY=$(NOTIFY) \
	SLACK_WEBHOOK_URL=$(SLACK_WEBHOOK_URL) \
	bash ./rehearse.sh $(CONTEXT)

# Dockerized Rehearsal
docker-rehearse:
	docker compose up --build rehearsal

# Build Containers
docker-build:
	docker compose build

# Run Containers
docker-up:
	docker compose up -d adgenxai_fusion

# Reset Development Environment
reset:
	@echo "⚠  Executing full project reset..."
	@bash ./uninstall.sh

# Bump version
bump:
	@bash ./bump_version.sh $(v)

.PHONY: rehearse docker-rehearse docker-build docker-up reset bump

# Docker commands
docker-build:
	@echo "🐳 Building Docker image..."
	docker build -t adgenxai-fusion:latest .

docker-run: docker-build
	@echo "🐳 Running in Docker..."
	docker run -p 8000:8000 --env-file .env adgenxai-fusion:latest

docker-rehearse:
	@echo "🐳 Running Docker rehearsal..."
	docker compose up --build rehearsal

# Test endpoints
test:
	@echo "🔧 Testing endpoints..."
	bash test_fusion_endpoints.sh

# Clean up
clean:
	@echo "🧹 Cleaning up..."
	rm -rf logs/*.log
	rm -rf __pycache__
	rm -rf .pytest_cache
	docker system prune -f

# Development setup
dev-setup: install
	@echo "⚙️ Setting up development environment..."
	cp .env.example .env
	mkdir -p logs speech
	@echo "✅ Development setup complete!"

# Production deployment
deploy:
	@echo "🚀 Deploying Fusion v2..."
	docker compose up -d fusion

# Monitor logs
logs:
	@echo "📋 Monitoring logs..."
	tail -f logs/*.log