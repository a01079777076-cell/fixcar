"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { DollarSign, CheckCircle, Car } from "lucide-react";

/* 실제 판매완료 데이터 기준 상사별 판매 집계 (가짜 정산 데이터 제거)
   ※ 수수료율·정산 처리는 사업자 등록 후 결제 연동 시 구현 */
interface DealerRow {
  id: number; shopName: string; complexName: string | null;
  cars: { total: number; sold: number; soldAmount: number };
}

export default function AdminSettlementsPage() {
  const [dealers, setDealers] = useState<DealerRow[]>([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/master")
      .then(r => r.json())
      .then(d => { if (d.success) setDealers(d.data.dealers); else setError(d.error || "불러오기 실패"); })
      .catch(() => setError("불러오기 실패"))
      .finally(() => setLoaded(true));
  }, []);

  const sold = dealers.filter(d => d.cars.sold > 0).sort((a, b) => b.cars.soldAmount - a.cars.soldAmount);
  const totalSold = sold.reduce((s, d) => s + d.cars.sold, 0);
  const totalAmount = sold.reduce((s, d) => s + d.cars.soldAmount, 0);

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        .row:hover { background:#FAFAF8; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "#1A1A1A", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "'Bebas Neue',serif", fontSize: "24px", letterSpacing: "3px" }}><span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "white" }}>CAR</span></Link>
          <div style={{ display: "flex", gap: "20px" }}>
            {[["대시보드","/admin"],["통합관리","/admin/master"],["정산","/admin/settlements"],["설정","/admin/settings"]].map(([l,h])=>(
              <a key={l} href={h} style={{ fontSize: "13px", fontWeight: 700, color: h === "/admin/settlements" ? "white" : "rgba(255,255,255,0.4)" }}>{l}</a>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "28px 32px 80px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 800, marginBottom: 6 }}>상사별 판매 집계</h1>
          <p style={{ fontSize: 13, color: "#AAA", marginBottom: 20 }}>판매완료(SOLD) 매물 기준 · 수수료 정산은 결제 연동 후 제공됩니다</p>

          {error && <div style={{ background: "#FFF0ED", color: "#E24B4A", padding: "12px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700, marginBottom: 14 }}>⚠️ {error}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "24px" }}>
            {[
              { label: "판매완료 대수", value: `${totalSold}대`, color: "#FF3B1E", icon: <Car size={20} color="white" /> },
              { label: "판매완료 금액", value: `${totalAmount.toLocaleString()}만원`, color: "#2D8A52", icon: <DollarSign size={20} color="white" /> },
              { label: "판매 실적 상사", value: `${sold.length}곳`, color: "#1847FF", icon: <CheckCircle size={20} color="white" /> },
            ].map(card => (
              <div key={card.label} style={{ background: "white", borderRadius: "16px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", background: card.color, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{card.icon}</div>
                <div>
                  <div style={{ fontSize: "12px", color: "#AAA", fontWeight: 400 }}>{card.label}</div>
                  <div style={{ fontSize: "20px", fontWeight: 800 }}>{card.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "white", borderRadius: "18px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1.2fr", padding: "12px 20px", borderBottom: "2px solid #F0EEE9", fontSize: "12px", fontWeight: 800, color: "#AAA" }}>
              <span>상사</span><span>소속 단지</span><span>등록 매물</span><span>판매완료</span><span>판매 금액</span>
            </div>
            {loaded && sold.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#BBB", fontSize: 14 }}>아직 판매완료된 매물이 없습니다</div>}
            {sold.map((d, i) => (
              <div key={d.id} className="row" style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1.2fr", padding: "14px 20px", borderBottom: i < sold.length - 1 ? "1px solid #F0EEE9" : "none", alignItems: "center" }}>
                <div style={{ fontSize: "15px", fontWeight: 700 }}>{d.shopName}</div>
                <div style={{ fontSize: "13px", color: "#888" }}>{d.complexName || "—"}</div>
                <div style={{ fontSize: "14px", color: "#555" }}>{d.cars.total}대</div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#FF3B1E" }}>{d.cars.sold}대</div>
                <div style={{ fontSize: "14px", fontWeight: 800 }}>{d.cars.soldAmount.toLocaleString()}만</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
