"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Post { id:string; title:string; content?:string; thumbnail?:string; category?:string; createdAt:string; author?:{name?:string}; }

export default function HomeBlogSection() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/blog?limit=6").then(r=>r.json())
      .then(d=>setPosts(Array.isArray(d)?d.slice(0,6):(d.posts||[]).slice(0,6)))
      .catch(()=>setPosts([]));
  }, []);

  /* 더미 데이터 (API 연결 전) */
  const items = posts.length > 0 ? posts : [
    { id:"1", title:"[구매팁] 캐스퍼 중고차 사기 전 확인해야 할 것", thumbnail:"", category:"구매팁", createdAt:new Date().toISOString(), content:"캐스퍼 중고차 구매 전 필수 체크리스트를 정리했습니다." },
    { id:"2", title:"[로드테스트] 아이오닉5 N, 전기차의 새로운 기준", thumbnail:"", category:"로드테스트", createdAt:new Date().toISOString(), content:"현대 아이오닉5 N 실제 주행 리뷰와 성능 분석." },
    { id:"3", title:"[구매팁] 500만원으로 살 수 있는 현대차 5대", thumbnail:"", category:"구매팁", createdAt:new Date().toISOString(), content:"예산 500만원 이하로 구매 가능한 현대차 추천." },
    { id:"4", title:"[로드테스트] 제네시스 GV70 2.5T 가솔린 리뷰", thumbnail:"", category:"로드테스트", createdAt:new Date().toISOString(), content:"제네시스 GV70 실사용 후기와 장단점." },
    { id:"5", title:"[리뷰&카] 2026년식 레이, 왜 잘 팔리나", thumbnail:"", category:"리뷰", createdAt:new Date().toISOString(), content:"기아 레이 신형 모델 리뷰." },
    { id:"6", title:"[리뷰&카] 셀토스 하이브리드, 이 친구가 답임", thumbnail:"", category:"리뷰", createdAt:new Date().toISOString(), content:"기아 셀토스 하이브리드 실제 연비 테스트." },
  ];

  return (
    <section style={{ maxWidth:"1360px", margin:"0 auto 80px", padding:"0 52px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"28px" }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"13px", letterSpacing:"4px", color:"#FF3B1E", marginBottom:"6px" }}>MEDIA</div>
          <h2 style={{ fontSize:"26px", fontWeight:800, letterSpacing:"-1px" }}>픽스카 미디어</h2>
        </div>
        <Link href="/blog" style={{ fontSize:"14px", fontWeight:700, color:"#888", textDecoration:"none", display:"flex", alignItems:"center", gap:"4px" }}>
          전체보기 →
        </Link>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"16px" }}>
        {items.map((post, i) => (
          <Link key={post.id} href={`/blog/${post.id}`} style={{ textDecoration:"none" }}>
            <div style={{ background:"white", borderRadius:"16px", overflow:"hidden", cursor:"pointer", transition:"all 0.2s", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              {/* 썸네일 */}
              <div style={{ height:"180px", background:"#F0EEE9", overflow:"hidden", position:"relative" }}>
                {post.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.thumbnail} alt={post.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                ) : (
                  <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg, #E8E6E1, #D8D6D1)" }}>
                    <span style={{ fontSize:"36px", opacity:0.3 }}>📰</span>
                  </div>
                )}
                {post.category && (
                  <span style={{ position:"absolute", top:10, left:10, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)", color:"white", padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700 }}>{post.category}</span>
                )}
              </div>
              {/* 텍스트 */}
              <div style={{ padding:"16px 18px 18px" }}>
                <h3 style={{ fontSize:i<3?"16px":"15px", fontWeight:800, color:"#1A1A1A", lineHeight:1.4, marginBottom:"8px", overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as const }}>
                  {post.title}
                </h3>
                <p style={{ fontSize:"13px", color:"#AAA", fontWeight:400, lineHeight:1.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>
                  {post.content?.replace(/<[^>]*>/g,"").slice(0,60)||""}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
