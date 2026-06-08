"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{background:"#1A1A1A",padding:"48px 24px 32px",fontFamily:"'NanumSquareRound',sans-serif"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr 1fr 1fr",gap:32,marginBottom:32}}>
          <div>
            <div style={{fontFamily:"'Bebas Neue',serif",fontSize:24,letterSpacing:2,marginBottom:16}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"white"}}>CAR</span></div>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.3)",lineHeight:1.8}}>광주 No.1 중고차 정찰제 플랫폼<br/>흥정 없이, 투명하게</p>
            <div style={{marginTop:12,fontSize:11,color:"rgba(255,255,255,0.2)",lineHeight:1.8}}>
              📧 help@fixcar.kr
            </div>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.6)",marginBottom:12}}>차량</div>
            {[{l:"전체 매물",h:"/cars"},{l:"카탈로그",h:"/catalog"},{l:"시세 조회",h:"/price"},{l:"차량 비교",h:"/compare"},{l:"자동차 랭킹",h:"/ranking"}].map(i=>(
              <Link key={i.l} href={i.h} style={{display:"block",fontSize:12,color:"rgba(255,255,255,0.3)",marginBottom:8,textDecoration:"none"}}>{i.l}</Link>
            ))}
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.6)",marginBottom:12}}>서비스</div>
            {[{l:"중고차 검수",h:"/inspection"},{l:"거래대행",h:"/agent"},{l:"내차 MBTI",h:"/mbti"},{l:"32강 배틀",h:"/battle"},{l:"내차 찾기",h:"/quiz-select"}].map(i=>(
              <Link key={i.l} href={i.h} style={{display:"block",fontSize:12,color:"rgba(255,255,255,0.3)",marginBottom:8,textDecoration:"none"}}>{i.l}</Link>
            ))}
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.6)",marginBottom:12}}>커뮤니티</div>
            {[{l:"유용한 정보",h:"/blog"},{l:"커뮤니티",h:"/community"},{l:"공지사항",h:"/notice"},{l:"이벤트",h:"/events"},{l:"고객센터",h:"/contact"}].map(i=>(
              <Link key={i.l} href={i.h} style={{display:"block",fontSize:12,color:"rgba(255,255,255,0.3)",marginBottom:8,textDecoration:"none"}}>{i.l}</Link>
            ))}
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.6)",marginBottom:12}}>딜러</div>
            {[{l:"딜러 모집",h:"/dealer/apply"},{l:"매매단지 소개",h:"/complexes"},{l:"매매상사 목록",h:"/shops"},{l:"클린픽스카",h:"/clean"}].map(i=>(
              <Link key={i.l} href={i.h} style={{display:"block",fontSize:12,color:"rgba(255,255,255,0.3)",marginBottom:8,textDecoration:"none"}}>{i.l}</Link>
            ))}
          </div>
        </div>

        {/* ═══ 사업자 정보 (사업자등록 후 실제 정보 입력) ═══ */}
        <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:20,marginBottom:16}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.2)",lineHeight:2}}>
            상호: 픽스카 | 대표: OOO | 사업자등록번호: 000-00-00000 | 통신판매업신고번호: 제0000-광주OO-0000호
            <br/>
            사업장주소: 광주광역시 OO구 OO로 000 | 전화: 000-0000-0000 | 이메일: help@fixcar.kr
            <br/>
            개인정보관리책임자: OOO | 호스팅: Vercel Inc.
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.15)",marginTop:8,lineHeight:1.8}}>
            픽스카는 통신판매중개자로서 통신판매의 당사자가 아니며, 상품·거래정보 및 거래에 대하여 책임을 지지 않습니다.
          </div>
        </div>

        <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>© 2025 픽스카 FIXCAR · All rights reserved</div>
          <div style={{display:"flex",gap:16}}>
            <Link href="/terms" style={{fontSize:11,color:"rgba(255,255,255,0.3)",textDecoration:"none"}}>이용약관</Link>
            <Link href="/privacy" style={{fontSize:11,color:"rgba(255,255,255,0.3)",textDecoration:"none",fontWeight:800}}>개인정보처리방침</Link>
            {/* 사업자등록 후 아래 주석 해제 */}
            {/* <a href="http://www.ftc.go.kr/bizCommPop.do?wrkr_no=사업자번호숫자만" target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"rgba(255,255,255,0.3)",textDecoration:"none"}}>사업자정보확인</a> */}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){footer>div>div:first-child{grid-template-columns:1fr 1fr!important;}}`}</style>
    </footer>
  );
}
