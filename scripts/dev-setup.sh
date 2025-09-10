#!/bin/bash

# PorPerto Development Setup Script

set -e

echo "🚀 Setting up PorPerto development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is required but not installed. Please install Docker Compose first."
    exit 1
fi

# Check for .env file
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your Google OAuth credentials:"
    echo "   - GOOGLE_CLIENT_ID"
    echo "   - GOOGLE_CLIENT_SECRET"
    read -p "Press Enter to continue after editing .env file..."
fi

# Start services
echo "🐳 Starting Docker services..."
docker compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker compose exec backend npx prisma migrate deploy

# Seed database
echo "🌱 Seeding database..."
docker compose exec backend npx prisma db seed

echo ""
echo "✅ Development environment is ready!"
echo ""
echo "🌐 Services:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo "   GraphQL:  http://localhost:4000/graphql"
echo "   Health:   http://localhost:4000/health"
echo ""
echo "🔧 Useful commands:"
echo "   docker compose logs -f backend   # View backend logs"
echo "   docker compose logs -f frontend  # View frontend logs"
echo "   docker compose exec backend npx prisma studio  # Database GUI"
echo "   docker compose down              # Stop all services"
echo ""
echo "📚 Next steps:"
echo "   1. Configure Google OAuth credentials in .env"
echo "   2. Visit http://localhost:3000 to test the application"
echo ""