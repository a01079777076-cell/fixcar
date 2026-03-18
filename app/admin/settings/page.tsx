"use client";
import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({ siteName: "픽스카 FIXCAR", listingFee: "29000", premiumFee: "59000", buyerFee: "9900", notice: "", maintenanceMode: false });
  const update = (k: string, v: string | boolean) => setSettings(p => ({ ...p, [k]: v }));

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
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "#1A1A1A", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue',serif", fontSize: "24px", letterSpacing: "3px" }}><span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "white" }}>CAR</span></a>
          <div style={{ display: "flex", gap: "20px" }}>
            {[["대시보드", "/admin"], ["회원", "/admin/users"], ["매물", "/admin/cars"], ["설정", "/admin/settings"]].map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: "13px", fontWeight: 700, color: h === "/admin/settings" ? "white" : "rgba(255,255,255,0.4)" }}>{l}</a>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "28px 32px 80px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 800, marginBottom: "24px" }}>사이트 설정</h1>

          {saved && (
            <div style={{ background: "#EAF6EF", border: "1px solid #B8DFC8", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <CheckCircle size={18} color="#2D8A52" />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#2D8A52" }}>설정이 저장됐어요!</span>
            </div>
          )}

          {[
            { title: "기본 정보", fields: [{ label: "사이트 이름", key: "siteName", type: "text" }] },
            { title: "수수료 설정", fields: [{ label: "딜러 매물 등록비 (원)", key: "listingFee", type: "number" }, { label: "딜러 프리미엄 홍보비 (원)", key: "premiumFee", type: "number" }, { label: "구매자 프리미엄 (원)", key: "buyerFee", type: "number" }] },
          ].map(section => (
            <div key={section.title} style={{ background: "white", borderRadius: "18px", padding: "24px 28px", marginBottom: "16px" }}>
              <div style={{ fontSize: "17px", fontWeight: 800, marginBottom: "18px" }}>{section.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {section.fields.map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: "14px", fontWeight: 800, display: "block", marginBottom: "6px" }}>{f.label}</label>
                    <input style={inputStyle} type={f.type} value={String(settings[f.key as keyof typeof settings])} onChange={e => update(f.key, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background: "white", borderRadius: "18px", padding: "24px 28px", marginBottom: "16px" }}>
            <div style={{ fontSize: "17px", fontWeight: 800, marginBottom: "18px" }}>공지사항</div>
            <textarea style={{ ...inputStyle, resize: "none" }} rows={4} placeholder="메인 페이지 상단에 표시할 공지사항을 입력해주세요 (비워두면 미표시)" value={settings.notice} onChange={e => update("notice", e.target.value)} />
          </div>

          <div style={{ background: "white", borderRadius: "18px", padding: "20px 24px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 800 }}>점검 모드</div>
              <div style={{ fontSize: "13px", color: "#AAA", fontWeight: 400 }}>활성화 시 일반 사용자 접근 차단</div>
            </div>
            <button onClick={() => update("maintenanceMode", !settings.maintenanceMode)} style={{ width: "52px", height: "28px", borderRadius: "14px", border: "none", background: settings.maintenanceMode ? "#FF3B1E" : "#E0DDD7", position: "relative", transition: "background 0.2s" }}>
              <span style={{ position: "absolute", top: "3px", left: settings.maintenanceMode ? "26px" : "3px", width: "22px", height: "22px", borderRadius: "50%", background: "white", transition: "left 0.2s" }} />
            </button>
          </div>

          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
            style={{ background: "#1847FF", color: "white", border: "none", padding: "15px", borderRadius: "12px", fontSize: "15px", fontWeight: 800, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Save size={17} /> 설정 저장
          </button>
        </div>
      </div>
    </>
  );
}
