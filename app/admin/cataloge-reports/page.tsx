"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, MessageCircle } from "lucide-react";

interface Report {
  id: number;
  carModel: string;
  wrongInfo: string;
  correctInfo: string;
  status: string;
  createdAt: string;
  phone?: string;
  user: { name: string; email: string; spamCount?: number; };
}

export default function AdminCatalogReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/catalog/report")
      .then(r => r.json())
      .then(d => { if (d.success) setReports(d.data); setLoading(false); })
      .catch(() => {
        setReports([
          { id:1, carModel:"현대 아반떼 CN7", wrongInfo:"1.6 MPI 연비가 14.2km/ℓ로 나와있는데", correctInfo:"실제 복합연비는 13.8km/ℓ 입니다", status:"PENDING", createdAt:"2025-03-19", user:{ name:"김○○", email:"user1@test.com", spamCount:0 } },
          { id:2, carModel:"기아 K3", wrongInfo:"0~100km/h 7.9초라고 나와있는데", correctInfo:"MT 기준 8.3초, AT 기준 8.1초가 정확합니다", status:"PENDING", createdAt:"2025-03-18", user:{ name:"이○○", email:"user2@test.com", spamCount:2 } },
        ]);
        setLoading(false);
      });
  }, []);

  const handleAction = async (id: number, action: "APPROVED" | "SPAM") => {
    setReports(p => p.map(r => r.id === id ? { ...r, status: action } : r));
    if (action === "SPAM") {
      setReports(p => p.map(r => r.id === id ? { ...r, user: { ...r.user, spamCount: (r.user.spamCount || 0) + 1 } } : r));
    }
    setSelected(null);
  };

  const handleReply = async (id: number) => {
    if (!reply.trim()) return;
    alert(`답변이 전송됐어요!\n\n"${reply}"`);
    setReports(p => p.map(r => r.id === id ? { ...r, status: "ANSWERED" } : r));
    setReply("");
    setSelected(null);
  };

  const pending = reports.filter(r => r.status === "PENDING").length;
  const spam = reports.filter(r => r.status === "SPAM").length;

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        textarea{font-family:'NanumSquareRound',sans-serif;}
        .row{cursor:pointer;transition:background 0.1s;}
        .row:hover{background:#FAFAF8;}
        @media(max-width:768px){.split{grid-template-columns:1fr!important;}}
      `}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"#1A1A1A",padding:"0 32px",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <a href="/" style={{fontFamily:"'Bebas Neue',serif",fontSize:"24px",letterSpacing:"3px"}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"white"}}>CAR</span></a>
          <a href="/admin" style={{fontSize:"13px",fontWeight:700,color:"rgba(255,255,255,0.4)"}}>← 관리자</a>
        </div>

        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"28px 32px 80px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
            <h1 style={{fontSize:"26px",fontWeight:800}}>카탈로그 정보수정 요청</h1>
            <div style={{display:"flex",gap:"8px"}}>
              <span style={{background:"#FFF8EC",color:"#E8A020",padding:"5px 14px",borderRadius:"100px",fontSize:"13px",fontWeight:800}}>대기 {pending}건</span>
              <span style={{background:"#FFF0ED",color:"#FF3B1E",padding:"5px 14px",borderRadius:"100px",fontSize:"13px",fontWeight:800}}>스팸 {spam}건</span>
            </div>
          </div>

          <div className="split" style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:"16px",alignItems:"start"}}>
            <div style={{background:"white",borderRadius:"18px",overflow:"hidden"}}>
              {loading ? <div style={{padding:"40px",textAlign:"center",color:"#AAA"}}>로딩 중...</div> :
                reports.map((r,i)=>(
                  <div key={r.id} className="row" onClick={()=>setSelected(r)}
                    style={{padding:"14px 18px",borderBottom:i<reports.length-1?"1px solid #F0EEE9":"none",background:selected?.id===r.id?"#FFF0ED":"white"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"8px"}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"4px"}}>
                          <span style={{background:r.status==="PENDING"?"#FFF8EC":r.status==="SPAM"?"#FFF0ED":"#EAF6EF",color:r.status==="PENDING"?"#E8A020":r.status==="SPAM"?"#FF3B1E":"#2D8A52",padding:"2px 8px",borderRadius:"100px",fontSize:"10px",fontWeight:800}}>{r.status==="PENDING"?"대기":r.status==="SPAM"?"스팸":r.status==="APPROVED"?"반영":"답변완료"}</span>
                          {(r.user.spamCount || 0) >= 3 && <span style={{background:"#1A1A1A",color:"white",padding:"2px 8px",borderRadius:"100px",fontSize:"10px",fontWeight:800}}>⛔ 누적불량</span>}
                        </div>
                        <div style={{fontSize:"14px",fontWeight:800}}>{r.carModel}</div>
                        <div style={{fontSize:"12px",color:"#888",fontWeight:400}}>{r.user.name} · 불량 {r.user.spamCount||0}건</div>
                      </div>
                      <div style={{fontSize:"11px",color:"#CCC"}}>{r.createdAt?.slice(5,10)}</div>
                    </div>
                  </div>
                ))
              }
            </div>

            {selected ? (
              <div style={{background:"white",borderRadius:"18px",padding:"24px"}}>
                <div style={{fontSize:"16px",fontWeight:800,marginBottom:"14px",display:"flex",alignItems:"center",gap:"8px"}}>
                  <AlertTriangle size={18} color="#E8A020"/> 수정 요청 상세
                </div>

                {[["차량 모델",selected.carModel],["신고자",`${selected.user.name} (${selected.user.email})`],["누적 불량",`${selected.user.spamCount||0}건`],["신고일",selected.createdAt]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #F0EEE9"}}>
                    <span style={{fontSize:"13px",color:"#888",fontWeight:400}}>{k}</span>
                    <span style={{fontSize:"13px",fontWeight:700}}>{v}</span>
                  </div>
                ))}

                <div style={{marginTop:"14px",marginBottom:"10px"}}>
                  <div style={{fontSize:"13px",fontWeight:800,marginBottom:"6px",color:"#FF3B1E"}}>틀린 내용</div>
                  <div style={{background:"#FFF0ED",borderRadius:"10px",padding:"12px",fontSize:"14px",color:"#444",lineHeight:1.7,fontWeight:400}}>{selected.wrongInfo}</div>
                </div>
                <div style={{marginBottom:"14px"}}>
                  <div style={{fontSize:"13px",fontWeight:800,marginBottom:"6px",color:"#2D8A52"}}>정확한 내용</div>
                  <div style={{background:"#EAF6EF",borderRadius:"10px",padding:"12px",fontSize:"14px",color:"#444",lineHeight:1.7,fontWeight:400}}>{selected.correctInfo}</div>
                </div>

                {selected.status === "PENDING" && (
                  <>
                    {/* 답변 */}
                    <div style={{marginBottom:"12px"}}>
                      <div style={{fontSize:"14px",fontWeight:800,marginBottom:"8px"}}>답변 작성</div>
                      <textarea rows={3} placeholder="신고자에게 보낼 답변..." value={reply} onChange={e=>setReply(e.target.value)}
                        style={{width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"10px",padding:"10px 12px",fontSize:"14px",resize:"none",background:"#FAFAF8"}}/>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px"}}>
                      <button onClick={()=>handleAction(selected.id,"APPROVED")} style={{background:"#EAF6EF",color:"#2D8A52",border:"none",padding:"11px",borderRadius:"10px",fontSize:"13px",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:"5px"}}>
                        <CheckCircle size={14}/> 반영
                      </button>
                      <button onClick={()=>handleReply(selected.id)} disabled={!reply.trim()} style={{background:reply.trim()?"#1847FF":"#E0DDD7",color:reply.trim()?"white":"#AAA",border:"none",padding:"11px",borderRadius:"10px",fontSize:"13px",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:"5px"}}>
                        <MessageCircle size={14}/> 답변 전송
                      </button>
                      <button onClick={()=>handleAction(selected.id,"SPAM")} style={{background:"#FFF0ED",color:"#FF3B1E",border:"none",padding:"11px",borderRadius:"10px",fontSize:"13px",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:"5px"}}>
                        <XCircle size={14}/> 스팸
                      </button>
                    </div>
                    <div style={{background:"#F8F6F2",borderRadius:"10px",padding:"10px 12px",marginTop:"10px",fontSize:"12px",color:"#888",lineHeight:1.65,fontWeight:400}}>
                      ⚠️ 스팸 처리 3회 누적 시 해당 사용자의 수정요청이 자동 차단됩니다.
                    </div>
                  </>
                )}
                {selected.status !== "PENDING" && (
                  <div style={{background:selected.status==="APPROVED"?"#EAF6EF":selected.status==="SPAM"?"#FFF0ED":"#EEF2FF",borderRadius:"10px",padding:"14px",textAlign:"center",fontSize:"14px",fontWeight:800,color:selected.status==="APPROVED"?"#2D8A52":selected.status==="SPAM"?"#FF3B1E":"#1847FF"}}>
                    {selected.status==="APPROVED"?"✅ 반영 완료":selected.status==="SPAM"?"🚫 스팸 처리됨":"💬 답변 완료"}
                  </div>
                )}
              </div>
            ) : (
              <div style={{background:"white",borderRadius:"18px",padding:"60px",textAlign:"center",color:"#AAA"}}>
                <AlertTriangle size={40} color="#E0DDD7" style={{margin:"0 auto 14px"}}/>
                <div style={{fontSize:"15px",fontWeight:800}}>요청을 선택해주세요</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
