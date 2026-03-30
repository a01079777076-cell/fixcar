// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/dealer/apply/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ChevronRight, ChevronLeft, CheckCircle, Shield, Phone } from "lucide-react";

/* ── 광주 조합/단지 데이터 (실제 데이터로 교체 필요) ── */
const ASSOCIATION_DATA: Record<string, string[]> = {
  "광주광역시자동차매매사업협동조합": [
    "북구 용봉자동차매매단지",
    "북구 첨단자동차매매단지",
    "서구 자동차매매단지",
    "광산구 자동차매매단지",
    "기타",
  ],
};

const S: React.CSSProperties = {
  width: "100%", padding: "13px 16px", border: "1.5px solid #E0DDD7",
  borderRadius: 10, fontSize: 14, fontFamily: "'NanumSquareRound',sans-serif",
  background: "white", outline: "none", boxSizing: "border-box",
};
const LBL: React.CSSProperties = { fontSize: 12, fontWeight: 800, display: "block", marginBottom: 6, color: "#333" };

/* ── 약관 텍스트 ── */
const TERMS_FIXCAR = `제1조 (목적)
이 약관은 픽스카(fixcar.kr)에서 제공하는 중고차 플랫폼 관련 서비스를 이용함에 있어 픽스카와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
① "픽스카"란 픽스카가 운영하는 중고차 정찰제 플랫폼(fixcar.kr)을 말합니다.
② "서비스"란 픽스카가 제공하는 중고차 매매 중개 및 관련 부대서비스를 말합니다.
③ "딜러 회원"이란 픽스카에 매물을 등록하고 고객과 거래를 진행하는 자동차매매업 종사자를 말합니다.

제3조 (약관의 효력 및 변경)
① 픽스카는 이 약관의 내용을 서비스 초기화면에 게시합니다.
② 픽스카는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 개정 7일 전 공지합니다.

제4조 (서비스 이용)
① 딜러 회원은 FIX 정찰가 원칙을 준수하여야 합니다.
② 허위 매물 등록은 즉시 삭제되며 이용 제한 조치가 취해집니다.
③ 매물 사진은 실제 차량의 사진이어야 하며 타 차량 사진 도용은 금지됩니다.

제5조 (딜러 회원의 의무)
딜러 회원은 다음 행위를 하여서는 안 됩니다.
1. 허위 차량 정보 등록
2. FIX 정찰가 외 추가 요금 청구
3. 판매 완료 매물 미삭제
4. 다른 회원의 정보 도용
5. 자동화 프로그램을 통한 서버 과부하 유발

제6조 (분쟁 처리)
픽스카와 이용자 간 발생한 분쟁은 광주지방법원을 관할 법원으로 합니다.

부칙: 이 약관은 서비스 오픈일부터 적용됩니다.`;

const PRIVACY_FIXCAR = `픽스카(fixcar.kr) 개인정보처리방침

픽스카는 이용자의 개인정보를 보호하기 위해 다음과 같이 개인정보처리방침을 수립합니다.

1. 수집하는 개인정보 항목
필수: 이름, 생년월일, 휴대폰번호, 상사명, 사업자번호, 매매사원증번호, 주소
선택: 이메일, 광고성 정보 수신 동의

2. 개인정보 수집 목적
- 딜러 회원 가입 및 서비스 제공
- 본인 확인 및 부정 이용 방지
- 서비스 개선 및 고지사항 전달

3. 개인정보 보유 기간
- 회원 탈퇴 시까지 (단, 관련 법령에 따른 보존 기간 준수)
- 계약 관련 기록: 5년 (전자상거래법)
- 소비자 불만 기록: 3년 (전자상거래법)

4. 개인정보 제3자 제공
이용자 동의 없이 제3자에게 제공하지 않습니다.
단, 법령에 의한 경우는 예외로 합니다.

5. 이용자 권리
이용자는 언제든지 개인정보 열람, 정정, 삭제를 요청할 수 있습니다.
문의: help@fixcar.kr

개인정보 보호책임자: 픽스카 대표 (help@fixcar.kr)`;

