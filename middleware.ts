import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;

  // 방문자 로그 (API·정적파일 제외)
  if (!path.startsWith("/api") && !path.startsWith("/_next") && !path.includes(".")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const ua = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "";
    const today = new Date().toISOString().slice(0, 10);

    // 비동기 fire-and-forget
    fetch(`${req.nextUrl.origin}/api/admin/visitors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": ip,
        "user-agent": ua,
        "referer": referer,
      },
      body: JSON.stringify({ ip, userAgent: ua, referer, date: today }),
    }).catch(() => {});
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
