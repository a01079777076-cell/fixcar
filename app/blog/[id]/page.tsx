import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ChevronLeft, Calendar, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogContent from "@/components/BlogContent";
import BlogViewCount from "@/components/BlogViewCount";
// ... 본문 어딘가에
<BlogViewCount postId={Number(id)} />

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await prisma.blogPost.findUnique({ where:{ id:parseInt(id) } });
    if (!post) return { title:"블로그" };
    return { title:post.title, description:post.summary };
  } catch { return { title:"블로그" }; }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = parseInt(id);

  let post;
  try {
    post = await prisma.blogPost.findUnique({ where:{ id:postId }, include:{ author:{ select:{ name:true } } } });
  } catch {}

  if (!post) notFound();

  const title = post.title || "";
  const content = post.content || "";
  const category = post.category || "";
  const authorName = post.author?.name || "픽스카";
  const tags = (post.tags as string[]) || [];
  const thumbnail = post.summary || ""; /* summary에 썸네일 URL 저장됨 */

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{maxWidth:"760px",margin:"0 auto",padding:"28px 32px 80px"}}>
          <Link href="/blog" style={{display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"14px",fontWeight:700,color:"#888",marginBottom:"20px"}}><ChevronLeft size={16}/>블로그 목록</Link>
          <div style={{background:"white",borderRadius:"20px",overflow:"hidden"}}>
            {/* 썸네일 이미지 */}
            {thumbnail && thumbnail.startsWith("http") && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnail} alt={title} style={{width:"100%",maxHeight:400,objectFit:"cover",display:"block"}} />
            )}
            <div style={{padding:"32px 36px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px",flexWrap:"wrap"}}>
                <span style={{background:"#EEF2FF",color:"#1847FF",padding:"4px 12px",borderRadius:"100px",fontSize:"12px",fontWeight:800}}>{category}</span>
                <span style={{fontSize:"12px",color:"#AAA",fontWeight:400,display:"flex",alignItems:"center",gap:"4px"}}><Calendar size={11}/>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
                <span style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>by {authorName}</span>
              </div>
              <h1 style={{fontSize:"clamp(22px,3vw,30px)",fontWeight:800,letterSpacing:"-1px",lineHeight:1.3,marginBottom:"24px"}}>{title}</h1>
              
              {/* ★ BlogContent로 이미지 렌더링 */}
              <BlogContent content={content} />

              {tags.length>0&&(
                <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginTop:"24px",paddingTop:"20px",borderTop:"1px solid #F0EEE9"}}>
                  {tags.map((t:string)=><span key={t} style={{background:"#F0EEE9",color:"#888",padding:"4px 10px",borderRadius:"100px",fontSize:"12px",fontWeight:700,display:"flex",alignItems:"center",gap:"3px"}}><Tag size={10}/>#{t}</span>)}
                </div>
              )}
            </div>
          </div>

          <div style={{background:"#FF3B1E",borderRadius:"18px",padding:"20px 24px",marginTop:"20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"}}>
            <div>
              <div style={{fontSize:"15px",fontWeight:800,color:"white"}}>픽스카 FIX 정찰가 매물 보기</div>
              <div style={{fontSize:"13px",color:"rgba(255,255,255,0.7)",fontWeight:400}}>흥정 없이, 투명하게</div>
            </div>
            <Link href="/cars"><button style={{background:"white",color:"#FF3B1E",border:"none",padding:"11px 22px",borderRadius:"100px",fontSize:"13px",fontWeight:800,cursor:"pointer"}}>매물 보러가기 →</button></Link>
          </div>
        </div>
      </div>
    </>
  );
}