const CLEAN_FIXCAR = `클린픽스카 규정

픽스카에 딜러로 가입 신청하시는 분께 차량 광고등록 제한사항을 안내합니다.

■ 광고 제한 차량
1. 허위매물로 신고 접수 후 관리자 확인된 차량
2. 딜러 회원이 개인 ID를 생성하여 등록한 개인 위장 매물
3. 차량 실소유주에게 허위매물로 신고된 차량
4. 판매 완료 후 삭제하지 않은 차량
5. 이용정지 중 등록되어 있는 차량
6. 딜러가 소속된 매매단지 외 타 단지 차량
7. 실소유주 또는 동일 상사 직원이 감가 사유 없이 현저히 낮은 금액으로 광고한 차량
8. FIX 정찰가를 준수하지 않는 차량
9. 사진상 차량번호와 등록 차량번호가 다른 차량
10. 실제와 다른 개인정보를 입력한 회원의 모든 차량
※ 신고 접수 후 7일 이내 소명 가능, 이후 삭제 불가

■ 이용 정지 기준
- 1년 이용 정지
1) 허위매물 등록자로 확인된 경우
2) 허위매물 신고 5회 이상
3) 불법 자동화 프로그램 사용 적발
4) 게시판 내 과도한 매입 광고
5) 타인 연락처 도용

- 영구 이용 정지
1) 이용정지 중 다른 ID로 차량 등록 또는 시도
2) 이용정지자 정보 사용 또는 시도
3) 명백한 사기행위, 공서양속에 반하는 행위
4) 이용정지 2회 누적
5) 허위매물 신고 4회 이상 누적 시 환불 후 영구 이용정지

■ 상사 제한
동일 상사에서 이용정지자 3명 이상 발생 시:
1) 해당 상사 차량 전체 광고 등록 제한
2) 해당 상사 소속 회원 전체 이용 제한
※ 명백한 사기행위 확인 시 정지자 수 무관하게 상사 제한 가능

■ 개인정보 도용
타인 정보를 도용하여 ID 생성 시 영구 제명 및 형사고발
(주민등록법 제21조 2항 9호: 3년 이하 징역 또는 1천만 원 이하 벌금)`;

