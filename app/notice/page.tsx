// 📁 저장 경로: app/notice/page.tsx
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { ChevronDown, Pin } from "lucide-react";

export default function NoticePage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [open, setOpen] = useState<number|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notices").then(r=>r.json()).then(d=>{
      setNotices(Array.isArray(d)?d:[]);
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  /* 관리자가 등록한 실제 공지만 표시 */
  const data = notices;
  const sorted = [...data].sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"40px 24px 100px"}}>
          <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>📢 공지사항</h1>
          <p style={{fontSize:14,color:"#AAA",marginBottom:32}}>픽스카의 새로운 소식을 확인하세요.</p>

          {loading ? (
            <div style={{textAlign:"center",padding:60,color:"#CCC"}}>로딩 중...</div>
          ) : sorted.length===0 ? (
            <div style={{background:"white",borderRadius:18,padding:60,textAlign:"center",color:"#CCC"}}>등록된 공지사항이 없습니다.</div>
          ) : sorted.map(n=>(
            <div key={n.id} style={{background:"white",borderRadius:14,marginBottom:8,overflow:"hidden",border:n.pinned?"2px solid #FF3B1E":"1px solid #E8E6E1"}}>
              <button onClick={()=>setOpen(open===n.id?null:n.id)} style={{width:"100%",padding:"18px 22px",border:"none",background:"none",textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontFamily:"'NanumSquareRound',sans-serif"}}>
                {n.pinned&&<Pin size={14} color="#FF3B1E" style={{flexShrink:0}}/>}
                <span style={{flex:1,fontSize:15,fontWeight:700}}>{n.title}</span>
                <span style={{fontSize:12,color:"#AAA",flexShrink:0}}>{n.createdAt?.slice(0,10)}</span>
                <ChevronDown size={16} color="#AAA" style={{transform:open===n.id?"rotate(180deg)":"none",transition:"0.2s",flexShrink:0}}/>
              </button>
              {open===n.id&&<div style={{padding:"0 22px 20px",fontSize:14,color:"#666",lineHeight:1.9,whiteSpace:"pre-line",borderTop:"1px solid #F0EEE9",paddingTop:16}}>{n.content}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
