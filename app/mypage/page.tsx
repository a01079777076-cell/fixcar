"use client";

import { useState } from "react";
import {
  Heart, MessageCircle, Car, Calendar, Bell, ChevronRight,
  CheckCircle, Clock, Lock, Star, Settings, LogOut,
  Wrench, AlertCircle, ArrowRight, Package, User, Shield
} from "lucide-react";

const NAV_ITEMS = [
  { key:"home", label:"홈", icon:<User size={18}/> },
  { key:"favorites", label:"찜 목록", icon:<Heart size={18}/> },
  { key:"inquiries", label:"문의 내역", icon:<MessageCircle size={18}/> },
  { key:"purchases", label:"구매 이력", icon:<Package size={18}/> },
  { key:"mycar", label:"내 차 관리", icon:<Car size={18}/> },
  { key:"settings", label:"설정", icon:<Settings size={18}/> },
];

const FAVORITES = [
  { id:1, name:"현대 아반떼 CN7", year:"2021년식", mileage:"32,000km", price:1450, status:"판매중", priceChanged:false, query:"hyundai+elantra+white" },
  { id:3, name:"현대 투싼 NX4", year:"2022년식", mileage:"28,000km", price:2780, status:"예약중", priceChanged:false, query:"hyundai+tucson+suv" },
  { id:5, name:"현대 아이오닉 5", year:"2022년식", mileage:"22,000km", price:3890, status:"판매중", priceChanged:true, query:"hyundai+ioniq5+electric" },
];

const INQUIRIES = [
  { id:1, carName:"현대 아반떼 CN7", msg:"직접 시승 가능한가요?", status:"답변완료", reply:"네, 평일 오전 10시~오후 6시 방문 가능해요!", date:"2024.01.15" },
  { id:2, carName:"현대 투싼 NX4", msg:"할부 조건이 어떻게 되나요?", status:"답변완료", reply:"60개월 할부 기준 월 55만원부터 가능해요.", date:"2024.01.12" },
  { id:3, carName:"현대 아이오닉 5", msg:"한번 충전으로 실제 주행거리가 어떻게 되나요?", status:"미답변", reply:"", date:"2024.01.16" },
];

const PURCHASES = [
  { id:1, carName:"기아 K5 DL3", year:"2020", price:1780, depositDate:"2023.08.15", status:"구매완료", dealer:"전남자동차 김민수" },
];

const SCHEDULE = [
  { date:"2024-02-05", title:"엔진오일 교환", type:"정비", urgent:false, desc:"마지막 교환 후 5,000km 주행" },
  { date:"2024-03-15", title:"자동차 보험 갱신", type:"보험", urgent:false, desc:"현대해상 만기일" },
  { date:"2024-04-01", title:"자동차세 납부", type:"세금", urgent:false, desc:"상반기 자동차세 (6월 납부)" },
  { date:"2024-02-20", title:"타이어 점검", type:"정비", urgent:true, desc:"마모도 확인 필요" },
];

