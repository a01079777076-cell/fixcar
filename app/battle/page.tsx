"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Trophy, Zap, ChevronRight, RotateCcw } from "lucide-react";

interface Car {
  name: string; brand: string; price: string;
  monthlyCost: string; fuel: string; power: string;
  desc: string; emoji: string;
}

const CARS: Car[] = [
  { name:"포르쉐 911 카레라", brand:"포르쉐", price:"1억 4,500만", monthlyCost:"월 유지 120만", fuel:"가솔린", power:"385마력", desc:"드림카의 끝판왕. 타보고 싶어도 못 사는 그 차.", emoji:"🏎️" },
  { name:"람보르기니 우루스", brand:"람보르기니", price:"2억 8,000만", monthlyCost:"월 유지 200만", fuel:"가솔린", power:"666마력", desc:"수퍼 SUV. 집 한 채 값이지만 드림은 공짜.", emoji:"🐂" },
  { name:"롤스로이스 고스트", brand:"롤스로이스", price:"4억 2,000만", monthlyCost:"월 유지 300만", fuel:"가솔린", power:"571마력", desc:"세상에서 가장 조용한 차. 부자가 되고 싶은 이유.", emoji:"👻" },
  { name:"BMW M3 컴페티션", brand:"BMW", price:"1억 800만", monthlyCost:"월 유지 80만", fuel:"가솔린", power:"510마력", desc:"세단의 탈을 쓴 레이싱카. 일상+트랙 모두 OK.", emoji:"🔵" },
  { name:"메르세데스 G63 AMG", brand:"벤츠", price:"2억 3,000만", monthlyCost:"월 유지 180만", fuel:"가솔린", power:"585마력", desc:"박스카의 명품. 럭셔리와 오프로드의 완벽한 공존.", emoji:"📦" },
  { name:"페라리 로마", brand:"페라리", price:"2억 9,000만", monthlyCost:"월 유지 250만", fuel:"가솔린", power:"620마력", desc:"이탈리아의 낭만. 소리만 들어도 심장이 뛴다.", emoji:"🐎" },
  { name:"테슬라 모델S 플레드", brand:"테슬라", price:"1억 5,500만", monthlyCost:"월 유지 30만", fuel:"전기", power:"1,020마력", desc:"0-100 2초. 세상에서 가장 빠른 양산차.", emoji:"⚡" },
  { name:"포르쉐 타이칸 터보S", brand:"포르쉐", price:"1억 9,500만", monthlyCost:"월 유지 50만", fuel:"전기", power:"761마력", desc:"전기차도 포르쉐면 다르다. 감성+성능 완벽 조화.", emoji:"🔌" },
  { name:"제네시스 G90", brand:"제네시스", price:"1억 6,300만", monthlyCost:"월 유지 90만", fuel:"가솔린", power:"425마력", desc:"국산 최고 럭셔리. 국뽕과 실용의 완벽한 합산.", emoji:"🇰🇷" },
  { name:"벤틀리 벤테이가", brand:"벤틀리", price:"3억 5,000만", monthlyCost:"월 유지 280만", fuel:"가솔린", power:"542마력", desc:"SUV도 명품이 될 수 있다. 가죽 냄새부터 다르다.", emoji:"👑" },
  { name:"마세라티 그레칼레", brand:"마세라티", price:"8,900만", monthlyCost:"월 유지 70만", fuel:"가솔린", power:"300마력", desc:"이탈리아 럭셔리 SUV. 가장 합리적인 이태리카.", emoji:"🔱" },
  { name:"BMW i8", brand:"BMW", price:"1억 8,000만", monthlyCost:"월 유지 60만", fuel:"플러그인HEV", power:"374마력", desc:"미래형 디자인. 10년 후에도 멋있을 차.", emoji:"🌀" },
  { name:"렉서스 LFA", brand:"렉서스", price:"7억(중고)", monthlyCost:"월 유지 200만", fuel:"가솔린", power:"560마력", desc:"토요타가 만든 슈퍼카. 소리가 악기 수준.", emoji:"🎻" },
  { name:"아우디 R8", brand:"아우디", price:"2억 3,000만", monthlyCost:"월 유지 160만", fuel:"가솔린", power:"570마력", desc:"V10 자연흡기. 요즘 보기 힘든 순수한 맛.", emoji:"💎" },
  { name:"쉐보레 콜벳 Z06", brand:"쉐보레", price:"1억 6,500만", monthlyCost:"월 유지 100만", fuel:"가솔린", power:"670마력", desc:"미국의 자존심. 가성비 슈퍼카의 대명사.", emoji:"🦅" },
  { name:"현대 아이오닉5 N", brand:"현대", price:"7,700만", monthlyCost:"월 유지 20만", fuel:"전기", power:"650마력", desc:"국산 전기 고성능. N 드림의 완성.", emoji:"⚡" },
];

