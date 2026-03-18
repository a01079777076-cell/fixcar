"use client";

import { useState, useEffect } from "react";
import {
  Search, SlidersHorizontal, Lock, ArrowRight, Heart,
  LayoutGrid, List, Gauge, Fuel, MapPin, Shield, Car
} from "lucide-react";
import Navbar from "@/components/Navbar";

interface CarData {
  id: number;
  name: string;
  brand: string;
  year: number;
  mileage: number;
  fuel: string;
  color: string;
  region: string;
  price: number;
  accident: boolean;
  tags: string[];
  status: string;
  dealer: { shopName: string; rating: number; verified: boolean };
}

const FILTER_TABS = ["전체", "1000만원 이하", "초보 추천", "전기·하이브리드", "가족용 SUV"];

export default function CarsPage() {
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<"grid"|"list">("grid");
  const [searchVal, setSearchVal] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [likedCars, setLikedCars] = useState<number[]>([]);

  useEffect(() => {
    fetch(`/api/cars?sort=${sortBy}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCars(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sortBy]);

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedCars(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filtered = cars.filter(car => {
    if (activeTab === 1 && car.price > 1000) return false;
    if (activeTab === 2 && !car.tags.includes("초보 추천")) return false;
    if (activeTab === 3 && !["전기","하이브리드"].some(f => car.fuel.includes(f))) return false;
    if (searchVal && !car.name.toLowerCase().includes(searchVal.toLowerCase())) return false;
    return true;
  });

  const getCarImage = (car: CarData) => {
    const queries: Record<string, string> = {
      "아반떼": "hyundai+elantra+white+sedan",
      "K3": "kia+k3+silver+sedan",
      "투싼": "hyundai+tucson+suv",
      "아이오닉": "hyundai+ioniq5+electric",
      "엑센트": "hyundai+accent+small+car",
      "쏘렌토": "kia+sorento+suv",
      "쏘나타": "hyundai+sonata+sedan",
      "K5": "kia+k5+sedan",
    };
    const key = Object.keys(queries).find(k => car.name.includes(k));
    return `https://source.unsplash.com/600x400/?${key ? queries[key] : "car+sedan"}`;
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input, select { font-family:'NanumSquareRound',sans-serif; }
        .car-card { background:#fff; border-radius:20px; overflow:hidden; transition:all 0.25s; display:block; }
        .car-card:hover { transform:translateY(-5px); box-shadow:0 20px 50px rgba(0,0,0,0.1); }
        .car-card img { transition:transform 0.4s; display:block; }
        .car-card:hover img { transform:scale(1.05); }
        .filter-tab { cursor:pointer; transition:all 0.15s; white-space:nowrap; border:none; }
        .pick-btn:hover { background:#FF3B1E !important; color:white !important; }
        @media(max-width:1024px) { .layout-grid { grid-template-columns:1fr !important; } .sidebar { display:none !important; } .cars-grid { grid-template-columns:1fr 1fr !important; } }
        @media(max-width:600px) { .cars-grid { grid-template-columns:1fr !important; } .page-wrap { padding:16px !important; } }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <Navbar />

        {/* 페이지 헤더 */}
        <div style={{ background:"#1A1A1A", padding:"44px 52px 36px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"320px", height:"320px", background:"radial-gradient(circle,rgba(255,59,30,0.1),transparent 65%)", borderRadius:"50%" }} />
          <div style={{ maxWidth:"1360px", margin:"0 auto", position:"relative", zIndex:1 }}>
            <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#FF7A63", marginBottom:"10px" }}>FIND YOUR CAR</div>
            <h1 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:800, color:"white", letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:"8px" }}>
              광주 중고차 <span style={{ color:"#FF3B1E" }}>전체 매물</span>
            </h1>
            <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.4)", fontWeight:400 }}>모든 매물 FIX 정찰가 · 100항목 검수 완료</p>
          </div>
        </div>

        {/* 필터 */}
        <div style={{ background:"white", borderBottom:"1px solid #ECEAE4", position:"sticky", top:"68px", zIndex:90 }}>
          <div style={{ maxWidth:"1360px", margin:"0 auto", padding:"0 52px" }}>
            <div style={{ padding:"14px 0 0", display:"flex", gap:"10px", alignItems:"center" }}>
              <div style={{ flex:1, position:"relative", maxWidth:"360px" }}>
                <Search size={18} color="#AAA" style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)" }} />
                <input type="text" placeholder="차종 검색 (예: 아반떼, K5)" value={searchVal} onChange={e=>setSearchVal(e.target.value)} style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"11px 16px 11px 42px", fontSize:"14px", outline:"none", background:"#F8F6F2" }} />
              </div>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"11px 16px", fontSize:"14px", fontWeight:700, color:"#1A1A1A", background:"white", outline:"none" }}>
                <option value="createdAt">최신 등록순</option>
                <option value="price_asc">가격 낮은순</option>
                <option value="price_desc">가격 높은순</option>
                <option value="mileage">주행거리 낮은순</option>
                <option value="newest">최신 연식순</option>
              </select>
            </div>
            <div style={{ display:"flex", borderBottom:"2px solid #F0EEE9", overflowX:"auto" }}>
              {FILTER_TABS.map((tab,i)=>(
                <button key={tab} className="filter-tab" onClick={()=>setActiveTab(i)} style={{ padding:"14px 20px", fontSize:"14px", fontWeight:activeTab===i?800:600, color:activeTab===i?"#FF3B1E":"#888", background:"transparent", borderBottom:`3px solid ${activeTab===i?"#FF3B1E":"transparent"}`, marginBottom:"-2px" }}>{tab}</button>
              ))}
            </div>
          </div>
        </div>

        {/* 메인 */}
        <div className="page-wrap" style={{ maxWidth:"1360px", margin:"0 auto", padding:"28px 52px 80px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
            <div style={{ fontSize:"15px", fontWeight:700 }}>
              <span style={{ color:"#FF3B1E", fontWeight:800, fontSize:"18px" }}>{filtered.length}</span>대의 차량
            </div>
            <div style={{ display:"flex", gap:"6px" }}>
              <button onClick={()=>setViewMode("grid")} style={{ width:"38px", height:"38px", border:"1.5px solid", borderColor:viewMode==="grid"?"#1A1A1A":"#E0DDD7", borderRadius:"10px", background:viewMode==="grid"?"#1A1A1A":"#fff", color:viewMode==="grid"?"#fff":"#888", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><LayoutGrid size={16}/></button>
              <button onClick={()=>setViewMode("list")} style={{ width:"38px", height:"38px", border:"1.5px solid", borderColor:viewMode==="list"?"#1A1A1A":"#E0DDD7", borderRadius:"10px", background:viewMode==="list"?"#1A1A1A":"#fff", color:viewMode==="list"?"#fff":"#888", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><List size={16}/></button>
            </div>
          </div>

          {loading ? (
            <div className="cars-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"18px" }}>
              {[...Array(6)].map((_,i) => (
                <div key={i} style={{ background:"white", borderRadius:"20px", height:"320px", animation:"pulse 1.5s infinite" }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 20px" }}>
              <Car size={56} color="#E0DDD7" style={{ margin:"0 auto 20px" }} />
              <div style={{ fontSize:"22px", fontWeight:800, marginBottom:"8px" }}>조건에 맞는 차가 없어요</div>
              <div style={{ fontSize:"15px", color:"#AAA", fontWeight:400 }}>필터를 조정하거나 검색어를 바꿔보세요</div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="cars-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"18px" }}>
              {filtered.map(car => (
                <a key={car.id} href={`/cars/${car.id}`} className="car-card">
                  <div style={{ height:"192px", overflow:"hidden", position:"relative" }}>
                    <img src={getCarImage(car)} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={(e)=>{ const t=e.target as HTMLImageElement; t.style.display="none"; const p=t.parentElement; if(p&&!p.querySelector(".img-placeholder")){ p.style.background="#F0EEE9"; p.style.display="flex"; p.style.alignItems="center"; p.style.justifyContent="center"; const d=document.createElement("div"); d.className="img-placeholder"; d.style.cssText="text-align:center;padding:20px"; d.innerHTML="<div style=\"font-size:32px;margin-bottom:8px\">📸</div><div style=\"font-size:11px;color:#AAA;font-weight:700\">앗! 사진이 업데이트 전이에요!</div>"; p.appendChild(d); } }} />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.25))" }} />
                    <span style={{ position:"absolute", top:12, left:12, background:"#FF3B1E", color:"#fff", padding:"5px 12px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>
                      {car.tags[0] || "PICK"}
                    </span>
                    <button className="heart-btn" onClick={e=>toggleLike(e,car.id)} style={{ position:"absolute", top:10, right:10, width:"34px", height:"34px", background:likedCars.includes(car.id)?"#FF3B1E":"rgba(255,255,255,0.92)", border:"none", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Heart size={16} fill={likedCars.includes(car.id)?"white":"none"} color={likedCars.includes(car.id)?"white":"#1A1A1A"} />
                    </button>
                  </div>
                  <div style={{ padding:"16px 18px" }}>
                    <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"4px" }}>{car.name}</div>
                    <div style={{ fontSize:"12px", color:"#AAA", marginBottom:"12px", fontWeight:400 }}>
                      {car.year}년식 · {(car.mileage/1000).toFixed(0)}만km · {car.fuel} · {car.color}
                    </div>
                    <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"14px" }}>
                      {car.tags.slice(0,2).map(tag => (
                        <span key={tag} style={{ background:"#EAF6EF", border:"1px solid #B8DFC8", padding:"4px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:700, color:"#2D8A52" }}>✓ {tag}</span>
                      ))}
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", paddingTop:"12px", borderTop:"1px solid #F0EEE9" }}>
                      <div>
                        <div style={{ fontSize:"24px", fontWeight:800, letterSpacing:"-0.5px" }}>{car.price.toLocaleString()}<span style={{ fontSize:"13px", fontWeight:700, color:"#AAA" }}>만원</span></div>
                        <div style={{ fontSize:"11px", color:"#1847FF", fontWeight:800, marginTop:"3px", display:"flex", alignItems:"center", gap:"3px" }}><Lock size={10}/> FIX PRICE</div>
                      </div>
                      <button className="pick-btn" style={{ background:"#1A1A1A", color:"white", border:"none", padding:"10px 16px", borderRadius:"10px", fontSize:"12px", fontWeight:800, transition:"all 0.2s", display:"flex", alignItems:"center", gap:"5px" }}>
                        픽하기 <ArrowRight size={12}/>
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              {filtered.map(car => (
                <a key={car.id} href={`/cars/${car.id}`} style={{ background:"white", borderRadius:"16px", overflow:"hidden", display:"flex", transition:"all 0.2s" }}>
                  <div style={{ width:"220px", height:"160px", overflow:"hidden", flexShrink:0 }}>
                    <img src={getCarImage(car)} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} onError={(e)=>{ const t=e.target as HTMLImageElement; t.style.display="none"; const p=t.parentElement; if(p&&!p.querySelector(".img-placeholder")){ p.style.background="#F0EEE9"; p.style.display="flex"; p.style.alignItems="center"; p.style.justifyContent="center"; const d=document.createElement("div"); d.className="img-placeholder"; d.style.cssText="text-align:center;padding:20px"; d.innerHTML="<div style=\"font-size:32px;margin-bottom:8px\">📸</div><div style=\"font-size:11px;color:#AAA;font-weight:700\">앗! 사진이 업데이트 전이에요!</div>"; p.appendChild(d); } }} />
                  </div>
                  <div style={{ flex:1, padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"5px" }}>{car.name}</div>
                      <div style={{ fontSize:"13px", color:"#AAA", marginBottom:"12px", fontWeight:400 }}>
                        {car.year}년식 · {(car.mileage/1000).toFixed(0)}만km · {car.fuel} · {car.region}
                      </div>
                      <div style={{ display:"flex", gap:"12px" }}>
                        <span style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"13px", color:"#888", fontWeight:400 }}><Gauge size={14}/>{(car.mileage/1000).toFixed(0)}만km</span>
                        <span style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"13px", color:"#888", fontWeight:400 }}><Fuel size={14}/>{car.fuel}</span>
                        <span style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"13px", color:"#888", fontWeight:400 }}><MapPin size={14}/>{car.region}</span>
                        {!car.accident && <span style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"13px", color:"#2D8A52", fontWeight:700 }}><Shield size={14}/>무사고</span>}
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0, marginLeft:"20px" }}>
                      <div style={{ fontSize:"28px", fontWeight:800, letterSpacing:"-0.5px" }}>{car.price.toLocaleString()}<span style={{ fontSize:"14px", fontWeight:700, color:"#AAA" }}>만원</span></div>
                      <div style={{ fontSize:"12px", color:"#1847FF", fontWeight:800, marginBottom:"12px", display:"flex", alignItems:"center", gap:"3px", justifyContent:"flex-end" }}><Lock size={11}/> FIX PRICE</div>
                      <button className="pick-btn" style={{ background:"#1A1A1A", color:"white", border:"none", padding:"10px 20px", borderRadius:"10px", fontSize:"13px", fontWeight:800, transition:"all 0.2s", display:"flex", alignItems:"center", gap:"6px" }}>
                        픽하기 <ArrowRight size={14}/>
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        <a href="/quiz">
          <button style={{ position:"fixed", bottom:"28px", right:"28px", background:"#FF3B1E", color:"#fff", border:"none", borderRadius:"100px", padding:"14px 24px", fontSize:"14px", fontWeight:800, cursor:"pointer", boxShadow:"0 8px 28px rgba(255,59,30,0.4)", zIndex:150, display:"flex", alignItems:"center", gap:"8px" }}>
            내 차 추천받기 <ArrowRight size={16}/>
          </button>
        </a>
      </div>
    </>
  );
}
