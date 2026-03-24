"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Save, Upload, X } from "lucide-react";

export default function DealerCarEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [price, setPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then(r=>r.json()).then(d=>{
      if(!d?.user?.id||(d.user.role!=="DEALER"&&d.user.role!=="ADMIN")) { router.push("/"); return; }
    }).catch(()=>router.push("/"));

    fetch(`/api/cars/${id}`).then(r=>r.json()).then(d=>{
      if(d.id) { setCar(d); setPrice(String(d.price||"")); setMileage(String(d.mileage||"")); setDescription(d.description||""); setImages(d.images||[]); }
      setLoading(false);
    }).catch(()=>setLoading(false));
  }, [id, router]);

  /* 수정 중 표시 (로컬 상태만) */
  const [editing, setEditing] = useState(false);
  useEffect(() => { if(car) setEditing(true); }, [car]);

  const handleImageUpload = async () => {
    const input = document.createElement("input"); input.type="file"; input.accept="image/*"; input.multiple=true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files; if(!files) return;
      setUploading(true);
      for(const file of Array.from(files)) {
        const fd = new FormData(); fd.append("file", file);
        try {
          const res = await fetch("/api/upload", { method:"POST", body:fd });
          const data = await res.json();
          if(data.success && data.url) setImages(prev=>[...prev, data.url]);
        } catch {}
      }
      setUploading(false);
    }; input.click();
  };

  const handleSave = async () => {
    if(!confirm("수정 완료하시겠습니까? 다시 검수 대기 상태로 돌아갑니다.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/dealer/cars/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: Number(price), mileage: Number(mileage), description, images, status: "REVIEWING" }),
      });
      const data = await res.json();
      if(data.success) { alert("수정 완료! 검수 대기 상태로 돌아갑니다."); router.push("/dealer"); }
      else alert("수정 실패: " + (data.error || ""));
    } catch { alert("네트워크 오류"); }
    setSaving(false);
  };

  if(loading) return <><Navbar/><div style={{textAlign:"center",padding:100,color:"#CCC"}}>로딩 중...</div></>;
  if(!car) return <><Navbar/><div style={{textAlign:"center",padding:100}}>매물을 찾을 수 없어요</div></>;

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F4FF;} input:focus,textarea:focus{outline:none;border-color:#0066FF!important;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0F4FF"}}>
        <div style={{maxWidth:700,margin:"0 auto",padding:"28px 24px 100px"}}>
          <Link href="/dealer" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,color:"#888",marginBottom:16,textDecoration:"none"}}><ChevronLeft size={14}/>딜러 대시보드</Link>

          <div style={{background:"white",borderRadius:20,padding:"28px 26px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h1 style={{fontSize:22,fontWeight:800}}>✏️ 매물 수정</h1>
              <span style={{fontSize:12,fontWeight:700,color:"#E8A020",background:"#FFF8EC",padding:"4px 12px",borderRadius:100}}>수정 중</span>
            </div>

            <div style={{background:"#F8F7F4",borderRadius:12,padding:"14px 18px",marginBottom:20}}>
              <div style={{fontSize:16,fontWeight:800}}>{car.brand} {car.name}</div>
              <div style={{fontSize:12,color:"#AAA"}}>{car.year}년 · {car.fuel} · {car.color}</div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
              <div>
                <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>판매가(만원)</label>
                <input type="number" value={price} onChange={e=>setPrice(e.target.value)} style={{width:"100%",padding:"13px 16px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif"}}/>
              </div>
              <div>
                <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>주행거리(km)</label>
                <input type="number" value={mileage} onChange={e=>setMileage(e.target.value)} style={{width:"100%",padding:"13px 16px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif"}}/>
              </div>
            </div>

            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:6}}>차량 설명</label>
              <textarea rows={4} value={description} onChange={e=>setDescription(e.target.value)} style={{width:"100%",padding:"13px 16px",border:"1.5px solid #E0DDD7",borderRadius:10,fontSize:15,fontFamily:"'NanumSquareRound',sans-serif",resize:"none"}}/>
            </div>

            <div style={{marginBottom:20}}>
              <label style={{fontSize:13,fontWeight:800,display:"block",marginBottom:8}}>사진</label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {images.map((url,i)=>(
                  <div key={i} style={{position:"relative",borderRadius:10,overflow:"hidden",aspectRatio:"1"}}>
                    <img src={url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <button onClick={()=>setImages(prev=>prev.filter((_,j)=>j!==i))} style={{position:"absolute",top:4,right:4,width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,0.6)",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={10}/></button>
                  </div>
                ))}
                <button onClick={handleImageUpload} disabled={uploading} style={{aspectRatio:"1",border:"2px dashed #DDEEFF",borderRadius:10,background:"#F0F6FF",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,fontSize:11,color:"#0066FF",fontWeight:700}}>
                  <Upload size={18}/>{uploading?"업로드중...":"추가"}
                </button>
              </div>
            </div>

            <button onClick={handleSave} disabled={saving} style={{width:"100%",padding:"16px",background:saving?"#CCC":"#0066FF",color:"white",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:saving?"wait":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'NanumSquareRound',sans-serif"}}>
              <Save size={18}/> {saving?"저장 중...":"수정 완료 (검수 재요청)"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
