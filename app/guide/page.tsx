import {
  Shield, Calculator, FileText, Wrench, Car, CheckCircle,
  ChevronRight, AlertCircle, DollarSign, Lock, Zap, Clock
} from "lucide-react";

const GUIDE_SECTIONS = [
  {
    id: "step1", step: "01", title: "내 예산 정하기",
    desc: "차 가격만 보면 안 돼요. 총 비용을 먼저 계산해야 해요.",
    color: "#FF3B1E", bg: "#FFF0ED",
    items: [
      { title: "취등록세", desc: "차 가격의 7%예요. 1,000만원짜리 차라면 70만원이 추가로 필요해요.", icon: <DollarSign size={18} color="#FF3B1E"/> },
      { title: "자동차 보험료", desc: "첫 차는 연 70~150만원 정도예요. 나이가 어릴수록 비싸요.", icon: <Shield size={18} color="#FF3B1E"/> },
      { title: "자동차세", desc: "배기량에 따라 연 10~30만원. 6월·12월 두 번 납부해요.", icon: <FileText size={18} color="#FF3B1E"/> },
      { title: "주유비·유지비", desc: "월 5~15만원 정도 예상하면 돼요.", icon: <Zap size={18} color="#FF3B1E"/> },
    ]
  },
  {
    id: "step2", step: "02", title: "사고이력 꼭 확인하기",
    desc: "중고차 구매 전 사고이력 조회는 필수예요. 무료로 할 수 있어요.",
    color: "#1847FF", bg: "#EEF2FF",
    items: [
      { title: "보험개발원 조회", desc: "carhistory.or.kr 접속 → 차량번호 입력 → 무료 조회. 보험 처리된 사고가 다 나와요.", icon: <Shield size={18} color="#1847FF"/> },
      { title: "자동차 등록원부", desc: "정부24에서 발급 가능. 소유자·압류·저당 여부 확인할 수 있어요.", icon: <FileText size={18} color="#1847FF"/> },
      { title: "침수차 주의", desc: "침수차는 냄새나 전기 이상 증상이 생겨요. 하체 녹이 많으면 의심해야 해요.", icon: <AlertCircle size={18} color="#1847FF"/> },
      { title: "픽스카는?", desc: "모든 매물의 사고이력을 자동 조회해서 투명하게 공개해요.", icon: <CheckCircle size={18} color="#1847FF"/> },
    ]
  },
  {
    id: "step3", step: "03", title: "직접 보고 타보기",
    desc: "사진만 보고 사면 안 돼요. 꼭 직접 확인하세요.",
    color: "#2D8A52", bg: "#EAF6EF",
    items: [
      { title: "외관 확인", desc: "도어 틈새가 균일한지, 패널 색깔이 다른 곳은 없는지 확인하세요.", icon: <Car size={18} color="#2D8A52"/> },
      { title: "시승 필수", desc: "10~15분 직접 타보세요. 핸들 떨림, 이상 소리, 브레이크 느낌 확인!", icon: <CheckCircle size={18} color="#2D8A52"/> },
      { title: "엔진룸 체크", desc: "오일 누유 흔적, 냉각수 색깔(초록이면 정상) 확인해요.", icon: <Wrench size={18} color="#2D8A52"/> },
      { title: "탁송 시?", desc: "직접 보기 어려우면 픽스카에서 100항목 검수 영상을 요청할 수 있어요.", icon: <Zap size={18} color="#2D8A52"/> },
    ]
  },
  {
    id: "step4", step: "04", title: "FIX 가격으로 스트레스 없이",
    desc: "픽스카는 가격 흥정이 없어요. 표시된 가격이 최종 가격이에요.",
    color: "#1A1A1A", bg: "#F8F6F2",
    items: [
      { title: "정찰제란?", desc: "모든 차의 가격이 고정돼 있어요. 딜러마다 다른 가격, 전화 흥정 스트레스가 없어요.", icon: <Lock size={18} color="#1A1A1A"/> },
      { title: "숨은 비용 없음", desc: "계약서 쓰다 갑자기 추가금이 생기는 일이 없어요.", icon: <CheckCircle size={18} color="#1A1A1A"/> },
      { title: "시세 비교 제공", desc: "같은 모델의 시장 평균가 대비 픽스카 가격을 직접 비교해서 보여드려요.", icon: <Calculator size={18} color="#1A1A1A"/> },
      { title: "3일 환불 보장", desc: "구매 후 3일 이내 마음이 바뀌면 이유 불문 100% 환불해드려요.", icon: <Clock size={18} color="#1A1A1A"/> },
    ]
  },
];

