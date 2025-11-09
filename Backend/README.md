# CarAuction Backend - Clean Architecture

This backend follows Clean Architecture principles with clear separation of concerns across four layers.

## Project Structure

```
Backend/
├── CarAuction.Domain/          # Core business entities and rules
│   ├── Entities/                # Domain entities (User, Auction, Bid, Car, etc.)
│   ├── Enums/                   # Domain enumerations
│   └── Common/                  # Shared domain logic
│
├── CarAuction.Application/      # Business logic and use cases
│   ├── Interfaces/              # Service and repository interfaces
│   ├── DTOs/                    # Data Transfer Objects
│   └── Services/                # Business logic services
│
├── CarAuction.Infrastructure/   # External concerns implementation
│   ├── Data/                    # EF Core DbContext and configurations
│   ├── Repositories/            # Repository implementations
│   └── Services/                # External service implementations (Email, Redis, etc.)
│
└── CarAuction.API/              # Web API layer
    ├── Program.cs               # Application entry point
    ├── appsettings.json         # Configuration
    └── Properties/              # Launch settings
```

## Layer Dependencies

```
CarAuction.API
    ↓ references
CarAuction.Infrastructure
    ↓ references
CarAuction.Application
    ↓ references
CarAuction.Domain (no dependencies)
```

## Clean Architecture Principles

### 1. **Domain Layer** (CarAuction.Domain)
- Contains enterprise business rules
- Pure C# with no external dependencies
- Entities, value objects, enums, interfaces
- **No dependencies** on other layers

### 2. **Application Layer** (CarAuction.Application)
- Contains application business rules
- Defines interfaces for external concerns
- DTOs, service interfaces, validation logic
- Depends only on **Domain**

### 3. **Infrastructure Layer** (CarAuction.Infrastructure)
- Implements external concerns
- Database access (EF Core), file storage, external APIs
- Email services, Redis, Hangfire, etc.
- Depends on **Domain** and **Application**

### 4. **API Layer** (CarAuction.API)
- Entry point for HTTP requests
- Controllers, middleware, dependency injection setup
- Depends on **Application** and **Infrastructure** (for DI registration)

## Building and Running

### Build the solution:
```bash
cd Backend
dotnet build CarAuction.sln
```

### Run the API:
```bash
dotnet run --project CarAuction.API.csproj
```

### Build specific project:
```bash
dotnet build CarAuction.Domain/CarAuction.Domain.csproj
```

## Development Guidelines

### Adding New Features

1. **Start in Domain**: Define entities and enums
2. **Move to Application**: Create DTOs and service interfaces
3. **Implement in Infrastructure**: Create repositories and services
4. **Expose via API**: Add controllers and endpoints

### Example Flow (Creating a new Car entity):

```
1. Domain: Create Car entity
   → Backend/CarAuction.Domain/Entities/Car.cs

2. Application: Create CarDto and ICarService
   → Backend/CarAuction.Application/DTOs/CarDto.cs
   → Backend/CarAuction.Application/Interfaces/ICarService.cs

3. Infrastructure: Create CarRepository and implement ICarService
   → Backend/CarAuction.Infrastructure/Repositories/CarRepository.cs
   → Backend/CarAuction.Infrastructure/Services/CarService.cs

4. API: Create CarsController
   → Backend/Program.cs or new Controllers/CarsController.cs
```

## Next Steps

- [ ] Phase 1: Add Entity Framework Core and PostgreSQL
- [ ] Phase 1: Implement ASP.NET Core Identity
- [ ] Phase 1: Create domain entities (User, Auction, Bid, Car)
- [ ] Phase 2: Implement real-time bidding with SignalR
- [ ] Phase 2: Add Redis caching and distributed locking
- [ ] Phase 2: Setup Hangfire for background jobs
