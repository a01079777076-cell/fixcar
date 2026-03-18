"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { MessageCircle, Plus, ChevronRight, Eye } from "lucide-react";

const CATEGORIES = ["전체","자유게시판","구매후기","질문/답변","정비정보","사진자랑"];

interface Post { id:number; title:string; category:string; author:{name:string}; _count:{comments:number}; views:number; createdAt:string; }

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState("전체");
  const [loading, setLoading] = useState(true);
  const [showWrite, setShowWrite] = useState(false);
  const [user, setUser] = useState<{name:string}|null>(null);
  const [form, setForm] = useState({ title:"", content:"", category:"자유게시판" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then(r=>r.json()).then(d=>setUser(d.user));
  }, []);

  useEffect(() => { loadPosts(); }, [category]);

  const loadPosts = () => {
    setLoading(true);
    fetch(`/api/community?category=${encodeURIComponent(category)}`)
      .then(r=>r.json()).then(d=>{ if(d.success) setPosts(d.data); setLoading(false); })
      .catch(()=>{ setPosts([
        {id:1,title:"아반떼 CN7 2년 탄 후기 진짜 솔직하게 써봄",category:"구매후기",author:{name:"김○○"},_count:{comments:12},views:234,createdAt:"2025-03-18"},
        {id:2,title:"초보운전자 중고차 고를 때 꼭 봐야 할 것들",category:"질문/답변",author:{name:"이○○"},_count:{comments:8},views:187,createdAt:"2025-03-17"},
        {id:3,title:"픽스카에서 K3 샀는데 딜러분 너무 친절하네요",category:"자유게시판",author:{name:"박○○"},_count:{comments:5},views:145,createdAt:"2025-03-16"},
      ]); setLoading(false); });
  };

  const handleSubmit = async () => {
    if (!user) { alert("로그인이 필요해요!"); return; }
    if (!form.title||!form.content) { alert("제목과 내용을 입력해주세요"); return; }
    setSubmitting(true);
    const res = await fetch("/api/community",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
    const data = await res.json();
    if (data.success) { setShowWrite(false); setForm({title:"",content:"",category:"자유게시판"}); loadPosts(); }
    else alert(data.error||"오류가 발생했어요");
    setSubmitting(false);
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;-webkit-font-smoothing:antialiased;}
        a{text-decoration:none;color:inherit;}
        button{font-family:'NanumSquareRound',sans-serif;cursor:pointer;}
        input,select,textarea{font-family:'NanumSquareRound',sans-serif;}
        input:focus,select:focus,textarea:focus{outline:none;border-color:#FF3B1E!important;background:white!important;}
        .post-row{background:white;border-radius:14px;padding:16px 20px;transition:all 0.2s;cursor:pointer;}
        .post-row:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.06);}
      `}</style>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <Navbar />
        <div style={{background:"#1A1A1A",padding:"44px 52px 36px"}}>
          <div style={{maxWidth:"900px",margin:"0 auto"}}>
            <div style={{fontSize:"12px",fontWeight:800,letterSpacing:"3px",color:"#FF7A63",marginBottom:"10px"}}>COMMUNITY</div>
            <h1 style={{fontSize:"clamp(24px,4vw,44px)",fontWeight:800,color:"white",letterSpacing:"-1px"}}>커뮤니티</h1>
            <p style={{fontSize:"14px",color:"rgba(255,255,255,0.4)",marginTop:"8px",fontWeight:400}}>구매후기 · 질문답변 · 정비정보 · 사진자랑</p>
          </div>
        </div>
        <div style={{maxWidth:"900px",margin:"0 auto",padding:"28px 52px 80px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"10px"}}>
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
              {CATEGORIES.map(cat=>(
                <button key={cat} onClick={()=>setCategory(cat)} style={{padding:"7px 16px",borderRadius:"100px",border:`2px solid ${category===cat?"#1A1A1A":"#E0DDD7"}`,background:category===cat?"#1A1A1A":"white",color:category===cat?"white":"#555",fontSize:"13px",fontWeight:700}}>{cat}</button>
              ))}
            </div>
            <button onClick={()=>{ if(!user){alert("로그인이 필요해요!"); return;} setShowWrite(true); }}
              style={{background:"#FF3B1E",color:"white",border:"none",padding:"10px 20px",borderRadius:"100px",fontSize:"13px",fontWeight:800,display:"flex",alignItems:"center",gap:"6px"}}>
              <Plus size={14}/> 글쓰기
            </button>
          </div>

          {showWrite && (
            <div style={{background:"white",borderRadius:"18px",padding:"24px",marginBottom:"16px"}}>
              <div style={{fontSize:"16px",fontWeight:800,marginBottom:"16px"}}>새 글 작성</div>
              <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}
                style={{width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"10px",padding:"11px 14px",fontSize:"14px",marginBottom:"10px",background:"#FAFAF8"}}>
                {CATEGORIES.filter(c=>c!=="전체").map(c=><option key={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="제목" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}
                style={{width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"10px",padding:"11px 14px",fontSize:"15px",fontWeight:700,marginBottom:"10px",background:"#FAFAF8"}} />
              <textarea rows={6} placeholder="내용을 입력해주세요..." value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))}
                style={{width:"100%",border:"1.5px solid #E0DDD7",borderRadius:"10px",padding:"11px 14px",fontSize:"14px",marginBottom:"12px",resize:"none",background:"#FAFAF8"}} />
              <div style={{display:"flex",gap:"10px"}}>
                <button onClick={handleSubmit} disabled={submitting} style={{background:"#FF3B1E",color:"white",border:"none",padding:"12px 24px",borderRadius:"10px",fontSize:"14px",fontWeight:800,flex:1,opacity:submitting?0.7:1}}>
                  {submitting?"등록 중...":"게시하기"}
                </button>
                <button onClick={()=>setShowWrite(false)} style={{background:"#F0EEE9",color:"#555",border:"none",padding:"12px 20px",borderRadius:"10px",fontSize:"14px",fontWeight:700}}>취소</button>
              </div>
            </div>
          )}

          {loading ? <div style={{textAlign:"center",padding:"40px",color:"#AAA"}}>로딩 중...</div> : (
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {posts.map(post=>(
                <a key={post.id} href={`/community/${post.id}`} className="post-row">
                  <div style={{display:"flex",alignItems:"flex-start",gap:"12px"}}>
                    <span style={{background:"#EEF2FF",color:"#1847FF",padding:"3px 10px",borderRadius:"100px",fontSize:"11px",fontWeight:800,flexShrink:0,marginTop:"2px"}}>{post.category}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:"15px",fontWeight:800,marginBottom:"5px"}}>{post.title}</div>
                      <div style={{display:"flex",gap:"14px",fontSize:"12px",color:"#AAA",fontWeight:400}}>
                        <span>{post.author?.name||"익명"}</span>
                        <span style={{display:"flex",alignItems:"center",gap:"3px"}}><MessageCircle size={11}/> {post._count?.comments||0}</span>
                        <span style={{display:"flex",alignItems:"center",gap:"3px"}}><Eye size={11}/> {post.views||0}</span>
                        <span>{post.createdAt?.slice(0,10)}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#DDD" style={{flexShrink:0,marginTop:"2px"}} />
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
