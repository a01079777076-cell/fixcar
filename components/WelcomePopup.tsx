"use client";
import { useState, useEffect } from "react";

export default function WelcomePopup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");

  useEffect(()=>{
    /* 이미 표시했으면 스킵 */
    if(sessionStorage.getItem("fixcar_welcome_shown")) return;
    /* 1.5초 딜레이 후 세션 확인 */
    const timer = setTimeout(()=>{
      fetch("/api/auth/session").then(r=>r.json()).then(d=>{
        if(d?.user?.id){
          const lastWelcome = localStorage.getItem("fixcar_no_welcome");
          if(lastWelcome==="true") return;
          setName(d.user.nickname||d.user.name||"");
          setShow(true);
          sessionStorage.setItem("fixcar_welcome_shown","true");
        }
      }).catch(()=>{});
    },1500);
    return ()=>clearTimeout(timer);
  },[]);

  const [noMore, setNoMore] = useState(false);
  const handleClose = () => {
    setShow(false);
    if(noMore) localStorage.setItem("fixcar_no_welcome","true");
  };

  if(!show) return null;
  return (
    <>
      <div onClick={handleClose} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.4)",zIndex:99999}}/>
      <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"white",borderRadius:24,padding:"36px 28px",width:"min(380px,88vw)",zIndex:100000,textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <div style={{fontSize:48,marginBottom:12}}>🎉</div>
        <h2 style={{fontSize:22,fontWeight:800,marginBottom:6}}>환영합니다!</h2>
        <p style={{fontSize:14,color:"#888",lineHeight:1.8,marginBottom:20}}>{name}님, 픽스카에 오신 걸 환영해요!<br/>FIX 정찰가로 믿을 수 있는 중고차를 만나보세요.</p>
        <button onClick={handleClose} style={{width:"100%",padding:"16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",marginBottom:12}}>확인</button>
        <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,cursor:"pointer",fontSize:12,color:"#CCC"}}>
          <input type="checkbox" checked={noMore} onChange={e=>setNoMore(e.target.checked)} style={{accentColor:"#FF3B1E"}}/>앞으로 띄우지 않습니다
        </label>
      </div>
    </>
  );
}