/* ── 메인 컴포넌트 ── */
export default function DealerApplyPage() {
  const [mode, setMode] = useState<"landing"|"apply"|"done">("landing");
  const [step, setStep] = useState(1); /* 1: 약관동의, 2: 정보입력 */

  /* 약관 동의 */
  const [agreeAll,        setAgreeAll]        = useState(false);
  const [agreeTerms,      setAgreeTerms]      = useState(false);
  const [agreePrivacy,    setAgreePrivacy]    = useState(false);
  const [agreeClean,      setAgreeClean]      = useState(false);
  const [agreeMarketing,  setAgreeMarketing]  = useState(false);
  const [agreeNonMember,  setAgreeNonMember]  = useState(false);
  const [expandedTerm,    setExpandedTerm]    = useState<string|null>(null);

  /* 개인 정보 */
  const [name,      setName]      = useState("");
  const [phone,     setPhone]     = useState("");
  const [birthdate, setBirthdate] = useState("");

  /* 상사 정보 */
  const [assocName,   setAssocName]   = useState("");
  const [complexName, setComplexName] = useState("");
  const [shopName,    setShopName]    = useState("");
  const [shopPhone,   setShopPhone]   = useState("");
  const [shopAddr,    setShopAddr]    = useState("");
  const [bizNum,      setBizNum]      = useState("");
  const [licenseNum,  setLicenseNum]  = useState("");

  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  const complexList = assocName ? (ASSOCIATION_DATA[assocName] || []) : [];

  /* 전체 동의 토글 */
  const toggleAll = (v: boolean) => {
    setAgreeAll(v); setAgreeTerms(v); setAgreePrivacy(v);
    setAgreeClean(v); setAgreeMarketing(v); setAgreeNonMember(v);
  };
  const updateAll = (terms:boolean,priv:boolean,clean:boolean,mkt:boolean,nm:boolean) => {
    setAgreeAll(terms&&priv&&clean&&mkt&&nm);
  };

  /* Step 1 → Step 2 */
  const goStep2 = () => {
    if (!agreeTerms || !agreePrivacy || !agreeClean) {
      setErr("필수 약관에 동의해주세요"); return;
    }
    setErr(""); setStep(2);
  };

  /* 최종 제출 */
  const handleSubmit = async () => {
    setErr("");
    if (!name.trim())       { setErr("이름을 입력해주세요"); return; }
    if (!phone.trim())      { setErr("휴대폰번호를 입력해주세요"); return; }
    if (!birthdate.trim())  { setErr("생년월일을 입력해주세요"); return; }
    if (!assocName)         { setErr("조합명을 선택해주세요"); return; }
    if (!complexName)       { setErr("소속 매매단지를 선택해주세요"); return; }
    if (!shopName.trim())   { setErr("상사 상호명을 입력해주세요"); return; }
    if (!shopPhone.trim())  { setErr("상사 전화번호를 입력해주세요"); return; }
    if (!bizNum.trim())     { setErr("사업자등록번호를 입력해주세요"); return; }
    if (!licenseNum.trim()) { setErr("매매사원증번호를 입력해주세요"); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/dealer/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone: phone.replace(/[^0-9]/g,""), birthdate: birthdate.replace(/-/g,""),
          associationName: assocName, complexName, shopName,
          shopPhone: shopPhone.replace(/[^0-9]/g,""), shopAddr, bizNum, licenseNumber: licenseNum,
          agreeTerms, agreePrivacy, agreeClean, agreeMarketing, agreeNonMember,
        }),
      });
      const d = await res.json();
      if (d.success) setMode("done");
      else setErr(d.error || "신청 실패. 다시 시도해주세요");
    } catch { setErr("네트워크 오류"); }
    setSaving(false);
  };

  /* ── 완료 화면 ── */
  if (mode === "done") return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus,select:focus,textarea:focus{outline:none;border-color:#0066FF!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 20px"}}>
        <div style={{textAlign:"center",maxWidth:440}}>
          <div style={{fontSize:60,marginBottom:16}}>🎉</div>
          <h2 style={{fontSize:26,fontWeight:800,marginBottom:10}}>딜러 입점 신청 완료!</h2>
          <p style={{fontSize:14,color:"#888",lineHeight:1.8,marginBottom:28}}>
            신청이 접수되었습니다.<br/>
            픽스카 담당자가 <b>3일 이내</b>에 연락드릴게요.<br/>
            방문 검증 후 최종 승인됩니다.
          </p>
          <div style={{background:"#EEF5FF",borderRadius:16,padding:"20px",marginBottom:24,textAlign:"left"}}>
            <div style={{fontSize:13,fontWeight:800,color:"#0066FF",marginBottom:10}}>📋 다음 절차</div>
            {["담당자 전화 연락 (3일 이내)","현장 방문 검증","최종 승인 후 매물 등록 가능","6개월 무료 등록 혜택 적용"].map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",fontSize:13,color:"#444"}}>
                <span style={{width:20,height:20,borderRadius:"50%",background:"#0066FF",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,flexShrink:0}}>{i+1}</span>
                {s}
              </div>
            ))}
          </div>
          <Link href="/"><button style={{width:"100%",padding:"16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>홈으로 돌아가기</button></Link>
        </div>
      </div>
    </>
  );

  /* ── 신청 폼 ── */
  if (mode === "apply") return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus,select:focus,textarea:focus{outline:none;border-color:#0066FF!important;} .term-box{max-height:160px;overflow-y:auto;background:#F8F7F4;border-radius:10px;padding:14px;font-size:11px;line-height:1.8;color:#555;white-space:pre-line;margin-top:8px;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        {/* 헤더 */}
        <div style={{background:"white",borderBottom:"1px solid #DDEEFF",padding:"16px 24px"}}>
          <div style={{maxWidth:640,margin:"0 auto"}}>
            <button onClick={()=>step===1?setMode("landing"):setStep(1)} style={{display:"flex",alignItems:"center",gap:4,fontSize:13,color:"#888",background:"none",border:"none",cursor:"pointer",marginBottom:8,fontFamily:"'NanumSquareRound',sans-serif"}}>
              <ChevronLeft size={14}/>{step===1?"딜러 입점 안내로":"약관동의로"}
            </button>
            <h1 style={{fontSize:20,fontWeight:800}}>딜러 입점 신청</h1>
            <div style={{display:"flex",gap:6,marginTop:10}}>
              {["약관동의","정보입력"].map((s,i)=>(
                <div key={i} style={{flex:1}}>
                  <div style={{height:4,borderRadius:2,background:step===i+1?"#0066FF":step>i+1?"rgba(0,102,255,0.3)":"#E0E8F0",marginBottom:4}}/>
                  <span style={{fontSize:10,fontWeight:step===i+1?800:500,color:step===i+1?"#0066FF":"#AAA"}}>{i+1}. {s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{maxWidth:640,margin:"0 auto",padding:"24px 16px 100px"}}>

          {/* ══ STEP 1: 약관동의 ══ */}
          {step===1&&(
            <div style={{background:"white",borderRadius:20,padding:"28px 24px"}}>
              <h2 style={{fontSize:17,fontWeight:800,marginBottom:20}}>📋 약관 동의</h2>

              {/* 전체 동의 */}
              <label style={{display:"flex",alignItems:"center",gap:10,padding:"16px",background:agreeAll?"#EEF5FF":"#F8F7F4",borderRadius:12,marginBottom:16,cursor:"pointer",border:agreeAll?"2px solid #0066FF":"2px solid transparent"}}>
                <input type="checkbox" checked={agreeAll} onChange={e=>{toggleAll(e.target.checked);}} style={{width:18,height:18,accentColor:"#0066FF",cursor:"pointer"}}/>
                <span style={{fontSize:15,fontWeight:800,color:agreeAll?"#0066FF":"#1A1A1A"}}>전체 동의하기 (필수/선택 포함)</span>
              </label>

              {/* 개별 약관 */}
              {[
                { key:"terms",    label:"이용약관 (필수)",                    required:true,  val:agreeTerms,    set:setAgreeTerms,    content:TERMS_FIXCAR },
                { key:"privacy",  label:"개인정보 수집 및 이용 동의 (필수)",  required:true,  val:agreePrivacy,  set:setAgreePrivacy,  content:PRIVACY_FIXCAR },
                { key:"clean",    label:"클린픽스카 규정 동의 (필수)",         required:true,  val:agreeClean,    set:setAgreeClean,    content:CLEAN_FIXCAR },
                { key:"mkt",      label:"마케팅 목적 개인정보 수집 및 이용 동의 (선택)", required:false, val:agreeMarketing, set:setAgreeMarketing, content:"경품 발송, 이벤트 홍보, 맞춤 차량 및 서비스 추천 등에 활용됩니다.\n보유 기간: 회원 탈퇴 시 또는 동의 철회 시" },
                { key:"nm",       label:"비회원 수집 데이터 활용 동의 (선택)", required:false, val:agreeNonMember,set:setAgreeNonMember, content:"비회원 방문 데이터(앱ID, 방문일시, 서비스 이용기록)를 마케팅 목적 개인정보와 결합하여 맞춤 서비스 제공에 활용합니다.\n보유 기간: 동의 철회 시 또는 회원 탈퇴 시" },
              ].map(item=>(
                <div key={item.key} style={{marginBottom:10,border:"1.5px solid #E8E6E1",borderRadius:12,overflow:"hidden"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",cursor:"pointer"}} onClick={()=>setExpandedTerm(expandedTerm===item.key?null:item.key)}>
                    <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",flex:1}} onClick={e=>e.stopPropagation()}>
                      <input type="checkbox" checked={item.val} onChange={e=>{
                        item.set(e.target.checked);
                        const vals = { terms:agreeTerms, privacy:agreePrivacy, clean:agreeClean, mkt:agreeMarketing, nm:agreeNonMember, [item.key]:e.target.checked };
                        updateAll(item.key==="terms"?e.target.checked:agreeTerms, item.key==="privacy"?e.target.checked:agreePrivacy, item.key==="clean"?e.target.checked:agreeClean, item.key==="mkt"?e.target.checked:agreeMarketing, item.key==="nm"?e.target.checked:agreeNonMember);
                      }} style={{width:16,height:16,accentColor:"#0066FF",cursor:"pointer"}}/>
                      <span style={{fontSize:13,fontWeight:600,color:item.val?"#0066FF":"#444"}}>{item.label}</span>
                    </label>
                    <span style={{fontSize:11,color:"#AAA"}}>{expandedTerm===item.key?"▲":"▼"} 보기</span>
                  </div>
                  {expandedTerm===item.key&&(
                    <div className="term-box">{item.content}</div>
                  )}
                </div>
              ))}

              {err&&<div style={{fontSize:13,color:"#E24B4A",fontWeight:600,marginTop:10}}>⚠️ {err}</div>}

              <button onClick={goStep2} style={{width:"100%",padding:"16px",background:"#0066FF",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",marginTop:20}}>
                다음 <ChevronRight size={16} style={{verticalAlign:"middle"}}/>
              </button>
            </div>
          )}

          {/* ══ STEP 2: 정보입력 ══ */}
          {step===2&&(
            <div>
              {/* 개인 정보 */}
              <div style={{background:"white",borderRadius:20,padding:"28px 24px",marginBottom:12}}>
                <h2 style={{fontSize:17,fontWeight:800,marginBottom:20}}>👤 개인 정보</h2>
                <div style={{marginBottom:14}}>
                  <label style={LBL}>이름 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="실명 입력" style={S}/>
                </div>
                <div style={{marginBottom:14}}>
                  <label style={LBL}>생년월일 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <input value={birthdate} onChange={e=>setBirthdate(e.target.value.replace(/[^0-9]/g,""))} placeholder="19960101 (8자리)" maxLength={8} style={S}/>
                </div>
                <div style={{marginBottom:0}}>
                  <label style={LBL}>휴대폰번호 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <input value={phone} onChange={e=>setPhone(e.target.value.replace(/[^0-9]/g,""))} placeholder="01012345678" maxLength={11} style={S}/>
                </div>
              </div>

              {/* 상사 정보 */}
              <div style={{background:"white",borderRadius:20,padding:"28px 24px",marginBottom:12}}>
                <h2 style={{fontSize:17,fontWeight:800,marginBottom:20}}>🏪 상사 정보</h2>

                <div style={{marginBottom:14}}>
                  <label style={LBL}>조합명 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <select value={assocName} onChange={e=>{setAssocName(e.target.value);setComplexName("");}} style={S}>
                    <option value="">조합명을 선택해주세요</option>
                    {Object.keys(ASSOCIATION_DATA).map(a=><option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div style={{marginBottom:14}}>
                  <label style={LBL}>소속 매매단지 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <select value={complexName} onChange={e=>setComplexName(e.target.value)} style={S} disabled={!assocName}>
                    <option value="">조합명을 먼저 선택해주세요</option>
                    {complexList.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{marginBottom:14}}>
                  <label style={LBL}>상사 상호명 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <input value={shopName} onChange={e=>setShopName(e.target.value)} placeholder="상사 상호명 입력" style={S}/>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                  <div>
                    <label style={LBL}>상사 전화번호 <span style={{color:"#FF3B1E"}}>*</span></label>
                    <input value={shopPhone} onChange={e=>setShopPhone(e.target.value.replace(/[^0-9]/g,""))} placeholder="062XXXXXXX" style={S}/>
                  </div>
                  <div>
                    <label style={LBL}>상사 팩스번호</label>
                    <input placeholder="062XXXXXXX (선택)" style={S}/>
                  </div>
                </div>

                <div style={{marginBottom:14}}>
                  <label style={LBL}>상사 주소</label>
                  <input value={shopAddr} onChange={e=>setShopAddr(e.target.value)} placeholder="상세주소 입력" style={S}/>
                </div>

                <div style={{marginBottom:14}}>
                  <label style={LBL}>사업자등록번호 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <input value={bizNum} onChange={e=>setBizNum(e.target.value.replace(/[^0-9]/g,""))} placeholder="-제외하고 숫자만 입력" maxLength={10} style={S}/>
                  <div style={{fontSize:11,color:"#AAA",marginTop:4}}>사업자등록번호, 상호명, 전화번호를 허위 입력 시 이용에 제한이 있을 수 있습니다.</div>
                </div>

                <div style={{marginBottom:0}}>
                  <label style={LBL}>매매사원증번호 <span style={{color:"#FF3B1E"}}>*</span></label>
                  <input value={licenseNum} onChange={e=>setLicenseNum(e.target.value)} placeholder="예: 11-123-12345, 050-12345" style={S}/>
                  <div style={{fontSize:11,color:"#AAA",marginTop:4}}>자동차매매업 종사원증에 기재된 번호를 입력해주세요.</div>
                </div>
              </div>

              {/* 안내 */}
              <div style={{background:"#FFF8EC",border:"1px solid #F0D88A",borderRadius:14,padding:"16px 18px",marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:800,color:"#B8860B",marginBottom:6}}>📌 신청 안내</div>
                <div style={{fontSize:12,color:"#886600",lineHeight:1.8}}>
                  • 신청 후 담당자가 <b>3일 이내</b> 연락드립니다<br/>
                  • 현장 방문 검증 후 최종 승인됩니다<br/>
                  • 승인 후 <b>6개월 무료 등록</b> 혜택이 적용됩니다
                </div>
              </div>

              {err&&<div style={{fontSize:13,color:"#E24B4A",fontWeight:600,marginBottom:10}}>⚠️ {err}</div>}

              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>{setStep(1);setErr("");}} style={{padding:"16px 20px",background:"white",border:"1.5px solid #E0DDD7",borderRadius:14,fontSize:14,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                  <ChevronLeft size={14} style={{verticalAlign:"middle"}}/> 이전
                </button>
                <button onClick={handleSubmit} disabled={saving} style={{flex:1,padding:"16px",background:saving?"#CCC":"#0066FF",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:saving?"wait":"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                  {saving?"신청 중...":"입점 신청하기"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  /* ── 랜딩 페이지 ── */
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        {/* 히어로 */}
        <div style={{background:"linear-gradient(135deg,#0055FF,#003399)",padding:"60px 24px",textAlign:"center",color:"white",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-20,bottom:-30,fontFamily:"'Bebas Neue',serif",fontSize:"clamp(80px,15vw,180px)",color:"rgba(255,255,255,0.08)",lineHeight:1,pointerEvents:"none"}}>DEALER</div>
          <div style={{position:"relative",zIndex:1,maxWidth:700,margin:"0 auto"}}>
            <div style={{fontSize:11,fontWeight:800,letterSpacing:4,color:"rgba(255,255,255,0.6)",marginBottom:12}}>FIXCAR DEALER PARTNER</div>
            <h1 style={{fontSize:"clamp(26px,5vw,42px)",fontWeight:800,marginBottom:12,lineHeight:1.3}}>광주 1등 중고차 플랫폼<br/>픽스카와 함께하세요</h1>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.7)",lineHeight:1.8,marginBottom:28}}>선착순 20개 딜러 한정<br/>오픈 프로모션 무료등록 진행 중!</p>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={()=>setMode("apply")} style={{padding:"18px 36px",background:"white",color:"#0055FF",border:"none",borderRadius:100,fontSize:17,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                온라인 입점 신청 →
              </button>
              <a href="tel:010-0000-4989"><button style={{padding:"18px 36px",background:"transparent",color:"white",border:"2px solid rgba(255,255,255,0.5)",borderRadius:100,fontSize:17,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"inline-flex",alignItems:"center",gap:8}}>
                <Phone size={16}/>전화 문의
              </button></a>
            </div>
          </div>
        </div>

        <div style={{maxWidth:800,margin:"0 auto",padding:"48px 24px 80px"}}>
          {/* 혜택 */}
          <h2 style={{fontSize:22,fontWeight:800,textAlign:"center",marginBottom:28}}>왜 픽스카인가요?</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:48}}>
            {[
              {emoji:"📈",title:"매출 성장",desc:"FIX 정찰가로 신뢰도 UP! 계약 전환율 향상",color:"#FF3B1E"},
              {emoji:"🎯",title:"신규 고객",desc:"AI 매칭으로 딱 맞는 고객 자동 연결",color:"#0066FF"},
              {emoji:"🛡️",title:"인증 딜러 마크",desc:"픽스카 검증 딜러 인증으로 고객 신뢰 확보",color:"#2D8A52"},
              {emoji:"🎁",title:"무료 프로모션",desc:"판매량 증가할 때까지 등록비 무료!",color:"#E8A020"},
            ].map(b=>(
              <div key={b.title} style={{background:"white",borderRadius:18,padding:"24px 20px"}}>
                <div style={{fontSize:28,marginBottom:10}}>{b.emoji}</div>
                <h3 style={{fontSize:16,fontWeight:800,marginBottom:6,color:b.color}}>{b.title}</h3>
                <p style={{fontSize:12,color:"#888",lineHeight:1.7}}>{b.desc}</p>
              </div>
            ))}
          </div>

          {/* 입점 조건 */}
          <div style={{background:"white",borderRadius:20,padding:"28px 24px",marginBottom:24}}>
            <h3 style={{fontSize:18,fontWeight:800,marginBottom:16}}>📋 입점 조건</h3>
            {[
              "자동차매매업 사업자등록증 보유",
              "자동차매매업 종사원증(매매사원증) 보유",
              "광주광역시 내 매매단지 소속",
              "FIX 정찰가 원칙 준수 동의",
              "픽스카 직접 방문 검증 동의",
            ].map((item,i,arr)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",borderBottom:i<arr.length-1?"1px solid #F0EEE9":"none"}}>
                <CheckCircle size={16} color="#2D8A52" style={{flexShrink:0}}/>
                <span style={{fontSize:13,fontWeight:600}}>{item}</span>
              </div>
            ))}
          </div>

          {/* 신청 CTA */}
          <div style={{background:"#1A1A1A",borderRadius:20,padding:"32px 28px",textAlign:"center",color:"white",marginBottom:16}}>
            <h3 style={{fontSize:20,fontWeight:800,marginBottom:8}}>지금 바로 입점 신청하세요</h3>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:20}}>온라인 신청 → 담당자 연락(3일 이내) → 방문 검증 → 입점 완료</p>
            <button onClick={()=>setMode("apply")} style={{padding:"16px 40px",background:"#0066FF",color:"white",border:"none",borderRadius:100,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",marginBottom:12,display:"block",width:"100%"}}>
              온라인 입점 신청하기
            </button>
            <a href="tel:010-0000-4989" style={{display:"block"}}>
              <button style={{width:"100%",padding:"14px 36px",background:"transparent",color:"rgba(255,255,255,0.7)",border:"1.5px solid rgba(255,255,255,0.2)",borderRadius:100,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <Phone size={14}/>전화 문의: 010-0000-4989
              </button>
            </a>
          </div>

          {/* 픽스카 약속 */}
          <div style={{background:"#EEF5FF",borderRadius:16,padding:"20px 20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <Shield size={16} color="#0066FF"/>
              <span style={{fontSize:13,fontWeight:800,color:"#0066FF"}}>픽스카의 약속</span>
            </div>
            <div style={{fontSize:12,color:"#555",lineHeight:1.8}}>
              • 불합리한 광고비 없음 — 판매량 증가할 때까지 무료<br/>
              • 허위매물 ZERO 정책으로 딜러 브랜드 가치 보호<br/>
              • 담당 매니저가 1:1로 매물 등록 지원
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
