"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import RoleGuard from "@/components/RoleGuard";

interface VisitorLog { id: number; path: string; ip?: string; userAgent?: string; createdAt: string; }

function VisitorsContent() {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/visitors")
      .then(r => r.json())
      .then(data => { setLogs(Array.isArray(data) ? data : data.logs || []); setLoading(false); })
      .catch(() => { setLogs([]); setLoading(false); });
  }, []);

  /* 오늘/어제/이번주 통계 */
  const today = new Date().toDateString();
  const todayCount = logs.filter(l => new Date(l.createdAt).toDateString() === today).length;
  const totalCount = logs.length;

  /* 페이지별 집계 */
  const pageCounts: Record<string, number> = {};
  logs.forEach(l => { pageCounts[l.path] = (pageCounts[l.path] || 0) + 1; });
  const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
      `}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "#1A1A1A", padding: "36px 24px 28px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 4, color: "#00C471", marginBottom: 6 }}>VISITOR ANALYTICS</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white" }}>방문자 통계</h1>
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 100px" }}>
          {/* KPI */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
            <div style={{ background: "white", borderRadius: 16, padding: "24px 20px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: "#00C471" }}>{todayCount}</div>
              <div style={{ fontSize: 13, color: "#AAA", fontWeight: 400, marginTop: 4 }}>오늘 방문</div>
            </div>
            <div style={{ background: "white", borderRadius: 16, padding: "24px 20px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: "#1847FF" }}>{totalCount}</div>
              <div style={{ fontSize: 13, color: "#AAA", fontWeight: 400, marginTop: 4 }}>전체 방문</div>
            </div>
          </div>

          {/* 인기 페이지 */}
          <div style={{ background: "white", borderRadius: 18, padding: "22px 24px", marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>📊 인기 페이지 TOP 10</div>
            {topPages.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#CCC" }}>데이터 없음</div>
            ) : topPages.map(([pg, cnt], i) => (
              <div key={pg} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < topPages.length - 1 ? "1px solid #F0EEE9" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: i < 3 ? "#FF3B1E" : "#E8E6E1", color: i < 3 ? "white" : "#888", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{pg}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#1847FF" }}>{cnt}회</span>
              </div>
            ))}
          </div>

          {/* 최근 방문 로그 */}
          <div style={{ background: "white", borderRadius: 18, padding: "22px 24px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>🕐 최근 방문 로그</div>
            {loading ? <div style={{ textAlign: "center", padding: 40, color: "#CCC" }}>로딩 중...</div> : (
              <div style={{ maxHeight: 400, overflowY: "auto" }}>
                {logs.slice(0, 50).map((log, i) => (
                  <div key={log.id || i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F0EEE9", fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: "#333" }}>{log.path}</span>
                    <span style={{ color: "#CCC", fontSize: 11 }}>{new Date(log.createdAt).toLocaleString("ko-KR")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminVisitorsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <VisitorsContent />
    </RoleGuard>
  );
}
