// 📁 저장 경로: components/FaqChatbot.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, ChevronRight } from "lucide-react";

const FAQ_DATA = [
  { q: "중고차 구매 절차가 어떻게 되나요?", a: "1) 매물 검색 → 2) 딜러 문의 → 3) 차량 확인/시승 → 4) 계약 → 5) 결제(할부/일시불) → 6) 명의이전 → 7) 보험가입 → 인수 완료!\n\n픽스카에서는 모든 과정을 딜러가 안내해드립니다." },
  { q: "이전등록비는 얼마인가요?", a: "이전등록비 = 취득세(차량가격의 7%) + 등록세 + 공채 + 대행수수료\n\n예: 2,000만원 차량 → 약 150~180만원\n\n지역/차종에 따라 다르니 딜러에게 문의하세요." },
  { q: "할부로 구매할 수 있나요?", a: "네! 캐피탈사를 통해 12~60개월 할부 가능합니다.\n\n일반적으로 차량가의 70%까지 할부 가능하며, 금리는 신용등급에 따라 다릅니다.\n\n딜러가 최적 조건을 안내해드립니다." },
  { q: "허위매물은 어떻게 방지하나요?", a: "픽스카는 3단계 검증을 거칩니다:\n\n1) 카히스토리 이력 대조\n2) 성능상태점검기록부 확인\n3) 자동차365 정비이력 크로스체크\n\n불일치 시 매물이 자동 차단됩니다." },
  { q: "사고차/침수차 구분은 어떻게 하나요?", a: "✅ 성능상태점검기록부에서 사고 이력 확인\n✅ 보험개발원 카히스토리 조회\n✅ 도장 두께 측정 (사고 수리 부위 확인)\n✅ 실내 습기/곰팡이 냄새 체크 (침수)\n\n확실치 않으면 픽스카 검수 서비스를 이용하세요!" },
  { q: "FIX 정찰가란 뭔가요?", a: "픽스카의 핵심 제도입니다!\n\n등록된 가격이 최종 가격 = 흥정 NO\n\n딜러가 처음 제시한 가격에서 추가 비용이 발생하지 않습니다.\n(이전등록비, 보험료는 별도)" },
  { q: "검수 서비스는 어떻게 이용하나요?", a: "고객센터 또는 검수 페이지에서 신청하시면 됩니다.\n\n기본 검수 15만원 (계약금 1만원 + 현장 14만원)\n\nFIXCAR 공식 인증 검수업체가 차량 상태를 꼼꼼하게 확인해드립니다." },
  { q: "거래대행 서비스가 뭔가요?", a: "당근마켓, 번개장터 등 개인간 거래를 전문 딜러가 대행하는 서비스입니다.\n\n대행료: 15~20만원\n\n차량 검수, 시세 분석, 서류 대행, 명의이전까지 모두 포함!" },
];

