// ═══════════════════════════════════════════════════
// 📁 저장 경로: lib/contentFilter.ts
// ═══════════════════════════════════════════════════

/* 유해 키워드 목록 (서버+클라이언트 공용) */
const BLOCKED_KEYWORDS: string[] = [
  /* 극단적 사이트/커뮤니티 */
  "일베","일간베스트","워마드","메갈리아","한남충","한녀충","김치녀","된장녀",
  /* 혐오/차별 */
  "느금마","니애미","니애비","지잡","흙수저","뒤져","자살해","죽어라",
  /* 성적 콘텐츠 */
  "섹스","야동","포르노","성인방","오피","안마","출장만남","조건만남","원나잇",
  "성매매","매춘","원조교제","노출","자위","음란","변태",
  /* 마약/불법 */
  "대마","마약","필로폰","메스암페타민","코카인",
  /* 도박 */
  "토토","카지노사이트","바카라","슬롯머신","도박사이트",
  /* 사기/피싱 */
  "대출사기","보이스피싱","리딩방","선입금",
];

/* 정규식 패턴 (우회 방지: 자음만, 초성, 특수문자 삽입 등) */
const BLOCKED_PATTERNS: RegExp[] = [
  /ㅅㅂ|시[^\uAC00-\uD7A3]*발|씨[^\uAC00-\uD7A3]*발/gi,
  /ㅂㅅ|병[^\uAC00-\uD7A3]*신/gi,
  /ㅈㄹ|지[^\uAC00-\uD7A3]*랄/gi,
  /ㅆㅂ/gi,
  /ㄴㄱㅁ/gi,
  /ㅗㅗ/gi,
  /fuck|shit|bitch|asshole|dick|pussy/gi,
];

export interface FilterResult {
  blocked: boolean;
  matches: string[];
  severity: "low" | "medium" | "high";
}

/**
 * 콘텐츠 유해성 검사
 * @returns { blocked, matches, severity }
 */
export function checkContent(text: string): FilterResult {
  const lower = text.toLowerCase().replace(/\s/g, "");
  const matches: string[] = [];

  /* 키워드 매칭 */
  for (const keyword of BLOCKED_KEYWORDS) {
    if (lower.includes(keyword.toLowerCase())) {
      matches.push(keyword);
    }
  }

  /* 패턴 매칭 */
  for (const pattern of BLOCKED_PATTERNS) {
    const m = text.match(pattern);
    if (m) matches.push(...m);
  }

  const unique = [...new Set(matches)];
  const severity = unique.length >= 3 ? "high" : unique.length >= 1 ? "medium" : "low";

  return {
    blocked: unique.length > 0,
    matches: unique,
    severity,
  };
}

/**
 * URL/링크 필터링 (악성 링크 차단)
 */
export function checkUrls(text: string): string[] {
  const urlPattern = /https?:\/\/[^\s<>"']+/gi;
  const urls = text.match(urlPattern) || [];
  const blocked: string[] = [];
  const blockedDomains = ["ilbe.com", "womad", "megalia", "t.me/", "discord.gg/"];

  for (const url of urls) {
    for (const domain of blockedDomains) {
      if (url.toLowerCase().includes(domain)) {
        blocked.push(url);
      }
    }
  }

  return blocked;
}

/** 키워드 목록 (클라이언트에서 참조용) */
export const BLOCKED_KEYWORDS_LIST = BLOCKED_KEYWORDS;
