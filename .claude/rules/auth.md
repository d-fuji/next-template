---
paths:
  - "src/lib/auth.ts"
  - "src/lib/auth-service.ts"
  - "src/lib/validations/auth.ts"
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
| `src/lib/auth-service.ts` | 登録・認証ロジック |
| `src/lib/validations/auth.ts` | Zod バリデーションスキーマ |
| `src/app/api/auth/[...nextauth]/route.ts` | Auth.js ルートハンドラー |
| `src/app/api/users/route.ts` | ユーザー登録 API |
| `src/app/(auth)/login/` | ログイン/登録切替ページ + Google OAuth |

## レイアウトグループと認証ガード

| グループ | 用途 | 認証 |
|---------|------|------|
| `(app)` | メインページ | 必須（`layout.tsx` でガード → `/login` にリダイレクト） |
| `(auth)` | ログイン等 | 不要 |
