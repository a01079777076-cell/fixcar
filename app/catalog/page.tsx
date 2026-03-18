"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

const BRANDS = [
  { name: "현대", models: [
    { name: "아반떼", years: [2024,2023,2022,2021], basePrice: 2015, fuel: "가솔린/하이브리드", engine: "1.6 MPI / 1.6 T-GDi", basic: ["스마트키","후방카메라","LED DRL","8인치 내비"], extra: ["파노라마 선루프","열선시트","통풍시트","HDA","BSD","원격 주차보조"] },
    { name: "쏘나타", years: [2024,2023,2022], basePrice: 2780, fuel: "가솔린/하이브리드", engine: "2.0 MPI / 2.0 T-GDi", basic: ["10.25인치 내비","무선 애플카플레이","LED 헤드램프","스마트키"], extra: ["파노라마 선루프","HDA2","원격 스마트 주차보조","BOSE 사운드"] },
    { name: "투싼", years: [2024,2023,2022,2021], basePrice: 2699, fuel: "가솔린/디젤/하이브리드", engine: "1.6 T-GDi / 2.0 MPI", basic: ["10.25인치 내비","LED 헤드램프","스마트키","후방카메라"], extra: ["파노라마 선루프","전동 트렁크","HDA2","BSD","원격 주차보조"] },
    { name: "아이오닉 5", years: [2024,2023,2022], basePrice: 4990, fuel: "전기", engine: "롱레인지 2WD / AWD", basic: ["증강현실 HUD","V2L","원격 스마트 주차보조","히트펌프"], extra: ["디지털 사이드 미러","솔라루프","익스테리어 패키지"] },
  ]},
  { name: "기아", models: [
    { name: "K3", years: [2023,2022,2021,2020], basePrice: 1831, fuel: "가솔린", engine: "1.6 MPI / 1.6 T-GDi", basic: ["스마트키","후방카메라","LED DRL","8인치 내비"], extra: ["파노라마 선루프","열선시트","HDA","BSD"] },
    { name: "K5", years: [2024,2023,2022,2021], basePrice: 2610, fuel: "가솔린/하이브리드", engine: "1.6 T-GDi / 2.0 MPI", basic: ["10.25인치 내비","LED 헤드램프","스마트키","무선 애플카플레이"], extra: ["파노라마 선루프","HDA2","BOSE 사운드","원격 스마트 주차보조"] },
    { name: "쏘렌토", years: [2024,2023,2022,2021], basePrice: 3368, fuel: "가솔린/디젤/하이브리드", engine: "2.0 T-GDi / 1.6 T-HEV", basic: ["10.25인치 내비","LED 헤드램프","7인승","스마트키"], extra: ["파노라마 선루프","HDA2","BSD","원격 스마트 주차보조","BOSE"] },
    { name: "EV6", years: [2024,2023,2022], basePrice: 5192, fuel: "전기", engine: "롱레인지 2WD / AWD / GT", basic: ["V2L","히트펌프","HDA2","원격 스마트 주차보조"], extra: ["GT 라인 패키지","파노라마 선루프","어쿠스틱 글라스"] },
  ]},
  { name: "제네시스", models: [
    { name: "G80", years: [2024,2023,2022], basePrice: 6130, fuel: "가솔린/전기", engine: "2.5 T-GDi / 3.5 T-GDi", basic: ["12.3인치 클러스터","12.3인치 내비","퀼팅가죽","스마트파킹"], extra: ["파노라마 선루프","마크레빈슨","리어컴포트시트","빌트인캠"] },
    { name: "GV80", years: [2024,2023,2022], basePrice: 7330, fuel: "가솔린/디젤", engine: "2.5 T-GDi / 3.5 T-GDi", basic: ["14.5인치 내비","퀼팅가죽","전동 트렁크","스마트파킹"], extra: ["파노라마 선루프","마크레빈슨","22인치 휠","헤드업디스플레이"] },
  ]},
];

