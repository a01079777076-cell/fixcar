// ═══════════════════════════════════════════════════
// 📁 저장 경로: components/HomeCarousel.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SLIDES = [
  {
    id: 1, type: "image" as const, bg: "", image: "/mainbanner.png",
    badge: "광주 No.1",
    title: "나, 이 차로 픽했어, 픽스카",
    subtitle: "데이터기반 고객맞춤으로 추천부터,",
    desc: <>대기하면 <span style={{background:"rgba(255,203,30,0.3)",padding:"1px 6px",borderRadius:4,color:"rgb(255,230,60)",fontWeight:800}}>💛 카톡 알람으로</span> 안내까지!</>,
    cta: "매물 보러가기", href: "/cars",
  },
  {
    id: 2, type: "color" as const, bg: "linear-gradient(135deg,#0f3460 0%,#1A1A2E 100%)", image: "",
    badge: "NEW AI",
    title: "광주 첫 상륙! 딜러님, 오픈기념 무료로 촬영, 매물 올려드릴게요",
    subtitle: "오픈 프로모션 무료등록 · 광주 AI 1위 플랫폼",
    desc: <>찾아가서 매물등록까지 한번에 다 해드립니다.<br/><span style={{color:"rgba(255,255,255,0.5)"}}>전화주세요! 010-0000-4989</span></>,
    cta: "딜러 등록하기", href: "/dealer/apply",
  },
  {
    id: 3, type: "color" as const, bg: "linear-gradient(135deg,#FF3B1E 0%,#C41E08 100%)", image: "",
    badge: "FIX",
    title: "FIX 정찰가, 흥정 없이 편하게",
    subtitle: "표시 가격이 곧 최종 가격. 숨은 비용 0원",
    desc: <>모든 매물은 100항목 직접 검수 완료. <span style={{color:"rgba(255,255,255,0.6)"}}>3일 이내 환불 보장.</span></>,
    cta: "매물 보러가기", href: "/cars",
  },
  {
    id: 4, type: "color" as const, bg: "linear-gradient(135deg,#1A1A1A 0%,#2D1A2E 100%)", image: "",
    badge: "개인거래 대행 서비스",
    title: "개인거래 하시나요? 전문가에게 부탁하세요!",
    subtitle: "매년 직거래 사기 피해 수천 건.",
    desc: <>딜러에게 믿고 맡겨보세요.<br/><span style={{color:"rgba(255,255,255,0.5)"}}>계약서 작성 · 명의이전 · 차량 상태 확인까지</span></>,
    cta: "거래대행 서비스 구경하기", href: "/agent",
  },
  {
    id: 5, type: "color" as const, bg: "linear-gradient(135deg,#0055FF 0%,#0099FF 100%)", image: "",
    badge: "DEALER",
    title: "딜러님, 픽스카에서 매물 올려보세요",
    subtitle: "오픈 프로모션 무료등록 · 광주 1위 플랫폼",
    desc: <>광주 지역 중고차 딜러라면 지금 바로 신청하세요.<br/><span style={{color:"rgba(255,255,255,0.6)"}}>매물 등록부터 고객 문의까지 한 곳에서!</span></>,
    cta: "딜러 신청하기", href: "/dealer/apply",
  },
];

const INTERVAL       = 5000;
const SNAP_THRESHOLD = 80;      /* px — 이 이상 드래그하면 페이지 전환 */
const SLIDE_PCT      = 100 / 3; /* ≈ 33.333 — track 기준 1슬라이드 이동량 */
const DRAG_MAX       = SLIDE_PCT * 1.5; /* 드래그 저항 한계 (~50%) */
const TRANSITION_MS  = 350;

