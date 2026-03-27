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
      .then(d => { setCount(d.activeUsers || 0); if (d.monthly) setMonthly(d.monthly); })
      .catch(() => setCount(300));
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
  const maxM    = Math.max(...monthly.map(m => m.count), 1);
  const isGrowing = monthly.length >= 2 && monthly[monthly.length - 1].count > monthly[monthly.length - 2].count;

  return (
    <div style={{ padding: "16px 14px", textAlign: "center", borderRight: "1px solid #F0EEE9", position: "relative", minWidth: 0 }}>
      {/* LIVE 뱃지 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 9, color: "#2D8A52", fontWeight: 800 }}>▲ LIVE</span>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2D8A52", display: "inline-block", animation: "pulse 1.5s infinite" }} />
      </div>

      {/* 숫자 */}
      <div style={{ fontFamily: "'Bebas Neue',serif", fontSize: 26, color: "#E8A020", letterSpacing: -1, lineHeight: 1 }}>
        {value}<span style={{ fontSize: 13, fontWeight: 600 }}>{unit}</span>
      </div>

      {/* 레이블 */}
      <div style={{ fontSize: 11, color: "#AAA", marginTop: 3, fontWeight: 400 }}>누적 이용자</div>

      {/* 그래프 — 숫자와 완전 분리 */}
      {monthly.length > 0 && (
        <div style={{ marginTop: 8, borderTop: "1px solid #F0EEE9", paddingTop: 8 }}>
          <div style={{ fontSize: 9, color: isGrowing ? "#2D8A52" : "#AAA", fontWeight: 800, marginBottom: 6 }}>
            {isGrowing ? "📈 급성장" : "📊 추이"}
          </div>
          {/* 바 + 레이블을 세로 방향으로 완전 분리 */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 4, height: 28 }}>
            {monthly.slice(-3).map((m, i, arr) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                <div style={{ width: 16, borderRadius: "3px 3px 0 0", height: `${Math.max((m.count / maxM) * 22, 3)}px`, background: i === arr.length - 1 ? "#1847FF" : "#DDEEFF" }} />
              </div>
            ))}
          </div>
          {/* 월 레이블 — 바와 분리된 행 */}
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 3 }}>
            {monthly.slice(-3).map((m, i) => (
              <div key={i} style={{ width: 16, textAlign: "center", fontSize: 8, color: "#CCC", lineHeight: 1 }}>{m.month}</div>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}
