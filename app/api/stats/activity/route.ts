import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 메인페이지 "누적 이용자" 표시용 API
 * - 실제 누적 방문자 + 서비스 시작 기본값 부스트
 * - 사이트가 활발하게 이용되고 있다는 신뢰감 제공
 * - 실제 정확한 데이터는 /api/admin/stats 에서 확인
 */

/* 서비스 시작 기본값 (초기 신뢰감) */
const BASE_USERS = 300;
/* 일일 자연 증가분 (서비스 운영 일수 × 가중치) */
const DAILY_BOOST = 8;

function getDaysSinceLaunch(): number {
  const launchDate = new Date("2025-01-01"); /* 서비스 시작일 */
  return Math.floor((Date.now() - launchDate.getTime()) / (24 * 60 * 60 * 1000));
}

export async function GET() {
  try {
    /* 실제 누적 고유 방문자 */
    const realVisitors = await prisma.visitorLog.groupBy({
      by: ["ip"],
      where: { referer: "visit" },
    });
    const realCount = realVisitors.length;

    /* 활성 이용자 수 = 실제 + 기본값 + 운영일수 부스트 */
    const days = getDaysSinceLaunch();
    const activeUsers = realCount + BASE_USERS + Math.floor(days * DAILY_BOOST);

    /* 월별 추이 (부스트 포함) */
    const now = new Date();
    const monthly: { month: string; count: number }[] = [];

    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const startDate = `${yearMonth}-01`;
      const endD = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const endDate = `${yearMonth}-${String(endD.getDate()).padStart(2, "0")}`;

      const visitors = await prisma.visitorLog.groupBy({
        by: ["ip"],
        where: { referer: "visit", date: { gte: startDate, lte: endDate } },
      });

      /* 월별 부스트: 과거 → 현재로 갈수록 자연 증가 */
      const monthDays = Math.floor((d.getTime() - new Date("2025-01-01").getTime()) / (24*60*60*1000));
      const monthBoost = BASE_USERS + Math.floor(monthDays * DAILY_BOOST) + visitors.length;

      monthly.push({
        month: `${d.getMonth() + 1}월`,
        count: monthBoost,
      });
    }

    return NextResponse.json({ activeUsers, monthly });
  } catch {
    /* 에러 시에도 기본값 표시 */
    const days = getDaysSinceLaunch();
    return NextResponse.json({
      activeUsers: BASE_USERS + Math.floor(days * DAILY_BOOST),
      monthly: [],
    });
  }
}
