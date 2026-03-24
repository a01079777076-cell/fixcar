import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone) return NextResponse.json({ error: "휴대폰 번호를 입력해주세요" }, { status: 400 });

    const user = await prisma.user.findFirst({
      where: { phone: String(phone).replace(/[^0-9]/g, "") },
      select: { email: true, provider: true },
    });

    if (!user) return NextResponse.json({ error: "해당 번호로 가입된 계정이 없습니다" }, { status: 404 });

    if (user.provider === "kakao") {
      return NextResponse.json({ success: true, username: "(카카오 로그인 계정입니다)" });
    }

    const username = user.email.replace("@fixcar.local", "");
    /* 아이디 일부 마스킹 */
    const masked = username.slice(0, 3) + "***" + username.slice(-2);
    return NextResponse.json({ success: true, username: masked });
  } catch {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
