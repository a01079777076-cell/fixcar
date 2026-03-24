"use client";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { BRAND_MODELS, CAR_SPECS, CAR_GRADES } from "@/data/catalog_data";
import { Plus, X, ArrowLeftRight } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bm = BRAND_MODELS as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const specs = CAR_SPECS as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const grades = CAR_GRADES as any;

const allModels = Object.entries(bm).flatMap(([brand, info]: [string, any]) =>
  (info.models || []).map((m: any) => ({ name: m.name, brand, status: m.status }))
);

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>(["", ""]);
  const [search, setSearch] = useState(["", ""]);

  const setModel = (idx: number, name: string) => {
    const n = [...selected]; n[idx] = name; setSelected(n);
    const s = [...search]; s[idx] = ""; setSearch(s);
  };
  const addSlot = () => { if (selected.length < 4) { setSelected([...selected, ""]); setSearch([...search, ""]); } };
  const removeSlot = (idx: number) => { if (selected.length > 2) { setSelected(selected.filter((_, i) => i !== idx)); setSearch(search.filter((_, i) => i !== idx)); } };

  const filteredModels = (idx: number) => {
    const q = search[idx].toLowerCase();
    if (!q) return [];
    return allModels.filter(m => m.name.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q)).slice(0, 10);
  };

  const ROWS: { label: string; key: string; format?: (v: any) => string }[] = [
    { label: "세그먼트", key: "segment" },
    { label: "차체", key: "bodyType" },
    { label: "연료", key: "fuel" },
    { label: "배기량", key: "cc", format: v => v ? `${v.toLocaleString()}cc` : "-" },
    { label: "변속기", key: "transmission" },
    { label: "구동방식", key: "drivetrain" },
    { label: "0→100km/h", key: "zeroToHundred", format: v => v ? `${String(v).replace(/초/g,"")}초` : "-" },
    { label: "공차중량", key: "weight", format: v => v ? `${v.toLocaleString()}kg` : "-" },
    { label: "전장", key: "length", format: v => v ? `${v.toLocaleString()}mm` : "-" },
    { label: "전폭", key: "width", format: v => v ? `${v.toLocaleString()}mm` : "-" },
    { label: "전고", key: "height", format: v => v ? `${v.toLocaleString()}mm` : "-" },
    { label: "휠베이스", key: "wheelbase", format: v => v ? `${v.toLocaleString()}mm` : "-" },
    { label: "좌석", key: "seats", format: v => v ? `${v}인승` : "-" },
  ];

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "#1A1A1A", padding: "44px 24px 36px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Bebas Neue',serif", fontSize: 12, letterSpacing: 4, color: "#FF3B1E", marginBottom: 6 }}>COMPARE</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white" }}><ArrowLeftRight size={22} style={{ verticalAlign: "middle", marginRight: 8 }} />차량 비교</h1>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 100px" }}>
          {/* 차량 선택 카드 */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${selected.length},1fr)`, gap: 12, marginBottom: 24 }}>
            {selected.map((name, idx) => (
              <div key={idx} style={{ background: "white", borderRadius: 18, padding: "20px", position: "relative" }}>
                {selected.length > 2 && <button onClick={() => removeSlot(idx)} style={{ position: "absolute", top: 8, right: 8, border: "none", background: "#F0EEE9", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={12} /></button>}
                {name ? (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>🚗</div>
                    <div style={{ fontSize: 11, color: "#AAA" }}>{allModels.find(m => m.name === name)?.brand}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{name}</div>
                    {grades[name]?.[0] && <div style={{ fontSize: 14, fontWeight: 800, color: "#FF3B1E" }}>{grades[name][0].price?.toLocaleString()}만~</div>}
                    <button onClick={() => setModel(idx, "")} style={{ marginTop: 8, border: "none", background: "#F0EEE9", padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, color: "#888", cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>변경</button>
                  </div>
                ) : (
                  <div style={{ position: "relative" }}>
                    <input value={search[idx]} onChange={e => { const s = [...search]; s[idx] = e.target.value; setSearch(s); }} placeholder="차량명 검색..." style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0DDD7", borderRadius: 10, fontSize: 14, fontFamily: "'NanumSquareRound',sans-serif" }} />
                    {filteredModels(idx).length > 0 && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", maxHeight: 250, overflowY: "auto", zIndex: 10 }}>
                        {filteredModels(idx).map(m => (
                          <button key={m.name} onClick={() => setModel(idx, m.name)} style={{ width: "100%", padding: "10px 14px", border: "none", background: "transparent", textAlign: "left", cursor: "pointer", borderBottom: "1px solid #F0EEE9", fontSize: 13, fontFamily: "'NanumSquareRound',sans-serif" }}>
                            <span style={{ fontWeight: 700 }}>{m.name}</span> <span style={{ fontSize: 11, color: "#AAA" }}>{m.brand}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {selected.length < 4 && (
              <button onClick={addSlot} style={{ background: "white", borderRadius: 18, border: "2px dashed #E0DDD7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", minHeight: 160, fontFamily: "'NanumSquareRound',sans-serif" }}>
                <Plus size={24} color="#CCC" /><span style={{ fontSize: 13, color: "#CCC", fontWeight: 700 }}>차량 추가</span>
              </button>
            )}
          </div>

          {/* 비교 테이블 */}
          {selected.filter(Boolean).length >= 2 && (
            <div style={{ background: "white", borderRadius: 18, overflow: "hidden" }}>
              {/* 가격 행 */}
              <div style={{ display: "grid", gridTemplateColumns: `140px repeat(${selected.length},1fr)`, borderBottom: "2px solid #F0EEE9" }}>
                <div style={{ padding: "16px", fontSize: 13, fontWeight: 800, background: "#F8F7F4" }}>신차 가격</div>
                {selected.map((name, i) => {
                  const g = grades[name];
                  const lo = g?.[0]?.price; const hi = g?.[g.length - 1]?.price;
                  return <div key={i} style={{ padding: "16px", fontSize: 15, fontWeight: 800, color: "#FF3B1E", textAlign: "center" }}>{lo ? `${lo.toLocaleString()}${hi && hi !== lo ? `~${hi.toLocaleString()}` : ""}만` : "-"}</div>;
                })}
              </div>
              {/* 스펙 행 */}
              {ROWS.map(row => (
                <div key={row.key} style={{ display: "grid", gridTemplateColumns: `140px repeat(${selected.length},1fr)`, borderBottom: "1px solid #F0EEE9" }}>
                  <div style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#888", background: "#FAFAF8" }}>{row.label}</div>
                  {selected.map((name, i) => {
                    const s = specs[name]; const val = s?.[row.key];
                    const display = row.format ? row.format(val) : (val || "-");
                    /* 최고값 하이라이트 */
                    const numericVals = selected.map(n => { const sp = specs[n]; return Number(sp?.[row.key]) || 0; });
                    const maxVal = Math.max(...numericVals);
                    const isMax = Number(val) > 0 && Number(val) === maxVal && numericVals.filter(v => v === maxVal).length === 1;
                    return <div key={i} style={{ padding: "12px 16px", fontSize: 13, textAlign: "center", fontWeight: isMax ? 800 : 400, color: isMax ? "#FF3B1E" : "#555" }}>{display}</div>;
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
