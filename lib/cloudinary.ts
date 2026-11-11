// 📁 저장 경로: lib/cloudinary.ts
// Cloudinary 사진을 화면 크기에 맞게 받아오는 URL 변환 (서버·클라이언트 공용)
// - 원본(수 MB) 대신 필요한 크기 + 자동 포맷(WebP/AVIF) + 자동 품질로 전송
// - 크기 종류를 4개로 제한 → Cloudinary 변환(크레딧) 사용량 최소화

export const IMG = {
  thumb: 160,   // 작은 썸네일 (갤러리 하단 등)
  card: 640,    // 목록 카드
  detail: 1280, // 상세 메인 사진
  full: 1920,   // 확대 보기
} as const;

const MARKER = "/image/upload/";

/**
 * Cloudinary URL이면 크기·포맷 변환을 붙이고, 아니면 그대로 반환
 * 예) .../image/upload/v123/fixcar/a.jpg → .../image/upload/f_auto,q_auto,c_limit,w_640/v123/fixcar/a.jpg
 */
export function cldUrl(url: string | null | undefined, width: number = IMG.card): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || !url.includes(MARKER)) return url;

  const [head, tail] = url.split(MARKER);
  /* 이미 변환 파라미터가 붙어 있으면(예: w_300,...) 중복 적용 안 함 */
  const firstSeg = tail.split("/")[0];
  if (/(^|,)(w|h|c|f|q)_/.test(firstSeg)) return url;

  return `${head}${MARKER}f_auto,q_auto,c_limit,w_${width}/${tail}`;
}
