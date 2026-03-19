"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

interface Dealer {
  id:string; shopName?:string; ownerName?:string; phone?:string; email?:string;
  address?:string; businessNumber?:string; isApproved:boolean; createdAt:string;
  user?:{ name?:string; email?:string };
  _count?:{ cars:number; inquiries:number };
}

function formatPhone(p:string|null|undefined):string {
  if (!p) return "-";
  const d = p.replace(/\D/g,"");
  if (d.length===11) return `${d.slice(0,3)}-${d.slice(3,7)}-${d.slice(7)}`;
  return p;
}

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all"|"pending"|"approved">("all");
  const [expandedId, setExpandedId] = useState<string|null>(null);

  useEffect(() => {
    fetch("/api/admin/dealers")
      .then(r=>r.json())
      .then(data=>{ setDealers(Array.isArray(data)?data:data.dealers||[]); setLoading(false); })
      .catch(()=>{ setDealers([]); setLoading(false); });
  }, []);

  const handleApprove = async (id:string) => {
    try {
      const res = await fetch(`/api/admin/dealers/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve: true }),
      });
      if (res.ok) {
        setDealers(prev=>prev.map(d=>d.id===id?{...d,isApproved:true}:d));
      } else {
        alert("승인 실패");
      }
    } catch { alert("승인 요청 실패"); }
  };

  const handleReject = async (id:string) => {
    if (!confirm("정말 거부하시겠습니까?")) return;
    try {
      await fetch(`/api/admin/dealers/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve: false }),
      });
      setDealers(prev=>prev.filter(d=>d.id!==id));
    } catch { alert("거부 요청 실패"); }
  };

  const filtered = dealers.filter(d => {
    if (tab === "pending") return !d.isApproved;
    if (tab === "approved") return d.isApproved;
    return true;
  });

  const pendingCount = dealers.filter(d=>!d.isApproved).length;

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
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:12,letterSpacing:4,color:"#E8A020",marginBottom:6}}>DEALER MANAGEMENT</div>
            <h1 style={{fontSize:28,fontWeight:800,color:"white"}}>딜러 관리</h1>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",fontWeight:400}}>전체 {dealers.length}명 · 대기 {pendingCount}명</p>
          </div>
        </div>
        <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px 100px"}}>
          {/* 탭 */}
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            {([["all","전체",dealers.length],["pending","신청 대기",pendingCount],["approved","승인됨",dealers.length-pendingCount]] as const).map(([id,label,count])=>(
              <button key={id} onClick={()=>setTab(id as "all"|"pending"|"approved")} style={{
                padding:"10px 18px",borderRadius:12,border:"none",fontSize:13,fontWeight:tab===id?800:600,
                background:tab===id?"#1A1A1A":"white",color:tab===id?"white":"#777",
                cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"flex",alignItems:"center",gap:6,
              }}>
                {label}
                <span style={{background:tab===id?"#FF3B1E":"#E8E6E1",color:tab===id?"white":"#888",padding:"2px 8px",borderRadius:100,fontSize:10,fontWeight:800}}>{count}</span>
              </button>
            ))}
          </div>

          {loading ? <div style={{textAlign:"center",padding:60,color:"#AAA"}}>로딩 중...</div> : filtered.length===0 ? (
            <div style={{background:"white",borderRadius:18,padding:"60px 24px",textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>{tab==="pending"?"⏳":"🏪"}</div>
              <div style={{fontSize:16,fontWeight:800}}>{tab==="pending"?"대기 중인 신청이 없어요":"등록된 딜러가 없어요"}</div>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {filtered.map(d=>(
                <div key={d.id} style={{background:"white",borderRadius:18,overflow:"hidden"}}>
                  {/* 요약 */}
                  <div onClick={()=>setExpandedId(expandedId===d.id?null:d.id)} style={{padding:"18px 22px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:14}}>
                      <div style={{width:44,height:44,borderRadius:12,background:d.isApproved?"#EEF2FF":"#FFF8EC",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>
                        {d.isApproved?"🏪":"⏳"}
                      </div>
                      <div>
                        <div style={{fontSize:16,fontWeight:800}}>{d.shopName||d.ownerName||"미입력"}</div>
                        <div style={{fontSize:12,color:"#AAA",fontWeight:400}}>{d.ownerName||"-"} · {formatPhone(d.phone)}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{padding:"5px 14px",borderRadius:100,fontSize:11,fontWeight:700,
                        background:d.isApproved?"#E8F8EF":"#FFF8EC",color:d.isApproved?"#00A854":"#CC8800",
                      }}>{d.isApproved?"승인됨":"대기중"}</span>
                      <span style={{fontSize:16,color:"#CCC",transform:expandedId===d.id?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</span>
                    </div>
                  </div>

                  {/* 상세 정보 */}
                  {expandedId===d.id && (
                    <div style={{padding:"0 22px 22px",borderTop:"1px solid #F0EEE9",paddingTop:18}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                        {[
                          ["상호명",d.shopName||"-"],
                          ["대표자",d.ownerName||"-"],
                          ["연락처",formatPhone(d.phone)],
                          ["이메일",d.email||d.user?.email||"-"],
                          ["사업자번호",d.businessNumber||"-"],
                          ["주소",d.address||"-"],
                          ["등록 매물",`${d._count?.cars||0}대`],
                          ["수신 문의",`${d._count?.inquiries||0}건`],
                          ["신청일",new Date(d.createdAt).toLocaleDateString("ko-KR")],
                        ].map(([l,v],i)=>(
                          <div key={i} style={{padding:"8px 0"}}>
                            <div style={{fontSize:11,color:"#AAA",fontWeight:400,marginBottom:2}}>{l}</div>
                            <div style={{fontSize:14,fontWeight:700}}>{v}</div>
                          </div>
                        ))}
                      </div>
                      {/* 승인/거부 버튼 */}
                      {!d.isApproved && (
                        <div style={{display:"flex",gap:10}}>
                          <button onClick={()=>handleApprove(d.id)} style={{flex:1,padding:"14px",background:"#00C471",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>✅ 승인하기</button>
                          <button onClick={()=>handleReject(d.id)} style={{padding:"14px 24px",background:"#FFF0ED",color:"#E24B4A",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>거부</button>
                        </div>
                      )}
                    </div>
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