const TERMS = [
  { term: "cc (배기량)", desc: "엔진이 얼마나 큰지 나타내는 단위예요. cc가 클수록 힘이 세지만 자동차세도 많이 나와요. 1,600cc 이하면 작은 차예요." },
  { term: "연비 (km/L)", desc: "기름 1리터로 몇 km를 갈 수 있는지예요. 숫자가 클수록 경제적이에요. 15km/L이면 좋은 편이에요." },
  { term: "FWD / RWD / AWD", desc: "구동 방식이에요. FWD(앞바퀴), RWD(뒷바퀴), AWD(네바퀴) 구동. 일반 도로는 FWD로 충분해요." },
  { term: "토크", desc: "차가 얼마나 힘차게 출발하는지예요. 숫자가 클수록 초반 가속이 좋아요." },
  { term: "DCT / CVT / IVT", desc: "변속기 종류예요. DCT는 스포티한 느낌, CVT/IVT는 부드러운 느낌이에요. 초보에게는 CVT/IVT 추천!" },
  { term: "ADAS (첨단 안전)",  desc: "자동 긴급제동, 차선이탈 경고 등 안전 기술의 총칭이에요. 최근 차일수록 잘 돼 있어요." },
  { term: "HDA (고속도로 주행)", desc: "고속도로에서 앞차와 간격을 유지하며 자동 주행해주는 기능이에요." },
  { term: "압류·저당", desc: "차에 빚이 걸려있는 상태예요. 이런 차는 사면 안 돼요! 자동차 등록원부에서 확인하세요." },
];

const CHECKLIST = [
  { label: "예산 계산 완료 (차값 + 취등록세 + 보험 + 세금)", done: false },
  { label: "사고이력 조회 완료 (carhistory.or.kr)", done: false },
  { label: "자동차 등록원부 확인 (압류·저당 없음)", done: false },
  { label: "실물 또는 검수 영상 확인", done: false },
  { label: "시승 완료", done: false },
  { label: "할부 조건 확인 (이자 계산)", done: false },
  { label: "계약서 내용 꼼꼼히 읽기", done: false },
  { label: "환불·하자 처리 조건 확인", done: false },
];

