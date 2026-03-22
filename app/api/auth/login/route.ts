import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import * as crypto from "crypto";

function hashPw(password: string): string {
  return crypto.createHash("sha256").update(password + "fixcar_salt_2025").digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) return NextResponse.json({ error: "아이디와 비밀번호를 입력해주세요" }, { status: 400 });

    /* email 필드에 username 저장 (email 또는 username 둘 다 지원) */
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: username }, { email: `${username}@fixcar.local` }] },
    });
    if (!user) return NextResponse.json({ error: "아이디 또는 비밀번호가 틀렸습니다" }, { status: 401 });
    if (!user.password) return NextResponse.json({ error: "카카오 로그인으로 가입된 계정입니다" }, { status: 401 });

    const hashed = hashPw(password);
    if (user.password !== hashed) return NextResponse.json({ error: "아이디 또는 비밀번호가 틀렸습니다" }, { status: 401 });

    const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });

    const res = NextResponse.json({ success: true, user: { id: user.id, name: user.name, role: user.role } });
    res.cookies.set("fixcar-token", token, {
      httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "로그인 실패", detail: String(e) }, { status: 500 });
  }
}
