// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/admin/page.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { Shield, Car, Users, MessageSquare, BarChart3, Eye, X, Search, UserX, Key, ChevronDown, AlertTriangle } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser]         = useState<any>(null);
  const [tab,  setTab]          = useState("dashboard");
  const [cars,      setCars]    = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [users,     setUsers]   = useState<any[]>([]);
  const [flaggedPosts, setFlaggedPosts] = useState<any[]>([]);
  const [expandedFlag, setExpandedFlag] = useState<number|null>(null);
  const [detailCar, setDetailCar] = useState<any>(null);
  const [rejectId,  setRejectId] = useState<number|null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkResult, setBulkResult] = useState<any>(null);

  /* 회원 상세 모달 */
  const [detailUser, setDetailUser] = useState<any>(null);
  const [resetPwMsg, setResetPwMsg] = useState("");

  /* 회원 검색/필터 */
  const [userSearch,     setUserSearch]     = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("전체");

  useEffect(() => {
    fetch("/api/auth/session")
      .then(r => r.json())
      .then(d => {
        if (d?.user?.role !== "ADMIN") { router.push("/"); return; }
        setUser(d.user);
        loadAll();
      })
      .catch(() => router.push("/"));
  }, [router]);

  const loadAll = async () => {
    const [cR, iR, uR, fR] = await Promise.all([
      fetch("/api/admin/cars").then(r=>r.json()).catch(()=>[]),
      fetch("/api/admin/inquiries").then(r=>r.json()).catch(()=>[]),
      fetch("/api/admin/users").then(r=>r.json()).catch(()=>[]),
      fetch("/api/admin/community").then(r=>r.json()).catch(()=>[]),
    ]);
    if (Array.isArray(cR)) setCars(cR);
    if (Array.isArray(iR)) setInquiries(iR);
    if (Array.isArray(uR)) setUsers(uR);
    if (Array.isArray(fR)) setFlaggedPosts(fR);
  };

  /* ── 매물 처리 ── */
  const updateCar = async (carId:number, status:string, reason?:string) => {
    const label = status==="AVAILABLE"?"승인":status==="SOLD"?"반려":status==="RESERVED"?"내리기":"올리기";
    if (status!=="SOLD" && !confirm(`이 매물을 "${label}" 하시겠습니까?`)) return;
    await fetch("/api/admin/cars", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({carId,status,reason}) });
    setCars(cars.map(c => c.id===carId ? {...c, status, rejectReason: reason||c.rejectReason} : c));
    setDetailCar(null); setRejectId(null); setRejectReason("");
  };
  const handleReject = (carId:number) => {
    if (!rejectReason.trim()) { alert("반려 사유를 입력해주세요"); return; }
    updateCar(carId, "SOLD", rejectReason);
  };

  /* ── 회원 처리 ── */
  const updateUserRole = async (userId:number, role:string) => {
    const res = await fetch("/api/admin/users", {
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ action:"role", userId, role }),
    });
    const d = await res.json();
    if (d.success) {
      setUsers(users.map(u => u.id===userId ? {...u, role} : u));
      if (detailUser?.id === userId) setDetailUser((prev:any) => ({...prev, role}));
    }
  };

  const resetPassword = async (userId:number) => {
    if (!confirm("비밀번호를 'fixcar1234'로 초기화하시겠습니까?")) return;
    const res = await fetch("/api/admin/users", {
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ action:"reset_pw", userId }),
    });
    const d = await res.json();
    if (d.success) setResetPwMsg(`초기화 완료 → 임시 비번: ${d.tempPw}`);
    else setResetPwMsg("초기화 실패");
  };

  const deleteUser = async (userId:number, name:string) => {
    if (!confirm(`⚠️ "${name}" 계정을 완전히 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;
    const res = await fetch("/api/admin/users", {
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ action:"delete", userId }),
    });
    const d = await res.json();
    if (d.success) { setUsers(users.filter(u => u.id !== userId)); setDetailUser(null); }
    else alert("삭제 실패");
  };

  /* ── 문의 답변 ── */
  const replyInquiry = async (inquiryId:number, reply:string) => {
    await fetch("/api/admin/inquiries", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({inquiryId,reply}) });
    setInquiries(inquiries.map(i => i.id===inquiryId ? {...i, reply, status:"REPLIED"} : i));
  };

  /* ── 회원 검색 + 필터 ── */
  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase().trim();
    return users.filter(u => {
      const uid = (u.email||"").replace("@fixcar.local","").replace("@fixcar.kr","").toLowerCase();
      const matchRole = userRoleFilter==="전체" || u.role===userRoleFilter;
      if (!q) return matchRole;
      return matchRole && (
        u.name?.toLowerCase().includes(q) ||
        uid.includes(q) ||
        u.phone?.includes(q) ||
        u.nickname?.toLowerCase().includes(q)
      );
    });
  }, [users, userSearch, userRoleFilter]);

  if (!user) return <><Navbar/><div style={{textAlign:"center",padding:100,color:"#CCC"}}>권한 확인 중...</div></>;

  const TABS = [
    {id:"dashboard", label:"대시보드",   icon:BarChart3,     count:0},
    {id:"cars",      label:"매물 관리",  icon:Car,           count:cars.filter(c=>c.status==="REVIEWING").length},
    {id:"flagged",   label:"보류 게시글",icon:AlertTriangle, count:flaggedPosts.filter(p=>p.status==="FLAGGED").length},
    {id:"inquiries", label:"문의 관리",  icon:MessageSquare, count:inquiries.filter(i=>i.status==="PENDING").length},
    {id:"users",     label:"회원 관리",  icon:Users,         count:0},
    {id:"stats",     label:"방문자 통계",icon:Eye,           count:0},
  ];

  const statusLabel = (s:string) => s==="AVAILABLE"?"판매중":s==="REVIEWING"?"검수대기":s==="SOLD"?"반려":s==="RESERVED"?"내림":"완료";
  const statusColor = (s:string) => s==="AVAILABLE"?"#2D8A52":s==="REVIEWING"?"#E8A020":s==="SOLD"?"#E24B4A":"#888";
  const statusBg    = (s:string) => s==="AVAILABLE"?"#EAF6EF":s==="REVIEWING"?"#FFF8EC":s==="SOLD"?"#FFF0ED":"#F0EEE9";
  const roleColor   = (r:string) => r==="ADMIN"?"#FF3B1E":r==="DEALER"?"#0066FF":"#888";
  const roleBg      = (r:string) => r==="ADMIN"?"#FFF0ED":r==="DEALER"?"#EEF5FF":"#F0EEE9";

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F8F7F4;} table{width:100%;border-collapse:collapse;} textarea:focus,input:focus{outline:none;} tr:hover td{background:#FAFAFA!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F8F7F4"}}>
        <div style={{background:"#0A0A0A",padding:"16px 24px"}}>
          <div style={{maxWidth:1300,margin:"0 auto",display:"flex",alignItems:"center",gap:10}}>
            <Shield size={18} color="#FF3B1E"/>
            <span style={{fontSize:17,fontWeight:800,color:"white"}}>관리자 패널</span>
          </div>
        </div>

        <div style={{maxWidth:1300,margin:"0 auto",padding:"16px 16px 80px"}}>
          {/* 탭 */}
          <div style={{display:"flex",gap:6,marginBottom:20,overflowX:"auto"}}>
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"12px 20px",borderRadius:12,border:"none",fontSize:13,fontWeight:tab===t.id?800:600,background:tab===t.id?"white":"transparent",color:tab===t.id?"#FF3B1E":"#888",display:"flex",alignItems:"center",gap:8,cursor:"pointer",whiteSpace:"nowrap",boxShadow:tab===t.id?"0 2px 8px rgba(0,0,0,0.06)":"none",fontFamily:"'NanumSquareRound',sans-serif"}}>
                  <Icon size={16}/>{t.label}
                  {t.count>0&&<span style={{background:"#FF3B1E",color:"white",borderRadius:100,minWidth:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800}}>{t.count}</span>}
                </button>
              );
            })}
          </div>

          {/* ══ 대시보드 ══ */}
          {tab==="dashboard" && (
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
                {[
                  {l:"전체 매물",v:cars.length,c:"#1847FF"},
                  {l:"검수 대기",v:cars.filter(c=>c.status==="REVIEWING").length,c:"#E8A020"},
                  {l:"답변 대기",v:inquiries.filter(i=>i.status==="PENDING").length,c:"#FF3B1E"},
                  {l:"전체 회원",v:users.length,c:"#2D8A52"},
                ].map(s=>(
                  <div key={s.l} style={{background:"white",borderRadius:16,padding:"22px 20px"}}>
                    <div style={{fontSize:11,color:"#AAA",marginBottom:6}}>{s.l}</div>
                    <div style={{fontSize:28,fontWeight:800,color:s.c}}>{s.v}</div>
                  </div>
                ))}
              </div>
              {cars.filter(c=>c.status==="REVIEWING").length>0&&(
                <div style={{background:"#FFF0ED",borderRadius:16,padding:"16px 22px",border:"1px solid #FFB8A8",marginBottom:12,cursor:"pointer"}} onClick={()=>setTab("cars")}>
                  <span style={{fontSize:14,fontWeight:800,color:"#FF3B1E"}}>⚠️ 검수 대기 {cars.filter(c=>c.status==="REVIEWING").length}건 →</span>
                </div>
              )}
            </div>
          )}

          {/* ══ 매물 관리 ══ */}
          {tab==="cars" && (
            <div>
              {/* 엑셀 일괄등록 */}
              <div style={{background:"white",borderRadius:16,padding:"18px 22px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontSize:14,fontWeight:800}}>📊 딜러 매물 엑셀 등록</div>
                  <div style={{fontSize:12,color:"#AAA",marginTop:2}}>양식 다운로드 → 작성 → 업로드</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <a href="/fixcar_car_template.xlsx" download><button style={{padding:"10px 18px",background:"#EEF5FF",border:"1.5px solid #0066FF",borderRadius:10,fontSize:12,fontWeight:700,color:"#0066FF",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>📥 양식 다운로드</button></a>
                  <button onClick={()=>{
                    const inp=document.createElement("input");inp.type="file";inp.accept=".xlsx,.xls";
                    inp.onchange=async(e)=>{
                      const file=(e.target as HTMLInputElement).files?.[0];if(!file)return;
                      setBulkUploading(true);setBulkResult(null);
                      const fd=new FormData();fd.append("file",file);
                      try{const res=await fetch("/api/admin/cars/bulk",{method:"POST",body:fd});const d=await res.json();setBulkResult(d);if(d.success)loadAll();}catch(err){setBulkResult({error:"업로드 실패"});}
                      setBulkUploading(false);
                    };inp.click();
                  }} disabled={bulkUploading} style={{padding:"10px 18px",background:bulkUploading?"#CCC":"#FF3B1E",border:"none",borderRadius:10,fontSize:12,fontWeight:700,color:"white",cursor:bulkUploading?"wait":"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                    {bulkUploading?"업로드 중...":"📤 엑셀 업로드"}
                  </button>
                </div>
              </div>
              {bulkResult&&(
                <div style={{background:bulkResult.error?"#FFF0ED":"#EAF6EF",borderRadius:12,padding:"14px 18px",marginBottom:16,border:bulkResult.error?"1px solid #FFB8A8":"1px solid #B8DFC8"}}>
                  {bulkResult.error?<div style={{fontSize:13,fontWeight:700,color:"#E24B4A"}}>{bulkResult.error}</div>:
                  <div>
                    <div style={{fontSize:14,fontWeight:800,color:"#2D8A52",marginBottom:6}}>{bulkResult.message}</div>
                    {bulkResult.details?.filter((d:any)=>!d.success).map((d:any)=><div key={d.row} style={{fontSize:11,color:"#E24B4A"}}>{d.row}행: {d.error}</div>)}
                  </div>}
                </div>
              )}
              {cars.length===0
                ? <div style={{background:"white",borderRadius:18,padding:48,textAlign:"center",color:"#CCC"}}>매물 없음</div>
                : cars.sort((a,b)=>{const order:Record<string,number>={"REVIEWING":0,"AVAILABLE":1,"RESERVED":2,"SOLD":3};return (order[a.status]??9)-(order[b.status]??9);}).map(car=>(
                  <div key={car.id} style={{background:"white",borderRadius:16,padding:"18px 22px",marginBottom:10,border:car.status==="REVIEWING"?"2px solid #FFE4DE":"1px solid #F0EEE9"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <span style={{fontSize:12,color:"#CCC"}}>#{car.id}</span>
                        <span style={{fontSize:15,fontWeight:800}}>{car.brand} {car.name}</span>
                        <span style={{fontSize:13,fontWeight:800,color:"#FF3B1E"}}>{car.price?.toLocaleString()}만</span>
                      </div>
                      <span style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:100,background:statusBg(car.status),color:statusColor(car.status)}}>{statusLabel(car.status)}</span>
                    </div>
                    <div style={{fontSize:12,color:"#AAA",marginBottom:10}}>{car.year}년 · {car.mileage?.toLocaleString()}km · {car.fuel} · 딜러: {car.dealer?.shopName||"-"}</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      <button onClick={()=>setDetailCar(car)} style={{padding:"8px 16px",background:"white",border:"1.5px solid #0066FF",borderRadius:10,fontSize:12,fontWeight:700,color:"#0066FF",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>📋 상세보기</button>
                      {car.status==="REVIEWING"&&<>
                        <button onClick={()=>updateCar(car.id,"AVAILABLE")} style={{padding:"8px 16px",background:"#2D8A52",border:"none",borderRadius:10,fontSize:12,fontWeight:700,color:"white",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>✓ 승인</button>
                        <button onClick={()=>setRejectId(rejectId===car.id?null:car.id)} style={{padding:"8px 16px",background:"#E24B4A",border:"none",borderRadius:10,fontSize:12,fontWeight:700,color:"white",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>✕ 반려</button>
                      </>}
                      {car.status==="AVAILABLE"&&<button onClick={()=>updateCar(car.id,"RESERVED")} style={{padding:"8px 16px",background:"#E8A020",border:"none",borderRadius:10,fontSize:12,fontWeight:700,color:"white",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>⏸ 내리기</button>}
                      {car.status==="RESERVED"&&<button onClick={()=>updateCar(car.id,"AVAILABLE")} style={{padding:"8px 16px",background:"#2D8A52",border:"none",borderRadius:10,fontSize:12,fontWeight:700,color:"white",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>▶ 다시올리기</button>}
                    </div>
                    {rejectId===car.id&&(
                      <div style={{marginTop:12,background:"#FFF8F6",borderRadius:12,padding:"14px 16px",border:"1px solid #FFE4DE"}}>
                        <div style={{fontSize:13,fontWeight:800,color:"#E24B4A",marginBottom:8}}>⚠️ 반려 사유 입력</div>
                        <textarea rows={3} value={rejectReason} onChange={e=>setRejectReason(e.target.value)} placeholder="딜러에게 전달할 반려 사유를 작성해주세요" style={{width:"100%",padding:"10px 14px",border:"1.5px solid #FFD4CC",borderRadius:10,fontSize:13,fontFamily:"'NanumSquareRound',sans-serif",resize:"none"}}/>
                        <div style={{display:"flex",gap:8,marginTop:8}}>
                          <button onClick={()=>handleReject(car.id)} style={{padding:"8px 20px",background:"#E24B4A",color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>반려 확정</button>
                          <button onClick={()=>{setRejectId(null);setRejectReason("");}} style={{padding:"8px 16px",background:"#F0EEE9",color:"#888",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>취소</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          )}

          {/* ══ 문의 관리 ══ */}
          {tab==="inquiries" && (
            <div>
              {inquiries.length===0
                ? <div style={{background:"white",borderRadius:18,padding:48,textAlign:"center",color:"#CCC"}}>문의 없음</div>
                : inquiries.map(inq=>(
                  <div key={inq.id} style={{background:"white",borderRadius:16,padding:"18px 22px",marginBottom:10,border:inq.status==="PENDING"?"2px solid #FFE4DE":"1px solid #F0EEE9"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <div>
                        <span style={{fontWeight:800}}>{inq.car?.brand} {inq.car?.name}</span>
                        <span style={{fontSize:12,color:"#AAA",marginLeft:8}}>{inq.car?.price?.toLocaleString()}만</span>
                      </div>
                      <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100,background:inq.status==="REPLIED"?"#EAF6EF":"#FFF0ED",color:inq.status==="REPLIED"?"#2D8A52":"#FF3B1E"}}>{inq.status==="REPLIED"?"완료":"대기"}</span>
                    </div>
                    <div style={{fontSize:12,color:"#888",marginBottom:6}}>👤 {inq.user?.name||"익명"}</div>
                    <div style={{background:"#F8F7F4",borderRadius:10,padding:"10px 14px",fontSize:14,color:"#555",marginBottom:8}}>{inq.message}</div>
                    {inq.reply
                      ? <div style={{background:"#EEF5FF",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#0066FF"}}>{inq.reply}</div>
                      : <InlineReply onReply={(r:string)=>replyInquiry(inq.id,r)}/>
                    }
                  </div>
                ))
              }
            </div>
          )}

          {/* ══ 회원 관리 (전면 개편) ══ */}
          {tab==="users" && (
            <div>
              {/* 검색 + 필터 바 */}
              <div style={{background:"white",borderRadius:14,padding:"14px 18px",marginBottom:12,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                <div style={{position:"relative",flex:1,minWidth:200}}>
                  <Search size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#CCC"}}/>
                  <input
                    value={userSearch} onChange={e=>setUserSearch(e.target.value)}
                    placeholder="이름·아이디·연락처·닉네임 검색"
                    style={{width:"100%",padding:"10px 12px 10px 34px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:13,fontFamily:"'NanumSquareRound',sans-serif"}}
                  />
                </div>
                <div style={{display:"flex",gap:6}}>
                  {["전체","USER","DEALER","ADMIN"].map(r=>(
                    <button key={r} onClick={()=>setUserRoleFilter(r)} style={{padding:"8px 14px",borderRadius:8,border:"none",fontSize:12,fontWeight:userRoleFilter===r?800:600,background:userRoleFilter===r?(r==="USER"?"#F0EEE9":r==="DEALER"?"#EEF5FF":r==="ADMIN"?"#FFF0ED":"#1A1A1A"):"#F0EEE9",color:userRoleFilter===r?(r==="USER"?"#888":r==="DEALER"?"#0066FF":r==="ADMIN"?"#FF3B1E":"white"):"#888",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                      {r} {r!=="전체"&&<span style={{fontSize:10}}>({users.filter(u=>u.role===r).length})</span>}
                    </button>
                  ))}
                </div>
                <div style={{fontSize:12,color:"#AAA",marginLeft:"auto",whiteSpace:"nowrap"}}>{filteredUsers.length}/{users.length}명</div>
              </div>

              {/* 테이블 */}
              <div style={{background:"white",borderRadius:16,overflow:"hidden"}}>
                <div style={{overflowX:"auto"}}>
                  <table>
                    <thead>
                      <tr style={{background:"#F8F7F4"}}>
                        {["ID","이름","아이디","닉네임","딜러닉","연락처","생년월일","가입방식","권한","가입일","관리"].map(h=>(
                          <th key={h} style={{fontSize:11,fontWeight:800,color:"#AAA",padding:"12px 12px",textAlign:"left",whiteSpace:"nowrap",borderBottom:"1px solid #F0EEE9"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => {
                        const uid = (u.email||"").replace("@fixcar.local","").replace("@fixcar.kr","");
                        return (
                          <tr key={u.id} onClick={()=>{setDetailUser(u);setResetPwMsg("");}} style={{cursor:"pointer"}}>
                            <td style={{fontSize:11,padding:"10px 12px",borderBottom:"1px solid #F0EEE9",color:"#CCC"}}>#{u.id}</td>
                            <td style={{fontSize:13,padding:"10px 12px",borderBottom:"1px solid #F0EEE9",fontWeight:700}}>{u.name}</td>
                            <td style={{fontSize:12,padding:"10px 12px",borderBottom:"1px solid #F0EEE9",color:"#888",fontFamily:"monospace"}}>{uid}</td>
                            <td style={{fontSize:12,padding:"10px 12px",borderBottom:"1px solid #F0EEE9"}}>{u.nickname||<span style={{color:"#E0DDD7"}}>-</span>}</td>
                            <td style={{fontSize:12,padding:"10px 12px",borderBottom:"1px solid #F0EEE9",color:"#0066FF"}}>{u.nicknameDealer||<span style={{color:"#E0DDD7"}}>-</span>}</td>
                            <td style={{fontSize:12,padding:"10px 12px",borderBottom:"1px solid #F0EEE9",color:"#888"}}>{u.phone||"-"}</td>
                            <td style={{fontSize:11,padding:"10px 12px",borderBottom:"1px solid #F0EEE9",color:"#AAA"}}>{u.birthdate||"-"}</td>
                            <td style={{fontSize:12,padding:"10px 12px",borderBottom:"1px solid #F0EEE9"}}>
                              <span style={{fontSize:10,fontWeight:700,color:u.provider==="kakao"?"#3C1E1E":"#555",background:u.provider==="kakao"?"#FEE500":"#F0EEE9",padding:"2px 8px",borderRadius:4}}>
                                {u.provider==="kakao"?"카카오":"픽스카"}
                              </span>
                            </td>
                            <td style={{fontSize:12,padding:"10px 12px",borderBottom:"1px solid #F0EEE9"}}>
                              <span style={{fontSize:11,fontWeight:800,color:roleColor(u.role),background:roleBg(u.role),padding:"2px 8px",borderRadius:6}}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{fontSize:11,padding:"10px 12px",borderBottom:"1px solid #F0EEE9",color:"#CCC",whiteSpace:"nowrap"}}>{new Date(u.createdAt).toLocaleDateString("ko-KR")}</td>
                            <td style={{padding:"10px 12px",borderBottom:"1px solid #F0EEE9"}} onClick={e=>e.stopPropagation()}>
                              <select
                                value={u.role}
                                onChange={e=>updateUserRole(u.id,e.target.value)}
                                style={{padding:"4px 8px",borderRadius:6,border:"1px solid #E0DDD7",fontSize:11,fontFamily:"'NanumSquareRound',sans-serif",cursor:"pointer"}}
                              >
                                <option value="USER">USER</option>
                                <option value="DEALER">DEALER</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredUsers.length===0&&(
                    <div style={{textAlign:"center",padding:"40px",color:"#CCC",fontSize:14}}>검색 결과 없음</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ 보류 게시글 관리 ══ */}
          {tab==="flagged" && (
            <div>
              {flaggedPosts.length===0
                ? <div style={{background:"white",borderRadius:18,padding:48,textAlign:"center",color:"#CCC"}}>보류 게시글 없음</div>
                : flaggedPosts.map(post=>(
                  <div key={post.id} style={{background:"white",borderRadius:16,padding:"18px 22px",marginBottom:10,border:post.status==="FLAGGED"?"2px solid #FFE4DE":"1px solid #F0EEE9"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:12,color:"#CCC"}}>#{post.id}</span>
                        <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100,background:post.status==="FLAGGED"?"#FFF8EC":"#FFF0ED",color:post.status==="FLAGGED"?"#E8A020":"#E24B4A"}}>{post.status==="FLAGGED"?"보류":"차단"}</span>
                        <span style={{fontSize:13,fontWeight:800}}>{post.title}</span>
                      </div>
                      <span style={{fontSize:11,color:"#CCC"}}>{new Date(post.createdAt).toLocaleString("ko-KR")}</span>
                    </div>
                    <div style={{fontSize:12,color:"#888",marginBottom:6}}>작성자: {post.author?.nickname||post.author?.name||"익명"} ({post.author?.email?.replace("@fixcar.local","")})</div>
                    {post.flagReason&&<div style={{fontSize:11,color:"#E8A020",background:"#FFF8EC",padding:"6px 12px",borderRadius:8,marginBottom:8}}>⚠️ {post.flagReason}</div>}
                    <button onClick={()=>setExpandedFlag(expandedFlag===post.id?null:post.id)} style={{width:"100%",textAlign:"left",border:"1px solid #E8E5E0",background:"#F8F7F4",borderRadius:10,padding:"12px 14px",fontSize:13,color:"#555",marginBottom:12,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontWeight:700}}>{expandedFlag===post.id?"▼ 내용 접기":"▶ 내용 보기 (클릭)"}</span>
                      <span style={{fontSize:11,color:"#AAA"}}>{(post.content||"").replace(/<[^>]*>/g,"").length}자</span>
                    </button>
                    {expandedFlag===post.id&&<div style={{background:"white",borderRadius:10,padding:"14px",fontSize:13,color:"#555",marginBottom:12,lineHeight:1.7,border:"1px solid #E8E5E0"}} dangerouslySetInnerHTML={{__html:post.content||""}}/>}
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <button onClick={async()=>{
                        await fetch("/api/admin/community",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"approve",postId:post.id})});
                        setFlaggedPosts(prev=>prev.filter(p=>p.id!==post.id));
                      }} style={{padding:"8px 16px",background:"#2D8A52",color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>✓ 승인 (게시)</button>
                      <button onClick={async()=>{
                        await fetch("/api/admin/community",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"block",postId:post.id,reason:"관리자 차단"})});
                        setFlaggedPosts(prev=>prev.map(p=>p.id===post.id?{...p,status:"BLOCKED"}:p));
                      }} style={{padding:"8px 16px",background:"#E24B4A",color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>✕ 차단</button>
                      <button onClick={async()=>{
                        if(!confirm("게시글을 완전 삭제하시겠습니까?"))return;
                        await fetch("/api/admin/community",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"delete",postId:post.id})});
                        setFlaggedPosts(prev=>prev.filter(p=>p.id!==post.id));
                      }} style={{padding:"8px 16px",background:"#F0EEE9",color:"#888",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>🗑 삭제</button>
                      <div style={{width:1,background:"#E0DDD7",margin:"0 4px"}}/>
                      <select onChange={async(e)=>{
                        const v=e.target.value; if(!v)return;
                        if(!confirm(`이 유저를 ${v==="permanent"?"영구":v+"일"} 벤 하시겠습니까?`))return;
                        await fetch("/api/admin/community",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"ban",userId:post.author?.id,banDays:v,reason:post.flagReason})});
                        alert("유저 제재 완료");e.target.value="";
                      }} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #FFB8A8",fontSize:11,fontFamily:"'NanumSquareRound',sans-serif",color:"#E24B4A",cursor:"pointer"}}>
                        <option value="">🚫 유저 벤...</option>
                        <option value="3">3일 벤</option>
                        <option value="7">7일 벤</option>
                        <option value="30">30일 벤</option>
                        <option value="permanent">영구 벤</option>
                      </select>
                      <select onChange={async(e)=>{
                        const v=e.target.value; if(!v)return;
                        await fetch("/api/admin/community",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"mute",userId:post.author?.id,banDays:v})});
                        alert(`글쓰기 권한 ${v}일 제한 완료`);e.target.value="";
                      }} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #E0DDD7",fontSize:11,fontFamily:"'NanumSquareRound',sans-serif",color:"#888",cursor:"pointer"}}>
                        <option value="">✏️ 글권한 제한...</option>
                        <option value="3">3일 글쓰기 제한</option>
                        <option value="7">7일 글쓰기 제한</option>
                        <option value="30">30일 글쓰기 제한</option>
                      </select>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {/* ══ 방문자 통계 ══ */}
          {tab==="stats" && <AdminStats/>}
        </div>
      </div>

      {/* ══ 매물 상세 모달 (편집 가능) ══ */}
      {detailCar && (
        <>
          <div onClick={()=>setDetailCar(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:10000}}/>
          <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"white",borderRadius:24,padding:"28px",width:"min(720px,94vw)",maxHeight:"90vh",overflowY:"auto",zIndex:10001,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h2 style={{fontSize:20,fontWeight:800}}>📋 매물 상세 #{detailCar.id}</h2>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:100,background:statusBg(detailCar.status),color:statusColor(detailCar.status)}}>{statusLabel(detailCar.status)}</span>
                <button onClick={()=>setDetailCar(null)} style={{border:"none",background:"#F0EEE9",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><X size={16}/></button>
              </div>
            </div>

            {/* 기본 정보 테이블 */}
            <div style={{background:"#F8F7F4",borderRadius:14,padding:"16px 18px",marginBottom:16}}>
              <div style={{fontSize:18,fontWeight:800,marginBottom:8}}>{detailCar.brand} {detailCar.name}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
                {[
                  {l:"가격",v:`${detailCar.price?.toLocaleString()}만원`,c:"#FF3B1E"},
                  {l:"연식",v:`${detailCar.year}년`},
                  {l:"주행거리",v:`${detailCar.mileage?.toLocaleString()}km`},
                  {l:"연료",v:detailCar.fuel},
                  {l:"변속기",v:detailCar.transmission},
                  {l:"색상",v:detailCar.color},
                  {l:"배기량",v:detailCar.cc?`${detailCar.cc}cc`:"전기"},
                  {l:"지역",v:detailCar.region},
                  {l:"소유자",v:`${detailCar.owners||1}인`},
                  {l:"사고이력",v:detailCar.accident?"있음":"무사고",c:detailCar.accident?"#E24B4A":"#2D8A52"},
                  {l:"검수여부",v:detailCar.inspected?"검수완료":"미검수"},
                  {l:"등록일",v:new Date(detailCar.createdAt).toLocaleString("ko-KR")},
                ].map(s=>(
                  <div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #EEEDE9"}}>
                    <span style={{fontSize:12,color:"#AAA"}}>{s.l}</span>
                    <span style={{fontSize:12,fontWeight:700,color:(s as any).c||"#333"}}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 딜러 정보 */}
            {detailCar.dealer&&(
              <div style={{background:"#EEF5FF",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:14}}>🏪</span>
                <span style={{fontWeight:700,fontSize:13}}>{detailCar.dealer.shopName}</span>
                {detailCar.dealer.verified&&<span style={{fontSize:10,color:"#2D8A52",background:"#EAF6EF",padding:"2px 6px",borderRadius:4,fontWeight:700}}>인증</span>}
              </div>
            )}

            {/* 옵션 */}
            {detailCar.options?.length>0&&(
              <div style={{marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:800,marginBottom:8}}>⚙️ 옵션 ({detailCar.options.length}개)</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{detailCar.options.map((o:string)=><span key={o} style={{fontSize:11,padding:"4px 10px",borderRadius:6,background:"#F8F7F4",color:"#555",fontWeight:600}}>{o}</span>)}</div>
              </div>
            )}

            {/* 설명글 */}
            {detailCar.description&&(
              <div style={{marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:800,marginBottom:6}}>📝 딜러 설명글</div>
                <div style={{background:"#FAFAF8",borderRadius:10,padding:14,fontSize:12,color:"#555",lineHeight:1.8,whiteSpace:"pre-wrap",maxHeight:250,overflowY:"auto",border:"1px solid #F0EEE9"}}>{detailCar.description.replace(/\[성능점검데이터\][\s\S]*/,"").trim()}</div>
              </div>
            )}

            {/* 사진 */}
            {detailCar.images?.length>0&&(
              <div style={{marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:800,marginBottom:8}}>📷 사진 ({detailCar.images.length}장)</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                  {detailCar.images.map((img:string,i:number)=>(
                    <div key={i} style={{borderRadius:8,overflow:"hidden",aspectRatio:"4/3"}}>
                      <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 바로가기 */}
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <a href={`/cars/${detailCar.id}`} target="_blank" rel="noopener noreferrer" style={{flex:1}}>
                <button style={{width:"100%",padding:12,background:"#F0F6FF",border:"1.5px solid #0066FF",borderRadius:10,fontSize:13,fontWeight:700,color:"#0066FF",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>🔗 매물 페이지 열기</button>
              </a>
            </div>

            {/* 액션 버튼 */}
            <div style={{display:"flex",gap:8}}>
              {detailCar.status==="REVIEWING"&&<>
                <button onClick={()=>updateCar(detailCar.id,"AVAILABLE")} style={{flex:1,padding:14,background:"#2D8A52",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer"}}>✓ 승인 (판매중)</button>
                <button onClick={()=>{setDetailCar(null);setRejectId(detailCar.id);}} style={{flex:1,padding:14,background:"#E24B4A",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer"}}>✕ 반려</button>
              </>}
              {detailCar.status==="AVAILABLE"&&<button onClick={()=>updateCar(detailCar.id,"RESERVED")} style={{flex:1,padding:14,background:"#E8A020",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer"}}>⏸ 내리기</button>}
              {detailCar.status==="RESERVED"&&<button onClick={()=>updateCar(detailCar.id,"AVAILABLE")} style={{flex:1,padding:14,background:"#2D8A52",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer"}}>▶ 다시올리기</button>}
            </div>
          </div>
        </>
      )}

      {/* ══ 회원 상세 모달 ══ */}
      {detailUser && (
        <>
          <div onClick={()=>{setDetailUser(null);setResetPwMsg("");}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:10000}}/>
          <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"white",borderRadius:24,padding:"28px",width:"min(500px,92vw)",maxHeight:"85vh",overflowY:"auto",zIndex:10001,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 style={{fontSize:20,fontWeight:800}}>👤 회원 상세</h2>
              <button onClick={()=>{setDetailUser(null);setResetPwMsg("");}} style={{border:"none",background:"#F0EEE9",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><X size={16}/></button>
            </div>

            {/* 기본 정보 */}
            <div style={{background:"#F8F7F4",borderRadius:14,padding:"18px",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:roleColor(detailUser.role)+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:roleColor(detailUser.role)}}>
                  {detailUser.name?.[0]||"?"}
                </div>
                <div>
                  <div style={{fontSize:18,fontWeight:800}}>{detailUser.name}</div>
                  <span style={{fontSize:11,fontWeight:800,color:roleColor(detailUser.role),background:roleBg(detailUser.role),padding:"2px 8px",borderRadius:6}}>{detailUser.role}</span>
                </div>
              </div>
              {[
                ["아이디",    (detailUser.email||"").replace("@fixcar.local","").replace("@fixcar.kr","")],
                ["닉네임(유저)", detailUser.nickname||"-"],
                ["닉네임(딜러)", detailUser.nicknameDealer||"-"],
                ["닉네임(어드민)", detailUser.nicknameAdmin||"-"],
                ["연락처",    detailUser.phone||"-"],
                ["생년월일",  detailUser.birthdate||"-"],
                ["가입방식",  detailUser.provider==="kakao"?"카카오":"픽스카"],
                ["가입일",    new Date(detailUser.createdAt).toLocaleString("ko-KR")],
              ].map(([label,val])=>(
                <div key={label} style={{display:"flex",gap:12,fontSize:13,padding:"6px 0",borderBottom:"1px solid #EEEDE9"}}>
                  <span style={{color:"#AAA",minWidth:100,flexShrink:0}}>{label}</span>
                  <span style={{fontWeight:600,wordBreak:"break-all"}}>{val}</span>
                </div>
              ))}
            </div>

            {/* 권한 변경 */}
            <div style={{marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:800,marginBottom:8}}>권한 변경</div>
              <div style={{display:"flex",gap:8}}>
                {["USER","DEALER","ADMIN"].map(r=>(
                  <button key={r} onClick={()=>updateUserRole(detailUser.id,r)} style={{flex:1,padding:"10px",borderRadius:10,border:detailUser.role===r?`2px solid ${roleColor(r)}`:"1.5px solid #E0DDD7",background:detailUser.role===r?roleBg(r):"white",color:detailUser.role===r?roleColor(r):"#888",fontWeight:detailUser.role===r?800:500,fontSize:13,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* 비밀번호 초기화 */}
            {detailUser.provider!=="kakao"&&(
              <div style={{marginBottom:14}}>
                <button onClick={()=>resetPassword(detailUser.id)} style={{width:"100%",padding:"12px",background:"#FFF8E0",border:"1.5px solid #E8A020",borderRadius:10,fontSize:13,fontWeight:700,color:"#B8860B",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <Key size={14}/> 비밀번호 초기화 (fixcar1234)
                </button>
                {resetPwMsg&&<div style={{fontSize:12,color:"#2D8A52",fontWeight:700,marginTop:6,textAlign:"center"}}>{resetPwMsg}</div>}
              </div>
            )}

            {/* 강제 탈퇴 */}
            <button onClick={()=>deleteUser(detailUser.id,detailUser.name)} style={{width:"100%",padding:"12px",background:"#FFF0ED",border:"1.5px solid #FFB8A8",borderRadius:10,fontSize:13,fontWeight:700,color:"#E24B4A",cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <UserX size={14}/> 강제 탈퇴 (영구 삭제)
            </button>
          </div>
        </>
      )}
    </>
  );
}

/* ── 인라인 답변 ── */
function InlineReply({ onReply }:{ onReply:(r:string)=>void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  if (!open) return (
    <button onClick={()=>setOpen(true)} style={{border:"none",background:"#0066FF",color:"white",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>답변하기</button>
  );
  return (
    <div style={{display:"flex",gap:8}}>
      <textarea rows={2} value={text} onChange={e=>setText(e.target.value)} placeholder="답변 입력" style={{flex:1,padding:"8px 12px",border:"1.5px solid #DDEEFF",borderRadius:8,fontSize:13,fontFamily:"'NanumSquareRound',sans-serif",resize:"none"}}/>
      <button onClick={()=>{if(text.trim())onReply(text);}} style={{padding:"8px 16px",background:"#0066FF",color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",alignSelf:"flex-end"}}>전송</button>
    </div>
  );
}

/* ── 방문자 통계 ── */
function AdminStats() {
  const [stats,      setStats]      = useState<{date:string;count:number}[]>([]);
  const [totalToday, setTotalToday] = useState(0);
  const [totalAll,   setTotalAll]   = useState(0);

  useEffect(() => {
    fetch("/api/admin/stats").then(r=>r.json())
      .then(d=>{
        if(d.daily)setStats(d.daily);
        if(d.today!==undefined)setTotalToday(d.today);
        if(d.total!==undefined)setTotalAll(d.total);
      }).catch(()=>{});
  },[]);

  const maxCount = Math.max(...stats.map(s=>s.count),1);
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:24}}>
        <div style={{background:"white",borderRadius:16,padding:"22px 20px"}}><div style={{fontSize:11,color:"#AAA",marginBottom:6}}>오늘 방문자</div><div style={{fontSize:28,fontWeight:800,color:"#FF3B1E"}}>{totalToday}</div></div>
        <div style={{background:"white",borderRadius:16,padding:"22px 20px"}}><div style={{fontSize:11,color:"#AAA",marginBottom:6}}>누적 방문자</div><div style={{fontSize:28,fontWeight:800,color:"#1847FF"}}>{totalAll.toLocaleString()}</div></div>
        <div style={{background:"white",borderRadius:16,padding:"22px 20px"}}><div style={{fontSize:11,color:"#AAA",marginBottom:6}}>일평균</div><div style={{fontSize:28,fontWeight:800,color:"#2D8A52"}}>{stats.length>0?Math.round(totalAll/stats.length):0}</div></div>
      </div>
      <div style={{background:"white",borderRadius:18,padding:"24px 20px"}}>
        <h3 style={{fontSize:16,fontWeight:800,marginBottom:16}}>📊 일간 방문자 추이 (최근 30일)</h3>
        <div style={{display:"flex",alignItems:"flex-end",gap:4,height:200,padding:"0 4px"}}>
          {stats.slice(-30).map((s,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{fontSize:9,fontWeight:700,color:"#555"}}>{s.count}</div>
              <div style={{width:"100%",background:"linear-gradient(to top,#FF3B1E,#FF6B4A)",borderRadius:"4px 4px 0 0",height:`${Math.max((s.count/maxCount)*160,4)}px`,transition:"height 0.3s"}}/>
              <div style={{fontSize:8,color:"#CCC",transform:"rotate(-45deg)",whiteSpace:"nowrap"}}>{s.date.slice(5)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
