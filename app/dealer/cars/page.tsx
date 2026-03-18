"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";

interface Car { id: number; name: string; price: number; mileage: number; year: number; status: string; images: string[]; }

export default function DealerCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cars?dealerId=1")
      .then(r => r.json())
      .then(d => { if (d.success) setCars(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleStatus = async (id: number, status: string) => {
    const newStatus = status === "AVAILABLE" ? "SOLD" : "AVAILABLE";
    await fetch(`/api/cars/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    setCars(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const deleteCar = async (id: number) => {
    if (!confirm("정말 삭제할까요?")) return;
    await fetch(`/api/cars/${id}`, { method: "DELETE" });
    setCars(prev => prev.filter(c => c.id !== id));
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        .car-row:hover { background:#FAFAF8; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "#1A1A1A", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue',serif", fontSize: "24px", letterSpacing: "3px" }}><span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "white" }}>CAR</span></a>
          <a href="/dealer" style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>← 대시보드</a>
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 32px 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px" }}>매물 관리</h1>
            <a href="/dealer/cars/new">
              <button style={{ background: "#FF3B1E", color: "white", border: "none", padding: "11px 22px", borderRadius: "10px", fontSize: "14px", fontWeight: 800, display: "flex", alignItems: "center", gap: "7px" }}>
                <Plus size={16} /> 새 매물 등록
              </button>
            </a>
          </div>

          {loading ? (
            <div style={{ background: "white", borderRadius: "18px", padding: "60px", textAlign: "center", color: "#AAA" }}>로딩 중...</div>
          ) : cars.length === 0 ? (
            <div style={{ background: "white", borderRadius: "18px", padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "8px" }}>등록된 매물이 없어요</div>
              <a href="/dealer/cars/new"><button style={{ background: "#FF3B1E", color: "white", border: "none", padding: "12px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: 800, marginTop: "12px", cursor: "pointer" }}>첫 매물 등록하기</button></a>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: "18px", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 120px", padding: "14px 20px", borderBottom: "2px solid #F0EEE9", fontSize: "12px", fontWeight: 800, color: "#AAA" }}>
                <span>차량</span><span>가격</span><span>주행거리</span><span>상태</span><span>관리</span>
              </div>
              {cars.map(car => (
                <div key={car.id} className="car-row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 120px", padding: "16px 20px", borderBottom: "1px solid #F0EEE9", alignItems: "center", transition: "background 0.1s" }}>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 800 }}>{car.name}</div>
                    <div style={{ fontSize: "12px", color: "#AAA", marginTop: "2px", fontWeight: 400 }}>{car.year}년식</div>
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 800 }}>{car.price.toLocaleString()}만원</div>
                  <div style={{ fontSize: "14px", color: "#555", fontWeight: 400 }}>{car.mileage.toLocaleString()}km</div>
                  <div>
                    <span style={{ background: car.status === "AVAILABLE" ? "#EAF6EF" : car.status === "RESERVED" ? "#EEF2FF" : "#F8F6F2", color: car.status === "AVAILABLE" ? "#2D8A52" : car.status === "RESERVED" ? "#1847FF" : "#888", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 800 }}>
                      {car.status === "AVAILABLE" ? "판매중" : car.status === "RESERVED" ? "예약중" : "판매완료"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <a href={`/cars/${car.id}`} title="보기"><button style={{ width: "30px", height: "30px", border: "1.5px solid #E0DDD7", borderRadius: "8px", background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}><Eye size={14} color="#555" /></button></a>
                    <button title="상태변경" onClick={() => toggleStatus(car.id, car.status)} style={{ width: "30px", height: "30px", border: "1.5px solid #E0DDD7", borderRadius: "8px", background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {car.status === "AVAILABLE" ? <ToggleRight size={14} color="#2D8A52" /> : <ToggleLeft size={14} color="#AAA" />}
                    </button>
                    <button title="삭제" onClick={() => deleteCar(car.id)} style={{ width: "30px", height: "30px", border: "1.5px solid #FFB8A8", borderRadius: "8px", background: "#FFF0ED", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={14} color="#FF3B1E" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
