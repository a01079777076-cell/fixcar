"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { CheckCircle, ChevronRight, AlertTriangle, Star } from "lucide-react";

const STEPS = [
  { num:"01", title:"예산 설정", icon:"💰", content:"총 예산의 70~80%를 차량 구매에, 나머지를 보험·세금·유지비로 배분해요.\n\n• 취득세: 차량가의 7% (경차 4%)\n• 자동차세: 배기량별 연 10~100만원\n• 자동차보험: 연령·차종별 연 50~200만원\n• 월 유지비 (유류비+소모품): 월 15~30만원", tips:["신차 할부보다 중고차 일시불이 장기적으로 유리","경차·소형차는 세금·보험료 모두 저렴","연비 1km/ℓ 차이가 연간 30~50만원 차이"] },
  { num:"02", title:"차종 선택", icon:"🚗", content:"용도에 맞는 차종을 먼저 정하세요.\n\n• 혼자/커플: 준중형 세단 (아반떼·K3)\n• 가족용: 중형 세단·SUV (쏘나타·K5·투싼·스포티지)\n• 출퇴근 주력: 연비 좋은 하이브리드 (쏘나타HEV·K5HEV)\n• 짐이 많다면: SUV·RV (싼타페·쏘렌토·카니발)\n• 주차 걱정: 경차·소형SUV (레이·모닝·베뉴)", tips:["SUV는 세단보다 연비 15~20% 낮음","하이브리드는 도심 주행일수록 효과적","7인승 이상은 보험료 할인 가능"] },
  { num:"03", title:"연식·주행거리 확인", icon:"📅", content:"일반적으로 연식 1년당 가치 하락은 10~15%예요.\n\n• 3년 이내: 상태 양호, 신차와 큰 차이 없음\n• 3~5년: 가성비 최고 구간, 주요 소모품 교체 시기\n• 5~7년: 가격 많이 저렴, 정비 이력 꼭 확인\n• 7년 이상: 비용 리스크 있음, 실수요자용\n\n주행거리는 연간 15,000~20,000km가 평균이에요.", tips:["연식보다 관리 상태가 더 중요","주행거리보다 정기점검 이력이 신뢰도 좌우","단거리 반복 주행이 장거리보다 엔진 더 혹사"] },
  { num:"04", title:"사고 이력 확인", icon:"🔍", content:"중고차 구매 전 사고 이력 확인은 필수예요.\n\n보험개발원 조회로 확인 가능한 것:\n• 사고 건수 및 수리 금액\n• 침수 이력\n• 주행거리 조작 여부\n• 소유자 변경 횟수\n\n❌ 사고 이력 없어도 자기 부담금 수리는 기록 안 됨\n→ 반드시 육안 확인 + 성능점검기록부 대조", tips:["패널 두께 측정기로 도색 이력 확인","하체 바닥면 녹·용접 흔적 체크","엔진룸 실링 색깔 차이로 교체 부위 파악"] },
  { num:"05", title:"시운전·실차 확인", icon:"🏎️", content:"절대 사진만 보고 구매하지 마세요!\n\n시운전 체크리스트:\n• 냉간 시동 시 이상 소음 없는지\n• 변속 시 충격·떨림 없는지\n• 브레이크 밀림·진동 없는지\n• 에어컨·히터 정상 작동 여부\n• 전기 장비 (창문·미러·시트) 전체 작동\n• 고속도로 직진 안정성 확인", tips:["비 오는 날 방수 테스트도 좋음","선루프 개폐 직접 해보기","후방카메라·주차보조 작동 확인"] },
  { num:"06", title:"FIX 가격으로 계약", icon:"🔒", content:"픽스카에서는 표시 가격 = 최종 가격이에요.\n\n계약 시 챙겨야 할 것:\n• 매매계약서 내용 꼼꼼히 확인\n• 성능점검기록부 원본 받기\n• 사고 이력 조회 결과 확인\n• 계약금 영수증 보관\n• 잔금 납부 일정 확인\n\n계약 후 3일 이내 환불 가능해요 (픽스카 보장)", tips:["계약서에 '구두 약속' 내용도 기재 요청","잔금 납부 전 차량 다시 한번 확인","명의이전 완료까지 보험 처리 확인"] },
];

