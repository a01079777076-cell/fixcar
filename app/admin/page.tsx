"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { Shield, Car, Users, MessageSquare, AlertTriangle, BarChart3, CheckCircle, XCircle, ChevronDown } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState("dashboard");
  const [cars, setCars] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (d?.user?.role !== "ADMIN") { router.push("/"); return; }
      setUser(d.user);
      loadAll();
    }).catch(() => router.push("/"));
  }, [router]);

  const loadAll = async () => {
    const [cR, iR, uR] = await Promise.all([
      fetch("/api/admin/cars").then(r=>r.json()).catch(()=>[]),
      fetch("/api/admin/inquiries").then(r=>r.json()).catch(()=>[]),
      fetch("/api/admin/users").then(r=>r.json()).catch(()=>[]),
    ]);
    if(Array.isArray(cR)) setCars(cR);
    if(Array.isArray(iR)) setInquiries(iR);
    if(Array.isArray(uR)) setUsers(uR);
  };

  const updateCarStatus = async (carId:number, status:string) => {
    await fetch("/api/admin/cars",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({carId,status})});
    setCars(cars.map(c=>c.id===carId?{...c,status}:c));
  };

  const updateUserRole = async (userId:number, role:string) => {
    await fetch("/api/admin/users",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId,role})});
    setUsers(users.map(u=>u.id===userId?{...u,role}:u));
  };

  const replyInquiry = async (inquiryId:number, reply:string) => {
    await fetch("/api/admin/inquiries",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({inquiryId,reply})});
    setInquiries(inquiries.map(i=>i.id===inquiryId?{...i,reply,status:"REPLIED"}:i));
  };

  if(!user) return <><Navbar/><div style={{textAlign:"center",padding:100,color:"#CCC"}}>권한 확인 중...</div></>;

  const TABS = [
    {id:"dashboard",label:"대시보드",icon:BarChart3,count:0},
    {id:"cars",label:"매물 관리",icon:Car,count:cars.filter(c=>c.status==="REVIEWING").length},
    {id:"inquiries",label:"문의 관리",icon:MessageSquare,count:inquiries.filter(i=>i.status==="PENDING").length},
    {id:"users",label:"회원 관리",icon:Users,count:0},
  ];

  const S = {th:{fontSize:12,fontWeight:800,color:"#AAA",padding:"12px 16px",textAlign:"left" as const,background:"#F8F7F4"},td:{fontSize:13,padding:"12px 16px",borderBottom:"1px solid #F0EEE9"}};

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F8F7F4;} table{width:100%;border-collapse:collapse;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F8F7F4"}}>
        <div style={{background:"#0A0A0A",padding:"16px 24px"}}>
          <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",gap:10}}>
            <Shield size={18} color="#FF3B1E"/><span style={{fontSize:17,fontWeight:800,color:"white"}}>관리자 패널</span>
          </div>
        </div>

        <div style={{maxWidth:1200,margin:"0 auto",padding:"16px 16px 80px"}}>
          {/* 탭 */}
          <div style={{display:"flex",gap:6,marginBottom:20,overflowX:"auto"}}>
            {TABS.map(t=>{const Icon=t.icon;return(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                padding:"12px 20px",borderRadius:12,border:"none",fontSize:13,fontWeight:tab===t.id?800:600,
                background:tab===t.id?"white":"transparent",color:tab===t.id?"#FF3B1E":"#888",
                display:"flex",alignItems:"center",gap:8,cursor:"pointer",whiteSpace:"nowrap",
                boxShadow:tab===t.id?"0 2px 8px rgba(0,0,0,0.06)":"none",fontFamily:"'NanumSquareRound',sans-serif",
              }}><Icon size={16}/>{t.label}{t.count>0&&<span style={{background:"#FF3B1E",color:"white",borderRadius:100,minWidth:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800}}>{t.count}</span>}</button>
            );})}
          </div>

          {/* ═══ 대시보드 ═══ */}
          {tab==="dashboard"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                {[
                  {label:"전체 매물",value:cars.length,color:"#1847FF"},
                  {label:"검수 대기",value:cars.filter(c=>c.status==="REVIEWING").length,color:"#E8A020"},
                  {label:"답변 대기",value:inquiries.filter(i=>i.status==="PENDING").length,color:"#FF3B1E"},
                  {label:"전체 회원",value:users.length,color:"#2D8A52"},
                ].map(s=>(
                  <div key={s.label} style={{background:"white",borderRadius:16,padding:"22px 20px"}}>
                    <div style={{fontSize:11,color:"#AAA",marginBottom:6}}>{s.label}</div>
                    <div style={{fontSize:28,fontWeight:800,color:s.color}}>{s.value}</div>
                  </div>
                ))}
              </div>
              {cars.filter(c=>c.status==="REVIEWING").length>0&&(
                <div style={{background:"#FFF0ED",borderRadius:16,padding:"16px 22px",border:"1px solid #FFB8A8",marginBottom:12,cursor:"pointer"}} onClick={()=>setTab("cars")}>
                  <span style={{fontSize:14,fontWeight:800,color:"#FF3B1E"}}>⚠️ 검수 대기 매물 {cars.filter(c=>c.status==="REVIEWING").length}건 →</span>
                </div>
              )}
              {inquiries.filter(i=>i.status==="PENDING").length>0&&(
                <div style={{background:"#FFF8EC",borderRadius:16,padding:"16px 22px",border:"1px solid #F0D88A",cursor:"pointer"}} onClick={()=>setTab("inquiries")}>
                  <span style={{fontSize:14,fontWeight:800,color:"#B8860B"}}>📨 답변 대기 문의 {inquiries.filter(i=>i.status==="PENDING").length}건 →</span>
                </div>
              )}
            </div>
          )}

          {/* ═══ 매물 관리 ═══ */}
          {tab==="cars"&&(
            <div style={{background:"white",borderRadius:18,overflow:"hidden"}}>
              <table>
                <thead><tr>
                  <th style={S.th}>ID</th><th style={S.th}>차량명</th><th style={S.th}>가격</th><th style={S.th}>딜러</th><th style={S.th}>상태</th><th style={S.th}>액션</th>
                </tr></thead>
                <tbody>
                  {cars.length===0?<tr><td colSpan={6} style={{...S.td,textAlign:"center",color:"#CCC",padding:40}}>매물 없음</td></tr>:
                  cars.map(car=>(
                    <tr key={car.id}>
                      <td style={S.td}>#{car.id}</td>
                      <td style={{...S.td,fontWeight:700}}>{car.brand} {car.name}</td>
                      <td style={S.td}>{car.price?.toLocaleString()}만</td>
                      <td style={S.td}>{car.dealer?.shopName||"-"}</td>
                      <td style={S.td}><span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:100,background:car.status==="AVAILABLE"?"#EAF6EF":car.status==="REVIEWING"?"#FFF0ED":"#F0EEE9",color:car.status==="AVAILABLE"?"#2D8A52":car.status==="REVIEWING"?"#FF3B1E":"#888"}}>{car.status==="AVAILABLE"?"판매중":car.status==="REVIEWING"?"검수대기":"완료"}</span></td>
                      <td style={S.td}>
                        {car.status==="REVIEWING"&&<div style={{display:"flex",gap:4}}>
                          <button onClick={()=>updateCarStatus(car.id,"AVAILABLE")} style={{border:"none",background:"#2D8A52",color:"white",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}><CheckCircle size={10}/> 승인</button>
                          <button onClick={()=>updateCarStatus(car.id,"SOLD")} style={{border:"none",background:"#E24B4A",color:"white",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}><XCircle size={10}/> 반려</button>
                        </div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ═══ 문의 관리 ═══ */}
          {tab==="inquiries"&&(
            <div>
              {inquiries.length===0?<div style={{background:"white",borderRadius:18,padding:48,textAlign:"center",color:"#CCC"}}>문의 없음</div>:
              inquiries.map(inq=>(
                <div key={inq.id} style={{background:"white",borderRadius:16,padding:"18px 22px",marginBottom:10,border:inq.status==="PENDING"?"2px solid #FFE4DE":"1px solid #F0EEE9"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <div><span style={{fontWeight:800}}>{inq.car?.brand} {inq.car?.name}</span><span style={{fontSize:12,color:"#AAA",marginLeft:8}}>{inq.car?.price?.toLocaleString()}만</span></div>
                    <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100,background:inq.status==="REPLIED"?"#EAF6EF":"#FFF0ED",color:inq.status==="REPLIED"?"#2D8A52":"#FF3B1E"}}>{inq.status==="REPLIED"?"답변완료":"대기"}</span>
                  </div>
                  <div style={{fontSize:12,color:"#888",marginBottom:6}}>👤 {inq.user?.name||"익명"} · {inq.user?.phone||inq.user?.email||""}</div>
                  <div style={{background:"#F8F7F4",borderRadius:10,padding:"10px 14px",fontSize:14,color:"#555",marginBottom:8}}>{inq.message}</div>
                  {inq.reply?<div style={{background:"#EEF5FF",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#0066FF"}}>{inq.reply}</div>:(
                    <InlineReply onReply={(reply:string)=>replyInquiry(inq.id,reply)}/>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ═══ 회원 관리 ═══ */}
          {tab==="users"&&(
            <div style={{background:"white",borderRadius:18,overflow:"hidden"}}>
              <table>
                <thead><tr>
                  <th style={S.th}>ID</th><th style={S.th}>이름</th><th style={S.th}>이메일</th><th style={S.th}>가입방식</th><th style={S.th}>권한</th><th style={S.th}>가입일</th><th style={S.th}>변경</th>
                </tr></thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id}>
                      <td style={S.td}>#{u.id}</td>
                      <td style={{...S.td,fontWeight:700}}>{u.name}</td>
                      <td style={{...S.td,fontSize:12,color:"#888"}}>{u.email}</td>
                      <td style={S.td}><span style={{fontSize:11,fontWeight:700,color:u.provider==="kakao"?"#3C1E1E":"#555",background:u.provider==="kakao"?"#FEE500":"#F0EEE9",padding:"2px 8px",borderRadius:4}}>{u.provider==="kakao"?"카카오":"픽스카"}</span></td>
                      <td style={S.td}><span style={{fontSize:11,fontWeight:700,color:u.role==="ADMIN"?"#FF3B1E":u.role==="DEALER"?"#0066FF":"#888"}}>{u.role}</span></td>
                      <td style={{...S.td,fontSize:12,color:"#CCC"}}>{new Date(u.createdAt).toLocaleDateString("ko-KR")}</td>
                      <td style={S.td}>
                        <select value={u.role} onChange={e=>updateUserRole(u.id,e.target.value)} style={{padding:"4px 8px",borderRadius:6,border:"1px solid #E0DDD7",fontSize:11,fontFamily:"'NanumSquareRound',sans-serif"}}>
                          <option value="USER">USER</option>
                          <option value="DEALER">DEALER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* 인라인 답변 컴포넌트 */
function InlineReply({onReply}:{onReply:(r:string)=>void}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  if(!open) return <button onClick={()=>setOpen(true)} style={{border:"none",background:"#0066FF",color:"white",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>답변하기</button>;
  return (
    <div style={{display:"flex",gap:8}}>
      <textarea rows={2} value={text} onChange={e=>setText(e.target.value)} placeholder="답변 입력" style={{flex:1,padding:"8px 12px",border:"1.5px solid #DDEEFF",borderRadius:8,fontSize:13,fontFamily:"'NanumSquareRound',sans-serif",resize:"none"}}/>
      <button onClick={()=>{if(text.trim())onReply(text);}} style={{padding:"8px 16px",background:"#0066FF",color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",alignSelf:"flex-end"}}>전송</button>
    </div>
  );
}
