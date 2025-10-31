/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Screen, Broadcast, Availability, Engagement } from '../types';

interface AppContextType {
  user: User | null;
  screens: Screen[];
  broadcasts: Broadcast[];
  availability: Availability[];
  engagement: Engagement[];
  login: (email: string) => Promise<void>;
  logout: () => void;
  addScreen: (screen: Omit<Screen, 'id'>) => void;
  updateScreen: (id: string, updates: Partial<Screen>) => void;
  deleteScreen: (id: string) => void;
  assignBroadcast: (screenId: string, broadcast: Broadcast) => void;
  updateAvailability: (id: string, status: Availability['status']) => void;
  addAvailability: (availability: Omit<Availability, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [screens, setScreens] = useState<Screen[]>([
    {
      id: '1',
      name: 'Main Screen',
      location: 'Bar Area',
      status: 'active',
    },
    {
      id: '2',
      name: 'Side Screen',
      location: 'Dining Area',
      status: 'active',
    },
  ]);
  
  const [broadcasts] = useState<Broadcast[]>([
    {
      id: '1',
      matchName: 'Premier League: Arsenal vs Chelsea',
      sport: 'Football',
      startTime: '2025-10-31T15:00:00Z',
      status: 'live',
    },
    {
      id: '2',
      matchName: 'NBA: Lakers vs Warriors',
      sport: 'Basketball',
      startTime: '2025-10-31T19:00:00Z',
      status: 'scheduled',
    },
  ]);
  
  const [availability, setAvailability] = useState<Availability[]>([
    { id: '1', type: 'table', identifier: 'T1', status: 'available' },
    { id: '2', type: 'table', identifier: 'T2', status: 'occupied', screenId: '1' },
    { id: '3', type: 'seat', identifier: 'S1', status: 'available' },
    { id: '4', type: 'seat', identifier: 'S2', status: 'available' },
  ]);
  
  const [engagement] = useState<Engagement[]>([
    {
      timestamp: new Date().toISOString(),
      visitors: 45,
      avgWatchTime: 32,
      screenId: '1',
    },
    {
      timestamp: new Date().toISOString(),
      visitors: 28,
      avgWatchTime: 25,
      screenId: '2',
    },
  ]);

  const login = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: '1',
      email,
      venueName: 'The Sports Bar',
    });
  };

  const logout = () => {
    setUser(null);
  };

  const addScreen = (screen: Omit<Screen, 'id'>) => {
    const newScreen = {
      ...screen,
      id: Date.now().toString(),
    };
    setScreens(prev => [...prev, newScreen]);
  };

  const updateScreen = (id: string, updates: Partial<Screen>) => {
    setScreens(prev =>
      prev.map(screen =>
        screen.id === id ? { ...screen, ...updates } : screen
      )
    );
  };

  const deleteScreen = (id: string) => {
    setScreens(prev => prev.filter(screen => screen.id !== id));
  };

  const assignBroadcast = (screenId: string, broadcast: Broadcast) => {
    updateScreen(screenId, { currentBroadcast: broadcast });
  };

  const updateAvailability = (id: string, status: Availability['status']) => {
    setAvailability(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const addAvailability = (avail: Omit<Availability, 'id'>) => {
    const newAvail = {
      ...avail,
      id: Date.now().toString(),
    };
    setAvailability(prev => [...prev, newAvail]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        screens,
        broadcasts,
        availability,
        engagement,
        login,
        logout,
        addScreen,
        updateScreen,
        deleteScreen,
        assignBroadcast,
        updateAvailability,
        addAvailability,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
