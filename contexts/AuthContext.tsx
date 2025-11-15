'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { loginUser, signupUser } from '../services/dbService';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<User | null>;
  signup: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('authToken');
      if (storedUser && storedToken) {
        setCurrentUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to parse stored auth data", error);
      // Clear corrupted data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
        const response = await loginUser(username, password);
        if (response.user && response.token) {
            setCurrentUser(response.user);
            setToken(response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('authToken', response.token);
            return response.user;
        }
        return null;
    } catch(error) {
      console.error("Login failed:", error);
      throw error;
    }
    finally {
        setIsLoading(false);
    }
  };

  const signup = async (username: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
        const response = await signupUser(username, password);
        if (response.user && response.token) {
            setCurrentUser(response.user);
            setToken(response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('authToken', response.token);
            return response.user;
        }
        return null;
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
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, login, signup, logout, isLoading }}>
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
