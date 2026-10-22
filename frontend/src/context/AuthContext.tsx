import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, LoginRequest, RegisterStudentRequest } from '../types/auth';
import { authService } from '../services/authService';
import { getStoredToken, setStoredToken, removeStoredToken } from '../services/apiClient';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<User>;
  registerStudent: (data: RegisterStudentRequest) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    removeStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      setUser(response.user);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshUser();

    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener('slms-auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('slms-auth-expired', handleAuthExpired);
    };
  }, [refreshUser, logout]);

  const login = async (credentials: LoginRequest): Promise<User> => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      setStoredToken(result.token);
      setToken(result.token);
      setUser(result.user);
      return result.user;
    } finally {
      setIsLoading(false);
    }
  };

  const registerStudent = async (data: RegisterStudentRequest): Promise<User> => {
    setIsLoading(true);
    try {
      const result = await authService.registerStudent(data);
      setStoredToken(result.token);
      setToken(result.token);
      setUser(result.user);
      return result.user;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        registerStudent,
        logout,
        refreshUser,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
