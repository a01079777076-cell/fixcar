"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function FavoriteButton({ carId, size = 20 }: { carId: number; size?: number }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/favorites?carId=${carId}`).then(r=>r.json()).then(d=>{ if(d.success) setLiked(d.liked); }).catch(()=>{});
  }, [carId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: liked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId }),
      });
      const data = await res.json();
      if (data.success) setLiked(!liked);
      else if (data.error?.includes("로그인")) alert("로그인 후 찜하기를 사용할 수 있어요!");
    } catch { alert("오류가 발생했어요"); }
    setLoading(false);
  };

  return (
    <button onClick={toggle} disabled={loading} style={{
      background:liked?"#FFF0ED":"rgba(255,255,255,0.9)",
      border:`1.5px solid ${liked?"#FF3B1E":"rgba(255,255,255,0.6)"}`,
      borderRadius:"50%", width:`${size+16}px`, height:`${size+16}px`,
      display:"flex", alignItems:"center", justifyContent:"center",
      cursor:loading?"default":"pointer", transition:"all 0.2s",
    }}>
      <Heart size={size} fill={liked?"#FF3B1E":"none"} color={liked?"#FF3B1E":"#888"} strokeWidth={2}/>
    </button>
  );
}
