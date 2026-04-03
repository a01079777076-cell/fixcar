// 📁 저장 경로: app/api/og/route.tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "FIXCAR 픽스카";
  const sub = searchParams.get("sub") || "광주 중고차 정찰가 플랫폼";
  const price = searchParams.get("price") || "";

  return new ImageResponse(
    (
      <div style={{width:1200,height:630,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",background:"linear-gradient(135deg,#1A1A1A,#333)",fontFamily:"sans-serif"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <span style={{fontSize:60,fontWeight:800,color:"#FF3B1E",letterSpacing:4}}>FIX</span>
          <span style={{fontSize:60,fontWeight:800,color:"white",letterSpacing:4}}>CAR</span>
        </div>
        <div style={{fontSize:40,fontWeight:800,color:"white",textAlign:"center",maxWidth:900,lineHeight:1.4}}>{title}</div>
        {sub&&<div style={{fontSize:22,color:"rgba(255,255,255,0.5)",marginTop:16}}>{sub}</div>}
        {price&&<div style={{fontSize:48,fontWeight:800,color:"#FF3B1E",marginTop:24}}>{price}만원</div>}
        <div style={{position:"absolute",bottom:30,right:40,fontSize:18,color:"rgba(255,255,255,0.3)"}}>fixcar.kr</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
