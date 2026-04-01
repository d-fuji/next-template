---
name: code-review
description: コード変更をレビューする。code-reviewer エージェントを起動し、CRITICAL〜LOW の重要度でフィードバックする。
---

# コードレビュー

## ワークフロー

### Step 1: 変更の収集

```bash
git diff --staged
git diff
git log --oneline -5
```

変更がない場合は直近のコミットをレビュー対象にする。

### Step 2: code-reviewer エージェントを起動

以下のチェックリストを適用:

1. **Security (CRITICAL)** — シークレット、インジェクション、XSS、認証バイパス
2. **Code Quality (HIGH)** — 大関数、深いネスト、エラーハンドリング、console.log
3. **React/Next.js (HIGH)** — 依存配列、クライアント/サーバー境界、キー
4. **Backend (HIGH)** — 入力バリデーション、N+1 クエリ、エラー漏洩
5. **Performance (MEDIUM)** — アルゴリズム、バンドルサイズ、キャッシュ
6. **Best Practices (LOW)** — 命名、マジックナンバー、フォーマット

### Step 3: レポート出力

```
## Review Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 0     | pass   |
| HIGH     | 2     | warn   |
| MEDIUM   | 1     | info   |
| LOW      | 0     | -      |

Verdict: [APPROVE / WARNING / BLOCK]
```

### Step 4: 修正提案

CRITICAL / HIGH の問題には具体的な修正コードを提示する。

## 判定基準

- **Approve**: CRITICAL・HIGH なし
- **Warning**: HIGH のみ（注意してマージ可）
- **Block**: CRITICAL あり（修正必須）

## Confidence フィルタ

- 80% 以上の確信がある問題のみ報告
- スタイルの好みは報告しない（プロジェクト規約違反を除く）
- 変更されていないコードの問題は CRITICAL のみ報告
- 類似の問題は統合する（「5 箇所でエラーハンドリング欠如」）
