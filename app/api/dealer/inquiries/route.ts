import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* GET: 딜러의 차량에 온 문의 목록 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });

  try {
    const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
    if (!dealer && user.role !== "ADMIN") return NextResponse.json([]);

    /* ADMIN이면 전체, 딜러면 자기 매물만 */
    const where = user.role === "ADMIN" ? {} : {
      car: { dealerId: dealer!.id },
    };

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        car: { select: { name: true, brand: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(inquiries);
  } catch (e) {
    console.error("Dealer inquiries GET:", e);
    return NextResponse.json([]);
  }
}

/* PATCH: 문의 답변 */
export async function PATCH(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  if (user.role !== "DEALER" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "딜러 권한이 필요합니다" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const inquiryId = Number(body.inquiryId || body.id);
    if (!inquiryId || !body.reply) {
      return NextResponse.json({ error: "답변 내용을 입력해주세요" }, { status: 400 });
    }

    /* 스키마: reply(String?), status(InquiryStatus) */
    const inquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: {
        reply: String(body.reply).slice(0, 2000),
        status: "REPLIED",
      },
    });
    return NextResponse.json({ success: true, inquiry });
  } catch (e) {
    console.error("Inquiry PATCH:", e);
    return NextResponse.json({ error: "답변 실패" }, { status: 500 });
  }
}
