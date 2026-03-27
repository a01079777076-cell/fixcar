"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, XCircle, Phone, Shield, ChevronLeft } from "lucide-react";

const S: React.CSSProperties = {
  width:"100%", padding:"14px 16px", border:"1.5px solid #E0DDD7",
  borderRadius:12, fontSize:14, fontFamily:"'NanumSquareRound',sans-serif",
  outline:"none", background:"white", boxSizing:"border-box",
};

/* ─────────────── 아이디 찾기 모달 ─────────────── */
function FindIdModal({ onClose }: { onClose:()=>void }) {
  const [step, setStep] = useState<"input"|"code"|"result">("input");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [accounts, setAccounts] = useState<{username:string;provider:string;createdAt:string}[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const startTimer = () => {
    setTimer(180);
    timerRef.current = setInterval(() => setTimer(p => { if(p<=1){clearInterval(timerRef.current!);return 0;}return p-1; }), 1000);
  };

  const sendCode = async () => {
    setErr(""); setLoading(true);
    const res = await fetch("/api/auth/find-id", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ action:"send", name:name.trim(), birthdate:birth.replace(/-/g,""), phone:phone.replace(/[^0-9]/g,"") }),
    });
    const d = await res.json();
    setLoading(false);
    if (!d.success) { setErr(d.error||"발송 실패"); return; }
    setDevCode(d.devCode||"");
    setStep("code");
    startTimer();
  };

  const verifyCode = async () => {
    setErr(""); setLoading(true);
    const res = await fetch("/api/auth/find-id", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ action:"verify", name:name.trim(), birthdate:birth.replace(/-/g,""), phone:phone.replace(/[^0-9]/g,""), code }),
    });
    const d = await res.json();
    setLoading(false);
    if (!d.success) { setErr(d.error||"인증 실패"); return; }
    setAccounts(d.accounts||[]);
    setStep("result");
  };

  return (
    <Modal title="🔍 아이디 찾기" onClose={onClose}>
      {step === "input" && (
        <>
          <p style={{fontSize:13,color:"#AAA",marginBottom:18,lineHeight:1.7}}>이름, 생년월일, 휴대폰 번호를 입력하면<br/>인증번호로 본인 확인 후 아이디를 알려드려요.</p>
          <label style={LBL}>이름</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="홍길동" style={{...S,marginBottom:10}}/>
          <label style={LBL}>생년월일</label>
          <input value={birth} onChange={e=>setBirth(e.target.value)} placeholder="19960101" maxLength={8} style={{...S,marginBottom:10}}/>
          <label style={LBL}>휴대폰 번호</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="01012345678" maxLength={11} style={{...S,marginBottom:16}}/>
          {err && <Err msg={err}/>}
          <Btn onClick={sendCode} loading={loading} label="인증번호 받기"/>
        </>
      )}
      {step === "code" && (
        <>
          <p style={{fontSize:13,color:"#AAA",marginBottom:18,lineHeight:1.7}}>
            {phone}로 인증번호를 발송했어요.<br/>
            <span style={{color:"#FF3B1E",fontWeight:700}}>1일 5회까지 인증 가능합니다.</span>
          </p>
          {devCode && (
            <div style={{background:"#FFF8EC",border:"1px solid #F0D88A",borderRadius:10,padding:"10px 14px",marginBottom:10,fontSize:12,color:"#B8860B"}}>
              🔧 테스트 인증번호: <b style={{fontSize:16,letterSpacing:3}}>{devCode}</b>
            </div>
          )}
          <label style={LBL}>인증번호 6자리</label>
          <input value={code} onChange={e=>setCode(e.target.value.replace(/[^0-9]/g,""))} placeholder="인증번호 입력" maxLength={6} style={{...S,letterSpacing:4,textAlign:"center",marginBottom:6}}/>
          <div style={{fontSize:12,color:timer>0?"#FF3B1E":"#AAA",textAlign:"right",marginBottom:16}}>
            {timer>0 ? `${Math.floor(timer/60)}:${String(timer%60).padStart(2,"0")}` : "시간 초과 — 재발송해주세요"}
          </div>
          {err && <Err msg={err}/>}
          <Btn onClick={verifyCode} loading={loading} label="아이디 찾기"/>
          <button onClick={()=>setStep("input")} style={BACK_BTN}>← 다시 입력</button>
        </>
      )}
      {step === "result" && (
        <>
          <p style={{fontSize:13,color:"#AAA",marginBottom:16}}>본인 확인이 완료되었습니다.</p>
          {accounts.map((a,i) => (
            <div key={i} style={{background:"#F8F7F4",borderRadius:12,padding:"14px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:"#1A1A1A"}}>{a.username}</div>
                <div style={{fontSize:11,color:"#AAA",marginTop:2}}>{a.provider==="kakao"?"카카오 연동":"픽스카 계정"} · 가입일 {a.createdAt}</div>
              </div>
              {a.provider !== "kakao" && (
                <span style={{fontSize:11,fontWeight:700,color:"#0066FF",background:"#EEF5FF",padding:"3px 10px",borderRadius:100}}>일반</span>
              )}
            </div>
          ))}
          <Btn onClick={onClose} label="로그인하러 가기" color="#0066FF"/>
        </>
      )}
    </Modal>
  );
}

/* ─────────────── 비밀번호 찾기 모달 ─────────────── */
function FindPwModal({ onClose }: { onClose:()=>void }) {
  const [step, setStep] = useState<"input"|"reset"|"done">("input");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPwCheck, setNewPwCheck] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    setErr(""); setLoading(true);
    const res = await fetch("/api/auth/find-pw", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ action:"verify", name:name.trim(), birthdate:birth.replace(/-/g,""), phone:phone.replace(/[^0-9]/g,""), username:username.trim() }),
    });
    const d = await res.json();
    setLoading(false);
    if (!d.success) { setErr(d.error||"인증 실패"); return; }
    setResetToken(d.resetToken);
    setStep("reset");
  };

  const resetPw = async () => {
    setErr(""); 
    if (newPw !== newPwCheck) { setErr("비밀번호가 일치하지 않습니다"); return; }
    if (newPw.length < 8 || !/[a-zA-Z]/.test(newPw) || !/[0-9]/.test(newPw)) {
      setErr("비밀번호는 영문+숫자 조합 8자 이상"); return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/find-pw", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ action:"reset", token:resetToken, newPassword:newPw }),
    });
    const d = await res.json();
    setLoading(false);
    if (!d.success) { setErr(d.error||"재설정 실패"); return; }
    setStep("done");
  };

  return (
    <Modal title="🔒 비밀번호 찾기" onClose={onClose}>
      {step === "input" && (
        <>
          <p style={{fontSize:13,color:"#AAA",marginBottom:18,lineHeight:1.7}}>이름, 생년월일, 휴대폰 번호, 아이디를 입력하면<br/>비밀번호를 재설정할 수 있어요.</p>
          <label style={LBL}>이름</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="홍길동" style={{...S,marginBottom:10}}/>
          <label style={LBL}>생년월일</label>
          <input value={birth} onChange={e=>setBirth(e.target.value)} placeholder="19960101" maxLength={8} style={{...S,marginBottom:10}}/>
          <label style={LBL}>휴대폰 번호</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="01012345678" maxLength={11} style={{...S,marginBottom:10}}/>
          <label style={LBL}>아이디</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="아이디 입력" style={{...S,marginBottom:16}}/>
          {err && <Err msg={err}/>}
          <Btn onClick={verify} loading={loading} label="본인 확인"/>
        </>
      )}
      {step === "reset" && (
        <>
          <p style={{fontSize:13,color:"#2D8A52",fontWeight:700,marginBottom:18}}>✅ 본인 확인 완료! 새 비밀번호를 설정해주세요.</p>
          <label style={LBL}>새 비밀번호</label>
          <div style={{position:"relative",marginBottom:6}}>
            <input value={newPw} onChange={e=>setNewPw(e.target.value)} type={showPw?"text":"password"} placeholder="영문+숫자 조합 8자 이상" style={S}/>
            <button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",border:"none",background:"transparent",cursor:"pointer",color:"#CCC"}}>{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
          </div>
          {newPw.length > 0 && (
            <div style={{fontSize:11,marginBottom:8,display:"flex",gap:10}}>
              <span style={{color:newPw.length>=8?"#2D8A52":"#E24B4A"}}>{newPw.length>=8?"✓":"✗"} 8자↑</span>
              <span style={{color:/[a-zA-Z]/.test(newPw)?"#2D8A52":"#E24B4A"}}>{/[a-zA-Z]/.test(newPw)?"✓":"✗"} 영문</span>
              <span style={{color:/[0-9]/.test(newPw)?"#2D8A52":"#E24B4A"}}>{/[0-9]/.test(newPw)?"✓":"✗"} 숫자</span>
            </div>
          )}
          <input value={newPwCheck} onChange={e=>setNewPwCheck(e.target.value)} type="password" placeholder="비밀번호 확인" style={{...S,marginBottom:16}}/>
          {err && <Err msg={err}/>}
          <Btn onClick={resetPw} loading={loading} label="비밀번호 변경"/>
        </>
      )}
      {step === "done" && (
        <>
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:48,marginBottom:12}}>✅</div>
            <div style={{fontSize:18,fontWeight:800,marginBottom:8}}>비밀번호가 변경되었습니다</div>
            <div style={{fontSize:13,color:"#AAA",marginBottom:24}}>새 비밀번호로 로그인해주세요</div>
          </div>
          <Btn onClick={onClose} label="로그인하러 가기" color="#0066FF"/>
        </>
      )}
    </Modal>
  );
}

