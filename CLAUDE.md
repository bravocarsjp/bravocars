# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

---

## 🔴 CRITICAL: Check These Files First (IN THIS ORDER!)

**Before starting ANY task, ALWAYS check these files in order:**

1. **`/Documentation/CONFIGURATION.md`** - Critical rules that MUST NOT be broken
2. **`/Documentation/PROJECT-STATUS.md`** - Current project progress and TODO
3. **`/Documentation/WORKFLOWS.md`** - Choose the appropriate workflow for your task
4. **`/Documentation/REFERENCE.md`** - Credentials, URLs, commands (as needed)
5. **`/Documentation/error-tracking/KNOWN-ERRORS.md`** - Check for documented issues

---

## 📁 Project Structure

```
BRAVOCARS/
├── Backend/          # .NET 9 Web API (Clean Architecture)
├── Frontend/         # React + Vite application
└── Documentation/    # All documentation, workflows, and guides
```

**Key Points**:
- Clean Architecture backend (Domain, Application, Infrastructure, API layers)
- React 19.1.1 frontend with Tailwind CSS + shadcn/ui (black/gold luxury theme)
- PostgreSQL + Redis (Docker)
- SignalR for real-time bidding
- Hangfire for background jobs
- **Project is 95% complete**
  - ✅ Frontend Redesign Complete (100%) - All major pages pixel-perfect with template
    - Core: HomePage, LiveAuctions, CarDetail (with SignalR preserved)
    - Auth: Login, Register (with full authentication integration)
    - Static: HowItWorksPage, SellCarPage
    - Admin system deleted per user request (will be re-added later)
  - ✅ SEO, accessibility, and UX improvements (100%)
  - ✅ Template color scheme applied (gold-500 #d4af37)
  - See `/Documentation/FRONTEND-REDESIGN-PLAN.md` for details

---

## 📚 Documentation Map

### Core Files
| File | Purpose | When to Read |
|------|---------|--------------|
| **[REFERENCE.md](./Documentation/REFERENCE.md)** | Credentials, URLs, commands | Starting up, need credentials |
| **[WORKFLOWS.md](./Documentation/WORKFLOWS.md)** | All development workflows | Every task (choose workflow) |
| **[CONFIGURATION.md](./Documentation/CONFIGURATION.md)** | Critical rules (camelCase JSON, CORS, etc.) | **BEFORE any code changes** |
| **[PROJECT-STATUS.md](./Documentation/PROJECT-STATUS.md)** | Progress tracking, TODO, roadmap | Understanding what's done/pending |

### Specialized
- **FRONTEND-REDESIGN-PLAN.md** - Frontend redesign progress and roadmap
- **error-tracking/KNOWN-ERRORS.md** - Known issues and solutions
- **error-tracking/[category]-errors.md** - Category-specific errors (will grow over time)

---

## ⚡ Quick Reference

### Starting Development
```bash
# One command starts everything
./start-dev.sh
```

See [REFERENCE.md](./Documentation/REFERENCE.md) for detailed commands and troubleshooting.

### Common Tasks
- **Add feature** → Read WORKFLOWS.md → Feature Development Workflow
- **Fix bug** → Check KNOWN-ERRORS.md → Read WORKFLOWS.md → Error Handling Workflow
- **Code changes** → Read WORKFLOWS.md → Development Workflow
- **Deploy** → Read WORKFLOWS.md → Deployment Workflow

### Credentials
See [REFERENCE.md](./Documentation/REFERENCE.md) for all credentials and service URLs.

---

## 🔧 Special Workflows

### Orval API Client Generation

The frontend uses **Orval** to auto-generate TypeScript API clients from the backend's Swagger specification.

**Configuration**:
- `Frontend/orval.config.ts` - Orval configuration
- Source: `http://localhost:5142/swagger/v1/swagger.json`
- Output: `Frontend/src/api/generated/`

**Usage**:
```bash
# Backend must be running first!
cd Frontend
npm run generate:api
```

**Pre-commit Hook**:
- `.husky/pre-commit` automatically regenerates API client on commit
- Skips if backend not running

**Important**:
- Generated files should NOT be manually edited
- Run generation whenever backend API changes
- All API types auto-sync with backend DTOs

### Pre-Commit Hooks

**Location**: `.husky/pre-commit`

**What it does**:
1. Checks if backend is running (localhost:5142)
2. Runs `npm run generate:api` in Frontend/
3. Auto-stages generated files if changed
4. Proceeds with commit

**If hook fails**:
```bash
# Start backend first
cd Backend && dotnet run --project CarAuction.API/CarAuction.API.csproj

# Then commit
git commit -m "your message"

# Or skip hook (not recommended)
git commit --no-verify -m "your message"
```

---

## 🎯 Workflow Summary

### For Every Task:
1. Read CONFIGURATION.md (critical rules)
2. Check KNOWN-ERRORS.md (if error-related)
3. Check PROJECT-STATUS.md (current state)
4. Read appropriate section in WORKFLOWS.md
5. Reference REFERENCE.md for credentials/commands
6. Execute task following the workflow

### Key Principles:
- ✅ Always follow Clean Architecture (backend)
- ✅ Check CONFIGURATION.md before config changes
- ✅ Document new errors in error-tracking/
- ✅ Update PROJECT-STATUS.md when completing tasks
- ✅ Run tests before committing
- ✅ Use pre-commit hooks (don't skip)

---

## 🏗️ Architecture Quick Facts

**Backend** (.NET 9):
- 4 layers: Domain → Application → Infrastructure → API
- Entities: User, Car, Auction, Bid
- Patterns: Repository, Unit of Work, DI
- JWT auth with refresh tokens
- SignalR for real-time bidding
- Hangfire for background jobs (auction lifecycle)

**Frontend** (React 19.1.1):
- Tailwind CSS 4.1.0 + shadcn/ui (black/gold luxury design)
- Zustand state management
- React Query (via Orval)
- SignalR client for real-time
- Auto-generated TypeScript API client
- Lucide React icons

**Infrastructure**:
- PostgreSQL 16 (Docker)
- Redis 7 (Docker)
- Entity Framework Core 9
- Serilog logging

For detailed architecture, see PROJECT-STATUS.md.

---

## 🎨 Frontend Redesign Status

### Completed (Template Redesign - Nov 9, 2025)
**Core User Pages (Template Applied):**
- ✅ **HomePage** - Template hero, decorative elements, auction grid with BravoCar API
- ✅ **LiveAuctionsPage** - Template filters/search, BravoCar backend integration preserved
- ✅ **CarDetail** - Template UI with SignalR real-time bidding fully preserved

**Auth Pages (Template Applied):**
- ✅ **LoginPage** - Template design with BravoCar auth (useAuth hook) fully preserved
- ✅ **RegisterPage** - Template design with BravoCar registration fully preserved

**Static Pages (Template Applied):**
- ✅ **HowItWorksPage** - Template spacing (pt-32), buyer/seller flows
- ✅ **SellCarPage** - Template spacing (pt-32), car listing form

**Foundation Components:**
- ✅ **Hero** - Template component (gold-500 color scheme)
- ✅ **AuctionCard** - Template component with BravoCar routes
- ✅ **Header** - Already pixel-perfect with BravoCar auth (kept as-is)

**Admin System:**
- ⏸️ Deleted per user request - Will be re-added later with template design

**Key Achievements:**
- ✅ Pixel-perfect template copy (structure, comments, variable names)
- ✅ All backend integrations preserved (auth, API, SignalR)
- ✅ Template gold-500 color scheme applied (#d4af37)
- ✅ SEO, skeleton loaders, error states maintained
- ✅ BRAVOCARS branding throughout (not "LuxeBid")

### Pending (Future Work)
**Admin System (Priority: MEDIUM):**
- [ ] **AdminDashboard** - Copy from template with BravoCar API
- [ ] **AdminUsers** - User management with approval workflow
- [ ] **Car/Auction Management** - CRUD forms

**Other Pages (Priority: LOW):**
- [ ] ProfilePage - User settings and bid history

For full details, see `/Documentation/FRONTEND-REDESIGN-PLAN.md`

---

## 📝 Notes for AI Assistants

1. **ALWAYS** check CONFIGURATION.md before modifying configurations
2. **ALWAYS** check error-tracking/KNOWN-ERRORS.md before debugging
3. Use WORKFLOWS.md to determine which workflow to follow
4. Document new errors in error-tracking/ with proper format
5. Update PROJECT-STATUS.md when completing tasks
6. Follow Clean Architecture when adding backend features
7. Regenerate API client after backend changes
8. **When redesigning pages**: Preserve ALL backend integrations, only change UI/UX

---

**For detailed instructions on any task, see [WORKFLOWS.md](./Documentation/WORKFLOWS.md).**
