# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## 技術スタック

| 技術                                          | 用途              |
| --------------------------------------------- | ----------------- |
| [Next.js](https://nextjs.org/) (App Router)   | フレームワーク    |
| [TypeScript](https://www.typescriptlang.org/) | 言語              |
| [Tailwind CSS](https://tailwindcss.com/) v4   | スタイル          |
| [shadcn/ui](https://ui.shadcn.com/) v4        | UI コンポーネント |
| [SWR](https://swr.vercel.app/)                | データ取得        |
| [Prisma](https://www.prisma.io/) v7           | ORM               |
| [PostgreSQL](https://www.postgresql.org/)     | データベース      |
| [Auth.js](https://authjs.dev/) v5             | 認証              |
| [Vitest](https://vitest.dev/)                 | テスト            |
| [Vercel](https://vercel.com/)                 | デプロイ          |

## セットアップ

```bash
npm install
docker compose up -d
cp .env.sample .env
npm run db:migrate
npm run dev
```

## npm scripts

| コマンド                    | 用途                         |
| --------------------------- | ---------------------------- |
| `npm run dev`               | 開発サーバー起動             |
| `npm run build`             | プロダクションビルド         |
| `npm run start`             | ビルド後サーバー起動         |
| `npm run lint`              | ESLint 実行                  |
| `npm run format`            | Prettier 修正                |
| `npm run format:check`      | Prettier チェック            |
| `npm run test`              | テスト実行                   |
| `npm run test:watch`        | テスト watch モード          |
| `npm run db:generate`       | Prisma Client 再生成         |
| `npm run db:migrate`        | マイグレーション作成・適用   |
| `npm run db:migrate:status` | マイグレーション状況確認     |
| `npm run db:seed`           | シードデータ投入             |
| `npm run db:reset`          | DB 初期化                    |
| `npm run db:prod:migrate`   | 本番マイグレーション適用     |
| `npm run db:prod:seed`      | 本番シードデータ投入         |
| `npm run db:prod:status`    | 本番マイグレーション状況確認 |

## ディレクトリ構成

```
src/
  app/           # ページ + API routes
  components/    # UI コンポーネント
    ui/          # shadcn/ui コンポーネント
  lib/           # ユーティリティ
  types/         # 型定義
  mocks/         # MSW モック
prisma/          # schema / seed / migrations
docs/
  openapi.yaml   # API 仕様
  specs/         # 機能仕様書
```
