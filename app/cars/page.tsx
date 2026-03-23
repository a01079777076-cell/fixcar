"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface Car {
  id:string; title?:string; name?:string; price:number; year:number; mileage:number;
  fuelType?:string; fuel?:string; transmission?:string; imageUrl?:string; images?:string[];
  status?:string; isAccident?:boolean; isPick?:boolean; brand?:string; model?:string;
  tags?:string[]; color?:string; region?:string; description?:string;
}

const BRANDS=["전체","현대","기아","제네시스","쉐보레","르노","KG모빌리티","BMW","벤츠","아우디","폭스바겐","볼보","테슬라","토요타","렉서스","혼다","포르쉐","기타"];
const BRAND_MODELS: Record<string,string[]> = {
  "현대":["아반떼","쏘나타","그랜저","투싼","싼타페","팰리세이드","코나","베뉴","캐스퍼","아이오닉5","아이오닉6","스타리아","포터","벨로스터"],
  "기아":["K3","K5","K8","K9","셀토스","스포티지","쏘렌토","카니발","모닝","레이","EV6","EV9","니로","스팅어"],
  "제네시스":["G70","G80","G90","GV60","GV70","GV80"],
  "쉐보레":["스파크","말리부","트레일블레이저","이쿼녹스","트래버스","콜로라도","타호"],
  "르노":["SM6","XM3","QM6","마스터","아르카나"],
  "KG모빌리티":["티볼리","코란도","렉스턴","토레스","액티언"],
  "BMW":["1시리즈","3시리즈","5시리즈","7시리즈","X1","X3","X5","X7","iX","i4","M3","M4","M5"],
  "벤츠":["A클래스","C클래스","E클래스","S클래스","GLA","GLC","GLE","GLS","EQE","EQS","AMG GT"],
  "아우디":["A3","A4","A6","A8","Q3","Q5","Q7","Q8","e-tron","RS3","RS5"],
  "폭스바겐":["골프","티구안","투아렉","ID.4","아테온","폴로"],
  "볼보":["S60","S90","XC40","XC60","XC90","EX30","EX90"],
  "테슬라":["모델3","모델Y","모델S","모델X"],
  "토요타":["캠리","프리우스","RAV4","하이랜더","랜드크루저","GR86"],
  "렉서스":["ES","IS","LS","NX","RX","UX","LC","LFA"],
  "혼다":["시빅","어코드","CR-V","HR-V"],
  "포르쉐":["911","카이엔","마칸","파나메라","타이칸","박스터","케이맨"],
};
const FUELS=["전체","가솔린","디젤","전기","하이브리드","LPG"];
const PRICES=[{l:"전체",min:0,max:99999},{l:"~500만",min:0,max:500},{l:"500~1000만",min:500,max:1000},{l:"1000~2000만",min:1000,max:2000},{l:"2000~3000만",min:2000,max:3000},{l:"3000~5000만",min:3000,max:5000},{l:"5000만~",min:5000,max:99999}];
const YEARS=[{l:"전체",min:0,max:2030},{l:"2024~",min:2024,max:2030},{l:"2022~2023",min:2022,max:2023},{l:"2020~2021",min:2020,max:2021},{l:"2018~2019",min:2018,max:2019},{l:"~2017",min:2000,max:2017}];
const MILES=[{l:"전체",min:0,max:9999999},{l:"~1만km",min:0,max:10000},{l:"1~3만km",min:10000,max:30000},{l:"3~5만km",min:30000,max:50000},{l:"5~10만km",min:50000,max:100000},{l:"10만km~",min:100000,max:9999999}];

