"use client";
import { useState } from "react";
import Link from "next/link";

export default function DealerApplyPage() {
  const [showFaq, setShowFaq] = useState<number | null>(null);

  const STATS = [
    { num: "98%", label: "딜러 재이용률", color: "#FF3B1E" },
    { num: "2,400+", label: "월간 방문자 수", color: "#1847FF" },
    { num: "100%", label: "매물 검수율", color: "#00C471" },
    { num: "0원", label: "6개월 등록비", color: "#E8A020" },
  ];

  const BENEFITS = [
    { emoji: "🔒", title: "FIX 정찰가 시스템", desc: "가격 흥정 없이 투명한 거래. 고객 신뢰도가 높아 계약 전환율이 업계 평균 대비 2배 이상입니다." },
    { emoji: "📱", title: "카카오톡 자동 알림", desc: "고객이 원하는 조건의 매물을 등록하면 자동으로 카카오톡 알림 발송. 놓치는 고객 없이 매칭됩니다." },
    { emoji: "🎯", title: "AI 맞춤 추천", desc: "MBTI 성향 테스트, AI 퀴즈로 고객과 매물을 자동 매칭. 문의 품질이 다릅니다." },
    { emoji: "📊", title: "실시간 성과 분석", desc: "매물별 조회수, 찜 수, 문의 수를 실시간 확인. 데이터 기반으로 가격 전략을 세울 수 있어요." },
    { emoji: "🛡️", title: "100항목 검수 시스템", desc: "전문 정비사의 100항목 검수를 통해 허위매물 0건. 플랫폼 신뢰도가 곧 딜러님의 신뢰도입니다." },
    { emoji: "💰", title: "6개월 완전 무료", desc: "지금 가입하시면 6개월간 등록비 0원. 프리미엄 슬롯 3개도 무료 제공. 부담 없이 시작하세요." },
  ];

  const PLANS = [
    { name: "무료 체험", price: "0", period: "6개월", features: ["매물 10대 등록", "프리미엄 슬롯 3개", "기본 통계", "카카오 알림 발송", "고객 문의 관리"], color: "#00C471", popular: false },
    { name: "프리미엄", price: "99,000", period: "월", features: ["매물 무제한", "프리미엄 슬롯 10개", "상세 성과 분석", "카카오 알림 무제한", "우선 노출 배치", "전담 매니저 배정"], color: "#FF3B1E", popular: true },
    { name: "비즈니스", price: "별도 협의", period: "", features: ["대형 매매단지 전용", "매물 무제한", "API 연동 지원", "맞춤 배너 광고", "VIP 전담 매니저", "월간 리포트 제공"], color: "#1847FF", popular: false },
  ];

  const FAQS = [
    { q: "신규 가입 신청은 어떻게 하나요?", a: "아래 '딜러 신청하기' 버튼을 클릭하세요. 사업자등록증과 자동차매매업 종사원증을 준비해주시면, 담당 매니저가 1~2일 내로 연락드려요." },
    { q: "필요한 서류가 있나요?", a: "사업자등록증, 자동차매매업 종사원증이 필요합니다. 신청 시 사진으로 첨부하시면 됩니다." },
    { q: "광주 외 지역도 가능한가요?", a: "현재는 광주 지역 우선으로 운영 중이에요. 전남·전북 지역은 순차적으로 확대 예정입니다. 관심 있으시면 미리 신청해주세요!" },
    { q: "등록비가 정말 무료인가요?", a: "네! 지금 가입하시면 6개월간 완전 무료입니다. 프리미엄 슬롯 3개도 무료 제공해요. 6개월 후에도 합리적인 가격으로 이용하실 수 있어요." },
    { q: "매물은 몇 대까지 올릴 수 있나요?", a: "무료 체험 기간에는 10대, 프리미엄 플랜은 무제한입니다." },
  ];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        @media(max-width:768px){.plans-grid{grid-template-columns:1fr!important;}.stats-grid{grid-template-columns:1fr 1fr!important;}.benefits-grid{grid-template-columns:1fr!important;}}
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        {/* 네비 */}
        <div style={{ background: "white", borderBottom: "1px solid #E8E6E1", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <Link href="/" style={{ fontFamily: "'Bebas Neue',serif", fontSize: 26, letterSpacing: 3 }}>
            <span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "#1A1A1A" }}>CAR</span>
          </Link>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/" style={{ fontSize: 14, fontWeight: 600, color: "#888" }}>홈으로</Link>
            <Link href="#apply">
              <button style={{ padding: "10px 24px", background: "#FF3B1E", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800 }}>딜러 신청</button>
            </Link>
          </div>
        </div>

        {/* ═══ 히어로 ═══ */}
        <section style={{ background: "linear-gradient(135deg, #1A1A1A 0%, #0f3460 50%, #1A1A2E 100%)", padding: "80px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, left: -20, fontFamily: "'Bebas Neue',serif", fontSize: 300, color: "rgba(255,255,255,0.02)", lineHeight: 1, pointerEvents: "none" }}>DEALER</div>
          <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-block", background: "rgba(255,59,30,0.2)", color: "#FF6B4A", padding: "8px 20px", borderRadius: 100, fontSize: 13, fontWeight: 800, letterSpacing: 2, marginBottom: 24 }}>
              광주 No.1 중고차 플랫폼
            </div>
            <h1 style={{ fontSize: "clamp(32px,6vw,60px)", fontWeight: 800, color: "white", lineHeight: 1.15, letterSpacing: -2, marginBottom: 16 }}>
              중고차 딜러님,<br /><span style={{ color: "#FF3B1E" }}>픽스카</span>의 광고를<br />지금 이용해보세요.
            </h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", fontWeight: 400, lineHeight: 1.8, marginBottom: 36 }}>
              광주 지역 최대 중고차 플랫폼에서<br />매물을 등록하고 고객을 만나보세요.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#apply"><button style={{ padding: "18px 40px", background: "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 17, fontWeight: 800 }}>딜러 신청하기</button></a>
              <Link href="/"><button style={{ padding: "18px 40px", background: "transparent", color: "white", border: "2px solid rgba(255,255,255,0.3)", borderRadius: 14, fontSize: 17, fontWeight: 700 }}>또는 로그인</button></Link>
            </div>
          </div>
        </section>

        {/* ═══ 통계 ═══ */}
        <section style={{ maxWidth: 900, margin: "-40px auto 0", padding: "0 20px", position: "relative", zIndex: 2 }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: "white", borderRadius: 18, padding: "28px 20px", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: s.color, letterSpacing: -1 }}>{s.num}</div>
                <div style={{ fontSize: 13, color: "#888", fontWeight: 400, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 혜택 ═══ */}
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: "#FF3B1E", marginBottom: 8 }}>WHY FIXCAR</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>픽스카 딜러가 되면</h2>
          </div>
          <div className="benefits-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {BENEFITS.map(b => (
              <div key={b.title} style={{ background: "white", borderRadius: 20, padding: "28px 26px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{b.emoji}</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{b.title}</div>
                <p style={{ fontSize: 14, color: "#888", fontWeight: 400, lineHeight: 1.8 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ 요금제 ═══ */}
        <section style={{ background: "#1A1A1A", padding: "80px 20px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 4, color: "#7A9BFF", marginBottom: 8 }}>PRICING</div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", letterSpacing: -1 }}>합리적인 요금제</h2>
            </div>
            <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {PLANS.map(plan => (
                <div key={plan.name} style={{
                  background: plan.popular ? "linear-gradient(135deg, #FF3B1E 0%, #FF6B4A 100%)" : "rgba(255,255,255,0.05)",
                  border: `2px solid ${plan.popular ? "#FF3B1E" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 22, padding: "32px 26px", position: "relative",
                }}>
                  {plan.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#FEE500", color: "#3C1E1E", padding: "4px 16px", borderRadius: 100, fontSize: 11, fontWeight: 800 }}>🔥 BEST</div>}
                  <div style={{ fontSize: 16, fontWeight: 800, color: plan.popular ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)", marginBottom: 8 }}>{plan.name}</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: "white", marginBottom: 4 }}>{plan.price}<span style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>{plan.period ? `원/${plan.period}` : ""}</span></div>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "16px 0" }} />
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 0", fontSize: 14, color: plan.popular ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)", fontWeight: 400 }}>
                      <span style={{ color: plan.popular ? "#FEE500" : plan.color }}>✓</span> {f}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section style={{ maxWidth: 700, margin: "0 auto", padding: "80px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#FF3B1E" }}>자주 묻는 질문</h2>
          </div>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid #E0DDD7", padding: "18px 0" }}>
              <button onClick={() => setShowFaq(showFaq === i ? null : i)} style={{
                width: "100%", textAlign: "left", background: "transparent", border: "none",
                fontSize: 16, fontWeight: 800, color: "#1A1A1A", padding: 0, display: "flex",
                justifyContent: "space-between", alignItems: "center",
              }}>
                {faq.q}
                <span style={{ fontSize: 18, color: "#CCC", transform: showFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
              </button>
              {showFaq === i && (
                <p style={{ fontSize: 14, color: "#666", fontWeight: 400, lineHeight: 1.8, marginTop: 12 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </section>

        {/* ═══ CTA ═══ */}
        <section id="apply" style={{ background: "linear-gradient(135deg, #0055FF 0%, #0099FF 100%)", padding: "80px 32px", textAlign: "center" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "white", marginBottom: 12, letterSpacing: -1 }}>
              지금 바로 시작하세요
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", fontWeight: 400, lineHeight: 1.8, marginBottom: 32 }}>
              광주 지역 1위 중고차 플랫폼, 픽스카의 딜러가 되어보세요.<br />6개월 무료 · 프리미엄 3슬롯 무료
            </p>
            <Link href="/dealer">
              <button style={{ padding: "20px 48px", background: "white", color: "#0055FF", border: "none", borderRadius: 14, fontSize: 18, fontWeight: 800, cursor: "pointer" }}>
                딜러 신청하기
              </button>
            </Link>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 16, fontWeight: 400 }}>
              문의: 062-000-0000 (평일 09:00~18:00)
            </p>
          </div>
        </section>

        {/* 푸터 */}
        <footer style={{ background: "#1A1A1A", padding: "40px 32px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontFamily: "'Bebas Neue',serif", fontSize: 22, letterSpacing: 2 }}>
              <span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "white" }}>CAR</span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>
              © 2025 픽스카 FIXCAR · 광주광역시 중고차 정찰제 플랫폼
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <Link href="/privacy" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>개인정보처리방침</Link>
              <Link href="/terms" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>이용약관</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
