"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Car, Users, MessageSquare, BarChart3, CheckCircle, XCircle, Eye, EyeOff, X } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState("dashboard");
  const [cars, setCars] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [detailCar, setDetailCar] = useState<any>(null);

  useEffect(()=>{ fetch("/api/auth/session").then(r=>r.json()).then(d=>{ if(d?.user?.role!=="ADMIN"){router.push("/");return;} setUser(d.user); loadAll(); }).catch(()=>router.push("/")); },[router]);

  const loadAll = async () => {
    const [cR,iR,uR] = await Promise.all([fetch("/api/admin/cars").then(r=>r.json()).catch(()=>[]),fetch("/api/admin/inquiries").then(r=>r.json()).catch(()=>[]),fetch("/api/admin/users").then(r=>r.json()).catch(()=>[])]);
    if(Array.isArray(cR))setCars(cR); if(Array.isArray(iR))setInquiries(iR); if(Array.isArray(uR))setUsers(uR);
  };

  const updateCar = async (carId:number,status:string) => {
    if(!confirm(`이 매물을 "${status==="AVAILABLE"?"승인":status==="SOLD"?"반려":"내리기"}" 하시겠습니까?`)) return;
    await fetch("/api/admin/cars",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({carId,status})});
    setCars(cars.map(c=>c.id===carId?{...c,status}:c)); setDetailCar(null);
  };
  const updateUserRole = async (userId:number,role:string) => { await fetch("/api/admin/users",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId,role})}); setUsers(users.map(u=>u.id===userId?{...u,role}:u)); };
  const replyInquiry = async (inquiryId:number,reply:string) => { await fetch("/api/admin/inquiries",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({inquiryId,reply})}); setInquiries(inquiries.map(i=>i.id===inquiryId?{...i,reply,status:"REPLIED"}:i)); };

  if(!user) return <><Navbar/><div style={{textAlign:"center",padding:100,color:"#CCC"}}>권한 확인 중...</div></>;

  const TABS=[{id:"dashboard",label:"대시보드",icon:BarChart3,count:0},{id:"cars",label:"매물 관리",icon:Car,count:cars.filter(c=>c.status==="REVIEWING").length},{id:"inquiries",label:"문의 관리",icon:MessageSquare,count:inquiries.filter(i=>i.status==="PENDING").length},{id:"users",label:"회원 관리",icon:Users,count:0},{id:"stats",label:"방문자 통계",icon:Eye,count:0}];
  const S={th:{fontSize:12,fontWeight:800,color:"#AAA",padding:"12px 16px",textAlign:"left" as const,background:"#F8F7F4"},td:{fontSize:13,padding:"12px 16px",borderBottom:"1px solid #F0EEE9"}};

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F8F7F4;} table{width:100%;border-collapse:collapse;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F8F7F4"}}>
        <div style={{background:"#0A0A0A",padding:"16px 24px"}}><div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",gap:10}}><Shield size={18} color="#FF3B1E"/><span style={{fontSize:17,fontWeight:800,color:"white"}}>관리자 패널</span></div></div>

        <div style={{maxWidth:1200,margin:"0 auto",padding:"16px 16px 80px"}}>
          <div style={{display:"flex",gap:6,marginBottom:20,overflowX:"auto"}}>
            {TABS.map(t=>{const Icon=t.icon;return(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"12px 20px",borderRadius:12,border:"none",fontSize:13,fontWeight:tab===t.id?800:600,background:tab===t.id?"white":"transparent",color:tab===t.id?"#FF3B1E":"#888",display:"flex",alignItems:"center",gap:8,cursor:"pointer",whiteSpace:"nowrap",boxShadow:tab===t.id?"0 2px 8px rgba(0,0,0,0.06)":"none",fontFamily:"'NanumSquareRound',sans-serif"}}><Icon size={16}/>{t.label}{t.count>0&&<span style={{background:"#FF3B1E",color:"white",borderRadius:100,minWidth:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800}}>{t.count}</span>}</button>);})}
          </div>

          {/* 대시보드 */}
          {tab==="dashboard"&&(<div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
              {[{l:"전체 매물",v:cars.length,c:"#1847FF"},{l:"검수 대기",v:cars.filter(c=>c.status==="REVIEWING").length,c:"#E8A020"},{l:"답변 대기",v:inquiries.filter(i=>i.status==="PENDING").length,c:"#FF3B1E"},{l:"전체 회원",v:users.length,c:"#2D8A52"}].map(s=>(<div key={s.l} style={{background:"white",borderRadius:16,padding:"22px 20px"}}><div style={{fontSize:11,color:"#AAA",marginBottom:6}}>{s.l}</div><div style={{fontSize:28,fontWeight:800,color:s.c}}>{s.v}</div></div>))}
            </div>
            {cars.filter(c=>c.status==="REVIEWING").length>0&&<div style={{background:"#FFF0ED",borderRadius:16,padding:"16px 22px",border:"1px solid #FFB8A8",marginBottom:12,cursor:"pointer"}} onClick={()=>setTab("cars")}><span style={{fontSize:14,fontWeight:800,color:"#FF3B1E"}}>⚠️ 검수 대기 매물 {cars.filter(c=>c.status==="REVIEWING").length}건 →</span></div>}
          </div>)}

          {/* 매물 관리 */}
          {tab==="cars"&&(<div style={{background:"white",borderRadius:18,overflow:"hidden"}}>
            <table><thead><tr><th style={S.th}>ID</th><th style={S.th}>차량명</th><th style={S.th}>가격</th><th style={S.th}>딜러</th><th style={S.th}>상태</th><th style={S.th}>액션</th></tr></thead>
            <tbody>{cars.length===0?<tr><td colSpan={6} style={{...S.td,textAlign:"center",color:"#CCC",padding:40}}>매물 없음</td></tr>:
            cars.map(car=>(<tr key={car.id}>
              <td style={S.td}>#{car.id}</td>
              <td style={{...S.td,fontWeight:700}}>{car.brand} {car.name}</td>
              <td style={S.td}>{car.price?.toLocaleString()}만</td>
              <td style={S.td}>{car.dealer?.shopName||"-"}</td>
              <td style={S.td}><span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:100,background:car.status==="AVAILABLE"?"#EAF6EF":car.status==="REVIEWING"?"#FFF0ED":"#F0EEE9",color:car.status==="AVAILABLE"?"#2D8A52":car.status==="REVIEWING"?"#FF3B1E":"#888"}}>{car.status==="AVAILABLE"?"판매중":car.status==="REVIEWING"?"검수대기":car.status==="RESERVED"?"내림":"완료"}</span></td>
              <td style={S.td}><div style={{display:"flex",gap:4}}>
                <button onClick={()=>setDetailCar(car)} style={{border:"none",background:"#EEF5FF",padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:700,color:"#0066FF",cursor:"pointer"}}><Eye size={10}/> 상세</button>
                {car.status==="REVIEWING"&&<><button onClick={()=>updateCar(car.id,"AVAILABLE")} style={{border:"none",background:"#2D8A52",color:"white",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>승인</button><button onClick={()=>updateCar(car.id,"SOLD")} style={{border:"none",background:"#E24B4A",color:"white",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>반려</button></>}
                {car.status==="AVAILABLE"&&<button onClick={()=>updateCar(car.id,"RESERVED")} style={{border:"none",background:"#E8A020",color:"white",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}><EyeOff size={10}/> 내리기</button>}
                {car.status==="RESERVED"&&<button onClick={()=>updateCar(car.id,"AVAILABLE")} style={{border:"none",background:"#2D8A52",color:"white",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>다시 올리기</button>}
              </div></td>
            </tr>))}</tbody></table>
          </div>)}

          {/* 문의 관리 */}
          {tab==="inquiries"&&(<div>{inquiries.length===0?<div style={{background:"white",borderRadius:18,padding:48,textAlign:"center",color:"#CCC"}}>문의 없음</div>:inquiries.map(inq=>(<div key={inq.id} style={{background:"white",borderRadius:16,padding:"18px 22px",marginBottom:10,border:inq.status==="PENDING"?"2px solid #FFE4DE":"1px solid #F0EEE9"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div><span style={{fontWeight:800}}>{inq.car?.brand} {inq.car?.name}</span><span style={{fontSize:12,color:"#AAA",marginLeft:8}}>{inq.car?.price?.toLocaleString()}만</span></div><span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100,background:inq.status==="REPLIED"?"#EAF6EF":"#FFF0ED",color:inq.status==="REPLIED"?"#2D8A52":"#FF3B1E"}}>{inq.status==="REPLIED"?"완료":"대기"}</span></div><div style={{fontSize:12,color:"#888",marginBottom:6}}>👤 {inq.user?.name||"익명"}</div><div style={{background:"#F8F7F4",borderRadius:10,padding:"10px 14px",fontSize:14,color:"#555",marginBottom:8}}>{inq.message}</div>{inq.reply?<div style={{background:"#EEF5FF",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#0066FF"}}>{inq.reply}</div>:<InlineReply onReply={(r:string)=>replyInquiry(inq.id,r)}/>}</div>))}</div>)}

          {/* 회원 관리 */}
          {tab==="users"&&(<div style={{background:"white",borderRadius:18,overflow:"hidden"}}><table><thead><tr><th style={S.th}>ID</th><th style={S.th}>이름</th><th style={S.th}>닉네임</th><th style={S.th}>가입방식</th><th style={S.th}>권한</th><th style={S.th}>가입일</th><th style={S.th}>변경</th></tr></thead><tbody>{users.map(u=>(<tr key={u.id}><td style={S.td}>#{u.id}</td><td style={{...S.td,fontWeight:700}}>{u.name}</td><td style={S.td}>{u.nickname||<span style={{color:"#CCC"}}>미설정</span>}</td><td style={S.td}><span style={{fontSize:11,fontWeight:700,color:u.provider==="kakao"?"#3C1E1E":"#555",background:u.provider==="kakao"?"#FEE500":"#F0EEE9",padding:"2px 8px",borderRadius:4}}>{u.provider==="kakao"?"카카오":"픽스카"}</span></td><td style={S.td}><span style={{fontSize:11,fontWeight:700,color:u.role==="ADMIN"?"#FF3B1E":u.role==="DEALER"?"#0066FF":"#888"}}>{u.role}</span></td><td style={{...S.td,fontSize:12,color:"#CCC"}}>{new Date(u.createdAt).toLocaleDateString("ko-KR")}</td><td style={S.td}><select value={u.role} onChange={e=>updateUserRole(u.id,e.target.value)} style={{padding:"4px 8px",borderRadius:6,border:"1px solid #E0DDD7",fontSize:11,fontFamily:"'NanumSquareRound',sans-serif"}}><option value="USER">USER</option><option value="DEALER">DEALER</option><option value="ADMIN">ADMIN</option></select></td></tr>))}</tbody></table></div>)}

          {/* 방문자 통계 */}
          {tab==="stats"&&<AdminStats/>}
        </div>
      </div>

      {/* ═══ 매물 상세 모달 ═══ */}
      {detailCar&&(<>
        <div onClick={()=>setDetailCar(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:10000}}/>
        <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"white",borderRadius:24,padding:"28px",width:"min(600px,92vw)",maxHeight:"85vh",overflowY:"auto",zIndex:10001,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h2 style={{fontSize:20,fontWeight:800}}>매물 상세</h2>
            <button onClick={()=>setDetailCar(null)} style={{border:"none",background:"#F0EEE9",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><X size={16}/></button>
          </div>
          <div style={{background:"#F8F7F4",borderRadius:12,padding:"16px",marginBottom:16}}>
            <div style={{fontSize:18,fontWeight:800,marginBottom:4}}>{detailCar.brand} {detailCar.name}</div>
            <div style={{fontSize:13,color:"#888"}}>{detailCar.year}년 · {detailCar.mileage?.toLocaleString()}km · {detailCar.fuel} · {detailCar.color}</div>
            <div style={{fontSize:13,color:"#888",marginTop:4}}>변속기: {detailCar.transmission} · 소유자: {detailCar.owners}인 · 사고: {detailCar.accident?"있음":"무사고"}</div>
            <div style={{fontSize:22,fontWeight:800,color:"#FF3B1E",marginTop:8}}>{detailCar.price?.toLocaleString()}만원</div>
            <div style={{fontSize:12,color:"#AAA",marginTop:4}}>딜러: {detailCar.dealer?.shopName||"-"} · 지역: {detailCar.region}</div>
          </div>
          {detailCar.options?.length>0&&<div style={{marginBottom:16}}><div style={{fontSize:13,fontWeight:800,marginBottom:6}}>옵션</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{detailCar.options.map((o:string)=><span key={o} style={{fontSize:11,padding:"3px 8px",borderRadius:6,background:"#EEF5FF",color:"#0066FF",fontWeight:600}}>{o}</span>)}</div></div>}
          {detailCar.images?.length>0&&<div style={{marginBottom:16}}><div style={{fontSize:13,fontWeight:800,marginBottom:8}}>사진 ({detailCar.images.length}장)</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>{detailCar.images.map((img:string,i:number)=>(<div key={i} style={{borderRadius:10,overflow:"hidden",aspectRatio:"4/3"}}><img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>))}</div></div>}
          <div style={{display:"flex",gap:8}}>
            {detailCar.status==="REVIEWING"&&<><button onClick={()=>updateCar(detailCar.id,"AVAILABLE")} style={{flex:1,padding:"14px",background:"#2D8A52",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer"}}>✓ 승인</button><button onClick={()=>updateCar(detailCar.id,"SOLD")} style={{flex:1,padding:"14px",background:"#E24B4A",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer"}}>✕ 반려</button></>}
            {detailCar.status==="AVAILABLE"&&<button onClick={()=>updateCar(detailCar.id,"RESERVED")} style={{flex:1,padding:"14px",background:"#E8A020",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer"}}>⏸ 잠시 내리기</button>}
          </div>
        </div>
      </>)}
    </>
  );
}

function InlineReply({onReply}:{onReply:(r:string)=>void}){const [open,setOpen]=useState(false);const [text,setText]=useState("");if(!open)return <button onClick={()=>setOpen(true)} style={{border:"none",background:"#0066FF",color:"white",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>답변하기</button>;return(<div style={{display:"flex",gap:8}}><textarea rows={2} value={text} onChange={e=>setText(e.target.value)} placeholder="답변 입력" style={{flex:1,padding:"8px 12px",border:"1.5px solid #DDEEFF",borderRadius:8,fontSize:13,fontFamily:"'NanumSquareRound',sans-serif",resize:"none"}}/><button onClick={()=>{if(text.trim())onReply(text);}} style={{padding:"8px 16px",background:"#0066FF",color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",alignSelf:"flex-end"}}>전송</button></div>);}

/* ═══ 방문자 통계 컴포넌트 ═══ */
function AdminStats() {
  const [stats, setStats] = useState<{date:string;count:number}[]>([]);
  const [totalToday, setTotalToday] = useState(0);
  const [totalAll, setTotalAll] = useState(0);

  useEffect(()=>{
    fetch("/api/admin/stats").then(r=>r.json()).then(d=>{
      if(d.daily) setStats(d.daily);
      if(d.today!==undefined) setTotalToday(d.today);
      if(d.total!==undefined) setTotalAll(d.total);
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
              <div style={{width:"100%",background:`linear-gradient(to top, #FF3B1E, #FF6B4A)`,borderRadius:"4px 4px 0 0",height:`${Math.max((s.count/maxCount)*160,4)}px`,transition:"height 0.3s"}}/>
              <div style={{fontSize:8,color:"#CCC",transform:"rotate(-45deg)",whiteSpace:"nowrap"}}>{s.date.slice(5)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
