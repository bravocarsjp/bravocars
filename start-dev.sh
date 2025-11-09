#!/bin/bash

# BRAVOCARS Development Startup Script
# This script starts both backend and frontend development servers

echo "🚀 Starting BRAVOCARS Development Environment..."
echo ""

# Check if Docker services are running
echo "📦 Checking Docker services..."
cd "$(dirname "$0")"

if ! docker ps | grep -q bravocars-postgres; then
    echo "⚠️  PostgreSQL not running. Starting Docker services..."
    docker-compose up -d
    echo "⏳ Waiting for services to be healthy..."
    sleep 5
else
    echo "✅ Docker services already running"
fi

# Start Backend
echo ""
echo "🔧 Starting Backend API..."
cd Backend
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && dotnet watch run --project CarAuction.API/CarAuction.API.csproj"'

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 8

# Start Frontend
echo ""
echo "🎨 Starting Frontend..."
cd ../Frontend
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm run dev"'

echo ""
echo "✅ Development environment started!"
echo ""
echo "📝 Service URLs:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:5142"
echo "   Swagger:   http://localhost:5142/swagger"
echo "   PostgreSQL: localhost:5432"
echo "   Redis:     localhost:6379"
echo ""
echo "🔑 Admin Credentials:"
echo "   Email:    admin@bravocars.com"
echo "   Password: Admin@123456"
echo ""
echo "💡 To stop services:"
echo "   - Close the Terminal windows"
echo "   - Run: docker-compose down"
