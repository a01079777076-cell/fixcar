"use client";
import Navbar from "@/components/Navbar";
import { Calendar, Tag, Clock } from "lucide-react";

const EVENTS = [
  { id:1, title:"봄맞이 FIX 가격 특가전", desc:"아반떼·K5·투싼 선착순 10대 한정 특가", badge:"진행중", color:"#2D8A52", bg:"#EAF6EF", start:"2026.03.01", end:"2026.03.31", emoji:"🌸" },
  { id:2, title:"신규 회원 첫 구매 할인", desc:"가입 후 첫 계약금 결제 시 5만원 즉시 할인", badge:"상시", color:"#1847FF", bg:"#EEF2FF", start:"상시", end:"상시", emoji:"🎁" },
  { id:3, title:"자동차 지식배틀 1위 이벤트", desc:"스포츠카·럭셔리카 배틀 1위 인증 시 스타벅스 기프티콘", badge:"기간한정", color:"#FF3B1E", bg:"#FFF0ED", start:"2026.03.15", end:"2026.04.15", emoji:"🏆" },
  { id:4, title:"내 차 팔기 견적 이벤트", desc:"시세 조회 후 딜러 연결 시 주유상품권 1만원 증정", badge:"진행중", color:"#E8A020", bg:"#FFF8EC", start:"2026.03.10", end:"2026.04.10", emoji:"🚗" },
];

export default function EventsPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#FF3B1E",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"860px",margin:"0 auto"}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"rgba(255,255,255,0.7)",marginBottom:"10px"}}>EVENTS</div>
            <h1 style={{fontSize:"clamp(24px,4vw,44px)",fontWeight:800,color:"white",letterSpacing:"-1px"}}>이벤트</h1>
            <p style={{fontSize:"14px",color:"rgba(255,255,255,0.7)",marginTop:"6px",fontWeight:400}}>픽스카 진행 중인 이벤트 모음</p>
          </div>
        </div>
        <div style={{maxWidth:"860px",margin:"0 auto",padding:"28px 32px 80px",display:"flex",flexDirection:"column",gap:"16px"}}>
          {EVENTS.map(e=>(
            <div key={e.id} style={{background:"white",borderRadius:"20px",padding:"24px 28px",display:"flex",gap:"20px",alignItems:"flex-start"}}>
              <div style={{fontSize:"48px",flexShrink:0}}>{e.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px",flexWrap:"wrap"}}>
                  <span style={{background:e.bg,color:e.color,padding:"3px 12px",borderRadius:"100px",fontSize:"12px",fontWeight:800}}>{e.badge}</span>
                  {e.start!=="상시"&&<span style={{fontSize:"12px",color:"#AAA",display:"flex",alignItems:"center",gap:"4px",fontWeight:400}}><Clock size={12}/> {e.start} ~ {e.end}</span>}
                </div>
                <div style={{fontSize:"20px",fontWeight:800,marginBottom:"6px"}}>{e.title}</div>
                <div style={{fontSize:"14px",color:"#888",fontWeight:400,lineHeight:1.65}}>{e.desc}</div>
              </div>
            </div>
          ))}
          <div style={{background:"#EEF2FF",border:"1px solid #B8C8FF",borderRadius:"16px",padding:"16px 20px",fontSize:"13px",color:"#1847FF",fontWeight:400,lineHeight:1.75}}>
            📌 이벤트는 사전 공지 없이 종료될 수 있어요. 참여 전 기간을 꼭 확인해주세요.
          </div>
        </div>
      </div>
    </>
  );
}
