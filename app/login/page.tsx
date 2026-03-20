"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login"|"register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { alert("이메일과 비밀번호를 입력해주세요"); return; }
    if (mode === "register" && !name) { alert("이름을 입력해주세요"); return; }
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login" ? { email, password } : { email, password, name, phone };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success || data.token) {
        router.push("/");
        router.refresh();
      } else {
        alert(data.error || "로그인/회원가입 실패");
      }
    } catch { alert("네트워크 오류"); }
    setLoading(false);
  };

  const S = { input: { width:"100%", padding:"14px 18px", border:"1.5px solid #E0DDD7", borderRadius:12, fontSize:15, fontFamily:"'NanumSquareRound',sans-serif", background:"white" } };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        input:focus{outline:none;border-color:#FF3B1E!important;}
      `}</style>
      <Navbar/>
      <div style={{ minHeight:"100vh", background:"#F0EEE9", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
        <div style={{ width:"100%", maxWidth:420 }}>
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:40, letterSpacing:3, marginBottom:6 }}>
              <span style={{ color:"#FF3B1E" }}>FIX</span><span style={{ color:"#1A1A1A" }}>CAR</span>
            </div>
            <p style={{ fontSize:14, color:"#AAA", fontWeight:400 }}>광주 No.1 중고차 정찰제 플랫폼</p>
          </div>

          <div style={{ background:"white", borderRadius:22, padding:"32px 28px", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
            {/* 탭 */}
            <div style={{ display:"flex", marginBottom:24, background:"#F8F7F4", borderRadius:12, padding:4 }}>
              {(["login","register"] as const).map(m => (
                <button key={m} onClick={()=>setMode(m)} style={{
                  flex:1, padding:"12px", borderRadius:10, border:"none",
                  background: mode===m?"white":"transparent", color: mode===m?"#1A1A1A":"#AAA",
                  fontSize:14, fontWeight: mode===m?800:600, cursor:"pointer",
                  fontFamily:"'NanumSquareRound',sans-serif",
                  boxShadow: mode===m?"0 2px 8px rgba(0,0,0,0.06)":"none",
                }}>{m==="login"?"로그인":"회원가입"}</button>
              ))}
            </div>

            {/* ★ 카카오 로그인 - 서버 API로 리다이렉트 */}
            <a href="/api/auth/kakao" style={{ textDecoration:"none" }}>
              <button style={{
                width:"100%", padding:"16px", background:"#FEE500", color:"#3C1E1E",
                border:"none", borderRadius:12, fontSize:15, fontWeight:800,
                cursor:"pointer", fontFamily:"'NanumSquareRound',sans-serif",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:16,
              }}>
                🗨️ 카카오로 {mode==="login"?"로그인":"시작하기"}
              </button>
            </a>

            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <div style={{ flex:1, height:1, background:"#E8E6E1" }}/>
              <span style={{ fontSize:12, color:"#CCC", fontWeight:400 }}>또는</span>
              <div style={{ flex:1, height:1, background:"#E8E6E1" }}/>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {mode==="register" && (
                <>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="이름" style={S.input} />
                  <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="연락처 (선택)" style={S.input} />
                </>
              )}
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="이메일" style={S.input} />
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="비밀번호"
                onKeyDown={e=>{if(e.key==="Enter")handleSubmit();}} style={S.input} />

              <button onClick={handleSubmit} disabled={loading} style={{
                width:"100%", padding:"16px", background:loading?"#CCC":"#FF3B1E", color:"white",
                border:"none", borderRadius:12, fontSize:15, fontWeight:800,
                cursor:loading?"wait":"pointer", fontFamily:"'NanumSquareRound',sans-serif", marginTop:4,
              }}>
                {loading ? "처리 중..." : mode==="login" ? "픽스카 로그인" : "픽스카 회원가입"}
              </button>
            </div>
          </div>

          <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:"#AAA" }}>
            <Link href="/" style={{ color:"#888", fontWeight:600 }}>← 홈으로 돌아가기</Link>
          </div>
        </div>
      </div>
    </>
  );
}
