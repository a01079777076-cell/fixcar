"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface DealerRank { id:number; shopName:string; region?:string; rating:number; reviewCount:number; dealCount:number; carCount:number; }

const MEDALS = ["🥇","🥈","🥉"];

/* 실제 DB에 등록된 인증 딜러만 표시 (더미 데이터 없음) */
export default function HomeDealerRanking() {
  const [dealers, setDealers] = useState<DealerRank[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/dealers/ranking?limit=6")
      .then(r => r.json())
      .then(d => setDealers(d?.success && Array.isArray(d.data) ? d.data : []))
      .catch(() => setDealers([]))
      .finally(() => setLoaded(true));
  }, []);

  const items = dealers.slice(0, 6);

  return (
    <section style={{ maxWidth:"1360px", margin:"0 auto 80px", padding:"0 52px" }} className="home-dealer-ranking">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28 }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:4, color:"#E8A020", marginBottom:6 }}>DEALER RANKING</div>
          <h2 style={{ fontSize:26, fontWeight:800, letterSpacing:-1 }}>이달의 우수 딜러</h2>
          <p style={{ fontSize:14, color:"#AAA", fontWeight:400, marginTop:4 }}>픽스카 인증 딜러 · 고객 평가 기반</p>
        </div>
        <Link href="/shops" style={{ fontSize:14, fontWeight:700, color:"#888", textDecoration:"none" }}>전체 상사 →</Link>
      </div>

      {loaded && items.length === 0 ? (
        /* 인증 딜러가 아직 없을 때 */
        <div style={{ background:"white", border:"1.5px dashed #E0DDD7", borderRadius:20, padding:"40px 24px", textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:10 }}>🏪</div>
          <div style={{ fontSize:16, fontWeight:800, color:"#1A1A1A", marginBottom:6 }}>픽스카 인증 딜러를 모집하고 있어요</div>
          <div style={{ fontSize:13, color:"#AAA", marginBottom:18 }}>광주·전남 매매상사라면 지금 무료로 입점하세요</div>
          <Link href="/dealer/apply" style={{ display:"inline-block", background:"#0066FF", color:"white", padding:"10px 22px", borderRadius:10, fontSize:13, fontWeight:800, textDecoration:"none" }}>딜러 입점 신청 →</Link>
        </div>
      ) : (
        <div className="dealer-grid" style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12, overflowX:"auto" }}>
          {items.map((dealer, i) => (
            <Link key={dealer.id} href={`/shops/${dealer.id}`} style={{ textDecoration:"none" }}>
              <div style={{
                background: i===0 ? "linear-gradient(135deg,#FFF8EC,#FFF0DD)" : "white",
                border: i===0 ? "2px solid #E8A020" : "1.5px solid #E8E6E1",
                borderRadius:20, padding:"20px 16px", textAlign:"center", cursor:"pointer",
                transition:"all 0.2s", position:"relative",
              }}>
                <div style={{ position:"absolute", top:10, left:12, fontSize:i<3?18:12, fontWeight:700, color:"#AAA" }}>
                  {i < 3 ? MEDALS[i] : `${i+1}위`}
                </div>
                <div style={{ width:52, height:52, borderRadius:"50%", margin:"0 auto 10px", background:"#F0EEE9", border:i===0?"3px solid #E8A020":"2px solid #E8E6E1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, overflow:"hidden" }}>
                  🏪
                </div>
                <div style={{ fontSize:13, fontWeight:800, color:"#1A1A1A", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{dealer.shopName}</div>
                <div style={{ fontSize:10, color:"#AAA", fontWeight:400, marginBottom:8, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", minHeight:12 }}>{dealer.region}</div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:3, marginBottom:4 }}>
                  {dealer.reviewCount > 0 ? (
                    <>
                      <span style={{ color:"#E8A020", fontSize:12 }}>⭐</span>
                      <span style={{ fontSize:16, fontWeight:800, color:i===0?"#E8A020":"#1A1A1A" }}>{dealer.rating.toFixed(1)}</span>
                    </>
                  ) : (
                    <span style={{ fontSize:12, fontWeight:700, color:"#BBB" }}>신규 딜러</span>
                  )}
                </div>
                <div style={{ fontSize:10, color:"#CCC" }}>리뷰 {dealer.reviewCount} · 매물 {dealer.carCount}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`@media(max-width:768px){.home-dealer-ranking{padding:0 16px!important;}.dealer-grid{grid-template-columns:repeat(3,1fr)!important;}}`}</style>
    </section>
  );
}
