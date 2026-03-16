"use client";

import { useState } from "react";
import {
  Car, TrendingUp, MessageCircle, DollarSign, Plus, Eye,
  Edit, Trash2, CheckCircle, Clock, AlertCircle, Bell,
  BarChart2, Users, Star, ChevronRight, Lock, Search,
  Filter, ArrowUp, ArrowDown, Phone, Mail, Package
} from "lucide-react";

const STATS = [
  { label:"등록 매물", value:"12", unit:"대", change:"+2", up:true, icon:<Car size={22} color="white"/>, color:"#FF3B1E", bg:"#FFF0ED" },
  { label:"이번달 조회수", value:"2,847", unit:"회", change:"+18%", up:true, icon:<Eye size={22} color="white"/>, color:"#1847FF", bg:"#EEF2FF" },
  { label:"미답변 문의", value:"3", unit:"건", change:"오늘", up:false, icon:<MessageCircle size={22} color="white"/>, color:"#E8A020", bg:"#FFF8EC" },
  { label:"이번달 거래", value:"4", unit:"건", change:"+1", up:true, icon:<DollarSign size={22} color="white"/>, color:"#2D8A52", bg:"#EAF6EF" },
];

const MY_CARS = [
  { id:1, name:"현대 아반떼 CN7", year:"2021", mileage:"32,000km", price:1450, status:"판매중", views:284, likes:12, inquiry:2, query:"hyundai+elantra+white" },
  { id:2, name:"기아 K3", year:"2020", mileage:"51,000km", price:1090, status:"판매중", views:196, likes:8, inquiry:1, query:"kia+k3+silver" },
  { id:3, name:"현대 투싼 NX4", year:"2022", mileage:"28,000km", price:2780, status:"예약중", views:421, likes:19, inquiry:3, query:"hyundai+tucson+suv" },
  { id:4, name:"기아 쏘렌토 MQ4", year:"2021", mileage:"38,000km", price:3450, status:"판매중", views:167, likes:6, inquiry:0, query:"kia+sorento+suv" },
  { id:5, name:"현대 엑센트", year:"2019", mileage:"68,000km", price:680, status:"판매완료", views:312, likes:14, inquiry:0, query:"hyundai+accent+car" },
];

const INQUIRIES = [
  { id:1, carName:"현대 투싼 NX4", buyer:"김지원", phone:"010-1234-5678", msg:"직접 시승 가능한가요? 이번 주말에 방문하고 싶어요.", time:"10분 전", status:"미답변", urgent:true },
  { id:2, carName:"현대 아반떼 CN7", buyer:"박민서", phone:"010-2345-6789", msg:"할부 조건이 어떻게 되나요? 60개월 가능한지 궁금해요.", time:"1시간 전", status:"미답변", urgent:false },
  { id:3, carName:"현대 투싼 NX4", buyer:"이수연", phone:"010-3456-7890", msg:"사고 이력 없는 거 맞죠? 보험개발원 이력서 볼 수 있을까요?", time:"3시간 전", status:"답변완료", urgent:false },
  { id:4, carName:"기아 K3", buyer:"최민준", phone:"010-4567-8901", msg:"가격 조정 가능한가요?", time:"어제", status:"답변완료", urgent:false },
];

const TRANSACTIONS = [
  { id:1, carName:"현대 엑센트", buyer:"정수빈", amount:680, depositDate:"2024.01.14", status:"계약완료", type:"일시불" },
  { id:2, carName:"기아 K5 DL3", buyer:"홍길동", amount:1780, depositDate:"2024.01.10", status:"계약완료", type:"할부 60개월" },
  { id:3, carName:"현대 쏘나타 DN8", buyer:"김민지", amount:2100, depositDate:"2024.01.05", status:"잔금대기", type:"할부 48개월" },
  { id:4, carName:"현대 투싼 NX4", buyer:"김지원", amount:2780, depositDate:"진행중", status:"계약금결제", type:"미정" },
];

const NAV_ITEMS = [
  { key:"dashboard", label:"대시보드", icon:<BarChart2 size={18}/> },
  { key:"cars", label:"매물 관리", icon:<Car size={18}/> },
  { key:"inquiries", label:"문의 관리", icon:<MessageCircle size={18}/> },
  { key:"transactions", label:"거래 내역", icon:<DollarSign size={18}/> },
  { key:"analytics", label:"성과 분석", icon:<TrendingUp size={18}/> },
  { key:"profile", label:"딜러 프로필", icon:<Users size={18}/> },
];

