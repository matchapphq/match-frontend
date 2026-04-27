import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  mockRestaurants, 
  mockMatchs, 
  mockClients, 
  mockNotifications,
  mockReminderTemplates,
  mockReminderHistory,
  Restaurant, 
  Match, 
  Client, 
  Notification,
  ReminderTemplate,
  ReminderHistoryEntry
} from '../data/mockData';

interface AppContextType {
  restaurants: Restaurant[];
  matchs: Match[];
  clients: Client[];
  boostsDisponibles: number;
  notifications: Notification[];
  reminderTemplates: ReminderTemplate[];
  reminderHistory: ReminderHistoryEntry[];
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: number, restaurant: Partial<Restaurant>) => void;
  deleteRestaurant: (id: number) => void;
  addMatch: (match: Match) => void;
  updateMatch: (id: number, match: Partial<Match>) => void;
  deleteMatch: (id: number) => void;
  useBoost: () => void;
  addBoosts: (count: number) => void;
  getUserRestaurants: (userId: string) => Restaurant[];
  getUserMatchs: (userId: string) => Match[];
  getUserClients: (userId: string) => Client[];
  handleReservationAction: (reservationId: number, action: 'acceptée' | 'refusée') => void;
  updateClient: (id: number, client: Partial<Client>) => void;
  markAllAsRead: (userId: string) => void;
  addReminderTemplate: (template: ReminderTemplate) => void;
  updateReminderTemplate: (id: number, template: Partial<ReminderTemplate>) => void;
  deleteReminderTemplate: (id: number) => void;
  addReminderHistory: (entry: ReminderHistoryEntry) => void;
  getTemplatesByRestaurant: (restaurantId: number) => ReminderTemplate[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [matchs, setMatchs] = useState<Match[]>(mockMatchs);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [boostsDisponibles, setBoostsDisponibles] = useState(12);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [reminderTemplates, setReminderTemplates] = useState<ReminderTemplate[]>(mockReminderTemplates);
  const [reminderHistory, setReminderHistory] = useState<ReminderHistoryEntry[]>(mockReminderHistory);

  // Fonctions pour filtrer par utilisateur
  const getUserRestaurants = (userId: string) => restaurants.filter(r => r.userId === userId);
  const getUserMatchs = (userId: string) => matchs.filter(m => m.userId === userId);
  const getUserClients = (userId: string) => clients.filter(c => c.userId === userId);

  const addRestaurant = (restaurant: Restaurant) => {
    setRestaurants([...restaurants, restaurant]);
  };

  const updateRestaurant = (id: number, updatedData: Partial<Restaurant>) => {
    setRestaurants(restaurants.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const deleteRestaurant = (id: number) => {
    setRestaurants(restaurants.filter(r => r.id !== id));
  };

  const addMatch = (match: Match) => {
    setMatchs([...matchs, match]);
  };

  const updateMatch = (id: number, updatedData: Partial<Match>) => {
    setMatchs(matchs.map(m => m.id === id ? { ...m, ...updatedData } : m));
  };

  const deleteMatch = (id: number) => {
    setMatchs(matchs.filter(m => m.id !== id));
  };

  const useBoost = () => {
    if (boostsDisponibles > 0) {
      setBoostsDisponibles(boostsDisponibles - 1);
    }
  };

  const addBoosts = (count: number) => {
    setBoostsDisponibles(boostsDisponibles + count);
  };

  const handleReservationAction = (reservationId: number, action: 'acceptée' | 'refusée') => {
    const updatedClients = clients.map(client => {
      if (client.id === reservationId) {
        const nextStatus: Client['statut'] = action === 'acceptée' ? 'confirmé' : 'refusé';
        return { ...client, statut: nextStatus };
      }
      return client;
    });
    setClients(updatedClients);
  };

  const updateClient = (id: number, client: Partial<Client>) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...client } : c));
  };

  const markAllAsRead = (userId: string) => {
    setNotifications(notifications.map(n => n.userId === userId ? { ...n, read: true } : n));
  };

  // Reminder templates functions
  const addReminderTemplate = (template: ReminderTemplate) => {
    setReminderTemplates([...reminderTemplates, template]);
  };

  const updateReminderTemplate = (id: number, updatedData: Partial<ReminderTemplate>) => {
    setReminderTemplates(reminderTemplates.map(t => 
      t.id === id ? { ...t, ...updatedData, updatedAt: new Date().toISOString() } : t
    ));
  };

  const deleteReminderTemplate = (id: number) => {
    setReminderTemplates(reminderTemplates.filter(t => t.id !== id || t.isDefault));
  };

  const getTemplatesByRestaurant = (restaurantId: number) => {
    return reminderTemplates.filter(t => t.restaurantId === restaurantId || t.restaurantId === 'all');
  };

  // Reminder history functions
  const addReminderHistory = (entry: ReminderHistoryEntry) => {
    setReminderHistory([entry, ...reminderHistory]);
  };

  return (
    <AppContext.Provider value={{
      restaurants,
      matchs,
      clients,
      boostsDisponibles,
      notifications,
      reminderTemplates,
      reminderHistory,
      addRestaurant,
      updateRestaurant,
      deleteRestaurant,
      addMatch,
      updateMatch,
      deleteMatch,
      useBoost,
      addBoosts,
      getUserRestaurants,
      getUserMatchs,
      getUserClients,
      handleReservationAction,
      updateClient,
      markAllAsRead,
      addReminderTemplate,
      updateReminderTemplate,
      deleteReminderTemplate,
      addReminderHistory,
      getTemplatesByRestaurant,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
