// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/dealer/profile/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect } from "react";
import { CheckCircle, User, Phone, MapPin, Briefcase, FileText } from "lucide-react";
import Link from "next/link";

export default function DealerProfilePage() {
  const [form, setForm] = useState({
    shopName: "",
    phone: "",
    phoneLand: "",
    address: "",
    intro: "",
    brands: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  /* 프로필 불러오기 */
  useEffect(() => {
    fetch("/api/dealer/profile")
      .then(r => r.json())
      .then(d => {
        if (d && (d.shopName || d.data?.shopName)) {
          const p = d.data || d;
          setForm({
            shopName: p.shopName || "",
            phone: p.shopPhone || p.phone || "",
            phoneLand: p.phoneLand || "",
            address: p.shopAddr || p.address || "",
            intro: p.shopDesc || p.intro || "",
            brands: p.brands || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const inp: React.CSSProperties = {
    width: "100%", border: "1.5px solid #DDEEFF", borderRadius: 10,
    padding: "12px 14px", fontSize: 14, background: "#FAFCFF",
    fontFamily: "'NanumSquareRound',sans-serif", outline: "none",
  };

  const NAV = [
    ["대시보드", "/dealer"],
    ["매물", "/dealer/cars"],
    ["문의", "/dealer/inquiries"],
    ["프로필", "/dealer/profile"],
    ["분석", "/dealer/analytics"],
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/dealer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopName: form.shopName,
          shopPhone: form.phone,
          phoneLand: form.phoneLand,
          shopAddr: form.address,
          shopDesc: form.intro,
          brands: form.brands,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("저장 실패. 다시 시도해주세요.");
    }
    setSaving(false);
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F6FF;} a{text-decoration:none;color:inherit;} button,input,textarea{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} input:focus,textarea:focus{border-color:#0066FF!important;}`}</style>
      <div style={{ minHeight: "100vh", background: "#F0F6FF" }}>
        {/* 상단 네비 */}
        <div style={{ background: "white", borderBottom: "1.5px solid #DDEEFF", padding: "0 32px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,100,255,0.06)" }}>
          <Link href="/" style={{ fontFamily: "'Bebas Neue',serif", fontSize: 24, letterSpacing: 3, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "#1A1A1A" }}>CAR</span>
            <span style={{ fontSize: 11, fontFamily: "'NanumSquareRound',sans-serif", fontWeight: 800, color: "#0066FF", background: "#EEF5FF", padding: "3px 10px", borderRadius: 100, marginLeft: 4 }}>DEALER</span>
          </Link>
          <div style={{ display: "flex", gap: 4 }}>
            {NAV.map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: 13, fontWeight: 700, color: h === "/dealer/profile" ? "#0066FF" : "#888", padding: "7px 12px", borderRadius: 9, background: h === "/dealer/profile" ? "#EEF5FF" : "transparent" }}>{l}</Link>
            ))}
          </div>
          <Link href="/dealer"><button style={{ background: "#F0F6FF", color: "#0066FF", border: "1.5px solid #DDEEFF", padding: "7px 16px", borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>← 대시보드</button></Link>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 28px 60px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: "#0066FF" }}>딜러 프로필 관리</h1>

          {saved && (
            <div style={{ background: "#EAF6EF", border: "1px solid #B8DFC8", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#2D8A52" }}>
              <CheckCircle size={16} />프로필이 저장되었습니다!
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "#AAA" }}>프로필 불러오는 중...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* 기본 정보 */}
              <div style={{ background: "white", border: "1.5px solid #DDEEFF", borderRadius: 18, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 16, borderBottom: "1px solid #F0F4FF", marginBottom: 20 }}>
                  <div style={{ width: 56, height: 56, background: "linear-gradient(135deg,#0055FF,#003399)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={28} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{form.shopName || "딜러 상호명"}</div>
                    <div style={{ fontSize: 12, color: "#0066FF", fontWeight: 600 }}>FIX 인증 딜러</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 6, marginBottom: 6, color: "#444" }}>
                      <Briefcase size={13} /> 상호명 <span style={{ color: "#FF3B1E" }}>*</span>
                    </label>
                    <input style={inp} value={form.shopName} onChange={e => setForm(p => ({ ...p, shopName: e.target.value }))} placeholder="상호명을 입력해주세요" />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 6, marginBottom: 6, color: "#444" }}>
                        <Phone size={13} /> 휴대전화 <span style={{ color: "#FF3B1E" }}>*</span>
                      </label>
                      <input style={inp} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="010-0000-4989" />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 6, marginBottom: 6, color: "#444" }}>
                        <Phone size={13} /> 일반전화 <span style={{ fontSize: 10, color: "#AAA", fontWeight: 500 }}>(선택)</span>
                      </label>
                      <input style={inp} value={form.phoneLand} onChange={e => setForm(p => ({ ...p, phoneLand: e.target.value }))} placeholder="062-000-0000" />
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#AAA", marginTop: -8, lineHeight: 1.6 }}>
                    * 매물 등록 시 연락처가 자동으로 입력됩니다. 050 안심번호로 대체 노출될 예정입니다.
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 6, marginBottom: 6, color: "#444" }}>
                      <MapPin size={13} /> 매장 주소
                    </label>
                    <input style={inp} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="광주 서구 회재유통길 78, B동 219호" />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 6, marginBottom: 6, color: "#444" }}>
                      전문 브랜드
                    </label>
                    <input style={inp} value={form.brands} onChange={e => setForm(p => ({ ...p, brands: e.target.value }))} placeholder="예: 현대, 기아, 제네시스" />
                    <div style={{ fontSize: 11, color: "#AAA", marginTop: 4 }}>콤마(,)로 구분해서 입력해주세요</div>
                  </div>
                </div>
              </div>

              {/* 소개글 */}
              <div style={{ background: "white", border: "1.5px solid #DDEEFF", borderRadius: 18, padding: 24 }}>
                <label style={{ fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", gap: 6, marginBottom: 10, color: "#444" }}>
                  <FileText size={15} /> 딜러 소개글
                </label>
                <textarea
                  rows={6}
                  style={{ ...inp, resize: "vertical", minHeight: 120, lineHeight: 1.8 }}
                  value={form.intro}
                  onChange={e => setForm(p => ({ ...p, intro: e.target.value }))}
                  placeholder={"딜러 소개글을 작성해주세요.\n\n예) 광주 서부 매매단지 20년 경력 딜러입니다.\nFIX 정찰가 원칙을 지키며 믿을 수 있는 거래를 약속드립니다."}
                />
                <div style={{ fontSize: 11, color: "#AAA", textAlign: "right", marginTop: 4 }}>{form.intro.length}/1,000자</div>
              </div>

              {/* 저장 버튼 */}
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: saving ? "#CCC" : "#0066FF", color: "white",
                  border: "none", padding: "16px", borderRadius: 14,
                  fontSize: 16, fontWeight: 800, cursor: saving ? "wait" : "pointer",
                  fontFamily: "'NanumSquareRound',sans-serif",
                }}
              >
                {saving ? "저장 중..." : "프로필 저장"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
