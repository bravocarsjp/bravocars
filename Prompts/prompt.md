Set up the complete development environment for a high-traffic car auction platform.

PROJECT OVERVIEW:
Building a car auction platform with real-time bidding, user authentication with 2FA, admin approval workflow, and payment processing. The platform will handle concurrent bidding with race condition prevention and real-time updates.

TECH STACK:
- Backend: ASP.NET Core (.NET 9 SDK)
- Frontend: React with TypeScript (Vite)
- Mobile: React Native
- Database: PostgreSQL
- Cache: Redis
- Real-time: SignalR
- Background Jobs: Hangfire
- Payments: Stripe
- Initial Deployment: Hostinger VPS (with planned migration to AWS/GCP)

ENVIRONMENT SETUP NEEDED:

1. Development Tools:
   - Visual Studio 2022 or VS Code with C# extension
   - .NET 9 SDK installation
   - Node.js v20+ and npm
   - Docker Desktop
   - PostgreSQL (local development)
   - Redis (via Docker or local install)
   - Git

2. Account Setup:
   - GitHub/GitLab repository structure
   - Hostinger VPS (KVM 2 or higher)
   - Domain name registration
   - Stripe account (test mode initially)
   - Email service (Gmail SMTP, SendGrid, or AWS SES)
   - Firebase account (for mobile push notifications - later phase)

3. Project Planning:
   - Business rules definition for:
     * Minimum bid increment amount
     * Auction duration rules (admin-configurable per car)
     * Registration fee amount (if applicable)
     * Winner payment deadline
     * Refund policy
   - User roles: Admin (multiple levels), Regular User, Pending User

DELIVERABLES NEEDED:

1. Complete installation guide for all tools with verification steps
2. Git repository structure recommendation for monorepo or separate repos (API, Web, Mobile)
3. Local development environment setup with Docker Compose for:
   - PostgreSQL container
   - Redis container
   - pgAdmin (optional)
4. Environment variables template (.env.example) for:
   - Database connection strings
   - Redis connection string
   - JWT secret
   - Email credentials
   - Stripe keys (placeholder for test keys)
5. Initial project folder structure following clean architecture principles
6. README.md template with setup instructions
7. .gitignore configuration for .NET, React, and React Native

PLEASE PROVIDE:
- Step-by-step installation guide for each tool with verification commands
- docker-compose.yml for local development services
- Recommended VS Code extensions and workspace settings
- Common troubleshooting steps for setup issues
- Checklist to verify environment is ready for Phase 1

CONSTRAINTS:
- Must work on Windows, macOS, and Linux
- Docker-based services for consistency across development machines
- Clear separation between development and production configurations

OUTPUT FORMAT: Comprehensive setup guide with code blocks, commands, and verification steps for each component.
```

---

## **🏗️ PHASE 1: BACKEND FOUNDATION (Week 1-2)**
```
Build the foundational ASP.NET Core backend with authentication, database setup, and core API endpoints for a car auction platform.

PROJECT CONTEXT:
This is Phase 1 of a car auction platform. Phase 0 (environment setup) is complete. Now building the backend API with clean architecture, PostgreSQL database, JWT authentication with 2FA, and role-based authorization.

TECH STACK:
- ASP.NET Core Web API (.NET 9)
- Entity Framework Core
- PostgreSQL (Npgsql provider)
- JWT Authentication (Microsoft.AspNetCore.Authentication.JwtBearer)
- ASP.NET Core Identity
- Redis (for caching and token management)
- Hangfire (for background jobs)
- Serilog (for logging)
- FluentValidation (for input validation)
- Swagger/OpenAPI

ARCHITECTURE REQUIREMENTS:

Clean Architecture structure with:
- API Layer (Controllers, Middleware, Filters)
- Application Layer (Services, DTOs, Interfaces, Validators)
- Domain Layer (Entities, Enums, Domain Events)
- Infrastructure Layer (Data Access, External Services, Repositories)

PROJECT STRUCTURE:
```
CarAuction/
├── src/
│   ├── CarAuction.API/              # Web API project
│   ├── CarAuction.Application/       # Business logic
│   ├── CarAuction.Domain/            # Entities and interfaces
│   └── CarAuction.Infrastructure/    # Data access and external services
└── tests/
    ├── CarAuction.UnitTests/
    └── CarAuction.IntegrationTests/
```

REQUIRED NUGET PACKAGES:
- Microsoft.EntityFrameworkCore (latest .NET 9 compatible)
- Npgsql.EntityFrameworkCore.PostgreSQL
- Microsoft.AspNetCore.SignalR
- Microsoft.AspNetCore.Identity.EntityFrameworkCore
- Microsoft.AspNetCore.Authentication.JwtBearer
- Hangfire.AspNetCore
- Hangfire.PostgreSql
- StackExchange.Redis
- FluentValidation.AspNetCore
- Serilog.AspNetCore
- Swashbuckle.AspNetCore
- QRCoder (for 2FA QR code generation)

DATABASE SCHEMA:

1. Users (ASP.NET Identity)
   - Extended with: ApprovalStatus (Pending/Approved/Rejected), ApprovedBy, ApprovedAt, RejectionReason
   
2. Roles (ASP.NET Identity)
   - Admin, User, Moderator

3. Cars
   - Id (Guid), Make, Model, Year, VIN, Description, ImageUrls (JSON), CreatedAt, CreatedBy

4. Auctions
   - Id (Guid), CarId (FK), StartTime, EndTime, StartingPrice, CurrentPrice, Status (Upcoming/Active/Ended/Cancelled), WinnerId (FK, nullable), CreatedBy

5. Bids
   - Id (Guid), AuctionId (FK), UserId (FK), Amount, Timestamp, IsWinningBid

6. Transactions
   - Id (Guid), UserId (FK), AuctionId (FK, nullable), Amount, Type (Registration/AuctionPayment/Refund), Status (Pending/Completed/Failed), PaymentIntentId, CreatedAt

7. UserApprovals
   - Id (Guid), UserId (FK), RequestedAt, ProcessedAt, ProcessedBy (FK), Status, Comments

8. AuditLogs
   - Id (Guid), UserId (FK, nullable), Action, Entity, EntityId, Changes (JSON), Timestamp, IpAddress

AUTHENTICATION FEATURES:

1. User Registration
   - Email/password with validation
   - Password hashing (ASP.NET Identity default)
   - Email verification token generation
   - User starts in "Pending" approval status
   - Return JWT token only after admin approval

2. Login
   - Email/password authentication
   - Check if user is approved
   - 2FA verification if enabled
   - JWT token generation (access token + refresh token)
   - Store refresh token in Redis with expiration

3. Two-Factor Authentication (2FA)
   - Setup endpoint: Generate secret, create QR code
   - Verify setup: Validate TOTP code
   - Login with 2FA: Require TOTP code after password
   - Backup codes generation (10 codes)
   - Recovery flow

4. Admin Approval Workflow
   - List pending users endpoint
   - Approve user endpoint (sends email notification)
   - Reject user endpoint (with reason, sends email)
   - Approval history tracking

CORE API ENDPOINTS:

Authentication:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh-token
- POST /api/auth/2fa/setup
- POST /api/auth/2fa/verify
- POST /api/auth/2fa/validate (during login)
- GET /api/auth/2fa/backup-codes
- POST /api/auth/verify-email?token={token}

User Management:
- GET /api/users/profile (authenticated)
- PUT /api/users/profile
- PUT /api/users/change-password
- DELETE /api/users/account

Admin - User Approval:
- GET /api/admin/users/pending [Authorize(Roles="Admin")]
- POST /api/admin/users/{id}/approve
- POST /api/admin/users/{id}/reject
- GET /api/admin/users (all users with filters)

Car Management:
- POST /api/cars [Authorize(Roles="Admin")]
- GET /api/cars?status=&make=&model= (public, with filters)
- GET /api/cars/{id} (public)
- PUT /api/cars/{id} [Authorize(Roles="Admin")]
- DELETE /api/cars/{id} [Authorize(Roles="Admin")]

