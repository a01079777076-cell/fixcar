"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Trophy, TrendingDown, Zap, Star } from "lucide-react";

const RANKINGS: Record<string, { icon: string; color: string; bg: string; desc: string; items: { rank:number; name:string; year:number; price:number; mileage:number; tag:string }[] }> = {
  "최고가": { icon:"🏆", color:"#E8A020", bg:"#FFF8EC", desc:"픽스카 최고가 차량 TOP 5",
    items:[{rank:1,name:"제네시스 GV80 3.5 AWD",year:2024,price:7800,mileage:8000,tag:"최고가"},{rank:2,name:"제네시스 G80 3.5 AWD",year:2023,price:6900,mileage:12000,tag:"제네시스"},{rank:3,name:"기아 EV6 GT AWD",year:2024,price:6200,mileage:5000,tag:"전기"},{rank:4,name:"현대 아이오닉 6 AWD",year:2024,price:5800,mileage:9000,tag:"전기"},{rank:5,name:"현대 팰리세이드 캘리그래피",year:2023,price:5200,mileage:18000,tag:"SUV"}]},
  "최저가": { icon:"💚", color:"#2D8A52", bg:"#EAF6EF", desc:"알뜰 가성비 차량 TOP 5",
    items:[{rank:1,name:"현대 엑센트 1.4 가솔린",year:2018,price:480,mileage:82000,tag:"가성비"},{rank:2,name:"기아 모닝 1.0 LX",year:2019,price:520,mileage:76000,tag:"경차"},{rank:3,name:"현대 아반떼 AD 1.6",year:2019,price:680,mileage:68000,tag:"무사고"},{rank:4,name:"기아 스토닉 1.4 터보",year:2020,price:890,mileage:54000,tag:"SUV"},{rank:5,name:"르노 QM3 1.5 dCi",year:2019,price:950,mileage:61000,tag:"수입"}]},
  "풀옵션": { icon:"⭐", color:"#FF3B1E", bg:"#FFF0ED", desc:"옵션이 가장 많은 차량 TOP 5",
    items:[{rank:1,name:"현대 팰리세이드 캘리그래피",year:2023,price:5200,mileage:18000,tag:"17개 옵션"},{rank:2,name:"기아 쏘렌토 시그니처",year:2023,price:4200,mileage:22000,tag:"15개 옵션"},{rank:3,name:"현대 투싼 인스퍼레이션",year:2022,price:3100,mileage:28000,tag:"14개 옵션"},{rank:4,name:"현대 쏘나타 더 엣지",year:2023,price:2900,mileage:31000,tag:"13개 옵션"},{rank:5,name:"기아 K5 시그니처",year:2022,price:2700,mileage:35000,tag:"12개 옵션"}]},
  "깡통": { icon:"⚡", color:"#1847FF", bg:"#EEF2FF", desc:"기본 사양만 탑재한 깡통 TOP 5",
    items:[{rank:1,name:"현대 아반떼 CN7 스마트",year:2021,price:1200,mileage:42000,tag:"4개 옵션"},{rank:2,name:"기아 K3 트렌디",year:2021,price:1050,mileage:48000,tag:"4개 옵션"},{rank:3,name:"현대 쏘나타 베이직",year:2020,price:1600,mileage:55000,tag:"5개 옵션"},{rank:4,name:"기아 스포티지 트렌디",year:2021,price:1750,mileage:38000,tag:"5개 옵션"},{rank:5,name:"현대 투싼 스마트",year:2021,price:1980,mileage:32000,tag:"5개 옵션"}]},
  "저주행": { icon:"🚀", color:"#9B59B6", bg:"#F5EEF8", desc:"주행거리가 가장 적은 차량 TOP 5",
    items:[{rank:1,name:"현대 아이오닉 6 2WD",year:2024,price:5200,mileage:2100,tag:"2,100km"},{rank:2,name:"기아 EV6 스탠다드 2WD",year:2023,price:4800,mileage:3800,tag:"3,800km"},{rank:3,name:"현대 아반떼 CN7",year:2024,price:2100,mileage:4200,tag:"4,200km"},{rank:4,name:"기아 K5 1.6 터보",year:2024,price:2800,mileage:5600,tag:"5,600km"},{rank:5,name:"현대 투싼 NX4",year:2023,price:3100,mileage:7800,tag:"7,800km"}]},
  "초보 추천": { icon:"🔰", color:"#2D8A52", bg:"#EAF6EF", desc:"초보 운전자 베스트 TOP 5",
    items:[{rank:1,name:"현대 아반떼 CN7 1.6 MPI",year:2021,price:1450,mileage:32000,tag:"1위"},{rank:2,name:"기아 K3 1.6 MPI",year:2021,price:1090,mileage:51000,tag:"가성비"},{rank:3,name:"현대 엑센트 1.4",year:2020,price:780,mileage:48000,tag:"경형"},{rank:4,name:"기아 모닝 LX",year:2022,price:880,mileage:28000,tag:"경차"},{rank:5,name:"현대 코나 1.6 스마트",year:2021,price:1950,mileage:38000,tag:"소형SUV"}]},
};

