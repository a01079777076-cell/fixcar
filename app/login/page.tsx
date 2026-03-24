"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, XCircle, Phone, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login"|"signup">("login");

  /* 로그인 */
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  /* 회원가입 */
  const [signupId, setSignupId] = useState("");
  const [signupPw, setSignupPw] = useState("");
  const [signupPwCheck, setSignupPwCheck] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [idChecked, setIdChecked] = useState<null|boolean>(null);
  const [idError, setIdError] = useState("");
  const [idChecking, setIdChecking] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneSent, setPhoneSent] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  /* 아이디 유효성 */
  const idValid = /^[a-zA-Z0-9_]{6,20}$/.test(signupId);
  const pwValid = signupPw.length >= 8 && /[a-zA-Z]/.test(signupPw) && /[0-9]/.test(signupPw);
  const pwMatch = signupPw === signupPwCheck && signupPwCheck.length > 0;

  /* 아이디 중복 체크 */
  const checkId = async () => {
    if (!idValid) { setIdError("아이디는 영문/숫자/밑줄 6~20자여야 합니다"); return; }
    setIdChecking(true);
    try {
      const res = await fetch("/api/auth/check-id", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: signupId }),
      });
      const data = await res.json();
      setIdChecked(data.available);
      if (!data.available) setIdError("이미 사용 중인 아이디입니다");
      else { setIdError(""); }
    } catch { setSignupError("확인 실패"); }
    setIdChecking(false);
  };

  /* 휴대폰 인증 발송 */
  const [devCode, setDevCode] = useState("");

  const sendPhoneCode = async () => {
    const cleaned = signupPhone.replace(/[^0-9]/g, "");
    if (!/^01[016789]\d{7,8}$/.test(cleaned)) { setSignupError("올바른 휴대폰 번호를 입력해주세요"); return; }
    try {
      const res = await fetch("/api/auth/phone-verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleaned, action: "send" }),
      });
      const data = await res.json();
      if (data.success) {
        setPhoneSent(true);
        setSignupError("");
        /* 개발모드: 인증번호 직접 표시 */
        if (data.devCode) setDevCode(data.devCode);
        /* 3분 타이머 */
        setPhoneTimer(180);
        const interval = setInterval(() => {
          setPhoneTimer(prev => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
        }, 1000);
      } else { setSignupError(data.error || "발송 실패"); }
    } catch { setSignupError("네트워크 오류"); }
  };

  /* 인증번호 확인 */
  const verifyPhoneCode = async () => {
    const cleaned = signupPhone.replace(/[^0-9]/g, "");
    try {
      const res = await fetch("/api/auth/phone-verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleaned, code: phoneCode, action: "verify" }),
      });
      const data = await res.json();
      if (data.verified) { setPhoneVerified(true); setSignupError(""); }
      else setSignupError("인증번호가 일치하지 않습니다");
    } catch { setSignupError("확인 실패"); }
  };

  /* 로그인 처리 */
  const handleLogin = async () => {
    if (!loginId || !loginPw) { setLoginError("아이디와 비밀번호를 입력해주세요"); return; }
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginId, password: loginPw }),
      });
      const data = await res.json();
      if (data.success) { router.push("/"); router.refresh(); }
      else setLoginError(data.error || "로그인 실패");
    } catch { setLoginError("네트워크 오류"); }
    setLoginLoading(false);
  };

  /* 회원가입 처리 */
  const handleSignup = async () => {
    setSignupError("");
    if (!idValid) { setSignupError("아이디는 영문/숫자/밑줄 6~20자"); return; }
    if (idChecked !== true) { setSignupError("아이디 중복 확인을 해주세요"); return; }
    if (!pwValid) { setSignupError("비밀번호는 영문+숫자 조합 8자 이상이어야 합니다"); return; }
    if (!pwMatch) { setSignupError("비밀번호가 일치하지 않습니다"); return; }
    if (!signupName.trim()) { setSignupError("이름을 입력해주세요"); return; }
    if (!phoneVerified) { setSignupError("휴대폰 본인인증을 완료해주세요"); return; }
    setSignupLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupId, password: signupPw, name: signupName,
          phone: signupPhone.replace(/[^0-9]/g, ""),
        }),
      });
      const data = await res.json();
      if (data.success) { alert("회원가입 완료! 로그인해주세요."); setTab("login"); setLoginId(signupId); }
      else setSignupError(data.error || "가입 실패");
    } catch { setSignupError("네트워크 오류"); }
    setSignupLoading(false);
  };

  const inputStyle = { width:"100%",padding:"14px 16px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif" };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 16px"}}>
        <div style={{width:"100%",maxWidth:440}}>
          {/* 로고 */}
          <div style={{textAlign:"center",marginBottom:32}}>
            <Link href="/" style={{textDecoration:"none"}}>
              <span style={{fontFamily:"'Bebas Neue',serif",fontSize:40,letterSpacing:3}}>
                <span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"#1A1A1A"}}>CAR</span>
              </span>
            </Link>
          </div>

          <div style={{background:"white",borderRadius:24,padding:"32px 28px",boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
            {/* 탭 */}
            <div style={{display:"flex",marginBottom:24,background:"#F0EEE9",borderRadius:12,padding:4}}>
              {(["login","signup"] as const).map(t=>(
                <button key={t} onClick={()=>{setTab(t);setLoginError("");setSignupError("");}} style={{
                  flex:1,padding:"12px",borderRadius:10,border:"none",fontSize:15,fontWeight:800,
                  background:tab===t?"white":"transparent",color:tab===t?"#FF3B1E":"#AAA",
                  boxShadow:tab===t?"0 2px 8px rgba(0,0,0,0.06)":"none",
                  fontFamily:"'NanumSquareRound',sans-serif",cursor:"pointer",
                }}>{t==="login"?"로그인":"회원가입"}</button>
              ))}
            </div>

            {/* ═══ 로그인 ═══ */}
            {tab==="login"&&(
              <div>
                <input value={loginId} onChange={e=>setLoginId(e.target.value)} placeholder="아이디" style={{...inputStyle,marginBottom:10}} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
                <div style={{position:"relative",marginBottom:10}}>
                  <input value={loginPw} onChange={e=>setLoginPw(e.target.value)} type={showPw?"text":"password"} placeholder="비밀번호" style={inputStyle} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
                  <button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",border:"none",background:"transparent",cursor:"pointer",color:"#CCC"}}>{showPw?<EyeOff size={18}/>:<Eye size={18}/>}</button>
                </div>
                {loginError&&<div style={{fontSize:13,color:"#E24B4A",marginBottom:10}}>{loginError}</div>}
                <button onClick={handleLogin} disabled={loginLoading} style={{width:"100%",padding:"16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:loginLoading?"wait":"pointer",fontFamily:"'NanumSquareRound',sans-serif",marginBottom:16}}>
                  {loginLoading?"로그인 중...":"로그인"}
                </button>

                <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0"}}>
                  <div style={{flex:1,height:1,background:"#E0DDD7"}}/><span style={{fontSize:12,color:"#CCC"}}>또는</span><div style={{flex:1,height:1,background:"#E0DDD7"}}/>
                </div>

                <a href="/api/auth/kakao" style={{textDecoration:"none"}}>
                  <button style={{width:"100%",padding:"14px",background:"#FEE500",color:"#3C1E1E",border:"none",borderRadius:14,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    💬 카카오로 로그인
                  </button>
                </a>
              </div>
            )}

            {/* ═══ 회원가입 ═══ */}
            {tab==="signup"&&(
              <div>
                {/* 아이디 */}
                <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:6}}>아이디 <span style={{color:"#FF3B1E"}}>*</span></label>
                <div style={{display:"flex",gap:8,marginBottom:4}}>
                  <input value={signupId} onChange={e=>{setSignupId(e.target.value.replace(/[^a-zA-Z0-9_]/g,""));setIdChecked(null);setIdError("");}} placeholder="영문/숫자/밑줄 6~20자" maxLength={20} style={{...inputStyle,flex:1}}/>
                  <button onClick={checkId} disabled={idChecking||!idValid} style={{padding:"14px 18px",background:idChecked===true?"#2D8A52":"#1A1A1A",color:"white",border:"none",borderRadius:12,fontSize:13,fontWeight:800,whiteSpace:"nowrap",cursor:"pointer",opacity:idValid?1:0.4,fontFamily:"'NanumSquareRound',sans-serif"}}>
                    {idChecking?"확인중":idChecked===true?"✓ 확인":"중복확인"}
                  </button>
                </div>
                <div style={{fontSize:11,color:signupId.length>0?(idValid?"#2D8A52":"#E24B4A"):"#CCC",marginBottom:idError?4:12}}>
                  {signupId.length>0?(idValid?`${signupId.length}자 (사용 가능한 형식)`:`영문/숫자/밑줄만, ${signupId.length}/6~20자`):"영문/숫자/밑줄 6~20자"}
                </div>
                {idError&&<div style={{fontSize:12,color:"#E24B4A",fontWeight:700,marginBottom:12}}>⚠️ {idError}</div>}

                {/* 비밀번호 */}
                <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:6}}>비밀번호 <span style={{color:"#FF3B1E"}}>*</span></label>
                <div style={{position:"relative",marginBottom:8}}>
                  <input value={signupPw} onChange={e=>setSignupPw(e.target.value)} type={showPw?"text":"password"} placeholder="영문+숫자 조합 8자 이상" style={inputStyle}/>
                  <button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",border:"none",background:"transparent",cursor:"pointer",color:"#CCC"}}>{showPw?<EyeOff size={18}/>:<Eye size={18}/>}</button>
                </div>
                {signupPw.length>0&&(
                  <div style={{fontSize:11,marginBottom:8,display:"flex",gap:12}}>
                    <span style={{color:signupPw.length>=8?"#2D8A52":"#E24B4A"}}>{signupPw.length>=8?"✓":"✗"} 8자 이상</span>
                    <span style={{color:/[a-zA-Z]/.test(signupPw)?"#2D8A52":"#E24B4A"}}>{/[a-zA-Z]/.test(signupPw)?"✓":"✗"} 영문 포함</span>
                    <span style={{color:/[0-9]/.test(signupPw)?"#2D8A52":"#E24B4A"}}>{/[0-9]/.test(signupPw)?"✓":"✗"} 숫자 포함</span>
                  </div>
                )}
                <input value={signupPwCheck} onChange={e=>setSignupPwCheck(e.target.value)} type="password" placeholder="비밀번호 확인" style={{...inputStyle,marginBottom:4}}/>
                <div style={{fontSize:11,color:signupPwCheck.length>0?(pwMatch?"#2D8A52":"#E24B4A"):"transparent",marginBottom:12,display:"flex",alignItems:"center",gap:4}}>
                  {signupPwCheck.length>0&&(pwMatch?<><CheckCircle size={12}/> 비밀번호 일치</>:<><XCircle size={12}/> 비밀번호 불일치</>)}
                </div>

                {/* 이름 */}
                <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:6}}>이름 <span style={{color:"#FF3B1E"}}>*</span></label>
                <input value={signupName} onChange={e=>setSignupName(e.target.value)} placeholder="실명 입력" style={{...inputStyle,marginBottom:12}}/>

                {/* 휴대폰 본인인증 */}
                <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:6}}>
                  <Phone size={12} style={{verticalAlign:"middle",marginRight:4}}/> 휴대폰 본인인증 <span style={{color:"#FF3B1E"}}>*</span>
                </label>
                {phoneVerified ? (
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"14px 16px",background:"#EAF6EF",borderRadius:12,marginBottom:12,fontSize:14,fontWeight:700,color:"#2D8A52"}}>
                    <Shield size={16}/> 본인인증 완료 ({signupPhone})
                  </div>
                ) : (
                  <>
                    <div style={{display:"flex",gap:8,marginBottom:8}}>
                      <input value={signupPhone} onChange={e=>setSignupPhone(e.target.value)} placeholder="01012345678" maxLength={11} style={{...inputStyle,flex:1}}/>
                      <button onClick={sendPhoneCode} disabled={phoneSent&&phoneTimer>0} style={{padding:"14px 18px",background:"#1A1A1A",color:"white",border:"none",borderRadius:12,fontSize:13,fontWeight:800,whiteSpace:"nowrap",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",opacity:phoneSent&&phoneTimer>0?0.5:1}}>
                        {phoneSent&&phoneTimer>0?`${Math.floor(phoneTimer/60)}:${String(phoneTimer%60).padStart(2,"0")}`:"인증 발송"}
                      </button>
                    </div>
                    {phoneSent&&(
                      <>
                        {devCode&&(
                          <div style={{background:"#FFF8EC",border:"1px solid #F0D88A",borderRadius:10,padding:"10px 14px",marginBottom:8,fontSize:12,color:"#B8860B"}}>
                            🔧 <b>테스트 모드</b> — 인증번호: <b style={{fontSize:16,letterSpacing:3}}>{devCode}</b>
                          </div>
                        )}
                        <div style={{display:"flex",gap:8,marginBottom:12}}>
                          <input value={phoneCode} onChange={e=>setPhoneCode(e.target.value.replace(/[^0-9]/g,""))} placeholder="인증번호 6자리" maxLength={6} style={{...inputStyle,flex:1,letterSpacing:4,textAlign:"center"}}/>
                          <button onClick={verifyPhoneCode} style={{padding:"14px 18px",background:"#FF3B1E",color:"white",border:"none",borderRadius:12,fontSize:13,fontWeight:800,whiteSpace:"nowrap",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>확인</button>
                        </div>
                      </>
                    )}
                  </>
                )}

                {signupError&&<div style={{fontSize:13,color:"#E24B4A",marginBottom:10}}>{signupError}</div>}

                <button onClick={handleSignup} disabled={signupLoading} style={{width:"100%",padding:"16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:signupLoading?"wait":"pointer",fontFamily:"'NanumSquareRound',sans-serif",marginTop:4}}>
                  {signupLoading?"가입 중...":"회원가입"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
