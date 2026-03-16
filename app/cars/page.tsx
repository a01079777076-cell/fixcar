"use client";

export default function CarsPage() {
  const cars = [
    { id: 1, name: "현대 아반떼 CN7", year: "2021년식", mileage: "32,000km", fuel: "가솔린", color: "흰색", region: "광주 북구", price: "1,450", monthly: "29", tags: ["✓ 무사고", "🔰 초보 추천", "연비 15.2km/L"], badge: "✨ PICK", bg: "#F8F5F0", emoji: "🚙" },
    { id: 2, name: "기아 K3", year: "2020년식", mileage: "51,000km", fuel: "가솔린", color: "실버", region: "광주 서구", price: "1,090", monthly: "22", tags: ["✓ 무사고", "💰 가성비", "1인 오너"], badge: "🔒 FIX", bg: "#F0F3F8", emoji: "🚗" },
    { id: 3, name: "현대 투싼 NX4", year: "2022년식", mileage: "28,000km", fuel: "가솔린", color: "검정", region: "광주 남구", price: "2,780", monthly: "55", tags: ["✓ 1인 오너", "👨‍👩‍👧 가족용", "넓은 트렁크"], badge: "👨‍👩‍👧 가족 PICK", bg: "#F3F8F0", emoji: "🚐" },
    { id: 4, name: "기아 스팅어 GT", year: "2021년식", mileage: "44,000km", fuel: "가솔린 터보", color: "블랙", region: "광주 광산구", price: "3,200", monthly: "64", tags: ["✓ 무사고", "고성능", "AWD"], badge: "🆕 신규", bg: "#F5F0F8", emoji: "🚕" },
    { id: 5, name: "현대 아이오닉 5", year: "2022년식", mileage: "22,000km", fuel: "전기", color: "그린", region: "광주 동구", price: "3,890", monthly: "77", tags: ["✓ 무사고", "⚡ 전기차", "1회충전 429km"], badge: "⚡ EV PICK", bg: "#F0F8F3", emoji: "🚙" },
    { id: 6, name: "현대 엑센트", year: "2019년식", mileage: "68,000km", fuel: "가솔린", color: "흰색", region: "광주 북구", price: "680", monthly: "14", tags: ["✓ 무사고", "🔰 초보 추천", "주차 쉬움"], badge: "💰 가성비", bg: "#F8F8F0", emoji: "🚗" },
    { id: 7, name: "기아 쏘렌토 MQ4", year: "2021년식", mileage: "38,000km", fuel: "디젤", color: "실버", region: "광주 서구", price: "3,450", monthly: "69", tags: ["✓ 무사고", "7인승", "넓은 적재공간"], badge: "✨ PICK", bg: "#F0F3F8", emoji: "🚐" },
    { id: 8, name: "현대 쏘나타 DN8", year: "2021년식", mileage: "41,000km", fuel: "가솔린", color: "흰색", region: "광주 남구", price: "2,100", monthly: "42", tags: ["✓ 무사고", "🔰 초보 추천", "넓은 실내"], badge: "🔒 FIX", bg: "#F8F5F0", emoji: "🚙" },
    { id: 9, name: "기아 K5 DL3", year: "2020년식", mileage: "55,000km", fuel: "가솔린", color: "검정", region: "광주 광산구", price: "1,780", monthly: "36", tags: ["✓ 무사고", "1인 오너", "연비 13.5km/L"], badge: "💰 가성비", bg: "#F5F0F8", emoji: "🚗" },
  ];

  const filters = ["전체", "💰 1000만원 이하", "🔰 초보 추천", "⚡ 전기·하이브리드", "👨‍👩‍👧 가족용 SUV", "🅿️ 주차 쉬운 차"];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: 'NanumSquareRound', 'Noto Sans KR', sans-serif; background: #FAFAF8; }

        .car-card { transition: all 0.3s; cursor: pointer; }
        .car-card:hover { box-shadow: 0 20px 56px rgba(0,0,0,0.1); transform: translateY(-5px); border-color: transparent !important; }

        .filter-chip { transition: all 0.15s; cursor: pointer; font-family: 'NanumSquareRound', sans-serif; }
        .filter-chip:hover { border-color: #0C0C0C !important; color: #0C0C0C !important; }

        .pick-btn { transition: all 0.2s; font-family: 'NanumSquareRound', sans-serif; }
        .pick-btn:hover { background: #FF3B1E !important; }

        .heart-btn { transition: all 0.2s; }
        .heart-btn:hover { transform: scale(1.2); }

        .sb-opt { cursor: pointer; transition: color 0.15s; }
        .sb-opt:hover { color: #0C0C0C !important; }

        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: #0C0C0C !important; }

        @media (max-width: 1024px) {
          .layout-grid { grid-template-columns: 1fr !important; }
          .sidebar { display: none !important; }
          .cars-grid { grid-template-columns: 1fr 1fr !important; }
          .ph-right { display: none !important; }
          .nav-links { display: none !important; }
        }
        @media (max-width: 600px) {
          .cars-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'NanumSquareRound', 'Noto Sans KR', sans-serif", background: "#FAFAF8", minHeight: "100vh" }}>

        {/* 공지 바 */}
        <div style={{ background: "#0C0C0C", color: "white", textAlign: "center", padding: "10px 20px", fontSize: "12px", fontWeight: 700 }}>
          🎯 <span style={{ color: "#FF7A63" }}>PICK</span> 맘에 드는 차를 바로 픽하세요&nbsp;·&nbsp;
          <span style={{ color: "#6B8EFF" }}>FIX</span> 정찰제 — 흥정 스트레스 없음&nbsp;·&nbsp;
          ✓ 100항목 직접 검수&nbsp;·&nbsp;3일 환불 보장
        </div>

        {/* 네비게이션 */}
        <nav style={{ background: "rgba(250,250,248,0.94)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "0 52px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', serif", fontSize: "26px", letterSpacing: "3px", textDecoration: "none" }}>
            <span style={{ color: "#FF3B1E" }}>FIX</span><span style={{ color: "#0C0C0C" }}>CAR</span>
          </a>
          <div className="nav-links" style={{ display: "flex", gap: "32px" }}>
            {[["차 찾기", "/cars"], ["추천 퀴즈", "/quiz"], ["초보 가이드", "/guide"], ["내 차 팔기", "/sell"]].map(([label, href]) => (
              <a key={label} href={href} className="nav-link" style={{ fontSize: "14px", fontWeight: label === "차 찾기" ? 800 : 600, color: label === "차 찾기" ? "#0C0C0C" : "#888", textDecoration: "none", borderBottom: label === "차 찾기" ? "2px solid #FF3B1E" : "none", paddingBottom: "2px" }}>{label}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ background: "transparent", border: "1.5px solid #E8E6E0", padding: "8px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif" }}>로그인</button>
            <button style={{ background: "#FF3B1E", color: "white", border: "none", padding: "9px 20px", borderRadius: "100px", fontSize: "13px", fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif" }}>✨ 내 차 픽하기</button>
          </div>
        </nav>

        {/* 페이지 헤더 */}
        <div style={{ background: "#0C0C0C", padding: "48px 52px 40px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "360px", height: "360px", background: "radial-gradient(circle, rgba(255,59,30,0.1), transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ maxWidth: "1360px", margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "3px", color: "#FF7A63", marginBottom: "10px" }}>FIND YOUR CAR</div>
              <h1 style={{ fontFamily: "'NanumSquareRound', sans-serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-1.5px", color: "white", lineHeight: 1.1, marginBottom: "8px" }}>
                광주 중고차 <span style={{ color: "#FF3B1E" }}>전체 매물</span>
              </h1>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>모든 매물은 FIX 정찰가 · 100항목 검수 완료</p>
            </div>
            <div className="ph-right" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Bebas Neue', serif", fontSize: "52px", color: "#FF3B1E", letterSpacing: "1px", lineHeight: 1 }}>2,418</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "2px", fontWeight: 400 }}>현재 등록 매물</div>
              </div>
              <button style={{ background: "#FF3B1E", color: "white", border: "none", padding: "13px 24px", borderRadius: "12px", fontSize: "14px", fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
                🎯 3분 퀴즈로 추천받기
              </button>
            </div>
          </div>
        </div>

        {/* 필터 탭 */}
        <div style={{ background: "white", borderBottom: "1px solid #E8E6E0", position: "sticky", top: "64px", zIndex: 90 }}>
          <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 52px" }}>
            <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #E8E6E0", overflowX: "auto" }}>
              {filters.map((f, i) => (
                <div key={f} style={{ padding: "14px 20px", fontSize: "13px", fontWeight: i === 0 ? 800 : 600, color: i === 0 ? "#FF3B1E" : "#888", borderBottom: i === 0 ? "2px solid #FF3B1E" : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>{f}</div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px", padding: "12px 0", flexWrap: "wrap", alignItems: "center" }}>
              {["✓ 무사고", "1인 오너", "주행 5만km 이하", "2020년식 이상", "현대", "기아", "제네시스", "수입차"].map(chip => (
                <button key={chip} className="filter-chip" style={{ padding: "7px 16px", border: "1.5px solid #E8E6E0", borderRadius: "100px", fontSize: "12px", fontWeight: 700, color: "#888", background: "white" }}>{chip}</button>
              ))}
              <div style={{ marginLeft: "auto" }}>
                <select style={{ border: "1.5px solid #E8E6E0", borderRadius: "100px", padding: "7px 16px", fontSize: "12px", fontWeight: 700, fontFamily: "'NanumSquareRound', sans-serif", color: "#0C0C0C", background: "white", cursor: "pointer", outline: "none" }}>
                  <option>추천순</option>
                  <option>가격 낮은순</option>
                  <option>가격 높은순</option>
                  <option>최신 등록순</option>
                  <option>주행거리 낮은순</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 레이아웃 */}
        <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "32px 52px 80px" }}>
          <div className="layout-grid" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "32px", alignItems: "start" }}>

            {/* 사이드바 */}
            <aside className="sidebar" style={{ position: "sticky", top: "180px" }}>

              {/* 가격 */}
              <div style={{ background: "white", border: "1.5px solid #E8E6E0", borderRadius: "16px", padding: "20px", marginBottom: "14px" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
                  가격 범위 <span style={{ color: "#FF3B1E", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>초기화</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 800 }}>0만원</span>
                  <span style={{ fontSize: "13px", fontWeight: 800 }}>5,000만원+</span>
                </div>
                <input type="range" min="0" max="5000" defaultValue="5000" style={{ width: "100%", accentColor: "#FF3B1E", height: "3px" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#AAA", marginTop: "6px", fontWeight: 400 }}>
                  <span>0</span><span>5,000만원+</span>
                </div>
              </div>

              {/* 연식 */}
              <div style={{ background: "white", border: "1.5px solid #E8E6E0", borderRadius: "16px", padding: "20px", marginBottom: "14px" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, marginBottom: "14px" }}>연식</div>
                {[["2023년 이상", "182"], ["2021~2022년", "534"], ["2019~2020년", "728"], ["2017~2018년", "491"], ["2016년 이하", "483"]].map(([label, count]) => (
                  <label key={label} className="sb-opt" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#555", padding: "5px 0", fontWeight: 400 }}>
                    <input type="checkbox" defaultChecked={label.includes("2021") || label.includes("2019")} style={{ accentColor: "#FF3B1E", width: "15px", height: "15px" }} />
                    {label}
                    <span style={{ marginLeft: "auto", fontSize: "11px", color: "#CCC", fontWeight: 400 }}>{count}</span>
                  </label>
                ))}
              </div>

              {/* 연료 */}
              <div style={{ background: "white", border: "1.5px solid #E8E6E0", borderRadius: "16px", padding: "20px", marginBottom: "14px" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, marginBottom: "14px" }}>연료</div>
                {[["가솔린", "1,204"], ["디젤", "584"], ["하이브리드", "380"], ["전기(EV)", "142"], ["LPG", "108"]].map(([label, count]) => (
                  <label key={label} className="sb-opt" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#555", padding: "5px 0", fontWeight: 400 }}>
                    <input type="checkbox" defaultChecked={label === "가솔린"} style={{ accentColor: "#FF3B1E", width: "15px", height: "15px" }} />
                    {label}
                    <span style={{ marginLeft: "auto", fontSize: "11px", color: "#CCC", fontWeight: 400 }}>{count}</span>
                  </label>
                ))}
              </div>

              {/* 특수 조건 */}
              <div style={{ background: "white", border: "1.5px solid #E8E6E0", borderRadius: "16px", padding: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, marginBottom: "14px" }}>특수 조건</div>
                {["무사고 차량만", "1인 오너만", "초보 추천 차량만", "당일 탁송 가능"].map(label => (
                  <label key={label} className="sb-opt" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#555", padding: "5px 0", fontWeight: 400 }}>
                    <input type="checkbox" defaultChecked={label === "무사고 차량만"} style={{ accentColor: "#FF3B1E", width: "15px", height: "15px" }} />
                    {label}
                  </label>
                ))}
              </div>
            </aside>

            {/* 차량 목록 */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700 }}><span style={{ color: "#FF3B1E", fontWeight: 800 }}>1,737</span>대의 차량</div>
              </div>

              <div className="cars-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" }}>
                {cars.map((car) => (
                  <a key={car.id} href={`/cars/${car.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="car-card" style={{ background: "white", border: "1.5px solid #E8E6E0", borderRadius: "20px", overflow: "hidden" }}>
                      <div style={{ height: "182px", background: `linear-gradient(135deg, ${car.bg}, #EDE9E0)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "58px", position: "relative" }}>
                        {car.emoji}
                        <span style={{ position: "absolute", top: "12px", left: "12px", background: "#FF3B1E", color: "white", padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 800 }}>{car.badge}</span>
                        <button className="heart-btn" onClick={(e) => e.preventDefault()} style={{ position: "absolute", top: "10px", right: "10px", width: "32px", height: "32px", background: "rgba(255,255,255,0.92)", borderRadius: "50%", border: "none", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>♡</button>
                      </div>
                      <div style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: "15px", fontWeight: 800, marginBottom: "2px" }}>{car.name}</div>
                        <div style={{ fontSize: "11px", color: "#AAA", marginBottom: "10px", fontWeight: 400 }}>{car.year} · {car.mileage} · {car.fuel} · {car.color} · {car.region}</div>
                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "12px" }}>
                          {car.tags.slice(0,2).map(tag => (
                            <span key={tag} style={{ background: "#EEF9F3", border: "1px solid #C8E8D4", padding: "3px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: 700, color: "#3A9E62" }}>{tag}</span>
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: "10px", borderTop: "1px solid #E8E6E0" }}>
                          <div>
                            <div style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>{car.price}<span style={{ fontSize: "13px", fontWeight: 700, color: "#888" }}>만원</span></div>
                            <div style={{ fontSize: "10px", color: "#1847FF", fontWeight: 800, marginTop: "2px" }}>🔒 FIX · 월 {car.monthly}만원~</div>
                          </div>
                          <button className="pick-btn" style={{ background: "#0C0C0C", color: "white", border: "none", padding: "8px 14px", borderRadius: "9px", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}>픽하기 →</button>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* 페이지네이션 */}
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "40px" }}>
                {["‹", "1", "2", "3", "4", "5", "›"].map((p, i) => (
                  <button key={i} style={{ width: "36px", height: "36px", border: "1.5px solid", borderColor: i === 1 ? "#FF3B1E" : "#E8E6E0", borderRadius: "8px", background: i === 1 ? "#FF3B1E" : "white", color: i === 1 ? "white" : "#555", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif" }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 플로팅 퀴즈 버튼 */}
        <button style={{ position: "fixed", bottom: "28px", right: "28px", background: "#FF3B1E", color: "white", border: "none", borderRadius: "100px", padding: "14px 24px", fontSize: "14px", fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif", boxShadow: "0 8px 28px rgba(255,59,30,0.4)", zIndex: 150 }}>
          🎯 내 차 추천받기
        </button>

      </div>
    </>
  );
}
