"use client";

import { useState } from "react";
import {
  Plus, X, ChevronRight, Lock, Shield, Gauge, Fuel,
  Users, Wrench, Star, ArrowRight, CheckCircle, Car,
  DollarSign, Zap, BarChart2
} from "lucide-react";

const ALL_CARS = [
  { id:1, name:"현대 아반떼 CN7", brand:"현대", year:2021, mileage:32000, fuel:"가솔린", color:"흰색", region:"광주 북구", price:1450, monthly:29, accident:false, owners:1, efficiency:"15.2", cc:1598, power:123, transmission:"자동", score:96, tags:["무사고","초보 추천","1인 오너"], query:"hyundai+elantra+white+sedan", options:["후방카메라","열선시트","스마트크루즈","애플카플레이","LED 헤드램프"] },
  { id:2, name:"기아 K3", brand:"기아", year:2020, mileage:51000, fuel:"가솔린", color:"실버", region:"광주 서구", price:1090, monthly:22, accident:false, owners:1, efficiency:"13.8", cc:1591, power:128, transmission:"자동", score:89, tags:["무사고","가성비","1인 오너"], query:"kia+k3+silver+sedan", options:["후방카메라","스마트키","열선시트","LED 주간주행등"] },
  { id:3, name:"현대 투싼 NX4", brand:"현대", year:2022, mileage:28000, fuel:"가솔린", color:"검정", region:"광주 남구", price:2780, monthly:55, accident:false, owners:1, efficiency:"12.4", cc:1999, power:156, transmission:"자동", score:88, tags:["1인 오너","가족용","넓은 트렁크"], query:"hyundai+tucson+suv+black", options:["파노라마 선루프","BOSE 사운드","원격 주차보조","HDA2","열선시트"] },
  { id:5, name:"현대 아이오닉 5", brand:"현대", year:2022, mileage:22000, fuel:"전기", color:"그린", region:"광주 동구", price:3890, monthly:77, accident:false, owners:1, efficiency:"5.8", cc:0, power:217, transmission:"자동", score:91, tags:["무사고","전기차","1회충전 429km"], query:"hyundai+ioniq5+electric", options:["원격 스마트 주차보조","증강현실 HUD","V2L","14인치 듀얼스크린","히트펌프"] },
  { id:6, name:"현대 엑센트", brand:"현대", year:2019, mileage:68000, fuel:"가솔린", color:"흰색", region:"광주 북구", price:680, monthly:14, accident:false, owners:1, efficiency:"14.8", cc:1368, power:100, transmission:"자동", score:78, tags:["무사고","초보 추천","주차 쉬움"], query:"hyundai+accent+small+white", options:["후방카메라","스마트키","USB 충전"] },
  { id:8, name:"현대 쏘나타 DN8", brand:"현대", year:2021, mileage:41000, fuel:"가솔린", color:"흰색", region:"광주 남구", price:2100, monthly:42, accident:false, owners:1, efficiency:"13.5", cc:1999, power:160, transmission:"자동", score:85, tags:["무사고","초보 추천","넓은 실내"], query:"hyundai+sonata+white+sedan", options:["원격 스마트 주차보조","HDA","열선시트","9인치 내비","애플카플레이"] },
];

const COMPARE_ROWS = [
  { key:"price", label:"가격", unit:"만원", type:"number", better:"lower" },
  { key:"year", label:"연식", unit:"년식", type:"number", better:"higher" },
  { key:"mileage", label:"주행거리", unit:"km", type:"number", better:"lower" },
  { key:"efficiency", label:"연비", unit:"km/L", type:"number", better:"higher" },
  { key:"power", label:"최대출력", unit:"마력", type:"number", better:"higher" },
  { key:"cc", label:"배기량", unit:"cc", type:"number", better:"none" },
  { key:"fuel", label:"연료", type:"text", better:"none" },
  { key:"transmission", label:"변속기", type:"text", better:"none" },
  { key:"owners", label:"소유자 수", unit:"명", type:"number", better:"lower" },
  { key:"accident", label:"사고이력", type:"bool", better:"none" },
  { key:"region", label:"위치", type:"text", better:"none" },
];

type Car = typeof ALL_CARS[0];

