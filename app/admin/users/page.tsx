import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getUsers() {
  try { return await prisma.user.findMany({ orderBy:{ createdAt:"desc" }, take:50, select:{ id:true, name:true, email:true, role:true, provider:true, createdAt:true, phone:true } }); }
  catch { return []; }
}

export default async function AdminUsersPage() {
  const users = await getUsers();
  const RS: Record<string,{l:string;c:string;bg:string}> = { USER:{l:"일반",c:"#555",bg:"#F0EEE9"}, DEALER:{l:"딜러",c:"#0066FF",bg:"#EEF5FF"}, ADMIN:{l:"관리자",c:"#FF3B1E",bg:"#FFF0ED"} };
  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"#1A1A1A",padding:"0 32px",height:"56px",display:"flex",alignItems:"center",gap:"20px"}}>
          <Link href="/" style={{fontSize:"14px",fontWeight:700,color:"white",fontFamily:"'Bebas Neue',serif",letterSpacing:"2px"}}><span style={{color:"#FF3B1E"}}>FIX</span>CAR</Link>
          {[["대시보드","/admin"],["방문자","/admin/visitors"],["회원","/admin/users"],["딜러","/admin/dealers"],["설정","/admin/settings"]].map(([l,h])=>(<Link key={l} href={h} style={{fontSize:"13px",fontWeight:700,color:h==="/admin/users"?"white":"rgba(255,255,255,0.35)"}}>{l}</Link>))}
        </div>
        <div style={{maxWidth:"1000px",margin:"0 auto",padding:"28px 32px 80px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
            <h1 style={{fontSize:"24px",fontWeight:800}}>회원 관리</h1>
            <div style={{fontSize:"14px",color:"#888",fontWeight:400}}>총 {users.length}명</div>
          </div>
          <div style={{background:"white",borderRadius:"18px",overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"50px 1fr 100px 70px 70px 90px",padding:"11px 16px",background:"#F8F6F2",fontSize:"12px",fontWeight:800,color:"#888",gap:"8px"}}>
              <div>ID</div><div>이름·이메일</div><div>연락처</div><div>가입수단</div><div>역할</div><div>가입일</div>
            </div>
            {users.map((u,i)=>{
              const rs = RS[u.role]||RS.USER;
              return (
                <div key={u.id} style={{display:"grid",gridTemplateColumns:"50px 1fr 100px 70px 70px 90px",padding:"11px 16px",borderBottom:i<users.length-1?"1px solid #F0EEE9":"none",alignItems:"center",gap:"8px"}}>
                  <div style={{fontSize:"12px",color:"#AAA"}}>{u.id}</div>
                  <div><div style={{fontSize:"14px",fontWeight:700}}>{u.name}</div><div style={{fontSize:"11px",color:"#AAA",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div></div>
                  <div style={{fontSize:"12px",color:"#888",fontWeight:400}}>{u.phone||"-"}</div>
                  <div style={{fontSize:"12px",fontWeight:700,color:u.provider==="kakao"?"#E8A020":u.provider==="naver"?"#2D8A52":"#888"}}>{u.provider==="kakao"?"카카오":u.provider==="naver"?"네이버":"픽스카"}</div>
                  <div><span style={{background:rs.bg,color:rs.c,padding:"2px 8px",borderRadius:"100px",fontSize:"11px",fontWeight:800}}>{rs.l}</span></div>
                  <div style={{fontSize:"11px",color:"#AAA"}}>{u.createdAt.toISOString().slice(0,10)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
