---
paths:
  - "src/lib/auth.ts"
  - "src/lib/services/auth-service.ts"
  - "src/lib/validations/auth.ts"
  - "src/proxy.ts"
  - "src/app/api/auth/**"
  - "src/app/api/users/**"
  - "src/app/(auth)/**"
---

# 認証ルール

## 技術スタック

Auth.js v5 / Google + Credentials / JWT 戦略

## ファイル構成

| ファイル | 役割 |
|---------|------|
| `src/lib/auth.ts` | Auth.js 設定（プロバイダー・JWT 戦略） |
| `src/lib/services/auth-service.ts` | 登録・認証ロジック |
| `src/lib/validations/auth.ts` | Zod バリデーションスキーマ |
| `src/proxy.ts` | 認証プロキシ（保護ルートのリダイレクト・Node.js ランタイム） |
| `src/app/api/auth/[...nextauth]/route.ts` | Auth.js ルートハンドラー |
| `src/app/api/users/route.ts` | ユーザー登録 API |
| `src/app/(auth)/login/` | ログイン/登録切替ページ + Google OAuth |

## 認証ガード（2 層構造）

### 1. Proxy（`src/proxy.ts`）

Node.js ランタイムで動作（Next.js 16 で middleware.ts は非推奨）。
保護ルートへの未認証アクセスを `/login` にリダイレクトする。
API ルートには 401 を返す。`config.matcher` でパスを制御。

### 2. Layout ガード（`src/app/(app)/layout.tsx`）

Middleware を通過しても、レイアウトで再度 `auth()` を確認する（二重チェック）。

## レイアウトグループ

| グループ | 用途 | 認証 |
|---------|------|------|
| `(app)` | メインページ | 必須（middleware + layout で二重ガード） |
| `(auth)` | ログイン等 | 不要 |
