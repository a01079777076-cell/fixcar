import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "픽스카 FIXCAR";
  const desc = searchParams.get("desc") || "광주 1위 중고차 정찰제 플랫폼";
  const price = searchParams.get("price") || "";
  const brand = searchParams.get("brand") || "";

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", flexDirection: "column", background: "#F0EEE9", fontFamily: "sans-serif", position: "relative" }}>
        {/* 상단 바 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "32px 48px", background: "#1A1A1A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: "#FF3B1E", letterSpacing: 2 }}>FIX</span>
            <span style={{ fontSize: 36, fontWeight: 800, color: "white", letterSpacing: 2 }}>CAR</span>
          </div>
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}>fixcar.kr</span>
        </div>

        {/* 메인 콘텐츠 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px" }}>
          {brand && (
            <span style={{ fontSize: 20, color: "#888", marginBottom: 12 }}>{brand}</span>
          )}
          <h1 style={{ fontSize: 52, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.2, marginBottom: 16, maxWidth: 900 }}>
            {title}
          </h1>
          <p style={{ fontSize: 24, color: "#888", marginBottom: 24 }}>{desc}</p>
          {price && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#FF3B1E", background: "#FFF0ED", padding: "6px 16px", borderRadius: 8, letterSpacing: 2 }}>FIX 정찰가</span>
              <span style={{ fontSize: 48, fontWeight: 800, color: "#FF3B1E" }}>{price}<span style={{ fontSize: 24, color: "#AAA" }}>만원</span></span>
            </div>
          )}
        </div>

        {/* 하단 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 48px", borderTop: "1px solid #E0DDD7" }}>
          <span style={{ fontSize: 16, color: "#AAA" }}>광주 중고차 정찰제 플랫폼</span>
          <div style={{ display: "flex", gap: 16, fontSize: 14, color: "#CCC" }}>
            <span>✅ 허위매물 ZERO</span>
            <span>🔒 FIX 정찰가</span>
            <span>🔍 100항목 검수</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
