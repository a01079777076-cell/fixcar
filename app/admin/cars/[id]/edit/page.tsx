// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/admin/cars/[id]/edit/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Upload, X, Image as ImageIcon, Check } from "lucide-react";

const FUELS = ["가솔린", "디젤", "LPG", "하이브리드", "전기"];
const TRANS = ["오토", "수동", "세미오토", "CVT", "기타"];
const STATUSES = [
  { value: "REVIEWING", label: "검수대기", color: "#E8A020" },
  { value: "AVAILABLE", label: "판매중", color: "#2D8A52" },
  { value: "SOLD", label: "판매완료", color: "#888" },
  { value: "RESERVED", label: "예약", color: "#0066FF" },
];

export default function AdminCarEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* 편집 필드 */
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState(2024);
  const [mileage, setMileage] = useState(0);
  const [fuel, setFuel] = useState("가솔린");
  const [transmission, setTransmission] = useState("오토");
  const [color, setColor] = useState("");
  const [cc, setCc] = useState(0);
  const [owners, setOwners] = useState(1);
  const [accident, setAccident] = useState(false);
  const [price, setPrice] = useState(0);
  const [region, setRegion] = useState("광주");
  const [status, setStatus] = useState("REVIEWING");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [optionText, setOptionText] = useState("");
  const [inspected, setInspected] = useState(false);
  const [isPick, setIsPick] = useState(false);

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
      setBrand(data.brand || "");
      setName(data.name || "");
      setYear(data.year || 2024);
      setMileage(data.mileage || 0);
      setFuel(data.fuel || "가솔린");
      setTransmission(data.transmission || "오토");
      setColor(data.color || "");
      setCc(data.cc || 0);
      setOwners(data.owners || 1);
      setAccident(data.accident || false);
      setPrice(data.price || 0);
      setRegion(data.region || "광주");
      setStatus(data.status || "REVIEWING");
      setDescription(data.description || "");
      setImages(data.images || []);
      setOptions(data.options || []);
      setOptionText((data.options || []).join(", "));
      setInspected(data.inspected || false);
      setIsPick(data.isPick || false);
    } catch { alert("매물 로드 실패"); }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      const res = await fetch(`/api/admin/cars/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand, name, year, mileage, fuel, transmission, color, cc, owners,
          accident, price, region, status, description, images, inspected, isPick,
          options: optionText.split(",").map(s => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.success) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else alert(data.error || "저장 실패");
    } catch { alert("네트워크 오류"); }
    setSaving(false);
  };

  const handlePhotoUpload = () => {
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = "image/*"; inp.multiple = true;
    inp.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;
      setUploading(true);
      for (const file of Array.from(files)) {
        const fd = new FormData(); fd.append("file", file);
        try {
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          if (!res.ok) continue;
          const d = await res.json();
          if (d.success && d.url) setImages(prev => [...prev, d.url]);
        } catch {}
      }
      setUploading(false);
    };
    inp.click();
  };

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));
  const moveImage = (idx: number, dir: -1 | 1) => {
    setImages(prev => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  if (loading) return <><Navbar /><div style={{ textAlign: "center", padding: 100, color: "#CCC" }}>로딩 중...</div></>;
  if (!car) return <><Navbar /><div style={{ textAlign: "center", padding: 100, color: "#CCC" }}>매물 없음</div></>;

  const lbl: React.CSSProperties = { fontSize: 13, fontWeight: 800, display: "block", marginBottom: 6, color: "#555" };
  const inp: React.CSSProperties = { width: "100%", padding: "12px 14px", border: "1.5px solid #E0DDD7", borderRadius: 10, fontSize: 14, fontFamily: "'NanumSquareRound',sans-serif" };
  const sel: React.CSSProperties = { ...inp, background: "white" };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus,select:focus,textarea:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 24px 100px" }}>
          {/* 헤더 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#888", textDecoration: "none" }}>
              <ChevronLeft size={14} /> 관리자 패널
            </Link>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href={`/cars/${id}`} style={{ padding: "10px 16px", background: "#EEF5FF", borderRadius: 10, fontSize: 12, fontWeight: 700, color: "#0066FF", textDecoration: "none" }}>매물 페이지 보기</Link>
              <button onClick={handleSave} disabled={saving} style={{ padding: "10px 20px", background: saving ? "#CCC" : saved ? "#2D8A52" : "#FF3B1E", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'NanumSquareRound',sans-serif" }}>
                {saved ? <><Check size={14} /> 저장 완료!</> : <><Save size={14} /> {saving ? "저장 중..." : "저장"}</>}
              </button>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: 20, padding: "32px 30px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>🛠️ 매물 수정 — #{id}</h1>
            <div style={{ fontSize: 13, color: "#AAA", marginBottom: 24 }}>딜러: {car.dealer?.user?.name || car.dealer?.shopName || "미지정"}</div>

            {/* ── 상태 + 검수/PICK ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24, padding: "16px 18px", background: "#F8F7F4", borderRadius: 14 }}>
              <div>
                <label style={lbl}>상태</label>
                <select value={status} onChange={e => setStatus(e.target.value)} style={sel}>
                  {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={inspected} onChange={e => setInspected(e.target.checked)} style={{ width: 18, height: 18 }} />
                  ✅ 검수 완료
                </label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={isPick} onChange={e => setIsPick(e.target.checked)} style={{ width: 18, height: 18 }} />
                  🔥 PICK 추천
                </label>
              </div>
            </div>

            {/* ── 기본정보 ── */}
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>🚗 기본 정보</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div><label style={lbl}>브랜드</label><input value={brand} onChange={e => setBrand(e.target.value)} style={inp} /></div>
              <div><label style={lbl}>모델명 (세부+등급 포함)</label><input value={name} onChange={e => setName(e.target.value)} style={inp} /></div>
              <div><label style={lbl}>연식</label><input type="number" value={year} onChange={e => setYear(Number(e.target.value))} style={inp} /></div>
              <div><label style={lbl}>주행거리 (km)</label><input type="number" value={mileage} onChange={e => setMileage(Number(e.target.value))} style={inp} /></div>
              <div><label style={lbl}>연료</label><select value={fuel} onChange={e => setFuel(e.target.value)} style={sel}>{FUELS.map(f => <option key={f}>{f}</option>)}</select></div>
              <div><label style={lbl}>변속기</label><select value={transmission} onChange={e => setTransmission(e.target.value)} style={sel}>{TRANS.map(t => <option key={t}>{t}</option>)}</select></div>
              <div><label style={lbl}>색상</label><input value={color} onChange={e => setColor(e.target.value)} style={inp} /></div>
              <div><label style={lbl}>배기량 (cc)</label><input type="number" value={cc} onChange={e => setCc(Number(e.target.value))} style={inp} /></div>
              <div><label style={lbl}>소유자 수</label><input type="number" value={owners} onChange={e => setOwners(Number(e.target.value))} style={inp} /></div>
              <div><label style={lbl}>판매가 (만원)</label><input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} style={inp} /></div>
              <div><label style={lbl}>지역</label><input value={region} onChange={e => setRegion(e.target.value)} style={inp} /></div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  <input type="checkbox" checked={accident} onChange={e => setAccident(e.target.checked)} style={{ width: 18, height: 18 }} />
                  사고 이력 있음
                </label>
              </div>
            </div>

            {/* ── 옵션 ── */}
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>⚙️ 옵션</h3>
            <div style={{ marginBottom: 24 }}>
              <label style={lbl}>옵션 (콤마로 구분)</label>
              <input value={optionText} onChange={e => setOptionText(e.target.value)} placeholder="선루프, 후방카메라, 열선시트" style={inp} />
              <div style={{ fontSize: 11, color: "#AAA", marginTop: 4 }}>{optionText.split(",").filter(s => s.trim()).length}개 옵션</div>
            </div>

            {/* ── 설명글 ── */}
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>📝 설명글</h3>
            <div style={{ marginBottom: 24 }}>
              <textarea rows={8} value={description} onChange={e => setDescription(e.target.value)} style={{ ...inp, resize: "none", lineHeight: 1.8 }} />
            </div>

            {/* ── 사진 관리 ── */}
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>📷 사진 관리 ({images.length}장)</h3>
            <div style={{ marginBottom: 8 }}>
              <button onClick={handlePhotoUpload} disabled={uploading} style={{ padding: "12px 20px", background: uploading ? "#CCC" : "#0066FF", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: uploading ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'NanumSquareRound',sans-serif", marginBottom: 12 }}>
                <Upload size={14} /> {uploading ? "업로드 중..." : "사진 추가 (여러장 가능)"}
              </button>
              <div style={{ fontSize: 11, color: "#AAA", marginBottom: 12 }}>순서: 1번=전면3/4, 2번=후면3/4, 3번=전면, 4번=후면, 5번=실내메인, 6번~=디테일. ← → 버튼으로 순서 변경 가능.</div>
            </div>

            {images.length === 0 ? (
              <div style={{ background: "#F8F7F4", borderRadius: 14, padding: "40px 20px", textAlign: "center", color: "#CCC", marginBottom: 24 }}>
                <ImageIcon size={32} style={{ marginBottom: 8 }} />
                <div>등록된 사진이 없습니다</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
                {images.map((url, i) => {
                  const cleanUrl = url.split("#")[0];
                  return (
                    <div key={i} style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: i < 5 ? "2px solid #0066FF" : "1px solid #E0DDD7" }}>
                      <img src={cleanUrl} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                      {/* 순번 라벨 */}
                      <div style={{ position: "absolute", top: 6, left: 6, background: i < 5 ? "#0066FF" : "rgba(0,0,0,0.6)", color: "white", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 6 }}>
                        {i === 0 ? "①전면3/4" : i === 1 ? "②후면3/4" : i === 2 ? "③전면" : i === 3 ? "④후면" : i === 4 ? "⑤실내" : `디테일${i - 4}`}
                      </div>
                      {/* 조작 버튼 */}
                      <div style={{ position: "absolute", top: 6, right: 6, display: "flex", gap: 3 }}>
                        {i > 0 && <button onClick={() => moveImage(i, -1)} style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(0,0,0,0.6)", color: "white", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>}
                        {i < images.length - 1 && <button onClick={() => moveImage(i, 1)} style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(0,0,0,0.6)", color: "white", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>}
                        <button onClick={() => removeImage(i)} style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(220,50,50,0.8)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={12} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 하단 저장 */}
            <button onClick={handleSave} disabled={saving} style={{ width: "100%", padding: "18px", background: saving ? "#CCC" : saved ? "#2D8A52" : "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'NanumSquareRound',sans-serif" }}>
              {saved ? <><Check size={18} /> 저장 완료!</> : <><Save size={18} /> {saving ? "저장 중..." : "수정사항 저장"}</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
