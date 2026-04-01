---
name: test-coverage
description: テストカバレッジを分析し、不足しているテストを生成して 80% 以上を達成する。
---

# テストカバレッジ分析

## ワークフロー

### Step 1: カバレッジ計測

```bash
npx vitest run --coverage
```

### Step 2: カバレッジレポート分析

1. JSON サマリーまたはターミナル出力をパース
2. **80% 未満のファイル**をワースト順にリスト
3. 各ファイルの未テスト部分を特定:
   - テストされていない関数・メソッド
   - ブランチカバレッジの不足（if/else, switch, エラーパス）
   - カバレッジを水増ししているデッドコード

### Step 3: テスト生成

未カバーのファイルごとに、以下の優先度でテストを生成:

1. **Happy path** — 正常入力でのコア機能
2. **Error handling** — 不正入力、欠損データ、ネットワーク失敗
3. **Edge cases** — 空配列、null/undefined、境界値（0, -1, MAX）
4. **Branch coverage** — if/else, switch case, 三項演算子

### テスト生成ルール

- 配置: `__tests__/` ディレクトリ（プロジェクト規約に従う）
- 既存テストのパターン（import スタイル、アサーションライブラリ、モック手法）に合わせる
- 外部依存（DB, API）はモックする
- テスト間で可変状態を共有しない
- テスト名は記述的に: `"should return 409 when email is duplicate"`

### Step 4: 検証

```bash
npx vitest run          # 全テストパス確認
npx vitest run --coverage  # カバレッジ改善確認
```

80% 未満なら Step 3 を繰り返す。

### Step 5: レポート

Before/After の比較を表示:

```
Coverage Report
──────────────────────────────
File                       Before  After
src/lib/services/items.ts   45%     88%
src/lib/utils.ts             32%     82%
──────────────────────────────
Overall:                    67%     84% ✓
```

## フォーカスエリア

- 複雑な分岐を持つ関数（高い循環的複雑度）
- エラーハンドラーと catch ブロック
- コードベース全体で使われるユーティリティ関数
- API エンドポイントハンドラー
- エッジケース: null, undefined, 空文字, 空配列, 0, 負数
