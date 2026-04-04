// 📁 저장 경로: components/Loading.tsx
"use client";

export default function Loading({ text = "로딩 중...", size = "md" }: { text?: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? 24 : size === "lg" ? 48 : 32;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: size === "lg" ? 80 : 40, gap: 12 }}>
      <div style={{
        width: dim, height: dim, border: `3px solid #E0DDD7`,
        borderTopColor: "#FF3B1E", borderRadius: "50%",
        animation: "fixcar-spin 0.8s linear infinite",
      }} />
      {text && <div style={{ fontSize: size === "sm" ? 11 : 13, color: "#AAA", fontWeight: 500 }}>{text}</div>}
      <style>{`@keyframes fixcar-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function FullPageLoading({ text }: { text?: string }) {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loading text={text} size="lg" />
    </div>
  );
}
