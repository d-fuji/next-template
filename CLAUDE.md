# {{PROJECT_NAME}} — AI エージェント指針

> セットアップ・npm scripts・ディレクトリ構成は `README.md` を参照。

## 運用方針

- 同じミスは 2 度目で仕組みで防ぐ（ルール化 → `.claude/rules/` or `.claude/skills/`）
- CLAUDE.md が肥大化したら `.claude/rules/` や `.claude/skills/` に分離する

## 開発フロー

### 仕様駆動開発（spec-first）

`docs/specs/` が最上位の真実（single source of truth）。

**権威構造**: spec → openapi → prisma → 実装コード

1. 機能仕様を `docs/specs/` に書く
2. API 設計を `docs/openapi.yaml` に反映
3. DB スキーマを `prisma/schema.prisma` に反映
4. 実装コードを書く

### テスト駆動開発（TDD）

`/tdd` スキルを実行してから実装を開始する。

## アーキテクチャ

### レイアウトグループ

| グループ | 用途 | 認証 |
|---------|------|------|
| `(app)` | メインページ | 必須（`layout.tsx` でガード → `/login` にリダイレクト） |
| `(auth)` | ログイン等 | 不要 |

### 認証

- 設定: `src/lib/auth.ts`（Auth.js v5 / Google + Credentials / JWT 戦略）
- サービス: `src/lib/auth-service.ts`（登録・認証ロジック）
- バリデーション: `src/lib/validations/auth.ts`（Zod スキーマ）
- API: `src/app/api/auth/[...nextauth]/route.ts` / `src/app/api/users/route.ts`
- ページ: `src/app/(auth)/login/`（ログイン/登録切替 + Google OAuth）

### API パターン

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

**サービス層 + DI コンテナ**:
- サービス: `src/lib/services/{domain}-service.ts` — PrismaClient を DI で受け取る
- コンテナ: `src/lib/api/container.ts` — サービスの生成と依存注入を一元管理
- ルートハンドラーは `container.{service}.{method}()` 経由でサービスを呼ぶ

**レガシーユーティリティ**（新規コードでは使わない）:
- サーバー側: `src/lib/api-utils.ts`（`AppError`, `getSessionUserId()`, `handleError()`, `parseBody()`）
- クライアント側: `src/lib/client/api.ts`（`ApiError`, `post()`, `put()`, `patch()`, `del()`）
- SWR フェッチャー: `src/lib/fetcher.ts`（401 時は自動で `/login` にリダイレクト）
- フォーム送信: `src/lib/hooks/form-utils.ts`（`submitForm()` で toast + エラー処理を統一）

### Prisma・DB 運用

`.claude/rules/prisma.md` を参照。DB 操作は `/db-migrate` スキルを使う。

## コーディング規約

### コードスタイル

- Prettier: ダブルクォート・セミコロン有・trailing comma es5・printWidth 100
- 型変換: マッパー関数を `lib/` に集約
- DB 依存分離: DB 依存関数と非依存関数を分離

### テスト

- 実行: `npx vitest run`（全体）/ `npx vitest run <path>`（個別）
- 配置: 対象モジュールの隣に `__tests__/` ディレクトリ
  - 例: `src/lib/utils.ts` → `src/lib/__tests__/utils.test.ts`
- MSW: `src/mocks/server.ts` でモック定義
- SWR テスト: `SWRTestProvider`（`src/lib/test-utils.tsx`）でキャッシュ分離

### 関連ルールファイル

| ファイル | スコープ |
|---------|---------|
| `.claude/rules/api.md` | API 設計・createHandler・サービス層 |
| `.claude/rules/prisma.md` | Prisma v7・マイグレーション |
| `.claude/rules/react.md` | React Compiler・制御コンポーネント・hydration |
| `.claude/rules/ui-architecture.md` | Atomic Design・Container/Presentation・shadcn/ui |
