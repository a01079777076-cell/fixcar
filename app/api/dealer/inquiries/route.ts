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

/* GET: 딜러에게 온 문의 목록 */
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json([]);
  try {
    const dealer = await prisma.dealer.findFirst({ where: { userId } });
    if (!dealer) return NextResponse.json([]);
    const inquiries = await prisma.inquiry.findMany({
      where: { dealerId: dealer.id },
      include: { car: true, user: { select: { name: true, email: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(inquiries);
  } catch {
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

    /* 딜러 본인 문의인지 확인 */
    const dealer = await prisma.dealer.findFirst({ where: { userId } });
    if (!dealer) return NextResponse.json({ error: "딜러 권한 없음" }, { status: 403 });

    const inquiry = await prisma.inquiry.findFirst({
      where: { id: Number(inquiryId), dealerId: dealer.id },
    });

    if (!inquiry) return NextResponse.json({ error: "문의를 찾을 수 없습니다" }, { status: 404 });

    /* 답변 저장 */
    const updated = await prisma.inquiry.update({
      where: { id: Number(inquiryId) },
      data: {
        reply: reply,
        status: "ANSWERED",
      },
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (e) {
    console.error("Inquiry reply error:", e);
    return NextResponse.json({ error: "답변 저장 실패", detail: String(e) }, { status: 500 });
  }
}
