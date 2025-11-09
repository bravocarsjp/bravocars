# BRAVOCARS - Known Errors Database

**Purpose**: Structured knowledge base of all known errors, their causes, and solutions.

**Last Updated**: 2025-11-08

---

## 📊 Error Statistics

| Category | Total Errors | Critical | High | Medium | Low |
|----------|-------------|----------|------|--------|-----|
| Database | 1 | 0 | 0 | 1 | 0 |
| API | 0 | 0 | 0 | 0 | 0 |
| Frontend | 0 | 0 | 0 | 0 | 0 |
| Infrastructure | 0 | 0 | 0 | 0 | 0 |
| Build | 0 | 0 | 0 | 0 | 0 |
| **Total** | **1** | **0** | **0** | **1** | **0** |

---

## 🔍 Quick Search

**By Category**:
- [Database Errors](#database-errors) (DB-XXX)
- [API Errors](#api-errors) (API-XXX)
- [Frontend Errors](#frontend-errors) (FE-XXX)
- [Infrastructure Errors](#infrastructure-errors) (INF-XXX)
- [Build Errors](#build-errors) (BUILD-XXX)

**By Severity**:
- [Critical Errors](#critical-errors)
- [High Priority Errors](#high-priority-errors)
- [Medium Priority Errors](#medium-priority-errors)
- [Low Priority Errors](#low-priority-errors)

**By Frequency**:
- [Very Common](#very-common-errors)
- [Common](#common-errors)
- [Occasional](#occasional-errors)
- [Rare](#rare-errors)

---

## Database Errors

### Error ID: DB-001

**Category**: Database
**Severity**: Medium
**Frequency**: Common

#### Error Message
```
Npgsql.NpgsqlException (0x80004005): Failed to connect to 127.0.0.1:5432
 ---> System.Net.Sockets.SocketException (61): Connection refused
   at Npgsql.Internal.NpgsqlConnector.Connect(NpgsqlTimeout timeout)
   at Npgsql.Internal.NpgsqlConnector.RawOpen(SslMode sslMode, NpgsqlTimeout timeout)
   at Hangfire.PostgreSql.PostgreSqlStorage.CreateAndOpenConnection()
   at Hangfire.Server.BackgroundServerProcess.Execute()
```

#### Description
Backend application cannot connect to PostgreSQL database because the Docker container is not running or not ready.

#### Symptoms
- Backend fails to start
- Hangfire background jobs fail
- "Connection refused" in logs
- Repeated retry attempts every 15 seconds
- Application startup delayed

#### When It Occurs
- Backend started before Docker services
- PostgreSQL container stopped or crashed
- PostgreSQL taking too long to start (timing issue)
- Port 5432 already in use by another process

#### Root Cause
The backend application attempts to connect to PostgreSQL at `127.0.0.1:5432` but the PostgreSQL Docker container is either:
1. Not started yet
2. Still initializing (not yet accepting connections)
3. Stopped or crashed
4. Port conflict preventing container startup

#### Solution

**Option 1: Start Docker Services First** (Recommended)
```bash
# 1. Start Docker services
docker-compose up -d

# 2. Wait for services to be healthy (30 seconds)
docker-compose ps

# 3. Verify PostgreSQL is accepting connections
docker-compose exec postgres pg_isready -U postgres

# 4. Start backend
cd Backend && dotnet run --project CarAuction.API/CarAuction.API.csproj
```

**Option 2: Use the Startup Script**
```bash
# This handles everything in correct order
./start-dev.sh
```

**Option 3: Restart PostgreSQL Container**
```bash
# If container is running but not responding
docker-compose restart postgres

# Wait for it to be ready
docker-compose exec postgres pg_isready -U postgres
```

**Option 4: Check Port Conflicts**
```bash
# Check if port 5432 is already in use
lsof -i :5432

# If another process is using it:
kill -9 [PID]  # Kill the process

# Then start Docker
docker-compose up -d
```

#### Prevention
1. **Always start Docker services before backend**:
   ```bash
   # Add to your workflow
   docker-compose up -d && sleep 30 && cd Backend && dotnet run
   ```

2. **Use the provided startup script**:
   ```bash
   ./start-dev.sh
   ```

3. **Add health checks in code** (Future improvement):
   ```csharp
   // Wait for database to be ready before starting app
   await WaitForDatabaseAsync();
   ```

4. **Improve error message** (Future improvement):
   - Detect database connection failure
   - Show helpful message: "PostgreSQL not running. Run: docker-compose up -d"

#### Workaround (If Solution Doesn't Work)
If PostgreSQL won't start:
```bash
# Nuclear option: Remove all containers and volumes
docker-compose down -v

# Recreate everything
docker-compose up -d

# Wait for initialization
sleep 60

# Check status
docker-compose ps
docker-compose logs postgres
```

#### Related Issues
- None yet

#### Related Files
- `docker-compose.yml` - PostgreSQL configuration
- `Backend/CarAuction.API/appsettings.json` - Connection string
- `Backend/CarAuction.API/Program.cs` - Database initialization
- `Backend/CarAuction.Infrastructure/Data/ApplicationDbContext.cs` - EF Core context

#### Metadata
- **First Seen**: 2025-11-01
- **Last Seen**: 2025-11-05
- **Affected Environments**: Development (primarily)
- **Affected Components**: Backend API, Hangfire, Entity Framework Core
- **Average Resolution Time**: 2 minutes
- **Recurrence Rate**: High (if workflow not followed)

---

## API Errors

*No API errors documented yet. This section will be populated as issues are discovered and resolved.*

**Common API error categories to watch for**:
- Authentication failures (401 Unauthorized)
- Authorization failures (403 Forbidden)
- Not found errors (404)
- Validation errors (400 Bad Request)
- Server errors (500 Internal Server Error)

See [api-errors.md](./api-errors.md) for detailed API error documentation.

---

## Frontend Errors

*No frontend errors documented yet. This section will be populated as issues are discovered and resolved.*

**Common frontend error categories to watch for**:
- API call failures
- State management issues
- Rendering errors
- Build errors
- TypeScript compilation errors
- Routing issues

See [frontend-errors.md](./frontend-errors.md) for detailed frontend error documentation.

---

## Infrastructure Errors

*No infrastructure errors documented yet. This section will be populated as issues are discovered and resolved.*

**Common infrastructure error categories to watch for**:
- Docker container issues
- Port conflicts
- Resource exhaustion (memory, disk, CPU)
- Network connectivity issues
- SSL/TLS certificate issues

See [infrastructure-errors.md](./infrastructure-errors.md) for detailed infrastructure error documentation.

---

## Build Errors

*No build errors documented yet. This section will be populated as issues are discovered and resolved.*

**Common build error categories to watch for**:
- NuGet package restoration failures
- npm package installation failures
- Compilation errors
- Missing dependencies
- Version conflicts

---

## 🚨 Critical Errors

*No critical errors currently documented.*

**Critical errors** are those that:
- Cause complete system failure
- Result in data loss
- Create security vulnerabilities
- Affect all users
- Require immediate attention

---

## ⚠️ High Priority Errors

*No high priority errors currently documented.*

**High priority errors** are those that:
- Break major features
- Affect many users
- Have no workaround
- Cause significant business impact

---

## 📝 Medium Priority Errors

### Medium Priority List:
1. [DB-001](#error-id-db-001) - PostgreSQL connection refused

**Medium priority errors** are those that:
- Affect some features
- Have workarounds
- Affect moderate number of users
- Cause inconvenience but not blocking

---

## 📋 Low Priority Errors

*No low priority errors currently documented.*

**Low priority errors** are those that:
- Cosmetic issues
- Affect very few users
- Have easy workarounds
- Minimal business impact

---

## 📊 Error Frequency Categories

### Very Common Errors
*Occur multiple times per day*

None documented yet.

### Common Errors
*Occur multiple times per week*

1. [DB-001](#error-id-db-001) - PostgreSQL connection refused (when workflow not followed)

### Occasional Errors
*Occur a few times per month*

None documented yet.

### Rare Errors
*Occur less than once per month*

None documented yet.

---

## 📝 How to Add a New Error

### Template

```markdown
### Error ID: [CATEGORY]-[NUMBER]

**Category**: [Database/API/Frontend/Infrastructure/Build]
**Severity**: [Critical/High/Medium/Low]
**Frequency**: [Very Common/Common/Occasional/Rare]

#### Error Message
\`\`\`
[Exact error message or stack trace]
\`\`\`

#### Description
[Brief description of the error]

#### Symptoms
- [Symptom 1]
- [Symptom 2]

#### When It Occurs
- [Condition 1]
- [Condition 2]

#### Root Cause
[Detailed explanation of why this error occurs]

#### Solution
[Step-by-step solution]

#### Prevention
[How to prevent this error]

#### Workaround (If Solution Doesn't Work)
[Alternative approaches]

#### Related Issues
- [GitHub Issue #123]
- [Similar Error: XXX-123]

#### Related Files
- [path/to/file1]
- [path/to/file2]

#### Metadata
- **First Seen**: YYYY-MM-DD
- **Last Seen**: YYYY-MM-DD
- **Affected Environments**: [Development/Staging/Production]
- **Affected Components**: [Component names]
- **Average Resolution Time**: [Time]
- **Recurrence Rate**: [High/Medium/Low]
```

### Numbering Convention

- **DB-XXX**: Database errors (001-999)
- **API-XXX**: API errors (001-999)
- **FE-XXX**: Frontend errors (001-999)
- **INF-XXX**: Infrastructure errors (001-999)
- **BUILD-XXX**: Build errors (001-999)

**Next available IDs**:
- DB-002
- API-001
- FE-001
- INF-001
- BUILD-001

---

## 🔗 Related Documentation

- **[Error Handling Workflow](../workflows/error-handling-workflow.md)** - How to investigate errors
- **[Database Errors](./database-errors.md)** - Database-specific errors
- **[API Errors](./api-errors.md)** - API-specific errors
- **[Frontend Errors](./frontend-errors.md)** - Frontend-specific errors
- **[Infrastructure Errors](./infrastructure-errors.md)** - Infrastructure-specific errors

---

## 📞 Getting Help

### If Error Not Found Here
1. Follow [error-handling-workflow.md](../workflows/error-handling-workflow.md)
2. Investigate systematically
3. Document solution here once resolved
4. Share with team

### Reporting New Errors
- Document using the template above
- Add to appropriate category
- Update statistics table
- Commit to repository
- Notify team in Slack/chat

### Improving This Document
- Add more details to existing errors
- Update solutions that don't work
- Add prevention strategies
- Keep metadata current

---

**Remember**: Every error is an opportunity to improve the system. Document thoroughly so others can benefit from your solution.
