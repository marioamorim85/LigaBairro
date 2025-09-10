'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from '@/lib/graphql/queries';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  city: string;
  lat?: number;
  lng?: number;
  bio?: string;
  role: string;
  ratingAvg?: number;
  skills?: Array<{
    skill: {
      id: string;
      name: string;
    };
  }>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  refetchUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, loading, refetch, error } = useQuery(GET_ME, {
    errorPolicy: 'ignore',
  });

  const user = data?.me || null;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        refetchUser: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}