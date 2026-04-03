// 📁 저장 경로: app/privacy/page.tsx
"use client";
import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"40px 24px 100px"}}>
          <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>🔒 개인정보 처리방침</h1>
          <p style={{fontSize:13,color:"#AAA",marginBottom:32}}>픽스카는 이용자의 개인정보를 소중히 보호합니다. (시행일: 2026.04.01)</p>
          {[
            {t:"1. 수집하는 개인정보",c:"회원가입 시: 이메일, 이름, 비밀번호\n카카오 로그인 시: 카카오 계정 정보(이메일, 프로필)\n딜러 등록 시: 상호명, 연락처, 주소\n서비스 이용 시: 방문 기록, IP 주소, 브라우저 정보"},
            {t:"2. 개인정보의 이용 목적",c:"서비스 제공 및 운영\n회원 관리 및 본인 인증\n매물 문의 연결\n서비스 개선 및 통계 분석\n고객 상담 및 민원 처리"},
            {t:"3. 개인정보의 보유 및 파기",c:"회원 탈퇴 시 지체 없이 파기합니다.\n단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.\n- 계약 또는 청약철회 등에 관한 기록: 5년\n- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년\n- 접속 기록: 3개월"},
            {t:"4. 개인정보의 제3자 제공",c:"원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.\n다만, 이용자의 동의가 있는 경우 또는 법령에 의한 경우에 한하여 제공할 수 있습니다."},
            {t:"5. 개인정보의 위탁",c:"서비스 제공을 위해 아래와 같이 개인정보 처리를 위탁합니다.\n- 클라우드 서비스: Vercel, Railway (서버 운영)\n- 이미지 저장: Cloudinary\n- 결제 대행: PortOne (준비중)"},
            {t:"6. 이용자의 권리",c:"이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있습니다.\n마이페이지 > 설정에서 직접 처리하거나, 고객센터로 요청할 수 있습니다."},
            {t:"7. 쿠키의 사용",c:"픽스카는 로그인 유지 및 서비스 개선을 위해 쿠키를 사용합니다.\n브라우저 설정에서 쿠키 수집을 거부할 수 있으나, 일부 서비스 이용에 제한이 있을 수 있습니다."},
            {t:"8. 개인정보 보호책임자",c:"성명: 상훈\n이메일: info@fixcar.kr\n개인정보 관련 문의사항은 위 이메일로 연락해주세요."},
          ].map((s,i)=>(
            <div key={i} style={{background:"white",borderRadius:14,padding:"22px 24px",marginBottom:10}}>
              <h3 style={{fontSize:16,fontWeight:800,marginBottom:10}}>{s.t}</h3>
              <div style={{fontSize:14,color:"#666",lineHeight:1.9,whiteSpace:"pre-line"}}>{s.c}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
