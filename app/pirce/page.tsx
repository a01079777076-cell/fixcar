// 📁 저장 경로: app/price/page.tsx
// /price → /cars 리다이렉트 (시세 조회는 매물 목록에서)
import { redirect } from "next/navigation";
export default function PriceRedirect() { redirect("/cars"); }
