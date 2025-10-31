export interface Venue {
  id: string;
  name: string;
  owner: string;
}

export interface Screen {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  currentBroadcast?: Broadcast;
}

export interface Broadcast {
  id: string;
  matchName: string;
  sport: string;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'live' | 'completed';
}

export interface Availability {
  id: string;
  type: 'seat' | 'table';
  identifier: string;
  status: 'available' | 'occupied' | 'reserved';
  screenId?: string;
}

export interface Engagement {
  timestamp: string;
  visitors: number;
  screenId?: string;
  avgWatchTime: number;
}

export interface User {
  id: string;
  email: string;
  venueName: string;
}
