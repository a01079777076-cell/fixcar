import { NextRequest, NextResponse } from "next/server";

export interface AuthUser {
  id: number;
  email?: string;
  name?: string;
  role?: string;
}

/**
 * fixcar-token 쿠키에서 유저 정보 추출
 * 인증 필요한 API에서 사용
 */
export function getAuthUser(req: NextRequest): AuthUser | null {
  const token =
    req.cookies.get("fixcar-token")?.value ||
    req.cookies.get("token")?.value ||
    req.cookies.get("auth-token")?.value;

  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );

    const id = payload.id || payload.userId || payload.sub;
    if (!id) return null;

    /* 만료 체크 */
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    return {
      id: Number(id),
      email: payload.email || undefined,
      name: payload.name || undefined,
      role: payload.role || "USER",
    };
  } catch {
    return null;
  }
}

/**
 * 인증 필수 API 래퍼
 * 로그인 안 하면 401 자동 반환
 */
export function requireAuth(req: NextRequest): AuthUser | NextResponse {
  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다" },
      { status: 401 }
    );
  }
  return user;
}

/**
 * 관리자 전용 API 래퍼
 */
export function requireAdmin(req: NextRequest): AuthUser | NextResponse {
  const result = requireAuth(req);
  if (result instanceof NextResponse) return result;
  if (result.role !== "ADMIN") {
    return NextResponse.json(
      { error: "관리자 권한이 필요합니다" },
      { status: 403 }
    );
  }
  return result;
}

/**
 * 딜러 전용 API 래퍼
 */
export function requireDealer(req: NextRequest): AuthUser | NextResponse {
  const result = requireAuth(req);
  if (result instanceof NextResponse) return result;
  if (result.role !== "DEALER" && result.role !== "ADMIN") {
    return NextResponse.json(
      { error: "딜러 권한이 필요합니다" },
      { status: 403 }
    );
  }
  return result;
}
