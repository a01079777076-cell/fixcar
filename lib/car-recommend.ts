/* 차량 MBTI 조건 기반 추천 엔진 (서버 전용)
 * - 카탈로그(data/catalog_data.ts) 전 모델을 정규화한 뒤, 사용자 조건으로 걸러내고 중요도 가중치로 점수화
 * - 연료는 사용자가 고른 것만 통과 (연비 중요 ≠ 전기차 강제)
 * - 예산은 신차가 × 연식 감가 추정으로 '살 수 있는 연식이 있는지'만 판단 (가격 자체를 화면에 표시하지 않음)
 */
import { BRAND_MODELS, CAR_SPECS, CAR_GRADES } from "@/data/catalog_data";
import {
  type BodyType,
  type FuelType,
  type ImportanceKey,
  type MbtiConditions,
  type SizeClass,
  calcAffordable,
} from "@/data/car_mbti_data";

interface RawModel { name: string; status?: string; generation?: string; years?: string; segment?: string }
interface RawSpec {
  cc: number; fuel: string; transmission: string; drivetrain: string; zeroToHundred: string; topSpeed: number;
  weight: number; length: number; width: number; height: number; wheelbase: number; bodyType: string; seats: number; segment: string;
}
interface RawGrade { grade: string; price: number; engine: string; power: string; torque: string; efficiency: string }

type GradeFuel = FuelType | "PHEV" | "수소";

export interface ModelProfile {
  name: string;
  base: string;
  brand: string;
  domestic: boolean;
  premium: boolean;
  size: SizeClass | null;
  body: BodyType | null;
  fuels: Set<GradeFuel>;
  seatsMax: number;
  cc: number;
  priceMin: number | null;   /* 신차가 최저 (만원) */
  priceMax: number | null;
  grades: { fuel: Set<GradeFuel>; eff: number | null; evEff: number | null; power: number }[];
  powerMax: number;
  zeroTo100: number | null;
  yearStart: number;
  yearEnd: number | null;    /* null = 현행 */
  yearsKnown: boolean;       /* 카탈로그에 생산연도가 없으면 false (추정값 사용) */
  discontinued: boolean;
  length: number;
}

const PREMIUM_BRANDS = new Set([
  "제네시스", "BMW", "메르세데스-벤츠", "벤츠", "아우디", "포르쉐", "볼보", "렉서스", "테슬라", "랜드로버", "재규어",
  "링컨", "캐딜락", "마세라티", "벤틀리", "롤스로이스", "페라리", "람보르기니", "맥라렌", "애스턴마틴", "폴스타", "MINI", "DS",
]);
const EXOTIC_BRANDS = new Set(["벤틀리", "롤스로이스", "페라리", "람보르기니", "맥라렌", "애스턴마틴", "마세라티", "로터스"]);

const CURRENT_YEAR = new Date().getFullYear();

/* ── 파싱 유틸 ── */

function parseSize(text: string, length: number): SizeClass | null {
  if (/경차|경형/.test(text)) return "경차";
  if (/준대형|중대형/.test(text)) return "준대형";
  if (/준중형/.test(text)) return "준중형";
  if (/플래그십|대형/.test(text)) return "대형";
  if (/중형|미드사이즈/.test(text)) return "중형";
  if (/소형|엔트리/.test(text)) return "소형";
  if (length > 0) {
    if (length >= 5050) return "대형";
    if (length >= 4880) return "준대형";
    if (length >= 4650) return "중형";
    if (length >= 4350) return "준중형";
    if (length >= 3700) return "소형";
    return "경차";
  }
  return null;
}

function parseBody(text: string, height: number): BodyType | null {
  if (/MPV|미니밴|레저 밴|박스카/.test(text)) return "MPV";
  if (/트럭|픽업|상용|버스|밴/.test(text)) return "트럭";
  if (/SUV|CUV|크로스오버|RV/.test(text)) return "SUV";
  if (/해치/.test(text)) return "해치백";
  if (/쿠페|스포츠|로드스터|GT|그란|스포트백/.test(text)) return "쿠페";
  if (/세단|왜건/.test(text)) return "세단";
  if (/경차|경형/.test(text)) return "해치백";
  if (height >= 1600) return "SUV";
  return null;
}

