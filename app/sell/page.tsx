"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Car, DollarSign, Users, Shield, ChevronRight, Check } from "lucide-react";

const STEPS_INFO = [
  { num: "01", icon: "📋", title: "차량 정보 입력", desc: "차량번호 또는 차량 정보를 입력해주세요" },
  { num: "02", icon: "🏪", title: "딜러 견적 수신", desc: "등록된 딜러들이 24시간 내 견적을 보내드립니다" },
  { num: "03", icon: "💰", title: "최고가 선택", desc: "여러 견적 중 최고가를 선택하세요" },
  { num: "04", icon: "🤝", title: "거래 완료", desc: "선택한 딜러와 안전하게 거래합니다" },
];

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [plate, setPlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuel, setFuel] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!brand || !model || !year || !mileage || !phone) { alert("필수 항목을 모두 입력해주세요"); return; }
    setSubmitted(true);
  };

  const inputS: React.CSSProperties = { width: "100%", padding: "14px 16px", borderRadius: 12, border: "1.5px solid #E0DDD7", fontSize: 15, fontFamily: "'NanumSquareRound',sans-serif", background: "white" };
  const labelS: React.CSSProperties = { fontSize: 13, fontWeight: 800, display: "block", marginBottom: 6 };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} select:focus,input:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        {/* 히어로 */}
        <div style={{ background: "linear-gradient(135deg,#FF3B1E,#CC2200)", padding: "48px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, bottom: -20, fontFamily: "'Bebas Neue',serif", fontSize: "clamp(80px,15vw,150px)", color: "rgba(255,255,255,0.1)", lineHeight: 1 }}>SELL</div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <DollarSign size={40} color="white" style={{ marginBottom: 16 }} />
            <h1 style={{ fontSize: "clamp(24px,5vw,32px)", fontWeight: 800, color: "white", marginBottom: 8 }}>내차팔기</h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
              차량 정보만 입력하면<br />광주 딜러들이 최고가 견적을 보내드립니다
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 16px 100px" }}>
          {/* 진행 과정 */}
          {!submitted && (
            <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
              {STEPS_INFO.map((s, i) => (
                <div key={s.num} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: i < step ? "#FF3B1E" : "#E0DDD7", color: i < step ? "white" : "#AAA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, margin: "0 auto 6px" }}>{s.num}</div>
                  <div style={{ fontSize: 11, fontWeight: i + 1 === step ? 800 : 500, color: i + 1 === step ? "#FF3B1E" : "#AAA" }}>{s.title}</div>
                </div>
              ))}
            </div>
          )}

          {submitted ? (
            /* 완료 화면 */
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 60, marginBottom: 20 }}>✅</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>견적 요청 완료!</h2>
              <p style={{ fontSize: 15, color: "#888", lineHeight: 1.8, marginBottom: 28 }}>
                등록된 딜러들에게 견적 요청이 전달되었습니다.<br />
                24시간 내 연락처로 견적을 보내드립니다.
              </p>
              <div style={{ background: "white", borderRadius: 18, padding: "24px", marginBottom: 20, textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>📋 요청 내역</div>
                {[{ l: "차량", v: `${brand} ${model}` }, { l: "연식", v: `${year}년` }, { l: "주행거리", v: `${mileage}km` }, { l: "연료", v: fuel || "-" }, { l: "연락처", v: phone }].map(r => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F0EEE9", fontSize: 13 }}>
                    <span style={{ color: "#AAA" }}>{r.l}</span><span style={{ fontWeight: 700 }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => { setSubmitted(false); setStep(1); setBrand(""); setModel(""); setYear(""); setMileage(""); setFuel(""); setPhone(""); setPlate(""); }} style={{ padding: "14px 32px", background: "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>다시 요청하기</button>
            </div>
          ) : (
            /* 입력 폼 */
            <div style={{ background: "white", borderRadius: 20, padding: "28px 24px" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>🚗 차량 정보 입력</h2>

              <div style={{ marginBottom: 16 }}>
                <label style={labelS}>차량번호 (선택)</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={plate} onChange={e => setPlate(e.target.value)} placeholder="12가1234" style={{ ...inputS, flex: 1 }} />
                  <button onClick={() => alert("국토교통부 차량 조회 기능은 준비 중입니다.")} style={{ padding: "14px 18px", background: "#1847FF", color: "white", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>🏛️ 조회</button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div><label style={labelS}>제조사 <span style={{ color: "#FF3B1E" }}>*</span></label><input value={brand} onChange={e => setBrand(e.target.value)} placeholder="현대, 기아 등" style={inputS} /></div>
                <div><label style={labelS}>모델명 <span style={{ color: "#FF3B1E" }}>*</span></label><input value={model} onChange={e => setModel(e.target.value)} placeholder="아반떼, K5 등" style={inputS} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div><label style={labelS}>연식 <span style={{ color: "#FF3B1E" }}>*</span></label><input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="2023" style={inputS} /></div>
                <div><label style={labelS}>주행거리(km) <span style={{ color: "#FF3B1E" }}>*</span></label><input type="number" value={mileage} onChange={e => setMileage(e.target.value)} placeholder="35000" style={inputS} /></div>
                <div><label style={labelS}>연료</label><select value={fuel} onChange={e => setFuel(e.target.value)} style={inputS}><option value="">선택</option>{["가솔린", "디젤", "하이브리드", "전기", "LPG"].map(f => <option key={f}>{f}</option>)}</select></div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelS}>연락처 <span style={{ color: "#FF3B1E" }}>*</span></label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" style={inputS} />
              </div>
              <button onClick={handleSubmit} style={{ width: "100%", padding: "18px", background: "linear-gradient(135deg,#FF3B1E,#CC2200)", color: "white", border: "none", borderRadius: 16, fontSize: 18, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>
                최고가 견적 받기
              </button>
              <div style={{ fontSize: 12, color: "#CCC", textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
                견적은 무료이며, 24시간 내 연락처로 안내됩니다
              </div>
            </div>
          )}

          {/* 장점 카드 */}
          {!submitted && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 28 }}>
              {[
                { icon: "💰", title: "최고가 보장", desc: "여러 딜러 견적 비교" },
                { icon: "⚡", title: "24시간 내 견적", desc: "빠른 견적 수신" },
                { icon: "🛡️", title: "안전 거래", desc: "픽스카 중개 보호" },
                { icon: "🆓", title: "견적 무료", desc: "비용 부담 없음" },
              ].map(b => (
                <div key={b.title} style={{ background: "white", borderRadius: 14, padding: "18px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{b.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{b.title}</div>
                  <div style={{ fontSize: 12, color: "#AAA" }}>{b.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
