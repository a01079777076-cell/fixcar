"use client";

import { useState } from "react";
import {
  BarChart2, Users, Car, DollarSign, AlertCircle, CheckCircle,
  Clock, TrendingUp, TrendingDown, Settings, Bell, Search,
  Filter, ChevronRight, Eye, Trash2, Edit, Shield,
  ArrowUp, ArrowDown, FileText, Package, Star, Lock,
  XCircle, RefreshCw
} from "lucide-react";

const NAV_ITEMS = [
  { key:"dashboard", label:"대시보드", icon:<BarChart2 size={18}/> },
  { key:"users", label:"회원 관리", icon:<Users size={18}/> },
  { key:"cars", label:"매물 관리", icon:<Car size={18}/> },
  { key:"reports", label:"신고 관리", icon:<AlertCircle size={18}/> },
  { key:"settlements", label:"정산 관리", icon:<DollarSign size={18}/> },
  { key:"settings", label:"사이트 설정", icon:<Settings size={18}/> },
];

const PLATFORM_STATS = [
  { label:"총 회원수", value:"4,218", unit:"명", change:"+124", up:true, icon:<Users size={20} color="white"/>, color:"#FF3B1E" },
  { label:"총 매물수", value:"2,418", unit:"대", change:"+38", up:true, icon:<Car size={20} color="white"/>, color:"#1847FF" },
  { label:"이달 거래", value:"147", unit:"건", change:"+22", up:true, icon:<Package size={20} color="white"/>, color:"#2D8A52" },
  { label:"이달 거래액", value:"24.8억", unit:"원", change:"+15%", up:true, icon:<DollarSign size={20} color="white"/>, color:"#E8A020" },
  { label:"신고 접수", value:"3", unit:"건", change:"미처리", up:false, icon:<AlertCircle size={20} color="white"/>, color:"#E84A4A" },
  { label:"딜러수", value:"87", unit:"명", change:"+3", up:true, icon:<Shield size={20} color="white"/>, color:"#555" },
];

const RECENT_USERS = [
  { id:1, name:"김지원", email:"jiwon@email.com", type:"일반", joined:"2024.01.16", status:"정상", purchases:1 },
  { id:2, name:"박민서", email:"minser@email.com", type:"일반", joined:"2024.01.15", status:"정상", purchases:0 },
  { id:3, name:"박준형", email:"dealer@gwangju.com", type:"딜러", joined:"2023.06.10", status:"인증", purchases:142 },
  { id:4, name:"이수연", email:"suyeon@email.com", type:"일반", joined:"2024.01.14", status:"정상", purchases:1 },
  { id:5, name:"최민준", email:"minjun@email.com", type:"일반", joined:"2024.01.13", status:"경고", purchases:0 },
];

const CAR_LISTINGS = [
  { id:1, name:"현대 아반떼 CN7", dealer:"박준형", price:1450, status:"판매중", views:284, reported:false, registered:"2024.01.10" },
  { id:2, name:"기아 K3", dealer:"김민수", price:1090, status:"판매중", views:196, reported:false, registered:"2024.01.09" },
  { id:3, name:"현대 투싼 NX4", dealer:"박준형", price:2780, status:"예약중", views:421, reported:false, registered:"2024.01.08" },
  { id:4, name:"의심 매물 BMW", dealer:"익명딜러", price:500, status:"검토중", views:12, reported:true, registered:"2024.01.15" },
  { id:5, name:"현대 아이오닉 5", dealer:"이현수", price:3890, status:"판매중", views:167, reported:false, registered:"2024.01.07" },
];

const REPORTS = [
  { id:1, target:"BMW 500만원 매물", reporter:"김지원", reason:"허위매물 의심 — 시세 대비 너무 저렴함", date:"2024.01.15", status:"미처리", urgent:true },
  { id:2, target:"익명딜러 계정", reporter:"박민서", reason:"연락 두절 및 계약금 미환불", date:"2024.01.14", status:"처리중", urgent:true },
  { id:3, target:"기아 K9 매물", reporter:"이수연", reason:"사진과 실제 차량 상태 다름", date:"2024.01.12", status:"처리완료", urgent:false },
];