function parseFuels(text: string): Set<GradeFuel> {
  const f = new Set<GradeFuel>();
  if (/PHEV|플러그인/.test(text)) f.add("PHEV");
  if (/(^|[^PM])HEV|하이브리드/.test(text.replace(/PHEV|MHEV/g, ""))) f.add("하이브리드");
  if (/가솔린|터보|MPI|GDi|TFSI|TSI|MHEV/i.test(text)) f.add("가솔린");
  if (/디젤|CRDi|TDI|dCi|VGT/i.test(text)) f.add("디젤");
  if (/LPG|LPi|LPe/i.test(text)) f.add("LPG");
  if (/전기|(^|[^A-Z])EV($|[^0-9A-Z])|kWh/.test(text)) f.add("전기");
  if (/수소|FCEV/.test(text)) f.add("수소");
  return f;
}

/* 생산연도가 없으면: 현행은 최근 6년, 단종은 '6년 전 단종'으로 보수적으로 가정 */
function parseYears(years: string, discontinued: boolean): { start: number; end: number | null; known: boolean } {
  const m = years.match(/(\d{4})\s*-\s*(\d{4})?/);
  if (m) return { start: Number(m[1]), end: m[2] ? Number(m[2]) : null, known: true };
  return discontinued
    ? { start: CURRENT_YEAR - 14, end: CURRENT_YEAR - 6, known: false }
    : { start: CURRENT_YEAR - 6, end: null, known: false };
}

/* ── 카탈로그 정규화 (모듈 캐시) ── */

let PROFILES: ModelProfile[] | null = null;

export function getProfiles(): ModelProfile[] {
  if (PROFILES) return PROFILES;
  const brands = BRAND_MODELS as unknown as Record<string, { category: string; models: RawModel[] }>;
  const specs = CAR_SPECS as unknown as Record<string, RawSpec>;
  const gradesAll = CAR_GRADES as unknown as Record<string, RawGrade[]>;
  const list: ModelProfile[] = [];

  for (const brand of Object.keys(brands)) {
    const domestic = brands[brand].category === "국산";
    for (const m of brands[brand].models) {
      const spec = specs[m.name];
      const rawGrades = gradesAll[m.name] || [];
      /* 스펙·등급 정보가 모두 없는 모델은 근거 없이 추천하지 않음 */
      if (!spec && rawGrades.length === 0) continue;
      const segment = m.segment || "";
      const text = `${segment} ${spec?.segment || ""} ${spec?.bodyType || ""}`;
      const length = spec?.length || 0;

      /* 연료: 스펙 + 등급별 엔진명 */
      const fuels = parseFuels(`${spec?.fuel || ""} ${rawGrades.map((g) => `${g.engine} ${g.grade}`).join(" ")}`);
      if (fuels.size === 0 && /전기/.test(segment)) fuels.add("전기");

      const grades = rawGrades.map((g) => {
        let gf = parseFuels(`${g.engine} ${g.grade}`);
        /* '1.6 T-GDi HEV'처럼 하이브리드·전기 등급은 가솔린 등급으로 치지 않음 (연비 과대평가 방지) */
        if (gf.has("하이브리드") || gf.has("PHEV") || gf.has("전기")) gf.delete("가솔린");
        if (gf.size === 0) gf = new Set(fuels);
        const effStr = String(g.efficiency || "");
        const effNum = parseFloat(effStr);
        const isEvEff = /kWh/.test(effStr);
        return {
          fuel: gf,
          eff: !isEvEff && Number.isFinite(effNum) && effNum > 0 ? Math.min(effNum, 25) : null,
          evEff: isEvEff && Number.isFinite(effNum) ? effNum : null,
          power: parseFloat(g.power) || 0,
        };
      });

      const prices = rawGrades.map((g) => Number(g.price)).filter((p) => p > 0);
      const seatsFromGrades = rawGrades
        .map((g) => g.grade.match(/(\d+)\s*인승/))
        .filter(Boolean)
        .map((x) => Number((x as RegExpMatchArray)[1]));
      const seatsFromName = (m.name.match(/(\d+)\s*인승/) || [])[1];
      const seatsMax = Math.max(spec?.seats || 0, ...seatsFromGrades, seatsFromName ? Number(seatsFromName) : 0) || 5;
      const zt = parseFloat(spec?.zeroToHundred || "");
      const discontinued = m.status === "단종";
      const { start, end, known } = parseYears(m.years || "", discontinued);

      let body = parseBody(text, spec?.height || 0);
      if (body === null && seatsMax >= 7) body = "MPV";

      list.push({
        name: m.name,
        base: m.name.split(" ")[0],
        brand,
        domestic,
        premium: PREMIUM_BRANDS.has(brand),
        size: parseSize(text, length),
        body,
        fuels,
        seatsMax,
        cc: spec?.cc || 0,
        priceMin: prices.length ? Math.min(...prices) : null,
        priceMax: prices.length ? Math.max(...prices) : null,
        grades,
        powerMax: Math.max(0, ...grades.map((g) => g.power)),
        zeroTo100: Number.isFinite(zt) && zt > 0 ? zt : null,
        yearStart: start,
        yearEnd: end,
        yearsKnown: known,
        discontinued,
        length,
      });
    }
  }
  PROFILES = list;
  return list;
}

