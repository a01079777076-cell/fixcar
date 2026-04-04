// 📁 저장 경로: app/dealer/apply/page.tsx
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { CheckCircle, Shield, Gift, Users, ArrowRight, Star } from "lucide-react";

const BENEFITS = [
  { icon: <Gift size={22}/>, title: "6개월 무료", desc: "오픈 기념 광고비 완전 무료", color: "#FF3B1E" },
  { icon: <Shield size={22}/>, title: "매물 촬영 대행", desc: "전문 사진사가 직접 방문 촬영", color: "#0066FF" },
  { icon: <Users size={22}/>, title: "등록 대행", desc: "매물 등록·관리 전부 대행", color: "#2D8A52" },
  { icon: <Star size={22}/>, title: "FIX 인증", desc: "인증 딜러 뱃지로 신뢰도 UP", color: "#E8A020" },
];

export default function DealerApplyPage() {
  const [form, setForm] = useState({ shopName: "", name: "", phone: "", complex: "", carCount: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.shopName || !form.phone) { alert("상호명과 연락처는 필수입니다."); return; }
    // TODO: API 연동
    setSubmitted(true);
  };

  const inp: React.CSSProperties = { width: "100%", padding: "14px", border: "1.5px solid #E0DDD7", borderRadius: 12, fontSize: 14, fontFamily: "'NanumSquareRound',sans-serif", background: "white" };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus,textarea:focus,select:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        {/* 히어로 */}
        <div style={{background:"linear-gradient(135deg,#FF3B1E,#CC2200)",padding:"clamp(40px,6vw,60px) 24px",textAlign:"center"}}>
          <div style={{fontFamily:"'Bebas Neue',serif",fontSize:"clamp(36px,6vw,56px)",color:"white",letterSpacing:4}}>DEALER WANTED</div>
          <h1 style={{fontSize:"clamp(20px,3vw,28px)",fontWeight:800,color:"white",marginTop:8}}>광주 딜러님, 함께하세요</h1>
          <p style={{fontSize:15,color:"rgba(255,255,255,0.7)",marginTop:8}}>20곳 한정 · 6개월 무료 · 지금 바로 신청</p>
        </div>

        <div style={{maxWidth:800,margin:"0 auto",padding:"32px 24px 100px"}}>
          {/* 혜택 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:32}}>
            {BENEFITS.map(b => (
              <div key={b.title} style={{background:"white",borderRadius:16,padding:"24px 16px",textAlign:"center"}}>
                <div style={{color:b.color,marginBottom:10}}>{b.icon}</div>
                <div style={{fontSize:15,fontWeight:800,marginBottom:4}}>{b.title}</div>
                <div style={{fontSize:11,color:"#888",lineHeight:1.5}}>{b.desc}</div>
              </div>
            ))}
          </div>

          {/* 왜 픽스카? */}
          <div style={{background:"white",borderRadius:20,padding:"clamp(24px,4vw,36px)",marginBottom:24}}>
            <h2 style={{fontSize:22,fontWeight:800,marginBottom:16}}>왜 픽스카인가요?</h2>
            {[
              "광주 최초 FIX 정찰가 플랫폼 — 고객 신뢰도 높음",
              "AI 기반 매물 추천으로 고객 매칭률 극대화",
              "100항목 검수 시스템으로 허위매물 ZERO",
              "클린픽스카 규정으로 건전한 거래 환경",
              "매물 촬영·등록·관리 전부 대행 (딜러님은 판매에 집중)",
              "SNS 마케팅으로 고객 유입 지원",
            ].map((t, i) => (
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
                <CheckCircle size={16} color="#2D8A52" style={{marginTop:2,flexShrink:0}}/>
                <span style={{fontSize:14,color:"#555",lineHeight:1.7}}>{t}</span>
              </div>
            ))}
          </div>

          {/* 신청 폼 */}
          <div style={{background:"white",borderRadius:20,padding:"clamp(24px,4vw,36px)"}}>
            {submitted ? (
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <CheckCircle size={48} color="#2D8A52" style={{marginBottom:16}}/>
                <h2 style={{fontSize:24,fontWeight:800,marginBottom:8}}>신청 완료!</h2>
                <p style={{fontSize:14,color:"#888",lineHeight:1.8}}>빠른 시일 내 연락 드리겠습니다.<br/>궁금하신 점은 고객센터로 문의해주세요.</p>
              </div>
            ) : (
              <>
                <h2 style={{fontSize:22,fontWeight:800,marginBottom:20}}>딜러 입점 신청</h2>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  <div><label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>상호명 *</label><input value={form.shopName} onChange={e=>setForm(p=>({...p,shopName:e.target.value}))} placeholder="아이비원모터스" style={inp}/></div>
                  <div><label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>담당자명</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="이름" style={inp}/></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  <div><label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>연락처 *</label><input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="010-0000-0000" style={inp}/></div>
                  <div><label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>소속 매매단지</label>
                    <select value={form.complex} onChange={e=>setForm(p=>({...p,complex:e.target.value}))} style={inp}>
                      <option value="">선택</option>
                      <option>서부 자동차매매단지</option><option>첨단 자동차매매단지</option><option>북구 자동차매매단지</option><option>기타</option>
                    </select>
                  </div>
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>보유 차량 수</label>
                  <select value={form.carCount} onChange={e=>setForm(p=>({...p,carCount:e.target.value}))} style={inp}>
                    <option value="">선택</option><option>1~5대</option><option>5~10대</option><option>10~30대</option><option>30대 이상</option>
                  </select>
                </div>
                <div style={{marginBottom:16}}>
                  <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:5,color:"#666"}}>추가 문의사항</label>
                  <textarea rows={3} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="궁금한 점이 있으시면 남겨주세요." style={{...inp,resize:"none"}}/>
                </div>
                <button onClick={handleSubmit} style={{width:"100%",padding:"18px",background:"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:17,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  입점 신청하기 <ArrowRight size={18}/>
                </button>
                <div style={{fontSize:11,color:"#CCC",textAlign:"center",marginTop:12}}>신청 후 1~2일 내 전화 또는 문자로 연락드립니다.</div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
