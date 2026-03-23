# {{PROJECT_NAME}} - プロジェクト指針

## ファイル改善の方針

- 同じミスは 2 度目で仕組みで防ぐ（ルール化 → `.claude/rules/` or `.claude/skills/`）
- CLAUDE.md のセクションが肥大化したら `.claude/rules/` や `.claude/skills/` に分離する

## ローカル開発の起動手順

```bash
# 1. 環境変数を準備（初回のみ）
cp .env.sample .env  # 必要に応じて値を編集

# 2. 依存パッケージをインストール（初回 or 更新時）
npm install

# 3. Docker で PostgreSQL を起動
docker compose up -d

# 4. DB マイグレーション & シード（初回 or スキーマ変更時）
npx prisma migrate dev
npx prisma db seed

# 5. dev サーバーを起動
npm run dev
```

**前提**: Docker Desktop（または互換ランタイム）がインストール済みであること。

## プロダクト概要

{{PROJECT_DESCRIPTION}}

## 開発フロー

### 仕様駆動開発（spec-first）

`docs/specs/` が最上位の真実（single source of truth）。

**権威構造**:
spec → openapi → prisma → 実装コード

1. 機能仕様を `docs/specs/` に書く
2. API 設計を `docs/openapi.yaml` に反映
3. DB スキーマを `prisma/schema.prisma` に反映
4. 実装コードを書く

### テスト駆動開発（TDD）

`/tdd` スキルを実行してから実装を開始する。

## 技術スタック

| レイヤー       | 技術                                   |
| -------------- | -------------------------------------- |
| フレームワーク | Next.js (App Router) / Vercel          |
| 言語           | TypeScript 5 (strict)                  |
| スタイル       | Tailwind CSS v4 / shadcn/ui v4         |
| UI             | Base UI / Framer Motion / Recharts     |
| フォーム       | React Hook Form + Zod                  |
| データ取得     | SWR                                    |
| ユーティリティ | date-fns / nuqs / Sonner / next-themes |
| 環境変数       | @t3-oss/env-nextjs                     |
| ORM / DB       | Prisma v7 + PostgreSQL (Neon)          |
| 認証           | Auth.js v5 (next-auth)                 |
| テスト         | Vitest + Testing Library + MSW         |
| リンター       | ESLint 9 (flat config) + Prettier      |

詳細は `docs/tech-stack.md` を参照。

## 認証

- 設定: `src/lib/auth.ts`（Auth.js v5 / Google + Credentials / JWT 戦略）
- サービス: `src/lib/auth-service.ts`（登録・認証ロジック）
- バリデーション: `src/lib/validations/auth.ts`（Zod スキーマ）
- API: `src/app/api/auth/[...nextauth]/route.ts` / `src/app/api/users/route.ts`
- ページ: `src/app/(auth)/login/`（ログイン/登録切替 + Google OAuth）
- 認証ガード: `src/app/(app)/layout.tsx` で未認証ユーザーを `/login` にリダイレクト

## API パターン

### createHandler（推奨）

ルートハンドラーは `createHandler()` ビルダーで宣言的に定義する。
詳細は `.claude/rules/api.md` を参照。

```typescript
import { createHandler } from "@/lib/api/handler";
import { container } from "@/lib/api/container";

export const GET = createHandler()
  .withAuth()
  .withQuery(schema)
  .handle(async ({ userId, query }) => {
    return container.items.getByUserId(userId);
  });
```

### サービス層 + DI コンテナ

- サービス: `src/lib/services/{domain}-service.ts` — PrismaClient を DI で受け取る
- コンテナ: `src/lib/api/container.ts` — サービスの生成と依存注入を一元管理
- ルートハンドラーは `container.{service}.{method}()` 経由でサービスを呼ぶ

### レガシーユーティリティ

- サーバー側: `src/lib/api-utils.ts`
  - `AppError` — ステータスコード付きカスタムエラー
  - `getSessionUserId()` — セッションからユーザーID取得
  - `handleError()` — エラーを NextResponse に変換
  - `parseBody()` — リクエストボディの Zod バリデーション
- クライアント側: `src/lib/client/api.ts`
  - `ApiError` / `post()` / `put()` / `patch()` / `del()`
- SWR フェッチャー: `src/lib/fetcher.ts`（401 時は自動で `/login` にリダイレクト）
- フォーム送信: `src/lib/hooks/form-utils.ts`（`submitForm()` で toast + エラー処理を統一）

## レイアウトグループ

- `(app)` — 認証必須ページ（layout.tsx で認証ガード）
- `(auth)` — 未認証ユーザー向けページ（ログイン等）

## Prisma・DB 運用

`.claude/rules/prisma.md` を参照。
DB 操作は `/db-migrate` スキルを参照。

## コーディング規約

### テスト

- 実行: `npx vitest run`（全体）/ `npx vitest run <path>`（個別）
- 配置: 対象モジュールの隣に `__tests__/` ディレクトリ
  - 例: `src/lib/utils.ts` → `src/lib/__tests__/utils.test.ts`
- MSW: `src/mocks/server.ts` でモック定義
- SWR テスト: `SWRTestProvider`（`src/lib/test-utils.tsx`）でキャッシュ分離

### コードスタイル

- Prettier: ダブルクォート、セミコロン有、trailing comma es5、printWidth 100
- 型変換: マッパー関数を `lib/` に集約
- DB 依存分離: DB 依存関数と非依存関数を分離
