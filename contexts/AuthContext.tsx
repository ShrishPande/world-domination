'use client';

import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { loginUser, signupUser } from '../services/dbService';

interface AuthState {
  currentUser: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  currentUser: null,
  token: null,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<User | null>;
  signup: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('authToken');
      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'SET_USER', payload: { user, token: storedToken } });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error("Failed to parse stored auth data", error);
      // Clear corrupted data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (username: string, password: string): Promise<User | null> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
        const response = await loginUser(username, password);
        if (response.user && response.token) {
            dispatch({ type: 'SET_USER', payload: { user: response.user, token: response.token } });
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('authToken', response.token);
            return response.user;
        }
        return null;
    } catch(error: any) {
      console.error("Login failed:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Login failed' });
      throw error;
    }
  };

  const signup = async (username: string, password: string): Promise<User | null> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
        const response = await signupUser(username, password);
        if (response.user && response.token) {
            dispatch({ type: 'SET_USER', payload: { user: response.user, token: response.token } });
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('authToken', response.token);
            return response.user;
        }
        return null;
    } catch(error: any) {
      console.error("Signup failed:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Signup failed' });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      signup,
      logout,
      clearError
    }}>
      {!state.isLoading && children}
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
