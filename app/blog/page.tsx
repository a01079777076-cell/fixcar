import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { BookOpen } from "lucide-react";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

const CATEGORIES = ["전체","구매 가이드","차량 추천","추천 용품","전기차","관리 팁"];

async function getPosts(category?: string) {
  try {
    return await prisma.blogPost.findMany({
      where: { published:true, ...(category&&category!=="전체"?{category}:{}) },
      orderBy: { createdAt:"desc" }, take:20,
      select: { id:true, title:true, summary:true, category:true, tags:true, createdAt:true, author:{select:{name:true}} },
    });
  } catch { return []; }
}

export default async function BlogPage({ searchParams }: { searchParams: { category?: string } }) {
  const category = searchParams?.category || "전체";
  const posts = await getPosts(category);
  const cookieStore = await cookies();
  const token = cookieStore.get("fixcar-token")?.value;
  const payload = token ? await verifyToken(token) : null;
  const isAdmin = payload?.role === "ADMIN";

  const samplePosts = [
    { id:1, title:"2025년 중고차 구매 완벽 가이드 — 초보자도 쉽게!", summary:"처음 중고차를 구매하는 분들을 위한 A to Z 완벽 가이드예요.", category:"구매 가이드", tags:["초보","중고차","구매"], createdAt:"2025-03-18", author:{name:"픽스카"} },
    { id:2, title:"아반떼 vs K3 — 2025년 기준 완벽 비교", summary:"국민 세단 양대산맥을 픽스카가 직접 비교해봤어요.", category:"차량 추천", tags:["아반떼","K3","비교"], createdAt:"2025-03-15", author:{name:"픽스카"} },
    { id:3, title:"차량 관리 필수 용품 TOP 10 — 쿠팡 최저가", summary:"신차처럼 유지하는 차량 관리 필수템을 모았어요.", category:"추천 용품", tags:["용품","관리","쿠팡"], createdAt:"2025-03-12", author:{name:"픽스카"} },
    { id:4, title:"전기차 아이오닉 6 실주행 후기 — 솔직하게", summary:"6개월 실사용 후기를 솔직하게 적었어요.", category:"전기차", tags:["아이오닉","전기차","후기"], createdAt:"2025-03-10", author:{name:"픽스카"} },
  ];
  const displayPosts = posts.length > 0 ? posts : samplePosts;

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;-webkit-font-smoothing:antialiased;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        .post-card{background:white;border-radius:18px;overflow:hidden;transition:all 0.2s;}
        .post-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,0.08);}
        @media(max-width:768px){.posts-grid{grid-template-columns:1fr!important;}}
      `}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar />
        <div style={{background:"#1A1A1A",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"1100px",margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div>
              <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF7A63",marginBottom:"10px"}}>BLOG</div>
              <h1 style={{fontSize:"clamp(24px,4vw,44px)",fontWeight:800,color:"white",letterSpacing:"-1px"}}>픽스카 블로그</h1>
              <p style={{fontSize:"14px",color:"rgba(255,255,255,0.4)",marginTop:"8px",fontWeight:400}}>차량 설명 · 추천 용품 · 구매 가이드</p>
            </div>
            {isAdmin && <a href="/blog/write"><button style={{background:"#FF3B1E",color:"white",border:"none",padding:"12px 24px",borderRadius:"100px",fontSize:"14px",fontWeight:800,cursor:"pointer"}}>✍️ 글쓰기</button></a>}
          </div>
        </div>
        <div style={{maxWidth:"1100px",margin:"0 auto",padding:"28px 52px 80px"}}>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"24px"}}>
            {CATEGORIES.map(cat=>(
              <a key={cat} href={`/blog?category=${encodeURIComponent(cat)}`}>
                <button style={{padding:"7px 16px",borderRadius:"100px",border:`2px solid ${category===cat?"#1A1A1A":"#E0DDD7"}`,background:category===cat?"#1A1A1A":"white",color:category===cat?"white":"#555",fontSize:"13px",fontWeight:700}}>
                  {cat}
                </button>
              </a>
            ))}
          </div>
          {displayPosts.length === 0 ? (
            <div style={{textAlign:"center",padding:"80px",color:"#AAA"}}>
              <BookOpen size={48} color="#E0DDD7" style={{margin:"0 auto 16px"}} />
              <div style={{fontSize:"18px",fontWeight:800,color:"#1A1A1A",marginBottom:"8px"}}>아직 글이 없어요</div>
              {isAdmin && <a href="/blog/write"><button style={{background:"#FF3B1E",color:"white",border:"none",padding:"12px 28px",borderRadius:"12px",fontSize:"14px",fontWeight:800,cursor:"pointer",marginTop:"12px"}}>첫 글 작성하기</button></a>}
            </div>
          ) : (
            <div className="posts-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"16px"}}>
              {(displayPosts as any[]).map(post=>(
                <a key={post.id} href={`/blog/${post.id}`} className="post-card">
                  <div style={{background:"linear-gradient(135deg,#FF5A3C,#C41E08)",height:"130px",position:"relative",overflow:"hidden",padding:"22px 24px"}}>
                    <div style={{position:"absolute",right:"-20px",bottom:"-20px",fontFamily:"'Bebas Neue',serif",fontSize:"120px",color:"rgba(255,255,255,0.1)",lineHeight:1}}>PICK</div>
                    <span style={{background:"rgba(255,255,255,0.2)",color:"white",padding:"4px 12px",borderRadius:"100px",fontSize:"11px",fontWeight:800}}>{post.category}</span>
                  </div>
                  <div style={{padding:"20px 22px"}}>
                    <h2 style={{fontSize:"17px",fontWeight:800,marginBottom:"8px",lineHeight:1.3}}>{post.title}</h2>
                    <p style={{fontSize:"13px",color:"#888",marginBottom:"14px",lineHeight:1.65,fontWeight:400}}>{post.summary}</p>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",gap:"6px"}}>
                        {(Array.isArray(post.tags)?post.tags:[]).slice(0,3).map((tag:string)=>(
                          <span key={tag} style={{background:"#EEF2FF",color:"#1847FF",padding:"3px 8px",borderRadius:"100px",fontSize:"11px",fontWeight:700}}>#{tag}</span>
                        ))}
                      </div>
                      <span style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{String(post.createdAt).slice(0,10)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
