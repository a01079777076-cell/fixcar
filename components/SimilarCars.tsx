"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface SimilarCar {
  id: number;
  name: string;
  brand: string;
  year: number;
  mileage: number;
  price: number;
  fuel: string;
  images: string[];
  accident: boolean;
  views: number;
}

interface Props {
  carId: string;
  brand: string;
  price: number;
  fuel: string;
}

export default function SimilarCars({ carId, brand, price, fuel }: Props) {
  const [cars, setCars] = useState<SimilarCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!brand || !price) { setLoading(false); return; }
    const minP = Math.floor(price * 0.65);
    const maxP = Math.ceil(price * 1.35);
    const url  = `/api/cars?brand=${encodeURIComponent(brand)}&minPrice=${minP}&maxPrice=${maxP}&limit=5&excludeId=${carId}`;

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        const list: SimilarCar[] = Array.isArray(d.data) ? d.data : [];
        /* 동일 ID 한번 더 제거 */
        setCars(list.filter((c) => String(c.id) !== String(carId)).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [carId, brand, price, fuel]);

  if (loading) return null;
  if (cars.length === 0) return null;

  return (
    <div style={{ marginTop: 36 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
        🔍 이 차와 비슷한 매물
      </h3>
      <p style={{ fontSize: 12, color: "#AAA", marginBottom: 16 }}>
        {brand} · 가격대 {Math.floor(price * 0.65).toLocaleString()}~{Math.ceil(price * 1.35).toLocaleString()}만원
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {cars.map((car) => {
          const img = car.images?.[0] || "";
          return (
            <Link key={car.id} href={`/cars/${car.id}`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "white",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "none";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                }}
              >
                {/* 이미지 */}
                <div
                  style={{
                    height: 130,
                    background: "#F0EEE9",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {img ? (
                    <img
                      src={img}
                      alt={car.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 32,
                        color: "#CCC",
                      }}
                    >
                      🚗
                    </div>
                  )}
                  {!car.accident && (
                    <span
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        background: "rgba(45,138,82,0.9)",
                        color: "white",
                        fontSize: 9,
                        fontWeight: 800,
                        padding: "2px 7px",
                        borderRadius: 100,
                      }}
                    >
                      무사고
                    </span>
                  )}
                </div>

                {/* 정보 */}
                <div style={{ padding: "12px 14px" }}>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#FF3B1E",
                      marginBottom: 2,
                    }}
                  >
                    {car.price.toLocaleString()}
                    <span style={{ fontSize: 11, color: "#AAA", fontWeight: 600 }}>만원</span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1A1A1A",
                      marginBottom: 3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {car.brand} {car.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#AAA" }}>
                    {car.year}년 · {car.mileage.toLocaleString()}km · {car.fuel}
                  </div>
                  {car.views > 0 && (
                    <div style={{ fontSize: 10, color: "#CCC", marginTop: 4 }}>
                      👁 {car.views.toLocaleString()}회
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
