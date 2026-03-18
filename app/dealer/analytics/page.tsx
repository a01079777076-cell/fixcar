"use client";
import { useState, useEffect } from "react";
import { TrendingUp, Eye, Heart, MessageCircle, DollarSign, ArrowLeft } from "lucide-react";

export default function DealerAnalyticsPage() {
  const [period, setPeriod] = useState("7일");

  const stats = [
    { label:"총 조회수", value:"1,284", change:"+12%", color:"#1847FF", icon:<Eye size={20} color="white"/> },
    { label:"찜 수", value:"47", change:"+8%", color:"#FF3B1E", icon:<Heart size={20} color="white"/> },
    { label:"문의 수", value:"23", change:"+15%", color:"#2D8A52", icon:<MessageCircle size={20} color="white"/> },
    { label:"거래 성사", value:"3건", change:"+1건", color:"#E8A020", icon:<DollarSign size={20} color="white"/> },
  ];

  const chartData = [
    { day:"월", views:120, inquiries:3 },
    { day:"화", views:98, inquiries:2 },
    { day:"수", views:145, inquiries:5 },
    { day:"목", views:180, inquiries:4 },
    { day:"금", views:220, inquiries:6 },
    { day:"토", views:310, inquiries:8 },
    { day:"일", views:211, inquiries:5 },
  ];
  const maxViews = Math.max(...chartData.map(d => d.views));

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        .bar { transition:height 0.5s; }
      `}</style>
      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <div style={{ background:"#1A1A1A", padding:"0 32px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"24px", letterSpacing:"3px" }}><span style={{ color:"#FF3B1E" }}>FIX</span><span style={{ color:"white" }}>CAR</span></a>
          <a href="/dealer" style={{ fontSize:"14px", fontWeight:700, color:"rgba(255,255,255,0.5)", display:"flex", alignItems:"center", gap:"6px" }}><ArrowLeft size={15}/> 대시보드</a>
        </div>

        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"28px 32px 80px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
            <h1 style={{ fontSize:"26px", fontWeight:800 }}>성과 분석</h1>
            <div style={{ display:"flex", gap:"8px" }}>
              {["7일","30일","90일"].map(p => (
                <button key={p} onClick={() => setPeriod(p)} style={{ padding:"7px 16px", borderRadius:"100px", border:`2px solid ${period===p?"#1A1A1A":"#E0DDD7"}`, background:period===p?"#1A1A1A":"white", color:period===p?"white":"#555", fontSize:"13px", fontWeight:700 }}>{p}</button>
              ))}
            </div>
          </div>

          {/* KPI 카드 */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"24px" }}>
            {stats.map(s => (
              <div key={s.label} style={{ background:"white", borderRadius:"16px", padding:"20px 22px", display:"flex", alignItems:"center", gap:"14px" }}>
                <div style={{ width:"44px", height:"44px", background:s.color, borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{s.label}</div>
                  <div style={{ fontSize:"22px", fontWeight:800, letterSpacing:"-0.5px" }}>{s.value}</div>
                  <div style={{ fontSize:"12px", color:"#2D8A52", fontWeight:700 }}>{s.change}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 조회수 차트 */}
          <div style={{ background:"white", borderRadius:"20px", padding:"24px 28px", marginBottom:"20px" }}>
            <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"20px", display:"flex", alignItems:"center", gap:"8px" }}>
              <TrendingUp size={18} color="#1847FF" /> 일별 조회수
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:"8px", height:"160px" }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
                  <div style={{ fontSize:"11px", fontWeight:800, color:"#1847FF" }}>{d.views}</div>
                  <div className="bar" style={{ width:"100%", background:"linear-gradient(to top, #1847FF, #4A7AFF)", borderRadius:"6px 6px 0 0", height:`${(d.views/maxViews)*120}px`, minHeight:"8px" }} />
                  <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{d.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 문의 전환율 */}
          <div style={{ background:"white", borderRadius:"20px", padding:"24px 28px" }}>
            <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"16px" }}>문의 전환율</div>
            {[
              { label:"조회 → 찜", rate:3.7, color:"#FF3B1E" },
              { label:"조회 → 문의", rate:1.8, color:"#1847FF" },
              { label:"문의 → 거래", rate:13.0, color:"#2D8A52" },
            ].map(item => (
              <div key={item.label} style={{ marginBottom:"16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"14px", fontWeight:700, marginBottom:"6px" }}>
                  <span>{item.label}</span><span style={{ color:item.color, fontWeight:800 }}>{item.rate}%</span>
                </div>
                <div style={{ height:"8px", background:"#F0EEE9", borderRadius:"4px", overflow:"hidden" }}>
                  <div style={{ height:"8px", background:item.color, borderRadius:"4px", width:`${Math.min(item.rate*5,100)}%`, transition:"width 0.8s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
