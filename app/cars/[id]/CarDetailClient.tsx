// ═══════════════════════════════════════════════════
// 📁 저장 경로: app/cars/[id]/CarDetailClient.tsx
// ═══════════════════════════════════════════════════
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, MessageSquare, Shield, ChevronLeft, ChevronRight, Award, Star, Check, AlertTriangle, ExternalLink, Eye, Image as ImageIcon } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import { saveRecentCar } from "@/components/RecentCars";
import SimilarCars from "@/components/SimilarCars";

export default function CarDetailClient() {
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [mainImg, setMainImg] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [detailTab, setDetailTab] = useState("basic");
  const [showReport, setShowReport] = useState(false);
  const [reportCategory, setReportCategory] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportSending, setReportSending] = useState(false);
  const [expandedGuide, setExpandedGuide] = useState<string|null>(null);

  useEffect(() => {
    fetch(`/api/cars/${id}`).then(r => r.json()).then(d => {
      if (d.success && d.data) { setCar(d.data); saveRecentCar(d.data); setFavCount(d.data._count?.favorites || 0); }
      else if (d.id) { setCar(d); saveRecentCar(d); setFavCount(d._count?.favorites || 0); }
      setLoading(false);
    }).catch(() => setLoading(false));
    fetch("/api/auth/session").then(r => r.json()).then(d => { if (d?.user?.id) setUserId(d.user.id); }).catch(() => {});
    fetch("/api/favorites/list").then(r => r.json()).then(d => {
      if (Array.isArray(d) && d.some((f: any) => String(f.carId) === String(id))) setIsFav(true);
    }).catch(() => {});
  }, [id]);

  const toggleFav = async () => {
    if (!userId) { alert("로그인이 필요해요!"); return; }
    if (isFav) { await fetch("/api/favorites", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ carId: Number(id) }) }); setIsFav(false); setFavCount(p => Math.max(0, p - 1)); }
    else { await fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ carId: Number(id) }) }); setIsFav(true); setFavCount(p => p + 1); }
  };
  const sendInquiry = async () => {
    if (!userId) { alert("로그인이 필요해요!"); return; }
    if (!inquiryMsg.trim()) { alert("문의 내용을 입력해주세요"); return; }
    setSending(true);
    try { const res = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ carId: Number(id), message: inquiryMsg }) }); const data = await res.json(); if (data.success) { alert("문의가 접수되었습니다!"); setShowInquiry(false); setInquiryMsg(""); } else alert(data.error || "문의 실패"); } catch { alert("네트워크 오류"); }
    setSending(false);
  };
  const sendReport = async () => {
    if (!userId) { alert("로그인이 필요해요!"); return; }
    if (!reportCategory) { alert("신고 사유를 선택해주세요"); return; }
    setReportSending(true);
    try { const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "허위매물신고", carId: Number(id), category: reportCategory, message: `[허위매물 신고] 매물 #${id}\n사유: ${reportCategory}\n상세: ${reportReason || "없음"}` }) }); if (res.ok) { alert("신고가 접수되었습니다."); setShowReport(false); setReportCategory(""); setReportReason(""); } else alert("접수 실패"); } catch { alert("네트워크 오류"); }
    setReportSending(false);
  };
  const goImg = (dir: number) => { const imgs = car?.images || []; if (imgs.length <= 1) return; setMainImg(prev => (prev + dir + imgs.length) % imgs.length); };

  if (loading) return <><Navbar /><div style={{ textAlign: "center", padding: 100, color: "#CCC" }}>로딩 중...</div></>;
  if (!car) return <><Navbar /><div style={{ textAlign: "center", padding: 100 }}><div style={{ fontSize: 48, marginBottom: 12 }}>🚗</div><h2 style={{ fontSize: 20, fontWeight: 800 }}>매물을 찾을 수 없어요</h2><Link href="/cars" style={{ color: "#FF3B1E", fontWeight: 700, marginTop: 12, display: "inline-block" }}>매물 보러가기 →</Link></div></>;

  const images = car.images || [], tags = car.tags || [], options = car.options || [], dealer = car.dealer, isVerified = dealer?.verified;
  const parseImg = (img: string) => { const [url, pos] = img.split("#"); return { url, pos: pos ? `center ${pos}%` : "center 60%" }; };
  const sideImgs = images.slice(1, 5);
  const cleanDesc = (car.description || "").replace(/\[성능점검데이터\][\s\S]*/, "").trim();
  const REPORT_CATS = ["허위 가격","허위 사고이력","허위 주행거리","존재하지 않는 매물","사진 불일치","판매 완료된 매물","기타"];
  const TABS = [{ id: "basic", label: "기본정보" },{ id: "options", label: "옵션정보" },{ id: "condition", label: "차량상태" },{ id: "warranty", label: "보증현황" },{ id: "seller", label: "판매자 정보" }];

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} textarea:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "20px 24px 100px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Link href="/cars" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#888" }}><ChevronLeft size={14} />매물 목록</Link>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#AAA" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={13} /> 조회수 {(car.views || 0).toLocaleString()}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Heart size={13} /> 찜 {favCount}</span>
            </div>
          </div>

          {/* ═══ 사진 갤러리 (엔카 비율) ═══ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 4, marginBottom: 12, borderRadius: 16, overflow: "hidden", height: 560 }}>
            <div style={{ position: "relative", background: "#E8E6E1", cursor: "pointer", overflow: "hidden" }} onClick={() => setShowAllPhotos(true)}>
              {images[mainImg] ? (() => { const p = parseImg(images[mainImg]); return <img src={p.url} alt={car.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos, display: "block" }} />; })() : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, opacity: 0.2 }}>🚗</div>}
              {images.length > 1 && <>
                <button onClick={e => { e.stopPropagation(); goImg(-1); }} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.45)", color: "white", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                <button onClick={e => { e.stopPropagation(); goImg(1); }} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.45)", color: "white", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
              </>}
              {car.inspected && <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 5, background: "rgba(45,138,82,0.9)", borderRadius: 100, padding: "6px 12px" }}><Award size={13} color="white" /><span style={{ fontSize: 11, fontWeight: 800, color: "white" }}>FIXCAR 검수 완료</span></div>}
              <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.5)", color: "white", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 100 }}>{mainImg + 1} / {images.length}</div>
              {images.length > 1 && <button onClick={e => { e.stopPropagation(); setShowAllPhotos(true); }} style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: 100, padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}><ImageIcon size={12} /> 사진 모두보기</button>}
            </div>
            {/* 오른쪽 사이드 사진 (3장 고정) */}
            <div style={{ display: "grid", gridTemplateRows: "repeat(3,1fr)", gap: 4 }}>
              {[0, 1, 2].map(i => {
                const img = images[i + 1];
                const isLast = i === 2 && images.length > 4;
                return (
                  <div key={i} onClick={() => img ? setMainImg(i + 1) : undefined} style={{ overflow: "hidden", cursor: img ? "pointer" : "default", position: "relative", background: "#E8E6E1", minHeight: 0 }}>
                    {img ? (() => { const p = parseImg(img); return <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos, display: "block" }} />; })() : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.15, fontSize: 20 }}>📷</div>}
                    {isLast && <div onClick={e => { e.stopPropagation(); setShowAllPhotos(true); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", cursor: "pointer" }}><span style={{ fontSize: 13, fontWeight: 700 }}>+ 사진 모두보기</span></div>}
                  </div>
                );
              })}
            </div>
          </div>
          {images.length > 1 && <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 8, paddingBottom: 4 }}>
            {images.map((img: string, i: number) => <button key={i} onClick={() => setMainImg(i)} style={{ width: 64, height: 48, borderRadius: 8, overflow: "hidden", border: i === mainImg ? "3px solid #FF3B1E" : "2px solid transparent", cursor: "pointer", flexShrink: 0, padding: 0, background: "none" }}><img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></button>)}
          </div>}
          <div style={{ fontSize: 10, color: "#BBB", textAlign: "right", marginBottom: 16 }}>* 본 매물의 사진은 실제 차량을 촬영한 것이며, AI 보정이 적용되었을 수 있습니다.</div>

          {/* 풀스크린 모달 */}
          {showAllPhotos && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} onClick={() => setShowAllPhotos(false)}>
            <button onClick={() => setShowAllPhotos(false)} style={{ position: "absolute", top: 20, right: 20, width: 44, height: 44, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.15)", color: "white", fontSize: 24, cursor: "pointer" }}>✕</button>
            <img src={images[mainImg]} alt="" style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 12 }} onClick={e => e.stopPropagation()} />
            <div style={{ display: "flex", gap: 6, marginTop: 16, overflowX: "auto", maxWidth: "90vw" }} onClick={e => e.stopPropagation()}>
              {images.map((img: string, i: number) => <button key={i} onClick={() => setMainImg(i)} style={{ width: 56, height: 42, borderRadius: 6, overflow: "hidden", border: i === mainImg ? "2px solid white" : "2px solid transparent", cursor: "pointer", flexShrink: 0, padding: 0, background: "none", opacity: i === mainImg ? 1 : 0.5 }}><img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></button>)}
            </div>
            {images.length > 1 && <>
              <button onClick={e => { e.stopPropagation(); goImg(-1); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 50, height: 50, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.15)", color: "white", fontSize: 24, cursor: "pointer" }}>‹</button>
              <button onClick={e => { e.stopPropagation(); goImg(1); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 50, height: 50, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.15)", color: "white", fontSize: 24, cursor: "pointer" }}>›</button>
            </>}
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 10 }}>{mainImg + 1} / {images.length}</div>
          </div>}

          {/* ═══ 2컬럼 레이아웃 ═══ */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
            {/* ── 왼쪽: 탭 구조 ── */}
            <div>
              <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                {tags.map((t: string) => <span key={t} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "#FFF0ED", color: "#FF3B1E" }}>{t}</span>)}
                {!car.accident && <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "#EAF6EF", color: "#2D8A52" }}>무사고</span>}
                {car.inspected && <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "#F0FAF4", color: "#2D8A52", display: "flex", alignItems: "center", gap: 3 }}><Award size={10} />검수완료</span>}
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, lineHeight: 1.3 }}>{car.name}</h1>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>{car.year}년식 · {car.mileage?.toLocaleString()}km · {car.fuel} · {car.transmission}</div>

              {/* 탭 네비 */}
              <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #E8E6E1", marginBottom: 0, position: "sticky", top: 0, background: "#F0EEE9", zIndex: 5, paddingTop: 4 }}>
                {TABS.map(t => <button key={t.id} onClick={() => setDetailTab(t.id)} style={{ padding: "14px 20px", border: "none", background: detailTab === t.id ? "white" : "transparent", fontSize: 14, fontWeight: detailTab === t.id ? 800 : 600, color: detailTab === t.id ? "#FF3B1E" : "#888", borderBottom: detailTab === t.id ? "3px solid #FF3B1E" : "3px solid transparent", borderTop: detailTab === t.id ? "1px solid #E8E6E1" : "1px solid transparent", borderLeft: detailTab === t.id ? "1px solid #E8E6E1" : "1px solid transparent", borderRight: detailTab === t.id ? "1px solid #E8E6E1" : "1px solid transparent", borderRadius: detailTab === t.id ? "8px 8px 0 0" : 0, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif", marginBottom: -2, transition: "all 0.15s" }}>{t.label}</button>)}
              </div>

              {/* 기본정보 */}
              {detailTab === "basic" && <div style={{ paddingTop: 20 }}>
                <div style={{ background: "white", borderRadius: 18, padding: 20, marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>📋 기본 정보</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                    {[{ l: "연식", v: `${car.year}년` }, { l: "주행거리", v: `${car.mileage?.toLocaleString()}km` }, { l: "연료", v: car.fuel }, { l: "변속기", v: car.transmission }, { l: "색상", v: car.color }, { l: "소유자", v: `${car.owners || 1}인` }, { l: "배기량", v: car.cc ? `${car.cc.toLocaleString()}cc` : "전기" }, { l: "지역", v: car.region }, { l: "사고이력", v: car.accident ? "있음" : "없음 (무사고)" }, { l: "검수여부", v: car.inspected ? "FIXCAR 검수 완료" : "미검수" }].map(s => (
                      <div key={s.l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid #F0EEE9" }}>
                        <span style={{ fontSize: 13, color: "#888" }}>{s.l}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: s.l === "사고이력" ? (car.accident ? "#E24B4A" : "#2D8A52") : "#1A1A1A" }}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {cleanDesc && <div style={{ background: "white", borderRadius: 18, padding: 20, marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>📝 딜러 설명</div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{cleanDesc}</p>
                </div>}
              </div>}

              {/* 옵션정보 */}
              {detailTab === "options" && <div style={{ paddingTop: 20 }}>
                <div style={{ background: "white", borderRadius: 18, padding: 20, marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>⚙️ 옵션 정보</div>
                  {options.length > 0 ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 8 }}>
                    {options.map((o: string) => <div key={o} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", background: "#F8F7F4", borderRadius: 10, fontSize: 12, fontWeight: 600 }}><Check size={12} color="#2D8A52" />{o}</div>)}
                  </div> : <div style={{ textAlign: "center", padding: 40, color: "#CCC" }}>등록된 옵션 정보가 없습니다</div>}
                  {options.length > 0 && <div style={{ fontSize: 12, color: "#AAA", marginTop: 12 }}>총 {options.length}개 옵션</div>}
                </div>
              </div>}

              {/* 차량상태 */}
              {detailTab === "condition" && <div style={{ paddingTop: 20 }}>
                <div style={{ background: "white", borderRadius: 18, padding: 20, marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{car.inspected ? "🔧 성능점검을 등록한 차량이에요" : "📋 성능점검 미등록"}</div>
                  {car.inspected ? <>
                    <div style={{ fontSize: 12, color: "#AAA", marginBottom: 16 }}>자동차관리법 제58조에 따른 성능·상태 점검 정보</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, background: "#F8F7F4", borderRadius: 12, overflow: "hidden" }}>
                      {[{ l: "교환", v: "없음" }, { l: "판금", v: "없음" }, { l: "부식", v: "없음" }, { l: "사고이력", v: car.accident ? "있음" : "없음" }].map(s => (
                        <div key={s.l} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #EEEDE9" }}>
                          <span style={{ fontSize: 13, color: "#888" }}>{s.l}</span><span style={{ fontSize: 13, fontWeight: 700 }}>{s.v}</span>
                        </div>
                      ))}
                    </div>
                  </> : <div style={{ color: "#AAA", fontSize: 13, marginTop: 12 }}>딜러에게 문의하시면 성능점검 기록부를 확인할 수 있어요</div>}
                </div>
                <div style={{ background: "white", borderRadius: 18, padding: 20, marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>🚗 차량이력</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                    {[{ l: "내차 피해", v: car.accident ? "있음" : "없음" }, { l: "타차 가해", v: "없음" }, { l: "특이 사항", v: "없음" }].map(s => (
                      <div key={s.l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid #F0EEE9" }}>
                        <span style={{ fontSize: 13, color: "#888" }}>{s.l}</span><span style={{ fontSize: 13, fontWeight: 700 }}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>}

              {/* 보증현황 */}
              {detailTab === "warranty" && <div style={{ paddingTop: 20 }}>
                <div style={{ background: "white", borderRadius: 18, padding: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>🛡️ 보증 현황</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                    {[{ l: "일반/차체", v: "-" }, { l: "엔진/미션", v: "-" }, { l: "배출가스", v: "-" }, { l: "전기/하이브리드", v: (car.fuel === "전기" || car.fuel === "하이브리드") ? "해당" : "-" }].map(s => (
                      <div key={s.l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid #F0EEE9" }}>
                        <span style={{ fontSize: 13, color: "#888" }}>{s.l}</span><span style={{ fontSize: 13, fontWeight: 700 }}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "#AAA", marginTop: 12, lineHeight: 1.6 }}>* 보증 잔여 기간은 딜러에게 직접 확인해주세요.</div>
                </div>
              </div>}

              {/* 판매자 정보 */}
              {detailTab === "seller" && <div style={{ paddingTop: 20 }}>
                {dealer ? <div style={{ background: "white", borderRadius: 18, padding: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>🏪 판매자 정보</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #F0EEE9" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: isVerified ? "linear-gradient(135deg,#0055FF,#003399)" : "#E8E6E1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: isVerified ? "white" : "#888" }}>{(dealer.shopName || "D")[0]}</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18, fontWeight: 800 }}>{dealer.shopName}</span>
                        {isVerified && <span style={{ fontSize: 10, fontWeight: 800, background: "#EAF6EF", color: "#2D8A52", padding: "2px 8px", borderRadius: 100 }}>매매</span>}
                      </div>
                      <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 12, color: "#888" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Star size={11} color="#E8A020" />{dealer.rating?.toFixed(1) || "0.0"}</span>
                        <span>거래 {dealer.dealCount || 0}건</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/shops/${dealer.id}`}><button style={{ width: "100%", padding: 14, background: "white", border: "1.5px solid #E0DDD7", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>판매자 상세 보기 →</button></Link>
                </div> : <div style={{ background: "white", borderRadius: 18, padding: 40, textAlign: "center", color: "#CCC" }}>판매자 정보 없음</div>}
              </div>}
            </div>

            {/* ── 오른쪽: 가격 + 딜러 + 버튼 (sticky) ── */}
            <div>
              <div style={{ background: "white", borderRadius: 18, padding: 24, position: "sticky", top: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "#FF3B1E", marginBottom: 4 }}>FIX 정찰가</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#1A1A1A" }}>{car.price?.toLocaleString()}<span style={{ fontSize: 16, color: "#AAA", fontWeight: 600 }}>만원</span></div>
                <div style={{ fontSize: 12, color: "#AAA", marginTop: 4, marginBottom: 20 }}>월 {Math.round(car.price * 0.7 / 36)}만원 (36개월 할부 기준)</div>

                {dealer && <Link href={`/shops/${dealer.id}`}>
                  <div style={{ background: "#FAFAFA", borderRadius: 14, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", border: "1px solid #E8E6E1" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: isVerified ? "linear-gradient(135deg,#0055FF,#003399)" : "#E8E6E1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: isVerified ? "white" : "#888", flexShrink: 0 }}>{(dealer.shopName || "D")[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14, fontWeight: 800 }}>{dealer.shopName}</span>{isVerified && <Shield size={12} color="#2D8A52" />}</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 3, fontSize: 11, color: "#AAA" }}><span style={{ display: "flex", alignItems: "center", gap: 3 }}><Star size={9} color="#E8A020" />{dealer.rating?.toFixed(1) || "0.0"}</span><span>거래 {dealer.dealCount || 0}건</span></div>
                    </div>
                    <ChevronRight size={14} color="#CCC" />
                  </div>
                </Link>}

                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <button onClick={toggleFav} style={{ flex: 1, padding: 14, background: isFav ? "#FFF0ED" : "white", border: isFav ? "2px solid #FF3B1E" : "1.5px solid #E0DDD7", borderRadius: 14, fontSize: 14, fontWeight: 800, color: isFav ? "#FF3B1E" : "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "'NanumSquareRound',sans-serif" }}><Heart size={16} fill={isFav ? "#FF3B1E" : "none"} />{isFav ? "찜 완료" : "찜하기"}</button>
                  <button onClick={() => setShowInquiry(!showInquiry)} style={{ flex: 1, padding: 14, background: "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "'NanumSquareRound',sans-serif" }}><MessageSquare size={16} />문의하기</button>
                </div>
                <button onClick={() => setShowReport(!showReport)} style={{ width: "100%", padding: 10, background: "transparent", border: "1px solid #E0DDD7", borderRadius: 10, fontSize: 11, fontWeight: 600, color: "#AAA", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "'NanumSquareRound',sans-serif" }}><AlertTriangle size={12} /> 허위매물 신고</button>

                <div style={{ marginTop: 12 }}>
                  <ShareButtons title={`${car.brand} ${car.name} ${car.price?.toLocaleString()}만원`} description={`${car.year}년 · ${car.mileage?.toLocaleString()}km · ${car.fuel}`} imageUrl={images[0]} />
                </div>

                {/* 카히스토리 */}
                <div style={{ background: "linear-gradient(135deg,#1B3A5C 0%,#0D2240 100%)", borderRadius: 14, padding: "16px 18px", marginTop: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}><Shield size={15} color="#4FC3F7" /><span style={{ fontSize: 13, fontWeight: 800, color: "white" }}>이 차량의 사고이력 확인하기</span></div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 10 }}>자동차365에서 차량번호로 사고이력, 침수이력, 압류/저당 등을 무료 조회</p>
                  <a href="https://www.car365.go.kr/web/contents/totalhistory.do" target="_blank" rel="noopener noreferrer">
                    <button style={{ width: "100%", padding: 11, background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>🔍 자동차365 무료 조회 <ExternalLink size={11} /></button>
                  </a>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 6, textAlign: "center" }}>국토교통부 · 한국교통안전공단</div>
                </div>
              </div>
            </div>
          </div>

          {/* 문의 폼 */}
          {showInquiry && <div style={{ background: "white", borderRadius: 20, padding: 24, marginTop: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>💬 딜러에게 문의하기</h3>
            <textarea rows={4} value={inquiryMsg} onChange={e => setInquiryMsg(e.target.value)} placeholder="궁금한 점을 자유롭게 작성해주세요" maxLength={2000} style={{ width: "100%", padding: "14px 16px", border: "1.5px solid #E0DDD7", borderRadius: 12, fontSize: 14, fontFamily: "'NanumSquareRound',sans-serif", resize: "none", lineHeight: 1.8 }} />
            <button onClick={sendInquiry} disabled={sending} style={{ width: "100%", padding: 16, background: sending ? "#CCC" : "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: sending ? "wait" : "pointer", marginTop: 12, fontFamily: "'NanumSquareRound',sans-serif" }}>{sending ? "전송 중..." : "문의 보내기"}</button>
          </div>}

          {/* 허위매물 신고 */}
          {showReport && <div style={{ background: "#FFF8F6", borderRadius: 20, padding: 24, marginTop: 20, border: "1px solid #FFD6CC" }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}><AlertTriangle size={20} color="#FF3B1E" /> 허위매물 신고</h3>
            <p style={{ fontSize: 12, color: "#AAA", marginBottom: 16 }}>허위 매물 의심 시 신고해주세요. 관리자 확인 후 조치합니다.</p>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>신고 사유 *</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {REPORT_CATS.map(cat => <label key={cat} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", padding: "10px 14px", borderRadius: 10, border: reportCategory === cat ? "2px solid #FF3B1E" : "1px solid #E8E5E0", background: reportCategory === cat ? "#FFF0ED" : "white" }}><input type="radio" checked={reportCategory === cat} onChange={() => setReportCategory(cat)} style={{ accentColor: "#FF3B1E" }} /><span style={{ fontWeight: reportCategory === cat ? 700 : 400, color: reportCategory === cat ? "#FF3B1E" : "#555" }}>{cat}</span></label>)}
              </div>
            </div>
            <textarea rows={3} value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="상세 내용 (선택)" maxLength={1000} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0DDD7", borderRadius: 10, fontSize: 13, fontFamily: "'NanumSquareRound',sans-serif", resize: "none", marginBottom: 14 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowReport(false)} style={{ flex: 1, padding: 14, background: "white", border: "1px solid #E0DDD7", borderRadius: 12, fontSize: 14, fontWeight: 700, color: "#888", cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>취소</button>
              <button onClick={sendReport} disabled={reportSending} style={{ flex: 1, padding: 14, background: reportSending ? "#CCC" : "#FF3B1E", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: reportSending ? "wait" : "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>{reportSending ? "접수 중..." : "신고 접수"}</button>
            </div>
          </div>}

          <SimilarCars carId={String(car.id)} brand={car.brand} price={car.price} fuel={car.fuel} />

          {/* ═══ 모델 리뷰 ═══ */}
          <div style={{ background: "white", borderRadius: 20, padding: "28px 24px", marginTop: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>모델 리뷰</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20 }}>{car.brand} {car.name}<br/><span style={{ color: "#888", fontWeight: 400, fontSize: 13 }}>이런게 걱정되세요?</span></div>
            {[
              { q: `${car.name}${car.fuel === "전기" ? " 충전 인프라는 충분한가요?" : " 연비가 좋은 편인가요?"}`, a: car.fuel === "전기" ? "전기차 충전 인프라는 매년 빠르게 확충되고 있습니다. 고속도로 휴게소와 대형마트 등에 급속 충전기가 설치되어 있어 장거리 주행도 문제 없습니다. 자택 충전기 설치 시 월 전기요금은 2~3만원 수준입니다." : `${car.name}의 실연비는 도심 기준 약 10~14km/L 수준입니다. 운전 습관과 도로 상황에 따라 차이가 있으며, 고속도로에서는 더 좋은 연비를 기대할 수 있습니다.` },
              { q: `중고 ${car.name} 승차감은 어떤가요?`, a: `${car.brand}의 서스펜션 세팅은 안정감과 편안함의 균형이 좋다는 평가가 많습니다. 중고차 구매 시에는 서스펜션 부싱, 쇼바 상태를 반드시 확인하시는 것이 좋습니다.` },
              { q: `중고로 구매하면 혜택을 어떻게 받나요?`, a: car.fuel === "전기" ? "중고 전기차 구매 시에도 취득세 감면 혜택이 적용됩니다. 다만 보조금은 신차에만 지급되므로, 그만큼 중고 가격이 저렴하게 형성됩니다. 충전 카드 할인 등 운영 혜택은 동일하게 이용 가능합니다." : "중고차 구매 시 취등록세는 차량 가격의 약 7% 수준입니다. 경차는 취등록세 감면, 하이브리드는 일부 세금 혜택이 있습니다. 딜러에게 정확한 이전 비용을 문의하세요." },
              { q: `${car.fuel === "전기" ? "배터리 수명이 걱정돼요" : "유지비가 많이 드나요?"}`, a: car.fuel === "전기" ? "전기차 배터리는 보통 16만km 또는 10년 보증을 제공합니다. SOH(배터리 건강도)를 확인하면 잔여 수명을 알 수 있습니다. 구매 전 SOH 리포트를 요청하세요." : `정기 점검(엔진오일, 필터류)은 1만km마다 약 10~15만원 수준입니다. 타이어, 브레이크 패드 등 소모품은 주행 상황에 따라 다릅니다. ${car.mileage && car.mileage > 100000 ? "주행거리가 높으므로 소모품 교체 이력을 반드시 확인하세요." : "주행거리가 적어 당분간 큰 유지비 부담은 없을 것으로 예상됩니다."}` },
            ].map((item, i) => (
              <div key={i} style={{ borderBottom: "1px solid #F0EEE9" }}>
                <button onClick={() => setExpandedGuide(expandedGuide === `review_${i}` ? null : `review_${i}`)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", border: "none", background: "none", cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif", textAlign: "left" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{item.q}</span>
                  <span style={{ fontSize: 18, color: "#CCC", transform: expandedGuide === `review_${i}` ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
                </button>
                {expandedGuide === `review_${i}` && <div style={{ padding: "0 0 16px", fontSize: 13, color: "#666", lineHeight: 1.8 }}>{item.a}</div>}
              </div>
            ))}
          </div>

          {/* ═══ 구매 가이드 ═══ */}
          <div style={{ background: "white", borderRadius: 20, padding: "28px 24px", marginTop: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>구매 가이드</div>
            {[
              { id: "fake", title: "허위매물 대처", content: "허위매물을 피하려면 실매물 인증 마크가 있는 매물을 우선 확인하세요. 시세보다 지나치게 저렴한 매물, 선입금을 요구하는 딜러, 차량 실물 확인 전 계약을 종용하는 경우 의심하세요. 픽스카는 모든 매물을 직접 검수하여 허위매물을 차단합니다." },
              { id: "seizure", title: "압류 및 저당 처리", content: "차량 구매 전 자동차등록원부를 확인하여 압류·저당 여부를 반드시 확인하세요. 저당이 설정된 차량은 금융기관의 동의 없이 소유권 이전이 불가합니다. 잔존 채무가 있다면 매도인이 말소한 후 거래하는 것이 안전합니다. 자동차365에서 무료로 조회할 수 있습니다." },
              { id: "inspect", title: "성능 상태 점검기록부", content: "자동차관리법에 따라 중고차 매매 시 성능·상태 점검기록부를 교부받아야 합니다. 점검기록부에는 주행거리, 사고 이력, 주요 부품 교환 여부 등이 기재됩니다. 교환·판금·도장 이력이 많은 차량은 사고 차량일 수 있으니 주의하세요." },
              { id: "fee", title: "차량 금액 외 별도 수수료", content: "중고차 구매 시 차량 가격 외에 이전등록비(취등록세 약 7%), 매도비(약 2~5만원), 딜러 알선 수수료, 보험료 등이 추가됩니다. 탁송이 필요한 경우 거리에 따라 10~30만원이 발생할 수 있습니다. 견적서를 미리 요청하여 총 비용을 확인하세요." },
              { id: "transfer", title: "차량 이전등록", content: "차량 구매 후 15일 이내에 관할 차량등록사업소에서 이전등록을 완료해야 합니다. 필요 서류: 자동차매도용 인감증명서, 자동차등록증, 보험가입증명서, 신분증. 딜러를 통해 구매할 경우 이전등록 대행이 가능합니다." },
              { id: "check", title: "차량 체크사항", content: "시승 시 확인할 사항: ① 엔진 시동 시 이상 소음·진동 ② 변속기 변속 충격 ③ 브레이크 제동력 ④ 스티어링 직진성 ⑤ 에어컨·히터 작동 ⑥ 전장품(창문, 사이드미러, 시트 조절) ⑦ 타이어 마모도·편마모 ⑧ 하체 누유·부식 ⑨ 실내 악취·담배 냄새 ⑩ 외관 도장 상태·색상 차이" },
            ].map(item => (
              <div key={item.id} style={{ borderBottom: "1px solid #F0EEE9" }}>
                <button onClick={() => setExpandedGuide(expandedGuide === item.id ? null : item.id)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", border: "none", background: "none", cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif", textAlign: "left" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{item.title}</span>
                  <span style={{ fontSize: 18, color: "#CCC", transform: expandedGuide === item.id ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
                </button>
                {expandedGuide === item.id && <div style={{ padding: "0 0 16px", fontSize: 13, color: "#666", lineHeight: 1.8 }}>{item.content}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
