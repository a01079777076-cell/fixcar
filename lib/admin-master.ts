// 📁 저장 경로: lib/admin-master.ts
// 운영자 통합관리 — Prisma 스키마(DMMF) 기반 범용 DB 접근 유틸 (서버 전용)
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface FieldMeta {
  name: string;
  kind: "scalar" | "enum" | "object" | "unsupported";
  type: string;
  isList: boolean;
  isRequired: boolean;
  isId: boolean;
  isUpdatedAt: boolean;
  hasDefault: boolean;
  enumValues?: string[];
  hidden?: boolean;     // 응답에서 제외 (비밀번호 등)
  readOnly?: boolean;   // 수정 불가
}

export interface ModelMeta {
  name: string;         // Prisma 모델명 (예: Car)
  label: string;        // 한글 라벨
  idField: string;
  fields: FieldMeta[];  // 스칼라/enum 필드만
}

/* 한글 라벨 */
const LABELS: Record<string, string> = {
  User: "회원", Dealer: "딜러·상사", Car: "매물", Banner: "배너", Favorite: "찜",
  Inquiry: "문의", Purchase: "구매·결제", BlogPost: "블로그", CommunityPost: "커뮤니티 글",
  CommunityComment: "커뮤니티 댓글", CommunityReply: "커뮤니티 답글", CommunityReport: "커뮤니티 신고",
  Notice: "공지", Event: "이벤트", WishAlert: "관심차 알림", CatalogReport: "카탈로그 신고",
  VisitorLog: "방문 로그", CarScore: "차량 점수", UserMbti: "회원 MBTI", DealerReview: "딜러 리뷰",
};

/* 절대 응답에 내보내지 않는 필드 */
const HIDDEN: Record<string, string[]> = {
  User: ["password"],
};

let cache: ModelMeta[] | null = null;

export function getModels(): ModelMeta[] {
  if (cache) return cache;
  const enums = new Map<string, string[]>(
    Prisma.dmmf.datamodel.enums.map(e => [e.name, e.values.map(v => v.name)])
  );
  cache = Prisma.dmmf.datamodel.models.map(m => {
    const hidden = HIDDEN[m.name] || [];
    const fields: FieldMeta[] = m.fields
      .filter(f => f.kind === "scalar" || f.kind === "enum")
      .map(f => ({
        name: f.name,
        kind: f.kind as FieldMeta["kind"],
        type: f.type as string,
        isList: f.isList,
        isRequired: f.isRequired,
        isId: f.isId,
        isUpdatedAt: !!f.isUpdatedAt,
        hasDefault: f.hasDefaultValue,
        enumValues: f.kind === "enum" ? enums.get(f.type as string) : undefined,
        hidden: hidden.includes(f.name) || undefined,
        readOnly: f.isId || !!f.isUpdatedAt || hidden.includes(f.name) || undefined,
      }));
    const idField = m.fields.find(f => f.isId)?.name || "id";
    return { name: m.name, label: LABELS[m.name] || m.name, idField, fields };
  });
  return cache;
}

export function getModel(name: string): ModelMeta | null {
  return getModels().find(m => m.name === name) || null;
}

/* prisma.car / prisma.dealerReview … 위임 객체 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function delegate(model: ModelMeta): any {
  const key = model.name[0].toLowerCase() + model.name.slice(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any)[key];
}

/* id 값 타입 변환 */
export function parseId(model: ModelMeta, raw: string): number | string {
  const f = model.fields.find(x => x.name === model.idField);
  return f && (f.type === "Int" || f.type === "BigInt") ? Number(raw) : raw;
}

/* 숨김 필드 제외 select */
export function safeSelect(model: ModelMeta): Record<string, boolean> {
  const sel: Record<string, boolean> = {};
  for (const f of model.fields) if (!f.hidden) sel[f.name] = true;
  return sel;
}

/* 필드 타입에 맞게 입력값 변환 — 잘못된 값이면 throw */
function coerce(f: FieldMeta, v: unknown): unknown {
  if (v === null || v === "") {
    if (f.isList) return [];
    if (!f.isRequired) return null;
    if (f.type === "String") return "";
    throw new Error(`${f.name}: 필수 항목입니다`);
  }
  if (f.isList) {
    const arr = Array.isArray(v) ? v : String(v).split(",").map(s => s.trim()).filter(Boolean);
    return arr.map(x => coerce({ ...f, isList: false, isRequired: true }, x));
  }
  if (f.kind === "enum") {
    if (!f.enumValues?.includes(String(v))) throw new Error(`${f.name}: 허용되지 않는 값 (${f.enumValues?.join(", ")})`);
    return String(v);
  }
  switch (f.type) {
    case "Int": case "BigInt": {
      const n = Number(v);
      if (!Number.isInteger(n)) throw new Error(`${f.name}: 정수를 입력하세요`);
      return n;
    }
    case "Float": case "Decimal": {
      const n = Number(v);
      if (Number.isNaN(n)) throw new Error(`${f.name}: 숫자를 입력하세요`);
      return n;
    }
    case "Boolean":
      return v === true || v === "true" || v === 1 || v === "1";
    case "DateTime": {
      const d = new Date(String(v));
      if (Number.isNaN(d.getTime())) throw new Error(`${f.name}: 날짜 형식이 올바르지 않습니다`);
      return d;
    }
    case "Json":
      return typeof v === "string" ? JSON.parse(v) : v;
    default:
      return String(v);
  }
}

/* 수정용 data 객체 생성 (수정 불가 필드는 무시) */
export function buildUpdateData(model: ModelMeta, body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const f of model.fields) {
    if (f.readOnly || !(f.name in body)) continue;
    data[f.name] = coerce(f, body[f.name]);
  }
  return data;
}

/* 검색어 → where 조건 (문자열 필드 부분일치 + 숫자면 id 일치) */
export function buildSearch(model: ModelMeta, q: string) {
  const or: Record<string, unknown>[] = [];
  for (const f of model.fields) {
    if (f.hidden || f.isList) continue;
    if (f.type === "String" && f.kind === "scalar") or.push({ [f.name]: { contains: q, mode: "insensitive" } });
  }
  const idF = model.fields.find(f => f.name === model.idField);
  if (idF && (idF.type === "Int" ? /^\d+$/.test(q) : true)) {
    or.push({ [model.idField]: idF.type === "Int" ? Number(q) : q });
  }
  return or.length ? { OR: or } : {};
}

/* ?f.status=SOLD&f.dealerId=3 형태 필터 */
export function buildFilters(model: ModelMeta, params: URLSearchParams) {
  const where: Record<string, unknown> = {};
  params.forEach((value, key) => {
    if (!key.startsWith("f.") || value === "") return;
    const name = key.slice(2);
    const f = model.fields.find(x => x.name === name);
    if (!f || f.hidden || f.isList) return;
    where[name] = coerce(f, value);
  });
  return where;
}

/* 모델별 추가 관계 정보 (목록에서 바로 보이게) */
export const LIST_INCLUDE: Record<string, Record<string, unknown>> = {
  Car: { dealer: { select: { shopName: true, complexName: true } }, _count: { select: { favorites: true, inquiries: true } } },
  Dealer: { user: { select: { name: true, email: true, phone: true } }, _count: { select: { cars: true, reviews: true } } },
  User: { dealer: { select: { id: true, shopName: true } } },
  Inquiry: { car: { select: { name: true } } },
  Purchase: { car: { select: { name: true } }, user: { select: { name: true } } },
  DealerReview: { dealer: { select: { shopName: true } } },
  CommunityReport: { post: { select: { id: true, title: true, status: true } }, user: { select: { name: true, nickname: true } } },
};
