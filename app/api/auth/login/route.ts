import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "이메일과 비밀번호를 입력해주세요" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json({ success: false, error: "이메일 또는 비밀번호가 맞지 않아요" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "이메일 또는 비밀번호가 맞지 않아요" }, { status: 401 });
    }

    const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    const res = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    res.cookies.set("fixcar-token", token, { httpOnly: true, maxAge: 60*60*24*30, path: "/" });
    return res;
  } catch {
    return NextResponse.json({ success: false, error: "로그인 실패" }, { status: 500 });
  }
}
