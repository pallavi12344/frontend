import React, { createContext, useContext, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContextType, User } from '../types';
import { authApi } from '../services/api';

interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  exp: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

const parseUserFromToken = (authToken: string): User | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(authToken);
    if (decoded.exp * 1000 <= Date.now()) return null;
    return { id: parseInt(decoded.sub), username: decoded.username, email: decoded.email };
  } catch {
    return null;
  }
};

const getInitialAuthState = (): { user: User | null; token: string | null } => {
  const storedToken = localStorage.getItem('token');
  if (!storedToken) return { user: null, token: null };

  const parsedUser = parseUserFromToken(storedToken);
  if (!parsedUser) {
    localStorage.removeItem('token');
    return { user: null, token: null };
  }

  return { user: parsedUser, token: storedToken };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<{ user: User | null; token: string | null }>(() => getInitialAuthState());
  const { user, token } = authState;

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('token', data.token);
    const parsedUser = parseUserFromToken(data.token);
    if (!parsedUser) {
      localStorage.removeItem('token');
      setAuthState({ user: null, token: null });
      return;
    }

    setAuthState({ user: parsedUser, token: data.token });
  };

  const register = async (username: string, email: string, password: string) => {
    await authApi.register(username, email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
