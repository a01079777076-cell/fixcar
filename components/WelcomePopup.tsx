"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight, Zap, Search, BookOpen, Shield } from "lucide-react";

export default function WelcomePopup() {
  const [show, setShow] = useState(false);
  const [neverShow, setNeverShow] = useState(false);

  useEffect(() => {
    /* 이미 이번 세션에서 닫았으면 안 띄움 */
    if (sessionStorage.getItem("fixcar_welcome_closed")) return;
    /* 영구 닫기 했으면 안 띄움 */
    try { if (localStorage.getItem("fixcar_welcome_dismissed") === "true") return; } catch {}

    /* 로그인 확인 — 2초 딜레이 (페이지 렌더 후) */
    const timer = setTimeout(() => {
      fetch("/api/auth/session", { cache: "no-store" })
        .then(r => r.json())
        .then(d => { if (d?.user?.id) setShow(true); })
        .catch(() => {});
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("fixcar_welcome_closed", "true");
    if (neverShow) {
      try { localStorage.setItem("fixcar_welcome_dismissed", "true"); } catch {}
    }
    setShow(false);
  };

  if (!show) return null;

  const FEATURES = [
    { icon: Zap, title: "차량 MBTI", desc: "나에게 맞는 차 유형 찾기", href: "/mbti", color: "#FF3B1E" },
    { icon: Search, title: "FIX 정찰가 매물", desc: "흥정 없는 투명한 가격", href: "/cars", color: "#1847FF" },
    { icon: BookOpen, title: "차량 카탈로그", desc: "모든 차량 스펙·가격 비교", href: "/catalog", color: "#2D8A52" },
    { icon: Shield, title: "클린픽스카", desc: "허위매물 ZERO 정책", href: "/clean", color: "#E8A020" },
  ];

  return (
    <>
      <div onClick={handleClose} style={{
        position:"fixed", top:0, left:0, right:0, bottom:0,
        background:"rgba(0,0,0,0.5)", zIndex:10000, animation:"fadeIn 0.2s ease",
      }}/>
      <div style={{
        position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        background:"white", borderRadius:24, padding:"32px 28px", width:"min(420px, 90vw)",
        zIndex:10001, boxShadow:"0 20px 60px rgba(0,0,0,0.2)", animation:"slideUp 0.3s ease",
      }}>
        <button onClick={handleClose} style={{
          position:"absolute", top:16, right:16, border:"none", background:"#F0EEE9",
          borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center",
          justifyContent:"center", cursor:"pointer",
        }}><X size={16} color="#AAA"/></button>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:12}}>👋</div>
          <h2 style={{fontSize:22,fontWeight:800,marginBottom:6}}>픽스카가 처음이신가요?</h2>
          <p style={{fontSize:14,color:"#888",fontWeight:400,lineHeight:1.7}}>
            광주 No.1 중고차 정찰제 플랫폼<br/>잠깐이면 핵심 기능을 알 수 있어요!
          </p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          {FEATURES.map(f=>{
            const Icon = f.icon;
            return (
              <Link key={f.title} href={f.href} onClick={handleClose} style={{textDecoration:"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"#F8F7F4",borderRadius:14,cursor:"pointer"}}>
                  <div style={{width:40,height:40,borderRadius:12,background:`${f.color}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon size={20} color={f.color}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:800}}>{f.title}</div>
                    <div style={{fontSize:12,color:"#AAA"}}>{f.desc}</div>
                  </div>
                  <ArrowRight size={14} color="#CCC"/>
                </div>
              </Link>
            );
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:"#AAA"}}>
            <input type="checkbox" checked={neverShow} onChange={e=>setNeverShow(e.target.checked)} style={{width:16,height:16,accentColor:"#FF3B1E"}}/>
            앞으로 이 창을 띄우지 않습니다
          </label>
          <button onClick={handleClose} style={{padding:"10px 22px",background:"#FF3B1E",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>확인</button>
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideUp{from{opacity:0;transform:translate(-50%,-45%)}to{opacity:1;transform:translate(-50%,-50%)}}`}</style>
    </>
  );
}
