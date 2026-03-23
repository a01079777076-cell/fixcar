"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Send, Trash2, Eye, MessageSquare } from "lucide-react";

interface Post { id:number; title:string; content:string; category:string; views:number; createdAt:string; author:{name:string} }
interface Comment { id:number; content:string; createdAt:string; author:{name:string}; authorId:number }

export default function CommunityDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post|null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<number|null>(null);

  useEffect(() => {
    fetch(`/api/community/${id}`).then(r=>r.json()).then(d=>{
      if(d.post) setPost(d.post);
      if(d.comments) setComments(d.comments);
      setLoading(false);
    }).catch(()=>setLoading(false));
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{ if(d?.user?.id) setUserId(d.user.id); }).catch(()=>{});
  }, [id]);

  const handleComment = async () => {
    if(!newComment.trim()) return;
    if(!userId) { alert("로그인이 필요해요!"); return; }
    setSending(true);
    try {
      const res = await fetch("/api/community/comments", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ postId:Number(id), content:newComment }),
      });
      const data = await res.json();
      if(data.success && data.comment) {
        setComments(prev=>[...prev, data.comment]);
        setNewComment("");
      }
    } catch {}
    setSending(false);
  };

  const handleDeleteComment = async (commentId:number) => {
    if(!confirm("댓글을 삭제할까요?")) return;
    try {
      const res = await fetch(`/api/community/comments?id=${commentId}`, { method:"DELETE" });
      const data = await res.json();
      if(data.success) setComments(prev=>prev.filter(c=>c.id!==commentId));
    } catch {}
  };

  if(loading) return <><Navbar/><div style={{textAlign:"center",padding:100,color:"#CCC"}}>로딩 중...</div></>;
  if(!post) return <><Navbar/><div style={{textAlign:"center",padding:100}}><h2 style={{fontSize:20,fontWeight:800}}>글을 찾을 수 없어요</h2><Link href="/community" style={{color:"#FF3B1E",fontWeight:700,marginTop:12,display:"inline-block"}}>목록으로 →</Link></div></>;

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} textarea:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"28px 24px 100px"}}>
          <Link href="/community" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,color:"#888",marginBottom:16,textDecoration:"none"}}><ChevronLeft size={14}/>목록</Link>

          {/* 글 본문 */}
          <div style={{background:"white",borderRadius:20,padding:"32px 30px",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span style={{fontSize:12,fontWeight:700,color:"#FF3B1E",background:"#FFF0ED",padding:"3px 10px",borderRadius:100}}>{post.category}</span>
              <span style={{fontSize:12,color:"#CCC"}}>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
            </div>
            <h1 style={{fontSize:22,fontWeight:800,marginBottom:16,lineHeight:1.4}}>{post.title}</h1>
            <div style={{display:"flex",gap:16,fontSize:12,color:"#AAA",marginBottom:20,paddingBottom:16,borderBottom:"1px solid #F0EEE9"}}>
              <span>👤 {post.author.name}</span>
              <span><Eye size={12} style={{verticalAlign:"middle"}}/> {post.views}</span>
              <span><MessageSquare size={12} style={{verticalAlign:"middle"}}/> {comments.length}</span>
            </div>
            <div style={{fontSize:15,color:"#333",lineHeight:2.0,whiteSpace:"pre-wrap"}}>{post.content}</div>
          </div>

          {/* 댓글 */}
          <div style={{background:"white",borderRadius:20,padding:"24px 26px"}}>
            <h3 style={{fontSize:16,fontWeight:800,marginBottom:16}}>💬 댓글 ({comments.length})</h3>

            {/* 댓글 입력 */}
            <div style={{display:"flex",gap:8,marginBottom:20}}>
              <textarea rows={2} value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder={userId?"댓글을 입력하세요":"로그인 후 댓글을 작성할 수 있어요"} disabled={!userId} style={{flex:1,padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",resize:"none"}}/>
              <button onClick={handleComment} disabled={sending||!userId} style={{padding:"12px 18px",background:userId?"#FF3B1E":"#CCC",color:"white",border:"none",borderRadius:10,cursor:userId?"pointer":"not-allowed",fontFamily:"'NanumSquareRound',sans-serif",alignSelf:"flex-end"}}>
                <Send size={16}/>
              </button>
            </div>

            {/* 댓글 목록 */}
            {comments.length===0?<div style={{textAlign:"center",padding:"20px",color:"#CCC",fontSize:14}}>아직 댓글이 없어요. 첫 댓글을 남겨보세요!</div>:
            comments.map(c=>(
              <div key={c.id} style={{padding:"14px 0",borderBottom:"1px solid #F0EEE9"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:13,fontWeight:800}}>{c.author.name}</span>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,color:"#CCC"}}>{new Date(c.createdAt).toLocaleDateString("ko-KR")}</span>
                    {userId===c.authorId&&<button onClick={()=>handleDeleteComment(c.id)} style={{border:"none",background:"transparent",cursor:"pointer",color:"#CCC"}}><Trash2 size={12}/></button>}
                  </div>
                </div>
                <p style={{fontSize:14,color:"#555",lineHeight:1.7}}>{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
