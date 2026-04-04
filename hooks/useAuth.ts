// 📁 저장 경로: hooks/useAuth.ts
"use client";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  nickname?: string;
  role: "USER" | "DEALER" | "ADMIN";
  phone?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  isDealer: boolean;
  isAdmin: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(r => r.json())
      .then(d => { if (d?.user) setUser(d.user); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return {
    user,
    loading,
    isLoggedIn: !!user,
    isDealer: user?.role === "DEALER" || user?.role === "ADMIN",
    isAdmin: user?.role === "ADMIN",
  };
}
