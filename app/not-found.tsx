"use client";
import { useState } from "react";
import { Home, ArrowLeft, AlertTriangle, Send } from "lucide-react";

export default function NotFound() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ url: typeof window !== "undefined" ? window.location.href : "", desc: "" });
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    await fetch("/api/errors/report", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ type:"404", url:form.url, desc:form.desc }),
    });
    setSent(true);
    setShowForm(false);
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button,input,textarea{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 32px",textAlign:"center"}}>
        <div style={{position:"relative",marginBottom:"24px"}}>
          <div style={{fontFamily:"'Bebas Neue',serif",fontSize:"clamp(100px,20vw,200px)",color:"#E0DDD7",lineHeight:1,letterSpacing:"-5px"}}>404</div>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:"48px"}}>🚗</div>
        </div>
        <h1 style={{fontSize:"clamp(22px,4vw,36px)",fontWeight:800,letterSpacing:"-1px",marginBottom:"10px"}}>앗, 길을 잃었어요!</h1>
        <p style={{fontSize:"16px",color:"#888",lineHeight:1.8,fontWeight:400,maxWidth:"400px",marginBottom:"32px"}}>
          찾으시는 페이지가 없거나 이동됐어요.<br/>주소를 다시 확인하거나 홈으로 돌아가세요.
        </p>
        <div style={{display:"flex",gap:"12px",marginBottom:"32px",flexWrap:"wrap",justifyContent:"center"}}>
          <a href="/"><button style={{background:"#FF3B1E",color:"white",border:"none",padding:"14px 28px",borderRadius:"12px",fontSize:"15px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:"8px"}}><Home size={16}/> 홈으로</button></a>
          <button onClick={()=>window.history.back()} style={{background:"white",color:"#1A1A1A",border:"1.5px solid #E0DDD7",padding:"14px 28px",borderRadius:"12px",fontSize:"15px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"8px"}}><ArrowLeft size={16}/> 뒤로가기</button>
        </div>
        {sent ? (
          <div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:"12px",padding:"14px 20px",fontSize:"14px",fontWeight:700,color:"#2D8A52"}}>✅ 오류가 관리자에게 전달됐어요!</div>
        ) : !showForm ? (
          <button onClick={()=>setShowForm(true)} style={{background:"transparent",color:"#AAA",border:"1px solid #E0DDD7",padding:"10px 20px",borderRadius:"100px",fontSize:"13px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"}}>
            <AlertTriangle size={13}/> 오류 신고하기
          </button>
        ) : (
          <div style={{background:"white",borderRadius:"16px",padding:"20px 24px",maxWidth:"420px",width:"100%",textAlign:"left"}}>
            <div style={{fontSize:"15px",fontWeight:800,marginBottom:"14px"}}>오류 정정 제출</div>
            <div style={{marginBottom:"10px"}}>
              <label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"4px",color:"#888"}}>발생한 URL</label>
              <input value={form.url} onChange={e=>setForm(p=>({...p,url:e.target.value}))} style={{width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"8px",padding:"9px 12px",fontSize:"13px",outline:"none"}}/>
            </div>
            <div style={{marginBottom:"14px"}}>
              <label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"4px",color:"#888"}}>오류 내용 (선택)</label>
              <textarea rows={3} value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))} placeholder="어떤 오류가 발생했나요?" style={{width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"8px",padding:"9px 12px",fontSize:"13px",resize:"none",outline:"none"}}/>
            </div>
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={handleSend} style={{flex:1,background:"#1847FF",color:"white",border:"none",padding:"12px",borderRadius:"8px",fontSize:"14px",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>
                <Send size={14}/> 제출하기
              </button>
              <button onClick={()=>setShowForm(false)} style={{background:"#F0EEE9",color:"#555",border:"none",padding:"12px 16px",borderRadius:"8px",fontSize:"14px",fontWeight:700,cursor:"pointer"}}>취소</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
