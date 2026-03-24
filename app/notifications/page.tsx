"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Bell, MessageSquare, Heart, Car, Zap } from "lucide-react";

interface Notification { id:string; type:string; title:string; message:string; href:string; time:string; read:boolean; }

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications").then(r=>r.json()).then(d=>{
      setNotifs(Array.isArray(d)?d:d.data||[]);
      setLoading(false);
    }).catch(()=>setLoading(false));
  }, []);

  const icons: Record<string, any> = { inquiry: MessageSquare, favorite: Heart, car: Car, system: Zap };

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;}`}</style>
      <Navbar/>
      <div style={{minHeight:"100vh",background:"#F0EEE9"}}>
        <div style={{maxWidth:700,margin:"0 auto",padding:"28px 20px 100px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <Bell size={22} color="#FF3B1E"/>
            <h1 style={{fontSize:24,fontWeight:800}}>알림</h1>
          </div>

          {loading?<div style={{textAlign:"center",padding:60,color:"#CCC"}}>로딩 중...</div>:
          notifs.length===0?(
            <div style={{background:"white",borderRadius:20,padding:"60px 24px",textAlign:"center"}}>
              <div style={{fontSize:48,marginBottom:16,opacity:0.3}}>🔔</div>
              <h3 style={{fontSize:18,fontWeight:800,marginBottom:8,color:"#AAA"}}>알림이 없어요</h3>
              <p style={{fontSize:13,color:"#CCC"}}>새로운 활동이 있으면 알려드릴게요</p>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {notifs.map(n=>{
                const Icon = icons[n.type] || Bell;
                return (
                  <Link key={n.id} href={n.href}>
                    <div style={{background:n.read?"white":"#FFF8F6",borderRadius:14,padding:"16px 20px",display:"flex",gap:14,alignItems:"center",border:n.read?"none":"1px solid #FFE4DE"}}>
                      <div style={{width:40,height:40,borderRadius:12,background:n.read?"#F0EEE9":"#FFF0ED",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <Icon size={18} color={n.read?"#CCC":"#FF3B1E"}/>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:n.read?600:800,color:n.read?"#888":"#1A1A1A"}}>{n.title}</div>
                        <div style={{fontSize:12,color:"#AAA",marginTop:2}}>{n.message}</div>
                      </div>
                      <div style={{fontSize:11,color:"#CCC",whiteSpace:"nowrap"}}>{n.time}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
