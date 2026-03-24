import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import * as crypto from "crypto";

function hashPw(pw:string):string { return crypto.createHash("sha256").update(pw+"fixcar_salt_2025").digest("hex"); }

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  try {
    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) return NextResponse.json({ error: "비밀번호를 입력해주세요" }, { status: 400 });
    if (newPassword.length < 8) return NextResponse.json({ error: "새 비밀번호 8자 이상" }, { status: 400 });

    const u = await prisma.user.findUnique({ where: { id: user.id } });
    if (!u?.password) return NextResponse.json({ error: "카카오 로그인 계정은 비밀번호 변경이 불가합니다" }, { status: 400 });
    if (u.password !== hashPw(oldPassword)) return NextResponse.json({ error: "현재 비밀번호가 틀렸습니다" }, { status: 401 });

    await prisma.user.update({ where: { id: user.id }, data: { password: hashPw(newPassword) } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "변경 실패" }, { status: 500 }); }
}
