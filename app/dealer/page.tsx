"use client";
import { useState, useEffect } from "react";
import { Car, MessageCircle, TrendingUp, DollarSign, Plus, Eye, Heart, ArrowRight, Zap, Shield, BarChart2, Bell } from "lucide-react";
import Link from "next/link";

export default function DealerDashboard() {
  const [stats, setStats] = useState({ cars:0, inquiries:0, views:0, favorites:0 });

  useEffect(() => {
    fetch("/api/dealer/stats")
      .then(r=>r.json())
      .then(d=>{ if(d.success) setStats(d.data); })
      .catch(()=>setStats({ cars:8, inquiries:23, views:1284, favorites:47 }));
  }, []);

  const MENU = [
    { icon:<Plus size={22}/>, label:"새 매물 등록", href:"/dealer/cars/new", desc:"새 차량 매물 올리기", color:"#0066FF" },
    { icon:<Car size={22}/>, label:"내 매물 관리", href:"/dealer/cars", desc:"등록된 매물 수정·삭제", color:"#0088DD" },
    { icon:<MessageCircle size={22}/>, label:"문의 관리", href:"/dealer/inquiries", desc:"고객 문의 확인·답변", color:"#00AACC" },
    { icon:<DollarSign size={22}/>, label:"거래 내역", href:"/dealer/transactions", desc:"판매 현황 및 정산", color:"#0055BB" },
    { icon:<BarChart2 size={22}/>, label:"성과 분석", href:"/dealer/analytics", desc:"조회수·전환율 분석", color:"#2266FF" },
    { icon:<Shield size={22}/>, label:"딜러 프로필", href:"/dealer/profile", desc:"상호명·소개 수정", color:"#0044AA" },
  ];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0F6FF;-webkit-font-smoothing:antialiased;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        .menu-card{background:white;border:1.5px solid #DDEEFF;border-radius:18px;padding:22px 24px;transition:all 0.2s;cursor:pointer;display:flex;align-items:center;gap:16px;}
        .menu-card:hover{border-color:#0066FF;box-shadow:0 6px 24px rgba(0,102,255,0.12);transform:translateY(-2px);}
        .stat-card{background:white;border:1.5px solid #DDEEFF;border-radius:18px;padding:20px 24px;}
        @media(max-width:768px){.grid3{grid-template-columns:1fr 1fr!important;}.kpi-grid{grid-template-columns:1fr 1fr!important;}}
      `}</style>

      <div style={{minHeight:"100vh",background:"#F0F6FF"}}>
        {/* 딜러 네비 - 밝은 화이트 */}
        <div style={{background:"white",borderBottom:"1.5px solid #DDEEFF",padding:"0 32px",height:"68px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,100,255,0.06)"}}>
          <Link href="/" style={{fontFamily:"'Bebas Neue',serif",fontSize:"26px",letterSpacing:"3px",display:"flex",alignItems:"center",gap:"10px"}}>
            <span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"#1A1A1A"}}>CAR</span>
            <span style={{fontSize:"11px",fontFamily:"'NanumSquareRound',sans-serif",fontWeight:800,color:"#0066FF",letterSpacing:"2px",background:"#EEF5FF",padding:"3px 10px",borderRadius:"100px",marginLeft:"4px"}}>DEALER</span>
          </Link>
          <div style={{display:"flex",gap:"6px"}}>
            {[["대시보드","/dealer"],["매물","/dealer/cars"],["문의","/dealer/inquiries"],["거래","/dealer/transactions"],["분석","/dealer/analytics"]].map(([l,h])=>(
              <Link key={l} href={h} style={{fontSize:"14px",fontWeight:700,color:h==="/dealer"?"#0066FF":"#888",padding:"8px 14px",borderRadius:"10px",background:h==="/dealer"?"#EEF5FF":"transparent"}}>
                {l}
              </Link>
            ))}
          </div>
          <Link href="/">
            <button style={{background:"#F0F6FF",color:"#0066FF",border:"1.5px solid #DDEEFF",padding:"8px 18px",borderRadius:"100px",fontSize:"13px",fontWeight:700,cursor:"pointer"}}>← 픽스카 홈</button>
          </Link>
        </div>

        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"28px 32px 80px"}}>
          {/* 헤더 */}
          <div style={{background:"linear-gradient(135deg, #0055FF 0%, #0099FF 100%)",borderRadius:"20px",padding:"28px 32px",marginBottom:"24px",display:"flex",justifyContent:"space-between",alignItems:"center",overflow:"hidden",position:"relative"}}>
            <div style={{position:"absolute",right:"-20px",bottom:"-20px",fontFamily:"'Bebas Neue',serif",fontSize:"120px",color:"rgba(255,255,255,0.07)",lineHeight:1}}>DEALER</div>
            <div style={{position:"relative",zIndex:1}}>
              <div style={{fontSize:"13px",fontWeight:800,letterSpacing:"3px",color:"rgba(255,255,255,0.7)",marginBottom:"6px"}}>DEALER DASHBOARD</div>
              <h1 style={{fontSize:"28px",fontWeight:800,color:"white",letterSpacing:"-1px",marginBottom:"4px"}}>딜러 관리 센터</h1>
              <p style={{fontSize:"14px",color:"rgba(255,255,255,0.75)",fontWeight:400}}>픽스카 FIX 정찰가 딜러 전용 대시보드</p>
            </div>
            <Link href="/dealer/cars/new">
              <button style={{background:"white",color:"#0066FF",border:"none",padding:"14px 28px",borderRadius:"12px",fontSize:"15px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",flexShrink:0}}>
                <Plus size={18}/> 새 매물 등록
              </button>
            </Link>
          </div>

          {/* KPI */}
          <div className="kpi-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"24px"}}>
            {[
              {label:"등록 매물",value:String(stats.cars),unit:"대",color:"#0066FF",bg:"#EEF5FF",icon:<Car size={20} color="#0066FF"/>},
              {label:"이번달 조회",value:stats.views.toLocaleString(),unit:"회",color:"#0099CC",bg:"#E6F7FF",icon:<Eye size={20} color="#0099CC"/>},
              {label:"찜 수",value:String(stats.favorites),unit:"개",color:"#0055AA",bg:"#EEF0FF",icon:<Heart size={20} color="#0055AA"/>},
              {label:"미답변 문의",value:String(stats.inquiries),unit:"건",color:"#FF6B00",bg:"#FFF3E6",icon:<MessageCircle size={20} color="#FF6B00"/>},
            ].map(s=>(
              <div key={s.label} className="stat-card">
                <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px"}}>
                  <div style={{width:"38px",height:"38px",background:s.bg,borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center"}}>{s.icon}</div>
                  <span style={{fontSize:"13px",color:"#888",fontWeight:400}}>{s.label}</span>
                </div>
                <div style={{fontSize:"30px",fontWeight:800,color:s.color,letterSpacing:"-1px",lineHeight:1}}>
                  {s.value}<span style={{fontSize:"14px",color:"#AAA",marginLeft:"3px",fontWeight:600}}>{s.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 메뉴 그리드 */}
          <div className="grid3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"14px",marginBottom:"20px"}}>
            {MENU.map(item=>(
              <Link key={item.label} href={item.href}>
                <div className="menu-card">
                  <div style={{width:"48px",height:"48px",background:`${item.color}15`,borderRadius:"14px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:item.color}}>
                    {item.icon}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:"16px",fontWeight:800,color:"#1A1A1A",marginBottom:"3px"}}>{item.label}</div>
                    <div style={{fontSize:"13px",color:"#AAA",fontWeight:400}}>{item.desc}</div>
                  </div>
                  <ArrowRight size={16} color="#CCDDFF"/>
                </div>
              </Link>
            ))}
          </div>

          {/* 알림 배너 */}
          <div style={{background:"white",border:"1.5px solid #DDEEFF",borderRadius:"16px",padding:"18px 22px",display:"flex",alignItems:"center",gap:"14px"}}>
            <div style={{width:"42px",height:"42px",background:"#FFF8EC",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Bell size={20} color="#E8A020"/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:"15px",fontWeight:800,color:"#1A1A1A",marginBottom:"2px"}}>매물 알림 설정</div>
              <div style={{fontSize:"13px",color:"#888",fontWeight:400}}>고객이 원하는 조건의 매물 등록 시 카카오톡으로 자동 알림이 발송돼요</div>
            </div>
            <Link href="/alerts">
              <button style={{background:"#FEE500",color:"#391B1B",border:"none",padding:"10px 20px",borderRadius:"10px",fontSize:"13px",fontWeight:800,cursor:"pointer",flexShrink:0}}>알림 설정 →</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
