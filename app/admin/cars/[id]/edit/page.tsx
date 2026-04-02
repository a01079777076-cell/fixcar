// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/admin/cars/[id]/edit/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Upload, X, Check, Image as ImageIcon } from "lucide-react";

export default function AdminCarPhotoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (d?.user?.role !== "ADMIN") { router.push("/"); return; }
      loadCar();
    }).catch(() => router.push("/"));
  }, []);

  const loadCar = async () => {
    try {
      const res = await fetch(`/api/admin/cars/${id}`);
      const data = await res.json();
      if (data.error) { alert(data.error); router.push("/admin"); return; }
      setCar(data);
      setImages(data.images || []);
    } catch { alert("매물 로드 실패"); }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      const res = await fetch(`/api/admin/cars/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });
      const data = await res.json();
      if (data.success) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else alert(data.error || "저장 실패");
    } catch { alert("네트워크 오류"); }
    setSaving(false);
  };

  const handleUpload = () => {
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = "image/*"; inp.multiple = true;
    inp.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files; if (!files) return;
      setUploading(true);
      for (const file of Array.from(files)) {
        const fd = new FormData(); fd.append("file", file);
        try { const res = await fetch("/api/upload", { method: "POST", body: fd }); if (!res.ok) continue; const d = await res.json(); if (d.success && d.url) setImages(prev => [...prev, d.url]); } catch {}
      }
      setUploading(false);
    };
    inp.click();
  };

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));
  const moveImage = (idx: number, dir: -1 | 1) => {
    setImages(prev => { const a = [...prev]; const t = idx + dir; if (t < 0 || t >= a.length) return a; [a[idx], a[t]] = [a[t], a[idx]]; return a; });
  };

  if (loading) return <><Navbar /><div style={{ textAlign: "center", padding: 100, color: "#CCC" }}>로딩 중...</div></>;
  if (!car) return <><Navbar /><div style={{ textAlign: "center", padding: 100, color: "#CCC" }}>매물 없음</div></>;

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 24px 100px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#888", textDecoration: "none" }}><ChevronLeft size={14} /> 관리자 패널</Link>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href={`/dealer/cars/new?edit=${id}`} style={{ padding: "10px 16px", background: "#EEF5FF", borderRadius: 10, fontSize: 12, fontWeight: 700, color: "#0066FF", textDecoration: "none" }}>전체 수정 →</Link>
              <button onClick={handleSave} disabled={saving} style={{ padding: "10px 20px", background: saving ? "#CCC" : saved ? "#2D8A52" : "#FF3B1E", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'NanumSquareRound',sans-serif" }}>
                {saved ? <><Check size={14} /> 저장 완료!</> : <><Save size={14} /> {saving ? "저장 중..." : "사진 저장"}</>}
              </button>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: 20, padding: "32px 30px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>📷 사진 등록 — #{id}</h1>
            <div style={{ fontSize: 14, color: "#555", marginBottom: 6 }}>{car.brand} {car.name} · {car.price?.toLocaleString()}만원</div>
            <div style={{ fontSize: 12, color: "#AAA", marginBottom: 24 }}>딜러: {car.dealer?.user?.name || car.dealer?.shopName || "미지정"} · 상태: {car.status}</div>

            {/* 업로드 */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
              <button onClick={handleUpload} disabled={uploading} style={{ padding: "14px 24px", background: uploading ? "#CCC" : "#0066FF", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: uploading ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "'NanumSquareRound',sans-serif" }}>
                <Upload size={16} /> {uploading ? "업로드 중..." : "사진 추가 (여러장 가능)"}
              </button>
              <span style={{ fontSize: 12, color: "#AAA" }}>현재 {images.length}장 | 순서: ①전면좌측 ②후면우측 ③정면 ④후면 ⑤실내 ⑥~디테일</span>
            </div>

            {/* 사진 그리드 */}
            {images.length === 0 ? (
              <div style={{ background: "#F8F7F4", borderRadius: 14, padding: "60px 20px", textAlign: "center", color: "#CCC", marginBottom: 24 }}>
                <ImageIcon size={40} style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 16, fontWeight: 700 }}>등록된 사진이 없습니다</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>엑셀로 등록된 매물의 사진을 여기서 추가하세요</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
                {images.map((url, i) => (
                  <div key={i} style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: i < 5 ? "2px solid #0066FF" : "1px solid #E0DDD7" }}>
                    <img src={url.split("#")[0]} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", top: 6, left: 6, background: i < 5 ? "#0066FF" : "rgba(0,0,0,0.6)", color: "white", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 6 }}>
                      {["①전면좌측", "②후면우측", "③정면", "④후면", "⑤실내"][i] || `디테일${i - 4}`}
                    </div>
                    <div style={{ position: "absolute", top: 6, right: 6, display: "flex", gap: 3 }}>
                      {i > 0 && <button onClick={() => moveImage(i, -1)} style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(0,0,0,0.6)", color: "white", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>}
                      {i < images.length - 1 && <button onClick={() => moveImage(i, 1)} style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(0,0,0,0.6)", color: "white", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>}
                      <button onClick={() => removeImage(i)} style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(220,50,50,0.8)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 매물 미리보기 */}
            {images.length > 0 && (
              <div style={{ background: "#F8F7F4", borderRadius: 16, padding: "20px 22px", marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#888", marginBottom: 12 }}>👁️ 전체매물에서 보여질 예시</div>
                <div style={{ background: "white", borderRadius: 14, padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start", border: "1px solid #E8E6E1" }}>
                  <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                    <div style={{ width: 140, height: 100, borderRadius: 10, overflow: "hidden", background: "#F0EEE9" }}>
                      {images[0] ? <img src={images[0].split("#")[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#CCC" }}>📷</div>}
                    </div>
                    <div style={{ width: 140, height: 100, borderRadius: 10, overflow: "hidden", background: "#F0EEE9" }}>
                      {(images[4] || images[1]) ? <img src={(images[4] || images[1]).split("#")[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#CCC" }}>📷</div>}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{car.brand} {car.name}</div>
                    <div style={{ fontSize: 12, color: "#AAA" }}>{car.year}년식 · {car.mileage?.toLocaleString()}km · {car.fuel} · {car.region}</div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#FF3B1E", flexShrink: 0 }}>{car.price?.toLocaleString()}<span style={{ fontSize: 11, color: "#AAA" }}>만원</span></div>
                </div>
              </div>
            )}

            <button onClick={handleSave} disabled={saving} style={{ width: "100%", padding: "18px", background: saving ? "#CCC" : saved ? "#2D8A52" : "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'NanumSquareRound',sans-serif" }}>
              {saved ? <><Check size={18} /> 저장 완료!</> : <><Save size={18} /> {saving ? "저장 중..." : "사진 저장하기"}</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
