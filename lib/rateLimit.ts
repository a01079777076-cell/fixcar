// 📁 저장 경로: lib/rateLimit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * 간단한 인메모리 Rate Limiter
 * @param key - IP 또는 유저 ID
 * @param limit - 허용 요청 수 (기본 60)
 * @param windowMs - 시간 창 (기본 60초)
 * @returns { success, remaining, resetIn }
 */
export function rateLimit(
  key: string,
  limit: number = 60,
  windowMs: number = 60_000
): { success: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1, resetIn: windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, resetIn: entry.resetTime - now };
}

/**
 * Next.js API Route에서 사용하는 헬퍼
 * headers에서 IP를 추출하여 rate limit 적용
 */
export function getClientIP(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

// 오래된 엔트리 주기적 정리 (메모리 누수 방지)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetTime) rateLimitMap.delete(key);
    }
  }, 300_000); // 5분마다
}