const CAR_TMI = [
  "자동차 에어컨을 처음 켤 때는 창문을 열고 1~2분 환기 후 사용하면 유해물질을 줄일 수 있어요.",
  "타이어 공기압은 1개월에 약 1psi씩 자연 감소해요. 매달 한 번 체크하세요!",
  "엔진오일은 보통 10,000km마다 교체하지만, 시내 주행이 많으면 7,000km에 한 번이 좋아요.",
  "한국에서 가장 많이 팔린 차는 현대 그랜저예요. 누적 판매 300만 대 이상!",
  "중고차 시세는 보통 신차 출고 후 1년에 20~25% 하락하고, 이후 매년 10% 정도 떨어져요.",
  "자동차 와이퍼는 6개월~1년마다 교체하는 게 좋아요. 빗물 자국이 생기면 교체 시기!",
  "경유차는 DPF(매연저감장치)가 있어서 장거리 주행을 가끔 해줘야 막힘을 예방해요.",
  "자동차 배터리 수명은 보통 3~5년이에요. 시동이 느려지면 교체 시기가 다가온 거예요.",
  "하이브리드차는 브레이크를 밟으면 전기를 충전해요. 이걸 '회생 제동'이라고 해요!",
  "전기차 배터리는 20~80% 사이에서 충전하면 수명이 더 오래가요.",
  "자동차 에어백은 시속 약 30km 이상에서 충돌해야 작동해요.",
  "한국에서 중고차 거래량은 연간 약 400만 대로, 신차 판매량(약 170만 대)의 2배 이상이에요.",
  "겨울에 디젤차 시동이 안 걸리면 연료 필터에 수분이 얼었을 가능성이 높아요.",
  "차량 번호판 색상: 흰색=자가용, 노란색=영업용, 초록색=전기차예요.",
  "세계 최초의 자동차는 1886년 칼 벤츠가 만든 '벤츠 페이턴트 모터바겐'이에요.",
  "자동차 타이어에 적힌 225/45R17에서 225는 폭(mm), 45는 편평비(%), R은 래디얼, 17은 휠 크기(인치)예요.",
  "주유할 때 주유구 방향을 모르겠으면 계기판 연료 게이지 옆 화살표를 확인하세요!",
  "자동차 에어컨 필터는 15,000km마다 교체가 권장돼요. 안 바꾸면 세균 번식!",
  "급발진 의심 상황에서는 기어를 N으로 놓고 브레이크를 힘껏 밟으세요.",
  "대한민국 자동차 등록 대수는 약 2,600만 대로 국민 2명당 1대꼴이에요.",
  "SUV는 Sport Utility Vehicle의 약자예요. 원래는 오프로드용이었지만 지금은 도심형이 대세!",
  "자동차 앞유리에 성에가 끼면 미지근한 물을 뿌리면 안 돼요. 유리가 깨질 수 있어요!",
  "중고차 매매 시 '매도비'는 법정 비용이 아니에요. 부당하게 청구하면 거부할 수 있어요.",
  "자동차 보험은 운전자 범위를 좁히면 보험료가 저렴해져요. (본인 한정 < 부부 < 가족)",
  "세차 후 물기를 안 닦으면 물때가 생겨요. 세차 후에는 꼭 마른 타월로 닦아주세요!",
];

