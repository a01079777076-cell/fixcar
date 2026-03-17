"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, CheckCircle, ArrowRight } from "lucide-react";

export default function AdditionalInfoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // 카카오에서 가져온 닉네임 미리 채우기
    const fetchSession = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.user?.name) setName(data.user.name);
    };
    fetchSession();
  }, []);

  const handleSubmit = async () => {
    if (!name || !email || !phone) return;
    setLoading(true);

    try {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const userId = sessionData.user?.id;

      if (!userId) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      if (res.ok) {
        setDone(true);
        setTimeout(() => { window.location.href = "/"; }, 1500);
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input { font-family:'NanumSquareRound',sans-serif; }
        .form-input { width:100%; border:1.5px solid #E0DDD7; border-radius:12px; padding:14px 16px 14px 46px; font-size:15px; outline:none; transition:border-color 0.2s; background:#FAFAF8; }
        .form-input:focus { border-color:#FF3B1E; background:#fff; }
        @keyframes scaleIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
        <div style={{ width:"100%", maxWidth:"440px" }}>

          {done ? (
            <div style={{ textAlign:"center", animation:"fadeUp 0.5s ease" }}>
              <div style={{ width:"80px", height:"80px", background:"#EAF6EF", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", animation:"scaleIn 0.5s ease" }}>
                <CheckCircle size={40} color="#2D8A52" />
              </div>
              <div style={{ fontSize:"24px", fontWeight:800, marginBottom:"8px" }}>완료됐어요! 🎉</div>
              <div style={{ fontSize:"15px", color:"#888", fontWeight:400 }}>픽스카 홈으로 이동할게요...</div>
            </div>
          ) : (
            <>
              {/* 로고 */}
              <div style={{ textAlign:"center", marginBottom:"32px" }}>
                <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"32px", letterSpacing:"3px" }}>
                  <span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span>
                </a>
              </div>

              <div style={{ background:"white", borderRadius:"24px", padding:"36px 32px" }}>
                {/* 헤더 */}
                <div style={{ marginBottom:"28px" }}>
                  <div style={{ fontSize:"11px", fontWeight:800, letterSpacing:"3px", color:"#FF3B1E", marginBottom:"10px" }}>LAST STEP</div>
                  <h1 style={{ fontSize:"26px", fontWeight:800, letterSpacing:"-0.5px", marginBottom:"8px" }}>
                    거의 다 됐어요! 👋
                  </h1>
                  <p style={{ fontSize:"15px", color:"#888", lineHeight:1.7, fontWeight:400 }}>
                    카카오 로그인 완료됐어요.<br />
                    연락처 정보만 입력하면 픽스카를 바로 이용할 수 있어요.
                  </p>
                </div>

                {/* 카카오 연동 완료 표시 */}
                <div style={{ background:"#FEF9E7", border:"1px solid #FFD89A", borderRadius:"12px", padding:"12px 16px", display:"flex", alignItems:"center", gap:"10px", marginBottom:"24px" }}>
                  <span style={{ fontSize:"20px" }}>💛</span>
                  <div>
                    <div style={{ fontSize:"13px", fontWeight:800, color:"#B7791F" }}>카카오 로그인 완료</div>
                    <div style={{ fontSize:"12px", color:"#B7791F", opacity:0.8, fontWeight:400 }}>닉네임을 가져왔어요. 아래 정보만 추가해주세요.</div>
                  </div>
                </div>

                {/* 폼 */}
                <div style={{ display:"flex", flexDirection:"column", gap:"14px", marginBottom:"22px" }}>
                  {/* 이름 */}
                  <div>
                    <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>
                      이름 <span style={{ color:"#FF3B1E" }}>*</span>
                    </label>
                    <div style={{ position:"relative" }}>
                      <User size={18} color="#BBB" style={{ position:"absolute", left:"15px", top:"50%", transform:"translateY(-50%)" }} />
                      <input
                        className="form-input"
                        type="text"
                        placeholder="홍길동"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* 이메일 */}
                  <div>
                    <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>
                      이메일 <span style={{ color:"#FF3B1E" }}>*</span>
                    </label>
                    <div style={{ position:"relative" }}>
                      <Mail size={18} color="#BBB" style={{ position:"absolute", left:"15px", top:"50%", transform:"translateY(-50%)" }} />
                      <input
                        className="form-input"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                    <div style={{ fontSize:"12px", color:"#AAA", marginTop:"5px", fontWeight:400 }}>
                      계약서·영수증 발송에 사용돼요
                    </div>
                  </div>

                  {/* 전화번호 */}
                  <div>
                    <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>
                      휴대폰 번호 <span style={{ color:"#FF3B1E" }}>*</span>
                    </label>
                    <div style={{ position:"relative" }}>
                      <Phone size={18} color="#BBB" style={{ position:"absolute", left:"15px", top:"50%", transform:"translateY(-50%)" }} />
                      <input
                        className="form-input"
                        type="tel"
                        placeholder="010-0000-0000"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                      />
                    </div>
                    <div style={{ fontSize:"12px", color:"#AAA", marginTop:"5px", fontWeight:400 }}>
                      딜러 상담 및 구매 확인에 사용돼요
                    </div>
                  </div>
                </div>

                {/* 제출 버튼 */}
                <button
                  onClick={handleSubmit}
                  disabled={!name || !email || !phone || loading}
                  style={{
                    width:"100%",
                    background: name && email && phone ? "#FF3B1E" : "#E0DDD7",
                    color: name && email && phone ? "white" : "#AAA",
                    border:"none",
                    borderRadius:"14px",
                    padding:"17px",
                    fontSize:"16px",
                    fontWeight:800,
                    cursor: name && email && phone ? "pointer" : "default",
                    transition:"all 0.2s",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    gap:"8px",
                  }}
                >
                  {loading ? "저장 중..." : <>픽스카 시작하기 <ArrowRight size={18}/></>}
                </button>

                {/* 개인정보 안내 */}
                <div style={{ marginTop:"16px", fontSize:"12px", color:"#AAA", textAlign:"center", lineHeight:1.7, fontWeight:400 }}>
                  입력하신 정보는 픽스카 서비스 이용 목적으로만 사용되며<br />
                  제3자에게 제공되지 않아요.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
