"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Shield, CheckCircle, ArrowLeft, User, Mail, Phone } from "lucide-react";

export default function LoginPage() {
  const KAKAO_CLIENT_ID = "6cf753da0f172df40eda14bd143c8bec";
  const REDIRECT_URI = "https://www.fixcar.kr/api/auth/kakao/callback";

  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPw, setShowPw] = useState(false);
  const [showIdPw, setShowIdPw] = useState(false);
  const [loginForm, setLoginForm] = useState({ id: "", pw: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", phone: "", pw: "", pwConfirm: "" });
  const [agreed, setAgreed] = useState(false);

  const handleKakaoLogin = () => {
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
    window.location.href = url;
  };

  const handleNaverLogin = () => {
    alert("네이버 로그인은 준비 중이에요!");
  };

  const handleIdLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert("아이디/비밀번호 로그인은 준비 중이에요. 카카오 로그인을 이용해주세요!");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.pw !== registerForm.pwConfirm) { alert("비밀번호가 일치하지 않아요"); return; }
    if (!agreed) { alert("이용약관에 동의해주세요"); return; }
    alert("카카오 소셜 로그인으로 가입하시면 더 편리해요! 카카오 로그인 버튼을 이용해주세요.");
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input { font-family:'NanumSquareRound',sans-serif; }
        input:focus { outline:none; border-color:#FF3B1E !important; background:white !important; }
        .kakao-btn { background:#FEE500; color:#391B1B; border:none; padding:15px 24px; border-radius:12px; font-size:15px; font-weight:800; cursor:pointer; width:100%; display:flex; align-items:center; justify-content:center; gap:10px; transition:all 0.2s; }
        .kakao-btn:hover { background:#F5D800; transform:translateY(-1px); box-shadow:0 6px 20px rgba(254,229,0,0.4); }
        .naver-btn { background:#03C75A; color:white; border:none; padding:15px 24px; border-radius:12px; font-size:15px; font-weight:800; cursor:pointer; width:100%; display:flex; align-items:center; justify-content:center; gap:10px; transition:all 0.2s; }
        .naver-btn:hover { background:#02B350; transform:translateY(-1px); box-shadow:0 6px 20px rgba(3,199,90,0.3); }
        .submit-btn { background:#FF3B1E; color:white; border:none; padding:15px; border-radius:12px; font-size:15px; font-weight:800; cursor:pointer; width:100%; transition:all 0.2s; }
        .submit-btn:hover { background:#D42E14; }
        .submit-btn:disabled { background:#E0DDD7; color:#AAA; cursor:default; }
        .tab-btn { flex:1; padding:13px; border:none; background:transparent; font-size:15px; font-weight:700; cursor:pointer; font-family:'NanumSquareRound',sans-serif; border-bottom:3px solid transparent; transition:all 0.15s; }
        .tab-btn.active { font-weight:800; color:#FF3B1E; border-bottom-color:#FF3B1E; }
        .feature-item { display:flex; align-items:flex-start; gap:12px; padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.08); }
        @media(max-width:900px) { .login-grid { grid-template-columns:1fr !important; } .left-panel { display:none !important; } }
      `}</style>

      <div style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr" }} className="login-grid">

        {/* 왼쪽 */}
        <div className="left-panel" style={{ background:"linear-gradient(135deg, #FF5A3C 0%, #E8290F 60%, #C41E08 100%)", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"60px 52px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:"-60px", bottom:"-60px", fontFamily:"'Bebas Neue',serif", fontSize:"200px", color:"rgba(255,255,255,0.08)", lineHeight:1, pointerEvents:"none" }}>FIXCAR</div>
          <div style={{ maxWidth:"440px", width:"100%", position:"relative", zIndex:1 }}>
            <a href="/" style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"48px" }}>
              <img src="/favicon.svg" alt="픽스카" width={40} height={40} style={{ borderRadius:"10px" }} />
              <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"36px", letterSpacing:"3px", color:"white" }}>FIXCAR</div>
            </a>
            <h1 style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:800, color:"white", letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:"16px" }}>
              나, 이 차로<br />픽했어
            </h1>
            <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.75)", lineHeight:1.8, marginBottom:"48px", fontWeight:400 }}>
              광주 중고차 FIX 정찰제 플랫폼.<br />흥정 없이, 믿고 사는 중고차.
            </p>
            {[
              { icon:<CheckCircle size={18} color="#FF7A63"/>, title:"FIX 정찰가", desc:"표시 가격 = 최종 가격. 추가 비용 없음" },
              { icon:<Shield size={18} color="#FF7A63"/>, title:"100항목 검수", desc:"전문 정비사가 직접 점검한 차만 등록" },
              { icon:<Lock size={18} color="#FF7A63"/>, title:"3일 환불 보장", desc:"구매 후 3일 이내 이유 불문 100% 환불" },
            ].map(item => (
              <div key={item.title} className="feature-item">
                <div style={{ flexShrink:0, marginTop:"2px" }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize:"15px", fontWeight:800, color:"white", marginBottom:"3px" }}>{item.title}</div>
                  <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", fontWeight:400 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 */}
        <div style={{ background:"#F0EEE9", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"40px 32px", overflowY:"auto" }}>
          <div style={{ maxWidth:"400px", width:"100%" }}>

            {/* 뒤로가기 */}
            <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:"8px", marginBottom:"24px", padding:"11px 20px", background:"white", border:"2px solid #E0DDD7", borderRadius:"100px", fontSize:"15px", fontWeight:800, color:"#1A1A1A" }}>
              <ArrowLeft size={16} /> 홈으로 돌아가기
            </a>

            {/* 탭 */}
            <div style={{ background:"white", borderRadius:"16px", marginBottom:"20px", display:"flex", borderBottom:"2px solid #F0EEE9", overflow:"hidden" }}>
              <button className={`tab-btn${tab==="login"?" active":""}`} onClick={() => setTab("login")} style={{ color: tab==="login" ? "#FF3B1E" : "#888" }}>로그인</button>
              <button className={`tab-btn${tab==="register"?" active":""}`} onClick={() => setTab("register")} style={{ color: tab==="register" ? "#FF3B1E" : "#888" }}>회원가입</button>
            </div>

            {/* ── 로그인 탭 ── */}
            {tab === "login" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>

                {/* 카카오 */}
                <button className="kakao-btn" onClick={handleKakaoLogin}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#391B1B"><path d="M12 3C6.477 3 2 6.477 2 10.909c0 2.868 1.671 5.388 4.199 6.894l-1.07 3.966a.5.5 0 0 0 .731.546l4.469-2.97A11.6 11.6 0 0 0 12 19.818c5.523 0 10-3.477 10-7.909S17.523 3 12 3z"/></svg>
                  카카오톡으로 로그인
                </button>

                {/* 네이버 */}
                <button className="naver-btn" onClick={handleNaverLogin}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>
                  네이버로 로그인
                </button>

                {/* 구분선 */}
                <div style={{ display:"flex", alignItems:"center", gap:"12px", margin:"4px 0" }}>
                  <div style={{ flex:1, height:"1px", background:"#E0DDD7" }} />
                  <span style={{ fontSize:"13px", color:"#AAA", fontWeight:400 }}>또는 아이디로 로그인</span>
                  <div style={{ flex:1, height:"1px", background:"#E0DDD7" }} />
                </div>

                {/* 아이디/비밀번호 */}
                <form onSubmit={handleIdLogin} style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  <div style={{ position:"relative" }}>
                    <User size={16} color="#AAA" style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)" }} />
                    <input type="text" placeholder="아이디 (이메일)" value={loginForm.id} onChange={e => setLoginForm(p => ({ ...p, id: e.target.value }))}
                      style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"13px 14px 13px 40px", fontSize:"15px", background:"#FAFAF8" }} />
                  </div>
                  <div style={{ position:"relative" }}>
                    <Lock size={16} color="#AAA" style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)" }} />
                    <input type={showPw ? "text" : "password"} placeholder="비밀번호" value={loginForm.pw} onChange={e => setLoginForm(p => ({ ...p, pw: e.target.value }))}
                      style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"13px 44px 13px 40px", fontSize:"15px", background:"#FAFAF8" }} />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer" }}>
                      {showPw ? <EyeOff size={16} color="#AAA" /> : <Eye size={16} color="#AAA" />}
                    </button>
                  </div>
                  <button type="submit" className="submit-btn">로그인</button>
                </form>

                <div style={{ textAlign:"center" }}>
                  <a href="/contact" style={{ fontSize:"13px", color:"#AAA", fontWeight:400 }}>아이디·비밀번호 찾기</a>
                </div>

                {/* 안내 */}
                <div style={{ background:"#FFF8EC", border:"1px solid #FFD89A", borderRadius:"12px", padding:"13px 16px" }}>
                  <div style={{ fontSize:"13px", color:"#7A5500", lineHeight:1.65, fontWeight:400 }}>
                    <strong style={{ fontWeight:800 }}>처음 오셨나요?</strong> 카카오/네이버 로그인 후 정보 입력하면 자동으로 회원가입이 돼요!
                  </div>
                </div>

                <p style={{ fontSize:"12px", color:"#AAA", textAlign:"center", lineHeight:1.8, fontWeight:400 }}>
                  로그인 시 <a href="/terms" style={{ color:"#555", fontWeight:700, textDecoration:"underline" }}>이용약관</a> 및 <a href="/privacy" style={{ color:"#555", fontWeight:700, textDecoration:"underline" }}>개인정보처리방침</a>에 동의하게 돼요.
                </p>
              </div>
            )}

            {/* ── 회원가입 탭 ── */}
            {tab === "register" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                <div style={{ background:"#EEF2FF", border:"1px solid #B8C8FF", borderRadius:"12px", padding:"13px 16px", marginBottom:"4px" }}>
                  <div style={{ fontSize:"13px", color:"#1847FF", lineHeight:1.65, fontWeight:400 }}>
                    💡 <strong style={{ fontWeight:800 }}>카카오/네이버 로그인 추천!</strong><br />소셜 로그인 시 별도 가입 없이 자동으로 가입돼요.
                  </div>
                </div>

                {/* 소셜 가입 */}
                <button className="kakao-btn" onClick={handleKakaoLogin}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#391B1B"><path d="M12 3C6.477 3 2 6.477 2 10.909c0 2.868 1.671 5.388 4.199 6.894l-1.07 3.966a.5.5 0 0 0 .731.546l4.469-2.97A11.6 11.6 0 0 0 12 19.818c5.523 0 10-3.477 10-7.909S17.523 3 12 3z"/></svg>
                  카카오로 회원가입
                </button>
                <button className="naver-btn" onClick={handleNaverLogin}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>
                  네이버로 회원가입
                </button>

                {/* 구분선 */}
                <div style={{ display:"flex", alignItems:"center", gap:"12px", margin:"4px 0" }}>
                  <div style={{ flex:1, height:"1px", background:"#E0DDD7" }} />
                  <span style={{ fontSize:"13px", color:"#AAA", fontWeight:400 }}>또는 직접 가입</span>
                  <div style={{ flex:1, height:"1px", background:"#E0DDD7" }} />
                </div>

                {/* 직접 가입 폼 */}
                <form onSubmit={handleRegister} style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {[
                    { icon:<User size={16} color="#AAA"/>, key:"name", placeholder:"이름", type:"text" },
                    { icon:<Mail size={16} color="#AAA"/>, key:"email", placeholder:"이메일 (아이디)", type:"email" },
                    { icon:<Phone size={16} color="#AAA"/>, key:"phone", placeholder:"휴대폰 번호", type:"tel" },
                  ].map(field => (
                    <div key={field.key} style={{ position:"relative" }}>
                      <div style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)" }}>{field.icon}</div>
                      <input type={field.type} placeholder={field.placeholder}
                        value={registerForm[field.key as keyof typeof registerForm]}
                        onChange={e => setRegisterForm(p => ({ ...p, [field.key]: e.target.value }))}
                        style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"13px 14px 13px 40px", fontSize:"15px", background:"#FAFAF8" }} />
                    </div>
                  ))}
                  <div style={{ position:"relative" }}>
                    <Lock size={16} color="#AAA" style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)" }} />
                    <input type={showIdPw ? "text" : "password"} placeholder="비밀번호" value={registerForm.pw} onChange={e => setRegisterForm(p => ({ ...p, pw: e.target.value }))}
                      style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"13px 44px 13px 40px", fontSize:"15px", background:"#FAFAF8" }} />
                    <button type="button" onClick={() => setShowIdPw(!showIdPw)} style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer" }}>
                      {showIdPw ? <EyeOff size={16} color="#AAA" /> : <Eye size={16} color="#AAA" />}
                    </button>
                  </div>
                  <input type="password" placeholder="비밀번호 확인" value={registerForm.pwConfirm} onChange={e => setRegisterForm(p => ({ ...p, pwConfirm: e.target.value }))}
                    style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"13px 14px", fontSize:"15px", background:"#FAFAF8" }} />

                  {/* 약관 동의 */}
                  <label style={{ display:"flex", alignItems:"flex-start", gap:"10px", cursor:"pointer", padding:"12px", background:"white", borderRadius:"10px" }}>
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop:"2px", accentColor:"#FF3B1E", width:"16px", height:"16px", flexShrink:0 }} />
                    <span style={{ fontSize:"13px", color:"#555", lineHeight:1.7, fontWeight:400 }}>
                      <a href="/terms" style={{ color:"#1847FF", fontWeight:800 }}>이용약관</a> 및 <a href="/privacy" style={{ color:"#1847FF", fontWeight:800 }}>개인정보처리방침</a>에 동의합니다 (필수)
                    </span>
                  </label>

                  <button type="submit" className="submit-btn" disabled={!registerForm.name || !registerForm.email || !registerForm.pw || !agreed}>
                    회원가입
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
