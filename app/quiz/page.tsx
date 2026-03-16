"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Car, Zap, Users, MapPin, Gauge, DollarSign, Lock, ArrowRight, CheckCircle, RotateCcw, Heart } from "lucide-react";

const STEPS = [
  {
    id: "budget",
    question: "예산이 얼마나 되세요?",
    sub: "월 할부금 기준으로 선택해도 돼요",
    type: "single",
    options: [
      { label: "500만원 이하", sublabel: "월 10만원대", value: 500, icon: "🪙", color: "#F8F6F2", border: "#E0DDD7" },
      { label: "500~1,000만원", sublabel: "월 20만원대", value: 1000, icon: "💵", color: "#FFF8EC", border: "#FFD89A" },
      { label: "1,000~2,000만원", sublabel: "월 40만원대", value: 2000, icon: "💶", color: "#EEF2FF", border: "#B8C8FF" },
      { label: "2,000만원 이상", sublabel: "월 50만원 이상", value: 5000, icon: "💳", color: "#FFF0ED", border: "#FFB8A8" },
    ],
  },
  {
    id: "purpose",
    question: "주로 어디에 쓸 예정인가요?",
    sub: "솔직하게 골라주세요! 더 잘 맞는 차를 찾아드려요",
    type: "single",
    options: [
      { label: "출퇴근·도심", sublabel: "주차 쉽고 연비 좋게", value: "commute", icon: "🏙️", color: "#EEF2FF", border: "#B8C8FF" },
      { label: "장거리 여행", sublabel: "편안하고 넓게", value: "travel", icon: "🗺️", color: "#EAF6EF", border: "#A8DACB" },
      { label: "가족·카풀", sublabel: "넓고 안전하게", value: "family", icon: "👨‍👩‍👧", color: "#FFF8EC", border: "#FFD89A" },
      { label: "캠핑·아웃도어", sublabel: "짐 많이, 어디든", value: "outdoor", icon: "⛰️", color: "#F0F9FF", border: "#A8D8F0" },
    ],
  },
  {
    id: "experience",
    question: "운전 경력이 어떻게 되세요?",
    sub: "솔직할수록 더 좋은 차를 추천해드려요",
    type: "single",
    options: [
      { label: "초보 (1년 미만)", sublabel: "주차 쉬운 차 추천드려요", value: "beginner", icon: "🌱", color: "#EAF6EF", border: "#A8DACB" },
      { label: "보통 (1~5년)", sublabel: "다양한 차 선택 가능", value: "intermediate", icon: "🌿", color: "#EEF2FF", border: "#B8C8FF" },
      { label: "베테랑 (5년+)", sublabel: "모든 차 추천 가능", value: "advanced", icon: "🌳", color: "#FFF0ED", border: "#FFB8A8" },
    ],
  },
  {
    id: "passengers",
    question: "주로 몇 명이 탑승하나요?",
    sub: "가장 자주 타는 인원으로 선택해주세요",
    type: "single",
    options: [
      { label: "나 혼자", sublabel: "1인 위주", value: 1, icon: "🧍", color: "#F8F6F2", border: "#E0DDD7" },
      { label: "2명 (커플·친구)", sublabel: "2인 기준", value: 2, icon: "👫", color: "#FFF8EC", border: "#FFD89A" },
      { label: "3~4명 (소가족)", sublabel: "뒷좌석 여유 필요", value: 4, icon: "👨‍👩‍👧", color: "#EAF6EF", border: "#A8DACB" },
      { label: "5명 이상", sublabel: "넉넉한 공간 필요", value: 5, icon: "👨‍👩‍👧‍👦", color: "#EEF2FF", border: "#B8C8FF" },
    ],
  },
  {
    id: "priority",
    question: "가장 중요하게 생각하는 게 뭔가요?",
    sub: "복수 선택 가능해요",
    type: "multi",
    options: [
      { label: "연비 (유지비 절약)", value: "efficiency", icon: "⛽", color: "#EAF6EF", border: "#A8DACB" },
      { label: "안전 (무사고·검수)", value: "safety", icon: "🛡️", color: "#FFF0ED", border: "#FFB8A8" },
      { label: "가격 (가성비)", value: "price", icon: "💰", color: "#FFF8EC", border: "#FFD89A" },
      { label: "넓은 공간 (트렁크)", value: "space", icon: "📦", color: "#EEF2FF", border: "#B8C8FF" },
      { label: "최신 옵션 (편의기능)", value: "options", icon: "✨", color: "#F0F9FF", border: "#A8D8F0" },
      { label: "주차 편의 (소형)", value: "parking", icon: "🅿️", color: "#F8F6F2", border: "#E0DDD7" },
    ],
  },
];

