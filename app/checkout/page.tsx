"use client";

import { useState } from "react";
import {
  Lock, Shield, ChevronRight, CheckCircle, Car, CreditCard,
  Calculator, AlertCircle, ChevronDown, ChevronUp, ArrowLeft,
  FileText, Phone, User, Mail, Truck
} from "lucide-react";

const CAR = {
  id: 1, name: "현대 아반떼 CN7 1.6 가솔린 스마트",
  brand: "현대", year: "2021년식", mileage: "32,000km",
  color: "흰색", region: "광주 북구",
  price: 14500000, depositAmount: 1000000,
  query: "hyundai+elantra+white+sedan+clean",
  dealer: "광주모터스 박준형",
};

const INSTALLMENT_OPTIONS = [
  { months: 12, rate: 3.9 },
  { months: 24, rate: 4.2 },
  { months: 36, rate: 4.5 },
  { months: 48, rate: 4.7 },
  { months: 60, rate: 4.9 },
  { months: 72, rate: 5.2 },
  { months: 84, rate: 5.5 },
];

function calcMonthly(price: number, months: number, rate: number) {
  const r = rate / 100 / 12;
  return Math.round(price * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1));
}

export default function CheckoutPage() {
  const [step, setStep] = useState<1|2|3>(1);
  const [payType, setPayType] = useState<"full"|"installment">("installment");
  const [selectedMonths, setSelectedMonths] = useState(60);
  const [downPct, setDownPct] = useState(20);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agrees, setAgrees] = useState({ terms: false, privacy: false, refund: false });
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [wantDelivery, setWantDelivery] = useState(true);
  const [deliveryAddr, setDeliveryAddr] = useState("");
  const [openFaq, setOpenFaq] = useState<number|null>(null);
  const [done, setDone] = useState(false);

  const selectedOpt = INSTALLMENT_OPTIONS.find(o => o.months === selectedMonths)!;
  const downAmount = Math.round(CAR.price * downPct / 100);
  const loanAmount = CAR.price - downAmount;
  const monthly = calcMonthly(loanAmount, selectedMonths, selectedOpt.rate);
  const totalCost = payType === "full" ? CAR.price : downAmount + monthly * selectedMonths;
  const interestTotal = payType === "installment" ? totalCost - CAR.price : 0;

  const handleAgreeAll = (v: boolean) => {
    setAgreeAll(v);
    setAgrees({ terms: v, privacy: v, refund: v });
  };

  const handleAgree = (key: keyof typeof agrees, v: boolean) => {
    const next = { ...agrees, [key]: v };
    setAgrees(next);
    setAgreeAll(Object.values(next).every(Boolean));
  };

  const canProceed1 = buyerName && buyerPhone && buyerEmail && (!wantDelivery || deliveryAddr);
  const canProceed2 = agreeAll;

  const faqs = [
    { q: "계약금은 왜 내나요?", a: "계약금 100만원은 차량을 예약 확보하는 비용이에요. 잔금(나머지 금액)은 차량 인수 시 납부해요." },
    { q: "계약 취소하면 계약금은 돌아오나요?", a: "픽스카는 3일 이내 취소 시 100% 환불 보장이에요. 단, 3일 이후 취소는 계약금의 일부가 위약금으로 차감될 수 있어요." },
    { q: "할부는 어디서 진행되나요?", a: "캐피탈 금융사와 별도 계약해요. 계약금 결제 후 담당자가 연락드려서 할부 서류를 안내해드려요." },
    { q: "탁송 기간이 얼마나 걸리나요?", a: "계약금 결제 후 1~2 영업일 내에 집 앞까지 탁송해드려요. 광주 내 탁송은 당일도 가능해요." },
  ];

  // 완료 화면
  if (done) {
    return (
      <>
        <style>{`
          @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
          *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
          a { text-decoration:none; color:inherit; }
          @keyframes scaleIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        `}</style>
        <div style={{ minHeight:"100vh", background:"#F0EEE9", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
          <div style={{ textAlign:"center", maxWidth:"520px", width:"100%" }}>
            <div style={{ width:"88px", height:"88px", background:"#EAF6EF", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", animation:"scaleIn 0.5s cubic-bezier(0.22,1,0.36,1)" }}>
              <CheckCircle size={44} color="#2D8A52" />
            </div>
            <h1 style={{ fontSize:"clamp(28px,5vw,42px)", fontWeight:800, letterSpacing:"-1.5px", marginBottom:"12px", animation:"fadeUp 0.5s 0.1s both" }}>
              계약금 결제 완료! 🎉
            </h1>
            <p style={{ fontSize:"16px", color:"#888", lineHeight:1.8, marginBottom:"36px", fontWeight:400, animation:"fadeUp 0.5s 0.2s both" }}>
              <strong style={{ color:"#1A1A1A", fontWeight:800 }}>현대 아반떼 CN7</strong>을 성공적으로 예약했어요.<br />
              담당자가 <strong style={{ color:"#1A1A1A", fontWeight:800 }}>1시간 내</strong>로 연락드릴게요.
            </p>
            <div style={{ background:"white", borderRadius:"20px", padding:"28px", marginBottom:"24px", animation:"fadeUp 0.5s 0.3s both" }}>
              <div style={{ fontSize:"13px", color:"#AAA", fontWeight:700, marginBottom:"16px" }}>결제 정보</div>
              {[
                ["결제 금액", "1,000,000원 (계약금)"],
                ["결제 일시", new Date().toLocaleString("ko-KR")],
                ["차량 번호", "계약 후 공개"],
                ["담당 딜러", CAR.dealer],
                ["탁송 예정", "1~2 영업일 내"],
              ].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #F0EEE9" }}>
                  <span style={{ fontSize:"14px", color:"#888", fontWeight:400 }}>{k}</span>
                  <span style={{ fontSize:"14px", fontWeight:800 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:"12px", animation:"fadeUp 0.5s 0.4s both" }}>
              <a href="/mypage" style={{ flex:1 }}>
                <button style={{ width:"100%", background:"#1A1A1A", color:"white", border:"none", padding:"15px", borderRadius:"12px", fontSize:"15px", fontWeight:800, cursor:"pointer" }}>마이페이지 확인</button>
              </a>
              <a href="/" style={{ flex:1 }}>
                <button style={{ width:"100%", background:"white", color:"#1A1A1A", border:"2px solid #E0DDD7", padding:"13px", borderRadius:"12px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>홈으로</button>
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input, select, textarea { font-family:'NanumSquareRound',sans-serif; }
        .form-input { width:100%; border:1.5px solid #E0DDD7; border-radius:12px; padding:14px 16px; font-size:15px; outline:none; transition:border-color 0.2s; background:#FAFAF8; }
        .form-input:focus { border-color:#FF3B1E; background:#fff; }
        .pay-tab { transition:all 0.2s; cursor:pointer; border:2px solid; border-radius:14px; padding:16px 20px; text-align:left; }
        .month-btn { transition:all 0.15s; cursor:pointer; border:1.5px solid; border-radius:10px; padding:10px 14px; text-align:center; }
        .month-btn:hover { border-color:#FF3B1E !important; }
        .faq-item { cursor:pointer; transition:background 0.15s; }
        .faq-item:hover { background:#FAFAF8; }
        .btn-red { background:#FF3B1E; color:white; border:none; border-radius:14px; font-size:16px; font-weight:800; width:100%; padding:18px; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:10px; }
        .btn-red:hover { background:#D42E14; transform:translateY(-1px); }
        .btn-red:disabled { background:#E0DDD7; color:#AAA; cursor:default; transform:none; }
        .nav-link:hover { color:#1A1A1A !important; }
        @media(max-width:1024px) {
          .checkout-grid { grid-template-columns:1fr !important; }
          .summary-sticky { position:static !important; }
          .nav-menu { display:none !important; }
        }
        @media(max-width:600px) {
          .page-wrap { padding:20px 16px 80px !important; }
          .months-grid { grid-template-columns:repeat(4,1fr) !important; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>

        {/* 공지 바 */}
        <div style={{ background:"#1A1A1A", color:"#fff", textAlign:"center", padding:"10px", fontSize:"13px", fontWeight:700 }}>
          <span style={{ color:"#FF7A63" }}>PICK</span> 맘에 드는 차를 픽하세요 &nbsp;·&nbsp;
          <span style={{ color:"#7A9BFF" }}>FIX</span> 정찰제 — 가격 흥정 없음 &nbsp;·&nbsp; 3일 환불 보장
        </div>

        {/* 네비 */}
        <nav style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid #ECEAE4", height:"68px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 52px" }}>
          <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", letterSpacing:"3px" }}>
            <span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span>
          </a>
          <div className="nav-menu" style={{ display:"flex", gap:"36px" }}>
            {[["차 찾기","/cars"],["추천 퀴즈","/quiz"],["초보 가이드","/guide"],["내 차 팔기","/sell"]].map(([l,h])=>(
              <a key={l} href={h} className="nav-link" style={{ fontSize:"15px", fontWeight:700, color:"#888" }}>{l}</a>
            ))}
          </div>
          <a href={`/cars/${CAR.id}`} style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"14px", fontWeight:700, color:"#888" }}>
            <ArrowLeft size={16} /> 차량으로 돌아가기
          </a>
        </nav>

        {/* 스텝 인디케이터 */}
        <div style={{ background:"white", borderBottom:"1px solid #ECEAE4", padding:"0 52px" }}>
          <div style={{ maxWidth:"1100px", margin:"0 auto", display:"flex", alignItems:"center", padding:"16px 0" }}>
            {[
              { num:1, label:"구매자 정보" },
              { num:2, label:"약관 동의" },
              { num:3, label:"결제" },
            ].map((s, i) => (
              <div key={s.num} style={{ display:"flex", alignItems:"center", flex: i < 2 ? 1 : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"32px", height:"32px", borderRadius:"50%", background: step >= s.num ? "#FF3B1E" : "#E0DDD7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:800, color: step >= s.num ? "white" : "#AAA", flexShrink:0, transition:"all 0.3s" }}>
                    {step > s.num ? <CheckCircle size={16} /> : s.num}
                  </div>
                  <span style={{ fontSize:"14px", fontWeight: step === s.num ? 800 : 600, color: step >= s.num ? "#1A1A1A" : "#AAA" }}>{s.label}</span>
                </div>
                {i < 2 && <div style={{ flex:1, height:"1px", background: step > s.num ? "#FF3B1E" : "#E0DDD7", margin:"0 16px", transition:"background 0.3s" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* 메인 */}
        <div className="page-wrap" style={{ maxWidth:"1100px", margin:"0 auto", padding:"32px 52px 80px" }}>
          <div className="checkout-grid" style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:"28px", alignItems:"start" }}>

            {/* ── 왼쪽 ── */}
            <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>

              {/* STEP 1: 구매자 정보 */}
              {step === 1 && (
                <>
                  <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                    <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"22px", display:"flex", alignItems:"center", gap:"10px" }}>
                      <User size={20} color="#FF3B1E" /> 구매자 정보
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                      <div>
                        <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>이름 <span style={{ color:"#FF3B1E" }}>*</span></label>
                        <input className="form-input" type="text" placeholder="홍길동" value={buyerName} onChange={e=>setBuyerName(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>연락처 <span style={{ color:"#FF3B1E" }}>*</span></label>
                        <input className="form-input" type="tel" placeholder="010-0000-0000" value={buyerPhone} onChange={e=>setBuyerPhone(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>이메일 <span style={{ color:"#FF3B1E" }}>*</span></label>
                        <input className="form-input" type="email" placeholder="your@email.com" value={buyerEmail} onChange={e=>setBuyerEmail(e.target.value)} />
                        <div style={{ fontSize:"12px", color:"#AAA", marginTop:"5px", fontWeight:400 }}>계약서와 영수증이 이메일로 발송돼요</div>
                      </div>
                    </div>
                  </div>

                  {/* 탁송 옵션 */}
                  <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                    <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"22px", display:"flex", alignItems:"center", gap:"10px" }}>
                      <Truck size={20} color="#1847FF" /> 차량 수령 방법
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                      {[
                        { val:true, icon:<Truck size={20} color="#1847FF"/>, title:"탁송 서비스 (추천)", desc:"집 앞까지 배달해드려요. 1~2 영업일 소요. 광주 내 무료.", color:"#EEF2FF", border:"#B8C8FF" },
                        { val:false, icon:<Car size={20} color="#555"/>, title:"직접 인수", desc:"딜러 사무소에서 직접 수령. 담당자가 일정 조율 연락드려요.", color:"#F8F6F2", border:"#E0DDD7" },
                      ].map(opt => (
                        <div key={String(opt.val)} onClick={()=>setWantDelivery(opt.val)} style={{ background: wantDelivery===opt.val ? opt.color : "#F8F6F2", border:`2px solid ${wantDelivery===opt.val ? opt.border : "#E0DDD7"}`, borderRadius:"14px", padding:"18px 20px", cursor:"pointer", transition:"all 0.15s", display:"flex", gap:"14px", alignItems:"flex-start" }}>
                          <div style={{ width:"40px", height:"40px", background:"white", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{opt.icon}</div>
                          <div>
                            <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"4px" }}>{opt.title}</div>
                            <div style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>{opt.desc}</div>
                          </div>
                          {wantDelivery===opt.val && <CheckCircle size={20} color="#2D8A52" style={{ marginLeft:"auto", flexShrink:0, marginTop:"2px" }} />}
                        </div>
                      ))}
                    </div>
                    {wantDelivery && (
                      <div style={{ marginTop:"16px" }}>
                        <label style={{ fontSize:"14px", fontWeight:800, display:"block", marginBottom:"7px" }}>탁송 주소 <span style={{ color:"#FF3B1E" }}>*</span></label>
                        <input className="form-input" type="text" placeholder="탁송 받을 주소를 입력해주세요" value={deliveryAddr} onChange={e=>setDeliveryAddr(e.target.value)} />
                      </div>
                    )}
                  </div>

                  {/* 할부 계산기 */}
                  <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                    <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"6px", display:"flex", alignItems:"center", gap:"10px" }}>
                      <Calculator size={20} color="#FF3B1E" /> 할부 계산기
                    </div>
                    <div style={{ fontSize:"14px", color:"#888", marginBottom:"22px", fontWeight:400 }}>계약금 결제 후 참고용이에요. 실제 할부는 캐피탈사와 별도 진행해요.</div>

                    {/* 결제 방식 */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"22px" }}>
                      {[
                        { val:"installment", label:"할부 구매", sub:"월 납입금 분할" },
                        { val:"full", label:"일시불 구매", sub:"한번에 전액 납부" },
                      ].map(opt => (
                        <div key={opt.val} className="pay-tab" onClick={()=>setPayType(opt.val as "full"|"installment")} style={{ background: payType===opt.val ? "#FFF0ED" : "#F8F6F2", borderColor: payType===opt.val ? "#FF3B1E" : "#E0DDD7" }}>
                          <div style={{ fontSize:"15px", fontWeight:800, color: payType===opt.val ? "#FF3B1E" : "#1A1A1A", marginBottom:"3px" }}>{opt.label}</div>
                          <div style={{ fontSize:"12px", color:"#888", fontWeight:400 }}>{opt.sub}</div>
                          {payType===opt.val && <CheckCircle size={14} color="#FF3B1E" style={{ marginTop:"6px" }} />}
                        </div>
                      ))}
                    </div>

                    {payType === "installment" && (
                      <>
                        {/* 선수금 */}
                        <div style={{ marginBottom:"20px" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"14px", fontWeight:700, marginBottom:"10px" }}>
                            <span>선수금(계약금)</span>
                            <span style={{ color:"#FF3B1E", fontWeight:800 }}>{downPct}% — {downAmount.toLocaleString()}원</span>
                          </div>
                          <input type="range" min="10" max="50" step="5" value={downPct} onChange={e=>setDownPct(parseInt(e.target.value))} style={{ width:"100%", accentColor:"#FF3B1E", height:"4px" }} />
                          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:"#CCC", marginTop:"5px", fontWeight:400 }}>
                            <span>10%</span><span>20%</span><span>30%</span><span>40%</span><span>50%</span>
                          </div>
                        </div>

                        {/* 할부 개월 선택 */}
                        <div style={{ marginBottom:"20px" }}>
                          <div style={{ fontSize:"14px", fontWeight:700, marginBottom:"10px" }}>할부 기간</div>
                          <div className="months-grid" style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"6px" }}>
                            {INSTALLMENT_OPTIONS.map(opt => (
                              <button key={opt.months} className="month-btn" onClick={()=>setSelectedMonths(opt.months)} style={{ background: selectedMonths===opt.months ? "#FF3B1E" : "#F8F6F2", borderColor: selectedMonths===opt.months ? "#FF3B1E" : "#E0DDD7", color: selectedMonths===opt.months ? "white" : "#555", fontSize:"13px", fontWeight:800 }}>
                                {opt.months}
                              </button>
                            ))}
                          </div>
                          <div style={{ fontSize:"12px", color:"#AAA", textAlign:"center", marginTop:"6px", fontWeight:400 }}>개월</div>
                        </div>

                        {/* 계산 결과 */}
                        <div style={{ background:"linear-gradient(135deg,#1A1A1A,#2A2A2A)", borderRadius:"16px", padding:"22px 24px" }}>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
                            <div>
                              <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.45)", marginBottom:"4px", fontWeight:400 }}>월 납입금</div>
                              <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"34px", color:"#FF3B1E", letterSpacing:"0.5px", lineHeight:1 }}>{monthly.toLocaleString()}</div>
                              <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", marginTop:"3px", fontWeight:400 }}>원 / {selectedMonths}개월</div>
                            </div>
                            <div>
                              <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.45)", marginBottom:"4px", fontWeight:400 }}>대출 금액</div>
                              <div style={{ fontSize:"20px", fontWeight:800, color:"white" }}>{loanAmount.toLocaleString()}원</div>
                              <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", marginTop:"3px", fontWeight:400 }}>연이율 {selectedOpt.rate}%</div>
                            </div>
                          </div>
                          <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"14px", display:"flex", justifyContent:"space-between" }}>
                            <span style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:400 }}>총 이자 비용</span>
                            <span style={{ fontSize:"13px", fontWeight:800, color:"rgba(255,255,255,0.7)" }}>{interestTotal.toLocaleString()}원</span>
                          </div>
                        </div>
                        <div style={{ marginTop:"10px", fontSize:"12px", color:"#AAA", fontWeight:400, lineHeight:1.6 }}>
                          ※ 실제 할부 조건은 캐피탈사와의 계약에 따라 달라질 수 있어요. 계약금 결제 후 담당자가 연락드려요.
                        </div>
                      </>
                    )}

                    {payType === "full" && (
                      <div style={{ background:"#EAF6EF", border:"1px solid #A8DACB", borderRadius:"14px", padding:"18px 20px", display:"flex", gap:"12px", alignItems:"center" }}>
                        <CheckCircle size={22} color="#2D8A52" />
                        <div>
                          <div style={{ fontSize:"15px", fontWeight:800, color:"#2D8A52" }}>일시불 시 이자 0원</div>
                          <div style={{ fontSize:"13px", color:"#2D8A52", opacity:0.8, fontWeight:400 }}>총 납부액 {CAR.price.toLocaleString()}원 · 계약금 100만원 외 잔금 {(CAR.price-CAR.depositAmount).toLocaleString()}원</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button className="btn-red" onClick={()=>{ if(canProceed1) setStep(2); }} disabled={!canProceed1}>
                    다음 단계 — 약관 동의 <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* STEP 2: 약관 동의 */}
              {step === 2 && (
                <>
                  <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                    <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"22px", display:"flex", alignItems:"center", gap:"10px" }}>
                      <FileText size={20} color="#FF3B1E" /> 약관 동의
                    </div>

                    {/* 전체 동의 */}
                    <label style={{ display:"flex", alignItems:"center", gap:"14px", padding:"18px 20px", background:"#FFF0ED", border:"2px solid #FFB8A8", borderRadius:"14px", cursor:"pointer", marginBottom:"16px" }}>
                      <input type="checkbox" checked={agreeAll} onChange={e=>handleAgreeAll(e.target.checked)} style={{ width:"20px", height:"20px", accentColor:"#FF3B1E", cursor:"pointer" }} />
                      <div>
                        <div style={{ fontSize:"16px", fontWeight:800, color:"#FF3B1E" }}>전체 동의</div>
                        <div style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>아래 모든 약관에 동의해요</div>
                      </div>
                    </label>

                    {/* 개별 약관 */}
                    {[
                      { key:"terms" as const, label:"이용약관 동의 (필수)", desc:"픽스카 서비스 이용에 관한 약관이에요." },
                      { key:"privacy" as const, label:"개인정보 처리방침 동의 (필수)", desc:"수집하는 개인정보 항목과 이용 목적이에요." },
                      { key:"refund" as const, label:"환불 정책 동의 (필수)", desc:"3일 이내 환불 보장 조건과 위약금 정책이에요." },
                    ].map(item => (
                      <label key={item.key} style={{ display:"flex", alignItems:"flex-start", gap:"14px", padding:"16px 20px", background:"#F8F6F2", borderRadius:"12px", cursor:"pointer", marginBottom:"10px", border:`1.5px solid ${agrees[item.key]?"#B8DFC8":"#E0DDD7"}` }}>
                        <input type="checkbox" checked={agrees[item.key]} onChange={e=>handleAgree(item.key, e.target.checked)} style={{ width:"18px", height:"18px", accentColor:"#FF3B1E", cursor:"pointer", marginTop:"2px", flexShrink:0 }} />
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"3px" }}>{item.label}</div>
                          <div style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>{item.desc}</div>
                        </div>
                        <span style={{ fontSize:"12px", color:"#1847FF", fontWeight:700, whiteSpace:"nowrap", flexShrink:0 }}>내용 보기</span>
                      </label>
                    ))}
                  </div>

                  {/* 안내사항 */}
                  <div style={{ background:"#FFF8EC", border:"1px solid #FFD89A", borderRadius:"16px", padding:"20px 22px", display:"flex", gap:"14px" }}>
                    <AlertCircle size={22} color="#E8A020" style={{ flexShrink:0, marginTop:"1px" }} />
                    <div style={{ fontSize:"14px", color:"#7A5500", lineHeight:1.75, fontWeight:400 }}>
                      <strong style={{ fontWeight:800 }}>계약금 결제 안내:</strong> 지금 결제하는 100만원은 차량 예약 계약금이에요. 잔금({(CAR.price-CAR.depositAmount).toLocaleString()}원)은 차량 인수 시 별도 납부해요. 픽스카는 3일 이내 취소 시 계약금 100% 환불을 보장해요.
                    </div>
                  </div>

                  <div style={{ display:"flex", gap:"12px" }}>
                    <button onClick={()=>setStep(1)} style={{ background:"white", color:"#1A1A1A", border:"2px solid #E0DDD7", borderRadius:"14px", padding:"16px 24px", fontSize:"15px", fontWeight:700, display:"flex", alignItems:"center", gap:"8px" }}>
                      <ArrowLeft size={16} /> 이전
                    </button>
                    <button className="btn-red" onClick={()=>{ if(canProceed2) setStep(3); }} disabled={!canProceed2} style={{ flex:1 }}>
                      결제하기 <ChevronRight size={18} />
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3: 결제 */}
              {step === 3 && (
                <>
                  <div style={{ background:"white", borderRadius:"20px", padding:"28px 32px" }}>
                    <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"22px", display:"flex", alignItems:"center", gap:"10px" }}>
                      <CreditCard size={20} color="#FF3B1E" /> 결제 수단 선택
                    </div>

                    {/* 결제 금액 강조 */}
                    <div style={{ background:"linear-gradient(135deg,#1A1A1A,#2A2A2A)", borderRadius:"16px", padding:"22px 24px", marginBottom:"22px", position:"relative", overflow:"hidden" }}>
                      <div style={{ position:"absolute", right:"-10px", bottom:"-10px", fontFamily:"'Bebas Neue',serif", fontSize:"80px", color:"rgba(255,255,255,0.04)", lineHeight:1 }}>PAY</div>
                      <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)", marginBottom:"6px", fontWeight:400 }}>지금 결제할 계약금</div>
                      <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"48px", color:"#FF3B1E", letterSpacing:"1px", lineHeight:1, marginBottom:"8px" }}>1,000,000<span style={{ fontSize:"18px", fontFamily:"'NanumSquareRound',sans-serif", fontWeight:700, color:"rgba(255,255,255,0.4)", marginLeft:"4px" }}>원</span></div>
                      <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:400 }}>잔금 {(CAR.price-CAR.depositAmount).toLocaleString()}원은 차량 인수 시 납부해요</div>
                    </div>

                    {/* 결제 방법 */}
                    <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                      {[
                        { icon:"💳", label:"신용·체크카드", sub:"국내외 모든 카드 · 무이자 할부 가능", recommended:true },
                        { icon:"📱", label:"카카오페이", sub:"카카오 계정으로 간편 결제" },
                        { icon:"🏦", label:"계좌이체", sub:"실시간 계좌이체" },
                        { icon:"📝", label:"가상계좌", sub:"입금 후 자동 확인" },
                      ].map((m, i) => (
                        <div key={m.label} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"16px 20px", background: i===0?"#FFF0ED":"#F8F6F2", border:`1.5px solid ${i===0?"#FFB8A8":"#E0DDD7"}`, borderRadius:"14px", cursor:"pointer", transition:"all 0.15s" }}>
                          <span style={{ fontSize:"24px", flexShrink:0 }}>{m.icon}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"2px" }}>{m.label}</div>
                            <div style={{ fontSize:"12px", color:"#888", fontWeight:400 }}>{m.sub}</div>
                          </div>
                          {m.recommended && <span style={{ background:"#FF3B1E", color:"white", padding:"3px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:800, flexShrink:0 }}>추천</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 보안 안내 */}
                  <div style={{ background:"#EEF2FF", border:"1px solid #B8C8FF", borderRadius:"14px", padding:"16px 20px", display:"flex", gap:"12px" }}>
                    <Shield size={20} color="#1847FF" style={{ flexShrink:0 }} />
                    <div style={{ fontSize:"13px", color:"#1847FF", fontWeight:400, lineHeight:1.6 }}>
                      <strong style={{ fontWeight:800 }}>안전한 결제:</strong> 픽스카의 모든 결제는 포트원(PortOne) PG사를 통해 처리돼요. 카드 정보는 저장되지 않아요.
                    </div>
                  </div>

                  <div style={{ display:"flex", gap:"12px" }}>
                    <button onClick={()=>setStep(2)} style={{ background:"white", color:"#1A1A1A", border:"2px solid #E0DDD7", borderRadius:"14px", padding:"16px 24px", fontSize:"15px", fontWeight:700, display:"flex", alignItems:"center", gap:"8px" }}>
                      <ArrowLeft size={16} /> 이전
                    </button>
                    <button className="btn-red" onClick={()=>setDone(true)} style={{ flex:1 }}>
                      <Lock size={18} /> 100만원 안전 결제하기
                    </button>
                  </div>
                </>
              )}

              {/* FAQ */}
              <div style={{ background:"white", borderRadius:"20px", overflow:"hidden" }}>
                <div style={{ padding:"22px 28px 14px", fontSize:"16px", fontWeight:800 }}>자주 묻는 질문</div>
                {faqs.map((f, i) => (
                  <div key={i} className="faq-item" onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ padding:"16px 28px", borderTop:"1px solid #F0EEE9" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:"12px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                        <span style={{ background:"#FFF0ED", color:"#FF3B1E", width:"26px", height:"26px", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:800, flexShrink:0 }}>Q</span>
                        <span style={{ fontSize:"14px", fontWeight:700 }}>{f.q}</span>
                      </div>
                      {openFaq===i ? <ChevronUp size={16} color="#AAA" /> : <ChevronDown size={16} color="#AAA" />}
                    </div>
                    {openFaq===i && (
                      <div style={{ marginTop:"12px", paddingTop:"12px", borderTop:"1px solid #F0EEE9", display:"flex", gap:"10px" }}>
                        <span style={{ background:"#EAF6EF", color:"#2D8A52", width:"26px", height:"26px", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:800, flexShrink:0 }}>A</span>
                        <div style={{ fontSize:"14px", color:"#555", lineHeight:1.75, fontWeight:400 }}>{f.a}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── 오른쪽 요약 ── */}
            <div className="summary-sticky" style={{ position:"sticky", top:"88px", display:"flex", flexDirection:"column", gap:"16px" }}>

              {/* 차량 정보 */}
              <div style={{ background:"white", borderRadius:"20px", overflow:"hidden" }}>
                <div style={{ height:"160px", overflow:"hidden", position:"relative" }}>
                  <img src={`https://source.unsplash.com/600x400/?${CAR.query}`} alt={CAR.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4))" }} />
                  <div style={{ position:"absolute", top:12, left:12, background:"#1847FF", color:"white", padding:"5px 12px", borderRadius:"100px", fontSize:"11px", fontWeight:800, display:"flex", alignItems:"center", gap:"4px" }}><Lock size={10} /> FIX PRICE</div>
                </div>
                <div style={{ padding:"18px 20px" }}>
                  <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"4px" }}>{CAR.name}</div>
                  <div style={{ fontSize:"13px", color:"#AAA", marginBottom:"14px", fontWeight:400 }}>{CAR.year} · {CAR.mileage} · {CAR.color}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", letterSpacing:"0.5px" }}>{CAR.price.toLocaleString()}<span style={{ fontSize:"14px", fontFamily:"'NanumSquareRound',sans-serif", fontWeight:700, color:"#AAA" }}>원</span></div>
                    <div style={{ background:"#1847FF", color:"white", padding:"4px 10px", borderRadius:"6px", fontSize:"11px", fontWeight:800 }}>FIX</div>
                  </div>
                </div>
              </div>

              {/* 결제 요약 */}
              <div style={{ background:"white", borderRadius:"20px", padding:"22px 22px" }}>
                <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"16px" }}>결제 요약</div>
                {[
                  ["차량 가격 (FIX)", `${CAR.price.toLocaleString()}원`],
                  ["지금 결제할 계약금", "1,000,000원"],
                  ["잔금 (인수 시)", `${(CAR.price-CAR.depositAmount).toLocaleString()}원`],
                  ...(payType==="installment" ? [["예상 월 납입금", `${monthly.toLocaleString()}원`] as [string, string]] : []),
                ].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid #F0EEE9" }}>
                    <span style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>{k}</span>
                    <span style={{ fontSize:"13px", fontWeight:800 }}>{v}</span>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", paddingTop:"14px", marginTop:"4px" }}>
                  <span style={{ fontSize:"15px", fontWeight:800, color:"#FF3B1E" }}>지금 결제</span>
                  <span style={{ fontFamily:"'Bebas Neue',serif", fontSize:"24px", color:"#FF3B1E", letterSpacing:"0.5px" }}>1,000,000<span style={{ fontSize:"13px", fontFamily:"'NanumSquareRound',sans-serif", fontWeight:700, color:"#AAA" }}>원</span></span>
                </div>
              </div>

              {/* 보증 */}
              <div style={{ background:"white", borderRadius:"20px", padding:"18px 20px" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {[
                    { icon:<Lock size={16} color="#1847FF"/>, text:"FIX 정찰가 · 추가 비용 없음" },
                    { icon:<Shield size={16} color="#2D8A52"/>, text:"100항목 직접 검수 완료" },
                    { icon:<RotateCcw size={16} color="#FF3B1E"/>, text:"3일 이내 환불 100% 보장" },
                    { icon:<Truck size={16} color="#555"/>, text:"1~2 영업일 내 탁송" },
                  ].map((g,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", fontSize:"13px", color:"#555", fontWeight:600 }}>
                      {g.icon} {g.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* 문의 */}
              <div style={{ background:"#F8F6F2", borderRadius:"16px", padding:"16px 18px", display:"flex", gap:"12px", alignItems:"center" }}>
                <div style={{ width:"38px", height:"38px", background:"#1A1A1A", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Phone size={18} color="white" />
                </div>
                <div>
                  <div style={{ fontSize:"13px", fontWeight:800 }}>결제 문의</div>
                  <div style={{ fontSize:"12px", color:"#888", fontWeight:400 }}>평일 09:00~18:00 · 062-000-0000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// RotateCcw 임포트 추가
function RotateCcw({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"></polyline>
      <path d="M3.51 15a9 9 0 1 0 .49-3.51"></path>
    </svg>
  );
}
