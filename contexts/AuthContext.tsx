'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { loginUser, signupUser } from '../services/dbService';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string) => Promise<User | null>;
  signup: (username: string) => Promise<User | null>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = async (username: string): Promise<User | null> => {
    setIsLoading(true);
    try {
        const user = await loginUser(username);
        if (user) {
            setCurrentUser(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
        return null;
    } catch(error) {
      console.error("Login failed:", error);
      // Let the component handle displaying the error message by re-throwing
      throw error;
    }
    finally {
        setIsLoading(false);
    }
  };

  const signup = async (username: string): Promise<User | null> => {
    setIsLoading(true);
    try {
        const newUser = await signupUser(username);
        setCurrentUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return newUser;
    } catch(error) {
      console.error("Signup failed:", error);
      throw error;
    }
    finally {
        setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