Auction Management:
- POST /api/auctions [Authorize(Roles="Admin")]
- GET /api/auctions?status=&page=&pageSize= (public, with pagination)
- GET /api/auctions/{id} (public)
- PUT /api/auctions/{id} [Authorize(Roles="Admin")]
- PATCH /api/auctions/{id}/status [Authorize(Roles="Admin")]

SECURITY REQUIREMENTS:
- CORS configuration for frontend origins
- Rate limiting middleware (prevent brute force)
- Input validation with FluentValidation
- SQL injection prevention (EF Core parameterized queries)
- XSS prevention (input sanitization)
- CSRF token for state-changing operations
- Audit logging for sensitive operations
- Secure password requirements (minimum length, complexity)

CONFIGURATION:
- appsettings.json structure for:
  - ConnectionStrings (PostgreSQL, Redis)
  - JwtSettings (Secret, Issuer, Audience, ExpiryMinutes)
  - EmailSettings (SMTP or API credentials)
  - CorsSettings (AllowedOrigins)
- Environment-specific config (Development, Staging, Production)

DOCKER SETUP:
- Dockerfile for API
- docker-compose.yml for local development:
  - API service
  - PostgreSQL service
  - Redis service
  - pgAdmin service (optional)

DELIVERABLES:

1. Complete project structure following clean architecture
2. All Entity models with proper relationships and indexes
3. DbContext configuration with seed data for development
4. Initial EF Core migration
5. Complete authentication system with 2FA
6. All listed API endpoints implemented
7. FluentValidation rules for all DTOs
8. Serilog configuration for structured logging
9. Swagger/OpenAPI documentation configured
10. Docker setup for local development
11. Unit tests for authentication logic
12. Integration tests for API endpoints
13. README with:
    - API documentation
    - How to run migrations
    - How to run with Docker
    - How to test endpoints

PLEASE PROVIDE:
- Step-by-step implementation guide
- Code samples for each major component
- Entity configurations and relationships
- Service layer structure with dependency injection
- Middleware setup (authentication, error handling, logging)
- Testing examples for critical flows

OUTPUT FORMAT: Comprehensive step-by-step guide with complete code examples, organized by component. Include explanations of architectural decisions.
```

---

## **⚡ PHASE 2: BIDDING LOGIC & REAL-TIME (Week 3-4)**
```
Implement core bidding functionality with race condition prevention, real-time updates using SignalR, background jobs, and Redis caching for a high-traffic car auction platform.

PROJECT CONTEXT:
Phase 1 (Backend Foundation) is complete with authentication, database, and basic API endpoints. Now implementing the critical bidding system that must handle concurrent bids, prevent race conditions, provide real-time updates to all connected clients, and automatically manage auction lifecycle.

TECH STACK (Already Set Up):
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core + PostgreSQL
- SignalR (for real-time communication)
- Redis (for caching and distributed locking)
- Hangfire (for background jobs)

PERFORMANCE REQUIREMENTS:
- Handle 100+ concurrent bids on same auction
- Real-time updates to all connected clients within 500ms
- Prevent double-bidding and race conditions
- Support 1000+ active WebSocket connections
- Server-side countdown broadcast every 30 seconds

BIDDING SYSTEM CORE FEATURES:

1. Bid Validation Logic:
   - Auction must be in "Active" status
   - User must be authenticated and approved
   - Bid amount must exceed current highest bid by minimum increment (configurable, e.g., $100)
   - User cannot bid on their own highest bid (prevent self-outbidding)
   - Auction must not be expired
   - Optional: Check user balance/deposit requirement

2. Race Condition Prevention:
   - Use PostgreSQL row-level locking (SELECT FOR UPDATE)
   - Implement optimistic concurrency with RowVersion
   - Redis distributed lock for bid processing (RedLock pattern)
   - Transaction isolation level: Serializable for bid operations

3. Bid Processing Flow:
```
   1. Receive bid request
   2. Acquire Redis lock for auction
   3. Validate bid within transaction
   4. Insert bid record
   5. Update auction current price and highest bidder
   6. Release Redis lock
   7. Broadcast update via SignalR
   8. Return response
```

API ENDPOINTS:

Bidding:
- POST /api/auctions/{auctionId}/bids [Authorize]
  - Body: { amount: decimal }
  - Response: BidResult with success/error
  
- GET /api/auctions/{auctionId}/bids?page=&pageSize= (public, paginated)
  - Returns bid history with user info (anonymized for non-admins)
  
- GET /api/users/my-bids?status=&page=&pageSize= [Authorize]
  - Returns user's bid history across all auctions
  - Filter by status: Active, Won, Lost

- GET /api/auctions/{auctionId}/highest-bid (public)
  - Returns current highest bid info

SIGNALR REAL-TIME IMPLEMENTATION:

1. Hub Setup:
   - Create AuctionHub : Hub
   - Connection authentication (JWT from query string)
   - Connection lifecycle management
   - Group management (one group per auction)

2. Hub Methods:
   - JoinAuction(auctionId): Add connection to auction group
   - LeaveAuction(auctionId): Remove connection from auction group
   - Server broadcasts (not callable by clients):
     - SendBidUpdate(auctionId, bidInfo): New bid placed
     - SendAuctionStatusUpdate(auctionId, status): Auction ended/cancelled
     - SendCountdownUpdate(auctionId, remainingSeconds): Every 30 seconds

3. SignalR Configuration:
   - Enable WebSocket transport (fallback to long-polling)
   - Configure message buffer size
   - Set keepalive interval (15 seconds)
   - Configure client timeout (30 seconds)
   - Add CORS for SignalR endpoint

4. Client Events to Broadcast:
```json
   BidPlaced: {
     "auctionId": "guid",
     "bidAmount": 25000,
     "bidderName": "User***", // Anonymized
     "timestamp": "2025-11-01T10:30:00Z",
     "totalBids": 15
   }
   
   AuctionEnded: {
     "auctionId": "guid",
     "winnerName": "User***",
     "finalPrice": 25000,
     "endTime": "2025-11-01T12:00:00Z"
   }
   
   CountdownUpdate: {
     "auctionId": "guid",
     "remainingSeconds": 3600,
     "endTime": "2025-11-01T12:00:00Z"
   }
```

HANGFIRE BACKGROUND JOBS:

1. Recurring Jobs:
   - CheckAuctionStatus (every 30 seconds):
     * Find all active auctions
     * Check if end time passed
     * Trigger auction end process
     * Broadcast countdown updates
   
   - CleanupExpiredTokens (every hour):
     * Remove expired JWT refresh tokens from Redis
   
   - GenerateDailyReport (daily at midnight):
     * Generate admin reports
     * Send email summaries

2. Delayed Jobs:
   - SendBidConfirmationEmail (immediate after bid):
     * Send email to bidder
   
   - SendOutbidNotification (immediate after being outbid):
     * Send email/push notification to previous highest bidder
   
   - SendWinnerNotification (when auction ends):
     * Email winner with payment instructions
     * Create payment transaction record

3. Hangfire Dashboard:
   - Configure at /hangfire (admin only)
   - Show job history, failed jobs, recurring jobs
   - Enable retry for failed jobs

AUCTION LIFECYCLE MANAGEMENT:

1. Auction Status Transitions:
```
   Upcoming → Active (background job checks start time)
   Active → Ended (background job checks end time OR admin manually ends)
   Active → Cancelled (admin only)
   Ended → (Winner determined, payment process starts)
```

2. End Auction Process:
   - Lock auction for updates
   - Determine winner (highest bidder)
   - Update auction status to "Ended"
   - Update auction WinnerId
   - Mark winning bid
   - Trigger winner notification
   - Create transaction record for winner payment
   - Broadcast AuctionEnded event
   - Send emails to winner and all participants

REDIS CACHING STRATEGY:

1. Cache Structure:
```
   Key: auction:{auctionId}:details
   Value: Auction object (JSON)
   TTL: 5 minutes
   
   Key: auction:{auctionId}:highest-bid
   Value: Bid object (JSON)
   TTL: 1 minute (refreshed on each bid)
   
   Key: active-auctions
   Value: List of active auction IDs
   TTL: 1 minute
   
   Key: lock:auction:{auctionId}
   Value: Lock token
   TTL: 10 seconds (for bid processing)
```

