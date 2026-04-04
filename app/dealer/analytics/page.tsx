// 📁 저장 경로: app/dealer/analytics/page.tsx
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BarChart3, Eye, Heart, MessageCircle, TrendingUp, Calendar } from "lucide-react";

export default function DealerAnalyticsPage() {
  const [period, setPeriod] = useState<"7d"|"30d"|"90d">("30d");
  const [stats, setStats] = useState({ totalViews: 0, totalFavorites: 0, totalInquiries: 0, avgViewsPerCar: 0, topCar: "" });

  useEffect(() => {
    fetch(`/api/dealer/analytics?period=${period}`).then(r => r.json()).then(d => {
      if (d.data) setStats(d.data);
    }).catch(() => {});
  }, [period]);

  // 임시 데이터 (API 미연동 시)
  const mockWeekly = [
    { day: "월", views: 45, inquiries: 2 },
    { day: "화", views: 62, inquiries: 3 },
    { day: "수", views: 38, inquiries: 1 },
    { day: "목", views: 71, inquiries: 4 },
    { day: "금", views: 55, inquiries: 2 },
    { day: "토", views: 89, inquiries: 5 },
    { day: "일", views: 67, inquiries: 3 },
  ];
  const maxViews = Math.max(...mockWeekly.map(d => d.views));

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F6FF;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0F6FF"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"28px 24px 100px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <div>
              <h1 style={{fontSize:24,fontWeight:800}}>📊 매물 분석</h1>
              <p style={{fontSize:13,color:"#888",marginTop:4}}>내 매물의 조회수와 관심도를 확인하세요</p>
            </div>
            <Link href="/dealer" style={{fontSize:13,fontWeight:700,color:"#888",textDecoration:"none"}}>← 대시보드</Link>
          </div>

          {/* 기간 선택 */}
          <div style={{display:"flex",gap:6,marginBottom:20}}>
            {([["7d","7일"],["30d","30일"],["90d","90일"]] as const).map(([v,l])=>(
              <button key={v} onClick={()=>setPeriod(v)} style={{padding:"8px 18px",borderRadius:100,border:period===v?"2px solid #0066FF":"1px solid #DDEEFF",background:period===v?"#EEF5FF":"white",color:period===v?"#0066FF":"#888",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>{l}</button>
            ))}
          </div>

          {/* 요약 카드 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
            {[
              {icon:<Eye size={20}/>,label:"총 조회수",value:"67",color:"#0066FF",bg:"#EEF5FF"},
              {icon:<Heart size={20}/>,label:"총 찜",value:"0",color:"#E24B4A",bg:"#FFF0ED"},
              {icon:<MessageCircle size={20}/>,label:"문의",value:"5",color:"#2D8A52",bg:"#EAF6EF"},
              {icon:<TrendingUp size={20}/>,label:"평균 조회/매물",value:"13.4",color:"#E8A020",bg:"#FFF8E0"},
            ].map(v=>(
              <div key={v.label} style={{background:"white",borderRadius:16,padding:"20px 18px",border:"1px solid #DDEEFF"}}>
                <div style={{width:36,height:36,borderRadius:10,background:v.bg,display:"flex",alignItems:"center",justifyContent:"center",color:v.color,marginBottom:10}}>{v.icon}</div>
                <div style={{fontSize:24,fontWeight:800,color:v.color}}>{v.value}</div>
                <div style={{fontSize:11,color:"#AAA",marginTop:2}}>{v.label}</div>
              </div>
            ))}
          </div>

          {/* 주간 조회수 차트 */}
          <div style={{background:"white",borderRadius:18,padding:"24px",border:"1px solid #DDEEFF",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
              <BarChart3 size={18} color="#0066FF"/>
              <span style={{fontSize:16,fontWeight:800}}>주간 조회수</span>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:8,height:160}}>
              {mockWeekly.map(d=>(
                <div key={d.day} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#0066FF"}}>{d.views}</div>
                  <div style={{width:"100%",height:`${(d.views/maxViews)*120}px`,background:"linear-gradient(180deg,#0066FF,#4D9AFF)",borderRadius:8,minHeight:4,transition:"height 0.3s"}}/>
                  <div style={{fontSize:11,color:"#AAA"}}>{d.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 인기 매물 */}
          <div style={{background:"white",borderRadius:18,padding:"24px",border:"1px solid #DDEEFF"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <Calendar size={18} color="#E8A020"/>
              <span style={{fontSize:16,fontWeight:800}}>인기 매물 TOP 3</span>
            </div>
            {[
              {name:"쏘나타 DN8",views:28,inquiries:3},
              {name:"그랜저 IG",views:22,inquiries:1},
              {name:"모델 Y RWD",views:17,inquiries:1},
            ].map((c,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:i<2?"1px solid #F0EEE9":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18,fontWeight:800,color:i===0?"#FF3B1E":i===1?"#E8A020":"#888",width:28}}>{i+1}</span>
                  <span style={{fontSize:15,fontWeight:700}}>{c.name}</span>
                </div>
                <div style={{display:"flex",gap:16,fontSize:12,color:"#888"}}>
                  <span>👁 {c.views}</span>
                  <span>💬 {c.inquiries}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
