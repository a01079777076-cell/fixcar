"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Trophy } from "lucide-react";

const ALL_CARS = [
  { name:"기아 모닝", brand:"기아", segment:"경차", type:"domestic", price:1300, power:75, efficiency:14.5, discontinued:false, fuel:"가솔린" },
  { name:"기아 레이", brand:"기아", segment:"경차", type:"domestic", price:1600, power:63, efficiency:13.0, discontinued:false, fuel:"가솔린" },
  { name:"현대 캐스퍼", brand:"현대", segment:"경차", type:"domestic", price:1800, power:100, efficiency:14.0, discontinued:false, fuel:"가솔린" },
  { name:"기아 셀토스", brand:"기아", segment:"소형SUV", type:"domestic", price:2600, power:177, efficiency:13.2, discontinued:false, fuel:"가솔린" },
  { name:"현대 베뉴", brand:"현대", segment:"소형SUV", type:"domestic", price:2000, power:120, efficiency:14.0, discontinued:false, fuel:"가솔린" },
  { name:"현대 코나", brand:"현대", segment:"소형SUV", type:"domestic", price:2700, power:145, efficiency:13.5, discontinued:false, fuel:"가솔린" },
  { name:"쉐보레 트레일블레이저", brand:"쉐보레", segment:"소형SUV", type:"domestic", price:2400, power:155, efficiency:12.5, discontinued:false, fuel:"가솔린" },
  { name:"현대 아반떼", brand:"현대", segment:"준중형", type:"domestic", price:2200, power:123, efficiency:14.2, discontinued:false, fuel:"가솔린" },
  { name:"기아 K3", brand:"기아", segment:"준중형", type:"domestic", price:2000, power:123, efficiency:14.3, discontinued:true, fuel:"가솔린" },
  { name:"현대 쏘나타", brand:"현대", segment:"중형", type:"domestic", price:3000, power:160, efficiency:12.8, discontinued:false, fuel:"가솔린" },
  { name:"기아 K5", brand:"기아", segment:"중형", type:"domestic", price:2900, power:180, efficiency:13.2, discontinued:false, fuel:"가솔린" },
  { name:"쉐보레 말리부", brand:"쉐보레", segment:"중형", type:"domestic", price:2700, power:160, efficiency:12.0, discontinued:true, fuel:"가솔린" },
  { name:"현대 투싼", brand:"현대", segment:"중형SUV", type:"domestic", price:3000, power:180, efficiency:13.0, discontinued:false, fuel:"가솔린" },
  { name:"기아 스포티지", brand:"기아", segment:"중형SUV", type:"domestic", price:3000, power:180, efficiency:13.0, discontinued:false, fuel:"가솔린" },
  { name:"기아 쏘렌토", brand:"기아", segment:"중형SUV", type:"domestic", price:3700, power:230, efficiency:16.0, discontinued:false, fuel:"하이브리드" },
  { name:"현대 싼타페", brand:"현대", segment:"중형SUV", type:"domestic", price:3700, power:230, efficiency:16.3, discontinued:false, fuel:"하이브리드" },
  { name:"KG 토레스", brand:"KG모빌리티", segment:"중형SUV", type:"domestic", price:2800, power:170, efficiency:11.0, discontinued:false, fuel:"가솔린" },
  { name:"현대 그랜저", brand:"현대", segment:"대형", type:"domestic", price:4200, power:198, efficiency:11.4, discontinued:false, fuel:"가솔린" },
  { name:"기아 K8", brand:"기아", segment:"대형", type:"domestic", price:3700, power:198, efficiency:11.2, discontinued:false, fuel:"가솔린" },
  { name:"기아 K9", brand:"기아", segment:"대형", type:"domestic", price:6800, power:370, efficiency:9.2, discontinued:false, fuel:"가솔린" },
  { name:"제네시스 G70", brand:"제네시스", segment:"대형", type:"domestic", price:4500, power:252, efficiency:11.2, discontinued:false, fuel:"가솔린" },
  { name:"제네시스 G80", brand:"제네시스", segment:"대형", type:"domestic", price:6500, power:304, efficiency:10.0, discontinued:false, fuel:"가솔린" },
  { name:"제네시스 G90", brand:"제네시스", segment:"대형", type:"domestic", price:16000, power:380, efficiency:8.8, discontinued:false, fuel:"가솔린" },
  { name:"현대 팰리세이드", brand:"현대", segment:"대형SUV", type:"domestic", price:4500, power:295, efficiency:8.4, discontinued:false, fuel:"가솔린" },
  { name:"기아 모하비", brand:"기아", segment:"대형SUV", type:"domestic", price:5000, power:262, efficiency:10.1, discontinued:false, fuel:"디젤" },
  { name:"제네시스 GV80", brand:"제네시스", segment:"대형SUV", type:"domestic", price:7500, power:304, efficiency:9.5, discontinued:false, fuel:"가솔린" },
  { name:"KG G4렉스턴", brand:"KG모빌리티", segment:"대형SUV", type:"domestic", price:4500, power:187, efficiency:10.5, discontinued:false, fuel:"디젤" },
  { name:"기아 카니발", brand:"기아", segment:"RV", type:"domestic", price:3800, power:202, efficiency:11.5, discontinued:false, fuel:"디젤" },
  { name:"현대 스타리아", brand:"현대", segment:"RV", type:"domestic", price:3400, power:177, efficiency:10.8, discontinued:false, fuel:"디젤" },
  { name:"제네시스 GV70", brand:"제네시스", segment:"SUV", type:"domestic", price:6000, power:304, efficiency:9.8, discontinued:false, fuel:"가솔린" },
  { name:"현대 아이오닉5", brand:"현대", segment:"전기", type:"domestic", price:5400, power:217, efficiency:0, discontinued:false, fuel:"전기" },
  { name:"현대 아이오닉6", brand:"현대", segment:"전기", type:"domestic", price:5400, power:229, efficiency:0, discontinued:false, fuel:"전기" },
  { name:"기아 EV6", brand:"기아", segment:"전기", type:"domestic", price:5600, power:229, efficiency:0, discontinued:false, fuel:"전기" },
  { name:"기아 EV9", brand:"기아", segment:"전기SUV", type:"domestic", price:8000, power:385, efficiency:0, discontinued:false, fuel:"전기" },
  { name:"제네시스 GV60", brand:"제네시스", segment:"전기SUV", type:"domestic", price:6500, power:429, efficiency:0, discontinued:false, fuel:"전기" },
  { name:"기아 니로 EV", brand:"기아", segment:"전기SUV", type:"domestic", price:4800, power:204, efficiency:0, discontinued:false, fuel:"전기" },
  { name:"BMW 3시리즈", brand:"BMW", segment:"중형", type:"import", price:5500, power:258, efficiency:11.6, discontinued:false, fuel:"가솔린" },
  { name:"BMW 5시리즈", brand:"BMW", segment:"대형", type:"import", price:8000, power:258, efficiency:11.3, discontinued:false, fuel:"가솔린" },
  { name:"BMW X3", brand:"BMW", segment:"중형SUV", type:"import", price:7000, power:190, efficiency:12.0, discontinued:false, fuel:"가솔린" },
  { name:"BMW X5", brand:"BMW", segment:"대형SUV", type:"import", price:10000, power:340, efficiency:10.0, discontinued:false, fuel:"가솔린" },
  { name:"벤츠 C클래스", brand:"벤츠", segment:"중형", type:"import", price:6500, power:258, efficiency:11.8, discontinued:false, fuel:"가솔린" },
  { name:"벤츠 E클래스", brand:"벤츠", segment:"대형", type:"import", price:9000, power:258, efficiency:11.5, discontinued:false, fuel:"가솔린" },
  { name:"벤츠 GLC", brand:"벤츠", segment:"중형SUV", type:"import", price:8500, power:258, efficiency:11.0, discontinued:false, fuel:"가솔린" },
  { name:"아우디 A4", brand:"아우디", segment:"중형", type:"import", price:5800, power:190, efficiency:12.0, discontinued:false, fuel:"가솔린" },
  { name:"아우디 Q5", brand:"아우디", segment:"중형SUV", type:"import", price:7500, power:265, efficiency:11.5, discontinued:false, fuel:"가솔린" },
  { name:"볼보 XC60", brand:"볼보", segment:"중형SUV", type:"import", price:8000, power:250, efficiency:11.0, discontinued:false, fuel:"가솔린" },
  { name:"테슬라 모델3", brand:"테슬라", segment:"전기", type:"import", price:6000, power:358, efficiency:0, discontinued:false, fuel:"전기" },
  { name:"테슬라 모델Y", brand:"테슬라", segment:"전기SUV", type:"import", price:7000, power:358, efficiency:0, discontinued:false, fuel:"전기" },
  { name:"렉서스 ES", brand:"렉서스", segment:"대형", type:"import", price:7000, power:218, efficiency:14.5, discontinued:false, fuel:"하이브리드" },
  { name:"포르쉐 카이엔", brand:"포르쉐", segment:"대형SUV", type:"import", price:14000, power:340, efficiency:9.5, discontinued:false, fuel:"가솔린" },
];

