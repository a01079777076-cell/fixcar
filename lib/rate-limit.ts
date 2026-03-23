/**
 * 간단한 메모리 기반 Rate Limiter
 * 운영 시 Redis로 교체 권장
 */

const store = new Map<string, { count: number; resetTime: number }>();

/** IP 기반 속도 제한 확인 */
export function rateLimit(
  ip: string,
  options: { maxRequests?: number; windowMs?: number } = {}
): { allowed: boolean; remaining: number } {
  const { maxRequests = 60, windowMs = 60000 } = options; /* 기본: 1분에 60번 */
  const now = Date.now();
  const key = ip;

  const record = store.get(key);
  if (!record || now > record.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  record.count++;
  if (record.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxRequests - record.count };
}

/** 오래된 레코드 정리 (5분마다 자동) */
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of store) {
    if (now > val.resetTime) store.delete(key);
  }
}, 300000);
