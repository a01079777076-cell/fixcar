import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9",fontFamily:"'NanumSquareRound',sans-serif"}}>
        <div style={{background:"#1A1A1A",padding:"44px 24px 36px"}}><div style={{maxWidth:800,margin:"0 auto"}}><h1 style={{fontSize:28,fontWeight:800,color:"white"}}>🔒 개인정보처리방침</h1></div></div>
        <div style={{maxWidth:800,margin:"0 auto",padding:"32px 24px 100px"}}>
          <div style={{background:"white",borderRadius:20,padding:"36px 32px",fontSize:14,color:"#555",lineHeight:2.2}}>
            <p style={{fontSize:12,color:"#AAA",marginBottom:16}}>시행일: 2025년 1월 1일</p>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1A1A1A",marginBottom:8}}>1. 수집하는 개인정보</h2>
            <p>필수: 이름, 이메일, 비밀번호(자체 가입), 휴대폰번호<br/>선택: 닉네임, 관심 차종<br/>자동 수집: IP 주소, 방문 기록, 쿠키</p>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1A1A1A",margin:"24px 0 8px"}}>2. 이용 목적</h2>
            <p>회원 관리, 서비스 제공, 문의 응대, 맞춤 매물 추천, 서비스 개선, 통계 분석</p>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1A1A1A",margin:"24px 0 8px"}}>3. 보유 기간</h2>
            <p>회원 탈퇴 시 즉시 파기합니다. 단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1A1A1A",margin:"24px 0 8px"}}>4. 제3자 제공</h2>
            <p>원칙적으로 제3자에게 제공하지 않습니다. 단, 차량 문의 시 해당 딜러에게 연락처가 공유될 수 있습니다.</p>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1A1A1A",margin:"24px 0 8px"}}>5. 쿠키 사용</h2>
            <p>로그인 유지 및 서비스 개선을 위해 쿠키를 사용합니다. 브라우저 설정에서 거부할 수 있으나, 일부 서비스 이용이 제한될 수 있습니다.</p>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1A1A1A",margin:"24px 0 8px"}}>6. 이용자의 권리</h2>
            <p>개인정보 열람, 수정, 삭제를 요청할 수 있으며, 설정 페이지에서 직접 처리하거나 고객센터로 문의해주세요.</p>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1A1A1A",margin:"24px 0 8px"}}>7. 개인정보 보호책임자</h2>
            <p>이메일: help@fixcar.kr</p>
            <div style={{background:"#F8F7F4",borderRadius:12,padding:"16px 20px",marginTop:24,fontSize:12,color:"#AAA"}}>본 방침은 2025년 1월 1일부터 적용됩니다.</div>
          </div>
        </div>
      </div>
    </>
  );
}
