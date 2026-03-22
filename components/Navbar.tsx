"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* 카카오 로그인 시작 URL */
const KAKAO_LOGIN_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || "6cf753da0f172df40eda14bd143c8bec"}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || "https://www.fixcar.kr/api/auth/kakao/callback")}&response_type=code`;

export default function Navbar() {
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isDealer = pathname.startsWith("/dealer");
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (sessionStorage.getItem("fixcar_logged_out") === "true") {
      sessionStorage.removeItem("fixcar_logged_out");
      setUser(null);
      return;
    }
    fetch("/api/auth/session", { cache: "no-store" })
      .then(r => r.json())
      .then(d => { if (d?.user) setUser(d.user); else setUser(null); })
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    setUser(null);
    setShowUserMenu(false);
    try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); } catch {}
    /* ★ fixcar-token 포함 모든 쿠키 삭제 */
    const cookieNames = ["fixcar-token", "token", "auth-token", "session", "next-auth.session-token"];
    const domains = ["", ".fixcar.kr", "fixcar.kr", "www.fixcar.kr"];
    cookieNames.forEach(name => {
      domains.forEach(domain => {
        let cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        if (domain) cookie += `; domain=${domain}`;
        document.cookie = cookie;
      });
    });
    sessionStorage.setItem("fixcar_logged_out", "true");
    window.location.replace("/?_t=" + Date.now());
  };

  const accent = isDealer || isAdmin ? "#0066FF" : "#FF3B1E";
  const userRole = user?.role || "USER";
  const isDealerUser = userRole === "DEALER" || userRole === "ADMIN";
  const isAdminUser = userRole === "ADMIN";

  const NAV_LINKS = [
    { label: "차량 매물", href: "/cars" },
    { label: "내차 찾기", href: "/quiz-select" },
    { label: "카탈로그", href: "/catalog" },
    { label: "랭킹", href: "/ranking" },
    { label: "배틀", href: "/battle" },
    { label: "경매", href: "/auction" },
  ];

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 9999,
        background: isDealer || isAdmin ? "white" : "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: isDealer || isAdmin ? "1px solid #DDEEFF" : "1px solid #E8E6E1",
        boxShadow: isDealer || isAdmin ? "0 2px 12px rgba(0,102,255,0.06)" : "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
        }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: accent, letterSpacing: 1.5 }}>FIXCAR</span>
          </Link>

          <div className="nav-pc-menu" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} style={{
                padding: "8px 14px", borderRadius: 10, fontSize: 14, fontWeight: pathname === link.href ? 800 : 600,
                color: pathname === link.href ? accent : "#555",
                background: pathname === link.href ? (isDealer || isAdmin ? "#EEF5FF" : "#FFF0ED") : "transparent",
                textDecoration: "none", transition: "all 0.15s",
              }}>
                {link.label}
              </Link>
            ))}
            {isDealerUser && (
              <Link href="/dealer" style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 800, color: "#0066FF", textDecoration: "none", background: "#EEF5FF", border: "1px solid #DDEEFF", marginLeft: 4 }}>
                🏪 딜러
              </Link>
            )}
            {isAdminUser && (
              <Link href="/admin" style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 800, color: "#FF3B1E", textDecoration: "none", background: "#FFF0ED", border: "1px solid #FFB8A8", marginLeft: 4 }}>
                ⚙️ 관리자
              </Link>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* 알림 + 설정 (PC) */}
            <div className="nav-pc-menu" style={{ display:"flex", alignItems:"center", gap:4 }}>
              <Link href="/notifications" style={{ padding:6, borderRadius:8, color:"#AAA", display:"flex", alignItems:"center" }} title="알림">🔔</Link>
              <Link href="/settings" style={{ padding:6, borderRadius:8, color:"#AAA", display:"flex", alignItems:"center" }} title="설정">⚙️</Link>
            </div>
            {user ? (
              <div ref={userMenuRef} style={{ position: "relative" }}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 14px", borderRadius: 100, border: `1.5px solid ${isDealer || isAdmin ? "#DDEEFF" : "#E8E6E1"}`,
                  background: "white", cursor: "pointer", fontSize: 13, fontWeight: 700,
                  fontFamily: "'NanumSquareRound',sans-serif", color: "#333",
                }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: accent, color: "white", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {(user.name || "U")[0]}
                  </span>
                  {user.name || "회원"}
                  {userRole !== "USER" && (
                    <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: userRole === "ADMIN" ? "#FF3B1E" : "#0066FF", color: "white", letterSpacing: 0.5 }}>{userRole}</span>
                  )}
                </button>
                {showUserMenu && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "white", borderRadius: 14, padding: 6,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: 180, zIndex: 100,
                    border: "1px solid #E8E6E1",
                  }}>
                    {[
                      { label: "마이페이지", href: "/mypage" },
                      { label: "내 찜 목록", href: "/mypage#favorites" },
                      { label: "문의 내역", href: "/mypage#inquiries" },
                    ].map((item, i) => (
                      <Link key={i} href={item.href} onClick={() => setShowUserMenu(false)} style={{
                        display: "block", padding: "10px 14px", borderRadius: 8, fontSize: 13,
                        fontWeight: 600, color: "#333", textDecoration: "none",
                      }}>{item.label}</Link>
                    ))}
                    {isDealerUser && (
                      <><div style={{ height: 1, background: "#F0EEE9", margin: "4px 8px" }} />
                      <Link href="/dealer" onClick={() => setShowUserMenu(false)} style={{ display: "block", padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700, color: "#0066FF", textDecoration: "none" }}>🏪 딜러 대시보드</Link></>
                    )}
                    {isAdminUser && (
                      <Link href="/admin" onClick={() => setShowUserMenu(false)} style={{ display: "block", padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700, color: "#FF3B1E", textDecoration: "none" }}>⚙️ 관리자 패널</Link>
                    )}
                    <div style={{ height: 1, background: "#F0EEE9", margin: "4px 8px" }} />
                    <button onClick={handleLogout} disabled={loggingOut} style={{
                      width: "100%", padding: "10px 14px", borderRadius: 8, border: "none",
                      background: "transparent", fontSize: 13, fontWeight: 700, color: "#E24B4A",
                      textAlign: "left", cursor: loggingOut ? "wait" : "pointer", fontFamily: "'NanumSquareRound',sans-serif",
                      opacity: loggingOut ? 0.5 : 1,
                    }}>{loggingOut ? "로그아웃 중..." : "로그아웃"}</button>
                  </div>
                )}
              </div>
            ) : (
              /* ★ 수정: 카카오 인증 페이지로 이동 (콜백 아님) */
              <a href="/login" style={{ textDecoration: "none" }}>
                <button style={{
                  padding: "8px 18px", borderRadius: 100, border: "none",
                  background: "#1A1A1A", color: "white", fontSize: 13, fontWeight: 800,
                  cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  로그인 / 회원가입
                </button>
              </a>
            )}

            <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
              display: "none", padding: 8, border: "none", background: "transparent", cursor: "pointer",
              flexDirection: "column", gap: 4,
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 20, height: 2, background: "#333", borderRadius: 2, transition: "all 0.2s",
                  transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(4px,4px)" : i === 2 ? "rotate(-45deg) translate(4px,-4px)" : "scaleX(0)") : "none",
                }} />
              ))}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div style={{ position:"fixed", top:60, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.3)", zIndex:9998 }} onClick={()=>setMenuOpen(false)} />
        )}
        {menuOpen && (
          <div style={{ position:"fixed", top:60, left:0, right:0, background:"white", zIndex:9999, borderRadius:"0 0 20px 20px", boxShadow:"0 12px 40px rgba(0,0,0,0.15)", maxHeight:"80vh", overflowY:"auto" }}>
            <div style={{ padding:"20px 24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <span style={{ fontSize:16, fontWeight:800 }}>전체 메뉴</span>
                <button onClick={()=>setMenuOpen(false)} style={{ border:"none", background:"transparent", fontSize:20, cursor:"pointer", color:"#AAA" }}>✕</button>
              </div>

              {/* 메뉴 그리드 */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:0, borderTop:"1px solid #F0EEE9" }}>
                {[
                  { label:"전체 매물", href:"/cars" },
                  { label:"내차 찾기", href:"/quiz-select" },
                  { label:"차량 MBTI", href:"/mbti" },
                  { label:"카탈로그", href:"/catalog" },
                  { label:"자동차 랭킹", href:"/ranking" },
                  { label:"자동차 배틀", href:"/battle" },
                  { label:"공개 경매", href:"/auction" },
                  { label:"블로그", href:"/blog" },
                  { label:"커뮤니티", href:"/community" },
                  { label:"딜러 모집", href:"/dealer/apply" },
                  { label:"클린픽스카", href:"/clean" },
                  { label:"고객센터", href:"/contact" },
                ].map(item => (
                  <Link key={item.href} href={item.href} onClick={()=>setMenuOpen(false)} style={{
                    padding:"16px 12px", fontSize:14, fontWeight:600, color:"#333",
                    textDecoration:"none", borderBottom:"1px solid #F0EEE9",
                    borderRight:"1px solid #F0EEE9",
                  }}>{item.label}</Link>
                ))}
              </div>

              {/* 알림 + 설정 */}
              <div style={{ display:"flex", gap:10, marginTop:16 }}>
                <Link href="/notifications" onClick={()=>setMenuOpen(false)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"14px", background:"#F8F7F4", borderRadius:12, textDecoration:"none", fontSize:14, fontWeight:700, color:"#555" }}>
                  🔔 알림
                </Link>
                <Link href="/settings" onClick={()=>setMenuOpen(false)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"14px", background:"#F8F7F4", borderRadius:12, textDecoration:"none", fontSize:14, fontWeight:700, color:"#555" }}>
                  ⚙️ 설정
                </Link>
              </div>

              {/* 딜러/관리자 바로가기 */}
              {(isDealerUser || isAdminUser) && (
                <div style={{ display:"flex", gap:10, marginTop:10 }}>
                  {isDealerUser && <Link href="/dealer" onClick={()=>setMenuOpen(false)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"14px", background:"#EEF5FF", borderRadius:12, textDecoration:"none", fontSize:14, fontWeight:800, color:"#0066FF" }}>🏪 딜러</Link>}
                  {isAdminUser && <Link href="/admin" onClick={()=>setMenuOpen(false)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"14px", background:"#FFF0ED", borderRadius:12, textDecoration:"none", fontSize:14, fontWeight:800, color:"#FF3B1E" }}>⚙️ 관리자</Link>}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      <style>{`@media (max-width: 768px) { .nav-pc-menu { display: none !important; } .nav-hamburger { display: flex !important; } }`}</style>
    </>
  );
}
