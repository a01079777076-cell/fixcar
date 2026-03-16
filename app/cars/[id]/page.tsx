"use client";

import { useState } from "react";
import {
  Car, Fuel, MapPin, Shield, Calendar, Gauge, Users, Wrench,
  ChevronRight, Heart, Share2, Phone, MessageCircle, CheckCircle,
  AlertCircle, TrendingDown, Calculator, FileText, Star,
  ChevronDown, ChevronUp, Zap, DollarSign, Clock, Award
} from "lucide-react";

const carData: Record<string, {
  id: number; name: string; brand: string; fullName: string;
  year: string; yearNum: number; mileage: number; fuel: string; color: string;
  region: string; price: number; transmission: string;
  owners: number; accident: boolean; efficiency: string;
  cc: number; power: string; tags: string[];
  options: string[]; unsplashQuery: string;
  dealerName: string; dealerRating: string; dealerDeals: string;
  description: string; taxBase: number;
}> = {
  "1": {
    id: 1, name: "아반떼 CN7", brand: "현대", fullName: "현대 아반떼 CN7 1.6 가솔린",
    year: "2021년식", yearNum: 2021, mileage: 32000, fuel: "가솔린", color: "흰색",
    region: "광주 북구", price: 1450, transmission: "자동",
    owners: 1, accident: false, efficiency: "15.2", cc: 1598, power: "123마력",
    tags: ["무사고", "초보 추천", "1인 오너"],
    options: ["스마트크루즈", "후방카메라", "애플카플레이", "열선시트", "LED 헤드램프"],
    unsplashQuery: "hyundai+elantra+white+car",
    dealerName: "박준형", dealerRating: "4.9", dealerDeals: "142",
    description: "출퇴근용으로 딱 좋은 실용적인 세단이에요. 작아서 주차도 쉽고, 연비가 좋아서 유지비 부담이 적어요. 처음 차를 사는 분들이 가장 많이 선택해요.",
    taxBase: 1598,
  },
  "2": {
    id: 2, name: "K3", brand: "기아", fullName: "기아 K3 1.6 가솔린 프레스티지",
    year: "2020년식", yearNum: 2020, mileage: 51000, fuel: "가솔린", color: "실버",
    region: "광주 서구", price: 1090, transmission: "자동",
    owners: 1, accident: false, efficiency: "13.8", cc: 1591, power: "128마력",
    tags: ["무사고", "가성비", "1인 오너"],
    options: ["후방카메라", "스마트키", "열선시트", "LED 주간주행등"],
    unsplashQuery: "kia+k3+silver+sedan",
    dealerName: "김민수", dealerRating: "4.7", dealerDeals: "89",
    description: "가격 대비 성능이 뛰어난 가성비 세단이에요. 유지비가 저렴하고 부품 구하기도 쉬워요.",
    taxBase: 1591,
  },
  "3": {
    id: 3, name: "투싼 NX4", brand: "현대", fullName: "현대 투싼 NX4 2.0 가솔린",
    year: "2022년식", yearNum: 2022, mileage: 28000, fuel: "가솔린", color: "검정",
    region: "광주 남구", price: 2780, transmission: "자동",
    owners: 1, accident: false, efficiency: "12.4", cc: 1999, power: "156마력",
    tags: ["1인 오너", "가족용", "넓은 트렁크"],
    options: ["파노라마 선루프", "BOSE 사운드", "원격 스마트 주차보조", "HDA2"],
    unsplashQuery: "hyundai+tucson+suv+black",
    dealerName: "박준형", dealerRating: "4.9", dealerDeals: "142",
    description: "가족과 함께 쓰기 좋은 넉넉한 SUV예요. 트렁크가 크고 시야가 높아 운전하기 편해요.",
    taxBase: 1999,
  },
};

function calcTax(cc: number): number {
  if (cc <= 1000) return Math.round(cc * 80);
  if (cc <= 1600) return Math.round(cc * 140);
  if (cc <= 2000) return Math.round(cc * 200);
  return Math.round(cc * 220);
}

function getMileageStatus(mileage: number, yearNum: number): { label: string; color: string; desc: string; pct: number } {
  const years = new Date().getFullYear() - yearNum;
  const avgPerYear = 15000;
  const expected = years * avgPerYear;
  const ratio = mileage / expected;
  if (ratio < 0.6) return { label: "매우 적게 탔어요", color: "#3A9E62", desc: `연평균 ${Math.round(mileage / Math.max(years, 1)).toLocaleString()}km — 평균보다 훨씬 적게 탔어요`, pct: Math.min((mileage / 150000) * 100, 100) };
  if (ratio < 0.9) return { label: "적당히 탔어요", color: "#1847FF", desc: `연평균 ${Math.round(mileage / Math.max(years, 1)).toLocaleString()}km — 평균보다 조금 적게 탔어요`, pct: Math.min((mileage / 150000) * 100, 100) };
  if (ratio < 1.2) return { label: "평균 수준이에요", color: "#E8A020", desc: `연평균 ${Math.round(mileage / Math.max(years, 1)).toLocaleString()}km — 보통 수준이에요`, pct: Math.min((mileage / 150000) * 100, 100) };
  return { label: "많이 탔어요", color: "#E84A4A", desc: `연평균 ${Math.round(mileage / Math.max(years, 1)).toLocaleString()}km — 평균보다 많이 탔어요`, pct: Math.min((mileage / 150000) * 100, 100) };
}

