// 📁 저장 경로: app/sell/page.tsx
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Car, DollarSign, Shield, Clock, ArrowRight, CheckCircle } from "lucide-react";

const STEPS = [
  { icon: <Car size={24}/>, title: "차량 정보 입력", desc: "차량번호만 입력하면 자동으로 정보를 불러옵니다." },
  { icon: <DollarSign size={24}/>, title: "딜러 견적 수신", desc: "등록된 딜러들이 견적을 보내드립니다. (최대 5곳)" },
  { icon: <Shield size={24}/>, title: "비교 후 선택", desc: "가장 좋은 조건의 딜러를 선택하세요." },
  { icon: <Clock size={24}/>, title: "거래 완료", desc: "선택한 딜러와 만나 거래를 진행합니다." },
];

export default function SellPage() {
  const [form, setForm] = useState({ plateNumber: "", brand: "", model: "", year: "", mileage: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.plateNumber && !form.brand) { alert("차량번호 또는 브랜드를 입력해주세요."); return; }
    if (!form.phone) { alert("연락처를 입력해주세요."); return; }
    setSubmitted(true);
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        {/* 히어로 */}
        <div style={{background:"linear-gradient(135deg,#0A1628,#1A3A5C)",padding:"clamp(40px,6vw,60px) 24px",textAlign:"center"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#E8A020",marginBottom:8}}>FIXCAR SELL</div>
          <h1 style={{fontSize:"clamp(24px,4vw,36px)",fontWeight:800,color:"white",marginBottom:8}}>내 차, 제일 비싸게 팔기</h1>
          <p style={{fontSize:15,color:"rgba(255,255,255,0.5)"}}>여러 딜러의 견적을 한번에 비교하세요</p>
        </div>

        <div style={{maxWidth:800,margin:"0 auto",padding:"32px 24px 100px"}}>
          {/* 진행 과정 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:32}}>
            {STEPS.map((s,i)=>(
              <div key={i} style={{background:"white",borderRadius:14,padding:"20px 14px",textAlign:"center"}}>
                <div style={{color:"#0066FF",marginBottom:8}}>{s.icon}</div>
                <div style={{fontSize:11,fontWeight:800,color:"#FF3B1E",marginBottom:4}}>STEP {i+1}</div>
                <div style={{fontSize:14,fontWeight:800,marginBottom:4}}>{s.title}</div>
                <div style={{fontSize:11,color:"#AAA",lineHeight:1.5}}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* 입력 폼 */}
          <div style={{background:"white",borderRadius:20,padding:"clamp(24px,4vw,36px)"}}>
            {submitted ? (
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <CheckCircle size={48} color="#2D8A52" style={{marginBottom:16}}/>
                <h2 style={{fontSize:24,fontWeight:800,marginBottom:8}}>견적 요청 완료!</h2>
                <p style={{fontSize:14,color:"#888",lineHeight:1.8}}>등록된 딜러들에게 견적 요청을 보냈습니다.<br/>빠른 시일 내 연락 드리겠습니다.</p>
              </div>
            ) : (
              <>
                <h2 style={{fontSize:22,fontWeight:800,marginBottom:20}}>차량 정보 입력</h2>
                <div style={{marginBottom:14}}>
                  <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>차량번호</label>
                  <input value={form.plateNumber} onChange={e=>setForm(p=>({...p,plateNumber:e.target.value}))} placeholder="예) 12가1234" style={{width:"100%",padding:"14px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                  <div style={{fontSize:11,color:"#AAA",marginTop:4}}>차량번호를 입력하면 차량 정보를 자동으로 불러옵니다. (국토부 API 연동 예정)</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                  <div>
                    <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>브랜드</label>
                    <input value={form.brand} onChange={e=>setForm(p=>({...p,brand:e.target.value}))} placeholder="현대" style={{width:"100%",padding:"14px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                  </div>
                  <div>
                    <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>모델명</label>
                    <input value={form.model} onChange={e=>setForm(p=>({...p,model:e.target.value}))} placeholder="쏘나타 DN8" style={{width:"100%",padding:"14px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                  <div>
                    <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>연식</label>
                    <input value={form.year} onChange={e=>setForm(p=>({...p,year:e.target.value}))} placeholder="2023" style={{width:"100%",padding:"14px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                  </div>
                  <div>
                    <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>주행거리 (km)</label>
                    <input value={form.mileage} onChange={e=>setForm(p=>({...p,mileage:e.target.value}))} placeholder="30000" style={{width:"100%",padding:"14px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                  </div>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>연락처 (필수)</label>
                  <input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="010-0000-0000" style={{width:"100%",padding:"14px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                </div>
                <button onClick={handleSubmit} style={{width:"100%",padding:"18px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:17,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  견적 요청하기 <ArrowRight size={18}/>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
