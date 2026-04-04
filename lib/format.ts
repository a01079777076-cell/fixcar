// 📁 저장 경로: lib/format.ts
// 포맷팅 유틸리티

/**
 * 가격 포맷 (만원 단위)
 * 120 → "120만원"
 * 12321 → "1억 2,321만원"
 */
export function formatPrice(priceInMan: number): string {
  if (priceInMan >= 10000) {
    const eok = Math.floor(priceInMan / 10000);
    const rest = priceInMan % 10000;
    return rest > 0 ? `${eok}억 ${rest.toLocaleString()}만원` : `${eok}억원`;
  }
  return `${priceInMan.toLocaleString()}만원`;
}

/**
 * 주행거리 포맷
 * 12345 → "1.2만km"
 * 123456 → "12.3만km"
 * 5000 → "5,000km"
 */
export function formatMileage(km: number): string {
  if (km >= 10000) return `${(km / 10000).toFixed(1)}만km`;
  return `${km.toLocaleString()}km`;
}

/**
 * 날짜 포맷
 */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * 상대 시간
 */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "방금";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  if (day < 30) return `${Math.floor(day / 7)}주 전`;
  if (day < 365) return `${Math.floor(day / 30)}개월 전`;
  return `${Math.floor(day / 365)}년 전`;
}

/**
 * 전화번호 포맷
 * "01012345678" → "010-1234-5678"
 * "0621234567" → "062-123-4567"
 */
export function formatPhone(phone: string): string {
  const nums = phone.replace(/\D/g, "");
  if (nums.length === 11) return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  if (nums.length === 10) return `${nums.slice(0, 3)}-${nums.slice(3, 6)}-${nums.slice(6)}`;
  return phone;
}

/**
 * 차량번호 포맷 검증
 * "12가1234" → true
 */
export function isValidPlateNumber(plate: string): boolean {
  return /^\d{2,3}[가-힣]\d{4}$/.test(plate.replace(/\s/g, ""));
}
