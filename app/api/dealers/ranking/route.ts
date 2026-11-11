import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* 주소에서 "광주 서구" 형태의 지역만 추출 */
function toRegion(addr: string | null): string {
  if (!addr) return "";
  const m = addr.match(/(광주|전남|전라남도|광주광역시)\s*(\S+[시군구])/);
  if (!m) return addr.split(" ").slice(0, 2).join(" ");
  const city = m[1].startsWith("광주") ? "광주" : "전남";
  return `${city} ${m[2]}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 10, 1), 50);

  try {
    /* 실제 인증 딜러만 — 평점 → 거래수 → 가입순 */
    const dealers = await prisma.dealer.findMany({
      where: { verified: true },
      orderBy: [{ rating: "desc" }, { dealCount: "desc" }, { createdAt: "asc" }],
      take: limit,
      select: {
        id: true, shopName: true, shopAddr: true, rating: true, dealCount: true,
        _count: { select: { cars: true } },
      },
    });

    /* 리뷰 수는 별도 조회 — DealerReview 테이블이 없는 환경에서도 랭킹은 표시 */
    const reviewCounts = new Map<number, number>();
    try {
      const groups = await prisma.dealerReview.groupBy({
        by: ["dealerId"], where: { dealerId: { in: dealers.map(d => d.id) } }, _count: { _all: true },
      });
      for (const g of groups) reviewCounts.set(g.dealerId, g._count._all);
    } catch (e) {
      console.error("[dealers/ranking] 리뷰 수 조회 실패:", e);
    }

    const data = dealers.map((d, i) => ({
      id: d.id,
      shopName: d.shopName,
      region: toRegion(d.shopAddr),
      rating: d.rating,
      reviewCount: reviewCounts.get(d.id) || 0,
      dealCount: d.dealCount,
      carCount: d._count.cars,
      rank: i + 1,
    }));

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error("[dealers/ranking] 조회 실패:", e);
    return NextResponse.json({ success: false, error: "딜러 랭킹을 불러오지 못했습니다" }, { status: 500 });
  }
}
