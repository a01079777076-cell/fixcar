"use client";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: "'NanumSquareRound',sans-serif", background: "#F0EEE9", margin: 0 }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>😵</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>문제가 발생했어요</h1>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.8, marginBottom: 24 }}>
              페이지를 불러오는 중 오류가 발생했습니다.<br />잠시 후 다시 시도해주세요.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={reset} style={{ padding: "14px 28px", background: "#FF3B1E", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>다시 시도</button>
              <Link href="/"><button style={{ padding: "14px 28px", background: "white", color: "#555", border: "1.5px solid #E0DDD7", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>홈으로</button></Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
