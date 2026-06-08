// 📁 저장 경로: components/FaqChatbot.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, ChevronRight, ChevronDown } from "lucide-react";
import { CAR_TMI } from "@/data/tmi";

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
  const disabledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idxRef = useRef(-1);

  const clearTimer = () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };

  /* 직전과 다른 랜덤 팁 선택 */
  const pickTip = () => {
    if (CAR_TMI.length === 0) return "";
    let n = Math.floor(Math.random() * CAR_TMI.length);
    if (CAR_TMI.length > 1) {
      while (n === idxRef.current) n = Math.floor(Math.random() * CAR_TMI.length);
    }
    idxRef.current = n;
    return CAR_TMI[n];
  };

  /* TMI 말풍선 순환 — 20초 노출 / 5초 쉼 / 새 문구 (재시작 가능) */
  const showCycle = () => {
    if (disabledRef.current) return;
    setTmi(pickTip());
    setShowTmi(true);
    clearTimer();
    timerRef.current = setTimeout(() => {
      setShowTmi(false);
      clearTimer();
      timerRef.current = setTimeout(showCycle, 5000);
    }, 20000);
  };

  /* 마운트 시 1회 시작 (오늘 하루 끄기 상태면 보류) */
  useEffect(() => {
    const disabledUntil = localStorage.getItem("fixcar_tmi_disabled_until");
    if (disabledUntil && Date.now() < Number(disabledUntil)) {
      disabledRef.current = true;
      return;
    }
    timerRef.current = setTimeout(showCycle, 2000);
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* "다음 꿀팁" — 새 팁 즉시 표시하고 순환 재개 */
  const showNextTip = () => {
    disabledRef.current = false;
    showCycle();
  };

  /* "오늘 하루 끄기" — 24시간 동안 비활성화 */
  const disableForDay = () => {
    localStorage.setItem("fixcar_tmi_disabled_until", String(Date.now() + 24 * 60 * 60 * 1000));
    disabledRef.current = true;
    clearTimer();
    setShowTmi(false);
  };

  /* 챗봇 명령으로 다시 켜기 — '오늘 하루 끄기'를 누른 사용자도 즉시 복구 */
  const enableTmi = () => {
    localStorage.removeItem("fixcar_tmi_disabled_until");
    disabledRef.current = false;
    clearTimer();
    timerRef.current = setTimeout(showCycle, 600);
  };

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
    const raw = input.trim();
    const q = raw.toLowerCase();

    /* TMI/꿀팁 다시 켜기 명령 인식 */
    const norm = q.replace(/\s/g, "");
    const isTmiWord = norm.includes("tmi") || norm.includes("꿀팁") || norm.includes("팁");
    const isOnWord = norm.includes("켜") || norm.includes("on") || norm.includes("다시") || norm.includes("보여") || norm.includes("알려");
    if (isTmiWord && isOnWord) {
      enableTmi();
      setMessages(prev => [...prev, { role: "user", text: raw }, { role: "bot", text: "자동차 TMI/꿀팁 알림을 다시 켰어요! 🚗\n채팅창을 닫으면 화면에 꿀팁이 다시 떠요. (말풍선의 '오늘 하루 끄기'를 눌렀어도 복구됩니다)" }]);
      setInput("");
      return;
    }

    setMessages(prev => [...prev, { role: "user", text: raw }]);
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
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button onClick={(e) => { e.stopPropagation(); disableForDay(); }} style={{
              padding: "5px 10px", background: "transparent", border: "1px solid #E0DDD7",
              borderRadius: 8, fontSize: 11, color: "#999", cursor: "pointer", fontWeight: 600,
              fontFamily: "'NanumSquareRound',sans-serif",
            }}>오늘 하루 끄기</button>
            <button onClick={(e) => { e.stopPropagation(); showNextTip(); }} style={{
              padding: "5px 12px", background: "#FFF0ED", border: "1px solid #FFD3C9",
              borderRadius: 8, fontSize: 11, color: "#FF3B1E", cursor: "pointer", fontWeight: 800,
              fontFamily: "'NanumSquareRound',sans-serif", display: "flex", alignItems: "center", gap: 4,
            }}>다음 꿀팁 <ChevronRight size={12} /></button>
          </div>
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
          background: "white", zIndex: 10001, display: "flex", flexDirection: "column",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.1)",
        }}>
          {/* 헤더 */}
          <div style={{ background: "linear-gradient(135deg,#FF3B1E,#CC2200)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>픽스카 도우미</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>자주 묻는 질문 자동 응답</div>
            </div>
            <button
              aria-label="축소"
              onClick={() => setOpen(false)}
              style={{
                border: "none", background: "white", borderRadius: "50%",
                width: 40, height: 40, display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              }}
            >
              <ChevronDown size={22} color="#FF3B1E" strokeWidth={2.5} />
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
