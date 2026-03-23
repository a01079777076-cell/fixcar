"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Trophy, RotateCcw, Share2, Flame } from "lucide-react";

const CARS = [
  {name:"아반떼 CN7",brand:"현대",origin:"국산",price:"1,870만~",power:"123PS",fuel:"가솔린",monthly:"37만",img:"🚗",color:"#1847FF"},
  {name:"쏘나타 DN8",brand:"현대",origin:"국산",price:"2,780만~",power:"160PS",fuel:"가솔린",monthly:"55만",img:"🚙",color:"#1847FF"},
  {name:"그랜저 GN7",brand:"현대",origin:"국산",price:"3,885만~",power:"198PS",fuel:"가솔린",monthly:"77만",img:"🏎️",color:"#1847FF"},
  {name:"팰리세이드",brand:"현대",origin:"국산",price:"3,696만~",power:"202PS",fuel:"디젤",monthly:"73만",img:"🚙",color:"#1847FF"},
  {name:"투싼 NX4",brand:"현대",origin:"국산",price:"2,685만~",power:"180PS",fuel:"가솔린",monthly:"53만",img:"🚙",color:"#1847FF"},
  {name:"싼타페 MX5",brand:"현대",origin:"국산",price:"3,380만~",power:"198PS",fuel:"가솔린",monthly:"67만",img:"🚙",color:"#1847FF"},
  {name:"캐스퍼",brand:"현대",origin:"국산",price:"1,385만~",power:"76PS",fuel:"가솔린",monthly:"27만",img:"🚗",color:"#1847FF"},
  {name:"아이오닉5 N",brand:"현대",origin:"국산",price:"7,380만~",power:"650PS",fuel:"전기",monthly:"146만",img:"⚡",color:"#1847FF"},
  {name:"K3",brand:"기아",origin:"국산",price:"1,895만~",power:"147PS",fuel:"가솔린",monthly:"38만",img:"🚗",color:"#E8290F"},
  {name:"K5 DL3",brand:"기아",origin:"국산",price:"2,635만~",power:"160PS",fuel:"가솔린",monthly:"52만",img:"🚙",color:"#E8290F"},
  {name:"K8",brand:"기아",origin:"국산",price:"3,440만~",power:"202PS",fuel:"가솔린",monthly:"68만",img:"🏎️",color:"#E8290F"},
  {name:"스포티지 NQ5",brand:"기아",origin:"국산",price:"2,677만~",power:"180PS",fuel:"가솔린",monthly:"53만",img:"🚙",color:"#E8290F"},
  {name:"쏘렌토 MQ4",brand:"기아",origin:"국산",price:"3,305만~",power:"202PS",fuel:"디젤",monthly:"65만",img:"🚙",color:"#E8290F"},
  {name:"카니발 KA4",brand:"기아",origin:"국산",price:"3,462만~",power:"202PS",fuel:"디젤",monthly:"69만",img:"🚐",color:"#E8290F"},
  {name:"EV6",brand:"기아",origin:"국산",price:"4,870만~",power:"229PS",fuel:"전기",monthly:"97만",img:"⚡",color:"#E8290F"},
  {name:"EV9",brand:"기아",origin:"국산",price:"7,348만~",power:"204PS",fuel:"전기",monthly:"146만",img:"⚡",color:"#E8290F"},
  {name:"G70",brand:"제네시스",origin:"국산",price:"4,197만~",power:"252PS",fuel:"가솔린",monthly:"83만",img:"🏎️",color:"#886B3D"},
  {name:"G80",brand:"제네시스",origin:"국산",price:"5,897만~",power:"304PS",fuel:"가솔린",monthly:"117만",img:"🏎️",color:"#886B3D"},
  {name:"GV70",brand:"제네시스",origin:"국산",price:"4,757만~",power:"252PS",fuel:"가솔린",monthly:"94만",img:"🚙",color:"#886B3D"},
  {name:"GV80",brand:"제네시스",origin:"국산",price:"6,297만~",power:"304PS",fuel:"가솔린",monthly:"125만",img:"🚙",color:"#886B3D"},
  {name:"벤츠 E클래스",brand:"벤츠",origin:"수입",price:"7,250만~",power:"258PS",fuel:"가솔린",monthly:"144만",img:"🏎️",color:"#333"},
  {name:"벤츠 GLC",brand:"벤츠",origin:"수입",price:"6,690만~",power:"258PS",fuel:"가솔린",monthly:"133만",img:"🚙",color:"#333"},
  {name:"BMW 3시리즈",brand:"BMW",origin:"수입",price:"5,560만~",power:"184PS",fuel:"가솔린",monthly:"110만",img:"🏎️",color:"#1C69D4"},
  {name:"BMW 5시리즈",brand:"BMW",origin:"수입",price:"7,090만~",power:"258PS",fuel:"가솔린",monthly:"141만",img:"🏎️",color:"#1C69D4"},
  {name:"BMW X5",brand:"BMW",origin:"수입",price:"10,290만~",power:"286PS",fuel:"가솔린",monthly:"204만",img:"🚙",color:"#1C69D4"},
  {name:"테슬라 모델3",brand:"테슬라",origin:"수입",price:"4,990만~",power:"283PS",fuel:"전기",monthly:"99만",img:"⚡",color:"#E82127"},
  {name:"테슬라 모델Y",brand:"테슬라",origin:"수입",price:"5,699만~",power:"299PS",fuel:"전기",monthly:"113만",img:"⚡",color:"#E82127"},
  {name:"포르쉐 911",brand:"포르쉐",origin:"수입",price:"15,700만~",power:"385PS",fuel:"가솔린",monthly:"312만",img:"🏎️",color:"#B12B28"},
  {name:"아우디 A6",brand:"아우디",origin:"수입",price:"6,680만~",power:"245PS",fuel:"가솔린",monthly:"133만",img:"🏎️",color:"#BB0A30"},
  {name:"볼보 XC60",brand:"볼보",origin:"수입",price:"6,090만~",power:"250PS",fuel:"가솔린",monthly:"121만",img:"🚙",color:"#003366"},
  {name:"렉서스 ES",brand:"렉서스",origin:"수입",price:"5,790만~",power:"218PS",fuel:"HEV",monthly:"115만",img:"🏎️",color:"#1A1A1A"},
  {name:"토요타 캠리",brand:"토요타",origin:"수입",price:"3,990만~",power:"215PS",fuel:"HEV",monthly:"79만",img:"🚙",color:"#EB0A1E"},
];

