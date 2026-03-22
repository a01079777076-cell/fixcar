"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { MessageSquare, Send, CheckCircle, Clock } from "lucide-react";

interface Inquiry {
  id:number; message:string; reply?:string; status:string; createdAt:string;
  user:{name?:string; email?:string; phone?:string};
  car:{name:string; brand:string; price:number};
}

export default function DealerInquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyId, setReplyId] = useState<number|null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(()=>{
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if(!d?.user?.id || (d.user.role!=="DEALER"&&d.user.role!=="ADMIN")) { router.push("/"); return; }
      loadInquiries();
    }).catch(()=>router.push("/"));
  },[router]);

  const loadInquiries = async () => {
    try {
      const res = await fetch("/api/dealer/inquiries");
      const data = await res.json();
      setInquiries(Array.isArray(data)?data:[]);
    } catch {}
    setLoading(false);
  };

  const handleReply = async (inquiryId:number) => {
    if(!replyText.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/dealer/inquiries",{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({inquiryId, reply:replyText}),
      });
      const data = await res.json();
      if(data.success) {
        setInquiries(inquiries.map(i=>i.id===inquiryId?{...i,reply:replyText,status:"REPLIED"}:i));
        setReplyId(null);
        setReplyText("");
      }
    } catch {}
    setSending(false);
  };

  const pending = inquiries.filter(i=>i.status==="PENDING");
  const replied = inquiries.filter(i=>i.status==="REPLIED");

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} textarea:focus{outline:none;border-color:#0066FF!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"white",borderBottom:"1px solid #DDEEFF",padding:"20px 24px"}}>
          <div style={{maxWidth:800,margin:"0 auto",display:"flex",alignItems:"center",gap:10}}>
            <MessageSquare size={20} color="#0066FF"/>
            <h1 style={{fontSize:20,fontWeight:800}}>고객 문의 관리</h1>
            <span style={{fontSize:12,background:"#FF3B1E",color:"white",padding:"2px 10px",borderRadius:100,fontWeight:800,marginLeft:8}}>{pending.length}건 대기</span>
          </div>
        </div>

        <div style={{maxWidth:800,margin:"0 auto",padding:"20px 16px 80px"}}>
          {loading?<div style={{textAlign:"center",padding:60,color:"#CCC"}}>로딩 중...</div>:(
            <>
              {/* 대기 중 */}
              {pending.length>0&&(
                <div style={{marginBottom:24}}>
                  <h2 style={{fontSize:16,fontWeight:800,color:"#FF3B1E",marginBottom:12}}>
                    <Clock size={16} style={{verticalAlign:"middle",marginRight:6}}/>답변 대기 ({pending.length})
                  </h2>
                  {pending.map(inq=>(
                    <div key={inq.id} style={{background:"white",borderRadius:16,padding:"20px 22px",marginBottom:10,border:"2px solid #FFE4DE"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                        <div>
                          <span style={{fontSize:14,fontWeight:800}}>{inq.car.brand} {inq.car.name}</span>
                          <span style={{fontSize:12,color:"#AAA",marginLeft:8}}>{inq.car.price?.toLocaleString()}만원</span>
                        </div>
                        <span style={{fontSize:11,color:"#CCC"}}>{new Date(inq.createdAt).toLocaleDateString("ko-KR")}</span>
                      </div>
                      <div style={{fontSize:12,color:"#888",marginBottom:8}}>
                        👤 {inq.user.name||"고객"} {inq.user.phone?`· ${inq.user.phone}`:""}
                      </div>
                      <div style={{background:"#F8F7F4",borderRadius:10,padding:"12px 14px",fontSize:14,color:"#555",lineHeight:1.7,marginBottom:12}}>{inq.message}</div>
                      {replyId===inq.id?(
                        <div>
                          <textarea rows={3} value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="답변을 입력하세요" style={{width:"100%",padding:"12px 14px",border:"1.5px solid #DDEEFF",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",resize:"none",marginBottom:8}}/>
                          <div style={{display:"flex",gap:8}}>
                            <button onClick={()=>handleReply(inq.id)} disabled={sending} style={{padding:"10px 20px",background:"#0066FF",color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"'NanumSquareRound',sans-serif"}}>
                              <Send size={14}/>{sending?"전송중...":"답변 보내기"}
                            </button>
                            <button onClick={()=>{setReplyId(null);setReplyText("");}} style={{padding:"10px 16px",background:"#F0EEE9",color:"#888",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>취소</button>
                          </div>
                        </div>
                      ):(
                        <button onClick={()=>setReplyId(inq.id)} style={{padding:"10px 20px",background:"#0066FF",color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>답변하기</button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 답변 완료 */}
              <h2 style={{fontSize:16,fontWeight:800,color:"#2D8A52",marginBottom:12}}>
                <CheckCircle size={16} style={{verticalAlign:"middle",marginRight:6}}/>답변 완료 ({replied.length})
              </h2>
              {replied.length===0?<div style={{background:"white",borderRadius:16,padding:"40px",textAlign:"center",color:"#CCC"}}>답변한 문의가 없어요</div>:
              replied.map(inq=>(
                <div key={inq.id} style={{background:"white",borderRadius:16,padding:"18px 22px",marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:14,fontWeight:700}}>{inq.car.brand} {inq.car.name}</span>
                    <span style={{fontSize:11,color:"#2D8A52",fontWeight:700}}>✓ 답변완료</span>
                  </div>
                  <div style={{fontSize:13,color:"#888",marginBottom:6}}>{inq.message}</div>
                  <div style={{background:"#EEF5FF",borderRadius:8,padding:"10px 12px",fontSize:13,color:"#0066FF",fontWeight:500}}>{inq.reply}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
