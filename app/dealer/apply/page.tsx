"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Shield, TrendingUp, Users, Zap, CheckCircle, Phone } from "lucide-react";

export default function DealerApplyPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"linear-gradient(135deg,#0055FF,#003399)",padding:"60px 24px",textAlign:"center",color:"white",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-20,bottom:-30,fontFamily:"'Bebas Neue',serif",fontSize:"clamp(80px,15vw,180px)",color:"rgba(255,255,255,0.08)",lineHeight:1}}>DEALER</div>
          <div style={{position:"relative",zIndex:1,maxWidth:700,margin:"0 auto"}}>
            <div style={{fontSize:11,fontWeight:800,letterSpacing:4,color:"rgba(255,255,255,0.6)",marginBottom:12}}>FIXCAR DEALER PARTNER</div>
            <h1 style={{fontSize:"clamp(28px,5vw,42px)",fontWeight:800,marginBottom:12,lineHeight:1.3}}>광주 1등 중고차 플랫폼<br/>픽스카와 함께하세요</h1>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.7)",lineHeight:1.8,marginBottom:24}}>선착순 20개 딜러 한정<br/>6개월 무료 등록 프로모션 진행 중!</p>
            <a href="tel:010-0000-0000"><button style={{padding:"18px 40px",background:"white",color:"#0055FF",border:"none",borderRadius:100,fontSize:18,fontWeight:800,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:10,fontFamily:"'NanumSquareRound',sans-serif"}}><Phone size={20}/>입점 문의하기</button></a>
          </div>
        </div>

        <div style={{maxWidth:800,margin:"0 auto",padding:"48px 24px 80px"}}>
          <h2 style={{fontSize:24,fontWeight:800,textAlign:"center",marginBottom:32}}>왜 픽스카인가요?</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:48}}>
            {[
              {icon:TrendingUp,title:"매출 성장",desc:"FIX 정찰가로 신뢰도 UP! 계약 전환율 2배 향상",color:"#FF3B1E"},
              {icon:Users,title:"신규 고객",desc:"온라인 유입 고객 + AI 매칭으로 딱 맞는 고객 연결",color:"#0066FF"},
              {icon:Shield,title:"신뢰 보장",desc:"검증된 플랫폼 인증 딜러 마크로 고객 신뢰 확보",color:"#2D8A52"},
              {icon:Zap,title:"무료 프로모션",desc:"6개월 등록비 무료 + 프리미엄 3건 무료 노출",color:"#E8A020"},
            ].map(b=>{const Icon=b.icon;return(
              <div key={b.title} style={{background:"white",borderRadius:20,padding:"28px 24px"}}>
                <Icon size={28} color={b.color} style={{marginBottom:12}}/>
                <h3 style={{fontSize:18,fontWeight:800,marginBottom:6}}>{b.title}</h3>
                <p style={{fontSize:13,color:"#888",lineHeight:1.7}}>{b.desc}</p>
              </div>
            );})}
          </div>

          <div style={{background:"white",borderRadius:20,padding:"32px 28px",marginBottom:32}}>
            <h3 style={{fontSize:20,fontWeight:800,marginBottom:16}}>입점 조건</h3>
            {["자동차매매업 사업자등록증 보유","자동차매매업 종사원증 보유","광주 지역 사업장 운영","직접 방문 검증 동의"].map((item,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",borderBottom:i<3?"1px solid #F0EEE9":"none"}}>
                <CheckCircle size={18} color="#2D8A52"/><span style={{fontSize:14,fontWeight:600}}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{background:"#1A1A1A",borderRadius:20,padding:"32px 28px",textAlign:"center",color:"white"}}>
            <h3 style={{fontSize:22,fontWeight:800,marginBottom:8}}>지금 바로 입점 문의하세요</h3>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.5)",marginBottom:20}}>전화 한 통이면 끝! 3일 이내 방문 검증 후 입점 완료</p>
            <a href="tel:010-0000-0000"><button style={{padding:"16px 36px",background:"#FF3B1E",color:"white",border:"none",borderRadius:100,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}><Phone size={16} style={{verticalAlign:"middle",marginRight:8}}/>010-0000-0000</button></a>
          </div>
        </div>
      </div>
    </>
  );
}
