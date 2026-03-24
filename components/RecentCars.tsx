"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface RecentCar { id:number; name:string; brand:string; price:number; image?:string; viewedAt:number; }

const STORAGE_KEY = "fixcar_recent_cars";
const MAX_RECENT = 10;

/** 최근 본 차량 저장 */
export function saveRecentCar(car: { id:number; name:string; brand:string; price:number; images?:string[] }) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as RecentCar[];
    const filtered = stored.filter(c => c.id !== car.id);
    filtered.unshift({ id: car.id, name: car.name, brand: car.brand, price: car.price, image: car.images?.[0], viewedAt: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_RECENT)));
  } catch {}
}

/** 최근 본 차량 목록 컴포넌트 */
export default function RecentCars() {
  const [cars, setCars] = useState<RecentCar[]>([]);

  useEffect(() => {
    try { const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); setCars(stored); } catch {}
  }, []);

  if (cars.length === 0) return null;

  return (
    <section style={{ maxWidth: 1360, margin: "0 auto 40px", padding: "0 52px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800 }}>🕐 최근 본 차량</h3>
        <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setCars([]); }} style={{ border: "none", background: "transparent", fontSize: 12, color: "#CCC", cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>전체 삭제</button>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
        {cars.map(car => (
          <Link key={car.id} href={`/cars/${car.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 160, background: "white", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ height: 100, background: "#F0EEE9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {car.image ? <img src={car.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 28, opacity: 0.2 }}>🚗</span>}
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 12, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{car.name}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#FF3B1E" }}>{car.price.toLocaleString()}<span style={{ fontSize: 10, color: "#AAA" }}>만</span></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
