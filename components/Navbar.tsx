"use client";

import { useState, useEffect } from "react";
import { Car, Heart, User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";

interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => { setUser(data.user); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    document.cookie = "fixcar-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .nav-link:hover { color:#1A1A1A !important; }
        .dropdown { position:relative; }
        .dropdown-menu { position:absolute; top:calc(100% + 8px); right:0; background:white; border:1px solid #ECEAE4; border-radius:14px; padding:8px; min-width:190px; box-shadow:0 8px 24px rgba(0,0,0,0.08); z-index:200; }
        .dropdown-item { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; font-size:14px; font-weight:600; color:#555; cursor:pointer; transition:background 0.15s; border:none; background:transparent; width:100%; text-align:left; font-family:'NanumSquareRound',sans-serif; text-decoration:none; }
        .dropdown-item:hover { background:#F0EEE9; color:#1A1A1A; }
        .dropdown-item.danger:hover { background:#FFF0ED; color:#FF3B1E; }
        .dropdown-item.dealer { background:#EEF2FF; color:#1847FF; font-weight:800; }
        .dropdown-item.dealer:hover { background:#D6E0FF; }
        .dealer-pill { background:#1847FF; color:white; padding:5px 14px; border-radius:100px; font-size:12px; font-weight:800; cursor:pointer; border:none; font-family:'NanumSquareRound',sans-serif; transition:all 0.2s; display:flex; align-items:center; gap:6px; }
        .dealer-pill:hover { background:#1238D4; transform:translateY(-1px); }
        @media(max-width:1024px) { .nav-menu { display:none !important; } }
      `}</style>

      <div style={{ background: "#1A1A1A", color: "#fff", textAlign: "center", padding: "10px 20px", fontSize: "13px", fontWeight: 700 }}>
        <span style={{ color: "#FF7A63" }}>PICK</span> 맘에 드는 차를 픽하세요 &nbsp;·&nbsp;
        <span style={{ color: "#7A9BFF" }}>FIX</span> 정찰제 — 가격 흥정 없음
      </div>

      <nav style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid #ECEAE4", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 52px", position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/" style={{ fontFamily: "'Bebas Neue',serif", fontSize: "28px", letterSpacing: "3px", textDecoration: "none", color: "inherit" }}>
          <span style={{ color: "#FF3B1E" }}>FIX</span><span>CAR</span>
        </a>

        <div className="nav-menu" style={{ display: "flex", gap: "36px" }}>
          {[["차 찾기", "/cars"], ["추천 퀴즈", "/quiz"], ["초보 가이드", "/guide"], ["내 차 팔기", "/sell"]].map(([l, h]) => (
            <a key={l} href={h} className="nav-link" style={{ fontSize: "15px", fontWeight: 700, color: "#888", textDecoration: "none" }}>{l}</a>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* 딜러 전용 히든버튼 */}
          {user && (user.role === "DEALER" || user.role === "ADMIN") && (
            <a href="/dealer">
              <button className="dealer-pill">
                <LayoutDashboard size={13} /> 딜러관
              </button>
            </a>
          )}

          {loading ? (
            <div style={{ width: "80px", height: "36px", background: "#F0EEE9", borderRadius: "100px" }} />
          ) : user ? (
            <div className="dropdown">
              <button onClick={() => setShowDropdown(!showDropdown)}
                style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F0EEE9", border: "none", padding: "8px 16px", borderRadius: "100px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>
                <div style={{ width: "28px", height: "28px", background: "#FF3B1E", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={14} color="white" />
                </div>
                {user.name}님
                <ChevronDown size={14} color="#888" />
              </button>
              {showDropdown && (
                <div className="dropdown-menu" onClick={() => setShowDropdown(false)}>
                  <a href="/mypage" className="dropdown-item"><User size={16} /> 마이페이지</a>
                  <a href="/mypage" className="dropdown-item"><Heart size={16} /> 찜 목록</a>
                  {user.role === "DEALER" && (
                    <a href="/dealer" className="dropdown-item dealer"><Car size={16} /> 딜러 대시보드</a>
                  )}
                  {user.role === "ADMIN" && (
                    <a href="/admin" className="dropdown-item dealer"><LayoutDashboard size={16} /> 관리자</a>
                  )}
                  <div style={{ height: "1px", background: "#F0EEE9", margin: "6px 0" }} />
                  <button className="dropdown-item danger" onClick={handleLogout}><LogOut size={16} /> 로그아웃</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a href="/login"><button style={{ background: "transparent", border: "2px solid #E0DDD7", padding: "9px 22px", borderRadius: "100px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>로그인</button></a>
              <a href="/quiz"><button style={{ background: "#FF3B1E", color: "white", border: "none", padding: "10px 22px", borderRadius: "100px", fontSize: "14px", fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>내 차 픽하기</button></a>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
