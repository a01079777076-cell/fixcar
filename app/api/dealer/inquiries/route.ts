import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 내 딜러에 온 문의 목록 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
    if (!dealer) return NextResponse.json([]);

    const inquiries = await prisma.inquiry.findMany({
      where: { car: { dealerId: dealer.id } },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        car: { select: { name: true, brand: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(inquiries);
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

    /* 본인 딜러의 문의인지 확인 */
    const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
    if (!dealer && user.role !== "ADMIN") return NextResponse.json({ error: "권한 없음" }, { status: 403 });

    const inquiry = await prisma.inquiry.update({
      where: { id: Number(inquiryId) },
      data: { reply: String(reply), status: "REPLIED" },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (e) {
    return NextResponse.json({ error: "답변 실패" }, { status: 500 });
  }
}
