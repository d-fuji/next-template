---
name: verify
description: ビルド・型チェック・lint・テストを一括実行し、プロジェクトの健全性を検証する。
---

# 検証（ヘルスチェック）

## ワークフロー

### Step 1: ビルドシステム検出

`package.json` の scripts を確認し、利用可能なコマンドを特定。

### Step 2: 検証実行

以下を順番に実行:

```bash
# 1. 型チェック
npx tsc --noEmit

# 2. Lint
npm run lint

# 3. テスト
npx vitest run

# 4. ビルド
npm run build
```

### Step 3: レポート

```
Verification Results
──────────────────────────────
Type check:  ✓ Pass
Lint:        ✓ Pass
Tests:       ✓ Pass (42 passed)
Build:       ✓ Pass
──────────────────────────────
Verdict: ALL CLEAR
```

### Step 4: 失敗時の対応

| 失敗 | 推奨アクション |
|------|---------------|
| 型チェック失敗 | `/build-fix` スキルを実行 |
| Lint 失敗 | `npx oxlint --fix .` で自動修正 |
| テスト失敗 | 失敗テストを調査、`/tdd` で修正 |
| ビルド失敗 | `/build-fix` スキルを実行 |

## ガードレール

- CRITICAL な問題がある場合はコミットをブロック
- すべてパスした場合のみ「ALL CLEAR」と報告
