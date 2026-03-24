"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Car {
  id: number; name: string; brand: string; price: number; year: number;
  mileage: number; fuel: string; images: string[]; tags: string[];
  accident: boolean; region: string;
}

export default function HomeRecommendCars() {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    fetch("/api/cars?limit=6")
      .then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : d.data || d.cars || [];
        setCars(arr.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  if (cars.length === 0) return null;

  return (
    <section style={{ maxWidth: 1360, margin: "0 auto 60px", padding: "0 52px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3, color: "#FF3B1E", marginBottom: 6 }}>RECOMMEND</div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>추천 매물</h2>
        </div>
        <Link href="/cars" style={{ fontSize: 13, fontWeight: 700, color: "#888", textDecoration: "none" }}>전체 보기 →</Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {cars.map(car => (
          <Link key={car.id} href={`/cars/${car.id}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "white", borderRadius: 18, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ height: 180, background: "#F0EEE9", overflow: "hidden", position: "relative" }}>
                {car.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={car.images[0]} alt={car.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, opacity: 0.15 }}>🚗</div>
                )}
                {!car.accident && (
                  <span style={{ position: "absolute", top: 10, left: 10, background: "#2D8A52", color: "white", padding: "3px 8px", borderRadius: 100, fontSize: 10, fontWeight: 800 }}>무사고</span>
                )}
                <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.5)", color: "white", padding: "3px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700 }}>{car.region}</span>
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                  {(car.tags || []).slice(0, 2).map(t => (
                    <span key={t} style={{ fontSize: 10, fontWeight: 700, color: "#FF3B1E", background: "#FFF0ED", padding: "2px 6px", borderRadius: 4 }}>{t}</span>
                  ))}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{car.brand} {car.name}</div>
                <div style={{ fontSize: 12, color: "#AAA", marginBottom: 8 }}>{car.year}년 · {car.mileage?.toLocaleString()}km · {car.fuel}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, color: "#FF3B1E" }}>FIX</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A", marginLeft: 6 }}>{car.price?.toLocaleString()}</span>
                    <span style={{ fontSize: 12, color: "#AAA" }}>만원</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#CCC" }}>월 {Math.round(car.price * 0.7 / 36)}만</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
