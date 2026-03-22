"use client";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { CAR_SPECS, CAR_GRADES, BRAND_MODELS, CAR_HISTORY } from "@/data/catalog_data";
import { Trophy, Zap, Fuel, DollarSign, Gauge, ArrowRight, ChevronDown } from "lucide-react";

/* 타입 */
interface RankCar {
  name: string;
  brand: string;
  segment: string;
  bodyType: string;
  lowestPrice: number;
  highestPrice: number;
  bestEfficiency: string;
  bestPower: number;
  zeroToHundred: number;
  fuel: string;
  weight: number;
  status: string; /* 현행 / 단종 */
  yearStart: number; /* 판매 시작 연도 */
  yearEnd: number; /* 판매 종료 연도 (현행이면 2026) */
  origin: string; /* 국산 / 수입 */
}

/* 카탈로그에서 랭킹 데이터 추출 */
function buildRankData(): RankCar[] {
  const result: RankCar[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const specs = CAR_SPECS as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grades = CAR_GRADES as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const brands = BRAND_MODELS as any;

  /* 브랜드 + 상태 매핑 */
  const nameToBrand: Record<string,string> = {};
  const nameToStatus: Record<string,string> = {};
  const nameToOrigin: Record<string,string> = {};
  for (const [brand, info] of Object.entries(brands)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const m of (info as any).models || []) {
      nameToBrand[m.name] = brand;
      nameToStatus[m.name] = m.status || "";
      nameToOrigin[m.name] = (info as any).category || "국산";
    }
  }

  /* 히스토리에서 연도 추출 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const history = CAR_HISTORY as any;
  const nameToYears: Record<string,{start:number;end:number}> = {};
  for (const [hName, hList] of Object.entries(history)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const h of (hList as any[])) {
      const period = String(h.period || "");
      const years = period.match(/\d{4}/g);
      if (years) {
        const nums = years.map(Number);
        const isCurrentStr = period.includes("현재");
        for (const modelName of Object.keys(specs)) {
          if (modelName.includes(hName) || hName.includes(modelName.split(" ")[0])) {
            if (!nameToYears[modelName]) nameToYears[modelName] = { start: 9999, end: 0 };
            nameToYears[modelName].start = Math.min(nameToYears[modelName].start, Math.min(...nums));
            nameToYears[modelName].end = Math.max(nameToYears[modelName].end, isCurrentStr ? 2026 : Math.max(...nums));
          }
        }
      }
    }
  }

  for (const [name, spec] of Object.entries(specs)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s = spec as any;
    const gradeList = grades[name] || [];
    if (gradeList.length === 0) continue;

    const prices = gradeList.map((g: {price:number}) => g.price || 0).filter((p:number) => p > 0);
    const powers = gradeList.map((g: {power:string}) => parseFloat(g.power) || 0).filter((p:number) => p > 0);
    const efficiencies = gradeList.map((g: {efficiency:string}) => parseFloat(g.efficiency) || 0).filter((e:number) => e > 0);

    const zStr = String(s.zeroToHundred || "").replace("초","").trim();
    const z = parseFloat(zStr) || 99;

    const yInfo = nameToYears[name];
    const st = nameToStatus[name] || (yInfo && yInfo.end >= 2025 ? "현행" : "단종");

    result.push({
      name,
      brand: nameToBrand[name] || "",
      segment: s.segment || "",
      bodyType: s.bodyType || "",
      lowestPrice: prices.length > 0 ? Math.min(...prices) : 0,
      highestPrice: prices.length > 0 ? Math.max(...prices) : 0,
      bestEfficiency: efficiencies.length > 0 ? Math.max(...efficiencies).toFixed(1) : "0",
      bestPower: powers.length > 0 ? Math.max(...powers) : 0,
      zeroToHundred: z,
      fuel: s.fuel || "",
      weight: s.weight || 0,
      status: st,
      yearStart: yInfo?.start || 0,
      yearEnd: yInfo?.end || 0,
      origin: nameToOrigin[name] || "국산",
    });
  }
  return result;
}

const RANK_CATEGORIES = [
  { id:"cheapest", label:"최저가", icon:DollarSign, color:"#2D8A52", desc:"가장 저렴하게 시작하는 차", emoji:"💰" },
  { id:"expensive", label:"최고가", icon:Trophy, color:"#E8A020", desc:"가장 비싼 프리미엄 차", emoji:"👑" },
  { id:"efficiency", label:"연비왕", icon:Fuel, color:"#00C471", desc:"기름값 걱정 끝! 연비 최고", emoji:"⛽" },
  { id:"power", label:"최강마력", icon:Zap, color:"#FF3B1E", desc:"가장 강력한 파워 순위", emoji:"🔥" },
  { id:"zerotohundred", label:"제로백", icon:Gauge, color:"#1847FF", desc:"0→100km/h 가장 빠른 차", emoji:"⚡" },
  { id:"lightweight", label:"경량 순위", icon:Zap, color:"#9B30FF", desc:"가벼운 차체, 날렵한 주행", emoji:"🪶" },
];

const SEGMENTS = ["전체","경차","소형","준중형","중형","대형","SUV","쿠페","해치백","왜건","MPV","픽업"];

export default function RankingPage() {
  const [category, setCategory] = useState("cheapest");
  const [segment, setSegment] = useState("전체");
  const [showAll, setShowAll] = useState(false);
  const [excludeDiscontinued, setExcludeDiscontinued] = useState(false);
  const [minYear, setMinYear] = useState(2000);
  const [maxYear, setMaxYear] = useState(2026);
  const [origin, setOrigin] = useState("전체");

  const allCars = useMemo(() => buildRankData(), []);

  const filtered = useMemo(() => {
    let list = allCars.filter(c => c.lowestPrice > 0);
    if (segment !== "전체") {
      list = list.filter(c => c.segment === segment || c.bodyType === segment);
    }
    if (origin !== "전체") {
      list = list.filter(c => c.origin === origin);
    }
    if (excludeDiscontinued) {
      list = list.filter(c => c.status !== "단종");
    }
    list = list.filter(c => {
      if (c.yearStart === 0 && c.yearEnd === 0) return true;
      return c.yearEnd >= minYear && c.yearStart <= maxYear;
    });
    return list;
  }, [allCars, segment, origin, excludeDiscontinued, minYear, maxYear]);

  const ranked = useMemo(() => {
    const sorted = [...filtered];
    switch(category) {
      case "cheapest": sorted.sort((a,b) => a.lowestPrice - b.lowestPrice); break;
      case "expensive": sorted.sort((a,b) => b.highestPrice - a.highestPrice); break;
      case "efficiency": sorted.sort((a,b) => parseFloat(b.bestEfficiency) - parseFloat(a.bestEfficiency)); break;
      case "power": sorted.sort((a,b) => b.bestPower - a.bestPower); break;
      case "zerotohundred": sorted.sort((a,b) => a.zeroToHundred - b.zeroToHundred); break;
      case "lightweight": sorted.sort((a,b) => (a.weight||9999) - (b.weight||9999)); break;
    }
    return sorted;
  }, [filtered, category]);

  const display = showAll ? ranked : ranked.slice(0, 20);
  const cat = RANK_CATEGORIES.find(c => c.id === category)!;
  const medals = ["🥇","🥈","🥉"];

  const getValue = (car: RankCar) => {
    switch(category) {
      case "cheapest": return `${car.lowestPrice.toLocaleString()}만원~`;
      case "expensive": return `${car.highestPrice.toLocaleString()}만원`;
      case "efficiency": return `${car.bestEfficiency}km/ℓ`;
      case "power": return `${car.bestPower}PS`;
      case "zerotohundred": return car.zeroToHundred < 90 ? `${car.zeroToHundred}초` : "-";
      case "lightweight": return car.weight > 0 ? `${car.weight.toLocaleString()}kg` : "-";
      default: return "";
    }
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        .rank-row{transition:all 0.15s;} .rank-row:hover{background:#F8F7F4!important;}
        .cat-btn{transition:all 0.15s;} .cat-btn:hover{transform:translateY(-2px);}
      `}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        {/* 헤더 */}
        <div style={{background:"#1A1A1A",padding:"44px 24px 36px"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:4,color:"#FF3B1E",marginBottom:8}}>CAR RANKING</div>
            <h1 style={{fontSize:"clamp(24px,4vw,36px)",fontWeight:800,color:"white",marginBottom:6}}>자동차 랭킹</h1>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.4)",fontWeight:400}}>카탈로그 {Object.keys(CAR_SPECS).length}개 모델 기반 종합 순위</p>
          </div>
        </div>

        <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 16px 100px"}}>
          {/* 카테고리 선택 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:20}}>
            {RANK_CATEGORIES.map(c=>(
              <button key={c.id} className="cat-btn" onClick={()=>setCategory(c.id)} style={{
                padding:"16px 14px",borderRadius:16,border:category===c.id?`2px solid ${c.color}`:"1.5px solid #E8E6E1",
                background:category===c.id?"white":"white",textAlign:"left",
                boxShadow:category===c.id?`0 4px 16px ${c.color}22`:"none",
              }}>
                <div style={{fontSize:24,marginBottom:6}}>{c.emoji}</div>
                <div style={{fontSize:14,fontWeight:800,color:category===c.id?c.color:"#333"}}>{c.label}</div>
                <div style={{fontSize:11,color:"#AAA",fontWeight:400,marginTop:2}}>{c.desc}</div>
              </button>
            ))}
          </div>

          {/* 세그먼트 필터 */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
            {SEGMENTS.map(s=>(
              <button key={s} onClick={()=>setSegment(s)} style={{
                padding:"6px 14px",borderRadius:100,border:segment===s?`2px solid ${cat.color}`:"1.5px solid #E0DDD7",
                background:segment===s?"#1A1A1A":"white",color:segment===s?"white":"#888",
                fontSize:12,fontWeight:segment===s?800:500,
              }}>{s}</button>
            ))}
          </div>

          {/* 국산/수입 + 단종 제외 + 연식 필터 */}
          <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
            {/* 국산/수입 */}
            {(["전체","국산","수입"] as const).map(o=>(
              <button key={o} onClick={()=>setOrigin(o)} style={{
                padding:"8px 16px",borderRadius:100,fontSize:13,fontWeight:origin===o?800:600,
                border:origin===o?"2px solid #1847FF":"1.5px solid #E0DDD7",
                background:origin===o?"#EEF2FF":"white",
                color:origin===o?"#1847FF":"#888",cursor:"pointer",
                fontFamily:"'NanumSquareRound',sans-serif",
              }}>
                {o==="국산"?"🇰🇷 국산":o==="수입"?"🌍 수입":"전체"}
              </button>
            ))}

            <div style={{width:1,height:20,background:"#E0DDD7"}}/>

            <button onClick={()=>setExcludeDiscontinued(!excludeDiscontinued)} style={{
              padding:"8px 16px",borderRadius:100,fontSize:13,fontWeight:700,
              border:excludeDiscontinued?"2px solid #FF3B1E":"1.5px solid #E0DDD7",
              background:excludeDiscontinued?"#FFF0ED":"white",
              color:excludeDiscontinued?"#FF3B1E":"#888",cursor:"pointer",
              fontFamily:"'NanumSquareRound',sans-serif",
            }}>
              {excludeDiscontinued?"✓ ":""}단종 제외
            </button>

            <div style={{display:"flex",alignItems:"center",gap:8,background:"white",borderRadius:12,padding:"6px 14px",border:"1.5px solid #E0DDD7"}}>
              <span style={{fontSize:12,fontWeight:700,color:"#888"}}>연식</span>
              <select value={minYear} onChange={e=>setMinYear(Number(e.target.value))} style={{
                border:"none",fontSize:13,fontWeight:700,color:"#333",fontFamily:"'NanumSquareRound',sans-serif",
                background:"transparent",cursor:"pointer",
              }}>
                {Array.from({length:27},(_,i)=>2000+i).map(y=>(
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <span style={{fontSize:12,color:"#CCC"}}>~</span>
              <select value={maxYear} onChange={e=>setMaxYear(Number(e.target.value))} style={{
                border:"none",fontSize:13,fontWeight:700,color:"#333",fontFamily:"'NanumSquareRound',sans-serif",
                background:"transparent",cursor:"pointer",
              }}>
                {Array.from({length:27},(_,i)=>2000+i).map(y=>(
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 결과 수 */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:13,color:"#AAA"}}>총 {ranked.length}대</div>
            <div style={{fontSize:12,color:cat.color,fontWeight:800}}>{cat.emoji} {cat.label} 순</div>
          </div>

          {/* 랭킹 리스트 */}
          <div style={{background:"white",borderRadius:20,overflow:"hidden"}}>
            {/* TOP 3 강조 */}
            {display.slice(0,3).map((car,i)=>(
              <Link key={car.name} href={`/catalog?model=${encodeURIComponent(car.name)}`} style={{textDecoration:"none"}}>
                <div className="rank-row" style={{
                  padding:"20px 24px",display:"flex",alignItems:"center",gap:16,
                  borderBottom:"1px solid #F0EEE9",
                  background:i===0?"#FFFBF0":i===1?"#F8F9FF":"#FFF8F6",
                }}>
                  <div style={{fontSize:28,width:40,textAlign:"center",flexShrink:0}}>{medals[i]}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                      <span style={{fontSize:16,fontWeight:800}}>{car.name}</span>
                      <span style={{fontSize:11,color:"#AAA",fontWeight:400}}>{car.brand}</span>
                      {car.status==="단종"&&<span style={{fontSize:9,background:"#F0EEE9",color:"#AAA",padding:"2px 6px",borderRadius:4,fontWeight:700}}>단종</span>}
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {car.segment&&<span style={{fontSize:10,background:"#F0EEE9",padding:"2px 8px",borderRadius:100,color:"#888"}}>{car.segment}</span>}
                      {car.fuel&&<span style={{fontSize:10,background:"#F0EEE9",padding:"2px 8px",borderRadius:100,color:"#888"}}>{car.fuel}</span>}
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:18,fontWeight:800,color:cat.color}}>{getValue(car)}</div>
                  </div>
                  <ArrowRight size={14} color="#CCC"/>
                </div>
              </Link>
            ))}

            {/* 4위~ */}
            {display.slice(3).map((car,i)=>(
              <Link key={car.name} href={`/catalog?model=${encodeURIComponent(car.name)}`} style={{textDecoration:"none"}}>
                <div className="rank-row" style={{
                  padding:"14px 24px",display:"flex",alignItems:"center",gap:16,
                  borderBottom:"1px solid #F0EEE9",
                }}>
                  <div style={{fontSize:14,fontWeight:800,color:"#CCC",width:40,textAlign:"center",flexShrink:0}}>{i+4}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:14,fontWeight:700}}>{car.name}</span>
                      <span style={{fontSize:11,color:"#CCC"}}>{car.brand}</span>
                      {car.status==="단종"&&<span style={{fontSize:9,background:"#F0EEE9",color:"#AAA",padding:"2px 6px",borderRadius:4,fontWeight:700}}>단종</span>}
                    </div>
                  </div>
                  <div style={{fontSize:14,fontWeight:800,color:"#555"}}>{getValue(car)}</div>
                  <ArrowRight size={12} color="#DDD"/>
                </div>
              </Link>
            ))}
          </div>

          {/* 더보기 */}
          {!showAll && ranked.length > 20 && (
            <button onClick={()=>setShowAll(true)} style={{
              width:"100%",padding:"16px",background:"white",border:"1.5px solid #E0DDD7",
              borderRadius:14,fontSize:14,fontWeight:700,color:"#888",marginTop:12,
              display:"flex",alignItems:"center",justifyContent:"center",gap:6,
            }}>
              전체 {ranked.length}대 보기 <ChevronDown size={16}/>
            </button>
          )}

          {/* 종합 통계 카드 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,marginTop:28}}>
            {[
              {label:"등록 모델",value:`${Object.keys(CAR_SPECS).length}대`,color:"#1847FF"},
              {label:"최저가 모델",value:ranked.length>0&&category==="cheapest"?ranked[0].name:"",color:"#2D8A52"},
              {label:"연비 1위",value:(()=>{const e=[...allCars].sort((a,b)=>parseFloat(b.bestEfficiency)-parseFloat(a.bestEfficiency));return e[0]?`${e[0].name} (${e[0].bestEfficiency})`:""})(),color:"#00C471"},
              {label:"최강 마력",value:(()=>{const p=[...allCars].sort((a,b)=>b.bestPower-a.bestPower);return p[0]?`${p[0].name} (${p[0].bestPower}PS)`:""})(),color:"#FF3B1E"},
            ].map(stat=>(
              <div key={stat.label} style={{background:"white",borderRadius:16,padding:"20px 22px"}}>
                <div style={{fontSize:12,color:"#AAA",marginBottom:6}}>{stat.label}</div>
                <div style={{fontSize:15,fontWeight:800,color:stat.color}}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
