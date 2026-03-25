"use client";
import { useState } from "react";
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

export default function FaqChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "안녕하세요! 픽스카 도우미입니다 🚗\n궁금한 것을 선택하거나 직접 질문해주세요!" },
  ]);
  const [input, setInput] = useState("");
  const [showFaq, setShowFaq] = useState(true);

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

    /* 간단한 키워드 매칭 */
    const match = FAQ_DATA.find(f =>
      f.q.toLowerCase().includes(q) ||
      q.split(" ").some(w => w.length >= 2 && f.q.includes(w))
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
      {/* 플로팅 버튼 */}
      {!open && (
        <button onClick={() => setOpen(true)} style={{
          position: "fixed", bottom: 90, right: 20, width: 56, height: 56,
          borderRadius: "50%", background: "linear-gradient(135deg,#FF3B1E,#CC2200)",
          color: "white", border: "none", cursor: "pointer", zIndex: 9990,
          boxShadow: "0 4px 20px rgba(255,59,30,0.4)", display: "flex",
          alignItems: "center", justifyContent: "center", transition: "transform 0.2s",
        }}><MessageCircle size={24} /></button>
      )}

      {/* 채팅창 */}
      {open && (
        <div style={{
          position: "fixed", bottom: 90, right: 20, width: 360, maxHeight: "70vh",
          background: "white", borderRadius: 20, boxShadow: "0 12px 48px rgba(0,0,0,0.15)",
          zIndex: 9990, display: "flex", flexDirection: "column", overflow: "hidden",
          border: "1px solid #E8E6E1",
        }}>
          {/* 헤더 */}
          <div style={{ background: "linear-gradient(135deg,#FF3B1E,#CC2200)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "white" }}>픽스카 도우미</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>자주 묻는 질문 자동 응답</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ border: "none", background: "rgba(255,255,255,0.2)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} color="white" /></button>
          </div>

          {/* 메시지 영역 */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10, maxHeight: 350 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                <div style={{
                  padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.role === "user" ? "#FF3B1E" : "#F8F7F4",
                  color: m.role === "user" ? "white" : "#333",
                  fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-line", fontWeight: 500,
                }}>{m.text}</div>
              </div>
            ))}

            {/* FAQ 퀵 버튼 */}
            {showFaq && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                {FAQ_DATA.slice(0, 5).map((f, i) => (
                  <button key={i} onClick={() => handleFaq(f)} style={{
                    padding: "8px 12px", background: "white", border: "1px solid #E0DDD7", borderRadius: 10,
                    fontSize: 12, fontWeight: 600, color: "#555", cursor: "pointer", textAlign: "left",
                    fontFamily: "'NanumSquareRound',sans-serif", display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    {f.q} <ChevronRight size={12} color="#CCC" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 입력 */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #F0EEE9", display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSend(); }} placeholder="질문을 입력하세요..." style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #E0DDD7", borderRadius: 10, fontSize: 13, fontFamily: "'NanumSquareRound',sans-serif" }} />
            <button onClick={handleSend} style={{ width: 40, height: 40, borderRadius: 10, background: "#FF3B1E", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Send size={16} /></button>
          </div>
        </div>
      )}
    </>
  );
}
