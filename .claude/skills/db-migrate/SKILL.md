---
name: db-migrate
description: データベースのセットアップ、マイグレーション実行、シードデータ投入、DB スキーマ変更時に使用する。ローカルと本番の両環境をガイドする。
---

データベースのセットアップ、スキーマ変更、データ投入をガイドするスキル。

## このスキルが適用される場面

- プロジェクト初回の DB セットアップ
- スキーマ変更に伴うマイグレーション
- シードデータの投入・更新
- 本番環境へのマイグレーション適用

## 環境構成

| 環境     | DB                        | アダプター             |
| -------- | ------------------------- | ---------------------- |
| ローカル | Docker Compose PostgreSQL | `@prisma/adapter-pg`   |
| 本番     | Vercel Postgres (Neon)    | `@prisma/adapter-neon` |
| テスト   | なし                      | MSW モック             |

## 初回セットアップ

```bash
docker compose up -d
cp .env.sample .env
npm run db:migrate
npm run dev
```

## スキーマ変更

1. `prisma/schema.prisma` を編集
2. `npm run db:migrate`（マイグレーション名を入力）
3. Git コミット

## 本番マイグレーション

`.env.production` に `DATABASE_URL` と `DATABASE_URL_UNPOOLED` を設定済みの前提。

1. `npm run db:prod:status` — 未適用マイグレーション確認
2. `npm run db:prod:migrate` — 適用
3. Git push → Vercel デプロイ

## シードデータ

- ローカル: `npm run db:seed`
- 本番: `npm run db:prod:seed`
- 安全性: upsert を使用、トランザクション内実行
