"use client";
import { useState, useEffect } from "react";
import { Shield, User, Car, ChevronDown, X } from "lucide-react";

interface UserInfo { id: number; name: string; role: string; nickname?: string; nicknameDealer?: string; nicknameAdmin?: string; }

export default function AdminRolePanel() {
  const [user, setUser]         = useState<UserInfo | null>(null);
  const [open, setOpen]         = useState(false);
  const [editing, setEditing]   = useState<"user"|"dealer"|"admin"|null>(null);
  const [nickVal, setNickVal]   = useState("");
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState("");

  useEffect(() => {
    fetch("/api/auth/session")
      .then(r => r.json())
      .then(d => { if (d?.user?.role === "ADMIN") setUser(d.user); })
      .catch(() => {});
  }, []);

  if (!user) return null;

  const openEdit = (type: "user"|"dealer"|"admin") => {
    setEditing(type);
    setNickVal(type === "user" ? user.nickname || "" : type === "dealer" ? user.nicknameDealer || "" : user.nicknameAdmin || "");
    setMsg("");
  };

  const saveNick = async () => {
    setSaving(true);
    const field = editing === "user" ? "nickname" : editing === "dealer" ? "nicknameDealer" : "nicknameAdmin";
    const res = await fetch("/api/user/nickname", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value: nickVal }),
    });
    const d = await res.json();
    if (d.success) {
      setUser(prev => prev ? { ...prev, [field]: nickVal } : prev);
      setMsg("저장됨 ✓");
      setTimeout(() => { setEditing(null); setMsg(""); }, 1000);
    } else { setMsg(d.error || "저장 실패"); }
    setSaving(false);
  };

  const roles = [
    { key: "user",   label: "유저",   href: "/",       icon: <User size={14}/>,   nick: user.nickname        || user.name, color: "#888"    },
    { key: "dealer", label: "딜러",   href: "/dealer", icon: <Car size={14}/>,    nick: user.nicknameDealer  || user.name, color: "#0066FF" },
    { key: "admin",  label: "어드민", href: "/admin",  icon: <Shield size={14}/>, nick: user.nicknameAdmin   || user.name, color: "#FF3B1E" },
  ];

  return (
    <>
      {/* 플로팅 버튼 */}
      <div style={{ position:"fixed", bottom:160, right:20, zIndex:9000 }}>
        <button
          onClick={() => setOpen(!open)}
          style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 16px", background:"#1A1A1A", color:"white", border:"none", borderRadius:100, fontSize:13, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 20px rgba(0,0,0,0.3)", fontFamily:"'NanumSquareRound',sans-serif" }}
        >
          <Shield size={14}/> 어드민 <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none", transition:"transform 0.2s" }}/>
        </button>

        {open && (
          <div style={{ position:"absolute", bottom:50, right:0, background:"white", borderRadius:20, padding:"16px", boxShadow:"0 8px 40px rgba(0,0,0,0.15)", width:240, border:"1px solid #E8E6E1" }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#AAA", letterSpacing:1, marginBottom:10 }}>역할 전환</div>

            {roles.map(r => (
              <div key={r.key} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                  <a href={r.href} style={{ display:"flex", alignItems:"center", gap:6, flex:1, textDecoration:"none" }}>
                    <div style={{ width:32, height:32, borderRadius:10, background:r.color+"18", display:"flex", alignItems:"center", justifyContent:"center", color:r.color }}>
                      {r.icon}
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:800, color:"#1A1A1A" }}>{r.label}</div>
                      <div style={{ fontSize:10, color:"#AAA" }}>{r.nick}</div>
                    </div>
                  </a>
                  <button
                    onClick={() => openEdit(r.key as "user"|"dealer"|"admin")}
                    style={{ fontSize:10, fontWeight:700, color:r.color, background:r.color+"18", border:"none", padding:"3px 8px", borderRadius:6, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"'NanumSquareRound',sans-serif" }}
                  >
                    닉네임 변경
                  </button>
                </div>

                {editing === r.key && (
                  <div style={{ background:"#F8F7F4", borderRadius:10, padding:"10px 12px" }}>
                    <input
                      value={nickVal}
                      onChange={e => setNickVal(e.target.value)}
                      placeholder={`${r.label} 닉네임`}
                      maxLength={20}
                      style={{ width:"100%", padding:"8px 10px", border:"1.5px solid #E0DDD7", borderRadius:8, fontSize:13, fontFamily:"'NanumSquareRound',sans-serif", marginBottom:6 }}
                      autoFocus
                    />
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={saveNick} disabled={saving} style={{ flex:1, padding:"7px", background:r.color, color:"white", border:"none", borderRadius:8, fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:"'NanumSquareRound',sans-serif" }}>
                        {saving ? "저장 중" : "저장"}
                      </button>
                      <button onClick={() => setEditing(null)} style={{ padding:"7px 10px", background:"#E8E6E1", border:"none", borderRadius:8, cursor:"pointer" }}><X size={12}/></button>
                    </div>
                    {msg && <div style={{ fontSize:11, color:msg.includes("✓")?"#2D8A52":"#E24B4A", marginTop:4 }}>{msg}</div>}
                  </div>
                )}
              </div>
            ))}

            <div style={{ borderTop:"1px solid #E8E6E1", paddingTop:10, marginTop:4 }}>
              <a href="/admin" style={{ display:"block", textAlign:"center", fontSize:13, fontWeight:800, color:"#FF3B1E", textDecoration:"none" }}>관리자 패널 열기 →</a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
