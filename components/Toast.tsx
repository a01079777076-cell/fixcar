'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
interface Toast { id: number; message: string; type: 'success'|'error'|'info'|'warning'; }
interface ToastContextType { addToast: (message: string, type?: Toast['type']) => void; }
const ToastContext = createContext<ToastContextType | null>(null);
export function useToast() { const ctx = useContext(ToastContext); if (!ctx) throw new Error('useToast must be used within ToastProvider'); return ctx; }
const S: Record<Toast['type'], {bg:string;border:string;icon:string}> = { success:{bg:'#F0FFF4',border:'#48BB78',icon:'✅'}, error:{bg:'#FFF5F5',border:'#F56565',icon:'❌'}, info:{bg:'#EBF8FF',border:'#4299E1',icon:'ℹ️'}, warning:{bg:'#FFFFF0',border:'#ECC94B',icon:'⚠️'} };
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => { const id = Date.now(); setToasts(p => [...p, {id,message,type}]); setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000); }, []);
  return (<ToastContext.Provider value={{addToast}}>{children}<div style={{position:'fixed',top:20,right:20,zIndex:99999,display:'flex',flexDirection:'column',gap:8,pointerEvents:'none'}}>{toasts.map(t => { const s = S[t.type]; return (<div key={t.id} style={{background:s.bg,border:'1px solid '+s.border,borderRadius:12,padding:'12px 20px',fontSize:14,fontWeight:600,color:'#333',boxShadow:'0 4px 20px rgba(0,0,0,0.12)',display:'flex',alignItems:'center',gap:8,animation:'toastIn .3s ease-out',pointerEvents:'auto',maxWidth:360}}><span>{s.icon}</span><span>{t.message}</span></div>);})}</div><style>{'@keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}'}</style></ToastContext.Provider>);
}