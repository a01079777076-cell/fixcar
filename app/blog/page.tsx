import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight, Calendar, Tag } from "lucide-react";

async function getPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
      take: 20,
    });
  } catch { return []; }
}

const MOCK_POSTS = [
  { id:1, title:"중고차 구매 전 꼭 확인해야 할 10가지", summary:"처음 중고차를 구매하는 분들이 놓치기 쉬운 핵심 체크리스트를 정리했어요.", category:"구매 가이드", createdAt:new Date("2026-03-15"), author:{name:"픽스카"}, tags:["구매가이드","체크리스트","초보"] },
  { id:2, title:"아반떼 vs K3, 2024년 지금 사야 할 차는?", summary:"국민 준중형 세단 두 모델의 실구매 비용, 유지비, 내구성을 완벽 비교했어요.", category:"차량 비교", createdAt:new Date("2026-03-12"), author:{name:"픽스카"}, tags:["아반떼","K3","비교"] },
  { id:3, title:"전기차 중고 살 때 배터리 상태 확인하는 법", summary:"전기차 중고 구매의 핵심은 배터리 잔존 수명이에요. SOH 확인 방법부터 설명해드려요.", category:"구매 가이드", createdAt:new Date("2026-03-10"), author:{name:"픽스카"}, tags:["전기차","배터리","EV"] },
  { id:4, title:"중고차 사고이력 조회 완전 정리", summary:"보험개발원 조회, 성능점검기록부 보는 법, 직접 확인 포인트까지 한 번에 정리했어요.", category:"정보", createdAt:new Date("2026-03-08"), author:{name:"픽스카"}, tags:["사고이력","보험개발원"] },
  { id:5, title:"자동차 엔진오일 교환 주기, 제조사별 완벽 정리", summary:"현대·기아·수입차별 실제 권장 교환 주기와 오일 종류 선택 가이드를 정리했어요.", category:"관리 정보", createdAt:new Date("2026-03-05"), author:{name:"픽스카"}, tags:["엔진오일","관리","소모품"] },
  { id:6, title:"타이어 교체 시기, 이것만 알면 됩니다", summary:"타이어 마모도 확인법, 교체 시기, 브랜드별 가성비 추천까지 완벽 가이드.", category:"관리 정보", createdAt:new Date("2026-03-03"), author:{name:"픽스카"}, tags:["타이어","교체시기"] },
  { id:7, title:"블랙박스 추천 2026, 픽스카 딜러가 직접 쓰는 것은?", summary:"전방·전후방·4채널 블랙박스 가격대별 추천 모델과 실제 설치 팁을 알려드려요.", category:"추천 용품", createdAt:new Date("2026-02-28"), author:{name:"픽스카"}, tags:["블랙박스","추천","용품"] },
  { id:8, title:"중고차 할부 vs 일시불, 어떤 게 유리할까?", summary:"금리 상황에 따른 할부·일시불 손익 계산법과 캐피탈사 금리 비교 방법을 알려드려요.", category:"금융 정보", createdAt:new Date("2026-02-25"), author:{name:"픽스카"}, tags:["할부","금융","캐피탈"] },
  { id:9, title:"광주 중고차 매매단지 완전 정복 가이드", summary:"광주 서부·동부·북구 매매단지 위치, 특징, 주의사항을 픽스카 딜러가 직접 알려드려요.", category:"로컬 정보", createdAt:new Date("2026-02-20"), author:{name:"픽스카"}, tags:["광주","매매단지","로컬"] },
  { id:10, title:"FIX 정찰제란? 중고차 가격 흥정이 필요 없는 이유", summary:"픽스카가 FIX 정찰제를 도입한 이유와 구매자에게 어떤 이점이 있는지 설명해드려요.", category:"픽스카 소식", createdAt:new Date("2026-02-15"), author:{name:"픽스카"}, tags:["정찰제","픽스카","FIX"] },
];

export default async function BlogPage() {
  const dbPosts = await getPosts();
  const posts = dbPosts.length > 0 ? dbPosts.map(p=>({...p,tags:Array.isArray(p.tags)?p.tags as string[]:[]})) : MOCK_POSTS;
  const cats = ["전체",...Array.from(new Set(posts.map(p=>p.category)))];

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} .card{background:white;border-radius:18px;overflow:hidden;transition:box-shadow 0.2s;} .card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.08);}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{background:"#1A1A1A",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"1100px",margin:"0 auto"}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF7A63",marginBottom:"10px"}}>BLOG</div>
            <h1 style={{fontSize:"clamp(24px,4vw,44px)",fontWeight:800,color:"white",letterSpacing:"-1px",marginBottom:"6px"}}>픽스카 블로그</h1>
            <p style={{fontSize:"14px",color:"rgba(255,255,255,0.4)",fontWeight:400}}>차량관리 · 구매가이드 · 소모품 · 추천 꿀템까지</p>
          </div>
        </div>

        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"28px 32px 80px"}}>
          {/* 카테고리 필터 */}
          <div style={{display:"flex",gap:"8px",marginBottom:"24px",flexWrap:"wrap"}}>
            {cats.map(c=>(
              <a key={c} href={c==="전체"?"/blog":`/blog?cat=${encodeURIComponent(c)}`}>
                <button style={{padding:"7px 16px",borderRadius:"100px",border:"1.5px solid #E0DDD7",background:"white",color:"#555",fontSize:"13px",fontWeight:700,cursor:"pointer"}}>{c}</button>
              </a>
            ))}
          </div>

          {/* 포스트 그리드 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"18px"}}>
            {posts.map((post,i)=>(
              <Link key={post.id} href={`/blog/${post.id}`}>
                <div className="card">
                  <div style={{height:"160px",background:`hsl(${(i*37)%360},40%,88%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"36px"}}>
                    {["📊","🚗","⚡","🔍","🛢️","🔧","📷","💳","🗺️","🔒"][i%10]}
                  </div>
                  <div style={{padding:"18px 20px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
                      <span style={{background:"#EEF2FF",color:"#1847FF",padding:"3px 10px",borderRadius:"100px",fontSize:"11px",fontWeight:800}}>{post.category}</span>
                      <span style={{fontSize:"11px",color:"#AAA",fontWeight:400,display:"flex",alignItems:"center",gap:"3px"}}><Calendar size={10}/>{new Date(post.createdAt).toLocaleDateString("ko-KR",{month:"short",day:"numeric"})}</span>
                    </div>
                    <h2 style={{fontSize:"16px",fontWeight:800,marginBottom:"8px",lineHeight:1.4,letterSpacing:"-0.3px"}}>{post.title}</h2>
                    <p style={{fontSize:"13px",color:"#888",lineHeight:1.65,fontWeight:400,marginBottom:"12px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{post.summary}</p>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"10px",borderTop:"1px solid #F0EEE9"}}>
                      <span style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{post.author.name}</span>
                      <span style={{fontSize:"12px",fontWeight:800,color:"#1847FF",display:"flex",alignItems:"center",gap:"3px"}}>읽기 <ArrowRight size={12}/></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {dbPosts.length === 0 && (
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <a href="/blog/write"><button style={{background:"#FF3B1E",color:"white",border:"none",padding:"14px 28px",borderRadius:"12px",fontSize:"15px",fontWeight:800,cursor:"pointer"}}>첫 글 작성하기 →</button></a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
