"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BlogEditor from "@/components/BlogEditor";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";

export default function BlogEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("구매 가이드");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    /* ADMIN 확인 */
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (d?.user?.role !== "ADMIN") { router.push("/blog"); return; }
    }).catch(() => router.push("/blog"));

    /* 글 불러오기 */
    fetch(`/api/blog/${id}`).then(r => r.json()).then(d => {
      if (d.title) {
        setTitle(d.title);
        setContent(d.content || "");
        setCategory(d.category || "구매 가이드");
        setThumbnail(d.summary || "");
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, router]);

  const handleSave = async () => {
    if (!title.trim()) { alert("제목을 입력해주세요"); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, summary: thumbnail }),
      });
      const data = await res.json();
      if (data.success) { alert("수정 완료!"); router.push(`/blog/${id}`); }
      else alert("수정 실패: " + (data.error || ""));
    } catch { alert("네트워크 오류"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("정말 이 글을 삭제할까요? 되돌릴 수 없어요.")) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { alert("삭제 완료"); router.push("/blog"); }
      else alert("삭제 실패");
    } catch { alert("네트워크 오류"); }
  };

  if (loading) return <><Navbar /><div style={{ textAlign: "center", padding: 100, color: "#CCC" }}>로딩 중...</div></>;

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus,select:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 24px 100px" }}>
          <Link href={`/blog/${id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 20, textDecoration: "none" }}><ChevronLeft size={14} />글로 돌아가기</Link>

          <div style={{ background: "white", borderRadius: 20, padding: "32px 30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800 }}>유용한 정보 수정</h1>
              <button onClick={handleDelete} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#FFF0ED", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, color: "#E24B4A", cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>
                <Trash2 size={14} /> 삭제
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 800, display: "block", marginBottom: 8 }}>카테고리</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0DDD7", borderRadius: 10, fontSize: 14, fontFamily: "'NanumSquareRound',sans-serif", background: "white" }}>
                {["구매 가이드", "차량 관리", "소모품/꿀템", "보험/금융", "초보 운전", "뉴스/이벤트"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 800, display: "block", marginBottom: 8 }}>제목</label>
              <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%", padding: "14px 16px", border: "1.5px solid #E0DDD7", borderRadius: 12, fontSize: 16, fontWeight: 700, fontFamily: "'NanumSquareRound',sans-serif" }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 800, display: "block", marginBottom: 8 }}>내용</label>
              <BlogEditor value={content} onChange={setContent} />
            </div>

            <button onClick={handleSave} disabled={saving} style={{ width: "100%", padding: "16px", background: saving ? "#CCC" : "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'NanumSquareRound',sans-serif" }}>
              <Save size={18} /> {saving ? "저장 중..." : "수정 완료"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
