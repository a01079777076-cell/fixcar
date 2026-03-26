"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, MessageSquare, Plus, Eye, TrendingUp, ChevronRight, Settings, Pencil, Award, Star, Zap, Flame, Shield } from "lucide-react";

/* ── 딜러 뱃지 자동 계산 ── */
interface DealerProfile {
  verified?: boolean;
  soldCount?: number;
  favCount?: number;
  replyRate?: number;
  totalInq?: number;
  createdAt?: string;
  _count?: { cars?: number };
}
interface Badge { icon: React.ReactNode; label: string; color: string; bg: string; desc: string; }

function computeBadges(profile: DealerProfile, activeCars: number): Badge[] {
  const badges: Badge[] = [];
  const daysSince = profile.createdAt
    ? (Date.now() - new Date(profile.createdAt).getTime()) / 86400000
    : 999;

  if (profile.verified) {
    badges.push({ icon: <Shield size={12} />, label: "인증딜러", color: "#2D8A52", bg: "#EAF6EF", desc: "픽스카 공식 인증" });
  }
  if ((profile.soldCount || 0) >= 5) {
    badges.push({ icon: <Award size={12} />, label: "판매왕", color: "#E8A020", bg: "#FFF8E0", desc: `판매완료 ${profile.soldCount}건` });
  }
  if ((profile.totalInq || 0) >= 3 && (profile.replyRate || 0) >= 80) {
    badges.push({ icon: <Zap size={12} />, label: "응답왕", color: "#0066FF", bg: "#EEF5FF", desc: `답변률 ${profile.replyRate}%` });
  }
  if (daysSince <= 60) {
    badges.push({ icon: <Star size={12} />, label: "신규딜러", color: "#FF3B1E", bg: "#FFF0ED", desc: "등록 60일 이내" });
  }
  if (activeCars >= 5) {
    badges.push({ icon: <Flame size={12} />, label: "인기딜러", color: "#FF6B35", bg: "#FFF3EE", desc: `판매중 ${activeCars}대` });
  }
  return badges;
}

