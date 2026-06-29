'use client';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import type { LoginUser } from '@/types/auth';

interface AuthContextValue {
  user: LoginUser | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginUser | null>(() => authService.getCurrentUser());
  const [isLoading] = useState(false);
  const router = useRouter();

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context ?? {
    user: authService.getCurrentUser(),
    isLoading: false,
    logout: authService.logout,
  };
}