export default function CatalogPage() {
  const [selectedBrand, setSelectedBrand] = useState(BRANDS[0]);
  const [selectedModel, setSelectedModel] = useState(BRANDS[0].models[0]);
  const [selectedYear, setSelectedYear] = useState(BRANDS[0].models[0].years[0]);
  const [search, setSearch] = useState("");
  const [openExtra, setOpenExtra] = useState(false);

  const handleBrand = (b: typeof BRANDS[0]) => { setSelectedBrand(b); setSelectedModel(b.models[0]); setSelectedYear(b.models[0].years[0]); };
  const handleModel = (m: typeof BRANDS[0]["models"][0]) => { setSelectedModel(m); setSelectedYear(m.years[0]); };
  const filtered = selectedBrand.models.filter(m => m.name.includes(search));

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input { font-family:'NanumSquareRound',sans-serif; }
        .mbtn:hover { background:#F0EEE9 !important; }
        @media(max-width:1024px) { .layout { grid-template-columns:1fr !important; } .sidebar { display:none !important; } }
      `}</style>
      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <Navbar />
        <div style={{ background:"#1A1A1A", padding:"44px 52px 36px" }}>
          <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
            <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#FF7A63", marginBottom:"10px" }}>CAR CATALOG</div>
            <h1 style={{ fontSize:"clamp(24px,4vw,44px)", fontWeight:800, color:"white", letterSpacing:"-1px" }}>차량 카탈로그</h1>
            <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.4)", marginTop:"8px", fontWeight:400 }}>출고가 · 기본옵션 · 추가옵션 전체 조회</p>
          </div>
        </div>

        <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"24px 32px 80px" }}>
          <div className="layout" style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:"20px", alignItems:"start" }}>
            <div className="sidebar" style={{ background:"white", borderRadius:"18px", overflow:"hidden", position:"sticky", top:"84px" }}>
              <div style={{ padding:"12px 14px", borderBottom:"1px solid #F0EEE9" }}>
                <div style={{ position:"relative" }}>
                  <Search size={13} color="#AAA" style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)" }} />
                  <input type="text" placeholder="차종 검색" value={search} onChange={e=>setSearch(e.target.value)}
                    style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"8px", padding:"8px 10px 8px 28px", fontSize:"13px", outline:"none" }} />
                </div>
              </div>
              {BRANDS.map(brand => (
                <div key={brand.name}>
                  <button onClick={() => handleBrand(brand)} style={{ width:"100%", padding:"12px 16px", background:selectedBrand.name===brand.name?"#EEF2FF":"transparent", border:"none", textAlign:"left", fontSize:"14px", fontWeight:800, color:selectedBrand.name===brand.name?"#1847FF":"#555", display:"flex", justifyContent:"space-between" }}>
                    {brand.name} <span style={{ fontSize:"11px", fontWeight:400, color:"#AAA" }}>{brand.models.length}개</span>
                  </button>
                  {selectedBrand.name === brand.name && filtered.map(model => (
                    <button key={model.name} className="mbtn" onClick={() => handleModel(model)}
                      style={{ width:"100%", padding:"9px 24px", background:selectedModel.name===model.name?"#EEF2FF":"#F8F6F2", border:"none", textAlign:"left", fontSize:"13px", fontWeight:selectedModel.name===model.name?800:600, color:selectedModel.name===model.name?"#1847FF":"#777" }}>
                      {model.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              <div style={{ background:"white", borderRadius:"18px", padding:"24px 28px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"10px" }}>
                  <div>
                    <div style={{ fontSize:"12px", fontWeight:800, color:"#FF3B1E", letterSpacing:"2px", marginBottom:"6px" }}>{selectedBrand.name}</div>
                    <h2 style={{ fontSize:"28px", fontWeight:800, letterSpacing:"-1px", marginBottom:"6px" }}>{selectedModel.name}</h2>
                    <div style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>{selectedModel.engine} · {selectedModel.fuel}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400, marginBottom:"3px" }}>출고가 (시작가)</div>
                    <div style={{ fontSize:"30px", fontWeight:800, color:"#FF3B1E", letterSpacing:"-1px" }}>{selectedModel.basePrice.toLocaleString()}<span style={{ fontSize:"13px", fontWeight:700, color:"#AAA", marginLeft:"4px" }}>만원~</span></div>
                  </div>
                </div>
                <div style={{ marginTop:"16px", paddingTop:"16px", borderTop:"1px solid #F0EEE9" }}>
                  <div style={{ fontSize:"13px", fontWeight:800, marginBottom:"10px", color:"#555" }}>연식 선택</div>
                  <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                    {selectedModel.years.map(year => (
                      <button key={year} onClick={() => setSelectedYear(year)} style={{ padding:"6px 16px", borderRadius:"100px", border:`2px solid ${selectedYear===year?"#1A1A1A":"#E0DDD7"}`, background:selectedYear===year?"#1A1A1A":"white", color:selectedYear===year?"white":"#555", fontSize:"13px", fontWeight:700 }}>{year}년식</button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ background:"white", borderRadius:"18px", padding:"22px 28px" }}>
                <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"14px", display:"flex", alignItems:"center", gap:"8px" }}>
                  <div style={{ width:"8px", height:"8px", background:"#2D8A52", borderRadius:"50%" }} /> 기본 포함 옵션
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                  {selectedModel.basic.map(opt => (
                    <span key={opt} style={{ background:"#EAF6EF", border:"1px solid #B8DFC8", padding:"6px 14px", borderRadius:"100px", fontSize:"13px", fontWeight:700, color:"#2D8A52" }}>✓ {opt}</span>
                  ))}
                </div>
              </div>

              <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
                <button onClick={() => setOpenExtra(!openExtra)} style={{ width:"100%", padding:"20px 28px", background:"transparent", border:"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontSize:"15px", fontWeight:800, display:"flex", alignItems:"center", gap:"8px" }}>
                    <div style={{ width:"8px", height:"8px", background:"#1847FF", borderRadius:"50%" }} /> 추가 선택 옵션
                  </div>
                  <ChevronDown size={16} color="#AAA" style={{ transform:openExtra?"rotate(180deg)":"none", transition:"transform 0.2s" }} />
                </button>
                {openExtra && (
                  <div style={{ padding:"0 28px 20px" }}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                      {selectedModel.extra.map(opt => (
                        <span key={opt} style={{ background:"#EEF2FF", border:"1px solid #B8C8FF", padding:"6px 14px", borderRadius:"100px", fontSize:"13px", fontWeight:700, color:"#1847FF" }}>+ {opt}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ background:"#FF3B1E", borderRadius:"18px", padding:"20px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:"15px", fontWeight:800, color:"white", marginBottom:"3px" }}>{selectedBrand.name} {selectedModel.name} 중고차 보기</div>
                  <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.7)", fontWeight:400 }}>FIX 정찰가 매물 바로 확인</div>
                </div>
                <a href={`/cars`}><button style={{ background:"white", color:"#FF3B1E", border:"none", padding:"11px 20px", borderRadius:"100px", fontSize:"13px", fontWeight:800, display:"flex", alignItems:"center", gap:"5px" }}>매물 보기 <ChevronRight size={13} /></button></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
