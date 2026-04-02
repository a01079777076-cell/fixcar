// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/api/dealer/inquiries/route.ts
// ═══════════════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* 이름 마스킹: 홍길동 → 홍*동, 김수 → 김* */
function maskName(name: string): string {
  if (!name) return "고객";
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + "*";
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
}

/* GET: 내 딜러에 온 문의 목록 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
    if (!dealer && user.role !== "ADMIN") return NextResponse.json([]);

    const where = dealer ? { car: { dealerId: dealer.id } } : {};
    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        car: { select: { name: true, brand: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    /* 딜러에게는 이름 마스킹 + 연락처 숨김, ADMIN은 전체 공개 */
    const isAdmin = user.role === "ADMIN";
    const masked = inquiries.map((inq: any) => ({
      ...inq,
      user: {
        name: isAdmin ? inq.user?.name : maskName(inq.user?.name || ""),
        email: isAdmin ? inq.user?.email : undefined,
        phone: isAdmin ? inq.user?.phone : undefined,
      },
    }));

    return NextResponse.json(masked);
  } catch {
    return NextResponse.json([]);
  }
}

/* PATCH: 문의 답변 */
export async function PATCH(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const { inquiryId, reply } = await req.json();
    if (!inquiryId || !reply) return NextResponse.json({ error: "inquiryId, reply 필요" }, { status: 400 });

    const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
    if (!dealer && user.role !== "ADMIN") return NextResponse.json({ error: "권한 없음" }, { status: 403 });

    const inquiry = await prisma.inquiry.update({
      where: { id: Number(inquiryId) },
      data: { reply: String(reply), status: "REPLIED" },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch {
    return NextResponse.json({ error: "답변 실패" }, { status: 500 });
  }
}
