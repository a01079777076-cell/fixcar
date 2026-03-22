"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ChevronDown, ChevronUp, Send, Phone, Mail, Clock } from "lucide-react";

const FAQS = [
  { q:"픽스카는 어떤 서비스인가요?", a:"픽스카는 광주 지역 기반 중고차 정찰제 플랫폼입니다. 모든 매물이 FIX(고정) 가격으로 등록되어 흥정 없이 투명하게 거래할 수 있어요." },
  { q:"FIX 정찰가란 무엇인가요?", a:"딜러가 등록한 가격이 곧 최종 가격입니다. 추가 비용이나 흥정 없이, 표시된 가격 그대로 구매할 수 있어요." },
  { q:"차량 상태는 어떻게 확인하나요?", a:"픽스카에 등록되는 모든 차량은 100항목 전문 검수를 거칩니다. 상세 페이지에서 차량 이력, 사고 여부, 성능 점검 결과를 확인할 수 있어요." },
  { q:"카카오 로그인 외 다른 로그인 방법이 있나요?", a:"현재는 카카오 로그인만 지원합니다. 추후 네이버, 이메일 로그인도 추가 예정이에요." },
  { q:"딜러로 가입하려면 어떻게 하나요?", a:"딜러 모집 페이지에서 신청할 수 있어요. 사업자등록증과 자동차매매업 종사원증이 필요하며, 담당 매니저가 1~2일 내로 연락드려요." },
  { q:"허위매물을 발견하면 어떻게 하나요?", a:"클린픽스카 페이지에서 허위매물을 신고할 수 있어요. 관리자가 확인 후 규정에 따라 차량 삭제 및 판매자 이용정지 조치를 취합니다." },
  { q:"환불이나 취소는 가능한가요?", a:"차량 매매 계약은 딜러와 구매자 간의 직접 거래입니다. 계약 전 반드시 차량을 직접 확인하시고, 계약 조건을 꼼꼼히 확인해주세요." },
  { q:"광주 외 지역도 서비스하나요?", a:"현재는 광주 지역 우선으로 운영 중입니다. 전남·전북 지역은 순차적으로 확대 예정이에요." },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number|null>(null);
  const [form, setForm] = useState({name:"",email:"",category:"일반 문의",message:""});
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if(!form.name || !form.message) { alert("이름과 문의 내용을 입력해주세요"); return; }
    setSent(true);
    setTimeout(()=>setSent(false), 5000);
    setForm({name:"",email:"",category:"일반 문의",message:""});
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus,textarea:focus,select:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"#1A1A1A",padding:"44px 24px 36px"}}>
          <div style={{maxWidth:800,margin:"0 auto"}}>
            <h1 style={{fontSize:28,fontWeight:800,color:"white",marginBottom:6}}>고객센터</h1>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.4)"}}>궁금한 점이나 건의사항을 남겨주세요</p>
          </div>
        </div>

        <div style={{maxWidth:800,margin:"0 auto",padding:"24px 20px 100px"}}>
          {/* 연락처 카드 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:28}}>
            {[
              {icon:Phone, label:"전화 문의",value:"062-000-0000",color:"#FF3B1E"},
              {icon:Mail, label:"이메일",value:"help@fixcar.kr",color:"#1847FF"},
              {icon:Clock, label:"운영 시간",value:"평일 09:00~18:00",color:"#2D8A52"},
            ].map(c=>{
              const Icon = c.icon;
              return (
                <div key={c.label} style={{background:"white",borderRadius:16,padding:"20px 16px",textAlign:"center"}}>
                  <Icon size={22} color={c.color} style={{marginBottom:8}}/>
                  <div style={{fontSize:12,color:"#AAA",marginBottom:4}}>{c.label}</div>
                  <div style={{fontSize:13,fontWeight:800}}>{c.value}</div>
                </div>
              );
            })}
          </div>

          {/* FAQ */}
          <h2 style={{fontSize:20,fontWeight:800,marginBottom:14}}>자주 묻는 질문</h2>
          <div style={{background:"white",borderRadius:18,overflow:"hidden",marginBottom:28}}>
            {FAQS.map((faq,i)=>(
              <div key={i}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{
                  width:"100%",padding:"18px 22px",border:"none",background:"transparent",
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                  borderBottom:"1px solid #F0EEE9",cursor:"pointer",textAlign:"left",
                  fontFamily:"'NanumSquareRound',sans-serif",
                }}>
                  <span style={{fontSize:14,fontWeight:700,color:"#333"}}>{faq.q}</span>
                  {openFaq===i?<ChevronUp size={16} color="#AAA"/>:<ChevronDown size={16} color="#AAA"/>}
                </button>
                {openFaq===i&&(
                  <div style={{padding:"0 22px 18px",fontSize:14,color:"#666",lineHeight:1.85,fontWeight:400}}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>

          {/* 문의 폼 */}
          <h2 style={{fontSize:20,fontWeight:800,marginBottom:14}}>직접 문의하기</h2>
          {sent&&<div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:12,padding:"14px 18px",marginBottom:16,fontSize:14,fontWeight:700,color:"#2D8A52"}}>✅ 문의가 접수됐어요! 빠르게 답변드릴게요.</div>}
          <div style={{background:"white",borderRadius:18,padding:"26px 24px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div>
                <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:6}}>이름 *</label>
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif"}}/>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:6}}>이메일</label>
                <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} type="email" style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif"}}/>
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:6}}>문의 유형</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",background:"white"}}>
                {["일반 문의","차량 관련","딜러 관련","버그 신고","기능 건의","기타"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,fontWeight:800,display:"block",marginBottom:6}}>문의 내용 *</label>
              <textarea rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",resize:"none"}}/>
            </div>
            <button onClick={handleSubmit} style={{width:"100%",padding:"15px",background:"#FF3B1E",color:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'NanumSquareRound',sans-serif"}}>
              <Send size={16}/> 문의 보내기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