2. Cache Invalidation:
   - On bid placed: Invalidate auction details and highest bid
   - On auction status change: Invalidate auction details and active auctions list
   - On auction end: Invalidate all related caches

3. Redis Pub/Sub:
   - Optional: Use for SignalR backplane if scaling to multiple servers
   - Channel: signalr-auction-updates

BID ENTITY & REPOSITORY:
```csharp
public class Bid
{
    public Guid Id { get; set; }
    public Guid AuctionId { get; set; }
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public DateTime Timestamp { get; set; }
    public bool IsWinningBid { get; set; }
    
    // Navigation properties
    public Auction Auction { get; set; }
    public ApplicationUser User { get; set; }
}
```

Repository methods needed:
- PlaceBidAsync(bid, cancellationToken)
- GetBidsByAuctionAsync(auctionId, page, pageSize)
- GetHighestBidAsync(auctionId)
- GetUserBidsAsync(userId, status, page, pageSize)
- MarkWinningBidAsync(bidId)

TESTING REQUIREMENTS:

1. Unit Tests:
   - Bid validation logic
   - Race condition prevention
   - Auction status transitions
   - Winner determination logic

2. Integration Tests:
   - Place bid endpoint
   - Concurrent bid placement (simulate race conditions)
   - SignalR message delivery
   - Background job execution

3. Load Tests:
   - 100 concurrent bids on same auction
   - 1000 active WebSocket connections
   - Redis cache performance
   - Database query performance under load

DELIVERABLES:

1. Complete bidding service with all validation logic
2. Repository implementation with row-level locking
3. Redis caching service with distributed locking
4. SignalR hub with authentication and group management
5. Hangfire job configuration and job implementations
6. API endpoints for bidding
7. Unit tests for critical bid logic
8. Integration tests for concurrent bidding
9. Load testing script (k6 or JMeter)
10. Documentation:
    - Bidding flow diagram
    - SignalR connection guide
    - Redis caching strategy
    - Background job descriptions
    - Performance benchmarks

PLEASE PROVIDE:
- Step-by-step implementation guide for each component
- Complete code for bid service with transaction handling
- Redis distributed lock implementation
- SignalR hub complete code with connection management
- Hangfire job setup and job classes
- Testing strategy with code examples
- Performance optimization tips
- Common issues and troubleshooting guide

OUTPUT FORMAT: Detailed step-by-step guide with complete code examples, architectural explanations, and testing procedures. Include sequence diagrams for critical flows.
```

---

## **🎨 PHASE 3: FRONTEND WEB APP (Week 5-6)**
```
Build the React TypeScript frontend for the car auction platform with real-time bidding, authentication with 2FA, admin dashboard, and SignalR integration.

PROJECT CONTEXT:
Backend is complete (Phases 1-2) with authentication, bidding, and real-time SignalR. Now building the responsive web frontend that provides an excellent user experience for browsing auctions, placing bids, and real-time updates.

TECH STACK:
- React 18 with TypeScript
- Vite (build tool)
- React Router v6 (routing)
- Zustand or Redux Toolkit (state management)
- Axios (HTTP client)
- @microsoft/signalr (real-time)
- React Hook Form (forms)
- Zod (validation)
- Material-UI (MUI) or shadcn/ui (component library)
- date-fns or dayjs (date handling)
- react-toastify (notifications)
- TailwindCSS (utility-first CSS)

PROJECT STRUCTURE:
```
car-auction-web/
├── src/
│   ├── api/                  # API services
│   │   ├── axios-instance.ts
│   │   ├── auth.service.ts
│   │   ├── auction.service.ts
│   │   ├── bid.service.ts
│   │   └── admin.service.ts
│   ├── components/           # Reusable components
│   │   ├── common/           # Buttons, inputs, modals
│   │   ├── layout/           # Header, footer, sidebar
│   │   ├── auction/          # Auction card, countdown
│   │   └── admin/            # Admin-specific components
│   ├── pages/                # Route pages
│   │   ├── auth/             # Login, register, 2FA
│   │   ├── auctions/         # List, detail
│   │   ├── profile/          # User profile, my bids
│   │   └── admin/            # Admin dashboard
│   ├── hooks/                # Custom hooks
│   │   ├── useSignalR.ts
│   │   ├── useCountdown.ts
│   │   └── useAuth.ts
│   ├── store/                # State management
│   │   ├── auth.store.ts
│   │   ├── auction.store.ts
│   │   └── bid.store.ts
│   ├── types/                # TypeScript types
│   ├── utils/                # Utility functions
│   ├── App.tsx
│   └── main.tsx
├── public/
└── package.json
```

REQUIRED NPM PACKAGES:
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "@microsoft/signalr": "^8.0.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "date-fns": "^3.0.0",
    "react-toastify": "^9.1.0",
    "qrcode.react": "^3.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

FEATURES TO IMPLEMENT:

1. AUTHENTICATION PAGES:

   A. Registration Page (/register)
   - Form fields: Email, Password, Confirm Password, First Name, Last Name
   - Password strength indicator
   - Terms & conditions checkbox
   - Client-side validation (Zod)
   - Show "pending approval" message after successful registration
   - Link to login page

   B. Login Page (/login)
   - Email and password fields
   - "Remember me" checkbox
   - Show 2FA input if user has 2FA enabled
   - Forgot password link
   - Link to registration
   - Handle JWT token storage (localStorage or secure cookie)

   C. 2FA Setup Page (/2fa-setup)
   - Display QR code for authenticator app
   - Show manual entry code
   - Verification code input
   - Generate and display backup codes
   - Download backup codes button

   D. Profile Page (/profile)
   - View profile information
   - Edit profile form
   - Change password
   - Enable/disable 2FA
   - View account status (Pending/Approved)

2. AUCTION PAGES:

   A. Home/Auction List Page (/)
   - Grid of auction cards (responsive: 1 column mobile, 2-3 desktop)
   - Each card shows:
     * Car image
     * Make, model, year
     * Current highest bid
     * Live countdown timer
     * Bid count
     * Status badge (Active/Upcoming/Ended)
   - Filters:
     * Status (All/Active/Upcoming/Ended)
     * Make/Model (dropdown or search)
     * Price range (slider)
   - Search bar (full-text search)
   - Pagination or infinite scroll
   - Sort options (End time, Current price, Recently added)

   B. Auction Detail Page (/auctions/:id)
   - Car image gallery (main image + thumbnails)
   - Car details section:
     * Make, model, year, VIN
     * Description
     * Specifications
   - Current bid information:
     * Highest bid amount (large, prominent)
     * Number of bids
     * Countdown timer (updates every second)
   - Bid history section:
     * List of bids (amount, anonymized username, timestamp)
     * Auto-updates in real-time via SignalR
     * Paginated
   - Bid placement form:
     * Amount input (pre-filled with minimum next bid)
     * Submit button (disabled if not logged in or auction ended)
     * Loading state during submission
     * Success/error toast notifications
   - Winner announcement (if auction ended)
   - "Login to bid" prompt for unauthenticated users

3. USER DASHBOARD:

   A. My Bids Page (/my-bids)
   - Tabs: Active Bids / Won Auctions / Lost Auctions
   - Table or card view showing:
     * Car info (image, make, model)
     * Auction status
     * User's highest bid
     * Current highest bid (if active)
     * Outcome (if ended)
   - Pagination
   - Link to each auction detail page

4. ADMIN DASHBOARD:

   A. Admin Navigation (sidebar or top nav)
   - Dashboard overview
   - User management
   - Car management
   - Auction management
   - Analytics

   B. User Approval Page (/admin/users/pending)
   - Table of pending users
   - Columns: Name, Email, Registration Date, Actions
   - Actions: Approve button, Reject button (with reason modal)
   - Filters: Status (Pending/Approved/Rejected)
   - Search by email or name

   C. Car Management (/admin/cars)
   - List of all cars
   - Add new car button → opens modal/form:
     * Make, model, year, VIN
     * Description (rich text editor)
     * Upload multiple images
     * Submit button
   - Edit car button for each car
   - Delete car button (with confirmation)

   D. Auction Management (/admin/auctions)
   - List of all auctions
   - Create auction button → opens form:
     * Select car (dropdown)
     * Start time (datetime picker)
     * End time (datetime picker)
     * Starting price
     * Submit button
   - Edit auction (change end time, starting price)
   - End auction manually button
   - View auction details and bids

   E. Analytics Dashboard (/admin/dashboard)
   - Cards showing:
     * Total users (Pending/Approved)
     * Active auctions
     * Total bids today
     * Revenue (placeholder for Phase 5)
   - Charts:
     * Auctions over time (line chart)
     * Bids per auction (bar chart)
   - Recent activity feed

