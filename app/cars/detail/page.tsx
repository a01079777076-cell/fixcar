"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { carIdFromQuery } from "@/lib/url-encode";

/* 기존 CarDetailClient를 그대로 사용하되, ID를 디코딩해서 전달 */
function DetailResolver() {
  const searchParams = useSearchParams();
  const v = searchParams.get("v");
  const carId = carIdFromQuery(v);

  if (!carId) {
    return (
      <div style={{ minHeight:"100vh", background:"#F0EEE9", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
        <div style={{ fontSize:48 }}>🚫</div>
        <h2 style={{ fontSize:20, fontWeight:800 }}>잘못된 차량 링크예요</h2>
        <p style={{ fontSize:14, color:"#AAA" }}>URL이 변경되었거나 유효하지 않습니다</p>
        <a href="/cars" style={{ padding:"12px 28px", background:"#FF3B1E", color:"white", borderRadius:12, fontSize:14, fontWeight:800, textDecoration:"none", marginTop:8 }}>매물 목록으로</a>
      </div>
    );
  }

  /* 디코딩 성공 → 기존 상세 페이지로 내부 리다이렉트 */
  if (typeof window !== "undefined") {
    window.location.replace(`/cars/${carId}`);
  }

  return <div style={{ textAlign:"center", padding:100, color:"#CCC" }}>로딩 중...</div>;
}

export default function CarDetailEncodedPage() {
  return (
    <Suspense fallback={<div style={{ textAlign:"center", padding:100, color:"#CCC" }}>로딩 중...</div>}>
      <DetailResolver />
    </Suspense>
  );
}
