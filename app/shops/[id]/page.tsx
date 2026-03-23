"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, Car, Phone, MapPin, Shield, ChevronRight } from "lucide-react";

export default function ShopDetailPage() {
  const { id } = useParams();
  const [dealer, setDealer] = useState<any>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/shops/${id}`).then(r => r.json()).then(d => {
      if (d.dealer) setDealer(d.dealer);
      if (d.cars) setCars(d.cars);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><div style={{ textAlign: "center", padding: 100, color: "#CCC" }}>로딩 중...</div></>;
  if (!dealer) return <><Navbar /><div style={{ textAlign: "center", padding: 100 }}><div style={{ fontSize: 48, marginBottom: 12 }}>🏪</div><h2 style={{ fontSize: 20, fontWeight: 800 }}>딜러를 찾을 수 없어요</h2><Link href="/cars" style={{ color: "#FF3B1E", fontWeight: 700, marginTop: 12, display: "inline-block" }}>매물 보러가기 →</Link></div></>;

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        {/* 딜러 헤더 */}
        <div style={{ background: "linear-gradient(135deg,#0055FF,#003399)", padding: "40px 24px", color: "white" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, flexShrink: 0 }}>
                {(dealer.shopName || "D")[0]}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h1 style={{ fontSize: 24, fontWeight: 800 }}>{dealer.shopName}</h1>
                  {dealer.verified && <Shield size={16} color="#FEE500" />}
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 13, opacity: 0.8 }}>
                  <span><Star size={12} style={{ verticalAlign: "middle" }} /> {dealer.rating?.toFixed(1) || "0.0"}</span>
                  <span><Car size={12} style={{ verticalAlign: "middle" }} /> 거래 {dealer.dealCount || 0}건</span>
                  <span>매물 {cars.length}대</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px 100px" }}>
          {/* 통계 카드 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
            <div style={{ background: "white", borderRadius: 16, padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#FF3B1E" }}>{cars.length}</div>
              <div style={{ fontSize: 12, color: "#AAA" }}>판매 중</div>
            </div>
            <div style={{ background: "white", borderRadius: 16, padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#1847FF" }}>{dealer.dealCount || 0}</div>
              <div style={{ fontSize: 12, color: "#AAA" }}>누적 거래</div>
            </div>
            <div style={{ background: "white", borderRadius: 16, padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#E8A020" }}>{dealer.rating?.toFixed(1) || "-"}</div>
              <div style={{ fontSize: 12, color: "#AAA" }}>평점</div>
            </div>
          </div>

          {/* 매물 목록 */}
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>🚗 판매 중인 매물 ({cars.length})</h2>
          {cars.length === 0 ? (
            <div style={{ background: "white", borderRadius: 18, padding: "48px 20px", textAlign: "center", color: "#CCC" }}>현재 판매 중인 매물이 없어요</div>
          ) : (
            cars.map((car: any) => (
              <Link key={car.id} href={`/cars/${car.id}`}>
                <div style={{ background: "white", borderRadius: 16, padding: "16px 20px", marginBottom: 10, display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 80, height: 60, borderRadius: 10, background: "#F0EEE9", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {car.images?.[0] ? <img src={car.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 22 }}>🚗</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{car.brand} {car.name}</div>
                    <div style={{ fontSize: 12, color: "#AAA" }}>{car.year}년 · {car.mileage?.toLocaleString()}km · {car.fuel}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#FF3B1E" }}>{car.price?.toLocaleString()}<span style={{ fontSize: 11, color: "#AAA" }}>만</span></div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
