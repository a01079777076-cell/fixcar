"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, ChevronLeft, Lock, Mail, User, Phone, CheckCircle, Car, Shield, Heart, Zap } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login"|"register">("login");
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);
  const [agree, setAgree] = useState(false);

  const features = [
    { icon:<Heart size={20} color="white"/>, title:"찜 목록 관리", desc:"마음에 드는 차를 저장하고 가격 변동 알림 받기" },
    { icon:<Zap size={20} color="white"/>, title:"맞춤 차 추천", desc:"내 조건에 맞는 차를 AI가 골라드려요" },
    { icon:<Lock size={20} color="white"/>, title:"FIX 가격 구매", desc:"흥정 없는 정찰가로 안심 구매" },
    { icon:<Shield size={20} color="white"/>, title:"구매 이력 관리", desc:"내 차 관리 캘린더와 정비 알림" },
  ];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound','Noto Sans KR',sans-serif; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound','Noto Sans KR',sans-serif; cursor:pointer; }
        input { font-family:'NanumSquareRound','Noto Sans KR',sans-serif; }

        .social-btn { transition:all 0.2s; }
        .social-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.15); }
        .form-input { width:100%; border:1.5px solid #E0DDD7; border-radius:12px; padding:14px 16px 14px 46px; font-size:15px; outline:none; transition:border-color 0.2s; background:#FAFAF8; }
        .form-input:focus { border-color:#FF3B1E; background:#fff; }
        .mode-tab { transition:all 0.2s; cursor:pointer; border:none; }
        .link-hover { transition:color 0.15s; cursor:pointer; }
        .link-hover:hover { color:#FF3B1E !important; }

        @media(max-width:900px) {
          .login-grid { grid-template-columns:1fr !important; }
          .left-panel { display:none !important; }
          .right-panel { border-radius:0 !important; min-height:100vh !important; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'NanumSquareRound',sans-serif" }}>

        {/* ── 왼쪽 패널 ── */}
        <div className="left-panel" style={{ width:"52%", flexShrink:0, background:"#1A1A1A", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"48px 56px", position:"relative", overflow:"hidden" }}>
          {/* 배경 이미지 */}
          <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
            <img src="https://source.unsplash.com/1200x900/?car+road+night+city" alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.25 }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.75) 100%)" }} />
          </div>

          {/* 내용 */}
          <div style={{ position:"relative", zIndex:1 }}>
            {/* 로고 */}
            <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"32px", letterSpacing:"3px", display:"block", marginBottom:"64px" }}>
              <span style={{ color:"#FF3B1E" }}>FIX</span><span style={{ color:"white" }}>CAR</span>
            </a>

            <h2 style={{ fontSize:"clamp(36px,4.5vw,56px)", fontWeight:800, color:"white", letterSpacing:"-2px", lineHeight:1.05, marginBottom:"18px" }}>
              나, 이 차로<br /><span style={{ color:"#FF3B1E" }}>픽</span>했어.
            </h2>
            <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.5)", lineHeight:1.8, marginBottom:"48px", fontWeight:400 }}>
              로그인하면 <strong style={{ color:"rgba(255,255,255,0.85)", fontWeight:800 }}>맞춤 추천, 찜 목록, 구매 이력</strong>까지<br />한번에 관리할 수 있어요.
            </p>

            {/* 기능 목록 */}
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              {features.map(f=>(
                <div key={f.title} style={{ display:"flex", alignItems:"center", gap:"16px", padding:"16px 20px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"14px" }}>
                  <div style={{ width:"40px", height:"40px", background:"rgba(255,59,30,0.2)", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize:"15px", fontWeight:800, color:"white", marginBottom:"2px" }}>{f.title}</div>
                    <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)", fontWeight:400 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 통계 */}
          <div style={{ position:"relative", zIndex:1, display:"flex", gap:"36px" }}>
            {[["2,418+","현재 매물"],["98%","구매 만족도"],["4.9★","앱 평점"]].map(([num,label])=>(
              <div key={label}>
                <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"30px", color:"#FF3B1E", letterSpacing:"1px" }}>{num}</div>
                <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.3)", marginTop:"2px", fontWeight:400 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 오른쪽 패널 ── */}
        <div className="right-panel" style={{ flex:1, background:"#F0EEE9", display:"flex", flexDirection:"column", justifyContent:"center", padding:"48px 56px", position:"relative" }}>

          {/* 뒤로가기 */}
          <a href="/" style={{ position:"absolute", top:"24px", left:"24px", display:"flex", alignItems:"center", gap:"6px", fontSize:"14px", fontWeight:700, color:"#888" }} className="link-hover">
            <ChevronLeft size={18} /> 홈으로
          </a>

          {/* 모바일 로고 */}
          <div style={{ display:"none", marginBottom:"32px" }}>
            <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", letterSpacing:"3px" }}>
              <span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span>
            </a>
          </div>

          <div style={{ maxWidth:"420px", margin:"0 auto", width:"100%" }}>

            {/* 모드 탭 */}
            <div style={{ background:"#E8E6E0", borderRadius:"14px", padding:"5px", display:"flex", marginBottom:"36px" }}>
              {[["login","로그인"],["register","회원가입"]].map(([m,l])=>(
                <button key={m} className="mode-tab" onClick={()=>setMode(m as "login"|"register")} style={{ flex:1, padding:"12px", borderRadius:"10px", fontSize:"15px", fontWeight:mode===m?800:600, background:mode===m?"#fff":"transparent", color:mode===m?"#1A1A1A":"#888", boxShadow:mode===m?"0 2px 8px rgba(0,0,0,0.08)":"none" }}>{l}</button>
              ))}
            </div>

            {/* 타이틀 */}
            <div style={{ marginBottom:"32px" }}>
              <div style={{ fontSize:"11px", fontWeight:800, letterSpacing:"3px", color:"#FF3B1E", marginBottom:"10px" }}>WELCOME TO FIXCAR</div>
              <h1 style={{ fontSize:"clamp(26px,3.5vw,36px)", fontWeight:800, letterSpacing:"-1px", lineHeight:1.15, marginBottom:"8px" }}>
                {mode==="login" ? "다시 만났어요 👋" : "픽스카 가입하기 🎉"}
              </h1>
              <p style={{ fontSize:"15px", color:"#888", fontWeight:400, lineHeight:1.6 }}>
                {mode==="login"
                  ? "소셜 계정으로 바로 로그인하거나\n이메일로 로그인할 수 있어요."
                  : "가입하면 맞춤 추천부터 구매 이력까지\n모든 기능을 사용할 수 있어요."}
              </p>
            </div>

            {/* 소셜 로그인 */}
            <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"24px" }}>
              {/* 카카오 */}
<button onClick={() => signIn("kakao", { callbackUrl: "/" })} className="social-btn" style={{ width:"100%", background:"#FEE500"
                <span style={{ fontSize:"20px" }}>💛</span>
                카카오로 {mode==="login"?"로그인":"가입"}하기
                <span style={{ position:"absolute", right:"16px", background:"rgba(0,0,0,0.1)", padding:"3px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>추천</span>
              </button>
              {/* 네이버 */}
              <button className="social-btn" style={{ width:"100%", background:"#03C75A", border:"none", borderRadius:"14px", padding:"16px", fontSize:"15px", fontWeight:800, color:"white", display:"flex", alignItems:"center", justifyContent:"center", gap:"12px" }}>
                <span style={{ width:"24px", height:"24px", background:"#03C75A", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:900, color:"white", border:"2px solid rgba(255,255,255,0.4)" }}>N</span>
                네이버로 {mode==="login"?"로그인":"가입"}하기
              </button>
              {/* 애플 */}
              <button className="social-btn" style={{ width:"100%", background:"#1A1A1A", border:"none", borderRadius:"14px", padding:"16px", fontSize:"15px", fontWeight:800, color:"white", display:"flex", alignItems:"center", justifyContent:"center", gap:"12px" }}>
                <span style={{ fontSize:"18px" }}>🍎</span>
                Apple로 {mode==="login"?"로그인":"가입"}하기
              </button>
            </div>

            {/* 구분선 */}
            <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"24px" }}>
              <div style={{ flex:1, height:"1px", background:"#E0DDD7" }} />
              <span style={{ fontSize:"13px", color:"#BBB", fontWeight:600, whiteSpace:"nowrap" }}>또는 이메일로 {mode==="login"?"로그인":"가입"}</span>
              <div style={{ flex:1, height:"1px", background:"#E0DDD7" }} />
            </div>

            {/* 이메일 폼 */}
            <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginBottom:"16px" }}>

              {/* 이름 (회원가입만) */}
              {mode==="register" && (
                <div style={{ position:"relative" }}>
                  <User size={18} color="#BBB" style={{ position:"absolute", left:"15px", top:"50%", transform:"translateY(-50%)" }} />
                  <input className="form-input" type="text" placeholder="이름" value={name} onChange={e=>setName(e.target.value)} />
                </div>
              )}

              {/* 이메일 */}
              <div style={{ position:"relative" }}>
                <Mail size={18} color="#BBB" style={{ position:"absolute", left:"15px", top:"50%", transform:"translateY(-50%)" }} />
                <input className="form-input" type="email" placeholder="이메일" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>

              {/* 비밀번호 */}
              <div style={{ position:"relative" }}>
                <Lock size={18} color="#BBB" style={{ position:"absolute", left:"15px", top:"50%", transform:"translateY(-50%)" }} />
                <input className="form-input" type={showPw?"text":"password"} placeholder={mode==="register"?"비밀번호 (8자 이상)":"비밀번호"} value={pw} onChange={e=>setPw(e.target.value)} style={{ paddingRight:"48px" }} />
                <button onClick={()=>setShowPw(!showPw)} style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#BBB", padding:"4px" }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* 전화번호 (회원가입만, 선택) */}
              {mode==="register" && (
                <div style={{ position:"relative" }}>
                  <Phone size={18} color="#BBB" style={{ position:"absolute", left:"15px", top:"50%", transform:"translateY(-50%)" }} />
                  <input className="form-input" type="tel" placeholder="휴대폰 번호 (선택)" value={phone} onChange={e=>setPhone(e.target.value)} />
                </div>
              )}
            </div>

            {/* 로그인 유지 / 비밀번호 찾기 */}
            {mode==="login" && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
                <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:"#888", cursor:"pointer", fontWeight:400 }}>
                  <input type="checkbox" checked={keepLogin} onChange={e=>setKeepLogin(e.target.checked)} style={{ width:"15px", height:"15px", accentColor:"#FF3B1E", cursor:"pointer" }} />
                  로그인 상태 유지
                </label>
                <span className="link-hover" style={{ fontSize:"13px", color:"#888", fontWeight:600 }}>비밀번호 찾기</span>
              </div>
            )}

            {/* 약관 동의 (회원가입만) */}
            {mode==="register" && (
              <label style={{ display:"flex", alignItems:"flex-start", gap:"10px", fontSize:"13px", color:"#888", cursor:"pointer", marginBottom:"20px", fontWeight:400, lineHeight:1.6 }}>
                <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} style={{ width:"16px", height:"16px", accentColor:"#FF3B1E", cursor:"pointer", marginTop:"1px", flexShrink:0 }} />
                <span><span className="link-hover" style={{ color:"#555", fontWeight:700, textDecoration:"underline" }}>이용약관</span> 및 <span className="link-hover" style={{ color:"#555", fontWeight:700, textDecoration:"underline" }}>개인정보처리방침</span>에 동의합니다 (필수)</span>
              </label>
            )}

            {/* 메인 버튼 */}
            <button
              onClick={()=>{ if(mode==="login"&&email&&pw) { window.location.href="/"; } else if(mode==="register"&&name&&email&&pw&&agree) { window.location.href="/"; } }}
              style={{ width:"100%", background: (mode==="login"&&email&&pw)||(mode==="register"&&name&&email&&pw&&agree) ? "#FF3B1E":"#E0DDD7", color: (mode==="login"&&email&&pw)||(mode==="register"&&name&&email&&pw&&agree) ? "white":"#AAA", border:"none", borderRadius:"14px", padding:"17px", fontSize:"16px", fontWeight:800, cursor:(mode==="login"&&email&&pw)||(mode==="register"&&name&&email&&pw&&agree)?"pointer":"default", transition:"all 0.2s", marginBottom:"20px" }}
            >
              {mode==="login" ? "로그인" : "픽스카 시작하기"} →
            </button>

            {/* 전환 링크 */}
            <div style={{ textAlign:"center", fontSize:"14px", color:"#888", fontWeight:400 }}>
              {mode==="login"
                ? <span>아직 계정이 없으신가요? <span className="link-hover" style={{ color:"#FF3B1E", fontWeight:800, cursor:"pointer" }} onClick={()=>setMode("register")}>3초 회원가입</span></span>
                : <span>이미 계정이 있으신가요? <span className="link-hover" style={{ color:"#FF3B1E", fontWeight:800, cursor:"pointer" }} onClick={()=>setMode("login")}>로그인</span></span>
              }
            </div>

            {/* 약관 노트 */}
            <div style={{ marginTop:"24px", padding:"16px", background:"#E8E6E0", borderRadius:"12px", fontSize:"12px", color:"#AAA", textAlign:"center", lineHeight:1.7, fontWeight:400 }}>
              로그인 시 픽스카 <span style={{ color:"#888", fontWeight:700 }}>이용약관</span>과 <span style={{ color:"#888", fontWeight:700 }}>개인정보처리방침</span>에 동의하게 됩니다.
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
