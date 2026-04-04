// 📁 저장 경로: app/api/auth/nickname/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const { nickname } = await req.json();
    if (!nickname || nickname.trim().length < 2) return NextResponse.json({ error: "닉네임은 2자 이상이어야 합니다" }, { status: 400 });
    if (nickname.trim().length > 12) return NextResponse.json({ error: "닉네임은 12자 이하여야 합니다" }, { status: 400 });

    // 15일 제한 체크
    const currentUser = await prisma.user.findUnique({ where: { id: user.id }, select: { nicknameChangedAt: true } });
    if (currentUser?.nicknameChangedAt) {
      const daysSince = (Date.now() - new Date(currentUser.nicknameChangedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 15) {
        const remaining = Math.ceil(15 - daysSince);
        return NextResponse.json({ error: `닉네임은 15일에 한 번 변경 가능합니다. (${remaining}일 후 가능)` }, { status: 429 });
      }
    }

    // 중복 체크
    const existing = await prisma.user.findFirst({
      where: { nickname: nickname.trim(), id: { not: user.id } },
    });
    if (existing) return NextResponse.json({ error: "이미 사용 중인 닉네임입니다" }, { status: 409 });

    // 금지어 체크
    const banned = ["관리자", "admin", "fixcar", "픽스카", "운영자", "시스템"];
    if (banned.some(b => nickname.toLowerCase().includes(b.toLowerCase()))) {
      return NextResponse.json({ error: "사용할 수 없는 닉네임입니다" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { nickname: nickname.trim(), nicknameChangedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Nickname change error:", e);
    return NextResponse.json({ error: "변경 실패" }, { status: 500 });
  }
}