/* ── 예산 판단 (감가 추정) ── */

const RESIDUAL = [0.9, 0.8, 0.72, 0.65, 0.58, 0.52, 0.47, 0.42, 0.37, 0.33, 0.28, 0.26, 0.24];
function residual(age: number, p: ModelProfile): number {
  let r = RESIDUAL[Math.min(RESIDUAL.length - 1, Math.max(0, Math.round(age)))];
  if (!p.domestic) r *= 0.85;
  if (p.fuels.size === 1 && p.fuels.has("전기")) r *= 0.85;
  return r;
}

/** 허용 연식 안에서 가장 싸게 살 수 있는 추정가 / 가장 최근 연식 추정가 */
function estimateUsedRange(p: ModelProfile, maxAge: number): { low: number; high: number } | null {
  if (p.priceMin === null) return null;
  const newestAge = p.yearEnd ? CURRENT_YEAR - p.yearEnd : 0;
  const oldestAge = Math.min(maxAge, CURRENT_YEAR - p.yearStart);
  if (oldestAge < newestAge) return null; /* 허용 연식 안에 생산분 없음 */
  return {
    low: p.priceMin * residual(oldestAge, p),
    high: p.priceMin * residual(newestAge, p),
  };
}

/* ── 점수 항목 ── */

const SIZE_IDX: Record<SizeClass, number> = { 경차: 0, 소형: 1, 준중형: 2, 중형: 3, 준대형: 4, 대형: 5 };
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

function allowedGradeFuels(c: MbtiConditions): Set<GradeFuel> | null {
  if (!c.fuels.length) {
    if (c.evCharging !== "none") return null;
    return new Set<GradeFuel>(["가솔린", "디젤", "하이브리드", "PHEV", "LPG"]);
  }
  const s = new Set<GradeFuel>(c.fuels);
  if (c.fuels.includes("하이브리드")) s.add("PHEV");
  if (c.evCharging === "none") s.delete("전기");
  return s;
}

