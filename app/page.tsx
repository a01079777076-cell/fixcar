import Navbar from "@/components/Navbar";
import HomeMbtiSection from "@/components/HomeMbtiSection";
import HomeCarousel from "@/components/HomeCarousel";
import { prisma } from "@/lib/prisma";
import {
  Shield, RotateCcw, Truck, ChevronRight,
  Star, ArrowRight, Lock, CheckCircle, Zap, DollarSign
} from "lucide-react";

async function getFeaturedCars() {
  try {
    return await prisma.car.findMany({
      where: { status: "AVAILABLE" },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { dealer: { select: { shopName: true } } },
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const dbCars = await getFeaturedCars();

  const cars = dbCars.length > 0 ? dbCars.map(car => ({
    id: car.id,
    name: car.name,
    year: `${car.year}년식`,
    mileage: `${(car.mileage / 1000).toFixed(0)}만km`,
    fuel: car.fuel,
    price: car.price,
    monthly: Math.round(car.price * 10000 * 0.019 / 60),
    tags: (car.tags as string[]).slice(0, 2),
    badge: (car.tags as string[])[0] || "PICK",
    query: car.name.includes("아반떼") ? "hyundai+elantra+sedan" :
           car.name.includes("K3") ? "kia+k3+sedan" :
           car.name.includes("투싼") ? "hyundai+tucson+suv" :
           car.name.includes("아이오닉") ? "hyundai+ioniq+electric" :
           car.name.includes("쏘렌토") ? "kia+sorento+suv" :
           car.name.includes("쏘나타") ? "hyundai+sonata+sedan" :
           car.name.includes("K5") ? "kia+k5+sedan" : "car+sedan",
  })) : [
    { id:1, name:"현대 아반떼 CN7", year:"2021년식", mileage:"32,000km", fuel:"가솔린", price:1450, monthly:29, tags:["무사고","초보 추천"], badge:"이달의 PICK", query:"hyundai+elantra+white+sedan" },
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
    { title:"차량 찾기", links:[["전체 매물","/cars"],["내차 찾기","/quiz-select"],["차량 MBTI","/mbti"],["차량 카탈로그","/catalog"],["자동차 랭킹","/ranking"]] },
    { title:"정보·커뮤니티", links:[["초보 가이드","/guide"],["픽스카 블로그","/blog"],["커뮤니티","/community"],["자동차 배틀","/battle"],["공개 경매","/auction"],["자주 묻는 질문","/faq"]] },
    { title:"거래하기", links:[["내 차 팔기","/sell"],["서비스 결제","/payment"],["딜러 신청","/dealer/apply"]] },
    { title:"픽스카", links:[["회사 소개","/about"],["고객센터","/contact"],["개인정보처리방침","/privacy"],["이용약관","/terms"]] },
  ];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        html{font-size:16px;scroll-behavior:smooth;}
        body{font-family:'NanumSquareRound','Noto Sans KR',sans-serif;background:#F0EEE9;color:#1A1A1A;-webkit-font-smoothing:antialiased;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound','Noto Sans KR',sans-serif;}
        .btn-red{background:#FF3B1E;color:#fff;border:none;border-radius:14px;font-size:16px;font-weight:800;cursor:pointer;padding:18px 36px;transition:all 0.2s;display:inline-flex;align-items:center;gap:10px;}
        .btn-red:hover{background:#D42E14;transform:translateY(-2px);box-shadow:0 10px 28px rgba(255,59,30,0.35);}
        .btn-blue-outline{background:transparent;color:#1847FF;border:2.5px solid #1847FF;border-radius:14px;font-size:16px;font-weight:800;cursor:pointer;padding:16px 32px;transition:all 0.2s;display:inline-flex;align-items:center;gap:8px;}
        .btn-blue-outline:hover{background:#1847FF;color:#fff;}
        .car-card{background:#fff;border-radius:20px;overflow:hidden;transition:all 0.25s;cursor:pointer;}
        .car-card:hover{transform:translateY(-5px);box-shadow:0 20px 50px rgba(0,0,0,0.1);}
        .car-card img{transition:transform 0.4s;display:block;}
        .car-card:hover img{transform:scale(1.04);}
        .promise-card{border-radius:20px;padding:28px 24px;}
        .review-card{background:#fff;border-radius:18px;padding:26px;}
        .content-banner-card{transition:all 0.2s;}
        .content-banner-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.07);}
        .footer-link{display:block;font-size:14px;color:rgba(255,255,255,0.35);margin-bottom:10px;font-weight:400;transition:color 0.15s;}
        .footer-link:hover{color:rgba(255,255,255,0.7);}
        .img-placeholder{text-align:center;padding:20px;}
        @media(max-width:1024px){.cars-3{grid-template-columns:1fr 1fr!important;}.promises-4{grid-template-columns:1fr 1fr!important;}.reviews-3{grid-template-columns:1fr!important;}.footer-cols{grid-template-columns:1fr 1fr!important;}.section-pad{padding-left:24px!important;padding-right:24px!important;}.content-banners{grid-template-columns:1fr 1fr!important;}}
        @media(max-width:600px){.cars-3{grid-template-columns:1fr!important;}.content-banners{grid-template-columns:1fr!important;}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)}}
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <Navbar />

        {/* ═══ 히어로 배너 + 카테고리 (직방 스타일) ═══ */}
        <section style={{ position:"relative" }}>
          {/* 배경 이미지 */}
          <div style={{
            height:"clamp(340px,45vw,520px)",
            position:"relative", overflow:"hidden",
            display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
            textAlign:"center", padding:"40px 20px 80px",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mainbanner.png" alt="픽스카 메인배너" style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }} />
            <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", background:"linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.6))", zIndex:1 }} />
            <div style={{ position:"relative", zIndex:2 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", borderRadius:"100px", padding:"8px 20px", marginBottom:"24px" }}>
                <div style={{ width:"8px", height:"8px", background:"#FF3B1E", borderRadius:"50%", animation:"pulse 2s infinite" }} />
                <span style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.9)", letterSpacing:"1px" }}>광주 No.1 AI 나에게 맞는 차량추천</span>
              </div>
              <h1 style={{ fontFamily:"'Black Han Sans',sans-serif", fontSize:"clamp(28px,5vw,52px)", fontWeight:400, color:"white", lineHeight:1.2, letterSpacing:"-1px", marginBottom:"14px" }}>
                나, 이 차로 <span style={{ color:"#FF3B1E" }}>픽</span>했어, 픽스카
              </h1>
              <p style={{ fontSize:"clamp(14px,2vw,18px)", color:"rgba(255,255,255,0.65)", fontWeight:400, lineHeight:1.8, marginBottom:"28px" }}>
                데이터기반 고객맞춤으로 추천부터, 대기하면 <span style={{ color:"rgb(255, 203, 30)" }}>💛카톡 알람으로</span> 안내까지!
              </p>
              <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", justifyContent:"center" }}>
                <a href="/cars"><button className="btn-red" style={{ padding:"16px 36px", fontSize:"16px" }}>매물 보러가기 <ArrowRight size={16}/></button></a>
              </div>
            </div>
          </div>

          {/* 카테고리 카드 (배너 위에 겹침) */}
          <div style={{
            maxWidth:"840px", margin:"-48px auto 0", position:"relative", zIndex:10,
            background:"white", borderRadius:"24px", padding:"28px 32px",
            boxShadow:"0 12px 48px rgba(0,0,0,0.1)",
            display:"flex", justifyContent:"space-around", alignItems:"center", flexWrap:"wrap", gap:"8px",
          }}>
            {[
              { icon:"🧬", img:"", label:"내차 찾기", href:"/quiz-select" },
              { icon:"", img:"/icon/main_allcars_button.png", label:"전체 매물", href:"/cars" },
              { icon:"🏆", img:"", label:"랭킹", href:"/ranking" },
              { icon:"📚", img:"", label:"카탈로그", href:"/catalog" },
            ].map(item => (
              <a key={item.label} href={item.href} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", textDecoration:"none", padding:"8px 12px", borderRadius:"14px", transition:"all 0.2s", cursor:"pointer", minWidth:"70px" }}>
                <div style={{ width:"52px", height:"52px", borderRadius:"16px", background:"#F8F7F4", border:"1.5px solid #E8E6E1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", transition:"all 0.2s", overflow:"hidden" }}>
                  {item.img ? <img src={item.img} alt={item.label} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : item.icon}
                </div>
                <span style={{ fontSize:"13px", fontWeight:700, color:"#444" }}>{item.label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* 통계 스트립 */}
        <section style={{ maxWidth:"1360px", margin:"24px auto 0", padding:"0 52px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", background:"white", borderRadius:"18px", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
            {[["2,418+","현재 매물","#FF3B1E"],["98%","구매 만족도","#1847FF"],["4.9","앱 평점","#2D8A52"]].map(([num,label,color])=>(
              <div key={String(label)} style={{ padding:"24px", textAlign:"center", borderRight:"1px solid #F0EEE9" }}>
                <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"32px", color:String(color), letterSpacing:"-1px" }}>{num}</div>
                <div style={{ fontSize:"13px", color:"#AAA", marginTop:"3px", fontWeight:400 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PICK + FIX */}
        <section className="section-pad" style={{ maxWidth:"1360px", margin:"0 auto 80px", padding:"0 52px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderRadius:"24px", overflow:"hidden" }}>
            <div style={{ background:"linear-gradient(135deg, #FF5A3C 0%, #E8290F 60%, #C41E08 100%)", padding:"64px 56px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:"-10px", bottom:"-30px", fontFamily:"'Bebas Neue',serif", fontSize:"200px", color:"rgba(255,255,255,0.2)", lineHeight:1, letterSpacing:"-5px" }}>PICK</div>
              <div style={{ width:"56px", height:"56px", background:"rgba(255,255,255,0.15)", borderRadius:"18px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"22px" }}><Zap size={28} color="white" /></div>
              <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"48px", color:"#fff", letterSpacing:"3px", marginBottom:"12px" }}>PICK</div>
              <div style={{ fontSize:"24px", fontWeight:600, color:"rgba(255,255,255,0.95)", marginBottom:"16px" }}>나, 이 차로 픽했어</div>
              <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.78)", lineHeight:1.85, maxWidth:"320px", fontWeight:400 }}>차에 대해 아무것도 몰라도 괜찮아요.<br /><strong style={{ color:"#fff", fontWeight:800 }}>3분 퀴즈 하나로</strong> 나에게 딱 맞는 차를 픽해드려요.</p>
              <a href="/quiz" style={{ display:"inline-flex", alignItems:"center", gap:"6px", marginTop:"20px", background:"rgba(255,255,255,0.2)", color:"white", padding:"10px 20px", borderRadius:"100px", fontSize:"13px", fontWeight:800 }}>퀴즈 시작 <ArrowRight size={14}/></a>
            </div>
            <div style={{ background:"linear-gradient(135deg, #3060FF 0%, #1338E0 60%, #0A25B8 100%)", padding:"64px 56px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:"-10px", bottom:"-30px", fontFamily:"'Bebas Neue',serif", fontSize:"200px", color:"rgba(255,255,255,0.2)", lineHeight:1, letterSpacing:"-5px" }}>FIX</div>
              <div style={{ width:"56px", height:"56px", background:"rgba(255,255,255,0.15)", borderRadius:"18px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"22px" }}><Lock size={28} color="white" /></div>
              <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"48px", color:"#fff", letterSpacing:"3px", marginBottom:"12px" }}>FIX</div>
              <div style={{ fontSize:"24px", fontWeight:800, color:"rgba(255,255,255,0.95)", marginBottom:"16px" }}>가격은 픽스, 믿음도 픽스</div>
              <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.78)", lineHeight:1.85, maxWidth:"320px", fontWeight:400 }}>모든 매물의 가격을 고정(FIX)해요.<br /><strong style={{ color:"#fff", fontWeight:800 }}>표시 가격 = 최종 가격.</strong> 추가 비용 없음.</p>
              <a href="/cars" style={{ display:"inline-flex", alignItems:"center", gap:"6px", marginTop:"20px", background:"rgba(255,255,255,0.2)", color:"white", padding:"10px 20px", borderRadius:"100px", fontSize:"13px", fontWeight:800 }}>매물 보기 <ArrowRight size={14}/></a>
            </div>
          </div>
        </section>

        {/* 콘텐츠 배너 2줄 큰 카드 */}
        <section className="section-pad" style={{ maxWidth:"1360px", margin:"0 auto 80px", padding:"0 52px" }}>
          <div className="content-banners" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"16px" }}>
            {[
              { emoji:"", bgImg:"/icon/main_ranking_button.png", title:"자동차 랭킹", subtitle:"궁금하지 않아? 세상 모든 차량 순위가", desc:"최고가·최저가·깡통·풀옵·저주행·초보추천 랭킹표 전체", href:"/ranking", color:"#FF3B1E", bg:"#FFF0ED" },
              { emoji:"📚", bgImg:"", title:"차량 카탈로그", subtitle:"전세계 모든 차량을 연도별로", desc:"카탈로그 옵션, 출고가 다 모았어요. 자동차세·보험까지!", href:"/catalog", color:"#1847FF", bg:"#EEF2FF" },
              { emoji:"⚔️", bgImg:"", title:"자동차 지식배틀", subtitle:"스포츠카 vs 럭셔리카 64강 토너먼트", desc:"당신의 드림카는? 64대 자동차 월드컵 지금 시작!", href:"/battle", color:"#9B30FF", bg:"#F5EEFF" },
              { emoji:"🔨", bgImg:"", title:"공개 경매", subtitle:"실시간 입찰, 투명한 가격 경쟁", desc:"직접 검수한 차량을 경매로! 뒷자리 숨김 입찰 시스템", href:"/auction", color:"#E8A020", bg:"#FFF8EC" },
              { emoji:"✍️", bgImg:"", title:"픽스카 블로그", subtitle:"차량관리, 소모품, 필수꿀템까지", desc:"모아놓는 중! 딜러 추천 꿀템부터 관리 노하우까지", href:"/blog", color:"#2D8A52", bg:"#EAF6EF" },
              { emoji:"💬", bgImg:"", title:"커뮤니티", subtitle:"서로 궁금한 소식들 올릴 수 있는 곳", desc:"구매후기·질문답변·정비정보·사진자랑 자유게시판", href:"/community", color:"#CC6633", bg:"#FFF5ED" },
            ].map(item=>(
              <a key={item.title} href={item.href}>
                <div className="content-banner-card" style={{
                  background: item.bgImg ? `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.55))` : "white",
                  borderRadius:"20px", padding:"28px 30px", cursor:"pointer", height:"100%",
                  position:"relative", overflow:"hidden",
                }}>
                  {item.bgImg && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.bgImg} alt={item.title} style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }} />
                      <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", background:"linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))", zIndex:1 }} />
                    </>
                  )}
                  <div style={{ position:"relative", zIndex:2 }}>
                    {!item.bgImg && item.emoji && <div style={{ fontSize:"38px", marginBottom:"14px" }}>{item.emoji}</div>}
                    <div style={{ display:"inline-block", background: item.bgImg ? "rgba(255,255,255,0.2)" : item.bg, color: item.bgImg ? "white" : item.color, padding:"4px 14px", borderRadius:"100px", fontSize:"12px", fontWeight:800, marginBottom:"10px", backdropFilter: item.bgImg ? "blur(4px)" : "none" }}>{item.subtitle}</div>
                    <div style={{ fontSize:"20px", fontWeight:800, marginBottom:"8px", letterSpacing:"-0.5px", color: item.bgImg ? "white" : "#1A1A1A" }}>{item.title}</div>
                    <div style={{ fontSize:"14px", color: item.bgImg ? "rgba(255,255,255,0.8)" : "#888", fontWeight:400, lineHeight:1.65 }}>{item.desc}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 차량 MBTI */}
        <section style={{ maxWidth:"1360px", margin:"0 auto 80px", padding:"0 52px" }}>
          <HomeMbtiSection />
        </section>

        {/* 추천 매물 */}
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
                <div style={{ height:"200px", overflow:"hidden", position:"relative", background:"#F0EEE9" }}>
                  <img src={`https://source.unsplash.com/600x400/?${car.query}`} alt={car.name}
                    style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3))" }} />
                  <span style={{ position:"absolute", top:14, left:14, background:"#FF3B1E", color:"#fff", padding:"5px 12px", borderRadius:"100px", fontSize:"11px", fontWeight:800 }}>{car.badge}</span>
                </div>
                <div style={{ padding:"18px 20px" }}>
                  <div style={{ fontSize:"17px", fontWeight:800, marginBottom:"4px" }}>{car.name}</div>
                  <div style={{ fontSize:"13px", color:"#AAA", marginBottom:"14px", fontWeight:400 }}>{car.year} · {car.mileage} · {car.fuel}</div>
                  <div style={{ display:"flex", gap:"6px", marginBottom:"16px" }}>
                    {car.tags.map((tag:string)=>(
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

        {/* FIX 약속 */}
        <section style={{ background:"#1A1A1A", padding:"96px 52px" }}>
          <div style={{ maxWidth:"1360px", margin:"0 auto" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"center", marginBottom:"60px" }}>
              <div>
                <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#7A9BFF", marginBottom:"12px" }}>FIX PROMISE</div>
                <h2 style={{ fontSize:"clamp(28px,4vw,52px)", fontWeight:800, letterSpacing:"-1.5px", color:"#fff", lineHeight:1.1 }}>픽스카가 지키는<br /><span style={{ color:"#7A9BFF" }}>FIX</span> 약속 4가지</h2>
              </div>
              <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.5)", lineHeight:1.8, fontWeight:400 }}>가격만 고정(FIX)하는 게 아니에요.<br /><strong style={{ color:"rgba(255,255,255,0.88)", fontWeight:800 }}>신뢰도 고정(FIX)합니다.</strong></p>
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

        {/* 자동 캐러셀 (직방 스타일) */}
        <HomeCarousel />

        {/* CTA - 역동적 리디자인 */}
        <section style={{ background:"#FF3B1E", minHeight:"520px", position:"relative", overflow:"hidden", display:"flex", alignItems:"center" }}>
          {/* 대각선 분할 배경 */}
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.08)", clipPath:"polygon(0 0, 58% 0, 42% 100%, 0 100%)", pointerEvents:"none" }}/>

          {/* PICK - 좌상단 크게 */}
          <div style={{ position:"absolute", top:"-20px", left:"-10px", fontFamily:"'Bebas Neue',serif", fontSize:"clamp(140px,22vw,280px)", color:"rgba(255,255,255,0.08)", lineHeight:1, letterSpacing:"-5px", pointerEvents:"none", userSelect:"none" }}>PICK</div>

          {/* FIX - 우하단 크게 */}
          <div style={{ position:"absolute", bottom:"-30px", right:"-10px", fontFamily:"'Bebas Neue',serif", fontSize:"clamp(140px,22vw,280px)", color:"rgba(0,0,0,0.1)", lineHeight:1, letterSpacing:"-5px", pointerEvents:"none", userSelect:"none" }}>FIX</div>

          {/* 중앙 콘텐츠 */}
          <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:"1200px", margin:"0 auto", padding:"80px 52px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"60px", alignItems:"center" }}>
            {/* 왼쪽 */}
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(0,0,0,0.15)", borderRadius:"100px", padding:"8px 18px", marginBottom:"24px" }}>
                <div style={{ width:"8px", height:"8px", background:"white", borderRadius:"50%", opacity:0.8 }}/>
                <span style={{ fontSize:"13px", fontWeight:800, color:"rgba(255,255,255,0.9)", letterSpacing:"2px" }}>FIXCAR 광주</span>
              </div>
              <h2 style={{ fontFamily:"'Black Han Sans',sans-serif", fontSize:"clamp(40px,6vw,76px)", fontWeight:400, color:"white", letterSpacing:"-2px", lineHeight:1.05, marginBottom:"20px" }}>
                나, 이 차로<br />픽했어
              </h2>
              <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.8)", lineHeight:1.85, fontWeight:400 }}>
                3분 퀴즈로 내 차를 픽(PICK)하고<br />픽스(FIX) 정찰가로 스트레스 없이 구매하세요.
              </p>
            </div>

            {/* 오른쪽 */}
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              {/* PICK 카드 */}
              <div style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:"20px", padding:"24px 28px" }}>
                <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"32px", color:"white", letterSpacing:"3px", marginBottom:"6px" }}>PICK</div>
                <div style={{ fontSize:"15px", fontWeight:800, color:"white", marginBottom:"6px" }}>나에게 딱 맞는 차 찾기</div>
                <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.7)", marginBottom:"16px", fontWeight:400 }}>AI 추천 · 3분 퀴즈 · 조건 맞춤 검색</div>
                <a href="/quiz"><button style={{ background:"white", color:"#FF3B1E", border:"none", padding:"13px 28px", borderRadius:"10px", fontSize:"15px", fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:"8px", width:"100%", justifyContent:"center" }}>내 차 PICK하러 가기 <ArrowRight size={16}/></button></a>
              </div>

              {/* FIX 카드 */}
              <div style={{ background:"rgba(0,0,0,0.15)", border:"1px solid rgba(0,0,0,0.1)", borderRadius:"20px", padding:"24px 28px" }}>
                <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"32px", color:"white", letterSpacing:"3px", marginBottom:"6px" }}>FIX</div>
                <div style={{ fontSize:"15px", fontWeight:800, color:"white", marginBottom:"6px" }}>정찰가 매물 바로 보기</div>
                <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.7)", marginBottom:"16px", fontWeight:400 }}>흥정 없음 · 가격 투명 · 100항목 검수</div>
                <a href="/cars"><button style={{ background:"transparent", color:"white", border:"2px solid rgba(255,255,255,0.5)", padding:"13px 28px", borderRadius:"10px", fontSize:"15px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"8px", width:"100%", justifyContent:"center" }}><Lock size={16}/> FIX 가격 매물 보기</button></a>
              </div>
            </div>
          </div>
        </section>

        {/* 푸터 */}
        {/* ═══ 푸터 (직방 스타일) ═══ */}
        <footer style={{ background:"#fff", borderTop:"1px solid #E8E6E1" }}>
          <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"48px 32px 40px" }}>
            {/* 상단 링크 */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", alignItems:"center", paddingBottom:"24px", borderBottom:"1px solid #E8E6E1", marginBottom:"24px" }}>
              {[
                {label:"회사소개",href:"/about",bold:false},
                {label:"딜러 신청",href:"/dealer/apply",bold:false},
                {label:"이용약관",href:"/terms",bold:false},
                {label:"개인정보 처리방침",href:"/privacy",bold:true},
                {label:"고객센터",href:"/contact",bold:false},
                {label:"블로그",href:"/blog",bold:false},
                {label:"자주 묻는 질문",href:"/faq",bold:false},
              ].map((item,i)=>(
                <span key={item.label} style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <a href={item.href} style={{ fontSize:"14px", fontWeight:item.bold?800:400, color:"#333", textDecoration:"none" }}>{item.label}</a>
                  {i<6&&<span style={{color:"#E0DDD7"}}>|</span>}
                </span>
              ))}
            </div>

            {/* 회사 정보 */}
            <div style={{ fontSize:"13px", color:"#999", lineHeight:2.0, fontWeight:400, marginBottom:"28px" }}>
              <p>상호 : 픽스카 FIXCAR | 대표 : 상훈 | 사업자등록번호 : 000-00-00000</p>
              <p>주소 : 광주광역시 (상세주소 추후 기입)</p>
              <p>통신판매업 신고번호 : 제0000-광주-00000호</p>
              <p>이메일 : info@fixcar.kr | 고객센터 : 062-000-0000 (평일 09:00~18:00)</p>
            </div>

            {/* 앱 다운로드 버튼 */}
            <div style={{ display:"flex", gap:"12px", marginBottom:"32px", flexWrap:"wrap" }}>
              <a href="#" style={{ textDecoration:"none" }}>
                <div style={{
                  display:"flex", alignItems:"center", gap:"10px",
                  border:"1.5px solid #E0DDD7", borderRadius:"12px", padding:"12px 24px",
                  background:"white", cursor:"pointer", transition:"all 0.15s",
                }}>
                  <svg width="20" height="24" viewBox="0 0 20 24" fill="none"><path d="M16.5 12.5c0-3.5 2.8-5.2 2.9-5.3-1.6-2.3-4-2.6-4.9-2.7-2.1-.2-4 1.2-5.1 1.2-1 0-2.6-1.2-4.3-1.1-2.2 0-4.2 1.3-5.4 3.3C-2.5 11.8.5 18.3 2.7 21.5c1.1 1.6 2.4 3.3 4.1 3.3 1.7-.1 2.3-1.1 4.2-1.1 2 0 2.5 1.1 4.3 1 1.8 0 2.9-1.6 4-3.2 1.3-1.8 1.8-3.6 1.8-3.7-.1 0-3.6-1.4-3.6-5.3zM13.4 3.2C14.3 2.1 14.9.6 14.7 0c-1.3.1-2.9.9-3.8 2-.8 1-1.6 2.5-1.4 4 1.5.1 2.9-.7 3.9-2.8z" fill="#333"/></svg>
                  <div>
                    <div style={{ fontSize:"10px", color:"#999", fontWeight:400, lineHeight:1 }}>Download on the</div>
                    <div style={{ fontSize:"16px", fontWeight:800, color:"#333", lineHeight:1.3 }}>App Store</div>
                  </div>
                </div>
              </a>
              <a href="#" style={{ textDecoration:"none" }}>
                <div style={{
                  display:"flex", alignItems:"center", gap:"10px",
                  border:"1.5px solid #E0DDD7", borderRadius:"12px", padding:"12px 24px",
                  background:"white", cursor:"pointer", transition:"all 0.15s",
                }}>
                  <svg width="20" height="22" viewBox="0 0 20 22" fill="none"><path d="M1 1.6L11.4 11 1 20.4c-.3-.4-.5-.9-.5-1.4V3c0-.5.2-1 .5-1.4zm1.4-1L14 7.8l-2.6 2.6L1.8.2c.2-.1.4-.2.6-.2.3 0 .7.1 1 .3l-.1.1zM14 14.2l-2.6-2.6 2.6-2.6 3.2 1.8c.9.5.9 1.3 0 1.8L14 14.2zm-1.6-.6L2.4 21.8c-.5.3-1 .3-1.4.1l9.8-9.8 1.6 1.5z" fill="#333"/></svg>
                  <div>
                    <div style={{ fontSize:"10px", color:"#999", fontWeight:400, lineHeight:1 }}>GET IT ON</div>
                    <div style={{ fontSize:"16px", fontWeight:800, color:"#333", lineHeight:1.3 }}>Google Play</div>
                  </div>
                </div>
              </a>
            </div>

            {/* 카피라이트 */}
            <div style={{ fontSize:"12px", color:"#CCC", fontWeight:400 }}>
              Copyright © FIXCAR. All Rights Reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
