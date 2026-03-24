"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { User, Lock, Trash2, Bell, Shield, ChevronRight, LogOut } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<"main"|"nickname"|"password"|"delete">("main");
  const [nickname, setNickname] = useState("");
  const [nickInfo, setNickInfo] = useState<{nickname:string|null;canChange:boolean;daysLeft:number}>({nickname:null,canChange:true,daysLeft:0});
  const [oldPw, setOldPw] = useState(""); const [newPw, setNewPw] = useState(""); const [newPwCheck, setNewPwCheck] = useState("");
  const [msg, setMsg] = useState(""); const [saving, setSaving] = useState(false);

  useEffect(()=>{
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if(!d?.user?.id){router.push("/login");return;}
      setUser(d.user);
      fetch("/api/user/nickname").then(r=>r.json()).then(n=>{setNickInfo(n);setNickname(n.nickname||"");}).catch(()=>{});
    }).catch(()=>router.push("/login"));
  },[router]);

  const saveNickname = async () => {
    if(nickname.length<2||nickname.length>12){setMsg("닉네임은 2~12자");return;}
    setSaving(true); setMsg("");
    const res = await fetch("/api/user/nickname",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nickname})});
    const d = await res.json();
    if(d.success){setMsg("✅ 닉네임 변경 완료!");setNickInfo({...nickInfo,nickname,canChange:false,daysLeft:15});}
    else setMsg(d.error||"실패");
    setSaving(false);
  };

  const changePw = async () => {
    if(!oldPw){setMsg("현재 비밀번호를 입력해주세요");return;}
    if(newPw.length<8){setMsg("새 비밀번호 8자 이상");return;}
    if(newPw!==newPwCheck){setMsg("비밀번호가 일치하지 않습니다");return;}
    setSaving(true); setMsg("");
    const res = await fetch("/api/user/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({oldPassword:oldPw,newPassword:newPw})});
    const d = await res.json();
    if(d.success){setMsg("✅ 비밀번호 변경 완료!");setOldPw("");setNewPw("");setNewPwCheck("");}
    else setMsg(d.error||"실패");
    setSaving(false);
  };

  const deleteAccount = async () => {
    if(!confirm("정말 탈퇴하시겠습니까?\n\n• 모든 데이터가 영구 삭제됩니다\n• 찜 목록, 문의 내역이 삭제됩니다\n• 이 작업은 되돌릴 수 없습니다")) return;
    if(!confirm("마지막 확인입니다.\n정말로 픽스카 계정을 삭제할까요?")) return;
    const res = await fetch("/api/user/delete",{method:"DELETE"});
    const d = await res.json();
    if(d.success){document.cookie="fixcar-token=;expires=Thu,01 Jan 1970 00:00:00 GMT;path=/";alert("탈퇴 완료. 이용해주셔서 감사합니다.");router.push("/");}
    else alert(d.error||"탈퇴 실패");
  };

  const inputS:React.CSSProperties = {width:"100%",padding:"14px 16px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif"};

  if(!user) return <><Navbar/><div style={{textAlign:"center",padding:100,color:"#CCC"}}>로딩 중...</div></>;

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:600,margin:"0 auto",padding:"28px 20px 100px"}}>
          <h1 style={{fontSize:24,fontWeight:800,marginBottom:20}}>⚙️ 설정</h1>

          {tab==="main"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {icon:User,label:"닉네임 변경",desc:nickInfo.nickname?`현재: ${nickInfo.nickname}`:"미설정",onClick:()=>{setTab("nickname");setMsg("");}},
                ...(user.provider!=="kakao"?[{icon:Lock,label:"비밀번호 변경",desc:"8자 이상 새 비밀번호",onClick:()=>{setTab("password");setMsg("");}}]:[]),
                {icon:Bell,label:"알림 설정",desc:"카카오톡·푸시 알림 (준비 중)",onClick:()=>alert("알림 설정은 준비 중입니다")},
                {icon:Shield,label:"개인정보 처리방침",desc:"",onClick:()=>router.push("/privacy")},
              ].map((m,i)=>{const Icon=m.icon;return(
                <button key={i} onClick={m.onClick} style={{width:"100%",padding:"18px 20px",background:"white",border:"none",borderRadius:14,display:"flex",alignItems:"center",gap:14,cursor:"pointer",textAlign:"left",fontFamily:"'NanumSquareRound',sans-serif"}}>
                  <Icon size={20} color="#888"/><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{m.label}</div>{m.desc&&<div style={{fontSize:12,color:"#AAA"}}>{m.desc}</div>}</div><ChevronRight size={16} color="#CCC"/>
                </button>
              );})}
              <div style={{height:20}}/>
              <button onClick={deleteAccount} style={{width:"100%",padding:"16px",background:"white",border:"1.5px solid #FFD4CC",borderRadius:14,fontSize:14,fontWeight:700,color:"#E24B4A",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'NanumSquareRound',sans-serif"}}><Trash2 size={16}/> 회원 탈퇴</button>
            </div>
          )}

          {tab==="nickname"&&(
            <div style={{background:"white",borderRadius:20,padding:"28px 26px"}}>
              <button onClick={()=>setTab("main")} style={{border:"none",background:"transparent",fontSize:13,color:"#888",cursor:"pointer",marginBottom:16}}>← 돌아가기</button>
              <h2 style={{fontSize:20,fontWeight:800,marginBottom:16}}>🏷️ 닉네임 변경</h2>
              {!nickInfo.canChange&&<div style={{background:"#FFF8EC",borderRadius:12,padding:"14px 16px",marginBottom:16,fontSize:13,color:"#B8860B"}}>⏰ {nickInfo.daysLeft}일 후에 변경 가능합니다</div>}
              <input value={nickname} onChange={e=>setNickname(e.target.value)} maxLength={12} placeholder="2~12자 닉네임" style={inputS} disabled={!nickInfo.canChange}/>
              <div style={{fontSize:11,color:"#CCC",marginTop:6,marginBottom:12}}>{nickname.length}/12자</div>
              {msg&&<div style={{fontSize:13,color:msg.startsWith("✅")?"#2D8A52":"#E24B4A",marginBottom:12}}>{msg}</div>}
              <button onClick={saveNickname} disabled={saving||!nickInfo.canChange} style={{width:"100%",padding:"16px",background:nickInfo.canChange?"#FF3B1E":"#CCC",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:nickInfo.canChange?"pointer":"not-allowed",fontFamily:"'NanumSquareRound',sans-serif"}}>{saving?"저장 중...":"닉네임 변경"}</button>
            </div>
          )}

          {tab==="password"&&(
            <div style={{background:"white",borderRadius:20,padding:"28px 26px"}}>
              <button onClick={()=>setTab("main")} style={{border:"none",background:"transparent",fontSize:13,color:"#888",cursor:"pointer",marginBottom:16}}>← 돌아가기</button>
              <h2 style={{fontSize:20,fontWeight:800,marginBottom:16}}>🔒 비밀번호 변경</h2>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <input type="password" value={oldPw} onChange={e=>setOldPw(e.target.value)} placeholder="현재 비밀번호" style={inputS}/>
                <input type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="새 비밀번호 (8자 이상)" style={inputS}/>
                <input type="password" value={newPwCheck} onChange={e=>setNewPwCheck(e.target.value)} placeholder="새 비밀번호 확인" style={inputS}/>
              </div>
              {newPwCheck&&<div style={{fontSize:12,color:newPw===newPwCheck?"#2D8A52":"#E24B4A",marginTop:8}}>{newPw===newPwCheck?"✓ 일치":"✕ 불일치"}</div>}
              {msg&&<div style={{fontSize:13,color:msg.startsWith("✅")?"#2D8A52":"#E24B4A",marginTop:8}}>{msg}</div>}
              <button onClick={changePw} disabled={saving} style={{width:"100%",padding:"16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",marginTop:16}}>{saving?"변경 중...":"비밀번호 변경"}</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
