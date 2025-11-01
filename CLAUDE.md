# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ IMPORTANT: Project Progress Tracking

**ALWAYS check `TODO.md` first when asked about project status or progress!**

- `TODO.md` contains the complete list of accomplished tasks with dates
- `TODO.md` is the single source of truth for project progress
- DO NOT re-check the codebase from the beginning
- Update `TODO.md` whenever tasks are completed
- Add new tasks to `TODO.md` as they are identified

## Project Overview

BRAVOCARS is a high-traffic car auction platform being built in phases:
- **Current Phase**: Phase 0 - Environment Setup & Project Structure
- **Architecture**: Clean Architecture with .NET 9 backend, React TypeScript frontend
- **Database**: PostgreSQL with Entity Framework Core
- **Cache**: Redis for distributed locking and caching
- **Real-time**: SignalR for live bidding updates
- **Structure**: Monorepo with Backend and Frontend directories

### Deferred Features (Later Phases):
- Mobile app (React Native)
- Payment integration (Stripe)
- Push notifications (Firebase)
- Registration fee payment

## Architecture

### Backend (.NET 9 Web API - Clean Architecture)
- **Architecture**: Clean Architecture with 4 layers (Domain, Application, Infrastructure, API)
- **Framework**: .NET 9 with ASP.NET Core Web API
- **Solution**: `Backend/CarAuction.sln`
- **Projects**:
  - `CarAuction.Domain` - Core business entities and rules (no dependencies)
  - `CarAuction.Application` - Business logic, DTOs, interfaces
  - `CarAuction.Infrastructure` - Data access, external services (EF Core, Redis, Email)
  - `CarAuction.API` - HTTP endpoints, middleware, DI configuration
- **Entry Point**: `Backend/Program.cs`
- **Port**: `http://localhost:5142`
- **CORS**: Configured to allow requests from `http://localhost:5173` (React frontend)

### Frontend (React + Vite)
- **Framework**: React 19.1.1 with Vite 7.1.7
- **Port**: `http://localhost:5173`
- **Proxy Configuration**: Vite proxies `/api/*` requests to `http://localhost:5142`, stripping the `/api` prefix
- **Entry Point**: `Frontend/src/main.jsx`
- **Main Component**: `Frontend/src/App.jsx`

### Frontend-Backend Communication
- Frontend makes API calls using `/api/*` routes (e.g., `/api/weatherforecast`)
- Vite dev server proxies these to the backend, rewriting `/api/weatherforecast` → `/weatherforecast`
- Backend CORS policy explicitly allows the frontend origin

## Common Commands

### Docker Services (PostgreSQL + Redis)
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Start with pgAdmin (database management UI)
docker-compose --profile tools up -d

# Rebuild containers
docker-compose up -d --build
```

**Service URLs:**
- PostgreSQL: `localhost:5432` (Database: bravocars, User: postgres, Password: postgres)
- Redis: `localhost:6379`
- pgAdmin: `http://localhost:5050` (Email: admin@bravocars.com, Password: admin)

### Backend Development
```bash
cd Backend

# Build entire solution
dotnet build CarAuction.sln

# Run the API with hot reload
dotnet watch run --project CarAuction.API.csproj

# Run specific project
dotnet run --project CarAuction.API.csproj

# Build specific project
dotnet build CarAuction.Domain/CarAuction.Domain.csproj

# Entity Framework migrations (when EF is added)
dotnet ef migrations add <name> --project CarAuction.Infrastructure --startup-project CarAuction.API
dotnet ef database update --project CarAuction.Infrastructure --startup-project CarAuction.API
```

### Frontend Development
```bash
cd Frontend
npm install                   # Install dependencies
npm run dev                   # Start development server
npm run build                 # Build for production
npm run lint                  # Run ESLint
npm run preview               # Preview production build
```

### Running the Full Stack
```bash
# 1. Start Docker services (PostgreSQL + Redis)
docker-compose up -d

# 2. Start Backend (Terminal 1)
cd Backend && dotnet watch run --project CarAuction.API.csproj

# 3. Start Frontend (Terminal 2)
cd Frontend && npm run dev
```

### Environment Setup
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Update .env with your local configuration
# Edit JWT_SECRET, EMAIL credentials, etc.

# 3. Backend will read from .env automatically
```

## Key Files

- `TODO.md` - **Project progress tracker and task list (CHECK THIS FIRST!)**
- `docker-compose.yml` - Local development services (PostgreSQL, Redis, pgAdmin)
- `.env.example` - Environment variables template
- `.env` - Local environment configuration (not committed)
- `Backend/CarAuction.sln` - Solution file containing all backend projects
- `Backend/README.md` - Backend Clean Architecture documentation
- `Backend/CarAuction.API/Program.cs` - API entry point
- `Backend/CarAuction.Domain/` - Core business entities (no dependencies)
- `Backend/CarAuction.Application/` - Business logic and DTOs
- `Backend/CarAuction.Infrastructure/` - Data access and external services
- `Backend/CarAuction.API/` - API project directory
- `Frontend/vite.config.js` - Vite configuration including proxy setup
- `Frontend/src/App.jsx` - Main React component
- `Frontend/package.json` - NPM dependencies and scripts
- `Prompts/prompt.md` - Full project specification and phase breakdown

## Development Workflow

1. **First Time Setup:**
   ```bash
   # Copy environment file
   cp .env.example .env

   # Start Docker services
   docker-compose up -d

   # Verify services are running
   docker-compose ps

   # Install frontend dependencies
   cd Frontend && npm install
   ```

2. **Daily Development:**
   ```bash
   # Check Docker services are running
   docker-compose ps

   # Start backend with hot reload
   cd Backend && dotnet watch run

   # In another terminal, start frontend
   cd Frontend && npm run dev
   ```

3. **Database Migrations:**
   ```bash
   cd Backend
   dotnet ef migrations add MigrationName
   dotnet ef database update
   ```

## Troubleshooting

**Docker containers won't start:**
```bash
docker-compose down -v  # Remove volumes
docker-compose up -d    # Recreate
```

**Port already in use:**
- PostgreSQL (5432): Stop local PostgreSQL service
- Redis (6379): Stop local Redis service
- Backend (5142): Change port in Backend/Properties/launchSettings.json
- Frontend (5173): Change port in Frontend/vite.config.js

**Database connection issues:**
- Ensure Docker PostgreSQL container is running: `docker-compose ps`
- Check connection string in .env matches docker-compose.yml settings
- Test connection: `docker exec -it bravocars-postgres psql -U postgres -d bravocars`
