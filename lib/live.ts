// 📁 저장 경로: lib/live.ts
// 실시간 접속자 집계 공용 상수 (VisitorLog 재사용)

/** 접속 중 기록의 date 값 — 실제 날짜("YYYY-MM-DD")와 겹치지 않고 날짜 범위 조회(gte "20xx-")에도 걸리지 않음 */
export const LIVE_DATE = "0000-live";

/** 이 시간 안에 신호가 있으면 '접속 중' */
export const LIVE_WINDOW_MS = 5 * 60 * 1000;

/** 방문 통계에서 접속 중 기록 제외용 where 조건 */
export const NOT_LIVE = { NOT: { date: LIVE_DATE } } as const;

/** 한국 시간(KST) 기준 날짜 "YYYY-MM-DD" — 방문 기록 날짜는 모두 이 기준 */
export function kstDate(d: Date = new Date()): string {
  return new Date(d.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}
