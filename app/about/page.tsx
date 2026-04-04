// 📁 저장 경로: app/about/page.tsx
"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Shield, Eye, Zap, Heart, MapPin, Users, Target, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"linear-gradient(135deg,#1A1A1A 60%,#FF3B1E)",padding:"clamp(48px,8vw,80px) 24px",textAlign:"center"}}>
          <div style={{fontFamily:"'Bebas Neue',serif",fontSize:"clamp(48px,8vw,72px)",color:"white",letterSpacing:6}}>
            <span style={{color:"#FF3B1E"}}>FIX</span>CAR
          </div>
          <p style={{fontSize:"clamp(16px,2vw,20px)",color:"rgba(255,255,255,0.7)",marginTop:12,lineHeight:1.8}}>광주 중고차, 이 차로 픽했다</p>
        </div>
        <div style={{maxWidth:900,margin:"0 auto",padding:"40px 24px 100px"}}>
          <div style={{background:"white",borderRadius:20,padding:"clamp(24px,4vw,40px)",marginBottom:20}}>
            <h2 style={{fontSize:24,fontWeight:800,marginBottom:16}}>우리의 미션</h2>
            <p style={{fontSize:16,color:"#555",lineHeight:2}}>중고차 시장의 불투명한 가격, 허위매물, 복잡한 거래 과정. 픽스카는 이 모든 문제를 해결하기 위해 만들어졌습니다.</p>
            <p style={{fontSize:16,color:"#555",lineHeight:2,marginTop:12}}><strong style={{color:"#FF3B1E"}}>FIX 정찰가</strong>로 흥정 없이, <strong style={{color:"#0066FF"}}>100항목 검수</strong>로 안전하게, <strong style={{color:"#2D8A52"}}>클린픽스카</strong> 규정으로 허위매물 없이. 광주에서 시작해 전국으로.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:20}}>
            {[
              {icon:<Shield size={28}/>,title:"FIX 정찰가",desc:"등록 가격 = 최종 가격. 흥정 없음.",color:"#FF3B1E",bg:"#FFF0ED"},
              {icon:<Eye size={28}/>,title:"100% 투명",desc:"성능점검, 사고이력, 정비이력 전부 공개.",color:"#0066FF",bg:"#EEF5FF"},
              {icon:<Zap size={28}/>,title:"100항목 검수",desc:"전문 검수원 직접 확인. 불량 자동 차단.",color:"#E8A020",bg:"#FFF8E0"},
              {icon:<Heart size={28}/>,title:"고객 우선",desc:"거래대행, 할부 상담, 명의이전 원스톱.",color:"#2D8A52",bg:"#EAF6EF"},
            ].map(v=>(
              <div key={v.title} style={{background:"white",borderRadius:16,padding:"24px 20px"}}>
                <div style={{width:48,height:48,borderRadius:14,background:v.bg,display:"flex",alignItems:"center",justifyContent:"center",color:v.color,marginBottom:14}}>{v.icon}</div>
                <div style={{fontSize:17,fontWeight:800,marginBottom:6}}>{v.title}</div>
                <div style={{fontSize:13,color:"#888",lineHeight:1.7}}>{v.desc}</div>
              </div>
            ))}
          </div>
          <div style={{background:"white",borderRadius:20,padding:"clamp(24px,4vw,40px)",marginBottom:20}}>
            <h2 style={{fontSize:24,fontWeight:800,marginBottom:20}}>회사 정보</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[
                {icon:<MapPin size={18}/>,label:"위치",value:"광주광역시"},
                {icon:<Users size={18}/>,label:"대표",value:"문상훈"},
                {icon:<Target size={18}/>,label:"사업자등록번호",value:"732-08-03454"},
                {icon:<TrendingUp size={18}/>,label:"서비스 시작",value:"2026년 4월"},
              ].map(v=>(
                <div key={v.label} style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:"#F8F7F4",display:"flex",alignItems:"center",justifyContent:"center",color:"#888",flexShrink:0}}>{v.icon}</div>
                  <div><div style={{fontSize:11,color:"#AAA"}}>{v.label}</div><div style={{fontSize:15,fontWeight:700}}>{v.value}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:"white",borderRadius:20,padding:"clamp(24px,4vw,40px)",marginBottom:20}}>
            <h2 style={{fontSize:24,fontWeight:800,marginBottom:20}}>로드맵</h2>
            {[
              {phase:"Phase 1",title:"광주 오픈",desc:"광주 딜러 20곳 모집, 매물 1,000대 확보, 앱 출시",status:"진행중",color:"#2D8A52"},
              {phase:"Phase 2",title:"서비스 확장",desc:"전남 확대, AI 차량 추천, 금융 제휴",status:"준비중",color:"#E8A020"},
              {phase:"Phase 3",title:"전국 서비스",desc:"전국 확장, B2B 파트너십, 수출 중고차",status:"계획",color:"#AAA"},
            ].map(v=>(
              <div key={v.phase} style={{display:"flex",gap:16,marginBottom:20}}>
                <div style={{width:80,flexShrink:0,textAlign:"center"}}>
                  <div style={{fontSize:11,fontWeight:800,color:v.color,marginBottom:4}}>{v.phase}</div>
                  <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:100,background:v.color==="#2D8A52"?"#EAF6EF":v.color==="#E8A020"?"#FFF8E0":"#F0EEE9",color:v.color}}>{v.status}</span>
                </div>
                <div><div style={{fontSize:16,fontWeight:800,marginBottom:4}}>{v.title}</div><div style={{fontSize:13,color:"#888",lineHeight:1.7}}>{v.desc}</div></div>
              </div>
            ))}
          </div>
          <div style={{background:"linear-gradient(135deg,#FF3B1E,#CC2200)",borderRadius:20,padding:"40px 24px",textAlign:"center"}}>
            <h3 style={{fontSize:24,fontWeight:800,color:"white",marginBottom:10}}>함께 만들어가요</h3>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.7)",marginBottom:24}}>딜러 입점, 제휴 문의 언제든 환영합니다.</p>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <Link href="/dealer/apply"><button style={{padding:"14px 32px",background:"white",color:"#FF3B1E",border:"none",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>딜러 입점 신청</button></Link>
              <Link href="/contact"><button style={{padding:"14px 32px",background:"rgba(255,255,255,0.2)",color:"white",border:"2px solid rgba(255,255,255,0.4)",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>문의하기</button></Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