export default function GuidePage() {
  const [active, setActive] = useState(0);
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} @media(max-width:900px){.guide-grid{grid-template-columns:1fr!important;}}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#1A1A1A",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"1100px",margin:"0 auto"}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF7A63",marginBottom:"10px"}}>GUIDE</div>
            <h1 style={{fontSize:"clamp(22px,4vw,42px)",fontWeight:800,color:"white",letterSpacing:"-1px",marginBottom:"6px"}}>중고차 구매 가이드 A~Z</h1>
            <p style={{fontSize:"14px",color:"rgba(255,255,255,0.4)",fontWeight:400}}>처음 중고차를 사는 분도 이것만 알면 충분해요</p>
          </div>
        </div>
        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"24px 32px 80px"}}>
          <div className="guide-grid" style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:"20px",alignItems:"start"}}>
            <div style={{background:"white",borderRadius:"18px",overflow:"hidden",position:"sticky",top:"84px"}}>
              {STEPS.map((s,i)=>(
                <button key={i} onClick={()=>setActive(i)} style={{width:"100%",padding:"14px 16px",border:"none",textAlign:"left",background:active===i?"#EEF2FF":"white",borderBottom:"1px solid #F0EEE9",cursor:"pointer",display:"flex",alignItems:"center",gap:"10px"}}>
                  <div style={{width:"28px",height:"28px",borderRadius:"50%",background:active===i?"#1847FF":"#F0EEE9",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:"11px",fontWeight:800,color:active===i?"white":"#888"}}>{s.num}</span>
                  </div>
                  <span style={{fontSize:"14px",fontWeight:active===i?800:600,color:active===i?"#1847FF":"#555"}}>{s.title}</span>
                </button>
              ))}
            </div>
            <div style={{background:"white",borderRadius:"18px",padding:"28px 32px"}}>
              <div style={{fontSize:"40px",marginBottom:"14px"}}>{STEPS[active].icon}</div>
              <div style={{fontSize:"11px",fontWeight:800,color:"#FF3B1E",letterSpacing:"2px",marginBottom:"8px"}}>STEP {STEPS[active].num}</div>
              <h2 style={{fontSize:"26px",fontWeight:800,letterSpacing:"-0.5px",marginBottom:"20px"}}>{STEPS[active].title}</h2>
              <div style={{fontSize:"14px",color:"#555",lineHeight:1.9,fontWeight:400,marginBottom:"24px",whiteSpace:"pre-line"}}>{STEPS[active].content}</div>
              <div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:"12px",padding:"16px 18px"}}>
                <div style={{fontSize:"13px",fontWeight:800,color:"#2D8A52",marginBottom:"10px",display:"flex",alignItems:"center",gap:"6px"}}><Star size={14}/> 픽스카 꿀팁</div>
                {STEPS[active].tips.map((t,i)=>(
                  <div key={i} style={{fontSize:"13px",color:"#555",padding:"5px 0",display:"flex",gap:"8px",fontWeight:400}}>
                    <CheckCircle size={14} color="#2D8A52" style={{flexShrink:0,marginTop:"2px"}}/>{t}
                  </div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:"20px"}}>
                <button onClick={()=>setActive(Math.max(0,active-1))} disabled={active===0} style={{background:active===0?"#F0EEE9":"white",color:active===0?"#CCC":"#1A1A1A",border:`1.5px solid ${active===0?"#E0DDD7":"#1A1A1A"}`,padding:"11px 22px",borderRadius:"10px",fontSize:"14px",fontWeight:700,cursor:active===0?"default":"pointer"}}>← 이전</button>
                {active < STEPS.length-1 ? (
                  <button onClick={()=>setActive(active+1)} style={{background:"#FF3B1E",color:"white",border:"none",padding:"11px 22px",borderRadius:"10px",fontSize:"14px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"}}>다음 단계 <ChevronRight size={16}/></button>
                ) : (
                  <a href="/cars"><button style={{background:"#FF3B1E",color:"white",border:"none",padding:"11px 22px",borderRadius:"10px",fontSize:"14px",fontWeight:800,cursor:"pointer"}}>매물 보러가기 →</button></a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
