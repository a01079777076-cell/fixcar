import { NextResponse } from "next/server";

/**
 * 메모리 기반 Rate Limiter
 * 운영 시 Redis로 교체 권장
 */

const store = new Map<string, { count: number; resetTime: number }>();

/** 오래된 레코드 정리 (5분마다) */
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of store) {
    if (now > val.resetTime) store.delete(key);
  }
}, 300000);

/** IP 기반 속도 제한 — 초과 시 NextResponse 반환, 통과 시 null */
export function checkRateLimit(
  ip: string,
  endpoint: string,
  options: { limit?: number; windowMs?: number } = {}
): NextResponse | null {
  const { limit = 60, windowMs = 60000 } = options;
  const now = Date.now();
  const key = `${ip}:${endpoint}`;

  const record = store.get(key);
  if (!record || now > record.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return null;
  }

  record.count++;
  if (record.count > limit) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  return null;
}

/** 클라이언트 IP 추출 */
export function getClientIp(req: { headers: { get: (k: string) => string | null } }): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** 간단한 rateLimit (레거시 호환) */
export function rateLimit(
  ip: string,
  options: { maxRequests?: number; windowMs?: number } = {}
): { allowed: boolean; remaining: number } {
  const { maxRequests = 60, windowMs = 60000 } = options;
  const result = checkRateLimit(ip, "global", { limit: maxRequests, windowMs });
  return { allowed: result === null, remaining: result === null ? maxRequests : 0 };
}
