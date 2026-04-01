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
  const [showReport, setShowReport] = useState(false);
  const [reportCategory, setReportCategory] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportSending, setReportSending] = useState(false);

  useEffect(() => {
    fetch(`/api/cars/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) { setCar(d.data); saveRecentCar(d.data); setFavCount(d.data._count?.favorites || d.data.favCount || 0); }
        else if (d.id) { setCar(d); saveRecentCar(d); setFavCount(d._count?.favorites || d.favCount || 0); }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => { if (d?.user?.id) setUserId(d.user.id); })
      .catch(() => {});

    fetch("/api/favorites/list")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d) && d.some((f: any) => String(f.carId) === String(id)))
          setIsFav(true);
      })
      .catch(() => {});
  }, [id]);

  const toggleFav = async () => {
    if (!userId) { alert("로그인이 필요해요!"); return; }
    if (isFav) {
      await fetch("/api/favorites", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ carId: Number(id) }) });
      setIsFav(false); setFavCount(p => Math.max(0, p - 1));
    } else {
      await fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ carId: Number(id) }) });
      setIsFav(true); setFavCount(p => p + 1);
    }
  };

  const sendInquiry = async () => {
    if (!userId) { alert("로그인이 필요해요!"); return; }
    if (!inquiryMsg.trim()) { alert("문의 내용을 입력해주세요"); return; }
    setSending(true);
    try {
      const res = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ carId: Number(id), message: inquiryMsg }) });
      const data = await res.json();
      if (data.success) { alert("문의가 접수되었습니다! 딜러가 곧 답변드릴게요."); setShowInquiry(false); setInquiryMsg(""); }
      else alert(data.error || "문의 실패");
    } catch { alert("네트워크 오류"); }
    setSending(false);
  };

  const sendReport = async () => {
    if (!userId) { alert("로그인이 필요해요!"); return; }
    if (!reportCategory) { alert("신고 사유를 선택해주세요"); return; }
    setReportSending(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "허위매물신고", carId: Number(id), category: reportCategory, message: `[허위매물 신고] 매물 #${id}\n사유: ${reportCategory}\n상세: ${reportReason || "없음"}` }) });
      if (res.ok) { alert("신고가 접수되었습니다. 관리자가 확인 후 조치하겠습니다."); setShowReport(false); setReportCategory(""); setReportReason(""); }
      else alert("신고 접수 실패. 다시 시도해주세요.");
    } catch { alert("네트워크 오류"); }
    setReportSending(false);
  };

  const goImg = (dir: number) => {
    const imgs = car?.images || [];
    if (imgs.length <= 1) return;
    setMainImg(prev => (prev + dir + imgs.length) % imgs.length);
  };

  if (loading) return <><Navbar /><div style={{ textAlign: "center", padding: 100, color: "#CCC" }}>로딩 중...</div></>;
  if (!car) return (
    <><Navbar /><div style={{ textAlign: "center", padding: 100 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🚗</div>
      <h2 style={{ fontSize: 20, fontWeight: 800 }}>매물을 찾을 수 없어요</h2>
      <Link href="/cars" style={{ color: "#FF3B1E", fontWeight: 700, marginTop: 12, display: "inline-block" }}>매물 보러가기 →</Link>
    </div></>
  );

  const images  = car.images  || [];
  const tags    = car.tags    || [];
  const options = car.options || [];
  const dealer  = car.dealer;
  const isVerified = dealer?.verified;
  const sideImgs = images.slice(1, 5);

  const REPORT_CATEGORIES = ["허위 가격 (실제 가격과 다름)","허위 사고이력 (사고차를 무사고로 표기)","허위 주행거리 (계기판 조작 의심)","존재하지 않는 매물","사진과 실제 차량 불일치","이미 판매 완료된 매물","기타"];

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0EEE9;} a{text-decoration:none;color:inherit;} textarea:focus{outline:none;border-color:#FF3B1E!important;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0EEE9" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 16px 100px" }}>
          {/* 상단 네비 + 조회수/찜수 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Link href="/cars" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#888" }}>
              <ChevronLeft size={14} />매물 목록
            </Link>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#AAA" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={13} /> 조회수 {(car.views || 0).toLocaleString()}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Heart size={13} /> 찜 {favCount}</span>
            </div>
          </div>

          {/* ═══ 사진 갤러리 (엔카 스타일) ═══ */}
          <div style={{ display: "grid", gridTemplateColumns: images.length > 1 ? "1fr 160px" : "1fr", gap: 6, marginBottom: 12, borderRadius: 20, overflow: "hidden" }}>
            {/* 메인 사진 (대) */}
            <div style={{ position: "relative", aspectRatio: "4/3", background: "#E8E6E1", cursor: "pointer" }} onClick={() => setShowAllPhotos(true)}>
              {images[mainImg]
                ? <img src={images[mainImg]} alt={car.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, opacity: 0.2 }}>🚗</div>}
              {/* 좌우 화살표 */}
              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); goImg(-1); }} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.4)", color: "white", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>‹</button>
                  <button onClick={(e) => { e.stopPropagation(); goImg(1); }} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.4)", color: "white", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>›</button>
                </>
              )}
              {/* 배지 */}
              {car.inspected && (
                <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 5, background: "rgba(45,138,82,0.9)", borderRadius: 100, padding: "6px 12px", backdropFilter: "blur(4px)" }}>
                  <Award size={13} color="white" /><span style={{ fontSize: 11, fontWeight: 800, color: "white" }}>FIXCAR 검수 완료</span>
                </div>
              )}
              {/* 사진 번호 */}
              <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.5)", color: "white", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 100, backdropFilter: "blur(4px)" }}>
                {mainImg + 1} / {images.length}
              </div>
              {/* 전체사진 보기 */}
              {images.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); setShowAllPhotos(true); }} style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: 100, padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, backdropFilter: "blur(4px)" }}>
                  <ImageIcon size={12} /> 사진 모두보기
                </button>
              )}
            </div>
            {/* 오른쪽 사이드 썸네일 (최대 4장) */}
            {sideImgs.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {sideImgs.map((img: string, i: number) => (
                  <div key={i} onClick={() => setMainImg(i + 1)} style={{ flex: 1, borderRadius: 0, overflow: "hidden", cursor: "pointer", position: "relative", minHeight: 0 }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    {i === sideImgs.length - 1 && images.length > 5 && (
                      <div onClick={(e) => { e.stopPropagation(); setShowAllPhotos(true); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", cursor: "pointer" }}>
                        <ImageIcon size={18} /><span style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>+{images.length - 5}장</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 전체 사진 썸네일 줄 */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
              {images.map((img: string, i: number) => (
                <button key={i} onClick={() => setMainImg(i)} style={{ width: 64, height: 48, borderRadius: 8, overflow: "hidden", border: i === mainImg ? "3px solid #FF3B1E" : "2px solid transparent", cursor: "pointer", flexShrink: 0, padding: 0, background: "none" }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}

          {/* ═══ 사진 풀스크린 모달 ═══ */}
          {showAllPhotos && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} onClick={() => setShowAllPhotos(false)}>
              <button onClick={() => setShowAllPhotos(false)} style={{ position: "absolute", top: 20, right: 20, width: 44, height: 44, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.15)", color: "white", fontSize: 24, cursor: "pointer" }}>✕</button>
              <img src={images[mainImg]} alt="" style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 12 }} onClick={(e) => e.stopPropagation()} />
              <div style={{ display: "flex", gap: 6, marginTop: 16, overflowX: "auto", maxWidth: "90vw" }} onClick={(e) => e.stopPropagation()}>
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setMainImg(i)} style={{ width: 56, height: 42, borderRadius: 6, overflow: "hidden", border: i === mainImg ? "2px solid white" : "2px solid transparent", cursor: "pointer", flexShrink: 0, padding: 0, background: "none", opacity: i === mainImg ? 1 : 0.5 }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
              {/* 풀스크린 화살표 */}
              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); goImg(-1); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 50, height: 50, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.15)", color: "white", fontSize: 24, cursor: "pointer" }}>‹</button>
                  <button onClick={(e) => { e.stopPropagation(); goImg(1); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 50, height: 50, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.15)", color: "white", fontSize: 24, cursor: "pointer" }}>›</button>
                </>
              )}
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 10 }}>{mainImg + 1} / {images.length}</div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
            {/* 왼쪽: 차량 기본정보 */}
            <div>
              <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                {tags.map((t: string) => (
                  <span key={t} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "#FFF0ED", color: "#FF3B1E" }}>{t}</span>
                ))}
                {!car.accident && <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "#EAF6EF", color: "#2D8A52" }}>무사고</span>}
                {car.inspected && <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "#F0FAF4", color: "#2D8A52", display: "flex", alignItems: "center", gap: 3 }}><Award size={10} />검수완료</span>}
              </div>

              <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, lineHeight: 1.3 }}>{car.name}</h1>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
                {car.year}년식 · {car.mileage?.toLocaleString()}km · {car.fuel} · {car.transmission}
              </div>

              <div style={{ background: "white", borderRadius: 18, padding: "20px", marginBottom: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { l: "연식", v: `${car.year}년` },
                    { l: "주행거리", v: `${car.mileage?.toLocaleString()}km` },
                    { l: "연료", v: car.fuel },
                    { l: "변속기", v: car.transmission },
                    { l: "색상", v: car.color },
                    { l: "소유자", v: `${car.owners || 1}인` },
                    { l: "배기량", v: car.cc ? `${car.cc}cc` : "전기" },
                    { l: "지역", v: car.region },
                  ].map((s) => (
                    <div key={s.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F0EEE9" }}>
                      <span style={{ fontSize: 13, color: "#AAA" }}>{s.l}</span>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {car.description && (
                <div style={{ background: "white", borderRadius: 18, padding: "20px", marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>📋 딜러 설명</div>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{car.description.replace(/\[성능점검데이터\][\s\S]*/,"").trim()}</p>
                </div>
              )}

              {options.length > 0 && (
                <div style={{ background: "white", borderRadius: 18, padding: "20px", marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>옵션</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {options.map((o: string) => (
                      <span key={o} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 8, background: "#EEF5FF", color: "#0066FF", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                        <Check size={10} />{o}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 오른쪽: 가격 + 딜러 + 버튼 */}
            <div>
              <div style={{ background: "white", borderRadius: 18, padding: "24px", marginBottom: 16, position: "sticky", top: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "#FF3B1E", marginBottom: 4 }}>FIX 정찰가</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#1A1A1A" }}>
                  {car.price?.toLocaleString()}<span style={{ fontSize: 16, color: "#AAA", fontWeight: 600 }}>만원</span>
                </div>
                <div style={{ fontSize: 12, color: "#AAA", marginTop: 4, marginBottom: 20 }}>월 {Math.round(car.price * 0.7 / 36)}만원 (36개월 할부 기준)</div>

                {dealer && (
                  <Link href={`/shops/${dealer.id}`}>
                    <div style={{ background: "#FAFAFA", borderRadius: 14, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", border: "1px solid #E8E6E1" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: isVerified ? "linear-gradient(135deg,#0055FF,#003399)" : "#E8E6E1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: isVerified ? "white" : "#888", flexShrink: 0 }}>
                        {(dealer.shopName || "D")[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 800 }}>{dealer.shopName}</span>
                          {isVerified && <Shield size={12} color="#2D8A52" />}
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 3, fontSize: 11, color: "#AAA" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Star size={9} color="#E8A020" />{dealer.rating?.toFixed(1) || "0.0"}</span>
                          <span>거래 {dealer.dealCount || 0}건</span>
                        </div>
                      </div>
                      <ChevronRight size={14} color="#CCC" />
                    </div>
                  </Link>
                )}

                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <button onClick={toggleFav} style={{ flex: 1, padding: "14px", background: isFav ? "#FFF0ED" : "white", border: isFav ? "2px solid #FF3B1E" : "1.5px solid #E0DDD7", borderRadius: 14, fontSize: 14, fontWeight: 800, color: isFav ? "#FF3B1E" : "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "'NanumSquareRound',sans-serif" }}>
                    <Heart size={16} fill={isFav ? "#FF3B1E" : "none"} />{isFav ? "찜 완료" : "찜하기"}
                  </button>
                  <button onClick={() => setShowInquiry(!showInquiry)} style={{ flex: 1, padding: "14px", background: "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "'NanumSquareRound',sans-serif" }}>
                    <MessageSquare size={16} />문의하기
                  </button>
                </div>

                <button onClick={() => setShowReport(!showReport)} style={{ width: "100%", padding: "10px", background: "transparent", border: "1px solid #E0DDD7", borderRadius: 10, fontSize: 11, fontWeight: 600, color: "#AAA", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "'NanumSquareRound',sans-serif" }}>
                  <AlertTriangle size={12} /> 허위매물 신고
                </button>

                <div style={{ marginTop: 12 }}>
                  <ShareButtons
                    title={`${car.brand} ${car.name} ${car.price?.toLocaleString()}만원`}
                    description={`${car.year}년 · ${car.mileage?.toLocaleString()}km · ${car.fuel}`}
                    imageUrl={images[0]}
                  />
                </div>

                {/* 카히스토리 사고이력 조회 */}
                <div style={{ background: "linear-gradient(135deg,#1B3A5C 0%,#0D2240 100%)", borderRadius: 14, padding: "16px 18px", marginTop: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <Shield size={15} color="#4FC3F7" />
                    <span style={{ fontSize: 13, fontWeight: 800, color: "white" }}>이 차량의 사고이력 확인하기</span>
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 10 }}>
                    자동차365(카히스토리)에서 차량번호로 사고이력, 침수이력, 압류/저당 등을 무료로 조회할 수 있어요.
                  </p>
                  <a href="https://www.car365.go.kr/web/contents/totalhistory.do" target="_blank" rel="noopener noreferrer">
                    <button style={{ width: "100%", padding: "11px", background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      🔍 자동차365에서 사고이력 무료 조회 <ExternalLink size={11} />
                    </button>
                  </a>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 6, textAlign: "center" }}>국토교통부 · 한국교통안전공단 공식 서비스</div>
                </div>
              </div>
            </div>
          </div>

          {/* 문의 폼 */}
          {showInquiry && (
            <div style={{ background: "white", borderRadius: 20, padding: "24px", marginTop: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>💬 딜러에게 문의하기</h3>
              <textarea rows={4} value={inquiryMsg} onChange={(e) => setInquiryMsg(e.target.value)} placeholder="궁금한 점을 자유롭게 작성해주세요 (차량 상태, 시승 가능 여부, 할부 조건 등)" maxLength={2000} style={{ width: "100%", padding: "14px 16px", border: "1.5px solid #E0DDD7", borderRadius: 12, fontSize: 14, fontFamily: "'NanumSquareRound',sans-serif", resize: "none", lineHeight: 1.8 }} />
              <button onClick={sendInquiry} disabled={sending} style={{ width: "100%", padding: "16px", background: sending ? "#CCC" : "#FF3B1E", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: sending ? "wait" : "pointer", marginTop: 12, fontFamily: "'NanumSquareRound',sans-serif" }}>
                {sending ? "전송 중..." : "문의 보내기"}
              </button>
            </div>
          )}

          {/* 허위매물 신고 폼 */}
          {showReport && (
            <div style={{ background: "#FFF8F6", borderRadius: 20, padding: "24px", marginTop: 20, border: "1px solid #FFD6CC" }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}><AlertTriangle size={20} color="#FF3B1E" /> 허위매물 신고</h3>
              <p style={{ fontSize: 12, color: "#AAA", marginBottom: 16, lineHeight: 1.6 }}>허위 매물이 의심되는 경우 신고해주세요. 관리자가 확인 후 해당 매물 삭제 및 딜러 제재 조치를 합니다.</p>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>신고 사유 선택 *</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {REPORT_CATEGORIES.map((cat) => (
                    <label key={cat} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", padding: "10px 14px", borderRadius: 10, border: reportCategory === cat ? "2px solid #FF3B1E" : "1px solid #E8E5E0", background: reportCategory === cat ? "#FFF0ED" : "white" }}>
                      <input type="radio" checked={reportCategory === cat} onChange={() => setReportCategory(cat)} style={{ accentColor: "#FF3B1E", width: 14, height: 14 }} />
                      <span style={{ fontWeight: reportCategory === cat ? 700 : 400, color: reportCategory === cat ? "#FF3B1E" : "#555" }}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>상세 내용 (선택)</div>
                <textarea rows={3} value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder="구체적인 내용을 작성해주시면 더 빠르게 처리됩니다" maxLength={1000} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E0DDD7", borderRadius: 10, fontSize: 13, fontFamily: "'NanumSquareRound',sans-serif", resize: "none", lineHeight: 1.7 }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setShowReport(false)} style={{ flex: 1, padding: "14px", background: "white", border: "1px solid #E0DDD7", borderRadius: 12, fontSize: 14, fontWeight: 700, color: "#888", cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>취소</button>
                <button onClick={sendReport} disabled={reportSending} style={{ flex: 1, padding: "14px", background: reportSending ? "#CCC" : "#FF3B1E", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: reportSending ? "wait" : "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>{reportSending ? "접수 중..." : "신고 접수하기"}</button>
              </div>
            </div>
          )}

          <SimilarCars carId={String(car.id)} brand={car.brand} price={car.price} fuel={car.fuel} />
        </div>
      </div>
    </>
  );
}
