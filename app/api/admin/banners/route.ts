import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function adminOnly(req: NextRequest) {
  const user = verifyToken(req);
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

/* GET /api/admin/banners — 전체 배너 목록 */
export async function GET(req: NextRequest) {
  if (!adminOnly(req)) return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
      include: { dealer: { select: { shopName: true } } },
    });
    return NextResponse.json({ success: true, data: banners });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

/* POST /api/admin/banners — 배너 등록 */
export async function POST(req: NextRequest) {
  if (!adminOnly(req)) return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  try {
    const body = await req.json();
    const { title, imageUrl, linkUrl, position, dealerId, startDate, endDate } = body;
    if (!title || !imageUrl) {
      return NextResponse.json({ error: "제목과 이미지 URL은 필수입니다" }, { status: 400 });
    }
    const banner = await prisma.banner.create({
      data: {
        title,
        imageUrl,
        linkUrl:  linkUrl  || null,
        position: position || "CARS",
        dealerId: dealerId ? Number(dealerId) : null,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate:   endDate   ? new Date(endDate)   : null,
        active: true,
      },
    });
    return NextResponse.json({ success: true, data: banner });
  } catch (e) {
    console.error("Banner create error:", e);
    return NextResponse.json({ error: "배너 등록 실패" }, { status: 500 });
  }
}

/* PATCH /api/admin/banners?id=X — 배너 수정/활성화토글 */
export async function PATCH(req: NextRequest) {
  if (!adminOnly(req)) return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID 필요" }, { status: 400 });
  try {
    const body = await req.json();
    const banner = await prisma.banner.update({
      where: { id },
      data:  body,
    });
    return NextResponse.json({ success: true, data: banner });
  } catch {
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

/* DELETE /api/admin/banners?id=X — 배너 삭제 */
export async function DELETE(req: NextRequest) {
  if (!adminOnly(req)) return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID 필요" }, { status: 400 });
  try {
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}
