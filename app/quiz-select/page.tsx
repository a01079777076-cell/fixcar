"use client";
import Navbar from "@/components/Navbar";

export default function QuizSelectPage() {
  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .sel-card { animation: fadeUp 0.5s ease-out backwards; transition: all 0.2s; }
        .sel-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <Navbar />

        <div style={{ background: "#1A1A1A", padding: "44px 24px 36px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 5, color: "#FF3B1E", marginBottom: 8 }}>FIND YOUR CAR</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", letterSpacing: -1, marginBottom: 6 }}>내 차 찾기</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>나에게 맞는 차를 찾는 두 가지 방법</p>
        </div>

        <div style={{ maxWidth: 520, margin: "0 auto", padding: "28px 20px 100px" }}>

          {/* ── 내차 찾기 퀴즈 ── */}
          <a href="/quiz" style={{ textDecoration: "none" }}>
            <div className="sel-card" style={{
              background: "white", borderRadius: 22, padding: "28px 24px", marginBottom: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer",
              animationDelay: "0.1s", border: "2px solid transparent",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg, #FF3B1E, #FF8F3B)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0,
                }}>🎯</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <h2 style={{ fontSize: 19, fontWeight: 800, color: "#1A1A1A" }}>내차 찾기 퀴즈</h2>
                    <span style={{ background: "#EEF2FF", color: "#1847FF", padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 800 }}>간편</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#888", fontWeight: 400, lineHeight: 1.7, marginBottom: 12 }}>
                    간단한 선호도 질문 5~6개로<br />빠르게 추천 차량을 알려드려요
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["⚡ 약 1분","📝 5~6문항","🎲 가벼운 테스트"].map((t, i) => (
                      <span key={i} style={{ background: "#F8F7F4", color: "#888", padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#FFF8EC", borderRadius: 12, fontSize: 12, color: "#7A5500", fontWeight: 400, lineHeight: 1.65 }}>
                💡 <strong>이런 분에게 추천!</strong> 아직 차에 대해 잘 모르겠고, 간단하게 추천만 받고 싶은 분
              </div>
              <div style={{ textAlign: "right", marginTop: 12 }}>
                <span style={{ background: "#FF3B1E", color: "white", padding: "10px 20px", borderRadius: 100, fontSize: 13, fontWeight: 800, display: "inline-block" }}>퀴즈 시작 →</span>
              </div>
            </div>
          </a>

          {/* ── 차량 MBTI ── */}
          <a href="/mbti" style={{ textDecoration: "none" }}>
            <div className="sel-card" style={{
              background: "white", borderRadius: 22, padding: "28px 24px", marginBottom: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer",
              animationDelay: "0.2s", border: "2px solid transparent",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg, #1847FF, #6B4AFF)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0,
                }}>🧬</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <h2 style={{ fontSize: 19, fontWeight: 800, color: "#1A1A1A" }}>차량 성향 MBTI</h2>
                    <span style={{ background: "#FFF0ED", color: "#FF3B1E", padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 800 }}>정밀</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#888", fontWeight: 400, lineHeight: 1.7, marginBottom: 12 }}>
                    12가지 질문으로 나의 차량 성향을<br />정밀 분석하고 맞춤 추천을 받아요
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["⏱️ 약 2~3분","📝 12문항","📊 4축 성향 분석"].map((t, i) => (
                      <span key={i} style={{ background: "#F8F7F4", color: "#888", padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#EEF2FF", borderRadius: 12, fontSize: 12, color: "#2D4A8E", fontWeight: 400, lineHeight: 1.65 }}>
                🧠 <strong>이런 분에게 추천!</strong> 내 취향을 정확히 파악하고 싶고, 크기·스타일·연료·상태까지 세밀하게 분석받고 싶은 분
              </div>
              <div style={{ textAlign: "right", marginTop: 12 }}>
                <span style={{ background: "#1847FF", color: "white", padding: "10px 20px", borderRadius: 100, fontSize: 13, fontWeight: 800, display: "inline-block" }}>MBTI 시작 →</span>
              </div>
            </div>
          </a>

          {/* 비교 표 */}
          <div style={{ background: "white", borderRadius: 18, padding: "22px 20px", marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14, textAlign: "center", color: "#1A1A1A" }}>퀴즈 vs MBTI 비교</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, fontSize: 12 }}>
              {[
                ["","퀴즈","MBTI"],
                ["소요시간","약 1분","약 2~3분"],
                ["문항 수","5~6개","12개"],
                ["분석 깊이","간편 추천","정밀 분석"],
                ["결과","추천 차종","성향+우선순위+차종"],
                ["추천 대상","초보자","깊은 분석 원하는 분"],
              ].map((row, ri) => (
                row.map((cell, ci) => (
                  <div key={`${ri}-${ci}`} style={{
                    padding: "10px 8px", textAlign: "center",
                    fontWeight: ri === 0 || ci === 0 ? 800 : 400,
                    color: ri === 0 ? "#1A1A1A" : ci === 0 ? "#555" : "#888",
                    background: ri === 0 ? "#F8F7F4" : ri % 2 === 0 ? "#FAFAF8" : "white",
                    borderBottom: ri < 5 ? "1px solid #F0EEE9" : "none",
                    fontSize: ci === 0 ? 12 : 11,
                  }}>
                    {cell}
                  </div>
                ))
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