const QNA = [
  { q: "중고차 살 때 가장 중요한 게 뭔가요?", a: "사고이력 확인이 가장 중요해요. 보험개발원(carhistory.or.kr)에서 무료로 조회할 수 있어요. 그 다음은 실제로 직접 보고 타보는 시승이에요." },
  { q: "주행거리가 많으면 무조건 나쁜 건가요?", a: "꼭 그렇지는 않아요. 고속도로 위주로 탄 10만km짜리가 도심에서 막힌 5만km짜리보다 엔진 상태가 좋을 수 있어요. 정비 이력을 함께 봐야 해요." },
  { q: "자동차세는 어떻게 계산되나요?", a: "배기량(cc) × 단가로 계산돼요. 1600cc 이하는 cc당 140원, 2000cc 이하는 200원이에요. 6월과 12월에 나눠서 납부해요." },
  { q: "할부로 사면 이자가 많이 붙나요?", a: "캐피탈 기준 연 4~7% 이자가 붙어요. 예를 들어 1000만원을 60개월 할부하면 총 140만원 정도 이자가 생겨요. 여윳돈이 있다면 선수금을 높이면 이자를 줄일 수 있어요." },
  { q: "무사고라도 수리 흔적이 있을 수 있나요?", a: "네, 맞아요. 가벼운 긁힘이나 도어 교환은 보험 처리 없이 자비로 수리하면 이력에 안 나와요. 직접 볼 때 도어 틈새가 균일한지 확인하는 게 좋아요." },
  { q: "탁송이 뭔가요?", a: "차를 직접 운전해서 가져다 주는 서비스예요. 멀리 있어도 집 앞까지 차를 배달해줘요. 픽스카에서는 계약 후 1~2일 내 탁송이 가능해요." },
];

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const car = carData[params.id] || carData["1"];
  const [activeTab, setActiveTab] = useState("overview");
  const [liked, setLiked] = useState(false);
  const [months, setMonths] = useState(60);
  const [showModal, setShowModal] = useState(false);
  const [openQna, setOpenQna] = useState<number | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  const tax = calcTax(car.cc);
  const mileageStatus = getMileageStatus(car.mileage, car.yearNum);
  const imgQueries = [car.unsplashQuery, "car+interior+seat", "car+engine+clean", "car+dashboard+modern", "car+wheel+rim"];
  const imgLabels = ["외관", "실내", "엔진룸", "대시보드", "타이어"];

  const calcMonthly = (m: number) => {
    const price = car.price * 10000;
    const rate = 0.049 / 12;
    return Math.round(price * rate * Math.pow(1 + rate, m) / (Math.pow(1 + rate, m) - 1)).toLocaleString();
  };

  const tabs = [
    { key: "overview", label: "차량 정보" },
    { key: "history", label: "이력 조회" },
    { key: "beginner", label: "🔰 차 잘 몰라요" },
    { key: "price", label: "시세 비교" },
    { key: "review", label: "후기" },
  ];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { font-size: 16px; }
        body { font-family:'NanumSquareRound','Noto Sans KR',sans-serif; background:#F0EEE9; color:#1A1A1A; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound','Noto Sans KR',sans-serif; }

        .nav-link:hover { color:#1A1A1A !important; }
        .thumb-btn { transition:all 0.18s; cursor:pointer; }
        .thumb-btn:hover { opacity:0.85; }
        .tab-item { transition:all 0.18s; cursor:pointer; white-space:nowrap; }
        .tab-item:hover { color:#FF3B1E !important; }
        .card { background:#fff; border-radius:20px; }
        .hover-lift { transition:all 0.22s; cursor:pointer; }
        .hover-lift:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.09); }
        .btn-red { background:#FF3B1E; color:#fff; border:none; border-radius:14px; font-size:17px; font-weight:800; cursor:pointer; width:100%; padding:19px; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:10px; }
        .btn-red:hover { background:#D42E14; transform:translateY(-2px); box-shadow:0 10px 28px rgba(255,59,30,0.35); }
        .btn-outline { background:#fff; border:2px solid #E0DDD7; border-radius:14px; font-size:15px; font-weight:700; cursor:pointer; width:100%; padding:16px; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px; color:#1A1A1A; }
        .btn-outline:hover { border-color:#1A1A1A; }
        .btn-kakao { background:#FEE500; border:none; border-radius:14px; font-size:15px; font-weight:800; cursor:pointer; width:100%; padding:16px; color:#391B1B; display:flex; align-items:center; justify-content:center; gap:8px; }
        .qna-item { border-bottom:1px solid #F0EEE9; cursor:pointer; transition:background 0.15s; }
        .qna-item:hover { background:#FAFAF8; }

        @media(max-width:1100px) {
          .page-grid { grid-template-columns:1fr !important; }
          .panel-sticky { position:static !important; }
          .nav-menu { display:none !important; }
          .related-grid { grid-template-columns:1fr 1fr !important; }
        }
        @media(max-width:600px) {
          .page-wrap { padding:0 16px 60px !important; }
          .stat-4 { grid-template-columns:1fr 1fr !important; }
          .related-grid { grid-template-columns:1fr 1fr !important; }
          .options-grid { grid-template-columns:1fr !important; }
          .check-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>

        {/* 공지 바 */}
        <div style={{ background:"#1A1A1A", color:"#fff", textAlign:"center", padding:"10px 20px", fontSize:"13px", fontWeight:700, letterSpacing:"0.2px" }}>
          <span style={{ color:"#FF7A63" }}>PICK</span> 맘에 드는 차를 픽하세요 &nbsp;·&nbsp;
          <span style={{ color:"#7A9BFF" }}>FIX</span> 정찰제 — 가격 흥정 없음 &nbsp;·&nbsp;
          ✓ 100항목 검수 &nbsp;·&nbsp; 3일 환불 보장
        </div>

        {/* 네비게이션 */}
        <nav style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid #ECEAE4", height:"68px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 52px", position:"sticky", top:0, zIndex:100 }}>
          <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", letterSpacing:"3px" }}>
            <span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span>
          </a>
          <div className="nav-menu" style={{ display:"flex", gap:"36px" }}>
            {[["차 찾기","/cars"],["추천 퀴즈","/quiz"],["초보 가이드","/guide"],["내 차 팔기","/sell"]].map(([l,h])=>(
              <a key={l} href={h} className="nav-link" style={{ fontSize:"15px", fontWeight:700, color:"#888" }}>{l}</a>
            ))}
          </div>
          <div style={{ display:"flex", gap:"10px" }}>
            <button className="btn-outline" style={{ width:"auto", padding:"9px 20px", fontSize:"14px" }}>로그인</button>
            <button className="btn-red" style={{ width:"auto", padding:"10px 22px", fontSize:"14px", borderRadius:"100px" }}>✨ 내 차 픽하기</button>
          </div>
        </nav>

        {/* 브레드크럼 */}
        <div style={{ maxWidth:"1360px", margin:"0 auto", padding:"16px 52px", display:"flex", alignItems:"center", gap:"8px", fontSize:"14px", color:"#AAA" }}>
          <a href="/" style={{ color:"#AAA" }}>홈</a>
          <ChevronRight size={14} />
          <a href="/cars" style={{ color:"#AAA" }}>차량 목록</a>
          <ChevronRight size={14} />
          <span style={{ color:"#1A1A1A", fontWeight:700 }}>{car.brand} {car.name}</span>
        </div>

        {/* 페이지 그리드 */}
        <div className="page-wrap page-grid" style={{ maxWidth:"1360px", margin:"0 auto", padding:"0 52px 100px", display:"grid", gridTemplateColumns:"1fr 420px", gap:"28px", alignItems:"start" }}>

          {/* ─── 왼쪽 ─── */}
          <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>

            {/* 갤러리 */}
            <div className="card" style={{ overflow:"hidden" }}>
              <div style={{ position:"relative", height:"460px", background:"#E8E4DC", overflow:"hidden" }}>
                <img
                  src={`https://source.unsplash.com/1200x700/?${imgQueries[activeImg]}`}
                  alt={car.fullName}
                  style={{ width:"100%", height:"100%", objectFit:"cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }}
                />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35))" }} />
                {/* 배지 */}
                <div style={{ position:"absolute", top:20, left:20, display:"flex", gap:"8px" }}>
                  <span style={{ background:"#FF3B1E", color:"#fff", padding:"7px 16px", borderRadius:"100px", fontSize:"13px", fontWeight:800 }}>✨ PICK 추천</span>
                  <span style={{ background:"#1847FF", color:"#fff", padding:"7px 16px", borderRadius:"100px", fontSize:"13px", fontWeight:800 }}>🔒 FIX 가격</span>
                  {!car.accident && <span style={{ background:"#2D8A52", color:"#fff", padding:"7px 16px", borderRadius:"100px", fontSize:"13px", fontWeight:800 }}>✓ 무사고</span>}
                </div>
                {/* 찜 / 공유 */}
                <div style={{ position:"absolute", top:20, right:20, display:"flex", gap:"8px" }}>
                  <button onClick={()=>setLiked(!liked)} style={{ width:"44px", height:"44px", background:liked?"#FF3B1E":"rgba(255,255,255,0.9)", border:"none", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
                    <Heart size={20} fill={liked?"white":"none"} color={liked?"white":"#1A1A1A"} />
                  </button>
                  <button style={{ width:"44px", height:"44px", background:"rgba(255,255,255,0.9)", border:"none", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Share2 size={20} color="#1A1A1A" />
                  </button>
                </div>
                {/* 차량명 하단 오버레이 */}
                <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"24px 28px" }}>
                  <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.7)", fontWeight:700, marginBottom:"4px" }}>{car.brand}자동차 · {car.year}</div>
                  <div style={{ fontSize:"clamp(22px,3vw,32px)", fontWeight:800, color:"#fff", letterSpacing:"-0.5px", lineHeight:1.2 }}>{car.fullName}</div>
                </div>
              </div>
              {/* 썸네일 */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", borderTop:"1px solid #F0EEE9" }}>
                {imgQueries.map((q,i)=>(
                  <button key={i} className="thumb-btn" onClick={()=>setActiveImg(i)} style={{ padding:"0", border:"none", background:activeImg===i?"#FFF1EE":"#fff", borderBottom:`3px solid ${activeImg===i?"#FF3B1E":"transparent"}`, borderRight:i<4?"1px solid #F0EEE9":"none", cursor:"pointer" }}>
                    <img src={`https://source.unsplash.com/160x100/?${q}`} alt={imgLabels[i]} style={{ width:"100%", height:"72px", objectFit:"cover", display:"block" }} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
                    <div style={{ padding:"6px 0 8px", fontSize:"11px", fontWeight:700, color:activeImg===i?"#FF3B1E":"#AAA", textAlign:"center" }}>{imgLabels[i]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 태그 + 한줄 설명 */}
            <div className="card" style={{ padding:"28px 32px" }}>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"20px" }}>
                {car.tags.map(tag=>(
                  <span key={tag} style={{ padding:"7px 16px", borderRadius:"100px", fontSize:"13px", fontWeight:700, background: tag.includes("무사고")||tag.includes("오너")?"#EAF6EF":tag.includes("초보")||tag.includes("추천")?"#FFF0ED":"#F0EEE9", color: tag.includes("무사고")||tag.includes("오너")?"#2D8A52":tag.includes("초보")||tag.includes("추천")?"#FF3B1E":"#555", border:`1px solid ${tag.includes("무사고")||tag.includes("오너")?"#B8DFC8":tag.includes("초보")||tag.includes("추천")?"#FFBDB3":"#E0DDD7"}` }}>
                    {tag.includes("무사고") && "✓ "}{tag.includes("오너") && "👤 "}{tag.includes("초보") && "🔰 "}{tag.includes("가성비") && "💰 "}{tag.includes("가족") && "👨‍👩‍👧 "}{tag}
                  </span>
                ))}
              </div>
              <div style={{ background:"#FFFBF5", border:"1px solid #FFE8CC", borderRadius:"14px", padding:"18px 22px", display:"flex", gap:"14px" }}>
                <div style={{ width:"40px", height:"40px", background:"#FF3B1E", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Zap size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontSize:"12px", fontWeight:800, color:"#FF3B1E", marginBottom:"5px", letterSpacing:"0.5px" }}>픽스카 한줄 요약</div>
                  <div style={{ fontSize:"15px", color:"#444", lineHeight:1.75, fontWeight:400 }}>{car.description}</div>
                </div>
              </div>
            </div>

            {/* 핵심 지표 4개 */}
            <div className="card" style={{ padding:"28px 32px" }}>
              <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"22px" }}>이 차, 한눈에 보기</div>
              <div className="stat-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"20px" }}>

                {/* 가격 */}
                <div className="hover-lift" style={{ background:"#FFF0ED", border:"1.5px solid #FFB8A8", borderRadius:"18px", padding:"22px 16px", textAlign:"center" }}>
                  <div style={{ width:"44px", height:"44px", background:"#FF3B1E", borderRadius:"14px", margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <DollarSign size={22} color="white" />
                  </div>
                  <div style={{ fontSize:"11px", fontWeight:800, color:"#FF3B1E", marginBottom:"8px", letterSpacing:"0.5px" }}>FIX 가격</div>
                  <div style={{ fontSize:"24px", fontWeight:800, letterSpacing:"-0.5px" }}>{car.price.toLocaleString()}<span style={{ fontSize:"13px", color:"#AAA", fontWeight:700 }}>만원</span></div>
                  <div style={{ fontSize:"11px", color:"#FF3B1E", fontWeight:700, marginTop:"6px" }}>흥정 없는 고정가</div>
                </div>

                {/* 주행거리 */}
                <div className="hover-lift" style={{ background:"#EEF2FF", border:"1.5px solid #B8C8FF", borderRadius:"18px", padding:"22px 16px", textAlign:"center" }}>
                  <div style={{ width:"44px", height:"44px", background:"#1847FF", borderRadius:"14px", margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Gauge size={22} color="white" />
                  </div>
                  <div style={{ fontSize:"11px", fontWeight:800, color:"#1847FF", marginBottom:"8px", letterSpacing:"0.5px" }}>주행거리</div>
                  <div style={{ fontSize:"24px", fontWeight:800, letterSpacing:"-0.5px" }}>{(car.mileage/1000).toFixed(0)}<span style={{ fontSize:"13px", color:"#AAA", fontWeight:700 }}>만km</span></div>
                  <div style={{ fontSize:"11px", color:mileageStatus.color, fontWeight:700, marginTop:"6px" }}>{mileageStatus.label}</div>
                </div>

                {/* 연비 */}
                <div className="hover-lift" style={{ background:"#EAF6EF", border:"1.5px solid #A8DACB", borderRadius:"18px", padding:"22px 16px", textAlign:"center" }}>
                  <div style={{ width:"44px", height:"44px", background:"#2D8A52", borderRadius:"14px", margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Fuel size={22} color="white" />
                  </div>
                  <div style={{ fontSize:"11px", fontWeight:800, color:"#2D8A52", marginBottom:"8px", letterSpacing:"0.5px" }}>연비</div>
                  <div style={{ fontSize:"24px", fontWeight:800, letterSpacing:"-0.5px" }}>{car.efficiency}<span style={{ fontSize:"13px", color:"#AAA", fontWeight:700 }}>km/L</span></div>
                  <div style={{ fontSize:"11px", color:"#2D8A52", fontWeight:700, marginTop:"6px" }}>좋은 편이에요</div>
                </div>

                {/* 사고 */}
                <div className="hover-lift" style={{ background:car.accident?"#FFF8ED":"#EAF6EF", border:`1.5px solid ${car.accident?"#FFCF8A":"#A8DACB"}`, borderRadius:"18px", padding:"22px 16px", textAlign:"center" }}>
                  <div style={{ width:"44px", height:"44px", background:car.accident?"#E8A020":"#2D8A52", borderRadius:"14px", margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Shield size={22} color="white" />
                  </div>
                  <div style={{ fontSize:"11px", fontWeight:800, color:car.accident?"#E8A020":"#2D8A52", marginBottom:"8px", letterSpacing:"0.5px" }}>사고이력</div>
                  <div style={{ fontSize:"22px", fontWeight:800 }}>{car.accident?"이력있음":"무사고"}</div>
                  <div style={{ fontSize:"11px", color:car.accident?"#E8A020":"#2D8A52", fontWeight:700, marginTop:"6px" }}>{car.accident?"확인 필요":"깨끗해요"}</div>
                </div>
              </div>

              {/* 추가 정보 3개 */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px" }}>
                {[
                  { icon:<Users size={18} color="#555" />, label:"이전 소유자", value:`${car.owners}명`, sub: car.owners===1?"처음부터 한 분만":"여러 분이 사용" },
                  { icon:<Wrench size={18} color="#555" />, label:"변속기", value:car.transmission, sub:"운전 편해요" },
                  { icon:<MapPin size={18} color="#555" />, label:"차량 위치", value:car.region, sub:"직접 보러 가기 쉬워요" },
                ].map((item)=>(
                  <div key={item.label} style={{ background:"#F8F6F2", borderRadius:"14px", padding:"18px 16px" }}>
                    <div style={{ marginBottom:"8px" }}>{item.icon}</div>
                    <div style={{ fontSize:"12px", color:"#AAA", fontWeight:700, marginBottom:"4px" }}>{item.label}</div>
                    <div style={{ fontSize:"16px", fontWeight:800 }}>{item.value}</div>
                    <div style={{ fontSize:"12px", color:"#888", marginTop:"3px", fontWeight:400 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 탭 카드 */}
            <div className="card" style={{ overflow:"hidden" }}>
              {/* 탭 헤더 */}
              <div style={{ display:"flex", borderBottom:"2px solid #F0EEE9", overflowX:"auto" }}>
                {tabs.map(t=>(
                  <button key={t.key} className="tab-item" onClick={()=>setActiveTab(t.key)} style={{ padding:"18px 20px", fontSize:"14px", fontWeight:activeTab===t.key?800:600, color:activeTab===t.key?"#FF3B1E":"#AAA", background:activeTab===t.key?"#FFF8F6":"#fff", borderBottom:`3px solid ${activeTab===t.key?"#FF3B1E":"transparent"}`, border:"none", marginBottom:"-2px", flexShrink:0 }}>
                    {t.label}
                  </button>
                ))}
              </div>

              <div style={{ padding:"32px" }}>

                {/* ── 차량 정보 탭 ── */}
                {activeTab==="overview" && (
                  <div>
                    <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"18px" }}>차량 기본 스펙</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"32px" }}>
                      {[
                        { icon:<Calendar size={18}/>, label:"연식", value:car.year },
                        { icon:<Gauge size={18}/>, label:"주행거리", value:car.mileage.toLocaleString()+"km" },
                        { icon:<Fuel size={18}/>, label:"연료", value:car.fuel },
                        { icon:<Wrench size={18}/>, label:"변속기", value:car.transmission },
                        { icon:<Car size={18}/>, label:"색상", value:car.color },
                        { icon:<Zap size={18}/>, label:"배기량", value:car.cc.toLocaleString()+"cc" },
                        { icon:<Zap size={18}/>, label:"최대출력", value:car.power },
                        { icon:<Users size={18}/>, label:"소유자", value:`${car.owners}명` },
                      ].map(item=>(
                        <div key={item.label} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"16px 18px", background:"#F8F6F2", borderRadius:"14px" }}>
                          <div style={{ color:"#888", flexShrink:0 }}>{item.icon}</div>
                          <div>
                            <div style={{ fontSize:"12px", color:"#AAA", fontWeight:700, marginBottom:"3px" }}>{item.label}</div>
                            <div style={{ fontSize:"15px", fontWeight:800 }}>{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"16px" }}>기본 탑재 옵션</div>
                    <div className="options-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                      {car.options.map(opt=>(
                        <div key={opt} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px 18px", background:"#EAF6EF", borderRadius:"12px", border:"1px solid #B8DFC8" }}>
                          <CheckCircle size={18} color="#2D8A52" />
                          <span style={{ fontSize:"14px", fontWeight:700, color:"#1E6A38" }}>{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── 이력 조회 탭 ── */}
                {activeTab==="history" && (
                  <div>
                    <div style={{ background:"#EAF6EF", border:"1.5px solid #A8DACB", borderRadius:"16px", padding:"22px 24px", marginBottom:"28px", display:"flex", alignItems:"center", gap:"16px" }}>
                      <div style={{ width:"52px", height:"52px", background:"#2D8A52", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <CheckCircle size={28} color="white" />
                      </div>
                      <div>
                        <div style={{ fontSize:"18px", fontWeight:800, color:"#2D8A52", marginBottom:"4px" }}>사고 · 침수 이력 없음</div>
                        <div style={{ fontSize:"13px", color:"#2D8A52", opacity:0.8, fontWeight:400 }}>보험개발원 공식 조회 결과 · 2024.01.15 기준</div>
                      </div>
                    </div>
                    <div className="check-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"32px" }}>
                      {[
                        { label:"교통사고 이력", ok:true, desc:"사고 난 적 없어요" },
                        { label:"침수 이력", ok:true, desc:"물에 잠긴 적 없어요" },
                        { label:"전손 이력", ok:true, desc:"크게 망가진 적 없어요" },
                        { label:"압류·저당", ok:true, desc:"빚 없는 깨끗한 차" },
                        { label:"소유자 수", ok:true, desc:"처음부터 한 분만" },
                        { label:"번호판 변경", ok:true, desc:"그대로예요" },
                      ].map(item=>(
                        <div key={item.label} style={{ background:item.ok?"#EAF6EF":"#FFF8EC", border:`1px solid ${item.ok?"#B8DFC8":"#FFCF8A"}`, borderRadius:"12px", padding:"16px 18px" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"5px" }}>
                            <div style={{ fontSize:"14px", fontWeight:800 }}>{item.label}</div>
                            <span style={{ background:item.ok?"#2D8A52":"#E8A020", color:"#fff", padding:"3px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{item.ok?"없음":"확인필요"}</span>
                          </div>
                          <div style={{ fontSize:"13px", color:"#888", fontWeight:400 }}>{item.desc}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"18px" }}>정비 이력</div>
                    {[
                      { icon:<FileText size={18} color="#1847FF"/>, bg:"#EEF2FF", date:"2021.04", title:"신차 출고", desc:"광주 현대자동차 딜러에서 최초 출고됐어요" },
                      { icon:<Wrench size={18} color="#2D8A52"/>, bg:"#EAF6EF", date:"2022.04 (1만km)", title:"1차 정기점검", desc:"엔진오일·필터 교환 완료 · 현대 직영 서비스센터" },
                      { icon:<Wrench size={18} color="#2D8A52"/>, bg:"#EAF6EF", date:"2023.02 (2.1만km)", title:"2차 정기점검", desc:"에어필터·와이퍼 교환, 타이어 로테이션" },
                      { icon:<Award size={18} color="#FF3B1E"/>, bg:"#FFF0ED", date:"2024.01", title:"픽스카 등록", desc:"100항목 검수 통과 · FIX 정찰가 등록" },
                    ].map((item,i,arr)=>(
                      <div key={i} style={{ display:"flex", gap:"16px", paddingBottom: i<arr.length-1?"22px":"0", position:"relative" }}>
                        {i<arr.length-1 && <div style={{ position:"absolute", left:"18px", top:"38px", bottom:0, width:"1px", background:"#E0DDD7" }} />}
                        <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:item.bg, border:"1.5px solid #E0DDD7", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{item.icon}</div>
                        <div>
                          <div style={{ fontSize:"12px", color:"#AAA", marginBottom:"3px", fontWeight:400 }}>{item.date}</div>
                          <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"3px" }}>{item.title}</div>
                          <div style={{ fontSize:"13px", color:"#666", fontWeight:400, lineHeight:1.6 }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── 🔰 차 잘 몰라요 탭 ── */}
                {activeTab==="beginner" && (
                  <div>
                    {/* 자동차세 */}
                    <div style={{ background:"linear-gradient(135deg,#1A1A1A,#2A2A2A)", borderRadius:"18px", padding:"26px 28px", marginBottom:"20px", position:"relative", overflow:"hidden" }}>
                      <div style={{ position:"absolute", right:"-20px", bottom:"-20px", fontFamily:"'Bebas Neue',serif", fontSize:"100px", color:"rgba(255,255,255,0.04)", lineHeight:1 }}>TAX</div>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:"16px", position:"relative", zIndex:1 }}>
                        <div style={{ width:"52px", height:"52px", background:"#FF3B1E", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <DollarSign size={26} color="white" />
                        </div>
                        <div>
                          <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:700, marginBottom:"6px" }}>이 차 자동차세</div>
                          <div style={{ fontSize:"32px", fontWeight:800, color:"#fff", letterSpacing:"-0.5px", marginBottom:"4px" }}>
                            연 {tax.toLocaleString()}원
                            <span style={{ fontSize:"16px", color:"rgba(255,255,255,0.5)", fontWeight:400, marginLeft:"8px" }}>→ 6개월마다 {Math.round(tax/2).toLocaleString()}원</span>
                          </div>
                          <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:400, lineHeight:1.6 }}>
                            배기량 {car.cc.toLocaleString()}cc × 140원/cc = 연 {tax.toLocaleString()}원<br/>
                            6월·12월에 각각 절반씩 납부해요
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 연식 대비 키로수 */}
                    <div style={{ background:"#F8F6F2", borderRadius:"18px", padding:"24px 26px", marginBottom:"20px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"18px" }}>
                        <div style={{ width:"44px", height:"44px", background:mileageStatus.color, borderRadius:"14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <Gauge size={22} color="white" />
                        </div>
                        <div>
                          <div style={{ fontSize:"13px", color:"#AAA", fontWeight:700 }}>연식 대비 주행거리</div>
                          <div style={{ fontSize:"20px", fontWeight:800, color:mileageStatus.color }}>{mileageStatus.label}</div>
                        </div>
                      </div>
                      <div style={{ background:"#E0DDD7", borderRadius:"100px", height:"10px", overflow:"hidden", marginBottom:"10px" }}>
                        <div style={{ height:"10px", background:mileageStatus.color, borderRadius:"100px", width:`${mileageStatus.pct}%`, transition:"width 0.6s" }} />
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", color:"#AAA", fontWeight:400, marginBottom:"14px" }}>
                        <span>0km</span><span>5만km</span><span>10만km</span><span>15만km+</span>
                      </div>
                      <div style={{ background:"#fff", borderRadius:"12px", padding:"14px 16px" }}>
                        <div style={{ fontSize:"14px", color:"#555", fontWeight:400, lineHeight:1.7 }}>
                          📌 {mileageStatus.desc}<br/>
                          <span style={{ color:"#AAA" }}>한국 평균은 연간 약 1.5만km를 타요. {car.year}에 출고됐으니 지금쯤 {Math.round((new Date().getFullYear()-car.yearNum)*15000).toLocaleString()}km가 평균이에요.</span>
                        </div>
                      </div>
                    </div>

                    {/* 중요 체크리스트 */}
                    <div style={{ marginBottom:"24px" }}>
                      <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"6px" }}>중고차 살 때 꼭 확인해야 할 것들 ✅</div>
                      <div style={{ fontSize:"14px", color:"#888", marginBottom:"18px", fontWeight:400 }}>이 항목들만 알아도 중고차 사기 90% 예방돼요</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                        {[
                          { icon:<Shield size={20} color="#2D8A52"/>, title:"사고이력 조회", desc:"carhistory.or.kr에서 차량번호로 무료 조회 가능해요. 보험 처리된 사고 이력이 다 나와요.", ok:true, okText:"픽스카가 대신 조회해드렸어요" },
                          { icon:<FileText size={20} color="#1847FF"/>, title:"자동차 등록증 확인", desc:"차량 번호, 소유자 이름, 압류·저당 여부를 꼭 확인하세요. 정부24에서 등록원부 발급 가능해요.", ok:true, okText:"계약 시 제공 드려요" },
                          { icon:<Wrench size={20} color="#E8A020"/>, title:"직접 시승하기", desc:"10~15분 정도 직접 타보세요. 핸들 떨림, 이상한 소리, 브레이크 느낌을 확인해야 해요.", ok:false, okText:"시승 예약 가능해요" },
                          { icon:<Car size={20} color="#555"/>, title:"외관 꼼꼼히 보기", desc:"도어 틈새가 일정한지, 패널 색깔이 다른 곳은 없는지, 하체 녹은 없는지 확인해요.", ok:false, okText:"실물 확인 권장" },
                          { icon:<DollarSign size={20} color="#FF3B1E"/>, title:"실제 비용 계산하기", desc:"차 가격 외에 취등록세(차값의 7%), 보험료, 자동차세, 유지비를 합산해서 봐야 해요.", ok:true, okText:"아래 할부 계산기 참고" },
                          { icon:<Clock size={20} color="#555"/>, title:"계약서 꼼꼼히 읽기", desc:"특약 사항, 하자 발생 시 처리 방법, 환불 조건을 확인하세요. 픽스카는 3일 환불 보장해요.", ok:true, okText:"픽스카 3일 환불 보장" },
                        ].map((item,i)=>(
                          <div key={i} style={{ background:"#fff", borderRadius:"14px", padding:"18px 20px", border:"1px solid #ECEAE4" }}>
                            <div style={{ display:"flex", gap:"14px" }}>
                              <div style={{ width:"40px", height:"40px", background:"#F8F6F2", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{item.icon}</div>
                              <div style={{ flex:1 }}>
                                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"6px" }}>
                                  <div style={{ fontSize:"16px", fontWeight:800 }}>{item.title}</div>
                                  <span style={{ background:item.ok?"#EAF6EF":"#FFF8EC", color:item.ok?"#2D8A52":"#E8A020", padding:"3px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:800, whiteSpace:"nowrap", marginLeft:"8px" }}>{item.ok?"✓ 확인 완료":"확인 필요"}</span>
                                </div>
                                <div style={{ fontSize:"13px", color:"#666", lineHeight:1.7, fontWeight:400, marginBottom:"8px" }}>{item.desc}</div>
                                <div style={{ fontSize:"12px", color:item.ok?"#2D8A52":"#E8A020", fontWeight:700 }}>→ {item.okText}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* QnA */}
                    <div>
                      <div style={{ fontSize:"18px", fontWeight:800, marginBottom:"6px" }}>자주 묻는 질문 Q&A</div>
                      <div style={{ fontSize:"14px", color:"#888", marginBottom:"18px", fontWeight:400 }}>중고차 처음 사는 분들이 가장 많이 물어보는 것들이에요</div>
                      <div style={{ background:"#fff", borderRadius:"16px", overflow:"hidden", border:"1px solid #ECEAE4" }}>
                        {QNA.map((item,i)=>(
                          <div key={i} className="qna-item" onClick={()=>setOpenQna(openQna===i?null:i)} style={{ padding:"20px 22px" }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:"12px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                                <span style={{ background:"#FFF0ED", color:"#FF3B1E", width:"28px", height:"28px", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:800, flexShrink:0 }}>Q</span>
                                <span style={{ fontSize:"15px", fontWeight:700 }}>{item.q}</span>
                              </div>
                              {openQna===i ? <ChevronUp size={18} color="#AAA" /> : <ChevronDown size={18} color="#AAA" />}
                            </div>
                            {openQna===i && (
                              <div style={{ marginTop:"14px", paddingTop:"14px", borderTop:"1px solid #F0EEE9", display:"flex", gap:"12px" }}>
                                <span style={{ background:"#EAF6EF", color:"#2D8A52", width:"28px", height:"28px", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:800, flexShrink:0 }}>A</span>
                                <div style={{ fontSize:"14px", color:"#444", lineHeight:1.75, fontWeight:400 }}>{item.a}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 시세 비교 탭 ── */}
                {activeTab==="price" && (
                  <div>
                    <div style={{ marginBottom:"24px" }}>
                      <div style={{ fontSize:"13px", color:"#AAA", fontWeight:400, marginBottom:"6px" }}>이 차의 FIX 정찰가</div>
                      <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"56px", color:"#FF3B1E", letterSpacing:"1px", lineHeight:1, marginBottom:"8px" }}>
                        {car.price.toLocaleString()}<span style={{ fontSize:"22px", fontFamily:"'NanumSquareRound',sans-serif", fontWeight:700, color:"#AAA", marginLeft:"6px" }}>만원</span>
                      </div>
                      <span style={{ background:"#1847FF", color:"#fff", padding:"6px 14px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>🔒 고정 정찰가 · 흥정 없음</span>
                    </div>
                    <div style={{ background:"#F8F6F2", borderRadius:"16px", padding:"24px", marginBottom:"20px" }}>
                      <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"18px" }}>동일 모델 시세 분포</div>
                      <div style={{ position:"relative", height:"14px", background:"linear-gradient(90deg,#EEF2FF 0%,#B8C8FF 35%,#FF3B1E 62%,#FFB8A8 100%)", borderRadius:"7px", marginBottom:"10px" }}>
                        <div style={{ position:"absolute", top:"-6px", left:"62%", width:"4px", height:"26px", background:"#FF3B1E", borderRadius:"2px" }}>
                          <div style={{ position:"absolute", bottom:"32px", left:"50%", transform:"translateX(-50%)", background:"#FF3B1E", color:"#fff", padding:"4px 10px", borderRadius:"8px", fontSize:"12px", fontWeight:800, whiteSpace:"nowrap" }}>이 차</div>
                        </div>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", color:"#AAA", marginBottom:"20px", fontWeight:400 }}>
                        <span>최저 {Math.round(car.price*0.83)}만원</span><span>최고 {Math.round(car.price*1.24)}만원</span>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px" }}>
                        {[
                          { label:"시장 평균가", value:`${Math.round(car.price*1.07)}만원`, color:"#1A1A1A", bg:"#fff" },
                          { label:"이 차 FIX가", value:`${car.price}만원`, color:"#FF3B1E", bg:"#FFF0ED" },
                          { label:"평균 대비", value:"약 7% 저렴", color:"#2D8A52", bg:"#EAF6EF" },
                        ].map(item=>(
                          <div key={item.label} style={{ background:item.bg, borderRadius:"12px", padding:"16px", textAlign:"center" }}>
                            <div style={{ fontSize:"11px", color:"#AAA", marginBottom:"6px", fontWeight:700 }}>{item.label}</div>
                            <div style={{ fontSize:"17px", fontWeight:800, color:item.color }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ fontSize:"13px", color:"#AAA", fontWeight:400, lineHeight:1.6, padding:"14px 16px", background:"#F8F6F2", borderRadius:"10px" }}>
                      ※ 시세는 보험개발원·국토부 실거래 데이터 기반이에요. 차량 옵션·상태에 따라 다를 수 있어요.
                    </div>
                  </div>
                )}

                {/* ── 후기 탭 ── */}
                {activeTab==="review" && (
                  <div>
                    <div style={{ display:"flex", gap:"24px", background:"#F8F6F2", borderRadius:"16px", padding:"22px 24px", marginBottom:"24px", alignItems:"center" }}>
                      <div style={{ textAlign:"center", flexShrink:0 }}>
                        <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"64px", color:"#FF3B1E", lineHeight:1 }}>4.9</div>
                        <div style={{ fontSize:"22px", marginTop:"4px" }}>⭐⭐⭐⭐⭐</div>
                        <div style={{ fontSize:"13px", color:"#AAA", marginTop:"4px", fontWeight:400 }}>23개 후기</div>
                      </div>
                      <div style={{ flex:1 }}>
                        {[["FIX 가격 만족도","96%"],["차량 상태","98%"],["상담 경험","100%"]].map(([l,p])=>(
                          <div key={l} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
                            <span style={{ fontSize:"13px", color:"#888", width:"100px", fontWeight:600 }}>{l}</span>
                            <div style={{ flex:1, height:"8px", background:"#E0DDD7", borderRadius:"4px", overflow:"hidden" }}>
                              <div style={{ width:p, height:"100%", background:"#FF3B1E", borderRadius:"4px" }} />
                            </div>
                            <span style={{ fontSize:"13px", fontWeight:800, color:"#FF3B1E", width:"36px" }}>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                      {[
                        { initial:"김", name:"김지원 (24세)", desc:"2023.12 구매 · 초보 운전자", text:"면허 딴 지 3개월인데 퀴즈 풀었더니 예산에 맞는 차를 추천해줬어요. FIX 가격이라 흥정 없이 계약! 담당자분이 모르는 것도 다 설명해줬어요 🙏", tag:"PICK" },
                        { initial:"박", name:"박민서 (27세)", desc:"2023.11 구매 · 직장인", text:"엔카에서 전화 폭탄이랑 흥정에 지쳤는데 픽스카는 표시 가격이 최종이라 너무 편했어요. 탁송도 다음날 바로 와서 신기했어요!", tag:"FIX" },
                        { initial:"이", name:"이수연 (31세)", desc:"2023.10 구매", text:"차 하나도 모르는 제가 봐도 설명이 친절해요. '차 잘 몰라요' 탭이 진짜 도움됐어요. 이력 조회도 투명하게 보여줬고요.", tag:"PICK" },
                      ].map(r=>(
                        <div key={r.name} style={{ background:"#fff", border:"1px solid #ECEAE4", borderRadius:"16px", padding:"22px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"14px" }}>
                            <div style={{ width:"42px", height:"42px", background:r.tag==="PICK"?"#FFF0ED":"#EEF2FF", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", fontWeight:800, color:r.tag==="PICK"?"#FF3B1E":"#1847FF" }}>{r.initial}</div>
                            <div>
                              <div style={{ fontSize:"15px", fontWeight:800 }}>{r.name}</div>
                              <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{r.desc}</div>
                            </div>
                            <span style={{ marginLeft:"auto", background:r.tag==="PICK"?"#FFF0ED":"#EEF2FF", color:r.tag==="PICK"?"#FF3B1E":"#1847FF", padding:"4px 12px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>{r.tag}</span>
                          </div>
                          <p style={{ fontSize:"15px", lineHeight:1.8, color:"#444", fontWeight:400 }}>{r.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── 오른쪽 패널 ─── */}
          <div className="panel-sticky" style={{ position:"sticky", top:"88px", display:"flex", flexDirection:"column", gap:"16px" }}>

            {/* 가격 카드 */}
            <div style={{ background:"#1A1A1A", borderRadius:"22px", overflow:"hidden" }}>
              <div style={{ position:"relative", padding:"26px 28px", overflow:"hidden" }}>
                <div style={{ position:"absolute", right:"-15px", bottom:"-15px", fontFamily:"'Bebas Neue',serif", fontSize:"96px", color:"rgba(255,255,255,0.04)", lineHeight:1, letterSpacing:"2px" }}>PICK</div>
                <div style={{ fontSize:"15px", fontWeight:800, color:"rgba(255,255,255,0.65)", marginBottom:"2px" }}>{car.brand} {car.name}</div>
                <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.3)", marginBottom:"18px", fontWeight:400 }}>{car.year} · {car.mileage.toLocaleString()}km · {car.owners}인 오너</div>
                <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"58px", color:"#fff", letterSpacing:"1px", lineHeight:1, marginBottom:"12px" }}>
                  {car.price.toLocaleString()}<span style={{ fontSize:"20px", fontFamily:"'NanumSquareRound',sans-serif", fontWeight:700, color:"rgba(255,255,255,0.35)", marginLeft:"6px" }}>만원</span>
                </div>
                <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"#1847FF", color:"#fff", padding:"6px 14px", borderRadius:"100px", fontSize:"13px", fontWeight:800 }}>
                  <TrendingDown size={14} /> FIX PRICE · 흥정없음
                </div>
                <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.25)", marginTop:"6px", fontWeight:400 }}>표시 가격 = 최종 가격 · 숨은 비용 없음</div>
              </div>
            </div>

            {/* 할부 계산기 */}
            <div className="card" style={{ padding:"22px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"16px" }}>
                <Calculator size={20} color="#1847FF" />
                <div style={{ fontSize:"16px", fontWeight:800 }}>할부 계산기</div>
              </div>
              <div style={{ background:"#EEF2FF", borderRadius:"14px", padding:"18px 20px", marginBottom:"16px" }}>
                <div style={{ fontSize:"13px", color:"#1847FF", fontWeight:700, marginBottom:"6px" }}>월 납입금</div>
                <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"40px", color:"#1847FF", letterSpacing:"0.5px", lineHeight:1 }}>{calcMonthly(months)}</div>
                <div style={{ fontSize:"13px", color:"#888", marginTop:"4px", fontWeight:400 }}>원 / 월 ({months}개월 · 연 4.9%)</div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px", fontWeight:700, color:"#AAA", marginBottom:"8px" }}>
                <span>할부 기간</span>
                <span style={{ color:"#1847FF", fontWeight:800 }}>{months}개월</span>
              </div>
              <input type="range" min="12" max="84" step="12" value={months} onChange={e=>setMonths(parseInt(e.target.value))} style={{ width:"100%", accentColor:"#1847FF", height:"4px", marginBottom:"6px" }} />
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:"#CCC", fontWeight:400 }}>
                <span>12개월</span><span>36개월</span><span>60개월</span><span>84개월</span>
              </div>
            </div>

            {/* 보증 */}
            <div className="card" style={{ padding:"18px 20px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                {[
                  { icon:<Shield size={18} color="#FF3B1E"/>, title:"FIX 정찰가", sub:"흥정 없음" },
                  { icon:<CheckCircle size={18} color="#2D8A52"/>, title:"100항목 검수", sub:"전문가 직접" },
                  { icon:<Clock size={18} color="#1847FF"/>, title:"3일 환불", sub:"이유 불문" },
                  { icon:<Car size={18} color="#555"/>, title:"집 앞 탁송", sub:"직접 안 와도 돼요" },
                ].map(g=>(
                  <div key={g.title} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 14px", background:"#F8F6F2", borderRadius:"12px" }}>
                    {g.icon}
                    <div>
                      <div style={{ fontSize:"12px", fontWeight:800 }}>{g.title}</div>
                      <div style={{ fontSize:"11px", color:"#AAA", fontWeight:400 }}>{g.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              <button className="btn-red">
                <Car size={20} /> 이 차로 픽했어! 계약하기
              </button>
              <button className="btn-outline" onClick={()=>setShowModal(true)}>
                <MessageCircle size={18} /> 궁금한 거 물어보기
              </button>
              <button className="btn-kakao">
                💛 카카오로 상담하기
              </button>
            </div>

            {/* 딜러 */}
            <div className="card" style={{ padding:"18px 20px" }}>
              <div style={{ fontSize:"12px", color:"#AAA", fontWeight:700, marginBottom:"12px" }}>등록 딜러</div>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"14px" }}>
                <div style={{ width:"44px", height:"44px", background:"#EEF2FF", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Users size={20} color="#1847FF" />
                </div>
                <div>
                  <div style={{ fontSize:"15px", fontWeight:800 }}>{car.dealerName} 딜러</div>
                  <span style={{ background:"#EEF2FF", color:"#1847FF", padding:"3px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>🏅 픽스카 인증</span>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px" }}>
                {[[`${car.dealerRating}★`,"평점"],[`${car.dealerDeals}건`,"거래"],["3년+","활동"]].map(([v,l])=>(
                  <div key={l} style={{ textAlign:"center", padding:"10px", background:"#F8F6F2", borderRadius:"10px" }}>
                    <div style={{ fontSize:"15px", fontWeight:800 }}>{v}</div>
                    <div style={{ fontSize:"11px", color:"#AAA", fontWeight:400 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 연관 차량 */}
        <div style={{ maxWidth:"1360px", margin:"0 auto", padding:"0 52px 80px" }}>
          <div style={{ fontSize:"26px", fontWeight:800, letterSpacing:"-0.5px", marginBottom:"8px" }}>비슷한 차도 픽해봐요</div>
          <div style={{ fontSize:"15px", color:"#888", marginBottom:"24px", fontWeight:400 }}>같은 예산대 · 초보 추천 매물</div>
          <div className="related-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" }}>
            {[
              { name:"기아 K3", year:"2020 · 51,000km", price:1090, query:"kia+k3+silver+car", tag:"가성비" },
              { name:"현대 쏘나타", year:"2021 · 41,000km", price:2100, query:"hyundai+sonata+white", tag:"초보 추천" },
              { name:"기아 K5", year:"2020 · 55,000km", price:1780, query:"kia+k5+black+sedan", tag:"무사고" },
              { name:"현대 엑센트", year:"2019 · 68,000km", price:680, query:"hyundai+accent+small+car", tag:"초저가" },
            ].map(rel=>(
              <a key={rel.name} href="/cars/1" className="hover-lift card" style={{ overflow:"hidden" }}>
                <div style={{ height:"130px", overflow:"hidden" }}>
                  <img src={`https://source.unsplash.com/400x260/?${rel.query}`} alt={rel.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} onError={(e)=>{(e.target as HTMLImageElement).style.background="#F0EEE9";}} />
                </div>
                <div style={{ padding:"16px" }}>
                  <span style={{ background:"#FFF0ED", color:"#FF3B1E", padding:"3px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{rel.tag}</span>
                  <div style={{ fontSize:"15px", fontWeight:800, marginTop:"8px", marginBottom:"3px" }}>{rel.name}</div>
                  <div style={{ fontSize:"12px", color:"#AAA", marginBottom:"10px", fontWeight:400 }}>{rel.year}</div>
                  <div style={{ fontSize:"22px", fontWeight:800, letterSpacing:"-0.5px" }}>{rel.price.toLocaleString()}<span style={{ fontSize:"13px", fontWeight:700, color:"#AAA" }}>만원</span></div>
                  <div style={{ fontSize:"11px", color:"#1847FF", fontWeight:800, marginTop:"3px" }}>🔒 FIX PRICE</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 문의 모달 */}
        {showModal && (
          <div onClick={e=>{if(e.target===e.currentTarget)setShowModal(false)}} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
            <div style={{ background:"#fff", borderRadius:"24px", width:"100%", maxWidth:"460px", padding:"36px", position:"relative" }}>
              <button onClick={()=>setShowModal(false)} style={{ position:"absolute", top:"16px", right:"16px", width:"34px", height:"34px", border:"none", background:"#F0EEE9", borderRadius:"50%", cursor:"pointer", fontSize:"16px" }}>✕</button>
              <MessageCircle size={32} color="#FF3B1E" style={{ marginBottom:"12px" }} />
              <div style={{ fontSize:"24px", fontWeight:800, marginBottom:"6px" }}>궁금한 거 물어봐요</div>
              <div style={{ fontSize:"14px", color:"#888", marginBottom:"24px", fontWeight:400, lineHeight:1.6 }}>어떤 질문도 환영해요. 판매 압박 없이 솔직하게 답해드려요!</div>
              {[["이름","text","홍길동"],["연락처","tel","010-0000-0000"]].map(([l,t,p])=>(
                <div key={l} style={{ marginBottom:"14px" }}>
                  <label style={{ fontSize:"14px", fontWeight:800, marginBottom:"7px", display:"block" }}>{l}</label>
                  <input type={t} placeholder={p} style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"13px 16px", fontSize:"15px", fontFamily:"'NanumSquareRound',sans-serif", outline:"none" }} />
                </div>
              ))}
              <div style={{ marginBottom:"20px" }}>
                <label style={{ fontSize:"14px", fontWeight:800, marginBottom:"7px", display:"block" }}>문의 내용</label>
                <textarea placeholder="예: 직접 시승 가능한가요? / 할부 조건이 어떻게 되나요?" style={{ width:"100%", border:"1.5px solid #E0DDD7", borderRadius:"10px", padding:"13px 16px", fontSize:"15px", fontFamily:"'NanumSquareRound',sans-serif", outline:"none", resize:"vertical", minHeight:"100px" }} />
              </div>
              <button className="btn-red">문의 보내기 →</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
