---
paths:
  - "**"
---

# Git ワークフロー

## コミットメッセージ形式

```
<type>: <description>

<optional body>
```

Types: feat, fix, refactor, docs, test, chore, perf, ci

## ブランチ戦略

- `main` — 本番リリース用。直接コミットしない
- `feature/*` — 機能開発
- `fix/*` — バグ修正
- `refactor/*` — リファクタリング

## プルリクエスト

1. フルコミット履歴を分析（最新コミットだけでなく全体）
2. `git diff [base-branch]...HEAD` で全変更を確認
3. 包括的な PR サマリーを作成
4. テストプランを含める
5. 新ブランチの場合は `-u` フラグでプッシュ
