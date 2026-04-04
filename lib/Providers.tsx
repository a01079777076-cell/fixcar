// 📁 저장 경로: app/Providers.tsx (대문자 P 주의)
'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/useAuth';
import { ToastProvider } from '@/components/Toast';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}