/* ─────────────── 공용 컴포넌트 ─────────────── */
const LBL: React.CSSProperties = { fontSize:12, fontWeight:800, display:"block", marginBottom:6 };
const BACK_BTN: React.CSSProperties = { width:"100%", padding:"12px", background:"transparent", border:"none", fontSize:13, color:"#AAA", cursor:"pointer", marginTop:6, fontFamily:"'NanumSquareRound',sans-serif" };

function Modal({ title, onClose, children }: { title:string; onClose:()=>void; children:React.ReactNode }) {
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:10000}}/>
      <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"white",borderRadius:24,padding:"32px 28px",width:"min(420px,92vw)",zIndex:10001,boxShadow:"0 20px 60px rgba(0,0,0,0.2)",maxHeight:"90vh",overflowY:"auto"}}>
        <h2 style={{fontSize:20,fontWeight:800,marginBottom:16}}>{title}</h2>
        {children}
      </div>
    </>
  );
}

function Btn({ onClick, loading, label, color="#FF3B1E" }: { onClick:()=>void; loading?:boolean; label:string; color?:string }) {
  return (
    <button onClick={onClick} disabled={loading} style={{width:"100%",padding:"16px",background:loading?"#CCC":color,color:"white",border:"none",borderRadius:14,fontSize:15,fontWeight:800,cursor:loading?"wait":"pointer",fontFamily:"'NanumSquareRound',sans-serif",marginTop:4}}>
      {loading?"처리 중...":label}
    </button>
  );
}

