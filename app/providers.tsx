// 📁 저장 경로: app/providers.tsx
// ⚠️ 기존 providers.tsx가 있다면 ToastProvider 래핑만 추가하면 됩니다.
// 기존 파일이 없거나 구조가 다르면 이 파일로 교체하세요.
'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/components/AuthProvider';
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
