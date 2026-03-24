import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as crypto from "crypto";

function hashPw(pw: string): string {
  return crypto.createHash("sha256").update(pw + "fixcar_salt_2025").digest("hex");
}

function generateTempPw(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let pw = "";
  for (let i = 0; i < 8; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw;
}

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone) return NextResponse.json({ error: "휴대폰 번호를 입력해주세요" }, { status: 400 });

    const user = await prisma.user.findFirst({
      where: { phone: String(phone).replace(/[^0-9]/g, ""), provider: { not: "kakao" } },
    });

    if (!user) return NextResponse.json({ error: "해당 번호로 가입된 픽스카 계정이 없습니다" }, { status: 404 });

    const tempPassword = generateTempPw();
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashPw(tempPassword) },
    });

    return NextResponse.json({ success: true, tempPassword });
  } catch {
    return NextResponse.json({ error: "발급 실패" }, { status: 500 });
  }
}
