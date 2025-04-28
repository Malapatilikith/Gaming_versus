
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  wallet: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  updateWallet: (amount: number) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Special admin credentials
const ADMIN_EMAIL = 'likithmalapati@gmail.com';
const ADMIN_PASSWORD = 'Aditya@0118';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Handle specific error cases
        if (error.message === "Email not confirmed") {
          // For development, we'll auto-confirm emails
          toast({
            title: "Email not confirmed",
            description: "For development, we'll log you in anyway.",
            variant: "default"
          });
          
          // Create a user with the signup email
          setUser({
            id: 'dev-user-' + Date.now(),
            username: email.split('@')[0],
            email: email,
            isAdmin: false,
            wallet: 100
          });
          setLoading(false);
          return;
        }
        
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login failed",
            description: "Invalid email or password.",
            variant: "destructive"
          });
          setLoading(false);
          throw error;
        }
        
        throw error;
      }
      
      if (data.user) {
        // Create a user object from Supabase data
        const supabaseUser: User = {
          id: data.user.id,
          username: data.user.email?.split('@')[0] || 'user',
          email: data.user.email || '',
          isAdmin: email === ADMIN_EMAIL, // Check if it's the admin email
          wallet: 100 // Default wallet amount
        };
        
        setUser(supabaseUser);
        toast({
          title: "Login successful",
          description: `Welcome back, ${supabaseUser.username}!`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Special admin login function
  const adminLogin = async (email: string, password: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if the credentials match the special admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin-special',
        username: 'Admin',
        email: ADMIN_EMAIL,
        isAdmin: true,
        wallet: 2000
      };
      
      setUser(adminUser);
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin portal!",
      });
      setLoading(false);
      return;
    }
    
    // If not matching special admin, give specific error
    toast({
      title: "Admin Login Failed",
      description: "Invalid admin credentials.",
      variant: "destructive"
    });
    setLoading(false);
    throw new Error("Invalid admin credentials");
  };

  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    
    try {
      // Try to sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // In development mode, automatically log in the user after signup
        const newUser: User = {
          id: data.user.id,
          username: username,
          email: email,
          isAdmin: false,
          wallet: 100 // Default wallet amount
        };
        
        setUser(newUser);
        
        toast({
          title: "Account created",
          description: "Your account has been created successfully. You are now logged in.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "Failed to log out.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    // Simulate API call delay
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Reset password failed",
        description: error.message || "Failed to send reset email.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateWallet = (amount: number) => {
    if (user) {
      setUser({
        ...user,
        wallet: user.wallet + amount
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        adminLogin,
        signup,
        logout,
        forgotPassword,
        updateWallet,
        isAdmin: user?.isAdmin || false
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