export default function GuidePage() {
  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        .nav-link:hover { color:#1A1A1A !important; }
        .guide-card { transition:all 0.22s; }
        .guide-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.07); }
        .term-row:hover { background:#FAFAF8; }
        .check-label:hover { background:#FAFAF8; }
        .btn-red { background:#FF3B1E; color:white; border:none; border-radius:12px; font-size:15px; font-weight:800; padding:14px 28px; display:inline-flex; align-items:center; gap:8px; transition:all 0.2s; cursor:pointer; }
        .btn-red:hover { background:#D42E14; transform:translateY(-2px); }
        @media(max-width:1024px) {
          .hero-grid { grid-template-columns:1fr !important; }
          .steps-grid { grid-template-columns:1fr !important; }
          .nav-menu { display:none !important; }
        }
        @media(max-width:600px) {
          .section-wrap { padding:0 20px !important; }
          .hero-wrap { padding:48px 20px !important; }
          .items-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#F0EEE9" }}>

        {/* 공지 바 */}
        <div style={{ background:"#1A1A1A", color:"#fff", textAlign:"center", padding:"10px", fontSize:"13px", fontWeight:700 }}>
          <span style={{ color:"#FF7A63" }}>PICK</span> 맘에 드는 차를 픽하세요 &nbsp;·&nbsp;
          <span style={{ color:"#7A9BFF" }}>FIX</span> 정찰제 — 흥정 없음
        </div>

        {/* 네비 */}
        <nav style={{ background:"rgba(255,255,255,0.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid #ECEAE4", height:"68px", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 52px", position:"sticky", top:0, zIndex:100 }}>
          <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", letterSpacing:"3px" }}>
            <span style={{ color:"#FF3B1E" }}>FIX</span><span>CAR</span>
          </a>
          <div className="nav-menu" style={{ display:"flex", gap:"36px" }}>
            {[["차 찾기","/cars"],["추천 퀴즈","/quiz"],["초보 가이드","/guide"],["내 차 팔기","/sell"]].map(([l,h])=>(
              <a key={l} href={h} className="nav-link" style={{ fontSize:"15px", fontWeight:l==="초보 가이드"?800:700, color:l==="초보 가이드"?"#1A1A1A":"#888", borderBottom:l==="초보 가이드"?"2px solid #FF3B1E":"none", paddingBottom:l==="초보 가이드"?"2px":"0" }}>{l}</a>
            ))}
          </div>
          <a href="/quiz"><button className="btn-red" style={{ padding:"10px 22px", fontSize:"14px", borderRadius:"100px" }}>내 차 픽하기</button></a>
        </nav>

        {/* 히어로 */}
        <section className="hero-wrap" style={{ background:"#1A1A1A", padding:"64px 52px 56px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"400px", height:"400px", background:"radial-gradient(circle,rgba(255,59,30,0.1),transparent 65%)", borderRadius:"50%" }} />
          <div style={{ maxWidth:"1360px", margin:"0 auto", position:"relative", zIndex:1 }}>
            <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#FF7A63", marginBottom:"14px" }}>BEGINNER GUIDE</div>
            <h1 style={{ fontSize:"clamp(32px,5vw,64px)", fontWeight:800, color:"white", letterSpacing:"-2px", lineHeight:1.05, marginBottom:"18px" }}>
              중고차, 이것만 알면<br /><span style={{ color:"#FF3B1E" }}>사기 안 당해요</span>
            </h1>
            <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.5)", lineHeight:1.8, maxWidth:"560px", marginBottom:"32px", fontWeight:400 }}>
              차를 전혀 몰라도 괜찮아요. 구매 전 꼭 알아야 할 것들만<br />쉽고 솔직하게 알려드릴게요.
            </p>
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
              <a href="/quiz"><button className="btn-red">3분 퀴즈로 내 차 찾기 <ChevronRight size={16}/></button></a>
              <a href="/cars"><button style={{ background:"rgba(255,255,255,0.1)", color:"white", border:"1.5px solid rgba(255,255,255,0.2)", padding:"13px 26px", borderRadius:"12px", fontSize:"15px", fontWeight:700, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"8px" }}>
                전체 매물 보기
              </button></a>
            </div>
          </div>
        </section>

        {/* 4단계 구매 가이드 */}
        <section className="section-wrap" style={{ maxWidth:"1360px", margin:"0 auto", padding:"72px 52px" }}>
          <div style={{ marginBottom:"48px" }}>
            <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#FF3B1E", marginBottom:"12px" }}>STEP BY STEP</div>
            <h2 style={{ fontSize:"clamp(26px,4vw,46px)", fontWeight:800, letterSpacing:"-1.5px", lineHeight:1.1 }}>
              중고차 구매<br />4단계 완전 정복
            </h2>
          </div>
          <div className="steps-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"20px" }}>
            {GUIDE_SECTIONS.map(section => (
              <div key={section.id} className="guide-card" style={{ background:"white", borderRadius:"22px", padding:"32px", overflow:"hidden", position:"relative" }}>
                <div style={{ position:"absolute", right:"-10px", top:"-10px", fontFamily:"'Bebas Neue',serif", fontSize:"96px", color:section.bg, lineHeight:1, pointerEvents:"none" }}>{section.step}</div>
                <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
                  <div style={{ width:"48px", height:"48px", background:section.color, borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontFamily:"'Bebas Neue',serif", fontSize:"22px", color:"white", letterSpacing:"1px" }}>{section.step}</span>
                  </div>
                  <div>
                    <div style={{ fontSize:"18px", fontWeight:800 }}>{section.title}</div>
                    <div style={{ fontSize:"13px", color:"#888", fontWeight:400, marginTop:"2px" }}>{section.desc}</div>
                  </div>
                </div>
                <div className="items-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                  {section.items.map(item => (
                    <div key={item.title} style={{ background:section.bg, borderRadius:"12px", padding:"14px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
                        {item.icon}
                        <span style={{ fontSize:"14px", fontWeight:800 }}>{item.title}</span>
                      </div>
                      <div style={{ fontSize:"12px", color:"#666", lineHeight:1.65, fontWeight:400 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 용어 사전 */}
        <section style={{ background:"white", padding:"72px 0" }}>
          <div className="section-wrap" style={{ maxWidth:"1360px", margin:"0 auto", padding:"0 52px" }}>
            <div style={{ marginBottom:"40px" }}>
              <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#1847FF", marginBottom:"12px" }}>GLOSSARY</div>
              <h2 style={{ fontSize:"clamp(26px,4vw,46px)", fontWeight:800, letterSpacing:"-1.5px", lineHeight:1.1 }}>
                어려운 용어<br />쉽게 알려드려요 📖
              </h2>
            </div>
            <div style={{ border:"1px solid #ECEAE4", borderRadius:"18px", overflow:"hidden" }}>
              {TERMS.map((t, i) => (
                <div key={t.term} className="term-row" style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:"0", borderBottom:i<TERMS.length-1?"1px solid #F0EEE9":"none" }}>
                  <div style={{ padding:"18px 22px", background:"#F8F6F2", borderRight:"1px solid #F0EEE9", display:"flex", alignItems:"center" }}>
                    <span style={{ fontSize:"15px", fontWeight:800, color:"#1847FF" }}>{t.term}</span>
                  </div>
                  <div style={{ padding:"18px 24px", display:"flex", alignItems:"center" }}>
                    <span style={{ fontSize:"14px", color:"#444", lineHeight:1.7, fontWeight:400 }}>{t.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 구매 전 체크리스트 */}
        <section className="section-wrap" style={{ maxWidth:"1360px", margin:"0 auto", padding:"72px 52px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"48px", alignItems:"start" }}>
            <div>
              <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"3px", color:"#2D8A52", marginBottom:"12px" }}>CHECKLIST</div>
              <h2 style={{ fontSize:"clamp(24px,4vw,42px)", fontWeight:800, letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:"16px" }}>
                구매 전<br />체크리스트 ✅
              </h2>
              <p style={{ fontSize:"15px", color:"#888", lineHeight:1.8, fontWeight:400, marginBottom:"28px" }}>
                이 8가지만 확인하면 중고차 사기 90% 예방돼요. 픽스카는 대부분을 대신 해드려요!
              </p>
              <a href="/quiz">
                <button className="btn-red">지금 바로 시작하기 <ChevronRight size={16}/></button>
              </a>
            </div>
            <div style={{ background:"white", borderRadius:"20px", padding:"24px", display:"flex", flexDirection:"column", gap:"8px" }}>
              {CHECKLIST.map((item, i) => (
                <label key={i} className="check-label" style={{ display:"flex", alignItems:"flex-start", gap:"12px", padding:"12px 14px", borderRadius:"10px", cursor:"pointer", transition:"background 0.15s" }}>
                  <input type="checkbox" style={{ width:"18px", height:"18px", accentColor:"#FF3B1E", marginTop:"1px", flexShrink:0, cursor:"pointer" }} />
                  <span style={{ fontSize:"14px", fontWeight:600, color:"#444", lineHeight:1.6 }}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* 픽스카 보장 */}
        <section style={{ background:"#FF3B1E", padding:"80px 52px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
            <div style={{ fontFamily:"'Bebas Neue',serif", fontSize:"clamp(80px,15vw,180px)", color:"rgba(0,0,0,0.07)", whiteSpace:"nowrap", letterSpacing:"6px" }}>FIXCAR GUIDE</div>
          </div>
          <div style={{ position:"relative", zIndex:1, maxWidth:"640px", margin:"0 auto" }}>
            <h2 style={{ fontSize:"clamp(32px,5vw,60px)", fontWeight:800, color:"white", letterSpacing:"-2px", lineHeight:1.05, marginBottom:"16px" }}>
              이제 자신 있게<br />픽하세요!
            </h2>
            <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.8)", lineHeight:1.8, marginBottom:"36px", fontWeight:400 }}>
              픽스카는 복잡한 중고차 구매를 쉽고 투명하게 만들어요.<br />FIX 정찰가로 가격 걱정, 검수로 상태 걱정을 없애드려요.
            </p>
            <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
              <a href="/quiz"><button style={{ background:"white", color:"#FF3B1E", border:"none", padding:"16px 36px", borderRadius:"12px", fontSize:"16px", fontWeight:800, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"8px" }}>
                내 차 추천받기 <ChevronRight size={16}/>
              </button></a>
              <a href="/cars"><button style={{ background:"transparent", color:"white", border:"2.5px solid rgba(255,255,255,0.55)", padding:"14px 32px", borderRadius:"12px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>
                전체 매물 보기
              </button></a>
            </div>
          </div>
        </section>

        {/* 푸터 */}
        <footer style={{ background:"#1A1A1A", padding:"48px 52px 36px" }}>
          <div style={{ maxWidth:"1360px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"20px" }}>
            <a href="/" style={{ fontFamily:"'Bebas Neue',serif", fontSize:"28px", letterSpacing:"3px" }}>
              <span style={{ color:"#FF3B1E" }}>FIX</span><span style={{ color:"white" }}>CAR</span>
            </a>
            <div style={{ display:"flex", gap:"24px", flexWrap:"wrap" }}>
              {[["차 찾기","/cars"],["추천 퀴즈","/quiz"],["초보 가이드","/guide"],["내 차 팔기","/sell"]].map(([l,h])=>(
                <a key={l} href={h} style={{ fontSize:"14px", color:"rgba(255,255,255,0.35)", fontWeight:400 }}>{l}</a>
              ))}
            </div>
            <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.2)", fontWeight:400 }}>© 2025 픽스카 FIXCAR</div>
          </div>
        </footer>
      </div>
    </>
  );
}
