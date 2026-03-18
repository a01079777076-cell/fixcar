"use client";
import { useState } from "react";
import { Shield, Star, Save, CheckCircle } from "lucide-react";

export default function DealerProfilePage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ shopName: "광주모터스", ownerName: "박준형", phone: "010-1234-5678", email: "dealer1@fixcar.kr", address: "광주광역시 북구 운암동", intro: "10년 경력의 믿을 수 있는 딜러입니다. 무사고 검수 차량만 취급합니다.", specialties: "국산차, SUV 전문" });
  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const inputStyle: React.CSSProperties = { width: "100%", border: "1.5px solid #E0DDD7", borderRadius: "10px", padding: "11px 14px", fontSize: "14px", outline: "none", background: "#FAFAF8", fontFamily: "'NanumSquareRound',sans-serif" };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input,textarea { font-family:'NanumSquareRound',sans-serif; }
        input:focus, textarea:focus { border-color:#1847FF !important; background:white !important; outline:none; }
        @media(max-width:768px) { .grid2 { grid-template-columns:1fr !important; } }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "#1A1A1A", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue',serif", fontSize: "24px", letterSpacing: "3px" }}><span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "white" }}>CAR</span></a>
          <a href="/dealer" style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>← 대시보드</a>
        </div>

        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "28px 32px 80px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 800, marginBottom: "20px" }}>딜러 프로필</h1>

          {saved && (
            <div style={{ background: "#EAF6EF", border: "1px solid #B8DFC8", borderRadius: "12px", padding: "14px 18px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
              <CheckCircle size={18} color="#2D8A52" /><span style={{ fontSize: "14px", fontWeight: 700, color: "#2D8A52" }}>프로필이 저장됐어요!</span>
            </div>
          )}

          {/* 인증 배지 */}
          <div style={{ background: "#EEF2FF", border: "1px solid #B8C8FF", borderRadius: "16px", padding: "18px 22px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "48px", height: "48px", background: "#1847FF", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}><Shield size={24} color="white" /></div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#1847FF", marginBottom: "3px" }}>🏅 픽스카 인증 딜러</div>
              <div style={{ fontSize: "13px", color: "#555", fontWeight: 400 }}>사업자 등록 확인 완료 · 평점 4.9 <Star size={12} color="#FF3B1E" fill="#FF3B1E" style={{ verticalAlign: "middle" }} /></div>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "18px", padding: "24px 28px", marginBottom: "16px" }}>
            <div style={{ fontSize: "17px", fontWeight: 800, marginBottom: "18px" }}>기본 정보</div>
            <div className="grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {[["상호명", "shopName", "text"], ["대표자명", "ownerName", "text"], ["연락처", "phone", "tel"], ["이메일", "email", "email"]].map(([l, k, t]) => (
                <div key={k}>
                  <label style={{ fontSize: "14px", fontWeight: 800, display: "block", marginBottom: "6px" }}>{l}</label>
                  <input style={inputStyle} type={t} value={form[k as keyof typeof form]} onChange={e => update(k, e.target.value)} />
                </div>
              ))}
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ fontSize: "14px", fontWeight: 800, display: "block", marginBottom: "6px" }}>사업장 주소</label>
                <input style={inputStyle} type="text" value={form.address} onChange={e => update("address", e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "18px", padding: "24px 28px", marginBottom: "16px" }}>
            <div style={{ fontSize: "17px", fontWeight: 800, marginBottom: "18px" }}>딜러 소개</div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "14px", fontWeight: 800, display: "block", marginBottom: "6px" }}>전문 분야</label>
              <input style={inputStyle} type="text" placeholder="예: 국산차 SUV 전문" value={form.specialties} onChange={e => update("specialties", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: "14px", fontWeight: 800, display: "block", marginBottom: "6px" }}>딜러 소개글</label>
              <textarea style={{ ...inputStyle, resize: "none" }} rows={4} value={form.intro} onChange={e => update("intro", e.target.value)} />
              <div style={{ fontSize: "12px", color: "#AAA", marginTop: "5px", fontWeight: 400 }}>차량 상세 페이지에 표시돼요</div>
            </div>
          </div>

          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
            style={{ background: "#1847FF", color: "white", border: "none", padding: "15px", borderRadius: "12px", fontSize: "15px", fontWeight: 800, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Save size={17} /> 프로필 저장
          </button>
        </div>
      </div>
    </>
  );
}
