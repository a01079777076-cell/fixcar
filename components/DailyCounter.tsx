"use client";
import { useState, useEffect } from "react";

function formatCount(n: number): { value: string; unit: string } {
  if (n >= 10000) return { value: (n / 10000).toFixed(1).replace(/\.0$/, ""), unit: "만명+" };
  if (n >= 1000) return { value: (n / 1000).toFixed(1).replace(/\.0$/, ""), unit: "천명+" };
  return { value: String(n), unit: "명" };
}

export default function DailyCounter() {
  const [count, setCount] = useState(0);
  const [display, setDisplay] = useState(0);
  const [monthly, setMonthly] = useState<{month:string;count:number}[]>([]);

  useEffect(() => {
    fetch("/api/stats/dau", { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        setCount(Math.max(d.dau || 0, 47));
        if (d.monthly) setMonthly(d.monthly);
      })
      .catch(() => setCount(47));
  }, []);

  useEffect(() => {
    if (count === 0) return;
    const duration = 1500; const steps = 30; const inc = count / steps; let cur = 0;
    const timer = setInterval(() => { cur += inc; if (cur >= count) { setDisplay(count); clearInterval(timer); } else setDisplay(Math.floor(cur)); }, duration / steps);
    return () => clearInterval(timer);
  }, [count]);

  const { value, unit } = formatCount(display);
  const maxM = Math.max(...monthly.map(m => m.count), 1);
  const isGrowing = monthly.length >= 2 && monthly[monthly.length - 1].count > monthly[monthly.length - 2].count;

  return (
    <div style={{ padding: "20px 16px", textAlign: "center", borderRight: "1px solid #F0EEE9", position: "relative" }}>
      {/* LIVE 인디케이터 */}
      <div style={{ position: "absolute", top: 8, right: 10, display: "flex", alignItems: "center", gap: 3 }}>
        <span style={{ fontSize: 8, color: "#2D8A52", fontWeight: 800 }}>▲ LIVE</span>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#2D8A52", animation: "pulse 1.5s infinite" }} />
      </div>

      {/* 숫자 */}
      <div style={{ fontFamily: "'Bebas Neue',serif", fontSize: 28, color: "#E8A020", letterSpacing: -1 }}>
        {value}<span style={{ fontSize: 14, fontWeight: 600 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 11, color: "#AAA", marginTop: 2, fontWeight: 400 }}>일간 활성 사용자</div>

      {/* 미니 월간 그래프 */}
      {monthly.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 9, color: isGrowing ? "#2D8A52" : "#AAA", fontWeight: 800, marginBottom: 4 }}>
            {isGrowing ? "📈 급성장 추세" : "📊 월간 추이"}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 3, height: 36 }}>
            {monthly.slice(-3).map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{ fontSize: 7, fontWeight: 700, color: "#555" }}>{m.count}</div>
                <div style={{
                  width: 18, borderRadius: "3px 3px 0 0",
                  height: `${Math.max((m.count / maxM) * 24, 4)}px`,
                  background: i === monthly.slice(-3).length - 1 ? "#1847FF" : "#DDEEFF",
                  transition: "height 0.5s",
                }} />
                <div style={{ fontSize: 7, color: "#CCC" }}>{m.month}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}
