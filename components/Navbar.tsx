"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isDealer = pathname.startsWith("/dealer");

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => { if (d?.user) setUser(d.user); }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    /* 쿠키 직접 삭제 */
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    setShowUserMenu(false);
    window.location.href = "/";
  };

  const accent = isDealer ? "#0066FF" : "#FF3B1E";

  const NAV_LINKS = [
    { label: "차량 매물", href: "/cars" },
    { label: "내차 찾기", href: "/quiz-select" },
    { label: "카탈로그", href: "/catalog" },
    { label: "랭킹", href: "/ranking" },
    { label: "배틀", href: "/battle" },
    { label: "블로그", href: "/blog" },
  ];

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 9999,
        background: isDealer ? "white" : "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: isDealer ? "1px solid #DDEEFF" : "1px solid #E8E6E1",
        boxShadow: isDealer ? "0 2px 12px rgba(0,102,255,0.06)" : "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
        }}>
          {/* 로고 */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: accent, letterSpacing: 1.5 }}>FIXCAR</span>
          </Link>

          {/* PC 메뉴 */}
          <div className="nav-pc-menu" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} style={{
                padding: "8px 14px", borderRadius: 10, fontSize: 14, fontWeight: pathname === link.href ? 800 : 600,
                color: pathname === link.href ? accent : "#555",
                background: pathname === link.href ? (isDealer ? "#EEF5FF" : "#FFF0ED") : "transparent",
                textDecoration: "none", transition: "all 0.15s",
              }}>
                {link.label}
              </Link>
            ))}

            {/* 딜러 히든버튼 - 5번 탭 */}
            <Link href="/dealer" style={{
              padding: "8px 12px", borderRadius: 10, fontSize: 14, fontWeight: 600,
              color: "transparent", textDecoration: "none", userSelect: "none",
              background: "transparent", width: 40,
            }}>
              D
            </Link>
          </div>

          {/* 우측 영역 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {user ? (
              <div ref={userMenuRef} style={{ position: "relative" }}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 14px", borderRadius: 100, border: `1.5px solid ${isDealer ? "#DDEEFF" : "#E8E6E1"}`,
                  background: "white", cursor: "pointer", fontSize: 13, fontWeight: 700,
                  fontFamily: "'NanumSquareRound',sans-serif", color: "#333",
                }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: accent, color: "white", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {(user.name || "U")[0]}
                  </span>
                  {user.name || "회원"}
                </button>
                {showUserMenu && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "white", borderRadius: 14, padding: 6,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: 160, zIndex: 100,
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
                      }}>
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ height: 1, background: "#F0EEE9", margin: "4px 8px" }} />
                    <button onClick={handleLogout} style={{
                      width: "100%", padding: "10px 14px", borderRadius: 8, border: "none",
                      background: "transparent", fontSize: 13, fontWeight: 700, color: "#E24B4A",
                      textAlign: "left", cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
                    }}>
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="/api/auth/kakao/callback" style={{ textDecoration: "none" }}>
                <button style={{
                  padding: "8px 18px", borderRadius: 100, border: "none",
                  background: "#FEE500", color: "#3C1E1E", fontSize: 13, fontWeight: 800,
                  cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  🗨️ 카카오 로그인
                </button>
              </a>
            )}

            {/* 모바일 햄버거 */}
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

        {/* 모바일 메뉴 */}
        {menuOpen && (
          <div className="nav-mobile-menu" style={{
            padding: "8px 16px 16px", borderTop: "1px solid #F0EEE9",
            display: "flex", flexDirection: "column", gap: 2,
          }}>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
                padding: "12px 14px", borderRadius: 10, fontSize: 15, fontWeight: 700,
                color: pathname === link.href ? accent : "#555",
                background: pathname === link.href ? (isDealer ? "#EEF5FF" : "#FFF0ED") : "transparent",
                textDecoration: "none",
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .nav-pc-menu { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
