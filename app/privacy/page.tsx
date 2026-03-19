"use client";
import Navbar from "@/components/Navbar";
export default function PrivacyPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{maxWidth:"800px",margin:"0 auto",padding:"40px 32px 80px"}}>
          <h1 style={{fontSize:"28px",fontWeight:800,marginBottom:"6px",letterSpacing:"-1px"}}>개인정보처리방침</h1>
          <p style={{fontSize:"14px",color:"#AAA",fontWeight:400,marginBottom:"32px"}}>시행일: 2026년 3월 1일</p>
          {[
            ["1. 개인정보의 처리 목적", "픽스카(FIXCAR)는 다음의 목적을 위하여 개인정보를 처리합니다.\n\n① 회원 가입 및 관리: 회원 식별, 서비스 이용 의사 확인, 서비스 제공\n② 서비스 제공: 중고차 거래 중개, 차량 정보 제공, 딜러 연결, 알림 발송\n③ 마케팅 및 광고: 신규 서비스 안내, 이벤트 정보 제공 (동의 시)\n④ 고객 상담: 문의 접수 및 처리, 불만 처리"],
            ["2. 처리하는 개인정보 항목", "① 필수 항목: 이메일 주소, 이름, 비밀번호\n② 선택 항목: 휴대폰 번호, 카카오 계정 정보 (소셜 로그인 시)\n③ 자동 수집: 접속 IP, 서비스 이용 기록, 쿠키"],
            ["3. 개인정보의 처리 및 보유 기간", "① 회원 정보: 회원 탈퇴 후 30일 보관 후 삭제\n② 거래 기록: 관련 법령에 따라 최대 5년 보관\n③ 고객 문의: 처리 완료 후 1년 보관"],
            ["4. 개인정보의 제3자 제공", "회사는 정보주체의 별도 동의 없이 제3자에게 개인정보를 제공하지 않습니다. 단, 다음의 경우는 예외입니다.\n① 정보주체의 동의가 있는 경우\n② 법령의 규정에 의한 경우"],
            ["5. 개인정보 보호책임자", "성명: 픽스카 운영팀\n이메일: contact@fixcar.kr\n연락처: 062-000-0000"],
            ["6. 권리·의무 및 행사 방법", "이용자는 개인정보주체로서 다음의 권리를 행사할 수 있습니다.\n① 개인정보 열람 요구\n② 오류 등이 있을 경우 정정 요구\n③ 삭제 요구\n④ 처리 정지 요구\n\n위 권리의 행사는 fixcar.kr의 마이페이지 또는 이메일(contact@fixcar.kr)을 통해 하실 수 있습니다."],
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
