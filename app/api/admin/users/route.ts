import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import * as crypto from "crypto";

function hashPw(pw: string) {
  return crypto.createHash("sha256").update(pw + "fixcar_salt_2025").digest("hex");
}

/* ── GET: 전체 회원 조회 (birthdate, nickname 계열 포함) ── */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json([], { status: 403 });
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true, provider: true,
        phone: true, birthdate: true,
        nickname: true, nicknameDealer: true, nicknameAdmin: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch { return NextResponse.json([]); }
}

/* ── PATCH: 역할변경 / 비밀번호 초기화 / 딜러레코드생성 ── */
export async function PATCH(req: NextRequest) {
  const admin = verifyToken(req);
  if (!admin || admin.role !== "ADMIN") return NextResponse.json({ error: "권한 없음" }, { status: 403 });

  try {
    const body = await req.json();
    const { action, userId } = body;

    /* ── 역할 변경 ── */
    if (action === "role" || !action) {
      const { role } = body;
      if (!["USER","DEALER","ADMIN"].includes(role)) {
        return NextResponse.json({ error: "잘못된 권한" }, { status: 400 });
      }
      await prisma.user.update({ where: { id: Number(userId) }, data: { role } });

      /* DEALER 전환 시 → Dealer 레코드 자동 생성 */
      if (role === "DEALER") {
        const existing = await prisma.dealer.findUnique({ where: { userId: Number(userId) } });
        if (!existing) {
          const targetUser = await prisma.user.findUnique({ where: { id: Number(userId) }, select: { name: true } });
          await prisma.dealer.create({
            data: {
              userId: Number(userId),
              shopName: `${targetUser?.name || "딜러"}의 매장`,
              verified: false,
            },
          });
        }
      }
      return NextResponse.json({ success: true });
    }

    /* ── 비밀번호 초기화 → fixcar1234 ── */
    if (action === "reset_pw") {
      const tempPw = "fixcar1234";
      await prisma.user.update({
        where: { id: Number(userId) },
        data: { password: hashPw(tempPw) },
      });
      return NextResponse.json({ success: true, tempPw });
    }

    /* ── 강제 탈퇴 ── */
    if (action === "delete") {
      await prisma.user.delete({ where: { id: Number(userId) } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "알 수 없는 action" }, { status: 400 });
  } catch (e) {
    console.error("admin/users PATCH error:", e);
    return NextResponse.json({ error: "실패" }, { status: 500 });
  }
}
