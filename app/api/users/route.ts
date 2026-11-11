import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/* 비밀번호 등 민감정보 제외한 공개 필드 */
const SAFE_USER = {
  id: true, email: true, name: true, nickname: true, phone: true, birthdate: true,
  role: true, provider: true, createdAt: true, updatedAt: true,
} as const;

// GET /api/users?id=1 | ?email= | (전체) — 관리자 전용
export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (admin instanceof NextResponse) return admin;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (id) {
      const user = await prisma.user.findUnique({ where: { id: parseInt(id) }, select: SAFE_USER });
      return NextResponse.json({ success: true, data: user });
    }
    if (email) {
      const user = await prisma.user.findUnique({ where: { email }, select: SAFE_USER });
      return NextResponse.json({ success: true, data: user });
    }

    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: SAFE_USER });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Users Error:", error);
    return NextResponse.json({ success: false, error: "회원 정보를 불러올 수 없어요" }, { status: 500 });
  }
}

/* POST: 비밀번호 없는 계정 임의 생성 차단 — 회원가입은 /api/auth/register, 카카오 로그인 사용 */
export async function POST() {
  return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
}
