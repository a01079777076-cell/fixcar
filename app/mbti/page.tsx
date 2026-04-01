// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/mbti/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { QUESTIONS, MBTI_TYPES, AXIS_INFO, MbtiType } from "@/data/car_mbti_data";
import { ArrowRight, ChevronRight, ChevronLeft, RotateCcw, Save, ChevronUp, ChevronDown, Lock } from "lucide-react";
import Link from "next/link";

function calcResult(scores: Record<string,number>): string {
  const d = (scores["DC"]||0) > 0 ? "D" : "C";
  const s = (scores["SL"]||0) > 0 ? "S" : "L";
  const e = (scores["EP"]||0) > 0 ? "E" : "P";
  const h = (scores["HT"]||0) > 0 ? "H" : "T";
  return d+s+e+h;
}

function getAxisPercentages(scores: Record<string,number>) {
  /* 각 축의 %, 최대 ±10 */
  return {
    DC: Math.min(100, Math.max(0, 50 + (scores["DC"]||0) * 5)),
    SL: Math.min(100, Math.max(0, 50 + (scores["SL"]||0) * 5)),
    EP: Math.min(100, Math.max(0, 50 + (scores["EP"]||0) * 5)),
    HT: Math.min(100, Math.max(0, 50 + (scores["HT"]||0) * 5)),
  };
}

