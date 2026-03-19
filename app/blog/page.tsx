"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface BlogPost {
  id: string; title: string; content: string; thumbnail?: string;
  createdAt: string; category?: string; author?: { name?: string };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : data.posts || []); setLoading(false); })
      .catch(() => { setPosts([]); setLoading(false); });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        .blog-card{transition:all 0.2s;}
        .blog-card:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,0.1)!important;}
      `}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        {/* ★ 수정: 헤더에 글쓰기 버튼 추가 */}
        <div style={{ background: "#1A1A1A", padding: "44px 24px 36px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 4, color: "#FF3B1E", marginBottom: 8 }}>FIXCAR BLOG</div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: "white", letterSpacing: -1, marginBottom: 6 }}>블로그</h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>중고차 구매 꿀팁 · 차량 리뷰 · 자동차 뉴스</p>
            </div>
            {/* ★ "첫 글쓰기" → "글쓰기" + 상단 위치 */}
            <Link href="/blog/write">
              <button style={{
                padding: "12px 24px", background: "#FF3B1E", color: "white", border: "none",
                borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer",
                fontFamily: "'NanumSquareRound',sans-serif", display: "flex", alignItems: "center", gap: 6,
              }}>
                ✏️ 글쓰기
              </button>
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 120px" }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ background: "white", borderRadius: 18, overflow: "hidden" }}>
                  <div style={{ height: 200, background: "#E8E6E1" }} />
                  <div style={{ padding: 20 }}><div style={{ height: 20, background: "#E8E6E1", borderRadius: 4, width: "70%" }} /></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div style={{ background: "white", borderRadius: 18, padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>아직 블로그 글이 없어요</div>
              <p style={{ fontSize: 13, color: "#AAA", fontWeight: 400 }}>곧 유용한 콘텐츠가 업로드됩니다!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {posts.map((post, i) => (
                <Link key={post.id} href={`/blog/${post.id}`} style={{ textDecoration: "none" }}>
                  <div className="blog-card" style={{
                    background: "white", borderRadius: 18, overflow: "hidden", cursor: "pointer",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  }}>
                    <div style={{ height: 200, background: "#F0EEE9", overflow: "hidden", position: "relative" }}>
                      {post.thumbnail ? (
                        <img src={post.thumbnail} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 48, opacity: 0.3 }}>📰</span>
                        </div>
                      )}
                      {post.category && (
                        <span style={{
                          position: "absolute", top: 12, left: 12,
                          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                          color: "white", padding: "4px 12px", borderRadius: 100,
                          fontSize: 11, fontWeight: 700,
                        }}>{post.category}</span>
                      )}
                    </div>
                    <div style={{ padding: "20px 22px 22px" }}>
                      <h2 style={{
                        fontSize: i === 0 ? 22 : 20,
                        fontWeight: 800, color: "#1A1A1A", lineHeight: 1.35,
                        marginBottom: 10, letterSpacing: -0.5,
                        overflow: "hidden", textOverflow: "ellipsis",
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                      }}>
                        {post.title}
                      </h2>
                      <p style={{
                        fontSize: 13, color: "#888", fontWeight: 400, lineHeight: 1.65, marginBottom: 14,
                        overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box",
                        WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
                      }}>
                        {post.content?.replace(/<[^>]*>/g, "").slice(0, 120)}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#CCC", fontWeight: 400 }}>
                          {post.author?.name || "픽스카"} · {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#FF3B1E" }}>읽기 →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
