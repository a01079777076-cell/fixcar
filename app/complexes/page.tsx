"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { MapPin, Clock, Phone, Car, ChevronRight } from "lucide-react";

const COMPLEXES = [
  {
    name: "첨단 자동차매매단지",
    area: "광주 광산구",
    address: "광주 광산구 첨단중앙로 123",
    phone: "062-000-0000",
    hours: "평일 09:00~18:00 / 토 09:00~15:00 / 일·공휴일 휴무",
    dealers: 45,
    desc: "광주 최대 규모의 중고차 매매단지로, 국산/수입 다양한 차량을 보유하고 있습니다.",
    features: ["대형 주차장", "금융 상담", "이전 등록 대행", "검수 센터"],
    color: "#1847FF",
  },
  {
    name: "광주 종합자동차매매시장",
    area: "광주 북구",
    address: "광주 북구 용봉로 456",
    phone: "062-000-0001",
    hours: "평일 09:00~18:00 / 토 09:00~14:00 / 일 휴무",
    dealers: 32,
    desc: "광주 북구 지역 전통 매매시장으로 오랜 역사와 신뢰를 자랑합니다.",
    features: ["정비 센터 인접", "금융사 상주", "번호판 교체", "보험 상담"],
    color: "#FF3B1E",
  },
  {
    name: "하남 자동차매매단지",
    area: "광주 광산구",
    address: "광주 광산구 하남대로 789",
    phone: "062-000-0002",
    hours: "평일 09:00~18:00 / 토 09:00~15:00",
    dealers: 28,
    desc: "하남산업단지 인근에 위치하여 접근성이 좋으며, 실용적인 가격대의 차량이 많습니다.",
    features: ["넓은 전시장", "시운전 가능", "금융 비교 서비스"],
    color: "#E8A020",
  },
  {
    name: "남구 자동차거래센터",
    area: "광주 남구",
    address: "광주 남구 봉선로 321",
    phone: "062-000-0003",
    hours: "평일 09:00~18:00 / 토 09:00~13:00",
    dealers: 18,
    desc: "남구 중심에 위치한 소규모 거래센터로, 개인 맞춤형 상담이 가능합니다.",
    features: ["개인 상담", "차량 탁송", "보증 서비스"],
    color: "#2D8A52",
  },
];

export default function ComplexesPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "linear-gradient(135deg,#0055FF,#003399)", padding: "40px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, bottom: -20, fontFamily: "'Bebas Neue',serif", fontSize: "clamp(80px,15vw,150px)", color: "rgba(255,255,255,0.08)", lineHeight: 1 }}>COMPLEX</div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏢</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 6 }}>광주 매매단지 안내</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>광주 지역 주요 중고차 매매단지를 소개합니다</p>
          </div>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px 100px" }}>
          {/* 요약 카드 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 28 }}>
            <div style={{ background: "white", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#FF3B1E" }}>{COMPLEXES.length}</div>
              <div style={{ fontSize: 12, color: "#AAA", marginTop: 4 }}>매매단지</div>
            </div>
            <div style={{ background: "white", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0066FF" }}>{COMPLEXES.reduce((s, c) => s + c.dealers, 0)}</div>
              <div style={{ fontSize: 12, color: "#AAA", marginTop: 4 }}>총 딜러</div>
            </div>
            <div style={{ background: "white", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#2D8A52" }}>광주</div>
              <div style={{ fontSize: 12, color: "#AAA", marginTop: 4 }}>지역</div>
            </div>
            <div style={{ background: "white", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#E8A020" }}>FIX</div>
              <div style={{ fontSize: 12, color: "#AAA", marginTop: 4 }}>정찰가</div>
            </div>
          </div>

          {/* 매매단지 카드 */}
          {COMPLEXES.map((c, idx) => (
            <div key={idx} style={{ background: "white", borderRadius: 20, marginBottom: 16, overflow: "hidden", border: "1px solid #E8E6E1" }}>
              <div style={{ background: `linear-gradient(135deg,${c.color}dd,${c.color})`, padding: "24px 24px 20px", color: "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{c.name}</h2>
                    <div style={{ fontSize: 13, opacity: 0.8, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {c.area}</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "8px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800 }}>{c.dealers}</div>
                    <div style={{ fontSize: 10, opacity: 0.8 }}>딜러</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, marginBottom: 16 }}>{c.desc}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#888" }}><MapPin size={14} color="#CCC" /> {c.address}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#888" }}><Phone size={14} color="#CCC" /> {c.phone}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#888", gridColumn: "span 2" }}><Clock size={14} color="#CCC" /> {c.hours}</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {c.features.map(f => (
                    <span key={f} style={{ padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "#F0F6FF", color: "#0066FF" }}>✓ {f}</span>
                  ))}
                </div>
                <Link href="/shops" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px", background: "#F8F7F4", borderRadius: 12, fontSize: 13, fontWeight: 700, color: "#555", textDecoration: "none" }}>
                  <Car size={14} /> 소속 딜러 보기 <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}

          <div style={{ background: "#F8F7F4", borderRadius: 14, padding: "16px 20px", textAlign: "center", fontSize: 12, color: "#AAA", lineHeight: 1.8 }}>
            ℹ️ 매매단지 정보는 실제 확인 후 업데이트됩니다<br />잘못된 정보가 있다면 고객센터로 알려주세요
          </div>
        </div>
      </div>
    </>
  );
}
