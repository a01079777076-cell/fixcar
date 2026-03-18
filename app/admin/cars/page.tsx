"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";

interface Car { id: number; name: string; brand: string; year: number; price: number; status: string; dealer: { shopName: string }; createdAt: string; }

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("전체");

  useEffect(() => {
    fetch("/api/cars").then(r => r.json()).then(d => { if (d.success) setCars(d.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/cars/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setCars(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const filtered = filter === "전체" ? cars : cars.filter(c => {
    if (filter === "판매중") return c.status === "AVAILABLE";
    if (filter === "예약중") return c.status === "RESERVED";
    if (filter === "판매완료") return c.status === "SOLD";
    return true;
  });

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
            {[["대시보드", "/admin"], ["회원", "/admin/users"], ["매물", "/admin/cars"], ["설정", "/admin/settings"]].map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: "13px", fontWeight: 700, color: h === "/admin/cars" ? "white" : "rgba(255,255,255,0.4)" }}>{l}</a>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 32px 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 800 }}>매물 검수</h1>
            <div style={{ display: "flex", gap: "8px" }}>
              {["전체", "판매중", "예약중", "판매완료"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 16px", borderRadius: "100px", border: `2px solid ${filter === f ? "#1A1A1A" : "#E0DDD7"}`, background: filter === f ? "#1A1A1A" : "white", color: filter === f ? "white" : "#555", fontSize: "13px", fontWeight: 700 }}>{f}</button>
              ))}
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "18px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr 140px", padding: "12px 20px", borderBottom: "2px solid #F0EEE9", fontSize: "12px", fontWeight: 800, color: "#AAA" }}>
              <span>차량명</span><span>딜러</span><span>가격</span><span>상태</span><span>등록일</span><span>관리</span>
            </div>
            {loading ? <div style={{ padding: "40px", textAlign: "center", color: "#AAA" }}>로딩 중...</div> :
              filtered.map(car => (
                <div key={car.id} className="row" style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr 140px", padding: "14px 20px", borderBottom: "1px solid #F0EEE9", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700 }}>{car.name}</div>
                    <div style={{ fontSize: "12px", color: "#AAA", fontWeight: 400 }}>{car.year}년식</div>
                  </div>
                  <div style={{ fontSize: "13px", color: "#555", fontWeight: 400 }}>{car.dealer?.shopName}</div>
                  <div style={{ fontSize: "14px", fontWeight: 800 }}>{car.price.toLocaleString()}만</div>
                  <div>
                    <span style={{ background: car.status === "AVAILABLE" ? "#EAF6EF" : car.status === "RESERVED" ? "#EEF2FF" : "#F8F6F2", color: car.status === "AVAILABLE" ? "#2D8A52" : car.status === "RESERVED" ? "#1847FF" : "#888", padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 800 }}>
                      {car.status === "AVAILABLE" ? "판매중" : car.status === "RESERVED" ? "예약중" : "판매완료"}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#AAA", fontWeight: 400 }}>{car.createdAt?.slice(0, 10)}</div>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <a href={`/cars/${car.id}`}><button style={{ width: "30px", height: "30px", border: "1.5px solid #E0DDD7", borderRadius: "8px", background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}><Eye size={13} color="#555" /></button></a>
                    <button onClick={() => updateStatus(car.id, "AVAILABLE")} style={{ width: "30px", height: "30px", background: "#EAF6EF", border: "none", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle size={13} color="#2D8A52" /></button>
                    <button onClick={() => updateStatus(car.id, "SOLD")} style={{ width: "30px", height: "30px", background: "#FFF0ED", border: "none", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}><XCircle size={13} color="#FF3B1E" /></button>
                  </div>
                </div>
              ))
            }
          </div>
          <div style={{ marginTop: "12px", fontSize: "13px", color: "#AAA", fontWeight: 400 }}>총 {filtered.length}개 매물</div>
        </div>
      </div>
    </>
  );
}
