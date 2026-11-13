/* 차량 MBTI 데이터 v4
 * - 성향 문항(재미 요소, 7문항): 결과 유형(16유형) 이름을 정하는 데만 쓰임
 * - 조건 단계(실제 추천 기준): 용도·인원·차급·차체·연료·충전·국산/수입·결제방식·예산·연식·중요도
 * 추천 차량은 유형별 고정 목록이 아니라, 조건을 카탈로그 전체(lib/car-recommend.ts)와 비교해 계산한다.
 */

/* ═══ 4축 정의 ═══
 * D(Drive) vs C(Comfort)          — 주행 성향 (성향 문항 + 성능/정숙성 중요도)
 * S(Small) vs L(Large)            — 차량 크기 (차급·차체·탑승 인원 조건에서 계산)
 * E(Economy) vs P(Premium)        — 예산 성향 (성향 문항 + 국산/수입 + 예산)
 * H(High-tech) vs T(Traditional)  — 기술 선호 (성향 문항, 단 연료에 전기를 고른 경우에만 H)
 */

export type Axis = "DC" | "SL" | "EP" | "HT";

export interface MbtiQuestion {
  id: number;
  axis: "DC" | "EP" | "HT";
  question: string;
  options: { text: string; score: number }[]; /* 양수=앞글자(D/E/H), 음수=뒷글자(C/P/T) */
}

export const QUESTIONS: MbtiQuestion[] = [
  /* ═══ D vs C (주행 성향) ═══ */
  { id: 1, axis: "DC", question: "퇴근길, 평소보다 30분 빠르게 끝났어요. 당신의 선택은?", options: [
    { text: "한적한 외곽 도로 드라이브 한 바퀴", score: 2 },
    { text: "평소 안 가던 길로 돌아가며 달려볼까", score: 1 },
    { text: "카페 들러서 여유롭게 쉬다 가기", score: -1 },
    { text: "집에 빨리 가서 쉬는 게 최고", score: -2 },
  ]},
  { id: 2, axis: "DC", question: "친구가 '이 차 좀 달려봐' 하며 키를 건넸어요. 뭐가 궁금해요?", options: [
    { text: "코너링 어때? 한번 밟아볼게", score: 2 },
    { text: "가속 반응은? 살짝 밟아볼게", score: 1 },
    { text: "승차감 괜찮네, 흔들림이 적다", score: -1 },
    { text: "시트 편하다... 소음도 거의 없고", score: -2 },
  ]},
  { id: 3, axis: "DC", question: "네비가 '목적지까지 2가지 경로'를 보여줘요", options: [
    { text: "산길 와인딩 코스 (10분 더 걸림)", score: 2 },
    { text: "국도 드라이브 코스 (5분 더 걸림)", score: 1 },
    { text: "고속도로 (편하고 빠른 길)", score: -1 },
    { text: "최단 거리, 빨리 도착하는 게 장땡", score: -2 },
  ]},

  /* ═══ E vs P (예산 성향) ═══ */
  { id: 4, axis: "EP", question: "똑같은 성능의 차 2대가 있어요. 하나는 국산 2,000만원, 하나는 수입 3,500만원", options: [
    { text: "당연히 국산! 1,500만원 아껴서 다른 데 쓸래", score: 2 },
    { text: "국산으로 가고 남은 돈으로 옵션 추가", score: 1 },
    { text: "수입차 브랜드 감성이 다르니까 투자할 만해", score: -1 },
    { text: "1,500만원 더 내도 수입차, 타보면 확실히 달라", score: -2 },
  ]},
  { id: 5, axis: "EP", question: "옵션을 고를 때 당신의 스타일은?", options: [
    { text: "기본형이면 충분해, 나머진 가격만 올리는 마케팅", score: 2 },
    { text: "안전 옵션만 추가, 나머진 있으면 좋고 없어도 OK", score: 1 },
    { text: "편의 옵션(통풍시트, HUD 등) 웬만한 건 넣고 싶어", score: -1 },
    { text: "풀옵션 아니면 의미 없지, 후회하느니 다 넣는 게 낫지", score: -2 },
  ]},

  /* ═══ H vs T (기술 선호 — 연료 선택과 별개) ═══ */
  { id: 6, axis: "HT", question: "차에 AI 음성비서가 있어요. 당신의 반응은?", options: [
    { text: "완전 활용! 내비·에어컨·음악 다 음성으로", score: 2 },
    { text: "가끔 편할 때 쓰는 정도", score: 1 },
    { text: "몇 번 써봤는데 버튼이 더 빠르더라", score: -1 },
    { text: "끄는 법부터 찾았어, 오작동이 더 스트레스", score: -2 },
  ]},
  { id: 7, axis: "HT", question: "차가 고장났어요. 어떤 차가 더 안심이 돼요?", options: [
    { text: "원격 진단 → 서비스센터 자동 예약되는 최신 시스템", score: 2 },
    { text: "앱으로 고장 코드 확인하고 예약", score: 1 },
    { text: "동네 정비소에서 바로 고칠 수 있는 구조", score: -1 },
    { text: "단순한 구조라 어디서든 수리 가능한 게 최고", score: -2 },
  ]},
];

