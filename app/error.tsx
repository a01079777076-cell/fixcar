// 📁 저장 경로: app/error.tsx
"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{minHeight:"100vh",background:"#F0EEE9",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'NanumSquareRound',sans-serif",padding:24}}>
      <div style={{textAlign:"center",maxWidth:480}}>
        <div style={{fontSize:64,marginBottom:16}}>⚠</div>
        <h1 style={{fontSize:24,fontWeight:800,marginBottom:12}}>문제가 발생했어요</h1>
        <p style={{fontSize:14,color:"#888",lineHeight:1.8,marginBottom:24}}>일시적인 오류가 발생했습니다.<br/>잠시 후 다시 시도해주세요.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button onClick={reset} style={{padding:"14px 28px",background:"#FF3B1E",color:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer"}}>다시 시도</button>
          <button onClick={()=>window.location.href="/"} style={{padding:"14px 28px",background:"white",color:"#888",border:"1px solid #E0DDD7",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer"}}>홈으로</button>
        </div>
      </div>
    </div>
  );
}
