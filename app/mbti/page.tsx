"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";

/* ─── MBTI 4축 × 3문항 = 12문항 ─── */
interface Question {
  q: string;
  a: { text: string; axis: string; value: "A" | "B" };
  b: { text: string; axis: string; value: "A" | "B" };
}

const QUESTIONS: Question[] = [
  /* ── 축1: S(소형) vs B(대형) ── */
  { q: "주차할 때 나는…", a: { text: "골목이든 어디든 쏙쏙 들어가는 작은 차가 편해", axis: "size", value: "A" }, b: { text: "좀 크더라도 당당하게 타고 싶어, 주차는 어떻게든 돼", axis: "size", value: "B" } },
  { q: "장거리 여행을 간다면?", a: { text: "연비 좋은 가벼운 차로 효율적으로!", axis: "size", value: "A" }, b: { text: "넓고 편한 차에서 다리 쭉 뻗고 가야지", axis: "size", value: "B" } },
  { q: "차에 주로 누가 타?", a: { text: "대부분 나 혼자 또는 둘이서", axis: "size", value: "A" }, b: { text: "가족이나 친구들이랑 자주 같이 타", axis: "size", value: "B" } },
  /* ── 축2: D(다이나믹) vs C(컴포트) ── */
  { q: "운전할 때 느끼고 싶은 건?", a: { text: "핸들 꺾으면 바로 반응하는 스포티한 주행감!", axis: "style", value: "A" }, b: { text: "구름 위를 달리는 것 같은 편안한 승차감", axis: "style", value: "B" } },
  { q: "차의 외관은?", a: { text: "터프하고 강인한 디자인이 좋아", axis: "style", value: "A" }, b: { text: "세련되고 부드러운 디자인이 좋아", axis: "style", value: "B" } },
  { q: "차에서 가장 중요한 건?", a: { text: "마력! 성능! 제로백!", axis: "style", value: "A" }, b: { text: "인테리어 감성과 디자인", axis: "style", value: "B" } },
  /* ── 축3: G(내연기관) vs E(전기) ── */
  { q: "충전 vs 주유, 어떤 게 나한테 맞아?", a: { text: "주유소 들러서 5분이면 끝! 기름이 편해", axis: "fuel", value: "A" }, b: { text: "집에서 밤새 충전하면 돼, 전기차가 미래지", axis: "fuel", value: "B" } },
  { q: "주행할 때 소리는?", a: { text: "부릉부릉 엔진 사운드가 있어야 운전 맛이지", axis: "fuel", value: "A" }, b: { text: "조용~하게 달리는 게 최고야", axis: "fuel", value: "B" } },
  { q: "환경 문제에 대해서…", a: { text: "중요하긴 한데 차 선택에서 큰 비중은 아냐", axis: "fuel", value: "A" }, b: { text: "환경을 생각하면 전기차가 맞다고 봐", axis: "fuel", value: "B" } },
  /* ── 축4: N(새차) vs V(가성비) ── */
  { q: "예산이 정해졌다면?", a: { text: "좀 더 보태서라도 새 차를 사고 싶어", axis: "condition", value: "A" }, b: { text: "같은 예산이면 한 단계 위 중고차가 낫지", axis: "condition", value: "B" } },
  { q: "차량 이력에 대해서…", a: { text: "무사고가 무조건이야. 내 차는 깨끗해야 돼", axis: "condition", value: "A" }, b: { text: "약간의 사고이력은 괜찮아, 가격 대비 상태가 중요해", axis: "condition", value: "B" } },
  { q: "차를 얼마나 오래 탈 예정이야?", a: { text: "10년은 타야지! 오래 탈 거니까 새 차로", axis: "condition", value: "A" }, b: { text: "3~5년 타고 바꿀 거라 가성비가 중요해", axis: "condition", value: "B" } },
];

/* ─── 16가지 결과 유형 ─── */
interface MbtiResult {
  type: string;
  title: string;
  emoji: string;
  desc: string;
  tags: string[];
  recommend: string[];
  priorities: { label: string; items: string[] }[];
}

