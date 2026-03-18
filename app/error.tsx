"use client";
import { useState } from "react";
import { Home, RefreshCw, AlertTriangle, Send } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [desc, setDesc] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    await fetch("/api/errors/report", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ type:"500", url:typeof window!=="undefined"?window.location.href:"", desc, errorMessage:error?.message||"" }),
    });
    setSent(true); setShowForm(false);
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button,input,textarea{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 32px",textAlign:"center"}}>
        <div style={{position:"relative",marginBottom:"20px"}}>
          <div style={{fontFamily:"'Bebas Neue',serif",fontSize:"clamp(80px,15vw,160px)",color:"#E0DDD7",lineHeight:1,letterSpacing:"-3px"}}>500</div>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:"40px"}}>⚙️</div>
        </div>
        <h1 style={{fontSize:"clamp(20px,4vw,32px)",fontWeight:800,letterSpacing:"-1px",marginBottom:"10px"}}>서버에서 오류가 발생했어요</h1>
        <p style={{fontSize:"15px",color:"#888",lineHeight:1.8,fontWeight:400,maxWidth:"380px",marginBottom:"28px"}}>
          일시적인 오류예요. 잠시 후 다시 시도하거나<br/>아래 버튼으로 오류를 신고해 주세요.
        </p>
        {error?.message&&<div style={{background:"#FFF8EC",border:"1px solid #FFD89A",borderRadius:"10px",padding:"10px 16px",marginBottom:"20px",fontSize:"13px",color:"#7A5500",maxWidth:"400px",fontWeight:400,wordBreak:"break-all"}}>{error.message}</div>}
        <div style={{display:"flex",gap:"10px",marginBottom:"24px",flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={reset} style={{background:"#FF3B1E",color:"white",border:"none",padding:"13px 24px",borderRadius:"12px",fontSize:"14px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:"7px"}}><RefreshCw size={15}/>다시 시도</button>
          <a href="/"><button style={{background:"white",color:"#1A1A1A",border:"1.5px solid #E0DDD7",padding:"13px 24px",borderRadius:"12px",fontSize:"14px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"7px"}}><Home size={15}/>홈으로</button></a>
        </div>
        {sent?(
          <div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:"12px",padding:"13px 20px",fontSize:"14px",fontWeight:700,color:"#2D8A52"}}>✅ 오류가 신고됐어요! 빠르게 확인할게요.</div>
        ):!showForm?(
          <button onClick={()=>setShowForm(true)} style={{background:"transparent",color:"#AAA",border:"1px solid #E0DDD7",padding:"9px 20px",borderRadius:"100px",fontSize:"13px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"}}>
            <AlertTriangle size={13}/>오류 신고하기
          </button>
        ):(
          <div style={{background:"white",borderRadius:"16px",padding:"20px 24px",maxWidth:"400px",width:"100%",textAlign:"left"}}>
            <div style={{fontSize:"15px",fontWeight:800,marginBottom:"12px"}}>오류 정정 제출</div>
            <textarea rows={3} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="어떤 동작을 하다 오류가 났나요?" style={{width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"8px",padding:"10px 12px",fontSize:"13px",resize:"none",outline:"none",marginBottom:"10px"}}/>
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={handleSend} style={{flex:1,background:"#1847FF",color:"white",border:"none",padding:"11px",borderRadius:"8px",fontSize:"13px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"5px"}}><Send size={13}/>제출</button>
              <button onClick={()=>setShowForm(false)} style={{background:"#F0EEE9",color:"#555",border:"none",padding:"11px 16px",borderRadius:"8px",fontSize:"13px",fontWeight:700,cursor:"pointer"}}>취소</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