const RANK_KEYS = [
  { key:"popular", label:"종합 인기순" },
  { key:"price_asc", label:"가격 낮은순" },
  { key:"power", label:"출력 높은순" },
  { key:"efficiency", label:"연비 좋은순" },
];
const ORIGIN_OPTS = ["전체","국산","수입"];
const SEG_OPTS = ["전체","경차","소형SUV","준중형","중형","중형SUV","대형","대형SUV","전기","전기SUV","RV","SUV"];

function getScore(c: typeof ALL_CARS[0]) {
  const p = Math.max(0, 100 - c.price / 150);
  const pw = c.power / 8;
  const e = c.fuel === "전기" ? 50 : c.efficiency * 3;
  return Math.round((p + pw + e) / 3);
}

export default function RankingPage() {
  const [rankKey, setRankKey] = useState("popular");
  const [origin, setOrigin] = useState("전체");
  const [seg, setSeg] = useState("전체");
  const [excludeDisc, setExcludeDisc] = useState(true);

  const filtered = ALL_CARS.filter(c => {
    if (excludeDisc && c.discontinued) return false;
    if (origin === "국산" && c.type !== "domestic") return false;
    if (origin === "수입" && c.type !== "import") return false;
    if (seg !== "전체" && c.segment !== seg) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (rankKey === "price_asc") return a.price - b.price;
    if (rankKey === "power") return b.power - a.power;
    if (rankKey === "efficiency") return (b.fuel==="전기"?0:b.efficiency) - (a.fuel==="전기"?0:a.efficiency);
    return getScore(b) - getScore(a);
  });

  const medalBg = (i: number) => i===0?"#FFD700":i===1?"#C0C0C0":i===2?"#CD7F32":"";

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        .fb{border:1.5px solid #E0DDD7;border-radius:100px;padding:6px 14px;font-size:12px;font-weight:700;background:white;cursor:pointer;transition:all 0.12s;}
        .fb.on{border-color:#1A1A1A;background:#1A1A1A;color:white;}
        .rrow{background:white;border-radius:14px;padding:14px 18px;display:flex;align-items:center;gap:14px;transition:box-shadow 0.15s;}
        .rrow:hover{box-shadow:0 4px 16px rgba(0,0,0,0.07);}
      `}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#1A1A1A",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"900px",margin:"0 auto"}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF7A63",marginBottom:"10px"}}>CAR RANKING</div>
            <h1 style={{fontSize:"clamp(24px,4vw,44px)",fontWeight:800,color:"white",letterSpacing:"-1px",marginBottom:"6px"}}>자동차 랭킹표</h1>
            <p style={{fontSize:"14px",color:"rgba(255,255,255,0.4)",fontWeight:400}}>카탈로그 전체 차량 통합 순위 · 필터로 원하는 조건만 보기</p>
          </div>
        </div>

        <div style={{maxWidth:"900px",margin:"0 auto",padding:"24px 32px 80px"}}>
          <div style={{background:"white",borderRadius:"16px",padding:"18px 20px",marginBottom:"20px",display:"flex",flexDirection:"column",gap:"12px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
              <span style={{fontSize:"12px",fontWeight:800,color:"#888",minWidth:"56px"}}>정렬</span>
              {RANK_KEYS.map(r=><button key={r.key} className={`fb${rankKey===r.key?" on":""}`} onClick={()=>setRankKey(r.key)}>{r.label}</button>)}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
              <span style={{fontSize:"12px",fontWeight:800,color:"#888",minWidth:"56px"}}>기준</span>
              {ORIGIN_OPTS.map(o=><button key={o} className={`fb${origin===o?" on":""}`} onClick={()=>setOrigin(o)}>{o}</button>)}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
              <span style={{fontSize:"12px",fontWeight:800,color:"#888",minWidth:"56px"}}>세그먼트</span>
              {SEG_OPTS.map(s=><button key={s} className={`fb${seg===s?" on":""}`} onClick={()=>setSeg(s)}>{s}</button>)}
            </div>
            <label style={{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"13px",fontWeight:700}}>
              <input type="checkbox" checked={excludeDisc} onChange={e=>setExcludeDisc(e.target.checked)} style={{accentColor:"#FF3B1E"}}/>
              단종 모델 제외
            </label>
          </div>

          <div style={{fontSize:"13px",color:"#AAA",fontWeight:400,marginBottom:"12px"}}>{sorted.length}개 차량</div>

          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {sorted.map((car,i)=>(
              <div key={car.name} className="rrow">
                <div style={{width:"42px",textAlign:"center",flexShrink:0}}>
                  {i<3
                    ? <div style={{fontFamily:"'Bebas Neue',serif",fontSize:"28px",color:medalBg(i),lineHeight:1}}>{i+1}</div>
                    : <div style={{fontSize:"15px",fontWeight:800,color:"#CCC"}}>{i+1}</div>
                  }
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap",marginBottom:"3px"}}>
                    <span style={{fontSize:"16px",fontWeight:800}}>{car.name}</span>
                    <span style={{background:car.type==="import"?"#EEF2FF":"#EAF6EF",color:car.type==="import"?"#1847FF":"#2D8A52",padding:"2px 8px",borderRadius:"100px",fontSize:"11px",fontWeight:800}}>{car.type==="import"?"수입":"국산"}</span>
                    <span style={{background:"#F0EEE9",color:"#888",padding:"2px 8px",borderRadius:"100px",fontSize:"11px",fontWeight:700}}>{car.segment}</span>
                    {car.discontinued&&<span style={{background:"#F0EEE9",color:"#AAA",padding:"2px 8px",borderRadius:"100px",fontSize:"11px"}}>단종</span>}
                  </div>
                  <div style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>
                    {car.price.toLocaleString()}만원 · {car.power}마력 · {car.fuel==="전기"?"전기차":car.efficiency+"km/ℓ"} · {car.fuel}
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  {rankKey==="popular"&&<><div style={{fontSize:"22px",fontWeight:800,color:"#FF3B1E"}}>{getScore(car)}</div><div style={{fontSize:"11px",color:"#AAA"}}>종합점수</div></>}
                  {rankKey==="price_asc"&&<><div style={{fontSize:"20px",fontWeight:800,color:"#1847FF"}}>{car.price.toLocaleString()}</div><div style={{fontSize:"11px",color:"#AAA"}}>만원</div></>}
                  {rankKey==="power"&&<><div style={{fontSize:"20px",fontWeight:800,color:"#FF3B1E"}}>{car.power}</div><div style={{fontSize:"11px",color:"#AAA"}}>마력</div></>}
                  {rankKey==="efficiency"&&<><div style={{fontSize:"20px",fontWeight:800,color:"#2D8A52"}}>{car.fuel==="전기"?"-":car.efficiency}</div><div style={{fontSize:"11px",color:"#AAA"}}>{car.fuel==="전기"?"전기":"km/ℓ"}</div></>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
