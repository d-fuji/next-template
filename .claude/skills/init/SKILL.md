---
name: init
description: プロジェクト初回セットアップ。プレースホルダー置換・環境構築・DB マイグレーションを一気通貫で実行する。
---

# プロジェクト初回セットアップ

## Step 1: プロジェクト名の決定

AskUserQuestion で以下を聞く:

- 「プロジェクト名を入力してください」（デフォルト: カレントディレクトリ名）
- 「プロジェクトの説明を入力してください」（空欄可）

プロジェクト名は kebab-case に変換し、以下の 3 変数を導出する:

| 変数                      | 形式       | 例           |
| ------------------------- | ---------- | ------------ |
| `{{project-name}}`        | kebab-case | `my-app`     |
| `{{PROJECT_NAME}}`        | タイトル   | `My App`     |
| `{{PROJECT_DESCRIPTION}}` | 自由文     | `TODO アプリ` |

## Step 2: プレースホルダー置換

以下のファイルの `{{project-name}}` / `{{PROJECT_NAME}}` / `{{PROJECT_DESCRIPTION}}` を一括置換する:

- `package.json` / `package-lock.json`
- `CLAUDE.md` / `README.md`
- `src/app/layout.tsx` / `src/app/(auth)/login/page.tsx`
- `docs/openapi.yaml`
- `docker-compose.yml` / `.env.sample`

完了後に `grep -r '{{project-name}}\|{{PROJECT_NAME}}\|{{PROJECT_DESCRIPTION}}' --exclude-dir={node_modules,.git,.next} .` で残存チェック。

## Step 3: 環境変数ファイルの作成

既存ファイルは上書きしない。

```bash
cp .env.sample .env
cp .env.sample .env.production
```

`.env` の `AUTH_SECRET` に `openssl rand -base64 32` の値を自動セットする。
`.env.production` は値を空にしておき、Vercel 等で設定するよう案内する。

## Step 4: 依存パッケージのインストール

`node_modules` が存在しない場合のみ実行。

```bash
npm install
```

## Step 5: Docker 起動

```bash
docker compose up -d
```

失敗時は Docker Desktop の起動確認を促す。

## Step 6: Prisma マイグレーション

```bash
npx prisma migrate dev --name init
```

## Step 7: dev サーバー起動

```bash
npm run dev
```

バックグラウンドで起動し、`Ready` を確認してユーザーに URL を伝える。

## 完了メッセージ

- プロジェクト名
- dev サーバーの URL（http://localhost:3000）
- 次のステップ: ブラウザで開いて動作確認 → `/login` から新規ユーザー登録
