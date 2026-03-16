"use client";

import { useState } from "react";
import {
  Search, SlidersHorizontal, ChevronRight, Lock, Heart,
  Gauge, Fuel, MapPin, Users, Shield, ArrowRight,
  Car, LayoutGrid, List, ChevronDown
} from "lucide-react";

const ALL_CARS = [
  { id:1, name:"현대 아반떼 CN7", year:"2021년식", yearNum:2021, mileage:32000, fuel:"가솔린", color:"흰색", region:"광주 북구", price:1450, monthly:29, accident:false, owners:1, beginner:true, bodyType:"세단", badge:"이달의 PICK", badgeColor:"#FF3B1E", query:"hyundai+elantra+white+sedan", tags:["무사고","초보 추천"] },
  { id:2, name:"기아 K3", year:"2020년식", yearNum:2020, mileage:51000, fuel:"가솔린", color:"실버", region:"광주 서구", price:1090, monthly:22, accident:false, owners:1, beginner:true, bodyType:"세단", badge:"FIX 가성비", badgeColor:"#1847FF", query:"kia+k3+silver+sedan", tags:["무사고","가성비"] },
  { id:3, name:"현대 투싼 NX4", year:"2022년식", yearNum:2022, mileage:28000, fuel:"가솔린", color:"검정", region:"광주 남구", price:2780, monthly:55, accident:false, owners:1, beginner:false, bodyType:"SUV", badge:"가족 PICK", badgeColor:"#2D8A52", query:"hyundai+tucson+suv+black", tags:["1인 오너","가족용"] },
  { id:4, name:"기아 스팅어 GT", year:"2021년식", yearNum:2021, mileage:44000, fuel:"가솔린 터보", color:"블랙", region:"광주 광산구", price:3200, monthly:64, accident:false, owners:1, beginner:false, bodyType:"세단", badge:"신규 등록", badgeColor:"#1A1A1A", query:"kia+stinger+black+coupe", tags:["무사고","고성능"] },
  { id:5, name:"현대 아이오닉 5", year:"2022년식", yearNum:2022, mileage:22000, fuel:"전기", color:"그린", region:"광주 동구", price:3890, monthly:77, accident:false, owners:1, beginner:false, bodyType:"SUV", badge:"EV PICK", badgeColor:"#2D8A52", query:"hyundai+ioniq5+electric+car", tags:["무사고","전기차"] },
  { id:6, name:"현대 엑센트", year:"2019년식", yearNum:2019, mileage:68000, fuel:"가솔린", color:"흰색", region:"광주 북구", price:680, monthly:14, accident:false, owners:1, beginner:true, bodyType:"세단", badge:"초저가 PICK", badgeColor:"#E8A020", query:"hyundai+accent+small+white+car", tags:["무사고","초보 추천"] },
  { id:7, name:"기아 쏘렌토 MQ4", year:"2021년식", yearNum:2021, mileage:38000, fuel:"디젤", color:"실버", region:"광주 서구", price:3450, monthly:69, accident:false, owners:1, beginner:false, bodyType:"SUV", badge:"PICK 추천", badgeColor:"#FF3B1E", query:"kia+sorento+silver+suv", tags:["무사고","7인승"] },
  { id:8, name:"현대 쏘나타 DN8", year:"2021년식", yearNum:2021, mileage:41000, fuel:"가솔린", color:"흰색", region:"광주 남구", price:2100, monthly:42, accident:false, owners:1, beginner:true, bodyType:"세단", badge:"FIX 가격", badgeColor:"#1847FF", query:"hyundai+sonata+white+sedan", tags:["무사고","초보 추천"] },
  { id:9, name:"기아 K5 DL3", year:"2020년식", yearNum:2020, mileage:55000, fuel:"가솔린", color:"검정", region:"광주 광산구", price:1780, monthly:36, accident:false, owners:1, beginner:false, bodyType:"세단", badge:"가성비 PICK", badgeColor:"#E8A020", query:"kia+k5+black+sedan", tags:["무사고","1인 오너"] },
];

