import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

/* 딜러 권한 없이 접근 가능한 딜러 경로 (입점 신청) */
const DEALER_PUBLIC = ["/dealer/apply", "/api/dealer/apply"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/");

  /* ═══ 봇/크롤러 차단 (API) ═══ */
  if (isApi) {
    const ua = (req.headers.get("user-agent") || "").toLowerCase();
    const blockedBots = ["scrapy", "python-requests/", "curl/", "wget/", "httrack"];
    if (blockedBots.some(bot => ua.includes(bot))) {
      return NextResponse.json({ success: false, error: "접근 불가" }, { status: 403 });
    }
  }

  /* ═══ 권한 보호 — 토큰 서명까지 검증된 사용자 기준 ═══ */
  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin/");
  const isDealerPath =
    (pathname.startsWith("/dealer") || pathname.startsWith("/api/dealer/")) &&
    !DEALER_PUBLIC.some(p => pathname.startsWith(p));

  if (isAdminPath || isDealerPath) {
    const user = getAuthUser(req);
    const allowed = isAdminPath
      ? user?.role === "ADMIN"
      : user?.role === "DEALER" || user?.role === "ADMIN";

    if (!allowed) {
      if (isApi) {
        return NextResponse.json(
          { success: false, error: user ? "권한이 없습니다" : "로그인이 필요합니다" },
          { status: user ? 403 : 401 }
        );
      }
      if (!user) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  /* ═══ 보안 헤더 ═══ */
  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}

export const config = {
  matcher: ["/api/:path*", "/dealer/:path*", "/admin/:path*"],
};
