
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type UserRole = 'franchisor' | 'franchisee';

type UserProfile = {
  id: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
  }>;
  signUp: (email: string, password: string, role: UserRole, franchiseName?: string) => Promise<{
    error: Error | null;
    data: {
      user: User | null;
      session: Session | null;
    };
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserProfile({
        id: data.id,
        role: data.role as UserRole, // Cast to UserRole type
        first_name: data.first_name,
        last_name: data.last_name
      });
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Set up the auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to avoid Supabase transaction deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }

        if (event === 'SIGNED_OUT') {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        // We'll redirect based on role in useEffect after profile is loaded
      }
      
      return { error };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, franchiseName?: string) => {
    try {
      const metadata: Record<string, string> = { role };
      
      // Add franchise name for franchisors
      if (role === 'franchisor' && franchiseName) {
        metadata.franchise_name = franchiseName;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        }
      });
      
      if (!error) {
        toast({
          title: "Sign up successful",
          description: "Please check your email for verification if required.",
        });
      }
      
      return { error, data };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error: error as Error, data: { user: null, session: null } };
    }
  };

  // Handle redirection based on user role
  useEffect(() => {
    if (userProfile && user) {
      const currentPath = window.location.pathname;
      
      // Don't redirect on these paths
      if (currentPath === '/login') {
        const redirectPath = userProfile.role === 'franchisor' 
          ? '/' 
          : '/opportunities';
        navigate(redirectPath);
      }
      
      // Prevent franchisees from accessing franchisor routes
      if (userProfile.role === 'franchisee' && 
          (currentPath === '/franchisees' || currentPath === '/territories' || currentPath === '/leads')) {
        navigate('/opportunities');
      }
      
      // Prevent franchisors from accessing franchisee routes
      if (userProfile.role === 'franchisor' && currentPath === '/opportunities') {
        navigate('/');
      }
    }
  }, [userProfile, user, navigate]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate('/login');
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out",
        variant: "destructive",
      });
    }
  };

  const value = {
    session,
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
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
