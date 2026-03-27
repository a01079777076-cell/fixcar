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
    badgeColor: "#FF3B1E",
    title: "나, 이 차로 픽했어, 픽스카",
    highlight: "픽",
    subtitle: "데이터기반 고객맞춤으로 추천부터,",
    desc: <>대기하면 <span style={{background:"rgba(255,203,30,0.3)",padding:"1px 6px",borderRadius:4,color:"rgb(255,220,50)",fontWeight:700}}>💛 카톡 알람으로</span> 안내까지!</>,
    cta: "매물 보러가기",
    href: "/cars",
    overlay: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.65))",
  },
  {
    id: 2,
    type: "color" as const,
    bg: "linear-gradient(135deg, #0f3460 0%, #1A1A2E 100%)",
    image: "",
    badge: "AI",
    badgeColor: "#1847FF",
    title: "AI가 찾아주는 내 차",
    highlight: "AI",
    subtitle: "조건만 이야기해도 원하는 차량, 원하는 가격대로",
    desc: <>12가지 성향 질문으로 나에게 딱 맞는 차를 추천받아 보세요. <span style={{color:"rgba(255,255,255,0.5)"}}>2~3분이면 충분해요!</span></>,
    cta: "MBTI 시작하기",
    href: "/mbti",
    overlay: "",
  },
  {
    id: 3,
    type: "color" as const,
    bg: "linear-gradient(135deg, #FF3B1E 0%, #C41E08 100%)",
    image: "",
    badge: "FIX",
    badgeColor: "rgba(255,255,255,0.25)",
    title: "FIX 정찰가, 흥정 없이 편하게",
    highlight: "FIX",
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
    badge: "NEW",
    badgeColor: "#FF3B1E",
    title: "내게 온 동네 PICK",
    highlight: "",
    subtitle: "직접 발품 안 팔아도, 조건만 등록하면 바로 알림",
    desc: <>희망 차량 조건 등록하면 매물이 올라올 때 <span style={{color:"rgb(255,220,50)",fontWeight:700}}>💛 카카오톡</span>으로 알려드려요.</>,
    cta: "알림 등록하기",
    href: "/mypage#alert",
    overlay: "",
  },
  {
    id: 5,
    type: "color" as const,
    bg: "linear-gradient(135deg, #0055FF 0%, #0099FF 100%)",
    image: "",
    badge: "DEALER",
    badgeColor: "rgba(255,255,255,0.2)",
    title: "딜러님, 픽스카에서 매물 올려보세요",
    highlight: "",
    subtitle: "오픈 프로모션 무료등록 · 광주 1위 플랫폼",
    desc: <>광주 지역 중고차 딜러라면 지금 바로 신청하세요. <span style={{color:"rgba(255,255,255,0.6)"}}>매물 등록부터 고객 문의까지 한 곳에서!</span></>,
    cta: "딜러 신청하기",
    href: "/dealer/apply",
    overlay: "",
  },
];

export default function HomeCarousel() {
  const [current, setCurrent]   = useState(0);
  const [paused,  setPaused]    = useState(false);
  const touchStartX = useRef(0);

  const next = useCallback(() => setCurrent(p => (p + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent(p => (p - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = SLIDES[current];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => { const d = touchStartX.current - e.changedTouches[0].clientX; if(Math.abs(d)>50) d>0?next():prev(); }}
      style={{ position:"relative", overflow:"hidden" }}
    >
      {/* 배너 */}
      <div style={{
        height:"clamp(340px,45vw,520px)",
        position:"relative", overflow:"hidden",
        display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
        textAlign:"center", padding:"40px 20px 80px",
        background: slide.type==="color" ? slide.bg : undefined,
        transition: "background 0.6s ease",
      }}>
        {/* 배경 이미지 (슬라이드 1) */}
        {slide.type==="image" && slide.image && (
          <Image src={slide.image} alt="픽스카 메인배너" fill priority sizes="100vw" style={{ objectFit:"cover", zIndex:0 }}/>
        )}
        {/* 오버레이 */}
        {(slide.overlay || slide.type==="image") && (
          <div style={{ position:"absolute", inset:0, background: slide.overlay||"linear-gradient(to bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.6))", zIndex:1 }}/>
        )}

        {/* 콘텐츠 */}
        <div style={{ position:"relative", zIndex:2 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background: slide.badgeColor.startsWith("rgba")||slide.badgeColor==="transparent" ? slide.badgeColor : "rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", borderRadius:100, padding:"6px 18px", marginBottom:18 }}>
            <span style={{ fontSize:12, fontWeight:800, color:"white", letterSpacing:1 }}>{slide.badge}</span>
          </div>
          <h1 style={{ fontFamily:"'Black Han Sans',sans-serif", fontSize:"clamp(26px,5vw,52px)", fontWeight:400, color:"white", lineHeight:1.2, letterSpacing:-1, marginBottom:12 }}>
            {slide.title}
          </h1>
          <p style={{ fontSize:"clamp(13px,2vw,17px)", color:"rgba(255,255,255,0.75)", fontWeight:400, lineHeight:1.8, marginBottom:8 }}>
            {slide.subtitle}
          </p>
          <p style={{ fontSize:"clamp(12px,1.5vw,15px)", color:"rgba(255,255,255,0.65)", lineHeight:1.7, marginBottom:28 }}>
            {slide.desc}
          </p>
          <Link href={slide.href}>
            <button style={{ padding:"14px 32px", background:"white", color:"#1A1A1A", border:"none", borderRadius:12, fontSize:"clamp(13px,1.5vw,15px)", fontWeight:800, cursor:"pointer", fontFamily:"'NanumSquareRound',sans-serif", display:"inline-flex", alignItems:"center", gap:8 }}>
              {slide.cta} <ArrowRight size={15}/>
            </button>
          </Link>
        </div>

        {/* 좌우 화살표 */}
        <button onClick={prev} style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", width:44, height:44, borderRadius:"50%", border:"none", background:"rgba(255,255,255,0.15)", color:"white", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:3, backdropFilter:"blur(4px)" }}>‹</button>
        <button onClick={next} style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", width:44, height:44, borderRadius:"50%", border:"none", background:"rgba(255,255,255,0.15)", color:"white", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:3, backdropFilter:"blur(4px)" }}>›</button>
      </div>

      {/* 인디케이터 */}
      <div style={{ display:"flex", justifyContent:"center", gap:8, padding:"14px 0", background:"#F0EEE9" }}>
        {SLIDES.map((s, i) => (
          <button key={s.id} onClick={() => setCurrent(i)} style={{ width:i===current?28:8, height:8, borderRadius:100, border:"none", background:i===current?"#FF3B1E":"#D8D6D1", cursor:"pointer", transition:"all 0.3s", padding:0 }}/>
        ))}
      </div>
    </div>
  );
}
