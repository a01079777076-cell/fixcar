"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface DealerRank { id:number; shopName:string; ownerName?:string; rating:number; reviewCount:number; dealCount:number; region?:string; profileImage?:string; }

export default function HomeDealerRanking() {
  const [dealers, setDealers] = useState<DealerRank[]>([]);

  useEffect(() => {
    fetch("/api/dealers/ranking?limit=5").then(r=>r.json())
      .then(d=>setDealers(Array.isArray(d)?d:(d.dealers||[])))
      .catch(()=>setDealers([]));
  }, []);

  /* 더미 데이터 */
  const items = dealers.length > 0 ? dealers : [
    { id:1, shopName:"광주제일모터스", ownerName:"김대표", rating:4.9, reviewCount:127, dealCount:342, region:"광주 북구" },
    { id:2, shopName:"픽스카 직영점", ownerName:"박매니저", rating:4.8, reviewCount:98, dealCount:256, region:"광주 서구" },
    { id:3, shopName:"남구자동차", ownerName:"이사장", rating:4.7, reviewCount:85, dealCount:198, region:"광주 남구" },
    { id:4, shopName:"첨단오토", ownerName:"정대표", rating:4.6, reviewCount:64, dealCount:167, region:"광주 광산구" },
    { id:5, shopName:"무등모터스", ownerName:"최딜러", rating:4.5, reviewCount:52, dealCount:134, region:"광주 동구" },
  ];

  const medals = ["🥇","🥈","🥉"];

  return (
    <section style={{ maxWidth:"1360px", margin:"0 auto 80px", padding:"0 52px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"28px" }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"13px", letterSpacing:"4px", color:"#E8A020", marginBottom:"6px" }}>DEALER RANKING</div>
          <h2 style={{ fontSize:"26px", fontWeight:800, letterSpacing:"-1px" }}>이달의 우수 딜러</h2>
          <p style={{ fontSize:"14px", color:"#AAA", fontWeight:400, marginTop:"4px" }}>고객 평가 기반 딜러 랭킹</p>
        </div>
        <Link href="/ranking/dealers" style={{ fontSize:"14px", fontWeight:700, color:"#888", textDecoration:"none" }}>
          전체 랭킹 →
        </Link>
      </div>

      <div style={{ display:"flex", gap:"14px", overflowX:"auto", paddingBottom:"8px", scrollSnapType:"x mandatory", WebkitOverflowScrolling:"touch" }}>
        {items.slice(0,5).map((dealer, i) => (
          <Link key={dealer.id} href={`/ranking/dealers#${dealer.id}`} style={{ textDecoration:"none", flexShrink:0, scrollSnapAlign:"start" }}>
            <div style={{
              width:"clamp(160px,30vw,200px)",
              background: i===0 ? "linear-gradient(135deg, #FFF8EC, #FFF0DD)" : "white",
              border: i===0 ? "2px solid #E8A020" : "1.5px solid #E8E6E1",
              borderRadius:"20px", padding:"24px 20px", textAlign:"center", cursor:"pointer",
              transition:"all 0.2s", position:"relative",
            }}>
              {/* 순위 */}
              <div style={{ position:"absolute", top:12, left:14, fontSize:i<3?"20px":"14px" }}>
                {i<3 ? medals[i] : `${i+1}위`}
              </div>

              {/* 프로필 */}
              <div style={{
                width:"64px", height:"64px", borderRadius:"50%", margin:"0 auto 12px",
                background: dealer.profileImage ? "transparent" : "#F0EEE9",
                border: i===0 ? "3px solid #E8A020" : "2px solid #E8E6E1",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"24px", overflow:"hidden",
              }}>
                {dealer.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={dealer.profileImage} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                ) : "🏪"}
              </div>

              {/* 상호명 */}
              <div style={{ fontSize:"15px", fontWeight:800, color:"#1A1A1A", marginBottom:"2px" }}>{dealer.shopName}</div>
              <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400, marginBottom:"10px" }}>{dealer.ownerName} · {dealer.region}</div>

              {/* 평점 */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"4px", marginBottom:"6px" }}>
                <span style={{ color:"#E8A020", fontSize:"14px" }}>⭐</span>
                <span style={{ fontSize:"18px", fontWeight:800, color: i===0?"#E8A020":"#1A1A1A" }}>{dealer.rating}</span>
              </div>

              {/* 통계 */}
              <div style={{ fontSize:"11px", color:"#CCC", fontWeight:400 }}>
                리뷰 {dealer.reviewCount}건 · 거래 {dealer.dealCount}건
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`.dealer-scroll::-webkit-scrollbar{display:none;}`}</style>
    </section>
  );
}
