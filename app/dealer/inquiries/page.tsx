"use client";
import { useState, useEffect } from "react";
import { MessageCircle, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

interface Inquiry { id:number; message:string; reply:string|null; status:string; createdAt:string; car:{name:string;price:number}; user:{name:string;phone?:string}; }

export default function DealerInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry|null>(null);
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/dealer/inquiries").then(r=>r.json()).then(d=>{ if(d.success) setInquiries(d.data); })
      .catch(()=>setInquiries([
        {id:1,message:"이 차 아직 있나요? 내일 방문 가능한지요",reply:null,status:"PENDING",createdAt:"2026-03-19",car:{name:"2021 아반떼 CN7",price:1450},user:{name:"김○○",phone:"010-****-1234"}},
        {id:2,message:"할부 가능한가요? 36개월로 하면 얼마인지",reply:"네 할부 가능합니다! 36개월 기준 월 42만원 정도 예상돼요.",status:"REPLIED",createdAt:"2026-03-18",car:{name:"2020 기아 K5",price:1980},user:{name:"이○○",phone:"010-****-5678"}},
      ]));
  }, []);

  const handleReply = async () => {
    if(!reply.trim()||!selected) return;
    setSaving(true);
    await fetch(`/api/inquiries/${selected.id}/reply`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reply})}).catch(()=>{});
    setInquiries(p=>p.map(i=>i.id===selected.id?{...i,reply,status:"REPLIED"}:i));
    setSelected(p=>p?{...p,reply,status:"REPLIED"}:null);
    setReply(""); setSaving(false);
  };

  const NAV = [["대시보드","/dealer"],["매물","/dealer/cars"],["문의","/dealer/inquiries"],["거래","/dealer/transactions"],["분석","/dealer/analytics"]];
  const DEALER_STYLE = { bg:"#F0F6FF", border:"#DDEEFF", accent:"#0066FF" };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:${DEALER_STYLE.bg};} a{text-decoration:none;color:inherit;} button,textarea{font-family:'NanumSquareRound',sans-serif;cursor:pointer;} textarea:focus{outline:none;border-color:${DEALER_STYLE.accent}!important;} .row:hover{background:#F0F8FF!important;} @media(max-width:900px){.split{grid-template-columns:1fr!important;}}`}</style>
      <div style={{minHeight:"100vh",background:DEALER_STYLE.bg}}>
        <div style={{background:"white",borderBottom:`1.5px solid ${DEALER_STYLE.border}`,padding:"0 32px",height:"68px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,100,255,0.06)"}}>
          <Link href="/" style={{fontFamily:"'Bebas Neue',serif",fontSize:"24px",letterSpacing:"3px",display:"flex",alignItems:"center",gap:"8px"}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"#1A1A1A"}}>CAR</span><span style={{fontSize:"11px",fontFamily:"'NanumSquareRound',sans-serif",fontWeight:800,color:DEALER_STYLE.accent,background:"#EEF5FF",padding:"3px 10px",borderRadius:"100px",marginLeft:"4px"}}>DEALER</span></Link>
          <div style={{display:"flex",gap:"4px"}}>{NAV.map(([l,h])=>(<Link key={l} href={h} style={{fontSize:"13px",fontWeight:700,color:h==="/dealer/inquiries"?DEALER_STYLE.accent:"#888",padding:"7px 12px",borderRadius:"9px",background:h==="/dealer/inquiries"?"#EEF5FF":"transparent"}}>{l}</Link>))}</div>
          <Link href="/dealer"><button style={{background:DEALER_STYLE.bg,color:DEALER_STYLE.accent,border:`1.5px solid ${DEALER_STYLE.border}`,padding:"7px 16px",borderRadius:"100px",fontSize:"12px",fontWeight:700,cursor:"pointer"}}>← 대시보드</button></Link>
        </div>
        <div style={{maxWidth:"1000px",margin:"0 auto",padding:"24px 28px 60px"}}>
          <h1 style={{fontSize:"22px",fontWeight:800,marginBottom:"20px",color:DEALER_STYLE.accent}}>문의 관리</h1>
          <div className="split" style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:"14px",alignItems:"start"}}>
            <div style={{background:"white",border:`1.5px solid ${DEALER_STYLE.border}`,borderRadius:"16px",overflow:"hidden"}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid #F0EEE9",fontSize:"13px",fontWeight:800,color:DEALER_STYLE.accent}}>전체 {inquiries.length}건 · 미답변 {inquiries.filter(i=>i.status==="PENDING").length}건</div>
              {inquiries.map(i=>(
                <div key={i.id} className="row" onClick={()=>setSelected(i)} style={{padding:"14px 16px",borderBottom:"1px solid #F0EEE9",background:selected?.id===i.id?"#EEF5FF":"white",cursor:"pointer",transition:"background 0.1s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}>
                    <span style={{fontSize:"14px",fontWeight:800}}>{i.user.name}</span>
                    <span style={{background:i.status==="PENDING"?"#FFF8EC":"#EAF6EF",color:i.status==="PENDING"?"#E8A020":"#2D8A52",padding:"2px 8px",borderRadius:"100px",fontSize:"11px",fontWeight:800}}>{i.status==="PENDING"?"미답변":"답변완료"}</span>
                  </div>
                  <div style={{fontSize:"12px",color:"#888",fontWeight:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:"2px"}}>{i.car.name}</div>
                  <div style={{fontSize:"12px",color:"#BBB",fontWeight:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.message}</div>
                </div>
              ))}
            </div>
            {selected ? (
              <div style={{background:"white",border:`1.5px solid ${DEALER_STYLE.border}`,borderRadius:"16px",padding:"20px 22px"}}>
                <div style={{marginBottom:"14px",paddingBottom:"12px",borderBottom:"1px solid #F0EEE9"}}>
                  <div style={{fontSize:"16px",fontWeight:800,marginBottom:"3px"}}>{selected.user.name}</div>
                  <div style={{fontSize:"13px",color:"#888",fontWeight:400}}>{selected.car.name} · {selected.car.price.toLocaleString()}만원</div>
                  {selected.user.phone&&<div style={{fontSize:"13px",color:DEALER_STYLE.accent,fontWeight:700,marginTop:"4px"}}>{selected.user.phone}</div>}
                </div>
                <div style={{background:"#F8FBFF",borderRadius:"12px",padding:"14px 16px",marginBottom:"12px"}}>
                  <div style={{fontSize:"11px",color:"#AAA",marginBottom:"6px",fontWeight:400,display:"flex",alignItems:"center",gap:"4px"}}><Clock size={11}/> {selected.createdAt}</div>
                  <div style={{fontSize:"14px",color:"#333",lineHeight:1.75,fontWeight:400}}>{selected.message}</div>
                </div>
                {selected.reply&&(
                  <div style={{background:"#EEF5FF",borderRadius:"12px",padding:"14px 16px",marginBottom:"12px"}}>
                    <div style={{fontSize:"11px",color:DEALER_STYLE.accent,fontWeight:800,marginBottom:"6px",display:"flex",alignItems:"center",gap:"4px"}}><CheckCircle size={11}/> 내 답변</div>
                    <div style={{fontSize:"14px",color:"#333",lineHeight:1.75,fontWeight:400}}>{selected.reply}</div>
                  </div>
                )}
                {selected.status==="PENDING"&&(
                  <>
                    <textarea rows={4} value={reply} onChange={e=>setReply(e.target.value)} placeholder="답변을 입력해주세요..." style={{width:"100%",border:`1.5px solid ${DEALER_STYLE.border}`,borderRadius:"10px",padding:"12px",fontSize:"14px",resize:"none",marginBottom:"10px",background:"#FAFCFF"}}/>
                    <button onClick={handleReply} disabled={!reply.trim()||saving} style={{width:"100%",background:!reply.trim()?"#E0DDD7":DEALER_STYLE.accent,color:!reply.trim()?"#AAA":"white",border:"none",padding:"12px",borderRadius:"10px",fontSize:"14px",fontWeight:800,cursor:!reply.trim()?"default":"pointer"}}>
                      {saving?"전송 중...":"답변 전송"}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div style={{background:"white",border:`1.5px solid ${DEALER_STYLE.border}`,borderRadius:"16px",padding:"60px",textAlign:"center",color:"#AAA"}}>
                <MessageCircle size={40} color="#DDEEFF" style={{margin:"0 auto 12px"}}/>
                <div style={{fontSize:"14px",fontWeight:700}}>문의를 선택하세요</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
