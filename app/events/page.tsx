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

  const fallback = [
    {id:1,title:"픽스카 오픈 기념 이벤트",content:"픽스카 오픈을 기념하여 첫 매물 등록 딜러분들께 프리미엄 광고 1개월 무료 혜택을 드립니다!\n\n대상: 오픈 후 최초 등록 딜러 20곳\n기간: 2026.04.01 ~ 2026.09.30\n혜택: 프리미엄 광고 1개월 무료",image:null,startDate:"2026-04-01",endDate:"2026-09-30",active:true},
    {id:2,title:"광주 중고차 시세 리포트 무료 제공",content:"광주 지역 인기 차종 TOP 20의 월간 시세 리포트를 무료로 제공합니다.\n\n매월 1일 블로그에 게시되며, 앱 알림으로도 받아보실 수 있습니다.",image:null,startDate:"2026-04-01",endDate:"2026-12-31",active:true},
  ];

  const data = events.length>0 ? events : (loading?[]:fallback);
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