export default function HomeCarousel() {
  const [current,  setCurrent]  = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused,   setPaused]   = useState(false);

  /* 트랙 위치 (translateX % — track 기준) */
  const [offset,   setOffset]   = useState(0);
  const [animate,  setAnimate]  = useState(true);

  const dragStartX     = useRef(0);
  const isDragging     = useRef(false);
  const containerWidth = useRef(0); /* 뷰포트(컨테이너) 폭 px */
  const trackRef       = useRef<HTMLDivElement>(null);

  const N = SLIDES.length;

  /* ── 슬라이드 전환 (버튼 / 자동재생 용) ── */
  const goTo = useCallback((next: number, dir: "left"|"right"|"jump" = "left") => {
    const target = ((next % N) + N) % N;
    setAnimate(true);
    setOffset(dir === "left" ? -SLIDE_PCT : dir === "right" ? SLIDE_PCT : 0);
    setTimeout(() => {
      setAnimate(false);
      setCurrent(target);
      setOffset(0);
      requestAnimationFrame(() => setAnimate(true));
      setProgress(0);
    }, TRANSITION_MS);
  }, [N]);

  const next = useCallback(() => goTo(current + 1, "left"),  [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, "right"), [current, goTo]);

  /* ── 자동 슬라이드 + 게이지 ── */
  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const step = 50;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += step;
      setProgress(Math.min((elapsed / INTERVAL) * 100, 100));
      if (elapsed >= INTERVAL) next();
    }, step);
    return () => clearInterval(timer);
  }, [paused, current, next]);

  /* ── 컨테이너 폭 → 드래그 비율 계산용 ── */
  const measureContainer = () => {
    const trackPx = trackRef.current?.offsetWidth || window.innerWidth * 3;
    containerWidth.current = trackPx / 3;
  };

  /* ── 드래그 → offset 변환 (컨테이너 100% = SLIDE_PCT) ── */
  const pxToTrackPct = (px: number) =>
    (px / containerWidth.current) * SLIDE_PCT;

  /* ── 드래그 해제 → 스냅 (현재 위치에서 이어서 애니메이션) ── */
  const snapTo = (dir: "next" | "prev" | "reset") => {
    if (dir === "reset") {
      setAnimate(true);
      setOffset(0);
      setPaused(false);
      return;
    }
    /* 1) transition 프로퍼티만 켜기 (같은 offset → 시각 변화 없음) */
    setAnimate(true);
    /* 2) 다음 프레임에서 목표 offset 설정 → 드래그 위치에서 자연스럽게 이어짐 */
    requestAnimationFrame(() => {
      setOffset(dir === "next" ? -SLIDE_PCT : SLIDE_PCT);
    });
    /* 3) 트랜지션 완료 후 인덱스 교체 + offset 초기화 */
    setTimeout(() => {
      setAnimate(false);
      setCurrent(p => dir === "next" ? (p + 1) % N : ((p - 1) + N) % N);
      setOffset(0);
      requestAnimationFrame(() => setAnimate(true));
      setProgress(0);
      setPaused(false);
    }, TRANSITION_MS + 30); /* rAF 지연분 보상 */
  };

  /* ── 마우스 드래그 ── */
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    measureContainer();
    setAnimate(false);
    setPaused(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const pct = pxToTrackPct(e.clientX - dragStartX.current);
    setOffset(Math.max(-DRAG_MAX, Math.min(DRAG_MAX, pct)));
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = e.clientX - dragStartX.current;
    if (diff < -SNAP_THRESHOLD)      snapTo("next");
    else if (diff > SNAP_THRESHOLD)  snapTo("prev");
    else                              snapTo("reset");
  };

  const onMouseLeave = (e: React.MouseEvent) => {
    if (isDragging.current) onMouseUp(e);
    setPaused(false);
  };

  /* ── 터치 드래그 ── */
  const touchStartX = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    measureContainer();
    setAnimate(false);
    setPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const pct = pxToTrackPct(e.touches[0].clientX - touchStartX.current);
    setOffset(Math.max(-DRAG_MAX, Math.min(DRAG_MAX, pct)));
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -SNAP_THRESHOLD)      snapTo("next");
    else if (diff > SNAP_THRESHOLD)  snapTo("prev");
    else                              snapTo("reset");
  };

  /* 이전/다음 슬라이드 인덱스 */
  const prevIdx = ((current - 1) + N) % N;
  const nextIdx = (current + 1) % N;

  const BANNER_H = "clamp(340px,45vw,520px)";

  return (
    <div style={{ position:"relative", overflow:"hidden" }}>
      {/* ══ 트랙 (3장 나란히 — 이전/현재/다음) ══ */}
      <div
        ref={trackRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          display: "flex",
          width: "300%",
          height: BANNER_H,
          transform: `translateX(${-SLIDE_PCT + offset}%)`,
          transition: animate ? `transform ${TRANSITION_MS}ms cubic-bezier(0.25,0.46,0.45,0.94)` : "none",
          cursor: isDragging.current ? "grabbing" : "grab",
          userSelect: "none",
          willChange: "transform",
        }}
      >
        {[prevIdx, current, nextIdx].map((idx, pos) => {
          const s = SLIDES[idx];
          return (
            <div
              key={`${pos}-${idx}`}
              style={{
                width: "33.333%",
                height: "100%",
                position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", textAlign: "center",
                padding: "40px 20px 80px",
                background: s.type === "color" ? s.bg : undefined,
                flexShrink: 0,
              }}
            >
              {/* 배경 이미지 */}
              {s.type === "image" && s.image && (
                <Image src={s.image} alt={s.title} fill sizes="100vw" style={{ objectFit:"cover", zIndex:0, pointerEvents:"none" }} priority={pos === 1}/>
              )}
              {/* 오버레이 */}
              {s.type === "image" && (
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.65))", zIndex:1, pointerEvents:"none" }}/>
              )}

              {/* 콘텐츠 */}
              <div style={{ position:"relative", zIndex:2, pointerEvents: pos === 1 ? "auto" : "none" }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", borderRadius:100, padding:"6px 18px", marginBottom:16 }}>
                  <span style={{ fontSize:12, fontWeight:800, color:"white", letterSpacing:1 }}>{s.badge}</span>
                </div>
                <h1 style={{ fontFamily:"'Black Han Sans',sans-serif", fontSize:"clamp(20px,3.5vw,44px)", fontWeight:400, color:"white", lineHeight:1.2, letterSpacing:-1, marginBottom:10, maxWidth:680, wordBreak:"keep-all" }}>
                  {s.title}
                </h1>
                <p style={{ fontSize:"clamp(12px,1.6vw,15px)", color:"rgba(255,255,255,0.8)", fontWeight:600, marginBottom:6, wordBreak:"keep-all" }}>
                  {s.subtitle}
                </p>
                <p style={{ fontSize:"clamp(11px,1.3vw,13px)", color:"rgba(255,255,255,0.6)", lineHeight:1.8, marginBottom:22, wordBreak:"keep-all" }}>
                  {s.desc}
                </p>
                {pos === 1 && (
                  <Link href={s.href}>
                    <button style={{ padding:"12px 26px", background:"white", color:"#1A1A1A", border:"none", borderRadius:12, fontSize:"clamp(13px,1.4vw,15px)", fontWeight:800, cursor:"pointer", fontFamily:"'NanumSquareRound',sans-serif", display:"inline-flex", alignItems:"center", gap:8 }}>
                      {s.cta} <ArrowRight size={14}/>
                    </button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ══ 좌우 화살표 ══ */}
      <button
        onClick={prev}
        style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", width:44, height:44, borderRadius:"50%", border:"none", background:"rgba(255,255,255,0.15)", color:"white", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:10, backdropFilter:"blur(4px)" }}
      >‹</button>
      <button
        onClick={next}
        style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", width:44, height:44, borderRadius:"50%", border:"none", background:"rgba(255,255,255,0.15)", color:"white", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:10, backdropFilter:"blur(4px)" }}
      >›</button>

      {/* ══ 인디케이터 + 게이지바 (배너 내부 하단) ══ */}
      <div style={{ position:"absolute", bottom:16, left:0, right:0, zIndex:10, display:"flex", alignItems:"center", justifyContent:"center", gap:12, padding:"0 60px" }}>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setAnimate(true); setCurrent(i); setProgress(0); }}
              style={{ width:i===current?20:6, height:6, borderRadius:100, border:"none", background:i===current?"white":"rgba(255,255,255,0.4)", cursor:"pointer", transition:"all 0.3s", padding:0, flexShrink:0 }}
            />
          ))}
        </div>
        {/* 게이지바 */}
        <div style={{ flex:1, maxWidth:120, height:3, background:"rgba(255,255,255,0.25)", borderRadius:100, overflow:"hidden", marginLeft:"auto" }}>
          <div style={{ height:"100%", width:`${progress}%`, background:"white", borderRadius:100, transition:"width 0.05s linear" }}/>
        </div>
        <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.6)", whiteSpace:"nowrap" }}>
          {current + 1} / {SLIDES.length}
        </div>
      </div>
    </div>
  );
}
