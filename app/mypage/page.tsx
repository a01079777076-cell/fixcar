// 📁 저장 경로: app/mypage/page.tsx
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Heart, Bell, MessageCircle, Car, Settings, Edit, CheckCircle } from "lucide-react";

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState("");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (d?.user) { setUser(d.user); setNickname(d.user.nickname || d.user.name || ""); }
      else router.push("/login");
    }).catch(() => router.push("/login"));
  }, [router]);

  const handleNickname = async () => {
    if (!nickname.trim()) return;
    try {
      const res = await fetch("/api/auth/nickname", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });
      const d = await res.json();
      if (d.success) {
        setUser((p: any) => ({ ...p, nickname: nickname.trim() }));
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else alert(d.error || "변경 실패");
    } catch { alert("네트워크 오류"); }
  };

  const menus = [
    { icon: <Heart size={20}/>, label: "찜 목록", href: "/favorites", color: "#E24B4A", bg: "#FFF0ED" },
    { icon: <Bell size={20}/>, label: "매물 알림", href: "/wish-alert", color: "#E8A020", bg: "#FFF8E0" },
    { icon: <MessageCircle size={20}/>, label: "내 문의", href: "/mypage/inquiries", color: "#0066FF", bg: "#EEF5FF" },
    { icon: <Car size={20}/>, label: "내 게시글", href: "/mypage/posts", color: "#2D8A52", bg: "#EAF6EF" },
    { icon: <Settings size={20}/>, label: "설정", href: "/settings", color: "#888", bg: "#F0EEE9" },
  ];

  if (!user) return null;

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:600,margin:"0 auto",padding:"32px 24px 100px"}}>
          {saved && <div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:8,fontSize:14,fontWeight:700,color:"#2D8A52"}}><CheckCircle size={16}/>닉네임이 변경되었습니다!</div>}

          {/* 프로필 카드 */}
          <div style={{background:"white",borderRadius:20,padding:"28px 24px",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
              <div style={{width:64,height:64,borderRadius:20,background:"#EEF5FF",display:"flex",alignItems:"center",justifyContent:"center"}}><User size={32} color="#0066FF"/></div>
              <div style={{flex:1}}>
                {editing ? (
                  <div style={{display:"flex",gap:8}}>
                    <input value={nickname} onChange={e=>setNickname(e.target.value)} maxLength={12} style={{flex:1,padding:"10px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:16,fontWeight:800,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                    <button onClick={handleNickname} style={{padding:"10px 16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>저장</button>
                    <button onClick={()=>{setEditing(false);setNickname(user.nickname||user.name);}} style={{padding:"10px 14px",background:"#F0EEE9",color:"#888",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>취소</button>
                  </div>
                ) : (
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:22,fontWeight:800}}>{user.nickname || user.name}</span>
                    <button onClick={()=>setEditing(true)} style={{border:"none",background:"none",cursor:"pointer",color:"#CCC",padding:4}}><Edit size={14}/></button>
                  </div>
                )}
                <div style={{fontSize:13,color:"#AAA",marginTop:4}}>{user.email}</div>
              </div>
            </div>

            {/* 역할 뱃지 */}
            <div style={{display:"flex",gap:8}}>
              <span style={{fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:100,background:user.role==="ADMIN"?"#FFF0ED":user.role==="DEALER"?"#EEF5FF":"#F0EEE9",color:user.role==="ADMIN"?"#FF3B1E":user.role==="DEALER"?"#0066FF":"#888"}}>
                {user.role==="ADMIN"?"관리자":user.role==="DEALER"?"인증 딜러":"일반 회원"}
              </span>
              {user.role === "DEALER" && (
                <Link href="/dealer" style={{fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:100,background:"#0066FF",color:"white",textDecoration:"none"}}>딜러 대시보드</Link>
              )}
            </div>
          </div>

          {/* 메뉴 */}
          <div style={{background:"white",borderRadius:18,overflow:"hidden"}}>
            {menus.map((m, i) => (
              <Link key={m.label} href={m.href} style={{textDecoration:"none"}}>
                <div style={{padding:"18px 22px",display:"flex",alignItems:"center",gap:14,borderBottom:i<menus.length-1?"1px solid #F0EEE9":"none",cursor:"pointer"}}>
                  <div style={{width:40,height:40,borderRadius:12,background:m.bg,display:"flex",alignItems:"center",justifyContent:"center",color:m.color}}>{m.icon}</div>
                  <span style={{fontSize:15,fontWeight:700,color:"#333",flex:1}}>{m.label}</span>
                  <span style={{color:"#CCC",fontSize:14}}>›</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
