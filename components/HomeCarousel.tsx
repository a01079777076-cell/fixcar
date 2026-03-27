"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    type: "image" as const,
    bg: "",
    image: "/mainbanner.png",
    badge: "광주 No.1",
    title: "나, 이 차로 픽했어, 픽스카",
    subtitle: "데이터기반 고객맞춤으로 추천부터,",
    desc: <>대기하면 <span style={{background:"rgba(255,203,30,0.3)",padding:"1px 6px",borderRadius:4,color:"rgb(255,230,60)",fontWeight:800}}>💛 카톡 알람으로</span> 안내까지!</>,
    cta: "매물 보러가기",
    href: "/cars",
    overlay: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.65))",
  },
  {
    id: 2,
    type: "color" as const,
    bg: "linear-gradient(135deg, #0f3460 0%, #1A1A2E 100%)",
    image: "",
    badge: "NEW AI",
    title: "광주 첫 상륙! 딜러님, 오픈기념 무료로 촬영, 매물 올려드릴게요",
    subtitle: "오픈 프로모션 무료등록 · 광주 AI 1위 플랫폼",
    desc: <>찾아가서 매물등록까지 한번에 다 해드립니다.<br/><span style={{color:"rgba(255,255,255,0.5)"}}>전화주세요! 010-0000-4989</span></>,
    cta: "딜러 등록하기",
    href: "/dealer/apply",
    overlay: "",
  },
  {
    id: 3,
    type: "color" as const,
    bg: "linear-gradient(135deg, #FF3B1E 0%, #C41E08 100%)",
    image: "",
    badge: "FIX",
    title: "FIX 정찰가, 흥정 없이 편하게",
    subtitle: "표시 가격이 곧 최종 가격. 숨은 비용 0원",
    desc: <>모든 매물은 100항목 직접 검수 완료. <span style={{color:"rgba(255,255,255,0.6)"}}>3일 이내 환불 보장.</span></>,
    cta: "매물 보러가기",
    href: "/cars",
    overlay: "",
  },
  {
    id: 4,
    type: "color" as const,
    bg: "linear-gradient(135deg, #1A1A1A 0%, #2D1A2E 100%)",
    image: "",
    badge: "개인거래 대행 서비스",
    title: "개인거래 하시나요? 전문가에게 부탁하세요!",
    subtitle: "매년 직거래 사기 피해 수천 건.",
    desc: <>딜러에게 믿고 맡겨보세요.<br/><span style={{color:"rgba(255,255,255,0.5)"}}>계약서 작성 · 명의이전 · 차량 상태 확인까지</span></>,
    cta: "거래대행 서비스 구경하기",
    href: "/agent",
    overlay: "",
  },
  {
    id: 5,
    type: "color" as const,
    bg: "linear-gradient(135deg, #0055FF 0%, #0099FF 100%)",
    image: "",
    badge: "DEALER",
    title: "딜러님, 픽스카에서 매물 올려보세요",
    subtitle: "오픈 프로모션 무료등록 · 광주 1위 플랫폼",
    desc: <>광주 지역 중고차 딜러라면 지금 바로 신청하세요.<br/><span style={{color:"rgba(255,255,255,0.6)"}}>매물 등록부터 고객 문의까지 한 곳에서!</span></>,
    cta: "딜러 신청하기",
    href: "/dealer/apply",
    overlay: "",
  },
];

const INTERVAL = 5000; // 5초

