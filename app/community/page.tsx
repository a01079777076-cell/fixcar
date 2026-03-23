"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Pencil, Eye, MessageSquare, ThumbsUp } from "lucide-react";

interface Post {
  id: number; title: string; category: string; views: number; likes: number;
  createdAt: string; author: { name: string; nickname?: string };
  _count?: { comments: number };
}

const TABS = ["전체글", "인기글", "공지"];
const CATEGORIES = ["전체", "자유게시판", "차량 후기", "질문/답변", "정보 공유", "모임/동호회"];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("전체글");
  const [category, setCategory] = useState("전체");
  const [page, setPage] = useState(1);
  const perPage = 30;

  useEffect(() => {
    fetch("/api/community?limit=200").then(r => r.json()).then(d => {
      const arr = Array.isArray(d) ? d : d.data || d.posts || [];
      setPosts(arr);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  /* 필터링 */
  let filtered = [...posts];
  if (category !== "전체") filtered = filtered.filter(p => p.category === category);
  if (tab === "인기글") filtered = filtered.filter(p => p.likes >= 5 || p.views >= 100);

  /* 정렬: 최신순 */
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  /* 페이지네이션 */
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const formatDate = (d: string) => {
    const date = new Date(d);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }
    return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} table{width:100%;border-collapse:collapse;} .row:hover{background:#FAFAF8;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        {/* 헤더 */}
        <div style={{ background: "#1A1A1A", padding: "36px 24px 28px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Bebas Neue',serif", fontSize: 12, letterSpacing: 4, color: "#FF3B1E", marginBottom: 6 }}>FIXCAR COMMUNITY</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white" }}>커뮤니티</h1>
          </div>
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 16px 100px" }}>
          {/* 탭 + 글쓰기 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 0, background: "white", borderRadius: 10, overflow: "hidden", border: "1.5px solid #E0DDD7" }}>
              {TABS.map(t => (
                <button key={t} onClick={() => { setTab(t); setPage(1); }} style={{
                  padding: "10px 20px", border: "none", fontSize: 13, fontWeight: tab === t ? 800 : 500,
                  background: tab === t ? "#FF3B1E" : "white", color: tab === t ? "white" : "#888",
                  cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
                }}>{t}</button>
              ))}
            </div>
            <Link href="/community/write">
              <button style={{ padding: "10px 20px", background: "#1847FF", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>
                <Pencil size={14} /> 글쓰기
              </button>
            </Link>
          </div>

          {/* 카테고리 필터 */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto" }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => { setCategory(c); setPage(1); }} style={{
                padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: category === c ? 800 : 500, whiteSpace: "nowrap",
                border: category === c ? "1.5px solid #FF3B1E" : "1px solid #E0DDD7",
                background: category === c ? "#FFF0ED" : "white", color: category === c ? "#FF3B1E" : "#AAA",
                cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
              }}>{c}</button>
            ))}
          </div>

          {/* 테이블 */}
          <div style={{ background: "white", borderRadius: 14, overflow: "hidden", border: "1px solid #E8E6E1" }}>
            {/* 헤더 */}
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 80px 60px 60px", padding: "10px 16px", background: "#F8F7F4", fontSize: 11, fontWeight: 800, color: "#AAA", borderBottom: "1px solid #E8E6E1" }}>
              <span>번호</span><span>제목</span><span>글쓴이</span><span>작성일</span><span>조회</span><span>추천</span>
            </div>

            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "#CCC" }}>로딩 중...</div>
            ) : paginated.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#CCC" }}>게시글이 없어요</div>
            ) : (
              paginated.map(post => {
                const commentCount = post._count?.comments || 0;
                return (
                  <Link key={post.id} href={`/community/${post.id}`}>
                    <div className="row" style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 80px 60px 60px", padding: "11px 16px", borderBottom: "1px solid #F0EEE9", alignItems: "center", cursor: "pointer" }}>
                      <span style={{ fontSize: 12, color: "#CCC" }}>{post.id}</span>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{post.title}</span>
                        {commentCount > 0 && <span style={{ fontSize: 11, fontWeight: 800, color: "#FF3B1E", marginLeft: 6 }}>[{commentCount}]</span>}
                        {post.category !== "자유게시판" && <span style={{ fontSize: 10, color: "#1847FF", background: "#EEF2FF", padding: "1px 6px", borderRadius: 4, marginLeft: 6, fontWeight: 600 }}>{post.category}</span>}
                      </div>
                      <span style={{ fontSize: 12, color: "#888" }}>{post.author?.nickname || post.author?.name || "익명"}</span>
                      <span style={{ fontSize: 11, color: "#CCC" }}>{formatDate(post.createdAt)}</span>
                      <span style={{ fontSize: 12, color: "#AAA" }}>{post.views}</span>
                      <span style={{ fontSize: 12, color: post.likes > 0 ? "#FF3B1E" : "#CCC", fontWeight: post.likes > 0 ? 700 : 400 }}>{post.likes}</span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 16 }}>
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} style={{
                  width: 32, height: 32, borderRadius: 8, border: "none", fontSize: 12, fontWeight: page === p ? 800 : 500,
                  background: page === p ? "#FF3B1E" : "white", color: page === p ? "white" : "#888",
                  cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
                }}>{p}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
