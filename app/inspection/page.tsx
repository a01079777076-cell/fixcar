"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Shield, CheckCircle, Phone, MapPin, Clock, Star, Award } from "lucide-react";

const INSPECTION_SHOPS = [
  {
    id: 1, name: "광주 북구 카닥터", area: "광주 북구", address: "광주 북구 용봉로 123",
    phone: "062-123-4567", hours: "평일 09:00~18:00", rating: 4.9, inspections: 87,
    certified: true, desc: "15년 경력 정비사 2명 상주, 수입차 전문 검수 가능",
    features: ["엔진 정밀 진단", "하부 리프트 검사", "도장 두께 측정", "OBD 스캔"],
  },
];

const PLANS = [
  { name: "기본 검수", price: 15, deposit: 1, onsite: 14, items: ["외관 상태 점검", "엔진룸 점검", "하부 누유 확인", "시운전 점검", "성능점검기록 대조", "사고이력 확인"], recommended: true },
  { name: "정밀 검수", price: 25, deposit: 1, onsite: 24, items: ["기본 검수 전 항목", "도장 두께 측정", "OBD 전자장비 스캔", "미션/변속기 점검", "에어컨/히터 점검", "타이어/브레이크 마모", "배터리 상태 확인"], recommended: false },
  { name: "프리미엄 검수", price: 35, deposit: 1, onsite: 34, items: ["정밀 검수 전 항목", "수입차 전용 진단", "서스펜션 정밀 검사", "실내 유해물질 측정", "검수 리포트 PDF 제공", "30일 하자 보증"], recommended: false },
];

export default function InspectionPage() {
  const [selectedPlan, setSelectedPlan] = useState(0);

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        {/* 히어로 */}
        <div style={{ background: "linear-gradient(135deg,#2D8A52,#1A6B3A)", padding: "48px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, bottom: -20, fontFamily: "'Bebas Neue',serif", fontSize: "clamp(80px,15vw,150px)", color: "rgba(255,255,255,0.08)", lineHeight: 1 }}>INSPECT</div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <Shield size={40} color="white" style={{ marginBottom: 16 }} />
            <h1 style={{ fontSize: "clamp(24px,5vw,32px)", fontWeight: 800, color: "white", marginBottom: 8 }}>중고차 검수 서비스</h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: 20 }}>
              FIXCAR 공식 인증 검수업체가<br />차량 상태를 꼼꼼하게 확인해드립니다
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", borderRadius: 100, padding: "10px 24px" }}>
              <Award size={16} color="#FEE500" />
              <span style={{ fontSize: 14, fontWeight: 800, color: "white" }}>FIXCAR 공식 인증 검수</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 16px 100px" }}>
          {/* 가격 플랜 */}
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>💰 검수 플랜</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 32 }}>
            {PLANS.map((plan, i) => (
              <button key={plan.name} onClick={() => setSelectedPlan(i)} style={{
                background: "white", borderRadius: 18, padding: "24px 16px", textAlign: "center", cursor: "pointer",
                border: selectedPlan === i ? "2px solid #2D8A52" : "1px solid #E8E6E1", position: "relative",
                fontFamily: "'NanumSquareRound',sans-serif",
              }}>
                {plan.recommended && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#FF3B1E", color: "white", fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 100 }}>추천</div>}
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>{plan.name}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#2D8A52" }}>{plan.price}<span style={{ fontSize: 14, color: "#AAA" }}>만원</span></div>
                <div style={{ fontSize: 11, color: "#AAA", marginTop: 4, lineHeight: 1.6 }}>
                  계약금 {plan.deposit}만<br />현장 {plan.onsite}만
                </div>
              </button>
            ))}
          </div>

          {/* 선택된 플랜 상세 */}
          <div style={{ background: "white", borderRadius: 18, padding: "24px", marginBottom: 28, border: "2px solid #2D8A52" }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle size={18} color="#2D8A52" /> {PLANS[selectedPlan].name} 포함 항목
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {PLANS[selectedPlan].items.map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#555", padding: "6px 0" }}>
                  <CheckCircle size={12} color="#2D8A52" /> {item}
                </div>
              ))}
            </div>
            <div style={{ background: "#F0FAF4", borderRadius: 12, padding: "14px 18px", marginTop: 16, fontSize: 12, color: "#2D8A52", lineHeight: 1.8 }}>
              💳 계약금 {PLANS[selectedPlan].deposit}만원은 사이트에서 결제 · 나머지 {PLANS[selectedPlan].onsite}만원은 검수 현장에서 결제
            </div>
          </div>

          {/* 검수 업체 */}
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>🏪 FIXCAR 공식 인증 검수업체</h2>
          {INSPECTION_SHOPS.map(shop => (
            <div key={shop.id} style={{ background: "white", borderRadius: 18, overflow: "hidden", marginBottom: 16, border: "1px solid #E8E6E1" }}>
              <div style={{ background: "linear-gradient(135deg,#2D8A52dd,#2D8A52)", padding: "20px 24px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800 }}>{shop.name}</h3>
                    {shop.certified && <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 100, padding: "2px 10px", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}><Award size={10} /> FIXCAR 인증</span>}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>{shop.area}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 16, fontWeight: 800 }}><Star size={14} fill="white" /> {shop.rating}</div>
                  <div style={{ fontSize: 10, opacity: 0.7 }}>검수 {shop.inspections}건</div>
                </div>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, marginBottom: 14 }}>{shop.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#888" }}><MapPin size={14} color="#CCC" /> {shop.address}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#888" }}><Phone size={14} color="#CCC" /> {shop.phone}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#888" }}><Clock size={14} color="#CCC" /> {shop.hours}</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {shop.features.map(f => (
                    <span key={f} style={{ padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "#F0FAF4", color: "#2D8A52" }}>✓ {f}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div style={{ background: "#F8F7F4", borderRadius: 14, padding: "16px 20px", marginBottom: 24, fontSize: 12, color: "#AAA", lineHeight: 1.8, textAlign: "center" }}>
            🏪 검수업체 추가 입점 문의: fixcar.kr/contact<br />
            4개월 무료 광고 + FIXCAR 공식 인증 배지 제공
          </div>

          <Link href="/contact">
            <button style={{ width: "100%", padding: "20px", background: "linear-gradient(135deg,#2D8A52,#1A6B3A)", color: "white", border: "none", borderRadius: 18, fontSize: 18, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Phone size={18} /> 검수 예약 문의하기
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
