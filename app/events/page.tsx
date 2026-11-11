// 📁 저장 경로: app/events/page.tsx
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Calendar, Clock } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events").then(r=>r.json()).then(d=>{
      setEvents(Array.isArray(d)?d:[]);
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  /* 관리자가 등록한 실제 이벤트만 표시 */
  const data = events;
  const now = new Date().toISOString().slice(0,10);

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"40px 24px 100px"}}>
          <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>🎉 이벤트</h1>
          <p style={{fontSize:14,color:"#AAA",marginBottom:32}}>픽스카에서 진행 중인 이벤트를 확인하세요.</p>

          {loading ? (
            <div style={{textAlign:"center",padding:60,color:"#CCC"}}>로딩 중...</div>
          ) : data.length===0 ? (
            <div style={{background:"white",borderRadius:18,padding:60,textAlign:"center",color:"#CCC"}}>
              <Calendar size={40} style={{marginBottom:12}}/>
              <div style={{fontSize:16,fontWeight:700}}>진행 중인 이벤트가 없습니다</div>
            </div>
          ) : data.map(ev=>{
            const isActive = ev.active && ev.endDate?.slice(0,10)>=now;
            return(
              <div key={ev.id} style={{background:"white",borderRadius:18,padding:"24px",marginBottom:16,border:isActive?"2px solid #2D8A52":"1px solid #E8E6E1",opacity:isActive?1:0.6}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <h2 style={{fontSize:20,fontWeight:800}}>{ev.title}</h2>
                  <span style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:100,background:isActive?"#EAF6EF":"#F0EEE9",color:isActive?"#2D8A52":"#AAA",flexShrink:0}}>{isActive?"진행중":"종료"}</span>
                </div>
                <div style={{display:"flex",gap:16,marginBottom:16,fontSize:13,color:"#888"}}>
                  <span style={{display:"flex",alignItems:"center",gap:4}}><Calendar size={14}/>{ev.startDate?.slice(0,10)}</span>
                  <span style={{display:"flex",alignItems:"center",gap:4}}><Clock size={14}/>~ {ev.endDate?.slice(0,10)}</span>
                </div>
                {ev.image&&<img src={ev.image} alt="" style={{width:"100%",borderRadius:14,marginBottom:16,objectFit:"cover",maxHeight:300}}/>}
                <div style={{fontSize:14,color:"#555",lineHeight:1.9,whiteSpace:"pre-line"}}>{ev.content}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
