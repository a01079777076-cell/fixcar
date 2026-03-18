"use client";

import { useEffect } from "react";
import { Lock, Shield, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || "6cf753da0f172df40eda14bd143c8bec";
  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || "https://www.fixcar.kr/api/auth/kakao/callback";

  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
    window.location.href = kakaoAuthUrl;
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
        .kakao-btn { background:#FEE500; color:#391B1B; border:none; padding:16px 24px; border-radius:14px; font-size:16px; font-weight:800; cursor:pointer; width:100%; display:flex; align-items:center; justify-content:center; gap:10px; transition:all 0.2s; }
        .kakao-btn:hover { background:#F5D800; transform:translateY(-2px); box-shadow:0 8px 24px rgba(254,229,0,0.4); }
        .feature-item { display:flex; align-items:flex-start; gap:12px; padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.08); }
        @media(max-width:900px) { .login-grid { grid-template-columns:1fr !important; } .left-panel { display:none !important; } }
      `}</style>

      <div style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr" }} className="login-grid">
        {/* 왼쪽 — 픽스카 메인 컬러 */}
        <div className="left-panel" style={{ background:"linear-gradient(135deg, #FF3B1E 0%, #D42E14 100%)", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"60px 52px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:"-60px", bottom:"-60px", fontFamily:"'Bebas Neue',serif", fontSize:"200px", color:"rgba(255,255,255,0.05)", lineHeight:1, pointerEvents:"none" }}>FIXCAR</div>

          <div style={{ maxWidth:"440px", width:"100%", position:"relative", zIndex:1 }}>
            <a href="/" style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"48px" }}>
              <img src="/favicon.svg" alt="픽스카" width={36} height={36} style={{ borderRadius:"10px" }} />
              <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"32px", letterSpacing:"3px", color:"white" }}>FIXCAR</div>
            </a>

            <h1 style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:800, color:"white", letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:"16px" }}>
              나, 이 차로<br />픽했어
            </h1>
            <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.75)", lineHeight:1.8, marginBottom:"48px", fontWeight:400 }}>
              광주 중고차 FIX 정찰제 플랫폼.<br />
              흥정 없이, 믿고 사는 중고차.
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

        {/* 오른쪽 — 로그인 폼 */}
        <div style={{ background:"#F0EEE9", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"40px 32px" }}>
          <div style={{ maxWidth:"400px", width:"100%" }}>

            {/* 뒤로가기 버튼 */}
            <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:"8px", marginBottom:"28px", padding:"12px 20px", background:"white", border:"2px solid #E0DDD7", borderRadius:"100px", fontSize:"15px", fontWeight:800, color:"#1A1A1A", textDecoration:"none", transition:"all 0.2s" }}>
              ← 홈으로 돌아가기
            </a>

            {/* 모바일용 로고 */}
            <a href="/" style={{ display:"none", alignItems:"center", gap:"8px", marginBottom:"32px" }}>
              <img src="/favicon.svg" alt="픽스카" width={28} height={28} style={{ borderRadius:"7px" }} />
              <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"24px", letterSpacing:"3px" }}><span style={{ color:"#FF3B1E" }}>FIX</span>CAR</div>
            </a>

            <div style={{ marginBottom:"32px" }}>
              <h2 style={{ fontSize:"26px", fontWeight:800, letterSpacing:"-1px", marginBottom:"6px" }}>로그인 / 회원가입</h2>
              <p style={{ fontSize:"14px", color:"#888", fontWeight:400 }}>카카오톡 계정으로 3초 만에 시작하세요</p>
            </div>

            {/* 카카오 로그인 버튼 */}
            <div style={{ marginBottom:"16px" }}>
              <button className="kakao-btn" onClick={handleKakaoLogin}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#391B1B">
                  <path d="M12 3C6.477 3 2 6.477 2 10.909c0 2.868 1.671 5.388 4.199 6.894l-1.07 3.966a.5.5 0 0 0 .731.546l4.469-2.97A11.6 11.6 0 0 0 12 19.818c5.523 0 10-3.477 10-7.909S17.523 3 12 3z"/>
                </svg>
                카카오톡으로 로그인
              </button>
            </div>

            {/* 안내 문구 */}
            <div style={{ background:"#FFF8EC", border:"1px solid #FFD89A", borderRadius:"12px", padding:"14px 16px", marginBottom:"28px" }}>
              <div style={{ fontSize:"13px", color:"#7A5500", lineHeight:1.65, fontWeight:400 }}>
                <strong style={{ fontWeight:800 }}>처음 오셨나요?</strong><br />
                카카오 로그인 후 이름·이메일·연락처 입력하면 자동으로 회원가입이 돼요. 별도 가입 절차가 없어요!
              </div>
            </div>

            {/* 구분선 */}
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
              <div style={{ flex:1, height:"1px", background:"#E0DDD7" }} />
              <span style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>이미 가입하셨나요?</span>
              <div style={{ flex:1, height:"1px", background:"#E0DDD7" }} />
            </div>

            <div style={{ background:"white", borderRadius:"16px", padding:"18px 20px", marginBottom:"24px" }}>
              <div style={{ fontSize:"13px", color:"#555", lineHeight:1.8, fontWeight:400 }}>
                카카오 계정이 없으신 경우 카카오 회원가입 후 이용 가능해요.
                <br />
                <a href="https://accounts.kakao.com/weblogin/create_account" target="_blank" rel="noopener noreferrer"
                  style={{ color:"#1847FF", fontWeight:700 }}>카카오 계정 만들기 →</a>
              </div>
            </div>

            {/* 약관 */}
            <p style={{ fontSize:"12px", color:"#AAA", textAlign:"center", lineHeight:1.8, fontWeight:400 }}>
              로그인 시 픽스카의{" "}
              <a href="/terms" style={{ color:"#555", fontWeight:700, textDecoration:"underline" }}>이용약관</a>
              {" "}및{" "}
              <a href="/privacy" style={{ color:"#555", fontWeight:700, textDecoration:"underline" }}>개인정보처리방침</a>
              에 동의하게 돼요.
            </p>

            {/* 고객센터 링크 */}
            <div style={{ marginTop:"20px", textAlign:"center" }}>
              <a href="/contact" style={{ fontSize:"13px", color:"#AAA", fontWeight:400 }}>
                로그인에 문제가 있나요? <span style={{ color:"#1847FF", fontWeight:700 }}>고객센터 문의</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
