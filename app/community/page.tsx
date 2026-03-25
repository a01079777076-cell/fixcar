"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Pencil, Flag, X } from "lucide-react";

interface Post {
  id: number; title: string; category: string; views: number; likes: number;
  createdAt: string; author: { name: string; nickname?: string };
  _count?: { comments: number };
}

const TABS = ["전체글", "인기글", "공지"];
const CATEGORIES = ["전체", "자유게시판", "차량 후기", "질문/답변", "정보 공유", "모임/동호회"];
const REPORT_CATEGORIES = ["허위정보", "광고/홍보", "욕설/비방", "사기/스캠", "음란물", "저작권침해", "기타"];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("전체글");
  const [category, setCategory] = useState("전체");
  const [page, setPage] = useState(1);
  const perPage = 30;

  /* 신고 모달 */
  const [reportModal, setReportModal] = useState<{ postId: number; title: string } | null>(null);
  const [reportCategory, setReportCategory] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/community?limit=200").then(r => r.json()).then(d => {
      const arr = Array.isArray(d) ? d : d.data || d.posts || [];
      setPosts(arr);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  let filtered = [...posts];
  if (category !== "전체") filtered = filtered.filter(p => p.category === category);
  if (tab === "인기글") filtered = filtered.filter(p => p.likes >= 5 || p.views >= 100);
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  const handleReport = async () => {
    if (!reportCategory) { alert("신고 카테고리를 선택해주세요"); return; }
    setReportSubmitting(true);
    try {
      const res = await fetch("/api/community/report", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: reportModal?.postId, category: reportCategory, reason: reportReason }),
      });
      const data = await res.json();
      if (data.success) { alert("신고가 접수되었습니다. 관리자가 검토 후 조치합니다."); setReportModal(null); setReportCategory(""); setReportReason(""); }
      else alert(data.error || "신고 실패");
    } catch { alert("네트워크 오류"); }
    setReportSubmitting(false);
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} .row:hover{background:#FAFAF8;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "#1A1A1A", padding: "36px 24px 28px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Bebas Neue',serif", fontSize: 12, letterSpacing: 4, color: "#FF3B1E", marginBottom: 6 }}>FIXCAR COMMUNITY</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white" }}>커뮤니티</h1>
          </div>
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 16px 100px" }}>
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

          <div style={{ background: "white", borderRadius: 14, overflow: "hidden", border: "1px solid #E8E6E1" }}>
            <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 90px 70px 50px 50px 36px", padding: "10px 16px", background: "#F8F7F4", fontSize: 11, fontWeight: 800, color: "#AAA", borderBottom: "1px solid #E8E6E1" }}>
              <span>번호</span><span>제목</span><span>글쓴이</span><span>작성일</span><span>조회</span><span>추천</span><span></span>
            </div>

            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "#CCC" }}>로딩 중...</div>
            ) : paginated.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#CCC" }}>게시글이 없어요</div>
            ) : (
              paginated.map(post => {
                const commentCount = post._count?.comments || 0;
                return (
                  <div key={post.id} className="row" style={{ display: "grid", gridTemplateColumns: "50px 1fr 90px 70px 50px 50px 36px", padding: "11px 16px", borderBottom: "1px solid #F0EEE9", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#CCC" }}>{post.id}</span>
                    <Link href={`/community/${post.id}`}>
                      <div style={{ cursor: "pointer" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{post.title}</span>
                        {commentCount > 0 && <span style={{ fontSize: 11, fontWeight: 800, color: "#FF3B1E", marginLeft: 6 }}>[{commentCount}]</span>}
                        {post.category !== "자유게시판" && <span style={{ fontSize: 10, color: "#1847FF", background: "#EEF2FF", padding: "1px 6px", borderRadius: 4, marginLeft: 6, fontWeight: 600 }}>{post.category}</span>}
                      </div>
                    </Link>
                    <span style={{ fontSize: 12, color: "#888" }}>{post.author?.nickname || post.author?.name || "익명"}</span>
                    <span style={{ fontSize: 11, color: "#CCC" }}>{formatDate(post.createdAt)}</span>
                    <span style={{ fontSize: 12, color: "#AAA" }}>{post.views}</span>
                    <span style={{ fontSize: 12, color: post.likes > 0 ? "#FF3B1E" : "#CCC", fontWeight: post.likes > 0 ? 700 : 400 }}>{post.likes}</span>
                    <button onClick={(e) => { e.preventDefault(); setReportModal({ postId: post.id, title: post.title }); }} title="신고" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Flag size={12} color="#CCC" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

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

      {/* ═══ 신고 모달 ═══ */}
      {reportModal && (
        <>
          <div onClick={() => setReportModal(null)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 10000 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "white", borderRadius: 20, padding: "28px", width: "90%", maxWidth: 420, zIndex: 10001, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
                <Flag size={18} color="#E24B4A" /> 게시글 신고
              </h3>
              <button onClick={() => setReportModal(null)} style={{ border: "none", background: "transparent", cursor: "pointer" }}><X size={20} color="#AAA" /></button>
            </div>

            <div style={{ background: "#F8F7F4", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#888" }}>
              "{reportModal.title}"
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>신고 사유 선택 <span style={{ color: "#FF3B1E" }}>*</span></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {REPORT_CATEGORIES.map(c => (
                  <button key={c} onClick={() => setReportCategory(c)} style={{
                    padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: reportCategory === c ? 800 : 500,
                    border: reportCategory === c ? "2px solid #E24B4A" : "1.5px solid #E0DDD7",
                    background: reportCategory === c ? "#FFF0ED" : "white", color: reportCategory === c ? "#E24B4A" : "#888",
                    cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
                  }}>{c}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>상세 사유 (선택)</div>
              <textarea value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="구체적인 신고 사유를 작성해주세요" rows={3} maxLength={500} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E0DDD7", fontSize: 13, fontFamily: "'NanumSquareRound',sans-serif", resize: "none" }} />
            </div>

            <button onClick={handleReport} disabled={reportSubmitting} style={{
              width: "100%", padding: "14px", background: reportSubmitting ? "#CCC" : "#E24B4A", color: "white",
              border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: reportSubmitting ? "wait" : "pointer",
              fontFamily: "'NanumSquareRound',sans-serif",
            }}>{reportSubmitting ? "처리 중..." : "신고 접수"}</button>

            <div style={{ fontSize: 11, color: "#CCC", textAlign: "center", marginTop: 10, lineHeight: 1.6 }}>
              허위 신고 시 이용이 제한될 수 있습니다
            </div>
          </div>
        </>
      )}
    </>
  );
}
