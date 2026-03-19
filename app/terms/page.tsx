"use client";
import Navbar from "@/components/Navbar";
export default function TermsPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{maxWidth:"800px",margin:"0 auto",padding:"40px 32px 80px"}}>
          <h1 style={{fontSize:"28px",fontWeight:800,marginBottom:"6px",letterSpacing:"-1px"}}>이용약관</h1>
          <p style={{fontSize:"14px",color:"#AAA",fontWeight:400,marginBottom:"32px"}}>시행일: 2026년 3월 1일</p>
          {[
            ["제1조 (목적)", "이 약관은 픽스카(FIXCAR, 이하 '회사')가 제공하는 중고차 거래 중개 서비스(이하 '서비스')의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다."],
            ["제2조 (정의)", "① '서비스'란 회사가 fixcar.kr을 통해 제공하는 중고차 거래 중개, 차량 정보 제공, 딜러 연결 등 일체의 서비스를 말합니다.\n② '이용자'란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.\n③ '회원'이란 회사와 서비스 이용계약을 체결한 자를 말합니다.\n④ '딜러'란 회사의 심사를 통해 등록된 중고차 판매 사업자를 말합니다."],
            ["제3조 (약관의 효력 및 변경)", "① 이 약관은 서비스를 이용하고자 하는 모든 이용자에게 효력이 있습니다.\n② 회사는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위에서 약관을 변경할 수 있습니다.\n③ 변경된 약관은 홈페이지 공지를 통해 공시하며, 공시 후 7일 이내에 이의를 제기하지 않은 경우 동의한 것으로 봅니다."],
            ["제4조 (회원가입)", "① 이용자는 회사가 정한 양식에 따라 가입 신청을 하고, 회사가 이를 승인함으로써 회원이 됩니다.\n② 회사는 다음 각 호에 해당하는 경우 가입 신청을 거부할 수 있습니다.\n - 타인의 정보를 도용한 경우\n - 허위 정보를 기재한 경우\n - 기타 회사가 정한 요건을 충족하지 않는 경우"],
            ["제5조 (FIX 정찰가 정책)", "① 회사는 등록된 모든 매물에 FIX 정찰가를 적용합니다.\n② FIX 정찰가는 표시된 가격이 최종 거래 가격이며, 추가 협상이 불가합니다.\n③ 딜러는 표시 가격 외 추가 비용을 요구할 수 없으며, 이를 위반 시 서비스 이용이 제한됩니다."],
            ["제6조 (환불 정책)", "① 계약금 납부 후 3일 이내에는 이유 불문 전액 환불을 보장합니다.\n② 차량 인도 후에는 차량 하자 또는 회사의 귀책사유가 있는 경우에 한해 환불이 가능합니다.\n③ 환불은 납부 수단으로 7영업일 이내 처리됩니다."],
            ["제7조 (서비스의 중단)", "① 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 또는 운영상 상당한 이유가 있는 경우 서비스를 일시적으로 중단할 수 있습니다."],
            ["제8조 (준거법)", "이 약관은 대한민국 법률에 따라 해석되고 적용됩니다."],
          ].map(([title, content]) => (
            <div key={title as string} style={{background:"white",borderRadius:"14px",padding:"20px 22px",marginBottom:"12px"}}>
              <div style={{fontSize:"16px",fontWeight:800,marginBottom:"10px"}}>{title}</div>
              <div style={{fontSize:"14px",color:"#555",lineHeight:1.85,fontWeight:400,whiteSpace:"pre-line"}}>{content}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
