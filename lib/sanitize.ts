/**
 * 입력값 검증 & 살균 유틸
 * XSS 방지 + SQL Injection 방지 (Prisma가 기본 처리하지만 이중 안전)
 */

/** HTML 태그 제거 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

/** XSS 위험 문자 이스케이프 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/** 문자열 길이 제한 */
export function limitLength(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) : str;
}

/** 전화번호 정리 (숫자만) */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "").slice(0, 11);
}

/** 이메일 형식 검증 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** 숫자 범위 검증 */
export function clampNumber(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/** 안전한 문자열 (스크립트 인젝션 방지) */
export function sanitizeString(str: string, maxLength = 500): string {
  return limitLength(stripHtml(str), maxLength);
}

/**
 * 객체의 문자열 필드를 전부 살균
 * API body를 통째로 넣으면 됨
 */
export function sanitizeBody<T extends Record<string, unknown>>(
  body: T,
  maxLength = 1000
): T {
  const cleaned = { ...body };
  for (const key of Object.keys(cleaned)) {
    const val = cleaned[key];
    if (typeof val === "string") {
      (cleaned as Record<string, unknown>)[key] = sanitizeString(val, maxLength);
    }
  }
  return cleaned;
}
