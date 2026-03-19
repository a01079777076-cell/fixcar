"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

interface Post {
  id: string; title: string; content: string; author: { name?: string };
  createdAt: string; _count?: { comments: number }; likes?: number;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<"all"|"popular"|"new">("all");
  const [showWrite, setShowWrite] = useState(false);
  const [writeForm, setWriteForm] = useState({ title: "", content: "" });

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch("/api/community?tab=" + tab)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        setPosts(Array.isArray(data) ? data : data.posts || []);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
        setError(true);
      });
  }, [tab]);

  const handleSubmit = async () => {
    if (!writeForm.title || !writeForm.content) { alert("제목과 내용을 입력해주세요"); return; }
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(writeForm),
      });
      if (res.ok) {
        setWriteForm({ title: "", content: "" });
        setShowWrite(false);
        setTab("new");
      }
    } catch { alert("작성 중 오류가 발생했어요"); }
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
      `}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "#1A1A1A", padding: "36px 24px 28px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 4, color: "#FF3B1E", marginBottom: 6 }}>COMMUNITY</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", letterSpacing: -1, marginBottom: 4 }}>커뮤니티</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>픽스카 사용자들과 차량 이야기를 나눠보세요</p>
          </div>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px 120px" }}>
          {/* 탭 + 글쓰기 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {([["all","전체"],["popular","인기"],["new","최신"]] as const).map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} style={{
                  padding: "8px 16px", borderRadius: 10, border: "none", fontSize: 13,
                  fontWeight: tab === id ? 800 : 600, cursor: "pointer",
                  background: tab === id ? "#1A1A1A" : "white", color: tab === id ? "white" : "#777",
                  fontFamily: "'NanumSquareRound',sans-serif",
                }}>{label}</button>
              ))}
            </div>
            <button onClick={() => setShowWrite(!showWrite)} style={{
              padding: "8px 18px", background: "#FF3B1E", color: "white", border: "none",
              borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: "pointer",
              fontFamily: "'NanumSquareRound',sans-serif",
            }}>✏️ 글쓰기</button>
          </div>

          {/* 글쓰기 폼 */}
          {showWrite && (
            <div style={{ background: "white", borderRadius: 18, padding: "22px 24px", marginBottom: 16 }}>
              <input type="text" placeholder="제목을 입력하세요" value={writeForm.title}
                onChange={e => setWriteForm(p => ({ ...p, title: e.target.value }))}
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0DDD7", borderRadius: 10, fontSize: 15, fontWeight: 700, marginBottom: 10, fontFamily: "'NanumSquareRound',sans-serif", background: "#FAFAF8" }} />
              <textarea rows={4} placeholder="내용을 작성해주세요" value={writeForm.content}
                onChange={e => setWriteForm(p => ({ ...p, content: e.target.value }))}
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0DDD7", borderRadius: 10, fontSize: 14, resize: "none", fontFamily: "'NanumSquareRound',sans-serif", background: "#FAFAF8" }} />
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={handleSubmit} style={{ flex: 1, padding: "12px", background: "#FF3B1E", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>작성 완료</button>
                <button onClick={() => setShowWrite(false)} style={{ padding: "12px 20px", background: "#F0EEE9", color: "#888", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>취소</button>
              </div>
            </div>
          )}

          {/* 게시글 목록 */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ background: "white", borderRadius: 16, padding: "20px 22px" }}>
                  <div style={{ height: 16, background: "#E8E6E1", borderRadius: 4, width: "60%", marginBottom: 10 }} />
                  <div style={{ height: 12, background: "#E8E6E1", borderRadius: 4, width: "90%" }} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div style={{ background: "white", borderRadius: 18, padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>😢</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>커뮤니티를 불러올 수 없어요</div>
              <p style={{ fontSize: 13, color: "#AAA", fontWeight: 400, marginBottom: 20 }}>잠시 후 다시 시도해 주세요</p>
              <button onClick={() => { setError(false); setLoading(true); setTab("all"); }} style={{
                padding: "12px 24px", background: "#FF3B1E", color: "white", border: "none",
                borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
              }}>다시 시도</button>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ background: "white", borderRadius: 18, padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>아직 게시글이 없어요</div>
              <p style={{ fontSize: 13, color: "#AAA", fontWeight: 400 }}>첫 번째 글을 작성해 보세요!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {posts.map(post => (
                <a key={post.id} href={`/community/${post.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "white", borderRadius: 16, padding: "18px 22px", transition: "all 0.15s", cursor: "pointer" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", marginBottom: 6 }}>{post.title}</div>
                    <p style={{ fontSize: 13, color: "#888", fontWeight: 400, lineHeight: 1.6, marginBottom: 10,
                      overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                      {post.content}
                    </p>
                    <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#CCC", fontWeight: 400 }}>
                      <span>{post.author?.name || "익명"}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
                      <span>💬 {post._count?.comments || 0}</span>
                      {post.likes !== undefined && <span>❤️ {post.likes}</span>}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
