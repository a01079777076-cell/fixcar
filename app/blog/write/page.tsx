"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BlogEditor from "@/components/BlogEditor";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, Send } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["구매 가이드","차량 관리","소모품/꿀템","보험/금융","초보 운전","뉴스/이벤트"];

export default function BlogWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("구매 가이드");
  const [thumbnail, setThumbnail] = useState("");
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if (d?.user?.role === "ADMIN") setIsAdmin(true);
      else router.push("/blog");
    }).catch(()=>router.push("/blog"));
  }, [router]);

  const handleThumbnailUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) setThumbnail(data.url);
        else alert("업로드 실패");
      } catch { alert("업로드 오류"); }
    };
    input.click();
  };

  const handleSubmit = async () => {
    if (!title.trim()) { alert("제목을 입력해주세요"); return; }
    if (!content.trim()) { alert("내용을 입력해주세요"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, thumbnail }),
      });
      const data = await res.json();
      if (data.success) {
        alert("글이 작성됐어요!");
        router.push("/blog");
      } else {
        alert("작성 실패: " + (data.error || "다시 시도해주세요"));
      }
    } catch { alert("네트워크 오류"); }
    setSaving(false);
  };

  if (!isAdmin) return <><Navbar/><div style={{textAlign:"center",padding:100,color:"#CCC"}}>권한 확인 중...</div></>;

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} input:focus,select:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"28px 24px 100px"}}>
          <Link href="/blog" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,color:"#888",marginBottom:20,textDecoration:"none"}}><ChevronLeft size={14}/>블로그 목록</Link>

          <div style={{background:"white",borderRadius:20,padding:"32px 30px"}}>
            <h1 style={{fontSize:24,fontWeight:800,marginBottom:24}}>블로그 글쓰기</h1>

            {/* 썸네일 */}
            <div style={{marginBottom:20}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>대표 이미지</label>
              {thumbnail ? (
                <div style={{position:"relative",borderRadius:12,overflow:"hidden",marginBottom:8}}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnail} alt="" style={{width:"100%",maxHeight:250,objectFit:"cover"}}/>
                  <button onClick={()=>setThumbnail("")} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.6)",color:"white",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14}}>✕</button>
                </div>
              ) : (
                <button onClick={handleThumbnailUpload} style={{width:"100%",padding:"28px",border:"2px dashed #E0DDD7",borderRadius:12,background:"#F8F7F4",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:14,fontWeight:600,color:"#AAA",fontFamily:"'NanumSquareRound',sans-serif"}}>
                  <Upload size={18}/> 대표 이미지 업로드
                </button>
              )}
            </div>

            {/* 카테고리 */}
            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>카테고리</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {CATEGORIES.map(c=>(
                  <button key={c} onClick={()=>setCategory(c)} style={{
                    padding:"8px 16px",borderRadius:100,border:category===c?"2px solid #FF3B1E":"1.5px solid #E0DDD7",
                    background:category===c?"#FFF0ED":"white",color:category===c?"#FF3B1E":"#888",
                    fontSize:13,fontWeight:category===c?800:500,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",
                  }}>{c}</button>
                ))}
              </div>
            </div>

            {/* 제목 */}
            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>제목</label>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="글 제목을 입력하세요" maxLength={200} style={{width:"100%",padding:"14px 16px",border:"1.5px solid #E0DDD7",borderRadius:12,fontSize:16,fontWeight:700,fontFamily:"'NanumSquareRound',sans-serif"}}/>
            </div>

            {/* 리치 에디터 */}
            <div style={{marginBottom:24}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>내용</label>
              <BlogEditor value={content} onChange={setContent} />
            </div>

            {/* 발행 */}
            <button onClick={handleSubmit} disabled={saving} style={{
              width:"100%",padding:"16px",background:saving?"#CCC":"#FF3B1E",color:"white",
              border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:saving?"wait":"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",gap:8,
              fontFamily:"'NanumSquareRound',sans-serif",
            }}>
              <Send size={18}/> {saving?"발행 중...":"블로그 발행하기"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
