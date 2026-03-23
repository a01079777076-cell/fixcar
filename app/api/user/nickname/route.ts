import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 내 닉네임 조회 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const u = await prisma.user.findUnique({
      where: { id: user.id },
      select: { nickname: true, nicknameChangedAt: true },
    });
    const canChange = !u?.nicknameChangedAt || (Date.now() - new Date(u.nicknameChangedAt).getTime() > 15 * 24 * 60 * 60 * 1000);
    const daysLeft = u?.nicknameChangedAt ? Math.max(0, 15 - Math.floor((Date.now() - new Date(u.nicknameChangedAt).getTime()) / (24*60*60*1000))) : 0;
    return NextResponse.json({ nickname: u?.nickname || null, canChange, daysLeft });
  } catch {
    return NextResponse.json({ nickname: null, canChange: true, daysLeft: 0 });
  }
}

/* POST: 닉네임 설정/변경 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const { nickname } = await req.json();
    const cleaned = String(nickname || "").trim();

    /* 유효성 검사 */
    if (cleaned.length < 2 || cleaned.length > 12) {
      return NextResponse.json({ error: "닉네임은 2~12자여야 합니다" }, { status: 400 });
    }
    if (/[<>'"&\\\/]/.test(cleaned)) {
      return NextResponse.json({ error: "특수문자는 사용할 수 없습니다" }, { status: 400 });
    }

    /* 15일 변경 제한 (첫 설정은 제한 없음) */
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { nickname: true, nicknameChangedAt: true },
    });
    if (currentUser?.nickname && currentUser.nicknameChangedAt) {
      const daysSince = (Date.now() - new Date(currentUser.nicknameChangedAt).getTime()) / (24*60*60*1000);
      if (daysSince < 15) {
        const daysLeft = Math.ceil(15 - daysSince);
        return NextResponse.json({ error: `닉네임 변경은 ${daysLeft}일 후에 가능합니다` }, { status: 429 });
      }
    }

    /* 중복 체크 */
    const exists = await prisma.user.findFirst({
      where: { nickname: cleaned, NOT: { id: user.id } },
    });
    if (exists) return NextResponse.json({ error: "이미 사용 중인 닉네임입니다" }, { status: 409 });

    /* 저장 */
    await prisma.user.update({
      where: { id: user.id },
      data: { nickname: cleaned, nicknameChangedAt: new Date() },
    });

    return NextResponse.json({ success: true, nickname: cleaned });
  } catch (e) {
    return NextResponse.json({ error: "닉네임 설정 실패" }, { status: 500 });
  }
}
