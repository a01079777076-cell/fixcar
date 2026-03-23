"use client";
import { useState, useEffect, createContext, useContext } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  provider?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean; /* true = 아직 확인 중 */
  loggedIn: boolean;
}

const AuthContext = createContext<AuthState>({ user: null, loading: true, loggedIn: false });

/** 세션 캐시 (같은 페이지에서 중복 호출 방지) */
let cachedUser: User | null = null;
let cacheTime = 0;
const CACHE_TTL = 30000; /* 30초 */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: cachedUser, loading: !cachedUser, loggedIn: !!cachedUser });

  useEffect(() => {
    /* 캐시가 유효하면 API 호출 안 함 */
    if (cachedUser && Date.now() - cacheTime < CACHE_TTL) {
      setState({ user: cachedUser, loading: false, loggedIn: true });
      return;
    }

    fetch("/api/auth/session", { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        if (d?.user?.id) {
          cachedUser = d.user;
          cacheTime = Date.now();
          setState({ user: d.user, loading: false, loggedIn: true });
        } else {
          cachedUser = null;
          setState({ user: null, loading: false, loggedIn: false });
        }
      })
      .catch(() => {
        setState({ user: null, loading: false, loggedIn: false });
      });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

/** 인증 상태 사용 훅 */
export function useAuth() {
  return useContext(AuthContext);
}

/** 로딩 스켈레톤 (세션 확인 중 표시) */
export function AuthLoading() {
  return (
    <div style={{
      minHeight: "100vh", background: "#F0EEE9",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40, height: 40, border: "3px solid #E0DDD7",
          borderTopColor: "#FF3B1E", borderRadius: "50%",
          animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
        }} />
        <div style={{ fontSize: 14, color: "#AAA", fontWeight: 600 }}>로딩 중...</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}