/* ═══════════════════════════════════════════
 * 조건 (실제 추천 기준)
 * ═══════════════════════════════════════════ */

export const SIZE_CLASSES = ["경차", "소형", "준중형", "중형", "준대형", "대형"] as const;
export type SizeClass = (typeof SIZE_CLASSES)[number];

export const BODY_TYPES = ["세단", "SUV", "해치백", "MPV", "쿠페", "트럭"] as const;
export type BodyType = (typeof BODY_TYPES)[number];

/* 매물 등록 시 쓰는 연료 값과 동일하게 맞춤 */
export const FUEL_TYPES = ["가솔린", "디젤", "하이브리드", "전기", "LPG"] as const;
export type FuelType = (typeof FUEL_TYPES)[number];

export type UseKey = "commute" | "highway" | "family" | "leisure" | "business" | "first";
export type DailyKm = "lt20" | "20to50" | "50to100" | "gt100";
export type Passengers = "1-2" | "3-4" | "5" | "6+";
export type EvCharging = "home" | "public" | "none";
export type Origin = "domestic" | "domesticPref" | "any" | "import";
export type Payment = "cash" | "mixed" | "loan";
export type ImportanceKey = "fuelEco" | "quiet" | "performance" | "space" | "safety" | "upkeep" | "design";

export interface Choice<T extends string> { value: T; label: string; desc: string }

export const USE_OPTIONS: Choice<UseKey>[] = [
  { value: "commute", label: "출퇴근", desc: "매일 같은 길 왕복" },
  { value: "highway", label: "장거리·고속도로", desc: "출장, 지방 왕래" },
  { value: "family", label: "가족 이동", desc: "아이·부모님 동승" },
  { value: "leisure", label: "캠핑·레저", desc: "짐 많이 싣는 여행" },
  { value: "business", label: "업무·영업·화물", desc: "물건 운반, 외근" },
  { value: "first", label: "첫 차·운전 초보", desc: "부담 없이 연습" },
];

export const DAILY_KM_OPTIONS: Choice<DailyKm>[] = [
  { value: "lt20", label: "20km 미만", desc: "동네·가까운 출퇴근" },
  { value: "20to50", label: "20~50km", desc: "보통 출퇴근" },
  { value: "50to100", label: "50~100km", desc: "장거리 출퇴근" },
  { value: "gt100", label: "100km 이상", desc: "영업·장거리 위주" },
];

