import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const approve = body.approve;

    const dealerId = Number(id);
    if (isNaN(dealerId)) {
      return NextResponse.json({ error: "유효하지 않은 딜러 ID" }, { status: 400 });
    }

    /* 딜러 존재 확인 */
    const dealer = await prisma.dealer.findUnique({ where: { id: dealerId } });
    if (!dealer) {
      return NextResponse.json({ error: "딜러를 찾을 수 없습니다" }, { status: 404 });
    }

    if (approve === false) {
      /* 거부: 딜러 삭제 */
      await prisma.dealer.delete({ where: { id: dealerId } });
      return NextResponse.json({ success: true, action: "rejected" });
    }

    /* 승인: role을 DEALER로 변경 */
    const updated = await prisma.dealer.update({
      where: { id: dealerId },
      data: { /* 승인 가능한 필드들만 업데이트 */ },
    });

    /* User의 role도 DEALER로 변경 */
    if (dealer.userId) {
      await prisma.user.update({
        where: { id: dealer.userId },
        data: { role: "DEALER" },
      });
    }

    return NextResponse.json({ success: true, action: "approved", dealer: updated });
  } catch (e) {
    console.error("Dealer approve error:", e);
    return NextResponse.json({ error: "승인 처리 실패", detail: String(e) }, { status: 500 });
  }
}
