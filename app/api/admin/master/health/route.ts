// 📁 저장 경로: app/api/admin/master/health/route.ts
// 운영자 통합관리 — 서버 상태 (DB 용량·연결·속도, 접속자, 사진 사용량) + 방문로그 정리
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { LIVE_DATE, LIVE_WINDOW_MS, kstDate } from "@/lib/live";

/* DB 제공자별 기본 용량 한도(MB) — 환경변수 DB_LIMIT_MB로 덮어쓰기 가능 */
function dbProvider(): { name: string; defaultLimitMB: number; note: string } {
  const url = process.env.DATABASE_URL || "";
  if (url.includes("rlwy.net") || url.includes("railway")) return { name: "Railway", defaultLimitMB: 5000, note: "Hobby 볼륨 기준(플랜에 따라 다름)" };
  if (url.includes("supabase")) return { name: "Supabase", defaultLimitMB: 500, note: "Free 플랜 기준 (Pro 8GB)" };
  if (url.includes("neon.tech")) return { name: "Neon", defaultLimitMB: 500, note: "Free 플랜 기준" };
  return { name: "PostgreSQL", defaultLimitMB: 5000, note: "DB_LIMIT_MB 환경변수로 한도 지정" };
}

/* Cloudinary 사용량 (API 키가 있을 때만) */
async function cloudinaryUsage() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) return { configured: false as const };
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/usage`, {
      headers: { Authorization: "Basic " + Buffer.from(`${key}:${secret}`).toString("base64") },
      cache: "no-store",
    });
    if (!res.ok) return { configured: true as const, error: `조회 실패 (${res.status})` };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d: any = await res.json();
    return {
      configured: true as const,
      plan: d.plan as string,
      creditsUsed: Number(d.credits?.usage ?? 0),
      creditsLimit: Number(d.credits?.limit ?? 0),
      storageBytes: Number(d.storage?.usage ?? 0),
      bandwidthBytes: Number(d.bandwidth?.usage ?? 0),
      transformations: Number(d.transformations?.usage ?? 0),
      lastUpdated: d.last_updated as string,
    };
  } catch {
    return { configured: true as const, error: "조회 실패" };
  }
}

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const provider = dbProvider();
  const limitMB = Number(process.env.DB_LIMIT_MB) || provider.defaultLimitMB;

  /* ── DB ── */
  let db: Record<string, unknown> = { ok: false };
  try {
    /* 응답 속도: 3회 중 최솟값 */
    const pings: number[] = [];
    for (let i = 0; i < 3; i++) {
      const t = performance.now();
      await prisma.$queryRaw`SELECT 1`;
      pings.push(Math.round((performance.now() - t) * 10) / 10);
    }
    const [[size], tables, [conn], [maxConn]] = await Promise.all([
      prisma.$queryRaw<{ bytes: bigint }[]>`SELECT pg_database_size(current_database())::bigint AS bytes`,
      prisma.$queryRaw<{ name: string; bytes: bigint; rows: bigint }[]>`
        SELECT relname AS name, pg_total_relation_size(relid)::bigint AS bytes, n_live_tup::bigint AS rows
        FROM pg_stat_user_tables ORDER BY pg_total_relation_size(relid) DESC LIMIT 12`,
      prisma.$queryRaw<{ n: bigint }[]>`SELECT count(*)::bigint AS n FROM pg_stat_activity WHERE datname = current_database()`,
      prisma.$queryRaw<{ max_connections: string }[]>`SHOW max_connections`,
    ]);
    db = {
      ok: true,
      provider: provider.name, providerNote: provider.note,
      sizeBytes: Number(size.bytes), limitMB,
      pingMs: Math.min(...pings),
      connections: Number(conn.n), maxConnections: Number(maxConn.max_connections),
      tables: tables.map(t => ({ name: t.name, bytes: Number(t.bytes), rows: Number(t.rows) })),
    };
  } catch (e) {
    console.error("[admin/health] DB 조회 실패:", e);
    db = { ok: false, provider: provider.name, limitMB, error: "DB에 연결할 수 없습니다" };
  }

  /* ── 접속자 ── */
  let traffic: Record<string, unknown> = { ok: false };
  if (db.ok) {
    try {
      const now = new Date();
      const today = kstDate(now);
      const yesterday = kstDate(new Date(now.getTime() - 86400000));
      const weekAgo = kstDate(new Date(now.getTime() - 6 * 86400000));

      const [liveNow, todayRows, yesterdayCount, weekRows, visitRowsTotal] = await Promise.all([
        prisma.visitorLog.count({ where: { date: LIVE_DATE, createdAt: { gte: new Date(now.getTime() - LIVE_WINDOW_MS) } } }),
        prisma.visitorLog.findMany({ where: { date: today, referer: "visit" }, select: { createdAt: true } }),
        prisma.visitorLog.count({ where: { date: yesterday, referer: "visit" } }),
        prisma.visitorLog.groupBy({ by: ["date"], where: { referer: "visit", date: { gte: weekAgo } }, _count: { _all: true } }),
        prisma.visitorLog.count({ where: { NOT: { date: LIVE_DATE } } }),
      ]);

      /* 오늘 시간대별(KST) 첫 방문 */
      const hourly = Array.from({ length: 24 }, () => 0);
      for (const r of todayRows) hourly[(r.createdAt.getUTCHours() + 9) % 24]++;

      /* 최근 7일 (빈 날 0) */
      const daily = Array.from({ length: 7 }, (_, i) => {
        const d = kstDate(new Date(now.getTime() - (6 - i) * 86400000));
        return { date: d, count: weekRows.find(w => w.date === d)?._count._all || 0 };
      });

      traffic = { ok: true, liveNow, liveWindowMin: LIVE_WINDOW_MS / 60000, today: todayRows.length, yesterday: yesterdayCount, daily, hourly, visitRowsTotal };
    } catch (e) {
      console.error("[admin/health] 접속자 조회 실패:", e);
      traffic = { ok: false, error: "접속자 집계 실패" };
    }
  }

  /* ── 서버(Vercel) ── */
  const server = {
    region: process.env.VERCEL_REGION || "local",
    env: process.env.VERCEL_ENV || process.env.NODE_ENV,
    commit: (process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0, 7),
    node: process.version,
  };

  return NextResponse.json({
    success: true,
    data: { checkedAt: new Date().toISOString(), db, traffic, server, cloudinary: await cloudinaryUsage() },
  });
}

/* POST: 오래된 방문 로그 정리 { action:"cleanup-visitors", days:90 } */
export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  try {
    const { action, days } = await req.json();
    if (action !== "cleanup-visitors") return NextResponse.json({ success: false, error: "알 수 없는 작업" }, { status: 400 });
    const keep = Math.max(30, Number(days) || 90);
    const cutoff = kstDate(new Date(Date.now() - keep * 86400000));
    /* 실제 날짜 형식 행만 대상 (접속 중 기록 제외) */
    const r = await prisma.visitorLog.deleteMany({ where: { date: { lt: cutoff, gte: "1970-01-01" } } });
    console.log(`[admin/health] 방문로그 정리 ${r.count}건 (${cutoff} 이전) by admin#${admin.id}`);
    return NextResponse.json({ success: true, data: { deleted: r.count, before: cutoff } });
  } catch (e) {
    console.error("[admin/health] 정리 실패:", e);
    return NextResponse.json({ success: false, error: "정리 실패" }, { status: 500 });
  }
}