function featureScores(p: ModelProfile, c: MbtiConditions, fuelsOk: Set<GradeFuel> | null): Record<ImportanceKey, number> {
  const sizeI = p.size ? SIZE_IDX[p.size] : 2.5;
  const gradesOk = p.grades.filter((g) => !fuelsOk || [...g.fuel].some((f) => fuelsOk.has(f)));
  const evOnly = p.fuels.size > 0 && [...p.fuels].every((f) => f === "전기");
  const has = (f: GradeFuel) => (fuelsOk ? fuelsOk.has(f) && p.fuels.has(f) : p.fuels.has(f));

  /* 연비·연료비: 허용 연료 등급 중 최고 효율, LPG·디젤은 연료 단가 반영 */
  let fuelEco = 0.4;
  const effCandidates: number[] = [];
  /* 허용 연료 등급의 연비 정보가 없으면(예: 하이브리드가 스펙에만 있음) 연료 종류 기본값 사용 */
  if (!gradesOk.length && fuelsOk) {
    const FUEL_DEFAULT: Record<GradeFuel, number> = { 전기: 0.9, PHEV: 0.85, 하이브리드: 0.8, LPG: 0.5, 디젤: 0.55, 가솔린: 0.4, 수소: 0.6 };
    for (const f of p.fuels) if (fuelsOk.has(f)) effCandidates.push(FUEL_DEFAULT[f]);
  }
  for (const g of gradesOk.length ? gradesOk : fuelsOk ? [] : p.grades) {
    if (g.evEff) effCandidates.push(0.85 + clamp01((g.evEff - 3.5) / 3) * 0.15);
    if (g.eff) {
      let costEff = g.eff;
      if (g.fuel.has("LPG") && !g.fuel.has("가솔린")) costEff *= 1.5;
      else if (g.fuel.has("디젤") && !g.fuel.has("가솔린")) costEff *= 1.1;
      effCandidates.push(clamp01((costEff - 7) / 13));
    }
  }
  if (effCandidates.length) fuelEco = Math.max(...effCandidates);
  else if (evOnly) fuelEco = 0.9;
  else if (has("하이브리드")) fuelEco = 0.75;

  /* 정숙성·승차감 */
  let quiet = [0.2, 0.35, 0.5, 0.65, 0.8, 0.9][Math.round(sizeI)] ?? 0.5;
  if (evOnly || has("전기")) quiet += 0.2;
  else if (has("하이브리드")) quiet += 0.12;
  if (p.fuels.size === 1 && p.fuels.has("디젤")) quiet -= 0.15;
  if (p.premium) quiet += 0.1;
  if (p.body === "트럭") quiet -= 0.3;
  if (p.body === "세단") quiet += 0.05;

  /* 주행 성능 */
  const perfPower = p.powerMax ? clamp01((p.powerMax - 80) / 320) : 0.35;
  const perfZt = p.zeroTo100 ? clamp01((12 - p.zeroTo100) / 8) : null;
  let performance = perfZt !== null ? perfZt * 0.6 + perfPower * 0.4 : perfPower;
  if (p.body === "쿠페") performance += 0.1;

  /* 공간 */
  let space = sizeI / 5;
  if (p.body === "SUV") space += 0.15;
  if (p.body === "MPV") space += 0.35;
  if (p.seatsMax >= 7) space += 0.15;
  if (p.body === "쿠페") space -= 0.2;

  /* 안전·편의: 최신 세대일수록 */
  const genAge = CURRENT_YEAR - p.yearStart;
  const recency = p.yearsKnown ? clamp01(1 - genAge / 14) : p.discontinued ? 0.3 : 0.6;
  let safety = recency * 0.75 + (p.premium ? 0.25 : 0.1);
  if (sizeI >= 3) safety += 0.05;

  /* 유지비 */
  let upkeep = p.domestic ? 0.85 : p.premium ? 0.3 : 0.5;
  if (EXOTIC_BRANDS.has(p.brand)) upkeep = 0.05;
  if (p.cc > 0) upkeep += p.cc <= 1000 ? 0.15 : p.cc <= 1600 ? 0.08 : p.cc <= 2000 ? 0 : p.cc <= 3000 ? -0.1 : -0.2;
  if (evOnly) upkeep += 0.05;

  /* 디자인·브랜드 */
  let design = p.premium ? 0.85 : 0.45;
  if (p.body === "쿠페") design += 0.15;
  if (p.yearsKnown && genAge <= 3) design += 0.1;

  return {
    fuelEco: clamp01(fuelEco),
    quiet: clamp01(quiet),
    performance: clamp01(performance),
    space: clamp01(space),
    safety: clamp01(safety),
    upkeep: clamp01(upkeep),
    design: clamp01(design),
  };
}

const REASON_TEXT: Record<ImportanceKey, string> = {
  fuelEco: "연비·연료비 우수",
  quiet: "정숙성·승차감 좋음",
  performance: "출력 여유",
  space: "넉넉한 공간",
  safety: "최신 안전·편의 사양",
  upkeep: "유지비 부담 적음",
  design: "브랜드·디자인",
};

export interface RecommendedModel {
  name: string;
  brand: string;
  size: SizeClass | null;
  body: BodyType | null;
  fuels: string[];
  seats: number;
  newPriceFrom: number | null;  /* 카탈로그 신차가 최저 (만원) */
  years: string;
  score: number;                /* 0~100 */
  reasons: string[];
  cautions: string[];
}

interface ScoreOptions { relaxSize: boolean; relaxBody: boolean }

