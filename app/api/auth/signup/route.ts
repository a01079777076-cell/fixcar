import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as crypto from "crypto";

function hashPw(password: string): string {
  return crypto.createHash("sha256").update(password + "fixcar_salt_2025").digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { username, password, name, phone } = await req.json();

    /* 유효성 검사 */
    if (!username || !password || !name) return NextResponse.json({ error: "필수 항목을 입력해주세요" }, { status: 400 });
    if (!/^[a-zA-Z0-9_]{6,20}$/.test(username)) return NextResponse.json({ error: "아이디는 영문/숫자/밑줄 6~20자" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "비밀번호 8자 이상" }, { status: 400 });

    /* 중복 체크 */
    const email = `${username}@fixcar.local`;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "이미 사용 중인 아이디입니다" }, { status: 409 });

    /* 생성 */
    const user = await prisma.user.create({
      data: {
        email,
        name: String(name).slice(0, 50),
        phone: phone || null,
        password: hashPw(password),
        provider: "fixcar",
        role: "USER",
      },
    });

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "가입 실패", detail: String(e) }, { status: 500 });
  }
}
