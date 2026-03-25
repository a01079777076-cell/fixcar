"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Search, Star, Car, Shield, MapPin } from "lucide-react";

interface DealerItem { id: number; shopName: string; rating: number; dealCount: number; verified: boolean; shopAddr?: string; complexName?: string; carCount: number }

export default function ShopsPage() {
  const [dealers, setDealers] = useState<DealerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"rating" | "deals" | "cars">("rating");

  useEffect(() => {
    fetch("/api/shops").then(r => r.json()).then(d => {
      setDealers(Array.isArray(d) ? d : d.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  /* 샘플 데이터 (DB 연동 전) */
  const sampleDealers: DealerItem[] = dealers.length > 0 ? [] : [
    { id: 1, shopName: "신뢰자동차", rating: 4.8, dealCount: 156, verified: true, shopAddr: "광주 광산구", complexName: "첨단 자동차매매단지", carCount: 12 },
    { id: 2, shopName: "광주모터스", rating: 4.5, dealCount: 89, verified: true, shopAddr: "광주 북구", complexName: "광주 종합자동차매매시장", carCount: 8 },
    { id: 3, shopName: "베스트카", rating: 4.3, dealCount: 67, verified: true, shopAddr: "광주 광산구", complexName: "하남 자동차매매단지", carCount: 15 },
    { id: 4, shopName: "드림오토", rating: 4.7, dealCount: 134, verified: false, shopAddr: "광주 남구", complexName: "남구 자동차거래센터", carCount: 6 },
    { id: 5, shopName: "에이스카", rating: 4.1, dealCount: 45, verified: true, shopAddr: "광주 서구", carCount: 10 },
    { id: 6, shopName: "프리미엄모터스", rating: 4.9, dealCount: 203, verified: true, shopAddr: "광주 광산구", complexName: "첨단 자동차매매단지", carCount: 20 },
  ];

  const displayDealers = dealers.length > 0 ? dealers : sampleDealers;

  let filtered = displayDealers.filter(d => !search || d.shopName.includes(search) || d.shopAddr?.includes(search) || d.complexName?.includes(search));

  if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
  else if (sort === "deals") filtered.sort((a, b) => b.dealCount - a.dealCount);
  else filtered.sort((a, b) => b.carCount - a.carCount);

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} .shop-card{transition:all 0.15s;} .shop-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.08)!important;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "linear-gradient(135deg,#0055FF,#003399)", padding: "40px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, bottom: -20, fontFamily: "'Bebas Neue',serif", fontSize: "clamp(80px,15vw,150px)", color: "rgba(255,255,255,0.08)", lineHeight: 1 }}>SHOPS</div>
          <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏪</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 6 }}>매매상사 목록</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>픽스카 등록 딜러 상사를 한눈에 확인하세요</p>
          </div>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px 100px" }}>
          {/* 검색 + 정렬 */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={16} color="#CCC" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="상사명, 지역 검색" style={{ width: "100%", padding: "12px 16px 12px 38px", borderRadius: 12, border: "1.5px solid #E0DDD7", fontSize: 14, fontFamily: "'NanumSquareRound',sans-serif", background: "white" }} />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value as "rating" | "deals" | "cars")} style={{ padding: "12px 16px", borderRadius: 12, border: "1.5px solid #E0DDD7", fontSize: 13, fontFamily: "'NanumSquareRound',sans-serif", background: "white", fontWeight: 700 }}>
              <option value="rating">평점순</option>
              <option value="deals">거래순</option>
              <option value="cars">매물순</option>
            </select>
          </div>

          <div style={{ fontSize: 13, color: "#AAA", marginBottom: 14 }}>총 {filtered.length}개 상사</div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "#CCC" }}>로딩 중...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#CCC" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏪</div>
              <p style={{ fontSize: 16, fontWeight: 700 }}>검색 결과가 없어요</p>
            </div>
          ) : (
            filtered.map(d => (
              <Link key={d.id} href={`/shops/${d.id}`}>
                <div className="shop-card" style={{ background: "white", borderRadius: 16, padding: "20px 24px", marginBottom: 10, display: "flex", alignItems: "center", gap: 16, border: "1px solid #E8E6E1", cursor: "pointer" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#0055FF,#003399)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "white", flexShrink: 0 }}>
                    {d.shopName[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 800 }}>{d.shopName}</span>
                      {d.verified && <Shield size={14} color="#2D8A52" />}
                    </div>
                    <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#AAA" }}>
                      {d.shopAddr && <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MapPin size={10} /> {d.shopAddr}</span>}
                      {d.complexName && <span>{d.complexName}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 14, fontWeight: 800, color: "#E8A020" }}><Star size={12} /> {d.rating.toFixed(1)}</div>
                      <div style={{ fontSize: 10, color: "#CCC" }}>평점</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#0066FF" }}>{d.carCount}</div>
                      <div style={{ fontSize: 10, color: "#CCC" }}>매물</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#555" }}>{d.dealCount}</div>
                      <div style={{ fontSize: 10, color: "#CCC" }}>거래</div>
                    </div>
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
