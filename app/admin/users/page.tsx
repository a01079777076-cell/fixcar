"use client";
import { useState, useEffect } from "react";
import { Search, Shield, Ban, CheckCircle } from "lucide-react";

interface User { id: number; name: string; email: string; role: string; createdAt: string; }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users").then(r => r.json()).then(d => { if (d.success) setUsers(d.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const changeRole = async (id: number, role: string) => {
    await fetch(`/api/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) });
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  };

  const filtered = users.filter(u => u.name.includes(search) || u.email.includes(search));

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        .row:hover { background:#FAFAF8; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "#1A1A1A", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue',serif", fontSize: "24px", letterSpacing: "3px" }}><span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "white" }}>CAR</span></a>
          <div style={{ display: "flex", gap: "20px" }}>
            {[["대시보드", "/admin"], ["회원", "/admin/users"], ["매물", "/admin/cars"], ["설정", "/admin/settings"]].map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: "13px", fontWeight: 700, color: h === "/admin/users" ? "white" : "rgba(255,255,255,0.4)" }}>{l}</a>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 32px 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 800 }}>회원 관리</h1>
            <div style={{ position: "relative" }}>
              <Search size={16} color="#AAA" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input type="text" placeholder="이름·이메일 검색" value={search} onChange={e => setSearch(e.target.value)}
                style={{ border: "1.5px solid #E0DDD7", borderRadius: "10px", padding: "10px 14px 10px 36px", fontSize: "14px", outline: "none", background: "white", fontFamily: "'NanumSquareRound',sans-serif", width: "240px" }} />
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "18px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 120px", padding: "12px 20px", borderBottom: "2px solid #F0EEE9", fontSize: "12px", fontWeight: 800, color: "#AAA" }}>
              <span>이름</span><span>이메일</span><span>권한</span><span>가입일</span><span>관리</span>
            </div>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#AAA" }}>로딩 중...</div>
            ) : filtered.map(user => (
              <div key={user.id} className="row" style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 120px", padding: "14px 20px", borderBottom: "1px solid #F0EEE9", alignItems: "center" }}>
                <div style={{ fontSize: "15px", fontWeight: 700 }}>{user.name}</div>
                <div style={{ fontSize: "13px", color: "#555", fontWeight: 400 }}>{user.email}</div>
                <div>
                  <span style={{ background: user.role === "ADMIN" ? "#1A1A1A" : user.role === "DEALER" ? "#EEF2FF" : "#F0EEE9", color: user.role === "ADMIN" ? "white" : user.role === "DEALER" ? "#1847FF" : "#555", padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 800 }}>
                    {user.role === "ADMIN" ? "관리자" : user.role === "DEALER" ? "딜러" : "일반"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#AAA", fontWeight: 400 }}>{user.createdAt?.slice(0, 10)}</div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {user.role !== "DEALER" && (
                    <button onClick={() => changeRole(user.id, "DEALER")} title="딜러 승인" style={{ padding: "5px 10px", background: "#EEF2FF", border: "none", borderRadius: "7px", fontSize: "11px", fontWeight: 800, color: "#1847FF", display: "flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle size={11} /> 딜러
                    </button>
                  )}
                  {user.role !== "USER" && (
                    <button onClick={() => changeRole(user.id, "USER")} title="권한 취소" style={{ padding: "5px 10px", background: "#FFF0ED", border: "none", borderRadius: "7px", fontSize: "11px", fontWeight: 800, color: "#FF3B1E", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Ban size={11} /> 취소
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "16px", fontSize: "13px", color: "#AAA", fontWeight: 400 }}>
            총 {filtered.length}명의 회원
          </div>
        </div>
      </div>
    </>
  );
}