5. SIGNALR REAL-TIME INTEGRATION:

   A. useSignalR Hook:
```typescript
   const useSignalR = (auctionId: string) => {
     useEffect(() => {
       // Connect to hub with JWT in query string
       // Join auction group
       // Listen for: BidPlaced, AuctionEnded, CountdownUpdate
       // Update local state on events
       // Leave auction group on unmount
       // Handle connection errors and reconnection
     }, [auctionId]);
   };
```

   B. Real-time Updates:
   - On BidPlaced event:
     * Update highest bid display
     * Add new bid to history list
     * Show toast: "New bid: $XX,XXX"
   - On AuctionEnded event:
     * Show winner announcement
     * Disable bid form
     * Update auction status
   - On CountdownUpdate event:
     * Update countdown timer
     * Show warning if < 5 minutes remaining

6. STATE MANAGEMENT (Zustand):

   A. Auth Store:
   - State: user (User | null), isAuthenticated, isLoading
   - Actions: login, logout, refreshToken, updateProfile

   B. Auction Store:
   - State: auctions (Auction[]), currentAuction (Auction | null), filters
   - Actions: fetchAuctions, fetchAuctionById, setFilters

   C. Bid Store:
   - State: bids (Bid[]), myBids (Bid[])
   - Actions: placeBid, fetchBids, fetchMyBids, addBidRealtime

7. API INTEGRATION:

   A. Axios Instance:
   - Base URL from environment variable
   - Request interceptor: Add JWT token to Authorization header
   - Response interceptor: Handle 401 (refresh token), show error toasts

   B. API Services:
   - authService: register, login, refreshToken, setup2FA, verify2FA
   - auctionService: getAuctions, getAuctionById, createAuction (admin), updateAuction (admin)
   - bidService: placeBid, getBids, getMyBids
   - adminService: getPendingUsers, approveUser, rejectUser, getCars, createCar, etc.

8. ROUTING & PROTECTED ROUTES:
```typescript
   <Routes>
     <Route path="/" element={<AuctionList />} />
     <Route path="/auctions/:id" element={<AuctionDetail />} />
     <Route path="/login" element={<Login />} />
     <Route path="/register" element={<Register />} />
     
     <Route element={<ProtectedRoute />}>
       <Route path="/profile" element={<Profile />} />
       <Route path="/my-bids" element={<MyBids />} />
       <Route path="/2fa-setup" element={<TwoFactorSetup />} />
     </Route>
     
     <Route element={<AdminRoute />}>
       <Route path="/admin/dashboard" element={<AdminDashboard />} />
       <Route path="/admin/users/pending" element={<UserApproval />} />
       <Route path="/admin/cars" element={<CarManagement />} />
       <Route path="/admin/auctions" element={<AuctionManagement />} />
     </Route>
   </Routes>
```

9. RESPONSIVE DESIGN:
   - Mobile-first approach
   - Breakpoints: xs (<600px), sm (600-900px), md (900-1200px), lg (1200px+)
   - Hamburger menu for mobile
   - Touch-friendly buttons (min 44x44px)
   - Optimized images (lazy loading)

TESTING REQUIREMENTS:

1. Unit Tests:
   - Components: AuctionCard, CountdownTimer, BidForm
   - Hooks: useSignalR, useCountdown
   - Services: authService, auctionService

2. Integration Tests:
   - User registration → login → place bid flow
   - Admin approve user → user places bid
   - Real-time bid updates

3. E2E Tests (Playwright or Cypress):
   - User journey: Browse → View auction → Bid → Win
   - Admin journey: Approve user → Create auction

DELIVERABLES:

1. Complete React app with all pages and features
2. State management setup (Zustand stores)
3. API service layer with Axios
4. SignalR integration with custom hook
5. Protected route components
6. Responsive UI components
7. Form validation with Zod
8. Toast notifications for user feedback
9. Loading states and error handling
10. Unit tests for critical components
11. E2E test suite
12. Environment variable configuration (.env.example)
13. README with:
    - Setup instructions
    - Available scripts
    - Environment variables
    - Component documentation

PLEASE PROVIDE:
- Step-by-step implementation guide for each major feature
- Complete code for key components (AuctionDetail, BidForm, SignalR hook)
- State management structure with example store
- API integration setup with interceptors
- Protected route implementation
- Testing examples
- Best practices for React performance optimization
- Common issues and solutions

OUTPUT FORMAT: Comprehensive guide with complete code examples, organized by feature. Include component hierarchy diagrams and state flow explanations.
```

---

## **📱 PHASE 4: MOBILE APP (Week 6-7)**
```
Build React Native mobile app (iOS and Android) for the car auction platform with shared business logic from web app, real-time bidding, push notifications, and biometric authentication.

PROJECT CONTEXT:
Backend (Phases 1-2) and web frontend (Phase 3) are complete. Now creating native mobile apps that provide the same core functionality with mobile-specific features like push notifications, biometric auth, and optimized mobile UX.

TECH STACK:
- React Native (latest stable)
- TypeScript
- Choose: Expo (recommended for faster development) OR React Native CLI
- React Navigation v6
- Zustand (state management - reuse from web)
- Axios (HTTP client - reuse from web)
- @microsoft/signalr (real-time - reuse from web)
- React Native Paper or NativeBase (UI components)
- React Hook Form + Zod (forms and validation)
- date-fns (date handling)
- Firebase Cloud Messaging (push notifications)
- react-native-keychain (secure token storage)
- react-native-biometrics (Face ID / Touch ID)

DECISION NEEDED:
Choose between Expo and React Native CLI:
- Expo: Easier setup, managed workflow, OTA updates, but some limitations
- React Native CLI: Full control, any native module, but more complex setup

Recommendation: Use Expo unless you need specific native modules not available in Expo.

PROJECT STRUCTURE (Expo):
```
car-auction-mobile/
├── src/
│   ├── api/                  # Shared with web (copy or monorepo)
│   ├── components/
│   ├── screens/              # Instead of "pages"
│   │   ├── auth/
│   │   ├── auctions/
│   │   └── profile/
│   ├── navigation/
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── RootNavigator.tsx
│   ├── hooks/                # Shared logic
│   ├── store/                # Zustand stores (reuse from web)
│   ├── types/                # TypeScript types (shared)
│   ├── utils/
│   └── constants/
├── assets/
├── app.json
└── package.json
```

REQUIRED PACKAGES (Expo):
```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "react-native": "~0.73.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "react-native-screens": "^3.29.0",
    "react-native-safe-area-context": "^4.8.0",
    "@microsoft/signalr": "^8.0.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "react-native-paper": "^5.11.0",
    "date-fns": "^3.0.0",
    "expo-secure-store": "~13.0.0",
    "expo-local-authentication": "~14.0.0",
    "expo-notifications": "~0.27.0",
    "expo-image-picker": "~15.0.0",
    "react-native-toast-message": "^2.2.0"
  }
}
```

FEATURES TO IMPLEMENT:

1. NAVIGATION STRUCTURE:

   A. Auth Stack (Not logged in):
   - Splash Screen
   - Login Screen
   - Register Screen
   - 2FA Verification Screen

   B. Main Tab Navigator (Logged in):
   - Tab 1: Auctions (List + Detail as stack)
   - Tab 2: My Bids
   - Tab 3: Profile

   C. Modal Stack:
   - Auction Detail (full screen modal)
   - Bid Placement Modal
   - Profile Edit Modal

   D. Navigation Configuration:
