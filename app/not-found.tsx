import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "#F0EEE9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'NanumSquareRound',sans-serif", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontFamily: "'Bebas Neue',serif", fontSize: 120, color: "#E0DDD7", lineHeight: 1 }}>404</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, marginTop: -12 }}>페이지를 찾을 수 없어요</h1>
        <p style={{ fontSize: 14, color: "#888", lineHeight: 1.8, marginBottom: 24 }}>
          주소가 잘못됐거나 삭제된 페이지예요.
        </p>
        <Link href="/">
          <button style={{ padding: "14px 32px", background: "#FF3B1E", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>홈으로 돌아가기</button>
        </Link>
      </div>
    </div>
  );
}
