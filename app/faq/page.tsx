"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ChevronRight } from "lucide-react";

const FAQS = [
  {cat:"구매",q:"FIX 정찰가란 무엇인가요?",a:"표시된 가격이 그대로 최종 가격이에요. 흥정, 바가지, 숨겨진 수수료 없이 투명하게 거래해요. '이 가격에 살게요' 하면 바로 계약 가능해요."},
  {cat:"구매",q:"계약금은 얼마인가요?",a:"차량 가격의 10%를 계약금으로 납부해요. 카카오페이, 토스, 신용카드 모두 가능해요."},
  {cat:"구매",q:"구매 후 마음이 바뀌면 환불되나요?",a:"계약 후 3일 이내에는 이유 불문 100% 환불 보장해요. 단, 차량 인도 후에는 차량 하자가 있을 경우에만 환불 가능해요."},
  {cat:"구매",q:"차량 검수는 어떻게 하나요?",a:"100개 항목 점검표를 기반으로 전문 정비사가 직접 점검해요. 엔진·미션·하체·전기·외관·내관 전 영역을 확인해요."},
  {cat:"구매",q:"탁송(배달)도 되나요?",a:"광주·전남 지역 내 탁송 서비스를 제공해요. 탁송비는 거리에 따라 별도 협의해요."},
  {cat:"매물",q:"매물 사진이 실제와 다를 수 있나요?",a:"모든 사진은 실제 차량을 직접 촬영한 것이에요. 사진과 다른 경우 전액 환불 처리해요."},
  {cat:"매물",q:"사고 이력은 어떻게 확인하나요?",a:"보험개발원 사고이력 조회 결과를 매물 상세 페이지에 공개해요. 딜러가 직접 고지하는 것이 원칙이에요."},
  {cat:"매물",q:"차량 번호로 조회할 수 있나요?",a:"차량번호 입력 시 국토교통부 데이터를 통해 기본 정보를 확인할 수 있어요. (서비스 예정)"},
  {cat:"딜러",q:"딜러로 가입하려면 어떻게 하나요?",a:"딜러 신청 페이지에서 상호명, 사원증 번호, 연락처를 입력해 신청해요. 관리자 검토 후 24시간 내 승인 여부를 알려드려요."},
  {cat:"딜러",q:"딜러 매물 등록은 무료인가요?",a:"현재 베타 서비스 기간 중에는 무료로 운영해요. 추후 프리미엄 플랜 도입 예정이에요."},
  {cat:"계정",q:"카카오 로그인과 픽스카 아이디를 같이 쓸 수 있나요?",a:"네! 동일 이메일로 가입한 경우 자동으로 통합계정으로 묶여요. 카카오 로그인을 연동하면 매물 알림을 카카오톡으로 받을 수 있어요."},
  {cat:"계정",q:"회원 탈퇴는 어떻게 하나요?",a:"마이페이지 → 설정 → 회원 탈퇴에서 진행할 수 있어요. 탈퇴 후 30일간 데이터가 보관되며 이후 삭제돼요."},
];

export default function FAQPage() {
  const [open, setOpen] = useState<number|null>(null);
  const [cat, setCat] = useState("전체");
  const cats = ["전체",...Array.from(new Set(FAQS.map(f=>f.cat)))];
  const filtered = cat==="전체" ? FAQS : FAQS.filter(f=>f.cat===cat);
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} .row{background:white;border-radius:14px;overflow:hidden;transition:box-shadow 0.15s;} .row:hover{box-shadow:0 4px 14px rgba(0,0,0,0.07);}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#1A1A1A",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"800px",margin:"0 auto"}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF7A63",marginBottom:"10px"}}>FAQ</div>
            <h1 style={{fontSize:"clamp(24px,4vw,40px)",fontWeight:800,color:"white",letterSpacing:"-1px"}}>자주 묻는 질문</h1>
          </div>
        </div>
        <div style={{maxWidth:"800px",margin:"0 auto",padding:"24px 32px 80px"}}>
          <div style={{display:"flex",gap:"8px",marginBottom:"20px",flexWrap:"wrap"}}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{padding:"7px 16px",borderRadius:"100px",border:`1.5px solid ${cat===c?"#1A1A1A":"#E0DDD7"}`,background:cat===c?"#1A1A1A":"white",color:cat===c?"white":"#555",fontSize:"13px",fontWeight:700,cursor:"pointer"}}>{c}</button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {filtered.map((f,i)=>(
              <div key={i} className="row">
                <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",background:"none",border:"none",padding:"16px 18px",display:"flex",alignItems:"center",gap:"12px",cursor:"pointer",textAlign:"left"}}>
                  <span style={{background:"#EEF2FF",color:"#1847FF",padding:"2px 8px",borderRadius:"6px",fontSize:"11px",fontWeight:800,flexShrink:0}}>{f.cat}</span>
                  <span style={{flex:1,fontSize:"15px",fontWeight:700,color:"#1A1A1A"}}>{f.q}</span>
                  <ChevronRight size={16} color="#CCC" style={{flexShrink:0,transform:open===i?"rotate(90deg)":"none",transition:"transform 0.2s"}}/>
                </button>
                {open===i && (
                  <div style={{padding:"0 18px 16px",borderTop:"1px solid #F0EEE9"}}>
                    <p style={{fontSize:"14px",color:"#555",lineHeight:1.8,fontWeight:400,marginTop:"12px"}}>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{background:"white",borderRadius:"16px",padding:"20px 24px",marginTop:"20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"}}>
            <div>
              <div style={{fontSize:"15px",fontWeight:800,marginBottom:"4px"}}>궁금한 게 더 있나요?</div>
              <div style={{fontSize:"13px",color:"#888",fontWeight:400}}>직접 문의주시면 빠르게 답변해드릴게요</div>
            </div>
            <a href="/contact"><button style={{background:"#FF3B1E",color:"white",border:"none",padding:"12px 24px",borderRadius:"10px",fontSize:"14px",fontWeight:800,cursor:"pointer"}}>1:1 문의하기</button></a>
          </div>
        </div>
      </div>
    </>
  );
}
