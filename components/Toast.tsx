// 📁 저장 경로: components/Toast.tsx
"use client";
import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from "react";
import { CheckCircle, AlertTriangle, X, Info } from "lucide-react";

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface ToastCtx {
  toast: (message: string, type?: ToastItem["type"]) => void;
}

const ToastContext = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastItem["type"] = "success") => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const remove = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons = {
    success: <CheckCircle size={16} />,
    error: <AlertTriangle size={16} />,
    warning: <AlertTriangle size={16} />,
    info: <Info size={16} />,
  };
  const colors = {
    success: { bg: "#EAF6EF", border: "#B8DFC8", text: "#2D8A52" },
    error: { bg: "#FFF0ED", border: "#FFD4CC", text: "#E24B4A" },
    warning: { bg: "#FFF8E0", border: "#FFE8A0", text: "#C4A060" },
    info: { bg: "#EEF5FF", border: "#DDEEFF", text: "#0066FF" },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* 토스트 컨테이너 */}
      <div style={{
        position: "fixed", top: 80, right: 20, zIndex: 10001,
        display: "flex", flexDirection: "column", gap: 8,
        pointerEvents: "none", maxWidth: 360,
      }}>
        {toasts.map(t => {
          const c = colors[t.type];
          return (
            <div key={t.id} style={{
              background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 14,
              padding: "14px 18px", display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)", pointerEvents: "auto",
              animation: "toastSlideIn 0.3s ease-out",
            }}>
              <div style={{ color: c.text, flexShrink: 0 }}>{icons[t.type]}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: c.text, flex: 1 }}>{t.message}</div>
              <button onClick={() => remove(t.id)} style={{ border: "none", background: "none", cursor: "pointer", color: c.text, padding: 2, flexShrink: 0 }}>
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes toastSlideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </ToastContext.Provider>
  );
}
