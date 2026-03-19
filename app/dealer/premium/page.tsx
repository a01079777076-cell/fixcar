"use client";
import Navbar from "@/components/Navbar";
import { Check, X, Zap, Star, Shield } from "lucide-react";

const PLANS = [
  {
    name:"기본 플랜", price:"무료", period:"베타 기간 동안", color:"#888", bg:"#F0EEE9",
    features:["매물 등록 최대 10개","기본 통계 (조회수)","고객 문의 수신","픽스카 FIX 정찰가 적용"],
    disabled:["매물 상단 노출","우선 검수 (24시간→6시간)","고급 분석 대시보드","매물 알림 고객 매칭","전담 매니저 지원"],
  },
  {
    name:"프리미엄 플랜", price:"월 99,000원", period:"부가세 포함", color:"#0066FF", bg:"#EEF5FF", badge:"추천",
    features:["매물 등록 무제한","매물 상단 노출 (우선 배치)","우선 검수 (6시간 내)","고급 분석 대시보드","매물 알림 고객 자동 매칭","카카오톡 알림 자동 발송","전담 매니저 지원","픽스카 인증 뱃지"],
    disabled:[],
  },
];

export default function PremiumDealerPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#0066FF",padding:"60px 52px",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}><div style={{fontFamily:"'Bebas Neue',serif",fontSize:"200px",color:"rgba(255,255,255,0.06)"}}>PREMIUM</div></div>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"rgba(255,255,255,0.7)",marginBottom:"12px"}}>DEALER PLAN</div>
            <h1 style={{fontSize:"clamp(28px,5vw,52px)",fontWeight:800,color:"white",letterSpacing:"-1.5px",marginBottom:"12px"}}>픽스카 프리미엄 딜러</h1>
            <p style={{fontSize:"17px",color:"rgba(255,255,255,0.8)",fontWeight:400}}>더 많은 고객에게, 더 빠르게 노출되세요</p>
          </div>
        </div>

        <div style={{maxWidth:"860px",margin:"0 auto",padding:"40px 32px 80px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"40px"}}>
            {PLANS.map(plan=>(
              <div key={plan.name} style={{background:"white",borderRadius:"20px",padding:"28px",border:`2px solid ${plan.color}33`,position:"relative"}}>
                {plan.badge&&<div style={{position:"absolute",top:"-12px",left:"50%",transform:"translateX(-50%)",background:plan.color,color:"white",padding:"5px 16px",borderRadius:"100px",fontSize:"12px",fontWeight:800}}>{plan.badge}</div>}
                <div style={{fontSize:"12px",fontWeight:800,color:plan.color,marginBottom:"8px"}}>{plan.name}</div>
                <div style={{fontSize:"28px",fontWeight:800,marginBottom:"4px",color:plan.color}}>{plan.price}</div>
                <div style={{fontSize:"13px",color:"#AAA",fontWeight:400,marginBottom:"20px"}}>{plan.period}</div>
                <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"20px"}}>
                  {plan.features.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",fontWeight:600}}><Check size={14} color="#2D8A52"/>{f}</div>)}
                  {plan.disabled.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",fontWeight:400,color:"#CCC"}}><X size={14} color="#E0DDD7"/>{f}</div>)}
                </div>
                {plan.badge ? (
                  <button style={{width:"100%",background:plan.color,color:"white",border:"none",padding:"14px",borderRadius:"12px",fontSize:"15px",fontWeight:800,cursor:"pointer"}}>프리미엄 시작하기</button>
                ) : (
                  <a href="/dealer/cars/new"><button style={{width:"100%",background:"#F0EEE9",color:"#555",border:"none",padding:"14px",borderRadius:"12px",fontSize:"15px",fontWeight:700,cursor:"pointer"}}>기본으로 시작</button></a>
                )}
              </div>
            ))}
          </div>

          {/* 혜택 소개 */}
          <h2 style={{fontSize:"22px",fontWeight:800,marginBottom:"16px",textAlign:"center"}}>프리미엄 딜러만의 혜택</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}}>
            {[{icon:<Zap size={24} color="#0066FF"/>,t:"상단 노출",d:"검색 결과 최상단에 우선 배치돼요"},
              {icon:<Star size={24} color="#E8A020"/>,t:"빠른 검수",d:"24시간→6시간 내 검수 완료"},
              {icon:<Shield size={24} color="#2D8A52"/>,t:"인증 뱃지",d:"픽스카 공식 인증 딜러 뱃지 부여"}].map(b=>(
              <div key={b.t} style={{background:"white",borderRadius:"14px",padding:"20px",textAlign:"center"}}>
                <div style={{marginBottom:"10px",display:"flex",justifyContent:"center"}}>{b.icon}</div>
                <div style={{fontSize:"15px",fontWeight:800,marginBottom:"5px"}}>{b.t}</div>
                <div style={{fontSize:"12px",color:"#888",fontWeight:400,lineHeight:1.65}}>{b.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
