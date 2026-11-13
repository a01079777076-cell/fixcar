// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/mbti/page.tsx
// 차량 MBTI v4 — 성향 7문항(재미) + 실제 조건 단계 → 서버에서 카탈로그 전체 기준 추천
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight, ChevronRight, ChevronLeft, RotateCcw, Save, Lock, Check, AlertTriangle } from "lucide-react";
import {
  QUESTIONS, MBTI_TYPES, AXIS_INFO, DEFAULT_CONDITIONS,
  USE_OPTIONS, DAILY_KM_OPTIONS, PASSENGER_OPTIONS, SIZE_OPTIONS, BODY_OPTIONS, FUEL_OPTIONS,
  EV_CHARGING_OPTIONS, ORIGIN_OPTIONS, PAYMENT_OPTIONS, CASH_BUDGET_OPTIONS, DOWN_PAYMENT_OPTIONS,
  MONTHLY_OPTIONS, LOAN_MONTH_OPTIONS, MAX_AGE_OPTIONS, MAX_MILEAGE_OPTIONS, IMPORTANCE_ITEMS,
  IMPORTANCE_LABELS, ASSUMED_LOAN_RATE, calcAffordable, loanPrincipal,
  type MbtiConditions, type Choice, type Axis, type ImportanceKey,
} from "@/data/car_mbti_data";

/* ── 단계 정의 ── */
type StepKind =
  | "uses" | "dailyKm" | "passengers" | "sizes" | "bodies" | "fuels" | "evCharging"
  | "origin" | "payment" | "budget" | "condition" | "importance";
type Step = { kind: "q"; qIdx: number } | { kind: StepKind };

const STEP_TITLE: Record<StepKind, { title: string; sub?: string }> = {
  uses: { title: "차를 주로 어디에 쓰실 건가요?", sub: "해당하는 것을 모두 골라주세요" },
  dailyKm: { title: "하루 평균 얼마나 운전하세요?" },
  passengers: { title: "평소 차에 몇 명이 타나요?" },
  sizes: { title: "원하는 차 크기(차급)는?", sub: "여러 개 고를 수 있어요. 안 고르면 '상관없음'" },
  bodies: { title: "어떤 형태의 차가 좋으세요?", sub: "여러 개 고를 수 있어요. 안 고르면 '상관없음'" },
  fuels: { title: "괜찮은 연료를 모두 골라주세요", sub: "고른 연료의 차만 추천해요. 안 고르면 '상관없음'" },
  evCharging: { title: "전기차라면, 충전은 어디서 하실 수 있나요?" },
  origin: { title: "국산차·수입차, 어느 쪽이 좋으세요?" },
  payment: { title: "어떻게 결제하실 계획인가요?" },
  budget: { title: "예산을 알려주세요" },
  condition: { title: "차 상태는 어느 정도까지 괜찮으세요?" },
  importance: { title: "각 항목이 얼마나 중요하세요?", sub: "추천 순위에 그대로 반영돼요" },
};

const won = (n: number) => (n >= 10000 ? `${(n / 10000).toLocaleString()}억` : `${n.toLocaleString()}만원`);

interface RecModel {
  name: string; brand: string; size: string | null; body: string | null; fuels: string[]; seats: number;
  newPriceFrom: number | null; years: string; score: number; reasons: string[]; cautions: string[];
}
interface Listing { id: number; name: string; brand: string; year: number; mileage: number; price: number; fuel: string; images: string[]; match: number }
interface RecData {
  type: string; axes: Record<Axis, number>; conditions: MbtiConditions; affordable: number;
  models: RecModel[]; relaxed: boolean; totalCandidates: number; listings: Listing[]; listingsError: boolean;
}

