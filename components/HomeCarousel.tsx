"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const SLIDES = [
  {
    id: 1,
    badge: "NEW",
    badgeColor: "#FF3B1E",
    title: "내게 온 동네 PICK",
    subtitle: "직접 발품 안 팔아도, 조건만 등록하면 바로 알림",
    desc: "희망 차량 조건 등록하면 매물이 올라올 때 카카오톡으로 알려드려요. 놓칠 걱정 없이 편하게!",
    cta: "알림 등록하기",
    href: "/mypage#alert",
    bg: "linear-gradient(135deg, #1A1A1A 0%, #2D1A2E 100%)",
    emoji: "🔔",
  },
  {
    id: 2,
    badge: "AI",
    badgeColor: "#1847FF",
    title: "AI가 찾아주는 내 차",
    subtitle: "조건만 이야기해도 원하는 차량, 원하는 가격대로 한번에",
    desc: "12가지 성향 질문으로 나에게 딱 맞는 차를 추천받아 보세요. 2~3분이면 충분해요!",
    cta: "MBTI 시작하기",
    href: "/mbti",
    bg: "linear-gradient(135deg, #0f3460 0%, #1A1A2E 100%)",
    emoji: "🧬",
  },
  {
    id: 3,
    badge: "FIX",
    badgeColor: "#00C471",
    title: "FIX 정찰가, 흥정 없이 편하게",
    subtitle: "표시 가격이 곧 최종 가격. 숨은 비용 0원",
    desc: "모든 매물은 100항목 직접 검수 완료. 3일 이내 환불 보장까지. 믿고 살 수 있어요.",
    cta: "매물 보러가기",
    href: "/cars",
    bg: "linear-gradient(135deg, #FF3B1E 0%, #C41E08 100%)",
    emoji: "🔒",
  },
  {
    id: 4,
    badge: "DEALER",
    badgeColor: "#0066FF",
    title: "딜러님, 픽스카에서 매물 올려보세요",
    subtitle: "6개월 무료 등록 · 프리미엄 3슬롯 무료 · 광주 1위 플랫폼",
    desc: "광주 지역 중고차 딜러라면 지금 바로 신청하세요. 매물 등록부터 고객 문의까지 한 곳에서!",
    cta: "딜러 신청하기",
    href: "/dealer/apply",
    bg: "linear-gradient(135deg, #0055FF 0%, #0099FF 100%)",
    emoji: "🏪",
  },
];

export default function HomeCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const next = useCallback(() => setCurrent(p => (p + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent(p => (p - 1 + SLIDES.length) % SLIDES.length), []);

  /* 자동 슬라이드 */
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  /* 터치 스와이프 */
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  };

  const slide = SLIDES[current];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div style={{
        background: slide.bg,
        padding: "60px 52px",
        minHeight: 340,
        display: "flex",
        alignItems: "center",
        transition: "background 0.6s ease",
        position: "relative",
      }}>
        {/* 배경 데코 */}
        <div style={{ position: "absolute", right: -30, bottom: -30, fontSize: 200, opacity: 0.06, pointerEvents: "none", userSelect: "none" }}>{slide.emoji}</div>

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          {/* 좌측 콘텐츠 */}
          <div style={{ flex: "1 1 400px" }}>
            <div style={{ display: "inline-block", background: slide.badgeColor, color: "white", padding: "5px 14px", borderRadius: 100, fontSize: 12, fontWeight: 800, letterSpacing: 1, marginBottom: 16 }}>
              {slide.badge}
            </div>
            <h2 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 10, letterSpacing: -1 }}>
              {slide.title}
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: 8 }}>
              {slide.subtitle}
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontWeight: 400, lineHeight: 1.7, marginBottom: 24, maxWidth: 440 }}>
              {slide.desc}
            </p>
            <Link href={slide.href}>
              <button style={{
                padding: "14px 32px", background: "white", color: "#1A1A1A", border: "none",
                borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer",
                fontFamily: "'NanumSquareRound',sans-serif",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}>
                {slide.cta} →
              </button>
            </Link>
          </div>

          {/* 우측 이모지 */}
          <div style={{ flex: "0 0 auto", fontSize: 120, opacity: 0.3, display: "flex", alignItems: "center" }}>
            {slide.emoji}
          </div>
        </div>

        {/* 좌우 화살표 */}
        <button onClick={prev} style={{
          position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
          width: 44, height: 44, borderRadius: "50%", border: "none",
          background: "rgba(255,255,255,0.1)", color: "white", fontSize: 20,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>‹</button>
        <button onClick={next} style={{
          position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
          width: 44, height: 44, borderRadius: "50%", border: "none",
          background: "rgba(255,255,255,0.1)", color: "white", fontSize: 20,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>›</button>
      </div>

      {/* 인디케이터 */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "16px 0", background: "#F0EEE9" }}>
        {SLIDES.map((s, i) => (
          <button key={s.id} onClick={() => setCurrent(i)} style={{
            width: current === i ? 28 : 8, height: 8, borderRadius: 100, border: "none",
            background: current === i ? "#FF3B1E" : "#D8D6D1",
            cursor: "pointer", transition: "all 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}
