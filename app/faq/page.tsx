// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/faq/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "픽스카는 어떤 서비스인가요?", a: "픽스카는 광주·전남 지역 전문 중고차 정찰가 플랫폼입니다. 흥정 없는 FIX 정찰가와 전문 검수 서비스로 안전한 중고차 거래를 제공합니다." },
  { q: "FIX 정찰가란 무엇인가요?", a: "시세를 기반으로 산정된 고정 가격입니다. 딜러가 임의로 가격을 올리거나 흥정을 유도하지 않으며, 표시된 가격이 최종 차량 가격입니다." },
  { q: "매물은 어떻게 등록하나요?", a: "딜러 회원으로 가입 후 딜러 대시보드에서 매물을 등록할 수 있습니다. 등록된 매물은 관리자 검수를 거쳐 공개됩니다." },
  { q: "개인도 차량을 판매할 수 있나요?", a: "현재는 인증 딜러만 매물을 등록할 수 있습니다. 개인 판매는 거래대행 서비스를 이용해주세요." },
  { q: "거래대행 서비스는 무엇인가요?", a: "당근마켓 등 개인간 거래 시 전문 딜러가 차량 검수, 서류 대행, 명의이전까지 대행하는 서비스입니다. 대행료는 15~20만원입니다." },
  { q: "검수는 어떻게 진행되나요?", a: "제휴 검수업체에서 100개 항목을 직접 점검합니다. 검수 완료 차량에는 'FIXCAR 검수 완료' 뱃지가 부여됩니다." },
  { q: "결제는 어떻게 하나요?", a: "차량 대금은 딜러와 직접 거래하며, 검수비·대행료 등 서비스 이용료만 픽스카에서 결제합니다." },
  { q: "환불 규정은 어떻게 되나요?", a: "서비스 이용료(광고비 등)는 결제 후 환불이 불가합니다. 자세한 내용은 이용약관을 확인해주세요." },
  { q: "허위매물은 어떻게 처리되나요?", a: "허위매물 신고 시 삼진아웃 제도가 적용됩니다. 3회 적발 시 해당 딜러는 영구 퇴출됩니다." },
  { q: "앱으로도 이용할 수 있나요?", a: "현재 웹 서비스로 운영 중이며, 모바일 앱은 준비 중입니다." },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 100px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>❓ 자주 묻는 질문</h1>
          <p style={{ fontSize: 14, color: "#AAA", marginBottom: 32 }}>픽스카 이용에 대한 궁금증을 해결해드립니다.</p>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: "white", borderRadius: 14, marginBottom: 8, overflow: "hidden" }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", padding: "18px 22px", border: "none", background: "none", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'NanumSquareRound',sans-serif" }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{faq.q}</span>
                <ChevronDown size={18} color="#AAA" style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
              </button>
              {open === i && <div style={{ padding: "0 22px 18px", fontSize: 14, color: "#666", lineHeight: 1.8 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
