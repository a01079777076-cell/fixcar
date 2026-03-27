"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface DealerRank { id:number; shopName:string; ownerName?:string; rating:number; reviewCount:number; dealCount:number; region?:string; profileImage?:string; }

const DUMMY: DealerRank[] = [
  { id:1, shopName:"광주제일모터스", ownerName:"김대표",  rating:4.9, reviewCount:127, dealCount:342, region:"광주 북구" },
  { id:2, shopName:"픽스카 직영점",  ownerName:"박매니저", rating:4.8, reviewCount:98,  dealCount:256, region:"광주 서구" },
  { id:3, shopName:"남구자동차",     ownerName:"이사장",  rating:4.7, reviewCount:85,  dealCount:198, region:"광주 남구" },
  { id:4, shopName:"첨단오토",       ownerName:"정대표",  rating:4.6, reviewCount:64,  dealCount:167, region:"광주 광산구" },
  { id:5, shopName:"무등모터스",     ownerName:"최딜러",  rating:4.5, reviewCount:52,  dealCount:134, region:"광주 동구" },
  { id:6, shopName:"빛고을카",       ownerName:"강매니저", rating:4.4, reviewCount:41,  dealCount:98,  region:"광주 남구" },
];

const MEDALS = ["🥇","🥈","🥉"];

export default function HomeDealerRanking() {
  const [dealers, setDealers] = useState<DealerRank[]>([]);

  useEffect(() => {
    fetch("/api/dealers/ranking?limit=6")
      .then(r => r.json())
      .then(d => setDealers(Array.isArray(d) ? d : d.dealers || []))
      .catch(() => setDealers([]));
  }, []);

  const items = (dealers.length > 0 ? dealers : DUMMY).slice(0, 6);

  return (
    <section style={{ maxWidth:"1360px", margin:"0 auto 80px", padding:"0 52px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28 }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:4, color:"#E8A020", marginBottom:6 }}>DEALER RANKING</div>
          <h2 style={{ fontSize:26, fontWeight:800, letterSpacing:-1 }}>이달의 우수 딜러</h2>
          <p style={{ fontSize:14, color:"#AAA", fontWeight:400, marginTop:4 }}>고객 평가 기반 딜러 랭킹</p>
        </div>
        <Link href="/ranking/dealers" style={{ fontSize:14, fontWeight:700, color:"#888", textDecoration:"none" }}>전체 랭킹 →</Link>
      </div>

      {/* 6개: 2행 3열 (데스크탑) / 모바일 가로 스크롤 */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12, overflowX:"auto" }}>
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
              <div style={{ width:52, height:52, borderRadius:"50%", margin:"0 auto 10px", background:dealer.profileImage?"transparent":"#F0EEE9", border:i===0?"3px solid #E8A020":"2px solid #E8E6E1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, overflow:"hidden" }}>
                {dealer.profileImage ? <img src={dealer.profileImage} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : "🏪"}
              </div>
              <div style={{ fontSize:13, fontWeight:800, color:"#1A1A1A", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{dealer.shopName}</div>
              <div style={{ fontSize:10, color:"#AAA", fontWeight:400, marginBottom:8, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{dealer.region}</div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:3, marginBottom:4 }}>
                <span style={{ color:"#E8A020", fontSize:12 }}>⭐</span>
                <span style={{ fontSize:16, fontWeight:800, color:i===0?"#E8A020":"#1A1A1A" }}>{dealer.rating}</span>
              </div>
              <div style={{ fontSize:10, color:"#CCC" }}>리뷰 {dealer.reviewCount} · 거래 {dealer.dealCount}</div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`@media(max-width:768px){.dealer-grid{grid-template-columns:repeat(3,1fr)!important;}}`}</style>
    </section>
  );
}
