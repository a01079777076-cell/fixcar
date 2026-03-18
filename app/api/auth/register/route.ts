import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "이름, 이메일, 비밀번호는 필수예요" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "비밀번호는 6자 이상이어야 해요" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: "이미 사용 중인 이메일이에요" }, { status: 409 });
    }

    const hashedPw = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, phone: phone || null, password: hashedPw, role: "USER", provider: "local" },
    });

    const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    const res = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    res.cookies.set("fixcar-token", token, { httpOnly: true, maxAge: 60*60*24*30, path: "/" });
    return res;
  } catch (e) {
    return NextResponse.json({ success: false, error: "회원가입 실패" }, { status: 500 });
  }
}
