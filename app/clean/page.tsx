"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Shield, AlertTriangle, FileText, Send, ChevronDown, ChevronUp, Eye, Car, MapPin, Calendar, Phone } from "lucide-react";

const TABS = ["클린픽스카 홈","허위매물 유형","허위매물 신고","클린픽스카 규정","피해사례"] as const;
type Tab = typeof TABS[number];

/* ═══ 허위매물 유형 데이터 ═══ */
const FAKE_TYPES = [
  { num:1, title:"평균 시세보다 현저히 낮은 가격의 차량", desc:"사고유무, 주행거리, 연식 등의 차이로 약간의 가격 차이는 있을 수 있지만 평균 시세보다 현저히 낮은 매물의 경우 허위매물로 볼 수 있습니다.", icon:"💰" },
  { num:2, title:"실 매물 정보와 다른 차량", desc:"모델, 등급, 옵션, 사고여부, 주행거리 등 차량의 실제 정보와 판매자가 등록한 차량 정보가 다른 경우 유의해야 합니다.", icon:"🔄" },
  { num:3, title:"타인의 차량 사진을 도용한 경우", desc:"본인의 실 매물을 촬영한 사진이 아닌 동종 모델의 다른 사진 혹은 차량 동호회 등 일반 개인회원의 차량 사진을 도용하는 경우 허위매물이므로 주의하시길 바랍니다.", icon:"📷" },
  { num:4, title:"계절이 다른 사진을 등록한 경우", desc:"계절이 다른 사진의 경우 판매가 오랜 기간 안된 차량일 수 있지만, 도용된 사진일 수도 있습니다. 현재 계절에 맞지 않는 배경의 매물 사진은 유의하여 보시길 바랍니다.", icon:"🌤️" },
  { num:5, title:"차량 광고 사진과 판매자의 지역 정보가 상이한 차량", desc:"딜러 회원의 경우 각 매매 단지에 소속되어 있으며 해당 단지의 차량이 아닌 다른 지역의 사진을 도용하는 경우 허위매물로 볼 수 있습니다.", icon:"📍" },
  { num:6, title:"클린픽스카 정책 기준에 위배되는 차량", desc:"픽스카의 클린픽스카 정책 기준에 위배되는 차량은 허위매물로 간주되어 관리자의 제재를 받을 수 있습니다.", icon:"⛔" },
];

/* ═══ 규정 데이터 ═══ */
const RULES_COMMON = [
  "매매 부적합 차량을 등록한 경우 (주행·거래 불가 차량, 차량번호, 부품 등)",
  "감가 사유 없이 현저히 낮은 금액으로 광고하는 경우",
  "차량 가격을 실판매 가격이 아닌 월 납입금, 부가세 제외 금액으로 등록한 경우",
  "등록한 차량 정보가 실제 정보와 상이한 경우 (모델/등급, 옵션, 주행거리, 차량가격, 사진, 성능, 설명글 등)",
  "등록차량 외 다른 차량 정보를 입력하거나 안내 또는 판매 시도하는 경우",
  "과도하게 수정한 사진을 등록하거나 차량 사진이 아닌 이미지 또는 상호가 노출된 경우",
  "차량 번호판을 가리거나 편집하여 등록한 경우 (번호판 노출 사진 1장 필수)",
  "사진 또는 문구 입력 영역에 연락처·홍보성 내용을 등록한 경우",
  "차량이 판매되었으나 삭제하지 않은 모든 차량",
  "허위매물로 신고가 접수되어 관리자에 의해 확인된 경우",
  "차주 동의 없이 차량을 등록한 경우",
  "개인 정보를 실제와 다르게 입력한 회원의 등록된 모든 차량",
  "관계법령, 이용약관, 관리자 안내에 반하여 사이트에 등록된 차량",
];

