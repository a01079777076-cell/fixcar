import Navbar from "@/components/Navbar";
import { Shield, Lock, RotateCcw, Truck, MapPin, Users, Zap } from "lucide-react";

export const metadata = { title: "픽스카 소개" };

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; -webkit-font-smoothing:antialiased; }
        a { text-decoration:none; color:inherit; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <Navbar />
        <div style={{ background: "#1A1A1A", padding: "72px 52px 64px" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "3px", color: "#FF7A63", marginBottom: "12px" }}>ABOUT FIXCAR</div>
            <h1 style={{ fontSize: "clamp(32px,5vw,64px)", fontWeight: 800, color: "white", letterSpacing: "-2px", lineHeight: 1.05, marginBottom: "20px" }}>
              나, 이 차로<br /><span style={{ color: "#FF3B1E" }}>픽</span>했어
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontWeight: 400, maxWidth: "560px" }}>
              광주에서 태어나고 자란 중고차 정찰제 플랫폼.<br />
              지역 매출을 지키고, 구매자를 보호하고, 딜러를 신뢰하게 만들어요.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "64px 52px" }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "48px", marginBottom: "28px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "3px", color: "#FF3B1E", marginBottom: "14px" }}>WHY FIXCAR</div>
            <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "20px" }}>왜 픽스카를 만들었을까요?</h2>
            <p style={{ fontSize: "16px", color: "#555", lineHeight: 1.9, fontWeight: 400 }}>
              광주 시민들이 중고차를 살 때 서울·수도권의 대형 플랫폼에서 구매하면 수수료와 수익이 모두 외부로 빠져나가요.
              픽스카는 이 흐름을 바꾸고자 만들어졌어요.
              <br /><br />
              광주 딜러, 광주 구매자, 광주 서비스. 모든 수익이 광주에 남아요.
              AI 기반으로 개발 비용까지 지역 내에서 해결했어요.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
            {[
              { icon: <Shield size={24} color="white" />, title: "100항목 검수", desc: "전문 정비사가 직접 확인한 차만 등록해요", color: "#FF3B1E" },
              { icon: <Lock size={24} color="white" />, title: "FIX 정찰가", desc: "표시 가격 = 최종 가격. 흥정 없어요", color: "#1847FF" },
              { icon: <RotateCcw size={24} color="white" />, title: "3일 환불 보장", desc: "구매 후 3일 이내 100% 환불", color: "#2D8A52" },
              { icon: <Truck size={24} color="white" />, title: "전국 탁송", desc: "계약 후 집 앞까지 배달해드려요", color: "#E8A020" },
              { icon: <MapPin size={24} color="white" />, title: "광주 기반", desc: "광주 전용 플랫폼으로 지역 경제 기여", color: "#FF3B1E" },
              { icon: <Users size={24} color="white" />, title: "일자리 창출", desc: "텔레마케팅, 관리직, 직영 딜러 채용", color: "#1847FF" },
            ].map(item => (
              <div key={item.title} style={{ background: "white", borderRadius: "18px", padding: "24px" }}>
                <div style={{ width: "48px", height: "48px", background: item.color, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>{item.icon}</div>
                <div style={{ fontSize: "17px", fontWeight: 800, marginBottom: "6px" }}>{item.title}</div>
                <div style={{ fontSize: "14px", color: "#888", fontWeight: 400, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#1847FF", borderRadius: "24px", padding: "48px", textAlign: "center" }}>
            <Zap size={36} color="white" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "28px", fontWeight: 800, color: "white", letterSpacing: "-1px", marginBottom: "12px" }}>딜러로 참여하고 싶으신가요?</h3>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", marginBottom: "24px", fontWeight: 400 }}>픽스카 딜러가 되어 광주 중고차 시장을 함께 만들어요</p>
            <a href="/dealer/apply">
              <button style={{ background: "white", color: "#1847FF", border: "none", padding: "14px 36px", borderRadius: "100px", fontSize: "15px", fontWeight: 800, cursor: "pointer" }}>딜러 신청하기</button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