```typescript
   <NavigationContainer>
     {isAuthenticated ? (
       <MainNavigator />
     ) : (
       <AuthNavigator />
     )}
   </NavigationContainer>
```

2. AUTHENTICATION SCREENS:

   A. Splash Screen:
   - App logo
   - Check for stored token
   - Auto-login if valid token
   - Navigate to Login or Main

   B. Login Screen:
   - Email and password inputs
   - "Remember me" switch
   - Biometric authentication button (if enabled)
   - Login button
   - Link to Register
   - Handle 2FA flow

   C. Register Screen:
   - Same fields as web
   - Scroll view for mobile
   - Show success message and navigate to login

   D. 2FA Setup Screen:
   - Display QR code
   - Show manual code
   - Verification input
   - Backup codes display

3. AUCTION SCREENS:

   A. Auction List Screen:
   - FlatList with auction cards
   - Pull-to-refresh
   - Search bar (collapsible header)
   - Filter button → Filter modal
   - Sorting options
   - Pagination (load more on scroll)
   - Empty state when no auctions
   - Loading skeleton

   B. Auction Detail Screen:
   - ScrollView layout
   - Image carousel (swipeable)
   - Car details section
   - Current bid (large, bold)
   - Countdown timer (updates every second)
   - Bid history (collapsible section)
   - "Place Bid" button (sticky at bottom)
   - Winner announcement (if ended)

   C. Bid Placement Modal:
   - Bottom sheet or full-screen modal
   - Amount input with numpad
   - Show minimum next bid
   - Confirm button
   - Loading state
   - Success animation

4. MY BIDS SCREEN:
   - Tabs: Active / Won / Lost
   - FlatList with bid cards
   - Show car image, make/model, bid amount, status
   - Pull-to-refresh
   - Tap card to go to auction detail
   - Empty state with illustration

5. PROFILE SCREEN:
   - User info display
   - Edit profile button
   - Enable/disable biometric auth toggle
   - 2FA settings
   - Change password
   - Logout button
   - App version number

6. MOBILE-SPECIFIC FEATURES:

   A. Biometric Authentication:
   - Setup screen: Enable Face ID / Touch ID
   - Login with biometrics:
     * Show biometric prompt on login screen
     * Retrieve stored credentials from secure storage
     * Auto-login after successful biometric verification
   - Implementation:
```typescript
     import * as LocalAuthentication from 'expo-local-authentication';
     
     const authenticateWithBiometrics = async () => {
       const hasHardware = await LocalAuthentication.hasHardwareAsync();
       const isEnrolled = await LocalAuthentication.isEnrolledAsync();
       if (hasHardware && isEnrolled) {
         const result = await LocalAuthentication.authenticateAsync({
           promptMessage: 'Login with biometrics',
         });
         return result.success;
       }
       return false;
     };
```

   B. Push Notifications:
   - Setup Firebase Cloud Messaging:
     * Create Firebase project
     * Download google-services.json (Android) and GoogleService-Info.plist (iOS)
     * Configure expo-notifications
   - Register device token:
     * On login, send device token to backend
     * Store token in user's record
   - Handle notifications:
     * Foreground: Show in-app banner
     * Background: System notification
     * Tap notification: Navigate to relevant auction
   - Notification types:
     * Outbid alert: "You've been outbid on [Car]!"
     * Auction ending soon: "[Car] auction ends in 10 minutes"
     * Auction won: "Congratulations! You won [Car]"
     * Payment due: "Payment required for [Car]"
     * Account approved: "Your account has been approved"

   C. Deep Linking:
   - Configure deep links: carauction://auction/:id
   - Handle incoming links:
     * From push notification
     * From email links
     * From browser
   - Navigate to specific auction on deep link

   D. Offline Detection:
   - Use NetInfo to detect connectivity
   - Show banner when offline
   - Queue bids for retry when back online (optional)
   - Cache auction data for offline viewing

   E. Pull-to-Refresh:
   - Implement on auction list and my bids
   - Refresh data from API
   - Show loading indicator

7. REUSE WEB LOGIC:

   A. API Services:
   - Copy entire api/ folder from web project
   - Adjust base URL for mobile (environment variable)
   - Use Axios instance with same interceptors
   - Store JWT in expo-secure-store instead of localStorage

   B. State Management:
   - Copy Zustand stores from web
   - Adjust token storage to use expo-secure-store
   - Same actions and state structure

   C. SignalR Integration:
   - Copy useSignalR hook from web
   - Same connection logic
   - Adjust for mobile app lifecycle (handle app background/foreground)

   D. Types and Utilities:
   - Share TypeScript types
   - Share validation schemas (Zod)
   - Share date formatting utilities

8. SIGNALR MOBILE CONSIDERATIONS:
   - Connection management:
     * Connect when app is in foreground
     * Disconnect when app goes to background
     * Reconnect when app returns to foreground
   - Use AppState to detect app state changes
   - Implement reconnection logic with exponential backoff

9. STYLING & UX:
   - Use React Native Paper or NativeBase for consistent UI
   - Follow platform-specific design guidelines:
     * iOS: Human Interface Guidelines
     * Android: Material Design
   - Use Platform-specific components where appropriate
   - Optimize for different screen sizes (phones and tablets)
   - Use react-native-safe-area-context for notch/cutout handling

10. TESTING:

    A. Development Testing:
    - Test on iOS simulator
    - Test on Android emulator
    - Test on physical devices (iOS and Android)
    - Test push notifications on real devices
    - Test biometric authentication on real devices

    B. Automated Testing:
    - Jest for unit tests
    - React Native Testing Library for component tests
    - Detox for E2E tests (optional, complex setup)

11. APP STORE PREPARATION:

    A. iOS:
    - Create Apple Developer account ($99/year)
    - Configure bundle identifier
    - Create app icons (1024x1024 and multiple sizes)
    - Create splash screens for different devices
    - Set up provisioning profiles
    - Build IPA using EAS Build (Expo) or Xcode
    - Create App Store Connect listing:
      * App name, description, keywords
      * Screenshots (6.5", 5.5", iPad)
      * Privacy policy URL
    - Submit for review

    B. Android:
    - Create Google Play Console account ($25 one-time)
    - Configure app signing
    - Create app icons (multiple sizes)
    - Create splash screens
    - Build APK/AAB using EAS Build (Expo) or Gradle
    - Create Google Play listing:
      * App name, description
      * Screenshots (phone and tablet)
      * Feature graphic
      * Privacy policy URL
    - Submit for review

    C. App Store Assets:
    - App icon (1024x1024 PNG)
    - Screenshots for all device sizes
    - Feature graphic (Android only)
    - App description (compelling copy)
    - Keywords for discoverability
    - Age rating
    - Privacy policy

DELIVERABLES:

1. Complete React Native app for iOS and Android
2. Navigation structure with all screens
3. Shared API service layer (reused from web)
4. Shared state management (reused from web)
5. SignalR integration for real-time updates
6. Push notification setup and handling
7. Biometric authentication
8. Deep linking configuration
9. Offline detection and handling
10. Pull-to-refresh on lists
11. Unit tests for shared logic
12. App store assets (icons, screenshots)
13. Build configuration for iOS and Android
14. README with:
    - Setup instructions
    - How to run on simulators/emulators
    - How to build for app stores
    - Environment variable configuration
    - Deep linking scheme documentation

PLEASE PROVIDE:
- Step-by-step setup guide (Expo or RN CLI)
- Complete navigation structure code
- Screen implementations with examples
- Push notification setup guide (Firebase + Expo)
- Biometric authentication implementation
- Deep linking configuration
- SignalR integration for mobile app lifecycle
- Secure token storage implementation
- Build and deployment guide for both platforms
- Common issues and troubleshooting (especially for native features)

OUTPUT FORMAT: Comprehensive guide with complete code examples, organized by feature. Include setup instructions for development tools and app store submission process.
```

---

## **💳 PHASE 5: PAYMENT INTEGRATION (Week 7-8)**
```
Integrate Stripe payment processing for registration fees (optional) and auction winner payments, including webhook handling for payment events.

