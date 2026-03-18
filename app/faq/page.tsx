"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { cat: "구매", q: "FIX 정찰가란 무엇인가요?", a: "픽스카의 모든 매물은 가격이 고정(FIX)돼 있어요. 표시된 가격이 최종 가격이에요. 추가 비용이나 가격 흥정이 없어요." },
  { cat: "구매", q: "3일 환불 보장이 실제로 되나요?", a: "네, 계약 후 3일 이내 이유 불문 100% 환불이에요. 단, 차량을 운행한 경우 주행거리에 따라 일부 비용이 발생할 수 있어요." },
  { cat: "구매", q: "할부 구매가 가능한가요?", a: "네! 캐피탈 금융사를 통해 할부 구매 가능해요. 차량 상세 페이지의 할부 계산기를 이용해 월 납입금을 확인할 수 있어요." },
  { cat: "구매", q: "전국 배송이 되나요?", a: "네, 계약 완료 후 전국 어디든 탁송 서비스를 제공해요. 탁송 비용은 지역에 따라 다르며 담당 딜러가 안내해드려요." },
  { cat: "검수", q: "100항목 검수는 어떻게 하나요?", a: "전문 정비사가 엔진, 변속기, 제동장치, 외관, 전기장치 등 100개 항목을 직접 점검해요. 점검 보고서는 차량 상세 페이지에서 확인할 수 있어요." },
  { cat: "검수", q: "무사고 차량이 확실한가요?", a: "보험개발원 카히스토리를 통해 사고 이력을 확인해요. 단, 자비 수리나 비보험 처리된 경우는 기록에 없을 수 있어요." },
  { cat: "딜러", q: "딜러 신청은 어떻게 하나요?", a: "상단 메뉴 또는 딜러 신청 페이지(/dealer/apply)에서 사업자 정보를 입력해 신청하면 돼요. 운영팀 검토 후 3 영업일 내 결과를 알려드려요." },
  { cat: "딜러", q: "딜러 수수료는 얼마인가요?", a: "매물 등록 기본 29,000원, 프리미엄 홍보 59,000원이에요. 거래 성사 수수료는 별도로 없어요." },
  { cat: "결제", q: "어떤 결제 수단을 지원하나요?", a: "카카오페이, 토스페이, 신용·체크카드를 지원해요. 포트원(PortOne) PG사를 통해 안전하게 결제해요." },
  { cat: "결제", q: "개인정보는 안전한가요?", a: "카드 정보는 저장되지 않으며, 모든 결제는 암호화된 경로로 처리돼요." },
];

const CATS = ["전체", "구매", "검수", "딜러", "결제"];

export default function FaqPage() {
  const [activeCat, setActiveCat] = useState("전체");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const filtered = FAQS.filter(f => activeCat === "전체" || f.cat === activeCat);

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        button { font-family:'NanumSquareRound',sans-serif; cursor:pointer; }
        .faq-item { cursor:pointer; transition:background 0.15s; border-radius:14px; }
        .faq-item:hover { background:#FAFAF8; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <Navbar />
        <div style={{ background: "#1A1A1A", padding: "56px 52px 48px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "3px", color: "#FF7A63", marginBottom: "12px" }}>FAQ</div>
            <h1 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 800, color: "white", letterSpacing: "-1.5px" }}>자주 묻는 질문</h1>
          </div>
        </div>

        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "36px 52px 80px" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
            {CATS.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding: "8px 20px", borderRadius: "100px", border: `2px solid ${activeCat === cat ? "#1A1A1A" : "#E0DDD7"}`, background: activeCat === cat ? "#1A1A1A" : "white", color: activeCat === cat ? "white" : "#555", fontSize: "14px", fontWeight: 700 }}>{cat}</button>
            ))}
          </div>

          <div style={{ background: "white", borderRadius: "20px", overflow: "hidden" }}>
            {filtered.map((faq, i) => (
              <div key={i} className="faq-item" onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{ padding: "20px 24px", borderBottom: i < filtered.length - 1 ? "1px solid #F0EEE9" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ background: "#EEF2FF", color: "#1847FF", padding: "2px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: 800 }}>{faq.cat}</span>
                    <span style={{ fontSize: "15px", fontWeight: 700 }}>{faq.q}</span>
                  </div>
                  <ChevronDown size={18} color="#AAA" style={{ flexShrink: 0, transform: openIdx === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </div>
                {openIdx === i && (
                  <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #F0EEE9", fontSize: "14px", color: "#555", lineHeight: 1.8, fontWeight: 400 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ background: "#FF3B1E", borderRadius: "20px", padding: "32px", textAlign: "center", marginTop: "24px" }}>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "white", marginBottom: "8px" }}>더 궁금한 게 있으신가요?</div>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", marginBottom: "18px", fontWeight: 400 }}>고객센터에 문의해주세요</p>
            <a href="/contact"><button style={{ background: "white", color: "#FF3B1E", border: "none", padding: "12px 32px", borderRadius: "100px", fontSize: "14px", fontWeight: 800, cursor: "pointer" }}>문의하기</button></a>
          </div>
        </div>
      </div>
    </>
  );
}
