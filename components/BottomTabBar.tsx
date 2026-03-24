"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Search, Heart, User } from "lucide-react";

const TABS = [
  { icon: Home, label: "홈", href: "/" },
  { icon: Search, label: "검색", href: "/cars" },
  { icon: Heart, label: "보관함", href: "/mypage" },
  { icon: User, label: "프로필", href: "/mypage" },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  /* 딜러/관리자 페이지에서는 숨김 */
  if (pathname?.startsWith("/dealer") || pathname?.startsWith("/admin")) return null;

  return (
    <>
      <div style={{ height: 72 }} /> {/* 탭바 높이만큼 여백 */}
      <nav className="fixcar-bottom-tab" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: "white",
        borderTop: "1px solid #E8E6E1", zIndex: 9999,
        display: "flex", justifyContent: "space-around", padding: "8px 0 12px",
        fontFamily: "'NanumSquareRound',sans-serif",
      }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = pathname === tab.href || (tab.href !== "/" && pathname?.startsWith(tab.href));
          return (
            <Link key={tab.label} href={tab.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textDecoration: "none", padding: "4px 16px" }}>
              <Icon size={22} color={active ? "#FF3B1E" : "#CCC"} />
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 500, color: active ? "#FF3B1E" : "#CCC" }}>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
      <style>{`@media(min-width:769px){.fixcar-bottom-tab{display:none!important;}div[style*="height: 72px"]{display:none!important;}}`}</style>
    </>
  );
}
