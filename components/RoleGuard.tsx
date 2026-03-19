"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

/**
 * 사용법:
 * <RoleGuard allowedRoles={["ADMIN"]}>
 *   <AdminPageContent />
 * </RoleGuard>
 *
 * <RoleGuard allowedRoles={["DEALER", "ADMIN"]}>
 *   <DealerPageContent />
 * </RoleGuard>
 */
export default function RoleGuard({ allowedRoles, children }: Props) {
  const [status, setStatus] = useState<"loading" | "allowed" | "denied" | "login">("loading");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        if (!d?.user) {
          setStatus("login");
          return;
        }
        const role = d.user.role || "USER";
        if (allowedRoles.includes(role)) {
          setStatus("allowed");
        } else {
          setStatus("denied");
        }
      })
      .catch(() => setStatus("login"));
  }, [allowedRoles]);

  if (status === "loading") {
    return (
      <div style={{
        minHeight: "100vh", background: "#F0EEE9", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'NanumSquareRound',sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#888" }}>권한 확인 중...</div>
        </div>
      </div>
    );
  }

  if (status === "login") {
    return (
      <div style={{
        minHeight: "100vh", background: "#F0EEE9", display: "flex",
        alignItems: "center", justifyContent: "center", padding: 20,
        fontFamily: "'NanumSquareRound',sans-serif",
      }}>
        <div style={{ textAlign: "center", background: "white", borderRadius: 22, padding: "48px 32px", maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>로그인이 필요해요</h2>
          <p style={{ fontSize: 14, color: "#888", fontWeight: 400, marginBottom: 24 }}>이 페이지는 로그인 후 이용할 수 있어요</p>
          <a href="/api/auth/kakao/callback">
            <button style={{ padding: "14px 32px", background: "#FEE500", color: "#3C1E1E", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>🗨️ 카카오 로그인</button>
          </a>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div style={{
        minHeight: "100vh", background: "#F0EEE9", display: "flex",
        alignItems: "center", justifyContent: "center", padding: 20,
        fontFamily: "'NanumSquareRound',sans-serif",
      }}>
        <div style={{ textAlign: "center", background: "white", borderRadius: 22, padding: "48px 32px", maxWidth: 420 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>접근 권한이 없어요</h2>
          <p style={{ fontSize: 14, color: "#888", fontWeight: 400, marginBottom: 8, lineHeight: 1.7 }}>
            이 페이지는 <strong style={{ color: "#FF3B1E" }}>{allowedRoles.join(" / ")}</strong> 전용이에요.
          </p>
          <p style={{ fontSize: 13, color: "#AAA", fontWeight: 400, marginBottom: 24 }}>
            권한이 필요하시면 관리자에게 문의해주세요.
          </p>
          <button onClick={() => router.push("/")} style={{ padding: "14px 32px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'NanumSquareRound',sans-serif" }}>
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
