import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, getCurrentUser } from '../lib/supabase';


interface AuthContextType {
  user: User | null;
  loading: boolean;

  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{
    data: {
      user: User | null;
      session: Session | null;
    } | null;
    error: Error | null;
  }>;

  signIn: (
    email: string,
    password: string
  ) => Promise<{
    data: {
      user: User | null;
      session: Session | null;
    } | null;
    error: Error | null;
  }>;

  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and set the user
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async (email: string, password: string, fullName: string) => {
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out. Please try again.')), 10000)
    );

    const signUpPromise = supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    const { data, error } = await Promise.race([signUpPromise, timeoutPromise]);
    return { data: data ?? null, error };
  } catch (err) {
    return { data: null, error: err as Error }; // ✅ always return data
  }
};

const handleSignIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data: data ?? null, error }; // ✅ return data too
  } catch (err) {
    return { data: null, error: err as Error };
  }
};

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};