const RESULTS: Record<string, MbtiResult> = {
  AAAN: { type: "AAAN", title: "도심 스피드스터", emoji: "🏎️", desc: "작지만 빠른 차를 새차로 원하는 당신! 도심에서 날쌘돌이처럼 누비는 걸 좋아해요.", tags: ["소형","스포티","가솔린","새차"], recommend: ["현대 아반떼 N Line","기아 K3 GT","MINI Cooper JCW","폭스바겐 골프 GTI"], priorities: [{ label: "차량 크기", items: ["1순위 소형/준중형","2순위 중형"] },{ label: "차량 유형", items: ["1순위 해치백/세단","2순위 쿠페"] },{ label: "연료", items: ["1순위 가솔린 터보","2순위 하이브리드"] }] },
  AAGN: { type: "AAGN", title: "실속파 시티러너", emoji: "🌿", desc: "경제적이고 효율적인 소형차를 새차로 원하는 합리주의자! 연비 최고를 추구해요.", tags: ["소형","편안","가솔린","새차"], recommend: ["현대 캐스퍼","기아 모닝","기아 레이","혼다 시빅"], priorities: [{ label: "차량 크기", items: ["1순위 경차/소형","2순위 준중형"] },{ label: "차량 유형", items: ["1순위 해치백/경차","2순위 세단"] },{ label: "연료", items: ["1순위 가솔린","2순위 LPG"] }] },
  AAEN: { type: "AAEN", title: "에코 얼리어답터", emoji: "⚡", desc: "작고 조용한 전기차를 새차로! 미래 지향적이고 트렌디한 선택을 하는 당신.", tags: ["소형","스포티","전기","새차"], recommend: ["현대 캐스퍼 EV","기아 레이 EV","기아 EV3","MINI 일렉트릭"], priorities: [{ label: "차량 크기", items: ["1순위 소형","2순위 준중형"] },{ label: "차량 유형", items: ["1순위 소형 전기차","2순위 전기 SUV"] },{ label: "연료", items: ["1순위 전기","2순위 하이브리드"] }] },
  AAGV: { type: "AAGV", title: "가성비 왕 드라이버", emoji: "💰", desc: "작은 차를 합리적 가격에! 가성비를 중시하는 알뜰한 드라이버예요.", tags: ["소형","스포티","가솔린","가성비"], recommend: ["아반떼 AD 중고","K3 2세대 중고","벨로스터 중고","시빅 10세대 중고"], priorities: [{ label: "차량 크기", items: ["1순위 소형/준중형","2순위 중형"] },{ label: "차량 유형", items: ["1순위 세단","2순위 해치백"] },{ label: "연료", items: ["1순위 가솔린","2순위 LPG"] }] },
  AABV: { type: "AABV", title: "감성 중고 마니아", emoji: "🎨", desc: "예쁘고 개성 있는 소형차를 중고로 합리적으로! 나만의 감성을 중시해요.", tags: ["소형","편안","가솔린","가성비"], recommend: ["폭스바겐 비틀 중고","MINI 쿠퍼 중고","피아트 500 중고","아반떼 중고"], priorities: [{ label: "차량 크기", items: ["1순위 소형","2순위 준중형"] },{ label: "차량 유형", items: ["1순위 해치백","2순위 세단"] },{ label: "연료", items: ["1순위 가솔린","2순위 디젤"] }] },
  AAEV: { type: "AAEV", title: "스마트 절약러", emoji: "🔋", desc: "소형 전기차를 중고로! 유지비까지 아끼는 똑똑한 선택이에요.", tags: ["소형","스포티","전기","가성비"], recommend: ["아이오닉 일렉트릭 중고","닛산 리프 중고","볼트 EV 중고","기아 니로 EV 중고"], priorities: [{ label: "차량 크기", items: ["1순위 소형","2순위 준중형"] },{ label: "차량 유형", items: ["1순위 전기차","2순위 하이브리드"] },{ label: "연료", items: ["1순위 전기","2순위 하이브리드"] }] },
  ABEV: { type: "ABEV", title: "실용 에코 세이버", emoji: "🌱", desc: "편안한 소형 전기차를 가성비 있게! 실용성과 환경 모두 챙기는 현명한 선택.", tags: ["소형","편안","전기","가성비"], recommend: ["볼보 XC40 Recharge 중고","기아 니로 EV 중고","현대 코나 EV 중고"], priorities: [{ label: "차량 크기", items: ["1순위 소형 SUV","2순위 준중형"] },{ label: "차량 유형", items: ["1순위 전기 SUV","2순위 전기 세단"] },{ label: "연료", items: ["1순위 전기","2순위 하이브리드"] }] },
  ABEN: { type: "ABEN", title: "프리미엄 에코 드라이버", emoji: "🍃", desc: "편안한 소형 전기차를 새차로! 최신 기술과 친환경을 동시에 즐기는 트렌드세터.", tags: ["소형","편안","전기","새차"], recommend: ["볼보 EX30","스마트 #1","기아 EV3","BYD 돌핀"], priorities: [{ label: "차량 크기", items: ["1순위 소형 SUV","2순위 준중형"] },{ label: "차량 유형", items: ["1순위 전기 SUV","2순위 전기 세단"] },{ label: "연료", items: ["1순위 전기","2순위 PHEV"] }] },
  BAAN: { type: "BAAN", title: "파워 머슬 드라이버", emoji: "💪", desc: "크고 강한 차를 새차로! 도로 위의 지배자, 압도적인 존재감을 원해요.", tags: ["대형","스포티","가솔린","새차"], recommend: ["제네시스 GV80","기아 모하비","BMW X5 M","포드 머스탱"], priorities: [{ label: "차량 크기", items: ["1순위 대형 SUV","2순위 중형 SUV"] },{ label: "차량 유형", items: ["1순위 SUV","2순위 세단"] },{ label: "연료", items: ["1순위 가솔린 터보","2순위 디젤"] }] },
  BAGN: { type: "BAGN", title: "패밀리 캡틴", emoji: "👨‍👩‍👧‍👦", desc: "넓고 편안한 대형차를 새차로! 가족의 안전과 편안함이 최우선이에요.", tags: ["대형","편안","가솔린","새차"], recommend: ["현대 팰리세이드","기아 카니발","현대 싼타페","토요타 하이랜더"], priorities: [{ label: "차량 크기", items: ["1순위 대형 SUV/MPV","2순위 중형 SUV"] },{ label: "차량 유형", items: ["1순위 SUV","2순위 미니밴"] },{ label: "연료", items: ["1순위 하이브리드","2순위 디젤"] }] },
  BBEN: { type: "BBEN", title: "일렉트릭 럭셔리스트", emoji: "👑", desc: "크고 편안한 전기차를 새차로! 최첨단 럭셔리를 추구하는 프리미엄 취향.", tags: ["대형","편안","전기","새차"], recommend: ["기아 EV9","현대 아이오닉9","테슬라 모델 X","BMW iX","볼보 EX90"], priorities: [{ label: "차량 크기", items: ["1순위 대형 전기 SUV","2순위 대형 전기 세단"] },{ label: "차량 유형", items: ["1순위 전기 SUV","2순위 전기 세단"] },{ label: "연료", items: ["1순위 전기","2순위 PHEV"] }] },
  BAEN: { type: "BAEN", title: "퍼포먼스 일렉트릭", emoji: "⚡", desc: "크고 빠른 전기차를 새차로! 무소음에서 터지는 가속 쾌감을 즐기는 당신.", tags: ["대형","스포티","전기","새차"], recommend: ["테슬라 모델 Y 퍼포먼스","기아 EV6 GT","아이오닉5 N","포르쉐 타이칸"], priorities: [{ label: "차량 크기", items: ["1순위 중대형 전기차","2순위 대형 전기 SUV"] },{ label: "차량 유형", items: ["1순위 전기 SUV","2순위 전기 세단"] },{ label: "연료", items: ["1순위 전기","2순위 PHEV"] }] },
  BAGV: { type: "BAGV", title: "스마트 빅 바이어", emoji: "🧠", desc: "넓고 편안한 대형차를 합리적 가격으로! 중고로 한 급 위 차를 노리는 전략가.", tags: ["대형","편안","가솔린","가성비"], recommend: ["싼타페 TM 중고","쏘렌토 UM 중고","그랜저 IG 중고","팰리세이드 중고"], priorities: [{ label: "차량 크기", items: ["1순위 대형 SUV","2순위 대형 세단"] },{ label: "차량 유형", items: ["1순위 SUV","2순위 세단"] },{ label: "연료", items: ["1순위 디젤","2순위 가솔린"] }] },
  BAAV: { type: "BAAV", title: "가성비 스포츠맨", emoji: "🏁", desc: "크고 강한 차를 중고로! 가성비 좋은 고성능 중고를 찾는 안목의 소유자.", tags: ["대형","스포티","가솔린","가성비"], recommend: ["제네시스 G70 중고","스팅어 GT 중고","BMW 3시리즈 중고","벤츠 C클래스 중고"], priorities: [{ label: "차량 크기", items: ["1순위 중형/대형 세단","2순위 SUV"] },{ label: "차량 유형", items: ["1순위 스포츠 세단","2순위 SUV"] },{ label: "연료", items: ["1순위 가솔린 터보","2순위 디젤"] }] },
  BBEV: { type: "BBEV", title: "미래형 패밀리맨", emoji: "🚀", desc: "크고 편안한 전기차를 가성비 있게! 미래 기술을 합리적으로 누리는 현명한 가장.", tags: ["대형","편안","전기","가성비"], recommend: ["아이오닉5 중고","EV6 중고","테슬라 모델 Y 중고","폴스타 2 중고"], priorities: [{ label: "차량 크기", items: ["1순위 중대형 전기 SUV","2순위 전기 세단"] },{ label: "차량 유형", items: ["1순위 전기 SUV","2순위 전기 세단"] },{ label: "연료", items: ["1순위 전기","2순위 하이브리드"] }] },
  BBGN: { type: "BBGN", title: "클래식 럭셔리", emoji: "🎩", desc: "크고 우아한 내연기관을 새차로! 전통적 고급차의 품격을 아는 클래식 취향.", tags: ["대형","편안","가솔린","새차"], recommend: ["제네시스 G80","제네시스 G90","벤츠 E-클래스","BMW 5시리즈","렉서스 ES"], priorities: [{ label: "차량 크기", items: ["1순위 대형 세단","2순위 대형 SUV"] },{ label: "차량 유형", items: ["1순위 세단","2순위 SUV"] },{ label: "연료", items: ["1순위 가솔린","2순위 하이브리드"] }] },
};

