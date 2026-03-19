"use client";
import Link from "next/link";

/**
 * 홈페이지에 삽입할 MBTI 섹션 컴포넌트
 * 
 * 사용법: app/page.tsx 에서 import 후 원하는 위치에 <HomeMbtiSection /> 삽입
 * 
 * import HomeMbtiSection from "@/components/HomeMbtiSection";
 * ...
 * <HomeMbtiSection />
 */
export default function HomeMbtiSection() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
      <div style={{
        background: "linear-gradient(135deg, #1A1A1A 0%, #2D1A1A 60%, #0f3460 100%)",
        borderRadius: 22,
        padding: "36px 28px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* 배경 데코 */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse at 80% 30%, rgba(255,59,30,0.12) 0%, transparent 60%)",
        }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
          {/* 좌측 텍스트 */}
          <div style={{ flex: "1 1 280px" }}>
            <div style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 12, letterSpacing: 4, color: "#FF3B1E", marginBottom: 8,
            }}>
              CAR MBTI TEST
            </div>
            <h2 style={{
              fontSize: 24, fontWeight: 800, color: "white", lineHeight: 1.35,
              marginBottom: 8, letterSpacing: -0.5,
            }}>
              나의 차량 성향<br />MBTI 진행하기
            </h2>
            <p style={{
              fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 400,
              lineHeight: 1.7, marginBottom: 20,
            }}>
              12가지 질문으로 나에게 딱 맞는 차를 찾아보세요
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/mbti">
                <button style={{
                  padding: "13px 24px", background: "#FF3B1E", color: "white",
                  border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800,
                  cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
                }}>
                  🧬 MBTI 시작하기
                </button>
              </Link>
              <Link href="/quiz">
                <button style={{
                  padding: "13px 24px", background: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 12, fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
                }}>
                  🎯 간단 퀴즈
                </button>
              </Link>
            </div>
          </div>

          {/* 우측 미리보기 카드 */}
          <div style={{
            flex: "0 0 220px",
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(8px)",
            borderRadius: 16, padding: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "📏", label: "크기 성향", desc: "소형 ↔ 대형" },
                { icon: "🎯", label: "주행 스타일", desc: "스포티 ↔ 편안" },
                { icon: "⛽", label: "연료 타입", desc: "가솔린 ↔ 전기" },
                { icon: "💎", label: "구매 성향", desc: "새차 ↔ 가성비" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "6px 0",
                  borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{item.label}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              textAlign: "center", marginTop: 12, fontSize: 11,
              color: "rgba(255,255,255,0.3)", fontWeight: 400,
            }}>
              ⏱️ 약 2~3분 소요
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
