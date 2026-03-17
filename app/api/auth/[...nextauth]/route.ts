import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "dummy",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "kakao") {
        try {
          await prisma.user.upsert({
            where: { email: user.email! },
            update: { name: user.name || "카카오 사용자" },
            create: {
              email: user.email!,
              name: user.name || "카카오 사용자",
              provider: "kakao",
            },
          });
        } catch (error) {
          console.error("SignIn Error:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          (session.user as { id?: number; role?: string }).id = dbUser.id;
          (session.user as { id?: number; role?: string }).role = dbUser.role;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
