import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { createHmac, timingSafeEqual } from "crypto";

export interface AuthUser {
  id: number;
  email?: string;
  name?: string;
  role?: string;
}

/**
 * JWT 서명 비밀키
 * - 운영(production): 반드시 NEXTAUTH_SECRET 환경변수 사용 (없으면 인증 전부 거부)
 * - 개발: 환경변수 없으면 로컬 전용 기본값 사용
 */
function getSecret(): string | null {
  const s = process.env.NEXTAUTH_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") {
    console.error("[auth] NEXTAUTH_SECRET 환경변수가 없습니다 — 모든 인증이 거부됩니다");
    return null;
  }
  return "fixcar-local-dev-only-secret";
}

/** 토큰 문자열 → 서명(HS256)·만료 검증 후 payload 추출 */
function decodeToken(token: string): AuthUser | null {
  try {
    const secret = getSecret();
    if (!secret) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;

    /* 1. 알고리즘 고정 (alg:none 등 차단) */
    const header = JSON.parse(Buffer.from(headerB64, "base64url").toString("utf-8"));
    if (header.alg !== "HS256") return null;

    /* 2. 서명 검증 (타이밍 공격 방지 비교) */
    const expected = createHmac("sha256", secret).update(`${headerB64}.${payloadB64}`).digest();
    const actual = Buffer.from(sigB64, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

    /* 3. payload + 만료 확인 */
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
    const id = payload.id || payload.userId || payload.sub;
    if (!id) return null;
    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;

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
 * fixcar-token 쿠키에서 유저 정보 추출 (서명 검증됨)
 */
export function getAuthUser(req: NextRequest): AuthUser | null {
  const token =
    req.cookies.get("fixcar-token")?.value ||
    req.cookies.get("token")?.value ||
    req.cookies.get("auth-token")?.value;
  if (!token) return null;
  return decodeToken(token);
}

/**
 * ★ 기존 호환용 - verifyToken
 * NextRequest 또는 토큰 문자열 둘 다 받음
 */
export function verifyToken(reqOrToken: NextRequest | string): AuthUser | null {
  if (typeof reqOrToken === "string") {
    return decodeToken(reqOrToken);
  }
  return getAuthUser(reqOrToken);
}

/**
 * ★ 기존 호환용 - signToken (JWT 생성)
 */
export async function signToken(payload: Record<string, unknown>): Promise<string> {
  const s = getSecret();
  if (!s) throw new Error("NEXTAUTH_SECRET 환경변수가 설정되지 않았습니다");
  const secret = new TextEncoder().encode(s);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  return token;
}

/**
 * 인증 필수 API 래퍼
 */
export function requireAuth(req: NextRequest): AuthUser | NextResponse {
  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
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
    return NextResponse.json({ error: "관리자 권한이 필요합니다" }, { status: 403 });
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
    return NextResponse.json({ error: "딜러 권한이 필요합니다" }, { status: 403 });
  }
  return result;
}
