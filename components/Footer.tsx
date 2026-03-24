"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{background:"#1A1A1A",padding:"48px 24px 32px",fontFamily:"'NanumSquareRound',sans-serif"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:32,marginBottom:32}}>
          <div>
            <div style={{fontFamily:"'Bebas Neue',serif",fontSize:24,letterSpacing:2,marginBottom:16}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"white"}}>CAR</span></div>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.3)",lineHeight:1.8}}>광주 No.1 중고차 정찰제 플랫폼<br/>흥정 없이, 투명하게</p>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.6)",marginBottom:12}}>서비스</div>
            {[{l:"전체 매물",h:"/cars"},{l:"차량 MBTI",h:"/mbti"},{l:"카탈로그",h:"/catalog"},{l:"자동차 랭킹",h:"/ranking"},{l:"32강 토너먼트",h:"/battle"}].map(i=>(
              <Link key={i.l} href={i.h} style={{display:"block",fontSize:12,color:"rgba(255,255,255,0.3)",marginBottom:8,textDecoration:"none"}}>{i.l}</Link>
            ))}
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.6)",marginBottom:12}}>커뮤니티</div>
            {[{l:"블로그",h:"/blog"},{l:"커뮤니티",h:"/community"},{l:"클린픽스카",h:"/clean"},{l:"고객센터",h:"/contact"}].map(i=>(
              <Link key={i.l} href={i.h} style={{display:"block",fontSize:12,color:"rgba(255,255,255,0.3)",marginBottom:8,textDecoration:"none"}}>{i.l}</Link>
            ))}
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.6)",marginBottom:12}}>딜러</div>
            {[{l:"딜러 모집",h:"/dealer/apply"},{l:"딜러 로그인",h:"/login"}].map(i=>(
              <Link key={i.l} href={i.h} style={{display:"block",fontSize:12,color:"rgba(255,255,255,0.3)",marginBottom:8,textDecoration:"none"}}>{i.l}</Link>
            ))}
            <div style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,0.6)",marginTop:16,marginBottom:8}}>문의</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>help@fixcar.kr</div>
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>© 2025 픽스카 FIXCAR · 광주광역시</div>
          <div style={{display:"flex",gap:16}}>
            <Link href="/terms" style={{fontSize:11,color:"rgba(255,255,255,0.3)",textDecoration:"none"}}>이용약관</Link>
            <Link href="/privacy" style={{fontSize:11,color:"rgba(255,255,255,0.3)",textDecoration:"none",fontWeight:800}}>개인정보처리방침</Link>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){footer>div>div:first-child{grid-template-columns:1fr 1fr!important;}}`}</style>
    </footer>
  );
}