function scoreModel(p: ModelProfile, c: MbtiConditions, axes: { DC: number }, opt: ScoreOptions): RecommendedModel | null {
  const fuelsOk = allowedGradeFuels(c);
  const affordable = calcAffordable(c);
  const cautions: string[] = [];
  let penalty = 0;

  /* ── 필수 조건 ── */
  if (p.yearStart > CURRENT_YEAR) return null;
  if (p.yearEnd && CURRENT_YEAR - p.yearEnd > c.maxAge) return null;

  /* 연료 */
  const evOnly = p.fuels.size > 0 && [...p.fuels].every((f) => f === "전기");
  if (fuelsOk) {
    if (![...p.fuels].some((f) => fuelsOk.has(f))) return null;
  } else {
    if (p.fuels.size === 1 && p.fuels.has("수소")) return null;
    if (evOnly && c.evCharging === "none") return null;
  }
  if (evOnly && c.evCharging === "public") {
    penalty += c.dailyKm === "gt100" || c.dailyKm === "50to100" ? 0.12 : 0.05;
    cautions.push("공용 충전소 이용 필요");
  }

  /* 인원 */
  if (c.passengers === "6+" && p.seatsMax < 7) return null;
  if (c.passengers === "5" && p.size === "경차") penalty += 0.15;

  /* 차체 */
  const wantsTruck = c.bodies.includes("트럭") || c.uses.includes("business");
  if (p.body === "트럭" && !wantsTruck) return null;
  if (c.bodies.length) {
    if (p.body === null) {
      if (!opt.relaxBody) return null; /* 차체 정보 없는 모델은 완화 단계에서만 */
      penalty += 0.12;
    } else if (!c.bodies.includes(p.body)) {
      if (!opt.relaxBody) return null;
      penalty += 0.2;
    }
  }

  /* 차급 */
  if (c.sizes.length) {
    if (p.size === null) {
      if (!opt.relaxSize) return null; /* 차급 정보 없는 모델은 완화 단계에서만 */
      penalty += 0.12;
    } else if (!c.sizes.includes(p.size)) {
      const dist = Math.min(...c.sizes.map((z) => Math.abs(SIZE_IDX[z] - SIZE_IDX[p.size as SizeClass])));
      if (!opt.relaxSize || dist > 1) return null;
      penalty += 0.15;
    }
  }

  /* 국산/수입 */
  if (c.origin === "domestic" && !p.domestic) return null;
  if (c.origin === "domesticPref" && !p.domestic) penalty += 0.12;
  if (c.origin === "import" && p.domestic) penalty += p.brand === "제네시스" ? 0.05 : 0.15;

  /* 예산 */
  let budgetFit = 0.5;
  const est = estimateUsedRange(p, c.maxAge);
  if (p.priceMin !== null) {
    if (!est) return null;
    if (est.low > affordable * 1.1) return null;
    if (est.high <= affordable) budgetFit = 1;             /* 최근 연식도 예산 안 */
    else budgetFit = 0.55 + 0.45 * clamp01((affordable - est.low) / Math.max(1, est.high - est.low));
    if (est.high < affordable * 0.25) penalty += 0.08;     /* 예산 대비 지나치게 저가 */
    if (budgetFit < 0.7) cautions.push("예산상 연식 있는 매물 위주");
  } else {
    /* 가격 정보 없음: 수입차는 예산 판단이 어려워 저예산에서 제외 */
    if (!p.domestic && affordable < 3000) return null;
    penalty += 0.08;
    cautions.push("가격 정보 부족");
  }
  if (EXOTIC_BRANDS.has(p.brand) && affordable < 8000) return null;

  /* 초보 */
  if (c.uses.includes("first")) {
    if (p.size === "대형" || p.body === "쿠페") penalty += 0.1;
    if (p.powerMax > 300) penalty += 0.1;
  }

  /* 장거리 & 경차 */
  if ((c.uses.includes("highway") || c.dailyKm === "gt100") && p.size === "경차") penalty += 0.1;

  /* ── 가중 점수 ── */
  const f = featureScores(p, c, fuelsOk);
  const w = { ...c.importance } as Record<ImportanceKey, number>;
  if (c.dailyKm === "50to100") w.fuelEco += 1;
  if (c.dailyKm === "gt100") w.fuelEco += 2;
  if (c.uses.includes("family") || c.uses.includes("leisure")) w.space += 1.5;
  if (c.uses.includes("highway")) { w.quiet += 1; w.performance += 0.5; }
  if (c.uses.includes("first")) w.upkeep += 1;
  if (axes.DC > 0) w.performance += 0.5; else w.quiet += 0.5;
  /* 1(상관없음)은 사실상 0으로 */
  const keys = Object.keys(w) as ImportanceKey[];
  let sumW = 0, sum = 0;
  for (const k of keys) {
    const weight = Math.max(0, w[k] - 1) ** 2; /* 매우 중요(5)가 보통(3)의 4배 */
    sumW += weight;
    sum += weight * f[k];
  }
  const pref = sumW > 0 ? sum / sumW : 0.5;
  const total = pref * 0.75 + budgetFit * 0.25 - penalty;

  /* 추천 이유: 중요도 높고 점수 높은 항목 */
  const reasons = keys
    .filter((k) => c.importance[k] >= 3 && f[k] >= 0.6)
    .sort((a, b) => w[b] * f[b] - w[a] * f[a])
    .slice(0, 3)
    .map((k) => REASON_TEXT[k]);
  if (p.seatsMax >= 7 && (c.passengers === "6+" || c.passengers === "5")) reasons.unshift(`${p.seatsMax}인승`);
  if (budgetFit === 1) reasons.push("예산 안에서 최근 연식 가능");

  const fuelList = [...p.fuels].filter((x) => !fuelsOk || fuelsOk.has(x)).map((x) => (x === "PHEV" ? "플러그인 하이브리드" : x));

  return {
    name: p.name,
    brand: p.brand,
    size: p.size,
    body: p.body,
    fuels: fuelList,
    seats: p.seatsMax,
    newPriceFrom: p.priceMin,
    years: !p.yearsKnown ? (p.discontinued ? "단종" : "현행") : p.yearEnd ? `${p.yearStart}~${p.yearEnd}년` : `${p.yearStart}년~현재`,
    score: Math.round(clamp01(total) * 100),
    reasons: reasons.slice(0, 4),
    cautions,
  };
}

