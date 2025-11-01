# .NET 9 + React Application

A full-stack application with .NET 9 Web API backend and React (Vite) frontend.

## Project Structure

```
BRAVOCARS/
├── Backend/          # .NET 9 Web API
└── Frontend/         # React + Vite
```

## Prerequisites

- .NET 9 SDK
- Node.js (v16 or higher)

## Getting Started

### Running the Backend

1. Navigate to the Backend folder:
   ```bash
   cd Backend
   ```

2. Run the API:
   ```bash
   dotnet run
   ```

   The API will be available at `http://localhost:5142`

### Running the Frontend

1. Open a new terminal and navigate to the Frontend folder:
   ```bash
   cd Frontend
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   The React app will be available at `http://localhost:5173`

## Features

- .NET 9 Web API with minimal API endpoints
- React frontend with Vite for fast development
- CORS configuration for seamless frontend-backend communication
- Proxy configuration in Vite for API calls
- Sample Weather Forecast API integration

## API Endpoints

- `GET /weatherforecast` - Returns a 5-day weather forecast

## Development

The frontend is configured to proxy API requests to the backend:
- Frontend URL: `http://localhost:5173`
- Backend URL: `http://localhost:5142`
- API calls from frontend use `/api/*` which proxies to the backend

## Testing the Integration

1. Start both the backend and frontend servers
2. Open the React app in your browser
3. Click the "Fetch Weather" button to test the API integration
