// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/blog/write/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BlogEditor from "@/components/BlogEditor";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Send, X, Image as ImageIcon } from "lucide-react";

export default function BlogWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("구매 가이드");
  const [thumbnail, setThumbnail] = useState("");
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (d?.user?.role !== "ADMIN") router.push("/blog");
    }).catch(() => router.push("/blog"));
  }, [router]);

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
          if (d.success && d.url) {
            setPhotos(prev => [...prev, d.url]);
            if (!thumbnail) setThumbnail(d.url);
          }
        } catch {}
      }
      setUploading(false);
    };
    inp.click();
  };

  const removePhoto = (idx: number) => {
    setPhotos(prev => {
      const next = prev.filter((_, i) => i !== idx);
      if (thumbnail === prev[idx]) setThumbnail(next[0] || "");
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!title.trim()) { alert("제목을 입력해주세요"); return; }
    setSaving(true);
    /* 사진을 본문 하단에 추가 */
    const photoHtml = photos.map(url => `<img src="${url}" style="max-width:100%;border-radius:8px;margin:8px 0;" />`).join("");
    const fullContent = content + (photoHtml ? `\n${photoHtml}` : "");
    try {
      const res = await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, content: fullContent, category, thumbnail }) });
      const data = await res.json();
      if (data.success) { alert("글이 등록되었습니다!"); router.push("/blog"); }
      else alert("등록 실패: " + (data.error || ""));
    } catch { alert("네트워크 오류"); }
    setSaving(false);
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus,select:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 24px 100px" }}>
          <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 20, textDecoration: "none" }}><ChevronLeft size={14} />유용한 정보</Link>
          <div style={{ background: "white", borderRadius: 20, padding: "32px 30px" }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>✏️ 유용한 정보 글쓰기</h1>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 800, display: "block", marginBottom: 8 }}>카테고리</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0DDD7", borderRadius: 10, fontSize: 14, fontFamily: "'NanumSquareRound',sans-serif", background: "white" }}>
                {["구매 가이드", "차량 관리", "소모품/꿀템", "보험/금융", "초보 운전", "뉴스/이벤트", "지역 정보", "시장 분석"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 800, display: "block", marginBottom: 8 }}>제목</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="글 제목을 입력하세요" style={{ width: "100%", padding: "14px 16px", border: "1.5px solid #E0DDD7", borderRadius: 12, fontSize: 16, fontWeight: 700, fontFamily: "'NanumSquareRound',sans-serif" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 800, display: "block", marginBottom: 8 }}>내용</label>
              <BlogEditor value={content} onChange={setContent} onImageUpload={url => { if (!thumbnail) setThumbnail(url); }} />
            </div>

            {/* 사진 업로드 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 800 }}>사진 첨부 (최대 5장)</label>
                <button onClick={handlePhotoUpload} disabled={uploading || photos.length >= 5} style={{ padding: "8px 16px", background: photos.length >= 5 ? "#EEE" : "#0066FF", color: photos.length >= 5 ? "#AAA" : "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: photos.length >= 5 ? "default" : "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'NanumSquareRound',sans-serif" }}>
                  <ImageIcon size={13} /> {uploading ? "업로드중..." : `사진 추가 (${photos.length}/5)`}
                </button>
              </div>
              {photos.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {photos.map((url, i) => (
                    <div key={i} style={{ position: "relative", width: 120, height: 90, borderRadius: 10, overflow: "hidden" }}>
                      <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button onClick={() => removePhoto(i)} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={12} /></button>
                      {thumbnail === url && <div style={{ position: "absolute", bottom: 4, left: 4, background: "#FF3B1E", color: "white", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4 }}>대표</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={handleSubmit} disabled={saving} style={{ width: "100%", padding: "16px", background: saving ? "#CCC" : "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'NanumSquareRound',sans-serif" }}><Send size={18} />{saving ? "등록 중..." : "글 등록하기"}</button>
          </div>
        </div>
      </div>
    </>
  );
}