export default function DealerDashboard() {
  const router = useRouter();
  const [user,     setUser]     = useState<{ name?: string; role?: string } | null>(null);
  const [cars,     setCars]     = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [profile,  setProfile]  = useState<DealerProfile>({});
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (!d?.user?.id || (d.user.role !== "DEALER" && d.user.role !== "ADMIN")) {
          router.push("/"); return;
        }
        setUser(d.user);
        loadData();
      })
      .catch(() => router.push("/"));
  }, [router]);

  const loadData = async () => {
    try {
      const [cRes, iRes, pRes] = await Promise.all([
        fetch("/api/dealer/cars").then((r) => r.json()).catch(() => []),
        fetch("/api/dealer/inquiries").then((r) => r.json()).catch(() => []),
        fetch("/api/dealer/profile").then((r) => r.json()).catch(() => ({})),
      ]);
      setCars(Array.isArray(cRes) ? cRes : []);
      setInquiries(Array.isArray(iRes) ? iRes : []);
      if (pRes?.data) setProfile(pRes.data);
    } catch {}
    setLoading(false);
  };

  if (loading) return <><Navbar /><div style={{ textAlign: "center", padding: 100, color: "#CCC" }}>로딩 중...</div></>;

  const activeCars   = cars.filter((c) => c.status === "AVAILABLE");
  const reviewingCars = cars.filter((c) => c.status === "REVIEWING");
  const soldCars     = cars.filter((c) => c.status === "SOLD");
  const pendingInq   = inquiries.filter((i: any) => i.status === "PENDING");
  const badges       = computeBadges(profile, activeCars.length);

  return (
    <>
      <style>{`@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css'); *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'NanumSquareRound',sans-serif;background:#F0F4FF;} a{text-decoration:none;color:inherit;}`}</style>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#F0F4FF" }}>
        {/* 헤더 */}
        <div style={{ background: "white", borderBottom: "1px solid #DDEEFF", padding: "20px 24px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>🏪 딜러 대시보드</div>
              <div style={{ fontSize: 13, color: "#888" }}>{user?.name}님, 오늘도 좋은 하루 되세요!</div>
              {/* 뱃지 */}
              {badges.length > 0 && (
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {badges.map((b) => (
                    <div
                      key={b.label}
                      title={b.desc}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        background: b.bg, color: b.color,
                        fontSize: 11, fontWeight: 800,
                        padding: "3px 10px", borderRadius: 100,
                        cursor: "default",
                      }}
                    >
                      {b.icon}{b.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link href="/dealer/cars/new">
              <button style={{ padding: "12px 24px", background: "#0066FF", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>
                <Plus size={16} />매물 등록
              </button>
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 16px 80px" }}>
          {/* 통계 카드 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { icon: Car,          label: "판매 중",   value: activeCars.length,    color: "#0066FF" },
              { icon: Eye,          label: "검수 대기", value: reviewingCars.length,  color: "#E8A020" },
              { icon: MessageSquare,label: "답변 대기", value: pendingInq.length,      color: "#FF3B1E" },
              { icon: TrendingUp,   label: "판매 완료", value: soldCars.length,        color: "#2D8A52" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} style={{ background: "white", borderRadius: 16, padding: "22px 20px" }}>
                  <Icon size={20} color={s.color} style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#AAA" }}>{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* 추가 통계 (프로필 데이터) */}
          {(profile.favCount != null || profile.replyRate != null) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {profile.favCount != null && (
                <div style={{ background: "white", borderRadius: 14, padding: "16px 18px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#FF3B1E" }}>❤️ {profile.favCount}</div>
                  <div style={{ fontSize: 11, color: "#AAA", marginTop: 2 }}>총 찜 수</div>
                </div>
              )}
              {profile.replyRate != null && (
                <div style={{ background: "white", borderRadius: 14, padding: "16px 18px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0066FF" }}>⚡ {profile.replyRate}%</div>
                  <div style={{ fontSize: 11, color: "#AAA", marginTop: 2 }}>답변률</div>
                </div>
              )}
              {profile.soldCount != null && (
                <div style={{ background: "white", borderRadius: 14, padding: "16px 18px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#2D8A52" }}>🏆 {profile.soldCount}</div>
                  <div style={{ fontSize: 11, color: "#AAA", marginTop: 2 }}>누적 판매</div>
                </div>
              )}
            </div>
          )}

          {/* 답변 대기 알림 */}
          {pendingInq.length > 0 && (
            <Link href="/dealer/inquiries">
              <div style={{ background: "#FFF0ED", borderRadius: 16, padding: "18px 22px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #FFB8A8", cursor: "pointer" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#FF3B1E" }}>📨 답변 대기 문의 {pendingInq.length}건</div>
                  <div style={{ fontSize: 12, color: "#CC6633", marginTop: 2 }}>빠른 답변이 계약률을 높여요!</div>
                </div>
                <ChevronRight size={18} color="#FF3B1E" />
              </div>
            </Link>
          )}

          {/* 뱃지 달성 가이드 */}
          {badges.length < 3 && (
            <div style={{ background: "white", borderRadius: 16, padding: "18px 20px", marginBottom: 20, border: "1px dashed #DDEEFF" }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10, color: "#0066FF" }}>🎯 뱃지 달성 가이드</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { icon: "🏆", label: "판매왕", cond: `판매완료 5건 이상 (현재 ${profile.soldCount || 0}건)`, done: (profile.soldCount || 0) >= 5 },
                  { icon: "⚡", label: "응답왕", cond: `문의 답변률 80% 이상 (현재 ${profile.replyRate || 100}%)`, done: (profile.replyRate || 100) >= 80 && (profile.totalInq || 0) >= 3 },
                  { icon: "🔥", label: "인기딜러", cond: `판매중 매물 5개 이상 (현재 ${activeCars.length}개)`, done: activeCars.length >= 5 },
                  { icon: "✅", label: "인증딜러", cond: "픽스카 관리자 인증 필요", done: !!profile.verified },
                ].map((g) => (
                  <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: g.done ? "#EAF6EF" : "#F8F7F4" }}>
                    <span style={{ fontSize: 16 }}>{g.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: g.done ? "#2D8A52" : "#1A1A1A" }}>{g.label} {g.done ? "✓" : ""}</div>
                      <div style={{ fontSize: 10, color: "#AAA" }}>{g.cond}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 내 매물 목록 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>내 매물 ({cars.length})</h2>
            <Link href="/dealer/cars/new" style={{ fontSize: 13, fontWeight: 700, color: "#0066FF" }}>+ 새 매물 등록</Link>
          </div>

          {cars.length === 0 ? (
            <div style={{ background: "white", borderRadius: 18, padding: "60px 24px", textAlign: "center" }}>
              <Car size={40} color="#CCC" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: "#AAA", marginBottom: 6 }}>등록된 매물이 없어요</div>
              <Link href="/dealer/cars/new">
                <button style={{ padding: "12px 24px", background: "#0066FF", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer", marginTop: 8, fontFamily: "'NanumSquareRound',sans-serif" }}>
                  첫 매물 등록하기
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 18, overflow: "hidden" }}>
              {cars.map((car: any, i: number) => (
                <div key={car.id} style={{ padding: "16px 22px", borderBottom: i < cars.length - 1 ? "1px solid #F0F4FF" : "none", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 60, height: 45, borderRadius: 8, background: "#F0F4FF", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {car.images?.[0]
                      ? <img src={car.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontSize: 18 }}>🚗</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{car.brand} {car.name}</div>
                    <div style={{ fontSize: 11, color: "#AAA" }}>
                      {car.year}년 · {car.mileage?.toLocaleString()}km · {car.fuel}
                      {(car.views || 0) > 0 && <span style={{ marginLeft: 6 }}>👁 {car.views}</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0066FF" }}>
                    {car.price?.toLocaleString()}<span style={{ fontSize: 10, color: "#AAA" }}>만</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 100,
                      background: car.status === "AVAILABLE" ? "#EAF6EF" : car.status === "REVIEWING" ? "#FFF8EC" : "#F0EEE9",
                      color:      car.status === "AVAILABLE" ? "#2D8A52" : car.status === "REVIEWING" ? "#E8A020" : "#888",
                    }}>
                      {car.status === "AVAILABLE" ? "판매중" : car.status === "REVIEWING" ? "검수대기" : car.status === "SOLD" ? "완료" : "예약"}
                    </span>
                    {car.status === "REVIEWING" && (
                      <Link href={`/dealer/cars/${car.id}/edit`}>
                        <button style={{ border: "none", background: "#EEF5FF", padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, color: "#0066FF", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "'NanumSquareRound',sans-serif" }}>
                          <Pencil size={10} /> 수정
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 바로가기 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 24 }}>
            {[
              { label: "문의 관리", href: "/dealer/inquiries", icon: MessageSquare, color: "#0066FF" },
              { label: "매물 등록", href: "/dealer/cars/new",  icon: Plus,          color: "#2D8A52"  },
              { label: "설정",      href: "/settings",          icon: Settings,      color: "#888"     },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <Link key={m.label} href={m.href}>
                  <div style={{ background: "white", borderRadius: 14, padding: "18px", textAlign: "center", cursor: "pointer" }}>
                    <Icon size={22} color={m.color} style={{ marginBottom: 6 }} />
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{m.label}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
