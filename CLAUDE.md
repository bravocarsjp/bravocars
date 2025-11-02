# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🔴 CRITICAL: Configuration & Conventions

**BEFORE MAKING ANY CHANGES, ALWAYS READ: `CONFIGURATION.md`**

The `CONFIGURATION.md` file contains:
- ✅ Working configurations that MUST NOT be changed
- ✅ JSON serialization conventions (camelCase)
- ✅ API routing and CORS settings
- ✅ Authentication and authorization rules
- ✅ Testing checklist before committing
- ✅ Common issues and how to prevent them

**Breaking these conventions will break existing functionality.**

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
npm run generate:api          # Generate TypeScript API client from Swagger
```

### API Client Generation (OpenAPI/Swagger)

The frontend uses **Orval** to auto-generate type-safe API clients from the backend's Swagger specification. This eliminates manual typing errors and ensures frontend-backend type safety.

**Configuration:**
- `Frontend/orval.config.ts` - Orval configuration
- `Frontend/src/api/axios-instance.ts` - Custom axios instance with auth interceptors
- Source: `http://localhost:5142/swagger/v1/swagger.json`
- Output: `Frontend/src/api/generated/`

**How it works:**
1. Backend exposes OpenAPI specification via Swagger
2. Orval reads the spec and generates TypeScript types and React Query hooks
3. Pre-commit hook automatically regenerates when backend API changes
4. All API calls are type-safe and auto-completed

**Generated files:**
```
Frontend/src/api/generated/
├── auth/auth.ts              # Auth endpoints (login, register, logout, etc.)
├── auctions/auctions.ts      # Auction endpoints
├── bids/bids.ts              # Bidding endpoints
├── cars/cars.ts              # Car management endpoints
├── admin/admin.ts            # Admin endpoints
└── models/                   # TypeScript type definitions
    ├── loginDto.ts
    ├── registerDto.ts
    └── ...
```

**Workflow:**

1. **Manual Generation** (when backend API changes):
   ```bash
   cd Frontend
   npm run generate:api
   ```

2. **Automatic Generation** (on git commit):
   - Pre-commit hook automatically runs `npm run generate:api`
   - Generated files are auto-staged if changed
   - Requires backend to be running on port 5142

3. **Using Generated Hooks** (in React components):
   ```javascript
   import { usePostApiAuthLogin } from '../api/generated/auth/auth';

   function LoginForm() {
     const loginMutation = usePostApiAuthLogin();

     const handleLogin = async (credentials) => {
       await loginMutation.mutateAsync({ data: credentials });
     };

     return <form onSubmit={handleLogin}>...</form>;
   }
   ```

**Custom Auth Hook:**
- `Frontend/src/hooks/useAuth.js` - Wraps generated hooks with auth state management
- Handles token storage, user state, and navigation
- Use this instead of direct generated hooks for auth operations

**Important Notes:**
- ⚠️ Backend MUST be running on port 5142 to generate API client
- ⚠️ Generated files should NOT be manually edited (they're auto-regenerated)
- ⚠️ Pre-commit hook skips generation if backend is not running
- ✅ All API types are auto-synced with backend DTOs
- ✅ React Query provides caching, loading states, and error handling
- ✅ Axios interceptor handles token refresh automatically

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
- `STARTUP.md` - **Detailed startup guide and troubleshooting**
- `start-dev.sh` - **One-command startup script**
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
- `Frontend/orval.config.ts` - Orval configuration for API client generation
- `Frontend/src/api/axios-instance.ts` - Custom axios instance with auth interceptors
- `Frontend/src/api/generated/` - Auto-generated API client (DO NOT EDIT)
- `Frontend/src/hooks/useAuth.js` - Custom auth hook wrapping generated API
- `.husky/pre-commit` - Git pre-commit hook for auto API regeneration
- `Prompts/prompt.md` - Full project specification and phase breakdown

## Development Workflow

### Quick Start (Recommended)
```bash
# One-command startup (starts Docker, Backend, and Frontend)
./start-dev.sh
```

See `STARTUP.md` for detailed startup instructions and troubleshooting.

### First Time Setup
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

### Daily Development

**Option 1 - Automated (Recommended):**
```bash
./start-dev.sh
```

**Option 2 - Manual:**
```bash
# 1. Start Docker services
docker-compose up -d

# 2. Start backend (Terminal 1)
cd Backend && dotnet watch run --project CarAuction.API/CarAuction.API.csproj

# 3. Start frontend (Terminal 2)
cd Frontend && npm run dev
```

**Important:** Always ensure the backend is running on port 5142 before using the frontend. Check with:
```bash
curl http://localhost:5142/swagger/index.html
```

3. **Database Migrations:**
   ```bash
   cd Backend
   dotnet ef migrations add MigrationName
   dotnet ef database update
   ```

## Troubleshooting

**See `STARTUP.md` for comprehensive troubleshooting guide.**

**Backend Connection Refused (Most Common Issue):**
```bash
# Check if backend is running
lsof -i :5142

# If not running, start it
cd Backend && dotnet watch run --project CarAuction.API/CarAuction.API.csproj

# Verify it's working
curl http://localhost:5142/swagger/index.html
```

**Docker containers won't start:**
```bash
docker-compose down -v  # Remove volumes
docker-compose up -d    # Recreate
```

**Port already in use:**
```bash
# Kill process on specific port
lsof -ti:5142 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

**Database connection issues:**
- Ensure Docker PostgreSQL container is running: `docker-compose ps`
- Check connection string in .env matches docker-compose.yml settings
- Test connection: `docker exec bravocars-postgres psql -U postgres -d bravocars -c "SELECT 1;"`

## Admin Credentials

```
Email:    admin@bravocars.com
Password: Admin@123456
```
