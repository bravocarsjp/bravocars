# BRAVOCARS Development Startup Guide

## Quick Start (Recommended)

Run the automated startup script:

```bash
./start-dev.sh
```

This will:
1. Check and start Docker services (PostgreSQL + Redis)
2. Start the Backend API on port 5142
3. Start the Frontend on port 5173

## Manual Startup

If you prefer to start services manually:

### 1. Start Docker Services

```bash
docker-compose up -d
```

Verify services are running:
```bash
docker-compose ps
```

### 2. Start Backend (Terminal 1)

```bash
cd Backend
dotnet watch run --project CarAuction.API/CarAuction.API.csproj
```

**Wait for this message:**
```
Now listening on: http://localhost:5142
```

### 3. Start Frontend (Terminal 2)

```bash
cd Frontend
npm run dev
```

## Service URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5142
- **Swagger Docs:** http://localhost:5142/swagger
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

## Admin Credentials

```
Email:    admin@bravocars.com
Password: Admin@123456
```

## Common Issues

### Backend not responding (Connection Refused)

**Symptom:** Frontend shows "Failed to load resource: net::ERR_CONNECTION_REFUSED"

**Solution:**
1. Check if backend is running:
   ```bash
   lsof -i :5142
   ```
2. If not running, start it:
   ```bash
   cd Backend && dotnet watch run --project CarAuction.API/CarAuction.API.csproj
   ```

### Database Connection Errors

**Symptom:** Backend crashes with database errors

**Solution:**
1. Ensure Docker services are running:
   ```bash
   docker-compose ps
   ```
2. Restart Docker services if needed:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Port Already in Use

**Symptom:** "Address already in use" error

**Solution:**
1. Find and kill the process:
   ```bash
   # For backend (5142)
   lsof -ti:5142 | xargs kill -9

   # For frontend (5173)
   lsof -ti:5173 | xargs kill -9
   ```

## Stopping Services

### Stop Everything
```bash
# Stop backend and frontend (Ctrl+C in their terminals)
# Stop Docker services
docker-compose down
```

### Stop Docker Only
```bash
docker-compose down
```

### Stop with Volume Cleanup (Reset Database)
```bash
docker-compose down -v
```

## Development Workflow

### Daily Startup
```bash
# Option 1: Quick start
./start-dev.sh

# Option 2: Manual
docker-compose up -d
cd Backend && dotnet watch run --project CarAuction.API/CarAuction.API.csproj &
cd Frontend && npm run dev
```

### After Pulling Updates
```bash
# Update backend dependencies
cd Backend && dotnet restore

# Update frontend dependencies
cd Frontend && npm install

# Run migrations if needed
cd Backend && dotnet ef database update --project CarAuction.Infrastructure --startup-project CarAuction.API
```

## Troubleshooting Checklist

Before asking for help, verify:

- [ ] Docker services are running: `docker-compose ps`
- [ ] Backend is running: `curl http://localhost:5142/swagger/index.html`
- [ ] Frontend is running: Visit http://localhost:5173
- [ ] No port conflicts: `lsof -i :5142,5173,5432,6379`
- [ ] .env file exists: `ls -la .env`

## Using with Rider IDE

If you start the backend from Rider:

1. Make sure the run configuration uses port 5142
2. The `http` profile in `launchSettings.json` should be selected
3. Frontend will still need to be started separately:
   ```bash
   cd Frontend && npm run dev
   ```

## Health Check

Verify everything is working:

```bash
# Check Docker
docker-compose ps

# Check Backend
curl http://localhost:5142/swagger/index.html

# Check Frontend
curl http://localhost:5173

# Check Database
docker exec bravocars-postgres psql -U postgres -d bravocars -c "SELECT count(*) FROM \"AspNetUsers\";"
```

All should return successful responses.
