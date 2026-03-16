import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "픽스카 FIXCAR — 나, 이 차로 픽했어",
  description: "광주 중고차 정찰제 플랫폼. FIX 가격으로 흥정 없이 내 차를 픽하세요.",
};

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'NanumSquareRound', 'Noto Sans KR', sans-serif;
          background: #FAFAF8;
          color: #0C0C0C;
        }

        .logo-text {
          font-family: 'Bebas Neue', serif;
          font-size: 28px;
          letter-spacing: 3px;
          text-decoration: none;
        }

        .hero-title {
          font-family: 'NanumSquareRound', sans-serif;
          font-weight: 800;
          font-size: clamp(52px, 8vw, 96px);
          line-height: 1.0;
          letter-spacing: -3px;
        }

        .section-title {
          font-family: 'NanumSquareRound', sans-serif;
          font-weight: 800;
          font-size: clamp(28px, 4vw, 48px);
          letter-spacing: -1.5px;
          line-height: 1.1;
        }

        .btn-primary {
          background: #FF3B1E;
          color: white;
          border: none;
          padding: 18px 36px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          font-family: 'NanumSquareRound', sans-serif;
          box-shadow: 0 10px 28px rgba(255,59,30,0.3);
          transition: all 0.2s;
        }
        .btn-primary:hover { background: #CC2A10; transform: translateY(-2px); }

        .btn-secondary {
          background: transparent;
          color: #1847FF;
          border: 2px solid #1847FF;
          padding: 16px 28px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          font-family: 'NanumSquareRound', sans-serif;
          transition: all 0.2s;
        }
        .btn-secondary:hover { background: #1847FF; color: white; }

        .car-card:hover {
          box-shadow: 0 20px 56px rgba(0,0,0,0.1);
          transform: translateY(-5px);
          border-color: transparent !important;
        }
        .car-card { transition: all 0.3s; }

        .pick-btn:hover { background: #FF3B1E !important; }
        .pick-btn { transition: all 0.2s; }

        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-card { display: none; }
          .concept-grid { grid-template-columns: 1fr !important; }
          .cars-grid { grid-template-columns: 1fr 1fr !important; }
          .promise-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-links-wrap { display: none !important; }
          .hero-section { padding: 48px 20px 40px !important; }
          section, .section-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 480px) {
          .cars-grid { grid-template-columns: 1fr !important; }
          .promise-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <main style={{ fontFamily: "'NanumSquareRound', 'Noto Sans KR', sans-serif", background: "#FAFAF8", minHeight: "100vh" }}>

        {/* 공지 바 */}
        <div style={{ background: "#0C0C0C", color: "white", textAlign: "center", padding: "10px 20px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.3px" }}>
          🎯 <span style={{ color: "#FF7A63" }}>PICK</span> 맘에 드는 차를 바로 픽하세요&nbsp;·&nbsp;
          <span style={{ color: "#6B8EFF" }}>FIX</span> 정찰제 — 흥정 스트레스 없음&nbsp;·&nbsp;
          ✓ 100항목 직접 검수&nbsp;·&nbsp;3일 환불 보장
        </div>

        {/* 네비게이션 */}
        <nav style={{
          background: "rgba(250,250,248,0.94)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          padding: "0 52px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100
        }}>
          <div className="logo-text">
            <span style={{ color: "#FF3B1E" }}>FIX</span>
            <span style={{ color: "#0C0C0C" }}>CAR</span>
          </div>
          <div className="nav-links-wrap" style={{ display: "flex", gap: "32px" }}>
            {["차 찾기", "추천 퀴즈", "초보 가이드", "내 차 팔기"].map(item => (
              <a key={item} href="#" style={{ fontSize: "14px", fontWeight: 700, color: "#888", textDecoration: "none" }}>{item}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ background: "transparent", border: "1.5px solid #E8E6E0", padding: "8px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif" }}>로그인</button>
            <button className="btn-primary" style={{ padding: "9px 20px", borderRadius: "100px", fontSize: "13px" }}>✨ 내 차 픽하기</button>
          </div>
        </nav>

        {/* 히어로 */}
        <section className="hero-section" style={{ maxWidth: "1360px", margin: "0 auto", padding: "80px 52px 60px" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "28px", alignItems: "center" }}>
                <span style={{ background: "#FF3B1E", color: "white", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 800 }}>PICK</span>
                <span style={{ fontSize: "14px", color: "#CCC" }}>+</span>
                <span style={{ background: "#1847FF", color: "white", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 800 }}>FIX</span>
              </div>
              <h1 className="hero-title" style={{ marginBottom: "24px" }}>
                나, 이 차로<br />
                <span style={{ color: "#FF3B1E" }}>픽</span>했어
              </h1>
              <p style={{ fontSize: "17px", color: "#555", lineHeight: 1.85, marginBottom: "40px", fontWeight: 400 }}>
                중고차가 처음이어도 괜찮아요.<br />
                <strong style={{ fontWeight: 800 }}>3분 퀴즈로 내 차를 픽(PICK)하고</strong>,<br />
                <strong style={{ color: "#1847FF", fontWeight: 800 }}>픽스(FIX)된 정찰가</strong>로 흥정 없이 구매해요.
              </p>
              <div style={{ display: "flex", gap: "14px", marginBottom: "48px", flexWrap: "wrap" }}>
                <button className="btn-primary">내 차 픽하기 →</button>
                <button className="btn-secondary">🔒 정찰가 보기</button>
              </div>
              <div style={{ display: "flex", gap: "32px", paddingTop: "32px", borderTop: "1px solid #E8E6E0" }}>
                {[["2,418+", "현재 매물"], ["98%", "구매 만족도"], ["4.9★", "앱 평점"]].map(([num, label]) => (
                  <div key={label}>
                    <div style={{ fontSize: "28px", fontWeight: 800, color: "#FF3B1E", letterSpacing: "-1px" }}>{num}</div>
                    <div style={{ fontSize: "12px", color: "#AAA", marginTop: "2px", fontWeight: 400 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-card" style={{ position: "relative" }}>
              <div style={{ background: "#0C0C0C", borderRadius: "28px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}>
                <div style={{ height: "230px", background: "linear-gradient(145deg, #1A1A1A, #0C0C0C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "90px", position: "relative" }}>
                  🚗
                  <div style={{ position: "absolute", top: "16px", left: "16px", display: "flex", gap: "8px" }}>
                    <span style={{ background: "#FF3B1E", color: "white", padding: "5px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 800 }}>✨ PICK 추천</span>
                    <span style={{ background: "#1847FF", color: "white", padding: "5px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 800 }}>🔒 FIX 가격</span>
                  </div>
                </div>
                <div style={{ padding: "22px 24px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "white", marginBottom: "4px" }}>현대 아반떼 CN7</div>
                  <div style={{ fontSize: "13px", color: "#666", marginBottom: "18px", fontWeight: 400 }}>2021년식 · 32,000km · 가솔린 · 광주 북구</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px" }}>
                    <div style={{ fontSize: "42px", fontWeight: 800, color: "white", letterSpacing: "-1px" }}>
                      1,450<span style={{ fontSize: "18px", color: "#666", fontWeight: 400 }}>만원</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ background: "#1847FF", color: "white", padding: "5px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: 800, letterSpacing: "1px" }}>FIX PRICE</div>
                      <div style={{ fontSize: "11px", color: "#555", marginTop: "3px", fontWeight: 400 }}>흥정없음 · 정찰가</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["✓ 무사고", "🔰 초보 추천", "연비 15.2km/L"].map(tag => (
                      <span key={tag} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", padding: "5px 12px", borderRadius: "100px", fontSize: "11px", color: "#999", fontWeight: 400 }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "20px", left: "-20px", background: "#FF3B1E", color: "white", borderRadius: "16px", padding: "12px 18px", boxShadow: "0 8px 24px rgba(255,59,30,0.4)" }}>
                <div style={{ fontSize: "13px", fontWeight: 800 }}>이 차로 픽 했어! 🎯</div>
                <div style={{ fontSize: "11px", opacity: 0.8, fontWeight: 400 }}>오늘 3명이 관심 표시</div>
              </div>
            </div>
          </div>
        </section>

        {/* PICK + FIX 개념 */}
        <section className="section-pad" style={{ maxWidth: "1360px", margin: "0 auto 80px", padding: "0 52px" }}>
          <div className="concept-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: "28px", overflow: "hidden", border: "1px solid #E8E6E0" }}>
            <div style={{ background: "#FF3B1E", padding: "64px 56px", position: "relative", overflow: "hidden" }}>
              <div style={{ fontSize: "120px", fontWeight: 900, color: "rgba(255,255,255,0.07)", position: "absolute", bottom: "-16px", right: "-8px", lineHeight: 1, letterSpacing: "-2px" }}>PICK</div>
              <div style={{ fontSize: "44px", marginBottom: "16px" }}>🎯</div>
              <div style={{ fontSize: "44px", fontWeight: 800, color: "white", letterSpacing: "3px", marginBottom: "12px", fontFamily: "'Bebas Neue', serif" }}>PICK</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "rgba(255,255,255,0.95)", marginBottom: "18px" }}>나, 이 차로 픽했어</div>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.78)", lineHeight: 1.8, maxWidth: "320px", fontWeight: 400 }}>
                차에 대해 아무것도 몰라도 괜찮아요.<br />
                <strong style={{ color: "white", fontWeight: 800 }}>3분 퀴즈 하나로</strong> 나에게 딱 맞는 차를 픽해드려요.
              </p>
            </div>
            <div style={{ background: "#1847FF", padding: "64px 56px", position: "relative", overflow: "hidden" }}>
              <div style={{ fontSize: "120px", fontWeight: 900, color: "rgba(255,255,255,0.07)", position: "absolute", bottom: "-16px", right: "-8px", lineHeight: 1, letterSpacing: "-2px" }}>FIX</div>
              <div style={{ fontSize: "44px", marginBottom: "16px" }}>🔒</div>
              <div style={{ fontSize: "44px", fontWeight: 800, color: "white", letterSpacing: "3px", marginBottom: "12px", fontFamily: "'Bebas Neue', serif" }}>FIX</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "rgba(255,255,255,0.95)", marginBottom: "18px" }}>가격은 픽스, 믿음도 픽스</div>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.78)", lineHeight: 1.8, maxWidth: "320px", fontWeight: 400 }}>
                모든 매물의 가격을 고정(FIX)해요.<br />
                <strong style={{ color: "white", fontWeight: 800 }}>표시 가격 = 최종 가격.</strong> 숨은 비용 없음.
              </p>
            </div>
          </div>
        </section>

        {/* 인기 매물 */}
        <section className="section-pad" style={{ maxWidth: "1360px", margin: "0 auto 80px", padding: "0 52px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "3px", color: "#FF3B1E", marginBottom: "8px" }}>TODAY&#39;S PICK</div>
              <h2 className="section-title">오늘 픽스카 <span style={{ color: "#FF3B1E" }}>추천</span> 매물</h2>
            </div>
            <a href="#" style={{ fontSize: "14px", fontWeight: 700, color: "#888", textDecoration: "none" }}>전체 보기 →</a>
          </div>
          <div className="cars-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {[
              { name: "현대 아반떼 CN7", year: "2021년식 · 32,000km · 가솔린", price: "1,450", tags: ["✓ 무사고", "🔰 초보 추천"], badge: "✨ PICK", bg: "#F8F5F0", emoji: "🚙" },
              { name: "기아 K3", year: "2020년식 · 51,000km · 가솔린", price: "1,090", tags: ["✓ 무사고", "💰 가성비"], badge: "🔒 FIX", bg: "#F0F3F8", emoji: "🚗" },
              { name: "현대 투싼 NX4", year: "2022년식 · 28,000km · 가솔린", price: "2,780", tags: ["✓ 1인 오너", "👨‍👩‍👧 가족용"], badge: "👨‍👩‍👧 가족 PICK", bg: "#F3F8F0", emoji: "🚐" },
            ].map((car) => (
              <div key={car.name} className="car-card" style={{ background: "white", border: "1.5px solid #E8E6E0", borderRadius: "20px", overflow: "hidden", cursor: "pointer" }}>
                <div style={{ height: "188px", background: `linear-gradient(135deg, ${car.bg}, #EDE9E0)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "60px", position: "relative" }}>
                  {car.emoji}
                  <span style={{ position: "absolute", top: "12px", left: "12px", background: "#FF3B1E", color: "white", padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 800 }}>{car.badge}</span>
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: "3px" }}>{car.name}</div>
                  <div style={{ fontSize: "12px", color: "#AAA", marginBottom: "12px", fontWeight: 400 }}>{car.year}</div>
                  <div style={{ display: "flex", gap: "5px", marginBottom: "14px", flexWrap: "wrap" }}>
                    {car.tags.map(tag => (
                      <span key={tag} style={{ background: "#EEF9F3", border: "1px solid #C8E8D4", padding: "3px 9px", borderRadius: "100px", fontSize: "10px", fontWeight: 700, color: "#3A9E62" }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: "12px", borderTop: "1px solid #E8E6E0" }}>
                    <div>
                      <div style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px" }}>{car.price}<span style={{ fontSize: "14px", fontWeight: 700, color: "#888" }}>만원</span></div>
                      <div style={{ fontSize: "10px", color: "#1847FF", fontWeight: 800, marginTop: "3px" }}>🔒 FIX PRICE · 흥정없음</div>
                    </div>
                    <button className="pick-btn" style={{ background: "#0C0C0C", color: "white", border: "none", padding: "9px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif" }}>픽하기 →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FIX 약속 */}
        <section style={{ background: "#141414", padding: "90px 52px" }}>
          <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center", marginBottom: "56px" }}>
              <h2 className="section-title" style={{ color: "white" }}>
                픽스카가 지키는<br /><span style={{ color: "#6B8EFF" }}>FIX</span> 약속 4가지
              </h2>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontWeight: 400 }}>
                가격만 고정(FIX)하는 게 아니에요.<br />
                <strong style={{ color: "rgba(255,255,255,0.9)", fontWeight: 800 }}>신뢰도 고정(FIX)합니다.</strong>
              </p>
            </div>
            <div className="promise-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {[
                { num: "100", icon: "🔍", title: "100항목 직접 검수", desc: "전문 정비사가 100개 항목을 직접 점검한 차만 등록돼요." },
                { num: "0원", icon: "💸", title: "숨은 비용 제로", desc: "표시 가격이 곧 최종 가격. 추가금이 생기는 일 없어요." },
                { num: "3일", icon: "🔄", title: "3일 환불 보장", desc: "구매 후 3일 이내 마음이 바뀌면 100% 환불." },
                { num: "∞", icon: "📄", title: "투명한 이력 공개", desc: "사고, 침수, 교체 이력을 숨기지 않아요." },
              ].map((item) => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px 22px" }}>
                  <div style={{ fontSize: "30px", fontWeight: 800, color: "#6B8EFF", marginBottom: "4px", letterSpacing: "0.5px" }}>{item.num}</div>
                  <div style={{ fontSize: "26px", marginBottom: "14px" }}>{item.icon}</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "white", marginBottom: "8px" }}>{item.title}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 400 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 후기 */}
        <section className="section-pad" style={{ maxWidth: "1360px", margin: "0 auto", padding: "80px 52px" }}>
          <div style={{ marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "3px", color: "#FF3B1E", marginBottom: "8px" }}>PICK STORIES</div>
            <h2 className="section-title">픽한 사람들 이야기</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {[
              { initial: "김", name: "김지원 (24세)", desc: "초보 운전 · 아반떼 픽", text: "면허 딴 지 3개월인데 퀴즈 풀었더니 딱 제 예산에 맞는 차 3개를 추천해줬어요. FIX 가격이라서 흥정 없이 바로 계약했어요!", tag: "PICK" },
              { initial: "박", name: "박민서 (27세)", desc: "직장인 · K3 픽", text: "다른 사이트는 전화 폭탄이랑 흥정이 너무 피곤했는데, 픽스카는 FIX 가격 그대로여서 너무 편했어요.", tag: "FIX" },
              { initial: "이", name: "이수연 (31세)", desc: "가족 선물 · 투싼 픽", text: "엄마한테 선물하려고 찾다가 알게 됐어요. 초보용 설명이 너무 친절해서 차 모르는 제가 봐도 이해됐어요!", tag: "PICK" },
            ].map((review) => (
              <div key={review.name} style={{ background: "#F2F1ED", borderRadius: "22px", padding: "28px" }}>
                <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#444", marginBottom: "20px", fontWeight: 400 }}>&ldquo;{review.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", background: review.tag === "PICK" ? "#FF3B1E" : "#1847FF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 800, color: "white" }}>{review.initial}</div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 800 }}>{review.name}</div>
                    <div style={{ fontSize: "11px", color: "#AAA", fontWeight: 400 }}>{review.desc}</div>
                  </div>
                  <span style={{ marginLeft: "auto", background: review.tag === "PICK" ? "#FFF1EE" : "#EEF2FF", color: review.tag === "PICK" ? "#FF3B1E" : "#1847FF", padding: "4px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 800 }}>{review.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "#FF3B1E", padding: "100px 52px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ fontSize: "clamp(80px, 16vw, 200px)", fontWeight: 900, color: "rgba(0,0,0,0.07)", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", whiteSpace: "nowrap", pointerEvents: "none", fontFamily: "'Bebas Neue', serif", letterSpacing: "8px" }}>FIXCAR</div>
          <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(44px, 7vw, 80px)", fontWeight: 800, color: "white", letterSpacing: "-2px", lineHeight: 1.05, marginBottom: "20px" }}>
              나, 이 차로<br />픽했어 🎯
            </h2>
            <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.82)", lineHeight: 1.8, marginBottom: "44px", fontWeight: 400 }}>
              3분 퀴즈로 내 차를 픽(PICK)하고<br />픽스(FIX) 정찰가로 스트레스 없이 구매하세요.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <button style={{ background: "white", color: "#FF3B1E", border: "none", padding: "18px 44px", borderRadius: "14px", fontSize: "17px", fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif", boxShadow: "0 8px 28px rgba(0,0,0,0.15)" }}>✨ 내 차 PICK하러 가기</button>
              <button style={{ background: "transparent", color: "white", border: "2px solid rgba(255,255,255,0.5)", padding: "16px 36px", borderRadius: "14px", fontSize: "16px", fontWeight: 700, cursor: "pointer", fontFamily: "'NanumSquareRound', sans-serif" }}>🔒 FIX 가격 매물 보기</button>
            </div>
          </div>
        </section>

        {/* 푸터 */}
        <footer style={{ background: "#0C0C0C", padding: "60px 52px 40px" }}>
          <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
            <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "48px", paddingBottom: "48px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "32px" }}>
              <div>
                <div style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "2px", marginBottom: "14px", fontFamily: "'Bebas Neue', serif" }}>
                  <span style={{ color: "#FF3B1E" }}>FIX</span>
                  <span style={{ color: "white" }}>CAR</span>
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", lineHeight: 1.9, fontWeight: 400 }}>나, 이 차로 픽했어.<br />가격은 픽스.<br />광주 중고차 정찰제 플랫폼.</p>
              </div>
              {[
                { title: "픽하기", links: ["차 추천 퀴즈", "전체 매물", "FIX 가격 매물", "초보 추천"] },
                { title: "픽스 가이드", links: ["중고차 구매 A~Z", "FIX 정찰가란?", "할부 계산기", "보험 가이드"] },
                { title: "픽스카", links: ["회사 소개", "내 차 팔기", "고객센터", "채용"] },
              ].map(col => (
                <div key={col.title}>
                  <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "16px" }}>{col.title}</div>
                  {col.links.map(link => (
                    <a key={link} href="#" style={{ display: "block", fontSize: "14px", color: "rgba(255,255,255,0.32)", textDecoration: "none", marginBottom: "10px", fontWeight: 400 }}>{link}</a>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", fontWeight: 400 }}>© 2025 픽스카 FIXCAR · 광주광역시 중고차 정찰제 플랫폼</div>
              <div style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "2px", color: "rgba(255,255,255,0.12)", fontFamily: "'Bebas Neue', serif" }}>PICK YOUR CAR. FIX YOUR PRICE.</div>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
