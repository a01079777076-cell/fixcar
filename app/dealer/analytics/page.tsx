// 📁 저장 경로: app/dealer/analytics/page.tsx
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Eye, Heart, MessageCircle, TrendingUp, Calendar } from "lucide-react";

interface TopCar { id:number; name:string; views:number; favorites:number; inquiries:number; }
interface Stats { totalViews:number; totalFavorites:number; totalInquiries:number; avgViewsPerCar:string; topCars:TopCar[]; carCount:number; totalCars:number; }

/* 실제 DB 수치만 표시 (임시·가짜 데이터 없음) */
export default function DealerAnalyticsPage() {
  const [stats, setStats] = useState<Stats|null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dealer/analytics")
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); else setError(d.error || "불러오기 실패"); })
      .catch(() => setError("불러오기 실패"));
  }, []);

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F6FF;} @media(max-width:640px){.an-grid{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0F6FF"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"28px 24px 100px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <div>
              <h1 style={{fontSize:24,fontWeight:800}}>📊 매물 분석</h1>
              <p style={{fontSize:13,color:"#888",marginTop:4}}>내 매물의 누적 조회수와 관심도를 확인하세요</p>
            </div>
            <Link href="/dealer" style={{fontSize:13,fontWeight:700,color:"#888",textDecoration:"none"}}>← 대시보드</Link>
          </div>

          {error && <div style={{background:"#FFF0ED",color:"#E24B4A",padding:"12px 16px",borderRadius:12,fontSize:13,fontWeight:700,marginBottom:16}}>⚠️ {error}</div>}
          {!stats && !error && <div style={{textAlign:"center",padding:60,color:"#AAA"}}>불러오는 중…</div>}

          {stats && (
            <>
              {/* 요약 카드 */}
              <div className="an-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
                {[
                  {icon:<Eye size={20}/>,label:"누적 조회수",value:stats.totalViews.toLocaleString(),color:"#0066FF",bg:"#EEF5FF"},
                  {icon:<Heart size={20}/>,label:"총 찜",value:stats.totalFavorites.toLocaleString(),color:"#E24B4A",bg:"#FFF0ED"},
                  {icon:<MessageCircle size={20}/>,label:"문의",value:stats.totalInquiries.toLocaleString(),color:"#2D8A52",bg:"#EAF6EF"},
                  {icon:<TrendingUp size={20}/>,label:"매물당 평균 조회",value:stats.avgViewsPerCar,color:"#E8A020",bg:"#FFF8E0"},
                ].map(v=>(
                  <div key={v.label} style={{background:"white",borderRadius:16,padding:"20px 18px",border:"1px solid #DDEEFF"}}>
                    <div style={{width:36,height:36,borderRadius:10,background:v.bg,display:"flex",alignItems:"center",justifyContent:"center",color:v.color,marginBottom:10}}>{v.icon}</div>
                    <div style={{fontSize:24,fontWeight:800,color:v.color}}>{v.value}</div>
                    <div style={{fontSize:11,color:"#AAA",marginTop:2}}>{v.label}</div>
                  </div>
                ))}
              </div>

              <div style={{background:"white",borderRadius:16,padding:"14px 18px",border:"1px solid #DDEEFF",marginBottom:20,fontSize:13,color:"#555"}}>
                전체 매물 <strong>{stats.totalCars}대</strong> · 판매중 <strong style={{color:"#2D8A52"}}>{stats.carCount}대</strong>
              </div>

              {/* 인기 매물 */}
              <div style={{background:"white",borderRadius:18,padding:"24px",border:"1px solid #DDEEFF"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                  <Calendar size={18} color="#E8A020"/>
                  <span style={{fontSize:16,fontWeight:800}}>조회수 TOP 3</span>
                </div>
                {stats.topCars.length===0 ? (
                  <div style={{padding:"24px 0",textAlign:"center",color:"#BBB",fontSize:13}}>등록된 매물이 없습니다 · <Link href="/dealer/cars/new" style={{color:"#0066FF",fontWeight:800}}>매물 등록하기</Link></div>
                ) : stats.topCars.map((c,i)=>(
                  <Link key={c.id} href={`/cars/${c.id}`} style={{textDecoration:"none",color:"inherit"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:i<stats.topCars.length-1?"1px solid #F0EEE9":"none"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:18,fontWeight:800,color:i===0?"#FF3B1E":i===1?"#E8A020":"#888",width:28}}>{i+1}</span>
                        <span style={{fontSize:15,fontWeight:700}}>{c.name}</span>
                      </div>
                      <div style={{display:"flex",gap:16,fontSize:12,color:"#888"}}>
                        <span>👁 {c.views}</span>
                        <span>❤️ {c.favorites}</span>
                        <span>💬 {c.inquiries}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
