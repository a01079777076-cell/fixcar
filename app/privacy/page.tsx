// privacy/page.tsx
import Navbar from "@/components/Navbar";
export const metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
  const sections = [
    { title: "1. 수집하는 개인정보", content: "픽스카는 서비스 제공을 위해 다음과 같은 개인정보를 수집해요.\n\n· 필수항목: 이름, 이메일, 전화번호, 카카오 계정 정보\n· 선택항목: 차량 구매 이력, 찜 목록, 문의 내역\n· 자동수집: 접속 IP, 브라우저 정보, 쿠키" },
    { title: "2. 개인정보의 이용 목적", content: "수집한 개인정보는 다음 목적으로만 사용해요.\n\n· 회원 가입 및 서비스 제공\n· 차량 구매 및 결제 처리\n· 고객 문의 응대\n· 서비스 개선 및 통계 분석" },
    { title: "3. 개인정보 보유 기간", content: "회원 탈퇴 시 즉시 삭제해요. 단, 관련 법령에 따라 일정 기간 보관이 필요한 정보는 해당 기간 동안 보관해요.\n\n· 전자상거래 거래 기록: 5년\n· 소비자 불만 기록: 3년" },
    { title: "4. 개인정보의 제3자 제공", content: "픽스카는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않아요. 단, 다음의 경우에는 예외예요.\n\n· 이용자가 사전에 동의한 경우\n· 법령의 규정에 의한 경우" },
    { title: "5. 이용자의 권리", content: "이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제, 처리 정지를 요청할 수 있어요.\n\n문의: help@fixcar.kr" },
  ];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        pre { white-space: pre-wrap; font-family:'NanumSquareRound',sans-serif; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <Navbar />
        <div style={{ background: "#1A1A1A", padding: "56px 52px 48px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "3px", color: "#FF7A63", marginBottom: "12px" }}>PRIVACY POLICY</div>
            <h1 style={{ fontSize: "clamp(26px,4vw,48px)", fontWeight: 800, color: "white", letterSpacing: "-1.5px" }}>개인정보처리방침</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginTop: "10px", fontWeight: 400 }}>최종 수정일: 2025년 3월 18일</p>
          </div>
        </div>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "36px 52px 80px" }}>
          {sections.map((s, i) => (
            <div key={i} style={{ background: "white", borderRadius: "18px", padding: "28px 32px", marginBottom: "14px" }}>
              <div style={{ fontSize: "17px", fontWeight: 800, marginBottom: "14px", color: "#1847FF" }}>{s.title}</div>
              <pre style={{ fontSize: "14px", color: "#555", lineHeight: 1.85, fontWeight: 400 }}>{s.content}</pre>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
