"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Send, Trash2, Eye, MessageSquare, ThumbsUp, Heart } from "lucide-react";

interface Post { id:number; title:string; content:string; category:string; views:number; likes:number; createdAt:string; updatedAt?:string; authorId:number; author:{name:string;nickname?:string} }
interface Comment { id:number; content:string; createdAt:string; authorId:number; author:{name:string;nickname?:string} }

export default function CommunityDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post|null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<number|null>(null);
  const [userRole, setUserRole] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/community/${id}`).then(r=>r.json()).then(d=>{
      if(d.post) { setPost(d.post); setLikeCount(d.post.likes||0); }
      if(d.comments) setComments(d.comments);
      setLoading(false);
    }).catch(()=>setLoading(false));
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if(d?.user?.id) { setUserId(d.user.id); setUserRole(d.user.role||""); }
    }).catch(()=>{});
  }, [id]);

  const handleLike = async () => {
    if(!userId) { alert("로그인이 필요해요!"); return; }
    if(liked) return;
    try {
      const res = await fetch("/api/community/like", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: Number(id) }),
      });
      const data = await res.json();
      if(data.success) { setLiked(true); setLikeCount(data.likes || likeCount + 1); }
    } catch {}
  };

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
      if(data.success && data.comment) { setComments(prev=>[...prev, data.comment]); setNewComment(""); }
    } catch {}
    setSending(false);
  };

  const handleDeleteComment = async (commentId:number) => {
    if(!confirm("정말 이 댓글을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/community/comments?id=${commentId}`, { method:"DELETE" });
      const data = await res.json();
      if(data.success) setComments(prev=>prev.filter(c=>c.id!==commentId));
    } catch {}
  };

  const handleDeletePost = async () => {
    if(!confirm(`정말 "${post?.title}" 글을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) return;
    try {
      const res = await fetch(`/api/community/${id}`, { method:"DELETE" });
      const data = await res.json();
      if(data.success) { alert("삭제 완료"); router.push("/community"); }
    } catch {}
  };

  const startEdit = () => { if(post){ setEditTitle(post.title); setEditContent(post.content); setEditing(true); } };
  const handleEdit = async () => {
    if(!editTitle.trim()||!editContent.trim()){alert("제목과 내용을 입력해주세요");return;}
    setEditSaving(true);
    try {
      const res = await fetch(`/api/community/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:editTitle,content:editContent})});
      const data = await res.json();
      if(data.success){ setPost({...post!,title:editTitle,content:editContent,updatedAt:new Date().toISOString()}); setEditing(false); }
      else alert(data.error||"수정 실패");
    } catch { alert("네트워크 오류"); }
    setEditSaving(false);
  };

  const displayName = (author:{name:string;nickname?:string}) => {
    const nick = author.nickname || author.name;
    if (userRole === "ADMIN" && author.nickname) {
      return <>{nick} <span style={{fontSize:10,color:"#CCC",fontWeight:400}}>({author.name})</span></>;
    }
    return nick;
  };

  if(loading) return <><Navbar/><div style={{textAlign:"center",padding:100,color:"#CCC"}}>로딩 중...</div></>;
  if(!post) return <><Navbar/><div style={{textAlign:"center",padding:100}}><h2 style={{fontSize:20,fontWeight:800}}>글을 찾을 수 없어요</h2><Link href="/community" style={{color:"#FF3B1E",fontWeight:700,marginTop:12,display:"inline-block"}}>목록으로 →</Link></div></>;

  const isMyPost = userId === post.authorId;
  const isAdmin = userRole === "ADMIN";

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} textarea:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"28px 24px 100px"}}>
          <Link href="/community" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,color:"#888",marginBottom:16,textDecoration:"none"}}><ChevronLeft size={14}/>목록</Link>

          <div style={{background:"white",borderRadius:20,padding:"32px 30px",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              <span style={{fontSize:12,fontWeight:700,color:"#FF3B1E",background:"#FFF0ED",padding:"3px 10px",borderRadius:100}}>{post.category}</span>
              <span style={{fontSize:12,color:"#CCC"}}>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
            </div>
            <h1 style={{fontSize:22,fontWeight:800,marginBottom:16,lineHeight:1.4}}>{post.title}</h1>
            <div style={{display:"flex",gap:16,fontSize:12,color:"#AAA",marginBottom:20,paddingBottom:16,borderBottom:"1px solid #F0EEE9",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:16}}>
                <span>👤 {displayName(post.author)}</span>
                <span><Eye size={12} style={{verticalAlign:"middle"}}/> {post.views}</span>
                <span><MessageSquare size={12} style={{verticalAlign:"middle"}}/> {comments.length}</span>
              </div>
              {(isMyPost || isAdmin) && (
                <div style={{display:"flex",gap:6}}>
                  {isMyPost&&<button onClick={startEdit} style={{border:"none",background:"#EEF5FF",padding:"5px 10px",borderRadius:6,fontSize:11,fontWeight:700,color:"#0066FF",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:"'NanumSquareRound',sans-serif"}}>
                    ✏️ 수정
                  </button>}
                  <button onClick={handleDeletePost} style={{border:"none",background:"#FFF0ED",padding:"5px 10px",borderRadius:6,fontSize:11,fontWeight:700,color:"#E24B4A",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:"'NanumSquareRound',sans-serif"}}>
                    <Trash2 size={10}/> 삭제
                  </button>
                </div>
              )}
            </div>

            {/* 수정 모드 */}
            {editing?(
              <div>
                <input value={editTitle} onChange={e=>setEditTitle(e.target.value)} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #DDEEFF",borderRadius:10,fontSize:16,fontWeight:700,fontFamily:"'NanumSquareRound',sans-serif",marginBottom:10}}/>
                <textarea rows={8} value={editContent} onChange={e=>setEditContent(e.target.value)} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #DDEEFF",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",resize:"none",lineHeight:1.8,marginBottom:10}}/>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={handleEdit} disabled={editSaving} style={{padding:"10px 24px",background:"#0066FF",color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>{editSaving?"저장 중...":"수정 완료"}</button>
                  <button onClick={()=>setEditing(false)} style={{padding:"10px 20px",background:"#F0EEE9",color:"#888",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif"}}>취소</button>
                </div>
              </div>
            ):(
              <div>
                {post.updatedAt&&post.updatedAt!==post.createdAt&&<div style={{fontSize:11,color:"#CCC",marginBottom:8}}>✏️ {new Date(post.updatedAt).toLocaleDateString("ko-KR")} 수정됨</div>}
                <div style={{fontSize:15,color:"#333",lineHeight:2.0,whiteSpace:"pre-wrap"}}>{post.content}</div>
              </div>
            )}

            {/* ═══ 좋아요 버튼 ═══ */}
            <div style={{display:"flex",justifyContent:"center",marginTop:28,paddingTop:20,borderTop:"1px solid #F0EEE9"}}>
              <button onClick={handleLike} disabled={liked} style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:6,
                padding:"16px 32px",borderRadius:16,cursor:liked?"default":"pointer",
                border:liked?"2px solid #FF3B1E":"2px solid #E0DDD7",
                background:liked?"#FFF0ED":"white",
                fontFamily:"'NanumSquareRound',sans-serif",transition:"all 0.2s",
              }}>
                <Heart size={24} color="#FF3B1E" fill={liked?"#FF3B1E":"none"} style={{transition:"all 0.2s"}}/>
                <span style={{fontSize:18,fontWeight:800,color:liked?"#FF3B1E":"#888"}}>{likeCount}</span>
                <span style={{fontSize:11,color:liked?"#FF3B1E":"#CCC",fontWeight:700}}>{liked?"추천완료":"추천"}</span>
              </button>
            </div>
          </div>

          {/* 댓글 */}
          <div style={{background:"white",borderRadius:20,padding:"24px 26px"}}>
            <h3 style={{fontSize:16,fontWeight:800,marginBottom:16}}>💬 댓글 ({comments.length})</h3>
            <div style={{display:"flex",gap:8,marginBottom:20}}>
              <textarea rows={2} value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder={userId?"댓글을 입력하세요":"로그인 후 댓글을 작성할 수 있어요"} disabled={!userId} style={{flex:1,padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",resize:"none"}}/>
              <button onClick={handleComment} disabled={sending||!userId} style={{padding:"12px 18px",background:userId?"#FF3B1E":"#CCC",color:"white",border:"none",borderRadius:10,cursor:userId?"pointer":"not-allowed",fontFamily:"'NanumSquareRound',sans-serif",alignSelf:"flex-end"}}>
                <Send size={16}/>
              </button>
            </div>
            {comments.length===0?<div style={{textAlign:"center",padding:"20px",color:"#CCC",fontSize:14}}>아직 댓글이 없어요. 첫 댓글을 남겨보세요!</div>:
            comments.map(c=>(
              <div key={c.id} style={{padding:"14px 0",borderBottom:"1px solid #F0EEE9"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:13,fontWeight:800}}>{displayName(c.author)}</span>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,color:"#CCC"}}>{new Date(c.createdAt).toLocaleDateString("ko-KR")}</span>
                    {(userId===c.authorId||isAdmin)&&<button onClick={()=>handleDeleteComment(c.id)} style={{border:"none",background:"transparent",cursor:"pointer",color:"#CCC"}}><Trash2 size={12}/></button>}
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
