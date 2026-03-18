"use client";
import { useState, useEffect } from "react";
import { MessageCircle, CheckCircle, Clock, Send } from "lucide-react";

interface Inquiry { id: number; carId: number; car: { name: string }; user: { name: string }; message: string; status: string; createdAt: string; }

export default function DealerInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inquiries?dealerId=1")
      .then(r => r.json())
      .then(d => { if (d.success) setInquiries(d.data); setLoading(false); })
      .catch(() => {
        // 샘플 데이터
        setInquiries([
          { id: 1, carId: 1, car: { name: "현대 아반떼 CN7" }, user: { name: "김○○" }, message: "할부 조건이 어떻게 되나요? 60개월 가능한지 알고 싶어요.", status: "PENDING", createdAt: "2025-03-18T10:00:00" },
          { id: 2, carId: 2, car: { name: "기아 K3" }, user: { name: "이○○" }, message: "탁송 비용 광주 → 부산 얼마나 되나요?", status: "ANSWERED", createdAt: "2025-03-17T15:30:00" },
          { id: 3, carId: 3, car: { name: "현대 투싼 NX4" }, user: { name: "박○○" }, message: "직접 보러 가도 되나요? 주말에 방문 가능한지요.", status: "PENDING", createdAt: "2025-03-17T09:20:00" },
        ]);
        setLoading(false);
      });
  }, []);

  const sendReply = () => {
    if (!reply.trim() || !selected) return;
    setInquiries(prev => prev.map(i => i.id === selected.id ? { ...i, status: "ANSWERED" } : i));
    setSelected(prev => prev ? { ...prev, status: "ANSWERED" } : prev);
    setReply("");
    alert("답변이 전송됐어요!");
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
        textarea { font-family:'NanumSquareRound',sans-serif; }
        .inq-row { cursor:pointer; transition:background 0.1s; }
        .inq-row:hover { background:#FAFAF8; }
        .inq-row.active { background:#EEF2FF; }
        @media(max-width:768px) { .split { grid-template-columns:1fr !important; } }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "#1A1A1A", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue',serif", fontSize: "24px", letterSpacing: "3px" }}><span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "white" }}>CAR</span></a>
          <a href="/dealer" style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>← 대시보드</a>
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 32px 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 800 }}>문의 관리</h1>
            <div style={{ display: "flex", gap: "8px", fontSize: "13px" }}>
              <span style={{ background: "#FFF0ED", color: "#FF3B1E", padding: "5px 12px", borderRadius: "100px", fontWeight: 800 }}>미답변 {inquiries.filter(i => i.status === "PENDING").length}건</span>
              <span style={{ background: "#EAF6EF", color: "#2D8A52", padding: "5px 12px", borderRadius: "100px", fontWeight: 800 }}>답변완료 {inquiries.filter(i => i.status === "ANSWERED").length}건</span>
            </div>
          </div>

          <div className="split" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "16px", alignItems: "start" }}>
            {/* 문의 목록 */}
            <div style={{ background: "white", borderRadius: "18px", overflow: "hidden" }}>
              {loading ? <div style={{ padding: "40px", textAlign: "center", color: "#AAA" }}>로딩 중...</div> :
                inquiries.map((inq, i) => (
                  <div key={inq.id} className={`inq-row${selected?.id === inq.id ? " active" : ""}`}
                    onClick={() => setSelected(inq)}
                    style={{ padding: "16px 18px", borderBottom: i < inquiries.length - 1 ? "1px solid #F0EEE9" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
                          <span style={{ background: inq.status === "PENDING" ? "#FFF0ED" : "#EAF6EF", color: inq.status === "PENDING" ? "#FF3B1E" : "#2D8A52", padding: "2px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: 800, display: "flex", alignItems: "center", gap: "3px" }}>
                            {inq.status === "PENDING" ? <><Clock size={9} /> 미답변</> : <><CheckCircle size={9} /> 답변완료</>}
                          </span>
                          <span style={{ fontSize: "12px", color: "#1847FF", fontWeight: 700 }}>{inq.car?.name || "차량"}</span>
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px", lineHeight: 1.3 }}>{inq.user?.name}님의 문의</div>
                        <div style={{ fontSize: "12px", color: "#888", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inq.message}</div>
                      </div>
                      <div style={{ fontSize: "11px", color: "#CCC", fontWeight: 400, flexShrink: 0 }}>{inq.createdAt?.slice(5, 10)}</div>
                    </div>
                  </div>
                ))
              }
            </div>

            {/* 상세 + 답변 */}
            {selected ? (
              <div style={{ background: "white", borderRadius: "18px", padding: "24px" }}>
                <div style={{ marginBottom: "18px", paddingBottom: "18px", borderBottom: "1px solid #F0EEE9" }}>
                  <div style={{ fontSize: "12px", color: "#1847FF", fontWeight: 800, marginBottom: "6px" }}>{selected.car?.name}</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: "10px" }}>{selected.user?.name}님의 문의</div>
                  <div style={{ background: "#F8F6F2", borderRadius: "12px", padding: "16px", fontSize: "14px", color: "#444", lineHeight: 1.75, fontWeight: 400 }}>{selected.message}</div>
                  <div style={{ fontSize: "12px", color: "#AAA", marginTop: "8px", fontWeight: 400 }}>{selected.createdAt?.slice(0, 16).replace("T", " ")}</div>
                </div>
                {selected.status === "ANSWERED" ? (
                  <div style={{ background: "#EAF6EF", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle size={18} color="#2D8A52" />
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#2D8A52" }}>이미 답변이 완료된 문의예요</span>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: "15px", fontWeight: 800, marginBottom: "12px" }}>답변 작성</div>
                    <textarea value={reply} onChange={e => setReply(e.target.value)} rows={5} placeholder="고객에게 보낼 답변을 작성해주세요..."
                      style={{ width: "100%", border: "1.5px solid #E0DDD7", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", outline: "none", resize: "none", marginBottom: "12px" }} />
                    <button onClick={sendReply} disabled={!reply.trim()}
                      style={{ background: reply.trim() ? "#1847FF" : "#E0DDD7", color: reply.trim() ? "white" : "#AAA", border: "none", padding: "13px", borderRadius: "10px", fontSize: "14px", fontWeight: 800, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", cursor: reply.trim() ? "pointer" : "default" }}>
                      <Send size={15} /> 답변 전송
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: "18px", padding: "60px", textAlign: "center" }}>
                <MessageCircle size={40} color="#E0DDD7" style={{ margin: "0 auto 14px" }} />
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#AAA" }}>문의를 선택해주세요</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