const FILTER_TABS = ["전체", "1000만원 이하", "초보 추천", "전기·하이브리드", "가족용 SUV", "주차 쉬운 차"];

export default function CarsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid"|"list">("grid");
  const [searchVal, setSearchVal] = useState("");
  const [priceMax, setPriceMax] = useState(5000);
  const [noAccident, setNoAccident] = useState(true);
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommend");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = ALL_CARS.filter(c => {
    if (activeTab === 1 && c.price > 1000) return false;
    if (activeTab === 2 && !c.beginner) return false;
    if (activeTab === 3 && !["전기","하이브리드"].some(f => c.fuel.includes(f))) return false;
    if (activeTab === 4 && c.bodyType !== "SUV") return false;
    if (activeTab === 5 && c.bodyType !== "세단") return false;
    if (noAccident && c.accident) return false;
    if (beginnerOnly && !c.beginner) return false;
    if (c.price > priceMax) return false;
    if (searchVal && !c.name.toLowerCase().includes(searchVal.toLowerCase())) return false;
    return true;
  }).sort((a,b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "mileage") return a.mileage - b.mileage;
    if (sortBy === "newest") return b.yearNum - a.yearNum;
    return 0;
  });

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); e.stopPropagation();
    setLiked(prev => prev.includes(id) ? prev.filter(i=>i!==id) : [...prev,id]);
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound','Noto Sans KR',sans-serif; background:#F0EEE9; color:#1A1A1A; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound','Noto Sans KR',sans-serif; }
        input, select { font-family:'NanumSquareRound','Noto Sans KR',sans-serif; }

        .nav-link:hover { color:#1A1A1A !important; }
        .filter-tab { cursor:pointer; transition:all 0.15s; white-space:nowrap; border:none; }
        .filter-tab:hover { color:#FF3B1E !important; }
        .filter-chip { cursor:pointer; transition:all 0.15s; border:none; }
        .filter-chip:hover { border-color:#1A1A1A !important; color:#1A1A1A !important; }
        .car-card { background:#fff; border-radius:20px; overflow:hidden; transition:all 0.25s; display:block; }
        .car-card:hover { transform:translateY(-5px); box-shadow:0 20px 50px rgba(0,0,0,0.1); }
        .car-card img { transition:transform 0.4s; display:block; }
        .car-card:hover img { transform:scale(1.05); }
        .car-list-card { background:#fff; border-radius:16px; overflow:hidden; transition:all 0.2s; display:flex; }
        .car-list-card:hover { box-shadow:0 10px 32px rgba(0,0,0,0.08); transform:translateY(-2px); }
        .pick-btn { transition:all 0.2s; }
        .pick-btn:hover { background:#FF3B1E !important; color:#fff !important; }
        .heart-btn { transition:all 0.2s; }
        .heart-btn:hover { transform:scale(1.15); }
        .sb-label:hover { color:#1A1A1A !important; }

        @media(max-width:1100px) {
          .layout-grid { grid-template-columns:1fr !important; }
          .sidebar { display:none !important; }
          .cars-grid { grid-template-columns:1fr 1fr !important; }
          .nav-menu { display:none !important; }
          .ph-right { display:none !important; }
        }
        @media(max-width:600px) {
          .cars-grid { grid-template-columns:1fr !important; }
          .page-wrap { padding:0 16px 60px !important; }
          .ph-wrap { padding:36px 20px 28px !important; }
          .filter-area { padding:0 16px !important; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>

        {/* 공지 바 */}
        <div style={{ background:"#1A1A1A", color:"#fff", textAlign:"center", padding:"10px 20px", fontSize:"13px", fontWeight:700 }}>
          <span style={{ color:"#FF7A63" }}>PICK</span> 맘에 드는 차를 픽하세요 &nbsp;·&nbsp;
          <span style={{ color:"#7A9BFF" }}>FIX</span> 정찰제 — 가격 흥정 없음 &nbsp;·&nbsp;
          ✓ 100항목 검수 &nbsp;·&nbsp; 3일 환불 보장
        </div>

        {/* 네비게이션 */}
        <nav style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid #ECEAE4", height:"68px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 52px", position:"sticky", top:0, zIndex:100 }}>
          <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", letterSpacing:"3px" }}>
            <span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span>
          </a>
          <div className="nav-menu" style={{ display:"flex", gap:"36px" }}>
            {[["차 찾기","/cars"],["추천 퀴즈","/quiz"],["초보 가이드","/guide"],["내 차 팔기","/sell"]].map(([l,h])=>(
              <a key={l} href={h} className="nav-link" style={{ fontSize:"15px", fontWeight: l==="차 찾기"?800:700, color: l==="차 찾기"?"#1A1A1A":"#888", borderBottom: l==="차 찾기"?"2px solid #FF3B1E":"none", paddingBottom: l==="차 찾기"?"2px":"0" }}>{l}</a>
            ))}
          </div>
          <div style={{ display:"flex", gap:"10px" }}>
            <button style={{ background:"transparent", border:"2px solid #E0DDD7", padding:"9px 22px", borderRadius:"100px", fontSize:"14px", fontWeight:700, cursor:"pointer" }}>로그인</button>
            <a href="/quiz"><button style={{ background:"#FF3B1E", color:"#fff", border:"none", padding:"10px 22px", borderRadius:"100px", fontSize:"14px", fontWeight:800, cursor:"pointer" }}>내 차 픽하기</button></a>
          </div>
        </nav>

        {/* 페이지 헤더 */}
        <div style={{ background:"#1A1A1A", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-100px", right:"-100px", width:"400px", height:"400px", background:"radial-gradient(circle, rgba(255,59,30,0.12), transparent 65%)", borderRadius:"50%", pointerEvents:"none" }} />
          <div className="ph-wrap" style={{ maxWidth:"1360px", margin:"0 auto", padding:"52px 52px 44px", display:"flex", alignItems:"flex-end", justifyContent:"space-between", position:"relative", zIndex:1 }}>
            <div>
              <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#FF7A63", marginBottom:"12px" }}>FIND YOUR CAR</div>
              <h1 style={{ fontSize:"clamp(28px,4.5vw,52px)", fontWeight:800, letterSpacing:"-1.5px", color:"#fff", lineHeight:1.1, marginBottom:"10px" }}>
                광주 중고차 <span style={{ color:"#FF3B1E" }}>전체 매물</span>
              </h1>
              <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.4)", fontWeight:400 }}>모든 매물 FIX 정찰가 · 100항목 검수 완료 · 3일 환불 보장</p>
            </div>
            <div className="ph-right" style={{ display:"flex", alignItems:"center", gap:"20px" }}>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"56px", color:"#FF3B1E", lineHeight:1 }}>2,418</div>
                <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.3)", fontWeight:400 }}>현재 등록 매물</div>
              </div>
              <a href="/quiz"><button style={{ background:"#FF3B1E", color:"#fff", border:"none", padding:"14px 26px", borderRadius:"14px", fontSize:"15px", fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:"8px" }}>3분 퀴즈로 추천받기 <ArrowRight size={16} /></button></a>
            </div>
          </div>
        </div>

        {/* 검색 + 필터 탭 */}
        <div style={{ background:"#fff", borderBottom:"1px solid #ECEAE4", position:"sticky", top:"68px", zIndex:90 }}>
          <div className="filter-area" style={{ maxWidth:"1360px", margin:"0 auto", padding:"0 52px" }}>
            {/* 검색바 */}
            <div style={{ padding:"16px 0 0", display:"flex", gap:"10px", alignItems:"center" }}>
              <div style={{ flex:1, position:"relative", maxWidth:"360px" }}>
                <Search size={18} color="#AAA" style={{ position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="차종 검색 (예: 아반떼, K5)"
                  value={searchVal}
                  onChange={e=>setSearchVal(e.target.value)}
                  style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"12px 16px 12px 44px", fontSize:"14px", outline:"none", background:"#F8F6F2" }}
                />
              </div>
              <button onClick={()=>setShowFilter(!showFilter)} style={{ display:"flex", alignItems:"center", gap:"8px", border:"1.5px solid #E0DDD7", background:"#fff", padding:"12px 20px", borderRadius:"10px", fontSize:"14px", fontWeight:700, cursor:"pointer" }}>
                <SlidersHorizontal size={16} /> 상세 필터 {showFilter ? <ChevronDown size={14}/> : <ChevronDown size={14}/>}
              </button>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"12px 16px", fontSize:"14px", fontWeight:700, color:"#1A1A1A", background:"#fff", cursor:"pointer", outline:"none" }}>
                <option value="recommend">추천순</option>
                <option value="price_asc">가격 낮은순</option>
                <option value="price_desc">가격 높은순</option>
                <option value="newest">최신 연식순</option>
                <option value="mileage">주행거리 낮은순</option>
              </select>
            </div>
            {/* 필터 탭 */}
            <div style={{ display:"flex", gap:"0", borderBottom:"2px solid #F0EEE9", overflowX:"auto" }}>
              {FILTER_TABS.map((tab,i)=>(
                <button key={tab} className="filter-tab" onClick={()=>setActiveTab(i)} style={{ padding:"14px 20px", fontSize:"14px", fontWeight:activeTab===i?800:600, color:activeTab===i?"#FF3B1E":"#888", background:"transparent", borderBottom:`3px solid ${activeTab===i?"#FF3B1E":"transparent"}`, marginBottom:"-2px" }}>{tab}</button>
              ))}
            </div>
            {/* 상세 필터 (토글) */}
            {showFilter && (
              <div style={{ padding:"16px 0", display:"flex", gap:"12px", flexWrap:"wrap", alignItems:"center" }}>
                <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"14px", fontWeight:700, cursor:"pointer" }}>
                  <input type="checkbox" checked={noAccident} onChange={e=>setNoAccident(e.target.checked)} style={{ width:"16px", height:"16px", accentColor:"#FF3B1E", cursor:"pointer" }} />
                  무사고만
                </label>
                <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"14px", fontWeight:700, cursor:"pointer" }}>
                  <input type="checkbox" checked={beginnerOnly} onChange={e=>setBeginnerOnly(e.target.checked)} style={{ width:"16px", height:"16px", accentColor:"#FF3B1E", cursor:"pointer" }} />
                  초보 추천만
                </label>
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginLeft:"8px" }}>
                  <span style={{ fontSize:"14px", fontWeight:700 }}>최대 가격</span>
                  <input type="range" min="500" max="5000" step="100" value={priceMax} onChange={e=>setPriceMax(parseInt(e.target.value))} style={{ accentColor:"#FF3B1E", width:"140px" }} />
                  <span style={{ fontSize:"14px", fontWeight:800, color:"#FF3B1E", minWidth:"80px" }}>{priceMax >= 5000 ? "5,000만원+" : `${priceMax.toLocaleString()}만원`}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 메인 레이아웃 */}
        <div className="page-wrap" style={{ maxWidth:"1360px", margin:"0 auto", padding:"28px 52px 80px" }}>
          <div className="layout-grid" style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:"28px", alignItems:"start" }}>

            {/* 사이드바 */}
            <aside className="sidebar" style={{ position:"sticky", top:"220px", background:"#fff", borderRadius:"20px", padding:"28px 24px" }}>
              <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"24px", display:"flex", alignItems:"center", gap:"8px" }}>
                <SlidersHorizontal size={18} /> 상세 필터
              </div>

              {/* 가격 */}
              <div style={{ marginBottom:"24px" }}>
                <div style={{ fontSize:"14px", fontWeight:800, marginBottom:"14px", display:"flex", justifyContent:"space-between" }}>
                  가격 범위 <span style={{ color:"#FF3B1E", fontWeight:700, fontSize:"13px", cursor:"pointer" }} onClick={()=>setPriceMax(5000)}>초기화</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"10px" }}>
                  <span style={{ fontSize:"14px", fontWeight:800 }}>0만원</span>
                  <span style={{ fontSize:"14px", fontWeight:800, color:"#FF3B1E" }}>{priceMax >= 5000 ? "5,000만원+" : `${priceMax.toLocaleString()}만원`}</span>
                </div>
                <input type="range" min="500" max="5000" step="100" value={priceMax} onChange={e=>setPriceMax(parseInt(e.target.value))} style={{ width:"100%", accentColor:"#FF3B1E", height:"4px" }} />
              </div>

              <div style={{ height:"1px", background:"#F0EEE9", marginBottom:"24px" }} />

              {/* 특수 조건 */}
              <div style={{ marginBottom:"24px" }}>
                <div style={{ fontSize:"14px", fontWeight:800, marginBottom:"14px" }}>특수 조건</div>
                {[
                  { label:"무사고 차량만", checked:noAccident, onChange:(v:boolean)=>setNoAccident(v) },
                  { label:"초보 추천 차량만", checked:beginnerOnly, onChange:(v:boolean)=>setBeginnerOnly(v) },
                ].map(item=>(
                  <label key={item.label} className="sb-label" style={{ display:"flex", alignItems:"center", gap:"10px", fontSize:"14px", color:"#555", padding:"6px 0", cursor:"pointer", fontWeight:400 }}>
                    <input type="checkbox" checked={item.checked} onChange={e=>item.onChange(e.target.checked)} style={{ width:"16px", height:"16px", accentColor:"#FF3B1E", cursor:"pointer" }} />
                    {item.label}
                  </label>
                ))}
              </div>

              <div style={{ height:"1px", background:"#F0EEE9", marginBottom:"24px" }} />

              {/* 연료 */}
              <div style={{ marginBottom:"24px" }}>
                <div style={{ fontSize:"14px", fontWeight:800, marginBottom:"14px" }}>연료</div>
                {[["가솔린","1,204"],["디젤","584"],["하이브리드","380"],["전기(EV)","142"]].map(([l,c])=>(
                  <label key={l} className="sb-label" style={{ display:"flex", alignItems:"center", gap:"10px", fontSize:"14px", color:"#555", padding:"6px 0", cursor:"pointer", fontWeight:400 }}>
                    <input type="checkbox" defaultChecked={l==="가솔린"} style={{ width:"16px", height:"16px", accentColor:"#FF3B1E", cursor:"pointer" }} />
                    {l} <span style={{ marginLeft:"auto", fontSize:"12px", color:"#CCC", fontWeight:400 }}>{c}</span>
                  </label>
                ))}
              </div>

              <div style={{ height:"1px", background:"#F0EEE9", marginBottom:"24px" }} />

              {/* 차종 */}
              <div>
                <div style={{ fontSize:"14px", fontWeight:800, marginBottom:"14px" }}>차종</div>
                {[["세단","782"],["SUV","891"],["해치백","234"],["쿠페","88"]].map(([l,c])=>(
                  <label key={l} className="sb-label" style={{ display:"flex", alignItems:"center", gap:"10px", fontSize:"14px", color:"#555", padding:"6px 0", cursor:"pointer", fontWeight:400 }}>
                    <input type="checkbox" defaultChecked={true} style={{ width:"16px", height:"16px", accentColor:"#FF3B1E", cursor:"pointer" }} />
                    {l} <span style={{ marginLeft:"auto", fontSize:"12px", color:"#CCC", fontWeight:400 }}>{c}</span>
                  </label>
                ))}
              </div>
            </aside>

            {/* 차량 목록 */}
            <div>
              {/* 툴바 */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"22px" }}>
                <div style={{ fontSize:"15px", fontWeight:700 }}>
                  <span style={{ color:"#FF3B1E", fontWeight:800, fontSize:"18px" }}>{filtered.length}</span>대의 차량
                </div>
                <div style={{ display:"flex", gap:"6px" }}>
                  <button onClick={()=>setViewMode("grid")} style={{ width:"38px", height:"38px", border:"1.5px solid", borderColor:viewMode==="grid"?"#1A1A1A":"#E0DDD7", borderRadius:"10px", background:viewMode==="grid"?"#1A1A1A":"#fff", color:viewMode==="grid"?"#fff":"#888", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><LayoutGrid size={16} /></button>
                  <button onClick={()=>setViewMode("list")} style={{ width:"38px", height:"38px", border:"1.5px solid", borderColor:viewMode==="list"?"#1A1A1A":"#E0DDD7", borderRadius:"10px", background:viewMode==="list"?"#1A1A1A":"#fff", color:viewMode==="list"?"#fff":"#888", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><List size={16} /></button>
                </div>
              </div>

              {/* 그리드 뷰 */}
              {viewMode === "grid" && (
                <div className="cars-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"18px" }}>
                  {filtered.map(car=>(
                    <a key={car.id} href={`/cars/${car.id}`} className="car-card">
                      <div style={{ height:"192px", overflow:"hidden", position:"relative" }}>
                        <img src={`https://source.unsplash.com/600x400/?${car.query}`} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.25))" }} />
                        <span style={{ position:"absolute", top:12, left:12, background:car.badgeColor, color:"#fff", padding:"5px 12px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{car.badge}</span>
                        <button className="heart-btn" onClick={e=>toggleLike(e,car.id)} style={{ position:"absolute", top:10, right:10, width:"34px", height:"34px", background:liked.includes(car.id)?"#FF3B1E":"rgba(255,255,255,0.92)", border:"none", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <Heart size={16} fill={liked.includes(car.id)?"white":"none"} color={liked.includes(car.id)?"white":"#1A1A1A"} />
                        </button>
                      </div>
                      <div style={{ padding:"16px 18px" }}>
                        <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"4px" }}>{car.name}</div>
                        <div style={{ fontSize:"12px", color:"#AAA", marginBottom:"12px", fontWeight:400 }}>
                          {car.year} · {(car.mileage/1000).toFixed(0)}만km · {car.fuel} · {car.color}
                        </div>
                        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"14px" }}>
                          {car.tags.map(tag=>(
                            <span key={tag} style={{ background:"#EAF6EF", border:"1px solid #B8DFC8", padding:"4px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:700, color:"#2D8A52" }}>✓ {tag}</span>
                          ))}
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", paddingTop:"12px", borderTop:"1px solid #F0EEE9" }}>
                          <div>
                            <div style={{ fontSize:"24px", fontWeight:800, letterSpacing:"-0.5px" }}>{car.price.toLocaleString()}<span style={{ fontSize:"13px", fontWeight:700, color:"#AAA" }}>만원</span></div>
                            <div style={{ fontSize:"11px", color:"#1847FF", fontWeight:800, marginTop:"3px", display:"flex", alignItems:"center", gap:"4px" }}><Lock size={10} /> FIX · 월 {car.monthly}만원~</div>
                          </div>
                          <button className="pick-btn" style={{ background:"#1A1A1A", color:"#fff", border:"none", padding:"10px 16px", borderRadius:"10px", fontSize:"12px", fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:"6px" }}>픽하기 <ArrowRight size={12} /></button>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* 리스트 뷰 */}
              {viewMode === "list" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                  {filtered.map(car=>(
                    <a key={car.id} href={`/cars/${car.id}`} className="car-list-card">
                      <div style={{ width:"220px", height:"160px", overflow:"hidden", flexShrink:0, position:"relative" }}>
                        <img src={`https://source.unsplash.com/440x320/?${car.query}`} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.3s" }} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
                        <span style={{ position:"absolute", top:10, left:10, background:car.badgeColor, color:"#fff", padding:"4px 10px", borderRadius:"100px", fontSize:"10px", fontWeight:800 }}>{car.badge}</span>
                      </div>
                      <div style={{ flex:1, padding:"18px 22px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"5px" }}>{car.name}</div>
                          <div style={{ fontSize:"13px", color:"#AAA", marginBottom:"12px", fontWeight:400 }}>
                            {car.year} · {(car.mileage/1000).toFixed(0)}만km · {car.fuel} · {car.region}
                          </div>
                          <div style={{ display:"flex", gap:"8px" }}>
                            <span style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"13px", color:"#888", fontWeight:400 }}><Gauge size={14} />{(car.mileage/1000).toFixed(0)}만km</span>
                            <span style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"13px", color:"#888", fontWeight:400 }}><Fuel size={14} />{car.fuel}</span>
                            <span style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"13px", color:"#888", fontWeight:400 }}><MapPin size={14} />{car.region}</span>
                            {!car.accident && <span style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"13px", color:"#2D8A52", fontWeight:700 }}><Shield size={14} />무사고</span>}
                          </div>
                        </div>
                        <div style={{ textAlign:"right", flexShrink:0, marginLeft:"20px" }}>
                          <div style={{ fontSize:"28px", fontWeight:800, letterSpacing:"-0.5px" }}>{car.price.toLocaleString()}<span style={{ fontSize:"14px", fontWeight:700, color:"#AAA" }}>만원</span></div>
                          <div style={{ fontSize:"12px", color:"#1847FF", fontWeight:800, marginBottom:"12px", display:"flex", alignItems:"center", gap:"4px", justifyContent:"flex-end" }}><Lock size={11} /> FIX PRICE</div>
                          <button className="pick-btn" style={{ background:"#1A1A1A", color:"#fff", border:"none", padding:"10px 20px", borderRadius:"10px", fontSize:"13px", fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:"6px" }}>픽하기 <ArrowRight size={14} /></button>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {filtered.length === 0 && (
                <div style={{ textAlign:"center", padding:"80px 20px" }}>
                  <Car size={56} color="#E0DDD7" style={{ margin:"0 auto 20px" }} />
                  <div style={{ fontSize:"22px", fontWeight:800, marginBottom:"8px" }}>조건에 맞는 차가 없어요</div>
                  <div style={{ fontSize:"15px", color:"#AAA", marginBottom:"24px", fontWeight:400 }}>필터를 조정하거나 검색어를 바꿔보세요</div>
                  <button onClick={()=>{setActiveTab(0); setNoAccident(false); setBeginnerOnly(false); setPriceMax(5000); setSearchVal("");}} style={{ background:"#FF3B1E", color:"#fff", border:"none", padding:"14px 28px", borderRadius:"12px", fontSize:"15px", fontWeight:800, cursor:"pointer" }}>전체 매물 보기</button>
                </div>
              )}

              {/* 페이지네이션 */}
              {filtered.length > 0 && (
                <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginTop:"44px" }}>
                  {["‹","1","2","3","4","5","›"].map((p,i)=>(
                    <button key={i} style={{ width:"40px", height:"40px", border:"1.5px solid", borderColor:i===1?"#FF3B1E":"#E0DDD7", borderRadius:"10px", background:i===1?"#FF3B1E":"#fff", color:i===1?"#fff":"#555", fontSize:"14px", fontWeight:700, cursor:"pointer" }}>{p}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 플로팅 퀴즈 버튼 */}
        <a href="/quiz">
          <button style={{ position:"fixed", bottom:"28px", right:"28px", background:"#FF3B1E", color:"#fff", border:"none", borderRadius:"100px", padding:"14px 24px", fontSize:"14px", fontWeight:800, cursor:"pointer", boxShadow:"0 8px 28px rgba(255,59,30,0.4)", zIndex:150, display:"flex", alignItems:"center", gap:"8px" }}>
            내 차 추천받기 <ArrowRight size={16} />
          </button>
        </a>

      </div>
    </>
  );
}
