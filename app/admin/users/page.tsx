import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Shield, User } from "lucide-react";

async function getUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" }, take: 50,
      select: { id:true, name:true, email:true, role:true, provider:true, createdAt:true, _count:{ select:{ favorites:true, purchases:true } } },
    });
  } catch { return []; }
}

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("fixcar-token")?.value;
  if (!token) redirect("/login");
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "ADMIN") redirect("/");

  const users = await getUsers();

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        .row:hover{background:#FAFAF8;}
      `}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"#1A1A1A",padding:"0 32px",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
          <a href="/" style={{fontFamily:"'Bebas Neue',serif",fontSize:"24px",letterSpacing:"3px"}}><span style={{color:"#FF3B1E"}}>FIX</span><span style={{color:"white"}}>CAR</span></a>
          <div style={{display:"flex",gap:"20px"}}>
            {[["대시보드","/admin"],["회원","/admin/users"],["매물","/admin/cars"],["딜러신청","/admin/dealers"],["신고","/admin/reports"],["정산","/admin/settlements"],["설정","/admin/settings"]].map(([l,h])=>(
              <a key={l} href={h} style={{fontSize:"13px",fontWeight:700,color:h==="/admin/users"?"white":"rgba(255,255,255,0.4)"}}>{l}</a>
            ))}
          </div>
        </div>
        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"28px 32px 80px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
            <h1 style={{fontSize:"26px",fontWeight:800}}>회원 관리</h1>
            <div style={{display:"flex",gap:"8px"}}>
              <span style={{background:"#EEF2FF",color:"#1847FF",padding:"5px 14px",borderRadius:"100px",fontSize:"13px",fontWeight:800}}>전체 {users.length}명</span>
              <span style={{background:"#FFF0ED",color:"#FF3B1E",padding:"5px 14px",borderRadius:"100px",fontSize:"13px",fontWeight:800}}>관리자 {users.filter((u:any)=>u.role==="ADMIN").length}명</span>
            </div>
          </div>
          <div style={{background:"white",borderRadius:"18px",overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr 1fr 1fr 1fr 1fr",padding:"12px 20px",borderBottom:"2px solid #F0EEE9",fontSize:"12px",fontWeight:800,color:"#AAA"}}>
              <span>이름</span><span>이메일</span><span>권한</span><span>가입경로</span><span>찜/구매</span><span>가입일</span>
            </div>
            {users.length === 0 ? (
              <div style={{padding:"60px",textAlign:"center",color:"#AAA"}}>
                <Users size={40} color="#E0DDD7" style={{margin:"0 auto 14px"}} />
                <div style={{fontSize:"15px",fontWeight:800}}>회원이 없어요</div>
              </div>
            ) : (
              (users as any[]).map((user, i) => (
                <div key={user.id} className="row" style={{display:"grid",gridTemplateColumns:"1fr 1.5fr 1fr 1fr 1fr 1fr",padding:"13px 20px",borderBottom:i<users.length-1?"1px solid #F0EEE9":"none",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                    <div style={{width:"30px",height:"30px",background:user.role==="ADMIN"?"#FF3B1E":user.role==="DEALER"?"#1847FF":"#F0EEE9",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {user.role==="ADMIN"?<Shield size={14} color="white"/>:user.role==="DEALER"?<User size={14} color="white"/>:<User size={14} color="#AAA"/>}
                    </div>
                    <span style={{fontSize:"14px",fontWeight:700}}>{user.name}</span>
                  </div>
                  <span style={{fontSize:"13px",color:"#555",fontWeight:400}}>{user.email}</span>
                  <span style={{background:user.role==="ADMIN"?"#FFF0ED":user.role==="DEALER"?"#EEF2FF":"#F0EEE9",color:user.role==="ADMIN"?"#FF3B1E":user.role==="DEALER"?"#1847FF":"#888",padding:"3px 10px",borderRadius:"100px",fontSize:"11px",fontWeight:800,display:"inline-block"}}>{user.role}</span>
                  <span style={{fontSize:"13px",color:"#888",fontWeight:400}}>{user.provider}</span>
                  <span style={{fontSize:"13px",color:"#555",fontWeight:400}}>찜 {user._count?.favorites||0} · 구매 {user._count?.purchases||0}</span>
                  <span style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{String(user.createdAt).slice(0,10)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
