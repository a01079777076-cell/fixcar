import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();
    if (!username || !/^[a-zA-Z0-9_]{6,20}$/.test(username)) {
      return NextResponse.json({ available: false, error: "유효하지 않은 아이디" });
    }
    const email = `${username}@fixcar.local`;
    const exists = await prisma.user.findUnique({ where: { email } });
    return NextResponse.json({ available: !exists });
  } catch {
    return NextResponse.json({ available: false, error: "확인 실패" });
  }
}
