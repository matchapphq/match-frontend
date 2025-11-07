import { createContext, useContext, useEffect, useState } from 'react';
import InMemoryDatabase, { User as DbUser, UserProfile as DbUserProfile } from '../lib/inMemoryDatabase';

const db = InMemoryDatabase.getInstance();

// Mock Session type
interface Session {
  user: DbUser;
  access_token: string;
}

type UserProfile = DbUserProfile;

interface AuthContextType {
  user: DbUser | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: 'customer' | 'venue_owner') => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DbUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a stored session (in a real app, this would check localStorage or cookies)
    const storedSession = db.getSession();
    if (storedSession.data.session) {
      setSession(storedSession.data.session);
      setUser(storedSession.data.session.user);
      loadProfile(storedSession.data.session.user.id);
    } else {
      setLoading(false);
    }
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const profileData = await db.getUserProfile(userId);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user, session } = await db.signIn(email, password);
      setUser(user);
      setSession(session);
      await loadProfile(user.id);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: 'customer' | 'venue_owner'
  ) => {
    try {
      const { user, session } = await db.signUp(email, password);
      
      // Create user profile
      await db.createUserProfile({
        id: user.id,
        role,
        full_name: fullName,
      });
      
      setUser(user);
      setSession(session);
      await loadProfile(user.id);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await db.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      await db.updateUserProfile(user.id, updates);
      await loadProfile(user.id);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