export const PASSENGER_OPTIONS: Choice<Passengers>[] = [
  { value: "1-2", label: "1~2명", desc: "혼자 또는 둘이" },
  { value: "3-4", label: "3~4명", desc: "소가족" },
  { value: "5", label: "5명", desc: "꽉 채워 탈 때가 많음" },
  { value: "6+", label: "6명 이상", desc: "7인승 이상 필요" },
];

export const SIZE_OPTIONS: Choice<SizeClass>[] = [
  { value: "경차", label: "경차", desc: "모닝·레이·캐스퍼급" },
  { value: "소형", label: "소형", desc: "코나·셀토스·트랙스급" },
  { value: "준중형", label: "준중형", desc: "아반떼·K3·스포티지급" },
  { value: "중형", label: "중형", desc: "쏘나타·K5·싼타페급" },
  { value: "준대형", label: "준대형", desc: "그랜저·K8·G80급" },
  { value: "대형", label: "대형", desc: "G90·팰리세이드·카니발급" },
];

export const BODY_OPTIONS: Choice<BodyType>[] = [
  { value: "세단", label: "세단", desc: "승차감·정숙성" },
  { value: "SUV", label: "SUV", desc: "높은 시야·공간" },
  { value: "해치백", label: "해치백", desc: "작고 실용적" },
  { value: "MPV", label: "미니밴·MPV", desc: "7~9인승, 슬라이딩 도어" },
  { value: "쿠페", label: "쿠페·스포츠", desc: "디자인·주행 재미" },
  { value: "트럭", label: "트럭·상용", desc: "화물·업무용" },
];

export const FUEL_OPTIONS: Choice<FuelType>[] = [
  { value: "가솔린", label: "가솔린", desc: "가장 무난, 정숙" },
  { value: "디젤", label: "디젤", desc: "장거리 연비, 토크" },
  { value: "하이브리드", label: "하이브리드", desc: "도심 연비 최강, 충전 불필요" },
  { value: "전기", label: "전기", desc: "연료비 최저, 충전 필요" },
  { value: "LPG", label: "LPG", desc: "연료비 저렴" },
];

export const EV_CHARGING_OPTIONS: Choice<EvCharging>[] = [
  { value: "home", label: "집·회사에서 충전 가능", desc: "전용/공용 완속 충전기 있음" },
  { value: "public", label: "근처 공용 충전소 이용", desc: "급속충전소 위주" },
  { value: "none", label: "충전이 어려움", desc: "전기차는 제외할게요" },
];

export const ORIGIN_OPTIONS: Choice<Origin>[] = [
  { value: "domestic", label: "국산차만", desc: "정비·부품 걱정 없이" },
  { value: "domesticPref", label: "국산 위주", desc: "좋은 수입차면 고려" },
  { value: "any", label: "상관없음", desc: "조건에 맞으면 OK" },
  { value: "import", label: "수입차 선호", desc: "브랜드 감성 중요" },
];

export const PAYMENT_OPTIONS: Choice<Payment>[] = [
  { value: "cash", label: "일시불", desc: "한 번에 전액 결제" },
  { value: "mixed", label: "선수금 + 할부", desc: "일부 내고 나머지 할부" },
  { value: "loan", label: "전액 할부", desc: "목돈 없이 월 납부" },
];

/* 예산 선택지 (단위: 만원) */
export const CASH_BUDGET_OPTIONS = [500, 800, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7000, 10000] as const;
export const DOWN_PAYMENT_OPTIONS = [100, 300, 500, 800, 1000, 1500, 2000, 3000] as const;
export const MONTHLY_OPTIONS = [15, 20, 30, 40, 50, 70, 100, 150] as const;
export const LOAN_MONTH_OPTIONS = [24, 36, 48, 60] as const;

export const MAX_AGE_OPTIONS: { value: number; label: string }[] = [
  { value: 3, label: "3년 이내" },
  { value: 5, label: "5년 이내" },
  { value: 7, label: "7년 이내" },
  { value: 10, label: "10년 이내" },
  { value: 99, label: "상관없음" },
];

