"use client";
import { useState } from "react";
import { Share2, Link2, MessageCircle } from "lucide-react";

export default function ShareButton({ carId, carName, price }: { carId:number; carName:string; price:number }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = `https://www.fixcar.kr/cars/${carId}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true); setTimeout(()=>setCopied(false),2000); setOpen(false);
  };

  const shareKakao = () => {
    const k = (window as Record<string,unknown>)["Kakao"] as {Share?:{sendDefault:(o:unknown)=>void}};
    if (k?.Share) {
      k.Share.sendDefault({ objectType:"feed", content:{ title:carName, description:`FIX 정찰가 ${price.toLocaleString()}만원`, imageUrl:"https://www.fixcar.kr/favicon.svg", link:{mobileWebUrl:url,webUrl:url} }, buttons:[{title:"차량 보러가기",link:{mobileWebUrl:url,webUrl:url}}] });
    } else copyLink();
    setOpen(false);
  };

  return (
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(!open)} style={{background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:"36px",height:"36px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
        <Share2 size={15} color="#555"/>
      </button>
      {open&&(
        <>
          <div style={{position:"fixed",inset:0,zIndex:40}} onClick={()=>setOpen(false)}/>
          <div style={{position:"absolute",right:0,top:"44px",background:"white",borderRadius:"14px",boxShadow:"0 8px 32px rgba(0,0,0,0.12)",padding:"8px",zIndex:50,minWidth:"160px"}}>
            <button onClick={shareKakao} style={{width:"100%",padding:"10px 14px",border:"none",background:"transparent",textAlign:"left",fontSize:"13px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",borderRadius:"8px",color:"#391B1B",fontFamily:"'NanumSquareRound',sans-serif"}}>
              💛 카카오톡 공유
            </button>
            <button onClick={copyLink} style={{width:"100%",padding:"10px 14px",border:"none",background:"transparent",textAlign:"left",fontSize:"13px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",borderRadius:"8px",fontFamily:"'NanumSquareRound',sans-serif"}}>
              <Link2 size={14} color="#555"/>{copied?"복사됨 ✓":"링크 복사"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
