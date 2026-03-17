"use client";

import { useState } from "react";
import {
  Lock, Shield, Gauge, Fuel, MapPin, Users, Wrench,
  ChevronLeft, ChevronRight, Heart, Share2, Phone,
  CheckCircle, AlertCircle, Calculator, Star, ArrowRight,
  MessageCircle, X
} from "lucide-react";

interface Car {
  id: number;
  name: string;
  brand: string;
  year: number;
  mileage: number;
  fuel: string;
  color: string;
  region: string;
  price: number;
  cc: number;
  power: number;
  efficiency: string;
  transmission: string;
  owners: number;
  accident: boolean;
  status: string;
  tags: string[];
  options: string[];
  images: string[];
  dealer: {
    shopName: string;
    rating: number;
    dealCount: number;
    verified: boolean;
  };
}

const TABS = ["차량정보","이력조회","🔰 차 잘 몰라요","시세비교","후기"];

function getCarImage(car: Car, index = 0) {
  if (car.images && car.images.length > index) return car.images[index];
  const queries: Record<string, string> = {
    "아반떼": "hyundai+elantra+white+sedan",
    "K3": "kia+k3+silver+sedan",
    "투싼": "hyundai+tucson+suv",
    "아이오닉": "hyundai+ioniq5+electric",
    "엑센트": "hyundai+accent+small",
    "쏘렌토": "kia+sorento+suv",
    "쏘나타": "hyundai+sonata+sedan",
    "K5": "kia+k5+sedan",
  };
  const key = Object.keys(queries).find(k => car.name.includes(k));
  const query = key ? queries[key] : `${car.brand}+${car.fuel}+car`;
  return `https://source.unsplash.com/800x600/?${query}&sig=${index}`;
}

