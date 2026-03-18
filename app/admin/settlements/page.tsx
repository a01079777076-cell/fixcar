"use client";
import { useState } from "react";
import { DollarSign, Download, CheckCircle } from "lucide-react";

const DEALERS = [
  { id: 1, shopName: "광주모터스", dealCount: 3, totalAmount: 5320, fee: 87, netPayout: 5233, status: "정산대기" },
  { id: 2, shopName: "전남자동차", dealCount: 2, totalAmount: 3870, fee: 58, netPayout: 3812, status: "정산완료" },
  { id: 3, shopName: "수완카센터", dealCount: 1, totalAmount: 1450, fee: 29, netPayout: 1421, status: "정산대기" },
];

export default function AdminSettlementsPage() {
  const [dealers, setDealers] = useState(DEALERS);

  const settle = (id: number) => {
    setDealers(prev => prev.map(d => d.id === id ? { ...d, status: "정산완료" } : d));
  };

  const totalFee = dealers.reduce((s,d) => s + d.fee, 0);
  const pendingCount = dealers.filter(d => d.status === "정산대기").length;

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
          <div style={{ display: "flex", gap: "20px" }}>
            {[["대시보드","/admin"],["회원","/admin/users"],["매물","/admin/cars"],["정산","/admin/settlements"],["설정","/admin/settings"]].map(([l,h])=>(
              <a key={l} href={h} style={{ fontSize: "13px", fontWeight: 700, color: h === "/admin/settlements" ? "white" : "rgba(255,255,255,0.4)" }}>{l}</a>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "28px 32px 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 800 }}>수수료 정산</h1>
            <button style={{ background: "#1A1A1A", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}>
              <Download size={14} /> 엑셀 다운로드
            </button>
          </div>

          {/* 요약 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "24px" }}>
            {[
              { label: "이번달 총 수수료", value: `${totalFee}만원`, color: "#FF3B1E", icon: <DollarSign size={20} color="white" /> },
              { label: "정산 대기", value: `${pendingCount}건`, color: "#E8A020", icon: <DollarSign size={20} color="white" /> },
              { label: "정산 완료", value: `${dealers.length - pendingCount}건`, color: "#2D8A52", icon: <CheckCircle size={20} color="white" /> },
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
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 120px", padding: "12px 20px", borderBottom: "2px solid #F0EEE9", fontSize: "12px", fontWeight: 800, color: "#AAA" }}>
              <span>딜러</span><span>거래건수</span><span>총거래액</span><span>수수료</span><span>정산예정액</span><span>처리</span>
            </div>
            {dealers.map((dealer, i) => (
              <div key={dealer.id} className="row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 120px", padding: "14px 20px", borderBottom: i < dealers.length - 1 ? "1px solid #F0EEE9" : "none", alignItems: "center" }}>
                <div style={{ fontSize: "15px", fontWeight: 700 }}>{dealer.shopName}</div>
                <div style={{ fontSize: "14px", color: "#555", fontWeight: 400 }}>{dealer.dealCount}건</div>
                <div style={{ fontSize: "14px", fontWeight: 800 }}>{dealer.totalAmount.toLocaleString()}만</div>
                <div style={{ fontSize: "13px", color: "#FF3B1E", fontWeight: 700 }}>{dealer.fee}만</div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#2D8A52" }}>{dealer.netPayout.toLocaleString()}만</div>
                <div>
                  {dealer.status === "정산대기" ? (
                    <button onClick={() => settle(dealer.id)} style={{ background: "#1847FF", color: "white", border: "none", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 800 }}>정산 처리</button>
                  ) : (
                    <span style={{ background: "#EAF6EF", color: "#2D8A52", padding: "5px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 800 }}>완료</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
