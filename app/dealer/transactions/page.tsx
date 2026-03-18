"use client";
import { useState } from "react";
import { DollarSign, FileText, TrendingUp } from "lucide-react";

const SAMPLE_TX = [
  { id: 1, carName: "현대 아반떼 CN7", buyerName: "김○○", amount: 1450, fee: 29, netAmount: 1421, date: "2025-03-15", status: "정산완료" },
  { id: 2, carName: "기아 K3", buyerName: "이○○", amount: 1090, fee: 29, netAmount: 1061, date: "2025-03-10", status: "정산대기" },
  { id: 3, carName: "현대 투싼 NX4", buyerName: "박○○", amount: 2780, fee: 29, netAmount: 2751, date: "2025-03-05", status: "정산완료" },
];

export default function DealerTransactionsPage() {
  const [filter, setFilter] = useState("전체");
  const filtered = filter === "전체" ? SAMPLE_TX : SAMPLE_TX.filter(t => t.status === filter);
  const totalNet = filtered.reduce((s, t) => s + t.netAmount, 0);
  const totalFee = filtered.reduce((s, t) => s + t.fee, 0);

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        .row:hover { background:#FAFAF8; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "#1A1A1A", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue',serif", fontSize: "24px", letterSpacing: "3px" }}><span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "white" }}>CAR</span></a>
          <a href="/dealer" style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>← 대시보드</a>
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 32px 80px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 800, marginBottom: "20px" }}>거래 내역</h1>

          {/* 요약 카드 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "24px" }}>
            {[
              { icon: <TrendingUp size={20} color="white" />, label: "총 거래금액", value: `${SAMPLE_TX.reduce((s,t)=>s+t.amount,0).toLocaleString()}만원`, color: "#1847FF" },
              { icon: <DollarSign size={20} color="white" />, label: "순수익 (수수료 제외)", value: `${SAMPLE_TX.reduce((s,t)=>s+t.netAmount,0).toLocaleString()}만원`, color: "#2D8A52" },
              { icon: <FileText size={20} color="white" />, label: "픽스카 수수료", value: `${SAMPLE_TX.reduce((s,t)=>s+t.fee,0).toLocaleString()}만원`, color: "#FF3B1E" },
            ].map(card => (
              <div key={card.label} style={{ background: "white", borderRadius: "16px", padding: "20px 22px", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "44px", height: "44px", background: card.color, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{card.icon}</div>
                <div>
                  <div style={{ fontSize: "12px", color: "#AAA", fontWeight: 400, marginBottom: "3px" }}>{card.label}</div>
                  <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>{card.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 필터 */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {["전체", "정산완료", "정산대기"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 16px", borderRadius: "100px", border: `2px solid ${filter === f ? "#1A1A1A" : "#E0DDD7"}`, background: filter === f ? "#1A1A1A" : "white", color: filter === f ? "white" : "#555", fontSize: "13px", fontWeight: 700 }}>{f}</button>
            ))}
          </div>

          <div style={{ background: "white", borderRadius: "18px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px", padding: "12px 20px", borderBottom: "2px solid #F0EEE9", fontSize: "12px", fontWeight: 800, color: "#AAA" }}>
              <span>차량</span><span>구매자</span><span>거래금액</span><span>수수료</span><span>날짜</span><span>상태</span>
            </div>
            {filtered.map((tx, i) => (
              <div key={tx.id} className="row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px", padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #F0EEE9" : "none", alignItems: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>{tx.carName}</div>
                <div style={{ fontSize: "13px", color: "#555", fontWeight: 400 }}>{tx.buyerName}</div>
                <div style={{ fontSize: "14px", fontWeight: 800 }}>{tx.amount.toLocaleString()}만</div>
                <div style={{ fontSize: "13px", color: "#FF3B1E", fontWeight: 700 }}>-{tx.fee}만</div>
                <div style={{ fontSize: "12px", color: "#AAA", fontWeight: 400 }}>{tx.date}</div>
                <span style={{ background: tx.status === "정산완료" ? "#EAF6EF" : "#FFF8EC", color: tx.status === "정산완료" ? "#2D8A52" : "#E8A020", padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 800, display: "inline-block" }}>{tx.status}</span>
              </div>
            ))}
            <div style={{ padding: "14px 20px", background: "#F8F6F2", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px" }}>
              <span style={{ fontSize: "13px", fontWeight: 800, color: "#1A1A1A" }}>합계</span>
              <span />
              <span style={{ fontSize: "14px", fontWeight: 800 }}>{filtered.reduce((s,t)=>s+t.amount,0).toLocaleString()}만</span>
              <span style={{ fontSize: "13px", color: "#FF3B1E", fontWeight: 700 }}>-{totalFee}만</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
