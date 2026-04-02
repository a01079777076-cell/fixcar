// ═══════════════════════════════════════════════════
// 📁 저장 경로: components/DailyCounter.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect } from "react";

function formatCount(n: number): { value: string; unit: string } {
  if (n >= 10000) return { value: (n / 10000).toFixed(1).replace(/\.0$/, ""), unit: "만명+" };
  if (n >= 1000)  return { value: (n / 1000).toFixed(1).replace(/\.0$/, ""),  unit: "천명+" };
  return { value: n.toLocaleString(), unit: "명" };
}

export default function DailyCounter() {
  const [count,   setCount]   = useState(0);
  const [display, setDisplay] = useState(0);
  const [monthly, setMonthly] = useState<{ month: string; count: number }[]>([]);

  useEffect(() => {
    fetch("/api/stats/activity", { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        /* API 값이 100 미만이면 최소 100으로 표시 */
        const users = Math.max(d.activeUsers || 0, 100);
        setCount(users);
        if (d.monthly) setMonthly(d.monthly);
      })
      .catch(() => setCount(100));
  }, []);

  useEffect(() => {
    if (count === 0) return;
    const steps = 40; let cur = 0;
    const timer = setInterval(() => {
      cur += count / steps;
      if (cur >= count) { setDisplay(count); clearInterval(timer); }
      else setDisplay(Math.floor(cur));
    }, 1800 / steps);
    return () => clearInterval(timer);
  }, [count]);

  const { value, unit } = formatCount(display);
  const maxM = Math.max(...monthly.map(m => m.count), 1);
  const isGrowing = monthly.length >= 2 && monthly[monthly.length - 1].count > monthly[monthly.length - 2].count;

  return (
    <div style={{ padding: "20px 18px", textAlign: "center", borderRight: "1px solid #F0EEE9", position: "relative", minWidth: 140 }}>
      {/* LIVE 뱃지 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: "#2D8A52", fontWeight: 800 }}>▲ LIVE</span>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2D8A52", display: "inline-block", animation: "pulse 1.5s infinite" }} />
      </div>

      {/* 숫자 (크게) */}
      <div style={{ fontFamily: "'Bebas Neue',serif", fontSize: 34, color: "#E8A020", letterSpacing: -1, lineHeight: 1 }}>
        {value}<span style={{ fontSize: 15, fontWeight: 600 }}>{unit}</span>
      </div>

      {/* 레이블 */}
      <div style={{ fontSize: 12, color: "#AAA", marginTop: 4, fontWeight: 500 }}>누적 이용자</div>

      {/* 급성장 그래프 (크게) */}
      {monthly.length > 0 && (
        <div style={{ marginTop: 10, borderTop: "1px solid #F0EEE9", paddingTop: 10 }}>
          <div style={{ fontSize: 10, color: isGrowing ? "#2D8A52" : "#AAA", fontWeight: 800, marginBottom: 8 }}>
            {isGrowing ? "📈 급성장" : "📊 추이"}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 6, height: 48 }}>
            {monthly.slice(-4).map((m, i, arr) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                <div style={{
                  width: 22, borderRadius: "4px 4px 0 0",
                  height: `${Math.max((m.count / maxM) * 40, 4)}px`,
                  background: i === arr.length - 1 ? "#1847FF" : "#DDEEFF",
                  transition: "height 0.5s",
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 4 }}>
            {monthly.slice(-4).map((m, i) => (
              <div key={i} style={{ width: 22, textAlign: "center", fontSize: 9, color: "#AAA", lineHeight: 1 }}>{m.month}</div>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}
