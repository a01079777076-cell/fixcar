"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import RoleGuard from "@/components/RoleGuard";

interface Dealer {
  id: number; shopName?: string; ownerName?: string; phone?: string; email?: string;
  address?: string; businessNumber?: string; createdAt: string;
  userId?: number; birthDate?: string; region?: string; experience?: string;
  introduction?: string; rating?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

function formatPhone(p: string | null | undefined): string {
  if (!p) return "-";
  const d = p.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return p;
}

function DealersContent() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/dealers")
      .then(r => r.json())
      .then(data => { setDealers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setDealers([]); setLoading(false); });
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/dealers/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve: true }),
      });
      const data = await res.json();
      if (data.success) {
        alert("승인 완료!");
        setDealers(prev => prev.map(d => d.id === id ? { ...d, approved: true } : d));
      } else {
        alert("승인 실패: " + (data.error || "알 수 없는 오류"));
      }
    } catch (e) { alert("승인 요청 실패: " + String(e)); }
  };

  const handleReject = async (id: number) => {
    if (!confirm("정말 거부하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/admin/dealers/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve: false }),
      });
      const data = await res.json();
      if (data.success) {
        setDealers(prev => prev.filter(d => d.id !== id));
      }
    } catch { alert("거부 실패"); }
  };

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
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 4, color: "#E8A020", marginBottom: 6 }}>DEALER MANAGEMENT</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white" }}>딜러 관리</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>전체 {dealers.length}명</p>
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 100px" }}>
          {loading ? <div style={{ textAlign: "center", padding: 60, color: "#AAA" }}>로딩 중...</div> : dealers.length === 0 ? (
            <div style={{ background: "white", borderRadius: 18, padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏪</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>등록된 딜러가 없어요</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {dealers.map(d => (
                <div key={d.id} style={{ background: "white", borderRadius: 18, overflow: "hidden" }}>
                  {/* 요약 */}
                  <div onClick={() => setExpandedId(expandedId === d.id ? null : d.id)} style={{ padding: "18px 22px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏪</div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800 }}>{d.shopName || d.ownerName || "딜러 #" + d.id}</div>
                        <div style={{ fontSize: 12, color: "#AAA", fontWeight: 400 }}>{d.ownerName || "-"} · {formatPhone(d.phone)}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 16, color: "#CCC", transform: expandedId === d.id ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
                  </div>

                  {/* 상세 정보 (펼침) */}
                  {expandedId === d.id && (
                    <div style={{ padding: "0 22px 22px", borderTop: "1px solid #F0EEE9", paddingTop: 18 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                        {[
                          ["상호명", d.shopName || "-"],
                          ["대표자", d.ownerName || "-"],
                          ["연락처", formatPhone(d.phone)],
                          ["이메일", d.email || "-"],
                          ["사업자번호", d.businessNumber || "-"],
                          ["주소", d.address || "-"],
                          ["생년월일", d.birthDate || "-"],
                          ["지역", d.region || "-"],
                          ["경력", d.experience || "-"],
                          ["평점", d.rating ? `⭐ ${d.rating}` : "-"],
                          ["신청일", new Date(d.createdAt).toLocaleDateString("ko-KR")],
                          ["회원번호", d.userId ? `#${d.userId}` : "-"],
                        ].map(([l, v], i) => (
                          <div key={i} style={{ padding: "8px 0" }}>
                            <div style={{ fontSize: 11, color: "#AAA", fontWeight: 400, marginBottom: 2 }}>{l}</div>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      {/* 자기소개 */}
                      {d.introduction && (
                        <div style={{ background: "#F8F7F4", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                          <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6, color: "#888" }}>자기소개</div>
                          <div style={{ fontSize: 13, color: "#555", fontWeight: 400, lineHeight: 1.7 }}>{d.introduction}</div>
                        </div>
                      )}
                      {/* 승인/거부 */}
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => handleApprove(d.id)} style={{ flex: 1, padding: "14px", background: "#00C471", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>✅ 승인하기</button>
                        <button onClick={() => handleReject(d.id)} style={{ padding: "14px 24px", background: "#FFF0ED", color: "#E24B4A", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>거부</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function AdminDealersPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <DealersContent />
    </RoleGuard>
  );
}
