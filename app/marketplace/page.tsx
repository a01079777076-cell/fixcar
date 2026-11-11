import { redirect } from "next/navigation";

/* 구 매매단지 안내 페이지 — 하드코딩된 제휴 딜러(실존 확인 안 됨) 제거.
   매매단지는 /complexes, 입점 상사는 DB 기반 /shops 사용 */
export default function MarketplacePage() {
  redirect("/complexes");
}
