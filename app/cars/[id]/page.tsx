"use client";

import { useState } from "react";

const carData: Record<string, {
  id: number; name: string; brand: string; fullName: string;
  year: string; mileage: string; fuel: string; color: string;
  region: string; price: string; monthly: string; transmission: string;
  owners: string; accident: boolean; efficiency: string;
  displacement: string; power: string; tags: string[]; options: string[];
  emoji: string; bg: string; dealerName: string; dealerRating: string;
  dealerDeals: string; description: string;
}> = {
  "1": {
    id: 1, name: "아반떼 CN7", brand: "현대", fullName: "현대 아반떼 CN7 1.6 가솔린 스마트",
    year: "2021년식", mileage: "32,000km", fuel: "가솔린", color: "흰색", region: "광주 북구",
    price: "1,450", monthly: "29", transmission: "자동변속기", owners: "1명", accident: false,
    efficiency: "15.2", displacement: "1,598cc", power: "123마력",
    tags: ["✓ 무사고", "🔰 초보 추천", "1인 오너", "당일 탁송 가능"],
    options: ["스마트크루즈", "후방카메라", "애플카플레이", "열선시트", "LED 헤드램프"],
    emoji: "🚙", bg: "#F8F5F0",
    dealerName: "광주모터스 박준형", dealerRating: "4.9", dealerDeals: "142",
    description: "출퇴근용으로 딱 좋은 실용적인 세단이에요. 연비가 좋고 작아서 주차도 쉬워요. 처음 차를 사는 분들이 가장 많이 선택하는 인기 모델이에요."
  },
  "2": {
    id: 2, name: "K3", brand: "기아", fullName: "기아 K3 1.6 가솔린 프레스티지",
    year: "2020년식", mileage: "51,000km", fuel: "가솔린", color: "실버", region: "광주 서구",
    price: "1,090", monthly: "22", transmission: "자동변속기", owners: "1명", accident: false,
    efficiency: "13.8", displacement: "1,591cc", power: "128마력",
    tags: ["✓ 무사고", "💰 가성비", "1인 오너"],
    options: ["후방카메라", "스마트키", "열선시트", "LED 주간주행등"],
    emoji: "🚗", bg: "#F0F3F8",
    dealerName: "전남자동차 김민수", dealerRating: "4.7", dealerDeals: "89",
    description: "가격 대비 성능이 뛰어난 가성비 세단이에요. 유지비가 저렴하고 부품 구하기도 쉬워서 관리 걱정이 없어요."
  },
  "3": {
    id: 3, name: "투싼 NX4", brand: "현대", fullName: "현대 투싼 NX4 2.0 가솔린 인스퍼레이션",
    year: "2022년식", mileage: "28,000km", fuel: "가솔린", color: "검정", region: "광주 남구",
    price: "2,780", monthly: "55", transmission: "자동변속기", owners: "1명", accident: false,
    efficiency: "12.4", displacement: "1,999cc", power: "156마력",
    tags: ["✓ 1인 오너", "👨‍👩‍👧 가족용", "넓은 트렁크"],
    options: ["파노라마 선루프", "BOSE 사운드", "원격 스마트 주차보조", "HDA2"],
    emoji: "🚐", bg: "#F3F8F0",
    dealerName: "광주모터스 박준형", dealerRating: "4.9", dealerDeals: "142",
    description: "가족과 함께 쓰기 좋은 넉넉한 SUV예요. 트렁크가 크고 높은 시야로 운전하기 편해요. 캠핑이나 여행에도 딱이에요."
  },
};

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const car = carData[params.id] || carData["1"];
  const [activeTab, setActiveTab] = useState("overview");
  const [liked, setLiked] = useState(false);
  const [months, setMonths] = useState(60);
  const [showModal, setShowModal] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);

  const thumbs = [car.emoji, "🔧", "💺", "🎛️", "🛞"];
  const thumbLabels = ["외관", "엔진룸", "실내", "대시보드", "타이어"];

  const calcMonthly = (m: number) => {
    const price = parseInt(car.price) * 10000;
    const rate = 0.049 / 12;
    const monthly = Math.round(price * rate * Math.pow(1 + rate, m) / (Math.pow(1 + rate, m) - 1));
    return monthly.toLocaleString();
  };

  const efficiencyLevel = parseFloat(car.efficiency) >= 14 ? "매우 좋음" : parseFloat(car.efficiency) >= 12 ? "좋음" : "보통";
  const efficiencyColor = parseFloat(car.efficiency) >= 14 ? "#3A9E62" : parseFloat(car.efficiency) >= 12 ? "#1847FF" : "#E8A020";
  const mileageNum = parseInt(car.mileage.replace(/,/g, ""));
  const mileageLevel = mileageNum <= 30000 ? "아주 적게 탔어요" : mileageNum <= 60000 ? "적당하게 탔어요" : "많이 탔어요";
  const mileagePct = Math.min((mileageNum / 100000) * 100, 100);

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: 'NanumSquareRound', 'Noto Sans KR', sans-serif; background: #F5F4F0; }

        .tab-btn { cursor: pointer; transition: all 0.2s; border: none; font-family: 'NanumSquareRound', sans-serif; }
        .tab-btn:hover { opacity: 0.8; }
        .thumb-item { cursor: pointer; transition: all 0.2s; }
        .thumb-item:hover { border-color: #FF3B1E !important; transform: scale(1.03); }
        .rel-card { transition: all 0.25s; cursor: pointer; text-decoration: none; color: inherit; display: block; }
        .rel-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.1); }
        .info-card { transition: all 0.2s; }
        .info-card:hover { transform: translateY(-2px); }
        .cta-main { transition: all 0.2s; }
        .cta-main:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(255,59,30,0.4) !important; }
        .nav-a { transition: color 0.2s; }
        .nav-a:hover { color: #0C0C0C !important; }

        @media (max-width: 1024px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .panel-sticky { position: static !important; }
          .nav-links { display: none !important; }
          .related-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .main-grid { padding: 0 16px 60px !important; }
          .page-wrap { padding: 0 16px !important; }
          .related-grid { grid-template-columns: 1fr 1fr !important; }
          .stat-row { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'NanumSquareRound', sans-serif", background: "#F5F4F0", minHeight: "100vh" }}>

        {/* 공지 바 */}
        <div style={{ background: "#0C0C0C", color: "white", textAlign: "center", padding: "9px", fontSize: "12px", fontWeight: 700 }}>
          🎯 <span style={{ color: "#FF7A63" }}>PICK</span> 맘에 드는 차를 바로 픽하세요 · <span style={{ color: "#6B8EFF" }}>FIX</span> 정찰제 — 흥정 없음
        </div>

        {/* 네비게이션 */}
        <nav style={{ background: "rgba(250,250,248,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "0 52px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', serif", fontSize: "26px", letterSpacing: "3px", textDecoration: "none" }}>
            <span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "#0C0C0C" }}>CAR</span>
          </a>
          <div className="nav-links" style={{ display: "flex", gap: "32px" }}>
            {[["차 찾기", "/cars"], ["추천 퀴즈", "/quiz"], ["초보 가이드", "/guide"], ["내 차 팔기", "/sell"]].map(([label, href]) => (
              <a key={label} href={href} className="nav-a" style={{ fontSize: "14px", fontWeight: 600, color: "#888", textDecoration: "none" }}>{label}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ background: "transparent", border: "1.5px solid #E8E6E0", padding: "8px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif" }}>로그인</button>
            <button style={{ background: "#FF3B1E", color: "white", border: "none", padding: "9px 20px", borderRadius: "100px", fontSize: "13px", fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif" }}>✨ 내 차 픽하기</button>
          </div>
        </nav>

        {/* 브레드크럼 */}
        <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "14px 52px", display: "flex", gap: "8px", fontSize: "13px", color: "#AAA", fontWeight: 400 }}>
          <a href="/" style={{ color: "#AAA", textDecoration: "none" }}>홈</a> <span>›</span>
          <a href="/cars" style={{ color: "#AAA", textDecoration: "none" }}>차량 목록</a> <span>›</span>
          <span style={{ color: "#0C0C0C", fontWeight: 700 }}>{car.brand} {car.name}</span>
        </div>

        {/* 메인 */}
        <div className="main-grid" style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 52px 80px", display: "grid", gridTemplateColumns: "1fr 400px", gap: "32px", alignItems: "start" }}>

          {/* ── 왼쪽 ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* 갤러리 카드 */}
            <div style={{ background: "white", borderRadius: "24px", overflow: "hidden" }}>
              <div style={{ height: "400px", background: `linear-gradient(135deg, ${car.bg}, #EDE9E0)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "110px", position: "relative" }}>
                {thumbs[activeThumb]}
                <div style={{ position: "absolute", top: "20px", left: "20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ background: "#FF3B1E", color: "white", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 800 }}>✨ PICK 추천</span>
                  <span style={{ background: "#1847FF", color: "white", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 800 }}>🔒 FIX 가격</span>
                  {!car.accident && <span style={{ background: "#3A9E62", color: "white", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 800 }}>✓ 무사고</span>}
                </div>
                <button onClick={() => setLiked(!liked)} style={{ position: "absolute", top: "20px", right: "20px", width: "42px", height: "42px", background: liked ? "#FF3B1E" : "rgba(255,255,255,0.9)", borderRadius: "50%", border: "none", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                  {liked ? "♥" : "♡"}
                </button>
              </div>
              {/* 썸네일 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0", borderTop: "1px solid #F2F1ED" }}>
                {thumbs.map((thumb, i) => (
                  <div key={i} className="thumb-item" onClick={() => setActiveThumb(i)} style={{ padding: "14px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", background: activeThumb === i ? "#FFF1EE" : "white", borderBottom: activeThumb === i ? "3px solid #FF3B1E" : "3px solid transparent", borderRight: i < 4 ? "1px solid #F2F1ED" : "none" }}>
                    <span style={{ fontSize: "24px" }}>{thumb}</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: activeThumb === i ? "#FF3B1E" : "#AAA" }}>{thumbLabels[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 차량 소개 카드 */}
            <div style={{ background: "white", borderRadius: "24px", padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#AAA" }}>{car.brand}자동차 · {car.year}</div>
              </div>
              <h1 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "14px", lineHeight: 1.15 }}>{car.fullName}</h1>

              {/* 태그들 */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                {car.tags.map(tag => (
                  <span key={tag} style={{ background: tag.includes("무사고") || tag.includes("오너") ? "#EEF9F3" : tag.includes("초보") ? "#FFF1EE" : "#F2F1ED", color: tag.includes("무사고") || tag.includes("오너") ? "#3A9E62" : tag.includes("초보") ? "#FF3B1E" : "#555", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, border: `1px solid ${tag.includes("무사고") || tag.includes("오너") ? "#C8E8D4" : tag.includes("초보") ? "#FFCCC4" : "#E8E6E0"}` }}>{tag}</span>
                ))}
              </div>

              {/* 한줄 설명 */}
              <div style={{ background: "#FFF8F0", border: "1px solid #FFE4D4", borderRadius: "14px", padding: "16px 20px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "22px", flexShrink: 0 }}>💡</span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#FF3B1E", marginBottom: "4px" }}>픽스카 한줄 요약</div>
                  <div style={{ fontSize: "14px", color: "#444", lineHeight: 1.7, fontWeight: 400 }}>{car.description}</div>
                </div>
              </div>
            </div>

            {/* 핵심 지표 카드 — 초보자용 시각화 */}
            <div style={{ background: "white", borderRadius: "24px", padding: "28px 32px" }}>
              <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: "24px" }}>이 차, 한눈에 보기 👀</div>

              {/* 4가지 핵심 지표 */}
              <div className="stat-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "14px", marginBottom: "24px" }}>
                {/* 가격 */}
                <div className="info-card" style={{ background: "#FFF1EE", borderRadius: "18px", padding: "20px 16px", textAlign: "center", border: "1.5px solid #FFCCC4" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>💰</div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#FF3B1E", marginBottom: "6px" }}>FIX 가격</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#0C0C0C", letterSpacing: "-0.5px" }}>{car.price}<span style={{ fontSize: "12px", fontWeight: 700, color: "#888" }}>만원</span></div>
                  <div style={{ fontSize: "10px", color: "#FF3B1E", fontWeight: 700, marginTop: "4px" }}>흥정 없는 고정가</div>
                </div>

                {/* 주행거리 */}
                <div className="info-card" style={{ background: "#EEF2FF", borderRadius: "18px", padding: "20px 16px", textAlign: "center", border: "1.5px solid #C4D0FF" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>🛣️</div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#1847FF", marginBottom: "6px" }}>주행거리</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#0C0C0C", letterSpacing: "-0.5px" }}>{car.mileage}</div>
                  <div style={{ fontSize: "10px", color: "#1847FF", fontWeight: 700, marginTop: "4px" }}>{mileageLevel}</div>
                  {/* 게이지 */}
                  <div style={{ height: "4px", background: "#C4D0FF", borderRadius: "2px", marginTop: "8px" }}>
                    <div style={{ height: "4px", background: "#1847FF", borderRadius: "2px", width: `${mileagePct}%`, transition: "width 0.5s" }} />
                  </div>
                </div>

                {/* 연비 */}
                <div className="info-card" style={{ background: "#EEF9F3", borderRadius: "18px", padding: "20px 16px", textAlign: "center", border: "1.5px solid #C8E8D4" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>⛽</div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#3A9E62", marginBottom: "6px" }}>연비</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#0C0C0C", letterSpacing: "-0.5px" }}>{car.efficiency}<span style={{ fontSize: "12px", fontWeight: 700, color: "#888" }}>km/L</span></div>
                  <div style={{ fontSize: "10px", color: efficiencyColor, fontWeight: 700, marginTop: "4px" }}>{efficiencyLevel}</div>
                </div>

                {/* 사고이력 */}
                <div className="info-card" style={{ background: car.accident ? "#FFF8EC" : "#EEF9F3", borderRadius: "18px", padding: "20px 16px", textAlign: "center", border: `1.5px solid ${car.accident ? "#FFD89A" : "#C8E8D4"}` }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{car.accident ? "⚠️" : "✅"}</div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: car.accident ? "#E8A020" : "#3A9E62", marginBottom: "6px" }}>사고이력</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#0C0C0C" }}>{car.accident ? "이력 있음" : "무사고"}</div>
                  <div style={{ fontSize: "10px", color: car.accident ? "#E8A020" : "#3A9E62", fontWeight: 700, marginTop: "4px" }}>{car.accident ? "상세 확인 필요" : "깨끗해요!"}</div>
                </div>
              </div>

              {/* 추가 지표들 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                {[
                  { icon: "👤", label: "이전 소유자", value: `${car.owners}`, sub: car.owners === "1명" ? "처음부터 한 분만 탔어요" : "여러 분이 사용했어요", color: "#F5F4F0" },
                  { icon: "⚙️", label: "변속기", value: car.transmission, sub: "자동이라 운전 쉬워요", color: "#F5F4F0" },
                  { icon: "🏠", label: "위치", value: car.region, sub: "직접 보러 가기 쉬워요", color: "#F5F4F0" },
                ].map((item) => (
                  <div key={item.label} style={{ background: item.color, borderRadius: "14px", padding: "16px" }}>
                    <div style={{ fontSize: "20px", marginBottom: "8px" }}>{item.icon}</div>
                    <div style={{ fontSize: "11px", color: "#AAA", fontWeight: 700, marginBottom: "3px" }}>{item.label}</div>
                    <div style={{ fontSize: "15px", fontWeight: 800 }}>{item.value}</div>
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "2px", fontWeight: 400 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 탭 콘텐츠 카드 */}
            <div style={{ background: "white", borderRadius: "24px", overflow: "hidden" }}>
              {/* 탭 버튼 */}
              <div style={{ display: "flex", borderBottom: "1px solid #F2F1ED" }}>
                {[["overview", "📋 상세정보"], ["history", "📜 이력조회"], ["price", "📊 시세비교"], ["review", "💬 후기"]].map(([key, label]) => (
                  <button key={key} className="tab-btn" onClick={() => setActiveTab(key)} style={{ flex: 1, padding: "16px 8px", fontSize: "13px", fontWeight: activeTab === key ? 800 : 600, color: activeTab === key ? "#FF3B1E" : "#AAA", background: activeTab === key ? "#FFF8F6" : "white", borderBottom: `3px solid ${activeTab === key ? "#FF3B1E" : "transparent"}` }}>{label}</button>
                ))}
              </div>

              <div style={{ padding: "28px 28px" }}>

                {/* 상세정보 탭 */}
                {activeTab === "overview" && (
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 800, marginBottom: "18px" }}>차량 기본 정보</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
                      {[
                        { label: "브랜드", value: car.brand + "자동차", icon: "🏷️" },
                        { label: "연식", value: car.year, icon: "📅" },
                        { label: "주행거리", value: car.mileage, icon: "🛣️" },
                        { label: "연료", value: car.fuel, icon: "⛽" },
                        { label: "변속기", value: car.transmission, icon: "⚙️" },
                        { label: "색상", value: car.color, icon: "🎨" },
                        { label: "연비", value: `${car.efficiency}km/L`, icon: "💹" },
                        { label: "배기량", value: car.displacement, icon: "🔩" },
                        { label: "최대출력", value: car.power, icon: "⚡" },
                        { label: "소유자 수", value: `${car.owners}`, icon: "👤" },
                      ].map((item) => (
                        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "#F5F4F0", borderRadius: "12px" }}>
                          <span style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</span>
                          <div>
                            <div style={{ fontSize: "11px", color: "#AAA", fontWeight: 700, marginBottom: "2px" }}>{item.label}</div>
                            <div style={{ fontSize: "14px", fontWeight: 800 }}>{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 옵션 */}
                    <div style={{ fontSize: "15px", fontWeight: 800, marginBottom: "14px" }}>기본 탑재 옵션 🎁</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "24px" }}>
                      {car.options.map(opt => (
                        <div key={opt} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#EEF9F3", borderRadius: "10px", border: "1px solid #C8E8D4" }}>
                          <span style={{ color: "#3A9E62", fontWeight: 800, fontSize: "14px" }}>✓</span>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#2A7A4A" }}>{opt}</span>
                        </div>
                      ))}
                    </div>

                    {/* 픽스카 검수 */}
                    <div style={{ background: "linear-gradient(135deg, #0C0C0C, #1A1A1A)", borderRadius: "16px", padding: "22px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ width: "48px", height: "48px", background: "#FF3B1E", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>🔍</div>
                        <div>
                          <div style={{ fontSize: "15px", fontWeight: 800, color: "white", marginBottom: "3px" }}>픽스카 100항목 검수 완료</div>
                          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>전문 정비사가 직접 점검 · 2024.01.15 · 검수번호 #FC240115</div>
                        </div>
                        <div style={{ marginLeft: "auto", background: "#FF3B1E", color: "white", padding: "6px 14px", borderRadius: "100px", fontSize: "11px", fontWeight: 800, whiteSpace: "nowrap" }}>✓ 통과</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 이력조회 탭 */}
                {activeTab === "history" && (
                  <div>
                    {/* 핵심 결과 배너 */}
                    <div style={{ background: "#EEF9F3", border: "1.5px solid #C8E8D4", borderRadius: "16px", padding: "20px 22px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "48px", height: "48px", background: "#3A9E62", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>✅</div>
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: 800, color: "#3A9E62", marginBottom: "3px" }}>사고 · 침수 이력 없음</div>
                        <div style={{ fontSize: "12px", color: "#3A9E62", opacity: 0.8, fontWeight: 400 }}>보험개발원 자동차이력 공식 조회 결과 · 2024.01.15 기준</div>
                      </div>
                    </div>

                    {/* 이력 체크 항목 */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
                      {[
                        { label: "교통사고 이력", result: "없음", ok: true, desc: "사고 난 적 없어요" },
                        { label: "침수 이력", result: "없음", ok: true, desc: "물에 잠긴 적 없어요" },
                        { label: "전손 이력", result: "없음", ok: true, desc: "크게 망가진 적 없어요" },
                        { label: "압류·저당", result: "없음", ok: true, desc: "빚 없는 깨끗한 차" },
                        { label: "소유자 수", result: "1인", ok: true, desc: "처음부터 한 분만" },
                        { label: "번호판 변경", result: "없음", ok: true, desc: "그대로예요" },
                      ].map((item) => (
                        <div key={item.label} style={{ background: item.ok ? "#EEF9F3" : "#FFF8EC", border: `1px solid ${item.ok ? "#C8E8D4" : "#FFD89A"}`, borderRadius: "12px", padding: "14px 16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                            <div style={{ fontSize: "13px", fontWeight: 800 }}>{item.label}</div>
                            <span style={{ background: item.ok ? "#3A9E62" : "#E8A020", color: "white", padding: "2px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: 800 }}>{item.result}</span>
                          </div>
                          <div style={{ fontSize: "11px", color: "#888", fontWeight: 400 }}>{item.desc}</div>
                        </div>
                      ))}
                    </div>

                    {/* 정비 타임라인 */}
                    <div style={{ fontSize: "15px", fontWeight: 800, marginBottom: "16px" }}>정비 이력 타임라인</div>
                    {[
                      { dot: "📋", bg: "#EEF2FF", date: "2021.04", title: "신차 출고", desc: "광주 현대자동차 딜러에서 최초 출고됐어요" },
                      { dot: "🔧", bg: "#EEF9F3", date: "2022.04", title: "1만km 정기점검", desc: "엔진오일·필터 교환 완료. 현대 직영 서비스센터" },
                      { dot: "🔧", bg: "#EEF9F3", date: "2023.02", title: "2만km 정기점검", desc: "에어필터·와이퍼 교환, 타이어 로테이션" },
                      { dot: "🏷️", bg: "#FFF1EE", date: "2024.01", title: "픽스카 등록", desc: "100항목 점검 통과 · FIX 정찰가 1,450만원으로 등록" },
                    ].map((item, i, arr) => (
                      <div key={i} style={{ display: "flex", gap: "16px", paddingBottom: i < arr.length - 1 ? "20px" : "0", position: "relative" }}>
                        {i < arr.length - 1 && <div style={{ position: "absolute", left: "16px", top: "36px", bottom: 0, width: "1px", background: "#E8E6E0" }} />}
                        <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0, border: "1.5px solid #E8E6E0" }}>{item.dot}</div>
                        <div style={{ paddingTop: "4px" }}>
                          <div style={{ fontSize: "11px", color: "#AAA", marginBottom: "2px", fontWeight: 400 }}>{item.date}</div>
                          <div style={{ fontSize: "14px", fontWeight: 800, marginBottom: "2px" }}>{item.title}</div>
                          <div style={{ fontSize: "13px", color: "#888", fontWeight: 400, lineHeight: 1.6 }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 시세비교 탭 */}
                {activeTab === "price" && (
                  <div>
                    <div style={{ marginBottom: "24px" }}>
                      <div style={{ fontSize: "13px", color: "#AAA", fontWeight: 400, marginBottom: "6px" }}>이 차의 FIX 정찰가</div>
                      <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: "52px", color: "#FF3B1E", letterSpacing: "1px", lineHeight: 1 }}>{car.price}<span style={{ fontSize: "20px", fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700, color: "#888", marginLeft: "4px" }}>만원</span></div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#1847FF", color: "white", padding: "5px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 800, marginTop: "8px" }}>🔒 고정 가격 · 흥정 없음</div>
                    </div>

                    {/* 시세 게이지 */}
                    <div style={{ background: "#F5F4F0", borderRadius: "16px", padding: "22px", marginBottom: "20px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 800, marginBottom: "16px" }}>📊 동일 모델 시세 분포</div>
                      <div style={{ position: "relative", height: "12px", background: "linear-gradient(90deg, #EEF2FF, #C4D0FF 40%, #FF3B1E 62%, #FFCCC4 100%)", borderRadius: "6px", marginBottom: "8px" }}>
                        <div style={{ position: "absolute", top: "-4px", left: "62%", width: "4px", height: "20px", background: "#FF3B1E", borderRadius: "2px" }}>
                          <div style={{ position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)", background: "#FF3B1E", color: "white", padding: "3px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 800, whiteSpace: "nowrap" }}>이 차 ↓</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#AAA", fontWeight: 400 }}>
                        <span>최저 {Math.round(parseInt(car.price) * 0.83)}만원</span>
                        <span>최고 {Math.round(parseInt(car.price) * 1.24)}만원</span>
                      </div>
                    </div>

                    {/* 비교 카드 3개 */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                      {[
                        { label: "시장 평균가", value: `${Math.round(parseInt(car.price) * 1.07)}만원`, sub: "최근 3개월 기준", color: "#F5F4F0", textColor: "#0C0C0C" },
                        { label: "이 차 FIX가", value: `${car.price}만원`, sub: "고정 정찰가", color: "#FFF1EE", textColor: "#FF3B1E" },
                        { label: "평균 대비", value: "약 7% ↓", sub: "더 저렴해요!", color: "#EEF9F3", textColor: "#3A9E62" },
                      ].map((item) => (
                        <div key={item.label} style={{ background: item.color, borderRadius: "14px", padding: "18px 14px", textAlign: "center" }}>
                          <div style={{ fontSize: "11px", color: "#AAA", marginBottom: "8px", fontWeight: 700 }}>{item.label}</div>
                          <div style={{ fontSize: "18px", fontWeight: 800, color: item.textColor }}>{item.value}</div>
                          <div style={{ fontSize: "10px", color: "#AAA", marginTop: "4px", fontWeight: 400 }}>{item.sub}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: "14px 16px", background: "#F5F4F0", borderRadius: "10px", fontSize: "12px", color: "#888", fontWeight: 400, lineHeight: 1.6 }}>
                      ※ 시세는 보험개발원·국토부 실거래 데이터 기반 추정치예요. 차량 옵션·상태에 따라 다를 수 있어요.
                    </div>
                  </div>
                )}

                {/* 후기 탭 */}
                {activeTab === "review" && (
                  <div>
                    {/* 평점 */}
                    <div style={{ display: "flex", gap: "24px", alignItems: "center", background: "#F5F4F0", borderRadius: "16px", padding: "20px 22px", marginBottom: "24px" }}>
                      <div style={{ textAlign: "center", flexShrink: 0 }}>
                        <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: "60px", color: "#FF3B1E", lineHeight: 1 }}>4.9</div>
                        <div style={{ fontSize: "20px", marginTop: "4px" }}>⭐⭐⭐⭐⭐</div>
                        <div style={{ fontSize: "12px", color: "#AAA", marginTop: "4px", fontWeight: 400 }}>23개 후기</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        {[["FIX 가격 만족도", "96%"], ["차량 상태", "98%"], ["상담 경험", "100%"], ["전체 만족도", "96%"]].map(([label, pct]) => (
                          <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                            <span style={{ fontSize: "12px", color: "#888", width: "90px", fontWeight: 600 }}>{label}</span>
                            <div style={{ flex: 1, height: "6px", background: "#E8E6E0", borderRadius: "3px", overflow: "hidden" }}>
                              <div style={{ width: pct, height: "100%", background: "#FF3B1E", borderRadius: "3px" }} />
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: 800, color: "#FF3B1E", width: "32px" }}>{pct}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 후기 카드들 */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {[
                        { initial: "김", name: "김지원 (24세)", desc: "2023.12 구매 · 초보 운전자", text: "면허 딴 지 3개월인데 퀴즈 풀었더니 딱 제 예산에 맞는 차 3개를 추천해줬어요. FIX 가격이라 흥정 없이 바로 계약! 담당자분이 모르는 것도 다 설명해줬어요 🙏", tag: "PICK", stars: 5 },
                        { initial: "박", name: "박민서 (27세)", desc: "2023.11 구매 · 직장인", text: "엔카 몇 번 갔다가 전화 폭탄이랑 흥정에 지쳤는데 픽스카는 표시 가격이 최종 가격이라 너무 편했어요. 탁송도 다음날 바로 와서 신기했어요!", tag: "FIX", stars: 5 },
                        { initial: "이", name: "이수연 (31세)", desc: "2023.10 구매 · 엄마 선물용", text: "차 하나도 모르는 제가 봐도 설명이 너무 친절해요. 이력 조회도 투명하게 보여주고, 초보 추천 필터가 진짜 도움됐어요!", tag: "PICK", stars: 5 },
                      ].map((r) => (
                        <div key={r.name} style={{ background: "white", border: "1.5px solid #E8E6E0", borderRadius: "16px", padding: "20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                            <div style={{ width: "38px", height: "38px", background: r.tag === "PICK" ? "#FFF1EE" : "#EEF2FF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 800, color: r.tag === "PICK" ? "#FF3B1E" : "#1847FF" }}>{r.initial}</div>
                            <div>
                              <div style={{ fontSize: "14px", fontWeight: 800 }}>{r.name}</div>
                              <div style={{ fontSize: "11px", color: "#AAA", fontWeight: 400 }}>{r.desc} · {"⭐".repeat(r.stars)}</div>
                            </div>
                            <span style={{ marginLeft: "auto", background: r.tag === "PICK" ? "#FFF1EE" : "#EEF2FF", color: r.tag === "PICK" ? "#FF3B1E" : "#1847FF", padding: "4px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 800 }}>{r.tag}</span>
                          </div>
                          <p style={{ fontSize: "14px", lineHeight: 1.75, color: "#444", fontWeight: 400 }}>{r.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── 오른쪽 구매 패널 ── */}
          <div className="panel-sticky" style={{ position: "sticky", top: "84px", display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* 가격 카드 */}
            <div style={{ background: "#0C0C0C", borderRadius: "24px", overflow: "hidden" }}>
              <div style={{ padding: "24px 26px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: "-10px", bottom: "-10px", fontFamily: "'Bebas Neue', serif", fontSize: "90px", color: "rgba(255,255,255,0.04)", lineHeight: 1, letterSpacing: "2px" }}>PICK</div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "rgba(255,255,255,0.6)", marginBottom: "2px" }}>{car.brand} {car.name}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "18px", fontWeight: 400 }}>{car.year} · {car.mileage} · {car.owners}</div>
                <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: "56px", color: "white", letterSpacing: "1px", lineHeight: 1 }}>
                  {car.price}<span style={{ fontSize: "18px", fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700, color: "rgba(255,255,255,0.4)", marginLeft: "4px" }}>만원</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#1847FF", color: "white", padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.5px", marginTop: "10px" }}>🔒 FIX PRICE · 흥정없음</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "5px", fontWeight: 400 }}>표시 가격 = 최종 가격 · 숨은 비용 없음</div>
              </div>
            </div>

            {/* 할부 계산기 */}
            <div style={{ background: "white", borderRadius: "20px", padding: "22px 24px" }}>
              <div style={{ fontSize: "14px", fontWeight: 800, marginBottom: "14px" }}>🧮 월 얼마씩 낼 수 있을까요?</div>
              <div style={{ background: "#EEF2FF", borderRadius: "14px", padding: "16px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "12px", color: "#1847FF", fontWeight: 700, marginBottom: "6px" }}>월 납입금</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}>
                  <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: "38px", color: "#1847FF", letterSpacing: "0.5px", lineHeight: 1 }}>{calcMonthly(months)}</div>
                  <div style={{ fontSize: "13px", color: "#888", marginBottom: "4px", fontWeight: 400 }}>원 / 월</div>
                </div>
                <div style={{ fontSize: "11px", color: "#888", marginTop: "4px", fontWeight: 400 }}>{months}개월 할부 · 연이율 4.9% · 선수금 없음 기준</div>
              </div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#AAA", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>할부 기간 선택</span><span style={{ color: "#1847FF", fontWeight: 800 }}>{months}개월</span>
              </div>
              <input type="range" min="12" max="84" step="12" value={months} onChange={(e) => setMonths(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#1847FF", height: "3px", marginBottom: "6px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#CCC", fontWeight: 400 }}>
                <span>12개월</span><span>36개월</span><span>60개월</span><span>84개월</span>
              </div>
            </div>

            {/* 보증 4가지 */}
            <div style={{ background: "white", borderRadius: "20px", padding: "18px 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[
                  { icon: "🔒", title: "FIX 정찰가", sub: "흥정 없음" },
                  { icon: "✅", title: "100항목 검수", sub: "전문가 직접" },
                  { icon: "🔄", title: "3일 환불", sub: "이유 불문" },
                  { icon: "🚚", title: "집 앞 탁송", sub: "직접 안 와도 돼요" },
                ].map((g) => (
                  <div key={g.title} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: "#F5F4F0", borderRadius: "10px" }}>
                    <span style={{ fontSize: "18px" }}>{g.icon}</span>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 800 }}>{g.title}</div>
                      <div style={{ fontSize: "10px", color: "#AAA", fontWeight: 400 }}>{g.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA 버튼들 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button className="cta-main" style={{ width: "100%", background: "#FF3B1E", color: "white", border: "none", padding: "18px", borderRadius: "16px", fontSize: "16px", fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif", boxShadow: "0 8px 24px rgba(255,59,30,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                🎯 이 차로 픽했어! 계약하기
              </button>
              <button onClick={() => setShowModal(true)} style={{ width: "100%", background: "white", color: "#0C0C0C", border: "1.5px solid #E8E6E0", padding: "14px", borderRadius: "14px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif", transition: "all 0.2s" }}>
                💬 궁금한 거 물어보기
              </button>
              <button style={{ width: "100%", background: "#FEE500", color: "#3B1D1D", border: "none", padding: "13px", borderRadius: "14px", fontSize: "14px", fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif" }}>
                💛 카카오로 상담하기
              </button>
            </div>

            {/* 딜러 */}
            <div style={{ background: "white", borderRadius: "20px", padding: "18px 20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#AAA", marginBottom: "12px" }}>등록 딜러</div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ width: "42px", height: "42px", background: "#EEF2FF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 800, color: "#1847FF" }}>딜</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800 }}>{car.dealerName} 딜러</div>
                  <span style={{ background: "#EEF2FF", color: "#1847FF", padding: "2px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: 800 }}>🏅 픽스카 인증</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                {[[`${car.dealerRating}★`, "평점"], [`${car.dealerDeals}건`, "거래"], ["3년+", "활동"]].map(([val, label]) => (
                  <div key={label} style={{ textAlign: "center", padding: "8px", background: "#F5F4F0", borderRadius: "8px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 800 }}>{val}</div>
                    <div style={{ fontSize: "10px", color: "#AAA", fontWeight: 400 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 연관 차량 */}
        <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 52px 80px" }}>
          <h2 style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "8px" }}>비슷한 차도 픽해봐요 🚗</h2>
          <p style={{ fontSize: "14px", color: "#888", marginBottom: "22px", fontWeight: 400 }}>같은 예산대 · 초보 추천 매물</p>
          <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
            {[
              { name: "기아 K3", year: "2020 · 51,000km · 가솔린", price: "1,090", bg: "#F0F3F8", emoji: "🚗", tag: "💰 가성비" },
              { name: "현대 쏘나타 DN8", year: "2021 · 41,000km · 가솔린", price: "2,100", bg: "#F8F5F0", emoji: "🚙", tag: "🔰 초보 추천" },
              { name: "기아 K5 DL3", year: "2020 · 55,000km · 가솔린", price: "1,780", bg: "#F3F8F0", emoji: "🚗", tag: "✓ 무사고" },
              { name: "현대 엑센트", year: "2019 · 68,000km · 가솔린", price: "680", bg: "#F8F8F0", emoji: "🚕", tag: "💰 초저가" },
            ].map((rel) => (
              <a key={rel.name} href="/cars/1" className="rel-card" style={{ background: "white", border: "1.5px solid #E8E6E0", borderRadius: "18px", overflow: "hidden" }}>
                <div style={{ height: "120px", background: `linear-gradient(135deg, ${rel.bg}, #EDE9E0)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "44px", position: "relative" }}>
                  {rel.emoji}
                  <span style={{ position: "absolute", top: "10px", left: "10px", background: "#FF3B1E", color: "white", padding: "3px 8px", borderRadius: "100px", fontSize: "9px", fontWeight: 800 }}>{rel.tag}</span>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 800, marginBottom: "3px" }}>{rel.name}</div>
                  <div style={{ fontSize: "11px", color: "#AAA", marginBottom: "10px", fontWeight: 400 }}>{rel.year}</div>
                  <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: "22px" }}>{rel.price}<span style={{ fontSize: "12px", fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700, color: "#888" }}>만원</span></div>
                  <div style={{ fontSize: "10px", color: "#1847FF", fontWeight: 800, marginTop: "2px" }}>🔒 FIX PRICE</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 문의 모달 */}
        {showModal && (
          <div onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ background: "white", borderRadius: "24px", width: "100%", maxWidth: "460px", padding: "36px", position: "relative" }}>
              <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: "16px", right: "16px", width: "32px", height: "32px", border: "none", background: "#F5F4F0", borderRadius: "50%", cursor: "pointer", fontSize: "14px" }}>✕</button>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>💬</div>
              <h3 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "6px" }}>궁금한 거 물어봐요</h3>
              <p style={{ fontSize: "13px", color: "#888", marginBottom: "24px", fontWeight: 400, lineHeight: 1.6 }}>어떤 질문이든 환영해요. 판매 압박 없이 솔직하게 답해드려요. 당일 답변 드릴게요!</p>
              {[["이름", "text", "홍길동"], ["연락처", "tel", "010-0000-0000"]].map(([label, type, ph]) => (
                <div key={label} style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 800, marginBottom: "6px", display: "block" }}>{label}</label>
                  <input type={type} placeholder={ph} style={{ width: "100%", border: "1.5px solid #E8E6E0", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", fontFamily: "'NanumSquareRound', sans-serif", outline: "none" }} />
                </div>
              ))}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ fontSize: "13px", fontWeight: 800, marginBottom: "6px", display: "block" }}>문의 내용</label>
                <textarea placeholder="예: 직접 시승 가능한가요? / 사진 더 볼 수 있나요? / 할부 조건이 어떻게 되나요?" style={{ width: "100%", border: "1.5px solid #E8E6E0", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", fontFamily: "'NanumSquareRound', sans-serif", outline: "none", resize: "vertical", minHeight: "90px" }} />
              </div>
              <button style={{ width: "100%", background: "#FF3B1E", color: "white", border: "none", padding: "15px", borderRadius: "12px", fontSize: "15px", fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif" }}>문의 보내기 →</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
