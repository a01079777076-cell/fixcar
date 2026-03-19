"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

interface ErrorReport { id:string; page:string; description:string; userAgent?:string; createdAt:string; status?:string; }

export default function AdminErrorsPage() {
  const [reports, setReports] = useState<ErrorReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/errors")
      .then(r=>r.json())
      .then(data=>{ setReports(Array.isArray(data)?data:data.reports||[]); setLoading(false); })
      .catch(()=>{ setReports([]); setLoading(false); });
  }, []);

  const markResolved = async (id:string) => {
    await fetch(`/api/admin/errors/${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({status:"RESOLVED"}) }).catch(()=>{});
    setReports(prev=>prev.map(r=>r.id===id?{...r,status:"RESOLVED"}:r));
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
      `}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"#1A1A1A",padding:"36px 24px 28px"}}>
          <div style={{maxWidth:900,margin:"0 auto"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:4,color:"#E24B4A",marginBottom:6}}>ERROR REPORTS</div>
            <h1 style={{fontSize:28,fontWeight:800,color:"white"}}>오류 신고 접수 내역</h1>
          </div>
        </div>
        <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px 100px"}}>
          {loading ? <div style={{textAlign:"center",padding:60,color:"#AAA"}}>로딩 중...</div> : reports.length===0 ? (
            <div style={{background:"white",borderRadius:18,padding:"60px 24px",textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>✅</div>
              <div style={{fontSize:16,fontWeight:800}}>접수된 오류 신고가 없어요</div>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {reports.map(r=>(
                <div key={r.id} style={{background:"white",borderRadius:16,padding:"18px 22px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:100,
                      background:r.status==="RESOLVED"?"#E8F8EF":"#FFF0ED",
                      color:r.status==="RESOLVED"?"#00A854":"#E24B4A",
                    }}>{r.status==="RESOLVED"?"처리완료":"미처리"}</span>
                    <span style={{fontSize:11,color:"#CCC"}}>{new Date(r.createdAt).toLocaleString("ko-KR")}</span>
                  </div>
                  <div style={{fontSize:13,fontWeight:800,marginBottom:4}}>📍 {r.page || "알 수 없음"}</div>
                  <p style={{fontSize:14,color:"#555",fontWeight:400,lineHeight:1.7,marginBottom:10}}>{r.description}</p>
                  {r.status !== "RESOLVED" && (
                    <button onClick={()=>markResolved(r.id)} style={{padding:"8px 16px",background:"#00C471",color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>처리 완료</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
