// 📁 저장 경로: middleware.ts (프로젝트 루트)
import { NextRequest, NextResponse } from "next/server";

/* 간단한 Edge 호환 Rate Limiter */
const rateBuckets = new Map<string, { count: number; reset: number }>();

function checkRate(ip: string, limit = 100, windowSec = 60): boolean {
  const now = Date.now();
  const entry = rateBuckets.get(ip);
  if (!entry || now > entry.reset) {
    rateBuckets.set(ip, { count: 1, reset: now + windowSec * 1000 });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* API 경로만 Rate Limit 적용 */
  if (pathname.startsWith("/api/")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.ip || "unknown";
    
    /* 경로별 Rate Limit */
    let limit = 100; // 기본: 분당 100회
    if (pathname.includes("/api/auth/")) limit = 20;       // 로그인: 분당 20회
    if (pathname.includes("/api/upload")) limit = 30;      // 업로드: 분당 30회
    if (pathname.includes("/api/dealer/cars")) limit = 50; // 매물 등록: 분당 50회

    if (!checkRate(`${ip}:${pathname.split("/").slice(0,3).join("/")}`, limit)) {
      return NextResponse.json(
        { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  /* Admin 페이지 접근 제한 (로그인 안 하면 리다이렉트) */
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
