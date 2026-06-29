"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
import { SESSION_CHANGED_EVENT } from "@/lib/api/client";
import type { LoginUser } from "@/types/auth";

interface AuthContextValue {
  user: LoginUser | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const syncUser = () => {
      setUser(authService.getCurrentUser());
      setIsLoading(false);
    };
    syncUser();

    window.addEventListener(SESSION_CHANGED_EVENT, syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener(SESSION_CHANGED_EVENT, syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push("/login");
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
