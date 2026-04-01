---
paths:
  - "src/**"
  - "e2e/**"
  - "**/*.test.*"
  - "**/*.spec.*"
---

# テスト要件

## テストカバレッジ目標: 80%

テスト種類（すべて必須）:
1. **Unit Tests** — 個別の関数、ユーティリティ、コンポーネント
2. **Integration Tests** — API エンドポイント、データベース操作
3. **E2E Tests** — クリティカルなユーザーフロー

## テスト駆動開発（TDD）

必須ワークフロー:
1. テストを先に書く（RED）
2. テスト実行 — 失敗することを確認
3. 最小限の実装を書く（GREEN）
4. テスト実行 — 通ることを確認
5. リファクタリング（IMPROVE）
6. カバレッジ確認（80%+）

## テスト配置

対象モジュールの隣に `__tests__/` ディレクトリを配置:
- 例: `src/lib/utils.ts` → `src/lib/__tests__/utils.test.ts`

## テスト失敗時のトラブルシューティング

1. **tdd-guide** エージェントを使用
2. テストの独立性を確認
3. モックが正しいか検証
4. テストではなく実装を修正する（テストが間違っている場合を除く）

## テスト実行

- 全体: `npx vitest run`
- 個別: `npx vitest run <path>`

## テスト実行

- 全体 (unit): `npx vitest run`
- 個別 (unit): `npx vitest run <path>`
- E2E: `npm run test:e2e`
- E2E UI: `npm run test:e2e:ui`

## テストツール

| ツール | 用途 | 配置 |
|--------|------|------|
| Vitest | Unit / Integration テスト | `src/**/__tests__/` |
| Playwright | E2E テスト | `e2e/` |
| MSW | API モック | `src/mocks/` |
| SWRTestProvider | SWR キャッシュ分離 | `src/lib/test-utils.tsx` |

## E2E テスト

- **配置**: `e2e/` ディレクトリ
- **設定**: `playwright.config.ts`
- **命名**: `<feature>.spec.ts`
- クリティカルなユーザーフロー（ログイン、CRUD）を優先的にカバーする

## 禁止事項

- テストを修正して通す（実装を直す）
- `test.skip()` / `xtest()` の放置
- テストでの `any` 型使用
- 1 テストで複数の振舞い検証
- 実装の内部詳細への依存