/* ═══ 피해사례 데이터 ═══ */
const DAMAGE_CASES = [
  { title:"위조 서류 주의! 입금 전 꼭 확인하세요", category:"위조 서류 주의!", desc:"매매계약서, 인감증명서 등 서류를 위조하여 계약금·차량대금을 가로채는 사례가 발생하고 있습니다. 반드시 실물 서류를 직접 확인하세요.", icon:"📄" },
  { title:"탁송 거래 시 주의하세요!", category:"탁송 사기 주의", desc:"차량을 직접 보지 않고 탁송으로 거래하는 경우, 실제 차량 상태와 다르거나 차량이 배송되지 않는 사기 피해가 발생할 수 있습니다.", icon:"🚚" },
  { title:"차량 대금 완납 전 차 키를 주면 안돼요", category:"삼자 사기 주의!", desc:"차량 대금이 완전히 입금되기 전에 차 키와 서류를 넘기면 대금을 받지 못하는 사기 피해가 발생할 수 있습니다.", icon:"🔑" },
  { title:"리스/렌트 승계 신종 사기 수법 공개", desc:"리스·렌트 차량 승계를 빌미로 보증금을 편취하는 신종 사기가 증가하고 있습니다. 공식 금융사를 통해서만 승계 진행하세요.", icon:"💳" },
  { title:"왜 저렴하지? 분명한 이유를 알고 방문하세요!", desc:"시세보다 현저히 저렴한 매물은 미끼매물일 가능성이 높습니다. 방문 전 전화로 차량 상태를 꼼꼼히 확인하세요.", icon:"🔍" },
  { title:"사고이력조회 알아보기", desc:"카히스토리, 자동차365 등을 통해 사고이력, 침수이력, 폐차이력 등을 반드시 확인하세요.", icon:"🔎" },
  { title:"성능기록부 확인하기", desc:"성능상태점검기록부는 차량의 주요 부품 상태를 기록한 서류입니다. 거래 전 반드시 확인하세요.", icon:"📋" },
  { title:"미끼매물 피해 발생시 현장 대처 가이드", desc:"방문했는데 해당 차량이 없다고 하거나 다른 차량을 권유하면 미끼매물입니다. 즉시 자리를 떠나세요.", icon:"🚨" },
  { title:"계약금을 돌려주지 못하겠다고? - 미끼매물 계약서 편", desc:"허위매물로 유인 후 계약서를 작성하게 하고 계약금 반환을 거부하는 사례에 주의하세요.", icon:"📝" },
  { title:"미끼매물 딜러들은 어떤 말을 할까?", desc:"'방금 팔렸어요', '비슷한 더 좋은 차가 있어요' 등의 멘트는 미끼매물 딜러의 전형적인 화법입니다.", icon:"💬" },
];

/* ═══ 외부 링크 ═══ */
const EXT_LINKS = [
  { title:"자동차365", desc:"국토교통부와 한국교통안전공단이 차량 점검·정비 정보를 전산화하여 관리하는 서비스로 중고차 통합 이력 조회와 허위 매물 차량 신고 등이 가능합니다.", url:"https://www.car365.go.kr" },
  { title:"정부24", desc:"자동차등록원부(갑부/을부)를 발급받아 차량의 정확한 이력을 확인하세요. 중고차 구매 시 필수 확인 문서입니다.", url:"https://www.gov.kr" },
  { title:"자동차민원대국민포털", desc:"자동차 민원신청, 등록원부 발급, 말소사용증명 등 다양한 자동차 관련 민원 서비스를 원스톱으로 처리할 수 있는 정부 공식 온라인 창구입니다.", url:"https://www.ecar.go.kr" },
  { title:"카히스토리", desc:"차량 침수 이력 조회 서비스로, 사고이력, 침수차량, 폐차사고, 배차사고, 차량기준가액 등 중고차 구매 전 확인해야 할 필수 정보를 한 번에 조회할 수 있습니다.", url:"https://www.carhistory.or.kr" },
];

