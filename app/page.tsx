import Navbar from "@/components/Navbar";
import {
  Shield, RotateCcw, Truck, ChevronRight,
  Star, ArrowRight, Lock, CheckCircle, Zap, DollarSign
} from "lucide-react";

export default function Home() {
  const cars = [
    { id:1, name:"현대 아반떼 CN7", year:"2021년식", mileage:"32,000km", fuel:"가솔린", price:1450, monthly:29, tags:["무사고","초보 추천"], badge:"이달의 PICK", query:"hyundai+elantra+white+sedan+clean" },
    { id:2, name:"기아 K3", year:"2020년식", mileage:"51,000km", fuel:"가솔린", price:1090, monthly:22, tags:["무사고","가성비"], badge:"FIX 가성비", query:"kia+k3+silver+sedan" },
    { id:3, name:"현대 투싼 NX4", year:"2022년식", mileage:"28,000km", fuel:"가솔린", price:2780, monthly:55, tags:["1인 오너","가족용"], badge:"가족 PICK", query:"hyundai+tucson+suv+black" },
  ];

  const promises = [
    { icon:<Shield size={28} color="white"/>, num:"100", label:"항목 직접 검수", desc:"전문 정비사가 100개 항목을 직접 점검한 차만 등록돼요" },
    { icon:<DollarSign size={28} color="white"/>, num:"0원", label:"숨은 비용", desc:"표시 가격이 곧 최종 가격. 계약서 쓰다가 추가금 없어요" },
    { icon:<RotateCcw size={28} color="white"/>, num:"3일", label:"환불 보장", desc:"구매 후 3일 이내 마음이 바뀌면 100% 환불해드려요" },
    { icon:<Truck size={28} color="white"/>, num:"전국", label:"탁송 서비스", desc:"계약 후 집 앞까지 차를 배달해드려요" },
  ];

  const reviews = [
    { initial:"김", name:"김지원 (24세)", desc:"초보 운전 · 아반떼 픽", text:"면허 딴 지 3개월에 처음 중고차 샀는데 FIX 가격이라 흥정 없이 바로 계약했어요!", tag:"PICK", color:"#FF3B1E" },
    { initial:"박", name:"박민서 (27세)", desc:"직장인 · K3 픽", text:"엔카에서 전화 폭탄에 지쳤는데 픽스카는 표시된 가격이 최종이라 진짜 편했어요.", tag:"FIX", color:"#1847FF" },
    { initial:"이", name:"이수연 (31세)", desc:"가족 선물 · 투싼 픽", text:"차 하나도 모르는 제가 봐도 설명이 너무 친절해요. 초보 추천 필터가 진짜 도움됐어요!", tag:"PICK", color:"#FF3B1E" },
  ];

  const FOOTER_COLS = [
    {
      title: "차량 찾기",
      links: [
        ["전체 매물", "/cars"],
        ["추천 퀴즈", "/quiz"],
        ["차량 비교", "/compare"],
        ["차량 카탈로그", "/catalog"],
        ["자동차 랭킹", "/ranking"],
      ],
    },
    {
      title: "정보·커뮤니티",
      links: [
        ["초보 가이드", "/guide"],
        ["픽스카 블로그", "/blog"],
        ["커뮤니티", "/community"],
        ["자주 묻는 질문", "/faq"],
      ],
    },
    {
      title: "거래하기",
      links: [
        ["내 차 팔기", "/sell"],
        ["서비스 결제", "/payment"],
        ["딜러 신청", "/dealer/apply"],
      ],
    },
    {
      title: "픽스카",
      links: [
        ["회사 소개", "/about"],
        ["고객센터", "/contact"],
        ["개인정보처리방침", "/privacy"],
        ["이용약관", "/terms"],
      ],
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { font-size:16px; scroll-behavior:smooth; }
        body { font-family:'NanumSquareRound','Noto Sans KR',sans-serif; background:#F0EEE9; color:#1A1A1A; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound','Noto Sans KR',sans-serif; }
        .btn-red { background:#FF3B1E; color:#fff; border:none; border-radius:14px; font-size:16px; font-weight:800; cursor:pointer; padding:18px 36px; transition:all 0.2s; display:inline-flex; align-items:center; gap:10px; }
        .btn-red:hover { background:#D42E14; transform:translateY(-2px); box-shadow:0 10px 28px rgba(255,59,30,0.35); }
        .btn-blue-outline { background:transparent; color:#1847FF; border:2.5px solid #1847FF; border-radius:14px; font-size:16px; font-weight:800; cursor:pointer; padding:16px 32px; transition:all 0.2s; display:inline-flex; align-items:center; gap:8px; }
        .btn-blue-outline:hover { background:#1847FF; color:#fff; }
        .car-card { background:#fff; border-radius:20px; overflow:hidden; transition:all 0.25s; cursor:pointer; }
        .car-card:hover { transform:translateY(-5px); box-shadow:0 20px 50px rgba(0,0,0,0.1); }
        .car-card img { transition:transform 0.4s; display:block; }
        .car-card:hover img { transform:scale(1.04); }
        .promise-card { border-radius:20px; padding:28px 24px; }
        .review-card { background:#fff; border-radius:18px; padding:26px; }
        .content-banner-card { transition:all 0.2s; }
        .content-banner-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,0.07); }
        .footer-link { display:block; font-size:14px; color:rgba(255,255,255,0.35); margin-bottom:10px; font-weight:400; transition:color 0.15s; }
        .footer-link:hover { color:rgba(255,255,255,0.7); }
        @media(max-width:1024px) {
          .hero-grid { grid-template-columns:1fr !important; }
          .hero-img-col { display:none !important; }
          .cars-3 { grid-template-columns:1fr 1fr !important; }
          .promises-4 { grid-template-columns:1fr 1fr !important; }
          .reviews-3 { grid-template-columns:1fr !important; }
          .footer-cols { grid-template-columns:1fr 1fr !important; }
          .section-pad { padding-left:24px !important; padding-right:24px !important; }
          .hero-section { padding:60px 24px 48px !important; }
        }
        @media(max-width:600px) {
          .cars-3 { grid-template-columns:1fr !important; }
          .footer-cols { grid-template-columns:1fr 1fr !important; }
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <Navbar />

        {/* 히어로 */}
        <section className="hero-section" style={{ maxWidth:"1360px", margin:"0 auto", padding:"80px 52px 72px" }}>
          <div className="hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px", alignItems:"center" }}>
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"#fff", border:"1px solid #E0DDD7", borderRadius:"100px", padding:"8px 18px", marginBottom:"32px" }}>
                <div style={{ width:"8px", height:"8px", background:"#FF3B1E", borderRadius:"50%", animation:"pulse 2s infinite" }} />
                <span style={{ fontSize:"14px", fontWeight:700, color:"#555" }}>광주 1위 중고차 정찰제 플랫폼</span>
              </div>
              <h1 style={{ fontSize:"clamp(52px,7vw,88px)", fontWeight:800, lineHeight:1.0, letterSpacing:"-3px", marginBottom:"24px" }}>
                나, 이 차로<br /><span style={{ color:"#FF3B1E" }}>픽</span>했어
              </h1>
              <p style={{ fontSize:"18px", color:"#666", lineHeight:1.85, marginBottom:"40px", fontWeight:400 }}>
                중고차가 처음이어도 괜찮아요.<br />
                <strong style={{ color:"#1A1A1A", fontWeight:800 }}>3분 퀴즈로 내 차를 픽(PICK)하고</strong>,<br />
                <strong style={{ color:"#1847FF", fontWeight:800 }}>픽스(FIX)된 정찰가</strong>로 흥정 없이 구매해요.
              </p>
              <div style={{ display:"flex", gap:"14px", flexWrap:"wrap", marginBottom:"52px" }}>
                <a href="/quiz"><button className="btn-red">내 차 픽하기 <ArrowRight size={18}/></button></a>
                <a href="/cars"><button className="btn-blue-outline"><Lock size={16}/> 정찰가 매물 보기</button></a>
              </div>

              {/* 빠른 링크 */}
              <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"32px" }}>
                {[["📊 랭킹표","/ranking"],["📚 카탈로그","/catalog"],["✍️ 블로그","/blog"],["💬 커뮤니티","/community"]].map(([l,h])=>(
                  <a key={l} href={h as string}>
                    <button style={{ background:"white", border:"1.5px solid #E0DDD7", borderRadius:"100px", padding:"8px 16px", fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"'NanumSquareRound',sans-serif" }}>{l as string}</button>
                  </a>
                ))}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0", paddingTop:"32px", borderTop:"1px solid #E0DDD7" }}>
                {[["2,418+","현재 매물","#FF3B1E"],["98%","구매 만족도","#1847FF"],["4.9","앱 평점","#2D8A52"]].map(([num,label,color])=>(
                  <div key={label as string}>
                    <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"32px", color:color as string, letterSpacing:"-1px" }}>{num}</div>
                    <div style={{ fontSize:"14px", color:"#AAA", marginTop:"3px", fontWeight:400 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-img-col" style={{ position:"relative" }}>
              <div style={{ background:"#1A1A1A", borderRadius:"24px", overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,0.2)" }}>
                <div style={{ height:"240px", overflow:"hidden", position:"relative" }}>
                  <img src="https://source.unsplash.com/800x500/?hyundai+elantra+white+car" alt="추천 차량" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5))" }} />
                  <div style={{ position:"absolute", top:16, left:16, display:"flex", gap:"8px" }}>
                    <span style={{ background:"#FF3B1E", color:"#fff", padding:"6px 14px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>✨ PICK 추천</span>
                    <span style={{ background:"#1847FF", color:"#fff", padding:"6px 14px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>🔒 FIX 가격</span>
                  </div>
                </div>
                <div style={{ padding:"22px 24px" }}>
                  <div style={{ fontSize:"20px", fontWeight:800, color:"#fff", marginBottom:"4px" }}>현대 아반떼 CN7</div>
                  <div style={{ fontSize:"14px", color:"#666", marginBottom:"18px", fontWeight:400 }}>2021년식 · 32,000km · 가솔린 · 광주 북구</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
                    <div>
                      <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"44px", color:"#fff", letterSpacing:"1px", lineHeight:1 }}>1,450<span style={{ fontSize:"18px", fontFamily:"'NanumSquareRound',sans-serif", fontWeight:700, color:"#555", marginLeft:"4px" }}>만원</span></div>
                      <div style={{ fontSize:"13px", color:"#555", marginTop:"4px", fontWeight:400 }}>월 29만원부터 (60개월)</div>
                    </div>
                    <div style={{ background:"#1847FF", color:"#fff", padding:"6px 14px", borderRadius:"8px", fontSize:"12px", fontWeight:800 }}>FIX PRICE</div>
                  </div>
                </div>
              </div>
              <div style={{ position:"absolute", bottom:"28px", left:"-28px", background:"#fff", borderRadius:"18px", padding:"14px 20px", boxShadow:"0 12px 40px rgba(0,0,0,0.12)", display:"flex", alignItems:"center", gap:"12px" }}>
                <div style={{ width:"36px", height:"36px", background:"#EAF6EF", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <CheckCircle size={20} color="#2D8A52" />
                </div>
                <div>
                  <div style={{ fontSize:"13px", fontWeight:800 }}>허위 매물 0건</div>
                  <div style={{ fontSize:"11px", color:"#AAA", fontWeight:400 }}>직접 검수한 매물만 등록</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PICK + FIX */}
        <section className="section-pad" style={{ maxWidth:"1360px", margin:"0 auto 80px", padding:"0 52px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderRadius:"24px", overflow:"hidden" }}>
            <div style={{ background:"linear-gradient(135deg, #FF5A3C 0%, #E8290F 60%, #C41E08 100%)", padding:"64px 56px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:"-10px", bottom:"-30px", fontFamily:"'Bebas Neue',serif", fontSize:"200px", color:"rgba(255,255,255,0.2)", lineHeight:1, letterSpacing:"-5px" }}>PICK</div>
              <div style={{ width:"56px", height:"56px", background:"rgba(255,255,255,0.15)", borderRadius:"18px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"22px" }}>
                <Zap size={28} color="white" />
              </div>
              <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"48px", color:"#fff", letterSpacing:"3px", marginBottom:"12px" }}>PICK</div>
              <div style={{ fontSize:"24px", fontWeight:800, color:"rgba(255,255,255,0.95)", marginBottom:"16px" }}>나, 이 차로 픽했어</div>
              <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.78)", lineHeight:1.85, maxWidth:"320px", fontWeight:400 }}>
                차에 대해 아무것도 몰라도 괜찮아요.<br />
                <strong style={{ color:"#fff", fontWeight:800 }}>3분 퀴즈 하나로</strong> 나에게 딱 맞는 차를 픽해드려요.
              </p>
              <a href="/quiz" style={{ display:"inline-flex", alignItems:"center", gap:"6px", marginTop:"20px", background:"rgba(255,255,255,0.2)", color:"white", padding:"10px 20px", borderRadius:"100px", fontSize:"13px", fontWeight:800 }}>
                퀴즈 시작 <ArrowRight size={14}/>
              </a>
            </div>
            <div style={{ background:"linear-gradient(135deg, #3060FF 0%, #1338E0 60%, #0A25B8 100%)", padding:"64px 56px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:"-10px", bottom:"-30px", fontFamily:"'Bebas Neue',serif", fontSize:"200px", color:"rgba(255,255,255,0.2)", lineHeight:1, letterSpacing:"-5px" }}>FIX</div>
              <div style={{ width:"56px", height:"56px", background:"rgba(255,255,255,0.15)", borderRadius:"18px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"22px" }}>
                <Lock size={28} color="white" />
              </div>
              <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"48px", color:"#fff", letterSpacing:"3px", marginBottom:"12px" }}>FIX</div>
              <div style={{ fontSize:"24px", fontWeight:800, color:"rgba(255,255,255,0.95)", marginBottom:"16px" }}>가격은 픽스, 믿음도 픽스</div>
              <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.78)", lineHeight:1.85, maxWidth:"320px", fontWeight:400 }}>
                모든 매물의 가격을 고정(FIX)해요.<br />
                <strong style={{ color:"#fff", fontWeight:800 }}>표시 가격 = 최종 가격.</strong> 추가 비용 없음.
              </p>
              <a href="/cars" style={{ display:"inline-flex", alignItems:"center", gap:"6px", marginTop:"20px", background:"rgba(255,255,255,0.2)", color:"white", padding:"10px 20px", borderRadius:"100px", fontSize:"13px", fontWeight:800 }}>
                매물 보기 <ArrowRight size={14}/>
              </a>
            </div>
          </div>
        </section>

        {/* 인기 매물 */}
        <section className="section-pad" style={{ maxWidth:"1360px", margin:"0 auto 80px", padding:"0 52px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"36px" }}>
            <div>
              <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#FF3B1E", marginBottom:"12px" }}>TODAY&#39;S PICK</div>
              <h2 style={{ fontSize:"clamp(26px,4vw,46px)", fontWeight:800, letterSpacing:"-1.5px", lineHeight:1.1 }}>오늘 픽스카 <span style={{ color:"#FF3B1E" }}>추천</span> 매물</h2>
            </div>
            <a href="/cars" style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"15px", fontWeight:700, color:"#888" }}>전체 보기 <ChevronRight size={16}/></a>
          </div>
          <div className="cars-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px" }}>
            {cars.map(car=>(
              <a key={car.id} href={`/cars/${car.id}`} className="car-card">
                <div style={{ height:"200px", overflow:"hidden", position:"relative" }}>
                  <img src={`https://source.unsplash.com/600x400/?${car.query}`} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3))" }} />
                  <span style={{ position:"absolute", top:14, left:14, background:"#FF3B1E", color:"#fff", padding:"5px 12px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{car.badge}</span>
                </div>
                <div style={{ padding:"18px 20px" }}>
                  <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"4px" }}>{car.name}</div>
                  <div style={{ fontSize:"13px", color:"#AAA", marginBottom:"14px", fontWeight:400 }}>{car.year} · {car.mileage} · {car.fuel}</div>
                  <div style={{ display:"flex", gap:"6px", marginBottom:"16px" }}>
                    {car.tags.map(tag=>(
                      <span key={tag} style={{ background:"#EAF6EF", border:"1px solid #B8DFC8", padding:"4px 10px", borderRadius:"100px", fontSize:"11px", fontWeight:700, color:"#2D8A52" }}>✓ {tag}</span>
                    ))}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", paddingTop:"14px", borderTop:"1px solid #F0EEE9" }}>
                    <div>
                      <div style={{ fontSize:"26px", fontWeight:800, letterSpacing:"-0.5px" }}>{car.price.toLocaleString()}<span style={{ fontSize:"14px", fontWeight:700, color:"#AAA" }}>만원</span></div>
                      <div style={{ fontSize:"12px", color:"#1847FF", fontWeight:800, marginTop:"3px", display:"flex", alignItems:"center", gap:"3px" }}><Lock size={10}/> FIX PRICE · 월 {car.monthly}만원~</div>
                    </div>
                    <div style={{ background:"#1A1A1A", color:"#fff", padding:"10px 18px", borderRadius:"10px", fontSize:"13px", fontWeight:800, display:"flex", alignItems:"center", gap:"6px" }}>픽하기 <ArrowRight size={14}/></div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 콘텐츠 배너 */}
        <section className="section-pad" style={{ maxWidth:"1360px", margin:"0 auto 80px", padding:"0 52px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" }}>
            {[
              { emoji:"📊", title:"자동차 랭킹", desc:"최고가·깡통·초보 추천 랭킹", href:"/ranking", color:"#FF3B1E" },
              { emoji:"📚", title:"차량 카탈로그", desc:"출고가·기본·추가 옵션 전체", href:"/catalog", color:"#1847FF" },
              { emoji:"✍️", title:"픽스카 블로그", desc:"차량 설명·추천 용품 정보", href:"/blog", color:"#2D8A52" },
              { emoji:"💬", title:"커뮤니티", desc:"자유게시판·리뷰·Q&A", href:"/community", color:"#E8A020" },
            ].map(item => (
              <a key={item.title} href={item.href}>
                <div style={{ background:"white", borderRadius:"18px", padding:"22px", transition:"all 0.2s", cursor:"pointer" }}
                  <div style={{ fontSize:"28px", marginBottom:"10px" }}>{item.emoji}</div>
                  <div style={{ fontSize:"15px", fontWeight:800, marginBottom:"5px", color:item.color }}>{item.title}</div>
                  <div style={{ fontSize:"13px", color:"#AAA", fontWeight:400 }}>{item.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* FIX 약속 */}
        <section style={{ background:"#1A1A1A", padding:"96px 52px" }}>
          <div style={{ maxWidth:"1360px", margin:"0 auto" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"center", marginBottom:"60px" }}>
              <div>
                <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#7A9BFF", marginBottom:"12px" }}>FIX PROMISE</div>
                <h2 style={{ fontSize:"clamp(28px,4vw,52px)", fontWeight:800, letterSpacing:"-1.5px", color:"#fff", lineHeight:1.1 }}>
                  픽스카가 지키는<br /><span style={{ color:"#7A9BFF" }}>FIX</span> 약속 4가지
                </h2>
              </div>
              <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.5)", lineHeight:1.8, fontWeight:400 }}>
                가격만 고정(FIX)하는 게 아니에요.<br />
                <strong style={{ color:"rgba(255,255,255,0.88)", fontWeight:800 }}>신뢰도 고정(FIX)합니다.</strong>
              </p>
            </div>
            <div className="promises-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" }}>
              {promises.map(p=>(
                <div key={p.label} className="promise-card" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ width:"52px", height:"52px", background:"#FF3B1E", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"18px" }}>{p.icon}</div>
                  <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"36px", color:"#7A9BFF", letterSpacing:"1px", marginBottom:"6px" }}>{p.num}</div>
                  <div style={{ fontSize:"16px", fontWeight:800, color:"#fff", marginBottom:"10px" }}>{p.label}</div>
                  <div style={{ fontSize:"14px", color:"rgba(255,255,255,0.5)", lineHeight:1.75, fontWeight:400 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 후기 */}
        <section className="section-pad" style={{ maxWidth:"1360px", margin:"0 auto", padding:"80px 52px" }}>
          <div style={{ marginBottom:"48px" }}>
            <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#FF3B1E", marginBottom:"12px" }}>PICK STORIES</div>
            <h2 style={{ fontSize:"clamp(26px,4vw,46px)", fontWeight:800, letterSpacing:"-1.5px", lineHeight:1.1 }}>픽한 사람들 이야기</h2>
          </div>
          <div className="reviews-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"18px" }}>
            {reviews.map(r=>(
              <div key={r.name} className="review-card">
                <div style={{ display:"flex", gap:"4px", marginBottom:"16px" }}>
                  {[...Array(5)].map((_,i)=><Star key={i} size={16} fill="#FF3B1E" color="#FF3B1E"/>)}
                </div>
                <p style={{ fontSize:"15px", lineHeight:1.85, color:"#444", marginBottom:"22px", fontWeight:400 }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                  <div style={{ width:"42px", height:"42px", background:r.color+"1A", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", fontWeight:800, color:r.color }}>{r.initial}</div>
                  <div>
                    <div style={{ fontSize:"15px", fontWeight:800 }}>{r.name}</div>
                    <div style={{ fontSize:"12px", color:"#AAA", fontWeight:400 }}>{r.desc}</div>
                  </div>
                  <span style={{ marginLeft:"auto", background:r.color+"1A", color:r.color, padding:"4px 12px", borderRadius:"100px", fontSize:"12px", fontWeight:800 }}>{r.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background:"#FF3B1E", padding:"100px 52px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
            <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"clamp(100px,18vw,220px)", color:"rgba(0,0,0,0.07)", whiteSpace:"nowrap", letterSpacing:"8px" }}>PICK YOUR CAR</div>
          </div>
          <div style={{ position:"relative", zIndex:1, maxWidth:"700px", margin:"0 auto" }}>
            <h2 style={{ fontSize:"clamp(44px,7vw,80px)", fontWeight:800, color:"white", letterSpacing:"-2px", lineHeight:1.05, marginBottom:"20px" }}>
              나, 이 차로<br />픽했어
            </h2>
            <p style={{ fontSize:"18px", color:"rgba(255,255,255,0.82)", lineHeight:1.8, marginBottom:"44px", fontWeight:400 }}>
              3분 퀴즈로 내 차를 픽(PICK)하고<br />픽스(FIX) 정찰가로 스트레스 없이 구매하세요.
            </p>
            <div style={{ display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" }}>
              <a href="/quiz"><button style={{ background:"#fff", color:"#FF3B1E", border:"none", padding:"19px 48px", borderRadius:"14px", fontSize:"17px", fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:"10px" }}>내 차 PICK하러 가기 <ArrowRight size={18}/></button></a>
              <a href="/cars"><button style={{ background:"transparent", color:"#fff", border:"2.5px solid rgba(255,255,255,0.55)", padding:"17px 40px", borderRadius:"14px", fontSize:"16px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"8px" }}><Lock size={16}/> FIX 가격 매물 보기</button></a>
            </div>
          </div>
        </section>

        {/* 푸터 */}
        <footer style={{ background:"#1A1A1A", padding:"64px 52px 44px" }}>
          <div style={{ maxWidth:"1360px", margin:"0 auto" }}>
            <div className="footer-cols" style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr", gap:"40px", paddingBottom:"48px", borderBottom:"1px solid rgba(255,255,255,0.07)", marginBottom:"36px" }}>
              {/* 브랜드 */}
              <div>
                <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"32px", letterSpacing:"3px", marginBottom:"14px" }}>
                  <span style={{ color:"#FF3B1E" }}>FIX</span><span style={{ color:"#fff" }}>CAR</span>
                </div>
                <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.35)", lineHeight:1.9, fontWeight:400, marginBottom:"16px" }}>나, 이 차로 픽했어.<br />가격은 픽스.<br />광주 중고차 정찰제 플랫폼.</p>
                <div style={{ display:"flex", gap:"8px" }}>
                  <a href="/dealer/apply"><button style={{ background:"#1847FF", color:"white", border:"none", padding:"8px 16px", borderRadius:"100px", fontSize:"12px", fontWeight:800, cursor:"pointer" }}>딜러 신청</button></a>
                  <a href="/contact"><button style={{ background:"rgba(255,255,255,0.1)", color:"white", border:"none", padding:"8px 16px", borderRadius:"100px", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>고객센터</button></a>
                </div>
              </div>

              {/* 링크 컬럼들 */}
              {FOOTER_COLS.map(col=>(
                <div key={col.title}>
                  <div style={{ fontSize:"11px", fontWeight:800, letterSpacing:"2px", color:"rgba(255,255,255,0.35)", marginBottom:"16px" }}>{col.title.toUpperCase()}</div>
                  {col.links.map(([label, href])=>(
                    <a key={label} href={href as string} className="footer-link">{label}</a>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px" }}>
              <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.2)", fontWeight:400 }}>© 2025 픽스카 FIXCAR · 광주광역시 중고차 정찰제 플랫폼</div>
              <div style={{ display:"flex", gap:"16px" }}>
                <a href="/privacy" style={{ fontSize:"12px", color:"rgba(255,255,255,0.25)", fontWeight:400 }}>개인정보처리방침</a>
                <a href="/terms" style={{ fontSize:"12px", color:"rgba(255,255,255,0.25)", fontWeight:400 }}>이용약관</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
