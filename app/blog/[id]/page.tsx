import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ChevronLeft, Calendar, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogContent from "@/components/BlogContent";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await prisma.blogPost.findUnique({ where:{ id:parseInt(id) } });
    if (!post) return { title:"블로그" };
    return { title:post.title, description:post.summary };
  } catch { return { title:"블로그" }; }
}

const MOCK_POSTS: Record<number,{title:string;category:string;content:string;tags:string[];author:string}> = {
  1: { title:"중고차 구매 전 꼭 확인해야 할 10가지", category:"구매 가이드", author:"픽스카", tags:["구매가이드","체크리스트"], content:`중고차를 처음 구매하시는 분들을 위해 꼭 확인해야 할 10가지 체크리스트를 정리했어요.

**1. 사고 이력 확인**
보험개발원 홈페이지 또는 카히스토리에서 차량번호로 조회할 수 있어요. 사고 건수, 수리 금액, 침수 이력까지 확인 가능해요.

**2. 성능점검기록부 확인**
딜러에게 성능점검기록부 원본을 요청하세요. 엔진·미션 상태, 사고 부위, 오일 누유 여부를 확인할 수 있어요.

**3. 주행거리 조작 여부 확인**
계기판 주행거리와 성능점검기록부의 주행거리를 대조해보세요. 차이가 크다면 의심해볼 수 있어요.

**4. 외관 상태 확인**
패널 두께 측정기(페인트 두께계)로 도색 이력을 확인하세요. 수리 이력이 있는 부위는 두께가 다르게 나와요.

**5. 엔진룸 확인**
엔진룸의 실런트(방수재) 색상이 다르거나, 용접 흔적이 있다면 사고 이력의 신호일 수 있어요.

**6. 시운전 필수**
냉간 상태에서 시동을 걸어보고, 브레이크, 변속, 조향 등을 직접 확인하세요.

**7. 하체 확인**
리프트를 이용해 차량 하체의 녹, 용접 흔적, 패널 변형 여부를 확인하세요.

**8. 전기 장비 확인**
에어컨, 히터, 전동 창문, 모든 등화장치가 정상 작동하는지 확인하세요.

**9. 타이어 상태 확인**
타이어 마모도와 제조 연도를 확인하세요. 4개의 마모도가 고르지 않다면 얼라인먼트 문제일 수 있어요.

**10. 소유자 변경 이력 확인**
소유자가 많이 바뀐 차량은 문제가 있을 가능성이 있어요. 1~2인 소유 차량을 선호하세요.

픽스카의 모든 매물은 이 10가지를 포함한 100항목을 전문 정비사가 점검한 후 등록돼요. 안심하고 구매하세요! 🙌` },
};

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = parseInt(id);

  let post;
  try {
    post = await prisma.blogPost.findUnique({ where:{ id:postId }, include:{ author:{ select:{ name:true } } } });
  } catch {}

  const mockPost = MOCK_POSTS[postId];
  if (!post && !mockPost) notFound();

  const title = post?.title || mockPost?.title || "";
  const content = post?.content || mockPost?.content || "";
  const category = post?.category || mockPost?.category || "";
  const authorName = post?.author?.name || mockPost?.author || "픽스카";
  const tags = (post?.tags as string[]) || mockPost?.tags || [];

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar/>
        <div style={{maxWidth:"760px",margin:"0 auto",padding:"28px 32px 80px"}}>
          <Link href="/blog" style={{display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"14px",fontWeight:700,color:"#888",marginBottom:"20px"}}><ChevronLeft size={16}/>블로그 목록</Link>
          <div style={{background:"white",borderRadius:"20px",padding:"32px 36px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px",flexWrap:"wrap"}}>
              <span style={{background:"#EEF2FF",color:"#1847FF",padding:"4px 12px",borderRadius:"100px",fontSize:"12px",fontWeight:800}}>{category}</span>
              <span style={{fontSize:"12px",color:"#AAA",fontWeight:400,display:"flex",alignItems:"center",gap:"4px"}}><Calendar size={11}/>{new Date().toLocaleDateString("ko-KR")}</span>
              <span style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>by {authorName}</span>
            </div>
            <h1 style={{fontSize:"clamp(22px,3vw,30px)",fontWeight:800,letterSpacing:"-1px",lineHeight:1.3,marginBottom:"20px"}}>{title}</h1>
<BlogContent content={content} />
            {tags.length>0&&(
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginTop:"24px",paddingTop:"20px",borderTop:"1px solid #F0EEE9"}}>
                {tags.map((t:string)=><span key={t} style={{background:"#F0EEE9",color:"#888",padding:"4px 10px",borderRadius:"100px",fontSize:"12px",fontWeight:700,display:"flex",alignItems:"center",gap:"3px"}}><Tag size={10}/>#{t}</span>)}
              </div>
            )}
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
