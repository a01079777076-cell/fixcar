// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/community/write/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Send, X, Bold, Italic, Underline, List, Image as ImageIcon, Type, Palette } from "lucide-react";
import { checkContent, checkUrls } from "@/lib/contentFilter";

const CATEGORIES = ["자유게시판", "차량 후기", "질문/답변", "정보 공유", "모임/동호회"];
const FONT_SIZES = ["13px", "15px", "17px", "20px", "24px"];
const COLORS = ["#1A1A1A", "#FF3B1E", "#0066FF", "#2D8A52", "#E8A020", "#8B5CF6", "#888888"];

export default function CommunityWritePage() {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("자유게시판");
  const [saving, setSaving] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showColor, setShowColor] = useState(false);

  const [nickname, setNickname] = useState<string | null>(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [nicknameSaving, setNicknameSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (d?.user?.id) {
        setLoggedIn(true);
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
    setNicknameSaving(true); setNicknameError("");
    try {
      const res = await fetch("/api/user/nickname", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nickname: cleaned }) });
      const data = await res.json();
      if (data.success) { setNickname(data.nickname); setShowNicknameModal(false); }
      else setNicknameError(data.error || "설정 실패");
    } catch { setNicknameError("네트워크 오류"); }
    setNicknameSaving(false);
  };

  /* 에디터 명령 */
  const exec = (cmd: string, val?: string) => { document.execCommand(cmd, false, val); editorRef.current?.focus(); };

  /* 사진 업로드 (최대 5장) */
  const handlePhotoUpload = () => {
    if (photos.length >= 5) { alert("사진은 최대 5장까지 첨부 가능합니다."); return; }
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = "image/*"; inp.multiple = true;
    inp.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;
      setUploading(true);
      const remaining = 5 - photos.length;
      for (const file of Array.from(files).slice(0, remaining)) {
        const fd = new FormData(); fd.append("file", file);
        try {
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          if (!res.ok) continue;
          const d = await res.json();
          if (d.success && d.url) setPhotos(prev => [...prev, d.url]);
        } catch {}
      }
      setUploading(false);
    };
    inp.click();
  };

  const removePhoto = (idx: number) => setPhotos(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!nickname) { setShowNicknameModal(true); return; }
    if (!title.trim()) { alert("제목을 입력해주세요"); return; }
    const html = editorRef.current?.innerHTML || "";
    const plainText = html.replace(/<[^>]*>/g, "");
    if (!plainText.trim()) { alert("내용을 입력해주세요"); return; }
    /* 유해 콘텐츠 검사 */
    const titleCheck = checkContent(title);
    const contentCheck = checkContent(plainText);
    const urlCheck = checkUrls(plainText);
    if (titleCheck.blocked || contentCheck.blocked || urlCheck.length > 0) {
      const allMatches = [...titleCheck.matches, ...contentCheck.matches, ...urlCheck];
      alert(`⚠️ 부적절한 내용이 감지되었습니다.\n\n감지된 항목: ${allMatches.slice(0,3).join(", ")}${allMatches.length>3?" 외 "+(allMatches.length-3)+"건":""}\n\n해당 내용은 관리자 검토 후 게시됩니다.\n반복 시 계정 제재가 적용될 수 있습니다.`);
      return;
    }
    /* 사진을 본문 하단에 추가 */
    const photoHtml = photos.map(url => `<img src="${url}" style="max-width:100%;border-radius:8px;margin:8px 0;" />`).join("");
    const fullContent = html + (photoHtml ? `<div style="margin-top:16px;">${photoHtml}</div>` : "");
    setSaving(true);
    try {
      const res = await fetch("/api/community", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, content: fullContent, category }) });
      const data = await res.json();
      if (data.success) router.push("/community");
      else alert("작성 실패: " + (data.error || ""));
    } catch { alert("네트워크 오류"); }
    setSaving(false);
  };

  if (!loggedIn) return <><Navbar /><div style={{ textAlign: "center", padding: 100, color: "#CCC" }}>로딩 중...</div></>;

  const tbtn: React.CSSProperties = { width: 36, height: 36, borderRadius: 8, border: "1px solid #E8E5E0", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#555", fontFamily: "'NanumSquareRound',sans-serif" };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus,select:focus{outline:none;border-color:#FF3B1E!important;} [contenteditable]:focus{outline:none;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 24px 100px" }}>
          <Link href="/community" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 16, textDecoration: "none" }}><ChevronLeft size={14} />목록</Link>

          <div style={{ background: "white", borderRadius: 20, padding: "32px 30px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>✏️ 커뮤니티 글 작성</h1>

            {nickname && <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>작성자: <span style={{ fontWeight: 800, color: "#1A1A1A" }}>{nickname}</span></div>}

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

            {/* ── 서식 도구 모음 ── */}
            <label style={{ fontSize: 13, fontWeight: 800, display: "block", marginBottom: 6 }}>내용 <span style={{ color: "#FF3B1E" }}>*</span></label>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", padding: "8px 12px", background: "#FAFAF8", border: "1.5px solid #E0DDD7", borderBottom: "none", borderRadius: "12px 12px 0 0", position: "relative" }}>
              <button onClick={() => exec("bold")} style={tbtn} title="굵게"><Bold size={15} /></button>
              <button onClick={() => exec("italic")} style={tbtn} title="기울임"><Italic size={15} /></button>
              <button onClick={() => exec("underline")} style={tbtn} title="밑줄"><Underline size={15} /></button>
              <div style={{ width: 1, background: "#E0DDD7", margin: "4px 4px" }} />
              <div style={{ position: "relative" }}>
                <button onClick={() => { setShowFontSize(!showFontSize); setShowColor(false); }} style={tbtn} title="글자 크기"><Type size={15} /></button>
                {showFontSize && <div style={{ position: "absolute", top: "100%", left: 0, background: "white", border: "1px solid #E0DDD7", borderRadius: 10, padding: 6, zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: 2 }}>
                  {FONT_SIZES.map(s => <button key={s} onClick={() => { exec("fontSize", "7"); const els = editorRef.current?.querySelectorAll('font[size="7"]'); els?.forEach(el => { (el as HTMLElement).removeAttribute("size"); (el as HTMLElement).style.fontSize = s; }); setShowFontSize(false); }} style={{ padding: "6px 16px", border: "none", background: "none", cursor: "pointer", fontSize: s, fontFamily: "'NanumSquareRound',sans-serif", textAlign: "left", borderRadius: 6, whiteSpace: "nowrap" }} onMouseOver={e => (e.currentTarget.style.background = "#F0EEE9")} onMouseOut={e => (e.currentTarget.style.background = "none")}>{s.replace("px", "")}pt</button>)}
                </div>}
              </div>
              <div style={{ position: "relative" }}>
                <button onClick={() => { setShowColor(!showColor); setShowFontSize(false); }} style={tbtn} title="글자 색상"><Palette size={15} /></button>
                {showColor && <div style={{ position: "absolute", top: "100%", left: 0, background: "white", border: "1px solid #E0DDD7", borderRadius: 10, padding: 8, zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", gap: 4 }}>
                  {COLORS.map(c => <button key={c} onClick={() => { exec("foreColor", c); setShowColor(false); }} style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #E8E5E0", background: c, cursor: "pointer" }} />)}
                </div>}
              </div>
              <div style={{ width: 1, background: "#E0DDD7", margin: "4px 4px" }} />
              <button onClick={() => exec("insertUnorderedList")} style={tbtn} title="목록"><List size={15} /></button>
              <button onClick={handlePhotoUpload} disabled={uploading || photos.length >= 5} style={{ ...tbtn, gap: 4, width: "auto", padding: "0 12px", fontSize: 12, fontWeight: 700, color: photos.length >= 5 ? "#CCC" : "#0066FF", borderColor: photos.length >= 5 ? "#EEE" : "#DDEEFF" }} title="사진 첨부">
                <ImageIcon size={14} /> {uploading ? "업로드중..." : `사진 (${photos.length}/5)`}
              </button>
            </div>

            {/* ── 에디터 ── */}
            <div ref={editorRef} contentEditable suppressContentEditableWarning style={{ minHeight: 300, padding: "16px 18px", border: "1.5px solid #E0DDD7", borderTop: "none", borderRadius: "0 0 12px 12px", fontSize: 15, lineHeight: 1.8, fontFamily: "'NanumSquareRound',sans-serif", background: "white" }} />

            {/* ── 사진 미리보기 ── */}
            {photos.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 8 }}>첨부 사진 ({photos.length}/5장)</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {photos.map((url, i) => (
                    <div key={i} style={{ position: "relative", width: 100, height: 75, borderRadius: 10, overflow: "hidden" }}>
                      <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button onClick={() => removePhoto(i)} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleSubmit} disabled={saving} style={{ width: "100%", marginTop: 24, padding: "16px", background: saving ? "#CCC" : "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'NanumSquareRound',sans-serif" }}>
              <Send size={18} /> {saving ? "작성 중..." : "글 작성하기"}
            </button>
          </div>
        </div>
      </div>

      {/* 닉네임 모달 */}
      {showNicknameModal && <>
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 10000 }} />
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "white", borderRadius: 24, padding: "32px 28px", width: "min(400px,90vw)", zIndex: 10001, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏷️</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>닉네임을 설정해주세요</h2>
            <p style={{ fontSize: 13, color: "#AAA", lineHeight: 1.7 }}>커뮤니티에서 사용할 닉네임이에요<br />설정 후 15일간 변경할 수 없어요</p>
          </div>
          <input value={nicknameInput} onChange={e => setNicknameInput(e.target.value)} placeholder="2~12자 닉네임" maxLength={12} style={{ width: "100%", padding: "14px 16px", border: "1.5px solid #E0DDD7", borderRadius: 12, fontSize: 16, fontWeight: 700, fontFamily: "'NanumSquareRound',sans-serif", textAlign: "center", marginBottom: 8 }} />
          {nicknameError && <div style={{ fontSize: 12, color: "#E24B4A", textAlign: "center", marginBottom: 8 }}>{nicknameError}</div>}
          <div style={{ fontSize: 11, color: "#CCC", textAlign: "center", marginBottom: 16 }}>{nicknameInput.length}/12자</div>
          <button onClick={handleNicknameSave} disabled={nicknameSaving} style={{ width: "100%", padding: "16px", background: "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>{nicknameSaving ? "설정 중..." : "닉네임 설정하기"}</button>
        </div>
      </>}
    </>
  );
}
