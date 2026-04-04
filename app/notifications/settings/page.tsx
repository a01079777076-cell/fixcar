// 📁 저장 경로: app/notifications/settings/page.tsx
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Bell, Car, MessageCircle, TrendingDown, CheckCircle } from "lucide-react";

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    priceAlert: true,
    wishAlert: true,
    inquiryReply: true,
    communityReply: true,
    eventNotice: false,
    marketingPush: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof settings) => setSettings(p => ({ ...p, [key]: !p[key] }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const items = [
    { key: "priceAlert" as const, icon: <TrendingDown size={18}/>, title: "가격 변동 알림", desc: "찜한 차량의 가격이 변경되면 알림", color: "#FF3B1E" },
    { key: "wishAlert" as const, icon: <Car size={18}/>, title: "매물 알림", desc: "설정한 조건에 맞는 새 매물 등록 시 알림", color: "#0066FF" },
    { key: "inquiryReply" as const, icon: <MessageCircle size={18}/>, title: "문의 답변 알림", desc: "딜러가 내 문의에 답변하면 알림", color: "#2D8A52" },
    { key: "communityReply" as const, icon: <MessageCircle size={18}/>, title: "커뮤니티 답글 알림", desc: "내 게시글에 답글이 달리면 알림", color: "#E8A020" },
    { key: "eventNotice" as const, icon: <Bell size={18}/>, title: "이벤트/공지 알림", desc: "새 이벤트, 공지사항 알림", color: "#888" },
    { key: "marketingPush" as const, icon: <Bell size={18}/>, title: "마케팅 알림", desc: "프로모션, 할인 정보 알림", color: "#888" },
  ];

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:600,margin:"0 auto",padding:"32px 24px 100px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <h1 style={{fontSize:22,fontWeight:800}}>🔔 알림 설정</h1>
            <Link href="/settings" style={{fontSize:13,fontWeight:700,color:"#888",textDecoration:"none"}}>← 설정</Link>
          </div>

          {saved && <div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:8,fontSize:14,fontWeight:700,color:"#2D8A52"}}><CheckCircle size={16}/>저장됐어요!</div>}

          <div style={{background:"white",borderRadius:18,overflow:"hidden"}}>
            {items.map((item, i) => (
              <div key={item.key} style={{padding:"18px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:i<items.length-1?"1px solid #F0EEE9":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:36,height:36,borderRadius:10,background:"#F8F7F4",display:"flex",alignItems:"center",justifyContent:"center",color:item.color}}>{item.icon}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:800}}>{item.title}</div>
                    <div style={{fontSize:11,color:"#AAA",marginTop:2}}>{item.desc}</div>
                  </div>
                </div>
                <button onClick={() => toggle(item.key)} style={{width:48,height:28,borderRadius:14,border:"none",cursor:"pointer",background:settings[item.key]?"#FF3B1E":"#E0DDD7",position:"relative",transition:"background 0.2s"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:"white",position:"absolute",top:3,left:settings[item.key]?23:3,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}}/>
                </button>
              </div>
            ))}
          </div>

          <button onClick={handleSave} style={{width:"100%",marginTop:20,padding:"16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
            알림 설정 저장
          </button>
        </div>
      </div>
    </>
  );
}
