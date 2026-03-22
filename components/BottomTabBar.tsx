"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Search, Heart, User } from "lucide-react";

const TABS = [
  { label:"홈", href:"/", icon:Home },
  { label:"검색", href:"/cars", icon:Search },
  { label:"보관함", href:"/mypage/favorites", icon:Heart },
  { label:"프로필", href:"/mypage", icon:User },
];

/* 하단 탭 숨길 페이지 */
const HIDDEN = ["/dealer","/admin","/login","/blog/write"];

export default function BottomTabBar() {
  const pathname = usePathname();
  const hide = HIDDEN.some(p => pathname.startsWith(p));
  if (hide) return null;

  return (
    <>
      <div className="bottom-tab-bar" style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:9998,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(12px)",
        borderTop:"1px solid #E8E6E1",
        display:"flex", justifyContent:"space-around", alignItems:"center",
        padding:"6px 0 env(safe-area-inset-bottom, 8px)",
        boxShadow:"0 -2px 12px rgba(0,0,0,0.04)",
      }}>
        {TABS.map(tab => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link key={tab.href} href={tab.href} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:"3px",
              textDecoration:"none", padding:"6px 16px", borderRadius:10,
              transition:"all 0.15s",
            }}>
              <Icon size={22} color={active ? "#FF3B1E" : "#AAA"} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{
                fontSize:10, fontWeight:active ? 800 : 500,
                color:active ? "#FF3B1E" : "#AAA",
                fontFamily:"'NanumSquareRound',sans-serif",
              }}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="bottom-tab-spacer" style={{ height:60 }} />
      <style>{`
        @media (min-width: 769px) {
          .bottom-tab-bar { display: none !important; }
          .bottom-tab-spacer { display: none !important; }
        }
      `}</style>
    </>
  );
}