export default function CleanFixcarPage() {
  const [tab, setTab] = useState<Tab>("클린픽스카 홈");
  const [reportForm, setReportForm] = useState({ plateNumber:"", dealerName:"", dealerPhone:"", category:"가격", detail:"" });
  const [reportSent, setReportSent] = useState(false);
  const [openCase, setOpenCase] = useState<number|null>(null);

  const CATEGORIES = ["가격","사고유무","타지역 매물","팔린매물","상사정보 허위","차량정보 허위","미끼매물","개인 위장매물"];

  const handleReport = async () => {
    if (!reportForm.plateNumber || !reportForm.detail) { alert("차량번호와 신고내용을 입력해주세요"); return; }
    // 추후 API 연동
    setReportSent(true);
    setTimeout(()=>setReportSent(false), 5000);
    setReportForm({ plateNumber:"", dealerName:"", dealerPhone:"", category:"가격", detail:"" });
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        input:focus,textarea:focus{outline:none;border-color:#FF3B1E!important;}
        .tab-btn{transition:all 0.15s;} .tab-btn:hover{background:#F8F7F4!important;}
        .case-item{transition:all 0.15s;cursor:pointer;} .case-item:hover{background:#F8F7F4!important;}
      `}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        {/* 헤더 */}
        <div style={{background:"white",borderBottom:"1.5px solid #E8E6E1",padding:"16px 0"}}>
          <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <span style={{fontFamily:"'Bebas Neue',serif",fontSize:24,letterSpacing:2}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"#1A1A1A"}}>CAR</span></span>
              <span style={{fontSize:18,fontWeight:800,color:"#1A1A1A"}}>클린픽스카</span>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {TABS.map(t=>(
                <button key={t} className="tab-btn" onClick={()=>setTab(t)} style={{
                  padding:"10px 18px",borderRadius:8,border:tab===t?"2px solid #1A1A1A":"1.5px solid #E0DDD7",
                  background:tab===t?"#1A1A1A":"white",color:tab===t?"white":"#666",
                  fontSize:13,fontWeight:tab===t?800:600,
                }}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ 클린픽스카 홈 ═══ */}
        {tab==="클린픽스카 홈"&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#1847FF,#0A25B8)",padding:"60px 24px",textAlign:"center"}}>
              <Shield size={40} color="white" style={{marginBottom:16,opacity:0.8}}/>
              <h1 style={{fontSize:"clamp(22px,4vw,36px)",fontWeight:800,color:"white",marginBottom:12,wordBreak:"keep-all"}}>허위매물의 유형을 알면 피해를 최소화 할 수 있습니다.</h1>
              <p style={{fontSize:15,color:"rgba(255,255,255,0.7)",fontWeight:400,lineHeight:1.8}}>픽스카가 정의하는 허위매물 유형을 확인해보시고,<br/>유의하시길 바랍니다.</p>
            </div>
            <div style={{maxWidth:900,margin:"40px auto",padding:"0 24px 80px"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
                {[
                  {icon:"🔍",title:"허위매물 유형",desc:"어떤 매물이 허위매물인지 유형별로 확인하세요",tab:"허위매물 유형" as Tab},
                  {icon:"📢",title:"허위매물 신고",desc:"의심되는 매물을 신고하면 관리자가 확인합니다",tab:"허위매물 신고" as Tab},
                  {icon:"📜",title:"클린픽스카 규정",desc:"허위매물 등록 시 이용제한 규정을 확인하세요",tab:"클린픽스카 규정" as Tab},
                  {icon:"⚠️",title:"피해사례",desc:"실제 피해사례를 분석하여 예방 가이드를 제공합니다",tab:"피해사례" as Tab},
                ].map(item=>(
                  <div key={item.title} onClick={()=>setTab(item.tab)} style={{background:"white",borderRadius:18,padding:"28px 24px",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                    <div style={{fontSize:36,marginBottom:14}}>{item.icon}</div>
                    <div style={{fontSize:18,fontWeight:800,marginBottom:6}}>{item.title}</div>
                    <p style={{fontSize:13,color:"#888",fontWeight:400,lineHeight:1.7}}>{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* 외부 링크 */}
              <h2 style={{fontSize:22,fontWeight:800,marginTop:48,marginBottom:20}}>중고차 거래 관련 법령 및 자동차 정보 사이트</h2>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {EXT_LINKS.map(link=>(
                  <a key={link.title} href={link.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                    <div style={{background:"white",borderRadius:16,padding:"22px 24px",border:"1.5px solid #E8E6E1",transition:"all 0.15s",cursor:"pointer"}}>
                      <div style={{fontSize:17,fontWeight:800,marginBottom:8}}>{link.title}</div>
                      <p style={{fontSize:13,color:"#888",lineHeight:1.7,fontWeight:400,marginBottom:10}}>{link.desc}</p>
                      <span style={{fontSize:13,fontWeight:700,color:"#888"}}>바로가기 →</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ 허위매물 유형 ═══ */}
        {tab==="허위매물 유형"&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#1847FF,#0A25B8)",padding:"48px 24px",textAlign:"center"}}>
              <Eye size={32} color="white" style={{marginBottom:12,opacity:0.8}}/>
              <h1 style={{fontSize:"clamp(20px,4vw,32px)",fontWeight:800,color:"white",marginBottom:10}}>허위매물 유형을 확인해주세요.</h1>
            </div>
            <div style={{maxWidth:900,margin:"40px auto",padding:"0 24px 80px"}}>
              {FAKE_TYPES.map((item,i)=>(
                <div key={i} style={{display:"flex",gap:24,padding:"40px 0",borderBottom:"1px solid #E8E6E1",alignItems:"flex-start",flexWrap:"wrap"}}>
                  <div style={{flex:"1 1 400px"}}>
                    <h3 style={{fontSize:22,fontWeight:800,marginBottom:12}}>{item.num}. {item.title}</h3>
                    <p style={{fontSize:15,color:"#555",lineHeight:1.85,fontWeight:400}}>{item.desc}</p>
                  </div>
                  <div style={{flex:"0 0 200px",height:140,background:"#F8F7F4",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>{item.icon}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ 허위매물 신고 ═══ */}
        {tab==="허위매물 신고"&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#1847FF,#0A25B8)",padding:"48px 24px",textAlign:"center"}}>
              <AlertTriangle size={32} color="white" style={{marginBottom:12,opacity:0.8}}/>
              <h1 style={{fontSize:"clamp(20px,4vw,32px)",fontWeight:800,color:"white",marginBottom:10}}>허위매물로 의심되는 차량을 신고해주세요.</h1>
              <p style={{fontSize:14,color:"rgba(255,255,255,0.65)",fontWeight:400,lineHeight:1.8}}>신고해주시면 클린픽스카 담당자 확인 후 클린픽스카 규정에 따라<br/>차량 삭제 및 판매자 이용정지 조치가 취해집니다.</p>
            </div>
            <div style={{maxWidth:700,margin:"32px auto",padding:"0 24px 80px"}}>
              <p style={{fontSize:13,color:"#FF3B1E",fontWeight:700,marginBottom:6}}>* 로그인 후 이용하실 수 있습니다.</p>
              <p style={{fontSize:12,color:"#AAA",fontWeight:400,marginBottom:24}}>* 아래에 정확한 정보를 입력해 주시면 보다 빠르게 조치할 수 있습니다.</p>

              {reportSent&&<div style={{background:"#EAF6EF",border:"1px solid #B8DFC8",borderRadius:12,padding:"14px 18px",marginBottom:16,fontSize:14,fontWeight:700,color:"#2D8A52"}}>✅ 신고가 접수됐어요! 관리자 검토 후 조치할게요.</div>}

              <div style={{background:"white",borderRadius:18,padding:"28px 26px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div>
                    <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>• 차량 번호</label>
                    <input type="text" value={reportForm.plateNumber} onChange={e=>setReportForm({...reportForm,plateNumber:e.target.value})} placeholder="예: 12가1234" style={{width:"100%",padding:"13px 16px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                  </div>
                  <div>
                    <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>• 신고내용</label>
                    <textarea rows={4} value={reportForm.detail} onChange={e=>setReportForm({...reportForm,detail:e.target.value})} placeholder="예) 00월 00일 판매자의 050번호로 통화 후 방문하였으나 해당 차량은 판매되었다며 더 비싼 차량으로 구매 유도하였습니다." style={{width:"100%",padding:"13px 16px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif",resize:"none"}}/>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <div>
                    <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>• 딜러 이름</label>
                    <input type="text" value={reportForm.dealerName} onChange={e=>setReportForm({...reportForm,dealerName:e.target.value})} style={{width:"100%",padding:"13px 16px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                  </div>
                  <div>
                    <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>• 의심 딜러 연락처</label>
                    <input type="tel" value={reportForm.dealerPhone} onChange={e=>setReportForm({...reportForm,dealerPhone:e.target.value})} placeholder="하이픈(-) 포함 입력" style={{width:"100%",padding:"13px 16px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif"}}/>
                  </div>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:10}}>• 항목</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {CATEGORIES.map(c=>(
                      <button key={c} onClick={()=>setReportForm({...reportForm,category:c})} style={{
                        padding:"8px 16px",borderRadius:100,border:reportForm.category===c?"2px solid #FF3B1E":"1.5px solid #E0DDD7",
                        background:reportForm.category===c?"#FFF0ED":"white",color:reportForm.category===c?"#FF3B1E":"#888",
                        fontSize:13,fontWeight:reportForm.category===c?800:500,fontFamily:"'NanumSquareRound',sans-serif",
                      }}>{c}</button>
                    ))}
                  </div>
                </div>
                <button onClick={handleReport} style={{width:"100%",padding:"16px",background:"#FF3B1E",color:"white",border:"none",borderRadius:12,fontSize:16,fontWeight:800,fontFamily:"'NanumSquareRound',sans-serif"}}>신고하기</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ 클린픽스카 규정 ═══ */}
        {tab==="클린픽스카 규정"&&(
          <div style={{maxWidth:900,margin:"0 auto",padding:"40px 24px 80px"}}>
            <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>클린픽스카 규정을 확인해보세요.</h1>
            <p style={{fontSize:14,color:"#888",fontWeight:400,marginBottom:32,lineHeight:1.8}}>허위매물로 신고된 매물과 판매자는 클린픽스카 정책에 따라<br/>픽스카 이용이 엄격히 제한됩니다.</p>

            {/* 광고 제한 */}
            <div style={{background:"white",borderRadius:18,padding:"28px 26px",marginBottom:20}}>
              <h2 style={{fontSize:20,fontWeight:800,marginBottom:6,color:"#FF3B1E"}}>광고 제한</h2>
              <div style={{fontSize:12,fontWeight:700,color:"#1847FF",marginBottom:14}}>회원공통</div>
              {RULES_COMMON.map((rule,i)=>(
                <div key={i} style={{padding:"10px 0",borderBottom:"1px solid #F0EEE9",fontSize:14,color:"#555",fontWeight:400,lineHeight:1.7}}>
                  {i+1}) {rule}
                </div>
              ))}
            </div>

            {/* 이용 정지 */}
            <div style={{background:"white",borderRadius:18,padding:"28px 26px",marginBottom:20}}>
              <h2 style={{fontSize:20,fontWeight:800,marginBottom:16,color:"#FF3B1E"}}>사이트 이용 정지</h2>
              <div style={{marginBottom:20}}>
                <h3 style={{fontSize:16,fontWeight:800,marginBottom:10,color:"#E8A020"}}>1년 이용 정지</h3>
                {["관리자에 의해 허위매물 등록자로 확인된 경우 신고 횟수에 상관없이 1년 이용정지","허위매물 신고 5회 받을 시 1년 이용정지","자동 업데이트, 차량등록 프로그램 등 픽스카의 사전동의 없는 프로그램 사용 적발 시 1년 이용정지","회원 광고 차량 구매 문의에 과도한 매입 광고를 한 경우 1년 이용정지","타인의 개인정보(연락처, 성명 등)를 도용하여 사용하는 경우 1년 이용정지"].map((r,i)=>(
                  <div key={i} style={{padding:"8px 0",fontSize:14,color:"#555",lineHeight:1.7}}>{i+1}) {r}</div>
                ))}
              </div>
              <div>
                <h3 style={{fontSize:16,fontWeight:800,marginBottom:10,color:"#FF3B1E"}}>영구 이용 정지</h3>
                {["기존 이용 정지자가 다른 계정을 사용하여 차량 등록을 시도한 경우 영구 이용정지","명백한 사기행위, 공서양속에 반하는 행위를 한 이용자의 경우 영구 이용정지","이용정지 2회 누적 시 영구 이용정지","허위매물 신고 누적 횟수가 4회인 경우 영구 이용정지"].map((r,i)=>(
                  <div key={i} style={{padding:"8px 0",fontSize:14,color:"#555",lineHeight:1.7}}>{i+1}) {r}</div>
                ))}
              </div>
            </div>

            {/* 조치 내용 */}
            <div style={{background:"#FFF0ED",borderRadius:18,padding:"22px 26px",border:"1px solid #FFB8A8"}}>
              <h3 style={{fontSize:16,fontWeight:800,color:"#FF3B1E",marginBottom:10}}>⚠️ 조치내용</h3>
              {["광고 등록비 등 일체의 비용은 환불되지 않습니다.","서비스 불량 이용자로 공개될 수 있으며, 서비스 이용이 제한될 수 있습니다.","내용 확인을 위하여 차량 관련 서류 일체를 확인하거나 요청할 수 있으며, 서류 제출을 거부하는 경우 서비스 이용이 제한됩니다.","허위매물 등록 시 이용 제한 기준에 따라 처리됩니다."].map((r,i)=>(
                <div key={i} style={{padding:"6px 0",fontSize:13,color:"#CC3322",lineHeight:1.7}}>{i+1}) {r}</div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ 피해사례 ═══ */}
        {tab==="피해사례"&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#555,#333)",padding:"48px 24px",textAlign:"center"}}>
              <FileText size={32} color="white" style={{marginBottom:12,opacity:0.8}}/>
              <h1 style={{fontSize:"clamp(20px,4vw,32px)",fontWeight:800,color:"white",marginBottom:10}}>방문 거래 시 허위, 미끼매물 피해를 막으려면?</h1>
              <p style={{fontSize:14,color:"rgba(255,255,255,0.6)",fontWeight:400,lineHeight:1.8}}>실사례를 분석하여 피해 예방을 위한<br/>가이드라인을 제공해 드립니다.</p>
            </div>
            <div style={{maxWidth:900,margin:"32px auto",padding:"0 24px 80px"}}>
              {/* 주요 피해 카드 3개 */}
              <h2 style={{fontSize:20,fontWeight:800,marginBottom:16}}>주요 피해 사례</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:36}}>
                {DAMAGE_CASES.slice(0,3).map((c,i)=>(
                  <div key={i} style={{background:"white",borderRadius:16,padding:"28px 22px",textAlign:"center"}}>
                    <div style={{fontSize:32,marginBottom:12}}>{c.icon}</div>
                    {c.category&&<div style={{fontSize:12,fontWeight:800,color:"#FF3B1E",marginBottom:6}}>{c.category}</div>}
                    <div style={{fontSize:16,fontWeight:800,lineHeight:1.4}}>{c.title.replace(c.category||"","").trim()}</div>
                  </div>
                ))}
              </div>

              {/* 전체 목록 */}
              <h2 style={{fontSize:20,fontWeight:800,marginBottom:4}}>최신 피해 사례</h2>
              <div style={{fontSize:13,color:"#AAA",marginBottom:16}}>총 {DAMAGE_CASES.length}건</div>
              {DAMAGE_CASES.map((c,i)=>(
                <div key={i} className="case-item" onClick={()=>setOpenCase(openCase===i?null:i)} style={{background:"white",borderBottom:"1px solid #F0EEE9",padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:i===0?`14px 14px 0 0`:i===DAMAGE_CASES.length-1?`0 0 14px 14px`:"0"}}>
                  <span style={{fontSize:15,fontWeight:600,color:"#333"}}>{c.title}</span>
                  {openCase===i?<ChevronUp size={18} color="#AAA"/>:<ChevronDown size={18} color="#AAA"/>}
                </div>
              ))}
              {openCase!==null&&(
                <div style={{background:"#F8F7F4",borderRadius:"0 0 14px 14px",padding:"18px 24px",marginTop:-1,borderTop:"1px solid #E8E6E1"}}>
                  <p style={{fontSize:14,color:"#555",lineHeight:1.85,fontWeight:400}}>{DAMAGE_CASES[openCase].desc}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
