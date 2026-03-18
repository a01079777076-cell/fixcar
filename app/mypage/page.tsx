"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Heart, ShoppingBag, MessageCircle, Settings, LogOut, Car, ChevronRight, Star } from "lucide-react";

interface User { id:number; name:string; email:string; role:string; }
interface FavoriteCar { id:number; car:{ id:number; name:string; price:number; year:number; fuel:string; } }
interface Purchase { id:number; car:{ name:string; price:number; }; createdAt:string; status:string; }
interface Inquiry { id:number; car:{ name:string; }; message:string; status:string; createdAt:string; }

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<FavoriteCar[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [activeTab, setActiveTab] = useState("찜 목록");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(r => r.json())
      .then(async d => {
        if (!d.user) { window.location.href = "/login"; return; }
        setUser(d.user);
        const [favRes, purRes, inqRes] = await Promise.all([
          fetch(`/api/favorites?userId=${d.user.id}`),
          fetch(`/api/purchases?userId=${d.user.id}`),
          fetch(`/api/inquiries?userId=${d.user.id}`),
        ]);
        const [favData, purData, inqData] = await Promise.all([favRes.json(), purRes.json(), inqRes.json()]);
        if (favData.success) setFavorites(favData.data || []);
        if (purData.success) setPurchases(purData.data || []);
        if (inqData.success) setInquiries(inqData.data || []);
        setLoading(false);
      })
      .catch(() => { window.location.href = "/login"; });
  }, []);

  const handleLogout = () => {
    document.cookie = "fixcar-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  };

  const TABS = ["찜 목록", "구매 이력", "문의 내역"];

  if (loading) return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; } body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }`}</style>
      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}><Navbar /></div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        .tab-btn { transition:all 0.15s; cursor:pointer; border:none; background:transparent; white-space:nowrap; }
        .empty-state { text-align:center; padding:60px 20px; color:#AAA; }
        @media(max-width:1024px) { .my-grid { grid-template-columns:1fr !important; } .sidebar { display:none !important; } }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <Navbar />
        <div style={{ background:"#1A1A1A", padding:"44px 52px 36px" }}>
          <div style={{ maxWidth:"1100px", margin:"0 auto", display:"flex", alignItems:"center", gap:"20px" }}>
            <div style={{ width:"64px", height:"64px", background:"#FF3B1E", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", fontWeight:800, color:"white", flexShrink:0 }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#FF7A63", marginBottom:"6px" }}>MY PAGE</div>
              <h1 style={{ fontSize:"28px", fontWeight:800, color:"white", letterSpacing:"-1px" }}>{user?.name}님 환영해요!</h1>
              <div style={{ fontSize:"14px", color:"rgba(255,255,255,0.4)", marginTop:"4px", fontWeight:400 }}>{user?.email}</div>
            </div>
            <div style={{ marginLeft:"auto", display:"flex", gap:"10px" }}>
              {user?.role === "ADMIN" && <a href="/admin"><button style={{ background:"#FF3B1E", color:"white", border:"none", padding:"10px 20px", borderRadius:"100px", fontSize:"13px", fontWeight:800, cursor:"pointer" }}>관리자</button></a>}
              {(user?.role === "DEALER" || user?.role === "ADMIN") && <a href="/dealer"><button style={{ background:"#1847FF", color:"white", border:"none", padding:"10px 20px", borderRadius:"100px", fontSize:"13px", fontWeight:800, cursor:"pointer" }}>딜러관</button></a>}
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div style={{ background:"white", borderBottom:"1px solid #ECEAE4" }}>
          <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"0 52px", display:"flex" }}>
            {TABS.map(tab => (
              <button key={tab} className="tab-btn" onClick={() => setActiveTab(tab)}
                style={{ padding:"16px 20px", fontSize:"15px", fontWeight:activeTab===tab?800:600, color:activeTab===tab?"#FF3B1E":"#888", borderBottom:`3px solid ${activeTab===tab?"#FF3B1E":"transparent"}`, marginBottom:"-1px" }}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"28px 52px 80px" }}>

          {/* 찜 목록 */}
          {activeTab === "찜 목록" && (
            favorites.length === 0 ? (
              <div className="empty-state">
                <Heart size={52} color="#E0DDD7" style={{ margin:"0 auto 16px" }} />
                <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"8px", color:"#1A1A1A" }}>찜한 차량이 없어요</div>
                <div style={{ fontSize:"15px", fontWeight:400, marginBottom:"20px" }}>마음에 드는 차를 찜해보세요!</div>
                <a href="/cars"><button style={{ background:"#FF3B1E", color:"white", border:"none", padding:"12px 28px", borderRadius:"12px", fontSize:"14px", fontWeight:800, cursor:"pointer" }}>차량 둘러보기</button></a>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
                {favorites.map(fav => (
                  <a key={fav.id} href={`/cars/${fav.car.id}`} style={{ background:"white", borderRadius:"16px", padding:"18px 20px", display:"block", transition:"all 0.2s" }}>
                    <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"6px" }}>{fav.car.name}</div>
                    <div style={{ fontSize:"13px", color:"#AAA", marginBottom:"12px", fontWeight:400 }}>{fav.car.year}년식 · {fav.car.fuel}</div>
                    <div style={{ fontSize:"22px", fontWeight:800, color:"#FF3B1E" }}>{fav.car.price.toLocaleString()}만원</div>
                  </a>
                ))}
              </div>
            )
          )}

          {/* 구매 이력 */}
          {activeTab === "구매 이력" && (
            purchases.length === 0 ? (
              <div className="empty-state">
                <ShoppingBag size={52} color="#E0DDD7" style={{ margin:"0 auto 16px" }} />
                <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"8px", color:"#1A1A1A" }}>구매 이력이 없어요</div>
                <div style={{ fontSize:"15px", fontWeight:400, marginBottom:"20px" }}>픽스카에서 첫 차를 픽해보세요!</div>
                <a href="/cars"><button style={{ background:"#FF3B1E", color:"white", border:"none", padding:"12px 28px", borderRadius:"12px", fontSize:"14px", fontWeight:800, cursor:"pointer" }}>차량 보러가기</button></a>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {purchases.map(p => (
                  <div key={p.id} style={{ background:"white", borderRadius:"16px", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"4px" }}>{p.car.name}</div>
                      <div style={{ fontSize:"13px", color:"#AAA", fontWeight:400 }}>{p.createdAt?.slice(0,10)}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:"20px", fontWeight:800 }}>{p.car.price.toLocaleString()}만원</div>
                      <span style={{ background:"#EAF6EF", color:"#2D8A52", padding:"3px 10px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* 문의 내역 */}
          {activeTab === "문의 내역" && (
            inquiries.length === 0 ? (
              <div className="empty-state">
                <MessageCircle size={52} color="#E0DDD7" style={{ margin:"0 auto 16px" }} />
                <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"8px", color:"#1A1A1A" }}>문의 내역이 없어요</div>
                <div style={{ fontSize:"15px", fontWeight:400 }}>차량 상세 페이지에서 딜러에게 문의해보세요!</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {inquiries.map(inq => (
                  <div key={inq.id} style={{ background:"white", borderRadius:"16px", padding:"20px 24px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
                      <span style={{ fontSize:"15px", fontWeight:800 }}>{inq.car?.name}</span>
                      <span style={{ background:inq.status==="ANSWERED"?"#EAF6EF":"#FFF8EC", color:inq.status==="ANSWERED"?"#2D8A52":"#E8A020", padding:"3px 10px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>
                        {inq.status==="ANSWERED"?"답변완료":"답변대기"}
                      </span>
                    </div>
                    <div style={{ fontSize:"14px", color:"#555", fontWeight:400, lineHeight:1.6 }}>{inq.message}</div>
                    <div style={{ fontSize:"12px", color:"#AAA", marginTop:"8px", fontWeight:400 }}>{inq.createdAt?.slice(0,10)}</div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* 로그아웃 */}
          <div style={{ marginTop:"40px", paddingTop:"28px", borderTop:"1px solid #E0DDD7" }}>
            <button onClick={handleLogout} style={{ background:"white", border:"2px solid #E0DDD7", padding:"12px 24px", borderRadius:"12px", fontSize:"14px", fontWeight:700, color:"#FF3B1E", display:"flex", alignItems:"center", gap:"8px" }}>
              <LogOut size={16} /> 로그아웃
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
