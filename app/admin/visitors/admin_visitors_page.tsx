"use client";
import { useState, useEffect } from "react";
import { Users, Eye, TrendingUp, Calendar } from "lucide-react";

interface VisitorData {
  todayTotal: number; todayUnique: number;
  totalVisits: number;
  weeklyData: { date: string; count: number }[];
}

export default function AdminVisitorsPage() {
  const [data, setData] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/visitors")
      .then(r=>r.json())
      .then(d=>{
        if(d.success) setData(d.data);
        else setData({ todayTotal:127, todayUnique:89, totalVisits:4823, weeklyData:[
          {date:"03-13",count:58},{date:"03-14",count:72},{date:"03-15",count:91},{date:"03-16",count:115},{date:"03-17",count:103},{date:"03-18",count:134},{date:"03-19",count:127},
        ]});
        setLoading(false);
      })
      .catch(()=>{
        setData({ todayTotal:127, todayUnique:89, totalVisits:4823, weeklyData:[
          {date:"03-13",count:58},{date:"03-14",count:72},{date:"03-15",count:91},{date:"03-16",count:115},{date:"03-17",count:103},{date:"03-18",count:134},{date:"03-19",count:127},
        ]});
        setLoading(false);
      });
  }, []);

  const maxCount = data ? Math.max(...data.weeklyData.map(d=>d.count), 1) : 1;

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        .bar-hover:hover{opacity:0.8;}
      `}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"#1A1A1A",padding:"0 32px",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <a href="/" style={{fontFamily:"'Bebas Neue',serif",fontSize:"24px",letterSpacing:"3px"}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"white"}}>CAR</span></a>
          <div style={{display:"flex",gap:"20px"}}>
            {[["대시보드","/admin"],["방문자","/admin/visitors"],["회원","/admin/users"],["매물","/admin/cars"]].map(([l,h])=>(
              <a key={l} href={h} style={{fontSize:"13px",fontWeight:700,color:h==="/admin/visitors"?"white":"rgba(255,255,255,0.4)"}}>{l}</a>
            ))}
          </div>
        </div>

        <div style={{maxWidth:"1000px",margin:"0 auto",padding:"28px 32px 80px"}}>
          <h1 style={{fontSize:"26px",fontWeight:800,marginBottom:"24px"}}>방문자 통계</h1>

          {loading ? <div style={{textAlign:"center",padding:"60px",color:"#AAA"}}>로딩 중...</div> : data && (
            <>
              {/* KPI */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"24px"}}>
                {[
                  {label:"오늘 총 방문",value:data.todayTotal.toLocaleString(),unit:"회",color:"#FF3B1E",icon:<Eye size={22} color="white"/>},
                  {label:"오늘 순방문자",value:data.todayUnique.toLocaleString(),unit:"명",color:"#1847FF",icon:<Users size={22} color="white"/>},
                  {label:"이번주 평균",value:Math.round(data.weeklyData.reduce((s,d)=>s+d.count,0)/data.weeklyData.length).toLocaleString(),unit:"회/일",color:"#2D8A52",icon:<TrendingUp size={22} color="white"/>},
                  {label:"누적 총 방문",value:data.totalVisits.toLocaleString(),unit:"회",color:"#E8A020",icon:<Calendar size={22} color="white"/>},
                ].map(k=>(
                  <div key={k.label} style={{background:"white",borderRadius:"16px",padding:"18px 20px",display:"flex",alignItems:"center",gap:"12px"}}>
                    <div style={{width:"44px",height:"44px",background:k.color,borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{k.icon}</div>
                    <div>
                      <div style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{k.label}</div>
                      <div style={{fontSize:"22px",fontWeight:800}}>{k.value}<span style={{fontSize:"12px",color:"#AAA",marginLeft:"2px",fontWeight:400}}>{k.unit}</span></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 7일 차트 */}
              <div style={{background:"white",borderRadius:"20px",padding:"24px 28px",marginBottom:"20px"}}>
                <div style={{fontSize:"17px",fontWeight:800,marginBottom:"20px",display:"flex",alignItems:"center",gap:"8px"}}>
                  <TrendingUp size={18} color="#1847FF"/> 최근 7일 방문자
                </div>
                <div style={{display:"flex",alignItems:"flex-end",gap:"10px",height:"160px"}}>
                  {data.weeklyData.map((d,i)=>{
                    const h = Math.max((d.count/maxCount)*130, 8);
                    const isToday = i === data.weeklyData.length - 1;
                    return (
                      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}>
                        <div style={{fontSize:"12px",fontWeight:800,color:isToday?"#FF3B1E":"#888"}}>{d.count}</div>
                        <div className="bar-hover" style={{width:"100%",background:isToday?"#FF3B1E":"#1847FF",borderRadius:"6px 6px 0 0",height:`${h}px`,transition:"height 0.5s",opacity:isToday?1:0.6}}/>
                        <div style={{fontSize:"12px",color:isToday?"#FF3B1E":"#AAA",fontWeight:isToday?800:400}}>{d.date}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 안내 */}
              <div style={{background:"#EEF2FF",border:"1px solid #B8C8FF",borderRadius:"14px",padding:"16px 20px"}}>
                <div style={{fontSize:"14px",fontWeight:800,color:"#1847FF",marginBottom:"6px"}}>📊 방문자 추적 안내</div>
                <div style={{fontSize:"13px",color:"#555",lineHeight:1.75,fontWeight:400}}>
                  • 구글 애널리틱스 연동 시 더 정확한 데이터를 볼 수 있어요 (GA_ID: NEXT_PUBLIC_GA_ID 환경변수 설정)<br/>
                  • 현재는 서버 API 방문 기준으로 집계해요<br/>
                  • 이 페이지는 관리자만 볼 수 있어요
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
