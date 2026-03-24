"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BlogEditor from "@/components/BlogEditor";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Send } from "lucide-react";

export default function BlogWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("구매 가이드");
  const [thumbnail, setThumbnail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if(d?.user?.role!=="ADMIN") router.push("/blog");
    }).catch(()=>router.push("/blog"));
  },[router]);

  const handleSubmit = async () => {
    if(!title.trim()){alert("제목을 입력해주세요");return;}
    setSaving(true);
    try{
      const res = await fetch("/api/blog",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,content,category,thumbnail})});
      const data = await res.json();
      if(data.success){alert("블로그 글이 등록되었습니다!");router.push("/blog");}
      else alert("등록 실패: "+(data.error||""));
    }catch{alert("네트워크 오류");}
    setSaving(false);
  };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus,select:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"28px 24px 100px"}}>
          <Link href="/blog" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,color:"#888",marginBottom:20,textDecoration:"none"}}><ChevronLeft size={14}/>블로그</Link>
          <div style={{background:"white",borderRadius:20,padding:"32px 30px"}}>
            <h1 style={{fontSize:24,fontWeight:800,marginBottom:24}}>✏️ 블로그 글쓰기</h1>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>카테고리</label>
              <select value={category} onChange={e=>setCategory(e.target.value)} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:14,fontFamily:"'NanumSquareRound',sans-serif",background:"white"}}>
                {["구매 가이드","차량 관리","소모품/꿀템","보험/금융","초보 운전","뉴스/이벤트"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>제목</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="글 제목을 입력하세요" style={{width:"100%",padding:"14px 16px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:16,fontWeight:700,fontFamily:"'NanumSquareRound',sans-serif"}}/>
            </div>
            <div style={{marginBottom:24}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>내용</label>
              <BlogEditor value={content} onChange={setContent} onImageUpload={url=>{if(!thumbnail)setThumbnail(url);}}/>
            </div>
            <button onClick={handleSubmit} disabled={saving} style={{width:"100%",padding:"16px",background:saving?"#CCC":"#FF3B1E",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:saving?"wait":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'NanumSquareRound',sans-serif"}}><Send size={18}/>{saving?"등록 중...":"블로그 등록"}</button>
          </div>
        </div>
      </div>
    </>
  );
}
