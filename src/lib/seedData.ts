import InMemoryDatabase from './inMemoryDatabase';

export function initializeSeedData(db: InMemoryDatabase) {
  // Create sample sports
  const football = 'sport-football';
  const basketball = 'sport-basketball';
  
  // @ts-ignore - accessing private method for seeding
  db.sports.set(football, {
    id: football,
    api_id: 'football',
    name: 'Football',
    slug: 'football',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  
  // @ts-ignore
  db.sports.set(basketball, {
    id: basketball,
    api_id: 'basketball',
    name: 'Basketball',
    slug: 'basketball',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Create sample leagues
  const premierLeague = 'league-premier';
  const nba = 'league-nba';
  
  // @ts-ignore
  db.leagues.set(premierLeague, {
    id: premierLeague,
    api_id: 'premier-league',
    sport_id: football,
    name: 'Premier League',
    country: 'England',
    logo_url: 'https://media.api-sports.io/football/leagues/39.png',
    season: '2024',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  
  // @ts-ignore
  db.leagues.set(nba, {
    id: nba,
    api_id: 'nba',
    sport_id: basketball,
    name: 'NBA',
    country: 'USA',
    logo_url: 'https://media.api-sports.io/basketball/leagues/12.png',
    season: '2024',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Create sample teams
  const manUnited = 'team-manutd';
  const liverpool = 'team-liverpool';
  const arsenal = 'team-arsenal';
  const chelsea = 'team-chelsea';
  const lakers = 'team-lakers';
  const celtics = 'team-celtics';
  const warriors = 'team-warriors';
  const heat = 'team-heat';
  
  const footballTeams = [
    { id: manUnited, name: 'Manchester United', logo: 'https://media.api-sports.io/football/teams/33.png' },
    { id: liverpool, name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' },
    { id: arsenal, name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' },
    { id: chelsea, name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png' },
  ];

  const basketballTeams = [
    { id: lakers, name: 'LA Lakers', logo: 'https://media.api-sports.io/basketball/teams/145.png' },
    { id: celtics, name: 'Boston Celtics', logo: 'https://media.api-sports.io/basketball/teams/133.png' },
    { id: warriors, name: 'Golden State Warriors', logo: 'https://media.api-sports.io/basketball/teams/134.png' },
    { id: heat, name: 'Miami Heat', logo: 'https://media.api-sports.io/basketball/teams/135.png' },
  ];

  footballTeams.forEach(team => {
    // @ts-ignore
    db.teams.set(team.id, {
      id: team.id,
      api_id: team.id,
      sport_id: football,
      name: team.name,
      logo_url: team.logo,
      country: 'England',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  basketballTeams.forEach(team => {
    // @ts-ignore
    db.teams.set(team.id, {
      id: team.id,
      api_id: team.id,
      sport_id: basketball,
      name: team.name,
      logo_url: team.logo,
      country: 'USA',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  // Create sample matches for the next 2 weeks
  const today = new Date();
  const matches = [
    // Tomorrow's matches
    {
      id: 'match-1',
      sport: football,
      league: premierLeague,
      home: manUnited,
      away: liverpool,
      date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
      venue: 'Old Trafford',
    },
    {
      id: 'match-2',
      sport: basketball,
      league: nba,
      home: lakers,
      away: celtics,
      date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
      venue: 'Crypto.com Arena',
    },
    // In 3 days
    {
      id: 'match-3',
      sport: football,
      league: premierLeague,
      home: arsenal,
      away: chelsea,
      date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      venue: 'Emirates Stadium',
    },
    {
      id: 'match-4',
      sport: basketball,
      league: nba,
      home: warriors,
      away: heat,
      date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      venue: 'Chase Center',
    },
    // In 5 days
    {
      id: 'match-5',
      sport: football,
      league: premierLeague,
      home: chelsea,
      away: manUnited,
      date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      venue: 'Stamford Bridge',
    },
    // In a week
    {
      id: 'match-6',
      sport: basketball,
      league: nba,
      home: heat,
      away: lakers,
      date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      venue: 'FTX Arena',
    },
    {
      id: 'match-7',
      sport: football,
      league: premierLeague,
      home: liverpool,
      away: arsenal,
      date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      venue: 'Anfield',
    },
    // In 10 days
    {
      id: 'match-8',
      sport: basketball,
      league: nba,
      home: celtics,
      away: warriors,
      date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
      venue: 'TD Garden',
    },
  ];

  matches.forEach(match => {
    // @ts-ignore
    db.matches.set(match.id, {
      id: match.id,
      api_id: match.id,
      sport_id: match.sport,
      league_id: match.league,
      home_team_id: match.home,
      away_team_id: match.away,
      match_date: match.date.toISOString(),
      status: 'scheduled',
      home_score: 0,
      away_score: 0,
      venue_name: match.venue,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  // Create sample users
  const demoUserId = 'user-demo';
  const venueOwnerId = 'user-venue-owner';
  
  // @ts-ignore
  db.users.set(demoUserId, {
    id: demoUserId,
    email: 'demo@example.com',
    password: 'demo123',
    created_at: new Date().toISOString(),
  });
  
  // @ts-ignore
  db.users.set(venueOwnerId, {
    id: venueOwnerId,
    email: 'owner@example.com',
    password: 'owner123',
    created_at: new Date().toISOString(),
  });
  
  // @ts-ignore
  db.userProfiles.set(demoUserId, {
    id: demoUserId,
    role: 'customer',
    full_name: 'Demo User',
    phone: '+1234567890',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  
  // @ts-ignore
  db.userProfiles.set(venueOwnerId, {
    id: venueOwnerId,
    role: 'venue_owner',
    full_name: 'John Smith',
    phone: '+0987654321',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Create sample venues
  const venues = [
    {
      id: 'venue-1',
      name: 'The Champions Sports Bar',
      description: 'Premier sports viewing venue with multiple 4K screens, surround sound, and amazing atmosphere for all major sporting events.',
      address: '123 Main Street',
      city: 'Manchester',
      country: 'UK',
      phone: '+44 20 1234 5678',
      email: 'info@championsbar.com',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
      capacity: 200,
    },
    {
      id: 'venue-2',
      name: 'Victory Lounge',
      description: 'Upscale sports lounge with VIP seating, premium cocktails, and gourmet dining while watching your favorite teams.',
      address: '456 Sunset Boulevard',
      city: 'Los Angeles',
      country: 'USA',
      phone: '+1 310 555 0123',
      email: 'contact@victorylounge.com',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      capacity: 150,
    },
    {
      id: 'venue-3',
      name: 'The Goal Post Pub',
      description: 'Traditional British pub with authentic atmosphere, craft beers, and the best place to watch Premier League matches.',
      address: '789 High Street',
      city: 'London',
      country: 'UK',
      phone: '+44 20 9876 5432',
      email: 'hello@goalpostpub.co.uk',
      image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800',
      capacity: 100,
    },
    {
      id: 'venue-4',
      name: 'Courtside Grill',
      description: 'Basketball-themed restaurant and bar with court-side viewing experience and American cuisine.',
      address: '321 Basketball Ave',
      city: 'Boston',
      country: 'USA',
      phone: '+1 617 555 0199',
      email: 'reservations@courtsidegrill.com',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      capacity: 180,
    },
  ];

  venues.forEach(venue => {
    // @ts-ignore
    db.venues.set(venue.id, {
      id: venue.id,
      owner_id: venueOwnerId,
      name: venue.name,
      description: venue.description,
      address: venue.address,
      city: venue.city,
      country: venue.country,
      phone: venue.phone,
      email: venue.email,
      image_url: venue.image,
      capacity: venue.capacity,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  // Create venue matches (linking venues to matches)
  const venueMatches = [
    // Venue 1 has football matches
    { id: 'vm-1', venue: 'venue-1', match: 'match-1', seats: 50, price: 25 },
    { id: 'vm-2', venue: 'venue-1', match: 'match-3', seats: 40, price: 20 },
    { id: 'vm-3', venue: 'venue-1', match: 'match-5', seats: 60, price: 30 },
    { id: 'vm-4', venue: 'venue-1', match: 'match-7', seats: 45, price: 25 },
    
    // Venue 2 has basketball matches
    { id: 'vm-5', venue: 'venue-2', match: 'match-2', seats: 30, price: 50 },
    { id: 'vm-6', venue: 'venue-2', match: 'match-4', seats: 35, price: 45 },
    { id: 'vm-7', venue: 'venue-2', match: 'match-6', seats: 40, price: 55 },
    { id: 'vm-8', venue: 'venue-2', match: 'match-8', seats: 25, price: 60 },
    
    // Venue 3 has football matches
    { id: 'vm-9', venue: 'venue-3', match: 'match-1', seats: 30, price: 35 },
    { id: 'vm-10', venue: 'venue-3', match: 'match-3', seats: 25, price: 30 },
    { id: 'vm-11', venue: 'venue-3', match: 'match-5', seats: 35, price: 40 },
    { id: 'vm-12', venue: 'venue-3', match: 'match-7', seats: 20, price: 35 },
    
    // Venue 4 has basketball matches
    { id: 'vm-13', venue: 'venue-4', match: 'match-2', seats: 45, price: 40 },
    { id: 'vm-14', venue: 'venue-4', match: 'match-4', seats: 50, price: 35 },
    { id: 'vm-15', venue: 'venue-4', match: 'match-6', seats: 55, price: 45 },
    { id: 'vm-16', venue: 'venue-4', match: 'match-8', seats: 40, price: 50 },
  ];

  venueMatches.forEach(vm => {
    // @ts-ignore
    db.venueMatches.set(vm.id, {
      id: vm.id,
      venue_id: vm.venue,
      match_id: vm.match,
      available_seats: vm.seats,
      price_per_seat: vm.price,
      minimum_spend: null,
      created_at: new Date().toISOString(),
    });
  });

  // Create some sample reservations
  const reservations = [
    {
      id: 'res-1',
      venueMatch: 'vm-1',
      customerId: demoUserId,
      name: 'Demo User',
      email: 'demo@example.com',
      phone: '+1234567890',
      size: 4,
      status: 'confirmed',
      requests: 'Table near the main screen please',
    },
    {
      id: 'res-2',
      venueMatch: 'vm-5',
      customerId: demoUserId,
      name: 'Demo User',
      email: 'demo@example.com',
      phone: '+1234567890',
      size: 2,
      status: 'pending',
      requests: null,
    },
  ];

  reservations.forEach(res => {
    // @ts-ignore
    db.reservations.set(res.id, {
      id: res.id,
      venue_match_id: res.venueMatch,
      customer_id: res.customerId,
      customer_name: res.name,
      customer_email: res.email,
      customer_phone: res.phone,
      party_size: res.size,
      status: res.status,
      special_requests: res.requests,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  console.log('Database initialized with seed data');
  console.log('Demo accounts:');
  console.log('  Customer: demo@example.com / demo123');
  console.log('  Venue Owner: owner@example.com / owner123');
}