export default function CarDetailClient({ car }: { car: Car }) {
  const [activeTab, setActiveTab] = useState(0);
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [downPct, setDownPct] = useState(20);
  const [months, setMonths] = useState(60);
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  const totalImages = Math.max(car.images.length, 5);
  const imageUrls = Array.from({ length: totalImages }, (_, i) => getCarImage(car, i));

  const downAmount = Math.round(car.price * 10000 * downPct / 100);
  const loanAmount = car.price * 10000 - downAmount;
  const rate = 4.5 / 100 / 12;
  const monthly = Math.round(loanAmount * rate * Math.pow(1+rate,months) / (Math.pow(1+rate,months)-1));

  const annualTax = car.cc === 0 ? 130000 : car.cc <= 1000 ? Math.round(car.cc * 80) : car.cc <= 1600 ? Math.round(car.cc * 140) : Math.round(car.cc * 200);
  const kmPerYear = car.mileage / (2024 - car.year + 1);
  const kmStatus = kmPerYear < 15000 ? "매우 적음" : kmPerYear < 20000 ? "적당함" : kmPerYear < 30000 ? "보통" : "많음";
  const kmColor = kmPerYear < 15000 ? "#2D8A52" : kmPerYear < 20000 ? "#2D8A52" : kmPerYear < 30000 ? "#E8A020" : "#E84A4A";

  const FAQS = [
    { q: "중고차도 할부가 되나요?", a: "네! 캐피탈 금융사를 통해 할부 구매 가능해요. 계약금 결제 후 담당자가 연락드려요." },
    { q: "차량 상태를 직접 확인할 수 있나요?", a: "네, 딜러 사무소에서 직접 확인 가능해요. 또는 탁송 전 검수 영상을 요청할 수 있어요." },
    { q: "사고차가 아닌게 확실한가요?", a: `보험개발원 조회 결과 ${car.accident ? "사고이력이 있어요. 자세한 내용은 딜러에게 문의해주세요." : "무사고 차량이에요."}` },
    { q: "3일 환불이 정말 되나요?", a: "네! 픽스카는 구매 후 3일 이내 마음이 바뀌면 이유 불문 100% 환불을 보장해요." },
  ];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        input, textarea { font-family:'NanumSquareRound',sans-serif; }
        .tab-btn { transition:all 0.15s; cursor:pointer; border:none; background:transparent; white-space:nowrap; }
        .faq-item { cursor:pointer; transition:background 0.15s; }
        .faq-item:hover { background:#FAFAF8; }
        .thumb { cursor:pointer; transition:all 0.15s; border:2px solid; border-radius:10px; overflow:hidden; }
        .thumb:hover { transform:translateY(-2px); }
        .nav-link:hover { color:#1A1A1A !important; }
        @media(max-width:1024px) { .detail-grid { grid-template-columns:1fr !important; } .sticky-panel { position:static !important; } .nav-menu { display:none !important; } }
        @media(max-width:600px) { .page-wrap { padding:16px !important; } .thumb-grid { grid-template-columns:repeat(4,1fr) !important; } }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        {/* 공지 바 */}
        <div style={{ background:"#1A1A1A", color:"#fff", textAlign:"center", padding:"10px", fontSize:"13px", fontWeight:700 }}>
          <span style={{ color:"#FF7A63" }}>PICK</span> 맘에 드는 차를 픽하세요 &nbsp;·&nbsp; <span style={{ color:"#7A9BFF" }}>FIX</span> 정찰제
        </div>

        {/* 네비 */}
        <nav style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid #ECEAE4", height:"68px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 52px", position:"sticky", top:0, zIndex:100 }}>
          <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", letterSpacing:"3px" }}>
            <span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span>
          </a>
          <div className="nav-menu" style={{ display:"flex", gap:"36px" }}>
            {[["차 찾기","/cars"],["추천 퀴즈","/quiz"],["초보 가이드","/guide"],["내 차 팔기","/sell"]].map(([l,h])=>(
              <a key={l} href={h} className="nav-link" style={{ fontSize:"15px", fontWeight:700, color:"#888" }}>{l}</a>
            ))}
          </div>
          <a href="/cars" style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"14px", fontWeight:700, color:"#888" }}>
            <ChevronLeft size={16}/> 목록으로
          </a>
        </nav>

        <div className="page-wrap" style={{ maxWidth:"1360px", margin:"0 auto", padding:"28px 52px 80px" }}>
          <div className="detail-grid" style={{ display:"grid", gridTemplateColumns:"1fr 400px", gap:"28px", alignItems:"start" }}>

            {/* 왼쪽 */}
            <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>

              {/* 메인 이미지 */}
              <div style={{ background:"white", borderRadius:"22px", overflow:"hidden" }}>
                <div style={{ height:"420px", overflow:"hidden", position:"relative" }}>
                  <img src={imageUrls[imgIdx]} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"opacity 0.3s" }} key={imgIdx} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3))" }} />
                  {!car.accident && <div style={{ position:"absolute", top:16, left:16, background:"#2D8A52", color:"white", padding:"6px 14px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>✓ 무사고</div>}
                  <div style={{ position:"absolute", top:16, right:16, display:"flex", gap:"8px" }}>
                    <button onClick={()=>setLiked(!liked)} style={{ width:"40px", height:"40px", background:liked?"#FF3B1E":"rgba(255,255,255,0.92)", border:"none", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Heart size={18} fill={liked?"white":"none"} color={liked?"white":"#1A1A1A"} />
                    </button>
                    <button style={{ width:"40px", height:"40px", background:"rgba(255,255,255,0.92)", border:"none", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Share2 size={18} color="#1A1A1A" />
                    </button>
                  </div>
                  {imgIdx > 0 && <button onClick={()=>setImgIdx(i=>i-1)} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", width:"38px", height:"38px", background:"rgba(0,0,0,0.5)", border:"none", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronLeft size={18} color="white"/></button>}
                  {imgIdx < imageUrls.length-1 && <button onClick={()=>setImgIdx(i=>i+1)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", width:"38px", height:"38px", background:"rgba(0,0,0,0.5)", border:"none", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronRight size={18} color="white"/></button>}
                </div>
                <div className="thumb-grid" style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"8px", padding:"12px" }}>
                  {imageUrls.map((url, i) => (
                    <div key={i} className="thumb" onClick={()=>setImgIdx(i)} style={{ height:"70px", borderColor:imgIdx===i?"#FF3B1E":"transparent" }}>
                      <img src={url} alt={`${i+1}`} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* 핵심 지표 */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px" }}>
                {[
                  { icon:<Gauge size={20} color="#FF3B1E"/>, label:"주행거리", value:`${(car.mileage/1000).toFixed(0)}만km`, color:"#FF3B1E" },
                  { icon:<Fuel size={20} color="#1847FF"/>, label:"연비", value:`${car.efficiency}km/L`, color:"#1847FF" },
                  { icon:<Users size={20} color="#2D8A52"/>, label:"소유자", value:`${car.owners}인 오너`, color:"#2D8A52" },
                  { icon:<Shield size={20} color={car.accident?"#E84A4A":"#2D8A52"}/>, label:"사고이력", value:car.accident?"이력있음":"무사고", color:car.accident?"#E84A4A":"#2D8A52" },
                ].map(item => (
                  <div key={item.label} style={{ background:"white", borderRadius:"16px", padding:"16px", textAlign:"center" }}>
                    <div style={{ display:"flex", justifyContent:"center", marginBottom:"8px" }}>{item.icon}</div>
                    <div style={{ fontSize:"18px", fontWeight:800, color:item.color, marginBottom:"3px" }}>{item.value}</div>
                    <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* 탭 */}
              <div style={{ background:"white", borderRadius:"22px", overflow:"hidden" }}>
                <div style={{ display:"flex", borderBottom:"2px solid #F0EEE9", overflowX:"auto", padding:"0 8px" }}>
                  {TABS.map((tab,i) => (
                    <button key={tab} className="tab-btn" onClick={()=>setActiveTab(i)} style={{ padding:"16px 20px", fontSize:"14px", fontWeight:activeTab===i?800:600, color:activeTab===i?"#FF3B1E":"#888", borderBottom:`3px solid ${activeTab===i?"#FF3B1E":"transparent"}`, marginBottom:"-2px" }}>{tab}</button>
                  ))}
                </div>
                <div style={{ padding:"24px" }}>

                  {/* 차량 정보 */}
                  {activeTab===0 && (
                    <div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0" }}>
                        {[
                          ["브랜드", car.brand],
                          ["모델", car.name],
                          ["연식", `${car.year}년식`],
                          ["주행거리", `${car.mileage.toLocaleString()}km`],
                          ["연료", car.fuel],
                          ["색상", car.color],
                          ["변속기", car.transmission],
                          ["배기량", car.cc === 0 ? "전기모터" : `${car.cc.toLocaleString()}cc`],
                          ["최대출력", `${car.power}마력`],
                          ["소유자 수", `${car.owners}명`],
                          ["차량 위치", car.region],
                          ["사고이력", car.accident ? "이력있음" : "무사고"],
                        ].map(([k,v]) => (
                          <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"12px 14px", borderBottom:"1px solid #F0EEE9", background:"white" }}>
                            <span style={{ fontSize:"14px", color:"#888", fontWeight:400 }}>{k}</span>
                            <span style={{ fontSize:"14px", fontWeight:800 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                      {car.options.length > 0 && (
                        <div style={{ marginTop:"20px" }}>
                          <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"12px" }}>주요 옵션</div>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                            {car.options.map(opt => (
                              <span key={opt} style={{ background:"#EEF2FF", border:"1px solid #B8C8FF", padding:"6px 14px", borderRadius:"100px", fontSize:"13px", fontWeight:700, color:"#1847FF", display:"flex", alignItems:"center", gap:"5px" }}>
                                <CheckCircle size={12}/> {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 이력 조회 */}
                  {activeTab===1 && (
                    <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                      {[
                        { label:"보험 사고 이력", value:car.accident?"이력 있음":"이력 없음", ok:!car.accident },
                        { label:"침수 이력", value:"이력 없음", ok:true },
                        { label:"전손 이력", value:"이력 없음", ok:true },
                        { label:"소유자 변경", value:`${car.owners}회`, ok:car.owners<=1 },
                        { label:"압류·저당", value:"없음", ok:true },
                      ].map(item => (
                        <div key={item.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 18px", background:item.ok?"#EAF6EF":"#FFF0ED", border:`1px solid ${item.ok?"#B8DFC8":"#FFB8A8"}`, borderRadius:"12px" }}>
                          <span style={{ fontSize:"15px", fontWeight:700 }}>{item.label}</span>
                          <span style={{ fontSize:"14px", fontWeight:800, color:item.ok?"#2D8A52":"#E84A4A", display:"flex", alignItems:"center", gap:"5px" }}>
                            {item.ok ? <CheckCircle size={15}/> : <AlertCircle size={15}/>} {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 차 잘 몰라요 */}
                  {activeTab===2 && (
                    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
                      <div style={{ background:"#FFF8EC", border:"1px solid #FFD89A", borderRadius:"14px", padding:"16px 20px" }}>
                        <div style={{ fontSize:"15px", fontWeight:800, color:"#E8A020", marginBottom:"6px" }}>🔰 초보자를 위한 설명이에요</div>
                        <div style={{ fontSize:"13px", color:"#7A5500", lineHeight:1.7, fontWeight:400 }}>어려운 자동차 용어를 쉽게 설명해드릴게요!</div>
                      </div>

                      {[
                        { title:"이 차 연식이 어때요?", content:`${car.year}년식이면 ${2024-car.year}년 된 차예요. ${2024-car.year<=3?"최근 차라 상태가 좋아요 👍":2024-car.year<=5?"적당한 연식이에요":"조금 연식이 있지만 관리가 잘 됐다면 괜찮아요"}` },
                        { title:"주행거리가 많은가요?", content:`${car.mileage.toLocaleString()}km는 ${kmStatus}이에요. 연간 약 ${Math.round(kmPerYear/1000)}천km 주행한 셈이에요. ${kmPerYear < 20000 ? "일반적인 수준보다 적게 탔어요 👍" : "평균적인 주행거리예요"}`, bar:Math.min(car.mileage/200000*100, 100), color:kmColor },
                        { title:"자동차세가 얼마예요?", content:`이 차의 연간 자동차세는 약 ${annualTax.toLocaleString()}원이에요. 6월에 절반(${Math.round(annualTax/2).toLocaleString()}원), 12월에 절반을 내요.` },
                      ].map((item, i) => (
                        <div key={i} style={{ background:"#F8F6F2", borderRadius:"14px", padding:"18px 20px" }}>
                          <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"8px" }}>Q. {item.title}</div>
                          <div style={{ fontSize:"14px", color:"#555", lineHeight:1.75, fontWeight:400 }}>{item.content}</div>
                          {"bar" in item && (
                            <div style={{ marginTop:"12px" }}>
                              <div style={{ height:"8px", background:"#E0DDD7", borderRadius:"4px", overflow:"hidden" }}>
                                <div style={{ height:"8px", background:item.color, borderRadius:"4px", width:`${item.bar}%`, transition:"width 0.6s" }} />
                              </div>
                              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:"#AAA", marginTop:"4px", fontWeight:400 }}>
                                <span>0km</span><span>10만km</span><span>20만km</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* FAQ */}
                      <div>
                        <div style={{ fontSize:"16px", fontWeight:800, marginBottom:"12px" }}>자주 묻는 질문</div>
                        {FAQS.map((faq, i) => (
                          <div key={i} className="faq-item" onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ padding:"14px 16px", borderBottom:"1px solid #F0EEE9" }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                              <span style={{ fontSize:"14px", fontWeight:700 }}>Q. {faq.q}</span>
                              <span style={{ color:"#AAA", fontSize:"18px", fontWeight:300 }}>{openFaq===i?"−":"+"}</span>
                            </div>
                            {openFaq===i && <div style={{ marginTop:"10px", paddingTop:"10px", borderTop:"1px solid #F0EEE9", fontSize:"14px", color:"#555", lineHeight:1.75, fontWeight:400 }}>A. {faq.a}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 시세 비교 */}
                  {activeTab===3 && (
                    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                      <div style={{ background:"#EAF6EF", border:"1px solid #B8DFC8", borderRadius:"14px", padding:"18px 20px" }}>
                        <div style={{ fontSize:"14px", fontWeight:800, color:"#2D8A52", marginBottom:"4px" }}>픽스카 FIX 가격</div>
                        <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"36px", color:"#2D8A52", letterSpacing:"0.5px" }}>{car.price.toLocaleString()}만원</div>
                        <div style={{ fontSize:"13px", color:"#2D8A52", opacity:0.8, fontWeight:400 }}>시장 평균 대비 적정 가격이에요</div>
                      </div>
                      {[
                        { label:"시장 평균가 (동급 차량)", price:Math.round(car.price * 1.05) },
                        { label:"최고가 (최상위 옵션)", price:Math.round(car.price * 1.15) },
                        { label:"최저가 (주행거리 많음)", price:Math.round(car.price * 0.88) },
                      ].map(item => (
                        <div key={item.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", background:"#F8F6F2", borderRadius:"12px" }}>
                          <span style={{ fontSize:"14px", color:"#555", fontWeight:400 }}>{item.label}</span>
                          <span style={{ fontSize:"16px", fontWeight:800 }}>{item.price.toLocaleString()}만원</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 후기 */}
                  {activeTab===4 && (
                    <div style={{ textAlign:"center", padding:"40px 20px", color:"#AAA" }}>
                      <Star size={48} color="#E0DDD7" style={{ margin:"0 auto 16px" }} />
                      <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"8px", color:"#1A1A1A" }}>아직 후기가 없어요</div>
                      <div style={{ fontSize:"14px", fontWeight:400 }}>이 차를 구매하신 분의 첫 후기를 남겨주세요!</div>
                    </div>
                  )}
                </div>
              </div>

              {/* 할부 계산기 */}
              <div style={{ background:"white", borderRadius:"22px", padding:"24px 28px" }}>
                <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"18px", display:"flex", alignItems:"center", gap:"10px" }}>
                  <Calculator size={20} color="#FF3B1E"/> 할부 계산기
                </div>
                <div style={{ marginBottom:"16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"14px", fontWeight:700, marginBottom:"8px" }}>
                    <span>선수금</span><span style={{ color:"#FF3B1E", fontWeight:800 }}>{downPct}% — {(downAmount/10000).toFixed(0)}만원</span>
                  </div>
                  <input type="range" min="10" max="50" step="5" value={downPct} onChange={e=>setDownPct(parseInt(e.target.value))} style={{ width:"100%", accentColor:"#FF3B1E" }} />
                </div>
                <div style={{ marginBottom:"18px" }}>
                  <div style={{ fontSize:"14px", fontWeight:700, marginBottom:"8px" }}>할부 기간</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:"6px" }}>
                    {[12,24,36,48,60,72].map(m => (
                      <button key={m} onClick={()=>setMonths(m)} style={{ padding:"9px 0", borderRadius:"10px", border:`1.5px solid ${months===m?"#FF3B1E":"#E0DDD7"}`, background:months===m?"#FF3B1E":"#F8F6F2", color:months===m?"white":"#555", fontSize:"13px", fontWeight:800, cursor:"pointer" }}>
                        {m}개월
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ background:"#1A1A1A", borderRadius:"14px", padding:"18px 22px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                  <div>
                    <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", marginBottom:"4px", fontWeight:400 }}>월 납입금</div>
                    <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"32px", color:"#FF3B1E", letterSpacing:"0.5px" }}>{monthly.toLocaleString()}</div>
                    <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)", marginTop:"2px", fontWeight:400 }}>원 / {months}개월</div>
                  </div>
                  <div>
                    <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", marginBottom:"4px", fontWeight:400 }}>대출 금액</div>
                    <div style={{ fontSize:"18px", fontWeight:800, color:"white" }}>{(loanAmount/10000).toFixed(0)}만원</div>
                    <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)", marginTop:"2px", fontWeight:400 }}>연이율 4.5%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽 고정 패널 */}
            <div className="sticky-panel" style={{ position:"sticky", top:"88px", display:"flex", flexDirection:"column", gap:"16px" }}>

              {/* 차량 요약 */}
              <div style={{ background:"white", borderRadius:"20px", padding:"24px" }}>
                <div style={{ fontSize:"20px", fontWeight:800, letterSpacing:"-0.5px", marginBottom:"4px" }}>{car.name}</div>
                <div style={{ fontSize:"13px", color:"#AAA", marginBottom:"16px", fontWeight:400 }}>
                  {car.year}년식 · {car.mileage.toLocaleString()}km · {car.fuel} · {car.color}
                </div>
                <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"16px" }}>
                  {car.tags.map(tag => (
                    <span key={tag} style={{ background:"#EAF6EF", border:"1px solid #B8DFC8", padding:"4px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:700, color:"#2D8A52" }}>✓ {tag}</span>
                  ))}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", paddingTop:"14px", borderTop:"1px solid #F0EEE9" }}>
                  <div>
                    <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"40px", letterSpacing:"0.5px", lineHeight:1 }}>{car.price.toLocaleString()}<span style={{ fontSize:"16px", fontFamily:"'NanumSquareRound',sans-serif", fontWeight:700, color:"#AAA", marginLeft:"4px" }}>만원</span></div>
                    <div style={{ fontSize:"12px", color:"#1847FF", fontWeight:800, marginTop:"4px", display:"flex", alignItems:"center", gap:"3px" }}><Lock size={11}/> FIX 정찰가 · 흥정 없음</div>
                  </div>
                  <span style={{ background:car.status==="AVAILABLE"?"#EAF6EF":car.status==="RESERVED"?"#EEF2FF":"#F8F6F2", color:car.status==="AVAILABLE"?"#2D8A52":car.status==="RESERVED"?"#1847FF":"#888", padding:"5px 12px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>
                    {car.status==="AVAILABLE"?"판매중":car.status==="RESERVED"?"예약중":"판매완료"}
                  </span>
                </div>
              </div>

              {/* 딜러 정보 */}
              <div style={{ background:"white", borderRadius:"18px", padding:"18px 20px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"14px" }}>
                  <div style={{ width:"44px", height:"44px", background:"#EEF2FF", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Users size={20} color="#1847FF" />
                  </div>
                  <div>
                    <div style={{ fontSize:"15px", fontWeight:800 }}>{car.dealer.shopName}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                      <Star size={12} fill="#FFD700" color="#FFD700" />
                      <span style={{ fontSize:"13px", fontWeight:700 }}>{car.dealer.rating}</span>
                      <span style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>({car.dealer.dealCount}건)</span>
                      {car.dealer.verified && <span style={{ background:"#EEF2FF", color:"#1847FF", padding:"2px 8px", borderRadius:"100px", fontSize:"10px", fontWeight:800 }}>🏅 인증</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:"8px" }}>
                  <button style={{ flex:1, background:"#F8F6F2", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"11px", fontSize:"13px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                    <Phone size={14}/> 전화하기
                  </button>
                  <button onClick={()=>setShowInquiry(true)} style={{ flex:1, background:"#1A1A1A", color:"white", border:"none", borderRadius:"10px", padding:"11px", fontSize:"13px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                    <MessageCircle size={14}/> 문의하기
                  </button>
                </div>
              </div>

              {/* 픽스카 보장 */}
              <div style={{ background:"white", borderRadius:"18px", padding:"18px 20px" }}>
                {[
                  { icon:<Lock size={15} color="#1847FF"/>, text:"FIX 정찰가 · 흥정 없음" },
                  { icon:<Shield size={15} color="#2D8A52"/>, text:"100항목 직접 검수 완료" },
                  { icon:<Wrench size={15} color="#E8A020"/>, text:"3일 환불 100% 보장" },
                  { icon:<MapPin size={15} color="#555"/>, text:`${car.region} 위치` },
                ].map((g,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", fontSize:"13px", color:"#555", fontWeight:600, marginBottom:i<3?"10px":"0" }}>
                    {g.icon} {g.text}
                  </div>
                ))}
              </div>

              {/* CTA 버튼 */}
              {car.status === "AVAILABLE" ? (
                <a href={`/checkout?carId=${car.id}`}>
                  <button style={{ width:"100%", background:"#FF3B1E", color:"white", border:"none", borderRadius:"14px", padding:"18px", fontSize:"16px", fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
                    <Lock size={18}/> 지금 픽하기 <ArrowRight size={16}/>
                  </button>
                </a>
              ) : (
                <button disabled style={{ width:"100%", background:"#E0DDD7", color:"#AAA", border:"none", borderRadius:"14px", padding:"18px", fontSize:"16px", fontWeight:800, cursor:"default" }}>
                  {car.status === "RESERVED" ? "예약 중인 차량이에요" : "판매 완료된 차량이에요"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 문의 모달 */}
        {showInquiry && (
          <div onClick={e=>{ if(e.target===e.currentTarget) setShowInquiry(false); }} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
            <div style={{ background:"white", borderRadius:"22px", padding:"28px 32px", width:"100%", maxWidth:"480px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
                <div style={{ fontSize:"18px", fontWeight:800 }}>딜러에게 문의하기</div>
                <button onClick={()=>setShowInquiry(false)} style={{ background:"none", border:"none", cursor:"pointer" }}><X size={22} color="#888"/></button>
              </div>
              <div style={{ background:"#F8F6F2", borderRadius:"12px", padding:"12px 16px", marginBottom:"16px", fontSize:"14px", fontWeight:700 }}>
                {car.name} · {car.price.toLocaleString()}만원
              </div>
              <textarea value={inquiryMsg} onChange={e=>setInquiryMsg(e.target.value)} placeholder="궁금한 점을 자유롭게 적어주세요..." rows={5} style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"12px", padding:"14px", fontSize:"14px", outline:"none", resize:"none", marginBottom:"14px" }} />
              <button onClick={()=>{ alert("문의가 전송됐어요!"); setShowInquiry(false); setInquiryMsg(""); }} disabled={!inquiryMsg} style={{ width:"100%", background:inquiryMsg?"#FF3B1E":"#E0DDD7", color:inquiryMsg?"white":"#AAA", border:"none", borderRadius:"12px", padding:"15px", fontSize:"15px", fontWeight:800, cursor:inquiryMsg?"pointer":"default" }}>
                문의 전송
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
