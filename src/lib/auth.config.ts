import type { NextAuthConfig } from "next-auth";

/**
 * Edge Runtime 互換の Auth.js 設定
 *
 * Middleware（Edge Runtime）は Node.js ネイティブモジュールを使えないため、
 * Prisma Adapter・providers を含まない最小設定を分離する。
 *
 * Middleware ではこちらを使い、フル設定は auth.ts で管理する。
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
