"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Tag, ExternalLink, Calendar, ChevronRight } from "lucide-react";

// 샘플 블로그 데이터 (실제 DB 연동 시 교체)
const SAMPLE_POSTS = [
  {
    id: 1,
    title: "초보 운전자를 위한 첫 중고차 구매 완벽 가이드",
    summary: "면허 따고 첫 차 구매 고민 중이라면 꼭 읽어보세요. 예산 설정부터 보험까지 A to Z.",
    category: "구매 가이드",
    date: "2025-03-10",
    readTime: "8분",
    products: [
      { name: "차량용 블랙박스 추천", url: "https://coupang.com", platform: "쿠팡" },
      { name: "초보 운전 스티커 세트", url: "https://coupang.com", platform: "쿠팡" },
    ],
    color: "#FF3B1E",
  },
  {
    id: 2,
    title: "2025년 가성비 국산차 TOP 5 — 실제 오너 리뷰",
    summary: "1,000~2,000만원 예산으로 살 수 있는 가성비 최고의 중고차 5대를 골랐어요.",
    category: "차량 추천",
    date: "2025-03-05",
    readTime: "6분",
    products: [
      { name: "차량용 방향제 베스트", url: "https://aliexpress.com", platform: "알리" },
    ],
    color: "#1847FF",
  },
  {
    id: 3,
    title: "중고차 구매 후 꼭 해야 할 관리 용품 10가지",
    summary: "차 받자마자 바로 구매해야 할 필수 용품과 추천 제품 리스트예요.",
    category: "추천 용품",
    date: "2025-02-28",
    readTime: "5분",
    products: [
      { name: "차량용 공기청정기", url: "https://coupang.com", platform: "쿠팡" },
      { name: "유리막 코팅제", url: "https://aliexpress.com", platform: "알리" },
      { name: "차량용 충전기 멀티탭", url: "https://coupang.com", platform: "쿠팡" },
    ],
    color: "#2D8A52",
  },
  {
    id: 4,
    title: "전기차 처음 사는 분들이 꼭 알아야 할 것들",
    summary: "충전 방법부터 보조금 신청까지, 전기차 초보를 위한 완벽 정리.",
    category: "전기차",
    date: "2025-02-20",
    readTime: "10분",
    products: [
      { name: "가정용 완속충전기", url: "https://coupang.com", platform: "쿠팡" },
    ],
    color: "#E8A020",
  },
];

const CATS = ["전체", "구매 가이드", "차량 추천", "추천 용품", "전기차"];

export default function BlogPage() {
  const [activeCat, setActiveCat] = useState("전체");
  const [user, setUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => setUser(d.user));
  }, []);

  const filtered = SAMPLE_POSTS.filter(p => activeCat === "전체" || p.category === activeCat);

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        .post-card { background:white; border-radius:20px; overflow:hidden; transition:all 0.2s; cursor:pointer; }
        .post-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.08); }
        .product-link { display:flex; align-items:center; gap:8px; padding:8px 14px; border-radius:100px; border:1.5px solid; font-size:12px; font-weight:700; text-decoration:none; transition:all 0.15s; }
        .product-link:hover { transform:translateY(-1px); }
        @media(max-width:1024px) { .blog-grid { grid-template-columns:1fr 1fr !important; } }
        @media(max-width:640px) { .blog-grid { grid-template-columns:1fr !important; } .page-wrap { padding:20px !important; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <Navbar />

        <div style={{ background: "#1A1A1A", padding: "56px 52px 48px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "3px", color: "#FF7A63", marginBottom: "12px" }}>FIXCAR BLOG</div>
            <h1 style={{ fontSize: "clamp(28px,4vw,54px)", fontWeight: 800, color: "white", letterSpacing: "-1.5px", marginBottom: "10px" }}>
              차에 대해 <span style={{ color: "#FF3B1E" }}>제대로</span> 알기
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", fontWeight: 400 }}>구매 가이드·추천 용품·차량 리뷰까지</p>
          </div>
        </div>

        <div className="page-wrap" style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 52px 80px" }}>
          {/* 관리자 글쓰기 버튼 */}
          {user?.role === "ADMIN" && (
            <div style={{ background: "#EEF2FF", border: "1px solid #B8C8FF", borderRadius: "14px", padding: "14px 20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#1847FF" }}>관리자 모드 — 글을 작성할 수 있어요</span>
              <button style={{ background: "#1847FF", color: "white", border: "none", padding: "9px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 800 }}>+ 새 글 쓰기</button>
            </div>
          )}

          {/* 카테고리 필터 */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
            {CATS.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding: "8px 18px", borderRadius: "100px", border: `2px solid ${activeCat === cat ? "#1A1A1A" : "#E0DDD7"}`, background: activeCat === cat ? "#1A1A1A" : "white", color: activeCat === cat ? "white" : "#555", fontSize: "13px", fontWeight: 700 }}>{cat}</button>
            ))}
          </div>

          <div className="blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
            {filtered.map(post => (
              <div key={post.id} className="post-card">
                {/* 컬러 헤더 */}
                <div style={{ background: post.color, padding: "28px 24px 22px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", right: "-20px", bottom: "-20px", fontFamily: "'Bebas Neue',serif", fontSize: "80px", color: "rgba(255,255,255,0.07)", lineHeight: 1 }}>PICK</div>
                  <span style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 800, display: "inline-block", marginBottom: "12px" }}>{post.category}</span>
                  <h2 style={{ fontSize: "17px", fontWeight: 800, color: "white", lineHeight: 1.35, letterSpacing: "-0.3px" }}>{post.title}</h2>
                </div>

                <div style={{ padding: "18px 22px" }}>
                  <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.75, marginBottom: "16px", fontWeight: 400 }}>{post.summary}</p>

                  {/* 추천 용품 어필리에이트 링크 */}
                  {post.products.length > 0 && (
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 800, color: "#AAA", letterSpacing: "1px", marginBottom: "8px" }}>추천 용품</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {post.products.map((p, i) => (
                          <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                            className="product-link"
                            style={{ borderColor: p.platform === "쿠팡" ? "#FF3B1E" : "#E85D24", color: p.platform === "쿠팡" ? "#FF3B1E" : "#E85D24", background: p.platform === "쿠팡" ? "#FFF0ED" : "#FFF5EE" }}>
                            <Tag size={12} />
                            {p.name}
                            <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "3px", fontSize: "10px", opacity: 0.7 }}>{p.platform} <ExternalLink size={10} /></span>
                          </a>
                        ))}
                      </div>
                      <div style={{ fontSize: "10px", color: "#CCC", marginTop: "6px", fontWeight: 400 }}>* 파트너스 활동으로 수수료를 받을 수 있어요</div>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid #F0EEE9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#AAA", fontWeight: 400 }}>
                      <Calendar size={12} /> {post.date} · {post.readTime} 읽기
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: 800, color: post.color }}>
                      읽기 <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