// 32강 → 16강 → 8강 → 4강 → 결승 → 우승
function shuffle(arr: Car[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CarBattlePage() {
  const [started, setStarted] = useState(false);
  const [bracket, setBracket] = useState<Car[]>([]);
  const [remaining, setRemaining] = useState<Car[]>([]);
  const [round, setRound] = useState(1);
  const [matchIdx, setMatchIdx] = useState(0);
  const [winners, setWinners] = useState<Car[]>([]);
  const [champion, setChampion] = useState<Car | null>(null);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [lastChosen, setLastChosen] = useState<"left" | "right" | null>(null);

  const ROUND_NAMES: Record<number, string> = { 1:"32강", 2:"16강", 3:"8강", 4:"4강", 5:"결승" };

  const start = () => {
    const shuffled = shuffle(CARS);
    setBracket(shuffled);
    setRemaining(shuffled);
    setRound(1); setMatchIdx(0); setWinners([]); setChampion(null);
    setVoteCounts({}); setTotalVotes(0); setStarted(true);
  };

  const choose = (car: Car, side: "left" | "right") => {
    if (animating) return;
    setAnimating(true);
    setLastChosen(side);

    setVoteCounts(p => ({ ...p, [car.name]: (p[car.name] || 0) + 1 }));
    setTotalVotes(p => p + 1);

    const newWinners = [...winners, car];
    const nextIdx = matchIdx + 1;
    const totalMatches = Math.floor(remaining.length / 2);

    setTimeout(() => {
      setLastChosen(null);
      setAnimating(false);

      if (nextIdx >= totalMatches) {
        // 라운드 종료
        if (newWinners.length === 1) {
          setChampion(newWinners[0]);
        } else {
          setRemaining(newWinners);
          setRound(r => r + 1);
          setMatchIdx(0);
          setWinners([]);
        }
      } else {
        setMatchIdx(nextIdx);
        setWinners(newWinners);
      }
    }, 500);
  };

  const leftCar = remaining[matchIdx * 2];
  const rightCar = remaining[matchIdx * 2 + 1];
  const totalMatches = Math.floor(remaining.length / 2);

  const sortedVotes = Object.entries(voteCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#0A0A0A;-webkit-font-smoothing:antialiased;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        .car-card{background:#1A1A2E;border:2px solid #2A2A4A;border-radius:20px;padding:28px 24px;cursor:pointer;transition:all 0.2s;flex:1;}
        .car-card:hover{border-color:#1847FF;background:#1A1A3E;transform:translateY(-4px);box-shadow:0 12px 40px rgba(24,71,255,0.3);}
        .car-card.chosen{border-color:#FF3B1E;background:#1E1A1A;box-shadow:0 12px 40px rgba(255,59,30,0.4);}
        .vs{font-family:'Bebas Neue',serif;font-size:48px;color:#333;flex-shrink:0;}
        @keyframes pulse-red{0%,100%{opacity:1}50%{opacity:0.5}}
        @media(max-width:768px){.battle-row{flex-direction:column!important;}.vs{transform:rotate(90deg);}}
      `}</style>

      <div style={{minHeight:"100vh",background:"#0A0A0A"}}>
        <div style={{background:"#050510",borderBottom:"1px solid #1A1A3A",padding:"0 32px",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <a href="/" style={{fontFamily:"'Bebas Neue',serif",fontSize:"24px",letterSpacing:"3px"}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"white"}}>CAR</span></a>
          <div style={{fontSize:"14px",fontWeight:800,color:"rgba(255,255,255,0.4)"}}>자동차 지식배틀</div>
          <a href="/cars" style={{fontSize:"13px",color:"rgba(255,255,255,0.3)",fontWeight:700}}>매물 보기 →</a>
        </div>

        <div style={{maxWidth:"900px",margin:"0 auto",padding:"40px 32px 80px"}}>

          {!started ? (
            /* 시작 화면 */
            <div style={{textAlign:"center",paddingTop:"40px"}}>
              <div style={{fontSize:"clamp(48px,8vw,100px)",marginBottom:"20px"}}>🏆</div>
              <h1 style={{fontFamily:"'Bebas Neue',serif",fontSize:"clamp(40px,7vw,80px)",color:"white",letterSpacing:"3px",marginBottom:"12px",lineHeight:1}}>
                자동차 <span style={{color:"#FF3B1E"}}>지식배틀</span>
              </h1>
              <p style={{fontSize:"17px",color:"rgba(255,255,255,0.5)",lineHeight:1.8,marginBottom:"12px",fontWeight:400}}>
                인기 있지만 주로 못 사는 드림카 16대 중<br/>
                <strong style={{color:"rgba(255,255,255,0.8)",fontWeight:800}}>당신이 딱 하나만 가질 수 있다면?</strong>
              </p>
              <p style={{fontSize:"14px",color:"rgba(255,255,255,0.3)",marginBottom:"40px",fontWeight:400}}>
                차량 가액·월 유지비·마력까지 보고 선택하세요
              </p>
              <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap",marginBottom:"32px"}}>
                {CARS.slice(0,8).map(car=>(
                  <div key={car.name} style={{background:"#1A1A2E",border:"1px solid #2A2A4A",borderRadius:"12px",padding:"10px 16px",fontSize:"13px",fontWeight:800,color:"rgba(255,255,255,0.6)",display:"flex",alignItems:"center",gap:"6px"}}>
                    {car.emoji} {car.name.split(" ").slice(0,2).join(" ")}
                  </div>
                ))}
              </div>
              <button onClick={start} style={{background:"#FF3B1E",color:"white",border:"none",padding:"18px 52px",borderRadius:"14px",fontSize:"18px",fontWeight:800,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"10px"}}>
                <Zap size={20}/> 배틀 시작하기
              </button>
            </div>

          ) : champion ? (
            /* 우승 화면 */
            <div style={{textAlign:"center",paddingTop:"20px"}}>
              <div style={{fontSize:"80px",marginBottom:"20px"}}>🏆</div>
              <div style={{fontSize:"14px",fontWeight:800,letterSpacing:"3px",color:"#FF3B1E",marginBottom:"12px"}}>CHAMPION</div>
              <h2 style={{fontFamily:"'Bebas Neue',serif",fontSize:"clamp(36px,6vw,64px)",color:"white",letterSpacing:"2px",marginBottom:"8px",lineHeight:1}}>
                {champion.name}
              </h2>
              <div style={{fontSize:"18px",color:"rgba(255,255,255,0.5)",marginBottom:"32px",fontWeight:400}}>{champion.desc}</div>

              <div style={{background:"#1A1A2E",border:"2px solid #FF3B1E",borderRadius:"20px",padding:"24px 28px",marginBottom:"32px",display:"inline-block",textAlign:"left",minWidth:"300px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
                  {[["💰 차량 가액",champion.price],["⛽ 연료",champion.fuel],["⚡ 출력",champion.power],["💳 월 유지비",champion.monthlyCost]].map(([l,v])=>(
                    <div key={l as string}>
                      <div style={{fontSize:"12px",color:"rgba(255,255,255,0.4)",marginBottom:"3px",fontWeight:400}}>{l}</div>
                      <div style={{fontSize:"16px",fontWeight:800,color:"white"}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 순위표 */}
              {sortedVotes.length > 0 && (
                <div style={{background:"#111122",borderRadius:"18px",padding:"22px 24px",marginBottom:"28px",textAlign:"left"}}>
                  <div style={{fontSize:"16px",fontWeight:800,color:"white",marginBottom:"16px"}}>📊 이번 배틀 투표 결과</div>
                  {sortedVotes.map(([name, votes], i) => {
                    const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                    return (
                      <div key={name} style={{marginBottom:"10px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px",fontSize:"13px"}}>
                          <span style={{fontWeight:i===0?800:600,color:i===0?"#FF3B1E":"rgba(255,255,255,0.7)"}}>
                            {i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}위`} {name}
                          </span>
                          <span style={{color:"rgba(255,255,255,0.5)",fontWeight:400}}>{votes}표 ({pct}%)</span>
                        </div>
                        <div style={{height:"6px",background:"#2A2A4A",borderRadius:"3px",overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${pct}%`,background:i===0?"#FF3B1E":"#1847FF",borderRadius:"3px",transition:"width 0.5s"}}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{display:"flex",gap:"12px",justifyContent:"center"}}>
                <button onClick={start} style={{background:"#FF3B1E",color:"white",border:"none",padding:"15px 32px",borderRadius:"12px",fontSize:"15px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:"8px"}}>
                  <RotateCcw size={16}/> 다시 하기
                </button>
                <a href="/cars"><button style={{background:"#1847FF",color:"white",border:"none",padding:"15px 32px",borderRadius:"12px",fontSize:"15px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:"8px"}}>
                  실제 매물 보기 <ChevronRight size={16}/>
                </button></a>
              </div>
            </div>

          ) : leftCar && rightCar ? (
            /* 배틀 화면 */
            <>
              {/* 라운드 정보 */}
              <div style={{textAlign:"center",marginBottom:"28px"}}>
                <div style={{display:"inline-flex",alignItems:"center",gap:"12px",background:"#1A1A2E",border:"1px solid #2A2A4A",borderRadius:"100px",padding:"10px 24px"}}>
                  <span style={{fontSize:"14px",fontWeight:800,color:"#FF3B1E"}}>{ROUND_NAMES[round] || `${remaining.length}강`}</span>
                  <span style={{fontSize:"13px",color:"rgba(255,255,255,0.4)",fontWeight:400}}>{matchIdx + 1} / {totalMatches} 경기</span>
                </div>
              </div>

              {/* 진행바 */}
              <div style={{height:"4px",background:"#1A1A2E",borderRadius:"2px",marginBottom:"28px",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${((matchIdx+1)/totalMatches)*100}%`,background:"#FF3B1E",borderRadius:"2px",transition:"width 0.3s"}}/>
              </div>

              <p style={{textAlign:"center",fontSize:"16px",color:"rgba(255,255,255,0.5)",marginBottom:"24px",fontWeight:400}}>
                딱 하나만 가질 수 있다면?
              </p>

              {/* 배틀 카드 */}
              <div className="battle-row" style={{display:"flex",gap:"20px",alignItems:"center",marginBottom:"24px"}}>
                <div className={`car-card${lastChosen==="left"?" chosen":""}`} onClick={()=>choose(leftCar,"left")}>
                  <div style={{fontSize:"52px",textAlign:"center",marginBottom:"16px"}}>{leftCar.emoji}</div>
                  <div style={{fontSize:"11px",fontWeight:800,letterSpacing:"2px",color:"#1847FF",marginBottom:"6px"}}>{leftCar.brand}</div>
                  <div style={{fontSize:"20px",fontWeight:800,color:"white",marginBottom:"8px",lineHeight:1.2}}>{leftCar.name}</div>
                  <div style={{fontSize:"13px",color:"rgba(255,255,255,0.5)",lineHeight:1.65,marginBottom:"16px",fontWeight:400}}>{leftCar.desc}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
                    {[["💰",leftCar.price],["⛽",leftCar.fuel],["⚡",leftCar.power],["💳",leftCar.monthlyCost]].map(([icon,val])=>(
                      <div key={String(icon)} style={{background:"rgba(255,255,255,0.05)",borderRadius:"8px",padding:"8px 10px"}}>
                        <div style={{fontSize:"11px",color:"rgba(255,255,255,0.3)",marginBottom:"2px",fontWeight:400}}>{icon}</div>
                        <div style={{fontSize:"12px",fontWeight:800,color:"rgba(255,255,255,0.8)"}}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:"16px",background:"#FF3B1E",borderRadius:"10px",padding:"12px",textAlign:"center",fontSize:"15px",fontWeight:800,color:"white"}}>
                    이 차 선택!
                  </div>
                </div>

                <div className="vs">VS</div>

                <div className={`car-card${lastChosen==="right"?" chosen":""}`} onClick={()=>choose(rightCar,"right")}>
                  <div style={{fontSize:"52px",textAlign:"center",marginBottom:"16px"}}>{rightCar.emoji}</div>
                  <div style={{fontSize:"11px",fontWeight:800,letterSpacing:"2px",color:"#1847FF",marginBottom:"6px"}}>{rightCar.brand}</div>
                  <div style={{fontSize:"20px",fontWeight:800,color:"white",marginBottom:"8px",lineHeight:1.2}}>{rightCar.name}</div>
                  <div style={{fontSize:"13px",color:"rgba(255,255,255,0.5)",lineHeight:1.65,marginBottom:"16px",fontWeight:400}}>{rightCar.desc}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
                    {[["💰",rightCar.price],["⛽",rightCar.fuel],["⚡",rightCar.power],["💳",rightCar.monthlyCost]].map(([icon,val])=>(
                      <div key={String(icon)} style={{background:"rgba(255,255,255,0.05)",borderRadius:"8px",padding:"8px 10px"}}>
                        <div style={{fontSize:"11px",color:"rgba(255,255,255,0.3)",marginBottom:"2px",fontWeight:400}}>{icon}</div>
                        <div style={{fontSize:"12px",fontWeight:800,color:"rgba(255,255,255,0.8)"}}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:"16px",background:"#1847FF",borderRadius:"10px",padding:"12px",textAlign:"center",fontSize:"15px",fontWeight:800,color:"white"}}>
                    이 차 선택!
                  </div>
                </div>
              </div>

              {/* 현재 생존자 */}
              <div style={{textAlign:"center",fontSize:"13px",color:"rgba(255,255,255,0.3)",fontWeight:400}}>
                남은 차량 {remaining.length}대 · 선택된 차 {winners.length}대
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