export default function ComparePage() {
  const [selected, setSelected] = useState<Car[]>([ALL_CARS[0], ALL_CARS[1]]);
  const [showPicker, setShowPicker] = useState<number|null>(null);
  const [search, setSearch] = useState("");

  const addCar = (car: Car, slot: number) => {
    const next = [...selected];
    next[slot] = car;
    setSelected(next);
    setShowPicker(null);
    setSearch("");
  };

  const removeCar = (idx: number) => {
    setSelected(prev => prev.filter((_,i) => i !== idx));
  };

  const addSlot = () => {
    if (selected.length < 3) setShowPicker(selected.length);
  };

  const getValue = (car: Car, key: string) => {
    return (car as Record<string, unknown>)[key];
  };

  const getBestIdx = (key: string, better: string) => {
    if (better === "none" || selected.length < 2) return -1;
    const vals = selected.map(c => parseFloat(String(getValue(c, key))));
    if (better === "higher") return vals.indexOf(Math.max(...vals));
    if (better === "lower") return vals.indexOf(Math.min(...vals));
    return -1;
  };

  const filteredCars = ALL_CARS.filter(c =>
    !selected.find(s => s.id === c.id) &&
    (search === "" || c.name.toLowerCase().includes(search.toLowerCase()))
  );

  const SLOT_COLORS = ["#FF3B1E", "#1847FF", "#2D8A52"];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input { font-family:'NanumSquareRound',sans-serif; }
        .nav-link:hover { color:#1A1A1A !important; }
        .pick-card { transition:all 0.2s; cursor:pointer; }
        .pick-card:hover { border-color:#FF3B1E !important; transform:translateY(-2px); }
        .btn-red { background:#FF3B1E; color:white; border:none; border-radius:12px; font-size:14px; font-weight:800; padding:12px 22px; display:inline-flex; align-items:center; gap:8px; transition:all 0.2s; cursor:pointer; }
        .btn-red:hover { background:#D42E14; transform:translateY(-1px); }
        .row-hover:hover { background:#FAFAF8; }
        @media(max-width:1024px) {
          .compare-table { grid-template-columns:140px repeat(2,1fr) !important; }
          .nav-menu { display:none !important; }
        }
        @media(max-width:640px) {
          .page-wrap { padding:16px !important; }
          .compare-table { grid-template-columns:100px repeat(2,1fr) !important; font-size:13px !important; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>

        {/* 공지 바 */}
        <div style={{ background:"#1A1A1A", color:"#fff", textAlign:"center", padding:"10px", fontSize:"13px", fontWeight:700 }}>
          <span style={{ color:"#FF7A63" }}>PICK</span> 맘에 드는 차를 픽하세요 &nbsp;·&nbsp;
          <span style={{ color:"#7A9BFF" }}>FIX</span> 정찰제 — 흥정 없음
        </div>

        {/* 네비 */}
        <nav style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid #ECEAE4", height:"68px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 52px", position:"sticky", top:0, zIndex:100 }}>
          <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", letterSpacing:"3px" }}>
            <span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span>
          </a>
          <div className="nav-menu" style={{ display:"flex", gap:"36px" }}>
            {[["차 찾기","/cars"],["추천 퀴즈","/quiz"],["초보 가이드","/guide"],["내 차 팔기","/sell"]].map(([l,h])=>(
              <a key={l} href={h} className="nav-link" style={{ fontSize:"15px", fontWeight:700, color:"#888" }}>{l}</a>
            ))}
          </div>
          <a href="/quiz"><button className="btn-red" style={{ padding:"10px 22px", fontSize:"14px", borderRadius:"100px" }}>내 차 픽하기</button></a>
        </nav>

        {/* 페이지 헤더 */}
        <div style={{ background:"#1A1A1A", padding:"44px 52px 36px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"320px", height:"320px", background:"radial-gradient(circle,rgba(255,59,30,0.1),transparent 65%)", borderRadius:"50%" }} />
          <div style={{ maxWidth:"1360px", margin:"0 auto", position:"relative", zIndex:1 }}>
            <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#FF7A63", marginBottom:"10px" }}>COMPARE CARS</div>
            <h1 style={{ fontSize:"clamp(26px,4vw,48px)", fontWeight:800, color:"white", letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:"8px" }}>
              차량 <span style={{ color:"#FF3B1E" }}>나란히</span> 비교하기
            </h1>
            <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.4)", fontWeight:400 }}>최대 3대까지 비교할 수 있어요 · FIX 정찰가 비교</p>
          </div>
        </div>

        <div className="page-wrap" style={{ maxWidth:"1360px", margin:"0 auto", padding:"28px 52px 80px" }}>

          {/* ── 차량 선택 슬롯 ── */}
          <div style={{ display:"flex", gap:"16px", marginBottom:"28px", flexWrap:"wrap" }}>
            {selected.map((car, idx) => (
              <div key={car.id} style={{ flex:1, minWidth:"240px", background:"white", borderRadius:"20px", overflow:"hidden", border:`2px solid ${SLOT_COLORS[idx]}20` }}>
                <div style={{ height:"160px", overflow:"hidden", position:"relative" }}>
                  <img src={`https://source.unsplash.com/600x400/?${car.query}`} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4))" }} />
                  <div style={{ position:"absolute", top:10, left:10, background:SLOT_COLORS[idx], color:"white", padding:"4px 12px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{idx===0?"1순위":idx===1?"2순위":"3순위"}</div>
                  <button onClick={()=>removeCar(idx)} style={{ position:"absolute", top:10, right:10, width:"30px", height:"30px", background:"rgba(0,0,0,0.5)", border:"none", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <X size={14} color="white" />
                  </button>
                  <div style={{ position:"absolute", bottom:10, left:12, right:12 }}>
                    <div style={{ fontSize:"15px", fontWeight:800, color:"white" }}>{car.name}</div>
                    <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.7)", fontWeight:400 }}>{car.year}년식 · {(car.mileage/1000).toFixed(0)}만km</div>
                  </div>
                </div>
                <div style={{ padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:"22px", fontWeight:800, letterSpacing:"-0.5px" }}>{car.price.toLocaleString()}<span style={{ fontSize:"12px", color:"#AAA", fontWeight:700 }}>만원</span></div>
                    <div style={{ fontSize:"11px", color:"#1847FF", fontWeight:800, display:"flex", alignItems:"center", gap:"3px" }}><Lock size={10}/> FIX</div>
                  </div>
                  <button onClick={()=>setShowPicker(idx)} style={{ background:"#F0EEE9", border:"none", padding:"8px 14px", borderRadius:"9px", fontSize:"12px", fontWeight:700, color:"#555" }}>차 바꾸기</button>
                </div>
              </div>
            ))}

            {/* 추가 슬롯 */}
            {selected.length < 3 && (
              <div onClick={addSlot} className="pick-card" style={{ flex:1, minWidth:"240px", background:"white", borderRadius:"20px", border:"2px dashed #E0DDD7", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", minHeight:"220px" }}>
                <div style={{ width:"52px", height:"52px", background:"#F0EEE9", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"14px" }}>
                  <Plus size={24} color="#AAA" />
                </div>
                <div style={{ fontSize:"15px", fontWeight:800, color:"#555", marginBottom:"5px" }}>차량 추가</div>
                <div style={{ fontSize:"13px", color:"#AAA", fontWeight:400 }}>최대 3대까지 비교</div>
              </div>
            )}
          </div>

          {/* 차량 선택 피커 모달 */}
          {showPicker !== null && (
            <div onClick={(e)=>{ if(e.target===e.currentTarget) setShowPicker(null); }} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
              <div style={{ background:"white", borderRadius:"22px", width:"100%", maxWidth:"520px", overflow:"hidden" }}>
                <div style={{ padding:"22px 24px", borderBottom:"1px solid #F0EEE9" }}>
                  <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"12px" }}>비교할 차 선택</div>
                  <div style={{ position:"relative" }}>
                    <input type="text" placeholder="차종 검색 (예: 아반떼, K3)" value={search} onChange={e=>setSearch(e.target.value)} style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"12px 16px", fontSize:"14px", outline:"none", background:"#F8F6F2" }} />
                  </div>
                </div>
                <div style={{ maxHeight:"360px", overflowY:"auto" }}>
                  {filteredCars.length === 0 ? (
                    <div style={{ padding:"40px", textAlign:"center", color:"#AAA", fontSize:"15px", fontWeight:400 }}>검색 결과가 없어요</div>
                  ) : filteredCars.map(car => (
                    <div key={car.id} onClick={()=>addCar(car, showPicker)} style={{ display:"flex", gap:"14px", alignItems:"center", padding:"14px 24px", borderBottom:"1px solid #F0EEE9", cursor:"pointer", transition:"background 0.15s" }} className="row-hover">
                      <div style={{ width:"60px", height:"48px", borderRadius:"10px", overflow:"hidden", flexShrink:0 }}>
                        <img src={`https://source.unsplash.com/120x96/?${car.query}`} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"2px" }}>{car.name}</div>
                        <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{car.year}년식 · {(car.mileage/1000).toFixed(0)}만km · {car.fuel}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:"16px", fontWeight:800 }}>{car.price.toLocaleString()}만</div>
                        <div style={{ fontSize:"10px", color:"#1847FF", fontWeight:800 }}>🔒 FIX</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding:"16px 24px", borderTop:"1px solid #F0EEE9" }}>
                  <button onClick={()=>setShowPicker(null)} style={{ width:"100%", background:"#F0EEE9", border:"none", padding:"13px", borderRadius:"10px", fontSize:"14px", fontWeight:700, color:"#555" }}>취소</button>
                </div>
              </div>
            </div>
          )}

          {/* ── 비교 테이블 ── */}
          {selected.length >= 2 && (
            <div style={{ background:"white", borderRadius:"22px", overflow:"hidden", marginBottom:"28px" }}>

              {/* 테이블 헤더 */}
              <div className="compare-table" style={{ display:"grid", gridTemplateColumns:`180px ${selected.map(()=>"1fr").join(" ")}`, borderBottom:"2px solid #F0EEE9" }}>
                <div style={{ padding:"18px 22px", background:"#F8F6F2" }}>
                  <div style={{ fontSize:"13px", fontWeight:800, color:"#AAA" }}>항목</div>
                </div>
                {selected.map((car, idx) => (
                  <div key={car.id} style={{ padding:"18px 22px", borderLeft:"1px solid #F0EEE9", borderTop:`4px solid ${SLOT_COLORS[idx]}` }}>
                    <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"3px" }}>{car.name}</div>
                    <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{car.year}년식</div>
                  </div>
                ))}
              </div>

              {/* 픽스카 점수 */}
              <div className="compare-table row-hover" style={{ display:"grid", gridTemplateColumns:`180px ${selected.map(()=>"1fr").join(" ")}`, borderBottom:"1px solid #F0EEE9" }}>
                <div style={{ padding:"16px 22px", background:"#F8F6F2", display:"flex", alignItems:"center", gap:"8px" }}>
                  <BarChart2 size={16} color="#FF3B1E" />
                  <span style={{ fontSize:"13px", fontWeight:800 }}>픽스카 점수</span>
                </div>
                {selected.map((car, idx) => {
                  const best = [...selected].sort((a,b)=>b.score-a.score)[0].id === car.id;
                  return (
                    <div key={car.id} style={{ padding:"16px 22px", borderLeft:"1px solid #F0EEE9", display:"flex", alignItems:"center", gap:"10px" }}>
                      <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"32px", color:best?SLOT_COLORS[idx]:"#1A1A1A", letterSpacing:"0.5px" }}>{car.score}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ height:"6px", background:"#F0EEE9", borderRadius:"3px", overflow:"hidden" }}>
                          <div style={{ height:"6px", background:best?SLOT_COLORS[idx]:"#CCC", borderRadius:"3px", width:`${car.score}%`, transition:"width 0.6s" }} />
                        </div>
                        {best && <div style={{ fontSize:"10px", fontWeight:800, color:SLOT_COLORS[idx], marginTop:"3px" }}>⭐ 최고점</div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 데이터 행 */}
              {COMPARE_ROWS.map(row => {
                const bestIdx = getBestIdx(row.key, row.better);
                return (
                  <div key={row.key} className="compare-table row-hover" style={{ display:"grid", gridTemplateColumns:`180px ${selected.map(()=>"1fr").join(" ")}`, borderBottom:"1px solid #F0EEE9" }}>
                    <div style={{ padding:"15px 22px", background:"#F8F6F2", display:"flex", alignItems:"center" }}>
                      <span style={{ fontSize:"13px", fontWeight:800, color:"#555" }}>{row.label}</span>
                    </div>
                    {selected.map((car, idx) => {
                      const val = getValue(car, row.key);
                      const isBest = bestIdx === idx;
                      let display = "";
                      if (row.type==="bool") display = val ? "이력있음" : "무사고";
                      else if (row.key==="mileage") display = `${(Number(val)/1000).toFixed(0)}만km`;
                      else if (row.key==="cc") display = Number(val) === 0 ? "전기모터" : `${Number(val).toLocaleString()}cc`;
                      else if (row.unit) display = `${val}${row.unit}`;
                      else display = String(val);

                      return (
                        <div key={car.id} style={{ padding:"15px 22px", borderLeft:"1px solid #F0EEE9", display:"flex", alignItems:"center", gap:"8px", background:isBest?"#FFFBF8":"white" }}>
                          {isBest && <CheckCircle size={14} color={SLOT_COLORS[idx]} />}
                          <span style={{ fontSize:"14px", fontWeight:isBest?800:600, color: row.type==="bool" ? (val?"#E84A4A":"#2D8A52") : isBest?SLOT_COLORS[idx]:"#1A1A1A" }}>
                            {display}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* 옵션 비교 */}
              <div className="compare-table" style={{ display:"grid", gridTemplateColumns:`180px ${selected.map(()=>"1fr").join(" ")}`, borderBottom:"1px solid #F0EEE9" }}>
                <div style={{ padding:"16px 22px", background:"#F8F6F2", display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:"13px", fontWeight:800, color:"#555" }}>주요 옵션</span>
                </div>
                {selected.map(car => (
                  <div key={car.id} style={{ padding:"16px 22px", borderLeft:"1px solid #F0EEE9" }}>
                    <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
                      {car.options.map(opt => (
                        <div key={opt} style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"13px", color:"#2D8A52", fontWeight:600 }}>
                          <CheckCircle size={12} color="#2D8A52" /> {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 픽스 보증 */}
              <div className="compare-table" style={{ display:"grid", gridTemplateColumns:`180px ${selected.map(()=>"1fr").join(" ")}` }}>
                <div style={{ padding:"16px 22px", background:"#F8F6F2", display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:"13px", fontWeight:800, color:"#555" }}>픽스카 보장</span>
                </div>
                {selected.map(car => (
                  <div key={car.id} style={{ padding:"16px 22px", borderLeft:"1px solid #F0EEE9" }}>
                    {[["🔒 FIX 정찰가","흥정 없음"],["✅ 100항목 검수","전문가 직접"],["🔄 3일 환불","이유 불문"]].map(([t,s])=>(
                      <div key={t} style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"12px", color:"#555", fontWeight:600, marginBottom:"5px" }}>
                        {t} <span style={{ color:"#AAA", fontWeight:400 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 결론 카드 ── */}
          {selected.length >= 2 && (
            <div style={{ background:"#1A1A1A", borderRadius:"22px", padding:"32px", marginBottom:"28px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:"-15px", bottom:"-15px", fontFamily:"'Bebas Neue',serif", fontSize:"100px", color:"rgba(255,255,255,0.04)", lineHeight:1 }}>PICK</div>
              <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"2px", color:"#FF7A63", marginBottom:"10px" }}>픽스카 추천</div>
              <h2 style={{ fontSize:"clamp(20px,3vw,32px)", fontWeight:800, color:"white", letterSpacing:"-1px", marginBottom:"8px" }}>
                <span style={{ color:SLOT_COLORS[0] }}>{[...selected].sort((a,b)=>b.score-a.score)[0].name}</span>이<br />가장 좋은 선택이에요!
              </h2>
              <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.5)", fontWeight:400, marginBottom:"24px" }}>
                픽스카 점수 {[...selected].sort((a,b)=>b.score-a.score)[0].score}점 · 최고 점수
              </p>
              <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
                {selected.map((car, idx) => (
                  <a key={car.id} href={`/cars/${car.id}`}>
                    <button style={{ background: idx===0?SLOT_COLORS[0]:"rgba(255,255,255,0.1)", color:"white", border:`1.5px solid ${idx===0?SLOT_COLORS[0]:"rgba(255,255,255,0.2)"}`, padding:"12px 20px", borderRadius:"10px", fontSize:"13px", fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:"7px" }}>
                      {car.name} 자세히 보기 <ArrowRight size={14}/>
                    </button>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 추천 차량 */}
          <div>
            <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"16px" }}>다른 차도 비교해보세요</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" }}>
              {ALL_CARS.filter(c=>!selected.find(s=>s.id===c.id)).slice(0,4).map(car => (
                <div key={car.id} onClick={()=>{ if(selected.length<3){const next=[...selected,car]; setSelected(next);} else{setShowPicker(0);}}} className="pick-card" style={{ background:"white", borderRadius:"16px", overflow:"hidden", border:"2px solid #E0DDD7", cursor:"pointer" }}>
                  <div style={{ height:"110px", overflow:"hidden" }}>
                    <img src={`https://source.unsplash.com/400x280/?${car.query}`} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.3s" }} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
                  </div>
                  <div style={{ padding:"12px 14px" }}>
                    <div style={{ fontSize:"14px", fontWeight:800, marginBottom:"3px" }}>{car.name}</div>
                    <div style={{ fontSize:"12px", color:"#AAA", marginBottom:"8px", fontWeight:400 }}>{car.year}년식 · {car.fuel}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ fontSize:"16px", fontWeight:800 }}>{car.price.toLocaleString()}<span style={{ fontSize:"11px", color:"#AAA" }}>만원</span></div>
                      <div style={{ background:"#FFF0ED", color:"#FF3B1E", padding:"3px 8px", borderRadius:"6px", fontSize:"11px", fontWeight:800 }}>+ 비교</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