export const MAX_MILEAGE_OPTIONS: { value: number; label: string }[] = [
  { value: 3, label: "3만km 이하" },
  { value: 5, label: "5만km 이하" },
  { value: 10, label: "10만km 이하" },
  { value: 15, label: "15만km 이하" },
  { value: 99, label: "상관없음" },
];

export const IMPORTANCE_ITEMS: { key: ImportanceKey; label: string; desc: string }[] = [
  { key: "fuelEco", label: "연비·연료비", desc: "기름값·충전비가 적게 드는지" },
  { key: "quiet", label: "정숙성·승차감", desc: "실내 소음, 진동, 부드러움" },
  { key: "performance", label: "주행 성능", desc: "가속력, 출력 여유" },
  { key: "space", label: "실내·트렁크 공간", desc: "뒷좌석, 적재 공간" },
  { key: "safety", label: "안전·편의 사양", desc: "최신 안전장치, 편의 옵션" },
  { key: "upkeep", label: "유지비", desc: "자동차세, 보험, 정비비" },
  { key: "design", label: "디자인·브랜드", desc: "외관, 브랜드 이미지" },
];

export const IMPORTANCE_LABELS = ["", "상관없음", "조금", "보통", "중요", "매우 중요"] as const;

export interface MbtiConditions {
  uses: UseKey[];
  dailyKm: DailyKm;
  passengers: Passengers;
  sizes: SizeClass[];      /* 빈 배열 = 상관없음 */
  bodies: BodyType[];      /* 빈 배열 = 상관없음 */
  fuels: FuelType[];       /* 빈 배열 = 상관없음 */
  evCharging: EvCharging;
  origin: Origin;
  payment: Payment;
  cashBudget: number;      /* 일시불 총액 또는 선수금 (만원) */
  monthly: number;         /* 월 납부 희망액 (만원) */
  loanMonths: number;      /* 할부 기간 (개월) */
  maxAge: number;          /* 연식 허용 (년), 99 = 상관없음 */
  maxMileage: number;      /* 주행거리 허용 (만km), 99 = 상관없음 */
  accidentOk: boolean;     /* 단순 사고 이력 허용 */
  importance: Record<ImportanceKey, number>; /* 1~5 */
}

export const DEFAULT_CONDITIONS: MbtiConditions = {
  uses: [],
  dailyKm: "20to50",
  passengers: "1-2",
  sizes: [],
  bodies: [],
  fuels: [],
  evCharging: "public",
  origin: "any",
  payment: "cash",
  cashBudget: 1500,
  monthly: 30,
  loanMonths: 48,
  maxAge: 10,
  maxMileage: 10,
  accidentOk: true,
  importance: { fuelEco: 3, quiet: 3, performance: 3, space: 3, safety: 3, upkeep: 3, design: 3 },
};

/* 할부 계산용 가정 금리 (연). 실제 금리·한도는 심사 결과에 따라 다름 — 화면에 반드시 '추정'으로 표시 */
export const ASSUMED_LOAN_RATE = 0.07;

