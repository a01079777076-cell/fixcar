"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import RoleGuard from "@/components/RoleGuard";
import { useRouter } from "next/navigation";
import { Upload, X, Image as ImageIcon } from "lucide-react";

function BlogWriteContent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const CATEGORIES = ["구매팁","로드테스트","리뷰","정비/관리","뉴스","자유"];

  /* 서버 API로 이미지 업로드 */
  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      return data.url || null;
    } catch { return null; }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isThumbnail = false) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) {
        if (isThumbnail) { setThumbnail(url); }
        else {
          setImages(prev => [...prev, url]);
          setContent(prev => prev + `\n[이미지: ${url}]\n`);
        }
      } else { alert("이미지 업로드에 실패했어요. Cloudinary 설정을 확인해주세요."); }
    }
    setUploading(false);
  };

  const handleSave = async () => {
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
        alert("글이 등록됐어요!");
        router.push("/blog");
      } else { alert("저장 실패: " + (data.error || "다시 시도해주세요")); }
    } catch { alert("네트워크 오류"); }
    setSaving(false);
  };

  return (
    <>
      <style>{`
        @import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;}
        input:focus,textarea:focus,select:focus{outline:none;border-color:#FF3B1E!important;}
      `}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{background:"#1A1A1A",padding:"36px 24px 28px"}}>
          <div style={{maxWidth:800,margin:"0 auto"}}>
            <h1 style={{fontSize:26,fontWeight:800,color:"white"}}>✏️ 블로그 글쓰기</h1>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginTop:4}}>관리자 전용</p>
          </div>
        </div>
        <div style={{maxWidth:800,margin:"0 auto",padding:"24px 16px 100px"}}>
          {/* 카테고리 */}
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            {CATEGORIES.map(c=>(
              <button key={c} onClick={()=>setCategory(c)} style={{
                padding:"8px 16px",borderRadius:100,border:category===c?"2px solid #FF3B1E":"1.5px solid #E0DDD7",
                background:category===c?"#FFF0ED":"white",color:category===c?"#FF3B1E":"#888",
                fontSize:13,fontWeight:category===c?800:600,cursor:"pointer",fontFamily:"'NanumSquareRound',sans-serif",
              }}>{c}</button>
            ))}
          </div>

          {/* 제목 */}
          <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="제목을 입력하세요"
            style={{width:"100%",padding:"18px 22px",border:"none",borderRadius:16,fontSize:22,fontWeight:800,fontFamily:"'NanumSquareRound',sans-serif",marginBottom:14,background:"white"}}/>

          {/* 대표 이미지 */}
          <div style={{background:"white",borderRadius:16,padding:"18px 22px",marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:800,marginBottom:10}}>대표 이미지 (썸네일)</div>
            {thumbnail ? (
              <div style={{position:"relative",borderRadius:12,overflow:"hidden",marginBottom:10}}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumbnail} alt="" style={{width:"100%",maxHeight:300,objectFit:"cover"}}/>
                <button onClick={()=>setThumbnail("")} style={{position:"absolute",top:8,right:8,width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,0.6)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><X size={14} color="white"/></button>
              </div>
            ) : (
              <label style={{display:"flex",alignItems:"center",justifyContent:"center",height:120,border:"2px dashed #E0DDD7",borderRadius:12,cursor:"pointer",background:"#FAFAF8"}}>
                <div style={{textAlign:"center"}}>
                  <Upload size={24} color="#CCC" style={{marginBottom:4}}/>
                  <div style={{fontSize:13,color:"#AAA"}}>{uploading?"업로드 중...":"클릭하여 대표 이미지 선택"}</div>
                </div>
                <input type="file" accept="image/*" onChange={e=>handleImageUpload(e,true)} style={{display:"none"}} disabled={uploading}/>
              </label>
            )}
          </div>

          {/* 본문 */}
          <div style={{background:"white",borderRadius:16,overflow:"hidden",marginBottom:14}}>
            <div style={{display:"flex",gap:4,padding:"10px 16px",borderBottom:"1px solid #F0EEE9",flexWrap:"wrap",alignItems:"center"}}>
              <label style={{display:"flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:8,background:"#EEF2FF",color:"#1847FF",fontSize:12,fontWeight:700,cursor:uploading?"wait":"pointer"}}>
                <ImageIcon size={14}/>{uploading?"업로드 중...":"📷 사진 추가"}
                <input type="file" accept="image/*" multiple onChange={e=>handleImageUpload(e,false)} style={{display:"none"}} disabled={uploading}/>
              </label>
              <span style={{fontSize:11,color:"#CCC",marginLeft:8}}>본문에 사진을 여러 장 삽입할 수 있어요</span>
            </div>
            <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="내용을 입력하세요... 사진은 위 '사진 추가' 버튼으로 삽입할 수 있어요."
              style={{width:"100%",minHeight:400,padding:"20px 22px",border:"none",fontSize:15,fontFamily:"'NanumSquareRound',sans-serif",lineHeight:1.8,resize:"vertical"}}/>
          </div>

          {/* 삽입된 이미지 미리보기 */}
          {images.length > 0 && (
            <div style={{background:"white",borderRadius:16,padding:"18px 22px",marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:800,marginBottom:10}}>삽입된 이미지 ({images.length}장)</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {images.map((img,i)=>(
                  <div key={i} style={{position:"relative",borderRadius:8,overflow:"hidden",aspectRatio:"4/3"}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <button onClick={()=>setImages(prev=>prev.filter((_,j)=>j!==i))} style={{position:"absolute",top:4,right:4,width:20,height:20,borderRadius:"50%",background:"rgba(0,0,0,0.6)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><X size={10} color="white"/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleSave} disabled={saving} style={{
            width:"100%",padding:"18px",background:saving?"#CCC":"#FF3B1E",color:"white",border:"none",
            borderRadius:14,fontSize:16,fontWeight:800,cursor:saving?"wait":"pointer",fontFamily:"'NanumSquareRound',sans-serif",
          }}>{saving?"저장 중...":"📝 글 등록하기"}</button>
        </div>
      </div>
    </>
  );
}

/* ★ 관리자만 접근 가능 */
export default function BlogWritePage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <BlogWriteContent />
    </RoleGuard>
  );
}
