import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const SAFE_USER = {
  id: true, email: true, name: true, nickname: true, phone: true, birthdate: true,
  role: true, provider: true, createdAt: true,
} as const;

/* 본인 또는 관리자만 접근 */
function canAccess(authId: number, role: string | undefined, targetId: number) {
  return authId === targetId || role === "ADMIN";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const targetId = parseInt(id);
    if (!canAccess(auth.id, auth.role, targetId)) {
      return NextResponse.json({ success: false, error: "권한이 없습니다" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({ where: { id: targetId }, select: SAFE_USER });
    if (!user) {
      return NextResponse.json({ success: false, error: "사용자를 찾을 수 없어요" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("User GET Error:", error);
    return NextResponse.json({ success: false, error: "사용자 정보를 불러올 수 없어요" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const targetId = parseInt(id);
    if (!canAccess(auth.id, auth.role, targetId)) {
      return NextResponse.json({ success: false, error: "권한이 없습니다" }, { status: 403 });
    }

    const body = await request.json();
    const { name, phone, email } = body;

    const updateData: Record<string, string> = {};
    if (name) updateData.name = String(name).slice(0, 50);
    if (phone) updateData.phone = String(phone).slice(0, 20);
    if (email) updateData.email = String(email).slice(0, 100);

    const user = await prisma.user.update({ where: { id: targetId }, data: updateData, select: SAFE_USER });
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("User PATCH Error:", error);
    return NextResponse.json({ success: false, error: "사용자 정보 수정에 실패했어요" }, { status: 500 });
  }
}
