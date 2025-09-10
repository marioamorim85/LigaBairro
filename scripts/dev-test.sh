#!/bin/bash

# PorPerto Development Test Script

set -e

echo "🧪 Running PorPerto tests..."

# Backend tests
echo "🔧 Running backend tests..."
docker compose exec backend npm run test

# Backend e2e tests
echo "🔧 Running backend e2e tests..."
docker compose exec backend npm run test:e2e

# Frontend type check
echo "🎨 Running frontend type check..."
docker compose exec frontend npm run type-check

# Frontend linting
echo "🎨 Running frontend linting..."
docker compose exec frontend npm run lint

# Check health endpoints
echo "🏥 Checking health endpoints..."
curl -f http://localhost:4000/health/live || echo "❌ Health check failed"
curl -f http://localhost:4000/health/ready || echo "❌ Ready check failed"

echo "✅ All tests completed!"