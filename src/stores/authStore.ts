import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../types/chat';
import { AuthError } from '../lib/errors';
import { initializeDatabase } from '../lib/database';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setApiKey: (apiKey: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  initializeAuth: async () => {
    try {
      // Initialize database tables
      await initializeDatabase();

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: settings } = await supabase
          .from('user_settings')
          .select('apiKey')
          .eq('userId', session.user.id)
          .single();

        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            apiKey: settings?.apiKey || undefined,
          },
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw new AuthError(authError.message);
      if (!authData.user) throw new AuthError('No user data returned');

      // Ensure user_settings table exists and has a record
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('apiKey')
        .eq('userId', authData.user.id)
        .single();

      if (settingsError && settingsError.code === '42P01') {
        // Table doesn't exist, initialize database
        await initializeDatabase();
      }

      // Create settings if they don't exist
      if (!settings) {
        await supabase
          .from('user_settings')
          .insert([{
            userId: authData.user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
      }

      set({
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          apiKey: settings?.apiKey,
        },
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to sign in',
        user: null
      });
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw new AuthError(authError.message);
      if (!authData.user) throw new AuthError('No user data returned');

      // Ensure database tables exist
      await initializeDatabase();

      // Create initial user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .insert([{
          userId: authData.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (settingsError) {
        console.error('Settings creation error:', settingsError);
      }

      set({
        user: {
          id: authData.user.id,
          email: authData.user.email!,
        },
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to sign up',
        user: null
      });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to sign out' });
    } finally {
      set({ loading: false });
    }
  },

  setApiKey: async (apiKey: string) => {
    const currentUser = get().user;
    if (!currentUser) {
      set({ error: 'No user logged in' });
      return;
    }

    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          userId: currentUser.id,
          apiKey,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      set({
        user: { ...currentUser, apiKey },
        error: null,
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to save API key' });
    } finally {
      set({ loading: false });
    }
  },
}));