export interface RecommendResult {
  affordable: number;
  models: RecommendedModel[];
  relaxed: boolean;
  totalCandidates: number;
}

export function recommendModels(c: MbtiConditions, axes: { DC: number }, limit = 8): RecommendResult {
  const profiles = getProfiles();
  const run = (opt: ScoreOptions) =>
    profiles.map((p) => scoreModel(p, c, axes, opt)).filter((x): x is RecommendedModel => x !== null);

  let relaxed = false;
  let scored = run({ relaxSize: false, relaxBody: false });
  if (scored.length < 4) {
    relaxed = true;
    scored = run({ relaxSize: true, relaxBody: false });
    if (scored.length < 4) scored = run({ relaxSize: true, relaxBody: true });
  }
  scored.sort((a, b) => b.score - a.score);

  /* 다양성: 같은 차명(세대 다름) 최대 2개, 같은 브랜드 최대 3개 */
  const out: RecommendedModel[] = [];
  const perBase: Record<string, number> = {};
  const perBrand: Record<string, number> = {};
  for (const m of scored) {
    const base = m.name.split(" ")[0];
    if ((perBase[base] || 0) >= 2 || (perBrand[m.brand] || 0) >= 3) continue;
    perBase[base] = (perBase[base] || 0) + 1;
    perBrand[m.brand] = (perBrand[m.brand] || 0) + 1;
    out.push(m);
    if (out.length >= limit) break;
  }
  return { affordable: calcAffordable(c), models: out, relaxed, totalCandidates: scored.length };
}

/* ── 실제 매물 매칭 ── */

export interface ListingLike {
  id: number; name: string; brand: string; year: number; mileage: number; price: number; fuel: string; images: string[];
}

/** 매물명이 추천 모델과 얼마나 맞는지 (모델명 전체 > 차명 앞부분) */
export function matchListingScore(listing: ListingLike, models: RecommendedModel[]): number {
  let best = 0;
  models.forEach((m, i) => {
    const rankBonus = 1 - i / (models.length * 2);
    if (listing.name.includes(m.name)) best = Math.max(best, 1 * rankBonus);
    else if (listing.name.startsWith(m.name.split(" ")[0])) best = Math.max(best, 0.7 * rankBonus);
  });
  return best;
}