const SETTLEMENTS = [
  { id:1, dealer:"박준형", deals:4, amount:6560, fee:196, status:"정산대기", period:"2024.01" },
  { id:2, dealer:"김민수", deals:2, amount:2870, fee:86, status:"정산완료", period:"2024.01" },
  { id:3, dealer:"이현수", deals:3, amount:8340, fee:250, status:"정산대기", period:"2024.01" },
  { id:4, dealer:"박준형", deals:5, amount:9120, fee:273, status:"정산완료", period:"2023.12" },
];

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchVal, setSearchVal] = useState("");

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input, select { font-family:'NanumSquareRound',sans-serif; }
        .nav-item { transition:all 0.15s; cursor:pointer; border:none; background:transparent; width:100%; text-align:left; }
        .nav-item:hover { background:#F0EEE9 !important; }
        .stat-card { transition:all 0.2s; }
        .stat-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.07); }
        .table-row { transition:background 0.15s; }
        .table-row:hover { background:#FAFAF8; }
        .btn-red { background:#FF3B1E; color:white; border:none; border-radius:10px; font-size:13px; font-weight:800; padding:9px 18px; display:inline-flex; align-items:center; gap:7px; transition:all 0.2s; cursor:pointer; }
        .btn-red:hover { background:#D42E14; }
        .btn-ghost { background:transparent; border:1.5px solid #E0DDD7; border-radius:9px; font-size:12px; font-weight:700; padding:7px 13px; display:inline-flex; align-items:center; gap:6px; transition:all 0.15s; color:#555; cursor:pointer; }
        .btn-ghost:hover { border-color:#1A1A1A; color:#1A1A1A; }
        .form-input { border:1.5px solid #E0DDD7; border-radius:9px; padding:10px 14px; font-size:13px; outline:none; background:#FAFAF8; }
        .form-input:focus { border-color:#FF3B1E; background:white; }
        @media(max-width:1024px) {
          .admin-layout { grid-template-columns:1fr !important; }
          .sidebar { display:none !important; }
          .stats-6 { grid-template-columns:1fr 1fr 1fr !important; }
        }
        @media(max-width:600px) {
          .main-wrap { padding:16px !important; }
          .stats-6 { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh", background:"#F0EEE9" }}>

        {/* 사이드바 */}
        <aside className="sidebar" style={{ width:"240px", flexShrink:0, background:"#1A1A1A", display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, bottom:0, zIndex:50 }}>
          <div style={{ padding:"24px 20px 18px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
            <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"24px", letterSpacing:"3px", display:"block", marginBottom:"4px" }}>
              <span style={{ color:"#FF3B1E" }}>FIX</span><span style={{ color:"white" }}>CAR</span>
            </a>
            <div style={{ fontSize:"11px", fontWeight:800, letterSpacing:"2px", color:"rgba(255,255,255,0.3)" }}>ADMIN PANEL</div>
          </div>
          <nav style={{ flex:1, padding:"14px 10px" }}>
            {NAV_ITEMS.map(item => (
              <button key={item.key} className="nav-item" onClick={()=>setActiveNav(item.key)} style={{ padding:"11px 14px", borderRadius:"10px", marginBottom:"3px", display:"flex", alignItems:"center", gap:"12px", background:activeNav===item.key?"rgba(255,59,30,0.15)":"transparent", color:activeNav===item.key?"#FF7A63":"rgba(255,255,255,0.5)", fontWeight:activeNav===item.key?800:600, fontSize:"14px" }}>
                <span style={{ color:activeNav===item.key?"#FF7A63":"rgba(255,255,255,0.3)" }}>{item.icon}</span>
                {item.label}
                {item.key==="reports" && REPORTS.filter(r=>r.status==="미처리").length > 0 && (
                  <span style={{ marginLeft:"auto", background:"#E84A4A", color:"white", borderRadius:"100px", padding:"1px 7px", fontSize:"11px", fontWeight:800 }}>{REPORTS.filter(r=>r.status==="미처리").length}</span>
                )}
              </button>
            ))}
          </nav>
          <div style={{ padding:"14px 10px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ padding:"12px 14px", display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{ width:"34px", height:"34px", background:"rgba(255,59,30,0.2)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Shield size={16} color="#FF7A63" />
              </div>
              <div>
                <div style={{ fontSize:"13px", fontWeight:800, color:"white" }}>관리자</div>
                <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", fontWeight:400 }}>admin@fixcar.kr</div>
              </div>
            </div>
          </div>
        </aside>

        {/* 메인 */}
        <main style={{ marginLeft:"240px", flex:1 }}>
          {/* 헤더 */}
          <div style={{ background:"white", borderBottom:"1px solid #ECEAE4", padding:"0 32px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:40 }}>
            <div style={{ fontSize:"18px", fontWeight:800 }}>
              {NAV_ITEMS.find(n=>n.key===activeNav)?.label}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <button style={{ position:"relative", background:"#F8F6F2", border:"none", width:"38px", height:"38px", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Bell size={17} color="#555" />
                <span style={{ position:"absolute", top:"7px", right:"7px", width:"7px", height:"7px", background:"#E84A4A", borderRadius:"50%" }} />
              </button>
              <a href="/"><button className="btn-ghost"><Eye size={13}/> 사이트 보기</button></a>
            </div>
          </div>

          <div className="main-wrap" style={{ padding:"28px 32px 80px" }}>

            {/* ── 대시보드 ── */}
            {activeNav==="dashboard" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"22px" }}>

                {/* 통계 6개 */}
                <div className="stats-6" style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:"12px" }}>
                  {PLATFORM_STATS.map(s => (
                    <div key={s.label} className="stat-card" style={{ background:"white", borderRadius:"16px", padding:"18px 16px" }}>
                      <div style={{ width:"40px", height:"40px", background:s.color, borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"12px" }}>{s.icon}</div>
                      <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", color:"#1A1A1A", letterSpacing:"0.5px", lineHeight:1, marginBottom:"3px" }}>{s.value}<span style={{ fontSize:"13px", fontFamily:"'NanumSquareRound',sans-serif", fontWeight:700, color:"#AAA", marginLeft:"2px" }}>{s.unit}</span></div>
                      <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400, marginBottom:"5px" }}>{s.label}</div>
                      <div style={{ fontSize:"11px", fontWeight:800, color:s.up?"#2D8A52":"#E84A4A", display:"flex", alignItems:"center", gap:"3px" }}>
                        {s.up?<ArrowUp size={10}/>:<ArrowDown size={10}/>} {s.change}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 최근 신고 + 정산 요약 */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px" }}>
                  <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
                    <div style={{ padding:"18px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #F0EEE9" }}>
                      <div style={{ fontSize:"16px", fontWeight:800, display:"flex", alignItems:"center", gap:"8px" }}>
                        <AlertCircle size={16} color="#E84A4A" /> 미처리 신고
                      </div>
                      <button onClick={()=>setActiveNav("reports")} style={{ fontSize:"13px", fontWeight:700, color:"#888", background:"transparent", border:"none", display:"flex", alignItems:"center", gap:"4px" }}>전체보기 <ChevronRight size={14}/></button>
                    </div>
                    {REPORTS.filter(r=>r.status!=="처리완료").map(r => (
                      <div key={r.id} className="table-row" style={{ padding:"14px 22px", borderBottom:"1px solid #F0EEE9" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                          <span style={{ fontSize:"14px", fontWeight:800 }}>{r.target}</span>
                          <span style={{ background:r.status==="미처리"?"#FFF0ED":"#EEF2FF", color:r.status==="미처리"?"#FF3B1E":"#1847FF", padding:"2px 8px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{r.status}</span>
                        </div>
                        <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{r.reason.slice(0,40)}...</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
                    <div style={{ padding:"18px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #F0EEE9" }}>
                      <div style={{ fontSize:"16px", fontWeight:800 }}>정산 대기</div>
                      <button onClick={()=>setActiveNav("settlements")} style={{ fontSize:"13px", fontWeight:700, color:"#888", background:"transparent", border:"none", display:"flex", alignItems:"center", gap:"4px" }}>전체보기 <ChevronRight size={14}/></button>
                    </div>
                    {SETTLEMENTS.filter(s=>s.status==="정산대기").map(s => (
                      <div key={s.id} className="table-row" style={{ padding:"14px 22px", borderBottom:"1px solid #F0EEE9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                          <div style={{ fontSize:"14px", fontWeight:800 }}>{s.dealer} 딜러</div>
                          <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{s.deals}건 · {s.period}</div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:"15px", fontWeight:800 }}>{s.fee.toLocaleString()}만원</div>
                          <div style={{ fontSize:"11px", color:"#E8A020", fontWeight:700 }}>정산대기</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 최근 거래 트렌드 */}
                <div style={{ background:"white", borderRadius:"18px", padding:"22px 24px" }}>
                  <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"18px" }}>월별 거래 현황</div>
                  <div style={{ display:"flex", gap:"8px", alignItems:"flex-end", height:"120px" }}>
                    {[62,78,91,85,103,119,134,147].map((v,i) => (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
                        <div style={{ fontSize:"11px", fontWeight:800, color: i===7?"#FF3B1E":"#AAA" }}>{v}</div>
                        <div style={{ width:"100%", background: i===7?"#FF3B1E":"#E0DDD7", borderRadius:"4px 4px 0 0", height:`${(v/147)*90}px`, transition:"height 0.5s" }} />
                        <div style={{ fontSize:"10px", color:"#AAA", fontWeight:400 }}>{["6월","7월","8월","9월","10월","11월","12월","1월"][i]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 회원 관리 ── */}
            {activeNav==="users" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                <div style={{ background:"white", borderRadius:"16px", padding:"16px 20px", display:"flex", gap:"12px", alignItems:"center" }}>
                  <div style={{ flex:1, position:"relative" }}>
                    <Search size={16} color="#AAA" style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)" }} />
                    <input className="form-input" type="text" placeholder="이름, 이메일 검색..." value={searchVal} onChange={e=>setSearchVal(e.target.value)} style={{ width:"100%", paddingLeft:"36px" }} />
                  </div>
                  <select className="form-input" style={{ minWidth:"120px" }}>
                    <option>전체 회원</option>
                    <option>일반 회원</option>
                    <option>딜러</option>
                    <option>관리자</option>
                  </select>
                  <select className="form-input" style={{ minWidth:"120px" }}>
                    <option>전체 상태</option>
                    <option>정상</option>
                    <option>경고</option>
                    <option>정지</option>
                  </select>
                </div>

                <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:"#F8F6F2", borderBottom:"1px solid #ECEAE4" }}>
                        {["이름","이메일","회원 유형","가입일","상태","거래수","관리"].map(h=>(
                          <th key={h} style={{ padding:"13px 18px", fontSize:"12px", fontWeight:800, color:"#AAA", textAlign:"left", letterSpacing:"0.5px", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {RECENT_USERS.filter(u=>searchVal===""||u.name.includes(searchVal)||u.email.includes(searchVal)).map(user => (
                        <tr key={user.id} className="table-row" style={{ borderBottom:"1px solid #F0EEE9" }}>
                          <td style={{ padding:"13px 18px", fontSize:"14px", fontWeight:800 }}>{user.name}</td>
                          <td style={{ padding:"13px 18px", fontSize:"13px", color:"#888", fontWeight:400 }}>{user.email}</td>
                          <td style={{ padding:"13px 18px" }}>
                            <span style={{ background:user.type==="딜러"?"#EEF2FF":"#F8F6F2", color:user.type==="딜러"?"#1847FF":"#555", padding:"4px 10px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>{user.type}</span>
                          </td>
                          <td style={{ padding:"13px 18px", fontSize:"13px", color:"#888", fontWeight:400 }}>{user.joined}</td>
                          <td style={{ padding:"13px 18px" }}>
                            <span style={{ background:user.status==="정상"||user.status==="인증"?"#EAF6EF":user.status==="경고"?"#FFF8EC":"#FFF0ED", color:user.status==="정상"||user.status==="인증"?"#2D8A52":user.status==="경고"?"#E8A020":"#E84A4A", padding:"4px 10px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>{user.status}</span>
                          </td>
                          <td style={{ padding:"13px 18px", fontSize:"14px", fontWeight:800 }}>{user.purchases}건</td>
                          <td style={{ padding:"13px 18px" }}>
                            <div style={{ display:"flex", gap:"6px" }}>
                              <button className="btn-ghost" style={{ padding:"5px 10px" }}><Eye size={12}/></button>
                              <button className="btn-ghost" style={{ padding:"5px 10px", color:"#E8A020", borderColor:"#FFD89A" }}><AlertCircle size={12}/></button>
                              <button className="btn-ghost" style={{ padding:"5px 10px", color:"#E84A4A", borderColor:"#F7C1C1" }}><XCircle size={12}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── 매물 관리 ── */}
            {activeNav==="cars" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                <div style={{ background:"white", borderRadius:"16px", padding:"16px 20px", display:"flex", gap:"12px", alignItems:"center" }}>
                  <div style={{ flex:1, position:"relative" }}>
                    <Search size={16} color="#AAA" style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)" }} />
                    <input className="form-input" type="text" placeholder="차량명, 딜러 검색..." style={{ width:"100%", paddingLeft:"36px" }} />
                  </div>
                  <select className="form-input">
                    <option>전체 상태</option>
                    <option>판매중</option>
                    <option>예약중</option>
                    <option>검토중</option>
                    <option>판매완료</option>
                  </select>
                  <button className="btn-red"><Filter size={13}/> 필터</button>
                </div>

                <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:"#F8F6F2", borderBottom:"1px solid #ECEAE4" }}>
                        {["차량명","딜러","가격","조회수","상태","신고","등록일","관리"].map(h=>(
                          <th key={h} style={{ padding:"13px 18px", fontSize:"12px", fontWeight:800, color:"#AAA", textAlign:"left", letterSpacing:"0.5px", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {CAR_LISTINGS.map(car => (
                        <tr key={car.id} className="table-row" style={{ borderBottom:"1px solid #F0EEE9", background:car.reported?"#FFF8F8":"white" }}>
                          <td style={{ padding:"13px 18px", fontSize:"14px", fontWeight:800 }}>
                            {car.reported && <AlertCircle size={14} color="#E84A4A" style={{ display:"inline", verticalAlign:"middle", marginRight:"5px" }} />}
                            {car.name}
                          </td>
                          <td style={{ padding:"13px 18px", fontSize:"13px", color:"#888", fontWeight:400 }}>{car.dealer}</td>
                          <td style={{ padding:"13px 18px", fontSize:"14px", fontWeight:800 }}>{car.price.toLocaleString()}만</td>
                          <td style={{ padding:"13px 18px", fontSize:"13px", color:"#888", fontWeight:400 }}>{car.views}회</td>
                          <td style={{ padding:"13px 18px" }}>
                            <span style={{ background:car.status==="판매중"?"#EAF6EF":car.status==="예약중"?"#EEF2FF":car.status==="검토중"?"#FFF8EC":"#F8F6F2", color:car.status==="판매중"?"#2D8A52":car.status==="예약중"?"#1847FF":car.status==="검토중"?"#E8A020":"#888", padding:"4px 10px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>{car.status}</span>
                          </td>
                          <td style={{ padding:"13px 18px" }}>
                            {car.reported
                              ? <span style={{ background:"#FFF0ED", color:"#E84A4A", padding:"4px 10px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>신고있음</span>
                              : <span style={{ fontSize:"13px", color:"#CCC", fontWeight:400 }}>없음</span>}
                          </td>
                          <td style={{ padding:"13px 18px", fontSize:"13px", color:"#888", fontWeight:400 }}>{car.registered}</td>
                          <td style={{ padding:"13px 18px" }}>
                            <div style={{ display:"flex", gap:"6px" }}>
                              <button className="btn-ghost" style={{ padding:"5px 10px" }}><Eye size={12}/></button>
                              {car.reported && <button className="btn-ghost" style={{ padding:"5px 10px", color:"#E8A020", borderColor:"#FFD89A" }}><RefreshCw size={12}/></button>}
                              <button className="btn-ghost" style={{ padding:"5px 10px", color:"#E84A4A", borderColor:"#F7C1C1" }}><Trash2 size={12}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── 신고 관리 ── */}
            {activeNav==="reports" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                  {[["전체",REPORTS.length],["미처리",REPORTS.filter(r=>r.status==="미처리").length],["처리중",REPORTS.filter(r=>r.status==="처리중").length],["처리완료",REPORTS.filter(r=>r.status==="처리완료").length]].map(([l,c])=>(
                    <button key={l} style={{ background:"white", border:"1.5px solid #E0DDD7", borderRadius:"100px", padding:"8px 18px", fontSize:"13px", fontWeight:700, color:"#555" }}>{l} ({c})</button>
                  ))}
                </div>
                {REPORTS.map(report => (
                  <div key={report.id} style={{ background:"white", borderRadius:"18px", padding:"22px 24px", border:`1.5px solid ${report.status==="미처리"?"#F7C1C1":report.status==="처리중"?"#FFD89A":"#ECEAE4"}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
                          <AlertCircle size={16} color={report.status==="미처리"?"#E84A4A":report.status==="처리중"?"#E8A020":"#2D8A52"} />
                          <span style={{ fontSize:"16px", fontWeight:800 }}>{report.target}</span>
                          {report.urgent && <span style={{ background:"#FFF0ED", color:"#FF3B1E", padding:"2px 8px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>⚡ 긴급</span>}
                        </div>
                        <div style={{ fontSize:"13px", color:"#AAA", fontWeight:400 }}>신고자: {report.reporter} · {report.date}</div>
                      </div>
                      <span style={{ background:report.status==="미처리"?"#FFF0ED":report.status==="처리중"?"#FFF8EC":"#EAF6EF", color:report.status==="미처리"?"#E84A4A":report.status==="처리중"?"#E8A020":"#2D8A52", padding:"5px 14px", borderRadius:"100px", fontSize:"12px", fontWeight:800, flexShrink:0 }}>{report.status}</span>
                    </div>
                    <div style={{ background:"#F8F6F2", borderRadius:"12px", padding:"14px 16px", marginBottom:"16px", fontSize:"14px", color:"#444", lineHeight:1.7, fontWeight:400 }}>
                      {report.reason}
                    </div>
                    <div style={{ display:"flex", gap:"8px" }}>
                      {report.status==="미처리" && <button className="btn-red" style={{ fontSize:"13px" }}><CheckCircle size={13}/> 처리 시작</button>}
                      {report.status==="처리중" && <button className="btn-red" style={{ fontSize:"13px", background:"#2D8A52" }}><CheckCircle size={13}/> 처리 완료</button>}
                      <button className="btn-ghost"><Eye size={13}/> 대상 확인</button>
                      <button className="btn-ghost" style={{ color:"#E84A4A", borderColor:"#F7C1C1" }}><Trash2 size={13}/> 매물 삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── 정산 관리 ── */}
            {activeNav==="settlements" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                {/* 정산 요약 */}
                <div style={{ background:"linear-gradient(135deg,#1A1A1A,#2A2A2A)", borderRadius:"18px", padding:"24px 28px" }}>
                  <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", marginBottom:"6px", fontWeight:400 }}>이달 총 정산 예정액</div>
                  <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"48px", color:"#FF3B1E", letterSpacing:"1px", lineHeight:1, marginBottom:"16px" }}>4,460,000<span style={{ fontSize:"18px", fontFamily:"'NanumSquareRound',sans-serif", fontWeight:700, color:"rgba(255,255,255,0.35)", marginLeft:"4px" }}>원</span></div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px" }}>
                    {[["대기 딜러","2명"],["총 거래","7건"],["총 거래액","1.4억원"],["수수료율","3%"]].map(([k,v])=>(
                      <div key={k} style={{ background:"rgba(255,255,255,0.06)", borderRadius:"12px", padding:"14px" }}>
                        <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.35)", marginBottom:"5px", fontWeight:400 }}>{k}</div>
                        <div style={{ fontSize:"16px", fontWeight:800, color:"white" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
                  <div style={{ padding:"18px 22px", borderBottom:"1px solid #F0EEE9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ fontSize:"16px", fontWeight:800 }}>딜러별 정산 내역</div>
                    <button className="btn-red" style={{ fontSize:"12px" }}><DollarSign size={13}/> 전체 정산 처리</button>
                  </div>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:"#F8F6F2", borderBottom:"1px solid #ECEAE4" }}>
                        {["딜러","거래 건수","거래 총액","수수료 (3%)","정산 기간","상태","처리"].map(h=>(
                          <th key={h} style={{ padding:"12px 18px", fontSize:"12px", fontWeight:800, color:"#AAA", textAlign:"left", letterSpacing:"0.5px", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SETTLEMENTS.map(s => (
                        <tr key={s.id} className="table-row" style={{ borderBottom:"1px solid #F0EEE9" }}>
                          <td style={{ padding:"13px 18px", fontSize:"14px", fontWeight:800 }}>{s.dealer}</td>
                          <td style={{ padding:"13px 18px", fontSize:"14px", fontWeight:600 }}>{s.deals}건</td>
                          <td style={{ padding:"13px 18px", fontSize:"14px", fontWeight:800 }}>{s.amount.toLocaleString()}만원</td>
                          <td style={{ padding:"13px 18px", fontSize:"15px", fontWeight:800, color:"#FF3B1E" }}>{s.fee.toLocaleString()}만원</td>
                          <td style={{ padding:"13px 18px", fontSize:"13px", color:"#888", fontWeight:400 }}>{s.period}</td>
                          <td style={{ padding:"13px 18px" }}>
                            <span style={{ background:s.status==="정산대기"?"#FFF8EC":"#EAF6EF", color:s.status==="정산대기"?"#E8A020":"#2D8A52", padding:"4px 10px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>{s.status}</span>
                          </td>
                          <td style={{ padding:"13px 18px" }}>
                            {s.status==="정산대기"
                              ? <button className="btn-red" style={{ fontSize:"12px", padding:"7px 14px" }}><CheckCircle size={12}/> 정산처리</button>
                              : <span style={{ fontSize:"13px", color:"#CCC", fontWeight:400 }}>완료</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── 사이트 설정 ── */}
            {activeNav==="settings" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"18px", maxWidth:"640px" }}>

                <div style={{ background:"white", borderRadius:"18px", padding:"24px 28px" }}>
                  <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"18px" }}>기본 설정</div>
                  {[
                    { label:"사이트 이름", val:"픽스카 FIXCAR", type:"text" },
                    { label:"고객센터 번호", val:"062-000-0000", type:"tel" },
                    { label:"고객센터 이메일", val:"support@fixcar.kr", type:"email" },
                    { label:"수수료율 (%)", val:"3", type:"number" },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom:"16px" }}>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>{item.label}</label>
                      <input type={item.type} defaultValue={item.val} className="form-input" style={{ width:"100%" }} />
                    </div>
                  ))}
                  <button className="btn-red" style={{ justifyContent:"center", marginTop:"8px" }}>
                    <CheckCircle size={15}/> 설정 저장
                  </button>
                </div>

                <div style={{ background:"white", borderRadius:"18px", padding:"24px 28px" }}>
                  <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"18px" }}>플랫폼 기능 토글</div>
                  {[
                    { label:"신규 회원 가입", sub:"비활성화 시 가입 불가", on:true },
                    { label:"딜러 신규 등록", sub:"딜러 신청 허용 여부", on:true },
                    { label:"결제 기능", sub:"전체 결제 기능 활성화", on:true },
                    { label:"퀴즈 추천 기능", sub:"AI 추천 시스템", on:true },
                    { label:"점검 모드", sub:"활성화 시 사용자에게 점검 안내", on:false },
                  ].map(item => (
                    <div key={item.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid #F0EEE9" }}>
                      <div>
                        <div style={{ fontSize:"14px", fontWeight:700 }}>{item.label}</div>
                        <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{item.sub}</div>
                      </div>
                      <label style={{ position:"relative", width:"44px", height:"24px", flexShrink:0, cursor:"pointer" }}>
                        <input type="checkbox" defaultChecked={item.on} style={{ opacity:0, width:0, height:0 }} />
                        <span style={{ position:"absolute", inset:0, background:item.on?"#FF3B1E":"#E0DDD7", borderRadius:"12px" }} />
                        <span style={{ position:"absolute", left:"2px", top:"2px", width:"20px", height:"20px", background:"white", borderRadius:"50%", transition:"0.3s", transform:item.on?"translateX(20px)":"translateX(0)" }} />
                      </label>
                    </div>
                  ))}
                </div>

                {/* 위험 구역 */}
                <div style={{ background:"white", borderRadius:"18px", padding:"24px 28px", border:"1.5px solid #F7C1C1" }}>
                  <div style={{ fontSize:"16px", fontWeight:800, color:"#E84A4A", marginBottom:"6px", display:"flex", alignItems:"center", gap:"8px" }}>
                    <AlertCircle size={18} color="#E84A4A" /> 위험 구역
                  </div>
                  <div style={{ fontSize:"13px", color:"#888", marginBottom:"18px", fontWeight:400 }}>아래 작업은 되돌릴 수 없어요. 신중히 사용해주세요.</div>
                  {[
                    { label:"전체 캐시 초기화", desc:"서버 캐시를 초기화해요" },
                    { label:"DB 백업 실행", desc:"현재 데이터를 백업해요" },
                    { label:"테스트 데이터 삭제", desc:"개발용 데이터를 삭제해요" },
                  ].map(item => (
                    <div key={item.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid #F0EEE9" }}>
                      <div>
                        <div style={{ fontSize:"14px", fontWeight:700 }}>{item.label}</div>
                        <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{item.desc}</div>
                      </div>
                      <button className="btn-ghost" style={{ color:"#E84A4A", borderColor:"#F7C1C1", fontSize:"12px" }}>{item.label}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
