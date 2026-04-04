// 📁 저장 경로: app/not-found.tsx
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div style={{minHeight:"100vh",background:"#F0EEE9",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'NanumSquareRound',sans-serif",padding:24}}>
      <div style={{textAlign:"center",maxWidth:480}}>
        <div style={{fontFamily:"'Bebas Neue',serif",fontSize:120,color:"#E0DDD7",lineHeight:1,letterSpacing:4}}>404</div>
        <h1 style={{fontSize:24,fontWeight:800,marginBottom:12,color:"#333"}}>페이지를 찾을 수 없어요</h1>
        <p style={{fontSize:15,color:"#888",lineHeight:1.8,marginBottom:32}}>요청하신 페이지가 존재하지 않거나, 이동되었을 수 있어요.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <Link href="/"><button style={{padding:"14px 32px",background:"#FF3B1E",color:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer"}}>홈으로 가기</button></Link>
          <Link href="/cars"><button style={{padding:"14px 32px",background:"white",color:"#FF3B1E",border:"2px solid #FF3B1E",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer"}}>매물 보기</button></Link>
        </div>
      </div>
    </div>
  );
}
