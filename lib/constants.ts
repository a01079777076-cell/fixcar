// 📁 저장 경로: lib/constants.ts
// 픽스카 전역 상수

export const SITE_NAME = "픽스카 FIXCAR";
export const SITE_URL = "https://www.fixcar.kr";
export const SITE_DESC = "광주 1위 중고차 정찰제 플랫폼";

/* 브랜드 */
export const DOMESTIC_BRANDS = ["현대","기아","제네시스","쉐보레","르노","KG모빌리티"] as const;
export const IMPORT_BRANDS = ["BMW","벤츠","아우디","폭스바겐","볼보","테슬라","토요타","혼다","렉서스","포르쉐","랜드로버","재규어","미니","푸조","시트로엥","지프","캐딜락","링컨","마세라티","벤틀리","롤스로이스","페라리","람보르기니","맥라렌","애스턴마틴"] as const;
export const ALL_BRANDS = [...DOMESTIC_BRANDS, ...IMPORT_BRANDS] as const;

/* 연료 */
export const FUELS = ["가솔린","디젤","LPG","전기","하이브리드","플러그인하이브리드","수소"] as const;

/* 색상 */
export const COLORS = ["흰색","검정","은색","회색","빨강","파랑","녹색","노랑","주황","갈색","베이지","와인","하늘","기타"] as const;

/* 변속기 */
export const TRANSMISSIONS = ["자동","수동","CVT","DCT"] as const;

/* 지역 */
export const REGIONS = ["광주","전남","전북","서울","경기","인천","대전","대구","부산","울산","세종","강원","충북","충남","경북","경남","제주"] as const;

/* 매물 상태 */
export const CAR_STATUS = {
  AVAILABLE: { label: "판매중", color: "#2D8A52", bg: "#EAF6EF" },
  REVIEWING: { label: "검수대기", color: "#E8A020", bg: "#FFF8E0" },
  RESERVED: { label: "예약중", color: "#0066FF", bg: "#EEF5FF" },
  SOLD: { label: "판매완료", color: "#888", bg: "#F0EEE9" },
} as const;

/* 디자인 토큰 */
export const DESIGN = {
  bg: "#F0EEE9",
  accent: "#FF3B1E",
  dealer: "#0066FF",
  success: "#2D8A52",
  warning: "#E8A020",
  error: "#E24B4A",
  text: "#1A1A1A",
  textLight: "#888",
  border: "#E0DDD7",
  cardBg: "white",
  radius: { sm: 8, md: 12, lg: 16, xl: 20 },
  font: "'NanumSquareRound', sans-serif",
  fontDisplay: "'Bebas Neue', serif",
} as const;

/* 검수업체 */
export const INSP_CENTERS = [
  { name: "빛고을 (빛고을오토자동차공업사)", region: "광주 서구", partner: true },
  { name: "서광주", region: "광주 서구", partner: true },
  { name: "엠플러스", region: "광주 광산구", partner: true },
  { name: "웰퓨처", region: "광주 북구", partner: false },
  { name: "카존", region: "광주 광산구", partner: false },
  { name: "하나카", region: "광주 서구", partner: false },
  { name: "(주)광주성능정비", region: "광주 서구", partner: true },
  { name: "자동차성능점검인협동조합", region: "광주", partner: false },
  { name: "완성자동차공업사", region: "광주", partner: false },
] as const;

/* 신고 카테고리 */
export const REPORT_CATEGORIES = [
  { value: "허위매물", label: "허위매물" },
  { value: "허위정보", label: "허위/거짓 정보" },
  { value: "광고/홍보", label: "광고/홍보성 글" },
  { value: "욕설/비방", label: "욕설/비방" },
  { value: "음란물", label: "음란/선정적 내용" },
  { value: "도배/스팸", label: "도배/스팸" },
  { value: "개인정보", label: "개인정보 노출" },
  { value: "기타", label: "기타" },
] as const;
