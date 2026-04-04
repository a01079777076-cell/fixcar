'use client';
import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/useAuth';
import { ToastProvider } from '@/components/Toast';
export default function Providers({ children }: { children: ReactNode }) {
  return (<AuthProvider><ToastProvider>{children}</ToastProvider></AuthProvider>);
}