PROJECT CONTEXT:
Core platform is complete (Phases 1-4). Now adding payment functionality so users can pay registration fees (if applicable) and auction winners can pay for their won cars. Must be PCI-compliant by using Stripe's hosted solutions.

TECH STACK (Already Set Up):
- ASP.NET Core backend
- React frontend
- React Native mobile app
- Stripe API (server-side)
- Stripe.js (client-side web)
- @stripe/stripe-react-native (mobile)

STRIPE SETUP:

1. Create Stripe Account:
   - Sign up at stripe.com
   - Complete business verification
   - Get API keys:
     * Publishable key (client-side, safe to expose)
     * Secret key (server-side, NEVER expose)
   - Use TEST mode initially

2. Install Stripe SDKs:
   - Backend: Stripe.net NuGet package
   - Web: @stripe/stripe-js npm package
   - Mobile: @stripe/stripe-react-native npm package

3. Configuration:
   - Store Stripe secret key in environment variables (backend)
   - Store Stripe publishable key in environment variables (frontend/mobile)
   - Configure webhook endpoint in Stripe dashboard

PAYMENT FLOWS:

1. REGISTRATION FEE (Optional Feature):

   Business Logic:
   - User registers → Account in "Pending Payment" status
   - User pays registration fee → Account moves to "Pending Approval"
   - Admin approves → Account becomes "Active"

   Implementation:
   - Backend Endpoint: POST /api/payments/registration-fee
     * Check if user already paid
     * Create Stripe Payment Intent (amount: e.g., $50)
     * Return client secret to frontend
   - Frontend:
     * Redirect to Stripe Checkout (hosted page)
     * OR use Stripe Elements (embedded form)
     * Handle payment success → Show confirmation
     * Handle payment failure → Show error, allow retry
   - Webhook Handler:
     * Listen for payment_intent.succeeded
     * Update user status in database
     * Send confirmation email

2. AUCTION WINNER PAYMENT:

   Business Logic:
   - Auction ends → Winner determined
   - System sends payment link to winner (email)
   - Winner has X days to complete payment (e.g., 7 days)
   - Payment successful → Car released, transaction completed
   - Payment failed → Admin notified, car may be re-auctioned

   Implementation:
   - Backend Endpoint: POST /api/payments/auction/{auctionId}
     * Verify caller is the auction winner
     * Get auction final price
     * Create Stripe Payment Intent (amount: final bid amount)
     * Create transaction record with status "Pending"
     * Return client secret
   - Generate Payment Link:
     * Create Stripe Checkout Session
     * Send email with checkout link
     * Link expires in 24 hours (configurable)
   - Frontend/Mobile:
     * "Pay Now" button on My Bids page (won auctions)
     * Redirect to Stripe Checkout
     * Success page → Show receipt, instructions
   - Webhook Handler:
     * Listen for payment_intent.succeeded
     * Update transaction status to "Completed"
     * Update auction status to "Paid"
     * Send receipt email
     * Notify admin of successful payment

BACKEND IMPLEMENTATION:

1. Stripe Service (Infrastructure Layer):
```csharp
   public interface IStripeService
   {
       Task<PaymentIntent> CreatePaymentIntentAsync(decimal amount, string currency, Dictionary<string, string> metadata);
       Task<PaymentIntent> GetPaymentIntentAsync(string paymentIntentId);
       Task<PaymentIntent> CancelPaymentIntentAsync(string paymentIntentId);
       Task<Checkout.Session> CreateCheckoutSessionAsync(decimal amount, string successUrl, string cancelUrl, Dictionary<string, string> metadata);
   }
```

2. Payment Controller:
```csharp
   [ApiController]
   [Route("api/payments")]
   public class PaymentsController : ControllerBase
   {
       // POST /api/payments/registration-fee
       [HttpPost("registration-fee")]
       [Authorize]
       public async Task<ActionResult<PaymentIntentDto>> CreateRegistrationPayment();
       
       // POST /api/payments/auction/{auctionId}
       [HttpPost("auction/{auctionId}")]
       [Authorize]
       public async Task<ActionResult<CheckoutSessionDto>> CreateAuctionPayment(Guid auctionId);
       
       // GET /api/payments/verify/{paymentIntentId}
       [HttpGet("verify/{paymentIntentId}")]
       [Authorize]
       public async Task<ActionResult<PaymentStatusDto>> VerifyPayment(string paymentIntentId);
   }
```

3. Transaction Entity (Already exists from Phase 1):
```csharp
   public class Transaction
   {
       public Guid Id { get; set; }
       public Guid UserId { get; set; }
       public Guid? AuctionId { get; set; }
       public decimal Amount { get; set; }
       public TransactionType Type { get; set; } // Registration, AuctionPayment, Refund
       public TransactionStatus Status { get; set; } // Pending, Completed, Failed, Refunded
       public string? PaymentIntentId { get; set; }
       public string? ReceiptUrl { get; set; }
       public DateTime CreatedAt { get; set; }
       public DateTime? CompletedAt { get; set; }
   }
```

4. Webhook Endpoint:
```csharp
   [HttpPost("webhooks/stripe")]
   [AllowAnonymous]
   public async Task<IActionResult> HandleStripeWebhook()
   {
       var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
       var stripeSignature = Request.Headers["Stripe-Signature"];
       
       try
       {
           var stripeEvent = EventUtility.ConstructEvent(
               json,
               stripeSignature,
               _webhookSecret
           );
           
           switch (stripeEvent.Type)
           {
               case Events.PaymentIntentSucceeded:
                   await HandlePaymentSucceeded(stripeEvent);
                   break;
               case Events.PaymentIntentPaymentFailed:
                   await HandlePaymentFailed(stripeEvent);
                   break;
               case Events.ChargeRefunded:
                   await HandleRefund(stripeEvent);
                   break;
           }
           
           return Ok();
       }
       catch (StripeException)
       {
           return BadRequest();
       }
   }
```

WEBHOOK IMPLEMENTATION:

1. Configure Webhook in Stripe Dashboard:
   - URL: https://yourdomain.com/api/webhooks/stripe
   - Events to listen for:
     * payment_intent.succeeded
     * payment_intent.payment_failed
     * charge.refunded
     * checkout.session.completed

2. Verify Webhook Signature:
   - Use Stripe webhook secret (different from API secret)
   - Verify signature to ensure request is from Stripe
   - Reject requests with invalid signatures

3. Handle Events:
   - payment_intent.succeeded:
     * Find transaction by PaymentIntentId
     * Update status to "Completed"
     * Update user or auction status accordingly
     * Send confirmation email
     * Log event
   
   - payment_intent.payment_failed:
     * Update transaction status to "Failed"
     * Send failure notification
     * Allow user to retry
   
   - charge.refunded:
     * Create refund transaction record
     * Update original transaction
     * Send refund confirmation

4. Idempotency:
   - Store processed webhook event IDs
   - Check if event already processed before handling
   - Prevent duplicate processing

FRONTEND WEB IMPLEMENTATION:

1. Install Stripe.js:
```bash
   npm install @stripe/stripe-js
```

2. Stripe Provider:
```typescript
   import { loadStripe } from '@stripe/stripe-js';
   
   const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);
   
   // Wrap app or payment pages
   <Elements stripe={stripePromise}>
     <PaymentPage />
   </Elements>
```

3. Registration Fee Payment (if applicable):
   - Button: "Complete Registration ($50)"
   - On click: Call backend to create Payment Intent
   - Redirect to Stripe Checkout OR use Stripe Elements
   - Handle success: Show confirmation, redirect to login
   - Handle failure: Show error, allow retry

4. Auction Winner Payment:
   - "Pay Now" button on My Bids (won auctions)
   - On click: Call backend to create Checkout Session
   - Redirect to Stripe Checkout (hosted page)
   - Success URL: /payment-success?session_id={CHECKOUT_SESSION_ID}
   - Cancel URL: /my-bids
   - Success page:
     * Verify payment with backend
     * Show receipt
     * Download invoice (optional)

MOBILE APP IMPLEMENTATION:

1. Install Stripe React Native:
```bash
   npm install @stripe/stripe-react-native
```

