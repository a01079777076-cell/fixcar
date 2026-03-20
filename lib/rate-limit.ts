import { NextResponse } from "next/server";

/**
 * 메모리 기반 Rate Limiter (서버리스 환경 호환)
 * Vercel에서는 인스턴스 간 공유 안 되지만 기본 보호엔 충분
 * 추후 Upstash Redis로 업그레이드 가능
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/* 5분마다 만료된 항목 정리 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

interface RateLimitConfig {
  /** 허용 요청 수 (기본: 60) */
  limit?: number;
  /** 윈도우 시간 ms (기본: 60초) */
  windowMs?: number;
}

/**
 * Rate Limit 체크
 * @returns null이면 통과, NextResponse면 차단됨
 */
export function checkRateLimit(
  ip: string,
  endpoint: string = "global",
  config: RateLimitConfig = {}
): NextResponse | null {
  const { limit = 60, windowMs = 60_000 } = config;
  const key = `${ip}:${endpoint}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    /* 새 윈도우 시작 */
    store.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count++;

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return null;
}

/**
 * IP 추출 (Vercel/Cloudflare 호환)
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}
