"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface SimilarCar {
  id: number; name: string; brand: string; year: number; mileage: number;
  fuel: string; price: number; images: string[];
}

export default function SimilarCars({ carId, brand, price, fuel }: { carId: string; brand: string; price: number; fuel: string }) {
  const [cars, setCars] = useState<SimilarCar[]>([]);

  useEffect(() => {
    fetch("/api/cars?limit=200")
      .then(r => r.json())
      .then(d => {
        const all: SimilarCar[] = Array.isArray(d) ? d : d.data || d.cars || [];
        /* 같은 브랜드 또는 비슷한 가격대(±500만) 또는 같은 연료, 본인 제외 */
        const similar = all
          .filter(c => String(c.id) !== String(carId))
          .map(c => {
            let score = 0;
            if (c.brand === brand) score += 3;
            if (c.fuel === fuel) score += 2;
            if (Math.abs(c.price - price) <= 500) score += 2;
            if (Math.abs(c.price - price) <= 200) score += 1;
            return { ...c, score };
          })
          .filter(c => (c as any).score > 0)
          .sort((a, b) => (b as any).score - (a as any).score)
          .slice(0, 6);
        setCars(similar);
      })
      .catch(() => {});
  }, [carId, brand, price, fuel]);

  if (cars.length === 0) return null;

  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>🚗 이 차와 비슷한 매물</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
        {cars.map(car => (
          <Link key={car.id} href={`/cars/${car.id}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "white", borderRadius: 16, overflow: "hidden", transition: "all 0.2s", cursor: "pointer" }}>
              <div style={{ height: 140, background: "#F0EEE9", overflow: "hidden" }}>
                {car.images?.[0] ? (
                  <img src={car.images[0]} alt={car.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, opacity: 0.2 }}>🚗</div>
                )}
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#1A1A1A", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{car.brand} {car.name}</div>
                <div style={{ fontSize: 12, color: "#AAA", marginBottom: 6 }}>{car.year}년 · {car.mileage?.toLocaleString()}km · {car.fuel}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#FF3B1E" }}>{car.price?.toLocaleString()}<span style={{ fontSize: 11, color: "#AAA" }}>만원</span></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
