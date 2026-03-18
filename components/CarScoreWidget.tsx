"use client";
import { useState, useEffect } from "react";
import { Star, ThumbsUp, AlertCircle } from "lucide-react";

const CATEGORIES = ["외관", "실내", "주행성능", "연비", "편의사양", "가성비"];
const CATEGORY_DESC: Record<string, string> = {
  "외관": "디자인·색상·마감 품질",
  "실내": "실내 공간·소재·분위기",
  "주행성능": "승차감·핸들링·가속",
  "연비": "실제 연비 만족도",
  "편의사양": "편의 기능·옵션 만족도",
  "가성비": "가격 대비 전체 만족도",
};

interface ScoreData {
  avgScores: { category: string; avg: number; count: number }[];
  myScores: Record<string, number>;
  totalAvg: number;
  totalReviews: number;
}

export default function CarScoreWidget({ carId }: { carId: number }) {
  const [data, setData] = useState<ScoreData | null>(null);
  const [myScores, setMyScores] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then(r=>r.json()).then(d=>setLoggedIn(!!d.user));
    loadScores();
  }, [carId]);

  const loadScores = () => {
    fetch(`/api/cars/${carId}/score`)
      .then(r=>r.json())
      .then(d=>{ if(d.success){ setData(d.data); setMyScores(d.data.myScores||{}); } });
  };

  const handleSave = async () => {
    if (Object.keys(myScores).length === 0) { alert("최소 1개 이상 평가해주세요"); return; }
    setSaving(true);
    const res = await fetch(`/api/cars/${carId}/score`, {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ scores: myScores }),
    });
    const d = await res.json();
    if (d.success) { setSaved(true); setMode("view"); loadScores(); setTimeout(()=>setSaved(false),3000); }
    else alert(d.error);
    setSaving(false);
  };

  const renderStars = (score: number, size = 16) => (
    <div style={{display:"flex",gap:"2px"}}>
      {[1,2,3,4,5].map(i=>(
        <Star key={i} size={size} fill={i<=score?"#FF3B1E":"#E0DDD7"} color={i<=score?"#FF3B1E":"#E0DDD7"}/>
      ))}
    </div>
  );

  const renderBar = (avg: number) => (
    <div style={{flex:1,height:"8px",background:"#F0EEE9",borderRadius:"4px",overflow:"hidden"}}>
      <div style={{height:"100%",width:`${(avg/5)*100}%`,background:"linear-gradient(to right,#FF3B1E,#FF7A5C)",borderRadius:"4px",transition:"width 0.6s"}}/>
    </div>
  );

  return (
    <>
      <style>{`
        .score-star{cursor:pointer;transition:transform 0.1s;}
        .score-star:hover{transform:scale(1.2);}
      `}</style>
      <div style={{background:"white",borderRadius:"18px",padding:"22px 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
          <div style={{fontSize:"16px",fontWeight:800,display:"flex",alignItems:"center",gap:"8px"}}>
            <Star size={18} fill="#FF3B1E" color="#FF3B1E"/> 고객 선호도 점수
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            {data && data.totalReviews > 0 && (
              <span style={{fontSize:"13px",color:"#888",fontWeight:400}}>{data.totalReviews}명 평가</span>
            )}
            {loggedIn && (
              <button onClick={()=>setMode(mode==="edit"?"view":"edit")}
                style={{background:mode==="edit"?"#F0EEE9":"#FF3B1E",color:mode==="edit"?"#555":"white",border:"none",padding:"7px 14px",borderRadius:"8px",fontSize:"13px",fontWeight:800,cursor:"pointer"}}>
                {mode==="edit"?"취소":"내 점수 주기"}
              </button>
            )}
          </div>
        </div>

        {/* 총점 */}
        {data && data.totalAvg > 0 && (
          <div style={{background:"#FFF0ED",borderRadius:"12px",padding:"14px 18px",marginBottom:"16px",display:"flex",alignItems:"center",gap:"14px"}}>
            <div style={{fontFamily:"'Bebas Neue',serif",fontSize:"44px",color:"#FF3B1E",lineHeight:1}}>{data.totalAvg}</div>
            <div>
              {renderStars(Math.round(data.totalAvg), 18)}
              <div style={{fontSize:"13px",color:"#888",marginTop:"4px",fontWeight:400}}>종합 선호도</div>
            </div>
          </div>
        )}

        {!loggedIn && (
          <div style={{background:"#EEF2FF",border:"1px solid #B8C8FF",borderRadius:"10px",padding:"12px 16px",marginBottom:"14px",display:"flex",alignItems:"center",gap:"8px"}}>
            <AlertCircle size={15} color="#1847FF"/>
            <span style={{fontSize:"13px",color:"#1847FF",fontWeight:400}}>로그인 후 점수를 주면 다른 구매자에게 도움이 돼요!</span>
          </div>
        )}

        {/* 카테고리별 */}
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {CATEGORIES.map(cat=>{
            const avg = data?.avgScores.find(s=>s.category===cat);
            const myScore = myScores[cat] || 0;
            return (
              <div key={cat}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"5px"}}>
                  <div>
                    <span style={{fontSize:"14px",fontWeight:800}}>{cat}</span>
                    <span style={{fontSize:"11px",color:"#AAA",marginLeft:"6px",fontWeight:400}}>{CATEGORY_DESC[cat]}</span>
                  </div>
                  <span style={{fontSize:"13px",fontWeight:800,color:avg&&avg.avg>0?"#FF3B1E":"#DDD"}}>
                    {avg&&avg.avg>0?`${avg.avg}/5`:"-"}
                  </span>
                </div>
                {mode==="edit" ? (
                  <div style={{display:"flex",gap:"4px"}}>
                    {[1,2,3,4,5].map(star=>(
                      <Star key={star} className="score-star" size={24}
                        fill={star<=myScore?"#FF3B1E":"#E0DDD7"} color={star<=myScore?"#FF3B1E":"#E0DDD7"}
                        onClick={()=>setMyScores(p=>({...p,[cat]:star}))}/>
                    ))}
                    {myScore>0 && <span style={{fontSize:"12px",color:"#FF3B1E",fontWeight:800,marginLeft:"6px",alignSelf:"center"}}>{myScore}점</span>}
                  </div>
                ) : (
                  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    {renderBar(avg?.avg||0)}
                    {avg&&avg.count>0&&<span style={{fontSize:"11px",color:"#AAA",fontWeight:400,flexShrink:0}}>{avg.count}명</span>}
                  </div>
                )}
                {mode==="view" && myScores[cat]>0 && (
                  <div style={{fontSize:"11px",color:"#1847FF",fontWeight:700,marginTop:"2px"}}>
                    내 점수: {myScores[cat]}점
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {mode==="edit" && (
          <div style={{marginTop:"16px"}}>
            {saved&&<div style={{background:"#EAF6EF",borderRadius:"10px",padding:"10px 14px",marginBottom:"10px",fontSize:"13px",fontWeight:700,color:"#2D8A52"}}>✅ 점수가 저장됐어요!</div>}
            <button onClick={handleSave} disabled={saving}
              style={{width:"100%",background:saving?"#E0DDD7":"#FF3B1E",color:saving?"#AAA":"white",border:"none",padding:"13px",borderRadius:"10px",fontSize:"14px",fontWeight:800,cursor:saving?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>
              <ThumbsUp size={16}/> {saving?"저장 중...":"내 선호도 점수 저장"}
            </button>
            <p style={{fontSize:"12px",color:"#AAA",textAlign:"center",marginTop:"8px",fontWeight:400}}>
              주관적인 평가예요. 솔직한 점수가 다른 구매자에게 도움이 돼요.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
