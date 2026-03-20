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

/* POST: 문의 접수 */
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  try {
    const body = await req.json();
    const { carId, name, phone, message } = body;

    if (!message) return NextResponse.json({ error: "문의 내용을 입력해주세요" }, { status: 400 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      carId: Number(carId) || undefined,
      content: message,
      name: name || "익명",
      phone: phone || "",
      status: "PENDING",
    };

    if (userId) data.userId = userId;

    const inquiry = await prisma.inquiry.create({ data });
    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (e) {
    console.error("Inquiry create error:", e);
    return NextResponse.json({ error: "문의 접수 실패", detail: String(e) }, { status: 500 });
  }
}

/* GET: 내 문의 목록 */
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json([]);
  try {
    const inquiries = await prisma.inquiry.findMany({
      where: { userId },
      include: { car: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(inquiries);
  } catch {
    return NextResponse.json([]);
  }
}