export default function CarsPage(){
  const [cars,setCars]=useState<Car[]>([]);
  const [loading,setLoading]=useState(true);
  const [brand,setBrand]=useState("전체");
  const [model,setModel]=useState("전체");
  const [fuel,setFuel]=useState("전체");
  const [priceR,setPriceR]=useState(PRICES[0]);
  const [yearR,setYearR]=useState(YEARS[0]);
  const [mileR,setMileR]=useState(MILES[0]);
  const [sort,setSort]=useState("latest");
  const [search,setSearch]=useState("");
  const [favs,setFavs]=useState<Set<string>>(new Set());
  const [view,setView]=useState<"grid"|"list">("list");
  const [mobFilter,setMobFilter]=useState(false);
  const [showCalc,setShowCalc]=useState(false);
  const [calcPrice,setCalcPrice]=useState("2000");
  const [calcDown,setCalcDown]=useState("300");
  const [calcMonths,setCalcMonths]=useState("36");
  const [calcRate,setCalcRate]=useState("6");

  useEffect(()=>{
    fetch("/api/cars?limit=200").then(r=>r.json()).then(d=>{setCars(Array.isArray(d)?d:d.cars||[]);setLoading(false);}).catch(()=>{setCars([]);setLoading(false);});
fetch("/api/cars?limit=200").then(r=>r.json()).then(d=>{setCars(Array.isArray(d)?d:d.data||d.cars||[]);  },[]);

  const filtered=cars.filter(c=>{
    const cn=(c.title||c.name||"").toLowerCase();
    const cb=(c.brand||cn.split(" ")[0]||"").toLowerCase();
    const cf=(c.fuelType||c.fuel||"");
    if(search&&!cn.includes(search.toLowerCase())&&!cb.includes(search.toLowerCase()))return false;
    if(brand!=="전체"&&!cb.includes(brand.toLowerCase())&&!cn.includes(brand))return false;
    if(model!=="전체"&&!cn.includes(model.toLowerCase()))return false;
    if(fuel!=="전체"&&!cf.includes(fuel))return false;
    if(c.price<priceR.min||c.price>priceR.max)return false;
    if(c.year<yearR.min||c.year>yearR.max)return false;
    if(c.mileage<mileR.min||c.mileage>mileR.max)return false;
    return true;
  }).sort((a,b)=>{
    if(sort==="priceLow")return a.price-b.price;
    if(sort==="priceHigh")return b.price-a.price;
    if(sort==="mileageLow")return a.mileage-b.mileage;
    if(sort==="yearNew")return b.year-a.year;
    return 0;
  });

  const toggleFav=async(carId:string,e:React.MouseEvent)=>{
    e.preventDefault();e.stopPropagation();
    const isFav=favs.has(carId);
    try{
      if(isFav){await fetch("/api/favorites",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({carId})});setFavs(p=>{const n=new Set(p);n.delete(carId);return n;});}
      else{const r=await fetch("/api/favorites",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({carId})});if(r.status===401){alert("로그인이 필요해요!");return;}setFavs(p=>new Set(p).add(carId));}
    }catch{alert("로그인이 필요해요!");}
  };

  const activeF=[brand!=="전체",model!=="전체",fuel!=="전체",priceR.l!=="전체",yearR.l!=="전체",mileR.l!=="전체"].filter(Boolean).length;
  const resetF=()=>{setBrand("전체");setModel("전체");setFuel("전체");setPriceR(PRICES[0]);setYearR(YEARS[0]);setMileR(MILES[0]);};

  /* 필터 섹션 공통 렌더 */
  const FilterPanel=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {/* 브랜드 */}
      <div>
        <div style={{fontSize:13,fontWeight:800,marginBottom:10,color:"#1A1A1A"}}>차종</div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {BRANDS.map(b=>(
            <div key={b}>
              <button onClick={()=>{setBrand(b);setModel("전체");}} style={{
                padding:"9px 0",textAlign:"left",border:"none",background:"transparent",
                fontSize:13,fontWeight:brand===b?800:400,color:brand===b?"#FF3B1E":"#666",
                cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",width:"100%",
                borderBottom:"1px solid #F0EEE9",display:"flex",justifyContent:"space-between",
              }}>
                <span>{b}</span>
                {b!=="전체"&&<span style={{fontSize:11,color:"#CCC"}}>{cars.filter(c=>(c.brand||c.title||c.name||"").includes(b)).length}</span>}
              </button>
              {/* 선택된 브랜드의 모델 목록 */}
              {brand===b&&b!=="전체"&&BRAND_MODELS[b]&&(
                <div style={{paddingLeft:14,background:"#FAFAF8",borderBottom:"1px solid #F0EEE9"}}>
                  <button onClick={()=>setModel("전체")} style={{padding:"7px 0",textAlign:"left",border:"none",background:"transparent",fontSize:12,fontWeight:model==="전체"?800:400,color:model==="전체"?"#1847FF":"#999",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",width:"100%"}}>전체 {b}</button>
                  {BRAND_MODELS[b].map(m=>(
                    <button key={m} onClick={()=>setModel(m)} style={{padding:"7px 0",textAlign:"left",border:"none",background:"transparent",fontSize:12,fontWeight:model===m?800:400,color:model===m?"#1847FF":"#999",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",width:"100%",borderTop:"1px solid #F0EEE9"}}>
                      {m} <span style={{fontSize:10,color:"#DDD"}}>{cars.filter(c=>(c.title||c.name||"").toLowerCase().includes(m.toLowerCase())).length}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* 연식 */}
      <div>
        <div style={{fontSize:13,fontWeight:800,marginBottom:10,color:"#1A1A1A"}}>연식</div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {YEARS.map(y=>(
            <button key={y.l} onClick={()=>setYearR(y)} style={{padding:"8px 0",textAlign:"left",border:"none",background:"transparent",fontSize:13,fontWeight:yearR.l===y.l?800:400,color:yearR.l===y.l?"#FF3B1E":"#666",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",borderBottom:"1px solid #F0EEE9"}}>{y.l}</button>
          ))}
        </div>
      </div>
      {/* 주행거리 */}
      <div>
        <div style={{fontSize:13,fontWeight:800,marginBottom:10,color:"#1A1A1A"}}>주행거리</div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {MILES.map(m=>(
            <button key={m.l} onClick={()=>setMileR(m)} style={{padding:"8px 0",textAlign:"left",border:"none",background:"transparent",fontSize:13,fontWeight:mileR.l===m.l?800:400,color:mileR.l===m.l?"#FF3B1E":"#666",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",borderBottom:"1px solid #F0EEE9"}}>{m.l}</button>
          ))}
        </div>
      </div>
      {/* 가격 */}
      <div>
        <div style={{fontSize:13,fontWeight:800,marginBottom:10,color:"#1A1A1A"}}>가격</div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {PRICES.map(p=>(
            <button key={p.l} onClick={()=>setPriceR(p)} style={{padding:"8px 0",textAlign:"left",border:"none",background:"transparent",fontSize:13,fontWeight:priceR.l===p.l?800:400,color:priceR.l===p.l?"#FF3B1E":"#666",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",borderBottom:"1px solid #F0EEE9"}}>{p.l}</button>
          ))}
        </div>
      </div>
      {/* 연료 */}
      <div>
        <div style={{fontSize:13,fontWeight:800,marginBottom:10,color:"#1A1A1A"}}>연료</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {FUELS.map(f=>(
            <button key={f} onClick={()=>setFuel(f)} style={{
              padding:"7px 14px",borderRadius:100,border:fuel===f?"2px solid #FF3B1E":"1.5px solid #E0DDD7",
              background:fuel===f?"#FFF0ED":"white",color:fuel===f?"#FF3B1E":"#777",
              fontSize:12,fontWeight:fuel===f?800:600,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",
            }}>{f}</button>
          ))}
        </div>
      </div>
      {/* 초기화 */}
      {activeF>0&&(
        <button onClick={resetF} style={{padding:"10px",background:"#F0EEE9",color:"#888",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",textAlign:"center"}}>
          🔄 선택 초기화
        </button>
      )}
    </div>
  );

  return(
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        .list-item{transition:background 0.15s;} .list-item:hover{background:#FAFAF8!important;}
        .grid-card{transition:all 0.2s;} .grid-card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,0.1)!important;}
        .fav-btn{transition:transform 0.15s;} .fav-btn:hover{transform:scale(1.15);}
        @media(max-width:1024px){.pc-sidebar{display:none!important;}.main-area{margin-left:0!important;}}
      `}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        {/* 헤더 */}
        <div style={{background:"#1A1A1A",padding:"32px 24px 24px"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:4,color:"#FF3B1E",marginBottom:4}}>FIX PRICE MARKET</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10}}>
              <div>
                <h1 style={{fontSize:26,fontWeight:800,color:"white",letterSpacing:-1,marginBottom:2}}>전체 매물</h1>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",fontWeight:400}}>FIX 정찰제 · 허위매물 0건 · 직접 검수</p>
              </div>
              {/* 검색 */}
              <div style={{position:"relative",width:320,maxWidth:"100%"}}>
                <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:15,opacity:0.5}}>🔍</span>
                <input type="text" placeholder="차량명, 브랜드 검색" value={search} onChange={e=>setSearch(e.target.value)}
                  style={{width:"100%",padding:"12px 14px 12px 40px",border:"none",borderRadius:12,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",background:"rgba(255,255,255,0.1)",color:"white"}}/>
              </div>
            </div>
          </div>
        </div>

        <div style={{maxWidth:1280,margin:"0 auto",padding:"20px 16px 120px",display:"flex",gap:20,alignItems:"flex-start"}}>
          {/* ═══ 좌측 사이드바 필터 (PC) ═══ */}
          <div className="pc-sidebar" style={{width:220,flexShrink:0,position:"sticky",top:80}}>
            <div style={{background:"white",borderRadius:18,padding:"20px 18px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontSize:15,fontWeight:800}}>
                  검색 결과 <span style={{color:"#FF3B1E"}}>{filtered.length}</span>대
                </div>
                {activeF>0&&<span style={{fontSize:11,color:"#FF3B1E",fontWeight:700,cursor:"pointer"}} onClick={resetF}>초기화</span>}
              </div>
              <FilterPanel/>
            </div>
          </div>

          {/* ═══ 메인 콘텐츠 ═══ */}
          <div className="main-area" style={{flex:1,minWidth:0}}>
            {/* 모바일 필터 버튼 */}
            <div style={{display:"none"}} className="mob-filter-wrap">
              <button onClick={()=>setMobFilter(!mobFilter)} style={{width:"100%",padding:"12px",background:"white",border:"2px solid #E0DDD7",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                🎛️ 필터 {activeF>0&&<span style={{background:"#FF3B1E",color:"white",padding:"2px 8px",borderRadius:100,fontSize:11}}>{activeF}</span>}
              </button>
            </div>
            {mobFilter&&(
              <div style={{background:"white",borderRadius:16,padding:"20px",marginBottom:16}}>
                <FilterPanel/>
                <button onClick={()=>setMobFilter(false)} style={{width:"100%",padding:"12px",background:"#FF3B1E",color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",marginTop:16}}>필터 적용</button>
              </div>
            )}

            {/* 정렬 바 */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",gap:6,fontSize:13}}>
                {[["latest","최근 등록순"],["priceLow","낮은 가격순"],["priceHigh","높은 가격순"],["mileageLow","낮은 주행거리순"],["yearNew","최근연식순"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setSort(k)} style={{
                    border:"none",background:"transparent",fontSize:13,
                    fontWeight:sort===k?800:400,color:sort===k?"#1A1A1A":"#AAA",
                    cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",
                    borderBottom:sort===k?"2px solid #FF3B1E":"2px solid transparent",
                    paddingBottom:4,
                  }}>{l}</button>
                ))}
              </div>
              <div style={{display:"flex",gap:4}}>
                {(["list","grid"] as const).map(v=>(
                  <button key={v} onClick={()=>setView(v)} style={{
                    width:32,height:32,borderRadius:8,border:"1.5px solid #E0DDD7",
                    background:view===v?"#1A1A1A":"white",color:view===v?"white":"#AAA",
                    fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                  }}>{v==="list"?"☰":"⊞"}</button>
                ))}
              </div>
            </div>

            {/* 허위매물 배너 */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",background:"white",borderRadius:10,marginBottom:14}}>
              <span style={{fontSize:14}}>✅</span>
              <span style={{fontSize:12,fontWeight:700,color:"#2D8A52"}}>허위 매물 0건</span>
              <span style={{fontSize:11,color:"#CCC",fontWeight:400}}>직접 검수한 매물만 등록</span>
            </div>

            {/* ─── 매물 목록 ─── */}
            {loading?(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {[1,2,3,4,5].map(i=>(
                  <div key={i} style={{background:"white",borderRadius:14,padding:16,display:"flex",gap:16}}>
                    <div style={{width:200,height:140,background:"#E8E6E1",borderRadius:10,flexShrink:0}}/>
                    <div style={{flex:1}}><div style={{height:18,background:"#E8E6E1",borderRadius:4,width:"60%",marginBottom:10}}/><div style={{height:14,background:"#E8E6E1",borderRadius:4,width:"40%"}}/></div>
                  </div>
                ))}
              </div>
            ):filtered.length===0?(
              <div style={{textAlign:"center",padding:"80px 20px",background:"white",borderRadius:18}}>
                <div style={{fontSize:48,marginBottom:16}}>🔍</div>
                <p style={{fontSize:18,fontWeight:800,marginBottom:6}}>조건에 맞는 매물이 없어요</p>
                <p style={{fontSize:14,color:"#AAA",fontWeight:400}}>필터를 변경해 보세요</p>
              </div>
            ):view==="list"?(
              /* ═══ 리스트 뷰 (엔카 스타일) ═══ */
              <div style={{display:"flex",flexDirection:"column",gap:0,background:"white",borderRadius:18,overflow:"hidden"}}>
                {filtered.map((car,idx)=>{
                  const cn=car.title||car.name||"차량";
                  const cf=car.fuelType||car.fuel||"";
                  const isFav=favs.has(car.id);
                  const img=car.imageUrl||(car.images&&car.images[0])||"";
                  const imgs=car.images||[];
                  const tags=(car.tags as string[])||[];
                  return(
                    <Link key={car.id} href={`/cars/${car.id}`} style={{textDecoration:"none"}}>
                      <div className="list-item" style={{display:"flex",gap:16,padding:"18px 20px",borderBottom:idx<filtered.length-1?"1px solid #F0EEE9":"none",alignItems:"flex-start",cursor:"pointer"}}>
                        {/* 사진 영역 */}
                        <div style={{position:"relative",flexShrink:0}}>
                          <div style={{display:"flex",gap:4}}>
                            {/* 메인 사진 */}
                            <div style={{width:180,height:130,borderRadius:10,overflow:"hidden",background:"#F0EEE9"}}>
                              {img?<img src={img} alt={cn} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>:
                              <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"#CCC",fontSize:11}}>📷 사진 준비중</div>}
                            </div>
                            {/* 서브 사진 (있으면) */}
                            {imgs.length>1&&(
                              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                                {imgs.slice(1,3).map((im,i)=>(
                                  <div key={i} style={{width:80,height:62,borderRadius:8,overflow:"hidden",background:"#F0EEE9"}}>
                                    <img src={im} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {/* PICK 뱃지 */}
                          {car.isPick&&<span style={{position:"absolute",top:6,left:6,background:"#FF3B1E",color:"white",padding:"3px 10px",borderRadius:100,fontSize:10,fontWeight:800}}>PICK추천</span>}
                          {/* 찜 버튼 */}
                          <button className="fav-btn" onClick={e=>toggleFav(car.id,e)} style={{
                            position:"absolute",top:6,right:imgs.length>1?90:6,width:32,height:32,borderRadius:"50%",
                            background:"rgba(255,255,255,0.85)",border:"none",cursor:"pointer",
                            display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,
                          }}>{isFav?"❤️":"🤍"}</button>
                        </div>

                        {/* 정보 영역 */}
                        <div style={{flex:1,minWidth:0}}>
                          {/* 차량명 */}
                          <div style={{fontSize:16,fontWeight:800,color:"#1A1A1A",marginBottom:5,lineHeight:1.3}}>{cn}</div>
                          {/* 스펙 */}
                          <div style={{fontSize:13,color:"#888",fontWeight:400,marginBottom:8}}>
                            {String(car.year).slice(2)}/{String(car.year).slice(2)}년식 · {car.mileage?.toLocaleString()}km · {cf}{car.region?" · "+car.region:""}
                          </div>
                          {/* 설명 (있으면) */}
                          {car.description&&(
                            <div style={{fontSize:12,color:"#AAA",fontWeight:400,marginBottom:8,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" as const}}>{car.description}</div>
                          )}
                          {/* 태그 */}
                          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                            {car.isAccident===false&&<span style={{background:"#E8F8EF",color:"#2D8A52",padding:"3px 10px",borderRadius:100,fontSize:11,fontWeight:700}}>무사고</span>}
                            {tags.slice(0,4).map(t=>(
                              <span key={t} style={{background:"#F8F7F4",color:"#888",padding:"3px 10px",borderRadius:100,fontSize:11,fontWeight:600}}>{t}</span>
                            ))}
                          </div>
                          {/* FIX 뱃지 */}
                          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
                            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color:"#1847FF",border:"1.5px solid #1847FF",padding:"2px 8px",borderRadius:4,letterSpacing:1}}>🔒 FIX PRICE</span>
                            <span style={{fontSize:11,color:"#CCC",fontWeight:400}}>월 {Math.round(car.price*10000*0.019/60)}만원~</span>
                          </div>
                        </div>

                        {/* 가격 영역 (우측) */}
                        <div style={{textAlign:"right",flexShrink:0,paddingTop:2}}>
                          <div style={{fontSize:22,fontWeight:800,color:"#FF3B1E",letterSpacing:-0.5}}>{car.price?.toLocaleString()}<span style={{fontSize:13,color:"#AAA",fontWeight:700}}>만원</span></div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ):(
              /* ═══ 그리드 뷰 ═══ */
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",gap:14}}>
                {filtered.map(car=>{
                  const cn=car.title||car.name||"차량";
                  const cf=car.fuelType||car.fuel||"";
                  const isFav=favs.has(car.id);
                  const img=car.imageUrl||(car.images&&car.images[0])||"";
                  return(
                    <Link key={car.id} href={`/cars/${car.id}`} style={{textDecoration:"none"}}>
                      <div className="grid-card" style={{background:"white",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                        <div style={{position:"relative",height:200,background:"#F0EEE9",overflow:"hidden"}}>
                          {img?<img src={img} alt={cn} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:
                          <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"#CCC"}}>📷</div>}
                          {car.isPick&&<span style={{position:"absolute",top:10,left:10,background:"#FF3B1E",color:"white",padding:"4px 12px",borderRadius:100,fontSize:11,fontWeight:800}}>PICK</span>}
                          <button className="fav-btn" onClick={e=>toggleFav(car.id,e)} style={{position:"absolute",top:10,right:10,width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.9)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{isFav?"❤️":"🤍"}</button>
                        </div>
                        <div style={{padding:"14px 16px 16px"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                            <div style={{fontSize:20,fontWeight:800,color:"#FF3B1E"}}>{car.price?.toLocaleString()}<span style={{fontSize:12,color:"#AAA",fontWeight:700}}>만원</span></div>
                            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color:"#1847FF",border:"1.5px solid #1847FF",padding:"2px 8px",borderRadius:4,letterSpacing:1}}>FIX</span>
                          </div>
                          <div style={{fontSize:15,fontWeight:800,color:"#1A1A1A",marginBottom:4}}>{cn}</div>
                          <div style={{fontSize:12,color:"#AAA",fontWeight:400}}>{car.year}년식 · {car.mileage?.toLocaleString()}km · {cf}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 할부 계산기 플로팅 버튼 */}
      <button onClick={()=>setShowCalc(true)} style={{
        position:"fixed",bottom:90,right:20,zIndex:1000,
        width:56,height:56,borderRadius:"50%",
        background:"#1847FF",color:"white",border:"none",
        boxShadow:"0 4px 20px rgba(24,71,255,0.4)",
        fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
      }}>🧮</button>

      {/* 할부 계산기 모달 */}
      {showCalc&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowCalc(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:22,padding:"28px 24px",maxWidth:420,width:"100%",maxHeight:"80vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h3 style={{fontSize:20,fontWeight:800}}>🧮 할부 계산기</h3>
              <button onClick={()=>setShowCalc(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#AAA"}}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div>
                <label style={{fontSize:12,fontWeight:700,display:"block",marginBottom:4}}>차량 가격 (만원)</label>
                <input type="number" value={calcPrice} onChange={e=>setCalcPrice(e.target.value)} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif"}}/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,display:"block",marginBottom:4}}>선수금 (만원)</label>
                <input type="number" value={calcDown} onChange={e=>setCalcDown(e.target.value)} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif"}}/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,display:"block",marginBottom:4}}>할부 기간</label>
                <select value={calcMonths} onChange={e=>setCalcMonths(e.target.value)} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif"}}>
                  {[12,24,36,48,60,72].map(m=><option key={m} value={m}>{m}개월</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,display:"block",marginBottom:4}}>금리 (%)</label>
                <input type="number" step="0.1" value={calcRate} onChange={e=>setCalcRate(e.target.value)} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif"}}/>
              </div>
            </div>
            {(()=>{
              const p=(Number(calcPrice)-Number(calcDown))*10000;
              const r=Number(calcRate)/100/12;
              const n=Number(calcMonths);
              if(p<=0||r<=0||n<=0) return null;
              const monthly=Math.round(p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1));
              const total=monthly*n;
              const interest=total-p;
              return (
                <div style={{background:"#F8F7F4",borderRadius:14,padding:"18px 20px"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                    <div><div style={{fontSize:11,color:"#AAA",marginBottom:4}}>월 납입금</div><div style={{fontSize:24,fontWeight:800,color:"#FF3B1E"}}>{monthly.toLocaleString()}<span style={{fontSize:12,color:"#888"}}>원</span></div></div>
                    <div><div style={{fontSize:11,color:"#AAA",marginBottom:4}}>총 납입금</div><div style={{fontSize:18,fontWeight:800,color:"#1A1A1A"}}>{Math.round(total/10000).toLocaleString()}<span style={{fontSize:12,color:"#888"}}>만원</span></div></div>
                    <div><div style={{fontSize:11,color:"#AAA",marginBottom:4}}>총 이자</div><div style={{fontSize:16,fontWeight:800,color:"#1847FF"}}>{Math.round(interest/10000).toLocaleString()}<span style={{fontSize:12,color:"#888"}}>만원</span></div></div>
                    <div><div style={{fontSize:11,color:"#AAA",marginBottom:4}}>실구매금액</div><div style={{fontSize:16,fontWeight:800}}>{Number(calcPrice).toLocaleString()}<span style={{fontSize:12,color:"#888"}}>만원</span></div></div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:1024px){.mob-filter-wrap{display:block!important;}}
      `}</style>
    </>
  );
}
}}  
 