"use client";
import { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react";

const SAMPLE_REPORTS = [
  { id: 1, type: "허위매물", target: "현대 아반떼 CN7 (ID: 1)", reporter: "김○○", reason: "사진과 실제 차량 상태가 다릅니다. 외관 스크래치가 있는데 사진에 없어요.", date: "2025-03-18", status: "검토중" },
  { id: 2, type: "이용약관 위반", target: "딜러: 전남자동차", reporter: "이○○", reason: "FIX 정찰가 외 추가 비용을 요구했습니다.", date: "2025-03-15", status: "처리완료" },
  { id: 3, type: "허위매물", target: "기아 K3 (ID: 2)", reporter: "박○○", reason: "무사고라고 했는데 카히스토리 조회하니 사고 이력이 있어요.", date: "2025-03-14", status: "검토중" },
];

export default function AdminReportsPage() {
  const [reports, setReports] = useState(SAMPLE_REPORTS);
  const [selected, setSelected] = useState<typeof SAMPLE_REPORTS[0] | null>(null);

  const resolve = (id: number, action: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    setSelected(null);
  };

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
          <a href="/" style={{ fontFamily: "'Bebas Neue',serif", fontSize: "24px", letterSpacing: "3px" }}><span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "white" }}>CAR</span></a>
          <div style={{ display: "flex", gap: "20px" }}>
            {[["대시보드","/admin"],["회원","/admin/users"],["매물","/admin/cars"],["신고","/admin/reports"],["설정","/admin/settings"]].map(([l,h])=>(
              <a key={l} href={h} style={{ fontSize: "13px", fontWeight: 700, color: h === "/admin/reports" ? "white" : "rgba(255,255,255,0.4)" }}>{l}</a>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 32px 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 800 }}>신고 관리</h1>
            <span style={{ background: "#FFF0ED", color: "#FF3B1E", padding: "5px 14px", borderRadius: "100px", fontSize: "13px", fontWeight: 800 }}>검토중 {reports.filter(r=>r.status==="검토중").length}건</span>
          </div>

          <div className="split" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "16px", alignItems: "start" }}>
            <div style={{ background: "white", borderRadius: "18px", overflow: "hidden" }}>
              {reports.map((r, i) => (
                <div key={r.id} className="row" onClick={() => setSelected(r)}
                  style={{ padding: "16px 18px", borderBottom: i < reports.length - 1 ? "1px solid #F0EEE9" : "none", background: selected?.id === r.id ? "#FFF0ED" : "white" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ background: r.type === "허위매물" ? "#FFF0ED" : "#EEF2FF", color: r.type === "허위매물" ? "#FF3B1E" : "#1847FF", padding: "2px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: 800 }}>{r.type}</span>
                    <span style={{ background: r.status === "검토중" ? "#FFF8EC" : "#EAF6EF", color: r.status === "검토중" ? "#E8A020" : "#2D8A52", padding: "2px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: 800 }}>{r.status}</span>
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "3px" }}>{r.target}</div>
                  <div style={{ fontSize: "12px", color: "#AAA", fontWeight: 400 }}>신고자: {r.reporter} · {r.date}</div>
                </div>
              ))}
            </div>

            {selected ? (
              <div style={{ background: "white", borderRadius: "18px", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <AlertTriangle size={18} color="#FF3B1E" />
                  <span style={{ fontSize: "16px", fontWeight: 800 }}>신고 상세</span>
                </div>
                {[["신고 유형", selected.type], ["신고 대상", selected.target], ["신고자", selected.reporter], ["신고일", selected.date]].map(([k,v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F0EEE9" }}>
                    <span style={{ fontSize: "13px", color: "#888", fontWeight: 400 }}>{k}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: "14px", padding: "14px", background: "#F8F6F2", borderRadius: "10px", fontSize: "14px", color: "#444", lineHeight: 1.75, fontWeight: 400 }}>{selected.reason}</div>
                {selected.status === "검토중" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "16px" }}>
                    <button onClick={() => resolve(selected.id, "처리완료")} style={{ background: "#EAF6EF", color: "#2D8A52", border: "none", padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><CheckCircle size={15} /> 처리 완료</button>
                    <button onClick={() => resolve(selected.id, "기각")} style={{ background: "#FFF0ED", color: "#FF3B1E", border: "none", padding: "12px", borderRadius: "10px", fontSize: "14px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><XCircle size={15} /> 기각</button>
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
