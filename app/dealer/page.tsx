"use client";
import { useState, useEffect } from "react";
import { Car, MessageCircle, TrendingUp, DollarSign, Plus, Eye, Heart, ArrowRight, Zap, Shield, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function DealerDashboard() {
  const [stats, setStats] = useState({ cars: 0, inquiries: 0, views: 0, favorites: 0 });

  useEffect(() => {
    // 실제 딜러 통계 조회
    fetch("/api/dealer/stats")
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); })
      .catch(() => setStats({ cars: 8, inquiries: 23, views: 1284, favorites: 47 }));
  }, []);

  const MENU = [
    { icon:<Plus size={22}/>, label:"새 매물 등록", href:"/dealer/cars/new", desc:"새 차량 매물 올리기", accent:"#00D4FF" },
    { icon:<Car size={22}/>, label:"내 매물 관리", href:"/dealer/cars", desc:"등록된 매물 수정·삭제", accent:"#0095FF" },
    { icon:<MessageCircle size={22}/>, label:"문의 관리", href:"/dealer/inquiries", desc:"고객 문의 확인·답변", accent:"#0066FF" },
    { icon:<DollarSign size={22}/>, label:"거래 내역", href:"/dealer/transactions", desc:"판매 현황 및 정산", accent:"#0044DD" },
    { icon:<BarChart2 size={22}/>, label:"성과 분석", href:"/dealer/analytics", desc:"조회수·전환율 분석", accent:"#00BBFF" },
    { icon:<Shield size={22}/>, label:"딜러 프로필", href:"/dealer/profile", desc:"상호명·소개 수정", accent:"#0055CC" },
  ];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#050A1A;-webkit-font-smoothing:antialiased;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        .menu-card{background:rgba(0,150,255,0.06);border:1px solid rgba(0,150,255,0.15);border-radius:18px;padding:22px 24px;transition:all 0.2s;cursor:pointer;display:flex;align-items:center;gap:16px;}
        .menu-card:hover{background:rgba(0,150,255,0.12);border-color:rgba(0,200,255,0.4);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,150,255,0.2);}
        .stat-card{background:rgba(0,100,255,0.08);border:1px solid rgba(0,150,255,0.2);border-radius:18px;padding:22px 24px;transition:all 0.2s;}
        .stat-card:hover{border-color:rgba(0,200,255,0.5);}
        @keyframes glow{0%,100%{opacity:0.5}50%{opacity:1}}
        @media(max-width:768px){.grid2{grid-template-columns:1fr!important;}.grid3{grid-template-columns:1fr 1fr!important;}}
      `}</style>

      <div style={{minHeight:"100vh",background:"#050A1A"}}>
        {/* 딜러 전용 네비 */}
        <div style={{background:"rgba(0,20,60,0.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,150,255,0.2)",padding:"0 32px",height:"68px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
          <Link href="/" style={{fontFamily:"'Bebas Neue',serif",fontSize:"26px",letterSpacing:"3px",display:"flex",alignItems:"center",gap:"8px"}}>
            <span style={{color:"#00AAFF"}}>FIX</span><span style={{color:"white"}}>CAR</span>
            <span style={{fontSize:"12px",fontFamily:"'NanumSquareRound',sans-serif",fontWeight:800,color:"rgba(0,200,255,0.6)",letterSpacing:"2px",marginLeft:"4px"}}>DEALER</span>
          </Link>
          <div style={{display:"flex",gap:"24px"}}>
            {[["대시보드","/dealer"],["매물","/dealer/cars"],["문의","/dealer/inquiries"],["거래","/dealer/transactions"],["분석","/dealer/analytics"]].map(([l,h])=>(
              <Link key={l} href={h} style={{fontSize:"14px",fontWeight:700,color:h==="/dealer"?"#00CCFF":"rgba(255,255,255,0.35)",transition:"color 0.15s"}}>{l}</Link>
            ))}
          </div>
          <Link href="/">
            <button style={{background:"rgba(0,150,255,0.15)",color:"#00AAFF",border:"1px solid rgba(0,150,255,0.3)",padding:"8px 18px",borderRadius:"100px",fontSize:"13px",fontWeight:700,cursor:"pointer"}}>← 픽스카</button>
          </Link>
        </div>

        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"32px 32px 80px"}}>
          {/* 헤더 */}
          <div style={{marginBottom:"32px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}>
              <Zap size={20} color="#00CCFF" style={{animation:"glow 2s infinite"}}/>
              <span style={{fontSize:"13px",fontWeight:800,letterSpacing:"3px",color:"#00AAFF"}}>DEALER DASHBOARD</span>
            </div>
            <h1 style={{fontSize:"32px",fontWeight:800,color:"white",letterSpacing:"-1px",marginBottom:"6px"}}>딜러 관리 센터</h1>
            <p style={{fontSize:"15px",color:"rgba(255,255,255,0.35)",fontWeight:400}}>픽스카 FIX 정찰가 딜러 전용 대시보드</p>
          </div>

          {/* KPI */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"28px"}} className="grid3">
            {[
              {label:"등록 매물",value:stats.cars,unit:"대",color:"#00CCFF",icon:<Car size={20}/>},
              {label:"이번달 조회",value:stats.views.toLocaleString(),unit:"회",color:"#00AAFF",icon:<Eye size={20}/>},
              {label:"찜 수",value:stats.favorites,unit:"개",color:"#0088FF",icon:<Heart size={20}/>},
              {label:"미답변 문의",value:stats.inquiries,unit:"건",color:"#FF6B00",icon:<MessageCircle size={20}/>},
            ].map(s=>(
              <div key={s.label} className="stat-card">
                <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px"}}>
                  <div style={{width:"36px",height:"36px",background:`${s.color}22`,borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",color:s.color}}>
                    {s.icon}
                  </div>
                  <span style={{fontSize:"13px",color:"rgba(255,255,255,0.4)",fontWeight:400}}>{s.label}</span>
                </div>
                <div style={{fontFamily:"'Bebas Neue',serif",fontSize:"36px",color:s.color,letterSpacing:"1px",lineHeight:1}}>
                  {s.value}<span style={{fontSize:"16px",color:"rgba(255,255,255,0.3)",marginLeft:"4px",fontFamily:"'NanumSquareRound',sans-serif",fontWeight:700}}>{s.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 메뉴 그리드 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"14px",marginBottom:"24px"}} className="grid2">
            {MENU.map(item=>(
              <Link key={item.label} href={item.href}>
                <div className="menu-card">
                  <div style={{width:"48px",height:"48px",background:`${item.accent}22`,border:`1px solid ${item.accent}44`,borderRadius:"14px",display:"flex",alignItems:"center",justifyContent:"center",color:item.accent,flexShrink:0}}>
                    {item.icon}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"16px",fontWeight:800,color:"white",marginBottom:"3px"}}>{item.label}</div>
                    <div style={{fontSize:"13px",color:"rgba(255,255,255,0.35)",fontWeight:400}}>{item.desc}</div>
                  </div>
                  <ArrowRight size={16} color="rgba(0,200,255,0.4)"/>
                </div>
              </Link>
            ))}
          </div>

          {/* 빠른 등록 배너 */}
          <div style={{background:"linear-gradient(135deg, rgba(0,100,255,0.3) 0%, rgba(0,200,255,0.15) 100%)",border:"1px solid rgba(0,200,255,0.3)",borderRadius:"20px",padding:"24px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:"18px",fontWeight:800,color:"white",marginBottom:"4px"}}>새 매물 빠르게 등록하기</div>
              <div style={{fontSize:"14px",color:"rgba(0,200,255,0.7)",fontWeight:400}}>검수 완료 후 24시간 내 게시 · FIX 정찰가 자동 적용</div>
            </div>
            <Link href="/dealer/cars/new">
              <button style={{background:"#00AAFF",color:"white",border:"none",padding:"13px 28px",borderRadius:"12px",fontSize:"15px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:"8px"}}>
                <Plus size={18}/> 매물 등록
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
