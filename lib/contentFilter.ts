// ═══════════════════════════════════════════════════
// 📁 저장 경로: lib/contentFilter.ts
// ═══════════════════════════════════════════════════
// 일상적인 욕/비속어는 허용. 사회적으로 심각한 유해 콘텐츠만 차단.

/* 차단 키워드 (심각한 것만) */
const BLOCKED_KEYWORDS: string[] = [
  /* 극단적 사이트/혐오 커뮤니티 */
  "일베","일간베스트","워마드","메갈리아",
  /* 극단적 혐오 표현 */
  "한남충","한녀충","재기해","자살해","죽어라",
  /* 성적 콘텐츠/성범죄 */
  "야동","포르노","성인방","오피","출장만남","조건만남","원나잇",
  "성매매","매춘","원조교제","음란물",
  /* 마약 */
  "대마초","필로폰","메스암페타민","코카인","마약판매","작대기",
  /* 불법 도박 */
  "토토사이트","카지노사이트","바카라사이트","도박사이트","먹튀사이트",
  /* 사기/피싱 */
  "보이스피싱","리딩방","선입금사기",
];

/* 차단 URL 도메인 */
const BLOCKED_DOMAINS = ["ilbe.com","womad","megalia","t.me/","discord.gg/"];

export interface FilterResult {
  blocked: boolean;
  matches: string[];
  severity: "low" | "medium" | "high";
}

export function checkContent(text: string): FilterResult {
  const lower = text.toLowerCase().replace(/\s/g, "");
  const matches: string[] = [];
  for (const kw of BLOCKED_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) matches.push(kw);
  }
  const unique = [...new Set(matches)];
  return {
    blocked: unique.length > 0,
    matches: unique,
    severity: unique.length >= 3 ? "high" : unique.length >= 1 ? "medium" : "low",
  };
}

export function checkUrls(text: string): string[] {
  const urls = text.match(/https?:\/\/[^\s<>"']+/gi) || [];
  const blocked: string[] = [];
  for (const url of urls) {
    for (const domain of BLOCKED_DOMAINS) {
      if (url.toLowerCase().includes(domain)) blocked.push(url);
    }
  }
  return blocked;
}
