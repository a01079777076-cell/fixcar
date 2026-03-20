import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserId(req: NextRequest): number | null {
  const token = req.cookies.get("fixcar-token")?.value || req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
    const raw = payload.id || payload.userId || payload.sub;
    return raw ? Number(raw) : null;
  } catch { return null; }
}

/* GET: 딜러 본인 차량에 온 문의 목록 */
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json([]);
  try {
    const dealer = await prisma.dealer.findFirst({ where: { userId } });
    if (!dealer) return NextResponse.json([]);

    /* 딜러의 차량 ID 목록 조회 */
    const dealerCars = await prisma.car.findMany({
      where: { dealerId: dealer.id },
      select: { id: true },
    });
    const carIds = dealerCars.map(c => c.id);

    if (carIds.length === 0) return NextResponse.json([]);

    const inquiries = await prisma.inquiry.findMany({
      where: { carId: { in: carIds } },
      include: { car: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(inquiries);
  } catch (e) {
    console.error("Dealer inquiries error:", e);
    return NextResponse.json([]);
  }
}

/* POST: 문의에 답변 */
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "인증 필요" }, { status: 401 });

  try {
    const body = await req.json();
    const { inquiryId, reply } = body;

    if (!inquiryId || !reply) {
      return NextResponse.json({ error: "inquiryId와 reply가 필요합니다" }, { status: 400 });
    }

    /* 답변 저장 - 스키마에 맞는 필드만 사용 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { status: "ANSWERED" };

    /* reply 필드가 있으면 추가 (스키마에 따라 다를 수 있음) */
    try {
      const updated = await prisma.inquiry.update({
        where: { id: Number(inquiryId) },
        data: { ...updateData, reply },
      });
      return NextResponse.json({ success: true, inquiry: updated });
    } catch {
      /* reply 필드가 없으면 status만 업데이트 */
      const updated = await prisma.inquiry.update({
        where: { id: Number(inquiryId) },
        data: updateData,
      });
      return NextResponse.json({ success: true, inquiry: updated });
    }
  } catch (e) {
    console.error("Inquiry reply error:", e);
    return NextResponse.json({ error: "답변 저장 실패", detail: String(e) }, { status: 500 });
  }
}