export default function HomeCarousel() {
  const [current,  setCurrent]  = useState(0);
  const [paused,   setPaused]   = useState(false);
  const [progress, setProgress] = useState(0);

  /* 마우스 드래그 */
  const dragStartX  = useRef(0);
  const isDragging  = useRef(false);

  /* 터치 */
  const touchStartX = useRef(0);

  const next = useCallback(() => { setCurrent(p => (p + 1) % SLIDES.length); setProgress(0); }, []);
  const prev = useCallback(() => { setCurrent(p => (p - 1 + SLIDES.length) % SLIDES.length); setProgress(0); }, []);
  const goTo = (i: number) => { setCurrent(i); setProgress(0); };

  /* 자동 슬라이드 + 게이지 */
  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const step   = 50; // ms
    const total  = INTERVAL;
    let elapsed  = 0;
    const timer  = setInterval(() => {
      elapsed += step;
      setProgress(Math.min((elapsed / total) * 100, 100));
      if (elapsed >= total) { next(); }
    }, step);
    return () => clearInterval(timer);
  }, [paused, current, next]);

  /* 마우스 드래그 핸들러 */
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };
  const onMouseLeaveHandler = (e: React.MouseEvent) => {
    if (isDragging.current) {
      isDragging.current = false;
      const diff = dragStartX.current - e.clientX;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    }
    setPaused(false);
  };

  /* 터치 핸들러 */
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  const slide = SLIDES[current];

  return (
    <div style={{ position:"relative", overflow:"hidden" }}>
      {/* ══ 배너 영역 ══ */}
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={onMouseLeaveHandler}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          height: "clamp(340px,45vw,520px)",
          position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
          textAlign: "center", padding: "40px 20px 80px",
          background: slide.type === "color" ? slide.bg : undefined,
          transition: "background 0.6s ease",
          cursor: "grab",
          userSelect: "none",
        }}
      >
        {/* 배경 이미지 */}
        {slide.type === "image" && slide.image && (
          <Image src={slide.image} alt="픽스카 메인배너" fill priority sizes="100vw" style={{ objectFit:"cover", zIndex:0, pointerEvents:"none" }}/>
        )}
        {(slide.overlay || slide.type === "image") && (
          <div style={{ position:"absolute", inset:0, background:slide.overlay||"linear-gradient(to bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.6))", zIndex:1, pointerEvents:"none" }}/>
        )}

        {/* 콘텐츠 */}
        <div style={{ position:"relative", zIndex:2, pointerEvents:"none" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", borderRadius:100, padding:"6px 18px", marginBottom:16 }}>
            <span style={{ fontSize:12, fontWeight:800, color:"white", letterSpacing:1 }}>{slide.badge}</span>
          </div>
          <h1 style={{ fontFamily:"'Black Han Sans',sans-serif", fontSize:"clamp(22px,4vw,46px)", fontWeight:400, color:"white", lineHeight:1.2, letterSpacing:-1, marginBottom:10, maxWidth:700, wordBreak:"keep-all" }}>
            {slide.title}
          </h1>
          <p style={{ fontSize:"clamp(13px,1.8vw,16px)", color:"rgba(255,255,255,0.8)", fontWeight:600, marginBottom:6, wordBreak:"keep-all" }}>
            {slide.subtitle}
          </p>
          <p style={{ fontSize:"clamp(12px,1.4vw,14px)", color:"rgba(255,255,255,0.65)", lineHeight:1.8, marginBottom:24, wordBreak:"keep-all" }}>
            {slide.desc}
          </p>
          <div style={{ pointerEvents:"auto" }}>
            <Link href={slide.href}>
              <button style={{ padding:"13px 28px", background:"white", color:"#1A1A1A", border:"none", borderRadius:12, fontSize:"clamp(13px,1.5vw,15px)", fontWeight:800, cursor:"pointer", fontFamily:"'NanumSquareRound',sans-serif", display:"inline-flex", alignItems:"center", gap:8 }}>
                {slide.cta} <ArrowRight size={15}/>
              </button>
            </Link>
          </div>
        </div>

        {/* 좌우 화살표 */}
        <button onClick={prev} style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", width:44, height:44, borderRadius:"50%", border:"none", background:"rgba(255,255,255,0.15)", color:"white", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:3, backdropFilter:"blur(4px)", pointerEvents:"auto" }}>‹</button>
        <button onClick={next} style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", width:44, height:44, borderRadius:"50%", border:"none", background:"rgba(255,255,255,0.15)", color:"white", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:3, backdropFilter:"blur(4px)", pointerEvents:"auto" }}>›</button>

        {/* ══ 인디케이터 + 게이지바 — 배너 내부 하단 ══ */}
        <div style={{ position:"absolute", bottom:16, left:0, right:0, zIndex:4, display:"flex", alignItems:"center", justifyContent:"center", gap:12, padding:"0 60px", pointerEvents:"auto" }}>
          {/* 슬라이드 점 */}
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                style={{ width:i===current?20:6, height:6, borderRadius:100, border:"none", background:i===current?"white":"rgba(255,255,255,0.4)", cursor:"pointer", transition:"all 0.3s", padding:0, flexShrink:0 }}
              />
            ))}
          </div>

          {/* 진행 게이지바 — 오른쪽 하단 */}
          <div style={{ flex:1, maxWidth:120, height:3, background:"rgba(255,255,255,0.25)", borderRadius:100, overflow:"hidden", marginLeft:"auto" }}>
            <div style={{ height:"100%", width:`${progress}%`, background:"white", borderRadius:100, transition:"width 0.05s linear" }}/>
          </div>

          {/* 슬라이드 카운터 */}
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.6)", whiteSpace:"nowrap" }}>
            {current + 1} / {SLIDES.length}
          </div>
        </div>
      </div>
    </div>
  );
}
