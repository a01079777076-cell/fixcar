"use client";
import { AuthProvider } from "@/lib/useAuth";
import VisitorTracker from "@/components/VisitorTracker";
import Footer from "@/components/Footer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Footer />
      <VisitorTracker />
    </AuthProvider>
  );
}
