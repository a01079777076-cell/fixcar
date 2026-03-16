"use client";

import { useState } from "react";

const carData: Record<string, {
  id: number; name: string; brand: string; year: string; mileage: string;
  fuel: string; color: string; region: string; price: string; monthly: string;
  transmission: string; owners: string; accident: boolean; efficiency: string;
  displacement: string; power: string; tags: string[]; options: string[];
  emoji: string; bg: string; dealerName: string; dealerRating: string; dealerDeals: string;
}> = {
  "1": { id: 1, name: "아반떼 CN7 1.6 가솔린 스마트", brand: "현대", year: "2021년식", mileage: "32,000km", fuel: "가솔린 1.6 MPI", color: "어반화이트 (흰색)", region: "광주 북구", price: "1,450", monthly: "29", transmission: "6단 자동 (IVT)", owners: "1인 (첫 차주)", accident: false, efficiency: "15.2km/L", displacement: "1,598cc", power: "123마력", tags: ["✓ 무사고", "🔰 초보 추천", "연비 15.2km/L", "1인 오너", "당일 탁송 가능"], options: ["스마트크루즈", "후방카메라", "애플카플레이", "열선시트", "LED 헤드램프"], emoji: "🚙", bg: "#F8F5F0", dealerName: "광주모터스 박준형", dealerRating: "4.9", dealerDeals: "142" },
  "2": { id: 2, name: "K3 1.6 가솔린 프레스티지", brand: "기아", year: "2020년식", mileage: "51,000km", fuel: "가솔린 1.6 GDi", color: "실버", region: "광주 서구", price: "1,090", monthly: "22", transmission: "7단 DCT", owners: "1인", accident: false, efficiency: "13.8km/L", displacement: "1,591cc", power: "128마력", tags: ["✓ 무사고", "💰 가성비", "1인 오너"], options: ["후방카메라", "스마트키", "열선시트", "LED 주간주행등"], emoji: "🚗", bg: "#F0F3F8", dealerName: "전남자동차 김민수", dealerRating: "4.7", dealerDeals: "89" },
  "3": { id: 3, name: "투싼 NX4 2.0 가솔린 인스퍼레이션", brand: "현대", year: "2022년식", mileage: "28,000km", fuel: "가솔린 2.0 MPi", color: "나이트스카이 블랙", region: "광주 남구", price: "2,780", monthly: "55", transmission: "6단 자동", owners: "1인 (첫 차주)", accident: false, efficiency: "12.4km/L", displacement: "1,999cc", power: "156마력", tags: ["✓ 1인 오너", "👨‍👩‍👧 가족용", "넓은 트렁크"], options: ["파노라마 선루프", "BOSE 사운드", "원격 스마트 주차보조", "HDA2"], emoji: "🚐", bg: "#F3F8F0", dealerName: "광주모터스 박준형", dealerRating: "4.9", dealerDeals: "142" },
};

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const car = carData[params.id] || carData["1"];
  const [activeTab, setActiveTab] = useState("spec");
  const [liked, setLiked] = useState(false);
  const [months, setMonths] = useState(60);
  const [showModal, setShowModal] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);

  const thumbs = [car.emoji, "🔧", "💺", "🎛️", "🛞"];

  const calcMonthly = (m: number) => {
    const price = parseInt(car.price) * 10000;
    const rate = 0.049 / 12;
    const monthly = Math.round(price * rate * Math.pow(1 + rate, m) / (Math.pow(1 + rate, m) - 1));
    return monthly.toLocaleString();
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: 'NanumSquareRound', 'Noto Sans KR', sans-serif; background: #FAFAF8; }
        .tab { cursor: pointer; transition: all 0.15s; }
        .tab:hover { color: #0C0C0C !important; }
        .rel-card { transition: all 0.25s; cursor: pointer; text-decoration: none; color: inherit; display: block; }
        .rel-card:hover { box-shadow: 0 12px 36px rgba(0,0,0,0.08); transform: translateY(-3px); }
        .thumb { cursor: pointer; transition: all 0.2s; }
        .thumb:hover { border-color: #FF3B1E !important; }
        .nav-link:hover { color: #0C0C0C !important; }
        @media (max-width: 1024px) {
          .detail-grid { grid-template-columns: 1fr !important; }
          .related-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-links { display: none !important; }
        }
        @media (max-width: 600px) {
          .related-grid { grid-template-columns: 1fr 1fr !important; }
          .guarantee-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'NanumSquareRound', 'Noto Sans KR', sans-serif", background: "#FAFAF8", minHeight: "100vh" }}>

        {/* 공지 바 */}
        <div style={{ background: "#0C0C0C", color: "white", textAlign: "center", padding: "10px", fontSize: "12px", fontWeight: 700 }}>
          🎯 <span style={{ color: "#FF7A63" }}>PICK</span> 맘에 드는 차를 바로 픽하세요&nbsp;·&nbsp;
          <span style={{ color: "#6B8EFF" }}>FIX</span> 정찰제 — 흥정 스트레스 없음
        </div>

        {/* 네비게이션 */}
        <nav style={{ background: "rgba(250,250,248,0.94)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "0 52px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', serif", fontSize: "26px", letterSpacing: "3px", textDecoration: "none" }}>
            <span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "#0C0C0C" }}>CAR</span>
          </a>
          <div className="nav-links" style={{ display: "flex", gap: "32px" }}>
            {[["차 찾기", "/cars"], ["추천 퀴즈", "/quiz"], ["초보 가이드", "/guide"], ["내 차 팔기", "/sell"]].map(([label, href]) => (
              <a key={label} href={href} className="nav-link" style={{ fontSize: "14px", fontWeight: 600, color: "#888", textDecoration: "none" }}>{label}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ background: "transparent", border: "1.5px solid #E8E6E0", padding: "8px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif" }}>로그인</button>
            <button style={{ background: "#FF3B1E", color: "white", border: "none", padding: "9px 20px", borderRadius: "100px", fontSize: "13px", fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif" }}>✨ 내 차 픽하기</button>
          </div>
        </nav>

        {/* 브레드크럼 */}
        <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "14px 52px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#888" }}>
          <a href="/" style={{ color: "#888", textDecoration: "none" }}>홈</a>
          <span>›</span>
          <a href="/cars" style={{ color: "#888", textDecoration: "none" }}>차량 목록</a>
          <span>›</span>
          <span style={{ color: "#0C0C0C", fontWeight: 700 }}>{car.brand} {car.name}</span>
        </div>

        {/* 메인 레이아웃 */}
        <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 52px 80px" }}>
          <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "48px", alignItems: "start" }}>

            {/* 왼쪽 */}
            <div>
              {/* 갤러리 */}
              <div style={{ borderRadius: "24px", overflow: "hidden", background: `linear-gradient(135deg, ${car.bg}, #EDE9E0)`, height: "420px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "100px", position: "relative", marginBottom: "12px" }}>
                {thumbs[activeThumb]}
                <div style={{ position: "absolute", top: "20px", left: "20px", display: "flex", gap: "8px" }}>
                  <span style={{ background: "#FF3B1E", color: "white", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 800 }}>✨ PICK 추천</span>
                  <span style={{ background: "#1847FF", color: "white", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 800 }}>🔒 FIX 가격</span>
                  {!car.accident && <span style={{ background: "#3A9E62", color: "white", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 800 }}>✓ 무사고</span>}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", marginBottom: "32px" }}>
                {thumbs.map((thumb, i) => (
                  <div key={i} className="thumb" onClick={() => setActiveThumb(i)} style={{ borderRadius: "12px", background: `linear-gradient(135deg, ${car.bg}, #EDE9E0)`, height: "76px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", border: `2px solid ${activeThumb === i ? "#FF3B1E" : "transparent"}` }}>
                    {thumb}
                  </div>
                ))}
              </div>

              {/* 차량 타이틀 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#888" }}>{car.brand}자동차</div>
                <button onClick={() => setLiked(!liked)} style={{ display: "flex", alignItems: "center", gap: "6px", background: liked ? "#FF3B1E" : "white", color: liked ? "white" : "#0C0C0C", border: `1.5px solid ${liked ? "#FF3B1E" : "#E8E6E0"}`, padding: "8px 16px", borderRadius: "100px", cursor: "pointer", fontSize: "13px", fontWeight: 700, fontFamily: "'NanumSquareRound', sans-serif", transition: "all 0.2s" }}>
                  {liked ? "♥ 찜 완료" : "♡ 찜하기"}
                </button>
              </div>
              <h1 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "10px", lineHeight: 1.2 }}>{car.brand} {car.name}</h1>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", fontSize: "13px", color: "#888", marginBottom: "16px", fontWeight: 400 }}>
                <span>📅 {car.year}</span>
                <span>💨 {car.mileage}</span>
                <span>⛽ {car.fuel.split(" ")[0]}</span>
                <span>🎨 {car.color}</span>
                <span>📍 {car.region}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
                {car.tags.map(tag => (
                  <span key={tag} style={{ background: tag.includes("무사고") || tag.includes("오너") ? "#EEF9F3" : "#F2F1ED", border: `1px solid ${tag.includes("무사고") || tag.includes("오너") ? "#C8E8D4" : "#E8E6E0"}`, padding: "5px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, color: tag.includes("무사고") || tag.includes("오너") ? "#3A9E62" : "#555" }}>{tag}</span>
                ))}
              </div>

              {/* 탭 */}
              <div style={{ display: "flex", borderBottom: "2px solid #E8E6E0", marginBottom: "28px" }}>
                {[["spec", "차량 스펙"], ["history", "이력 조회"], ["price", "시세 비교"], ["review", "구매 후기"]].map(([key, label]) => (
                  <div key={key} className="tab" onClick={() => setActiveTab(key)} style={{ padding: "13px 22px", fontSize: "14px", fontWeight: activeTab === key ? 800 : 600, color: activeTab === key ? "#FF3B1E" : "#888", borderBottom: `2px solid ${activeTab === key ? "#FF3B1E" : "transparent"}`, marginBottom: "-2px" }}>{label}</div>
                ))}
              </div>

              {/* 스펙 탭 */}
              {activeTab === "spec" && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {[
                      ["연식", car.year],
                      ["주행거리", `${car.mileage} ✓ 정상`],
                      ["연료", car.fuel],
                      ["변속기", car.transmission],
                      ["색상", car.color],
                      ["연비", car.efficiency],
                      ["배기량", car.displacement],
                      ["최대출력", car.power],
                      ["소유자 수", car.owners],
                      ["사고이력", car.accident ? "사고이력 있음" : "✓ 무사고"],
                      ["압류·저당", "없음 ✓ 클리어"],
                      ["주요 옵션", car.options.join(", ")],
                      ["픽스카 검수", "✓ 100항목 완료 · 2024.01.15"],
                    ].map(([key, val]) => (
                      <tr key={key} style={{ borderBottom: "1px solid #E8E6E0" }}>
                        <td style={{ padding: "13px 0", fontSize: "14px", color: "#888", fontWeight: 600, width: "140px" }}>{key}</td>
                        <td style={{ padding: "13px 0", fontSize: "14px", color: "#0C0C0C", fontWeight: 500 }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* 이력 탭 */}
              {activeTab === "history" && (
                <div>
                  <div style={{ background: "#EEF9F3", border: "1px solid rgba(58,158,98,0.2)", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                    <span style={{ fontSize: "24px" }}>✅</span>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#3A9E62" }}>사고·침수 이력 없음</div>
                      <div style={{ fontSize: "12px", color: "#3A9E62", opacity: 0.8, fontWeight: 400 }}>보험개발원 자동차이력 조회 결과 · 2024.01.15 기준</div>
                    </div>
                  </div>
                  {[
                    { dot: "📋", color: "#EEF2FF", date: "2021.04", title: "신차 출고", desc: "광주 현대자동차 딜러에서 최초 출고" },
                    { dot: "🔧", color: "#EEF9F3", date: "2022.04 (1만km)", title: "1차 정기점검", desc: "엔진오일·필터 교환 / 현대 직영 서비스센터" },
                    { dot: "🔧", color: "#EEF9F3", date: "2023.02 (2.1만km)", title: "2차 정기점검", desc: "에어필터·와이퍼 교환, 타이어 로테이션" },
                    { dot: "🏷️", color: "#EEF2FF", date: "2024.01", title: "픽스카 등록", desc: "100항목 점검 완료 · FIX 가격 등록" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "16px", paddingBottom: "24px", position: "relative" }}>
                      {i < 3 && <div style={{ position: "absolute", left: "15px", top: "34px", bottom: 0, width: "1px", background: "#E8E6E0" }} />}
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0, border: "2px solid #E8E6E0" }}>{item.dot}</div>
                      <div>
                        <div style={{ fontSize: "12px", color: "#AAA", marginBottom: "3px", fontWeight: 400 }}>{item.date}</div>
                        <div style={{ fontSize: "14px", fontWeight: 800, marginBottom: "2px" }}>{item.title}</div>
                        <div style={{ fontSize: "13px", color: "#888", fontWeight: 400 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 시세 탭 */}
              {activeTab === "price" && (
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "6px" }}>이 차 FIX 가격</div>
                    <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: "48px", color: "#FF3B1E", letterSpacing: "1px" }}>{car.price}<span style={{ fontSize: "20px", fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700, color: "#888", marginLeft: "4px" }}>만원</span></div>
                  </div>
                  <div style={{ background: "#F2F1ED", borderRadius: "16px", padding: "24px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 800, marginBottom: "16px" }}>📊 동일 모델 시세 비교 (최근 3개월)</div>
                    <div style={{ height: "8px", background: "#E8E6E0", borderRadius: "100px", overflow: "visible", position: "relative", marginBottom: "8px" }}>
                      <div style={{ height: "8px", background: "linear-gradient(90deg, #1847FF, #FF3B1E)", borderRadius: "100px", width: "100%" }} />
                      <div style={{ position: "absolute", top: "-4px", left: "62%", width: "2px", height: "16px", background: "#FF3B1E", borderRadius: "1px" }}>
                        <div style={{ position: "absolute", top: "-18px", left: "50%", transform: "translateX(-50%)", fontSize: "10px", fontWeight: 800, color: "#FF3B1E", whiteSpace: "nowrap" }}>이 차</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#AAA", marginBottom: "20px", fontWeight: 400 }}>
                      <span>최저 {Math.round(parseInt(car.price) * 0.83)}만원</span>
                      <span>최고 {Math.round(parseInt(car.price) * 1.24)}만원</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                      {[["시장 평균가", `${Math.round(parseInt(car.price) * 1.07)}만원`, "#0C0C0C"], ["이 차 FIX가", `${car.price}만원`, "#FF3B1E"], ["평균 대비", "약 7% 저렴", "#3A9E62"]].map(([label, val, color]) => (
                        <div key={label} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "11px", color: "#AAA", marginBottom: "4px", fontWeight: 400 }}>{label}</div>
                          <div style={{ fontSize: "16px", fontWeight: 800, color }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 후기 탭 */}
              {activeTab === "review" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px", padding: "20px", background: "#F2F1ED", borderRadius: "14px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: "56px", color: "#FF3B1E", lineHeight: 1 }}>4.9</div>
                      <div style={{ fontSize: "18px", marginTop: "4px" }}>⭐⭐⭐⭐⭐</div>
                      <div style={{ fontSize: "12px", color: "#AAA", marginTop: "4px", fontWeight: 400 }}>23개 후기</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      {[["픽스 가격", "96%"], ["차량 상태", "98%"], ["상담 경험", "100%"]].map(([label, pct]) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "13px" }}>
                          <span style={{ color: "#888", width: "70px", fontWeight: 400 }}>{label}</span>
                          <div style={{ flex: 1, height: "6px", background: "#E8E6E0", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: pct, height: "100%", background: "#FF3B1E", borderRadius: "3px" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {[
                    { initial: "김", name: "김지원 (24세)", desc: "2023.12 구매 · ⭐⭐⭐⭐⭐", text: "차 처음 사는데 진짜 편했어요. FIX 가격이라서 협상 스트레스가 전혀 없었고, 담당자분이 처음부터 끝까지 다 알려주셔서 너무 좋았어요!", tag: "PICK 구매" },
                    { initial: "박", name: "박민서 (27세)", desc: "2023.11 구매 · ⭐⭐⭐⭐⭐", text: "엔카 몇 번 가봤는데 전화 오고 흥정하고 진짜 피곤했는데 픽스카는 표시된 가격이 그냥 끝이라서 너무 편했어요.", tag: "FIX 구매" },
                  ].map((r) => (
                    <div key={r.name} style={{ padding: "20px", background: "white", border: "1.5px solid #E8E6E0", borderRadius: "16px", marginBottom: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                        <div style={{ width: "36px", height: "36px", background: "#FFF1EE", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: "#FF3B1E" }}>{r.initial}</div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 800 }}>{r.name}</div>
                          <div style={{ fontSize: "11px", color: "#AAA", fontWeight: 400 }}>{r.desc}</div>
                        </div>
                        <span style={{ marginLeft: "auto", background: "#FFF1EE", color: "#FF3B1E", padding: "3px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: 800 }}>{r.tag}</span>
                      </div>
                      <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#444", fontWeight: 400 }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 오른쪽 - 구매 패널 */}
            <div style={{ position: "sticky", top: "84px" }}>
              <div style={{ background: "white", border: "1.5px solid #E8E6E0", borderRadius: "24px", overflow: "hidden" }}>
                {/* 상단 */}
                <div style={{ background: "#0C0C0C", padding: "24px 28px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", right: "-10px", bottom: "-10px", fontFamily: "'Bebas Neue', serif", fontSize: "80px", color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>PICK</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "white", marginBottom: "3px" }}>{car.brand} {car.name}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "20px", fontWeight: 400 }}>{car.year} · {car.mileage} · {car.owners}</div>
                  <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: "52px", color: "white", letterSpacing: "1px", lineHeight: 1 }}>{car.price}<span style={{ fontSize: "18px", fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700, color: "rgba(255,255,255,0.4)", marginLeft: "4px" }}>만원</span></div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#1847FF", color: "white", padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 800, letterSpacing: "1px", marginTop: "10px" }}>🔒 FIX PRICE</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "4px", fontWeight: 400 }}>표시 가격 = 최종 가격 · 추가 비용 없음</div>
                </div>

                {/* 바디 */}
                <div style={{ padding: "24px 28px" }}>
                  {/* 할부 계산기 */}
                  <div style={{ background: "#EEF2FF", border: "1px solid rgba(24,71,255,0.15)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
                    <div style={{ fontSize: "12px", color: "#1847FF", fontWeight: 800, marginBottom: "10px" }}>🧮 할부 계산기</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "8px" }}>
                      <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: "32px", color: "#1847FF", letterSpacing: "0.5px" }}>{calcMonthly(months)}</div>
                      <div style={{ fontSize: "13px", color: "#888", fontWeight: 400 }}>원 / 월</div>
                    </div>
                    <div style={{ fontSize: "11px", color: "#888", marginBottom: "10px", fontWeight: 400 }}>{months}개월 할부 · 연이율 4.9% 기준</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#888", marginBottom: "6px", fontWeight: 400 }}>
                      <span>할부 기간</span><span style={{ fontWeight: 800, color: "#1847FF" }}>{months}개월</span>
                    </div>
                    <input type="range" min="12" max="84" step="12" value={months} onChange={(e) => setMonths(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#1847FF", height: "3px" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#CCC", marginTop: "4px", fontWeight: 400 }}>
                      <span>12개월</span><span>36개월</span><span>60개월</span><span>84개월</span>
                    </div>
                  </div>

                  {/* 보증 */}
                  <div className="guarantee-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "18px" }}>
                    {[["🔒", "FIX 정찰가", "흥정 없음"], ["✅", "100항목", "직접 검수"], ["🔄", "3일 이내", "환불 보장"], ["🚚", "집 앞", "탁송 서비스"]].map(([icon, title, sub]) => (
                      <div key={title} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: "#F2F1ED", borderRadius: "10px" }}>
                        <span style={{ fontSize: "18px" }}>{icon}</span>
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: 800 }}>{title}</div>
                          <div style={{ fontSize: "10px", color: "#888", fontWeight: 400 }}>{sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA 버튼 */}
                  <button style={{ width: "100%", background: "#FF3B1E", color: "white", border: "none", padding: "17px", borderRadius: "14px", fontSize: "15px", fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif", marginBottom: "10px", boxShadow: "0 8px 24px rgba(255,59,30,0.3)" }}>
                    🎯 이 차로 픽했어! 계약금 결제
                  </button>
                  <button onClick={() => setShowModal(true)} style={{ width: "100%", background: "white", color: "#0C0C0C", border: "1.5px solid #E8E6E0", padding: "13px", borderRadius: "14px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif", marginBottom: "10px" }}>
                    💬 궁금한 거 물어보기
                  </button>
                  <button style={{ width: "100%", background: "#FEE500", color: "#3B1D1D", border: "none", padding: "12px", borderRadius: "14px", fontSize: "14px", fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif" }}>
                    💛 카카오로 상담하기
                  </button>

                  {/* 딜러 정보 */}
                  <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #E8E6E0" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#AAA", marginBottom: "12px" }}>등록 딜러</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "42px", height: "42px", background: "#EEF2FF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 800, color: "#1847FF" }}>딜</div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 800 }}>{car.dealerName} 딜러</div>
                        <span style={{ background: "#EEF2FF", color: "#1847FF", padding: "2px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: 800 }}>🏅 픽스카 인증</span>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "12px" }}>
                      {[[`${car.dealerRating}★`, "평점"], [`${car.dealerDeals}건`, "거래"], ["3년", "활동"]].map(([val, label]) => (
                        <div key={label} style={{ textAlign: "center", padding: "10px", background: "#F2F1ED", borderRadius: "8px" }}>
                          <div style={{ fontSize: "15px", fontWeight: 800 }}>{val}</div>
                          <div style={{ fontSize: "10px", color: "#AAA", marginTop: "1px", fontWeight: 400 }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 연관 차량 */}
          <div style={{ marginTop: "60px" }}>
            <h2 style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "8px" }}>비슷한 차도 픽해봐요</h2>
            <p style={{ fontSize: "14px", color: "#888", marginBottom: "24px", fontWeight: 400 }}>같은 예산대 · 초보 추천 매물</p>
            <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {[
                { name: "기아 K3", year: "2020 · 51,000km", price: "1,090", bg: "#F0F3F8", emoji: "🚗" },
                { name: "현대 쏘나타 DN8", year: "2021 · 41,000km", price: "2,100", bg: "#F8F5F0", emoji: "🚙" },
                { name: "기아 K5", year: "2020 · 55,000km", price: "1,780", bg: "#F3F8F0", emoji: "🚗" },
                { name: "현대 엑센트", year: "2019 · 68,000km", price: "680", bg: "#F8F8F0", emoji: "🚕" },
              ].map((rel) => (
                <a key={rel.name} href="/cars/1" className="rel-card" style={{ background: "white", border: "1.5px solid #E8E6E0", borderRadius: "16px", overflow: "hidden" }}>
                  <div style={{ height: "120px", background: `linear-gradient(135deg, ${rel.bg}, #EDE9E0)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "44px" }}>{rel.emoji}</div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 800, marginBottom: "3px" }}>{rel.name}</div>
                    <div style={{ fontSize: "11px", color: "#AAA", marginBottom: "10px", fontWeight: 400 }}>{rel.year} · 가솔린</div>
                    <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: "22px", letterSpacing: "0.5px" }}>{rel.price}<span style={{ fontSize: "13px", fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700, color: "#888" }}>만원</span></div>
                    <div style={{ fontSize: "10px", color: "#1847FF", fontWeight: 800, marginTop: "2px" }}>🔒 FIX PRICE</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 문의 모달 */}
        {showModal && (
          <div onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ background: "white", borderRadius: "24px", width: "100%", maxWidth: "480px", padding: "36px", position: "relative" }}>
              <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: "16px", right: "16px", width: "32px", height: "32px", border: "none", background: "#F2F1ED", borderRadius: "50%", cursor: "pointer", fontSize: "16px" }}>✕</button>
              <h3 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "6px" }}>궁금한 거 물어봐요</h3>
              <p style={{ fontSize: "13px", color: "#888", marginBottom: "24px", fontWeight: 400 }}>당일 답변 드려요. 판매 압박 없어요.</p>
              {[["이름", "text", "홍길동"], ["연락처", "tel", "010-0000-0000"], ["문의 내용", "textarea", "궁금한 점을 자유롭게 적어주세요."]].map(([label, type, ph]) => (
                <div key={label} style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 800, marginBottom: "6px", display: "block" }}>{label}</label>
                  {type === "textarea"
                    ? <textarea placeholder={ph} style={{ width: "100%", border: "1.5px solid #E8E6E0", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", fontFamily: "'NanumSquareRound', sans-serif", outline: "none", resize: "vertical", minHeight: "90px" }} />
                    : <input type={type} placeholder={ph} style={{ width: "100%", border: "1.5px solid #E8E6E0", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", fontFamily: "'NanumSquareRound', sans-serif", outline: "none" }} />
                  }
                </div>
              ))}
              <button style={{ width: "100%", background: "#FF3B1E", color: "white", border: "none", padding: "15px", borderRadius: "12px", fontSize: "15px", fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif" }}>문의 보내기 →</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
