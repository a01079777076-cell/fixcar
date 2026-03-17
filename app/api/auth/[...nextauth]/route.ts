import { NextRequest, NextResponse } from "next/server";
import NextAuth, { type NextAuthOptions, type Session } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { prisma } from "@/lib/prisma";

const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "dummy",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        if (user.email) {
          await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name || "카카오 사용자" },
            create: {
              email: user.email,
              name: user.name || "카카오 사용자",
              provider: "kakao",
            },
          });
        }
        return true;
      } catch (error) {
        console.error("SignIn Error:", error);
        return false;
      }
    },
    async session({ session }: { session: Session }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          (session.user as Session["user"] & { id: number; role: string }).id = dbUser.id;
          (session.user as Session["user"] & { id: number; role: string }).role = dbUser.role;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

function toRequest(req: NextRequest) {
  return new Request(req.url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
  });
}

export async function GET(req: NextRequest) {
  const response = await handler(toRequest(req), {
    params: { nextauth: req.nextUrl.pathname.split("/").slice(3) },
  } as never);
  return response as NextResponse;
}

export async function POST(req: NextRequest) {
  const response = await handler(toRequest(req), {
    params: { nextauth: req.nextUrl.pathname.split("/").slice(3) },
  } as never);
  return response as NextResponse;
}
