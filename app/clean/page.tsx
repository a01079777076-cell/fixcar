"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Shield, AlertTriangle, CheckCircle, Send } from "lucide-react";

export default function CleanPage() {
  const [type, setType] = useState("허위 매물");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const TYPES = ["허위 매물","가격 허위","사진 불일치","사고 이력 은폐","차량 상태 허위","연락 불가","기타"];

  const handleSubmit = () => {
    if(!content.trim()){alert("신고 내용을 입력해주세요");return;}
    setSubmitted(true);
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} textarea:focus,select:focus{outline:none;border-color:#2D8A52!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"linear-gradient(135deg,#1A4D2E,#2D8A52)",padding:"48px 24px",textAlign:"center",color:"white"}}>
          <Shield size={40} style={{marginBottom:16,opacity:0.9}}/>
          <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>클린 픽스카</h1>
          <p style={{fontSize:14,color:"rgba(255,255,255,0.7)",lineHeight:1.8}}>허위 매물 ZERO! 건전한 중고차 시장을 함께 만들어요</p>
        </div>
        <div style={{maxWidth:600,margin:"0 auto",padding:"32px 20px 100px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:32}}>
            {[{icon:Shield,num:"100",label:"항목 검수"},{icon:AlertTriangle,num:"24h",label:"이내 처리"},{icon:CheckCircle,num:"0",label:"허위 매물"}].map(c=>{const Icon=c.icon;return(
              <div key={c.label} style={{background:"white",borderRadius:16,padding:"22px 16px",textAlign:"center"}}>
                <Icon size={22} color="#2D8A52" style={{marginBottom:6}}/><div style={{fontSize:24,fontWeight:800,color:"#2D8A52"}}>{c.num}</div><div style={{fontSize:11,color:"#AAA"}}>{c.label}</div>
              </div>
            );})}
          </div>

          {submitted?(
            <div style={{background:"white",borderRadius:20,padding:"48px 24px",textAlign:"center"}}>
              <CheckCircle size={48} color="#2D8A52" style={{marginBottom:16}}/>
              <h2 style={{fontSize:22,fontWeight:800,marginBottom:8}}>신고 접수 완료!</h2>
              <p style={{fontSize:14,color:"#888",lineHeight:1.8}}>24시간 이내 확인 후 조치하겠습니다.<br/>감사합니다.</p>
              <button onClick={()=>{setSubmitted(false);setContent("");}} style={{marginTop:20,padding:"12px 28px",background:"#2D8A52",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>추가 신고하기</button>
            </div>
          ):(
            <div style={{background:"white",borderRadius:20,padding:"28px 24px"}}>
              <h2 style={{fontSize:20,fontWeight:800,marginBottom:20}}>🚨 허위 매물 신고</h2>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>신고 유형</label>
                <select value={type} onChange={e=>setType(e.target.value)} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",background:"white"}}>{TYPES.map(t=><option key={t}>{t}</option>)}</select>
              </div>
              <div style={{marginBottom:20}}>
                <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>신고 내용</label>
                <textarea rows={6} value={content} onChange={e=>setContent(e.target.value)} placeholder="어떤 매물이 문제인지, 어떤 점이 허위인지 자세히 알려주세요.&#10;(차량번호, 딜러명, URL 등을 포함하면 빠른 처리가 가능합니다)" maxLength={3000} style={{width:"100%",padding:"14px 16px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",resize:"none",lineHeight:1.8}}/>
              </div>
              <button onClick={handleSubmit} style={{width:"100%",padding:"16px",background:"#2D8A52",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'NanumSquareRound',sans-serif"}}><Send size={18}/>신고 접수하기</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
