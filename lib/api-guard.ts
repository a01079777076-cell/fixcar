import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth, requireAdmin, requireDealer, AuthUser } from "./auth";
import { checkRateLimit, getClientIp } from "./rate-limit";

interface GuardOptions {
  /** 인증 레벨: "none" | "user" | "dealer" | "admin" */
  auth?: "none" | "user" | "dealer" | "admin";
  /** Rate Limit 요청 수 (기본 60/분) */
  rateLimit?: number;
  /** Rate Limit 윈도우 ms (기본 60초) */
  rateLimitWindow?: number;
}

interface GuardResult {
  user: AuthUser | null;
  ip: string;
}

/**
 * API 라우트 보호 가드
 * 
 * 사용법:
 * ```
 * export async function GET(req: NextRequest) {
 *   const guard = apiGuard(req, { auth: "user", rateLimit: 30 });
 *   if (guard instanceof NextResponse) return guard; // 차단됨
 *   const { user, ip } = guard;
 *   // ... 비즈니스 로직
 * }
 * ```
 */
export function apiGuard(
  req: NextRequest,
  options: GuardOptions = {}
): GuardResult | NextResponse {
  const { auth = "none", rateLimit = 60, rateLimitWindow = 60_000 } = options;

  /* 1. Rate Limit 체크 */
  const ip = getClientIp(req);
  const endpoint = new URL(req.url).pathname;
  const limited = checkRateLimit(ip, endpoint, {
    limit: rateLimit,
    windowMs: rateLimitWindow,
  });
  if (limited) return limited;

  /* 2. 인증 체크 */
  if (auth === "none") {
    return { user: getAuthUser(req), ip };
  }

  if (auth === "admin") {
    const result = requireAdmin(req);
    if (result instanceof NextResponse) return result;
    return { user: result, ip };
  }

  if (auth === "dealer") {
    const result = requireDealer(req);
    if (result instanceof NextResponse) return result;
    return { user: result, ip };
  }

  /* auth === "user" */
  const result = requireAuth(req);
  if (result instanceof NextResponse) return result;
  return { user: result, ip };
}

/**
 * 에러 응답 통일 포맷
 */
export function apiError(message: string, status = 500, detail?: string) {
  console.error(`[API Error] ${message}`, detail || "");
  return NextResponse.json(
    { error: message, ...(process.env.NODE_ENV === "development" && detail ? { detail } : {}) },
    { status }
  );
}

/**
 * 성공 응답 통일 포맷
 */
export function apiSuccess(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}
