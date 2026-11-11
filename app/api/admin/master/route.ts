// 📁 저장 경로: app/api/admin/master/route.ts
// 운영자 통합관리 — 테이블 목록 + 전체 현황 대시보드
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getModels, delegate } from "@/lib/admin-master";

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const models = getModels();

    /* 1. 테이블별 레코드 수 */
    const counts = await Promise.all(
      models.map(m => delegate(m).count().catch(() => null) as Promise<number | null>)
    );

    /* 2. 매물 상태별 대수 */
    const statusGroups = await prisma.car.groupBy({ by: ["status"], _count: { _all: true } });
    const carStatus: Record<string, number> = { AVAILABLE: 0, REVIEWING: 0, RESERVED: 0, SOLD: 0 };
    for (const g of statusGroups) carStatus[g.status] = g._count._all;

    /* 3. 상사(딜러)별 매물 현황 */
    const [dealers, perDealer] = await Promise.all([
      prisma.dealer.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true, shopName: true, complexName: true, shopPhone: true, shopAddr: true,
          verified: true, rating: true, dealCount: true, createdAt: true,
          user: { select: { id: true, name: true, email: true, phone: true, role: true } },
        },
      }),
      prisma.car.groupBy({ by: ["dealerId", "status"], _count: { _all: true }, _sum: { price: true } }),
    ]);

    /* 리뷰 수 별도 조회 (DealerReview 테이블 없어도 현황은 표시) */
    const reviewCounts = new Map<number, number>();
    try {
      const groups = await prisma.dealerReview.groupBy({ by: ["dealerId"], _count: { _all: true } });
      for (const g of groups) reviewCounts.set(g.dealerId, g._count._all);
    } catch (e) {
      console.error("[admin/master] 리뷰 수 조회 실패:", e);
    }

    const dealerRows = dealers.map(d => {
      const rows = perDealer.filter(p => p.dealerId === d.id);
      const by = (s: string) => rows.find(r => r.status === s)?._count._all || 0;
      const soldAmount = rows.find(r => r.status === "SOLD")?._sum.price || 0;
      return {
        ...d,
        _count: { reviews: reviewCounts.get(d.id) || 0 },
        cars: {
          total: rows.reduce((s, r) => s + r._count._all, 0),
          available: by("AVAILABLE"), reviewing: by("REVIEWING"),
          reserved: by("RESERVED"), sold: by("SOLD"),
          soldAmount, // 만원
        },
      };
    });

    /* 4. 소속 단지(소속점)별 합계 */
    const complexMap = new Map<string, { complex: string; dealers: number; total: number; available: number; sold: number }>();
    for (const d of dealerRows) {
      const key = d.complexName?.trim() || "(소속 없음)";
      const c = complexMap.get(key) || { complex: key, dealers: 0, total: 0, available: 0, sold: 0 };
      c.dealers += 1; c.total += d.cars.total; c.available += d.cars.available; c.sold += d.cars.sold;
      complexMap.set(key, c);
    }

    return NextResponse.json({
      success: true,
      data: {
        models: models.map((m, i) => ({ ...m, count: counts[i] })),
        carStatus,
        dealers: dealerRows,
        complexes: [...complexMap.values()].sort((a, b) => b.total - a.total),
      },
    });
  } catch (e) {
    console.error("[admin/master] overview error:", e);
    return NextResponse.json({ success: false, error: "현황을 불러오지 못했습니다" }, { status: 500 });
  }
}
