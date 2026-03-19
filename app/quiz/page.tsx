"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ChevronRight, Zap, ArrowRight } from "lucide-react";

const QUESTIONS = [
  { id:1, q:"주로 어떤 용도로 사용하나요?", opts:["출퇴근·도심 위주","가족 여행·캠핑","드라이브·스포츠","배달·짐 운반"] },
  { id:2, q:"함께 탈 인원이 얼마나 되나요?", opts:["혼자 또는 1~2명","3~4명 (소가족)","5명 이상 (대가족)","7인 이상 필요"] },
  { id:3, q:"선호하는 예산 범위는?", opts:["1,000만원 이하","1,000~2,000만원","2,000~3,500만원","3,500만원 이상"] },
  { id:4, q:"연료 타입 선호도는?", opts:["가솔린 (저렴·경쾌)","디젤 (연비·힘)","하이브리드 (연비 최우선)","전기차 (미래지향)"] },
  { id:5, q:"차량 크기 선호도는?", opts:["경차·소형 (주차 걱정 없이)","준중형·중형 (밸런스)","대형·프리미엄","SUV/RV (공간 우선)"] },
  { id:6, q:"가장 중요시하는 것은?", opts:["연비·경제성","승차감·편안함","주행 성능·스포티","안전·편의사양"] },
];

const RECOMMENDATIONS: Record<string, { models:string[]; reason:string }> = {
  "economy": { models:["현대 아반떼","기아 K3","현대 캐스퍼"], reason:"연비 좋고 유지비 저렴한 경제적인 차를 추천해요." },
  "family": { models:["현대 싼타페","기아 쏘렌토","현대 팰리세이드"], reason:"가족 여행에 최적화된 공간과 안전성을 갖춘 차를 추천해요." },
  "sport": { models:["기아 K5","현대 아반떼 N Line","제네시스 G70"], reason:"운전의 재미와 스포티한 감성을 동시에 즐길 수 있어요." },
  "premium": { models:["제네시스 G80","기아 K8","제네시스 GV70"], reason:"프리미엄 감성과 최고의 편의사양을 원하는 분께 딱 맞아요." },
  "ev": { models:["현대 아이오닉5","기아 EV6","기아 EV9"], reason:"친환경 전기차로 유지비를 크게 절감할 수 있어요." },
  "suv": { models:["기아 스포티지","현대 투싼","기아 셀토스"], reason:"도심과 아웃도어 모두 활용 가능한 실용적인 SUV예요." },
};