export default function CarMbtiPage() {
  const [step, setStep] = useState(-1); /* -1=인트로, 0~14=질문, 15=결과 */
  const [scores, setScores] = useState<Record<string,number>>({ DC:0, SL:0, EP:0, HT:0 });
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<MbtiType|null>(null);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean|null>(null); /* null=확인중 */

  useEffect(() => {
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      setLoggedIn(!!d?.user?.id);
    }).catch(()=>setLoggedIn(false));
  }, []);

  const totalQ = QUESTIONS.length; /* 15문항 */

  const handleAnswer = (qIdx: number, optIdx: number) => {
    const q = QUESTIONS[qIdx];
    const score = q.options[optIdx].score;
    const newScores = { ...scores, [q.axis]: (scores[q.axis]||0) + score };
    setScores(newScores);
    setAnswers([...answers, optIdx]);

    if (qIdx === totalQ - 1) {
      const code = calcResult(newScores);
      const type = MBTI_TYPES[code] || MBTI_TYPES["CSET"];
      setResult(type);
      /* 초기 우선순위: 점수 절대값 높은 순 */
      const axes = ["DC","SL","EP","HT"];
      const sorted = [...axes].sort((a,b) => Math.abs(newScores[b]||0) - Math.abs(newScores[a]||0));
      setPriorities(sorted);
      setStep(totalQ);
    } else {
      setStep(qIdx + 1);
    }
  };

  const handleBack = () => {
    if (step <= 0) return;
    const prevStep = step - 1;
    const prevQ = QUESTIONS[prevStep];
    const prevAnswer = answers[prevStep];
    const prevScore = prevQ.options[prevAnswer].score;
    /* 이전 점수 되돌리기 */
    const newScores = { ...scores, [prevQ.axis]: (scores[prevQ.axis]||0) - prevScore };
    setScores(newScores);
    setAnswers(answers.slice(0, -1));
    setStep(prevStep);
  };

  const movePriority = (idx: number, dir: -1|1) => {
    const newP = [...priorities];
    const target = idx + dir;
    if (target < 0 || target >= newP.length) return;
    [newP[idx], newP[target]] = [newP[target], newP[idx]];
    setPriorities(newP);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/mbti/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: result?.code, priorities, scores }),
      });
      setSaved(true);
      setTimeout(()=>setSaved(false), 3000);
    } catch {}
    setSaving(false);
  };

  const reset = () => {
    setStep(-1); setScores({DC:0,SL:0,EP:0,HT:0}); setAnswers([]); setResult(null); setPriorities([]); setSaved(false);
  };

  const pct = getAxisPercentages(scores);

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        .opt-btn{background:white;border:2px solid #E0DDD7;border-radius:16px;padding:18px 22px;cursor:pointer;transition:all 0.2s;text-align:left;width:100%;font-family:'NanumSquareRound',sans-serif;}
        .opt-btn:hover{border-color:#FF3B1E;background:#FFF8F6;transform:translateY(-2px);box-shadow:0 4px 16px rgba(255,59,30,0.1);}
        .opt-btn:active{transform:translateY(0);}
        .axis-bar{height:8px;border-radius:4px;background:#E8E6E1;overflow:hidden;position:relative;}
      `}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>

        {/* ═══ 인트로 ═══ */}
        {step===-1&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#FF5A3C,#E8290F)",padding:"60px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:"-20px",bottom:"-40px",fontFamily:"'Bebas Neue',serif",fontSize:"clamp(100px,20vw,200px)",color:"rgba(255,255,255,0.15)",lineHeight:1}}>MBTI</div>
              <div style={{position:"relative",zIndex:1}}>
                <div style={{fontSize:48,marginBottom:16}}>🚗</div>
                <h1 style={{fontSize:"clamp(24px,5vw,40px)",fontWeight:800,color:"white",marginBottom:12,wordBreak:"keep-all"}}>나의 차량 MBTI는?</h1>
                <p style={{fontSize:15,color:"rgba(255,255,255,0.8)",fontWeight:400,lineHeight:1.8}}>내가 무슨 차 있는지도 잘 모른다!<br/>나에게 맞는 차 유형 찾기</p>
              </div>
            </div>
            <div style={{maxWidth:600,margin:"0 auto",padding:"32px 24px 80px"}}>
              {/* 4축 소개 */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:28}}>
                {(["DC","SL","EP","HT"] as const).map(axis=>{
                  const info = AXIS_INFO[axis];
                  return (
                    <div key={axis} style={{background:"white",borderRadius:16,padding:"20px 18px",textAlign:"center"}}>
                      <div style={{fontSize:28,marginBottom:8}}>{info.leftEmoji} vs {info.rightEmoji}</div>
                      <div style={{fontSize:13,fontWeight:800,marginBottom:4}}>{info.left} vs {info.right}</div>
                      <div style={{fontSize:11,color:"#AAA"}}>{info.leftDesc} vs {info.rightDesc}</div>
                    </div>
                  );
                })}
              </div>
              {loggedIn === null ? (
                <div style={{textAlign:"center",padding:"20px",color:"#CCC"}}>확인 중...</div>
              ) : loggedIn ? (
                <>
                  <button onClick={()=>setStep(0)} style={{width:"100%",padding:"18px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:18,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    테스트 시작하기 <ArrowRight size={20}/>
                  </button>
                  <p style={{textAlign:"center",fontSize:12,color:"#CCC",marginTop:12}}>약 2~3분 소요 · 총 15문항</p>
                </>
              ) : (
                <div style={{textAlign:"center"}}>
                  <div style={{background:"#F8F7F4",borderRadius:16,padding:"28px 24px",marginBottom:14}}>
                    <Lock size={32} color="#CCC" style={{marginBottom:12}} />
                    <div style={{fontSize:16,fontWeight:800,marginBottom:6}}>로그인 후 이용할 수 있어요</div>
                    <p style={{fontSize:13,color:"#AAA"}}>결과를 저장하고 맞춤 차량 추천을 받으려면<br/>로그인이 필요합니다</p>
                  </div>
                  <Link href="/login">
                    <button style={{width:"100%",padding:"18px",background:"#1A1A1A",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                      로그인하고 시작하기
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ 질문 ═══ */}
        {step>=0&&step<totalQ&&(
          <div style={{maxWidth:640,margin:"0 auto",padding:"28px 24px 80px"}}>
            {/* 진행 바 */}
            <div style={{height:6,background:"#E0DDD7",borderRadius:3,marginBottom:20,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${((step+1)/totalQ)*100}%`,background:"linear-gradient(90deg,#FF5A3C,#E8290F)",transition:"width 0.4s",borderRadius:3}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                {step > 0 && (
                  <button onClick={handleBack} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:8,border:"1.5px solid #E0DDD7",background:"white",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                    <ChevronLeft size={14}/> 이전
                  </button>
                )}
                <span style={{fontSize:13,color:"#AAA"}}>{step+1} / {totalQ}</span>
              </div>
              <span style={{fontSize:12,color:"#CCC",background:"#F8F7F4",padding:"3px 10px",borderRadius:100}}>
                {AXIS_INFO[QUESTIONS[step].axis as keyof typeof AXIS_INFO].left} vs {AXIS_INFO[QUESTIONS[step].axis as keyof typeof AXIS_INFO].right}
              </span>
            </div>

            <h2 style={{fontSize:"clamp(20px,4vw,26px)",fontWeight:800,letterSpacing:"-0.5px",marginBottom:24,lineHeight:1.4,wordBreak:"keep-all"}}>
              {QUESTIONS[step].question}
            </h2>

            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {QUESTIONS[step].options.map((opt,i)=>(
                <button key={i} className="opt-btn" onClick={()=>handleAnswer(step,i)}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:32,height:32,borderRadius:10,background:"#F8F7F4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#AAA",flexShrink:0}}>
                      {["A","B","C","D"][i]}
                    </div>
                    <span style={{fontSize:15,fontWeight:600,color:"#333"}}>{opt.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ 결과 ═══ */}
        {step===totalQ&&result&&(
          <div style={{maxWidth:640,margin:"0 auto",padding:"28px 24px 80px"}}>
            {/* 결과 카드 */}
            <div style={{background:`linear-gradient(135deg, ${result.color}dd, ${result.color})`,borderRadius:24,padding:"36px 28px",textAlign:"center",color:"white",marginBottom:20,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:-10,bottom:-20,fontFamily:"'Bebas Neue',serif",fontSize:"clamp(80px,15vw,140px)",color:"rgba(255,255,255,0.15)",lineHeight:1}}>{result.code}</div>
              <div style={{position:"relative",zIndex:1}}>
                <div style={{fontSize:12,fontWeight:700,letterSpacing:3,opacity:0.8,marginBottom:12}}>YOUR CAR MBTI</div>
                <div style={{fontSize:56,marginBottom:12}}>{result.emoji}</div>
                <div style={{fontFamily:"'Bebas Neue',serif",fontSize:36,letterSpacing:4,marginBottom:8}}>{result.code}</div>
                <h2 style={{fontSize:24,fontWeight:800,marginBottom:6}}>{result.name}</h2>
                <p style={{fontSize:14,opacity:0.85,fontWeight:400}}>{result.subtitle}</p>
                <div style={{marginTop:12,background:"rgba(255,255,255,0.15)",borderRadius:100,padding:"8px 18px",display:"inline-block",fontSize:13,fontWeight:700}}>💬 {result.vibe}</div>
              </div>
            </div>

            {/* 설명 */}
            <div style={{background:"white",borderRadius:18,padding:"24px 26px",marginBottom:16}}>
              <p style={{fontSize:15,color:"#444",lineHeight:1.9,fontWeight:400}}>{result.desc}</p>
            </div>

            {/* 4축 분석 */}
            <div style={{background:"white",borderRadius:18,padding:"24px 26px",marginBottom:16}}>
              <h3 style={{fontSize:16,fontWeight:800,marginBottom:16}}>📊 나의 성향 분석</h3>
              {(["DC","SL","EP","HT"] as const).map(axis=>{
                const info = AXIS_INFO[axis];
                const p = pct[axis];
                return (
                  <div key={axis} style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}>
                      <span style={{fontWeight:700,color:p>=50?"#FF3B1E":"#AAA"}}>{info.leftEmoji} {info.left}</span>
                      <span style={{fontWeight:700,color:p<50?"#1847FF":"#AAA"}}>{info.right} {info.rightEmoji}</span>
                    </div>
                    <div className="axis-bar">
                      <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${p}%`,background:"linear-gradient(90deg,#FF5A3C,#FF8A70)",borderRadius:4,transition:"width 0.5s"}}/>
                    </div>
                    <div style={{textAlign:"center",fontSize:11,color:"#CCC",marginTop:4}}>
                      {p>=50?info.leftDesc:info.rightDesc} ({p>=50?p:100-p}%)
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 추천 차량 */}
            <div style={{background:"white",borderRadius:18,padding:"24px 26px",marginBottom:16}}>
              <h3 style={{fontSize:16,fontWeight:800,marginBottom:14}}>🚗 추천 차량</h3>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {result.cars.map(car=>(
                  <span key={car} style={{background:"#EEF2FF",color:"#1847FF",padding:"8px 16px",borderRadius:100,fontSize:13,fontWeight:700}}>{car}</span>
                ))}
              </div>
            </div>

            {/* 보너스 태그 */}
            <div style={{background:"white",borderRadius:18,padding:"24px 26px",marginBottom:16}}>
              <h3 style={{fontSize:16,fontWeight:800,marginBottom:14}}>🏷️ 보너스 태그</h3>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {result.tags.map(tag=>(
                  <span key={tag} style={{background:"#F8F7F4",color:"#888",padding:"8px 14px",borderRadius:100,fontSize:13,fontWeight:600}}>{tag}</span>
                ))}
              </div>
            </div>

            {/* 우선순위 수정 */}
            <div style={{background:"white",borderRadius:18,padding:"24px 26px",marginBottom:16}}>
              <h3 style={{fontSize:16,fontWeight:800,marginBottom:6}}>⚙️ 나의 우선순위</h3>
              <p style={{fontSize:12,color:"#AAA",marginBottom:14}}>차량 추천 시 중요하게 볼 순서예요. 순서를 바꿔도 MBTI 결과({result.code})는 변하지 않아요!</p>
              {priorities.map((axis,i)=>{
                const info = AXIS_INFO[axis as keyof typeof AXIS_INFO];
                const p = pct[axis as keyof typeof pct];
                return (
                  <div key={axis} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:i===0?"#FFF0ED":"#F8F7F4",borderRadius:12,marginBottom:8,border:i===0?"2px solid #FF3B1E":"1.5px solid transparent"}}>
                    <div style={{fontSize:16,fontWeight:800,color:i===0?"#FF3B1E":"#CCC",width:24,textAlign:"center"}}>{i+1}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:700}}>{info.leftEmoji} {p>=50?info.left:info.right}</div>
                      <div style={{fontSize:11,color:"#AAA"}}>{p>=50?info.leftDesc:info.rightDesc}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:2}}>
                      <button onClick={()=>movePriority(i,-1)} disabled={i===0} style={{border:"none",background:i===0?"transparent":"#E8E6E1",borderRadius:6,width:28,height:22,display:"flex",alignItems:"center",justifyContent:"center",cursor:i===0?"default":"pointer",opacity:i===0?0.3:1}}><ChevronUp size={14}/></button>
                      <button onClick={()=>movePriority(i,1)} disabled={i===priorities.length-1} style={{border:"none",background:i===priorities.length-1?"transparent":"#E8E6E1",borderRadius:6,width:28,height:22,display:"flex",alignItems:"center",justifyContent:"center",cursor:i===priorities.length-1?"default":"pointer",opacity:i===priorities.length-1?0.3:1}}><ChevronDown size={14}/></button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 저장 + 다시하기 */}
            <div style={{display:"flex",gap:10}}>
              <button onClick={handleSave} disabled={saving||saved} style={{flex:2,padding:"16px",background:saved?"#2D8A52":saving?"#CCC":"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <Save size={18}/> {saved?"저장 완료!":saving?"저장 중...":"결과 저장하기"}
              </button>
              <button onClick={reset} style={{flex:1,padding:"16px",background:"white",color:"#888",border:"1.5px solid #E0DDD7",borderRadius:14,fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                <RotateCcw size={16}/> 다시
              </button>
            </div>

            {/* 매물 바로가기 */}
            <Link href="/cars">
              <div style={{background:"linear-gradient(135deg,#1847FF,#0A25B8)",borderRadius:18,padding:"20px 24px",marginTop:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:15,fontWeight:800,color:"white"}}>추천 매물 바로 보기</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>FIX 정찰가로 확인</div>
                </div>
                <ChevronRight size={20} color="white"/>
              </div>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