export default function FaqChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "안녕하세요! 픽스카 도우미입니다 🚗\n궁금한 것을 선택하거나 직접 질문해주세요!" },
  ]);
  const [input, setInput] = useState("");
  const [showFaq, setShowFaq] = useState(true);
  const [tmi, setTmi] = useState("");
  const [showTmi, setShowTmi] = useState(false);
  const msgEndRef = useRef<HTMLDivElement>(null);

  /* 방문 시 1회 TMI 말풍선 */
  useEffect(() => {
    const key = "fixcar_tmi_shown";
    if (sessionStorage.getItem(key)) return;
    const randomTmi = CAR_TMI[Math.floor(Math.random() * CAR_TMI.length)];
    setTmi(randomTmi);
    const timer1 = setTimeout(() => setShowTmi(true), 2000);
    const timer2 = setTimeout(() => setShowTmi(false), 12000);
    sessionStorage.setItem(key, "1");
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  /* 자동 스크롤 */
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFaq = (faq: typeof FAQ_DATA[0]) => {
    setMessages(prev => [...prev, { role: "user", text: faq.q }, { role: "bot", text: faq.a }]);
    setShowFaq(false);
    setTimeout(() => setShowFaq(true), 500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const q = input.trim().toLowerCase();
    setMessages(prev => [...prev, { role: "user", text: input.trim() }]);
    setInput("");
    const match = FAQ_DATA.find(f =>
      f.q.toLowerCase().includes(q) || q.split(" ").some(w => w.length >= 2 && f.q.includes(w))
    );
    setTimeout(() => {
      if (match) {
        setMessages(prev => [...prev, { role: "bot", text: match.a }]);
      } else {
        setMessages(prev => [...prev, { role: "bot", text: "정확한 답변을 드리기 어렵습니다.\n\n아래 방법으로 문의해주세요:\n📞 고객센터: fixcar.kr/contact\n💬 카카오톡 채널: @픽스카\n\n또는 아래 자주 묻는 질문을 확인해보세요!" }]);
      }
      setShowFaq(true);
    }, 300);
  };

  return (
    <>
      {/* TMI 말풍선 */}
      {showTmi && !open && (
        <div onClick={() => { setShowTmi(false); setOpen(true); }} style={{
          position: "fixed", bottom: 155, right: 20, maxWidth: 280, background: "white",
          borderRadius: "16px 16px 4px 16px", padding: "14px 16px", boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          zIndex: 9989, cursor: "pointer", border: "1px solid #E8E6E1",
          animation: "tmiFadeIn 0.4s ease-out",
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#FF3B1E", marginBottom: 6, letterSpacing: 1 }}>🚗 자동차 TMI</div>
          <div style={{ fontSize: 13, color: "#444", lineHeight: 1.7, fontWeight: 500 }}>{tmi}</div>
          <button onClick={(e) => { e.stopPropagation(); setShowTmi(false); }} style={{
            position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: "50%",
            background: "#F0EEE9", border: "1px solid #E0DDD7", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#AAA",
          }}>✕</button>
        </div>
      )}

      {/* 플로팅 버튼 */}
      {!open && (
        <button onClick={() => { setOpen(true); setShowTmi(false); }} style={{
          position: "fixed", bottom: 90, right: 20, width: 56, height: 56,
          borderRadius: "50%", background: "linear-gradient(135deg,#FF3B1E,#CC2200)",
          color: "white", border: "none", cursor: "pointer", zIndex: 9990,
          boxShadow: "0 4px 20px rgba(255,59,30,0.4)", display: "flex",
          alignItems: "center", justifyContent: "center", transition: "transform 0.2s",
        }}>
          <MessageCircle size={24} />
          {showTmi && <span style={{ position: "absolute", top: -2, right: -2, width: 12, height: 12, background: "#2D8A52", borderRadius: "50%", border: "2px solid white" }} />}
        </button>
      )}

      {/* 채팅창 */}
      {open && (
        <div style={{
          position: "fixed", bottom: 0, right: 0, width: "100%", maxWidth: 400, height: "100dvh",
          background: "white", zIndex: 9990, display: "flex", flexDirection: "column",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.1)",
        }}>
          {/* 헤더 */}
          <div style={{ background: "linear-gradient(135deg,#FF3B1E,#CC2200)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>픽스카 도우미</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>자주 묻는 질문 자동 응답</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ border: "none", background: "rgba(255,255,255,0.2)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={18} color="white" />
            </button>
          </div>

          {/* 메시지 영역 */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10, WebkitOverflowScrolling: "touch" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                {m.role === "bot" && (
                  <div style={{ fontSize: 10, color: "#AAA", marginBottom: 3, paddingLeft: 2 }}>픽스카 도우미</div>
                )}
                <div style={{
                  padding: "12px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user" ? "#FF3B1E" : "#F8F7F4",
                  color: m.role === "user" ? "white" : "#333",
                  fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-line", fontWeight: 500,
                }}>{m.text}</div>
              </div>
            ))}

            {/* FAQ 퀵 버튼 */}
            {showFaq && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                <div style={{ fontSize: 11, color: "#AAA", paddingLeft: 4 }}>자주 묻는 질문</div>
                {FAQ_DATA.map((f, i) => (
                  <button key={i} onClick={() => handleFaq(f)} style={{
                    padding: "12px 14px", background: "white", border: "1.5px solid #E8E6E1", borderRadius: 12,
                    fontSize: 13, fontWeight: 600, color: "#555", cursor: "pointer", textAlign: "left",
                    fontFamily: "'NanumSquareRound',sans-serif", display: "flex", alignItems: "center",
                    justifyContent: "space-between", gap: 8, transition: "border-color 0.15s",
                  }}>
                    <span>{f.q}</span>
                    <ChevronRight size={14} color="#CCC" style={{ flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            )}
            <div ref={msgEndRef} />
          </div>

          {/* 입력 — safe area 대응 */}
          <div style={{ padding: "12px 16px", paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))", borderTop: "1px solid #F0EEE9", display: "flex", gap: 8, flexShrink: 0, background: "white" }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
              placeholder="질문을 입력하세요..."
              style={{ flex: 1, padding: "12px 14px", border: "1.5px solid #E0DDD7", borderRadius: 12, fontSize: 14, fontFamily: "'NanumSquareRound',sans-serif", WebkitAppearance: "none" }}
            />
            <button onClick={handleSend} style={{ width: 44, height: 44, borderRadius: 12, background: "#FF3B1E", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 애니메이션 */}
      <style>{`
        @keyframes tmiFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
