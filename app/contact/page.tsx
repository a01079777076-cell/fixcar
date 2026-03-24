"use client";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Phone, Mail, Clock, ChevronDown, MessageSquare, HelpCircle } from "lucide-react";

const FAQ = [
  {q:"픽스카 FIX 정찰가란?",a:"판매 가격이 고정(FIX)되어 있어 흥정 없이 투명하게 구매할 수 있는 시스템입니다. 모든 매물은 시세 분석을 거쳐 합리적인 가격이 책정됩니다."},
  {q:"차량 구매 절차가 어떻게 되나요?",a:"매물 선택 → 문의/시승 예약 → 차량 확인 → 계약/결제 → 이전등록 → 탁송/인수 순서로 진행됩니다. 전 과정을 픽스카에서 도와드립니다."},
  {q:"할부 구매가 가능한가요?",a:"네! 카카오페이, 토스페이 등 다양한 결제 수단을 지원하며, 캐피탈 할부도 연결해드립니다. 최대 72개월까지 가능합니다."},
  {q:"환불/반품이 가능한가요?",a:"차량 인수 후 3일 이내 중대한 하자 발견 시 반품이 가능합니다. 자세한 내용은 이용약관을 참고해주세요."},
  {q:"딜러 입점은 어떻게 하나요?",a:"딜러 모집 페이지에서 신청하시거나, 고객센터로 연락해주세요. 사업자등록증과 종사원증이 필요합니다."},
  {q:"매물 사진은 실제 차량인가요?",a:"네, 모든 매물 사진은 실차 촬영 사진입니다. 허위 매물은 즉시 삭제되며 해당 딜러는 제재를 받습니다."},
  {q:"시승은 어떻게 예약하나요?",a:"매물 상세 페이지에서 '문의하기' 버튼을 눌러 시승 희망 일시를 알려주시면, 딜러가 확인 후 안내드립니다."},
  {q:"이전등록(명의변경)도 대행해주나요?",a:"네, 픽스카 제휴 대행업체를 통해 이전등록을 도와드립니다. 비용은 별도이며 상세 안내는 계약 시 받으실 수 있습니다."},
];

export default function ContactPage() {
  const [openIdx, setOpenIdx] = useState<number|null>(null);

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"#1A1A1A",padding:"44px 24px 36px"}}>
          <div style={{maxWidth:800,margin:"0 auto"}}><h1 style={{fontSize:28,fontWeight:800,color:"white"}}>📞 고객센터</h1></div>
        </div>
        <div style={{maxWidth:800,margin:"0 auto",padding:"24px 20px 100px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:32}}>
            {[{icon:Phone,label:"전화",value:"010-0000-0000",color:"#FF3B1E"},{icon:Mail,label:"이메일",value:"help@fixcar.kr",color:"#1847FF"},{icon:Clock,label:"운영시간",value:"매일 9:00~21:00",color:"#2D8A52"}].map(c=>{const Icon=c.icon;return(
              <div key={c.label} style={{background:"white",borderRadius:18,padding:"24px 18px",textAlign:"center"}}>
                <Icon size={24} color={c.color} style={{marginBottom:8}}/><div style={{fontSize:11,color:"#AAA",marginBottom:4}}>{c.label}</div><div style={{fontSize:14,fontWeight:800}}>{c.value}</div>
              </div>
            );})}
          </div>

          <h2 style={{fontSize:20,fontWeight:800,marginBottom:16,display:"flex",alignItems:"center",gap:8}}><HelpCircle size={20} color="#E8A020"/>자주 묻는 질문 (FAQ)</h2>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {FAQ.map((faq,i)=>(
              <div key={i} style={{background:"white",borderRadius:14,overflow:"hidden"}}>
                <button onClick={()=>setOpenIdx(openIdx===i?null:i)} style={{width:"100%",padding:"18px 22px",border:"none",background:"transparent",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",textAlign:"left"}}>
                  <span style={{fontSize:14,fontWeight:700}}><span style={{color:"#FF3B1E",marginRight:8}}>Q.</span>{faq.q}</span>
                  <ChevronDown size={16} color="#CCC" style={{transform:openIdx===i?"rotate(180deg)":"none",transition:"0.2s",flexShrink:0}}/>
                </button>
                {openIdx===i&&<div style={{padding:"0 22px 18px",fontSize:14,color:"#666",lineHeight:1.8,borderTop:"1px solid #F0EEE9",paddingTop:14}}><span style={{color:"#1847FF",fontWeight:800,marginRight:8}}>A.</span>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
