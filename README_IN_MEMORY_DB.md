# In-Memory Database Implementation

## Overview
This project has been updated to use an in-memory database that exists only during the runtime of the application, replacing all Supabase database operations.

## Key Changes

### 1. In-Memory Database (`src/lib/inMemoryDatabase.ts`)
- Singleton pattern implementation for a runtime-only database
- All data is stored in JavaScript Map objects
- Includes complete CRUD operations for all entities:
  - Sports
  - Leagues
  - Teams
  - Matches
  - User Profiles
  - Venues
  - Venue Matches
  - Reservations
  - Notifications

### 2. Authentication System
- Mock authentication system with user sessions
- Users are stored in-memory
- Session management without external dependencies

### 3. Seed Data (`src/lib/seedData.ts`)
- Automatically populates the database with sample data on startup
- Includes demo accounts and sample venues, matches, and reservations

## Demo Accounts

The system comes with two pre-configured accounts:

### Customer Account
- **Email:** demo@example.com
- **Password:** demo123
- **Role:** Customer (can browse venues and make reservations)

### Venue Owner Account
- **Email:** owner@example.com
- **Password:** owner123
- **Role:** Venue Owner (can manage venues and view reservations)

## Sample Data

The database is initialized with:
- **2 Sports:** Football and Basketball
- **2 Leagues:** Premier League and NBA
- **8 Teams:** 4 football teams, 4 basketball teams
- **8 Matches:** Scheduled over the next 2 weeks
- **4 Venues:** Each with different themes and locations
- **16 Venue-Match associations:** Linking venues to matches
- **2 Sample Reservations:** For the demo user

## How It Works

1. **On Application Start:**
   - The InMemoryDatabase singleton is created
   - Seed data is automatically loaded
   - The database is ready for use

2. **During Runtime:**
   - All data operations happen in memory
   - Changes are instant with no network latency
   - Data persists until the application is restarted

3. **On Application Restart:**
   - All data is reset to the initial seed state
   - Previous user actions are lost
   - Demo accounts are restored

## Benefits

- **No External Dependencies:** No need for Supabase or any database server
- **Fast Development:** Instant data operations with no network overhead
- **Easy Testing:** Predictable data state on each restart
- **Portable:** Runs anywhere without configuration

## Limitations

- **No Persistence:** All data is lost when the application stops
- **Single Instance:** Data is not shared between different instances
- **Memory Limited:** Large datasets could impact performance
- **No Real Authentication:** Passwords are stored in plain text (for demo only)

## Modified Services

All services have been updated to use the in-memory database:

- `venueService.ts` - Venue management operations
- `reservationService.ts` - Reservation handling
- `sportsApi.ts` - Sports data operations
- `AuthContext.tsx` - Authentication and user management

## Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Access the application
# Open http://localhost:5173 in your browser
```

## Testing Features

1. **Sign In:** Use one of the demo accounts
2. **Browse Venues:** View the 4 sample venues
3. **View Matches:** See upcoming matches for the next 2 weeks
4. **Make Reservations:** Book tables at venues (as customer)
5. **Manage Venues:** Add/edit venues (as venue owner)
6. **View Reservations:** Check your bookings or venue reservations

## Technical Details

### Data Structure
All data is stored in Map objects for O(1) lookup performance:
```typescript
public sports: Map<string, Sport>
public leagues: Map<string, League>
public teams: Map<string, Team>
public matches: Map<string, Match>
public userProfiles: Map<string, UserProfile>
public venues: Map<string, Venue>
public venueMatches: Map<string, VenueMatch>
public reservations: Map<string, Reservation>
```

### ID Generation
Uses UUID v4 for generating unique identifiers for all entities.

### Timestamps
All entities include `created_at` and `updated_at` timestamps in ISO format.

## Future Enhancements

If you want to add persistence later:
1. Add localStorage adapter for browser persistence
2. Implement SQLite for desktop applications
3. Add export/import functionality for data backup
4. Create a REST API wrapper for multi-client access
