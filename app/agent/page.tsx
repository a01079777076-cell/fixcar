// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/agent/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Shield, CheckCircle, Phone, ArrowRight, AlertTriangle, Users } from "lucide-react";

const STEPS = [
  { num: "01", title: "거래대행 신청", desc: "픽스카에서 거래대행을 신청합니다.\n매물 링크(당근, 개인 등)를 첨부해주세요.", icon: "📋" },
  { num: "02", title: "전담 딜러 배정", desc: "광주 지역 전문 딜러가 배정됩니다.\n차량 상태 확인 및 시세 분석을 진행합니다.", icon: "🏪" },
  { num: "03", title: "차량 검수", desc: "딜러가 직접 차량을 검수합니다.\n성능점검기록부, 사고이력 등 확인.", icon: "🔍" },
  { num: "04", title: "안전 거래 진행", desc: "명의이전, 보험, 서류 등\n모든 거래 과정을 대행합니다.", icon: "🤝" },
  { num: "05", title: "거래 완료", desc: "거래 완료 후 모든 서류를 전달합니다.\n대행료는 현장에서 결제합니다.", icon: "✅" },
];

const BENEFITS = [
  { title: "사기 걱정 ZERO", desc: "전문 딜러의 검증으로 허위매물, 침수차, 사고차 원천 차단", icon: "🛡️" },
  { title: "서류 대행", desc: "명의이전, 보험 가입, 번호판 교체 등 복잡한 서류 처리", icon: "📄" },
  { title: "시세 분석", desc: "적정 가격인지 전문가가 판단하여 과다 지불 방지", icon: "📊" },
  { title: "현장 검수", desc: "차량 상태를 직접 확인하고 성능점검기록 대조", icon: "🔧" },
];

export default function AgentPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        {/* 히어로 */}
        <div style={{ background: "linear-gradient(135deg,#1A1A1A,#333)", padding: "48px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, bottom: -20, fontFamily: "'Bebas Neue',serif", fontSize: "clamp(80px,15vw,150px)", color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>AGENT</div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <Users size={40} color="#FF3B1E" style={{ marginBottom: 16 }} />
            <h1 style={{ fontSize: "clamp(24px,5vw,32px)", fontWeight: 800, color: "white", marginBottom: 8 }}>개인간 거래대행 서비스</h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 20 }}>
              당근마켓, 번개장터 등 개인간 중고차 거래<br />전문 딜러가 안전하게 대행해드립니다
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 16px 100px" }}>
          {/* 핵심 메시지 — 사기 피해금 vs 대행료 비교 */}
          <div style={{ background: "white", borderRadius: 20, padding: "28px 24px", marginBottom: 28, border: "2px solid #FF3B1E", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#888", marginBottom: 12 }}>중고차 개인거래 사기 피해</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, color: "#AAA", marginBottom: 4 }}>평균 사기 피해금</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#E24B4A", textDecoration: "line-through" }}>300~500만원</div>
              </div>
              <div style={{ fontSize: 24, color: "#CCC" }}>→</div>
              <div>
                <div style={{ fontSize: 14, color: "#AAA", marginBottom: 4 }}>과도한 이전비 피해</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#E24B4A", textDecoration: "line-through" }}>50~100만원</div>
              </div>
            </div>
            <div style={{ background: "#EAF6EF", borderRadius: 14, padding: "20px", marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: "#2D8A52", marginBottom: 6, fontWeight: 700 }}>✅ 픽스카 거래대행으로 한번에 해결!</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#2D8A52" }}>대행료 15~20만원</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>검수 + 시세분석 + 서류대행 + 명의이전 포함</div>
            </div>
            <div style={{ fontSize: 12, color: "#AAA", lineHeight: 1.6 }}>
              ※ 별도: 이전등록비, 취득세, 보험료 (실비 정산)<br />
              ※ 대행료는 거래 완료 시 현장 결제
            </div>
          </div>

          {/* 왜 필요한가 */}
          <div style={{ background: "#FFF0ED", borderRadius: 18, padding: "24px", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <AlertTriangle size={18} color="#FF3B1E" />
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#FF3B1E" }}>개인 거래, 이런 위험이 있어요</h2>
            </div>
            <div style={{ fontSize: 14, color: "#888", lineHeight: 2 }}>
              • 허위매물 — 사진과 다른 차량, 존재하지 않는 매물<br />
              • 침수/사고차 — 성능점검기록 조작, 사고 이력 숨기기<br />
              • 서류 사기 — 명의이전 미완료, 대포차 위험<br />
              • 과도한 이전비 — 중간에 끼워넣기식 수수료 청구<br />
              • 거래 후 분쟁 — 하자 발견 시 연락 두절
            </div>
          </div>

          {/* 혜택 */}
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>💪 픽스카 거래대행 장점</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
            {BENEFITS.map(b => (
              <div key={b.title} style={{ background: "white", borderRadius: 16, padding: "20px", border: "1px solid #E8E6E1" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{b.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{b.title}</div>
                <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>{b.desc}</div>
              </div>
            ))}
          </div>

          {/* 진행 과정 */}
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>📋 거래대행 진행 과정</h2>
          <div style={{ marginBottom: 32 }}>
            {STEPS.map((s, i) => (
              <div key={s.num} style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#FF3B1E,#CC2200)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{s.num}</div>
                  {i < STEPS.length - 1 && <div style={{ width: 2, flex: 1, background: "#E0DDD7", minHeight: 24 }} />}
                </div>
                <div style={{ background: "white", borderRadius: 16, padding: "18px 20px", flex: 1, marginBottom: 12, border: "1px solid #E8E6E1" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 20 }}>{s.icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 800 }}>{s.title}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#888", lineHeight: 1.8, whiteSpace: "pre-line" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link href="/contact">
            <button style={{ width: "100%", padding: "20px", background: "linear-gradient(135deg,#FF3B1E,#CC2200)", color: "white", border: "none", borderRadius: 18, fontSize: 18, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
              <Phone size={18} /> 거래대행 문의하기
            </button>
          </Link>
          <div style={{ textAlign: "center", fontSize: 12, color: "#AAA" }}>고객센터를 통해 문의하시면 전담 딜러를 배정해드립니다</div>
        </div>
      </div>
    </>
  );
}
