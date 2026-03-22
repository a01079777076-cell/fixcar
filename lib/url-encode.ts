/**
 * URL 난독화 유틸리티
 * 
 * /cars/3 → /cars/aX8kQ2mN
 * 
 * Base62 인코딩 + salt로 ID를 예측 불가능하게 변환
 * 엔카처럼 ?pageid=fc_carsearch&listAdvType=pic&carid=41544466 스타일
 */

const SALT = 48271; /* 내부 salt — 변경하면 기존 URL 깨짐 */
const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** 숫자 ID → 난독화 문자열 */
export function encodeCarId(id: number): string {
  /* XOR + 곱셈으로 패턴 숨기기 */
  const scrambled = ((id * 7919) ^ SALT) + 100000;
  let num = scrambled;
  let result = "";
  while (num > 0) {
    result = CHARS[num % 62] + result;
    num = Math.floor(num / 62);
  }
  /* 체크섬 1자리 추가 (변조 방지) */
  const checksum = CHARS[(id * 31 + 17) % 62];
  return result + checksum;
}

/** 난독화 문자열 → 숫자 ID */
export function decodeCarId(encoded: string): number | null {
  if (!encoded || encoded.length < 2) return null;
  try {
    const checkChar = encoded[encoded.length - 1];
    const body = encoded.slice(0, -1);

    /* Base62 디코딩 */
    let num = 0;
    for (const ch of body) {
      const idx = CHARS.indexOf(ch);
      if (idx === -1) return null;
      num = num * 62 + idx;
    }

    /* 역변환 */
    const descrambled = (num - 100000) ^ SALT;
    const id = descrambled / 7919;

    /* 정수 확인 */
    if (!Number.isInteger(id) || id < 1) return null;

    /* 체크섬 검증 */
    const expected = CHARS[(id * 31 + 17) % 62];
    if (checkChar !== expected) return null;

    return id;
  } catch {
    return null;
  }
}

/** 차량 상세 URL 생성 */
export function carDetailUrl(id: number): string {
  return `/cars/detail?v=${encodeCarId(id)}`;
}

/** 쿼리에서 차량 ID 추출 */
export function carIdFromQuery(v: string | null): number | null {
  if (!v) return null;
  return decodeCarId(v);
}
