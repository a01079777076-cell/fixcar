import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9",fontFamily:"'NanumSquareRound',sans-serif"}}>
        <div style={{background:"#1A1A1A",padding:"44px 24px 36px"}}><div style={{maxWidth:800,margin:"0 auto"}}><h1 style={{fontSize:28,fontWeight:800,color:"white"}}>📋 이용약관</h1></div></div>
        <div style={{maxWidth:800,margin:"0 auto",padding:"32px 24px 100px"}}>
          <div style={{background:"white",borderRadius:20,padding:"36px 32px",fontSize:14,color:"#555",lineHeight:2.2}}>
            <p style={{fontSize:12,color:"#AAA",marginBottom:16}}>시행일: 2025년 1월 1일</p>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1A1A1A",marginBottom:8}}>제1조 (목적)</h2>
            <p>이 약관은 픽스카 FIXCAR(이하 &quot;서비스&quot;)가 제공하는 중고차 거래 중개 플랫폼의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1A1A1A",margin:"24px 0 8px"}}>제2조 (정의)</h2>
            <p>1. &quot;서비스&quot;란 픽스카가 운영하는 웹사이트(fixcar.kr) 및 관련 서비스를 말합니다.<br/>2. &quot;회원&quot;이란 서비스에 가입하여 이용하는 자를 말합니다.<br/>3. &quot;딜러&quot;란 서비스에 중고차 매물을 등록하는 자동차매매업 종사자를 말합니다.<br/>4. &quot;FIX 가격&quot;이란 흥정 없이 고정된 판매 가격을 말합니다.</p>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1A1A1A",margin:"24px 0 8px"}}>제3조 (서비스 이용)</h2>
            <p>1. 서비스 이용을 위해 회원가입이 필요합니다.<br/>2. 허위 정보로 가입한 경우 서비스 이용이 제한될 수 있습니다.<br/>3. 매물 정보는 딜러가 등록하며, 픽스카는 검수를 통해 허위 매물을 차단합니다.</p>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1A1A1A",margin:"24px 0 8px"}}>제4조 (FIX 가격 정책)</h2>
            <p>1. 모든 매물은 FIX 정찰가로 등록됩니다.<br/>2. 등록된 가격은 딜러가 변경하기 전까지 유효합니다.<br/>3. 별도 흥정이나 추가 비용 요구는 금지됩니다.</p>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1A1A1A",margin:"24px 0 8px"}}>제5조 (면책)</h2>
            <p>1. 픽스카는 중개 플랫폼으로서, 실제 거래에 대한 책임은 당사자 간에 있습니다.<br/>2. 천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임지지 않습니다.</p>
            <div style={{background:"#F8F7F4",borderRadius:12,padding:"16px 20px",marginTop:24,fontSize:12,color:"#AAA"}}>문의: help@fixcar.kr</div>
          </div>
        </div>
      </div>
    </>
  );
}
