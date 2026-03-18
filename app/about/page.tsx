"use client";
import Navbar from "@/components/Navbar";
import { Shield, Lock, Star, MapPin } from "lucide-react";
export default function AboutPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#FF3B1E",padding:"80px 52px",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}><div style={{fontFamily:"'Bebas Neue',serif",fontSize:"200px",color:"rgba(255,255,255,0.06)"}}>FIXCAR</div></div>
          <div style={{position:"relative",zIndex:1}}>
            <h1 style={{fontSize:"clamp(32px,6vw,64px)",fontWeight:800,color:"white",letterSpacing:"-2px",marginBottom:"14px"}}>나, 이 차로 픽했어</h1>
            <p style={{fontSize:"17px",color:"rgba(255,255,255,0.8)",lineHeight:1.8,maxWidth:"560px",margin:"0 auto",fontWeight:400}}>광주 중고차 시장의 불투명한 가격 관행을 바꾸기 위해 태어난 FIX 정찰제 플랫폼</p>
          </div>
        </div>
        <div style={{maxWidth:"860px",margin:"0 auto",padding:"60px 32px 80px"}}>
          <div style={{background:"white",borderRadius:"20px",padding:"36px 40px",marginBottom:"20px"}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF3B1E",marginBottom:"12px"}}>VISION</div>
            <h2 style={{fontSize:"26px",fontWeight:800,letterSpacing:"-1px",marginBottom:"14px"}}>중고차 구매, 더 이상 두렵지 않게</h2>
            <p style={{fontSize:"15px",color:"#555",lineHeight:1.9,fontWeight:400}}>중고차 시장의 가장 큰 문제는 '정보 비대칭'이에요. 딜러는 알고 있지만 고객은 모르는 것들. 픽스카는 이 구조를 바꿉니다.<br/><br/>모든 매물에 <strong style={{fontWeight:800,color:"#FF3B1E"}}>FIX 정찰가</strong>를 적용해 표시 가격이 곧 최종 가격이에요. 가격 흥정 없이, 투명하게, 믿고 살 수 있는 중고차 플랫폼을 만들어가고 있어요.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px",marginBottom:"20px"}}>
            {[{icon:<Lock size={26} color="#FF3B1E"/>,title:"FIX 정찰가",desc:"표시 가격 = 최종 가격. 흥정 없음, 바가지 없음."},{icon:<Shield size={26} color="#1847FF"/>,title:"100항목 검수",desc:"전문 정비사가 직접 점검한 매물만 등록."},{icon:<Star size={26} color="#2D8A52"/>,title:"3일 환불 보장",desc:"구매 후 3일 이내 이유 불문 100% 환불."},{icon:<MapPin size={26} color="#E8A020"/>,title:"광주 지역 특화",desc:"광주·전남 지역 중고차 1위를 목표로."}].map(i=>(
              <div key={i.title} style={{background:"white",borderRadius:"18px",padding:"22px"}}>
                <div style={{marginBottom:"10px"}}>{i.icon}</div>
                <div style={{fontSize:"16px",fontWeight:800,marginBottom:"5px"}}>{i.title}</div>
                <div style={{fontSize:"13px",color:"#888",lineHeight:1.7,fontWeight:400}}>{i.desc}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#1A1A1A",borderRadius:"20px",padding:"28px 32px",color:"white"}}>
            <div style={{fontSize:"11px",fontWeight:800,letterSpacing:"3px",color:"rgba(255,255,255,0.4)",marginBottom:"16px"}}>COMPANY INFO</div>
            {[["서비스명","픽스카 FIXCAR"],["URL","fixcar.kr"],["지역","광주광역시"],["이메일","contact@fixcar.kr"],["런칭","2026년 3월"]].map(([k,v])=>(
              <div key={k as string} style={{display:"flex",gap:"20px",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <span style={{fontSize:"13px",color:"rgba(255,255,255,0.4)",minWidth:"70px",fontWeight:400}}>{k}</span>
                <span style={{fontSize:"13px",fontWeight:700}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
