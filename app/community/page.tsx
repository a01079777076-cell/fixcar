"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";

interface Post { id:number; title:string; content:string; category:string; views:number; createdAt:string; author:{name:string}; _count:{comments:number}; }
interface Comment { id:number; content:string; createdAt:string; author:{name:string}; }

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [post, setPost] = useState<Post|null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<{name:string}|null>(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session").then(r=>r.json()).then(d=>setUser(d.user));
    if (id) {
      fetch(`/api/community/${id}`).then(r=>r.json()).then(d=>{ if(d.success){setPost(d.data);} setLoading(false); })
        .catch(()=>setLoading(false));
      fetch(`/api/community/comments?postId=${id}`).then(r=>r.json()).then(d=>{ if(d.success) setComments(d.data); });
    }
  }, [id]);

  const handleComment = async () => {
    if (!user) { alert("로그인이 필요해요!"); return; }
    if (!newComment.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/community/comments", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ postId:Number(id), content:newComment }) });
    const data = await res.json();
    if (data.success) { setComments(p=>[...p, data.data]); setNewComment(""); }
    else alert(data.error||"오류가 발생했어요");
    setSubmitting(false);
  };

  if (loading) return <div style={{minHeight:"100vh",background:"#F0EEE9",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"sans-serif"}}>로딩 중...</div>;

  const samplePost = { id:1, title:"아반떼 CN7 2년 탄 후기 진짜 솔직하게 써봄", content:"처음 구매할 때 픽스카에서 샀는데 진짜 가격 협상 없이 바로 살 수 있어서 좋았어요.\n\n2년 동안 타면서 별 문제 없었고 연비도 나쁘지 않았어요. 고속도로에서 약 16km/L 정도 나왔고요.\n\n다음에도 중고차 살 때 픽스카 이용할 것 같아요!", category:"구매후기", views:234, createdAt:"2025-03-18", author:{name:"김○○"}, _count:{comments:2} };
  const displayPost = post || samplePost;

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;-webkit-font-smoothing:antialiased;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        textarea{font-family:'NanumSquareRound',sans-serif;}
        textarea:focus{outline:none;border-color:#FF3B1E!important;background:white!important;}
      `}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar />
        <div style={{maxWidth:"800px",margin:"0 auto",padding:"28px 32px 80px"}}>
          <button onClick={()=>router.back()} style={{display:"flex",alignItems:"center",gap:"8px",background:"white",border:"2px solid #E0DDD7",borderRadius:"100px",padding:"10px 18px",fontSize:"14px",fontWeight:700,marginBottom:"20px",cursor:"pointer"}}>
            <ArrowLeft size={15}/> 목록으로
          </button>

          <div style={{background:"white",borderRadius:"20px",overflow:"hidden",marginBottom:"16px"}}>
            <div style={{padding:"28px 32px",borderBottom:"1px solid #F0EEE9"}}>
              <span style={{background:"#EEF2FF",color:"#1847FF",padding:"4px 12px",borderRadius:"100px",fontSize:"12px",fontWeight:800,display:"inline-block",marginBottom:"14px"}}>{displayPost.category}</span>
              <h1 style={{fontSize:"22px",fontWeight:800,lineHeight:1.3,marginBottom:"12px"}}>{displayPost.title}</h1>
              <div style={{display:"flex",gap:"16px",fontSize:"13px",color:"#AAA",fontWeight:400}}>
                <span>{displayPost.author?.name}</span>
                <span style={{display:"flex",alignItems:"center",gap:"4px"}}><MessageCircle size={13}/> {comments.length}</span>
                <span>{String(displayPost.createdAt).slice(0,10)}</span>
              </div>
            </div>
            <div style={{padding:"28px 32px"}}>
              <div style={{fontSize:"15px",color:"#333",lineHeight:1.9,fontWeight:400,whiteSpace:"pre-line"}}>{displayPost.content}</div>
            </div>
          </div>

          {/* 댓글 */}
          <div style={{background:"white",borderRadius:"20px",padding:"24px 28px"}}>
            <div style={{fontSize:"16px",fontWeight:800,marginBottom:"18px",display:"flex",alignItems:"center",gap:"8px"}}><MessageCircle size={18} color="#FF3B1E"/> 댓글 {comments.length}개</div>

            {comments.length === 0 ? (
              <div style={{textAlign:"center",padding:"24px",color:"#AAA",fontSize:"14px",fontWeight:400}}>첫 댓글을 남겨보세요!</div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:"14px",marginBottom:"20px"}}>
                {comments.map(comment=>(
                  <div key={comment.id} style={{padding:"14px 16px",background:"#F8F6F2",borderRadius:"12px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                      <span style={{fontSize:"13px",fontWeight:800}}>{comment.author?.name}</span>
                      <span style={{fontSize:"12px",color:"#AAA",fontWeight:400}}>{String(comment.createdAt).slice(0,10)}</span>
                    </div>
                    <div style={{fontSize:"14px",color:"#444",lineHeight:1.7,fontWeight:400}}>{comment.content}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{display:"flex",gap:"10px"}}>
              <textarea rows={3} placeholder={user?"댓글을 입력해주세요...":"로그인 후 댓글을 남길 수 있어요"} value={newComment} onChange={e=>setNewComment(e.target.value)} disabled={!user}
                style={{flex:1,border:"1.5px solid #E0DDD7",borderRadius:"10px",padding:"12px 14px",fontSize:"14px",resize:"none",background:user?"#FAFAF8":"#F0EEE9"}} />
              <button onClick={handleComment} disabled={!newComment.trim()||submitting||!user}
                style={{background:newComment.trim()&&!submitting&&user?"#FF3B1E":"#E0DDD7",color:newComment.trim()&&!submitting&&user?"white":"#AAA",border:"none",padding:"0 18px",borderRadius:"10px",fontSize:"14px",fontWeight:800,display:"flex",alignItems:"center",gap:"6px",cursor:newComment.trim()&&!submitting&&user?"pointer":"default"}}>
                <Send size={15}/> {submitting?"전송 중...":"등록"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
