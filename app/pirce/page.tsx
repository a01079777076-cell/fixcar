"use client";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { BRAND_MODELS, CAR_GRADES, CAR_SPECS } from "@/data/catalog_data";
import { TrendingDown, Search } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bm = BRAND_MODELS as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const grades = CAR_GRADES as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const specs = CAR_SPECS as any;

function calcDepreciation(newPrice: number, year: number): { price: number; rate: string }[] {
  const currentYear = new Date().getFullYear();
  const results = [];
  const rates = [1, 0.82, 0.70, 0.60, 0.52, 0.46, 0.40, 0.35, 0.31, 0.27, 0.24];
  for (let y = 0; y <= Math.min(10, currentYear - year); y++) {
    const rate = rates[y] || 0.20;
    results.push({ price: Math.round(newPrice * rate), rate: `${Math.round(rate * 100)}%` });
  }
  return results;
}

export default function PricePage() {
  const [search, setSearch] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState(2022);

  const allModels = useMemo(() =>
    Object.entries(bm).flatMap(([brand, info]: [string, any]) =>
      (info.models || []).filter((m: any) => grades[m.name]).map((m: any) => ({ name: m.name, brand, status: m.status }))
    ), []);

  const filtered = search.length >= 1 ? allModels.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.brand.includes(search)).slice(0, 10) : [];

  const modelGrade = grades[selectedModel];
  const newPrice = modelGrade?.[0]?.price || 0;
  const depr = newPrice ? calcDepreciation(newPrice, selectedYear) : [];

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "linear-gradient(135deg,#1A1A1A,#2D1B00)", padding: "44px 24px 36px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Bebas Neue',serif", fontSize: 12, letterSpacing: 4, color: "#E8A020", marginBottom: 6 }}>PRICE CHECK</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white" }}><TrendingDown size={22} style={{ verticalAlign: "middle", marginRight: 8 }} />중고차 시세 조회</h1>
          </div>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px 100px" }}>
          {/* 검색 */}
          <div style={{ position: "relative", marginBottom: 24 }}>
            <div style={{ position: "relative" }}>
              <Search size={18} color="#CCC" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
              <input value={search} onChange={e => { setSearch(e.target.value); setSelectedModel(""); }} placeholder="차량명 검색 (예: 그랜저, 아반떼...)" style={{ width: "100%", padding: "16px 16px 16px 44px", border: "1.5px solid #E0DDD7", borderRadius: 14, fontSize: 16, fontFamily: "'NanumSquareRound',sans-serif", background: "white" }} />
            </div>
            {filtered.length > 0 && !selectedModel && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", maxHeight: 300, overflowY: "auto", zIndex: 10, marginTop: 4 }}>
                {filtered.map(m => (
                  <button key={m.name} onClick={() => { setSelectedModel(m.name); setSearch(m.name); }} style={{ width: "100%", padding: "14px 20px", border: "none", background: "transparent", textAlign: "left", cursor: "pointer", borderBottom: "1px solid #F0EEE9", fontSize: 14, fontFamily: "'NanumSquareRound',sans-serif" }}>
                    <span style={{ fontWeight: 800 }}>{m.name}</span> <span style={{ fontSize: 12, color: "#AAA" }}>{m.brand} · {m.status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedModel && newPrice > 0 && (
            <>
              {/* 차량 정보 */}
              <div style={{ background: "white", borderRadius: 18, padding: "24px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#AAA" }}>{allModels.find(m => m.name === selectedModel)?.brand}</div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{selectedModel}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "#AAA" }}>신차 가격</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#FF3B1E" }}>{newPrice.toLocaleString()}<span style={{ fontSize: 14 }}>만원</span></div>
                  </div>
                </div>
              </div>

              {/* 연식 선택 */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>연식 선택</div>
                <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
                  {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - i).map(y => (
                    <button key={y} onClick={() => setSelectedYear(y)} style={{
                      padding: "8px 16px", borderRadius: 100, fontSize: 13, fontWeight: selectedYear === y ? 800 : 500, whiteSpace: "nowrap",
                      border: selectedYear === y ? "2px solid #FF3B1E" : "1px solid #E0DDD7",
                      background: selectedYear === y ? "#FFF0ED" : "white", color: selectedYear === y ? "#FF3B1E" : "#888",
                      cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
                    }}>{y}년</button>
                  ))}
                </div>
              </div>

              {/* 시세 그래프 */}
              <div style={{ background: "white", borderRadius: 18, padding: "24px" }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>📉 연식별 예상 시세</h3>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 200, padding: "0 4px", marginBottom: 16 }}>
                  {depr.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: i === 0 ? "#FF3B1E" : "#555" }}>{d.price.toLocaleString()}</div>
                      <div style={{ width: "100%", background: i === 0 ? "#FF3B1E" : `rgba(255,59,30,${1 - i * 0.08})`, borderRadius: "4px 4px 0 0", height: `${Math.max((d.price / newPrice) * 160, 8)}px` }} />
                      <div style={{ fontSize: 9, color: "#AAA" }}>{selectedYear + i}년</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#F8F7F4", borderRadius: 12, padding: "14px 18px", fontSize: 13, color: "#888", lineHeight: 1.7 }}>
                  💡 <b>{selectedYear}년식 {selectedModel}</b>의 예상 중고차 시세는 약 <b style={{ color: "#FF3B1E" }}>{depr[depr.length - 1]?.price?.toLocaleString() || 0}만원</b>입니다.<br />
                  신차 대비 감가율 약 <b>{100 - Number(depr[depr.length - 1]?.rate?.replace("%", "") || 0)}%</b>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
