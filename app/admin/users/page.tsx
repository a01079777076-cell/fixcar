"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

interface User { id:string; name?:string; email?:string; phone?:string; role?:string; createdAt:string; }

function formatPhone(phone:string|null|undefined): string {
  if (!phone) return "-";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`;
  return phone;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then(r=>r.json())
      .then(data=>{ setUsers(Array.isArray(data)?data:data.users||[]); setLoading(false); })
      .catch(()=>{ setUsers([]); setLoading(false); });
  }, []);

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.name||"").toLowerCase().includes(q) || (u.email||"").toLowerCase().includes(q) || (u.phone||"").includes(q);
  });

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
      `}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"#1A1A1A",padding:"36px 24px 28px"}}>
          <div style={{maxWidth:900,margin:"0 auto"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:4,color:"#1847FF",marginBottom:6}}>USER MANAGEMENT</div>
            <h1 style={{fontSize:28,fontWeight:800,color:"white"}}>회원 관리</h1>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",fontWeight:400}}>전체 {users.length}명</p>
          </div>
        </div>
        <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px 100px"}}>
          <div style={{marginBottom:16}}>
            <input type="text" placeholder="이름, 이메일, 전화번호 검색" value={search} onChange={e=>setSearch(e.target.value)}
              style={{width:"100%",padding:"14px 18px",border:"2px solid #E0DDD7",borderRadius:14,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif",background:"white"}}/>
          </div>
          {loading ? <div style={{textAlign:"center",padding:60,color:"#AAA"}}>로딩 중...</div> : (
            <div style={{background:"white",borderRadius:18,overflow:"hidden"}}>
              {/* 헤더 */}
              <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 1.5fr 1fr 1fr",padding:"14px 20px",background:"#F8F7F4",fontSize:12,fontWeight:800,color:"#888"}}>
                <span>이름</span><span>이메일</span><span>연락처</span><span>등급</span><span>가입일</span>
              </div>
              {filtered.map(u=>(
                <div key={u.id} style={{display:"grid",gridTemplateColumns:"2fr 2fr 1.5fr 1fr 1fr",padding:"14px 20px",borderBottom:"1px solid #F0EEE9",fontSize:13,alignItems:"center"}}>
                  <span style={{fontWeight:700}}>{u.name||"-"}</span>
                  <span style={{color:"#888",fontSize:12}}>{u.email||"-"}</span>
                  <span style={{fontFamily:"'Bebas Neue',monospace",color:"#1847FF",fontSize:13,letterSpacing:0.5}}>
                    {formatPhone(u.phone)}
                  </span>
                  <span><span style={{padding:"3px 10px",borderRadius:100,fontSize:11,fontWeight:700,
                    background:u.role==="ADMIN"?"#FFF0ED":u.role==="DEALER"?"#EEF2FF":"#F8F7F4",
                    color:u.role==="ADMIN"?"#FF3B1E":u.role==="DEALER"?"#1847FF":"#888",
                  }}>{u.role||"USER"}</span></span>
                  <span style={{fontSize:11,color:"#CCC"}}>{new Date(u.createdAt).toLocaleDateString("ko-KR")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
