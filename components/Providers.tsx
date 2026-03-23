"use client";
import { AuthProvider } from "@/lib/useAuth";
import VisitorTracker from "@/components/VisitorTracker";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <VisitorTracker />
    </AuthProvider>
  );
}
