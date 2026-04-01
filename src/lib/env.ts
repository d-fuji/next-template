import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * 環境変数の型安全なバリデーション
 *
 * サーバー / クライアントの環境変数をここで一元管理する。
 * 未定義の必須変数がある場合、ビルド時にエラーになる。
 *
 * @example
 * import { env } from "@/lib/env";
 * const url = env.DATABASE_URL;
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(1),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },
  client: {
    // NEXT_PUBLIC_* の環境変数をここに追加
    // NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    // NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  // テスト環境ではスキップ
  skipValidation: process.env.NODE_ENV === "test",
});