export default function MyPage() {
  const [activeNav, setActiveNav] = useState("home");
  const [likedCars, setLikedCars] = useState<number[]>([1,3,5]);

  const removeFavorite = (id: number) => {
    setLikedCars(prev => prev.filter(i => i !== id));
  };

  const typeColor = (type: string) => {
    if (type==="정비") return { bg:"#EEF2FF", color:"#1847FF" };
    if (type==="보험") return { bg:"#EAF6EF", color:"#2D8A52" };
    if (type==="세금") return { bg:"#FFF8EC", color:"#E8A020" };
    return { bg:"#F8F6F2", color:"#555" };
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input, textarea { font-family:'NanumSquareRound',sans-serif; }

        .nav-item { transition:all 0.15s; cursor:pointer; border:none; background:transparent; width:100%; text-align:left; }
        .nav-item:hover { background:#F0EEE9 !important; }
        .card-hover { transition:all 0.22s; }
        .card-hover:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.08); }
        .btn-red { background:#FF3B1E; color:white; border:none; border-radius:12px; font-size:14px; font-weight:800; padding:12px 20px; display:flex; align-items:center; gap:8px; transition:all 0.2s; cursor:pointer; }
        .btn-red:hover { background:#D42E14; transform:translateY(-1px); }
        .btn-ghost { background:transparent; border:1.5px solid #E0DDD7; border-radius:10px; font-size:13px; font-weight:700; padding:8px 14px; display:flex; align-items:center; gap:6px; transition:all 0.15s; color:#555; cursor:pointer; }
        .btn-ghost:hover { border-color:#1A1A1A; color:#1A1A1A; }
        .fav-card { transition:all 0.2s; }
        .fav-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.1); }
        .schedule-item { transition:background 0.15s; cursor:default; }
        .schedule-item:hover { background:#FAFAF8; }

        @media(max-width:1024px) {
          .layout { grid-template-columns:1fr !important; }
          .sidebar { display:none !important; }
          .stats-row { grid-template-columns:1fr 1fr !important; }
        }
        @media(max-width:600px) {
          .main-wrap { padding:16px !important; }
          .stats-row { grid-template-columns:1fr !important; }
          .fav-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh", background:"#F0EEE9" }}>

        {/* ── 사이드바 ── */}
        <aside className="sidebar" style={{ width:"240px", flexShrink:0, background:"white", borderRight:"1px solid #ECEAE4", display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, bottom:0, zIndex:50 }}>
          {/* 로고 */}
          <div style={{ padding:"22px 20px 18px", borderBottom:"1px solid #ECEAE4" }}>
            <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"24px", letterSpacing:"3px", display:"block", marginBottom:"14px" }}>
              <span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span>
            </a>
            {/* 유저 프로필 */}
            <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 14px", background:"#F8F6F2", borderRadius:"12px" }}>
              <div style={{ width:"38px", height:"38px", background:"#FFF0ED", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <User size={18} color="#FF3B1E" />
              </div>
              <div>
                <div style={{ fontSize:"14px", fontWeight:800 }}>김지원님</div>
                <div style={{ fontSize:"11px", color:"#AAA", fontWeight:400 }}>일반 회원</div>
              </div>
            </div>
          </div>

          {/* 네비 */}
          <nav style={{ flex:1, padding:"14px 10px" }}>
            {NAV_ITEMS.map(item => (
              <button key={item.key} className="nav-item" onClick={()=>setActiveNav(item.key)} style={{ padding:"11px 14px", borderRadius:"10px", marginBottom:"3px", display:"flex", alignItems:"center", gap:"12px", background:activeNav===item.key?"#FFF0ED":"transparent", color:activeNav===item.key?"#FF3B1E":"#555", fontWeight:activeNav===item.key?800:600, fontSize:"14px" }}>
                <span style={{ color:activeNav===item.key?"#FF3B1E":"#AAA" }}>{item.icon}</span>
                {item.label}
                {item.key==="favorites" && likedCars.length > 0 && (
                  <span style={{ marginLeft:"auto", background:"#FF3B1E", color:"white", borderRadius:"100px", padding:"1px 7px", fontSize:"11px", fontWeight:800 }}>{likedCars.length}</span>
                )}
                {item.key==="inquiries" && (
                  <span style={{ marginLeft:"auto", background:"#E8A020", color:"white", borderRadius:"100px", padding:"1px 7px", fontSize:"11px", fontWeight:800 }}>1</span>
                )}
              </button>
            ))}
          </nav>

          {/* 로그아웃 */}
          <div style={{ padding:"14px 10px", borderTop:"1px solid #ECEAE4" }}>
            <button className="nav-item" style={{ padding:"11px 14px", borderRadius:"10px", display:"flex", alignItems:"center", gap:"12px", color:"#888", fontSize:"14px", fontWeight:600 }}>
              <LogOut size={16} color="#AAA" /> 로그아웃
            </button>
          </div>
        </aside>

        {/* ── 메인 ── */}
        <main style={{ marginLeft:"240px", flex:1 }}>
          {/* 헤더 */}
          <div style={{ background:"white", borderBottom:"1px solid #ECEAE4", padding:"0 32px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:40 }}>
            <div style={{ fontSize:"18px", fontWeight:800 }}>
              {NAV_ITEMS.find(n=>n.key===activeNav)?.label}
            </div>
            <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
              <button style={{ background:"#F8F6F2", border:"none", width:"38px", height:"38px", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                <Bell size={17} color="#555" />
                <span style={{ position:"absolute", top:"7px", right:"7px", width:"7px", height:"7px", background:"#FF3B1E", borderRadius:"50%" }} />
              </button>
              <a href="/cars">
                <button className="btn-red" style={{ padding:"9px 18px", fontSize:"13px" }}>
                  <Car size={15}/> 차 찾기
                </button>
              </a>
            </div>
          </div>

          <div className="main-wrap" style={{ padding:"28px 32px 80px" }}>

            {/* ── 홈 ── */}
            {activeNav==="home" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"22px" }}>

                {/* 환영 배너 */}
                <div style={{ background:"linear-gradient(135deg,#1A1A1A,#2A2A2A)", borderRadius:"20px", padding:"28px 32px", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", right:"-20px", bottom:"-20px", fontFamily:"'Bebas Neue',serif", fontSize:"100px", color:"rgba(255,255,255,0.04)", lineHeight:1 }}>PICK</div>
                  <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"2px", color:"#FF7A63", marginBottom:"8px" }}>MY FIXCAR</div>
                  <div style={{ fontSize:"22px", fontWeight:800, color:"white", marginBottom:"4px" }}>김지원님, 안녕하세요! 👋</div>
                  <div style={{ fontSize:"14px", color:"rgba(255,255,255,0.45)", fontWeight:400, marginBottom:"20px" }}>미답변 문의 <strong style={{ color:"#FFB8A8" }}>1건</strong>이 있어요. 빠른 확인 부탁드려요.</div>
                  <div style={{ display:"flex", gap:"10px" }}>
                    <a href="/quiz"><button style={{ background:"#FF3B1E", color:"white", border:"none", padding:"11px 20px", borderRadius:"10px", fontSize:"13px", fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:"7px" }}>
                      <Car size={14}/> 새 차 추천받기
                    </button></a>
                    <button onClick={()=>setActiveNav("inquiries")} style={{ background:"rgba(255,255,255,0.1)", color:"white", border:"1px solid rgba(255,255,255,0.15)", padding:"11px 20px", borderRadius:"10px", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>
                      문의 확인하기
                    </button>
                  </div>
                </div>

                {/* 통계 */}
                <div className="stats-row" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" }}>
                  {[
                    { icon:<Heart size={20} color="white"/>, color:"#FF3B1E", label:"찜한 차", value:likedCars.length, unit:"대" },
                    { icon:<MessageCircle size={20} color="white"/>, color:"#1847FF", label:"문의 내역", value:3, unit:"건" },
                    { icon:<Package size={20} color="white"/>, color:"#2D8A52", label:"구매 이력", value:1, unit:"건" },
                    { icon:<Wrench size={20} color="white"/>, color:"#E8A020", label:"예정 정비", value:2, unit:"건" },
                  ].map(s => (
                    <div key={s.label} className="card-hover" style={{ background:"white", borderRadius:"16px", padding:"20px" }}>
                      <div style={{ width:"42px", height:"42px", background:s.color, borderRadius:"13px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"14px" }}>{s.icon}</div>
                      <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"34px", color:"#1A1A1A", letterSpacing:"0.5px", lineHeight:1, marginBottom:"4px" }}>{s.value}<span style={{ fontSize:"15px", fontFamily:"'NanumSquareRound',sans-serif", fontWeight:700, color:"#AAA", marginLeft:"3px" }}>{s.unit}</span></div>
                      <div style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* 찜 + 일정 미리보기 */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px" }}>

                  {/* 찜 목록 미리보기 */}
                  <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
                    <div style={{ padding:"18px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #F0EEE9" }}>
                      <div style={{ fontSize:"16px", fontWeight:800 }}>찜한 차</div>
                      <button onClick={()=>setActiveNav("favorites")} style={{ fontSize:"13px", fontWeight:700, color:"#888", background:"transparent", border:"none", display:"flex", alignItems:"center", gap:"4px" }}>전체보기 <ChevronRight size={14}/></button>
                    </div>
                    {FAVORITES.slice(0,2).map(car => (
                      <div key={car.id} style={{ padding:"14px 22px", borderBottom:"1px solid #F0EEE9", display:"flex", gap:"12px", alignItems:"center" }}>
                        <div style={{ width:"54px", height:"42px", borderRadius:"8px", overflow:"hidden", flexShrink:0 }}>
                          <img src={`https://source.unsplash.com/108x84/?${car.query}`} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:"14px", fontWeight:800, marginBottom:"2px" }}>{car.name}</div>
                          <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{car.price.toLocaleString()}만원</div>
                        </div>
                        <span style={{ background:car.status==="판매중"?"#EAF6EF":"#EEF2FF", color:car.status==="판매중"?"#2D8A52":"#1847FF", padding:"3px 9px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{car.status}</span>
                      </div>
                    ))}
                  </div>

                  {/* 일정 미리보기 */}
                  <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
                    <div style={{ padding:"18px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #F0EEE9" }}>
                      <div style={{ fontSize:"16px", fontWeight:800 }}>다가오는 일정</div>
                      <button onClick={()=>setActiveNav("mycar")} style={{ fontSize:"13px", fontWeight:700, color:"#888", background:"transparent", border:"none", display:"flex", alignItems:"center", gap:"4px" }}>전체보기 <ChevronRight size={14}/></button>
                    </div>
                    {SCHEDULE.slice(0,3).map((s,i) => {
                      const tc = typeColor(s.type);
                      return (
                        <div key={i} style={{ padding:"12px 22px", borderBottom:"1px solid #F0EEE9", display:"flex", gap:"12px", alignItems:"center" }}>
                          <div style={{ width:"40px", height:"40px", background:tc.bg, borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            {s.type==="정비"?<Wrench size={17} color={tc.color}/>:s.type==="보험"?<Shield size={17} color={tc.color}/>:<AlertCircle size={17} color={tc.color}/>}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:"14px", fontWeight:800, marginBottom:"2px" }}>{s.title}</div>
                            <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{s.date}</div>
                          </div>
                          {s.urgent && <span style={{ background:"#FFF0ED", color:"#FF3B1E", padding:"2px 8px", borderRadius:"100px", fontSize:"10px", fontWeight:800 }}>긴급</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── 찜 목록 ── */}
            {activeNav==="favorites" && (
              <div>
                {likedCars.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"80px 20px" }}>
                    <Heart size={56} color="#E0DDD7" style={{ margin:"0 auto 20px" }} />
                    <div style={{ fontSize:"22px", fontWeight:800, marginBottom:"8px" }}>찜한 차가 없어요</div>
                    <div style={{ fontSize:"15px", color:"#AAA", marginBottom:"24px", fontWeight:400 }}>마음에 드는 차를 찜해두면 여기서 볼 수 있어요</div>
                    <a href="/cars"><button className="btn-red" style={{ margin:"0 auto", justifyContent:"center" }}>차 찾으러 가기 <ArrowRight size={16}/></button></a>
                  </div>
                ) : (
                  <div className="fav-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"18px" }}>
                    {FAVORITES.filter(c=>likedCars.includes(c.id)).map(car => (
                      <div key={car.id} className="fav-card" style={{ background:"white", borderRadius:"20px", overflow:"hidden" }}>
                        <div style={{ height:"170px", overflow:"hidden", position:"relative" }}>
                          <img src={`https://source.unsplash.com/600x400/?${car.query}`} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
                          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.25))" }} />
                          {car.priceChanged && (
                            <div style={{ position:"absolute", top:12, left:12, background:"#FF3B1E", color:"white", padding:"4px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>⬇ 가격 인하</div>
                          )}
                          <span style={{ position:"absolute", top:12, right:12, background:car.status==="판매중"?"#EAF6EF":"#EEF2FF", color:car.status==="판매중"?"#2D8A52":"#1847FF", padding:"4px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{car.status}</span>
                        </div>
                        <div style={{ padding:"16px 18px" }}>
                          <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"3px" }}>{car.name}</div>
                          <div style={{ fontSize:"12px", color:"#AAA", marginBottom:"14px", fontWeight:400 }}>{car.year} · {car.mileage}</div>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", paddingTop:"12px", borderTop:"1px solid #F0EEE9" }}>
                            <div>
                              <div style={{ fontSize:"22px", fontWeight:800 }}>{car.price.toLocaleString()}<span style={{ fontSize:"12px", color:"#AAA", fontWeight:700 }}>만원</span></div>
                              <div style={{ fontSize:"11px", color:"#1847FF", fontWeight:800, display:"flex", alignItems:"center", gap:"3px" }}><Lock size={10}/> FIX</div>
                            </div>
                            <div style={{ display:"flex", gap:"7px" }}>
                              <button onClick={()=>removeFavorite(car.id)} className="btn-ghost" style={{ padding:"7px 12px", color:"#E84A4A", borderColor:"#F7C1C1", fontSize:"12px" }}>
                                <Heart size={13}/> 찜 해제
                              </button>
                              <a href={`/cars/${car.id}`}><button className="btn-red" style={{ padding:"8px 14px", fontSize:"12px" }}>보기</button></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── 문의 내역 ── */}
            {activeNav==="inquiries" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                {INQUIRIES.map(inq => (
                  <div key={inq.id} style={{ background:"white", borderRadius:"18px", padding:"22px 24px", border:`1.5px solid ${inq.status==="미답변"?"#FFB8A8":"#ECEAE4"}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                      <div>
                        <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"3px" }}>{inq.carName}</div>
                        <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{inq.date}</div>
                      </div>
                      <span style={{ background:inq.status==="미답변"?"#FFF0ED":"#EAF6EF", color:inq.status==="미답변"?"#FF3B1E":"#2D8A52", padding:"4px 12px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>
                        {inq.status==="미답변" ? <><Clock size={11} style={{ display:"inline", verticalAlign:"middle", marginRight:"3px" }}/> 미답변</> : <><CheckCircle size={11} style={{ display:"inline", verticalAlign:"middle", marginRight:"3px" }}/> 답변완료</>}
                      </span>
                    </div>
                    <div style={{ background:"#F8F6F2", borderRadius:"12px", padding:"14px 16px", marginBottom: inq.reply?"14px":"0" }}>
                      <div style={{ fontSize:"12px", fontWeight:800, color:"#AAA", marginBottom:"5px" }}>내 문의</div>
                      <div style={{ fontSize:"14px", color:"#444", lineHeight:1.7, fontWeight:400 }}>{inq.msg}</div>
                    </div>
                    {inq.reply && (
                      <div style={{ background:"#EAF6EF", border:"1px solid #B8DFC8", borderRadius:"12px", padding:"14px 16px" }}>
                        <div style={{ fontSize:"12px", fontWeight:800, color:"#2D8A52", marginBottom:"5px" }}>딜러 답변</div>
                        <div style={{ fontSize:"14px", color:"#2D8A52", lineHeight:1.7, fontWeight:400 }}>{inq.reply}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── 구매 이력 ── */}
            {activeNav==="purchases" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                {PURCHASES.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"80px 20px" }}>
                    <Package size={56} color="#E0DDD7" style={{ margin:"0 auto 20px" }} />
                    <div style={{ fontSize:"22px", fontWeight:800, marginBottom:"8px" }}>구매 이력이 없어요</div>
                    <div style={{ fontSize:"15px", color:"#AAA", marginBottom:"24px", fontWeight:400 }}>첫 차를 픽스카에서 구매해보세요!</div>
                    <a href="/cars"><button className="btn-red" style={{ margin:"0 auto", justifyContent:"center" }}>차 찾기 <ArrowRight size={16}/></button></a>
                  </div>
                ) : PURCHASES.map(p => (
                  <div key={p.id} style={{ background:"white", borderRadius:"20px", padding:"24px 28px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"20px" }}>
                      <div>
                        <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"4px" }}>{p.carName}</div>
                        <div style={{ fontSize:"13px", color:"#AAA", fontWeight:400 }}>{p.year}년식 · 계약일 {p.depositDate}</div>
                      </div>
                      <span style={{ background:"#EAF6EF", color:"#2D8A52", padding:"6px 14px", borderRadius:"100px", fontSize:"13px", fontWeight:800 }}><CheckCircle size={13} style={{ display:"inline", verticalAlign:"middle", marginRight:"4px" }}/>{p.status}</span>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px", marginBottom:"20px" }}>
                      {[
                        { label:"구매 금액", value:`${p.price.toLocaleString()}만원` },
                        { label:"결제 방식", value:"FIX 정찰가" },
                        { label:"담당 딜러", value:p.dealer },
                      ].map(item => (
                        <div key={item.label} style={{ background:"#F8F6F2", borderRadius:"12px", padding:"14px 16px" }}>
                          <div style={{ fontSize:"12px", color:"#AAA", fontWeight:700, marginBottom:"5px" }}>{item.label}</div>
                          <div style={{ fontSize:"14px", fontWeight:800 }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:"10px" }}>
                      <button className="btn-ghost">계약서 보기</button>
                      <button className="btn-ghost">영수증 다운로드</button>
                      <button onClick={()=>setActiveNav("mycar")} className="btn-ghost" style={{ marginLeft:"auto" }}>
                        <Car size={14}/> 내 차 관리하기 <ArrowRight size={13}/>
                      </button>
                    </div>
                  </div>
                ))}

                {/* 리뷰 유도 */}
                <div style={{ background:"linear-gradient(135deg,#FFF0ED,#FFF8F5)", border:"1.5px solid #FFB8A8", borderRadius:"18px", padding:"22px 24px", display:"flex", gap:"16px", alignItems:"center" }}>
                  <div style={{ width:"48px", height:"48px", background:"#FF3B1E", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Star size={24} color="white" />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"4px" }}>구매 후기를 남겨주세요!</div>
                    <div style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>후기를 작성하면 다음 구매 시 할인 쿠폰을 드려요</div>
                  </div>
                  <button className="btn-red" style={{ flexShrink:0 }}>후기 작성 <ArrowRight size={14}/></button>
                </div>
              </div>
            )}

            {/* ── 내 차 관리 ── */}
            {activeNav==="mycar" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
                {/* 내 차 정보 */}
                <div style={{ background:"#1A1A1A", borderRadius:"20px", padding:"24px 28px", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", right:"-15px", bottom:"-15px", fontFamily:"'Bebas Neue',serif", fontSize:"90px", color:"rgba(255,255,255,0.04)", lineHeight:1 }}>CAR</div>
                  <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"2px", color:"#FF7A63", marginBottom:"10px" }}>내 차</div>
                  <div style={{ fontSize:"22px", fontWeight:800, color:"white", marginBottom:"4px" }}>기아 K5 DL3</div>
                  <div style={{ fontSize:"14px", color:"rgba(255,255,255,0.45)", fontWeight:400, marginBottom:"20px" }}>2020년식 · 흰색 · 누적 67,000km</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"10px" }}>
                    {[
                      { label:"보험 만기", value:"2024.03.15", warn:true },
                      { label:"마지막 정비", value:"2023.11.20", warn:false },
                      { label:"자동차세", value:"2024.06 납부", warn:false },
                      { label:"타이어 교체", value:"점검 필요", warn:true },
                    ].map(item => (
                      <div key={item.label} style={{ background: item.warn?"rgba(255,59,30,0.12)":"rgba(255,255,255,0.07)", borderRadius:"12px", padding:"14px", border:`1px solid ${item.warn?"rgba(255,59,30,0.25)":"rgba(255,255,255,0.08)"}` }}>
                        <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:700, marginBottom:"5px" }}>{item.label}</div>
                        <div style={{ fontSize:"13px", fontWeight:800, color:item.warn?"#FFB8A8":"white" }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 관리 일정 */}
                <div style={{ background:"white", borderRadius:"18px", overflow:"hidden" }}>
                  <div style={{ padding:"20px 24px", borderBottom:"1px solid #F0EEE9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ fontSize:"16px", fontWeight:800 }}>관리 일정</div>
                    <button className="btn-red" style={{ padding:"8px 16px", fontSize:"12px" }}><Calendar size={14}/> 일정 추가</button>
                  </div>
                  {SCHEDULE.map((s, i) => {
                    const tc = typeColor(s.type);
                    return (
                      <div key={i} className="schedule-item" style={{ padding:"16px 24px", borderBottom:"1px solid #F0EEE9", display:"flex", gap:"16px", alignItems:"center" }}>
                        <div style={{ width:"48px", height:"48px", background:tc.bg, borderRadius:"14px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {s.type==="정비"?<Wrench size={20} color={tc.color}/>:s.type==="보험"?<Shield size={20} color={tc.color}/>:<AlertCircle size={20} color={tc.color}/>}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
                            <span style={{ fontSize:"15px", fontWeight:800 }}>{s.title}</span>
                            {s.urgent && <span style={{ background:"#FFF0ED", color:"#FF3B1E", padding:"2px 8px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>⚡ 긴급</span>}
                            <span style={{ background:tc.bg, color:tc.color, padding:"2px 8px", borderRadius:"100px", fontSize:"11px", fontWeight:800, marginLeft:"auto" }}>{s.type}</span>
                          </div>
                          <div style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>{s.date} · {s.desc}</div>
                        </div>
                        <button className="btn-ghost" style={{ flexShrink:0, padding:"7px 14px", fontSize:"12px" }}>완료</button>
                      </div>
                    );
                  })}
                </div>

                {/* 초보자 팁 */}
                <div style={{ background:"#EEF2FF", border:"1px solid #B8C8FF", borderRadius:"16px", padding:"20px 22px", display:"flex", gap:"14px" }}>
                  <div style={{ width:"44px", height:"44px", background:"#1847FF", borderRadius:"14px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <AlertCircle size={22} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize:"15px", fontWeight:800, color:"#1847FF", marginBottom:"5px" }}>차 관리 꿀팁 💡</div>
                    <div style={{ fontSize:"14px", color:"#1847FF", opacity:0.8, lineHeight:1.7, fontWeight:400 }}>
                      엔진오일은 <strong style={{ fontWeight:800 }}>5,000~10,000km</strong>마다 교환해야 해요. 타이어 공기압은 <strong style={{ fontWeight:800 }}>월 1회</strong> 체크하는 게 좋아요.
                    </div>
                    <a href="/guide" style={{ display:"inline-flex", alignItems:"center", gap:"5px", marginTop:"10px", fontSize:"13px", fontWeight:800, color:"#1847FF" }}>
                      관리 가이드 더보기 <ArrowRight size={13}/>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ── 설정 ── */}
            {activeNav==="settings" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px", maxWidth:"560px" }}>

                {/* 프로필 */}
                <div style={{ background:"white", borderRadius:"18px", padding:"24px 28px" }}>
                  <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"20px" }}>프로필 설정</div>
                  <div style={{ display:"flex", gap:"16px", alignItems:"center", marginBottom:"24px", padding:"16px", background:"#F8F6F2", borderRadius:"12px" }}>
                    <div style={{ width:"60px", height:"60px", background:"#FFF0ED", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <User size={28} color="#FF3B1E" />
                    </div>
                    <div>
                      <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"4px" }}>김지원</div>
                      <div style={{ fontSize:"13px", color:"#AAA", fontWeight:400 }}>jiwon@email.com</div>
                    </div>
                    <button className="btn-ghost" style={{ marginLeft:"auto", flexShrink:0 }}>사진 변경</button>
                  </div>
                  {[["이름","김지원","text"],["이메일","jiwon@email.com","email"],["휴대폰","010-1234-5678","tel"]].map(([l,v,t])=>(
                    <div key={l} style={{ marginBottom:"14px" }}>
                      <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>{l}</label>
                      <input type={t} defaultValue={v} style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"13px 16px", fontSize:"15px", outline:"none", background:"#FAFAF8" }} />
                    </div>
                  ))}
                  <button className="btn-red" style={{ justifyContent:"center", marginTop:"8px" }}>
                    <CheckCircle size={16}/> 저장하기
                  </button>
                </div>

                {/* 알림 설정 */}
                <div style={{ background:"white", borderRadius:"18px", padding:"24px 28px" }}>
                  <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"18px" }}>알림 설정</div>
                  {[
                    { label:"찜한 차 가격 변동 알림", sub:"찜 목록 차량의 가격이 바뀌면 알려드려요" },
                    { label:"문의 답변 알림", sub:"딜러가 답변을 남기면 알려드려요" },
                    { label:"차 관리 일정 알림", sub:"정비·보험 갱신일 1주 전 알림" },
                    { label:"픽스카 새 매물 알림", sub:"내 조건에 맞는 새 매물이 등록되면 알림" },
                  ].map(item => (
                    <div key={item.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid #F0EEE9" }}>
                      <div>
                        <div style={{ fontSize:"14px", fontWeight:700, marginBottom:"2px" }}>{item.label}</div>
                        <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{item.sub}</div>
                      </div>
                      <label style={{ position:"relative", width:"44px", height:"24px", flexShrink:0, cursor:"pointer" }}>
                        <input type="checkbox" defaultChecked style={{ opacity:0, width:0, height:0 }} />
                        <span style={{ position:"absolute", inset:0, background:"#FF3B1E", borderRadius:"12px", transition:"0.3s" }} />
                        <span style={{ position:"absolute", left:"2px", top:"2px", width:"20px", height:"20px", background:"white", borderRadius:"50%", transition:"0.3s", transform:"translateX(20px)" }} />
                      </label>
                    </div>
                  ))}
                </div>

                {/* 계정 관리 */}
                <div style={{ background:"white", borderRadius:"18px", padding:"18px 24px" }}>
                  <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"12px" }}>계정</div>
                  {[
                    { label:"비밀번호 변경", color:"#555" },
                    { label:"연결된 소셜 계정 관리", color:"#555" },
                    { label:"회원 탈퇴", color:"#E84A4A" },
                  ].map(item => (
                    <button key={item.label} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 0", borderBottom:"1px solid #F0EEE9", background:"transparent", border:"none", fontSize:"14px", fontWeight:600, color:item.color, cursor:"pointer" }}>
                      {item.label} <ChevronRight size={15} color="#CCC"/>
                    </button>
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
