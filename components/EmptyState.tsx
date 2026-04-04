// 📁 저장 경로: components/EmptyState.tsx
"use client";
import { Car, Search, Heart, Bell, MessageCircle } from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  car: <Car size={40} />,
  search: <Search size={40} />,
  heart: <Heart size={40} />,
  bell: <Bell size={40} />,
  message: <MessageCircle size={40} />,
};

interface EmptyStateProps {
  icon?: keyof typeof ICONS;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export default function EmptyState({ icon = "car", title, description, action }: EmptyStateProps) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ color: "#D0CCC5", marginBottom: 16 }}>{ICONS[icon] || ICONS.car}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#888", marginBottom: 8 }}>{title}</div>
      {description && <div style={{ fontSize: 13, color: "#CCC", lineHeight: 1.7 }}>{description}</div>}
      {action && (
        <a href={action.href} style={{ display: "inline-block", marginTop: 20, padding: "12px 28px", background: "#FF3B1E", color: "white", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
          {action.label}
        </a>
      )}
    </div>
  );
}
