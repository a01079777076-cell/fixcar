"use client";

import { useState } from "react";
import { CheckCircle, Shield, Upload, ArrowLeft, ChevronRight, AlertCircle } from "lucide-react";

export default function DealerApplyPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    shopName: "", ownerName: "", phone: "", email: "",
    address: "", bizNumber: "", carLicense: "", experience: "",
    intro: "",
  });

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1.5px solid #E0DDD7", borderRadius: "10px",
    padding: "12px 14px", fontSize: "14px", outline: "none",
    background: "#FAFAF8", fontFamily: "'NanumSquareRound',sans-serif",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "14px", fontWeight: 800, display: "block", marginBottom: "7px",
  };

  if (done) return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        @keyframes scaleIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: "480px", width: "100%" }}>
          <div style={{ width: "88px", height: "88px", background: "#EEF2FF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "scaleIn 0.5s ease" }}>
            <CheckCircle size={44} color="#1847FF" />
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px", marginBottom: "12px", animation: "fadeUp 0.5s 0.1s both" }}>신청 완료! 🎉</h1>
          <p style={{ fontSize: "15px", color: "#888", lineHeight: 1.8, marginBottom: "32px", fontWeight: 400, animation: "fadeUp 0.5s 0.2s both" }}>
            픽스카 운영팀이 <strong style={{ color: "#1A1A1A", fontWeight: 800 }}>3 영업일 내</strong>로 검토 후<br />
            <strong style={{ color: "#1847FF", fontWeight: 800 }}>{form.email}</strong>으로 결과를 알려드려요.
          </p>
          <a href="/"><button style={{ background: "#1847FF", color: "white", border: "none", padding: "15px 40px", borderRadius: "12px", fontSize: "15px", fontWeight: 800, cursor: "pointer" }}>홈으로 돌아가기</button></a>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input, select, textarea { font-family:'NanumSquareRound',sans-serif; }
        input:focus, select:focus, textarea:focus { border-color:#1847FF !important; background:white !important; outline:none; }
        .btn-blue { background:#1847FF; color:white; border:none; border-radius:14px; font-size:15px; font-weight:800; padding:16px; width:100%; display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; transition:all 0.2s; }
        .btn-blue:hover { background:#1238D4; }
        .btn-blue:disabled { background:#E0DDD7; color:#AAA; cursor:default; }
        @media(max-width:768px) { .form-grid { grid-template-columns:1fr !important; } .page-wrap { padding:16px !important; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        {/* 헤더 */}
        <div style={{ background: "#1A1A1A", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue',serif", fontSize: "24px", letterSpacing: "3px" }}>
            <span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "white" }}>CAR</span>
          </a>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>
            <ArrowLeft size={16} /> 홈으로
          </a>
        </div>

        {/* 히어로 */}
        <div style={{ background: "#1847FF", padding: "48px 32px 40px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: "-40px", bottom: "-40px", fontFamily: "'Bebas Neue',serif", fontSize: "120px", color: "rgba(255,255,255,0.06)", lineHeight: 1 }}>DEALER</div>
          <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "3px", color: "rgba(255,255,255,0.6)", marginBottom: "10px" }}>DEALER APPLICATION</div>
            <h1 style={{ fontSize: "clamp(24px,4vw,42px)", fontWeight: 800, color: "white", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "10px" }}>
              픽스카 딜러로 등록하기
            </h1>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", fontWeight: 400 }}>
              신청서 제출 → 운영팀 검토 (3 영업일) → 승인 시 딜러 계정 활성화
            </p>
          </div>
        </div>

        {/* 스텝 */}
        <div style={{ background: "white", borderBottom: "1px solid #ECEAE4", padding: "0 32px" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", alignItems: "center", padding: "14px 0" }}>
            {["사업자 정보", "딜러 정보", "제출"].map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: step > i + 1 ? "#2D8A52" : step === i + 1 ? "#1847FF" : "#E0DDD7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, color: "white", flexShrink: 0 }}>
                    {step > i + 1 ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: step === i + 1 ? 800 : 600, color: step >= i + 1 ? "#1A1A1A" : "#AAA", whiteSpace: "nowrap" }}>{s}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: "1px", background: step > i + 1 ? "#2D8A52" : "#E0DDD7", margin: "0 10px" }} />}
              </div>
            ))}
          </div>
        </div>

        <div className="page-wrap" style={{ maxWidth: "700px", margin: "0 auto", padding: "28px 32px 80px" }}>

          {/* STEP 1 */}
          {step === 1 && (
            <div style={{ background: "white", borderRadius: "20px", padding: "28px 32px" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "22px" }}>사업자 정보</div>
              <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>상호명 <span style={{ color: "#1847FF" }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="예: 광주모터스" value={form.shopName} onChange={e => update("shopName", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>대표자 이름 <span style={{ color: "#1847FF" }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="홍길동" value={form.ownerName} onChange={e => update("ownerName", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>연락처 <span style={{ color: "#1847FF" }}>*</span></label>
                  <input style={inputStyle} type="tel" placeholder="010-0000-0000" value={form.phone} onChange={e => update("phone", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>이메일 <span style={{ color: "#1847FF" }}>*</span></label>
                  <input style={inputStyle} type="email" placeholder="dealer@example.com" value={form.email} onChange={e => update("email", e.target.value)} />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={labelStyle}>사업장 주소 <span style={{ color: "#1847FF" }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="광주광역시 ..." value={form.address} onChange={e => update("address", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>사업자등록번호 <span style={{ color: "#1847FF" }}>*</span></label>
                  <input style={inputStyle} type="text" placeholder="000-00-00000" value={form.bizNumber} onChange={e => update("bizNumber", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>자동차매매업 허가번호</label>
                  <input style={inputStyle} type="text" placeholder="있는 경우 입력" value={form.carLicense} onChange={e => update("carLicense", e.target.value)} />
                </div>
              </div>

              {/* 서류 업로드 안내 */}
              <div style={{ marginTop: "20px", background: "#EEF2FF", border: "1px solid #B8C8FF", borderRadius: "12px", padding: "16px 18px", display: "flex", gap: "12px" }}>
                <Upload size={18} color="#1847FF" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: "13px", color: "#1847FF", lineHeight: 1.7, fontWeight: 400 }}>
                  <strong style={{ fontWeight: 800 }}>필요 서류:</strong> 사업자등록증, 자동차매매업 등록증 (있는 경우)<br />
                  승인 과정에서 운영팀이 서류 제출 요청 메일을 보내드려요.
                </div>
              </div>

              <button className="btn-blue" style={{ marginTop: "22px" }}
                disabled={!form.shopName || !form.ownerName || !form.phone || !form.email || !form.address || !form.bizNumber}
                onClick={() => setStep(2)}>
                다음 — 딜러 정보 <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div style={{ background: "white", borderRadius: "20px", padding: "28px 32px" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "22px" }}>딜러 정보</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>경력</label>
                  <select style={inputStyle} value={form.experience} onChange={e => update("experience", e.target.value)}>
                    <option value="">선택</option>
                    {["1년 미만", "1~3년", "3~5년", "5~10년", "10년 이상"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>딜러 소개 <span style={{ color: "#1847FF" }}>*</span></label>
                  <textarea style={{ ...inputStyle, resize: "none" }} rows={5}
                    placeholder="취급 차종, 전문 분야, 서비스 특징 등을 자유롭게 소개해주세요"
                    value={form.intro} onChange={e => update("intro", e.target.value)} />
                  <div style={{ fontSize: "12px", color: "#AAA", marginTop: "5px", fontWeight: 400 }}>고객에게 보여지는 소개글이에요</div>
                </div>
              </div>

              <div style={{ marginTop: "20px", background: "#FFF8EC", border: "1px solid #FFD89A", borderRadius: "12px", padding: "14px 18px", display: "flex", gap: "10px" }}>
                <AlertCircle size={18} color="#E8A020" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: "13px", color: "#7A5500", lineHeight: 1.7, fontWeight: 400 }}>
                  허위 정보 제출 시 승인이 거절되며, 추후 딜러 자격이 취소될 수 있어요.
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "22px" }}>
                <button onClick={() => setStep(1)} style={{ background: "white", border: "2px solid #E0DDD7", borderRadius: "12px", padding: "14px 24px", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <ArrowLeft size={15} /> 이전
                </button>
                <button className="btn-blue" style={{ flex: 1 }} disabled={!form.intro} onClick={() => setStep(3)}>
                  다음 — 최종 확인 <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "white", borderRadius: "20px", padding: "24px 28px" }}>
                <div style={{ fontSize: "17px", fontWeight: 800, marginBottom: "18px" }}>신청 내용 확인</div>
                {[
                  ["상호명", form.shopName], ["대표자", form.ownerName],
                  ["연락처", form.phone], ["이메일", form.email],
                  ["주소", form.address], ["사업자번호", form.bizNumber],
                  ["경력", form.experience || "미입력"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F0EEE9" }}>
                    <span style={{ fontSize: "14px", color: "#888", fontWeight: 400 }}>{k}</span>
                    <span style={{ fontSize: "14px", fontWeight: 800 }}>{v}</span>
                  </div>
                ))}
                <div style={{ padding: "12px 0" }}>
                  <div style={{ fontSize: "14px", color: "#888", fontWeight: 400, marginBottom: "6px" }}>딜러 소개</div>
                  <div style={{ fontSize: "14px", color: "#444", lineHeight: 1.7, fontWeight: 400 }}>{form.intro}</div>
                </div>
              </div>

              <div style={{ background: "#1A1A1A", borderRadius: "18px", padding: "22px 24px" }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <Shield size={22} color="#7A9BFF" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, fontWeight: 400 }}>
                    제출된 정보는 딜러 자격 심사 목적으로만 사용되며, 미승인 시 즉시 삭제돼요.
                    승인 후에는 픽스카 딜러 이용약관이 적용돼요.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setStep(2)} style={{ background: "white", border: "2px solid #E0DDD7", borderRadius: "12px", padding: "14px 24px", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <ArrowLeft size={15} /> 이전
                </button>
                <button className="btn-blue" style={{ flex: 1 }} onClick={() => setDone(true)}>
                  <CheckCircle size={16} /> 딜러 신청 제출
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
