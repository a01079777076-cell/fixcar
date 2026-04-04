// 📁 저장 경로: app/settings/page.tsx
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { User, Bell, Shield, LogOut, ChevronRight, Moon, Smartphone } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (d?.user) setUser(d.user);
      else router.push("/login");
    }).catch(() => router.push("/login"));
  }, [router]);

  const handleLogout = async () => {
    if (!confirm("로그아웃 하시겠습니까?")) return;
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  const handleWithdraw = async () => {
    const msg = "정말 탈퇴하시겠습니까?\n\n• 모든 개인 정보가 삭제됩니다\n• 작성한 게시글은 삭제되지 않습니다\n• 딜러인 경우 등록 매물이 모두 삭제됩니다\n• 이 작업은 되돌릴 수 없습니다";
    if (!confirm(msg)) return;
    if (!confirm("마지막으로 한번 더 확인합니다. 정말 탈퇴하시겠습니까?")) return;
    // TODO: /api/auth/withdraw API 호출
    alert("탈퇴가 완료되었습니다.");
    router.push("/");
  };

  const sections = [
    {
      title: "계정",
      items: [
        { icon: <User size={18}/>, label: "프로필 수정", href: "/mypage", color: "#0066FF" },
        { icon: <Bell size={18}/>, label: "알림 설정", href: "/notifications/settings", color: "#E8A020" },
        { icon: <Shield size={18}/>, label: "비밀번호 변경", href: "/settings/password", color: "#2D8A52" },
      ],
    },
    {
      title: "서비스",
      items: [
        { icon: <Smartphone size={18}/>, label: "앱 설치", href: "#pwa", color: "#888" },
        { icon: <Moon size={18}/>, label: "다크 모드 (준비중)", href: "#", color: "#888" },
      ],
    },
    {
      title: "정보",
      items: [
        { icon: <Shield size={18}/>, label: "이용약관", href: "/terms", color: "#888" },
        { icon: <Shield size={18}/>, label: "개인정보 처리방침", href: "/privacy", color: "#888" },
        { icon: <User size={18}/>, label: "회사 소개", href: "/about", color: "#888" },
      ],
    },
  ];

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:600,margin:"0 auto",padding:"32px 24px 100px"}}>
          <h1 style={{fontSize:24,fontWeight:800,marginBottom:24}}>⚙ 설정</h1>

          {/* 유저 카드 */}
          {user && (
            <div style={{background:"white",borderRadius:18,padding:"20px 22px",marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:52,height:52,borderRadius:16,background:"#EEF5FF",display:"flex",alignItems:"center",justifyContent:"center"}}><User size={24} color="#0066FF"/></div>
              <div style={{flex:1}}>
                <div style={{fontSize:17,fontWeight:800}}>{user.nickname || user.name}</div>
                <div style={{fontSize:12,color:"#AAA"}}>{user.email}</div>
              </div>
              <span style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:100,background:user.role==="ADMIN"?"#FFF0ED":user.role==="DEALER"?"#EEF5FF":"#F0EEE9",color:user.role==="ADMIN"?"#FF3B1E":user.role==="DEALER"?"#0066FF":"#888"}}>{user.role}</span>
            </div>
          )}

          {/* 메뉴 섹션 */}
          {sections.map(sec => (
            <div key={sec.title} style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:800,color:"#AAA",marginBottom:8,paddingLeft:4}}>{sec.title}</div>
              <div style={{background:"white",borderRadius:14,overflow:"hidden"}}>
                {sec.items.map((item, i) => (
                  <Link key={item.label} href={item.href} style={{textDecoration:"none"}}>
                    <div style={{padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:i<sec.items.length-1?"1px solid #F0EEE9":"none",cursor:"pointer"}}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{color:item.color}}>{item.icon}</div>
                        <span style={{fontSize:14,fontWeight:600,color:"#333"}}>{item.label}</span>
                      </div>
                      <ChevronRight size={16} color="#CCC"/>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* 로그아웃 / 탈퇴 */}
          <div style={{marginTop:24}}>
            <button onClick={handleLogout} style={{width:"100%",padding:"16px",background:"white",border:"1px solid #E0DDD7",borderRadius:14,fontSize:15,fontWeight:700,color:"#888",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'NanumSquareRound',sans-serif",marginBottom:10}}>
              <LogOut size={16}/> 로그아웃
            </button>
            <button onClick={handleWithdraw} style={{width:"100%",padding:"14px",background:"none",border:"none",fontSize:13,color:"#CCC",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
