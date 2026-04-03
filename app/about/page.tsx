// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/about/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Shield, Users, Target, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ background: "linear-gradient(135deg,#1A1A1A,#333)", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Bebas Neue',serif", fontSize: 48, color: "#FF3B1E", letterSpacing: 3 }}>FIXCAR</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", marginTop: 8 }}>광주의 새로운 중고차 문화</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginTop: 12, lineHeight: 1.8 }}>FIX 정찰가로 투명하게, 검수로 안전하게</p>
        </div>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 100px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
            {[
              { icon: <Shield size={28} color="#FF3B1E" />, title: "FIX 정찰가", desc: "흥정 없는 투명한 가격. 시세 기반 적정 가격만 표시합니다." },
              { icon: <Target size={28} color="#0066FF" />, title: "100항목 검수", desc: "전문 검수원이 직접 확인한 차량만 인증 뱃지를 부여합니다." },
              { icon: <Users size={28} color="#2D8A52" />, title: "광주 전문", desc: "광주·전남 지역 딜러만 입점. 지역 밀착 서비스를 제공합니다." },
              { icon: <Heart size={28} color="#E8A020" />, title: "소비자 보호", desc: "허위매물 삼진아웃, 사기 피해 예방, 거래대행 서비스." },
            ].map(v => (
              <div key={v.title} style={{ background: "white", borderRadius: 18, padding: "28px 24px" }}>
                <div style={{ marginBottom: 14 }}>{v.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{v.title}</div>
                <div style={{ fontSize: 14, color: "#888", lineHeight: 1.7 }}>{v.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "white", borderRadius: 18, padding: "28px 24px", marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 14 }}>📍 회사 정보</h2>
            <div style={{ fontSize: 14, color: "#888", lineHeight: 2 }}>
              상호: 픽스카 FIXCAR<br />
              대표: 상훈<br />
              주소: 광주광역시 (상세 주소 추후 기입)<br />
              이메일: info@fixcar.kr<br />
              고객센터: 062-000-0000 (평일 09:00~18:00)
            </div>
          </div>
          <Link href="/dealer/apply">
            <button style={{ width: "100%", padding: "18px", background: "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>딜러 입점 신청하기</button>
          </Link>
        </div>
      </div>
    </>
  );
}
