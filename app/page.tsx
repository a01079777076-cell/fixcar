// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/page.tsx
// ═══════════════════════════════════════════════════
import Image from "next/image";
import Navbar from "@/components/Navbar";
import DailyCounter from "@/components/DailyCounter";
import HomeCarousel from "@/components/HomeCarousel";
import HomeBlogSection from "@/components/HomeBlogSection";
import HomeDealerRanking from "@/components/HomeDealerRanking";
import AdminRolePanel from "@/components/AdminRolePanel";
import { prisma } from "@/lib/prisma";
import { Shield, ChevronRight, Star, ArrowRight, Lock, CheckCircle, Zap } from "lucide-react";

export const revalidate = 60;

async function getTrendingCars() {
  try {
    return await prisma.car.findMany({
      where: { status: "AVAILABLE" },
      orderBy: [{ views: "desc" }, { updatedAt: "desc" }],
      take: 3,
      include: { dealer: { select: { shopName: true } }, _count: { select: { favorites: true } } },
    });
  } catch { return []; }
}

export default async function Home() {
  const dbCars = await getTrendingCars();

  const cars = dbCars.length > 0 ? dbCars.map(car => ({
    id: car.id, name: car.name, year: `${car.year}년식`,
    mileage: `${(car.mileage/1000).toFixed(0)}만km`, fuel: car.fuel,
    price: car.price, monthly: Math.round(car.price*10000*0.019/60),
    tags: (car.tags as string[]).slice(0,2), badge: (car.tags as string[])[0]||"인기",
    images: car.images as string[], views: car.views, favCount: car._count.favorites,
    query: car.name.includes("아반떼")?"hyundai+elantra+sedan":car.name.includes("K3")?"kia+k3+sedan":car.name.includes("투싼")?"hyundai+tucson+suv":"car+sedan",
  })) : [
    { id:1, name:"현대 아반떼 CN7", year:"2021년식", mileage:"32,000km", fuel:"가솔린", price:1450, monthly:29, tags:["무사고","초보 추천"], badge:"오늘의 인기", query:"hyundai+elantra+white+sedan", images:[], views:142, favCount:18 },
    { id:2, name:"기아 K3",         year:"2020년식", mileage:"51,000km", fuel:"가솔린", price:1090, monthly:22, tags:["무사고","가성비"],   badge:"급상승",     query:"kia+k3+silver+sedan",          images:[], views:98,  favCount:12 },
    { id:3, name:"현대 투싼 NX4",   year:"2022년식", mileage:"28,000km", fuel:"가솔린", price:2780, monthly:55, tags:["1인 오너","가족용"], badge:"찜 급증",    query:"hyundai+tucson+suv+black",     images:[], views:87,  favCount:24 },
  ];

  const promises = [
    { icon:<Shield size={28} color="white"/>,      num:"ZERO", label:"허위 매물 제로",   desc:"직접 검수된 광주·전남 차량만 등록돼요. 허위 매물은 즉시 삭제됩니다" },
    { icon:<Lock size={28} color="white"/>,         num:"FIX",  label:"흥정 없는 정찰가", desc:"표시 가격 = 최종 가격. 딜러 흥정, 숨은 수수료 없이 투명하게 거래해요" },
    { icon:<CheckCircle size={28} color="white"/>,  num:"AI",   label:"맞춤 차량 추천",   desc:"MBTI 테스트와 AI가 나에게 딱 맞는 차를 골라줘요. 발품 팔 필요 없어요" },
    { icon:<Zap size={28} color="white"/>,          num:"FREE", label:"오픈 프로모션 무료등록", desc:"픽스카, 판매량 증가할때까지 등록비 무료!" },
  ];

  const reviews = [
    { initial:"김", name:"김지원 (24세)", desc:"초보 운전 · 아반떼 픽", text:"면허 딴 지 3개월에 처음 중고차 샀는데 FIX 가격이라 흥정 없이 바로 계약했어요!", tag:"PICK", color:"#FF3B1E" },
    { initial:"박", name:"박민서 (27세)", desc:"직장인 · K3 픽",        text:"엔카에서 전화 폭탄에 지쳤는데 픽스카는 표시된 가격이 최종이라 진짜 편했어요.",  tag:"FIX",  color:"#1847FF" },
    { initial:"이", name:"이수연 (31세)", desc:"가족 선물 · 투싼 픽",   text:"차 하나도 모르는 제가 봐도 설명이 너무 친절해요. 초보 추천 필터가 진짜 도움됐어요!", tag:"PICK", color:"#FF3B1E" },
  ];

  /* 콘텐츠 배너 순서 (7·8·9번 요청 반영)
     원본: 랭킹, 경매, 32강, 커뮤니티, 유용한 정보, 카탈로그
     변경: 랭킹, 유용한 정보, 커뮤니티, 카탈로그, 경매, 32강   */
  const contentBanners = [
    { bgImg:"/icon/main_ranking_button.png",   title:"자동차 랭킹",          subtitle:"세상 모든 차량 순위",     desc:"최고가·저주행·초보추천 랭킹표 전체",              href:"/ranking",   color:"#FF3B1E", bg:"#FFF0ED" },
    { bgImg:"/icon/main_blog_button.png",       title:"유용한 정보",         subtitle:"차량관리, 소모품, 필수꿀템", desc:"차량 필수템부터, 관리 노하우 모음",             href:"/blog",      color:"#2D8A52", bg:"#EAF6EF" },
    { bgImg:"/icon/main_community_button.png",  title:"커뮤니티",              subtitle:"소식들 올릴 수 있는 곳",   desc:"구매후기·질문답변·정비정보·사진자랑 자유게시판",   href:"/community", color:"#CC6633", bg:"#FFF5ED" },
    { bgImg:"/icon/main_catalog_button.png",    title:"차량 카탈로그",         subtitle:"전세계 차량을 연도별로",   desc:"카탈로그 옵션, 출고가 다 모았어요. 자동차세·보험까지!", href:"/catalog",   color:"#1847FF", bg:"#EEF2FF" },
    { bgImg:"/icon/main_auction_button.png",    title:"내 차 경매로 팔기!",   subtitle:"딜러에게 공개 입찰 경매",  desc:"내 차량을 딜러에게 공개 입찰 경매로 투명하게",     href:"/auction",   color:"#E8A020", bg:"#FFF8EC" },
    { emoji:"⚔️", bgImg:"",                    title:"자동차 32강 토너먼트",  subtitle:"랜덤 대진 · 가격·마력 비교", desc:"당신의 드림카는? 32강 자동차 토너먼트 지금 시작!", href:"/battle",    color:"#9B30FF", bg:"#F5EEFF" },
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
        .car-card{background:#fff;border-radius:20px;overflow:hidden;transition:all 0.25s;cursor:pointer;}
        .car-card:hover{transform:translateY(-5px);box-shadow:0 20px 50px rgba(0,0,0,0.1);}
        .promise-card{border-radius:20px;padding:28px 24px;}
        .review-card{background:#fff;border-radius:18px;padding:26px;}
        .content-banner-card{transition:all 0.2s;}
        .content-banner-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.07);}

        .stats-strip{display:grid;grid-template-columns:repeat(4,1fr);background:white;border-radius:18px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.04);}
        .cars-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
        .content-banners{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
        .promises-4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
        .reviews-3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
        .pickfix-grid{display:grid;grid-template-columns:1fr 1fr;border-radius:24px;overflow:hidden;}
        .cta-grid{position:relative;z-index:1;width:100%;max-width:1200px;margin:0 auto;padding:clamp(40px,8vw,80px) clamp(20px,5vw,52px);display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;}
        .cta-cards{display:flex;flex-direction:column;gap:14px;}
        .promise-header{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;margin-bottom:60px;}
        .section-pad{padding-left:52px;padding-right:52px;}

        @media(max-width:1024px){
          .cars-3{grid-template-columns:1fr 1fr!important;}
          .promises-4{grid-template-columns:1fr 1fr!important;}
          .reviews-3{grid-template-columns:1fr 1fr!important;}
          .content-banners{grid-template-columns:1fr 1fr!important;}
          .pickfix-grid{grid-template-columns:1fr!important;}
          .cta-grid{grid-template-columns:1fr!important;gap:16px!important;}
          .promise-header{grid-template-columns:1fr!important;gap:20px!important;}
          .section-pad{padding-left:20px!important;padding-right:20px!important;}
        }
        @media(max-width:768px){
          .stats-strip{grid-template-columns:1fr 1fr!important;}
          .reviews-3{grid-template-columns:1fr!important;}
          .category-card{margin:0 12px!important;padding:18px 12px!important;}
        }
        @media(max-width:600px){
          .cars-3{grid-template-columns:1fr!important;}
          .content-banners{grid-template-columns:1fr!important;}
          .pickfix-inner{padding:32px 20px!important;}
          .promises-4{grid-template-columns:1fr!important;}
        }
        @media(max-width:480px){
          .section-pad{padding-left:12px!important;padding-right:12px!important;}
          section[style*="margin"]{margin-bottom:24px!important;}
          section[style*="padding: 96px"],section[style*="padding:96px"]{padding-top:40px!important;padding-bottom:40px!important;}
          section[style*="min-height"]{min-height:auto!important;}
        }
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)}}
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>
        <Navbar/>

        {/* ══ 히어로 배너 캐러셀 (HomeCarousel) ══ */}
        <HomeCarousel/>

        {/* ══ 카테고리 카드 ══ */}
        <div style={{ maxWidth:"840px", margin:"-20px auto 0", position:"relative", zIndex:10, padding:"0 16px" }}>
          <div className="category-card" style={{ background:"white", borderRadius:24, padding:"24px 32px", boxShadow:"0 12px 48px rgba(0,0,0,0.1)", display:"flex", justifyContent:"space-around", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            {[
              { icon:"🧬", img:"",                              label:"내차 찾기", href:"/quiz-select" },
              { icon:"",   img:"/icon/main_allcars_button.png", label:"전체 매물", href:"/cars"        },
              { icon:"🏆", img:"",                              label:"랭킹",      href:"/ranking"     },
              { icon:"📚", img:"",                              label:"카탈로그",  href:"/catalog"     },
            ].map(item => (
              <a key={item.label} href={item.href} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, textDecoration:"none", padding:"8px 16px", borderRadius:14, transition:"all 0.2s", minWidth:70 }}>
                <div style={{ width:64, height:64, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, overflow:"hidden" }}>
                  {item.img ? <Image src={item.img} alt={item.label} width={56} height={56} style={{ objectFit:"contain" }}/> : item.icon}
                </div>
                <span style={{ fontSize:"clamp(12px,1.5vw,14px)", fontWeight:700, color:"#444" }}>{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ══ 통계 스트립 ══ */}
        <section style={{ maxWidth:"1360px", margin:"24px auto 0", padding:"0 52px" }}>
          <div className="stats-strip">
            <DailyCounter/>
            {[["2,418+","등록 매물","#FF3B1E"],["98%","구매 만족도","#1847FF"],["4.9","앱 평점","#2D8A52"]].map(([num,label,color])=>(
              <div key={String(label)} style={{ padding:"20px 16px", textAlign:"center", borderRight:"1px solid #F0EEE9" }}>
                <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"clamp(22px,3vw,28px)", color:String(color), letterSpacing:-1 }}>{num}</div>
                <div style={{ fontSize:"clamp(10px,1.2vw,12px)", color:"#AAA", marginTop:3, fontWeight:400 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ PICK + FIX ══ */}
        <section className="section-pad" style={{ maxWidth:"1360px", margin:"clamp(20px,4vw,40px) auto clamp(24px,6vw,80px)", paddingTop:0, paddingBottom:0 }}>
          <div className="pickfix-grid">
            <div className="pickfix-inner" style={{ background:"linear-gradient(135deg,#FF5A3C 0%,#E8290F 60%,#C41E08 100%)", padding:"64px 56px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:-10, bottom:-30, fontFamily:"'Bebas Neue',serif", fontSize:"clamp(120px,18vw,200px)", color:"rgba(255,255,255,0.2)", lineHeight:1, letterSpacing:-5, pointerEvents:"none" }}>PICK</div>
              <div style={{ width:48, height:48, background:"rgba(255,255,255,0.15)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}><Zap size={24} color="white"/></div>
              <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"clamp(32px,5vw,48px)", color:"#fff", letterSpacing:3, marginBottom:10 }}>PICK</div>
              <div style={{ fontSize:"clamp(16px,2.5vw,24px)", fontWeight:600, color:"rgba(255,255,255,0.95)", marginBottom:14, wordBreak:"keep-all" }}>중고차, 잘 모르시다면 차량 MBTI 3분 검사</div>
              <p style={{ fontSize:"clamp(13px,1.5vw,15px)", color:"rgba(255,255,255,0.78)", lineHeight:1.85, fontWeight:400, wordBreak:"keep-all" }}>차량 MBTI 테스트 · 12문항<br/>내가 무슨 차 있는지도 잘 모른다! 나에게 맞는 차 유형 찾기</p>
              <a href="/mbti" style={{ display:"inline-flex", alignItems:"center", gap:6, marginTop:18, background:"rgba(255,255,255,0.2)", color:"white", padding:"10px 20px", borderRadius:100, fontSize:13, fontWeight:800 }}>나한테 맞는 차 MBTI 하러가기 <ArrowRight size={14}/></a>
            </div>
            <div className="pickfix-inner" style={{ background:"linear-gradient(135deg,#3060FF 0%,#1338E0 60%,#0A25B8 100%)", padding:"64px 56px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:-10, bottom:-30, fontFamily:"'Bebas Neue',serif", fontSize:"clamp(120px,18vw,200px)", color:"rgba(255,255,255,0.2)", lineHeight:1, letterSpacing:-5, pointerEvents:"none" }}>FIX</div>
              <div style={{ width:48, height:48, background:"rgba(255,255,255,0.15)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}><Lock size={24} color="white"/></div>
              <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"clamp(32px,5vw,48px)", color:"#fff", letterSpacing:3, marginBottom:10 }}>FIX</div>
              <div style={{ fontSize:"clamp(16px,2.5vw,24px)", fontWeight:700, color:"rgba(255,255,255,0.95)", marginBottom:14, wordBreak:"keep-all" }}>광주에서 고객에게 알맞은 차량추천</div>
              <p style={{ fontSize:"clamp(13px,1.5vw,15px)", color:"rgba(255,255,255,0.78)", lineHeight:1.85, fontWeight:400, wordBreak:"keep-all" }}>흥정 없음 · 가격 투명<br/>100항목 검수</p>
              <a href="/cars" style={{ display:"inline-flex", alignItems:"center", gap:6, marginTop:18, background:"rgba(255,255,255,0.2)", color:"white", padding:"10px 20px", borderRadius:100, fontSize:13, fontWeight:800 }}>FIX 가격 매물 보기 <ArrowRight size={14}/></a>
            </div>
          </div>
        </section>

        {/* ══ 콘텐츠 배너 (순서 변경: 랭킹·유용한 정보·커뮤니티·카탈로그·경매·32강) ══ */}
        <section className="section-pad" style={{ maxWidth:"1360px", margin:"0 auto clamp(24px,6vw,80px)", paddingTop:0, paddingBottom:0 }}>
          <div className="content-banners">
            {contentBanners.map(item=>(
              <a key={item.title} href={item.href}>
                <div className="content-banner-card" style={{ borderRadius:20, padding:"28px 30px", cursor:"pointer", height:"100%", minHeight:"clamp(160px,15vw,220px)", position:"relative", overflow:"hidden", background:item.bgImg?"transparent":"white" }}>
                  {item.bgImg && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.bgImg} alt={item.title} style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }}/>
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.65))", zIndex:1 }}/>
                    </>
                  )}
                  <div style={{ position:"relative", zIndex:2 }}>
                    {!item.bgImg && item.emoji && <div style={{ fontSize:38, marginBottom:14 }}>{(item as {emoji?:string}).emoji}</div>}
                    <div style={{ display:"inline-block", background:item.bgImg?"rgba(255,255,255,0.2)":item.bg, color:item.bgImg?"white":item.color, padding:"4px 14px", borderRadius:100, fontSize:"clamp(10px,1.2vw,12px)", fontWeight:800, marginBottom:10, backdropFilter:item.bgImg?"blur(4px)":"none" }}>{item.subtitle}</div>
                    <div style={{ fontSize:"clamp(16px,2vw,20px)", fontWeight:800, marginBottom:8, letterSpacing:-0.5, color:item.bgImg?"white":"#1A1A1A" }}>{item.title}</div>
                    <div style={{ fontSize:"clamp(12px,1.2vw,14px)", color:item.bgImg?"rgba(255,255,255,0.8)":"#888", fontWeight:400, lineHeight:1.65 }}>{item.desc}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ══ 유용한 정보 최신글 ══ */}
        <HomeBlogSection/>

        {/* ══ 딜러 랭킹 ══ */}
        <HomeDealerRanking/>

        {/* ══ 오늘 인기 급상승 매물 ══ */}
        <section className="section-pad" style={{ maxWidth:"1360px", margin:"0 auto clamp(24px,6vw,80px)", paddingTop:0, paddingBottom:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:36 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:800, letterSpacing:3, color:"#FF3B1E", marginBottom:12 }}>HOT TODAY</div>
              <h2 style={{ fontSize:"clamp(22px,4vw,46px)", fontWeight:800, letterSpacing:-1.5, lineHeight:1.1 }}>오늘 인기 <span style={{ color:"#FF3B1E" }}>급상승</span> 매물</h2>
              <p style={{ fontSize:12, color:"#AAA", marginTop:6, fontWeight:400 }}>찜 수 + 조회수 기준 오늘의 인기 급상승</p>
            </div>
            <a href="/cars" style={{ display:"flex", alignItems:"center", gap:6, fontSize:15, fontWeight:700, color:"#888", whiteSpace:"nowrap" }}>전체 보기 <ChevronRight size={16}/></a>
          </div>
          <div className="cars-3">
            {cars.map(car=>(
              <a key={car.id} href={`/cars/${car.id}`} className="car-card">
                <div style={{ height:"clamp(200px,26vw,280px)", overflow:"hidden", position:"relative", background:"#F0EEE9" }}>
                  {(car.images && car.images[0]) ? (
                    <Image src={car.images[0]} alt={car.name} fill sizes="(max-width:600px)100vw,(max-width:1024px)50vw,33vw" style={{ objectFit:"cover" }}/>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={`https://source.unsplash.com/600x400/?${car.query}`} alt={car.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  )}
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.3))" }}/>
                  <span style={{ position:"absolute", top:14, left:14, background:"#FF3B1E", color:"#fff", padding:"5px 12px", borderRadius:100, fontSize:11, fontWeight:800 }}>{car.badge}</span>
                  {car.views > 0 && <span style={{ position:"absolute", bottom:10, right:12, background:"rgba(0,0,0,0.45)", color:"white", fontSize:10, padding:"3px 8px", borderRadius:100 }}>👁 {car.views}</span>}
                </div>
                <div style={{ padding:"18px 20px" }}>
                  <div style={{ fontSize:"clamp(14px,2vw,17px)", fontWeight:800, marginBottom:4 }}>{car.name}</div>
                  <div style={{ fontSize:13, color:"#AAA", marginBottom:14, fontWeight:400 }}>{car.year} · {car.mileage} · {car.fuel}</div>
                  <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
                    {car.tags.map((tag:string)=>(
                      <span key={tag} style={{ background:"#EAF6EF", border:"1px solid #B8DFC8", padding:"4px 10px", borderRadius:100, fontSize:11, fontWeight:700, color:"#2D8A52" }}>✓ {tag}</span>
                    ))}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", paddingTop:14, borderTop:"1px solid #F0EEE9" }}>
                    <div>
                      <div style={{ fontSize:"clamp(20px,3vw,26px)", fontWeight:800, letterSpacing:-0.5 }}>{car.price.toLocaleString()}<span style={{ fontSize:14, fontWeight:700, color:"#AAA" }}>만원</span></div>
                      <div style={{ fontSize:12, color:"#1847FF", fontWeight:800, marginTop:3, display:"flex", alignItems:"center", gap:3 }}><Lock size={10}/> FIX · 월 {car.monthly}만원~</div>
                    </div>
                    <div style={{ background:"#1A1A1A", color:"#fff", padding:"10px 18px", borderRadius:10, fontSize:13, fontWeight:800, display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>매물 구경 <ArrowRight size={14}/></div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ══ FIX 약속 ══ */}
        <section style={{ background:"#1A1A1A", padding:"clamp(40px,8vw,96px) clamp(16px,4vw,52px)" }}>
          <div style={{ maxWidth:"1360px", margin:"0 auto" }}>
            <div className="promise-header">
              <div>
                <div style={{ fontSize:12, fontWeight:800, letterSpacing:3, color:"#7A9BFF", marginBottom:12 }}>FIX PROMISE</div>
                <h2 style={{ fontSize:"clamp(24px,4vw,52px)", fontWeight:800, letterSpacing:-1.5, color:"#fff", lineHeight:1.1 }}>픽스카가 지키는<br/><span style={{ color:"#7A9BFF" }}>FIX</span> 약속 4가지</h2>
              </div>
              <p style={{ fontSize:"clamp(14px,2vw,17px)", color:"rgba(255,255,255,0.5)", lineHeight:1.8, fontWeight:400 }}>가격만 고정(FIX)하는 게 아니에요.<br/><strong style={{ color:"rgba(255,255,255,0.88)", fontWeight:800 }}>신뢰도 고정(FIX)합니다.</strong></p>
            </div>
            <div className="promises-4">
              {promises.map(p=>(
                <div key={p.label} className="promise-card" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ width:52, height:52, background:"#FF3B1E", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>{p.icon}</div>
                  <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:36, color:"#7A9BFF", letterSpacing:1, marginBottom:6 }}>{p.num}</div>
                  <div style={{ fontSize:"clamp(14px,2vw,16px)", fontWeight:800, color:"#fff", marginBottom:10 }}>{p.label}</div>
                  <div style={{ fontSize:"clamp(12px,1.3vw,14px)", color:"rgba(255,255,255,0.5)", lineHeight:1.75, fontWeight:400 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 후기 ══ */}
        <section className="section-pad" style={{ maxWidth:"1360px", margin:"0 auto", paddingTop:"clamp(32px,6vw,80px)", paddingBottom:"clamp(32px,6vw,80px)" }}>
          <div style={{ marginBottom:48 }}>
            <div style={{ fontSize:12, fontWeight:800, letterSpacing:3, color:"#FF3B1E", marginBottom:12 }}>PICK STORIES</div>
            <h2 style={{ fontSize:"clamp(22px,4vw,46px)", fontWeight:800, letterSpacing:-1.5, lineHeight:1.1 }}>픽한 사람들 이야기</h2>
          </div>
          <div className="reviews-3">
            {reviews.map(r=>(
              <div key={r.name} className="review-card">
                <div style={{ display:"flex", gap:4, marginBottom:16 }}>{[...Array(5)].map((_,i)=><Star key={i} size={16} fill="#FF3B1E" color="#FF3B1E"/>)}</div>
                <p style={{ fontSize:"clamp(13px,1.5vw,15px)", lineHeight:1.85, color:"#444", marginBottom:22, fontWeight:400 }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:42, height:42, background:r.color+"1A", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:r.color, flexShrink:0 }}>{r.initial}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:15, fontWeight:800 }}>{r.name}</div>
                    <div style={{ fontSize:12, color:"#AAA", fontWeight:400 }}>{r.desc}</div>
                  </div>
                  <span style={{ background:r.color+"1A", color:r.color, padding:"4px 12px", borderRadius:100, fontSize:12, fontWeight:800, flexShrink:0 }}>{r.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section style={{ background:"#FF3B1E", minHeight:"clamp(320px,50vw,520px)", position:"relative", overflow:"hidden", display:"flex", alignItems:"center" }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.08)", clipPath:"polygon(0 0,58% 0,42% 100%,0 100%)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", top:-20, left:-10, fontFamily:"'Bebas Neue',serif", fontSize:"clamp(140px,22vw,280px)", color:"rgba(255,255,255,0.08)", lineHeight:1, letterSpacing:-5, pointerEvents:"none", userSelect:"none" }}>PICK</div>
          <div style={{ position:"absolute", bottom:-30, right:-10, fontFamily:"'Bebas Neue',serif", fontSize:"clamp(140px,22vw,280px)", color:"rgba(0,0,0,0.1)", lineHeight:1, letterSpacing:-5, pointerEvents:"none", userSelect:"none" }}>FIX</div>
          <div className="cta-grid">
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,0,0,0.15)", borderRadius:100, padding:"8px 18px", marginBottom:24 }}>
                <div style={{ width:8, height:8, background:"white", borderRadius:"50%", opacity:0.8 }}/>
                <span style={{ fontSize:13, fontWeight:800, color:"rgba(255,255,255,0.9)", letterSpacing:2 }}>FIXCAR 광주</span>
              </div>
              <h2 style={{ fontFamily:"'Black Han Sans',sans-serif", fontSize:"clamp(32px,6vw,76px)", fontWeight:400, color:"white", letterSpacing:-2, lineHeight:1.05, marginBottom:20, wordBreak:"keep-all" }}>나, 이 차로<br/>픽했어</h2>
              <p style={{ fontSize:"clamp(14px,2vw,17px)", color:"rgba(255,255,255,0.8)", lineHeight:1.85, fontWeight:400, wordBreak:"keep-all" }}>차량 MBTI로 나에게 맞는 차를 찾고<br/>FIX 정찰가로 스트레스 없이 구매하세요.</p>
            </div>
            <div className="cta-cards">
              <div style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:20, padding:"24px 28px" }}>
                <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:32, color:"white", letterSpacing:3, marginBottom:6 }}>PICK</div>
                <div style={{ fontSize:15, fontWeight:800, color:"white", marginBottom:6 }}>나에게 딱 맞는 차 찾기</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginBottom:16, fontWeight:400 }}>AI 추천 · 3분 퀴즈 · 조건 맞춤 검색</div>
                <a href="/quiz"><button style={{ background:"white", color:"#FF3B1E", border:"none", padding:"13px 28px", borderRadius:10, fontSize:15, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:8, width:"100%", justifyContent:"center", fontFamily:"'NanumSquareRound',sans-serif" }}>내 차 PICK하러 가기 <ArrowRight size={16}/></button></a>
              </div>
              <div style={{ background:"rgba(0,0,0,0.15)", border:"1px solid rgba(0,0,0,0.1)", borderRadius:20, padding:"24px 28px" }}>
                <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:32, color:"white", letterSpacing:3, marginBottom:6 }}>FIX</div>
                <div style={{ fontSize:15, fontWeight:800, color:"white", marginBottom:6 }}>정찰가 매물 바로 보기</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginBottom:16, fontWeight:400 }}>흥정 없음 · 가격 투명 · 100항목 검수</div>
                <a href="/cars"><button style={{ background:"transparent", color:"white", border:"2px solid rgba(255,255,255,0.5)", padding:"13px 28px", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:8, width:"100%", justifyContent:"center", fontFamily:"'NanumSquareRound',sans-serif" }}><Lock size={16}/> FIX 가격 매물 보기</button></a>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 푸터 ══ */}
        <footer style={{ background:"#fff", borderTop:"1px solid #E8E6E1" }}>
          <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"48px clamp(16px,4vw,32px) 40px" }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center", paddingBottom:24, borderBottom:"1px solid #E8E6E1", marginBottom:24 }}>
              {[{label:"회사소개",href:"/about",bold:false},{label:"딜러 신청",href:"/dealer/apply",bold:false},{label:"이용약관",href:"/terms",bold:false},{label:"개인정보 처리방침",href:"/privacy",bold:true},{label:"고객센터",href:"/contact",bold:false},{label:"유용한 정보",href:"/blog",bold:false},{label:"자주 묻는 질문",href:"/faq",bold:false}].map((item,i)=>(
                <span key={item.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <a href={item.href} style={{ fontSize:"clamp(12px,1.5vw,14px)", fontWeight:item.bold?800:400, color:"#333", textDecoration:"none" }}>{item.label}</a>
                  {i<6&&<span style={{ color:"#E0DDD7" }}>|</span>}
                </span>
              ))}
            </div>
            <div style={{ fontSize:13, color:"#999", lineHeight:2.0, fontWeight:400, marginBottom:28 }}>
              <p>상호 : 픽스카 FIXCAR | 대표 : 상훈 | 사업자등록번호 : 000-00-00000</p>
              <p>주소 : 광주광역시 (상세주소 추후 기입)</p>
              <p>통신판매업 신고번호 : 제0000-광주-00000호</p>
              <p>이메일 : info@fixcar.kr | 고객센터 : 062-000-0000 (평일 09:00~18:00)</p>
            </div>
            <div style={{ fontSize:12, color:"#CCC", fontWeight:400 }}>Copyright © FIXCAR. All Rights Reserved.</div>
          </div>
        </footer>
      </div>

      {/* ══ 어드민 역할 전환 패널 ══ */}
      <AdminRolePanel/>
    </>
  );
}
