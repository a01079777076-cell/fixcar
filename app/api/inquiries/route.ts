import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/* POST: 문의 접수 */
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });

  try {
    const body = await req.json();
    const carId = Number(body.carId);
    if (!carId) return NextResponse.json({ error: "차량 ID가 필요합니다" }, { status: 400 });

    const msg = body.message || body.content || "";
    if (!msg.trim()) return NextResponse.json({ error: "문의 내용을 입력해주세요" }, { status: 400 });

    /* 스키마: userId(Int 필수), carId(Int 필수), message(String), reply?, status(InquiryStatus) */
    const inquiry = await prisma.inquiry.create({
      data: {
        userId: user.id,
        carId,
        message: String(msg).slice(0, 2000),
        status: "PENDING",
      },
    });
    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (e) {
    console.error("Inquiry POST:", e);
    return NextResponse.json({ error: "문의 접수 실패", detail: String(e) }, { status: 500 });
  }
}

/* GET: 내 문의 목록 */
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json([]);

  try {
    const inquiries = await prisma.inquiry.findMany({
      where: { userId: user.id },
      include: { car: { select: { name: true, brand: true, price: true, images: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(inquiries);
  } catch {
    return NextResponse.json([]);
  }
}
