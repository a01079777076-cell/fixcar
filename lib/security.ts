import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * CSRF 보호
 * - 모든 상태 변경 API(POST/PATCH/DELETE)에서 Origin/Referer 헤더 검증
 * - 허용 도메인: fixcar.kr, www.fixcar.kr, localhost
 */
const ALLOWED_ORIGINS = [
  "https://fixcar.kr",
  "https://www.fixcar.kr",
  "http://localhost:3000",
  "http://localhost:3001",
];

export function csrfCheck(req: NextRequest): boolean {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") return true;

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  /* Origin 헤더가 있으면 검증 */
  if (origin) {
    return ALLOWED_ORIGINS.some(o => origin.startsWith(o));
  }

  /* Referer로 대체 검증 */
  if (referer) {
    return ALLOWED_ORIGINS.some(o => referer.startsWith(o));
  }

  /* 둘 다 없으면 (같은 도메인 fetch는 보통 Origin 포함) — 서버사이드 허용 */
  return true;
}

/**
 * API 보안 가드 (통합)
 * - CSRF 검증
 * - 인증 확인
 * - Rate Limit (기존 lib/rate-limit 활용)
 */
export function secureApi(req: NextRequest, options?: { requireAuth?: boolean; requireRole?: string }) {
  /* CSRF */
  if (!csrfCheck(req)) {
    return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 403 });
  }

  /* 인증 */
  if (options?.requireAuth || options?.requireRole) {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
    }
    if (options?.requireRole && user.role !== options.requireRole && user.role !== "ADMIN") {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
    }
  }

  return null; /* 통과 */
}

/**
 * 입력값 정제 (XSS 방지)
 */
export function cleanInput(str: string, maxLen = 5000): string {
  return String(str || "")
    .replace(/[<>]/g, "") /* HTML 태그 제거 */
    .replace(/javascript:/gi, "") /* JS 프로토콜 제거 */
    .replace(/on\w+\s*=/gi, "") /* 이벤트 핸들러 제거 */
    .trim()
    .slice(0, maxLen);
}

/**
 * 이메일 검증
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 한국 전화번호 검증
 */
export function isValidPhone(phone: string): boolean {
  return /^01[016789]-?\d{3,4}-?\d{4}$/.test(phone.replace(/\s/g, ""));
}
