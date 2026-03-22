"use client";
import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"40px 24px 100px"}}>
          <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>이용약관</h1>
          <p style={{fontSize:13,color:"#AAA",marginBottom:28}}>최종 수정일: 2025년 3월 1일</p>
          <div style={{background:"white",borderRadius:20,padding:"32px 30px"}}>
            {[
              {title:"제1조 (목적)",content:"이 약관은 픽스카(이하 '회사')가 제공하는 중고자동차 정보 서비스 및 관련 제반 서비스의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다."},
              {title:"제2조 (정의)",content:"'서비스'란 회사가 운영하는 웹사이트(fixcar.kr) 및 모바일 애플리케이션을 통해 제공하는 중고차 매물 정보, 딜러 정보, 차량 카탈로그, 랭킹, MBTI 등 일체의 서비스를 말합니다."},
              {title:"제3조 (약관의 효력)",content:"이 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다. 약관의 내용은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지합니다."},
              {title:"제4조 (서비스 이용)",content:"서비스는 연중무휴 1일 24시간 제공함을 원칙으로 합니다. 다만, 시스템 점검 등의 사유로 일시 중단될 수 있으며, 이 경우 사전 공지합니다."},
              {title:"제5조 (회원가입)",content:"이용자는 카카오 계정을 통해 회원가입할 수 있으며, 가입 시 본 약관에 동의한 것으로 간주합니다."},
              {title:"제6조 (차량 정보의 정확성)",content:"회사는 차량 정보의 정확성을 위해 최선을 다하나, 실제 차량 상태는 현장 확인을 권장합니다. FIX 정찰가는 등록 시점의 가격이며 변동될 수 있습니다."},
              {title:"제7조 (허위매물 제재)",content:"클린픽스카 정책에 따라 허위매물을 등록한 딜러는 이용이 제한되며, 상세 규정은 클린픽스카 페이지에서 확인할 수 있습니다."},
              {title:"제8조 (면책조항)",content:"회사는 이용자 간 또는 이용자와 딜러 간의 거래에 대해 직접적인 책임을 지지 않습니다. 차량 매매 계약은 당사자 간의 책임하에 이루어집니다."},
              {title:"제9조 (분쟁해결)",content:"서비스 이용과 관련한 분쟁은 대한민국 법령에 따르며, 관할 법원은 광주지방법원으로 합니다."},
            ].map((s,i)=>(
              <div key={i} style={{marginBottom:24}}>
                <h3 style={{fontSize:16,fontWeight:800,marginBottom:8,color:"#1A1A1A"}}>{s.title}</h3>
                <p style={{fontSize:14,color:"#666",lineHeight:1.9,fontWeight:400}}>{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
