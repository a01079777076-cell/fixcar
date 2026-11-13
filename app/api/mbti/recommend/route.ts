import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiGuard } from "@/lib/api-guard";
import { recommendModels, matchListingScore, type ListingLike } from "@/lib/car-recommend";
import { calcAxisScores, calcTypeCode, sanitizeConditions } from "@/data/car_mbti_data";
import { DOMESTIC_BRANDS } from "@/data/catalog_data";

/* POST: 차량 MBTI 조건 → 유형 + 추천 차종 + 실제 매물 */
export async function POST(req: NextRequest) {
  const guard = apiGuard(req, { auth: "none", rateLimit: 30 });
  if (guard instanceof NextResponse) return guard;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "잘못된 요청입니다" }, { status: 400 });
  }

  const conditions = sanitizeConditions(body.conditions);
  const answersRaw = (body.answers && typeof body.answers === "object" ? body.answers : {}) as Record<string, unknown>;
  const answers: Record<number, number> = {};
  for (const [k, v] of Object.entries(answersRaw)) {
    const qi = Number(k), ai = Number(v);
    if (Number.isInteger(qi) && Number.isInteger(ai) && ai >= 0 && ai < 4) answers[qi] = ai;
  }

  const axes = calcAxisScores(answers, conditions);
  const type = calcTypeCode(axes);
  const rec = recommendModels(conditions, axes);

  /* 실제 매물: 예산·연식·주행거리·연료·사고·국산/수입 조건으로 조회 후 추천 차종과 매칭 */
  let listings: (ListingLike & { match: number })[] = [];
  let listingsError = false;
  try {
    const where: Record<string, unknown> = {
      status: "AVAILABLE",
      price: { lte: Math.round(rec.affordable * 1.05) },
    };
    if (conditions.maxAge < 99) where.year = { gte: new Date().getFullYear() - conditions.maxAge };
    if (conditions.maxMileage < 99) where.mileage = { lte: conditions.maxMileage * 10000 };
    const fuels = conditions.fuels.filter((f) => !(f === "전기" && conditions.evCharging === "none"));
    if (fuels.length) where.fuel = { in: fuels };
    else if (conditions.evCharging === "none") where.fuel = { not: "전기" };
    if (!conditions.accidentOk) where.accident = false;
    if (conditions.origin === "domestic") where.brand = { in: [...DOMESTIC_BRANDS] };

    const cars = await prisma.car.findMany({
      where,
      select: { id: true, name: true, brand: true, year: true, mileage: true, price: true, fuel: true, images: true },
      orderBy: { createdAt: "desc" },
      take: 300,
    });
    listings = cars
      .map((c) => ({ ...c, images: c.images.slice(0, 1), match: matchListingScore(c, rec.models) }))
      .sort((a, b) => b.match - a.match || b.year - a.year)
      .slice(0, 6);
  } catch (e) {
    console.error("[mbti/recommend] listings error:", e instanceof Error ? e.message : e);
    listingsError = true;
  }

  return NextResponse.json({
    success: true,
    data: {
      type,
      axes,
      conditions,
      affordable: rec.affordable,
      models: rec.models,
      relaxed: rec.relaxed,
      totalCandidates: rec.totalCandidates,
      listings,
      listingsError,
    },
  });
}