function Err({ msg }:{ msg:string }) {
  return <div style={{fontSize:13,color:"#E24B4A",marginBottom:10,fontWeight:600}}>⚠️ {msg}</div>;
}

/* ─────────────── 메인 페이지 ─────────────── */
export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login"|"signup">("login");
  const [findMode, setFindMode] = useState<null|"id"|"pw">(null);

  /* 로그인 */
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPw, setShowLoginPw] = useState(false);

  /* 회원가입 */
  const [signupId, setSignupId] = useState("");
  const [signupPw, setSignupPw] = useState("");
  const [signupPwCheck, setSignupPwCheck] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupBirth, setSignupBirth] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [idChecked, setIdChecked] = useState<null|boolean>(null);
  const [idError, setIdError] = useState("");
  const [idChecking, setIdChecking] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneSent, setPhoneSent] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [devCode, setDevCode] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const idValid = /^[a-zA-Z0-9_]{6,20}$/.test(signupId);
  const pwValid = signupPw.length >= 8 && /[a-zA-Z]/.test(signupPw) && /[0-9]/.test(signupPw);
  const pwMatch = signupPw === signupPwCheck && signupPwCheck.length > 0;

  const checkId = async () => {
    if (!idValid) { setIdError("아이디는 영문/숫자/밑줄 6~20자"); return; }
    setIdChecking(true);
    const res = await fetch("/api/auth/check-id", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({username:signupId}) });
    const d = await res.json();
    setIdChecked(d.available);
    setIdError(d.available ? "" : "이미 사용 중인 아이디입니다");
    setIdChecking(false);
  };

  const sendPhoneCode = async () => {
    const cleaned = signupPhone.replace(/[^0-9]/g,"");
    if (!/^01[016789]\d{7,8}$/.test(cleaned)) { setSignupError("올바른 휴대폰 번호를 입력해주세요"); return; }
    const res = await fetch("/api/auth/phone-verify", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({phone:cleaned,action:"send"}) });
    const d = await res.json();
    if (!d.success) { setSignupError(d.error||"발송 실패"); return; }
    setPhoneSent(true); setSignupError("");
    if (d.devCode) setDevCode(d.devCode);
    setPhoneTimer(180);
    const iv = setInterval(() => setPhoneTimer(p=>{ if(p<=1){clearInterval(iv);return 0;} return p-1; }), 1000);
  };

  const verifyPhoneCode = async () => {
    const cleaned = signupPhone.replace(/[^0-9]/g,"");
    const res = await fetch("/api/auth/phone-verify", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({phone:cleaned,code:phoneCode,action:"verify"}) });
    const d = await res.json();
    if (d.verified) { setPhoneVerified(true); setSignupError(""); }
    else setSignupError("인증번호가 일치하지 않습니다");
  };

  const handleLogin = async () => {
    if (!loginId || !loginPw) { setLoginError("아이디와 비밀번호를 입력해주세요"); return; }
    setLoginLoading(true); setLoginError("");
    const res = await fetch("/api/auth/login", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({username:loginId,password:loginPw}) });
    const d = await res.json();
    if (d.success) { router.push("/"); router.refresh(); }
    else setLoginError(d.error||"로그인 실패");
    setLoginLoading(false);
  };

  const handleSignup = async () => {
    setSignupError("");
    if (!idValid) { setSignupError("아이디는 영문/숫자/밑줄 6~20자"); return; }
    if (idChecked !== true) { setSignupError("아이디 중복 확인을 해주세요"); return; }
    if (!pwValid) { setSignupError("비밀번호는 영문+숫자 조합 8자 이상"); return; }
    if (!pwMatch) { setSignupError("비밀번호가 일치하지 않습니다"); return; }
    if (!signupName.trim()) { setSignupError("이름을 입력해주세요"); return; }
    if (!signupBirth.trim()) { setSignupError("생년월일을 입력해주세요"); return; }
    if (!phoneVerified) { setSignupError("휴대폰 본인인증을 완료해주세요"); return; }
    setSignupLoading(true);
    const res = await fetch("/api/auth/signup", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ username:signupId, password:signupPw, name:signupName, birthdate:signupBirth.replace(/-/g,""), phone:signupPhone }),
    });
    const d = await res.json();
    if (d.success) { setTab("login"); setLoginId(signupId); }
    else setSignupError(d.error||"가입 실패");
    setSignupLoading(false);
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus{border-color:#FF3B1E!important;outline:none;} a{text-decoration:none;color:inherit;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9",display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 16px 100px"}}>
        <div style={{width:"100%",maxWidth:440}}>
          {/* 로고 */}
          <div style={{textAlign:"center",marginBottom:32}}>
            <Link href="/"><div style={{fontFamily:"'Bebas Neue',serif",fontSize:36,letterSpacing:3,color:"#FF3B1E"}}>FIXCAR</div></Link>
            <div style={{fontSize:13,color:"#AAA",marginTop:4}}>광주 1위 중고차 정찰제 플랫폼</div>
          </div>

          {/* 탭 */}
          <div style={{display:"flex",background:"white",borderRadius:16,padding:4,marginBottom:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            {(["login","signup"] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"12px",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",background:tab===t?"#FF3B1E":"transparent",color:tab===t?"white":"#AAA",transition:"all 0.2s"}}>
                {t==="login"?"로그인":"회원가입"}
              </button>
            ))}
          </div>

          <div style={{background:"white",borderRadius:24,padding:"32px 28px",boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>

            {/* ══ 로그인 ══ */}
            {tab==="login" && (
              <div>
                <label style={LBL}>아이디</label>
                <input value={loginId} onChange={e=>setLoginId(e.target.value)} placeholder="아이디 입력" style={{...S,marginBottom:12}} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
                <label style={LBL}>비밀번호</label>
                <div style={{position:"relative",marginBottom:20}}>
                  <input value={loginPw} onChange={e=>setLoginPw(e.target.value)} type={showLoginPw?"text":"password"} placeholder="비밀번호 입력" style={S} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
                  <button onClick={()=>setShowLoginPw(!showLoginPw)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",border:"none",background:"transparent",cursor:"pointer",color:"#CCC"}}>{showLoginPw?<EyeOff size={18}/>:<Eye size={18}/>}</button>
                </div>
                {loginError && <Err msg={loginError}/>}
                <button onClick={handleLogin} disabled={loginLoading} style={{width:"100%",padding:"16px",background:loginLoading?"#CCC":"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:loginLoading?"wait":"pointer",fontFamily:"'NanumSquareRound',sans-serif",marginBottom:14}}>
                  {loginLoading?"로그인 중...":"로그인"}
                </button>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                  <div style={{flex:1,height:1,background:"#E0DDD7"}}/><span style={{fontSize:12,color:"#CCC"}}>또는</span><div style={{flex:1,height:1,background:"#E0DDD7"}}/>
                </div>
                <a href="/api/auth/kakao">
                  <button style={{width:"100%",padding:"14px",background:"#FEE500",color:"#3C1E1E",border:"none",borderRadius:14,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    💬 카카오로 로그인
                  </button>
                </a>
                <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:16}}>
                  <button onClick={()=>setFindMode("id")} style={{border:"none",background:"transparent",color:"#888",fontSize:13,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",fontWeight:600,textDecoration:"underline"}}>아이디 찾기</button>
                  <span style={{color:"#E0DDD7"}}>|</span>
                  <button onClick={()=>setFindMode("pw")} style={{border:"none",background:"transparent",color:"#888",fontSize:13,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",fontWeight:600,textDecoration:"underline"}}>비밀번호 찾기</button>
                </div>
              </div>
            )}

            {/* ══ 회원가입 ══ */}
            {tab==="signup" && (
              <div>
                {/* 아이디 */}
                <label style={LBL}>아이디 <span style={{color:"#FF3B1E"}}>*</span></label>
                <div style={{display:"flex",gap:8,marginBottom:4}}>
                  <input value={signupId} onChange={e=>{setSignupId(e.target.value.replace(/[^a-zA-Z0-9_]/g,""));setIdChecked(null);setIdError("");}} placeholder="영문/숫자/밑줄 6~20자" maxLength={20} style={{...S,flex:1}}/>
                  <button onClick={checkId} disabled={idChecking||!idValid} style={{padding:"14px 16px",background:idChecked===true?"#2D8A52":"#1A1A1A",color:"white",border:"none",borderRadius:12,fontSize:13,fontWeight:800,whiteSpace:"nowrap",cursor:"pointer",opacity:idValid?1:0.4,fontFamily:"'NanumSquareRound',sans-serif"}}>
                    {idChecking?"확인중":idChecked===true?"✓ 확인":"중복확인"}
                  </button>
                </div>
                {idError && <Err msg={idError}/>}
                <div style={{fontSize:11,color:signupId.length>0?(idValid?"#2D8A52":"#E24B4A"):"#CCC",marginBottom:12}}>
                  {signupId.length>0?(idValid?`${signupId.length}자 · 사용 가능한 형식`:`영문/숫자/밑줄만 · ${signupId.length}/6~20자`):"영문/숫자/밑줄 6~20자"}
                </div>

                {/* 비밀번호 */}
                <label style={LBL}>비밀번호 <span style={{color:"#FF3B1E"}}>*</span></label>
                <div style={{position:"relative",marginBottom:6}}>
                  <input value={signupPw} onChange={e=>setSignupPw(e.target.value)} type={showPw?"text":"password"} placeholder="영문+숫자 조합 8자 이상" style={S}/>
                  <button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",border:"none",background:"transparent",cursor:"pointer",color:"#CCC"}}>{showPw?<EyeOff size={18}/>:<Eye size={18}/>}</button>
                </div>
                {signupPw.length>0 && (
                  <div style={{fontSize:11,marginBottom:8,display:"flex",gap:12}}>
                    <span style={{color:signupPw.length>=8?"#2D8A52":"#E24B4A"}}>{signupPw.length>=8?"✓":"✗"} 8자↑</span>
                    <span style={{color:/[a-zA-Z]/.test(signupPw)?"#2D8A52":"#E24B4A"}}>{/[a-zA-Z]/.test(signupPw)?"✓":"✗"} 영문</span>
                    <span style={{color:/[0-9]/.test(signupPw)?"#2D8A52":"#E24B4A"}}>{/[0-9]/.test(signupPw)?"✓":"✗"} 숫자</span>
                  </div>
                )}
                <input value={signupPwCheck} onChange={e=>setSignupPwCheck(e.target.value)} type="password" placeholder="비밀번호 확인" style={{...S,marginBottom:4}}/>
                <div style={{fontSize:11,color:signupPwCheck.length>0?(pwMatch?"#2D8A52":"#E24B4A"):"transparent",marginBottom:12,display:"flex",alignItems:"center",gap:4}}>
                  {signupPwCheck.length>0&&(pwMatch?<><CheckCircle size={12}/> 비밀번호 일치</>:<><XCircle size={12}/> 비밀번호 불일치</>)}
                </div>

                {/* 이름 */}
                <label style={LBL}>이름 <span style={{color:"#FF3B1E"}}>*</span></label>
                <input value={signupName} onChange={e=>setSignupName(e.target.value)} placeholder="홍길동" style={{...S,marginBottom:12}}/>

                {/* 생년월일 */}
                <label style={LBL}>생년월일 <span style={{color:"#FF3B1E"}}>*</span></label>
                <input value={signupBirth} onChange={e=>setSignupBirth(e.target.value.replace(/[^0-9]/g,""))} placeholder="19960101 (8자리)" maxLength={8} style={{...S,marginBottom:12}}/>

                {/* 휴대폰 인증 */}
                <label style={LBL}><Phone size={12} style={{verticalAlign:"middle",marginRight:4}}/> 휴대폰 본인인증 <span style={{color:"#FF3B1E"}}>*</span></label>
                {phoneVerified ? (
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"14px 16px",background:"#EAF6EF",borderRadius:12,marginBottom:12,fontSize:14,fontWeight:700,color:"#2D8A52"}}>
                    <Shield size={16}/> 인증 완료 ({signupPhone})
                  </div>
                ) : (
                  <>
                    <div style={{display:"flex",gap:8,marginBottom:8}}>
                      <input value={signupPhone} onChange={e=>setSignupPhone(e.target.value)} placeholder="01012345678" maxLength={11} style={{...S,flex:1}}/>
                      <button onClick={sendPhoneCode} disabled={phoneSent&&phoneTimer>0} style={{padding:"14px 16px",background:"#1A1A1A",color:"white",border:"none",borderRadius:12,fontSize:13,fontWeight:800,whiteSpace:"nowrap",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",opacity:phoneSent&&phoneTimer>0?0.5:1}}>
                        {phoneSent&&phoneTimer>0?`${Math.floor(phoneTimer/60)}:${String(phoneTimer%60).padStart(2,"0")}`:"인증 발송"}
                      </button>
                    </div>
                    {phoneSent && (
                      <>
                        {devCode && <div style={{background:"#FFF8EC",border:"1px solid #F0D88A",borderRadius:10,padding:"10px 14px",marginBottom:8,fontSize:12,color:"#B8860B"}}>🔧 테스트 인증번호: <b style={{fontSize:16,letterSpacing:3}}>{devCode}</b></div>}
                        <div style={{display:"flex",gap:8,marginBottom:12}}>
                          <input value={phoneCode} onChange={e=>setPhoneCode(e.target.value.replace(/[^0-9]/g,""))} placeholder="인증번호 6자리" maxLength={6} style={{...S,flex:1,letterSpacing:4,textAlign:"center"}}/>
                          <button onClick={verifyPhoneCode} style={{padding:"14px 16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:12,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>확인</button>
                        </div>
                      </>
                    )}
                  </>
                )}

                {signupError && <Err msg={signupError}/>}
                <button onClick={handleSignup} disabled={signupLoading} style={{width:"100%",padding:"16px",background:signupLoading?"#CCC":"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:signupLoading?"wait":"pointer",fontFamily:"'NanumSquareRound',sans-serif",marginTop:4}}>
                  {signupLoading?"가입 중...":"회원가입"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 아이디/비밀번호 찾기 모달 */}
      {findMode==="id" && <FindIdModal onClose={()=>setFindMode(null)}/>}
      {findMode==="pw" && <FindPwModal onClose={()=>setFindMode(null)}/>}
    </>
  );
}
