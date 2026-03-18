"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Car, Bell, User, Search } from "lucide-react";

const TABS = [
  { href:"/", icon:<Home size={22}/>, label:"홈" },
  { href:"/cars", icon:<Car size={22}/>, label:"매물" },
  { href:"/cars?search=1", icon:<Search size={22}/>, label:"검색" },
  { href:"/alerts", icon:<Bell size={22}/>, label:"알림" },
  { href:"/mypage", icon:<User size={22}/>, label:"내 정보" },
];

export default function BottomTabBar() {
  const path = usePathname();
  return (
    <>
      <style>{`
        .bottom-tab-bar{display:none;}
        @media(max-width:768px){.bottom-tab-bar{display:flex;}}
      `}</style>
      <nav className="bottom-tab-bar" style={{
        position:"fixed",bottom:0,left:0,right:0,zIndex:200,
        background:"white",borderTop:"1px solid #F0EEE9",
        height:"64px",justifyContent:"space-around",alignItems:"center",
        paddingBottom:"env(safe-area-inset-bottom)",
      }}>
        {TABS.map(tab=>{
          const active = path === tab.href || (tab.href !== "/" && path.startsWith(tab.href.split("?")[0]));
          return (
            <Link key={tab.href} href={tab.href} style={{
              display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",
              color:active?"#FF3B1E":"#AAA",textDecoration:"none",minWidth:"48px",
            }}>
              <div style={{color:active?"#FF3B1E":"#AAA"}}>{tab.icon}</div>
              <span style={{fontSize:"10px",fontWeight:active?800:600,fontFamily:"'NanumSquareRound',sans-serif"}}>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* 하단 탭바 높이만큼 여백 */}
      <div className="bottom-tab-bar" style={{height:"64px"}}/>
    </>
  );
}
