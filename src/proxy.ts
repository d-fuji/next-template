import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * 認証プロキシ（Node.js ランタイム）
 *
 * Next.js 16 で middleware.ts は非推奨。proxy.ts を使う。
 * proxy は Node.js ランタイムのため、Prisma を含む full auth が使用可能。
 * （Edge Runtime が必要な場合は middleware.ts のまま維持し authConfig を使うこと）
 *
 * 保護ルートへの未認証アクセスを /login にリダイレクトし、
 * 保護 API には 401 を返す。
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth?.user;

  // 保護 API: 401 を返す（fetcher が /login にリダイレクト）
  if (pathname.startsWith("/api/")) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "未認証" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // 保護ページ: 未認証なら /login にリダイレクト
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // 認証必須ページ
    "/dashboard/:path*",
    // 認証必須 API（/api/users は登録エンドポイントのため除外）
    "/api/todos/:path*",
  ],
};