/** 월 납부액으로 빌릴 수 있는 원금 (원리금균등, 만원 단위) */
export function loanPrincipal(monthly: number, months: number, annualRate = ASSUMED_LOAN_RATE): number {
  if (monthly <= 0 || months <= 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return monthly * months;
  return Math.round((monthly * (1 - Math.pow(1 + r, -months))) / r);
}

/** 결제 방식에 따른 구매 가능 차량가 (만원) */
export function calcAffordable(c: Pick<MbtiConditions, "payment" | "cashBudget" | "monthly" | "loanMonths">): number {
  if (c.payment === "cash") return c.cashBudget;
  const principal = loanPrincipal(c.monthly, c.loanMonths);
  if (c.payment === "mixed") return c.cashBudget + principal;
  return principal;
}

/** 조건 값 검증·보정 (API 입력용) */
export function sanitizeConditions(raw: unknown): MbtiConditions {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const pickOne = <T extends string>(v: unknown, list: readonly T[], def: T): T =>
    typeof v === "string" && (list as readonly string[]).includes(v) ? (v as T) : def;
  const pickMany = <T extends string>(v: unknown, list: readonly T[]): T[] =>
    Array.isArray(v) ? (v.filter((x) => typeof x === "string" && (list as readonly string[]).includes(x)) as T[]) : [];
  const num = (v: unknown, def: number, min: number, max: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
  };
  const d = DEFAULT_CONDITIONS;
  const imp = (r.importance && typeof r.importance === "object" ? r.importance : {}) as Record<string, unknown>;
  const importance = { ...d.importance };
  for (const item of IMPORTANCE_ITEMS) importance[item.key] = Math.round(num(imp[item.key], 3, 1, 5));

  return {
    uses: pickMany(r.uses, USE_OPTIONS.map((o) => o.value)),
    dailyKm: pickOne(r.dailyKm, DAILY_KM_OPTIONS.map((o) => o.value), d.dailyKm),
    passengers: pickOne(r.passengers, PASSENGER_OPTIONS.map((o) => o.value), d.passengers),
    sizes: pickMany(r.sizes, SIZE_CLASSES),
    bodies: pickMany(r.bodies, BODY_TYPES),
    fuels: pickMany(r.fuels, FUEL_TYPES),
    evCharging: pickOne(r.evCharging, EV_CHARGING_OPTIONS.map((o) => o.value), d.evCharging),
    origin: pickOne(r.origin, ORIGIN_OPTIONS.map((o) => o.value), d.origin),
    payment: pickOne(r.payment, PAYMENT_OPTIONS.map((o) => o.value), d.payment),
    cashBudget: num(r.cashBudget, d.cashBudget, 0, 100000),
    monthly: num(r.monthly, d.monthly, 0, 1000),
    loanMonths: num(r.loanMonths, d.loanMonths, 1, 120),
    maxAge: num(r.maxAge, d.maxAge, 1, 99),
    maxMileage: num(r.maxMileage, d.maxMileage, 1, 99),
    accidentOk: typeof r.accidentOk === "boolean" ? r.accidentOk : d.accidentOk,
    importance,
  };
}

/* ═══ 유형 계산 ═══ */

export function calcAxisScores(answers: Record<number, number>, c: MbtiConditions): Record<Axis, number> {
  const s: Record<Axis, number> = { DC: 0, SL: 0, EP: 0, HT: 0 };
  for (const q of QUESTIONS) {
    const idx = answers[q.id];
    if (idx === undefined || !q.options[idx]) continue;
    s[q.axis] += q.options[idx].score;
  }

  /* DC: 성능 vs 정숙성 중요도 반영 */
  s.DC += (c.importance.performance - c.importance.quiet) * 0.75;

  /* SL: 차급·차체·탑승 인원으로 계산 (+ = Small) */
  if (c.sizes.length) {
    const avg = c.sizes.reduce((a, z) => a + SIZE_CLASSES.indexOf(z), 0) / c.sizes.length; /* 0~5 */
    s.SL += (2.5 - avg) * 2;
  }
  if (c.bodies.includes("SUV") || c.bodies.includes("MPV")) s.SL -= 1.5;
  if (c.bodies.includes("해치백")) s.SL += 1;
  s.SL += { "1-2": 2, "3-4": 0.5, "5": -1.5, "6+": -4 }[c.passengers];
  if (c.uses.includes("family") || c.uses.includes("leisure")) s.SL -= 1;
  if (c.importance.space >= 4) s.SL -= 1;

  /* EP: 국산/수입 + 예산 */
  s.EP += { domestic: 2, domesticPref: 1, any: 0, import: -3 }[c.origin];
  const budget = calcAffordable(c);
  if (budget <= 1500) s.EP += 1.5;
  else if (budget >= 4000) s.EP -= 1.5;
  if (c.importance.design >= 4) s.EP -= 1;
  if (c.importance.upkeep >= 4) s.EP += 1;

  /* HT: 연료에 전기를 고르지 않았다면 전기차 테마 유형(H)이 나오지 않게 */
  if (c.fuels.includes("전기") && c.evCharging !== "none") s.HT += 1;
  else s.HT = Math.min(s.HT, -1);

  return s;
}

export function calcTypeCode(s: Record<Axis, number>): string {
  return (s.DC > 0 ? "D" : "C") + (s.SL > 0 ? "S" : "L") + (s.EP > 0 ? "E" : "P") + (s.HT > 0 ? "H" : "T");
}

/* ═══ 16유형 정의 (재미 요소 — 추천 차량은 조건 기반으로 별도 계산) ═══ */
export interface MbtiType {
  code: string;
  emoji: string;
  name: string;
  vibe: string;
  subtitle: string;
  desc: string;
  tags: string[];
  color: string;
}

export const MBTI_TYPES: Record<string, MbtiType> = {
  DSET: {
    code: "DSET", emoji: "🏎️", name: "골목길 드리프터",
    vibe: "신호 바뀌면 출발 부스터",
    subtitle: "작고 빠른 차로 도심 골목을 지배하는 스트리트 레이서",
    desc: "신호가 초록색으로 바뀌는 순간이 하루 중 가장 행복한 당신. 작지만 빠르고, 저렴하지만 달릴 때는 스포츠카 못지않은 가성비 스포츠의 끝판왕.",
    tags: ["#골목왕", "#신호대기킬러", "#RPM중독"],
    color: "#FF5A3C",
  },
  DSEH: {
    code: "DSEH", emoji: "⚡", name: "무소음 킬러",
    vibe: "뒤 없는 테무 슈마허",
    subtitle: "전기차의 무소음 가속을 즐기는 조용한 스피드 광",
    desc: "배기음? 필요 없어. 전기 모터의 즉각적인 토크로 조용히, 하지만 확실하게 앞차를 제치는 게 내 스타일. 소리 없이 강한 자가 진짜 강한 거야.",
    tags: ["#무소음질주", "#전기충격", "#즉발토크"],
    color: "#00C471",
  },
  DSPT: {
    code: "DSPT", emoji: "🦡", name: "벌꿀오소리",
    vibe: "다시는 소형을 무시하지 마라",
    subtitle: "작지만 프리미엄, 건드리면 안 되는 소형 맹수",
    desc: "외형은 귀여운데 밟으면 미친 듯이 달리는, 길 위의 벌꿀오소리. 작다고 무시했다가 백미러에서 사라지는 경험을 선사해줌.",
    tags: ["#작은고추", "#프리미엄핫해치", "#무시금지"],
    color: "#9B30FF",
  },
  DSPH: {
    code: "DSPH", emoji: "🎮", name: "전기 고카트",
    vibe: "제로백 자랑이 인사말",
    subtitle: "최신 전기 기술 + 프리미엄 퍼포먼스의 얼리어답터",
    desc: "만나면 첫마디가 '내 차 제로백이 몇 초인지 알아?'인 사람. 최신 전기차 기술에 미쳐있고, 작지만 빠른 전기 머신에 푹 빠진 테크 레이서.",
    tags: ["#제로백자랑", "#얼리어답터", "#전기고성능"],
    color: "#3060FF",
  },
  DLET: {
    code: "DLET", emoji: "🦬", name: "가성비 불도저",
    vibe: "덩치값 안 한다고? 밟아봐",
    subtitle: "크고 힘세고 합리적인, 가성비 끝판왕 파워 머신",
    desc: "뭐든 실어주고, 누구든 태워주고, 어디든 가주는 든든한 불도저. 근데 밟으면 이 덩치가? 싶을 정도로 잘 달림. 가성비로 세상을 평정하는 현실 만렙.",
    tags: ["#만능불도저", "#가성비만렙", "#덩치는국룰"],
    color: "#CC6633",
  },
  DLEH: {
    code: "DLEH", emoji: "🗺️", name: "충전 유목민",
    vibe: "충전소 찾다 보니 전국일주 함",
    subtitle: "큰 전기차로 충전 여행 다니는 친환경 어드벤처러",
    desc: "'이 근처 급속충전소 어디야?'가 내비보다 먼저 나오는 말. 충전소 찾아다니다 보니 어느새 전국 맛집도 다 섭렵한 의도치 않은 여행 고수.",
    tags: ["#충전소헌터", "#전국일주", "#전기SUV"],
    color: "#2D8A52",
  },
  DLPT: {
    code: "DLPT", emoji: "🔊", name: "배기음 ASMR",
    vibe: "엔진 소리 울리면 창문부터 내림",
    subtitle: "대형 프리미엄의 엔진 사운드에 중독된 그랜드 투어러",
    desc: "시동 거는 순간 울려퍼지는 배기음이 오늘 하루의 BGM. 터널 지날 때 일부러 창문 내리고 배기음 반사를 즐기는, 감성과 파워를 동시에 가진 도로 위의 왕.",
    tags: ["#배기음중독", "#터널드라이브", "#그랜드투어러"],
    color: "#1A1A1A",
  },
  DLPH: {
    code: "DLPH", emoji: "🦾", name: "도로 위 아이언맨",
    vibe: "핸들 잡는 건 레트로 감성",
    subtitle: "최고급 전기 대형차로 시대를 앞서가는 선구자",
    desc: "자율주행 레벨이 올라갈 때마다 흥분하는 사람. '핸들은 언젠가 사라질 거야'라고 진지하게 말하면서 최신 전기 플래그십으로 미래를 먼저 사는 중.",
    tags: ["#미래에서옴", "#자율주행대기", "#테크플래그십"],
    color: "#E8A020",
  },
  CSET: {
    code: "CSET", emoji: "🧚", name: "연비 요정",
    vibe: "주유비가 진짜 커피값",
    subtitle: "작고 실속 있는 차로 유지비 최소화에 도전하는 실속파",
    desc: "한 달 주유비가 카페라떼 몇 잔값이라는 전설의 연비왕. 연비 앱 깔아서 매일 체크하고, 에코 모드는 기본. '내 차 리터당 18 나와~'가 자랑의 시작.",
    tags: ["#연비맛집", "#유지비다이어트", "#커피값주유"],
    color: "#00C471",
  },
  CSEH: {
    code: "CSEH", emoji: "🔌", name: "충전 기생충",
    vibe: "회사 전기로 출퇴근 해결",
    subtitle: "전기 소형차로 회사 충전기 꽂아두고 유지비 최소화",
    desc: "회사 주차장 충전기 자리를 위해 30분 일찍 출근하는 사람. 유지비를 기술로 해결하는 현대판 돈키호테.",
    tags: ["#충전자리사수", "#유지비해킹", "#전기출퇴근"],
    color: "#3060FF",
  },
  CSPT: {
    code: "CSPT", emoji: "☕", name: "에스프레소",
    vibe: "작은데 진하고 있어보임",
    subtitle: "작지만 고급, 에스프레소처럼 진한 감성의 프리미엄 소형",
    desc: "사이즈는 작아도 한 모금에 '다르다'를 느끼게 하는 에스프레소 같은 차. 가죽 냄새, 조용한 실내, 작지만 확실한 프리미엄. '차는 작아도 급은 높게' 주의.",
    tags: ["#작은사치", "#카페감성", "#소확프"],
    color: "#8B6914",
  },
  CSPH: {
    code: "CSPH", emoji: "📊", name: "가계부 흑대",
    vibe: "보험료까지 원 단위로 추적함",
    subtitle: "최신 전기 소형차로 유지비 원 단위까지 추적하는 전략가",
    desc: "엑셀로 유지비 스프레드시트 만들어서 매달 업데이트하는 사람. 보험료, 충전비, 타이어 마모율까지 계산해서 손익분기를 프레젠테이션 하는 리얼 가계부 흑대.",
    tags: ["#엑셀시트", "#손익분기", "#유지비마스터"],
    color: "#1847FF",
  },
  CLET: {
    code: "CLET", emoji: "📦", name: "짐승",
    vibe: "3열 접으면 이삿짐센터 개업 가능",
    subtitle: "넓고 편하고 경제적인 가족의 든든한 짐승(짐+SUV)",
    desc: "트렁크 열면 이삿짐센터 부럽지 않은 적재 공간. 코스트코 갈 때 진가를 발휘하고, 캠핑 장비도 여유롭게. 가족의 짐을 다 실어주는 든든한 짐승.",
    tags: ["#이사가능", "#코스트코전용", "#캠핑마스터"],
    color: "#CC6633",
  },
  CLEH: {
    code: "CLEH", emoji: "🌍", name: "에코 전도사",
    vibe: "애들한테 지구 지킨다고 말함",
    subtitle: "큰 전기차로 가족과 함께 지구를 지키는 친환경 부모",
    desc: "'우리 차는 전기차라서 매연이 안 나와~'를 애들한테 매일 교육하는 부모. 환경도 생각하고, 공간도 넓고, 기술도 최신인 전기차로 에코 라이프 실현 중.",
    tags: ["#친환경가족", "#지구지킴이", "#ESG육아"],
    color: "#2D8A52",
  },
  CLPT: {
    code: "CLPT", emoji: "👔", name: "뒷좌석 귀족",
    vibe: "기사님 강남이요 에너지",
    subtitle: "뒷좌석에서 쉬면서 이동하는 것을 꿈꾸는 편안함의 끝판왕",
    desc: "탈 때 뒷좌석부터 확인하는 사람. 시트 리클라이닝 각도, 레그룸, 정숙성이 차 살 때 체크리스트 1번. 언젠가 기사님이 생기면 완성될 인생 로드맵.",
    tags: ["#뒷좌석파", "#기사님꿈", "#리무진감성"],
    color: "#9B30FF",
  },
  CLPH: {
    code: "CLPH", emoji: "🏆", name: "라스보스",
    vibe: "자율주행 나오면 Day1 구매각",
    subtitle: "최고급 전기 대형차의 최종 보스, 자율주행 Day1 예약자",
    desc: "'완전 자율주행 나오면 그날 바로 삽니다.' 최신 기술, 최대 공간, 최고급 품질을 전부 갖춘 차만 눈에 들어오는 최종 보스. 차가 곧 기술력의 상징.",
    tags: ["#최종보스", "#Day1구매", "#기술만렙"],
    color: "#FF3B1E",
  },
};

/* 축 설명 */
export const AXIS_INFO = {
  DC: { left: "D (Drive)", right: "C (Comfort)", leftDesc: "주행의 재미 추구", rightDesc: "편안한 승차감 추구", leftEmoji: "🏎️", rightEmoji: "🛋️" },
  SL: { left: "S (Small)", right: "L (Large)", leftDesc: "작고 실용적인 차", rightDesc: "넓고 큰 차", leftEmoji: "🚗", rightEmoji: "🚙" },
  EP: { left: "E (Economy)", right: "P (Premium)", leftDesc: "가성비·경제적", rightDesc: "고급·프리미엄", leftEmoji: "💰", rightEmoji: "💎" },
  HT: { left: "H (High-tech)", right: "T (Traditional)", leftDesc: "최신기술·전기차", rightDesc: "검증된 기술·내연기관", leftEmoji: "🤖", rightEmoji: "🔧" },
};
