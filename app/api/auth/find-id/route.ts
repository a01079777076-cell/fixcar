import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* 1일 5회 rate limit (in-memory) */
const rateLimitMap = new Map<string, { count: number; date: string }>();

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function checkRateLimit(phone: string): boolean {
  const today = getToday();
  const key = `${phone}_${today}`;
  const entry = rateLimitMap.get(key);
  if (!entry) { rateLimitMap.set(key, { count: 1, date: today }); return true; }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

/* POST /api/auth/find-id
   body: { name, birthdate, phone, code?, action }
   action: "send" | "verify"
*/
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, name, birthdate, phone: rawPhone, code } = body;
    const phone = String(rawPhone || "").replace(/[^0-9]/g, "");

    if (!phone || !/^01[016789]\d{7,8}$/.test(phone)) {
      return NextResponse.json({ error: "올바른 휴대폰 번호를 입력해주세요" }, { status: 400 });
    }

    /* ── 인증번호 발송 ── */
    if (action === "send") {
      if (!name?.trim()) return NextResponse.json({ error: "이름을 입력해주세요" }, { status: 400 });
      if (!birthdate?.trim()) return NextResponse.json({ error: "생년월일을 입력해주세요" }, { status: 400 });

      if (!checkRateLimit(phone)) {
        return NextResponse.json({ error: "1일 5회 초과. 내일 다시 시도해주세요" }, { status: 429 });
      }

      /* 해당 번호로 가입된 계정 확인 */
      const user = await prisma.user.findFirst({
        where: { phone },
        select: { id: true },
      });
      if (!user) return NextResponse.json({ error: "해당 번호로 가입된 계정이 없습니다" }, { status: 404 });

      /* 인증번호 발송 (phone-verify API 재사용) */
      const verifyRes = await fetch(`${process.env.NEXTAUTH_URL || "https://www.fixcar.kr"}/api/auth/phone-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, action: "send" }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) return NextResponse.json({ error: "인증번호 발송 실패" }, { status: 500 });

      return NextResponse.json({ success: true, devCode: verifyData.devCode });
    }

    /* ── 인증번호 확인 + 아이디 반환 ── */
    if (action === "verify") {
      if (!name?.trim() || !birthdate?.trim() || !code) {
        return NextResponse.json({ error: "모든 항목을 입력해주세요" }, { status: 400 });
      }

      /* 코드 검증 */
      const verifyRes = await fetch(`${process.env.NEXTAUTH_URL || "https://www.fixcar.kr"}/api/auth/phone-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, action: "verify" }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.verified) return NextResponse.json({ error: "인증번호가 일치하지 않습니다" }, { status: 400 });

      /* 이름+생년월일+전화 모두 일치하는 계정 조회 */
      const users = await prisma.user.findMany({
        where: {
          phone,
          name: { contains: name.trim() },
          birthdate: birthdate.trim(),
        },
        select: { email: true, provider: true, createdAt: true },
      });

      if (users.length === 0) {
        /* 전화만으로 재시도 (이름/생년월일 없는 구계정 대비) */
        const fallback = await prisma.user.findMany({
          where: { phone },
          select: { email: true, provider: true, createdAt: true },
        });
        if (fallback.length === 0) return NextResponse.json({ error: "일치하는 계정이 없습니다" }, { status: 404 });

        const accounts = fallback.map((u) => ({
          username: u.provider === "kakao" ? "(카카오 로그인)" : u.email.replace("@fixcar.local", ""),
          provider: u.provider,
          createdAt: u.createdAt.toISOString().slice(0, 10),
        }));
        return NextResponse.json({ success: true, accounts });
      }

      const accounts = users.map((u) => ({
        username: u.provider === "kakao" ? "(카카오 로그인)" : u.email.replace("@fixcar.local", ""),
        provider: u.provider,
        createdAt: u.createdAt.toISOString().slice(0, 10),
      }));

      return NextResponse.json({ success: true, accounts });
    }

    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  } catch (e) {
    console.error("find-id error:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
