"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Send, CheckCircle, Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", type:"구매문의", message:"" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name||!form.message) { alert("이름과 문의 내용을 입력해주세요"); return; }
    setSending(true);
    await fetch("/api/contact", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) }).catch(()=>{});
    setDone(true); setSending(false);
  };

  const inp = { width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"11px 14px", fontSize:"14px", background:"#FAFAF8", fontFamily:"'NanumSquareRound',sans-serif", outline:"none" } as const;

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} button,input,select,textarea{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} input:focus,select:focus,textarea:focus{border-color:#FF3B1E!important;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#1A1A1A",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"800px",margin:"0 auto"}}>
            <h1 style={{fontSize:"clamp(22px,4vw,40px)",fontWeight:800,color:"white",letterSpacing:"-1px"}}>고객센터 · 1:1 문의</h1>
          </div>
        </div>
        <div style={{maxWidth:"800px",margin:"0 auto",padding:"28px 32px 80px",display:"grid",gridTemplateColumns:"1fr 1.6fr",gap:"20px",alignItems:"start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            {[{icon:<Phone size={18} color="#FF3B1E"/>,label:"전화",val:"062-000-0000"},{icon:<Mail size={18} color="#1847FF"/>,label:"이메일",val:"contact@fixcar.kr"},{icon:<MapPin size={18} color="#2D8A52"/>,label:"위치",val:"광주광역시"}].map(i=>(
              <div key={i.label} style={{background:"white",borderRadius:"14px",padding:"16px 18px",display:"flex",gap:"12px",alignItems:"center"}}>
                {i.icon}<div><div style={{fontSize:"11px",color:"#AAA",fontWeight:400}}>{i.label}</div><div style={{fontSize:"14px",fontWeight:700}}>{i.val}</div></div>
              </div>
            ))}
            <div style={{background:"#EEF2FF",border:"1px solid #B8C8FF",borderRadius:"14px",padding:"16px 18px",fontSize:"13px",color:"#1847FF",lineHeight:1.75,fontWeight:400}}>
              📌 평일 09:00~18:00<br/>주말·공휴일 휴무<br/>문의 후 24시간 내 답변
            </div>
          </div>

          {done ? (
            <div style={{background:"white",borderRadius:"18px",padding:"40px",textAlign:"center"}}>
              <CheckCircle size={48} color="#2D8A52" style={{margin:"0 auto 16px"}}/>
              <div style={{fontSize:"20px",fontWeight:800,marginBottom:"8px"}}>문의가 접수됐어요!</div>
              <div style={{fontSize:"14px",color:"#888",fontWeight:400}}>24시간 내로 답변드릴게요.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{background:"white",borderRadius:"18px",padding:"24px 26px",display:"flex",flexDirection:"column",gap:"12px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"4px"}}>이름 *</label><input style={inp} value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
                <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"4px"}}>이메일</label><input type="email" style={inp} value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/></div>
              </div>
              <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"4px"}}>연락처</label><input type="tel" placeholder="010-0000-0000" style={inp} value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/></div>
              <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"4px"}}>문의 유형</label>
                <select style={inp} value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
                  {["구매문의","딜러신청","환불요청","서비스오류","기타"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label style={{fontSize:"12px",fontWeight:800,display:"block",marginBottom:"4px"}}>문의 내용 *</label>
                <textarea rows={5} style={{...inp,resize:"vertical"}} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="궁금하신 점을 자유롭게 작성해주세요"/>
              </div>
              <button type="submit" disabled={sending} style={{background:sending?"#E0DDD7":"#FF3B1E",color:sending?"#AAA":"white",border:"none",padding:"14px",borderRadius:"10px",fontSize:"15px",fontWeight:800,cursor:sending?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
                <Send size={16}/>{sending?"전송 중...":"문의 전송"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