export default function DealerPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [replyModal, setReplyModal] = useState<number|null>(null);
  const [replyText, setReplyText] = useState("");

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input, textarea, select { font-family:'NanumSquareRound',sans-serif; }

        .nav-item { transition:all 0.15s; cursor:pointer; border:none; background:transparent; width:100%; }
        .nav-item:hover { background:#F0EEE9 !important; }
        .stat-card { transition:all 0.2s; }
        .stat-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.07); }
        .car-row { transition:background 0.15s; }
        .car-row:hover { background:#FAFAF8; }
        .inquiry-item { transition:background 0.15s; cursor:pointer; }
        .inquiry-item:hover { background:#FAFAF8; }
        .btn-red { background:#FF3B1E; color:white; border:none; border-radius:12px; font-size:14px; font-weight:800; padding:12px 20px; display:flex; align-items:center; gap:8px; transition:all 0.2s; }
        .btn-red:hover { background:#D42E14; transform:translateY(-1px); }
        .btn-ghost { background:transparent; border:1.5px solid #E0DDD7; border-radius:10px; font-size:13px; font-weight:700; padding:8px 14px; display:flex; align-items:center; gap:6px; transition:all 0.15s; color:#555; }
        .btn-ghost:hover { border-color:#1A1A1A; color:#1A1A1A; }
        .form-input { width:100%; border:1.5px solid #E0DDD7; border-radius:10px; padding:12px 14px; font-size:14px; outline:none; transition:border-color 0.2s; background:#FAFAF8; }
        .form-input:focus { border-color:#FF3B1E; background:white; }

        @media(max-width:1024px) {
          .dealer-layout { grid-template-columns:1fr !important; }
          .sidebar { display:none !important; }
          .stats-grid { grid-template-columns:1fr 1fr !important; }
        }
        @media(max-width:600px) {
          .stats-grid { grid-template-columns:1fr !important; }
          .main-wrap { padding:16px !important; }
        }
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh", background:"#F0EEE9" }}>

        {/* ── 사이드바 ── */}
        <aside className="sidebar" style={{ width:"256px", flexShrink:0, background:"white", borderRight:"1px solid #ECEAE4", display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, bottom:0, zIndex:50 }}>

          {/* 로고 */}
          <div style={{ padding:"24px 24px 20px", borderBottom:"1px solid #ECEAE4" }}>
            <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"24px", letterSpacing:"3px", display:"block", marginBottom:"12px" }}>
              <span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span>
            </a>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 14px", background:"#F8F6F2", borderRadius:"12px" }}>
              <div style={{ width:"38px", height:"38px", background:"#EEF2FF", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Users size={18} color="#1847FF" />
              </div>
              <div>
                <div style={{ fontSize:"14px", fontWeight:800 }}>박준형 딜러</div>
                <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                  <span style={{ background:"#EEF2FF", color:"#1847FF", padding:"2px 8px", borderRadius:"100px", fontSize:"10px", fontWeight:800 }}>🏅 인증 딜러</span>
                </div>
              </div>
            </div>
          </div>

          {/* 네비 */}
          <nav style={{ flex:1, padding:"16px 12px", overflowY:"auto" }}>
            {NAV_ITEMS.map(item => (
              <button key={item.key} className="nav-item" onClick={()=>setActiveNav(item.key)} style={{ padding:"12px 14px", borderRadius:"10px", marginBottom:"4px", display:"flex", alignItems:"center", gap:"12px", background: activeNav===item.key?"#FFF0ED":"transparent", color: activeNav===item.key?"#FF3B1E":"#555", fontWeight: activeNav===item.key?800:600, fontSize:"14px", textAlign:"left" }}>
                <span style={{ color: activeNav===item.key?"#FF3B1E":"#AAA" }}>{item.icon}</span>
                {item.label}
                {item.key==="inquiries" && INQUIRIES.filter(i=>i.status==="미답변").length > 0 && (
                  <span style={{ marginLeft:"auto", background:"#FF3B1E", color:"white", borderRadius:"100px", padding:"2px 8px", fontSize:"11px", fontWeight:800 }}>{INQUIRIES.filter(i=>i.status==="미답변").length}</span>
                )}
              </button>
            ))}
          </nav>

          {/* 하단 */}
          <div style={{ padding:"16px 12px", borderTop:"1px solid #ECEAE4" }}>
            <a href="/" style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 14px", borderRadius:"10px", fontSize:"14px", fontWeight:600, color:"#888" }}>
              <Car size={16} /> 픽스카 홈 보기
            </a>
          </div>
        </aside>

        {/* ── 메인 ── */}
        <main style={{ marginLeft:"256px", flex:1, display:"flex", flexDirection:"column" }}>

          {/* 상단 헤더 */}
          <div style={{ background:"white", borderBottom:"1px solid #ECEAE4", padding:"0 32px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:40 }}>
            <div>
              <div style={{ fontSize:"18px", fontWeight:800 }}>
                {NAV_ITEMS.find(n=>n.key===activeNav)?.label}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <button style={{ position:"relative", background:"#F8F6F2", border:"none", width:"38px", height:"38px", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Bell size={18} color="#555" />
                <span style={{ position:"absolute", top:"6px", right:"6px", width:"8px", height:"8px", background:"#FF3B1E", borderRadius:"50%" }} />
              </button>
              {activeNav==="cars" && (
                <button className="btn-red" onClick={()=>alert("매물 등록 페이지로 이동")}>
                  <Plus size={16} /> 새 매물 등록
                </button>
              )}
            </div>
          </div>

          <div className="main-wrap" style={{ flex:1, padding:"28px 32px", overflowY:"auto" }}>

            {/* ── 대시보드 ── */}
            {activeNav==="dashboard" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>

                {/* 환영 */}
                <div style={{ background:"linear-gradient(135deg,#1A1A1A,#2A2A2A)", borderRadius:"20px", padding:"28px 32px", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", right:"-20px", bottom:"-20px", fontFamily:"'Bebas Neue',serif", fontSize:"100px", color:"rgba(255,255,255,0.04)", lineHeight:1, letterSpacing:"2px" }}>DEALER</div>
                  <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"2px", color:"#FF7A63", marginBottom:"8px" }}>DEALER DASHBOARD</div>
                  <div style={{ fontSize:"22px", fontWeight:800, color:"white", marginBottom:"4px" }}>박준형 딜러님, 안녕하세요! 👋</div>
                  <div style={{ fontSize:"14px", color:"rgba(255,255,255,0.45)", fontWeight:400 }}>오늘도 좋은 거래 되세요. 미답변 문의가 <strong style={{ color:"#FFB8A8" }}>3건</strong> 있어요.</div>
                </div>

                {/* 통계 4개 */}
                <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" }}>
                  {STATS.map(s => (
                    <div key={s.label} className="stat-card" style={{ background:"white", borderRadius:"16px", padding:"20px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
                        <div style={{ width:"44px", height:"44px", background:s.color, borderRadius:"14px", display:"flex", alignItems:"center", justifyContent:"center" }}>{s.icon}</div>
                        <span style={{ fontSize:"12px", fontWeight:800, color:s.up?"#2D8A52":"#E8A020", background:s.up?"#EAF6EF":"#FFF8EC", padding:"3px 8px", borderRadius:"100px", display:"flex", alignItems:"center", gap:"3px" }}>
                          {s.up ? <ArrowUp size={10}/> : <ArrowDown size={10}/>} {s.change}
                        </span>
                      </div>
                      <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"36px", color:"#1A1A1A", letterSpacing:"0.5px", lineHeight:1, marginBottom:"4px" }}>{s.value}<span style={{ fontSize:"16px", fontFamily:"'NanumSquareRound',sans-serif", fontWeight:700, color:"#AAA", marginLeft:"3px" }}>{s.unit}</span></div>
                      <div style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* 최근 문의 + 매물 현황 */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>

                  {/* 최근 문의 */}
                  <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
                    <div style={{ padding:"20px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #F0EEE9" }}>
                      <div style={{ fontSize:"16px", fontWeight:800 }}>최근 문의</div>
                      <button onClick={()=>setActiveNav("inquiries")} style={{ fontSize:"13px", fontWeight:700, color:"#888", background:"transparent", border:"none", display:"flex", alignItems:"center", gap:"4px" }}>더보기 <ChevronRight size={14}/></button>
                    </div>
                    {INQUIRIES.slice(0,3).map(inq => (
                      <div key={inq.id} className="inquiry-item" style={{ padding:"14px 22px", borderBottom:"1px solid #F0EEE9" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"5px" }}>
                          <div style={{ fontSize:"14px", fontWeight:800 }}>{inq.buyer}</div>
                          <span style={{ background:inq.status==="미답변"?"#FFF0ED":"#EAF6EF", color:inq.status==="미답변"?"#FF3B1E":"#2D8A52", padding:"2px 8px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{inq.status}</span>
                        </div>
                        <div style={{ fontSize:"12px", color:"#AAA", marginBottom:"5px", fontWeight:400 }}>{inq.carName} · {inq.time}</div>
                        <div style={{ fontSize:"13px", color:"#555", fontWeight:400, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{inq.msg}</div>
                      </div>
                    ))}
                  </div>

                  {/* 매물 현황 */}
                  <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
                    <div style={{ padding:"20px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #F0EEE9" }}>
                      <div style={{ fontSize:"16px", fontWeight:800 }}>매물 현황</div>
                      <button onClick={()=>setActiveNav("cars")} style={{ fontSize:"13px", fontWeight:700, color:"#888", background:"transparent", border:"none", display:"flex", alignItems:"center", gap:"4px" }}>전체보기 <ChevronRight size={14}/></button>
                    </div>
                    {[
                      { label:"판매중", count:3, color:"#2D8A52", bg:"#EAF6EF" },
                      { label:"예약중", count:1, color:"#1847FF", bg:"#EEF2FF" },
                      { label:"판매완료", count:1, color:"#888", bg:"#F8F6F2" },
                    ].map(item => (
                      <div key={item.label} style={{ padding:"16px 22px", borderBottom:"1px solid #F0EEE9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                          <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:item.color }} />
                          <span style={{ fontSize:"15px", fontWeight:700 }}>{item.label}</span>
                        </div>
                        <span style={{ background:item.bg, color:item.color, padding:"5px 14px", borderRadius:"100px", fontSize:"14px", fontWeight:800 }}>{item.count}대</span>
                      </div>
                    ))}
                    <div style={{ padding:"16px 22px" }}>
                      <button className="btn-red" style={{ width:"100%", justifyContent:"center" }} onClick={()=>setActiveNav("cars")}>
                        <Plus size={16} /> 새 매물 등록하기
                      </button>
                    </div>
                  </div>
                </div>

                {/* 이달 거래 */}
                <div style={{ background:"white", borderRadius:"18px", padding:"22px 24px" }}>
                  <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"18px" }}>이달 거래 현황</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px" }}>
                    {[
                      { label:"총 거래금액", value:"6,560만원", sub:"4건 완료", color:"#FF3B1E" },
                      { label:"평균 거래가", value:"1,640만원", sub:"이달 평균", color:"#1847FF" },
                      { label:"딜러 수수료", value:"약 196만원", sub:"3% 기준", color:"#2D8A52" },
                    ].map(item => (
                      <div key={item.label} style={{ background:"#F8F6F2", borderRadius:"14px", padding:"18px" }}>
                        <div style={{ fontSize:"12px", color:"#AAA", fontWeight:700, marginBottom:"8px" }}>{item.label}</div>
                        <div style={{ fontSize:"22px", fontWeight:800, color:item.color, marginBottom:"3px" }}>{item.value}</div>
                        <div style={{ fontSize:"12px", color:"#888", fontWeight:400 }}>{item.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 매물 관리 ── */}
            {activeNav==="cars" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                {/* 검색·필터 */}
                <div style={{ background:"white", borderRadius:"16px", padding:"16px 20px", display:"flex", gap:"12px", alignItems:"center" }}>
                  <div style={{ flex:1, position:"relative" }}>
                    <Search size={16} color="#AAA" style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)" }} />
                    <input className="form-input" type="text" placeholder="매물 검색..." style={{ paddingLeft:"38px" }} />
                  </div>
                  <button className="btn-ghost"><Filter size={14}/> 필터</button>
                  <select style={{ border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", fontWeight:700, outline:"none", background:"white" }}>
                    <option>전체 상태</option>
                    <option>판매중</option>
                    <option>예약중</option>
                    <option>판매완료</option>
                  </select>
                </div>

                {/* 매물 테이블 */}
                <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:"#F8F6F2", borderBottom:"1px solid #ECEAE4" }}>
                        {["차량 정보","가격","조회/찜","문의","상태","관리"].map(h => (
                          <th key={h} style={{ padding:"14px 18px", fontSize:"12px", fontWeight:800, color:"#AAA", textAlign:"left", letterSpacing:"0.5px", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MY_CARS.map(car => (
                        <tr key={car.id} className="car-row" style={{ borderBottom:"1px solid #F0EEE9" }}>
                          <td style={{ padding:"14px 18px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                              <div style={{ width:"56px", height:"42px", borderRadius:"8px", overflow:"hidden", flexShrink:0 }}>
                                <img src={`https://source.unsplash.com/112x84/?${car.query}`} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
                              </div>
                              <div>
                                <div style={{ fontSize:"14px", fontWeight:800 }}>{car.name}</div>
                                <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{car.year}년식 · {car.mileage}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"14px 18px" }}>
                            <div style={{ fontSize:"15px", fontWeight:800 }}>{car.price.toLocaleString()}만</div>
                            <div style={{ fontSize:"11px", color:"#1847FF", fontWeight:800, display:"flex", alignItems:"center", gap:"3px" }}><Lock size={9}/>FIX</div>
                          </td>
                          <td style={{ padding:"14px 18px" }}>
                            <div style={{ fontSize:"13px", color:"#555", fontWeight:400 }}>👁 {car.views}</div>
                            <div style={{ fontSize:"13px", color:"#555", fontWeight:400 }}>♥ {car.likes}</div>
                          </td>
                          <td style={{ padding:"14px 18px" }}>
                            {car.inquiry > 0
                              ? <span style={{ background:"#FFF0ED", color:"#FF3B1E", padding:"4px 10px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>{car.inquiry}건</span>
                              : <span style={{ fontSize:"13px", color:"#CCC", fontWeight:400 }}>없음</span>
                            }
                          </td>
                          <td style={{ padding:"14px 18px" }}>
                            <span style={{ background: car.status==="판매중"?"#EAF6EF":car.status==="예약중"?"#EEF2FF":"#F8F6F2", color: car.status==="판매중"?"#2D8A52":car.status==="예약중"?"#1847FF":"#888", padding:"5px 12px", borderRadius:"100px", fontSize:"12px", fontWeight:800, whiteSpace:"nowrap" }}>{car.status}</span>
                          </td>
                          <td style={{ padding:"14px 18px" }}>
                            <div style={{ display:"flex", gap:"6px" }}>
                              <button className="btn-ghost" style={{ padding:"6px 12px", fontSize:"12px" }}><Edit size={13}/> 수정</button>
                              {car.status !== "판매완료" && <button className="btn-ghost" style={{ padding:"6px 12px", fontSize:"12px", color:"#E84A4A", borderColor:"#F7C1C1" }}><Trash2 size={13}/></button>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── 문의 관리 ── */}
            {activeNav==="inquiries" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                <div style={{ display:"flex", gap:"10px", marginBottom:"4px" }}>
                  {[["전체",INQUIRIES.length],["미답변",INQUIRIES.filter(i=>i.status==="미답변").length],["답변완료",INQUIRIES.filter(i=>i.status==="답변완료").length]].map(([l,c])=>(
                    <button key={l} style={{ background:"white", border:"1.5px solid #E0DDD7", borderRadius:"100px", padding:"8px 18px", fontSize:"13px", fontWeight:700, color:"#555" }}>{l} ({c})</button>
                  ))}
                </div>
                {INQUIRIES.map(inq => (
                  <div key={inq.id} className="inquiry-item" style={{ background:"white", borderRadius:"18px", padding:"22px 24px", border:`1.5px solid ${inq.status==="미답변"&&inq.urgent?"#FFB8A8":"#ECEAE4"}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                        <div style={{ width:"42px", height:"42px", background: inq.status==="미답변"?"#FFF0ED":"#F8F6F2", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <Users size={18} color={inq.status==="미답변"?"#FF3B1E":"#888"} />
                        </div>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                            <span style={{ fontSize:"16px", fontWeight:800 }}>{inq.buyer}</span>
                            {inq.urgent && <span style={{ background:"#FFF0ED", color:"#FF3B1E", padding:"2px 8px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>⚡ 긴급</span>}
                            <span style={{ background:inq.status==="미답변"?"#FFF0ED":"#EAF6EF", color:inq.status==="미답변"?"#FF3B1E":"#2D8A52", padding:"2px 8px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{inq.status}</span>
                          </div>
                          <div style={{ fontSize:"13px", color:"#AAA", fontWeight:400 }}>{inq.carName} · {inq.time}</div>
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:"8px" }}>
                        <button className="btn-ghost" style={{ padding:"7px 14px" }}><Phone size={14}/> 전화</button>
                        <button className="btn-ghost" style={{ padding:"7px 14px" }}><Mail size={14}/> 이메일</button>
                      </div>
                    </div>
                    <div style={{ background:"#F8F6F2", borderRadius:"12px", padding:"14px 16px", marginBottom:"14px", fontSize:"14px", color:"#444", lineHeight:1.7, fontWeight:400 }}>
                      &ldquo;{inq.msg}&rdquo;
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", fontSize:"13px", color:"#888", fontWeight:400, marginBottom:"14px" }}>
                      <Phone size={14}/> {inq.phone}
                    </div>
                    {inq.status==="미답변" && (
                      replyModal===inq.id ? (
                        <div>
                          <textarea className="form-input" rows={3} placeholder="답변을 입력해주세요..." value={replyText} onChange={e=>setReplyText(e.target.value)} style={{ marginBottom:"10px", resize:"none" }} />
                          <div style={{ display:"flex", gap:"8px" }}>
                            <button className="btn-red" onClick={()=>{ setReplyModal(null); setReplyText(""); }}>
                              <CheckCircle size={14}/> 답변 전송
                            </button>
                            <button className="btn-ghost" onClick={()=>setReplyModal(null)}>취소</button>
                          </div>
                        </div>
                      ) : (
                        <button className="btn-red" onClick={()=>setReplyModal(inq.id)}>
                          <MessageCircle size={15}/> 답변하기
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── 거래 내역 ── */}
            {activeNav==="transactions" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
                  <div style={{ padding:"20px 24px", borderBottom:"1px solid #F0EEE9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ fontSize:"16px", fontWeight:800 }}>거래 내역</div>
                    <button className="btn-ghost"><Package size={14}/> 정산 요청</button>
                  </div>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:"#F8F6F2", borderBottom:"1px solid #ECEAE4" }}>
                        {["차량","구매자","거래금액","결제 방식","계약일","상태"].map(h=>(
                          <th key={h} style={{ padding:"12px 18px", fontSize:"12px", fontWeight:800, color:"#AAA", textAlign:"left", letterSpacing:"0.5px" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TRANSACTIONS.map(tx => (
                        <tr key={tx.id} className="car-row" style={{ borderBottom:"1px solid #F0EEE9" }}>
                          <td style={{ padding:"14px 18px", fontSize:"14px", fontWeight:800 }}>{tx.carName}</td>
                          <td style={{ padding:"14px 18px", fontSize:"14px", fontWeight:400, color:"#555" }}>{tx.buyer}</td>
                          <td style={{ padding:"14px 18px", fontSize:"15px", fontWeight:800 }}>{tx.amount.toLocaleString()}만원</td>
                          <td style={{ padding:"14px 18px", fontSize:"13px", color:"#888", fontWeight:400 }}>{tx.type}</td>
                          <td style={{ padding:"14px 18px", fontSize:"13px", color:"#888", fontWeight:400 }}>{tx.depositDate}</td>
                          <td style={{ padding:"14px 18px" }}>
                            <span style={{ background: tx.status==="계약완료"?"#EAF6EF":tx.status==="잔금대기"?"#FFF8EC":"#EEF2FF", color: tx.status==="계약완료"?"#2D8A52":tx.status==="잔금대기"?"#E8A020":"#1847FF", padding:"5px 12px", borderRadius:"100px", fontSize:"12px", fontWeight:800, whiteSpace:"nowrap" }}>{tx.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 정산 요약 */}
                <div style={{ background:"linear-gradient(135deg,#1A1A1A,#2A2A2A)", borderRadius:"18px", padding:"24px 28px" }}>
                  <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)", marginBottom:"4px", fontWeight:400 }}>이달 총 정산 예정액</div>
                  <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"48px", color:"#FF3B1E", letterSpacing:"1px", lineHeight:1, marginBottom:"16px" }}>1,960,000<span style={{ fontSize:"18px", fontFamily:"'NanumSquareRound',sans-serif", fontWeight:700, color:"rgba(255,255,255,0.4)", marginLeft:"4px" }}>원</span></div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px" }}>
                    {[["총 거래금액","6,560만원"],["수수료율","3%"],["정산 예정일","2024.02.05"]].map(([k,v])=>(
                      <div key={k} style={{ background:"rgba(255,255,255,0.06)", borderRadius:"12px", padding:"14px" }}>
                        <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", marginBottom:"5px", fontWeight:400 }}>{k}</div>
                        <div style={{ fontSize:"16px", fontWeight:800, color:"white" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 성과 분석 ── */}
            {activeNav==="analytics" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
                <div style={{ background:"white", borderRadius:"18px", padding:"24px 28px" }}>
                  <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"20px" }}>이달 성과 요약</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" }}>
                    {[
                      { label:"매물 조회수", value:"2,847", change:"+18%", up:true },
                      { label:"찜 횟수", value:"59", change:"+12%", up:true },
                      { label:"문의 전환율", value:"8.2%", change:"+2.1%", up:true },
                      { label:"거래 전환율", value:"3.4%", change:"-0.5%", up:false },
                    ].map(item => (
                      <div key={item.label} style={{ background:"#F8F6F2", borderRadius:"14px", padding:"18px" }}>
                        <div style={{ fontSize:"12px", color:"#AAA", fontWeight:700, marginBottom:"8px" }}>{item.label}</div>
                        <div style={{ fontSize:"24px", fontWeight:800, marginBottom:"4px" }}>{item.value}</div>
                        <div style={{ fontSize:"12px", fontWeight:800, color:item.up?"#2D8A52":"#E84A4A", display:"flex", alignItems:"center", gap:"3px" }}>
                          {item.up ? <ArrowUp size={11}/> : <ArrowDown size={11}/>} {item.change}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background:"white", borderRadius:"18px", padding:"24px 28px" }}>
                  <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"20px" }}>매물별 성과</div>
                  {MY_CARS.filter(c=>c.status!=="판매완료").map(car => (
                    <div key={car.id} style={{ padding:"14px 0", borderBottom:"1px solid #F0EEE9" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
                        <div style={{ fontSize:"14px", fontWeight:800 }}>{car.name}</div>
                        <div style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>조회 {car.views}회 · 찜 {car.likes}</div>
                      </div>
                      <div style={{ height:"6px", background:"#F0EEE9", borderRadius:"3px", overflow:"hidden" }}>
                        <div style={{ height:"6px", background:"#FF3B1E", borderRadius:"3px", width:`${Math.min(car.views/5,100)}%`, transition:"width 0.5s" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 딜러 프로필 ── */}
            {activeNav==="profile" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"20px", maxWidth:"640px" }}>
                <div style={{ background:"white", borderRadius:"18px", padding:"28px 32px" }}>
                  <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"22px" }}>딜러 정보</div>
                  <div style={{ display:"flex", gap:"20px", alignItems:"center", marginBottom:"28px", padding:"20px", background:"#F8F6F2", borderRadius:"14px" }}>
                    <div style={{ width:"72px", height:"72px", background:"#EEF2FF", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Users size={32} color="#1847FF" />
                    </div>
                    <div>
                      <div style={{ fontSize:"20px", fontWeight:800, marginBottom:"4px" }}>박준형 딜러</div>
                      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                        <span style={{ background:"#EEF2FF", color:"#1847FF", padding:"4px 12px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>🏅 픽스카 인증 딜러</span>
                        <span style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"13px", color:"#888", fontWeight:400 }}><Star size={13} fill="#FFD700" color="#FFD700"/> 4.9 (142건)</span>
                      </div>
                    </div>
                  </div>
                  {[
                    { label:"상호명", placeholder:"광주모터스", type:"text" },
                    { label:"대표자명", placeholder:"박준형", type:"text" },
                    { label:"연락처", placeholder:"062-000-0000", type:"tel" },
                    { label:"이메일", placeholder:"dealer@gwangju.com", type:"email" },
                    { label:"주소", placeholder:"광주광역시 북구 ...", type:"text" },
                  ].map(field => (
                    <div key={field.label} style={{ marginBottom:"16px" }}>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>{field.label}</label>
                      <input className="form-input" type={field.type} placeholder={field.placeholder} />
                    </div>
                  ))}
                  <button className="btn-red" style={{ justifyContent:"center", marginTop:"8px" }}>
                    <CheckCircle size={16}/> 프로필 저장
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}