function getRecommendation(answers: number[]): { models:string[]; reason:string } {
  const usage = answers[0];
  const budget = answers[2];
  const fuel = answers[3];
  const size = answers[4];

  if (fuel === 3) return RECOMMENDATIONS.ev;
  if (budget === 3 || size === 2) return RECOMMENDATIONS.premium;
  if (usage === 1 || size === 3) return RECOMMENDATIONS.family;
  if (usage === 2) return RECOMMENDATIONS.sport;
  if (size === 0) return RECOMMENDATIONS.economy;
  if (size === 3) return RECOMMENDATIONS.suv;
  return RECOMMENDATIONS.economy;
}

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ models:string[]; reason:string }|null>(null);
  const [matchedCars, setMatchedCars] = useState<{id:number;name:string;price:number;fuel:string;mileage:number}[]>([]);

  const handleAnswer = async (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (step === QUESTIONS.length - 1) {
      const rec = getRecommendation(newAnswers);
      setResult(rec);
      // DB에서 추천 차량 조회
      try {
        const res = await fetch(`/api/cars?brands=${rec.models.map(m=>m.split(" ")[0]).join(",")}&limit=6`);
        const data = await res.json();
        if (data.success) setMatchedCars(data.data);
      } catch {}
    } else {
      setStep(step + 1);
    }
  };

  const reset = () => { setStep(0); setAnswers([]); setResult(null); setMatchedCars([]); };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} .opt{background:white;border:2px solid #E0DDD7;border-radius:14px;padding:16px 20px;cursor:pointer;transition:all 0.15s;text-align:left;width:100%;font-family:'NanumSquareRound',sans-serif;} .opt:hover{border-color:#FF3B1E;background:#FFF8F6;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#1A1A1A",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"700px",margin:"0 auto"}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF7A63",marginBottom:"10px"}}>AI QUIZ</div>
            <h1 style={{fontSize:"clamp(22px,4vw,40px)",fontWeight:800,color:"white",letterSpacing:"-1px"}}>내 차 찾기 퀴즈</h1>
            <p style={{fontSize:"14px",color:"rgba(255,255,255,0.4)",marginTop:"6px",fontWeight:400}}>6개 질문으로 나에게 딱 맞는 차를 AI가 추천해드려요</p>
          </div>
        </div>

        <div style={{maxWidth:"700px",margin:"0 auto",padding:"32px 32px 80px"}}>
          {!result ? (
            <>
              {/* 진행 바 */}
              <div style={{height:"4px",background:"#E0DDD7",borderRadius:"2px",marginBottom:"28px",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(step/QUESTIONS.length)*100}%`,background:"#FF3B1E",transition:"width 0.4s",borderRadius:"2px"}}/>
              </div>
              <div style={{fontSize:"13px",color:"#AAA",fontWeight:400,marginBottom:"16px"}}>{step+1} / {QUESTIONS.length}</div>
              <h2 style={{fontSize:"clamp(20px,3vw,28px)",fontWeight:800,letterSpacing:"-0.5px",marginBottom:"24px",lineHeight:1.3}}>{QUESTIONS[step].q}</h2>
              <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                {QUESTIONS[step].opts.map((opt,i)=>(
                  <button key={i} className="opt" onClick={()=>handleAnswer(i)}>
                    <span style={{fontSize:"16px",fontWeight:700}}>{opt}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div>
              <div style={{background:"white",borderRadius:"20px",padding:"28px 30px",marginBottom:"20px"}}>
                <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF3B1E",marginBottom:"12px"}}>AI 추천 결과</div>
                <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"16px"}}>
                  <div style={{fontSize:"40px"}}>🚗</div>
                  <div>
                    <h2 style={{fontSize:"22px",fontWeight:800,letterSpacing:"-0.5px",marginBottom:"4px"}}>추천 모델</h2>
                    <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                      {result.models.map(m=><span key={m} style={{background:"#EEF2FF",color:"#1847FF",padding:"4px 12px",borderRadius:"100px",fontSize:"13px",fontWeight:800}}>{m}</span>)}
                    </div>
                  </div>
                </div>
                <div style={{background:"#F8F6F2",borderRadius:"12px",padding:"14px 16px",fontSize:"14px",color:"#555",lineHeight:1.75,fontWeight:400}}>
                  💡 {result.reason}
                </div>
              </div>

              {/* 매칭된 실제 매물 */}
              {matchedCars.length > 0 ? (
                <div>
                  <h3 style={{fontSize:"18px",fontWeight:800,marginBottom:"14px"}}>픽스카 매물에서 찾은 차</h3>
                  <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"20px"}}>
                    {matchedCars.slice(0,3).map(c=>(
                      <a key={c.id} href={`/cars/${c.id}`}>
                        <div style={{background:"white",borderRadius:"14px",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontSize:"15px",fontWeight:800}}>{c.name}</div>
                            <div style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{c.mileage?.toLocaleString()}km · {c.fuel}</div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                            <div style={{fontSize:"18px",fontWeight:800,color:"#FF3B1E"}}>{c.price?.toLocaleString()}<span style={{fontSize:"11px",color:"#AAA"}}>만</span></div>
                            <ArrowRight size={14} color="#CCC"/>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{background:"#EEF2FF",borderRadius:"14px",padding:"16px 20px",marginBottom:"20px",fontSize:"14px",color:"#1847FF",fontWeight:400}}>
                  💡 추천 차량의 픽스카 매물을 아래서 직접 검색해보세요!
                </div>
              )}

              <div style={{display:"flex",gap:"10px"}}>
                <a href="/cars" style={{flex:2}}><button style={{width:"100%",background:"#FF3B1E",color:"white",border:"none",padding:"15px",borderRadius:"12px",fontSize:"15px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"7px"}}>매물 전체 보기 <ChevronRight size={16}/></button></a>
                <button onClick={reset} style={{flex:1,background:"#F0EEE9",color:"#555",border:"none",padding:"15px",borderRadius:"12px",fontSize:"14px",fontWeight:700,cursor:"pointer"}}>다시 하기</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
