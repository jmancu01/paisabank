# PaisBank Application

## Overview

PaisBank is a modern banking application built with Next.js and Supabase. It provides user authentication, card management, and transaction visualization features in a responsive web interface.

## Application Structure

### Architecture

The application follows a client-server architecture with:

- **Frontend**: Next.js application with React components
- **Backend**: API routes in Next.js with Supabase integration
- **Database**: Supabase (PostgreSQL-based)

### Directory Structure

```
├── components/
│   ├── header.tsx
│   ├── navbar.tsx
│   ├── paisbank-card-carousel.tsx
│   └── transaction-list.tsx
├── lib/
│   └── supabase/
│       ├── auth/
│       │   ├── auth-client.ts       # Client-side authentication utilities
│       │   └── auth-server.ts       # Server-side authentication middleware
│       ├── services/
│       │   └── cards-service.ts     # Business logic for card operations
│       ├── types/
│       │   ├── api-response.ts      # Standardized API response types
│       │   └── tables.ts            # Database table type definitions
│       ├── supabase-client.ts       # Supabase client instance (browser)
│       └── supabase-server.ts       # Supabase server instance (Node.js)
└── app/
    ├── api/
    │   └── cards/
    │       └── route.ts             # API endpoint for cards
    ├── dashboard/
    │   └── page.tsx                 # Dashboard page component
    └── layout.tsx                   # Root layout component
```

## Key Components

### Authentication System

The application uses a token-based authentication system with Supabase Auth:

- **Client-side Authentication** (`auth-client.ts`):

  - Handles user sign-up/sign-in/sign-out
  - Manages authentication tokens and headers
  - Provides a standardized fetch wrapper for API calls

- **Server-side Authentication** (`auth-server.ts`):
  - Middleware for protecting API routes
  - Validates authentication tokens
  - Provides role-based access control

### Card Management

The card system allows users to manage their payment cards:

- **Card Service** (`cards-service.ts`):

  - Interfaces with the Supabase database
  - Provides CRUD operations for cards
  - Handles ownership validation

- **Card Client** (`cards-client.ts`):
  - Makes authenticated API requests to card endpoints
  - Formats responses for the frontend

### API Design

The application uses a standardized API response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

This ensures consistent error handling and data structure across all endpoints.

### Frontend

The user interface is built with React components:

- **Dashboard Page** (`page.tsx`):

  - Main user interface after authentication
  - Shows cards carousel and transaction list
  - Uses client-side navigation

- **UI Components**:
  - `PaisbankCardCarousel`: Displays user's cards in a swipeable interface
  - `TransactionList`: Shows recent transactions
  - `Navbar`: Bottom navigation for mobile-friendly experience
  - `Header`: App header with user information

## Authentication Flow

1. User signs in/up through the client-side authentication
2. Tokens are stored securely by Supabase client
3. Authenticated requests include the token in Authorization header
4. Server middleware validates tokens before processing requests
5. User-specific data is retrieved based on the authenticated user ID

## Data Flow

### Card Creation Flow:

1. User submits card creation form
2. `cardsClient.createCard()` makes authenticated POST request
3. API route (`route.ts`) verifies authentication
4. Request is forwarded to `cardsService.createCard()`
5. Card is created in Supabase with user association
6. Response is returned in standardized format

### Card Retrieval Flow:

1. Dashboard component loads
2. Card component calls `cardsClient.getUserCards()`
3. Authenticated request is sent to API
4. Server validates authentication
5. `cardsService.getUserCards()` retrieves user-specific cards
6. Data is returned and displayed in UI

## Security Features

- JWT-based authentication
- User-specific data access
- Server-side validation of ownership
- Role-based access control
- Protected API routes

## Deployment

The application can be deployed on Vercel or any other Next.js-compatible hosting platform. Supabase provides the database and authentication services.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up Supabase project and configure environment variables
4. Run development server with `npm run dev`

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```
