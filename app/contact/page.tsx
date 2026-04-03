// 📁 저장 경로: app/contact/page.tsx
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({name:"",email:"",type:"일반문의",message:""});
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if(!form.name||!form.email||!form.message){alert("모든 항목을 입력해주세요.");return;}
    // TODO: 실제 이메일/API 연동
    setSent(true);
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus,select:focus,textarea:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"40px 24px 100px"}}>
          <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>📞 고객센터</h1>
          <p style={{fontSize:14,color:"#AAA",marginBottom:32}}>궁금한 점이나 불편 사항을 알려주세요.</p>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
            {[
              {icon:<Phone size={20}/>,label:"전화",value:"062-000-0000",sub:"평일 09:00~18:00"},
              {icon:<Mail size={20}/>,label:"이메일",value:"info@fixcar.kr",sub:"24시간 접수"},
              {icon:<MapPin size={20}/>,label:"주소",value:"광주광역시",sub:"방문 상담 가능"},
              {icon:<Clock size={20}/>,label:"운영시간",value:"평일 09:00~18:00",sub:"주말·공휴일 휴무"},
            ].map(v=>(
              <div key={v.label} style={{background:"white",borderRadius:14,padding:"20px 18px",display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{width:40,height:40,borderRadius:12,background:"#FFF0ED",display:"flex",alignItems:"center",justifyContent:"center",color:"#FF3B1E",flexShrink:0}}>{v.icon}</div>
                <div>
                  <div style={{fontSize:12,color:"#AAA",marginBottom:2}}>{v.label}</div>
                  <div style={{fontSize:15,fontWeight:800}}>{v.value}</div>
                  <div style={{fontSize:11,color:"#AAA"}}>{v.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{background:"white",borderRadius:18,padding:"28px 24px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
              <MessageCircle size={20} color="#FF3B1E"/>
              <h2 style={{fontSize:20,fontWeight:800}}>문의하기</h2>
            </div>
            {sent ? (
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <div style={{fontSize:48,marginBottom:12}}>✅</div>
                <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>문의가 접수되었습니다</div>
                <div style={{fontSize:14,color:"#AAA"}}>빠른 시일 내에 답변 드리겠습니다.</div>
              </div>
            ) : (
              <>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  <div>
                    <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>이름</label>
                    <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="이름" style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                  </div>
                  <div>
                    <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>이메일</label>
                    <input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="email@example.com" style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                  </div>
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>문의 유형</label>
                  <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,background:"white",fontFamily:"'NanumSquareRound',sans-serif"}}>
                    {["일반문의","매물문의","딜러입점","거래대행","허위매물신고","결제/환불","기타"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:16}}>
                  <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>문의 내용</label>
                  <textarea rows={6} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="문의 내용을 입력해주세요." style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,resize:"none",lineHeight:1.8,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                </div>
                <button onClick={handleSubmit} style={{width:"100%",padding:"16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:12,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>문의 보내기</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
