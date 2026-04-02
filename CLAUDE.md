# {{PROJECT_NAME}} — AI エージェント指針

> セットアップ・npm scripts・ディレクトリ構成は `README.md` を参照。

## 開発フロー

### 仕様駆動開発（spec-first）

`docs/specs/` が最上位の真実（single source of truth）。

**権威構造**: spec → openapi → prisma → 実装コード

### テスト駆動開発（TDD）

`/tdd` スキルを実行してから実装を開始する。

## コマンド

| コマンド | 用途 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run lint` | oxlint + Biome format チェック |
| `npm run lint:fix` | oxlint 自動修正 + Biome format 適用 |
| `npm run format` | Biome フォーマット |
| `npx vitest run` | テスト全体実行 |
| `npx vitest run <path>` | テスト個別実行 |
| `npm run test:e2e` | E2E テスト実行（Playwright） |
| `npx prisma migrate dev` | DB マイグレーション |
| `npm run db:studio` | Prisma Studio 起動 |

## ルール

技術的な詳細は `.claude/rules/` に分離。`paths:` 指定により関連ファイル編集時に自動ロードされる。

| ファイル | スコープ |
|---------|---------|
| `rules/development-workflow.md` | Research → Plan → TDD → Review → Commit の全体フロー |
| `rules/api.md` | API 設計・createHandler・サービス層・DI コンテナ |
| `rules/auth.md` | Auth.js v5・認証ガード・レイアウトグループ |
| `rules/prisma.md` | Prisma v7・マイグレーション |
| `rules/react.md` | React Compiler・制御コンポーネント・hydration |
| `rules/ui-architecture.md` | Atomic Design・Container/Presentation・shadcn/ui |
| `rules/coding-style.md` | イミュータビリティ・ファイルサイズ制限・エラーハンドリング |
| `rules/security.md` | セキュリティチェックリスト・シークレット管理 |
| `rules/git-workflow.md` | コミットメッセージ形式・ブランチ戦略・PR |
| `rules/testing.md` | テスト要件・TDD・カバレッジ目標・vitest |

## スキル

| スキル | 用途 |
|-------|------|
| `/plan` | 実装計画を作成し、ユーザー確認後に着手 |
| `/tdd` | RED → GREEN → REFACTOR サイクルで実装 |
| `/code-review` | コード変更をレビュー（CRITICAL〜LOW） |
| `/build-fix` | ビルドエラー・型エラーを最小修正 |
| `/verify` | ビルド・型チェック・lint・テストを一括検証 |
| `/test-coverage` | テストカバレッジ分析・不足テスト生成 |
| `/refactor-clean` | 不要コード検出・安全な削除 |
| `/db-migrate` | DB マイグレーション・シードデータ投入 |
| `/add-field` | 既存モデルへのフィールド追加（全レイヤー整合性チェック） |
| `/init` | プロジェクト初回セットアップ |

## エージェント

複雑なタスクは専門エージェントに委任する。`.claude/agents/` に定義。

| エージェント | 用途 | 使用タイミング |
|-------------|------|---------------|
| `planner` | 実装計画立案 | 複雑な機能実装・リファクタリング |
| `code-reviewer` | コードレビュー | コード変更後 |
| `security-reviewer` | セキュリティ分析 | 認証・入力処理・API 変更時 |
| `build-error-resolver` | ビルドエラー修正 | ビルド失敗時 |
| `refactor-cleaner` | 不要コード削除 | コードメンテナンス時 |

### 自動委任ルール

- 複雑な機能リクエスト → **planner** エージェント
- コード変更後 → **code-reviewer** エージェント
- バグ修正・新機能 → `/tdd` スキル
- ビルド失敗 → **build-error-resolver** エージェント

## Hooks

`.claude/hooks/README.md` に推奨 hooks 設定を記載。`settings.json` に手動で追加する。

主な hooks:
- **PreToolUse**: pre-commit 品質チェック（secrets 検出・debugger 検出・commit message 検証）
- **PostToolUse**: oxlint リント → Biome フォーマット、console.log 警告、大ファイル警告
- **Stop**: console.log 監査（テスト・設定ファイル除外）

## 運用方針

- 同じミスは 2 度目で仕組みで防ぐ（ルール化 → `.claude/rules/` or `.claude/skills/`）
- CLAUDE.md はインデックスに留め、詳細は `rules/` や `skills/` に分離する