/* ─── 프로그레스 바 색상 ─── */
const PROGRESS_COLORS = ["#FF3B1E","#FF6B4A","#FF8F3B","#FFB84A","#00C471","#00A5E0","#1847FF","#6B4AFF","#FF3B8F","#E24B4A","#00C471","#1847FF"];

export default function MbtiPage() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { A: number; B: number }>>({
    size: { A: 0, B: 0 }, style: { A: 0, B: 0 }, fuel: { A: 0, B: 0 }, condition: { A: 0, B: 0 },
  });
  const [fadeIn, setFadeIn] = useState(true);
  const [selectedSide, setSelectedSide] = useState<"a" | "b" | null>(null);

  const handleAnswer = (axis: string, value: "A" | "B") => {
    setSelectedSide(value === "A" ? "a" : "b");
    setTimeout(() => {
      setFadeIn(false);
      setAnswers(prev => ({
        ...prev,
        [axis]: { ...prev[axis], [value]: prev[axis][value] + 1 },
      }));
      setTimeout(() => {
        if (current < QUESTIONS.length - 1) {
          setCurrent(current + 1);
        } else {
          setStep("result");
        }
        setFadeIn(true);
        setSelectedSide(null);
      }, 250);
    }, 400);
  };

  /* 결과 계산 */
  const getResultKey = () => {
    const s = answers.size.A >= answers.size.B ? "A" : "B";
    const st = answers.style.A >= answers.style.B ? "A" : "B";
    const f = answers.fuel.A >= answers.fuel.B ? "A" : "B";
    const c = answers.condition.A >= answers.condition.B ? "A" : "B";

    const key = `${s}${st}${f === "A" ? "G" : "E"}${c === "A" ? "N" : "V"}`;
    /* 일부 조합이 없으면 가장 근접한 키 찾기 */
    if (RESULTS[key]) return key;

    /* fallback: 가장 근접한 결과 */
    const sKey = s === "A" ? "A" : "B";
    const stKey = st === "A" ? "A" : "B";
    const fKey = f === "A" ? "A" : "B";
    const cKey = c === "A" ? "N" : "V";
    const fallback = `${sKey}${stKey}${fKey === "A" ? "G" : "E"}${cKey}`;
    if (RESULTS[fallback]) return fallback;

    /* 최종 fallback */
    return Object.keys(RESULTS)[0];
  };

  const result = RESULTS[getResultKey()];

  const restart = () => {
    setStep("intro");
    setCurrent(0);
    setAnswers({ size: { A: 0, B: 0 }, style: { A: 0, B: 0 }, fuel: { A: 0, B: 0 }, condition: { A: 0, B: 0 } });
    setFadeIn(true);
    setSelectedSide(null);
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;-webkit-font-smoothing:antialiased;}
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }
        @keyframes bounceIn { 0% { opacity:0; transform:scale(0.3); } 50% { transform:scale(1.05); } 70% { transform:scale(0.95); } 100% { opacity:1; transform:scale(1); } }
        .fade-card { animation: fadeUp 0.5s ease-out; }
        .choice-btn { transition: all 0.2s ease; }
        .choice-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; }
        .choice-btn:active { transform: scale(0.97); }
        .result-tag { animation: slideIn 0.4s ease-out backwards; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <Navbar />

        {/* ═══ 인트로 화면 ═══ */}
        {step === "intro" && (
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px 100px", textAlign: "center" }}>
            <div className="fade-card" style={{ background: "linear-gradient(135deg, #1A1A1A 0%, #2D1A1A 100%)", borderRadius: 24, padding: "48px 28px 40px", marginBottom: 20 }}>
              <div style={{ fontSize: 64, marginBottom: 16, animation: "bounceIn 0.8s ease-out" }}>🚗</div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 6, color: "#FF3B1E", marginBottom: 8 }}>FIXCAR CAR MBTI</div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", lineHeight: 1.35, marginBottom: 12 }}>
                나의 차량 성향<br />MBTI 테스트
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 400 }}>
                12가지 질문으로 알아보는<br />나에게 딱 맞는 차량 유형
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                {["크기","스타일","연료","상태"].map((t, i) => (
                  <span key={i} style={{ background: "rgba(255,59,30,0.15)", color: "#FF6B4A", padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                    {t} 성향 분석
                  </span>
                ))}
              </div>
            </div>

            <div className="fade-card" style={{ background: "white", borderRadius: 18, padding: "24px 20px", marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, color: "#1A1A1A" }}>이런 걸 알 수 있어요!</div>
              {[
                { icon: "📏", text: "선호하는 차량 크기 (소형 ↔ 대형)" },
                { icon: "🎯", text: "원하는 주행 스타일 (스포티 ↔ 편안)" },
                { icon: "⛽", text: "맞는 연료 타입 (가솔린 ↔ 전기)" },
                { icon: "💎", text: "새차 vs 가성비 중고 성향" },
                { icon: "🚗", text: "성향에 맞는 추천 차량 리스트" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? "1px solid #F0EEE9" : "none" }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: "#555", fontWeight: 400 }}>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="fade-card" style={{ background: "#FFF8EC", border: "1px solid #FFD89A", borderRadius: 14, padding: "14px 18px", marginBottom: 24, fontSize: 13, color: "#7A5500", fontWeight: 400, lineHeight: 1.7 }}>
              ⏱️ 예상 소요시간 약 <strong>2~3분</strong> · 총 12문항
            </div>

            <button onClick={() => setStep("quiz")} style={{
              width: "100%", padding: "18px", background: "#FF3B1E", color: "white", border: "none",
              borderRadius: 14, fontSize: 17, fontWeight: 800, cursor: "pointer",
              fontFamily: "'NanumSquareRound',sans-serif", animation: "pulse 2s infinite",
            }}>
              테스트 시작하기 🚀
            </button>
          </div>
        )}

        {/* ═══ 퀴즈 진행 화면 ═══ */}
        {step === "quiz" && (
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px 100px" }}>
            {/* 진행률 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#1A1A1A" }}>Q{current + 1} / {QUESTIONS.length}</span>
                <span style={{ fontSize: 12, color: "#AAA", fontWeight: 400 }}>{Math.round(((current) / QUESTIONS.length) * 100)}% 완료</span>
              </div>
              <div style={{ height: 8, background: "#E8E6E1", borderRadius: 100, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 100, transition: "width 0.5s ease",
                  width: `${((current) / QUESTIONS.length) * 100}%`,
                  background: `linear-gradient(90deg, ${PROGRESS_COLORS[current % PROGRESS_COLORS.length]}, ${PROGRESS_COLORS[(current + 1) % PROGRESS_COLORS.length]})`,
                }} />
              </div>
              {/* 축 표시 */}
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                {["크기","스타일","연료","상태"].map((label, i) => {
                  const isActive = Math.floor(current / 3) === i;
                  return (
                    <span key={i} style={{
                      padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                      background: isActive ? "#FF3B1E" : "#E8E6E1",
                      color: isActive ? "white" : "#AAA",
                      transition: "all 0.3s",
                    }}>{label}</span>
                  );
                })}
              </div>
            </div>

            {/* 질문 카드 */}
            <div className={fadeIn ? "fade-card" : ""} style={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.25s" }}>
              <div style={{
                background: "white", borderRadius: 22, padding: "32px 24px", marginBottom: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.45, textAlign: "center" }}>
                  {QUESTIONS[current].q}
                </div>
              </div>

              {/* 선택지 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button className="choice-btn" onClick={() => handleAnswer(QUESTIONS[current].a.axis, QUESTIONS[current].a.value)} style={{
                  width: "100%", padding: "22px 20px", background: selectedSide === "a" ? "#FFF0ED" : "white",
                  border: selectedSide === "a" ? "2.5px solid #FF3B1E" : "2px solid #E8E6E1",
                  borderRadius: 16, fontSize: 15, fontWeight: 600, color: "#333", textAlign: "left",
                  cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif", lineHeight: 1.5,
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <span style={{
                    width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    background: selectedSide === "a" ? "#FF3B1E" : "#F0EEE9", color: selectedSide === "a" ? "white" : "#AAA",
                    fontSize: 14, fontWeight: 800, flexShrink: 0, transition: "all 0.2s",
                  }}>A</span>
                  <span>{QUESTIONS[current].a.text}</span>
                </button>

                <div style={{ textAlign: "center", fontSize: 12, color: "#CCC", fontWeight: 800 }}>VS</div>

                <button className="choice-btn" onClick={() => handleAnswer(QUESTIONS[current].b.axis, QUESTIONS[current].b.value)} style={{
                  width: "100%", padding: "22px 20px", background: selectedSide === "b" ? "#EEF2FF" : "white",
                  border: selectedSide === "b" ? "2.5px solid #1847FF" : "2px solid #E8E6E1",
                  borderRadius: 16, fontSize: 15, fontWeight: 600, color: "#333", textAlign: "left",
                  cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif", lineHeight: 1.5,
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <span style={{
                    width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    background: selectedSide === "b" ? "#1847FF" : "#F0EEE9", color: selectedSide === "b" ? "white" : "#AAA",
                    fontSize: 14, fontWeight: 800, flexShrink: 0, transition: "all 0.2s",
                  }}>B</span>
                  <span>{QUESTIONS[current].b.text}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ 결과 화면 ═══ */}
        {step === "result" && result && (
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px 120px" }}>
            {/* 결과 카드 */}
            <div className="fade-card" style={{
              background: "linear-gradient(135deg, #1A1A1A 0%, #0f3460 100%)",
              borderRadius: 24, padding: "40px 24px 32px", textAlign: "center", marginBottom: 16,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(255,59,30,0.15) 0%, transparent 60%)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 56, marginBottom: 12, animation: "bounceIn 0.6s ease-out" }}>{result.emoji}</div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 5, color: "#FF3B1E", marginBottom: 6 }}>MY CAR TYPE</div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 10, letterSpacing: -1 }}>{result.title}</h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontWeight: 400 }}>{result.desc}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                  {result.tags.map((tag, i) => (
                    <span key={i} className="result-tag" style={{
                      background: "rgba(255,59,30,0.2)", color: "#FF6B4A",
                      padding: "5px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700,
                      animationDelay: `${i * 0.1}s`,
                    }}>#{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* 성향 분석 */}
            <div className="fade-card" style={{ background: "white", borderRadius: 18, padding: "24px", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, background: "#FF3B1E", borderRadius: "50%" }} /> 나의 차량 성향 분석
              </div>
              {[
                { label: "차량 크기", a: "소형 선호", b: "대형 선호", aVal: answers.size.A, bVal: answers.size.B, colorA: "#00C471", colorB: "#1847FF" },
                { label: "주행 스타일", a: "스포티/다이나믹", b: "편안/럭셔리", aVal: answers.style.A, bVal: answers.style.B, colorA: "#FF3B1E", colorB: "#6B4AFF" },
                { label: "연료 타입", a: "내연기관", b: "전기차", aVal: answers.fuel.A, bVal: answers.fuel.B, colorA: "#FF8F3B", colorB: "#00A5E0" },
                { label: "구매 성향", a: "새차 선호", b: "가성비 중고", aVal: answers.condition.A, bVal: answers.condition.B, colorA: "#E24B4A", colorB: "#00C471" },
              ].map((axis, i) => {
                const total = axis.aVal + axis.bVal;
                const pct = total > 0 ? Math.round((axis.aVal / total) * 100) : 50;
                return (
                  <div key={i} style={{ marginBottom: i < 3 ? 18 : 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, color: "#1A1A1A" }}>{axis.label}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 4, fontWeight: 400 }}>
                      <span>{axis.a} {pct}%</span>
                      <span>{axis.b} {100 - pct}%</span>
                    </div>
                    <div style={{ height: 10, background: "#F0EEE9", borderRadius: 100, overflow: "hidden", display: "flex" }}>
                      <div style={{ width: `${pct}%`, background: axis.colorA, borderRadius: "100px 0 0 100px", transition: "width 1s ease" }} />
                      <div style={{ width: `${100 - pct}%`, background: axis.colorB, borderRadius: "0 100px 100px 0", transition: "width 1s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 추천 우선순위 */}
            <div className="fade-card" style={{ background: "white", borderRadius: 18, padding: "24px", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, background: "#1847FF", borderRadius: "50%" }} /> 나의 선호 우선순위
              </div>
              {result.priorities.map((p, pi) => (
                <div key={pi} style={{ marginBottom: pi < result.priorities.length - 1 ? 16 : 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#555", marginBottom: 8 }}>{p.label}</div>
                  {p.items.map((item, ii) => (
                    <div key={ii} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                      background: ii === 0 ? "#FFF0ED" : "#F8F7F4",
                      borderRadius: 10, marginBottom: 6,
                      border: ii === 0 ? "1.5px solid #FFB8A8" : "1px solid transparent",
                    }}>
                      <span style={{
                        width: 24, height: 24, borderRadius: 8,
                        background: ii === 0 ? "#FF3B1E" : "#E0DDD7",
                        color: "white", fontSize: 11, fontWeight: 800,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{ii + 1}</span>
                      <span style={{ fontSize: 13, fontWeight: ii === 0 ? 800 : 600, color: ii === 0 ? "#1A1A1A" : "#888" }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* 추천 차량 */}
            <div className="fade-card" style={{ background: "white", borderRadius: 18, padding: "24px", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, background: "#00C471", borderRadius: "50%" }} /> 이런 차 어때요?
              </div>
              {result.recommend.map((car, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  background: i % 2 === 0 ? "#FAFAF8" : "white", borderRadius: 12, marginBottom: 6,
                }}>
                  <span style={{ fontSize: 22 }}>🚗</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{car}</span>
                </div>
              ))}
            </div>

            {/* 공유 + 다시하기 */}
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <button onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: `나의 차량 MBTI: ${result.title}`, text: `${result.emoji} ${result.title} - ${result.desc}`, url: "https://www.fixcar.kr/mbti" });
                } else {
                  navigator.clipboard.writeText(`${result.emoji} 나의 차량 MBTI: ${result.title}\n${result.desc}\n👉 https://www.fixcar.kr/mbti`);
                  alert("결과가 복사됐어요!");
                }
              }} style={{
                flex: 1, padding: "16px", background: "#1A1A1A", color: "white", border: "none",
                borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
              }}>
                📤 결과 공유하기
              </button>
              <button onClick={restart} style={{
                flex: 1, padding: "16px", background: "white", color: "#555", border: "2px solid #E0DDD7",
                borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif",
              }}>
                🔄 다시하기
              </button>
            </div>

            {/* 매물 보기 CTA */}
            <a href="/cars" style={{ textDecoration: "none" }}>
              <div style={{
                background: "#FF3B1E", borderRadius: 18, padding: "20px 24px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "white", marginBottom: 3 }}>추천 매물 바로 보기</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>FIX 정찰가 매물 확인</div>
                </div>
                <span style={{ background: "white", color: "#FF3B1E", padding: "11px 20px", borderRadius: 100, fontSize: 13, fontWeight: 800 }}>보러가기 →</span>
              </div>
            </a>
          </div>
        )}
      </div>
    </>
  );
}
