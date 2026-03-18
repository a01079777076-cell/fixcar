import Navbar from "@/components/Navbar";
export const metadata = { title: "이용약관" };

export default function TermsPage() {
  const sections = [
    { title: "제1조 (목적)", content: "이 약관은 픽스카(이하 '회사')가 운영하는 픽스카 서비스(이하 '서비스')의 이용 조건 및 절차, 회사와 이용자의 권리·의무 및 책임 사항을 규정하는 것을 목적으로 해요." },
    { title: "제2조 (정의)", content: "· '서비스': 회사가 제공하는 중고차 정보 및 거래 중개 플랫폼\n· '이용자': 서비스에 접속하여 이 약관에 따라 서비스를 받는 회원 및 비회원\n· '회원': 서비스에 가입하여 이용자 아이디를 부여받은 자\n· '딜러': 서비스를 통해 차량 매물을 등록·판매하는 사업자" },
    { title: "제3조 (약관의 효력)", content: "이 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용되며, 이 약관에 동의하면 서비스를 이용할 수 있어요." },
    { title: "제4조 (FIX 정찰가 정책)", content: "픽스카의 모든 매물은 FIX 정찰가 정책을 따라요.\n· 등록된 가격이 최종 판매 가격이에요\n· 구매자와 딜러 간 별도 가격 협상은 픽스카 정책 위반이에요\n· 위반 시 서비스 이용이 제한될 수 있어요" },
    { title: "제5조 (3일 환불 정책)", content: "픽스카는 구매자 보호를 위해 3일 환불 정책을 운영해요.\n· 차량 인도 후 3일(72시간) 이내 환불 요청 가능\n· 차량 운행 거리에 따라 감가될 수 있어요\n· 단, 고의 훼손 또는 개조된 경우 환불이 제한될 수 있어요" },
    { title: "제6조 (면책 조항)", content: "회사는 다음의 경우 책임을 지지 않아요.\n· 천재지변 등 불가항력으로 서비스를 제공할 수 없는 경우\n· 이용자의 귀책 사유로 발생한 서비스 이용 장애\n· 이용자가 서비스를 통해 얻은 정보를 이용하여 발생한 손해" },
  ];

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'NanumSquareRound',sans-serif; background:#F0EEE9; }
        a { text-decoration:none; color:inherit; }
        pre { white-space:pre-wrap; font-family:'NanumSquareRound',sans-serif; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <Navbar />
        <div style={{ background: "#1A1A1A", padding: "56px 52px 48px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "3px", color: "#FF7A63", marginBottom: "12px" }}>TERMS OF SERVICE</div>
            <h1 style={{ fontSize: "clamp(26px,4vw,48px)", fontWeight: 800, color: "white", letterSpacing: "-1.5px" }}>이용약관</h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginTop: "10px", fontWeight: 400 }}>최종 수정일: 2025년 3월 18일</p>
          </div>
        </div>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "36px 52px 80px" }}>
          {sections.map((s, i) => (
            <div key={i} style={{ background: "white", borderRadius: "18px", padding: "28px 32px", marginBottom: "14px" }}>
              <div style={{ fontSize: "17px", fontWeight: 800, marginBottom: "14px", color: "#FF3B1E" }}>{s.title}</div>
              <pre style={{ fontSize: "14px", color: "#555", lineHeight: 1.85, fontWeight: 400 }}>{s.content}</pre>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
