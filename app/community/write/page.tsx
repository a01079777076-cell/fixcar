"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Send, X } from "lucide-react";

const CATEGORIES = ["자유게시판", "차량 후기", "질문/답변", "정보 공유", "모임/동호회"];

export default function CommunityWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("자유게시판");
  const [saving, setSaving] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  /* 닉네임 */
  const [nickname, setNickname] = useState<string | null>(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [nicknameSaving, setNicknameSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (d?.user?.id) {
        setLoggedIn(true);
        /* 닉네임 확인 */
        fetch("/api/user/nickname").then(r => r.json()).then(n => {
          if (n.nickname) setNickname(n.nickname);
          else setShowNicknameModal(true);
        }).catch(() => setShowNicknameModal(true));
      } else router.push("/login");
    }).catch(() => router.push("/login"));
  }, [router]);

  const handleNicknameSave = async () => {
    const cleaned = nicknameInput.trim();
    if (cleaned.length < 2 || cleaned.length > 12) { setNicknameError("닉네임은 2~12자여야 합니다"); return; }
    setNicknameSaving(true);
    setNicknameError("");
    try {
      const res = await fetch("/api/user/nickname", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: cleaned }),
      });
      const data = await res.json();
      if (data.success) {
        setNickname(data.nickname);
        setShowNicknameModal(false);
      } else setNicknameError(data.error || "설정 실패");
    } catch { setNicknameError("네트워크 오류"); }
    setNicknameSaving(false);
  };

  const handleSubmit = async () => {
    if (!nickname) { setShowNicknameModal(true); return; }
    if (!title.trim()) { alert("제목을 입력해주세요"); return; }
    if (!content.trim()) { alert("내용을 입력해주세요"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/community", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category }),
      });
      const data = await res.json();
      if (data.success) router.push("/community");
      else alert("작성 실패: " + (data.error || ""));
    } catch { alert("네트워크 오류"); }
    setSaving(false);
  };

  if (!loggedIn) return <><Navbar /><div style={{ textAlign: "center", padding: 100, color: "#CCC" }}>로딩 중...</div></>;

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus,textarea:focus,select:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 24px 100px" }}>
          <Link href="/community" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 16, textDecoration: "none" }}><ChevronLeft size={14} />목록</Link>

          <div style={{ background: "white", borderRadius: 20, padding: "32px 30px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>✏️ 글 작성</h1>

            {/* 닉네임 표시 */}
            {nickname && (
              <div style={{ fontSize: 13, color: "#888", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                작성자: <span style={{ fontWeight: 800, color: "#1A1A1A" }}>{nickname}</span>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 800, display: "block", marginBottom: 6 }}>카테고리 <span style={{ color: "#FF3B1E" }}>*</span></label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0DDD7", borderRadius: 10, fontSize: 14, fontFamily: "'NanumSquareRound',sans-serif", background: "white" }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 800, display: "block", marginBottom: 6 }}>제목 <span style={{ color: "#FF3B1E" }}>*</span></label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목을 입력하세요" maxLength={200} style={{ width: "100%", padding: "14px 16px", border: "1.5px solid #E0DDD7", borderRadius: 12, fontSize: 16, fontWeight: 700, fontFamily: "'NanumSquareRound',sans-serif" }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 800, display: "block", marginBottom: 6 }}>내용 <span style={{ color: "#FF3B1E" }}>*</span></label>
              <textarea rows={12} value={content} onChange={e => setContent(e.target.value)} placeholder="자유롭게 작성해주세요" maxLength={5000} style={{ width: "100%", padding: "14px 16px", border: "1.5px solid #E0DDD7", borderRadius: 12, fontSize: 15, fontFamily: "'NanumSquareRound',sans-serif", resize: "none", lineHeight: 1.8 }} />
            </div>

            <button onClick={handleSubmit} disabled={saving} style={{ width: "100%", padding: "16px", background: saving ? "#CCC" : "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'NanumSquareRound',sans-serif" }}>
              <Send size={18} /> {saving ? "작성 중..." : "글 작성하기"}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ 닉네임 설정 모달 ═══ */}
      {showNicknameModal && (
        <>
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 10000 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "white", borderRadius: 24, padding: "32px 28px", width: "min(400px,90vw)", zIndex: 10001, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🏷️</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>닉네임을 설정해주세요</h2>
              <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7 }}>커뮤니티에서 사용할 닉네임이에요<br />설정 후 15일간 변경할 수 없어요</p>
            </div>
            <input value={nicknameInput} onChange={e => setNicknameInput(e.target.value)} placeholder="2~12자 닉네임" maxLength={12} style={{ width: "100%", padding: "14px 16px", border: "1.5px solid #E0DDD7", borderRadius: 12, fontSize: 16, fontWeight: 700, fontFamily: "'NanumSquareRound',sans-serif", textAlign: "center", marginBottom: 8 }} />
            {nicknameError && <div style={{ fontSize: 12, color: "#E24B4A", textAlign: "center", marginBottom: 8 }}>{nicknameError}</div>}
            <div style={{ fontSize: 11, color: "#CCC", textAlign: "center", marginBottom: 16 }}>{nicknameInput.length}/12자</div>
            <button onClick={handleNicknameSave} disabled={nicknameSaving} style={{ width: "100%", padding: "16px", background: "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>
              {nicknameSaving ? "설정 중..." : "닉네임 설정하기"}
            </button>
          </div>
        </>
      )}
    </>
  );
}
