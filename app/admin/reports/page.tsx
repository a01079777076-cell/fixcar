"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react";

/* 실제 커뮤니티 신고 (CommunityReport) — 운영자 통합관리 API 사용 */
interface Report {
  id: number; postId: number; userId: number; category: string; reason: string | null; status: string; createdAt: string;
  post: { id: number; title: string; status: string } | null;
  user: { name: string; nickname: string | null } | null;
}

const STATUS_LABEL: Record<string, string> = { PENDING: "검토중", RESOLVED: "처리완료", REJECTED: "기각" };

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    fetch("/api/admin/master/CommunityReport?size=200&sort=createdAt&dir=desc")
      .then(r => r.json())
      .then(d => { if (d.success) { setReports(d.data.rows); setError(""); } else setError(d.error || "불러오기 실패"); })
      .catch(() => setError("불러오기 실패"))
      .finally(() => setLoaded(true));
  }, []);
  useEffect(() => { load(); }, [load]);

  const resolve = async (id: number, status: "RESOLVED" | "REJECTED") => {
    const res = await fetch(`/api/admin/master/CommunityReport/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    const d = await res.json().catch(() => ({}));
    if (!d.success) { setError(d.error || "처리 실패"); return; }
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    setSelected(null);
  };

  const pending = reports.filter(r => r.status === "PENDING").length;
  const fmt = (v: string) => new Date(v).toLocaleDateString("ko-KR");
  const reporter = (r: Report) => r.user?.nickname || r.user?.name || `회원 #${r.userId}`;

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        .row { cursor:pointer; transition:background 0.1s; }
        .row:hover { background:#FAFAF8; }
        @media(max-width:768px) { .split { grid-template-columns:1fr !important; } }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "#1A1A1A", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "'Bebas Neue',serif", fontSize: "24px", letterSpacing: "3px" }}><span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "white" }}>CAR</span></Link>
          <div style={{ display: "flex", gap: "20px" }}>
            {[["대시보드","/admin"],["통합관리","/admin/master"],["신고","/admin/reports"],["설정","/admin/settings"]].map(([l,h])=>(
              <a key={l} href={h} style={{ fontSize: "13px", fontWeight: 700, color: h === "/admin/reports" ? "white" : "rgba(255,255,255,0.4)" }}>{l}</a>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 32px 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 800 }}>커뮤니티 신고 관리</h1>
            <span style={{ background: "#FFF0ED", color: "#FF3B1E", padding: "5px 14px", borderRadius: "100px", fontSize: "13px", fontWeight: 800 }}>검토중 {pending}건</span>
          </div>

          {error && <div style={{ background: "#FFF0ED", color: "#E24B4A", padding: "12px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700, marginBottom: 14 }}>⚠️ {error}</div>}

          <div className="split" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "16px", alignItems: "start" }}>
            <div style={{ background: "white", borderRadius: "18px", overflow: "hidden" }}>
              {loaded && reports.length === 0 && (
                <div style={{ padding: 40, textAlign: "center", color: "#BBB", fontSize: 14 }}>접수된 신고가 없습니다</div>
              )}
              {reports.map((r, i) => (
                <div key={r.id} className="row" onClick={() => setSelected(r)}
                  style={{ padding: "16px 18px", borderBottom: i < reports.length - 1 ? "1px solid #F0EEE9" : "none", background: selected?.id === r.id ? "#FFF0ED" : "white" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ background: "#FFF0ED", color: "#FF3B1E", padding: "2px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: 800 }}>{r.category}</span>
                    <span style={{ background: r.status === "PENDING" ? "#FFF8EC" : "#EAF6EF", color: r.status === "PENDING" ? "#E8A020" : "#2D8A52", padding: "2px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: 800 }}>{STATUS_LABEL[r.status] || r.status}</span>
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "3px" }}>{r.post?.title || `게시글 #${r.postId}`}</div>
                  <div style={{ fontSize: "12px", color: "#AAA", fontWeight: 400 }}>신고자: {reporter(r)} · {fmt(r.createdAt)}</div>
                </div>
              ))}
            </div>

            {selected ? (
              <div style={{ background: "white", borderRadius: "18px", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <AlertTriangle size={18} color="#FF3B1E" />
                  <span style={{ fontSize: "16px", fontWeight: 800 }}>신고 상세</span>
                </div>
                {[["신고 유형", selected.category], ["신고 대상", selected.post?.title || `게시글 #${selected.postId}`], ["신고자", reporter(selected)], ["신고일", fmt(selected.createdAt)]].map(([k,v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F0EEE9" }}>
                    <span style={{ fontSize: "13px", color: "#888", fontWeight: 400 }}>{k}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: "14px", padding: "14px", background: "#F8F6F2", borderRadius: "10px", fontSize: "14px", color: "#444", lineHeight: 1.75, fontWeight: 400 }}>{selected.reason || "(사유 없음)"}</div>
                <a href={`/community/${selected.postId}`} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 12, fontSize: 13, fontWeight: 800, color: "#1847FF" }}>게시글 보기 →</a>
                {selected.status === "PENDING" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "16px" }}>
                    <button onClick={() => resolve(selected.id, "RESOLVED")} style={{ background: "#EAF6EF", color: "#2D8A52", border: "none", padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><CheckCircle size={15} /> 처리 완료</button>
                    <button onClick={() => resolve(selected.id, "REJECTED")} style={{ background: "#FFF0ED", color: "#FF3B1E", border: "none", padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><XCircle size={15} /> 기각</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: "18px", padding: "60px", textAlign: "center" }}>
                <Eye size={40} color="#E0DDD7" style={{ margin: "0 auto 14px" }} />
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#AAA" }}>신고를 선택해주세요</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
