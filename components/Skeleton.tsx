"use client";

export function SkeletonCard() {
  return (
    <div style={{ background: "white", borderRadius: 18, overflow: "hidden", animation: "pulse 1.5s infinite" }}>
      <div style={{ height: 180, background: "#E8E6E1" }} />
      <div style={{ padding: "16px 20px" }}>
        <div style={{ height: 14, background: "#E8E6E1", borderRadius: 4, width: "60%", marginBottom: 8 }} />
        <div style={{ height: 12, background: "#E8E6E1", borderRadius: 4, width: "40%", marginBottom: 12 }} />
        <div style={{ height: 20, background: "#E8E6E1", borderRadius: 4, width: "30%" }} />
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ background: "white", borderRadius: 18, overflow: "hidden" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ padding: "16px 20px", borderBottom: "1px solid #F0EEE9", display: "flex", gap: 16, alignItems: "center", animation: "pulse 1.5s infinite" }}>
          <div style={{ width: 40, height: 14, background: "#E8E6E1", borderRadius: 4 }} />
          <div style={{ flex: 1, height: 14, background: "#E8E6E1", borderRadius: 4 }} />
          <div style={{ width: 80, height: 14, background: "#E8E6E1", borderRadius: 4 }} />
        </div>
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
}
