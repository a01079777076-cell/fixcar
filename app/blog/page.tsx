"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Calendar, Eye, Pin, Pencil, Trash2, Plus } from "lucide-react";

interface Post {
  id: number; title: string; summary?: string; category?: string;
  content?: string; tags?: string[]; createdAt: string;
  author?: { name?: string }; isPinned?: boolean;
}

function extractThumbnail(post: Post): string {
  if (post.summary && (post.summary.startsWith("http://") || post.summary.startsWith("https://"))) return post.summary;
  if (post.content) {
    const imgMatch = post.content.match(/<img[^>]+src=["']([^"']+)["']/);
    if (imgMatch) return imgMatch[1];
    const bracketMatch = post.content.match(/\[이미지:\s*(https?:\/\/[^\]]+)\]/);
    if (bracketMatch) return bracketMatch[1];
    const urlMatch = post.content.match(/(https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp))/i);
    if (urlMatch) return urlMatch[1];
  }
  return "";
}

const CATEGORIES = ["전체", "구매 가이드", "차량 관리", "소모품/꿀템", "보험/금융", "초보 운전", "뉴스/이벤트"];

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("전체");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/blog?limit=100").then(r => r.json()).then(d => {
      const arr = Array.isArray(d) ? d : d.posts || d.data || [];
      /* 대표글(pinned) 태그 체크 */
      const processed = arr.map((p: Post) => ({
        ...p,
        isPinned: Array.isArray(p.tags) && p.tags.includes("대표글"),
      }));
      setPosts(processed);
      setLoading(false);
    }).catch(() => setLoading(false));

    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (d?.user?.role === "ADMIN") setIsAdmin(true);
    }).catch(() => {});
  }, []);

  const filtered = category === "전체" ? posts : posts.filter(p => p.category === category);
  /* 대표글 먼저, 나머지 최신순 */
  const sorted = [...filtered].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const togglePin = async (postId: number, currentlyPinned: boolean) => {
    if (!confirm(currentlyPinned ? "대표글 해제할까요?" : "이 글을 대표글로 설정할까요?\n메인 블로그 섹션에서는 빠지고 목록 최상단에 고정됩니다.")) return;
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      const currentTags = Array.isArray(post.tags) ? post.tags : [];
      const newTags = currentlyPinned ? currentTags.filter(t => t !== "대표글") : [...currentTags, "대표글"];
      await fetch(`/api/blog/${postId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: newTags }),
      });
      setPosts(posts.map(p => p.id === postId ? { ...p, isPinned: !currentlyPinned, tags: newTags } : p));
    } catch {}
  };

  const handleDelete = async (postId: number, title: string) => {
    if (!confirm(`정말 "${title}" 글을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) return;
    try {
      const res = await fetch(`/api/blog/${postId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setPosts(posts.filter(p => p.id !== postId));
      else alert("삭제 실패");
    } catch { alert("네트워크 오류"); }
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "#1A1A1A", padding: "44px 24px 36px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue',serif", fontSize: 13, letterSpacing: 4, color: "#FF3B1E", marginBottom: 6 }}>FIXCAR BLOG</div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "white" }}>픽스카 블로그</h1>
            </div>
            {isAdmin && (
              <Link href="/blog/write">
                <button style={{ padding: "12px 24px", background: "#FF3B1E", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>
                  <Plus size={16} /> 글쓰기
                </button>
              </Link>
            )}
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px 100px" }}>
          {/* 카테고리 필터 */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding: "10px 18px", borderRadius: 100, fontSize: 13, fontWeight: category === c ? 800 : 500, whiteSpace: "nowrap",
                border: category === c ? "2px solid #FF3B1E" : "1.5px solid #E0DDD7",
                background: category === c ? "#FFF0ED" : "white", color: category === c ? "#FF3B1E" : "#888",
                cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
              }}>{c}</button>
            ))}
          </div>

          {loading ? <div style={{ textAlign: "center", padding: 60, color: "#CCC" }}>로딩 중...</div> : sorted.length === 0 ? (
            <div style={{ background: "white", borderRadius: 18, padding: "60px 20px", textAlign: "center", color: "#CCC" }}>
              아직 블로그 글이 없어요
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
              {sorted.map(post => {
                const thumb = extractThumbnail(post);
                return (
                  <div key={post.id} style={{ background: "white", borderRadius: 18, overflow: "hidden", position: "relative", border: post.isPinned ? "2px solid #FF3B1E" : "none" }}>
                    {post.isPinned && (
                      <div style={{ position: "absolute", top: 10, right: 10, background: "#FF3B1E", color: "white", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 800, zIndex: 2, display: "flex", alignItems: "center", gap: 4 }}>
                        <Pin size={10} /> 대표글
                      </div>
                    )}
                    <Link href={`/blog/${post.id}`}>
                      <div style={{ height: 180, background: "#F0EEE9", overflow: "hidden" }}>
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, opacity: 0.15 }}>📝</div>
                        )}
                      </div>
                    </Link>
                    <div style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        {post.category && <span style={{ fontSize: 11, fontWeight: 700, color: "#1847FF", background: "#EEF2FF", padding: "2px 8px", borderRadius: 100 }}>{post.category}</span>}
                        <span style={{ fontSize: 11, color: "#CCC" }}>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
                      </div>
                      <Link href={`/blog/${post.id}`}>
                        <h3 style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.4, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.title}</h3>
                      </Link>
                      <div style={{ fontSize: 12, color: "#AAA" }}>{post.author?.name || "픽스카"}</div>

                      {/* 관리자 버튼 */}
                      {isAdmin && (
                        <div style={{ display: "flex", gap: 6, marginTop: 10, paddingTop: 10, borderTop: "1px solid #F0EEE9" }}>
                          <button onClick={() => togglePin(post.id, !!post.isPinned)} style={{ border: "none", background: post.isPinned ? "#FFF0ED" : "#F8F7F4", padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: post.isPinned ? "#FF3B1E" : "#AAA", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "'NanumSquareRound',sans-serif" }}>
                            <Pin size={10} /> {post.isPinned ? "해제" : "대표글"}
                          </button>
                          <Link href={`/blog/${post.id}/edit`}>
                            <button style={{ border: "none", background: "#F8F7F4", padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "'NanumSquareRound',sans-serif" }}>
                              <Pencil size={10} /> 수정
                            </button>
                          </Link>
                          <button onClick={() => handleDelete(post.id, post.title)} style={{ border: "none", background: "#FFF0ED", padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#E24B4A", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "'NanumSquareRound',sans-serif" }}>
                            <Trash2 size={10} /> 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
