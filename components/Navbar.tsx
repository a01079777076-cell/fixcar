"use client";

import { useState, useEffect, useRef } from "react";
import {
  Car, Heart, User, LogOut, ChevronDown,
  LayoutDashboard, Menu, X, BookOpen, ArrowRight,
  Settings, Shield
} from "lucide-react";
import Image from "next/image";

interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMega, setShowMega] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(true);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => { setUser(data.user); setLoading(false); })
      .catch(() => setLoading(false));

    // 3초 후 로그인 말풍선 자동 표시
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setShowMega(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    document.cookie = "fixcar-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  };

  const MEGA_MENU = [
    {
      title: "차량 찾기",
      color: "#FF3B1E",
      links: [
        { label: "전체 매물", href: "/cars", desc: "FIX 정찰가 전체 보기" },
        { label: "추천 퀴즈", href: "/quiz", desc: "3분으로 내 차 찾기" },
        { label: "차량 비교", href: "/compare", desc: "최대 3대 스펙 비교" },
        { label: "차량 카탈로그", href: "/catalog", desc: "출고가·옵션 전체 조회" },
        { label: "자동차 랭킹", href: "/ranking", desc: "최고가·가성비 랭킹표" },
      ],
    },
    {
      title: "정보·커뮤니티",
      color: "#1847FF",
      links: [
        { label: "초보 가이드", href: "/guide", desc: "중고차 구매 A to Z" },
        { label: "픽스카 블로그", href: "/blog", desc: "차량 설명·추천 용품" },
        { label: "커뮤니티", href: "/community", desc: "자유게시판·리뷰·Q&A" },
      ],
    },
    {
      title: "거래하기",
      color: "#2D8A52",
      links: [
        { label: "내 차 팔기", href: "/sell", desc: "3분 입력·가격 제안" },
        { label: "서비스 결제", href: "/payment", desc: "프리미엄 서비스 구매" },
        { label: "딜러 신청", href: "/dealer/apply", desc: "픽스카 딜러 등록" },
      ],
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .nav-link { transition:color 0.15s; }
        .nav-link:hover { color:#1A1A1A !important; }
        .dropdown { position:relative; }
        .dropdown-menu { position:absolute; top:calc(100% + 8px); right:0; background:white; border:1px solid #ECEAE4; border-radius:14px; padding:8px; min-width:200px; box-shadow:0 8px 24px rgba(0,0,0,0.08); z-index:200; }
        .dropdown-item { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; font-size:14px; font-weight:600; color:#555; cursor:pointer; transition:background 0.15s; border:none; background:transparent; width:100%; text-align:left; font-family:'NanumSquareRound',sans-serif; text-decoration:none; }
        .dropdown-item:hover { background:#F0EEE9; color:#1A1A1A; }
        .dropdown-item.danger:hover { background:#FFF0ED; color:#FF3B1E; }
        .dropdown-item.dealer { background:#EEF2FF; color:#1847FF; font-weight:800; }
        .dropdown-item.dealer:hover { background:#D6E0FF; }
        .dropdown-item.admin-item { background:#FFF0ED; color:#FF3B1E; font-weight:800; }
        .dropdown-item.admin-item:hover { background:#FFE0D9; }
        .dealer-pill { background:#1847FF; color:white; padding:6px 14px; border-radius:100px; font-size:12px; font-weight:800; cursor:pointer; border:none; font-family:'NanumSquareRound',sans-serif; transition:all 0.2s; display:flex; align-items:center; gap:6px; }
        .dealer-pill:hover { background:#1238D4; transform:translateY(-1px); }
        .admin-pill { background:#FF3B1E; color:white; padding:6px 14px; border-radius:100px; font-size:12px; font-weight:800; cursor:pointer; border:none; font-family:'NanumSquareRound',sans-serif; transition:all 0.2s; display:flex; align-items:center; gap:6px; }
        .admin-pill:hover { background:#D42E14; transform:translateY(-1px); }
        .mega-link { display:flex; flex-direction:column; padding:8px 12px; border-radius:10px; text-decoration:none; color:inherit; transition:background 0.15s; }
        .mega-link:hover { background:#F0EEE9; }
        .login-tooltip { position:absolute; bottom:-52px; right:0; background:#FEE500; color:#391B1B; padding:9px 14px; border-radius:12px; font-size:13px; font-weight:800; white-space:nowrap; box-shadow:0 4px 16px rgba(0,0,0,0.12); z-index:200; }
        .login-tooltip::before { content:''; position:absolute; top:-7px; right:20px; width:14px; height:14px; background:#FEE500; transform:rotate(45deg); border-radius:2px; }
        .login-btn { background:#FEE500; color:#391B1B; border:none; padding:10px 20px; border-radius:100px; font-size:14px; font-weight:800; cursor:pointer; font-family:'NanumSquareRound',sans-serif; transition:all 0.2s; display:flex; align-items:center; gap:6px; }
        .login-btn:hover { background:#F5D800; transform:translateY(-1px); }
        @media(max-width:1024px) { .desktop-nav { display:none !important; } .mobile-menu-btn { display:flex !important; } }
        @media(min-width:1025px) { .mobile-menu-btn { display:none !important; } }
      `}</style>

      {/* 공지 바 */}
      <div style={{ background:"#1A1A1A", color:"#fff", textAlign:"center", padding:"10px 20px", fontSize:"13px", fontWeight:700 }}>
        <span style={{ color:"#FF7A63" }}>NEW AI</span> 나에게 알맞는 완벽한 중고차 &nbsp;·&nbsp;
        <span style={{ color:"#7A9BFF" }}>FIX</span> 정찰제 — 가격 흥정 없음
      </div>

      {/* 메인 네비 */}
      <nav style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid #ECEAE4", height:"68px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px", position:"sticky", top:0, zIndex:100 }}>

        {/* 로고 + 아이콘 */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
          <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"36px", letterSpacing:"3px", textDecoration:"none", color:"inherit", display:"flex", alignItems:"center", gap:"10px" }}>
            <img src="/favicon.svg" alt="픽스카" width={40} height={40} style={{ borderRadius:"10px" }} />
            <span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span>
          </a>
        </div>

        {/* 데스크탑 메뉴 */}
        <div className="desktop-nav" style={{ display:"flex", gap:"4px", alignItems:"center" }}>
          <div ref={megaRef} style={{ position:"relative" }}>
            <button onClick={() => setShowMega(!showMega)}
              style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"15px", fontWeight:700, color:"#888", background:"transparent", border:"none", cursor:"pointer", padding:"8px 12px", borderRadius:"8px", fontFamily:"'NanumSquareRound',sans-serif" }}>
              전체 메뉴 <ChevronDown size={14} style={{ transform:showMega?"rotate(180deg)":"none", transition:"transform 0.2s" }} />
            </button>

            {showMega && (
              <div style={{ position:"absolute", top:"calc(100% + 10px)", left:"-120px", background:"white", border:"1px solid #ECEAE4", borderRadius:"20px", padding:"20px", boxShadow:"0 16px 48px rgba(0,0,0,0.1)", zIndex:200, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px", minWidth:"680px" }}>
                {MEGA_MENU.map(section => (
                  <div key={section.title}>
                    <div style={{ fontSize:"11px", fontWeight:800, letterSpacing:"1px", color:section.color, marginBottom:"10px", padding:"0 12px" }}>{section.title.toUpperCase()}</div>
                    {section.links.map(link => (
                      <a key={link.href} href={link.href} className="mega-link" onClick={() => setShowMega(false)}>
                        <span style={{ fontSize:"14px", fontWeight:800, color:"#1A1A1A" }}>{link.label}</span>
                        <span style={{ fontSize:"12px", color:"#AAA", fontWeight:400, marginTop:"1px" }}>{link.desc}</span>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {[["차 찾기","/cars"],["추천 퀴즈","/quiz"],["블로그","/blog"],["커뮤니티","/community"]].map(([l,h]) => (
            <a key={l} href={h} className="nav-link" style={{ fontSize:"15px", fontWeight:700, color:"#888", textDecoration:"none", padding:"8px 12px", borderRadius:"8px" }}>{l}</a>
          ))}
        </div>

        {/* 오른쪽 */}
        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>

          {/* 관리자 히든버튼 */}
          {user?.role === "ADMIN" && (
            <a href="/admin">
              <button className="admin-pill"><Shield size={13} /> 관리자</button>
            </a>
          )}

          {/* 딜러 히든버튼 */}
          {user && (user.role === "DEALER" || user.role === "ADMIN") && (
            <a href="/dealer">
              <button className="dealer-pill"><LayoutDashboard size={13} /> 딜러관</button>
            </a>
          )}

          {loading ? (
            <div style={{ width:"100px", height:"36px", background:"#F0EEE9", borderRadius:"100px" }} />
          ) : user ? (
            <div className="dropdown">
              <button onClick={() => setShowDropdown(!showDropdown)}
                style={{ display:"flex", alignItems:"center", gap:"8px", background:"#F0EEE9", border:"none", padding:"8px 16px", borderRadius:"100px", fontSize:"14px", fontWeight:700, cursor:"pointer", fontFamily:"'NanumSquareRound',sans-serif" }}>
                <div style={{ width:"28px", height:"28px", background:"#FF3B1E", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
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
                    <>
                      <div style={{ height:"1px", background:"#F0EEE9", margin:"6px 0" }} />
                      <a href="/admin" className="dropdown-item admin-item"><Shield size={16} /> 관리자 대시보드</a>
                      <a href="/admin/users" className="dropdown-item admin-item"><User size={16} /> 회원 관리</a>
                      <a href="/admin/cars" className="dropdown-item admin-item"><Car size={16} /> 매물 검수</a>
                      <a href="/blog/write" className="dropdown-item admin-item"><BookOpen size={16} /> 블로그 글쓰기</a>
                      <a href="/admin/settings" className="dropdown-item admin-item"><Settings size={16} /> 사이트 설정</a>
                    </>
                  )}
                  <div style={{ height:"1px", background:"#F0EEE9", margin:"6px 0" }} />
                  <button className="dropdown-item danger" onClick={handleLogout}><LogOut size={16} /> 로그아웃</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ position:"relative" }}>
              <a href="/login">
                <button className="login-btn" onMouseEnter={() => setShowTooltip(false)}>
                  로그인 / 회원가입
                </button>
              </a>
              {showTooltip && (
                <div className="login-tooltip">
                  💛 카카오톡으로 3초 로그인
                  <button onClick={() => setShowTooltip(false)} style={{ background:"none", border:"none", cursor:"pointer", marginLeft:"8px", color:"#391B1B", fontWeight:800 }}>✕</button>
                </div>
              )}
            </div>
          )}

          <button className="mobile-menu-btn" onClick={() => setShowMobile(!showMobile)}
            style={{ width:"40px", height:"40px", border:"1.5px solid #E0DDD7", borderRadius:"10px", background:"white", cursor:"pointer", display:"none", alignItems:"center", justifyContent:"center" }}>
            {showMobile ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* 모바일 메뉴 */}
      {showMobile && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:150 }} onClick={() => setShowMobile(false)}>
          <div style={{ position:"absolute", top:0, right:0, width:"300px", height:"100%", background:"white", padding:"24px", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
              <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"24px", letterSpacing:"3px" }}><span style={{ color:"#FF3B1E" }}>FIX</span>CAR</a>
              <button onClick={() => setShowMobile(false)} style={{ border:"none", background:"none", cursor:"pointer" }}><X size={22} /></button>
            </div>
            {MEGA_MENU.map(section => (
              <div key={section.title} style={{ marginBottom:"20px" }}>
                <div style={{ fontSize:"11px", fontWeight:800, letterSpacing:"2px", color:section.color, marginBottom:"8px" }}>{section.title.toUpperCase()}</div>
                {section.links.map(link => (
                  <a key={link.href} href={link.href} onClick={() => setShowMobile(false)}
                    style={{ display:"block", padding:"10px 0", fontSize:"15px", fontWeight:700, color:"#1A1A1A", textDecoration:"none", borderBottom:"1px solid #F0EEE9" }}>
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
            {!user ? (
              <a href="/login"><button style={{ width:"100%", background:"#FEE500", color:"#391B1B", border:"none", padding:"14px", borderRadius:"12px", fontSize:"15px", fontWeight:800, cursor:"pointer", marginTop:"12px" }}>💛 카카오톡으로 로그인</button></a>
            ) : (
              <div style={{ marginTop:"20px", padding:"14px", background:"#F0EEE9", borderRadius:"12px" }}>
                <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"10px" }}>{user.name}님</div>
                <a href="/mypage" style={{ display:"block", fontSize:"14px", color:"#555", textDecoration:"none", marginBottom:"8px" }}>마이페이지</a>
                {user.role === "ADMIN" && <a href="/admin" style={{ display:"block", fontSize:"14px", color:"#FF3B1E", textDecoration:"none", fontWeight:800, marginBottom:"8px" }}>관리자</a>}
                <button onClick={handleLogout} style={{ fontSize:"14px", color:"#FF3B1E", background:"none", border:"none", cursor:"pointer", fontWeight:700, padding:0 }}>로그아웃</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
