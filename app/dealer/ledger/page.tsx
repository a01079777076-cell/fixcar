// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/dealer/ledger/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, DollarSign, TrendingUp, TrendingDown, Car } from "lucide-react";

interface LedgerEntry { buy: string; cost: string; sell: string; memo: string; }
const LEDGER_KEY = "fixcar_dealer_ledger";

export default function DealerLedgerPage() {
  const router = useRouter();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ledger, setLedger] = useState<Record<number, LedgerEntry>>({});

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (!d?.user?.id || (d.user.role !== "DEALER" && d.user.role !== "ADMIN")) { router.push("/"); return; }
      loadData();
    }).catch(() => router.push("/"));
  }, [router]);

  const loadData = async () => {
    try {
      const res = await fetch("/api/dealer/cars");
      const data = await res.json();
      setCars(Array.isArray(data) ? data : []);
      try { const ld = localStorage.getItem(LEDGER_KEY); if (ld) setLedger(JSON.parse(ld)); } catch {}
    } catch {}
    setLoading(false);
  };

  const updateLedger = (carId: number, field: keyof LedgerEntry, value: string) => {
    setLedger(prev => {
      const next = { ...prev, [carId]: { ...(prev[carId] || { buy: "", cost: "", sell: "", memo: "" }), [field]: value } };
      try { localStorage.setItem(LEDGER_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  if (loading) return <><Navbar /><div style={{ textAlign: "center", padding: 100, color: "#CCC" }}>로딩 중...</div></>;

  const soldCars = cars.filter(c => c.status === "SOLD" || c.status === "COMPLETED");
  const allCars = cars;

  /* 통계 */
  let totalProfit = 0, totalSold = 0, totalBuy = 0;
  soldCars.forEach(c => {
    const e = ledger[c.id];
    if (e?.sell && e?.buy) {
      const p = Number(e.sell) - Number(e.buy) - Number(e.cost || 0);
      totalProfit += p;
      totalSold += Number(e.sell);
      totalBuy += Number(e.buy) + Number(e.cost || 0);
    }
  });

  const L: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 4 };
  const I: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1.5px solid #E0DDD7", borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: "'NanumSquareRound',sans-serif" };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus{outline:none;border-color:#2D8A52!important;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "white", borderBottom: "1px solid #E8E6E1", padding: "20px 24px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/dealer" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: "#888", textDecoration: "none" }}><ChevronLeft size={16} /> 대시보드</Link>
            <div style={{ width: 1, height: 20, background: "#E0DDD7" }} />
            <DollarSign size={20} color="#2D8A52" />
            <h1 style={{ fontSize: 20, fontWeight: 800 }}>딜러 차계부</h1>
          </div>
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 16px 80px" }}>
          {/* 법적 고지 */}
          <div style={{ background: "#F8FFF8", borderRadius: 14, padding: "14px 18px", marginBottom: 20, border: "1px solid #B8DFC8" }}>
            <div style={{ fontSize: 12, color: "#2D8A52", lineHeight: 1.8 }}>
              📋 이 차계부는 <strong>개인 참고용</strong>이며 본인만 볼 수 있습니다.<br />
              데이터는 브라우저에만 저장되며 서버로 전송되지 않습니다.<br />
              법적 효력이 없으며 세무/회계 목적으로 사용할 수 없습니다. 편하게 이용하세요!
            </div>
          </div>

          {/* 통계 요약 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
            <div style={{ background: "white", borderRadius: 16, padding: "20px", textAlign: "center" }}>
              <TrendingUp size={20} color="#2D8A52" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 24, fontWeight: 800, color: totalProfit >= 0 ? "#2D8A52" : "#E24B4A" }}>{totalProfit >= 0 ? "+" : ""}{totalProfit.toLocaleString()}만</div>
              <div style={{ fontSize: 11, color: "#AAA" }}>총 수익금</div>
            </div>
            <div style={{ background: "white", borderRadius: 16, padding: "20px", textAlign: "center" }}>
              <DollarSign size={20} color="#0066FF" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0066FF" }}>{totalSold.toLocaleString()}만</div>
              <div style={{ fontSize: 11, color: "#AAA" }}>총 판매금</div>
            </div>
            <div style={{ background: "white", borderRadius: 16, padding: "20px", textAlign: "center" }}>
              <TrendingDown size={20} color="#E8A020" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 24, fontWeight: 800, color: "#E8A020" }}>{totalBuy.toLocaleString()}만</div>
              <div style={{ fontSize: 11, color: "#AAA" }}>총 투입금</div>
            </div>
          </div>

          {/* 판매 완료 차량 차계부 */}
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>📊 판매 완료 차량 ({soldCars.length}대)</h2>

          {soldCars.length === 0 ? (
            <div style={{ background: "white", borderRadius: 18, padding: "48px 24px", textAlign: "center" }}>
              <Car size={40} color="#CCC" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: "#AAA" }}>판매 완료된 차량이 없어요</div>
              <div style={{ fontSize: 13, color: "#CCC", marginTop: 6 }}>매물이 판매 완료 처리되면 여기에 표시됩니다</div>
            </div>
          ) : (
            soldCars.map(car => {
              const e = ledger[car.id] || { buy: "", cost: "", sell: "", memo: "" };
              const profit = e.sell && e.buy ? Number(e.sell) - Number(e.buy) - Number(e.cost || 0) : null;
              return (
                <div key={car.id} style={{ background: "white", borderRadius: 16, padding: "20px 22px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 800 }}>{car.brand} {car.name}</span>
                      <span style={{ fontSize: 12, color: "#AAA", marginLeft: 8 }}>{car.year}년 · {car.mileage?.toLocaleString()}km</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#0066FF" }}>판매가 {car.price?.toLocaleString()}만</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div><label style={L}>매입가 (만원)</label><input type="number" value={e.buy} onChange={ev => updateLedger(car.id, "buy", ev.target.value)} placeholder="0" style={I} /></div>
                    <div><label style={L}>부대비용 (만원)</label><input type="number" value={e.cost} onChange={ev => updateLedger(car.id, "cost", ev.target.value)} placeholder="0" style={I} /></div>
                    <div><label style={L}>실판매가 (만원)</label><input type="number" value={e.sell} onChange={ev => updateLedger(car.id, "sell", ev.target.value)} placeholder="0" style={I} /></div>
                    <div><label style={L}>메모</label><input value={e.memo} onChange={ev => updateLedger(car.id, "memo", ev.target.value)} placeholder="참고사항" style={I} /></div>
                  </div>
                  {profit !== null && (
                    <div style={{ background: profit >= 0 ? "#EAF6EF" : "#FFF0ED", borderRadius: 10, padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: profit >= 0 ? "#2D8A52" : "#E24B4A" }}>예상 수익금</span>
                      <span style={{ fontSize: 22, fontWeight: 800, color: profit >= 0 ? "#2D8A52" : "#E24B4A" }}>{profit >= 0 ? "+" : ""}{profit.toLocaleString()}만원</span>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* 전체 차량 빠른 기록 */}
          {allCars.filter(c => c.status !== "SOLD" && c.status !== "COMPLETED").length > 0 && (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginTop: 32, marginBottom: 14 }}>🚗 판매 중 차량 매입가 기록</h2>
              <div style={{ fontSize: 12, color: "#AAA", marginBottom: 12 }}>판매 전 매입가를 미리 기록해두면 판매 완료 시 자동으로 수익 계산됩니다.</div>
              {allCars.filter(c => c.status !== "SOLD" && c.status !== "COMPLETED").map(car => {
                const e = ledger[car.id] || { buy: "", cost: "", sell: "", memo: "" };
                return (
                  <div key={car.id} style={{ background: "white", borderRadius: 14, padding: "14px 18px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: 800 }}>{car.brand} {car.name}</span>
                      <span style={{ fontSize: 11, color: "#AAA", marginLeft: 8 }}>{car.price?.toLocaleString()}만</span>
                    </div>
                    <div style={{ width: 140 }}><input type="number" value={e.buy} onChange={ev => updateLedger(car.id, "buy", ev.target.value)} placeholder="매입가" style={{ ...I, fontSize: 13 }} /></div>
                    <div style={{ width: 140 }}><input type="number" value={e.cost} onChange={ev => updateLedger(car.id, "cost", ev.target.value)} placeholder="부대비용" style={{ ...I, fontSize: 13 }} /></div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}
