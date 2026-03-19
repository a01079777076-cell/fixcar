"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function AdminPage() {
  const [stats, setStats] = useState({ totalUsers:0, totalCars:0, totalVisitors:0, totalInquiries:0, totalErrors:0, pendingDealers:0 });

  useEffect(() => {
    fetch("/api/admin/stats").then(r=>r.json()).then(d=>setStats({...stats,...d})).catch(()=>{});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MENUS = [
    { icon:"👥", title:"회원 관리", desc:"전체 회원 목록 · 연락처 · 가입일", href:"/admin/users", color:"#1847FF", bg:"#EEF2FF" },
    { icon:"📊", title:"방문자 통계", desc:"일별·페이지별 방문 로그", href:"/admin/visitors", color:"#00C471", bg:"#E8F8EF" },
    { icon:"🚗", title:"딜러 관리", desc:`대기 ${stats.pendingDealers}명 · 승인·거부 · 딜러 정보`, href:"/admin/dealers", color:"#E8A020", bg:"#FFF8EC" },
    { icon:"⚙️", title:"사이트 설정", desc:"기본 설정 · 공지 · 배너", href:"/admin/settings", color:"#9B30FF", bg:"#F5EEFF" },
    { icon:"🚨", title:"오류 신고 접수", desc:"사용자 오류 신고 확인 · 처리", href:"/admin/errors", color:"#E24B4A", bg:"#FFF0ED" },
  ];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        .admin-card{transition:all 0.2s;cursor:pointer;} .admin-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.08)!important;}
      `}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"#1A1A1A",padding:"36px 24px 28px"}}>
          <div style={{maxWidth:900,margin:"0 auto"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:4,color:"#FF3B1E",marginBottom:6}}>ADMIN PANEL</div>
            <h1 style={{fontSize:28,fontWeight:800,color:"white"}}>관리자 대시보드</h1>
          </div>
        </div>

        <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px 100px"}}>
          {/* KPI */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))",gap:12,marginBottom:24}}>
            {[
              {label:"전체 회원",value:stats.totalUsers,color:"#1847FF"},
              {label:"등록 매물",value:stats.totalCars,color:"#FF3B1E"},
              {label:"총 방문자",value:stats.totalVisitors,color:"#00C471"},
              {label:"문의",value:stats.totalInquiries,color:"#E8A020"},
              {label:"오류신고",value:stats.totalErrors,color:"#E24B4A"},
            ].map((k,i)=>(
              <div key={i} style={{background:"white",borderRadius:16,padding:"20px 18px",textAlign:"center"}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:k.color}}>{k.value}</div>
                <div style={{fontSize:12,color:"#AAA",fontWeight:400,marginTop:4}}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* 메뉴 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {MENUS.map(m=>(
              <Link key={m.href} href={m.href} style={{textDecoration:"none"}}>
                <div className="admin-card" style={{background:"white",borderRadius:18,padding:"24px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                  <div style={{width:48,height:48,borderRadius:14,background:m.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:14}}>{m.icon}</div>
                  <div style={{fontSize:16,fontWeight:800,color:"#1A1A1A",marginBottom:4}}>{m.title}</div>
                  <div style={{fontSize:13,color:"#AAA",fontWeight:400}}>{m.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
