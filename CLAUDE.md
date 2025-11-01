# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BRAVOCARS is a full-stack application with a .NET 9 Web API backend and React (Vite) frontend. The project uses a monorepo structure with separate Backend and Frontend directories.

## Architecture

### Backend (.NET 9 Web API)
- **Framework**: .NET 9 with minimal API pattern
- **Entry Point**: `Backend/Program.cs`
- **Port**: `http://localhost:5142`
- **CORS**: Configured to allow requests from `http://localhost:5173` (React frontend)
- **API Style**: Minimal APIs using top-level statements and endpoint mapping (e.g., `app.MapGet()`)
- **OpenAPI**: Enabled in development mode via `Microsoft.AspNetCore.OpenApi` package

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

### Backend Development
```bash
cd Backend
dotnet run                    # Run the API server
dotnet build                  # Build the project
dotnet watch run              # Run with hot reload
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

### Running Both Services
The application requires both servers running simultaneously:
1. Terminal 1: `cd Backend && dotnet run`
2. Terminal 2: `cd Frontend && npm run dev`

## Key Files

- `Backend/Program.cs` - Backend entry point with minimal API definitions and CORS configuration
- `Frontend/vite.config.js` - Vite configuration including proxy setup
- `Frontend/src/App.jsx` - Main React component
- `Backend/Backend.csproj` - .NET project file and dependencies
- `Frontend/package.json` - NPM dependencies and scripts