2. Initialize Stripe:
```typescript
   import { StripeProvider } from '@stripe/stripe-react-native';
   
   <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
     <App />
   </StripeProvider>
```

3. Payment Flow:
   - Use React Native Webview for Stripe Checkout
   - OR use Stripe's native payment sheet (better UX):
```typescript
     import { useStripe } from '@stripe/stripe-react-native';
     
     const { initPaymentSheet, presentPaymentSheet } = useStripe();
     
     const handlePayment = async () => {
       // Get client secret from backend
       const { clientSecret } = await createPaymentIntent();
       
       // Initialize payment sheet
       await initPaymentSheet({
         paymentIntentClientSecret: clientSecret,
         merchantDisplayName: 'Car Auction Platform',
       });
       
       // Present payment sheet
       const { error } = await presentPaymentSheet();
       
       if (error) {
         // Handle error
       } else {
         // Payment successful
       }
     };
```

SECURITY & COMPLIANCE:

1. PCI Compliance:
   - NEVER handle raw card numbers on your server
   - Use Stripe Checkout (hosted page) OR Stripe Elements (tokenized)
   - Let Stripe handle card data
   - Your server only handles tokens and payment intents

2. Security Best Practices:
   - Store Stripe secret key in environment variables
   - Never commit secrets to Git
   - Use HTTPS for all API calls
   - Verify webhook signatures
   - Implement rate limiting on payment endpoints
   - Log all payment events for audit

3. Error Handling:
   - Handle Stripe API errors gracefully
   - Show user-friendly error messages
   - Log errors for debugging
   - Implement retry logic for network failures

TESTING:

1. Use Stripe Test Mode:
   - Test card numbers: 4242 4242 4242 4242 (success)
   - Test card for declined: 4000 0000 0000 0002
   - Test card for 3D Secure: 4000 0025 0000 3155

2. Test Scenarios:
   - Successful payment flow
   - Declined card
   - Insufficient funds
   - Expired card
   - 3D Secure authentication
   - Webhook delivery
   - Idempotency (duplicate webhooks)

3. Test Webhooks Locally:
   - Use Stripe CLI:
```bash
     stripe listen --forward-to localhost:5000/api/webhooks/stripe
     stripe trigger payment_intent.succeeded
```

DELIVERABLES:

1. Backend:
   - Stripe service implementation
   - Payment controller with endpoints
   - Webhook handler with signature verification
   - Transaction management logic
   - Email notifications for payment events

2. Frontend Web:
   - Stripe integration with Stripe.js
   - Payment pages (registration, auction winner)
   - Success and error handling
   - Receipt display

3. Mobile App:
   - Stripe React Native integration
   - Native payment sheet implementation
   - Payment success/failure handling

4. Configuration:
   - Environment variables for Stripe keys
   - Webhook endpoint configuration
   - Email templates for payment notifications

5. Testing:
   - Unit tests for payment service
   - Integration tests for payment flow
   - Webhook testing with Stripe CLI

6. Documentation:
   - Payment flow diagrams
   - Stripe configuration guide
   - Webhook event handling
   - Testing guide with test cards
   - Troubleshooting common issues

PLEASE PROVIDE:
- Step-by-step Stripe setup guide
- Complete backend payment service code
- Webhook handler implementation with event processing
- Frontend payment integration (web and mobile)
- Testing strategy with Stripe test cards
- Security checklist
- Common Stripe API errors and handling
- Production deployment checklist (switching from test to live mode)

OUTPUT FORMAT: Detailed implementation guide with complete code examples for backend, frontend, and mobile. Include Stripe dashboard configuration screenshots and testing procedures.
```

---

## **📧 PHASE 6: NOTIFICATIONS & EMAILS (Week 8)**
```
Implement comprehensive notification system with email notifications, push notifications for mobile, and in-app notifications for critical auction and account events.

PROJECT CONTEXT:
Core platform with payments is complete (Phases 1-5). Now adding a robust notification system to keep users engaged and informed about auction activities, account status, and payment requirements.

NOTIFICATION TYPES:

