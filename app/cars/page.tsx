"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface Car {
  id: string; title: string; price: number; year: number; mileage: number;
  fuelType: string; transmission: string; imageUrl?: string; images?: string[];
  status: string; isAccident: boolean; isPick: boolean; brand?: string; model?: string;
}

const BRANDS = ["전체","현대","기아","제네시스","BMW","벤츠","아우디","테슬라","볼보","토요타","렉서스","기타"];
const FUEL_TYPES = ["전체","가솔린","디젤","전기","하이브리드","LPG"];

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [brand, setBrand] = useState("전체");
  const [fuel, setFuel] = useState("전체");
  const [sort, setSort] = useState("latest");
  const [search, setSearch] = useState("");

  const fetchCars = useCallback(async (p: number, reset = false) => {
    try {
      const params = new URLSearchParams({ page: String(p), limit: "12", sort });
      if (brand !== "전체") params.set("brand", brand);
      if (fuel !== "전체") params.set("fuelType", fuel);
      if (search) params.set("search", search);
      const res = await fetch(`/api/cars?${params}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.cars || [];
      if (reset) setCars(list);
      else setCars(prev => [...prev, ...list]);
      setHasMore(list.length >= 12);
    } catch { setCars([]); }
    setLoading(false);
  }, [brand, fuel, sort, search]);

  useEffect(() => { setLoading(true); setPage(1); fetchCars(1, true); }, [fetchCars]);

  const loadMore = () => { const next = page + 1; setPage(next); fetchCars(next); };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        .car-card{transition:all 0.2s;}
        .car-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,0.1)!important;}
      `}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        {/* 헤더 */}
        <div style={{background:"#1A1A1A",padding:"36px 24px 28px"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:4,color:"#FF3B1E",marginBottom:6}}>FIX PRICE MARKET</div>
            <h1 style={{fontSize:28,fontWeight:800,color:"white",letterSpacing:-1,marginBottom:4}}>전체 매물</h1>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",fontWeight:400}}>FIX 정찰제 · 허위매물 0건 · 직접 검수한 매물만</p>
          </div>
        </div>

        <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 16px 120px"}}>
          {/* 필터 */}
          <div style={{background:"white",borderRadius:16,padding:"16px 18px",marginBottom:16,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
            {/* 검색 */}
            <div style={{position:"relative",marginBottom:12}}>
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:15,opacity:0.4}}>🔍</span>
              <input type="text" placeholder="차량명, 브랜드 검색" value={search} onChange={e=>setSearch(e.target.value)}
                style={{width:"100%",padding:"12px 12px 12px 38px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",background:"#FAFAF8"}}/>
            </div>
            {/* 브랜드 */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
              {BRANDS.map(b=>(
                <button key={b} onClick={()=>setBrand(b)} style={{
                  padding:"6px 14px",borderRadius:100,border:brand===b?"2px solid #FF3B1E":"1.5px solid #E0DDD7",
                  background:brand===b?"#FFF0ED":"white",color:brand===b?"#FF3B1E":"#777",
                  fontSize:12,fontWeight:brand===b?800:600,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",
                }}>{b}</button>
              ))}
            </div>
            {/* 연료+정렬 */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{display:"flex",gap:4,flex:1,flexWrap:"wrap"}}>
                {FUEL_TYPES.map(f=>(
                  <button key={f} onClick={()=>setFuel(f)} style={{
                    padding:"5px 12px",borderRadius:8,border:fuel===f?"1.5px solid #1A1A1A":"1px solid #E0DDD7",
                    background:fuel===f?"#1A1A1A":"transparent",color:fuel===f?"white":"#888",
                    fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",
                  }}>{f}</button>
                ))}
              </div>
              <select value={sort} onChange={e=>setSort(e.target.value)} style={{
                padding:"7px 12px",borderRadius:8,border:"1.5px solid #E0DDD7",fontSize:12,fontWeight:700,
                fontFamily:"'NanumSquareRound',sans-serif",color:"#555",background:"white",cursor:"pointer",
              }}>
                <option value="latest">최신순</option>
                <option value="priceLow">가격 낮은순</option>
                <option value="priceHigh">가격 높은순</option>
                <option value="mileageLow">주행거리 낮은순</option>
              </select>
            </div>
          </div>

          {/* 허위매물 0건 배너 */}
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"white",borderRadius:12,marginBottom:16}}>
            <span style={{width:28,height:28,borderRadius:"50%",background:"#E8F8EF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>✅</span>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:"#2D8A52"}}>허위 매물 0건</div>
              <div style={{fontSize:11,color:"#AAA",fontWeight:400}}>직접 검수한 매물만 등록</div>
            </div>
          </div>

          {/* 매물 그리드 - 개편: 사진 넓게 + 금액/버튼 위로 */}
          {loading ? (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",gap:16}}>
              {[1,2,3,4,5,6].map(i=>(
                <div key={i} style={{background:"white",borderRadius:18,overflow:"hidden"}}>
                  <div style={{height:220,background:"#E8E6E1"}}/>
                  <div style={{padding:16}}><div style={{height:14,background:"#E8E6E1",borderRadius:4,width:"60%"}}/></div>
                </div>
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div style={{textAlign:"center",padding:"80px 20px",color:"#AAA"}}>
              <div style={{fontSize:48,marginBottom:16}}>🚗</div>
              <p style={{fontSize:16,fontWeight:800}}>조건에 맞는 매물이 없어요</p>
              <p style={{fontSize:13,fontWeight:400,marginTop:6}}>필터를 변경해 보세요</p>
            </div>
          ) : (
            <>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",gap:16}}>
                {cars.map(car=>(
                  <Link key={car.id} href={`/cars/${car.id}`} style={{textDecoration:"none"}}>
                    <div className="car-card" style={{background:"white",borderRadius:18,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",cursor:"pointer"}}>
                      {/* 사진 - 넓게 변경 (기존 160px → 240px) */}
                      <div style={{position:"relative",height:240,background:"#F0EEE9",overflow:"hidden"}}>
                        {car.imageUrl || (car.images && car.images[0]) ? (
                          <img
                            src={car.imageUrl || car.images?.[0]}
                            alt={car.title}
                            style={{width:"100%",height:"100%",objectFit:"cover"}}
                          />
                        ) : (
                          <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#CCC"}}>
                            <span style={{fontSize:36,marginBottom:8}}>📷</span>
                            <span style={{fontSize:12,fontWeight:400}}>앗! 사진이 업데이트 전이에요!</span>
                          </div>
                        )}
                        {/* 뱃지 - 사진 위 */}
                        <div style={{position:"absolute",top:12,left:12,display:"flex",gap:6}}>
                          {car.isPick && (
                            <span style={{background:"#FF3B1E",color:"white",padding:"5px 12px",borderRadius:100,fontSize:11,fontWeight:800}}>✨ PICK 추천</span>
                          )}
                          {!car.isAccident && (
                            <span style={{background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",color:"white",padding:"5px 12px",borderRadius:100,fontSize:11,fontWeight:700}}>무사고</span>
                          )}
                        </div>
                        {/* 찜 버튼 */}
                        <button onClick={e=>{e.preventDefault();e.stopPropagation();}} style={{
                          position:"absolute",top:12,right:12,width:36,height:36,borderRadius:"50%",
                          background:"rgba(255,255,255,0.9)",border:"none",cursor:"pointer",
                          display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,
                        }}>🤍</button>
                      </div>

                      {/* 정보 영역 - 금액/버튼을 위로 */}
                      <div style={{padding:"16px 18px 18px"}}>
                        {/* 가격 + 픽하기 - 첫 줄 */}
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                          <div>
                            <span style={{fontSize:22,fontWeight:800,color:"#1A1A1A",letterSpacing:-0.5}}>{car.price?.toLocaleString()}</span>
                            <span style={{fontSize:12,color:"#AAA",fontWeight:700}}>만원</span>
                          </div>
                          <span style={{
                            background:"#1847FF",color:"white",padding:"8px 18px",borderRadius:100,
                            fontSize:12,fontWeight:800,
                          }}>픽하기 →</span>
                        </div>

                        {/* FIX PRICE 뱃지 */}
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                          <span style={{fontSize:10,fontWeight:800,color:"#1847FF",border:"1.5px solid #1847FF",padding:"3px 8px",borderRadius:6,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1}}>🔒 FIX PRICE</span>
                        </div>

                        {/* 차량명 */}
                        <div style={{fontSize:16,fontWeight:800,color:"#1A1A1A",marginBottom:4}}>{car.title}</div>

                        {/* 스펙 */}
                        <div style={{fontSize:12,color:"#AAA",fontWeight:400}}>
                          {car.year}년식 · {car.mileage?.toLocaleString()}km · {car.fuelType} · {car.transmission||"자동"}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 더보기 */}
              {hasMore && (
                <div style={{textAlign:"center",marginTop:24}}>
                  <button onClick={loadMore} style={{
                    padding:"14px 40px",background:"white",border:"2px solid #E0DDD7",borderRadius:12,
                    fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",color:"#555",
                  }}>더 보기 +</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
