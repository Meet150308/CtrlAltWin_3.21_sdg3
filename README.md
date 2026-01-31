# NagpurAir - Urban Air Quality Monitor

## Overview

NagpurAir is a real-time air quality monitoring web application focused on Nagpur, Maharashtra, India. The app provides interactive pollution maps, health guidance based on AQI levels, and an AI-powered assistant for air quality questions. It fetches live data from the World Air Quality Index (WAQI) API and displays readings across multiple monitoring stations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Maps**: Leaflet with react-leaflet for interactive pollution maps
- **Charts**: Recharts for AQI trend visualization
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **External API**: WAQI (World Air Quality Index) for real-time pollution data
- **AI Integration**: OpenAI-compatible API via Replit AI Integrations for chat assistant

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines all tables
- **Tables**: 
  - `users` - Basic user accounts
  - `air_quality_readings` - Cached air quality data (location, AQI, pollutants)
  - `conversations` - AI chat conversation threads
  - `messages` - Individual chat messages
- **Migrations**: Drizzle Kit with `db:push` command

### Key Design Decisions

1. **Shared Schema Pattern**: Database schemas and types are defined in `shared/` directory, allowing both client and server to import the same TypeScript types. This ensures type safety across the full stack.

2. **API Route Definition**: Routes are defined in `shared/routes.ts` with Zod schemas for request/response validation, enabling type-safe API calls from the frontend.

3. **Streaming AI Responses**: The chat assistant uses Server-Sent Events (SSE) for streaming responses, providing real-time feedback as the AI generates answers.

4. **Real-time Data Fetching**: Air quality data is fetched directly from WAQI API on each request rather than being cached, ensuring users always see current readings.

5. **Component-First UI**: Uses shadcn/ui components (installed via `components.json` config) which are copied into the project for full customization control.

## External Dependencies

### Third-Party APIs
- **WAQI API** (`api.waqi.info`): Provides real-time air quality data for Nagpur region. Currently using demo token - replace with user's own token for production.
- **OpenAI-compatible API**: Accessed via Replit AI Integrations environment variables (`AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`)

### Database
- **PostgreSQL**: Connection via `DATABASE_URL` environment variable. Drizzle ORM handles queries and schema management.

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migration tooling
- `@tanstack/react-query`: Async state management
- `leaflet` / `react-leaflet`: Interactive mapping
- `recharts`: Data visualization
- `framer-motion`: Animations
- `openai`: AI API client (used server-side)
- `express-session` / `connect-pg-simple`: Session management with PostgreSQL storage

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `AI_INTEGRATIONS_OPENAI_API_KEY`: OpenAI API key for chat functionality
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: Base URL for OpenAI-compatible API