const RESULTS = [
  {
    id: 1, rank: 1, name: "현대 아반떼 CN7", year: "2021년식", mileage: "32,000km",
    fuel: "가솔린", price: 1450, monthly: 29,
    tags: ["무사고", "초보 추천", "1인 오너"],
    reason: "예산과 용도에 가장 잘 맞는 차예요. 연비가 좋고 주차가 쉬워서 초보에게 딱이에요.",
    score: 96, query: "hyundai+elantra+white+sedan",
    matchPoints: ["예산 범위 내", "주차 쉬운 소형", "연비 15.2km/L", "무사고 이력"],
  },
  {
    id: 6, rank: 2, name: "현대 엑센트", year: "2019년식", mileage: "68,000km",
    fuel: "가솔린", price: 680, monthly: 14,
    tags: ["무사고", "초보 추천", "주차 쉬움"],
    reason: "예산을 여유있게 쓸 수 있는 가성비 최강 옵션이에요. 유지비도 제일 저렴해요.",
    score: 89, query: "hyundai+accent+small+white+car",
    matchPoints: ["예산 여유", "가장 저렴한 유지비", "무사고", "작고 주차 편함"],
  },
  {
    id: 8, rank: 3, name: "현대 쏘나타 DN8", year: "2021년식", mileage: "41,000km",
    fuel: "가솔린", price: 2100, monthly: 42,
    tags: ["무사고", "넓은 실내", "초보 추천"],
    reason: "좀 더 넓고 편안한 드라이빙을 원한다면 이 차가 좋아요. 실내가 넉넉해요.",
    score: 82, query: "hyundai+sonata+white+sedan",
    matchPoints: ["넉넉한 실내", "최신 안전사양", "무사고", "부드러운 승차감"],
  },
];

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likedCars, setLikedCars] = useState<number[]>([]);

  const current = STEPS[step];
  const progress = ((step) / STEPS.length) * 100;
  const currentAnswer = answers[current?.id];
  const isMulti = current?.type === "multi";

  const isSelected = (val: string | number) => {
    if (isMulti) return Array.isArray(currentAnswer) && currentAnswer.includes(val as string);
    return currentAnswer === val;
  };

  const handleSelect = (val: string | number) => {
    if (isMulti) {
      const prev = (answers[current.id] as string[]) || [];
      const next = prev.includes(val as string)
        ? prev.filter(v => v !== val)
        : [...prev, val as string];
      setAnswers({ ...answers, [current.id]: next });
    } else {
      setAnswers({ ...answers, [current.id]: val });
      if (step < STEPS.length - 1) {
        setTimeout(() => setStep(s => s + 1), 280);
      }
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      setLoading(true);
      setTimeout(() => { setLoading(false); setShowResult(true); }, 1800);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleReset = () => {
    setStep(0); setAnswers({}); setShowResult(false); setLoading(false);
  };

  const toggleLike = (id: number) => {
    setLikedCars(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // 로딩 화면
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
          *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:'NanumSquareRound',sans-serif; background:#1A1A1A; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        `}</style>
        <div style={{ minHeight:"100vh", background:"#1A1A1A", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"32px" }}>
          <div style={{ width:"72px", height:"72px", border:"4px solid rgba(255,255,255,0.1)", borderTop:"4px solid #FF3B1E", borderRadius:"50%", animation:"spin 0.9s linear infinite" }} />
          <div style={{ textAlign:"center", animation:"fadeUp 0.5s ease" }}>
            <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"42px", color:"white", letterSpacing:"2px", marginBottom:"10px" }}>ANALYZING...</div>
            <div style={{ fontSize:"16px", color:"rgba(255,255,255,0.5)", fontWeight:400 }}>답변을 분석해서 최적의 차를 찾고 있어요</div>
          </div>
          <div style={{ display:"flex", gap:"14px" }}>
            {["예산 분석 중", "용도 매칭 중", "추천 생성 중"].map((t,i) => (
              <div key={t} style={{ padding:"8px 16px", background:"rgba(255,255,255,0.06)", borderRadius:"100px", fontSize:"13px", color:"rgba(255,255,255,0.4)", animation:`pulse 1.5s ease ${i*0.3}s infinite`, fontWeight:400 }}>{t}</div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // 결과 화면
  if (showResult) {
    return (
      <>
        <style>{`
          @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
          *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
          a { text-decoration:none; color:inherit; }
          button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
          @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
          .result-card { background:#fff; border-radius:22px; overflow:hidden; transition:all 0.25s; }
          .result-card:hover { transform:translateY(-4px); box-shadow:0 20px 50px rgba(0,0,0,0.1); }
          .result-card img { transition:transform 0.4s; display:block; }
          .result-card:hover img { transform:scale(1.04); }
          .nav-link:hover { color:#1A1A1A !important; }
          @media(max-width:900px) {
            .results-grid { grid-template-columns:1fr !important; }
            .nav-menu { display:none !important; }
          }
        `}</style>
        <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>

          {/* 공지 바 */}
          <div style={{ background:"#1A1A1A", color:"#fff", textAlign:"center", padding:"10px", fontSize:"13px", fontWeight:700 }}>
            <span style={{ color:"#FF7A63" }}>PICK</span> 맘에 드는 차를 픽하세요 &nbsp;·&nbsp;
            <span style={{ color:"#7A9BFF" }}>FIX</span> 정찰제 — 가격 흥정 없음
          </div>

          {/* 네비 */}
          <nav style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid #ECEAE4", height:"68px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 52px" }}>
            <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", letterSpacing:"3px" }}>
              <span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span>
            </a>
            <div className="nav-menu" style={{ display:"flex", gap:"36px" }}>
              {[["차 찾기","/cars"],["추천 퀴즈","/quiz"],["초보 가이드","/guide"],["내 차 팔기","/sell"]].map(([l,h])=>(
                <a key={l} href={h} className="nav-link" style={{ fontSize:"15px", fontWeight:700, color:"#888" }}>{l}</a>
              ))}
            </div>
            <a href="/login"><button style={{ background:"#FF3B1E", color:"#fff", border:"none", padding:"10px 22px", borderRadius:"100px", fontSize:"14px", fontWeight:800 }}>내 차 픽하기</button></a>
          </nav>

          {/* 결과 헤더 */}
          <div style={{ background:"#1A1A1A", padding:"52px 52px 44px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"360px", height:"360px", background:"radial-gradient(circle, rgba(255,59,30,0.12), transparent 65%)", borderRadius:"50%" }} />
            <div style={{ maxWidth:"1360px", margin:"0 auto", position:"relative", zIndex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"16px" }}>
                <div style={{ background:"#FF3B1E", borderRadius:"100px", padding:"6px 16px", fontSize:"12px", fontWeight:800, color:"white", letterSpacing:"1px" }}>✨ 추천 완료</div>
                <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.35)", fontWeight:400 }}>5가지 조건 분석 완료</div>
              </div>
              <h1 style={{ fontSize:"clamp(28px,4vw,52px)", fontWeight:800, color:"white", letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:"10px" }}>
                딱 맞는 차 <span style={{ color:"#FF3B1E" }}>3가지</span>를 픽했어요
              </h1>
              <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.45)", fontWeight:400 }}>
                예산 · 용도 · 경력 · 인원 · 우선순위를 분석해서 최적의 차를 찾았어요
              </p>
            </div>
          </div>

          {/* 결과 카드들 */}
          <div style={{ maxWidth:"1360px", margin:"0 auto", padding:"36px 52px 80px" }}>
            <div className="results-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"22px", marginBottom:"48px" }}>
              {RESULTS.map((car, i) => (
                <div key={car.id} className="result-card" style={{ animation:`fadeUp 0.6s ease ${i*0.15}s both` }}>
                  {/* 순위 배지 */}
                  <div style={{ position:"relative" }}>
                    <div style={{ height:"200px", overflow:"hidden" }}>
                      <img src={`https://source.unsplash.com/600x400/?${car.query}`} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
                    </div>
                    <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, background:"linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.3))" }} />
                    <div style={{ position:"absolute", top:14, left:14 }}>
                      <span style={{ background: i===0?"#FF3B1E":i===1?"#1A1A1A":"#888", color:"white", padding:"6px 14px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>
                        {i===0 ? "🏆 1순위 PICK" : i===1 ? "🥈 2순위" : "🥉 3순위"}
                      </span>
                    </div>
                    <button onClick={()=>toggleLike(car.id)} style={{ position:"absolute", top:12, right:12, width:"36px", height:"36px", background:likedCars.includes(car.id)?"#FF3B1E":"rgba(255,255,255,0.9)", border:"none", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
                      <Heart size={16} fill={likedCars.includes(car.id)?"white":"none"} color={likedCars.includes(car.id)?"white":"#1A1A1A"} />
                    </button>
                    {/* 매칭 점수 */}
                    <div style={{ position:"absolute", bottom:14, right:14, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)", borderRadius:"100px", padding:"5px 12px", display:"flex", alignItems:"center", gap:"5px" }}>
                      <div style={{ fontSize:"13px", fontWeight:800, color:"white" }}>{car.score}점</div>
                      <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.6)", fontWeight:400 }}>매칭</div>
                    </div>
                  </div>

                  <div style={{ padding:"20px 22px" }}>
                    <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"4px" }}>{car.name}</div>
                    <div style={{ fontSize:"13px", color:"#AAA", marginBottom:"14px", fontWeight:400 }}>{car.year} · {car.mileage} · {car.fuel}</div>

                    {/* 추천 이유 */}
                    <div style={{ background:"#FFF8F5", border:"1px solid #FFD8CC", borderRadius:"12px", padding:"12px 14px", marginBottom:"14px" }}>
                      <div style={{ fontSize:"11px", fontWeight:800, color:"#FF3B1E", marginBottom:"4px" }}>추천 이유</div>
                      <div style={{ fontSize:"13px", color:"#555", lineHeight:1.65, fontWeight:400 }}>{car.reason}</div>
                    </div>

                    {/* 매칭 포인트 */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"16px" }}>
                      {car.matchPoints.map(p => (
                        <span key={p} style={{ display:"flex", alignItems:"center", gap:"4px", background:"#EAF6EF", border:"1px solid #B8DFC8", padding:"4px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:700, color:"#2D8A52" }}>
                          <CheckCircle size={10} /> {p}
                        </span>
                      ))}
                    </div>

                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", paddingTop:"14px", borderTop:"1px solid #F0EEE9" }}>
                      <div>
                        <div style={{ fontSize:"26px", fontWeight:800, letterSpacing:"-0.5px" }}>{car.price.toLocaleString()}<span style={{ fontSize:"13px", fontWeight:700, color:"#AAA" }}>만원</span></div>
                        <div style={{ fontSize:"11px", color:"#1847FF", fontWeight:800, marginTop:"3px", display:"flex", alignItems:"center", gap:"4px" }}><Lock size={10}/> FIX · 월 {car.monthly}만원~</div>
                      </div>
                      <a href={`/cars/${car.id}`}>
                        <button style={{ background: i===0?"#FF3B1E":"#1A1A1A", color:"white", border:"none", padding:"11px 18px", borderRadius:"10px", fontSize:"13px", fontWeight:800, display:"flex", alignItems:"center", gap:"6px" }}>
                          자세히 보기 <ArrowRight size={13} />
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 버튼 */}
            <div style={{ display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" }}>
              <button onClick={handleReset} style={{ display:"flex", alignItems:"center", gap:"8px", background:"white", border:"2px solid #E0DDD7", padding:"14px 28px", borderRadius:"14px", fontSize:"15px", fontWeight:700 }}>
                <RotateCcw size={16} /> 다시 추천받기
              </button>
              <a href="/cars">
                <button style={{ display:"flex", alignItems:"center", gap:"8px", background:"#1A1A1A", color:"white", border:"none", padding:"14px 28px", borderRadius:"14px", fontSize:"15px", fontWeight:800 }}>
                  전체 매물 보기 <ArrowRight size={16} />
                </button>
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 퀴즈 화면
  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        .opt-card { transition:all 0.2s; cursor:pointer; border:2.5px solid; }
        .opt-card:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,0,0,0.08); }
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .step-content { animation:fadeIn 0.35s ease; }
        @media(max-width:700px) {
          .opts-grid { grid-template-columns:1fr 1fr !important; }
          .quiz-wrap { padding:36px 20px !important; }
        }
        @media(max-width:480px) {
          .opts-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9", display:"flex", flexDirection:"column" }}>

        {/* 헤더 */}
        <div style={{ background:"white", borderBottom:"1px solid #ECEAE4", padding:"0 52px", height:"68px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
          <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", letterSpacing:"3px" }}>
            <span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span>
          </a>
          <div style={{ fontSize:"14px", fontWeight:700, color:"#AAA" }}>
            {step + 1} / {STEPS.length} 단계
          </div>
          <a href="/cars" style={{ fontSize:"14px", fontWeight:700, color:"#888" }}>건너뛰기 →</a>
        </div>

        {/* 진행률 바 */}
        <div style={{ height:"4px", background:"#E8E6E0" }}>
          <div style={{ height:"4px", background:"linear-gradient(90deg, #FF3B1E, #FF7A63)", width:`${progress}%`, transition:"width 0.5s cubic-bezier(0.22,1,0.36,1)", borderRadius:"0 2px 2px 0" }} />
        </div>

        {/* 퀴즈 콘텐츠 */}
        <div className="quiz-wrap" style={{ flex:1, maxWidth:"760px", margin:"0 auto", width:"100%", padding:"52px 24px 80px", display:"flex", flexDirection:"column" }}>

          <div className="step-content" key={step}>
            {/* 단계 표시 */}
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"24px" }}>
              <div style={{ background:"#FF3B1E", color:"white", width:"32px", height:"32px", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:800, flexShrink:0 }}>{step + 1}</div>
              <div style={{ fontSize:"13px", color:"#AAA", fontWeight:600 }}>총 {STEPS.length}단계 중 {step + 1}번째 질문</div>
              {isMulti && <span style={{ background:"#EEF2FF", color:"#1847FF", padding:"3px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>복수 선택 가능</span>}
            </div>

            {/* 질문 */}
            <h1 style={{ fontSize:"clamp(26px,4vw,42px)", fontWeight:800, letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:"12px" }}>{current.question}</h1>
            <p style={{ fontSize:"16px", color:"#888", marginBottom:"36px", fontWeight:400 }}>{current.sub}</p>

            {/* 옵션 */}
            <div className="opts-grid" style={{ display:"grid", gridTemplateColumns: current.options.length <= 3 ? `repeat(${current.options.length},1fr)` : "repeat(2,1fr)", gap:"14px", marginBottom:"36px" }}>
              {current.options.map(opt => {
                const selected = isSelected(opt.value);
                return (
                  <div
                    key={String(opt.value)}
                    className="opt-card"
                    onClick={() => handleSelect(opt.value)}
                    style={{
                      padding:"24px 20px",
                      borderRadius:"18px",
                      background: selected ? "#FF3B1E" : opt.color,
                      borderColor: selected ? "#FF3B1E" : opt.border,
                      textAlign:"center",
                    }}
                  >
                    <div style={{ fontSize:"36px", marginBottom:"12px" }}>{opt.icon}</div>
                    <div style={{ fontSize:"17px", fontWeight:800, color: selected?"white":"#1A1A1A", marginBottom:"6px" }}>{opt.label}</div>
                    {"sublabel" in opt && <div style={{ fontSize:"13px", color: selected?"rgba(255,255,255,0.8)":"#888", fontWeight:400 }}>{(opt as {sublabel:string}).sublabel}</div>}
                    {selected && (
                      <div style={{ marginTop:"10px", display:"flex", justifyContent:"center" }}>
                        <CheckCircle size={20} color="white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 네비게이션 버튼 */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <button onClick={handleBack} style={{ display:"flex", alignItems:"center", gap:"8px", background:"transparent", border:"2px solid #E0DDD7", padding:"13px 22px", borderRadius:"12px", fontSize:"15px", fontWeight:700, color: step===0?"#CCC":"#555", cursor: step===0?"default":"pointer" }} disabled={step===0}>
                <ChevronLeft size={16} /> 이전
              </button>

              {isMulti && (
                <button
                  onClick={handleNext}
                  disabled={!Array.isArray(currentAnswer) || currentAnswer.length === 0}
                  style={{ display:"flex", alignItems:"center", gap:"8px", background: Array.isArray(currentAnswer)&&currentAnswer.length>0?"#FF3B1E":"#E0DDD7", color: Array.isArray(currentAnswer)&&currentAnswer.length>0?"white":"#AAA", border:"none", padding:"14px 28px", borderRadius:"12px", fontSize:"15px", fontWeight:800, cursor: Array.isArray(currentAnswer)&&currentAnswer.length>0?"pointer":"default" }}
                >
                  {step === STEPS.length - 1 ? "추천 결과 보기" : "다음"} <ChevronRight size={16} />
                </button>
              )}

              {!isMulti && (
                <div style={{ fontSize:"14px", color:"#BBB", fontWeight:400 }}>항목을 선택하면 자동으로 넘어가요</div>
              )}
            </div>
          </div>

          {/* 하단 안내 */}
          <div style={{ marginTop:"48px", padding:"18px 22px", background:"white", borderRadius:"14px", display:"flex", gap:"14px", alignItems:"center" }}>
            <div style={{ width:"40px", height:"40px", background:"#FFF0ED", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Car size={20} color="#FF3B1E" />
            </div>
            <div>
              <div style={{ fontSize:"14px", fontWeight:800, marginBottom:"3px" }}>픽스카 AI 추천 시스템</div>
              <div style={{ fontSize:"13px", color:"#888", fontWeight:400, lineHeight:1.6 }}>답변을 바탕으로 2,418개 매물 중 가장 잘 맞는 차를 찾아드려요. 솔직하게 답할수록 더 정확해요!</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