type Round = 32|16|8|4|2|1;
const ROUND_NAMES: Record<number,string> = {32:"32강",16:"16강",8:"8강",4:"준결승",2:"결승",1:"🏆 우승!"};

function shuffle<T>(arr:T[]):T[] { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

export default function BattlePage() {
  const [stage, setStage] = useState<"select"|"playing"|"result">("select");
  const [battleFilter, setBattleFilter] = useState<"전체"|"국산"|"수입">("전체");
  const [candidates, setCandidates] = useState<typeof CARS>([]);
  const [matchIdx, setMatchIdx] = useState(0);
  const [winners, setWinners] = useState<typeof CARS>([]);
  const [currentRound, setCurrentRound] = useState<Round>(32);
  const [champion, setChampion] = useState<typeof CARS[0]|null>(null);
  const [rankings, setRankings] = useState<{name:string;votes:number}[]>([]);

  useEffect(()=>{
    fetch("/api/battle/rankings").then(r=>r.json()).then(d=>{
      if(Array.isArray(d)) setRankings(d.slice(0,10));
    }).catch(()=>{});
  },[]);

  const startBattle = () => {
    let pool = [...CARS];
    if (battleFilter !== "전체") pool = pool.filter(c => c.origin === battleFilter);
    if (pool.length < 8) { alert(`${battleFilter} 차량이 부족합니다. 전체로 진행해요!`); pool = [...CARS]; }
    const size = pool.length >= 32 ? 32 : pool.length >= 16 ? 16 : 8;
    setCurrentRound(size as Round);
    setCandidates(shuffle(pool).slice(0, size));
    setMatchIdx(0);
    setWinners([]);
    setChampion(null);
    setStage("playing");
  };

  const pick = (car: typeof CARS[0]) => {
    const newWinners = [...winners, car];
    const nextIdx = matchIdx + 2;
    if (nextIdx >= candidates.length) {
      if (newWinners.length === 1) {
        setChampion(newWinners[0]);
        setStage("result");
        fetch("/api/battle/vote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({carName:newWinners[0].name})}).catch(()=>{});
      } else {
        const nextRound = newWinners.length as Round;
        setCurrentRound(nextRound);
        setCandidates(newWinners);
        setWinners([]);
        setMatchIdx(0);
      }
    } else {
      setWinners(newWinners);
      setMatchIdx(nextIdx);
    }
  };

  const matchNum = Math.floor(matchIdx / 2) + 1;
  const totalMatches = Math.floor(candidates.length / 2);
  const carA = candidates[matchIdx];
  const carB = candidates[matchIdx + 1];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        .battle-card{transition:all 0.2s;cursor:pointer;} .battle-card:hover{transform:scale(1.03);box-shadow:0 8px 32px rgba(0,0,0,0.15)!important;} .battle-card:active{transform:scale(0.98);}
      `}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>

        {/* ═══ 시작 화면 ═══ */}
        {stage==="select"&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#9B30FF,#6B00CC)",padding:"60px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:-20,bottom:-30,fontFamily:"'Bebas Neue',serif",fontSize:"clamp(100px,20vw,200px)",color:"rgba(255,255,255,0.1)",lineHeight:1}}>VS</div>
              <div style={{position:"relative",zIndex:1}}>
                <div style={{fontSize:48,marginBottom:16}}>⚔️</div>
                <h1 style={{fontSize:"clamp(24px,5vw,40px)",fontWeight:800,color:"white",marginBottom:8}}>자동차 32강 토너먼트</h1>
                <p style={{fontSize:15,color:"rgba(255,255,255,0.7)",fontWeight:400,lineHeight:1.8}}>32대 토너먼트 · 랜덤 대진 · 가격·마력·유지비 보고 선택</p>
              </div>
            </div>
            <div style={{maxWidth:600,margin:"0 auto",padding:"32px 24px 80px"}}>

              {/* 국산/수입 필터 */}
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                {(["전체","국산","수입"] as const).map(f=>(
                  <button key={f} onClick={()=>setBattleFilter(f)} style={{
                    flex:1,padding:"14px",borderRadius:14,border:battleFilter===f?"2px solid #9B30FF":"1.5px solid #E0DDD7",
                    background:battleFilter===f?"#F5EEFF":"white",color:battleFilter===f?"#9B30FF":"#888",
                    fontSize:15,fontWeight:battleFilter===f?800:600,
                    fontFamily:"'NanumSquareRound',sans-serif",
                  }}>
                    {f==="국산"?"🇰🇷 국산":f==="수입"?"🌍 수입":"⚔️ 전체"}
                    <div style={{fontSize:11,fontWeight:400,marginTop:2,color:battleFilter===f?"#9B30FF":"#CCC"}}>
                      {f==="전체"?`${CARS.length}대`:f==="국산"?`${CARS.filter(c=>c.origin==="국산").length}대`:`${CARS.filter(c=>c.origin==="수입").length}대`}
                    </div>
                  </button>
                ))}
              </div>

              <button onClick={startBattle} style={{
                width:"100%",padding:"22px",background:"linear-gradient(135deg,#9B30FF,#6B00CC)",color:"white",
                border:"none",borderRadius:18,fontSize:20,fontWeight:800,marginBottom:16,
                display:"flex",alignItems:"center",justifyContent:"center",gap:10,
              }}>
                ⚔️ {battleFilter==="전체"?"32강":battleFilter==="국산"?"🇰🇷 국산":"🌍 수입"} 토너먼트 시작
              </button>

              <div style={{background:"#F8F7F4",borderRadius:14,padding:"16px 20px",marginBottom:28,fontSize:13,color:"#888",lineHeight:1.8,textAlign:"center"}}>
                🎮 추가 미니게임 배틀은 추후 업데이트 됩니다.
              </div>

              {/* 인기 순위 */}
              {rankings.length>0&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                    <Flame size={18} color="#FF3B1E"/>
                    <h2 style={{fontSize:18,fontWeight:800}}>실시간 인기 순위</h2>
                  </div>
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
              <div style={{fontSize:14,color:"#AAA"}}>{matchNum} / {totalMatches}</div>
              <div style={{height:4,background:"#E0DDD7",borderRadius:2,marginTop:10,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(matchNum/totalMatches)*100}%`,background:"linear-gradient(90deg,#9B30FF,#FF3B1E)",borderRadius:2,transition:"width 0.3s"}}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,position:"relative"}}>
              {[carA,carB].map((car,i)=>(
                <button key={i} className="battle-card" onClick={()=>pick(car)} style={{
                  background:`linear-gradient(135deg, ${car.color}dd, ${car.color})`,
                  borderRadius:24,padding:"32px 18px",textAlign:"center",border:"none",color:"white",
                  minHeight:320,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",
                }}>
                  <div style={{fontSize:56,marginBottom:12}}>{car.img}</div>
                  <div style={{fontSize:11,opacity:0.7,fontWeight:600,marginBottom:2}}>
                    {car.origin==="수입"?"🌍":"🇰🇷"} {car.brand}
                  </div>
                  <div style={{fontSize:18,fontWeight:800,marginBottom:14,wordBreak:"keep-all"}}>{car.name}</div>
                  {/* 스펙 표시 */}
                  <div style={{width:"100%",display:"flex",flexDirection:"column",gap:6,fontSize:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",padding:"6px 12px",background:"rgba(255,255,255,0.15)",borderRadius:8}}>
                      <span style={{opacity:0.7}}>가격</span><span style={{fontWeight:800}}>{car.price}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",padding:"6px 12px",background:"rgba(255,255,255,0.15)",borderRadius:8}}>
                      <span style={{opacity:0.7}}>마력</span><span style={{fontWeight:800}}>{car.power}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",padding:"6px 12px",background:"rgba(255,255,255,0.15)",borderRadius:8}}>
                      <span style={{opacity:0.7}}>월 유지비</span><span style={{fontWeight:800}}>~{car.monthly}</span>
                    </div>
                  </div>
                </button>
              ))}
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
                width:48,height:48,borderRadius:"50%",background:"#1A1A1A",color:"white",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,
                zIndex:2,boxShadow:"0 4px 16px rgba(0,0,0,0.3)",
              }}>VS</div>
            </div>
          </div>
        )}

        {/* ═══ 결과 ═══ */}
        {stage==="result"&&champion&&(
          <div style={{maxWidth:500,margin:"0 auto",padding:"40px 24px 80px",textAlign:"center"}}>
            <div style={{fontSize:12,fontWeight:800,letterSpacing:4,color:"#E8A020",marginBottom:16}}>CHAMPION</div>
            <div style={{
              background:`linear-gradient(135deg, ${champion.color}dd, ${champion.color})`,
              borderRadius:28,padding:"48px 32px",color:"white",marginBottom:24,
              position:"relative",overflow:"hidden",
            }}>
              <div style={{position:"absolute",right:-10,bottom:-20,fontFamily:"'Bebas Neue',serif",fontSize:120,color:"rgba(255,255,255,0.1)",lineHeight:1}}>1ST</div>
              <Trophy size={48} style={{marginBottom:16,opacity:0.9}}/>
              <div style={{fontSize:80,marginBottom:12}}>{champion.img}</div>
              <div style={{fontSize:14,opacity:0.7,marginBottom:4}}>{champion.brand}</div>
              <div style={{fontSize:32,fontWeight:800,marginBottom:8}}>{champion.name}</div>
              <div style={{fontSize:14,opacity:0.8}}>{champion.price} · {champion.power}</div>
            </div>
            <p style={{fontSize:16,fontWeight:700,color:"#555",marginBottom:24}}>
              🏆 32강에서 살아남은 당신의 드림카! (1표 반영됨)
            </p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{setStage("select");fetch("/api/battle/rankings").then(r=>r.json()).then(d=>{if(Array.isArray(d))setRankings(d.slice(0,10));}).catch(()=>{});}} style={{flex:1,padding:"16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:15,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <RotateCcw size={16}/> 다시 하기
              </button>
              <button onClick={()=>{if(navigator.share)navigator.share({title:`내 드림카는 ${champion.name}!`,text:`픽스카 자동차 토너먼트에서 ${champion.name}이 우승!`,url:"https://www.fixcar.kr/battle"}).catch(()=>{});else{navigator.clipboard?.writeText(`내 드림카는 ${champion.name}! https://www.fixcar.kr/battle`);alert("링크가 복사됐어요!");}}} style={{flex:1,padding:"16px",background:"white",color:"#555",border:"1.5px solid #E0DDD7",borderRadius:14,fontSize:15,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <Share2 size={16}/> 공유
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
