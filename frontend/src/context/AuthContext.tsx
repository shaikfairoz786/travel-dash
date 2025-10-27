import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  const isAuthenticated = !!session;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id, session.access_token);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.access_token);
        // Navigate to home page after successful auth (including email confirmation)
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          navigate('/');
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserProfile = async (userId: string, accessToken: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        console.error('Failed to fetch user profile');
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // First try admin login via backend API
      const adminResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (adminResponse.ok) {
        const adminData = await adminResponse.json();

        // Create a mock session for admin users
        const mockSession = {
          access_token: adminData.accessToken,
          refresh_token: adminData.refreshToken,
          expires_in: 3600, // 1 hour
          token_type: 'bearer',
          user: {
            id: adminData.user.id,
            email: adminData.user.email,
            user_metadata: { name: adminData.user.name },
            app_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          },
        };

        setSession(mockSession as Session);
        setUser(adminData.user);
        navigate('/');
        return true;
      }

      // If admin login fails, try Supabase auth for regular users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return false;
      }

      if (data.session) {
        setSession(data.session);
        // User profile will be fetched via the auth state change listener
        // Navigate to home page after successful login
        navigate('/');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error', error);
      alert('An error occurred during login.');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) {
        alert(error.message);
        return false;
      }

      if (data.user) {
        alert('Registration successful! Please check your email to confirm your account.');
        navigate('/login');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error', error);
      alert('An error occurred during registration.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const value = {
    user,
    session,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    supabase,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