export default function CarMbtiPage() {
  const [step, setStep] = useState(-1); /* -1=인트로, steps.length=결과 */
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [cond, setCond] = useState<MbtiConditions>(DEFAULT_CONDITIONS);
  const [rec, setRec] = useState<RecData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/session").then((r) => r.json()).then((d) => setLoggedIn(!!d?.user?.id)).catch(() => setLoggedIn(false));
  }, []);

  /* 전기를 골랐거나 연료 상관없음일 때만 충전 질문 */
  const steps: Step[] = useMemo(() => {
    const s: Step[] = QUESTIONS.map((_, i) => ({ kind: "q" as const, qIdx: i }));
    const kinds: StepKind[] = ["uses", "dailyKm", "passengers", "sizes", "bodies", "fuels"];
    if (cond.fuels.length === 0 || cond.fuels.includes("전기")) kinds.push("evCharging");
    kinds.push("origin", "payment", "budget", "condition", "importance");
    return [...s, ...kinds.map((k) => ({ kind: k }))];
  }, [cond.fuels]);

  const total = steps.length;
  const cur = step >= 0 && step < total ? steps[step] : null;
  const set = <K extends keyof MbtiConditions>(k: K, v: MbtiConditions[K]) => setCond((c) => ({ ...c, [k]: v }));
  const toggle = <T extends string>(list: T[], v: T): T[] => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const next = () => {
    if (step + 1 >= total) submit();
    else setStep(step + 1);
  };
  const back = () => { if (step > 0) setStep(step - 1); };

  const submit = async () => {
    setStep(total);
    setLoading(true);
    setError("");
    setRec(null);
    try {
      const r = await fetch("/api/mbti/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, conditions: cond }),
      });
      const d = await r.json();
      if (!r.ok || !d.success) throw new Error(d.error || "추천을 불러오지 못했어요");
      setRec(d.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "추천을 불러오지 못했어요");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!rec) return;
    setSaving(true);
    setSaveError("");
    try {
      const priorities = [...IMPORTANCE_ITEMS].sort((a, b) => rec.conditions.importance[b.key] - rec.conditions.importance[a.key]).map((i) => i.key);
      const r = await fetch("/api/mbti/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: rec.type, axes: rec.axes, conditions: rec.conditions, priorities }),
      });
      const d = await r.json();
      if (!r.ok || !d.success) throw new Error(d.error || "저장 실패");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "저장 실패");
    }
    setSaving(false);
  };

  const reset = () => {
    setStep(-1); setAnswers({}); setCond(DEFAULT_CONDITIONS); setRec(null); setError(""); setSaved(false); setSaveError("");
  };

  const affordable = calcAffordable(cond);

  /* ── 공용 UI ── */
  const ChoiceGrid = <T extends string>({ options, selected, onPick, cols = 2 }: { options: Choice<T>[]; selected: T[]; onPick: (v: T) => void; cols?: number }) => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`, gap: 10 }}>
      {options.map((o) => {
        const on = selected.includes(o.value);
        return (
          <button key={o.value} className={`opt-btn${on ? " on" : ""}`} onClick={() => onPick(o.value)} style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: on ? "#FF3B1E" : "#333" }}>{o.label}</span>
              {on && <Check size={16} color="#FF3B1E" />}
            </div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 4, lineHeight: 1.4 }}>{o.desc}</div>
          </button>
        );
      })}
    </div>
  );

  const Chips = ({ items, value, onPick }: { items: { value: number; label: string }[]; value: number; onPick: (v: number) => void }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((it) => (
        <button key={it.value} className={`chip${value === it.value ? " on" : ""}`} onClick={() => onPick(it.value)}>{it.label}</button>
      ))}
    </div>
  );

  const NextBtn = ({ label = "다음", disabled = false }: { label?: string; disabled?: boolean }) => (
    <button onClick={next} disabled={disabled} style={{ width: "100%", marginTop: 22, padding: "16px", background: disabled ? "#CCC" : "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
      {label} <ArrowRight size={18} />
    </button>
  );

  const GroupLabel = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontSize: 14, fontWeight: 800, margin: "20px 0 10px", color: "#333" }}>{children}</div>
  );

  /* ── 단계별 본문 ── */
  const renderStep = (s: Step) => {
    if (s.kind === "q") {
      const q = QUESTIONS[s.qIdx];
      return (
        <>
          <h2 className="q-title">{q.question}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, i) => (
              <button key={i} className={`opt-btn${answers[q.id] === i ? " on" : ""}`} onClick={() => { setAnswers({ ...answers, [q.id]: i }); next(); }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "#F8F7F4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#AAA", flexShrink: 0 }}>{["A", "B", "C", "D"][i]}</div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#333" }}>{opt.text}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      );
    }

    const head = STEP_TITLE[s.kind];
    const title = (
      <>
        <h2 className="q-title" style={{ marginBottom: head.sub ? 6 : 24 }}>{head.title}</h2>
        {head.sub && <p style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>{head.sub}</p>}
      </>
    );

    switch (s.kind) {
      case "uses":
        return <>{title}<ChoiceGrid options={USE_OPTIONS} selected={cond.uses} onPick={(v) => set("uses", toggle(cond.uses, v))} /><NextBtn label={cond.uses.length ? "다음" : "딱히 없어요, 다음"} /></>;
      case "dailyKm":
        return <>{title}<ChoiceGrid options={DAILY_KM_OPTIONS} selected={[cond.dailyKm]} onPick={(v) => { set("dailyKm", v); next(); }} /></>;
      case "passengers":
        return <>{title}<ChoiceGrid options={PASSENGER_OPTIONS} selected={[cond.passengers]} onPick={(v) => { set("passengers", v); next(); }} /></>;
      case "sizes":
        return <>{title}<ChoiceGrid options={SIZE_OPTIONS} selected={cond.sizes} onPick={(v) => set("sizes", toggle(cond.sizes, v))} /><NextBtn label={cond.sizes.length ? `${cond.sizes.join("·")} 선택, 다음` : "상관없음, 다음"} /></>;
      case "bodies":
        return <>{title}<ChoiceGrid options={BODY_OPTIONS} selected={cond.bodies} onPick={(v) => set("bodies", toggle(cond.bodies, v))} /><NextBtn label={cond.bodies.length ? "다음" : "상관없음, 다음"} /></>;
      case "fuels":
        return (
          <>
            {title}
            <ChoiceGrid options={FUEL_OPTIONS} selected={cond.fuels} onPick={(v) => set("fuels", toggle(cond.fuels, v))} />
            <p style={{ fontSize: 12, color: "#AAA", marginTop: 12, lineHeight: 1.6 }}>💡 연비가 중요하다고 전기차만 나오지 않아요. 연비는 마지막 &apos;중요도&apos;에서 따로 반영하고, 여기서 고른 연료 안에서만 비교해요.</p>
            <NextBtn label={cond.fuels.length ? "다음" : "상관없음, 다음"} />
          </>
        );
      case "evCharging":
        return <>{title}<ChoiceGrid cols={1} options={EV_CHARGING_OPTIONS} selected={[cond.evCharging]} onPick={(v) => { set("evCharging", v); next(); }} /></>;
      case "origin":
        return <>{title}<ChoiceGrid options={ORIGIN_OPTIONS} selected={[cond.origin]} onPick={(v) => { set("origin", v); next(); }} /></>;
      case "payment":
        return (
          <>
            {title}
            <ChoiceGrid cols={1} options={PAYMENT_OPTIONS} selected={[cond.payment]} onPick={(v) => {
              setCond((c) => ({
                ...c,
                payment: v,
                cashBudget: v === "mixed" && !(DOWN_PAYMENT_OPTIONS as readonly number[]).includes(c.cashBudget) ? 500
                  : v === "cash" && !(CASH_BUDGET_OPTIONS as readonly number[]).includes(c.cashBudget) ? 1500 : c.cashBudget,
              }));
              next();
            }} />
          </>
        );
      case "budget":
        return (
          <>
            {title}
            {cond.payment === "cash" && (
              <>
                <GroupLabel>최대 얼마까지 생각하세요? (차량가 기준)</GroupLabel>
                <Chips items={CASH_BUDGET_OPTIONS.map((v) => ({ value: v, label: v === 10000 ? "1억 이상" : won(v) }))} value={cond.cashBudget} onPick={(v) => set("cashBudget", v)} />
              </>
            )}
            {cond.payment === "mixed" && (
              <>
                <GroupLabel>선수금(먼저 낼 금액)</GroupLabel>
                <Chips items={DOWN_PAYMENT_OPTIONS.map((v) => ({ value: v, label: won(v) }))} value={cond.cashBudget} onPick={(v) => set("cashBudget", v)} />
              </>
            )}
            {cond.payment !== "cash" && (
              <>
                <GroupLabel>월 할부금, 최대 얼마까지 괜찮으세요?</GroupLabel>
                <Chips items={MONTHLY_OPTIONS.map((v) => ({ value: v, label: `월 ${v}만원` }))} value={cond.monthly} onPick={(v) => set("monthly", v)} />
                <GroupLabel>할부 기간</GroupLabel>
                <Chips items={LOAN_MONTH_OPTIONS.map((v) => ({ value: v, label: `${v}개월` }))} value={cond.loanMonths} onPick={(v) => set("loanMonths", v)} />
              </>
            )}
            <div style={{ background: "#1A1A1A", color: "white", borderRadius: 16, padding: "18px 20px", marginTop: 22 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>구매 가능 차량가</div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>약 {won(affordable)}{cond.payment === "cash" && cond.cashBudget === 10000 ? " 이상" : ""}</div>
              {cond.payment !== "cash" && (
                <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6, lineHeight: 1.6 }}>
                  {cond.payment === "mixed" && <>선수금 {won(cond.cashBudget)} + </>}할부 원금 약 {won(loanPrincipal(cond.monthly, cond.loanMonths))}<br />
                  연 {Math.round(ASSUMED_LOAN_RATE * 100)}% 가정 추정치예요. 실제 금리·한도는 심사에 따라 달라요.
                </div>
              )}
            </div>
            <NextBtn />
          </>
        );
      case "condition":
        return (
          <>
            {title}
            <GroupLabel>연식</GroupLabel>
            <Chips items={MAX_AGE_OPTIONS} value={cond.maxAge} onPick={(v) => set("maxAge", v)} />
            <GroupLabel>주행거리</GroupLabel>
            <Chips items={MAX_MILEAGE_OPTIONS} value={cond.maxMileage} onPick={(v) => set("maxMileage", v)} />
            <GroupLabel>사고 이력</GroupLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button className={`chip${!cond.accidentOk ? " on" : ""}`} onClick={() => set("accidentOk", false)}>무사고만</button>
              <button className={`chip${cond.accidentOk ? " on" : ""}`} onClick={() => set("accidentOk", true)}>단순 교환 정도는 괜찮아요</button>
            </div>
            <NextBtn />
          </>
        );
      case "importance":
        return (
          <>
            {title}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {IMPORTANCE_ITEMS.map((it) => {
                const v = cond.importance[it.key];
                return (
                  <div key={it.key} style={{ background: "white", borderRadius: 14, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, gap: 8 }}>
                      <div>
                        <span style={{ fontSize: 15, fontWeight: 800 }}>{it.label}</span>
                        <span style={{ fontSize: 11, color: "#AAA", marginLeft: 6 }}>{it.desc}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: v >= 4 ? "#FF3B1E" : "#999", flexShrink: 0 }}>{IMPORTANCE_LABELS[v]}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} aria-label={`${it.label} ${IMPORTANCE_LABELS[n]}`} onClick={() => set("importance", { ...cond.importance, [it.key]: n } as Record<ImportanceKey, number>)}
                          style={{ height: 34, borderRadius: 8, border: "none", fontSize: 13, fontWeight: 800, background: n <= v ? "#FF3B1E" : "#F0EEE9", color: n <= v ? "white" : "#BBB", opacity: n <= v ? 0.45 + n * 0.11 : 1 }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <NextBtn label="결과 보기" />
          </>
        );
    }
  };

  const result = rec ? MBTI_TYPES[rec.type] : null;
  const pct = (axis: Axis) => (rec ? Math.min(100, Math.max(0, 50 + rec.axes[axis] * 6)) : 50);

  const condSummary = rec ? [
    rec.conditions.uses.length ? rec.conditions.uses.map((u) => USE_OPTIONS.find((o) => o.value === u)?.label).join("·") : null,
    `${PASSENGER_OPTIONS.find((o) => o.value === rec.conditions.passengers)?.label} 탑승`,
    rec.conditions.sizes.length ? rec.conditions.sizes.join("·") : "차급 무관",
    rec.conditions.bodies.length ? rec.conditions.bodies.join("·") : "차체 무관",
    rec.conditions.fuels.length ? rec.conditions.fuels.join("·") : "연료 무관",
    ORIGIN_OPTIONS.find((o) => o.value === rec.conditions.origin)?.label,
    `${MAX_AGE_OPTIONS.find((o) => o.value === rec.conditions.maxAge)?.label} 연식`,
    `${MAX_MILEAGE_OPTIONS.find((o) => o.value === rec.conditions.maxMileage)?.label}`,
  ].filter(Boolean) as string[] : [];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        .opt-btn{background:white;border:2px solid #E0DDD7;border-radius:16px;padding:18px 22px;cursor:pointer;transition:all 0.2s;text-align:left;width:100%;font-family:'NanumSquareRound',sans-serif;}
        .opt-btn:hover{border-color:#FF3B1E;background:#FFF8F6;}
        .opt-btn.on{border-color:#FF3B1E;background:#FFF0ED;}
        .chip{padding:10px 14px;border-radius:100px;border:1.5px solid #E0DDD7;background:white;font-size:13px;font-weight:700;color:#666;}
        .chip.on{border-color:#FF3B1E;background:#FF3B1E;color:white;}
        .q-title{font-size:clamp(20px,4vw,26px);font-weight:800;letter-spacing:-0.5px;margin-bottom:24px;line-height:1.4;word-break:keep-all;}
        .axis-bar{height:8px;border-radius:4px;background:#E8E6E1;overflow:hidden;position:relative;}
        .card{background:white;border-radius:18px;padding:22px 22px;margin-bottom:16px;}
        .tag{display:inline-block;padding:4px 10px;border-radius:100px;font-size:11px;font-weight:700;}
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <Navbar />

        {/* ═══ 인트로 ═══ */}
        {step === -1 && (
          <div>
            <div style={{ background: "linear-gradient(135deg,#FF5A3C,#E8290F)", padding: "60px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: "-20px", bottom: "-40px", fontFamily: "'Bebas Neue',serif", fontSize: "clamp(100px,20vw,200px)", color: "rgba(255,255,255,0.15)", lineHeight: 1 }}>MBTI</div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🚗</div>
                <h1 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 800, color: "white", marginBottom: 12, wordBreak: "keep-all" }}>나의 차량 MBTI는?</h1>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", fontWeight: 400, lineHeight: 1.8 }}>성향 테스트 + 예산·용도·연료 조건으로<br />나에게 맞는 차종과 실제 매물을 찾아드려요</p>
              </div>
            </div>
            <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 16px 80px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {(["DC", "SL", "EP", "HT"] as const).map((axis) => {
                  const info = AXIS_INFO[axis];
                  return (
                    <div key={axis} style={{ background: "white", borderRadius: 16, padding: "18px 14px", textAlign: "center" }}>
                      <div style={{ fontSize: 26, marginBottom: 8 }}>{info.leftEmoji} vs {info.rightEmoji}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>{info.left} vs {info.right}</div>
                      <div style={{ fontSize: 11, color: "#AAA" }}>{info.leftDesc} vs {info.rightDesc}</div>
                    </div>
                  );
                })}
              </div>
              <div className="card" style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>
                <b style={{ color: "#333" }}>이렇게 추천해요</b><br />
                ① 성향 질문 {QUESTIONS.length}개로 나의 차량 MBTI 유형을 정하고<br />
                ② 용도·인원·차급·차체·연료·예산(일시불/할부)·연식·중요도를 받아<br />
                ③ 카탈로그 전체 차종을 조건으로 걸러 점수순으로 추천해요
              </div>
              {loggedIn === null ? (
                <div style={{ textAlign: "center", padding: "20px", color: "#CCC" }}>확인 중...</div>
              ) : loggedIn ? (
                <>
                  <button onClick={() => setStep(0)} style={{ width: "100%", padding: "18px", background: "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    테스트 시작하기 <ArrowRight size={20} />
                  </button>
                  <p style={{ textAlign: "center", fontSize: 12, color: "#AAA", marginTop: 12 }}>약 3~4분 소요 · 총 {total}단계</p>
                </>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ background: "#F8F7F4", borderRadius: 16, padding: "28px 24px", marginBottom: 14 }}>
                    <Lock size={32} color="#CCC" style={{ marginBottom: 12 }} />
                    <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>로그인 후 이용할 수 있어요</div>
                    <p style={{ fontSize: 13, color: "#AAA" }}>결과를 저장하고 맞춤 차량 추천을 받으려면<br />로그인이 필요합니다</p>
                  </div>
                  <Link href="/login">
                    <button style={{ width: "100%", padding: "18px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800 }}>로그인하고 시작하기</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ 질문/조건 ═══ */}
        {cur && (
          <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 16px 80px" }}>
            <div style={{ height: 6, background: "#E0DDD7", borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((step + 1) / total) * 100}%`, background: "linear-gradient(90deg,#FF5A3C,#E8290F)", transition: "width 0.4s", borderRadius: 3 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {step > 0 && (
                  <button onClick={back} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, border: "1.5px solid #E0DDD7", background: "white", fontSize: 12, fontWeight: 700, color: "#888" }}>
                    <ChevronLeft size={14} /> 이전
                  </button>
                )}
                <span style={{ fontSize: 13, color: "#AAA" }}>{step + 1} / {total}</span>
              </div>
              <span style={{ fontSize: 12, color: "#999", background: "#F8F7F4", padding: "3px 10px", borderRadius: 100 }}>
                {cur.kind === "q" ? "성향 테스트" : "추천 조건"}
              </span>
            </div>
            {renderStep(cur)}
          </div>
        )}

        {/* ═══ 결과 ═══ */}
        {step === total && (
          <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 16px 80px" }}>
            {loading && <div className="card" style={{ textAlign: "center", color: "#999", padding: "48px 20px" }}>조건에 맞는 차를 찾는 중...</div>}
            {error && (
              <div className="card" style={{ textAlign: "center" }}>
                <AlertTriangle size={28} color="#E8A020" style={{ marginBottom: 10 }} />
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{error}</div>
                <button onClick={submit} className="chip on" style={{ marginTop: 10 }}>다시 시도</button>
              </div>
            )}

            {rec && result && (
              <>
                {/* 유형 카드 */}
                <div style={{ background: `linear-gradient(135deg, ${result.color}dd, ${result.color})`, borderRadius: 24, padding: "36px 24px", textAlign: "center", color: "white", marginBottom: 16, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", right: -10, bottom: -20, fontFamily: "'Bebas Neue',serif", fontSize: "clamp(80px,15vw,140px)", color: "rgba(255,255,255,0.15)", lineHeight: 1 }}>{result.code}</div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, opacity: 0.8, marginBottom: 12 }}>YOUR CAR MBTI</div>
                    <div style={{ fontSize: 56, marginBottom: 12 }}>{result.emoji}</div>
                    <div style={{ fontFamily: "'Bebas Neue',serif", fontSize: 36, letterSpacing: 4, marginBottom: 8 }}>{result.code}</div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{result.name}</h2>
                    <p style={{ fontSize: 14, opacity: 0.85, fontWeight: 400 }}>{result.subtitle}</p>
                    <div style={{ marginTop: 12, background: "rgba(255,255,255,0.15)", borderRadius: 100, padding: "8px 18px", display: "inline-block", fontSize: 13, fontWeight: 700 }}>💬 {result.vibe}</div>
                  </div>
                </div>
                <div className="card"><p style={{ fontSize: 15, color: "#444", lineHeight: 1.9 }}>{result.desc}</p></div>

                {/* 조건 요약 */}
                <div className="card">
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>📝 내 조건</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                    {condSummary.map((t) => <span key={t} className="tag" style={{ background: "#F8F7F4", color: "#666" }}>{t}</span>)}
                  </div>
                  <div style={{ background: "#F8F7F4", borderRadius: 12, padding: "12px 14px", fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                    💰 {PAYMENT_OPTIONS.find((o) => o.value === rec.conditions.payment)?.label} · 구매 가능 차량가 <b>약 {won(rec.affordable)}</b>
                    {rec.conditions.payment !== "cash" && <> (월 {rec.conditions.monthly}만원 × {rec.conditions.loanMonths}개월, 연 {Math.round(ASSUMED_LOAN_RATE * 100)}% 가정)</>}
                  </div>
                </div>

                {/* 추천 차종 */}
                <div className="card">
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>🚗 조건에 맞는 추천 차종</h3>
                  <p style={{ fontSize: 12, color: "#AAA", marginBottom: 14 }}>
                    조건을 통과한 {rec.totalCandidates}개 차종 중 점수 상위{rec.relaxed ? " · 조건에 딱 맞는 차가 적어 차급을 한 단계 넓혀 찾았어요" : ""}
                  </p>
                  {rec.models.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 10px", color: "#999", fontSize: 14, lineHeight: 1.7 }}>
                      조건에 맞는 차종을 찾지 못했어요.<br />예산·연식·연료 조건을 조금 넓혀서 다시 해보세요.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {rec.models.map((m, i) => (
                        <div key={m.name} style={{ border: i === 0 ? "2px solid #FF3B1E" : "1.5px solid #EEE", borderRadius: 14, padding: "14px 16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 11, color: "#AAA", fontWeight: 700 }}>{i + 1}위 · {m.brand}</div>
                              <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2, wordBreak: "keep-all" }}>{m.name}</div>
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: i === 0 ? "#FF3B1E" : "#333", flexShrink: 0 }}>{m.score}<span style={{ fontSize: 11, color: "#AAA" }}>점</span></div>
                          </div>
                          <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
                            {[m.size, m.body, m.fuels.join("/"), `${m.seats}인승`, m.years].filter(Boolean).join(" · ")}
                            {m.newPriceFrom ? ` · 신차가 ${won(m.newPriceFrom)}~` : ""}
                          </div>
                          {(m.reasons.length > 0 || m.cautions.length > 0) && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                              {m.reasons.map((r) => <span key={r} className="tag" style={{ background: "#EAF6EE", color: "#2D8A52" }}>✓ {r}</span>)}
                              {m.cautions.map((r) => <span key={r} className="tag" style={{ background: "#FFF6E5", color: "#B57A10" }}>! {r}</span>)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <p style={{ fontSize: 11, color: "#BBB", marginTop: 12, lineHeight: 1.6 }}>신차가는 카탈로그 기준이며, 중고 시세는 연식·주행거리·옵션에 따라 달라요. 실제 가격은 아래 매물에서 확인하세요.</p>
                </div>

                {/* 실제 매물 */}
                <div className="card">
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>🏷️ 조건에 맞는 FIX 매물</h3>
                  {rec.listingsError ? (
                    <div style={{ textAlign: "center", padding: "20px 10px", color: "#999", fontSize: 14 }}>매물 정보를 불러오지 못했어요. 잠시 후 다시 확인해주세요.</div>
                  ) : rec.listings.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "20px 10px", color: "#999", fontSize: 14, lineHeight: 1.7 }}>
                      아직 조건에 맞는 등록 매물이 없어요.<br />새 매물이 올라오면 매물 목록에서 확인할 수 있어요.
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}>
                      {rec.listings.map((c) => (
                        <Link key={c.id} href={`/cars/${c.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                          <div style={{ border: "1.5px solid #EEE", borderRadius: 14, overflow: "hidden" }}>
                            <div style={{ aspectRatio: "4/3", background: "#F0EEE9", backgroundImage: c.images[0] ? `url(${c.images[0]})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }} />
                            <div style={{ padding: "10px 12px" }}>
                              {c.match >= 0.7 && <span className="tag" style={{ background: "#FFF0ED", color: "#FF3B1E", marginBottom: 6 }}>추천 차종</span>}
                              <div style={{ fontSize: 13, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                              <div style={{ fontSize: 11, color: "#999", margin: "3px 0" }}>{c.year}년 · {(c.mileage / 10000).toFixed(1)}만km · {c.fuel}</div>
                              <div style={{ fontSize: 15, fontWeight: 800, color: "#0066FF" }}>{won(c.price)}</div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* 성향 분석 */}
                <div className="card">
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>📊 나의 성향 분석</h3>
                  {(["DC", "SL", "EP", "HT"] as const).map((axis) => {
                    const info = AXIS_INFO[axis];
                    const p = pct(axis);
                    return (
                      <div key={axis} style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                          <span style={{ fontWeight: 700, color: p >= 50 ? "#FF3B1E" : "#AAA" }}>{info.leftEmoji} {info.left}</span>
                          <span style={{ fontWeight: 700, color: p < 50 ? "#1847FF" : "#AAA" }}>{info.right} {info.rightEmoji}</span>
                        </div>
                        <div className="axis-bar"><div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${p}%`, background: "linear-gradient(90deg,#FF5A3C,#FF8A70)", borderRadius: 4, transition: "width 0.5s" }} /></div>
                        <div style={{ textAlign: "center", fontSize: 11, color: "#AAA", marginTop: 4 }}>{p >= 50 ? info.leftDesc : info.rightDesc} ({Math.round(p >= 50 ? p : 100 - p)}%)</div>
                      </div>
                    );
                  })}
                </div>

                <div className="card">
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>🏷️ 보너스 태그</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {result.tags.map((tag) => <span key={tag} style={{ background: "#F8F7F4", color: "#888", padding: "8px 14px", borderRadius: 100, fontSize: 13, fontWeight: 600 }}>{tag}</span>)}
                  </div>
                </div>

                {saveError && <div style={{ color: "#D03030", fontSize: 13, textAlign: "center", marginBottom: 10 }}>{saveError}</div>}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleSave} disabled={saving || saved} style={{ flex: 2, padding: "16px", background: saved ? "#2D8A52" : saving ? "#CCC" : "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Save size={18} /> {saved ? "저장 완료!" : saving ? "저장 중..." : "결과 저장하기"}
                  </button>
                  <button onClick={() => setStep(QUESTIONS.length)} style={{ flex: 1, padding: "16px", background: "white", color: "#888", border: "1.5px solid #E0DDD7", borderRadius: 14, fontSize: 14, fontWeight: 700 }}>
                    조건 수정
                  </button>
                  <button onClick={reset} aria-label="처음부터 다시" style={{ padding: "16px", background: "white", color: "#888", border: "1.5px solid #E0DDD7", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <RotateCcw size={16} />
                  </button>
                </div>

                <Link href="/cars">
                  <div style={{ background: "linear-gradient(135deg,#1847FF,#0A25B8)", borderRadius: 18, padding: "20px 24px", marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "white" }}>전체 매물 보기</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>FIX 정찰가로 확인</div>
                    </div>
                    <ChevronRight size={20} color="white" />
                  </div>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
