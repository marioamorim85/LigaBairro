#!/bin/bash

# PorPerto Development Reset Script

set -e

echo "🔄 Resetting PorPerto development environment..."

# Stop and remove containers
echo "🛑 Stopping containers..."
docker compose down

# Remove volumes (optional)
read -p "Do you want to remove database data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing database volume..."
    docker compose down -v
    docker volume rm porperto_postgres_data 2>/dev/null || true
fi

# Remove images (optional)
read -p "Do you want to remove Docker images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing Docker images..."
    docker rmi porperto_backend porperto_frontend 2>/dev/null || true
fi

# Clean up Docker
echo "🧹 Cleaning up Docker system..."
docker system prune -f

echo "✅ Development environment reset complete!"
echo ""
echo "To restart:"
echo "   ./scripts/dev-setup.sh"