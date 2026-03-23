---
name: init
description: プロジェクト初回セットアップ。プレースホルダー置換 → .env 作成 → Docker 起動 → マイグレーション → dev サーバー起動を一気通貫で実行する。
---

プロジェクトの初回セットアップを対話的に実行するスキル。

## 実行手順

### Step 1: プロジェクト名の決定

ユーザーにプロジェクト名を確認する。AskUserQuestion で以下を聞く:

- 質問: 「プロジェクト名を入力してください」
- デフォルト選択肢: カレントディレクトリ名（`basename $PWD`）
- プロジェクト名は kebab-case に変換して使用する

以下の 3 つの変数を導出する:

| 変数                    | 形式        | 例              |
| ----------------------- | ----------- | --------------- |
| `{{project-name}}`      | kebab-case  | `my-app`        |
| `{{PROJECT_NAME}}`      | タイトル    | `My App`        |
| `{{PROJECT_DESCRIPTION}}` | 空文字 or ユーザー入力 | `TODOアプリ` |

`{{PROJECT_DESCRIPTION}}` もあわせて聞く（空欄可）。

### Step 2: プレースホルダー置換

以下のファイルの `{{project-name}}` / `{{PROJECT_NAME}}` / `{{PROJECT_DESCRIPTION}}` を一括置換する:

- `package.json`
- `package-lock.json`
- `CLAUDE.md`
- `README.md`
- `src/app/layout.tsx`
- `src/app/(auth)/login/page.tsx`
- `docs/openapi.yaml`
- `docker-compose.yml`
- `.env.sample`

**注意**: `.env` ファイルは Step 3 で `.env.sample` からコピーして生成するため、ここでは置換しない。

置換の漏れがないよう、完了後に `grep -r '{{project-name}}\|{{PROJECT_NAME}}\|{{PROJECT_DESCRIPTION}}' .` で残存チェックする（node_modules, .git, .next は除外）。

### Step 3: 環境変数ファイルの作成

`.env.sample` をベースに `.env` と `.env.production` を作成する（既存ファイルは上書きしない）。

```bash
# ローカル開発用
cp .env.sample .env

# 本番用（値は空欄のまま — Vercel 等で設定する前提）
cp .env.sample .env.production
```

`.env` のみ以下を自動セットする:

- `AUTH_SECRET`: `openssl rand -base64 32` で生成した値

`.env.production` は値を空にしておき、ユーザーに「本番の DB URL や OAuth キーは Vercel の環境変数か `.env.production` に直接設定してください」と案内する。

### Step 4: 依存パッケージのインストール

`node_modules` が存在しない場合のみ実行する。

```bash
npm install
```

### Step 5: Docker 起動

```bash
docker compose up -d
```

起動を確認してから次に進む。失敗した場合は Docker Desktop が起動しているか確認を促す。

### Step 6: Prisma マイグレーション

```bash
npx prisma migrate dev --name init
```

### Step 7: dev サーバー起動

```bash
npm run dev
```

バックグラウンドで起動し、`Ready` の出力を確認してユーザーに URL を伝える。

## 完了メッセージ

セットアップ完了後、以下を伝える:

- プロジェクト名
- dev サーバーの URL（http://localhost:3000）
- 次のステップ: ブラウザで開いて動作確認 → `/login` から新規ユーザー登録
