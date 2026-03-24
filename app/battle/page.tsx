"use client";
import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Trophy, RotateCcw, Share2, Flame } from "lucide-react";
import { BRAND_MODELS, CAR_SPECS, CAR_GRADES } from "@/data/catalog_data";

/* ═══ 카탈로그에서 배틀용 차량 풀 생성 ═══ */
interface BattleCar { name:string; brand:string; origin:string; price:string; power:string; fuel:string; segment:string; color:string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bm = BRAND_MODELS as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const specs = CAR_SPECS as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gradeData = CAR_GRADES as any;

const BRAND_COLORS: Record<string,string> = {
  "현대":"#1847FF","기아":"#E8290F","제네시스":"#886B3D","KG모빌리티":"#444","르노코리아":"#FFD700","쉐보레":"#C4A747",
  "BMW":"#1C69D4","벤츠":"#333","아우디":"#BB0A30","폭스바겐":"#1A3E72","테슬라":"#E82127","포르쉐":"#B12B28",
  "볼보":"#003366","토요타":"#EB0A1E","렉서스":"#1A1A1A","혼다":"#CC0000","MINI":"#006B3A","랜드로버":"#005A2B",
};

function buildPool(): { domestic: BattleCar[]; imported: BattleCar[] } {
  const domestic: BattleCar[] = [];
  const imported: BattleCar[] = [];

  for (const [brand, info] of Object.entries(bm)) {
    const cat = (info as any).category || "국산";
    for (const m of (info as any).models || []) {
      if (m.status !== "현행") continue;
      const g = gradeData[m.name];
      const s = specs[m.name];
      if (!g || !Array.isArray(g) || g.length === 0) continue;
      const lowestPrice = Math.min(...g.map((x: any) => x.price || 99999));
      const highestPrice = Math.max(...g.map((x: any) => x.price || 0));
      if (lowestPrice < 100) continue;

      const powerVal = g[0]?.power || s?.cc || "";
      const fuelVal = s?.fuel || g[0]?.engine || "";
      const seg = s?.segment || "";

      const car: BattleCar = {
        name: m.name,
        brand: String(brand),
        origin: cat,
        price: lowestPrice === highestPrice ? `${lowestPrice.toLocaleString()}만~` : `${lowestPrice.toLocaleString()}~${highestPrice.toLocaleString()}만`,
        power: powerVal ? `${powerVal}` : "",
        fuel: fuelVal,
        segment: seg,
        color: BRAND_COLORS[String(brand)] || "#555",
      };
      if (cat === "국산") domestic.push(car);
      else imported.push(car);
    }
  }
  return { domestic, imported };
}

const EMOJIS: Record<string,string> = {"세단":"🚗","SUV":"🚙","경차":"🚗","소형":"🚗","준중형":"🚗","중형":"🚙","대형":"🏎️","쿠페":"🏎️","MPV":"🚐","전기":"⚡","해치백":"🚗"};
function getEmoji(seg:string, fuel:string) { if(fuel.includes("전기")) return "⚡"; return EMOJIS[seg]||"🚗"; }
function shuffle<T>(arr:T[]):T[] { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

type Round = 32|16|8|4|2|1;
const ROUND_NAMES: Record<number,string> = {32:"32강",16:"16강",8:"8강",4:"준결승",2:"결승",1:"🏆 우승!"};

export default function BattlePage() {
  const pool = useMemo(() => buildPool(), []);
  const [stage, setStage] = useState<"select"|"playing"|"result">("select");
  const [battleFilter, setBattleFilter] = useState<"전체"|"국산"|"수입">("전체");
  const [candidates, setCandidates] = useState<BattleCar[]>([]);
  const [matchIdx, setMatchIdx] = useState(0);
  const [winners, setWinners] = useState<BattleCar[]>([]);
  const [currentRound, setCurrentRound] = useState<Round>(32);
  const [champion, setChampion] = useState<BattleCar|null>(null);
  const [rankings, setRankings] = useState<{name:string;votes:number}[]>([]);

  useEffect(()=>{
    fetch("/api/battle/rankings").then(r=>r.json()).then(d=>{
      if(Array.isArray(d)) setRankings(d.slice(0,10));
    }).catch(()=>{});
  },[]);

  const getPool = () => {
    if(battleFilter==="국산") return pool.domestic;
    if(battleFilter==="수입") return pool.imported;
    return [...pool.domestic, ...pool.imported];
  };

  const startBattle = () => {
    let p = getPool();
    if(p.length<8) { alert("차량이 부족합니다!"); return; }
    const size = p.length>=32?32:p.length>=16?16:8;
    setCurrentRound(size as Round);
    setCandidates(shuffle(p).slice(0,size));
    setMatchIdx(0);
    setWinners([]);
    setChampion(null);
    setStage("playing");
  };

  const pick = (car:BattleCar) => {
    const nw = [...winners,car];
    const ni = matchIdx+2;
    if(ni>=candidates.length) {
      if(nw.length===1) {
        setChampion(nw[0]); setStage("result");
        fetch("/api/battle/vote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({carName:nw[0].name})}).catch(()=>{});
      } else { setCurrentRound(nw.length as Round); setCandidates(nw); setWinners([]); setMatchIdx(0); }
    } else { setWinners(nw); setMatchIdx(ni); }
  };

  const mn = Math.floor(matchIdx/2)+1;
  const tm = Math.floor(candidates.length/2);
  const carA = candidates[matchIdx];
  const carB = candidates[matchIdx+1];

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} .bc{transition:all 0.2s;cursor:pointer;} .bc:hover{transform:scale(1.03);box-shadow:0 8px 32px rgba(0,0,0,0.15)!important;} .bc:active{transform:scale(0.98);}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>

        {/* ═══ 시작 ═══ */}
        {stage==="select"&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#9B30FF,#6B00CC)",padding:"60px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:-20,bottom:-30,fontFamily:"'Bebas Neue',serif",fontSize:"clamp(100px,20vw,200px)",color:"rgba(255,255,255,0.1)",lineHeight:1}}>VS</div>
              <div style={{position:"relative",zIndex:1}}>
                <div style={{fontSize:48,marginBottom:16}}>⚔️</div>
                <h1 style={{fontSize:"clamp(24px,5vw,40px)",fontWeight:800,color:"white",marginBottom:8}}>자동차 32강 토너먼트</h1>
                <p style={{fontSize:15,color:"rgba(255,255,255,0.7)",fontWeight:400,lineHeight:1.8}}>전 세계 {pool.domestic.length+pool.imported.length}대 차량 중 랜덤 32대 대결!</p>
              </div>
            </div>
            <div style={{maxWidth:600,margin:"0 auto",padding:"32px 24px 80px"}}>
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                {(["전체","국산","수입"] as const).map(f=>(
                  <button key={f} onClick={()=>setBattleFilter(f)} style={{flex:1,padding:"14px",borderRadius:14,border:battleFilter===f?"2px solid #9B30FF":"1.5px solid #E0DDD7",background:battleFilter===f?"#F5EEFF":"white",color:battleFilter===f?"#9B30FF":"#888",fontSize:15,fontWeight:battleFilter===f?800:600,fontFamily:"'NanumSquareRound',sans-serif"}}>
                    {f==="국산"?"🇰🇷 국산":f==="수입"?"🌍 수입":"⚔️ 전체"}
                    <div style={{fontSize:11,fontWeight:400,marginTop:2,color:battleFilter===f?"#9B30FF":"#CCC"}}>
                      {f==="전체"?`${pool.domestic.length+pool.imported.length}대`:f==="국산"?`${pool.domestic.length}대`:`${pool.imported.length}대`}
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={startBattle} style={{width:"100%",padding:"22px",background:"linear-gradient(135deg,#9B30FF,#6B00CC)",color:"white",border:"none",borderRadius:18,fontSize:20,fontWeight:800,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                ⚔️ {battleFilter==="전체"?"32강":battleFilter==="국산"?"🇰🇷 국산":"🌍 수입"} 토너먼트 시작
              </button>
              <div style={{background:"#F8F7F4",borderRadius:14,padding:"16px 20px",marginBottom:28,fontSize:13,color:"#888",lineHeight:1.8,textAlign:"center"}}>
                🎲 매번 랜덤 대진! 같은 결과가 나오지 않아요<br/>🎮 추가 미니게임 배틀은 추후 업데이트 됩니다.
              </div>
              {rankings.length>0&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><Flame size={18} color="#FF3B1E"/><h2 style={{fontSize:18,fontWeight:800}}>실시간 인기 순위</h2></div>
                  <div style={{background:"white",borderRadius:18,overflow:"hidden"}}>
                    {rankings.map((r,i)=>(
                      <div key={r.name} style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:i<rankings.length-1?"1px solid #F0EEE9":"none"}}>
                        <span style={{fontSize:i<3?20:14,width:32,textAlign:"center"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`}</span>
                        <span style={{flex:1,fontSize:14,fontWeight:i<3?800:600}}>{r.name}</span>
                        <span style={{fontSize:13,fontWeight:800,color:"#FF3B1E"}}>{r.votes}표</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ 대결 ═══ */}
        {stage==="playing"&&carA&&carB&&(
          <div style={{maxWidth:700,margin:"0 auto",padding:"24px 16px 80px"}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:800,letterSpacing:3,color:"#9B30FF",marginBottom:6}}>{ROUND_NAMES[currentRound]}</div>
              <div style={{fontSize:14,color:"#AAA"}}>{mn} / {tm}</div>
              <div style={{height:4,background:"#E0DDD7",borderRadius:2,marginTop:10,overflow:"hidden"}}><div style={{height:"100%",width:`${(mn/tm)*100}%`,background:"linear-gradient(90deg,#9B30FF,#FF3B1E)",borderRadius:2,transition:"width 0.3s"}}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,position:"relative"}}>
              {[carA,carB].map((car,i)=>(
                <button key={i} className="bc" onClick={()=>pick(car)} style={{background:`linear-gradient(135deg,${car.color}dd,${car.color})`,borderRadius:24,padding:"32px 18px",textAlign:"center",border:"none",color:"white",minHeight:320,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                  <div style={{fontSize:56,marginBottom:12}}>{getEmoji(car.segment,car.fuel)}</div>
                  <div style={{fontSize:11,opacity:0.7,fontWeight:600,marginBottom:2}}>{car.origin==="수입"?"🌍":"🇰🇷"} {car.brand}</div>
                  <div style={{fontSize:18,fontWeight:800,marginBottom:14,wordBreak:"keep-all"}}>{car.name}</div>
                  <div style={{width:"100%",display:"flex",flexDirection:"column",gap:6,fontSize:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",padding:"6px 12px",background:"rgba(255,255,255,0.15)",borderRadius:8}}><span style={{opacity:0.7}}>가격</span><span style={{fontWeight:800}}>{car.price}</span></div>
                    {car.power&&<div style={{display:"flex",justifyContent:"space-between",padding:"6px 12px",background:"rgba(255,255,255,0.15)",borderRadius:8}}><span style={{opacity:0.7}}>출력</span><span style={{fontWeight:800}}>{car.power}</span></div>}
                    <div style={{display:"flex",justifyContent:"space-between",padding:"6px 12px",background:"rgba(255,255,255,0.15)",borderRadius:8}}><span style={{opacity:0.7}}>연료</span><span style={{fontWeight:800}}>{car.fuel||"-"}</span></div>
                  </div>
                </button>
              ))}
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:48,height:48,borderRadius:"50%",background:"#1A1A1A",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,zIndex:2,boxShadow:"0 4px 16px rgba(0,0,0,0.3)"}}>VS</div>
            </div>
          </div>
        )}

        {/* ═══ 결과 ═══ */}
        {stage==="result"&&champion&&(
          <div style={{maxWidth:500,margin:"0 auto",padding:"40px 24px 80px",textAlign:"center"}}>
            <div style={{fontSize:12,fontWeight:800,letterSpacing:4,color:"#E8A020",marginBottom:16}}>CHAMPION</div>
            <div style={{background:`linear-gradient(135deg,${champion.color}dd,${champion.color})`,borderRadius:28,padding:"48px 32px",color:"white",marginBottom:24,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:-10,bottom:-20,fontFamily:"'Bebas Neue',serif",fontSize:120,color:"rgba(255,255,255,0.1)",lineHeight:1}}>1ST</div>
              <Trophy size={48} style={{marginBottom:16,opacity:0.9}}/>
              <div style={{fontSize:80,marginBottom:12}}>{getEmoji(champion.segment,champion.fuel)}</div>
              <div style={{fontSize:14,opacity:0.7,marginBottom:4}}>{champion.origin==="수입"?"🌍":"🇰🇷"} {champion.brand}</div>
              <div style={{fontSize:32,fontWeight:800,marginBottom:8}}>{champion.name}</div>
              <div style={{fontSize:14,opacity:0.8}}>{champion.price}</div>
            </div>
            <p style={{fontSize:16,fontWeight:700,color:"#555",marginBottom:24}}>🏆 {pool.domestic.length+pool.imported.length}대 중 랜덤 32대에서 우승! (1표 반영)</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{setStage("select");fetch("/api/battle/rankings").then(r=>r.json()).then(d=>{if(Array.isArray(d))setRankings(d.slice(0,10));}).catch(()=>{});}} style={{flex:1,padding:"16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:15,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><RotateCcw size={16}/> 다시 하기</button>
              <button onClick={()=>{if(navigator.share)navigator.share({title:`내 드림카는 ${champion.name}!`,text:`픽스카 토너먼트에서 ${champion.name} 우승!`,url:"https://www.fixcar.kr/battle"}).catch(()=>{});else{navigator.clipboard?.writeText(`내 드림카는 ${champion.name}! fixcar.kr/battle`);alert("링크 복사됨!");}}} style={{flex:1,padding:"16px",background:"white",color:"#555",border:"1.5px solid #E0DDD7",borderRadius:14,fontSize:15,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Share2 size={16}/> 공유</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
