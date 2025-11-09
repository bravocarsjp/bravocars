# WORKFLOWS - Complete Development Guide

**Purpose**: All development workflows in one place - from daily coding to deployment.

**Last Updated**: 2025-11-08

---

## 📋 Table of Contents

1. [Quick Decision Tree](#quick-decision-tree) - Start here!
2. [Development Workflow](#development-workflow) - Daily coding, Git, PRs
3. [Feature Development Workflow](#feature-development-workflow) - Adding new features
4. [Deployment Workflow](#deployment-workflow) - Staging & production
5. [Error Handling Workflow](#error-handling-workflow) - Debugging & troubleshooting

---

## 🎯 Quick Decision Tree

**What do you want to do?**

```
├─ I want to start working
│  └─ See: REFERENCE.md (startup commands)
│
├─ I want to add a new feature
│  └─ Go to: Feature Development Workflow
│
├─ I'm fixing a bug or investigating an error
│  └─ Go to: Error Handling Workflow
│
├─ I want to make code changes (refactor, small fix)
│  └─ Go to: Development Workflow
│
├─ I want to deploy
│  └─ Go to: Deployment Workflow
│
└─ I encountered an error
   └─ Go to: Error Handling Workflow
```

**Before ANY task**:
1. ✅ Check CONFIGURATION.md for rules
2. ✅ Check error-tracking/KNOWN-ERRORS.md for known issues
3. ✅ Follow the appropriate workflow below

---

# Development Workflow

**Purpose**: Guide for daily development tasks, Git operations, code review, and commit conventions.

**Last Updated**: 2025-11-08

---

## 🎯 Overview

This workflow covers:
- Git branching strategy
- Commit message conventions
- Code review process
- Pull request guidelines
- Pre-commit hooks
- Testing requirements

---

## 🌳 Git Branching Strategy

### Branch Types

```
main (production)
  ↓
develop (integration)
  ↓
feature/* (new features)
fix/* (bug fixes)
hotfix/* (urgent production fixes)
docs/* (documentation)
```

### Branch Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/short-description` | `feature/user-profile-page` |
| Bug Fix | `fix/short-description` | `fix/login-validation-error` |
| Hotfix | `hotfix/short-description` | `hotfix/payment-crash` |
| Documentation | `docs/short-description` | `docs/api-documentation` |
| Refactor | `refactor/short-description` | `refactor/auth-service` |

### Branch Lifecycle

**1. Create Branch**:
```bash
# Update main/develop first
git checkout develop
git pull origin develop

# Create your branch
git checkout -b feature/your-feature-name
```

**2. Make Changes**:
```bash
# Make changes to code
# Test locally
# Commit changes (see commit conventions below)
```

**3. Keep Updated**:
```bash
# Regularly sync with develop
git fetch origin
git rebase origin/develop
```

**4. Push Branch**:
```bash
git push origin feature/your-feature-name
```

**5. Create Pull Request** (see PR section below)

**6. After Merge**:
```bash
# Switch back to develop
git checkout develop
git pull origin develop

# Delete local branch
git branch -d feature/your-feature-name

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/your-feature-name
```

---

## 📝 Commit Message Conventions

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add two-factor authentication` |
| `fix` | Bug fix | `fix(bidding): prevent duplicate bids` |
| `docs` | Documentation only | `docs(api): update endpoint documentation` |
| `style` | Code style (formatting, missing semi-colons) | `style(frontend): fix indentation` |
| `refactor` | Code refactoring | `refactor(services): simplify auth logic` |
| `test` | Adding/fixing tests | `test(bid-service): add unit tests` |
| `chore` | Maintenance tasks | `chore(deps): update npm packages` |
| `perf` | Performance improvements | `perf(api): optimize database queries` |

### Scope (Optional)

- `auth` - Authentication/authorization
- `api` - API layer
- `frontend` - Frontend code
- `backend` - Backend code
- `database` - Database-related
- `docs` - Documentation
- `tests` - Testing

### Examples

**Good Commits**:
```bash
feat(auction): add countdown timer component

Added real-time countdown timer with color-coded urgency indicators.
Updates every second and broadcasts via SignalR.

Refs: #123

---

fix(auth): resolve token refresh infinite loop

The token refresh was triggering multiple times causing performance issues.
Added debounce logic and proper state management.

Fixes: #456

---

docs(workflows): create main workflow guide

Comprehensive guide covering all development workflows with decision trees
and quick reference sections.
```

**Bad Commits** (avoid these):
```bash
# Too vague
fix: fixed bug

# No type
Added new feature

# No description
feat(api):
```

### Commit Best Practices

✅ **DO**:
- Write clear, concise commit messages
- Use present tense ("add feature" not "added feature")
- Reference issue numbers when applicable
- Keep commits focused (one logical change per commit)
- Test before committing

❌ **DON'T**:
- Commit WIP (work in progress) code to shared branches
- Include multiple unrelated changes in one commit
- Commit commented-out code
- Commit secrets or sensitive data
- Use vague messages like "fix", "update", "changes"

---

## 🔄 Pull Request Process

### Before Creating PR

**Checklist**:
- [ ] Code builds successfully
- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Code follows project conventions (check CONFIGURATION.md)
- [ ] No console errors or warnings
- [ ] Updated documentation if needed
- [ ] Reviewed your own changes (self-review)
- [ ] Rebased on latest develop branch

### Creating Pull Request

**1. Push Your Branch**:
```bash
git push origin feature/your-feature-name
```

**2. Create PR on GitHub**:
- Go to repository on GitHub
- Click "New Pull Request"
- Select your branch
- Fill out PR template (see below)

**3. PR Title Format**:
```
[TYPE] Short description of changes

Examples:
[FEATURE] Add user profile editing
[FIX] Resolve login token expiration issue
[REFACTOR] Simplify bid service logic
```

**4. PR Description Template**:
```markdown
## Description
Brief description of what this PR does and why.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring

## Changes Made
- List specific changes
- Be concise but complete
- Include technical details

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Edge cases tested

## Screenshots (if UI changes)
[Add screenshots here]

## Checklist
- [ ] Code follows project conventions
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tests pass locally

## Related Issues
Closes #123
Refs #456
```

### PR Review Process

**1. Automated Checks**:
- CI/CD pipeline runs
- Tests must pass
- Build must succeed
- No merge conflicts

**2. Code Review**:
- At least 1 approval required
- Address all comments
- Make requested changes
- Re-request review after changes

**3. Approval**:
- PR is approved
- All checks pass
- No unresolved comments

**4. Merge**:
- Use "Squash and Merge" for feature branches
- Use "Merge" for important branches (develop → main)
- Delete branch after merge

---

## 👀 Code Review Guidelines

### For Reviewers

**What to Check**:
- [ ] Code correctness and logic
- [ ] Code follows CONFIGURATION.md conventions
- [ ] Potential bugs or edge cases
- [ ] Security vulnerabilities
- [ ] Performance issues
- [ ] Test coverage
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)

**Review Etiquette**:
- Be respectful and constructive
- Explain why changes are needed
- Suggest solutions, not just problems
- Distinguish between blocking issues and suggestions
- Approve if minor issues can be addressed post-merge

**Comment Prefixes**:
- `blocking:` - Must be fixed before merge
- `suggestion:` - Optional improvement
- `question:` - Needs clarification
- `nit:` - Minor style/formatting issue

**Example Comments**:
```
blocking: This could cause a race condition when multiple users bid simultaneously.
Consider using the DistributedLockService here.

suggestion: This could be simplified using LINQ's .Any() method instead of .Count() > 0

question: Why are we using setTimeout here instead of SignalR events?

nit: Missing space after comma on line 45
```

### For Authors

**Responding to Reviews**:
- Address all comments (reply or make changes)
- Don't take feedback personally
- Ask for clarification if needed
- Mark conversations as resolved when fixed
- Thank reviewers for their time

**Making Changes**:
```bash
# Make requested changes
# Commit with clear message
git commit -m "refactor(auth): use distributed locking for concurrent bids"

# Push changes
git push origin feature/your-feature-name

# Re-request review on GitHub
```

---

## 🪝 Pre-Commit Hooks

### Husky Pre-Commit Hook

**Location**: `.husky/pre-commit`

**What It Does**:
- Regenerates TypeScript API client from backend Swagger
- Ensures frontend types are synced with backend
- Auto-stages generated files

**How It Works**:
```bash
# When you run: git commit
# Hook automatically:
1. Checks if backend is running (localhost:5142)
2. Runs: npm run generate:api in Frontend/
3. Stages generated files if changed
4. Proceeds with commit
```

**If Hook Fails**:
```bash
# Start backend first
cd Backend && dotnet run --project CarAuction.API/CarAuction.API.csproj

# Then commit again
git commit -m "your message"

# Or skip hook temporarily (not recommended)
git commit --no-verify -m "your message"
```

---

## ✅ Testing Requirements

### Before Committing

**Backend**:
```bash
cd Backend

# Run all tests
dotnet test

# Run specific test project
dotnet test CarAuction.Tests.Unit
dotnet test CarAuction.Tests.Integration

# Check test coverage
dotnet test /p:CollectCoverage=true
```

**Frontend**:
```bash
cd Frontend

# Run tests (when implemented)
npm test

# Run linter
npm run lint

# Build production bundle
npm run build
```

### Test Coverage Requirements

- **Unit Tests**: Required for all new services/business logic
- **Integration Tests**: Required for new API endpoints
- **E2E Tests**: Required for critical user flows (TBD)

**Minimum Coverage**:
- Services: 80%
- Controllers: 70%
- Overall: 75%

---

## 🔍 Self-Review Checklist

### Before Requesting Review

- [ ] **Code Quality**
  - [ ] No commented-out code
  - [ ] No console.log or debug statements
  - [ ] No TODO comments without tracking
  - [ ] Proper error handling
  - [ ] No magic numbers (use constants)

- [ ] **Naming**
  - [ ] Variables/functions have clear names
  - [ ] Follow camelCase/PascalCase conventions
  - [ ] Consistent naming throughout

- [ ] **Clean Architecture** (Backend)
  - [ ] Domain layer has no dependencies
  - [ ] Application layer references Domain only
  - [ ] Infrastructure references Application and Domain
  - [ ] API references Infrastructure and Application

- [ ] **Security**
  - [ ] No hardcoded secrets
  - [ ] Input validation present
  - [ ] SQL injection prevention
  - [ ] XSS prevention
  - [ ] Authentication/authorization checked

- [ ] **Performance**
  - [ ] No N+1 queries
  - [ ] Efficient algorithms
  - [ ] Proper indexes on database queries
  - [ ] Lazy loading where appropriate

- [ ] **Testing**
  - [ ] Unit tests for new logic
  - [ ] Integration tests for new endpoints
  - [ ] All tests pass
  - [ ] Edge cases covered

---

## 🚀 Common Development Tasks

### Adding New API Endpoint

1. **Backend**:
   ```bash
   # 1. Add DTO in Application/DTOs/
   # 2. Add to service interface in Application/Interfaces/
   # 3. Implement in Infrastructure/Services/
   # 4. Add controller action in API/Controllers/
   # 5. Add to DI in Program.cs if needed
   ```

2. **Test**:
   ```bash
   # Test in Swagger
   # Add unit tests
   # Add integration tests
   ```

3. **Frontend**:
   ```bash
   # Regenerate API client
   cd Frontend && npm run generate:api

   # Use generated hooks in components
   ```

### Fixing a Bug

1. **Reproduce**:
   - Understand the bug
   - Write a failing test
   - Confirm reproduction locally

2. **Fix**:
   - Create fix branch: `git checkout -b fix/bug-description`
   - Implement fix
   - Ensure test now passes
   - Test edge cases

3. **Verify**:
   - All tests pass
   - Bug no longer reproduces
   - No regressions

4. **Document**:
   - Add to `/docs/error-tracking/KNOWN-ERRORS.md`
   - Update relevant documentation

5. **Deploy**:
   - Create PR
   - Get review
   - Merge and deploy

### Refactoring Code

1. **Plan**:
   - Document why refactoring is needed
   - Identify scope
   - Plan backwards compatibility

2. **Test First**:
   - Ensure existing tests pass
   - Add new tests if needed
   - Run full test suite

3. **Refactor**:
   - Make changes incrementally
   - Commit frequently
   - Keep tests green

4. **Verify**:
   - All tests still pass
   - No functionality changed
   - Performance not degraded

---

## 📚 Additional Resources

- **Configuration Rules**: `/CONFIGURATION.md`
- **Project Status**: `/docs/PROJECT-STATUS.md`
- **Architecture**: `/docs/backend/architecture.md`, `/docs/frontend/architecture.md`
- **Known Errors**: `/docs/error-tracking/KNOWN-ERRORS.md`

---

## 🎯 Quick Command Reference

```bash
# Git Operations
git checkout -b feature/name          # Create new branch
git rebase origin/develop              # Update branch
git push origin feature/name           # Push branch
git branch -d feature/name             # Delete local branch

# Testing
dotnet test                            # Run backend tests
npm test                               # Run frontend tests
npm run lint                           # Run linter

# Building
dotnet build Backend/CarAuction.sln    # Build backend
npm run build                          # Build frontend

# API Generation
cd Frontend && npm run generate:api    # Regenerate API client
```

---

**Next**: See [feature-workflow.md](./feature-workflow.md) for implementing new features.

---

# Feature Development Workflow

**Purpose**: Step-by-step guide for implementing new features from planning to deployment.

**Last Updated**: 2025-11-08

---

## 🎯 Overview

This workflow covers the complete feature development lifecycle:
1. Planning & Design
2. Backend Implementation (Clean Architecture)
3. Frontend Implementation
4. API Integration
5. Testing
6. Documentation
7. Code Review & Deployment

---

## 📋 Phase 1: Planning & Design

### Step 1: Understand Requirements

**Questions to Answer**:
- What problem does this feature solve?
- Who are the users?
- What are the acceptance criteria?
- What are the edge cases?
- Are there security considerations?
- What's the expected load/performance?

**Document**:
- Create or update issue/ticket
- Define user stories
- List acceptance criteria
- Identify dependencies

**Example**:
```markdown
Feature: User Watchlist
User Story: As a bidder, I want to save auctions to a watchlist so I can easily track them

Acceptance Criteria:
- User can add auction to watchlist
- User can remove auction from watchlist
- User can view all watchlisted auctions
- Watchlist persists across sessions
- User receives notifications for watchlisted auctions

Dependencies:
- Authentication system (✅ exists)
- Auction system (✅ exists)
- SignalR for notifications (✅ exists)
```

### Step 2: Design the Solution

**Backend Design**:
- New entities needed?
- New DTOs?
- New service methods?
- New API endpoints?
- Database changes?

**Frontend Design**:
- New pages/components?
- State management needs?
- UI/UX mockups?
- Routing changes?

**Example Design Doc**:
```markdown
## Backend Design

### Entity
- Watchlist (Id, UserId, AuctionId, CreatedAt)
- Relationship: User 1:N Watchlist, Auction 1:N Watchlist

### DTOs
- AddToWatchlistDto (AuctionId)
- WatchlistItemDto (Id, AuctionId, AuctionTitle, CreatedAt)

### Service Interface
- IWatchlistService
  - Task<WatchlistItemDto> AddToWatchlistAsync(string userId, int auctionId)
  - Task RemoveFromWatchlistAsync(string userId, int watchlistId)
  - Task<List<WatchlistItemDto>> GetUserWatchlistAsync(string userId)
  - Task<bool> IsInWatchlistAsync(string userId, int auctionId)

### API Endpoints
- POST /api/watchlist - Add to watchlist
- DELETE /api/watchlist/{id} - Remove from watchlist
- GET /api/watchlist - Get user's watchlist
- GET /api/watchlist/check/{auctionId} - Check if in watchlist

## Frontend Design

### Components
- WatchlistButton (auction detail page)
- WatchlistPage (view all watchlist items)
- WatchlistCard (individual item)

### State
- Add watchlist to authStore or create watchlistStore

### Routes
- /watchlist - View watchlist page
```

---

## 🔨 Phase 2: Backend Implementation (Clean Architecture)

### Step 1: Domain Layer

**Location**: `Backend/CarAuction.Domain/`

**Create Entities**:
```csharp
// Backend/CarAuction.Domain/Entities/Watchlist.cs
public class Watchlist
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public int AuctionId { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ApplicationUser User { get; set; }
    public Auction Auction { get; set; }
}
```

**Update DbContext**:
```csharp
// Backend/CarAuction.Infrastructure/Data/ApplicationDbContext.cs
public DbSet<Watchlist> Watchlists { get; set; }

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // Configure relationships
    modelBuilder.Entity<Watchlist>()
        .HasOne(w => w.User)
        .WithMany()
        .HasForeignKey(w => w.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Watchlist>()
        .HasOne(w => w.Auction)
        .WithMany()
        .HasForeignKey(w => w.AuctionId)
        .OnDelete(DeleteBehavior.Cascade);
}
```

**Create Migration**:
```bash
cd Backend
dotnet ef migrations add AddWatchlistEntity --project CarAuction.Infrastructure --startup-project CarAuction.API
dotnet ef database update --project CarAuction.Infrastructure --startup-project CarAuction.API
```

### Step 2: Application Layer

**Location**: `Backend/CarAuction.Application/`

**Create DTOs**:
```csharp
// Backend/CarAuction.Application/DTOs/Watchlist/AddToWatchlistDto.cs
public record AddToWatchlistDto
{
    public int AuctionId { get; init; }
}

// Backend/CarAuction.Application/DTOs/Watchlist/WatchlistItemDto.cs
public record WatchlistItemDto
{
    public int Id { get; init; }
    public int AuctionId { get; init; }
    public string AuctionTitle { get; init; }
    public DateTime CreatedAt { get; init; }
}
```

**Create Service Interface**:
```csharp
// Backend/CarAuction.Application/Interfaces/Services/IWatchlistService.cs
public interface IWatchlistService
{
    Task<WatchlistItemDto> AddToWatchlistAsync(string userId, int auctionId);
    Task RemoveFromWatchlistAsync(string userId, int watchlistId);
    Task<List<WatchlistItemDto>> GetUserWatchlistAsync(string userId);
    Task<bool> IsInWatchlistAsync(string userId, int auctionId);
}
```

**Add Validation** (if needed):
```csharp
// Backend/CarAuction.Application/Validators/AddToWatchlistDtoValidator.cs
public class AddToWatchlistDtoValidator : AbstractValidator<AddToWatchlistDto>
{
    public AddToWatchlistDtoValidator()
    {
        RuleFor(x => x.AuctionId)
            .GreaterThan(0)
            .WithMessage("Auction ID must be greater than 0");
    }
}
```

### Step 3: Infrastructure Layer

**Location**: `Backend/CarAuction.Infrastructure/`

**Create Repository** (if needed):
```csharp
// Backend/CarAuction.Infrastructure/Repositories/WatchlistRepository.cs
public interface IWatchlistRepository : IRepository<Watchlist>
{
    Task<List<Watchlist>> GetUserWatchlistAsync(string userId);
    Task<bool> ExistsAsync(string userId, int auctionId);
}

public class WatchlistRepository : Repository<Watchlist>, IWatchlistRepository
{
    public WatchlistRepository(ApplicationDbContext context) : base(context) { }

    public async Task<List<Watchlist>> GetUserWatchlistAsync(string userId)
    {
        return await _context.Watchlists
            .Include(w => w.Auction)
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> ExistsAsync(string userId, int auctionId)
    {
        return await _context.Watchlists
            .AnyAsync(w => w.UserId == userId && w.AuctionId == auctionId);
    }
}
```

**Implement Service**:
```csharp
// Backend/CarAuction.Infrastructure/Services/WatchlistService.cs
public class WatchlistService : IWatchlistService
{
    private readonly IWatchlistRepository _watchlistRepository;
    private readonly IAuctionRepository _auctionRepository;

    public WatchlistService(
        IWatchlistRepository watchlistRepository,
        IAuctionRepository auctionRepository)
    {
        _watchlistRepository = watchlistRepository;
        _auctionRepository = auctionRepository;
    }

    public async Task<WatchlistItemDto> AddToWatchlistAsync(string userId, int auctionId)
    {
        // Check if auction exists
        var auction = await _auctionRepository.GetByIdAsync(auctionId);
        if (auction == null)
            throw new NotFoundException($"Auction with ID {auctionId} not found");

        // Check if already in watchlist
        if (await _watchlistRepository.ExistsAsync(userId, auctionId))
            throw new BadRequestException("Auction already in watchlist");

        // Add to watchlist
        var watchlist = new Watchlist
        {
            UserId = userId,
            AuctionId = auctionId,
            CreatedAt = DateTime.UtcNow
        };

        await _watchlistRepository.AddAsync(watchlist);

        return new WatchlistItemDto
        {
            Id = watchlist.Id,
            AuctionId = auction.Id,
            AuctionTitle = $"{auction.Car.Year} {auction.Car.Make} {auction.Car.Model}",
            CreatedAt = watchlist.CreatedAt
        };
    }

    // Implement other methods...
}
```

**Register in DI**:
```csharp
// Backend/CarAuction.API/Program.cs
builder.Services.AddScoped<IWatchlistRepository, WatchlistRepository>();
builder.Services.AddScoped<IWatchlistService, WatchlistService>();
```

### Step 4: API Layer

**Location**: `Backend/CarAuction.API/`

**Create Controller**:
```csharp
// Backend/CarAuction.API/Controllers/WatchlistController.cs
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WatchlistController : ControllerBase
{
    private readonly IWatchlistService _watchlistService;

    public WatchlistController(IWatchlistService watchlistService)
    {
        _watchlistService = watchlistService;
    }

    [HttpPost]
    public async Task<ActionResult<WatchlistItemDto>> AddToWatchlist(
        AddToWatchlistDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var result = await _watchlistService.AddToWatchlistAsync(userId, dto.AuctionId);
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<List<WatchlistItemDto>>> GetWatchlist()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var result = await _watchlistService.GetUserWatchlistAsync(userId);
        return Ok(result);
    }

    // Other endpoints...
}
```

**Test in Swagger**:
```bash
# Start backend
cd Backend && dotnet watch run --project CarAuction.API/CarAuction.API.csproj

# Open Swagger
# http://localhost:5142/swagger

# Test endpoints:
# 1. Login to get JWT token
# 2. Authorize in Swagger
# 3. Test POST /api/watchlist
# 4. Test GET /api/watchlist
```

---

## 🎨 Phase 3: Frontend Implementation

### Step 1: Regenerate API Client

```bash
cd Frontend
npm run generate:api
```

This creates:
- `src/api/generated/watchlist/watchlist.ts`
- TypeScript types and React Query hooks

### Step 2: Create Components

**WatchlistButton Component**:
```jsx
// Frontend/src/components/watchlist/WatchlistButton.jsx
import { useState } from 'react';
import { Button } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { usePostApiWatchlist, useDeleteApiWatchlistById } from '../../api/generated/watchlist/watchlist';
import { toast } from 'react-toastify';

export default function WatchlistButton({ auctionId, isInWatchlist, watchlistId }) {
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist);

  const addMutation = usePostApiWatchlist();
  const removeMutation = useDeleteApiWatchlistById();

  const handleToggle = async () => {
    try {
      if (inWatchlist) {
        await removeMutation.mutateAsync({ id: watchlistId });
        setInWatchlist(false);
        toast.success('Removed from watchlist');
      } else {
        await addMutation.mutateAsync({ data: { auctionId } });
        setInWatchlist(true);
        toast.success('Added to watchlist');
      }
    } catch (error) {
      toast.error('Failed to update watchlist');
    }
  };

  return (
    <Button
      icon={inWatchlist ? <HeartFilled /> : <HeartOutlined />}
      onClick={handleToggle}
      loading={addMutation.isLoading || removeMutation.isLoading}
    >
      {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </Button>
  );
}
```

**WatchlistPage Component**:
```jsx
// Frontend/src/pages/WatchlistPage.jsx
import { useGetApiWatchlist } from '../api/generated/watchlist/watchlist';
import { Spin, Empty, Card, Row, Col } from 'antd';
import AuctionCard from '../components/auction/AuctionCard';

export default function WatchlistPage() {
  const { data: watchlist, isLoading, error } = useGetApiWatchlist();

  if (isLoading) return <Spin size="large" />;
  if (error) return <div>Error loading watchlist</div>;
  if (!watchlist || watchlist.length === 0) {
    return <Empty description="No items in watchlist" />;
  }

  return (
    <div>
      <h1>My Watchlist</h1>
      <Row gutter={[16, 16]}>
        {watchlist.map(item => (
          <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
            <AuctionCard auctionId={item.auctionId} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
```

### Step 3: Add Route

```jsx
// Frontend/src/App.jsx
import WatchlistPage from './pages/WatchlistPage';

// In your routes:
<Route
  path="/watchlist"
  element={
    <ProtectedRoute>
      <WatchlistPage />
    </ProtectedRoute>
  }
/>
```

### Step 4: Integrate in Existing Pages

```jsx
// Frontend/src/pages/auctions/AuctionDetailPage.jsx
import WatchlistButton from '../../components/watchlist/WatchlistButton';

// In the component:
<WatchlistButton
  auctionId={auction.id}
  isInWatchlist={auction.isInWatchlist}
  watchlistId={auction.watchlistId}
/>
```

---

## ✅ Phase 4: Testing

### Backend Unit Tests

```csharp
// Backend/CarAuction.Tests.Unit/Services/WatchlistServiceTests.cs
public class WatchlistServiceTests
{
    private readonly Mock<IWatchlistRepository> _watchlistRepoMock;
    private readonly Mock<IAuctionRepository> _auctionRepoMock;
    private readonly WatchlistService _service;

    public WatchlistServiceTests()
    {
        _watchlistRepoMock = new Mock<IWatchlistRepository>();
        _auctionRepoMock = new Mock<IAuctionRepository>();
        _service = new WatchlistService(_watchlistRepoMock.Object, _auctionRepoMock.Object);
    }

    [Fact]
    public async Task AddToWatchlistAsync_ValidAuction_ReturnsWatchlistItem()
    {
        // Arrange
        var userId = "user123";
        var auctionId = 1;
        var auction = new Auction { Id = auctionId, /* ... */ };

        _auctionRepoMock.Setup(x => x.GetByIdAsync(auctionId))
            .ReturnsAsync(auction);
        _watchlistRepoMock.Setup(x => x.ExistsAsync(userId, auctionId))
            .ReturnsAsync(false);

        // Act
        var result = await _service.AddToWatchlistAsync(userId, auctionId);

        // Assert
        result.Should().NotBeNull();
        result.AuctionId.Should().Be(auctionId);
        _watchlistRepoMock.Verify(x => x.AddAsync(It.IsAny<Watchlist>()), Times.Once);
    }

    [Fact]
    public async Task AddToWatchlistAsync_AuctionNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var userId = "user123";
        var auctionId = 999;

        _auctionRepoMock.Setup(x => x.GetByIdAsync(auctionId))
            .ReturnsAsync((Auction)null);

        // Act & Assert
        await _service.Invoking(s => s.AddToWatchlistAsync(userId, auctionId))
            .Should().ThrowAsync<NotFoundException>();
    }

    // More tests...
}
```

### Backend Integration Tests

```csharp
// Backend/CarAuction.Tests.Integration/Controllers/WatchlistControllerTests.cs
public class WatchlistControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public WatchlistControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task AddToWatchlist_ValidRequest_ReturnsOk()
    {
        // Arrange
        var token = await GetAuthTokenAsync();
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var dto = new AddToWatchlistDto { AuctionId = 1 };

        // Act
        var response = await _client.PostAsJsonAsync("/api/watchlist", dto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<WatchlistItemDto>();
        result.Should().NotBeNull();
    }

    // More tests...
}
```

### Frontend Testing (Manual)

**Checklist**:
- [ ] Can add auction to watchlist
- [ ] Can remove auction from watchlist
- [ ] Watchlist page displays items
- [ ] Empty state shows when watchlist is empty
- [ ] Loading states work correctly
- [ ] Error handling works
- [ ] Button toggles correctly
- [ ] Toast notifications appear
- [ ] Works on mobile/tablet/desktop

---

## 📝 Phase 5: Documentation

### Update Documentation

**1. API Reference**:
```markdown
// docs/backend/api-reference.md

### Watchlist Endpoints

#### Add to Watchlist
- **POST** `/api/watchlist`
- **Auth**: Required
- **Body**: `{ "auctionId": 1 }`
- **Response**: `WatchlistItemDto`

#### Get User Watchlist
- **GET** `/api/watchlist`
- **Auth**: Required
- **Response**: `List<WatchlistItemDto>`

// ... more endpoints
```

**2. Component Documentation**:
```markdown
// docs/frontend/ui-components.md

### WatchlistButton
Location: `src/components/watchlist/WatchlistButton.jsx`

Props:
- `auctionId` (number, required) - ID of the auction
- `isInWatchlist` (boolean, required) - Current watchlist status
- `watchlistId` (number, optional) - ID of watchlist entry if in watchlist

Usage:
\`\`\`jsx
<WatchlistButton
  auctionId={auction.id}
  isInWatchlist={true}
  watchlistId={123}
/>
\`\`\`
```

**3. Update PROJECT-STATUS.md**:
```markdown
### Phase X: Feature Name (100% Complete)
- ✅ Backend entities and migrations
- ✅ Service implementation
- ✅ API endpoints
- ✅ Frontend components
- ✅ Integration
- ✅ Testing
- ✅ Documentation
```

---

## 🔄 Phase 6: Code Review & Deployment

### Create Pull Request

```bash
# Push your feature branch
git push origin feature/watchlist

# Create PR on GitHub with description:
```

**PR Description**:
```markdown
## Feature: User Watchlist

### Description
Allows users to save auctions to a watchlist for easy tracking.

### Changes Made
**Backend**:
- Added Watchlist entity
- Created WatchlistService with full CRUD
- Added WatchlistController with 4 endpoints
- Added migration for Watchlist table

**Frontend**:
- Created WatchlistButton component
- Created WatchlistPage
- Added /watchlist route
- Integrated with AuctionDetailPage

### Testing
- ✅ 15 unit tests added (all passing)
- ✅ 8 integration tests added (all passing)
- ✅ Manual testing completed
- ✅ Tested on mobile, tablet, desktop

### Screenshots
[Add screenshots]

### Closes #123
```

### After Merge

```bash
# Update local branches
git checkout develop
git pull origin develop

# Delete feature branch
git branch -d feature/watchlist

# Monitor deployment
# Check logs for errors
# Verify feature in staging
```

---

## 🚀 Checklist for Complete Feature

Use this checklist for every new feature:

### Planning
- [ ] Requirements documented
- [ ] User stories defined
- [ ] Acceptance criteria listed
- [ ] Design documented
- [ ] Dependencies identified

### Backend
- [ ] Domain entities created
- [ ] Database migration created and applied
- [ ] DTOs created
- [ ] Service interface defined
- [ ] Service implemented
- [ ] Repository created (if needed)
- [ ] Controller created
- [ ] Registered in DI
- [ ] Tested in Swagger
- [ ] Unit tests written
- [ ] Integration tests written

### Frontend
- [ ] API client regenerated
- [ ] Components created
- [ ] Pages created (if needed)
- [ ] Routes added
- [ ] State management added
- [ ] Integrated in existing pages
- [ ] Error handling added
- [ ] Loading states added
- [ ] Responsive design verified
- [ ] Manual testing completed

### Documentation
- [ ] API reference updated
- [ ] Component documentation updated
- [ ] Architecture docs updated (if needed)
- [ ] PROJECT-STATUS.md updated
- [ ] Comments added for complex logic

### Code Quality
- [ ] Follows CONFIGURATION.md conventions
- [ ] No console logs or debug code
- [ ] Proper error handling
- [ ] Security considerations addressed
- [ ] Performance optimized
- [ ] Self-reviewed

### Review & Deploy
- [ ] PR created with description
- [ ] Code review completed
- [ ] All checks passing
- [ ] Merged to develop
- [ ] Deployed to staging
- [ ] Verified in staging
- [ ] Deployed to production (if approved)

---

## 📚 Additional Resources

- **Configuration Rules**: `/CONFIGURATION.md`
- **Development Workflow**: `./development-workflow.md`
- **Deployment Workflow**: `./deployment-workflow.md`
- **Backend Architecture**: `/docs/backend/architecture.md`
- **Frontend Architecture**: `/docs/frontend/architecture.md`

---

**Estimated Time for Typical Feature**: 8-16 hours (varies by complexity)

---

# Deployment Workflow

**Purpose**: Guide for deploying BRAVOCARS to staging and production environments.

**Last Updated**: 2025-11-08

---

## 🎯 Overview

This workflow covers:
- Local development deployment
- Staging deployment
- Production deployment
- Rollback procedures
- Health checks and monitoring

---

## 🏠 Local Development Deployment

### Quick Start (One Command)

```bash
./start-dev.sh
```

This script:
1. Starts Docker services (PostgreSQL, Redis)
2. Waits for services to be healthy
3. Starts backend (Terminal 1)
4. Starts frontend (Terminal 2)

### Manual Start

```bash
# Terminal 1: Start Docker
docker-compose up -d

# Wait for services to be healthy
docker-compose ps

# Terminal 2: Start Backend
cd Backend
dotnet watch run --project CarAuction.API/CarAuction.API.csproj

# Terminal 3: Start Frontend
cd Frontend
npm run dev
```

### Verification

```bash
# Check services
curl http://localhost:5142/swagger    # Backend Swagger
curl http://localhost:5173            # Frontend
curl http://localhost:5142/hangfire   # Hangfire Dashboard

# Check Docker services
docker-compose ps
```

---

## 🧪 Staging Deployment

### Prerequisites

- [ ] Code merged to `develop` branch
- [ ] All tests passing
- [ ] Code review completed
- [ ] Database migrations tested locally
- [ ] Environment variables configured

### Step 1: Prepare for Deployment

**1. Verify Code Quality**:
```bash
# Run all tests
cd Backend && dotnet test
cd Frontend && npm test

# Run linter
cd Frontend && npm run lint

# Build production bundle
cd Frontend && npm run build
```

**2. Check Database Migrations**:
```bash
cd Backend

# List pending migrations
dotnet ef migrations list --project CarAuction.Infrastructure --startup-project CarAuction.API

# Verify migration scripts
# Review SQL in CarAuction.Infrastructure/Migrations/
```

**3. Update Version**:
```bash
# Tag release
git tag -a v1.x.x-staging -m "Staging release v1.x.x"
git push origin v1.x.x-staging
```

### Step 2: Deploy to Staging Server

**Option A: Docker Compose (Recommended)**:

```bash
# SSH to staging server
ssh user@staging.bravocars.com

# Navigate to project directory
cd /var/www/bravocars

# Pull latest code
git fetch origin
git checkout develop
git pull origin develop

# Copy environment file
cp .env.staging .env

# Build and start services
docker-compose -f docker-compose.staging.yml up -d --build

# Run database migrations
docker-compose exec backend dotnet ef database update --project CarAuction.Infrastructure --startup-project CarAuction.API

# Check status
docker-compose ps
docker-compose logs -f
```

**Option B: Manual Deployment**:

```bash
# Backend
cd Backend
dotnet publish CarAuction.API/CarAuction.API.csproj -c Release -o /var/www/bravocars/backend

# Run migrations
dotnet ef database update --project CarAuction.Infrastructure --startup-project CarAuction.API

# Restart service
sudo systemctl restart bravocars-api

# Frontend
cd Frontend
npm run build
rsync -avz dist/ user@staging.bravocars.com:/var/www/bravocars/frontend/

# Restart nginx
sudo systemctl restart nginx
```

### Step 3: Verify Staging Deployment

**Health Checks**:
```bash
# API health check
curl https://staging-api.bravocars.com/health

# Swagger documentation
curl https://staging-api.bravocars.com/swagger/index.html

# Frontend
curl https://staging.bravocars.com

# Database connection
docker-compose exec postgres psql -U postgres -d bravocars -c "SELECT COUNT(*) FROM \"AspNetUsers\";"

# Redis connection
docker-compose exec redis redis-cli ping
```

**Functional Tests**:
- [ ] Login works
- [ ] Registration works
- [ ] Auctions load
- [ ] Bidding works
- [ ] Real-time updates work (SignalR)
- [ ] Admin dashboard accessible
- [ ] Background jobs running (check Hangfire dashboard)

**Performance Checks**:
```bash
# Check response times
curl -o /dev/null -s -w 'Total: %{time_total}s\n' https://staging-api.bravocars.com/api/auctions

# Check memory usage
docker stats

# Check logs for errors
docker-compose logs --tail=100 backend
```

### Step 4: Staging Sign-Off

**Checklist**:
- [ ] All features working as expected
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Mobile responsiveness verified
- [ ] Security headers present
- [ ] SSL certificate valid

---

## 🚀 Production Deployment

### Prerequisites

- [ ] Staging deployment successful
- [ ] Stakeholder approval
- [ ] Database backup completed
- [ ] Rollback plan prepared
- [ ] Team notified of deployment window

### Step 1: Pre-Deployment

**1. Create Release Branch**:
```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.x.x
git push origin release/v1.x.x
```

**2. Backup Production Database**:
```bash
# SSH to production server
ssh user@bravocars.com

# Create backup
docker-compose exec postgres pg_dump -U postgres bravocars > backup_$(date +%Y%m%d_%H%M%S).sql

# Or using backup script
./scripts/backup-database.sh
```

**3. Prepare Maintenance Page** (Optional):
```bash
# Enable maintenance mode
sudo ln -s /var/www/maintenance.html /var/www/bravocars/frontend/index.html
```

### Step 2: Deploy to Production

**1. Pull Code**:
```bash
# SSH to production server
ssh user@bravocars.com

# Navigate to project
cd /var/www/bravocars

# Pull release branch
git fetch origin
git checkout release/v1.x.x
git pull origin release/v1.x.x
```

**2. Update Configuration**:
```bash
# Verify production environment variables
cat .env

# Important settings:
# - ASPNETCORE_ENVIRONMENT=Production
# - JWT_SECRET (strong secret)
# - Database connection string
# - Email SMTP settings
# - Redis connection
```

**3. Deploy Backend**:
```bash
# Build backend
cd Backend
dotnet publish CarAuction.API/CarAuction.API.csproj -c Release -o /var/www/bravocars/production/backend

# Run database migrations
dotnet ef database update --project CarAuction.Infrastructure --startup-project CarAuction.API

# Restart backend service
sudo systemctl restart bravocars-api

# Check logs
sudo journalctl -u bravocars-api -f
```

**4. Deploy Frontend**:
```bash
cd Frontend

# Build production bundle
npm run build

# Copy to production directory
sudo cp -r dist/* /var/www/bravocars/production/frontend/

# Restart nginx
sudo systemctl restart nginx
```

**5. Deploy Docker Services** (Alternative):
```bash
# Using Docker Compose
docker-compose -f docker-compose.production.yml up -d --build

# Verify services
docker-compose ps

# Check logs
docker-compose logs -f
```

### Step 3: Post-Deployment Verification

**Immediate Checks** (within 5 minutes):
```bash
# API responding
curl https://api.bravocars.com/health

# Frontend loading
curl https://bravocars.com

# Database accessible
# Login to admin dashboard and check stats

# Background jobs running
# Check Hangfire dashboard: https://api.bravocars.com/hangfire

# SignalR connections
# Test real-time bidding

# Check error logs
tail -f Backend/CarAuction.API/logs/bravocars-$(date +%Y%m%d).log
```

**Functional Verification** (within 15 minutes):
- [ ] User can register
- [ ] User can login
- [ ] Auctions display correctly
- [ ] Bidding works
- [ ] Real-time updates work
- [ ] Admin dashboard works
- [ ] Email notifications sent
- [ ] Background jobs executing

**Performance Monitoring** (ongoing):
```bash
# CPU and memory usage
top
htop

# Docker stats
docker stats

# Response times
# Use monitoring tools (Grafana, New Relic, etc.)

# Error rate
# Monitor logs and error tracking service
```

### Step 4: Merge Release

```bash
# After successful production deployment

# Merge release to main
git checkout main
git merge release/v1.x.x
git tag -a v1.x.x -m "Production release v1.x.x"
git push origin main
git push origin v1.x.x

# Merge back to develop
git checkout develop
git merge release/v1.x.x
git push origin develop

# Delete release branch
git branch -d release/v1.x.x
git push origin --delete release/v1.x.x
```

---

## 🔄 Rollback Procedures

### When to Rollback

- Critical bugs affecting core functionality
- Security vulnerabilities discovered
- Data corruption or loss
- Performance degradation > 50%
- Service unavailable for > 5 minutes

### Quick Rollback (Docker)

```bash
# SSH to server
ssh user@bravocars.com

cd /var/www/bravocars

# Stop current containers
docker-compose down

# Checkout previous version
git fetch origin
git checkout v1.x.x-previous  # Previous stable tag

# Start containers
docker-compose -f docker-compose.production.yml up -d

# Restore database (if needed)
docker-compose exec postgres psql -U postgres bravocars < backup_TIMESTAMP.sql

# Verify
curl https://api.bravocars.com/health
```

### Manual Rollback

**Backend**:
```bash
# Stop service
sudo systemctl stop bravocars-api

# Restore previous version
cd /var/www/bravocars/production/backend
rm -rf *
cp -r /var/www/bravocars/backups/backend-v1.x.x-previous/* .

# Rollback database migrations (if needed)
dotnet ef database update PreviousMigrationName --project CarAuction.Infrastructure --startup-project CarAuction.API

# Start service
sudo systemctl start bravocars-api
```

**Frontend**:
```bash
# Restore previous frontend build
cd /var/www/bravocars/production/frontend
rm -rf *
cp -r /var/www/bravocars/backups/frontend-v1.x.x-previous/* .

# Restart nginx
sudo systemctl restart nginx
```

**Database**:
```bash
# Restore from backup
docker-compose exec postgres psql -U postgres -c "DROP DATABASE bravocars;"
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE bravocars;"
docker-compose exec postgres psql -U postgres bravocars < backup_TIMESTAMP.sql
```

### Post-Rollback

- [ ] Verify all services running
- [ ] Check error logs
- [ ] Notify team and stakeholders
- [ ] Document rollback reason
- [ ] Plan fix and redeployment

---

## 📊 Monitoring & Health Checks

### Automated Health Checks

**API Health Endpoint**:
```csharp
// Backend/CarAuction.API/Controllers/HealthController.cs
[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConnectionMultiplexer _redis;

    [HttpGet]
    public async Task<IActionResult> Check()
    {
        var health = new
        {
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Database = await CheckDatabase(),
            Redis = CheckRedis(),
            Version = Assembly.GetExecutingAssembly().GetName().Version.ToString()
        };

        return Ok(health);
    }

    private async Task<string> CheckDatabase()
    {
        try
        {
            await _context.Database.CanConnectAsync();
            return "Connected";
        }
        catch
        {
            return "Disconnected";
        }
    }

    private string CheckRedis()
    {
        try
        {
            _redis.GetDatabase().Ping();
            return "Connected";
        }
        catch
        {
            return "Disconnected";
        }
    }
}
```

### Monitoring Tools

**Log Monitoring**:
```bash
# Real-time log monitoring
tail -f Backend/CarAuction.API/logs/bravocars-$(date +%Y%m%d).log

# Search for errors
grep -i "error" Backend/CarAuction.API/logs/bravocars-$(date +%Y%m%d).log

# Count errors
grep -c "error" Backend/CarAuction.API/logs/bravocars-$(date +%Y%m%d).log
```

**Resource Monitoring**:
```bash
# CPU and memory
docker stats

# Disk usage
df -h

# Network connections
netstat -tulpn

# Process list
ps aux | grep dotnet
```

**Database Monitoring**:
```sql
-- Active connections
SELECT COUNT(*) FROM pg_stat_activity;

-- Slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Database size
SELECT pg_size_pretty(pg_database_size('bravocars'));
```

---

## 🔒 Security Considerations

### Pre-Deployment Security Checklist

- [ ] No secrets in code or config files
- [ ] Environment variables properly set
- [ ] HTTPS enabled and enforced
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] CSRF tokens in place
- [ ] JWT secret is strong and unique
- [ ] Database credentials rotated
- [ ] Firewall rules configured

### Post-Deployment Security Verification

```bash
# Check security headers
curl -I https://bravocars.com | grep -i "security\|x-frame\|x-content"

# Verify HTTPS redirect
curl -I http://bravocars.com

# Check CORS
curl -H "Origin: https://evil.com" https://api.bravocars.com/api/auctions

# Verify authentication
curl https://api.bravocars.com/api/admin/users  # Should return 401
```

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Staging deployment successful
- [ ] Database backup completed
- [ ] Rollback plan documented
- [ ] Team notified
- [ ] Change window scheduled

### Deployment
- [ ] Maintenance mode enabled (if needed)
- [ ] Code deployed
- [ ] Database migrations run
- [ ] Services restarted
- [ ] Configuration verified
- [ ] Maintenance mode disabled

### Post-Deployment
- [ ] Health checks passed
- [ ] Functional tests passed
- [ ] Performance acceptable
- [ ] No errors in logs
- [ ] Monitoring active
- [ ] Team notified of completion
- [ ] Documentation updated

---

## 📞 Support Contacts

### Emergency Contacts
- **DevOps Lead**: [contact]
- **Backend Lead**: [contact]
- **Frontend Lead**: [contact]
- **Database Admin**: [contact]

### Service Providers
- **Hosting**: Hostinger (support@hostinger.com)
- **Domain**: [registrar]
- **Email**: [SMTP provider]

---

## 📚 Additional Resources

- **Server Credentials**: [Secure location]
- **Monitoring Dashboard**: [URL]
- **Error Tracking**: [URL]
- **CI/CD Pipeline**: `.github/workflows/`
- **Docker Compose Files**:
  - Development: `docker-compose.yml`
  - Staging: `docker-compose.staging.yml`
  - Production: `docker-compose.production.yml`

---

**Remember**: Always test in staging before production. Have a rollback plan ready. Monitor closely after deployment.

---

# Error Handling Workflow

**Purpose**: Systematic approach to investigating, debugging, and resolving errors in BRAVOCARS.

**Last Updated**: 2025-11-08

---

## 🎯 Overview

This workflow provides a structured approach to:
- Identifying and reproducing errors
- Finding error logs
- Systematic debugging
- Checking known errors
- Documenting solutions
- Preventing recurrence

---

## 🚨 Quick Error Response

### Immediate Actions (First 5 Minutes)

1. **Identify Severity**:
   - 🔴 Critical: Site down, data loss, security breach → Emergency procedure
   - 🟡 High: Feature broken, many users affected → Prioritize immediately
   - 🟢 Medium: Minor issue, few users affected → Schedule fix
   - ⚪ Low: Cosmetic, no functional impact → Backlog

2. **Gather Basic Information**:
   - What is the error message?
   - When did it start occurring?
   - Which users are affected?
   - What actions trigger it?
   - Environment (dev, staging, production)?

3. **Check System Status**:
   ```bash
   # Are services running?
   docker-compose ps

   # Backend status
   curl http://localhost:5142/health

   # Check ports
   lsof -i :5142  # Backend
   lsof -i :5173  # Frontend
   lsof -i :5432  # PostgreSQL
   lsof -i :6379  # Redis
   ```

---

## 📋 Systematic Investigation

### Step 1: Check Known Errors

**Before deep investigation, check if this is a known issue**:

```bash
# Check known errors documentation
cat /docs/error-tracking/KNOWN-ERRORS.md

# Search for specific error
grep -i "your error message" /docs/error-tracking/*.md
```

**Known Error Database**:
- **[KNOWN-ERRORS.md](/docs/error-tracking/KNOWN-ERRORS.md)** - Main database
- **[database-errors.md](/docs/error-tracking/database-errors.md)** - Database issues
- **[api-errors.md](/docs/error-tracking/api-errors.md)** - API issues
- **[frontend-errors.md](/docs/error-tracking/frontend-errors.md)** - Frontend issues
- **[infrastructure-errors.md](/docs/error-tracking/infrastructure-errors.md)** - Infrastructure issues

**If found in known errors**:
- Follow documented solution
- If solution doesn't work, continue investigation
- Update known error with new findings

### Step 2: Reproduce the Error

**Essential for debugging**:
- Document exact steps to reproduce
- Test in clean environment
- Try different scenarios (edge cases)
- Check browser console (for frontend errors)
- Check network tab (for API errors)

**Reproduction Checklist**:
- [ ] Can reproduce consistently
- [ ] Documented steps
- [ ] Identified trigger conditions
- [ ] Noted environment details
- [ ] Captured error screenshots/videos

### Step 3: Collect Error Information

**Backend Errors**:
```bash
# Check today's logs
tail -f Backend/CarAuction.API/logs/bravocars-$(date +%Y%m%d).log

# Search for specific error
grep -i "error\|exception" Backend/CarAuction.API/logs/bravocars-$(date +%Y%m%d).log

# Check recent errors with context (10 lines before/after)
grep -i -B 10 -A 10 "exception" Backend/CarAuction.API/logs/bravocars-$(date +%Y%m%d).log

# Check specific time range
grep "2025-11-08 14:" Backend/CarAuction.API/logs/bravocars-20251108.log
```

**Frontend Errors**:
```javascript
// Browser Console (F12)
// Check for:
// - JavaScript errors
// - Failed network requests
// - Console warnings

// Network Tab:
// - Failed API calls
// - Response codes (4xx, 5xx)
// - Response bodies
```

**Database Errors**:
```bash
# Check PostgreSQL logs
docker-compose logs postgres | tail -100

# Connect to database and check
docker-compose exec postgres psql -U postgres -d bravocars

# Check for locks
SELECT * FROM pg_locks WHERE granted = false;

# Check active queries
SELECT pid, query, state, query_start
FROM pg_stat_activity
WHERE state != 'idle';
```

**Redis Errors**:
```bash
# Check Redis logs
docker-compose logs redis | tail -100

# Connect to Redis
docker-compose exec redis redis-cli

# Check keys
KEYS *

# Check memory usage
INFO memory
```

### Step 4: Analyze Stack Trace

**Backend Stack Trace Analysis**:

Example error:
```
Npgsql.NpgsqlException (0x80004005): Failed to connect to 127.0.0.1:5432
 ---> System.Net.Sockets.SocketException (61): Connection refused
   at Npgsql.Internal.NpgsqlConnector.Connect(NpgsqlTimeout timeout)
   at Npgsql.Internal.NpgsqlConnector.RawOpen(SslMode sslMode, NpgsqlTimeout timeout)
   at Hangfire.PostgreSql.PostgreSqlStorage.CreateAndOpenConnection()
   at Hangfire.Server.BackgroundServerProcess.Execute()
```

**Key Information**:
- **Error Type**: `NpgsqlException` → Database error
- **Root Cause**: `SocketException: Connection refused` → Service not running
- **Location**: `BackgroundServerProcess.Execute()` → Hangfire job
- **Action**: Start PostgreSQL container

**Stack Trace Analysis Steps**:
1. Identify error type (top of stack)
2. Find root cause (inner exception)
3. Locate where error occurred (stack frames)
4. Understand error context (surrounding code)
5. Determine fix approach

### Step 5: Check Dependencies

**Service Dependencies**:
```bash
# Docker services
docker-compose ps

# Expected output:
# bravocars-postgres    Up (healthy)
# bravocars-redis       Up (healthy)

# If services down:
docker-compose up -d
```

**Application Dependencies**:
```bash
# Backend packages
cd Backend && dotnet restore

# Frontend packages
cd Frontend && npm install

# Check for outdated packages
dotnet list package --outdated
npm outdated
```

**External Dependencies**:
- Database accessible?
- Redis accessible?
- SMTP server reachable?
- Third-party APIs responding?

---

## 🔍 Category-Specific Debugging

### Database Errors

**Common Issues**:
1. **Connection Refused**
   ```bash
   # Check if PostgreSQL running
   docker-compose ps postgres

   # Restart if needed
   docker-compose restart postgres
   ```

2. **Migration Errors**
   ```bash
   # Check migration history
   dotnet ef migrations list --project CarAuction.Infrastructure

   # Rollback if needed
   dotnet ef database update PreviousMigration --project CarAuction.Infrastructure

   # Reapply
   dotnet ef database update --project CarAuction.Infrastructure
   ```

3. **Deadlocks**
   ```sql
   -- Check for locks
   SELECT * FROM pg_stat_activity WHERE state = 'active';

   -- Kill problematic query
   SELECT pg_terminate_backend(pid);
   ```

**Full debugging guide**: [database-errors.md](/docs/error-tracking/database-errors.md)

### API Errors

**Common Issues**:
1. **401 Unauthorized**
   - Check JWT token validity
   - Verify token in request header
   - Check user approval status

2. **404 Not Found**
   - Verify route exists
   - Check route parameters
   - Inspect route configuration

3. **500 Internal Server Error**
   - Check backend logs
   - Look for exceptions
   - Verify data validation

**Debugging**:
```bash
# Test endpoint with curl
curl -X GET https://api.bravocars.com/api/auctions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -v  # Verbose output

# Check Swagger documentation
# http://localhost:5142/swagger

# Test in Postman/Insomnia
```

**Full debugging guide**: [api-errors.md](/docs/error-tracking/api-errors.md)

### Frontend Errors

**Common Issues**:
1. **API Call Failures**
   ```javascript
   // Check axios interceptors
   // Check base URL configuration
   // Verify CORS settings
   ```

2. **State Management Issues**
   ```javascript
   // Check Zustand store
   // Verify state updates
   // Check React Query cache
   ```

3. **Rendering Errors**
   ```javascript
   // Check React DevTools
   // Verify props
   // Check console for warnings
   ```

**Debugging Tools**:
- Browser DevTools (F12)
- React DevTools
- Redux DevTools (if using Redux)
- Network tab for API calls
- Console for errors/warnings

**Full debugging guide**: [frontend-errors.md](/docs/error-tracking/frontend-errors.md)

### Infrastructure Errors

**Common Issues**:
1. **Docker Container Issues**
   ```bash
   # Check container status
   docker-compose ps

   # Check logs
   docker-compose logs [service]

   # Restart service
   docker-compose restart [service]

   # Rebuild if needed
   docker-compose up -d --build [service]
   ```

2. **Port Conflicts**
   ```bash
   # Find process using port
   lsof -i :5142

   # Kill process
   kill -9 PID
   ```

3. **Resource Issues**
   ```bash
   # Check disk space
   df -h

   # Check memory
   free -h

   # Check Docker resources
   docker system df
   ```

**Full debugging guide**: [infrastructure-errors.md](/docs/error-tracking/infrastructure-errors.md)

---

## 📝 Documenting Errors

### When to Document

Document errors if:
- Error is not in known errors database
- Error took significant time to resolve
- Error is likely to occur again
- Solution is non-obvious
- Multiple people encountered it

### How to Document

**1. Add to KNOWN-ERRORS.md**:

```markdown
## Error ID: [CATEGORY]-[NUMBER]

**Category**: [Database/API/Frontend/Infrastructure/Build]
**Severity**: [Critical/High/Medium/Low]

### Error Message
```
[Exact error message or stack trace]
```

### Description
Brief description of what this error means and when it occurs.

### Symptoms
- Symptom 1
- Symptom 2

### Root Cause
Detailed explanation of why this error occurs.

### Solution
Step-by-step solution:
1. Step 1
2. Step 2
3. Step 3

### Prevention
How to prevent this error from occurring again.

### Related Issues
- GitHub Issue #123
- Similar Error: DB-002

### Metadata
- **First Seen**: 2025-11-08
- **Last Seen**: 2025-11-08
- **Frequency**: Rare/Occasional/Common
- **Affected Environments**: Development/Staging/Production
- **Related Files**:
  - path/to/file1.cs
  - path/to/file2.jsx
```

**2. Update Category-Specific Document**:

Add to appropriate category file:
- `/docs/error-tracking/database-errors.md`
- `/docs/error-tracking/api-errors.md`
- `/docs/error-tracking/frontend-errors.md`
- `/docs/error-tracking/infrastructure-errors.md`

---

## 🛠️ Fixing Errors

### Development Process

1. **Create Fix Branch**:
   ```bash
   git checkout -b fix/brief-description
   ```

2. **Write Failing Test** (if possible):
   ```csharp
   [Fact]
   public void TestThatReproducesError()
   {
       // Arrange
       // Setup that triggers error

       // Act & Assert
       // Should fail initially
   }
   ```

3. **Implement Fix**:
   - Make minimal changes to fix issue
   - Ensure test now passes
   - Verify no regressions

4. **Test Thoroughly**:
   ```bash
   # Run all tests
   dotnet test

   # Test manually
   # Verify fix in UI
   # Test edge cases
   ```

5. **Document Fix**:
   - Add to KNOWN-ERRORS.md
   - Update relevant documentation
   - Add code comments if complex

6. **Create Pull Request**:
   ```markdown
   ## Fix: [Brief Description]

   ### Problem
   [Description of error]

   ### Root Cause
   [Why it occurred]

   ### Solution
   [How it was fixed]

   ### Testing
   - [ ] Reproduced error
   - [ ] Verified fix
   - [ ] Added test
   - [ ] No regressions

   ### Related
   Fixes #123
   ```

---

## 🎯 Error Prevention

### Proactive Measures

**Code Quality**:
- [ ] Write unit tests for business logic
- [ ] Write integration tests for API endpoints
- [ ] Use TypeScript for frontend (strict mode)
- [ ] Enable nullable reference types in C#
- [ ] Use linters and formatters
- [ ] Follow CONFIGURATION.md conventions

**Error Handling**:
- [ ] Try-catch blocks for risky operations
- [ ] Proper exception types
- [ ] Meaningful error messages
- [ ] Graceful degradation
- [ ] User-friendly error displays

**Monitoring**:
- [ ] Structured logging with Serilog
- [ ] Error tracking service (Sentry, etc.)
- [ ] Health check endpoints
- [ ] Performance monitoring
- [ ] Alerting for critical errors

**Testing**:
- [ ] Unit test coverage > 75%
- [ ] Integration tests for critical paths
- [ ] E2E tests for user flows
- [ ] Load testing for performance
- [ ] Security testing

---

## 📊 Error Tracking Metrics

### What to Track

- **Error Frequency**: How often does each error occur?
- **Error Distribution**: Which categories have most errors?
- **Resolution Time**: How long to fix each error?
- **Recurrence Rate**: How many errors reoccur?
- **Impact**: How many users affected?

### Improvement Goals

- Reduce total errors by 50% quarter over quarter
- Reduce critical errors to zero
- Improve mean time to resolution (MTTR)
- Increase test coverage
- Document all recurring errors

---

## ✅ Error Resolution Checklist

- [ ] Error reproduced
- [ ] Root cause identified
- [ ] Logs examined
- [ ] Stack trace analyzed
- [ ] Fix implemented
- [ ] Fix tested
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] KNOWN-ERRORS.md updated
- [ ] Pull request created
- [ ] Code reviewed
- [ ] Deployed to staging
- [ ] Verified in staging
- [ ] Deployed to production
- [ ] Monitored post-deployment

---

## 📚 Additional Resources

### Internal Documentation
- **[KNOWN-ERRORS.md](/docs/error-tracking/KNOWN-ERRORS.md)** - Known error database
- **[Database Errors](/docs/error-tracking/database-errors.md)** - Database-specific issues
- **[API Errors](/docs/error-tracking/api-errors.md)** - API-specific issues
- **[Frontend Errors](/docs/error-tracking/frontend-errors.md)** - Frontend-specific issues
- **[Infrastructure Errors](/docs/error-tracking/infrastructure-errors.md)** - Infrastructure issues

### External Resources
- **.NET Exception Handling**: https://learn.microsoft.com/dotnet/csharp/fundamentals/exceptions/
- **PostgreSQL Error Codes**: https://www.postgresql.org/docs/current/errcodes-appendix.html
- **HTTP Status Codes**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- **React Error Boundaries**: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

---

## 🚨 Emergency Contacts

### Critical Issues
- **DevOps Lead**: [contact]
- **Backend Lead**: [contact]
- **Frontend Lead**: [contact]
- **Database Admin**: [contact]

### Escalation Path
1. Try to resolve using this workflow
2. Check KNOWN-ERRORS.md
3. Ask team in Slack/chat
4. Escalate to team lead
5. If critical, invoke incident response

---

**Remember**: Stay calm, be systematic, document everything. Every error is a learning opportunity to improve the system.