const MEDALS = ["🥇","🥈","🥉","4️⃣","5️⃣"];

export default function RankingPage() {
  const [active, setActive] = useState("최고가");
  const cur = RANKINGS[active];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        .rcard { background:white; border-radius:14px; padding:16px 20px; transition:all 0.2s; }
        .rcard:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.07); }
        @media(max-width:768px){ .page-wrap{padding:16px !important;} }
      `}</style>
      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <Navbar />
        <div style={{ background:"#1A1A1A", padding:"44px 52px 0" }}>
          <div style={{ maxWidth:"860px", margin:"0 auto" }}>
            <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#FF7A63", marginBottom:"10px" }}>RANKING</div>
            <h1 style={{ fontSize:"clamp(24px,4vw,44px)", fontWeight:800, color:"white", letterSpacing:"-1px", marginBottom:"28px" }}>자동차 <span style={{ color:"#FF3B1E" }}>랭킹</span>표</h1>
            <div style={{ display:"flex", gap:"0", overflowX:"auto" }}>
              {Object.entries(RANKINGS).map(([tab, val]) => (
                <button key={tab} onClick={() => setActive(tab)}
                  style={{ padding:"12px 20px", background:"transparent", border:"none", fontSize:"14px", fontWeight:active===tab?800:600, color:active===tab?"white":"rgba(255,255,255,0.4)", borderBottom:`3px solid ${active===tab?"#FF3B1E":"transparent"}`, marginBottom:"-1px", whiteSpace:"nowrap" }}>
                  {val.icon} {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="page-wrap" style={{ maxWidth:"860px", margin:"0 auto", padding:"28px 52px 80px" }}>
          <div style={{ background:cur.bg, borderRadius:"14px", padding:"14px 20px", marginBottom:"18px", border:`1px solid ${cur.color}33` }}>
            <div style={{ fontSize:"15px", fontWeight:800, color:cur.color }}>{cur.icon} {active} 랭킹</div>
            <div style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>{cur.desc}</div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {cur.items.map((item, i) => (
              <a key={i} href="/cars">
                <div className="rcard">
                  <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                    <div style={{ fontSize:"22px", width:"32px", textAlign:"center", flexShrink:0 }}>{MEDALS[i]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"3px" }}>
                        <span style={{ fontSize:"15px", fontWeight:800 }}>{item.name}</span>
                        <span style={{ background:cur.bg, color:cur.color, padding:"2px 8px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{item.tag}</span>
                      </div>
                      <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{item.year}년식 · {item.mileage.toLocaleString()}km</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:"20px", fontWeight:800, color:cur.color }}>{item.price.toLocaleString()}<span style={{ fontSize:"11px", color:"#AAA", marginLeft:"2px" }}>만</span></div>
                      <div style={{ fontSize:"10px", color:"#1847FF", fontWeight:800 }}>🔒 FIX</div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div style={{ background:"#1A1A1A", borderRadius:"16px", padding:"20px 24px", marginTop:"18px", textAlign:"center" }}>
            <div style={{ fontSize:"15px", fontWeight:800, color:"white", marginBottom:"10px" }}>전체 매물 더 보기</div>
            <a href="/cars"><button style={{ background:"#FF3B1E", color:"white", border:"none", padding:"11px 28px", borderRadius:"100px", fontSize:"14px", fontWeight:800 }}>FIX 가격 매물 보기</button></a>
          </div>
        </div>
      </div>
    </>
  );
}
