"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Send } from "lucide-react";

const CATEGORIES = ["자유게시판","차량 후기","질문/답변","정보 공유","모임/동호회"];

export default function CommunityWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("자유게시판");
  const [saving, setSaving] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if(d?.user?.id) setLoggedIn(true);
      else router.push("/login");
    }).catch(()=>router.push("/login"));
  }, [router]);

  const handleSubmit = async () => {
    if(!title.trim()) { alert("제목을 입력해주세요"); return; }
    if(!content.trim()) { alert("내용을 입력해주세요"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/community", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ title, content, category }),
      });
      const data = await res.json();
      if(data.success) { router.push("/community"); }
      else alert("작성 실패: "+(data.error||""));
    } catch { alert("네트워크 오류"); }
    setSaving(false);
  };

  if(!loggedIn) return <><Navbar/><div style={{textAlign:"center",padding:100,color:"#CCC"}}>로딩 중...</div></>;

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus,textarea:focus,select:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:700,margin:"0 auto",padding:"28px 24px 100px"}}>
          <Link href="/community" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,color:"#888",marginBottom:16,textDecoration:"none"}}><ChevronLeft size={14}/>목록</Link>

          <div style={{background:"white",borderRadius:20,padding:"32px 30px"}}>
            <h1 style={{fontSize:22,fontWeight:800,marginBottom:20}}>✏️ 글 작성</h1>

            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>카테고리</label>
              <select value={category} onChange={e=>setCategory(e.target.value)} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",background:"white"}}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>제목</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="제목을 입력하세요" maxLength={200} style={{width:"100%",padding:"14px 16px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:16,fontWeight:700,fontFamily:"'NanumSquareRound',sans-serif"}}/>
            </div>

            <div style={{marginBottom:24}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>내용</label>
              <textarea rows={10} value={content} onChange={e=>setContent(e.target.value)} placeholder="자유롭게 작성해주세요" maxLength={5000} style={{width:"100%",padding:"14px 16px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif",resize:"none",lineHeight:1.8}}/>
            </div>

            <button onClick={handleSubmit} disabled={saving} style={{width:"100%",padding:"16px",background:saving?"#CCC":"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:saving?"wait":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'NanumSquareRound',sans-serif"}}>
              <Send size={18}/> {saving?"작성 중...":"글 작성하기"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
