"use client";
import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"40px 24px 100px"}}>
          <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>개인정보 처리방침</h1>
          <p style={{fontSize:13,color:"#AAA",marginBottom:28}}>시행일: 2025년 3월 1일</p>
          <div style={{background:"white",borderRadius:20,padding:"32px 30px"}}>
            {[
              {title:"1. 수집하는 개인정보 항목",content:"회사는 서비스 이용을 위해 다음 정보를 수집합니다.\n- 필수: 이름, 이메일 (카카오 로그인 시 자동 수집)\n- 선택: 전화번호 (문의 시)\n- 자동 수집: 접속 IP, 브라우저 정보, 방문 기록"},
              {title:"2. 개인정보 수집 및 이용 목적",content:"- 회원 관리: 가입·본인 확인, 서비스 이용\n- 서비스 제공: 차량 매물 정보, 딜러 문의 연결, MBTI 결과 저장\n- 마케팅: 신규 매물 알림, 이벤트 안내 (동의 시)"},
              {title:"3. 개인정보 보유 및 이용 기간",content:"회원 탈퇴 시 지체 없이 파기합니다. 단, 관련 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다.\n- 전자상거래법: 계약·결제 기록 5년\n- 통신비밀보호법: 접속 기록 3개월"},
              {title:"4. 개인정보 제3자 제공",content:"회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 이용자 동의가 있거나 법령에 의한 경우는 예외로 합니다."},
              {title:"5. 개인정보의 파기",content:"보유 기간 경과 또는 처리 목적 달성 시 지체 없이 파기합니다. 전자적 파일은 복구 불가능한 방법으로, 종이 문서는 분쇄 또는 소각합니다."},
              {title:"6. 이용자의 권리",content:"이용자는 언제든지 개인정보 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다. 마이페이지 또는 고객센터를 통해 행사할 수 있습니다."},
              {title:"7. 개인정보 보호책임자",content:"성명: 대표\n이메일: privacy@fixcar.kr\n전화: 062-000-0000"},
              {title:"8. 개인정보 안전성 확보 조치",content:"- 개인정보 암호화 (AES-256)\n- 접근 권한 관리\n- 보안 프로그램 설치 및 갱신\n- 접속 기록 보관 및 위·변조 방지"},
            ].map((s,i)=>(
              <div key={i} style={{marginBottom:24}}>
                <h3 style={{fontSize:16,fontWeight:800,marginBottom:8}}>{s.title}</h3>
                <p style={{fontSize:14,color:"#666",lineHeight:1.9,fontWeight:400,whiteSpace:"pre-line"}}>{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
