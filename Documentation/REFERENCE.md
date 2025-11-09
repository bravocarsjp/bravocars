# REFERENCE - Quick Reference Guide

**Purpose**: Single source of truth for credentials, URLs, commands, and quick references.

**Last Updated**: 2025-11-08

---

## 🔑 Credentials

### Admin Account
```
Email:    admin@bravocars.com
Password: Admin@123456
Role:     Admin
```

### Test Users
```
User 1:
Email:    john.doe@example.com
Password: User@123
Roles:    User, Bidder
Status:   Approved

User 2:
Email:    jane.smith@example.com
Password: User@123
Roles:    User, Bidder
Status:   Approved
```

---

## 🌐 Service URLs & Ports

### Local Development
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5142
- **Swagger Documentation**: http://localhost:5142/swagger
- **Hangfire Dashboard**: http://localhost:5142/hangfire

### Docker Services
- **PostgreSQL**: localhost:5432
  - Database: `bravocars`
  - User: `postgres`
  - Password: `postgres`
- **Redis**: localhost:6379
- **pgAdmin**: http://localhost:5050
  - Email: `admin@bravocars.com`
  - Password: `admin`

---

## ⚡ Quick Commands

### One-Command Startup
```bash
./start-dev.sh
```
This automatically starts Docker, Backend, and Frontend.

### Docker Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Restart service
docker-compose restart postgres

# Start with pgAdmin
docker-compose --profile tools up -d

# Remove everything (nuclear option)
docker-compose down -v
```

### Backend Commands
```bash
# Navigate to backend
cd Backend

# Run with hot reload
dotnet watch run --project CarAuction.API/CarAuction.API.csproj

# Build
dotnet build CarAuction.sln

# Run tests
dotnet test

# Create migration
dotnet ef migrations add MigrationName --project CarAuction.Infrastructure --startup-project CarAuction.API

# Apply migrations
dotnet ef database update --project CarAuction.Infrastructure --startup-project CarAuction.API

# List migrations
dotnet ef migrations list --project CarAuction.Infrastructure --startup-project CarAuction.API
```

### Frontend Commands
```bash
# Navigate to frontend
cd Frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Generate API client (backend must be running)
npm run generate:api
```

---

## 🔧 Environment Setup

### First Time Setup
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Update .env with your settings
# Edit: JWT_SECRET, EMAIL credentials, etc.

# 3. Start Docker services
docker-compose up -d

# 4. Install frontend dependencies
cd Frontend && npm install
```

### Verify Services
```bash
# Check if backend is running
curl http://localhost:5142/swagger

# Check if frontend is running
curl http://localhost:5173

# Check Docker services
docker-compose ps

# Check PostgreSQL connection
docker-compose exec postgres pg_isready -U postgres

# Check Redis connection
docker-compose exec redis redis-cli ping
```

---

## 🐛 Common Issues - Quick Fixes

### Backend Won't Start
```bash
# Problem: PostgreSQL not running
# Solution:
docker-compose up -d
sleep 30  # Wait for PostgreSQL to be ready
cd Backend && dotnet run --project CarAuction.API/CarAuction.API.csproj
```

### Port Already in Use
```bash
# Find process using port
lsof -i :5142  # Backend
lsof -i :5173  # Frontend
lsof -i :5432  # PostgreSQL

# Kill process
kill -9 [PID]
```

### Docker Issues
```bash
# Restart Docker services
docker-compose restart

# Rebuild if needed
docker-compose up -d --build

# Check logs for errors
docker-compose logs postgres
docker-compose logs redis
```

### API Client Generation Issues
```bash
# Ensure backend is running first
cd Backend && dotnet run --project CarAuction.API/CarAuction.API.csproj

# Then in new terminal
cd Frontend && npm run generate:api
```

---

## 📁 Important File Locations

### Configuration Files
- `.env` - Environment variables (local, not in Git)
- `.env.example` - Environment template
- `Backend/CarAuction.API/appsettings.json` - Backend config
- `Backend/CarAuction.API/appsettings.Development.json` - Dev config
- `Frontend/vite.config.js` - Vite configuration
- `Frontend/orval.config.ts` - API generation config

### Logs
- Backend: `Backend/CarAuction.API/logs/bravocars-YYYYMMDD.log`
- Daily rotation

### Database Migrations
- Location: `Backend/CarAuction.Infrastructure/Migrations/`

---

## 🎯 Testing Checklist

Before committing:
- [ ] Backend builds: `dotnet build`
- [ ] Backend tests pass: `dotnet test`
- [ ] Frontend builds: `npm run build`
- [ ] No console errors
- [ ] API client regenerated if backend changed
- [ ] Configuration rules followed (check CONFIGURATION.md)

---

## 📚 Related Documentation

- **[CONFIGURATION.md](./CONFIGURATION.md)** - Critical rules that must not be broken
- **[WORKFLOWS.md](./WORKFLOWS.md)** - Development workflows
- **[PROJECT-STATUS.md](./PROJECT-STATUS.md)** - Current project status
- **[error-tracking/KNOWN-ERRORS.md](./error-tracking/KNOWN-ERRORS.md)** - Known errors database

---

**Note**: This is a quick reference. For detailed workflows and procedures, see WORKFLOWS.md.
