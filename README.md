# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## 技術スタック

| 技術                                          | 用途              |
| --------------------------------------------- | ----------------- |
| [Next.js](https://nextjs.org/) 16 (App Router)| フレームワーク    |
| [TypeScript](https://www.typescriptlang.org/) 5 (strict) | 言語   |
| [Tailwind CSS](https://tailwindcss.com/) v4   | スタイル          |
| [shadcn/ui](https://ui.shadcn.com/) v4        | UI コンポーネント |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | フォーム |
| [SWR](https://swr.vercel.app/)                | データ取得        |
| [Prisma](https://www.prisma.io/) v7           | ORM               |
| [PostgreSQL](https://www.postgresql.org/) ([Neon](https://neon.tech/)) | データベース |
| [Auth.js](https://authjs.dev/) v5             | 認証              |
| [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) + [MSW](https://mswjs.io/) | テスト |
| [Vercel](https://vercel.com/)                 | デプロイ          |

詳細は [docs/tech-stack.md](docs/tech-stack.md) を参照。

## セットアップ

**前提**: Docker Desktop（または互換ランタイム）がインストール済みであること。

```bash
# 1. 環境変数を準備（初回のみ）
cp .env.sample .env  # AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET を設定

# 2. 依存パッケージをインストール
npm install

# 3. Docker で PostgreSQL を起動
docker compose up -d

# 4. DB マイグレーション & シード
npm run db:migrate
npm run db:seed

# 5. dev サーバーを起動
npm run dev
```

## npm scripts

| コマンド                    | 用途                         |
| --------------------------- | ---------------------------- |
| `npm run dev`               | 開発サーバー起動（Turbopack）|
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
├── app/
│   ├── (app)/              # 認証必須ページ（layout.tsx で認証ガード）
│   │   └── dashboard/
│   ├── (auth)/             # 未認証向けページ
│   │   └── login/
│   └── api/
│       ├── auth/           # Auth.js ハンドラー
│       ├── todos/          # TODO CRUD
│       └── users/          # ユーザー登録
├── components/
│   ├── ui/                 # atoms（shadcn/ui）
│   ├── molecules/          # atoms を組合せた小単位
│   ├── organisms/          # 独立した UI ブロック
│   └── templates/          # ページレイアウト
├── lib/
│   ├── api/                # createHandler / DI コンテナ
│   ├── services/           # サービス層（ビジネスロジック）
│   ├── auth.ts             # Auth.js 設定
│   ├── auth-service.ts     # 認証ロジック
│   ├── prisma.ts           # Prisma クライアント
│   ├── client/             # クライアント側 API ユーティリティ
│   ├── hooks/              # カスタムフック
│   ├── constants/          # 共有定数
│   └── validations/        # Zod スキーマ
├── types/                  # 型定義
└── mocks/                  # MSW モック
prisma/                     # schema / seed / migrations
docs/
├── openapi.yaml            # API 仕様
├── specs/                  # 機能仕様書
└── tech-stack.md           # 技術スタック詳細
```