1. EMAIL NOTIFICATIONS:
   - Welcome email (after registration)
   - Email verification
   - Account approved/rejected notification
   - Bid confirmation (every bid placed)
   - Outbid notification (when someone bids higher)
   - Auction ending soon (10 minutes before end)
   - Auction won notification
   - Payment reminder (if winner hasn't paid)
   - Payment received confirmation
   - Auction participation summary (after auction ends)

2. PUSH NOTIFICATIONS (Mobile Only):
   - Outbid alert (real-time)
   - Auction ending soon (10 minutes before)
   - Auction won
   - Payment due reminder
   - Account approved

3. IN-APP NOTIFICATIONS (Web and Mobile):
   - Notification bell icon with badge count
   - Notification list (recent events)
   - Mark as read functionality
   - Link to relevant auction or page

EMAIL SERVICE SETUP:

Choose one of the following email providers:

Option 1: SendGrid (Recommended)
- Easy setup, good free tier
- API-based, reliable delivery
- Email templates with variables
- Analytics and tracking

Option 2: AWS SES (Simple Email Service)
- Cost-effective for high volume
- Requires domain verification
- Good for production use

Option 3: Gmail SMTP (Development Only)
- Free, easy for testing
- NOT recommended for production
- Rate limited

BACKEND IMPLEMENTATION:

1. Email Service Interface:
```csharp
   public interface IEmailService
   {
       Task SendEmailAsync(string to, string subject, string htmlBody, string? textBody = null);
       Task SendTemplateEmailAsync(string to, string templateId, Dictionary<string, string> templateData);
       Task SendWelcomeEmailAsync(string to, string userName, string verificationLink);
       Task SendAccountApprovedEmailAsync(string to, string userName);
       Task SendAccountRejectedEmailAsync(string to, string userName, string? reason);
       Task SendBidConfirmationEmailAsync(string to, BidConfirmationData data);
       Task SendOutbidNotificationEmailAsync(string to, OutbidNotificationData data);
       Task SendAuctionWonEmailAsync(string to, AuctionWonData data);
       Task SendPaymentReminderEmailAsync(string to, PaymentReminderData data);
       Task SendPaymentConfirmationEmailAsync(string to, PaymentConfirmationData data);
   }
```

2. Email Templates:
   - Create HTML email templates with placeholders
   - Use Razor templates or external HTML files
   - Variables: {{ userName }}, {{ auctionTitle }}, {{ amount }}, etc.
   - Responsive design (mobile-friendly)
   - Include company logo and branding

3. Email Template Examples:

   A. Welcome Email:
```html
   <!DOCTYPE html>
   <html>
   <head>
     <style>/* Responsive styles */</style>
   </head>
   <body>
     <h1>Welcome to Car Auction Platform!</h1>
     <p>Hi {{ userName }},</p>
     <p>Thank you for registering. Please verify your email:</p>
     <a href="{{ verificationLink }}">Verify Email</a>
     <p>Your account will be reviewed by our team within 24 hours.</p>
   </body>
   </html>
```

   B. Outbid Notification:
```html
   <h1>You've been outbid!</h1>
   <p>Hi {{ userName }},</p>
   <p>Someone placed a higher bid on {{ carMakeModel }}.</p>
   <p>Current highest bid: ${{ currentBid }}</p>
   <p>Your last bid: ${{ yourBid }}</p>
   <a href="{{ auctionLink }}">View Auction & Place New Bid</a>
```

   C. Auction Won:
```html
   <h1>Congratulations! You won the auction!</h1>
   <p>Hi {{ userName }},</p>
   <p>You are the winner of {{ carMakeModel }} for ${{ winningBid }}.</p>
   <p>Please complete payment within {{ paymentDeadlineDays }} days.</p>
   <a href="{{ paymentLink }}">Pay Now</a>
   <p>Questions? Contact us at support@carauction.com</p>
```

4. SendGrid Implementation (Example):
```csharp
   public class SendGridEmailService : IEmailService
   {
       private readonly string _apiKey;
       private readonly SendGridClient _client;
       
       public SendGridEmailService(IConfiguration configuration)
       {
           _apiKey = configuration["SendGrid:ApiKey"];
           _client = new SendGridClient(_apiKey);
       }
       
       public async Task SendEmailAsync(string to, string subject, string htmlBody, string? textBody = null)
       {
           var msg = new SendGridMessage()
           {
               From = new EmailAddress("noreply@carauction.com", "Car Auction Platform"),
               Subject = subject,
               HtmlContent = htmlBody,
               PlainTextContent = textBody ?? StripHtml(htmlBody)
           };
           msg.AddTo(new EmailAddress(to));
           
           var response = await _client.SendEmailAsync(msg);
           
           if (!response.IsSuccessStatusCode)
           {
               _logger.LogError("Failed to send email: {StatusCode}", response.StatusCode);
           }
       }
   }
```

5. Email Triggering (Hangfire Background Jobs):
   - Trigger emails asynchronously to avoid blocking requests
   - Use Hangfire to queue email sending jobs
   - Retry failed email sends (up to 3 times)
   - Log all email attempts
```csharp
   // In bid service after bid placed
   _backgroundJobClient.Enqueue<IEmailService>(
       service => service.SendBidConfirmationEmailAsync(user.Email, bidData)
   );
   
   // Recurring job for payment reminders
   _recurringJobManager.AddOrUpdate(
       "send-payment-reminders",
       () => SendPaymentReminders(),
       Cron.Daily(9) // 9 AM daily
   );
```

PUSH NOTIFICATIONS (Mobile):

1. Firebase Cloud Messaging (FCM) Setup:
   - Create Firebase project (console.firebase.google.com)
   - Add Android app (download google-services.json)
   - Add iOS app (download GoogleService-Info.plist)
   - Get Server Key for backend

2. Backend FCM Service:
```csharp
   public interface IPushNotificationService
   {
       Task SendToDeviceAsync(string deviceToken, string title, string body, Dictionary<string, string>? data = null);
       Task SendToUserAsync(Guid userId, string title, string body, Dictionary<string, string>? data = null);
       Task SendToMultipleAsync(List<string> deviceTokens, string title, string body);
       Task RegisterDeviceTokenAsync(Guid userId, string deviceToken, DevicePlatform platform);
       Task UnregisterDeviceTokenAsync(string deviceToken);
   }
```

3. Device Token Management:
   - Store device tokens in database (UserDevices table)
   - Fields: UserId, DeviceToken, Platform (iOS/Android), RegisteredAt, LastUsed
   - Update token on app launch
   - Remove token on logout or uninstall

4. Push Notification Triggers:
   - Outbid: Immediate (within 1 minute)
   - Auction ending soon: 10 minutes before end
   - Auction won: Immediate after auction ends
   - Payment reminder: Daily until paid
   - Account approved: Immediate after admin approval

5. Mobile App Implementation (React Native):
```typescript
   import messaging from '@react-native-firebase/messaging';
   
   // Request permission (iOS)
   await messaging().requestPermission();
   
   // Get device token
   const token = await messaging().getToken();
   
   // Send token to backend
   await registerDeviceToken(token);
   
   // Handle foreground notifications
   messaging().onMessage(async remoteMessage => {
     // Show in-app notification
     showNotificationBanner(remoteMessage);
   });
   
   // Handle background/quit notifications
   messaging().setBackgroundMessageHandler(async remoteMessage => {
     // Optional: Update badge count, refresh data
   });
   
   // Handle notification tap
   messaging().onNotificationOpenedApp(remoteMessage => {
     // Navigate to relevant screen
     navigateToAuction(remoteMessage.data.auctionId);
   });
```

IN-APP NOTIFICATIONS:

1. Database Schema:
```csharp
   public class Notification
   {
       public Guid Id { get; set; }
       public Guid UserId { get; set; }
       public NotificationType Type { get; set; } // Bid, Outbid, AuctionWon, PaymentDue, etc.
       public string Title { get; set; }
       public string Message { get; set; }
       public bool IsRead { get; set; }
       public Guid? AuctionId { get; set; } // Link to auction
       public DateTime CreatedAt { get; set; }
   }
   
   public enum NotificationType
   {
       BidPlaced,
       Outbid,
       AuctionEnding,
       AuctionWon,
       PaymentDue,
       AccountApproved,
       AccountRejected
   }
```

2. API Endpoints:
```csharp
   [ApiController]
   [Route("api/notifications")]
   [Authorize]
   public class NotificationsController : ControllerBase
   {
       // GET /api/notifications
       [HttpGet]
       public async Task<ActionResult<PagedResult<NotificationDto>>> GetNotifications(
           [FromQuery] int page = 1,
           [FromQuery] int pageSize = 20,
           [FromQuery] bool unreadOnly = false
       );
       
       // PUT /api/notifications/{id}/read
       [HttpPut("{id}/read")]
       public async Task<IActionResult> MarkAsRead(Guid id);
       
       // PUT /api/notifications/read-all
       [HttpPut("read-all")]
       public async Task<IActionResult> MarkAllAsRead();
       
       // GET /api/notifications/unread-count
       [HttpGet("unread-count")]
       public async Task<ActionResult<int>> GetUnreadCount();
   }
```

3. Frontend Implementation (Web):
   - Notification bell icon in header
   - Badge showing unread count
   - Dropdown with recent notifications
   - Click notification → Navigate to auction
   - Mark as read on click
   - "Mark all as read" button
   - Real-time updates via SignalR (optional)

4. Mobile Implementation:
   - Notification icon in header
   - Badge on tab bar
   - Notifications screen (list)
   - Pull-to-refresh
   - Tap notification → Navigate to auction

NOTIFICATION PREFERENCES (Optional):

1. Allow users to customize notifications:
   - Email preferences (opt-in/opt-out for each type)
   - Push notification preferences
   - Notification frequency (immediate, daily digest)

2. Database Schema:
```csharp
   public class NotificationPreferences
   {
       public Guid UserId { get; set; }
       public bool EmailBidConfirmation { get; set; }
       public bool EmailOutbid { get; set; }
       public bool EmailAuctionWon { get; set; }
       public bool PushOutbid { get; set; }
       public bool PushAuctionEnding { get; set; }
       // ... more preferences
   }
```

3. Settings Page:
   - Toggle switches for each notification type
   - Separate sections for email and push
   - Save preferences endpoint

TESTING:

1. Email Testing:
   - Use SendGrid sandbox mode or test email addresses
   - Test all email templates
   - Check responsive design (mobile and desktop)
   - Verify links work correctly
   - Test spam score (use tools like Mail Tester)

2. Push Notification Testing:
   - Test on real iOS device
   - Test on real Android device
   - Test foreground, background, and quit scenarios
   - Test notification tap navigation
   - Test badge count updates

3. In-App Notification Testing:
   - Test notification list display
   - Test mark as read
   - Test real-time updates
   - Test navigation on click

DELIVERABLES:

1. Backend:
   - Email service implementation (SendGrid, AWS SES, or chosen provider)
   - Push notification service (FCM)
   - Notification repository and service
   - API endpoints for in-app notifications
   - Background jobs for notification triggers
   - HTML email templates

2. Frontend Web:
   - Notification bell component
   - Notification dropdown
   - Notification preferences page

3. Mobile App:
   - Push notification setup (FCM)
   - Device token registration
   - Notification handling (foreground/background)
   - Notifications screen

4. Configuration:
   - Email service credentials (environment variables)
   - FCM server key
   - Email templates location
   - Notification settings

5. Testing:
   - Email template tests
   - Push notification tests
   - Integration tests for notification triggers

6. Documentation:
   - Email service setup guide
   - Push notification setup guide (Firebase)
   - Email template customization guide
   - Notification preferences documentation
   - Troubleshooting guide

PLEASE PROVIDE:
- Step-by-step email service setup (SendGrid or chosen provider)
- Complete email service implementation with template rendering
- Push notification service implementation (FCM)
- Device token management code
- In-app notification implementation (backend and frontend)
- Email template examples (HTML with responsive design)
- Mobile push notification setup guide (Firebase config)
- Testing strategy for all notification types
- Common issues and troubleshooting

OUTPUT FORMAT: Comprehensive guide with complete code examples for email, push, and in-app notifications. Include setup instructions for external services and testing procedures.