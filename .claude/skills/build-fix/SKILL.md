---
name: build-fix
description: ビルドエラー・型エラーを最小限の変更で修正する。build-error-resolver エージェントを起動する。
---

# ビルドエラー修正

## ワークフロー

### Step 1: エラー収集

```bash
npx tsc --noEmit --pretty
npm run build
```

### Step 2: build-error-resolver エージェントを起動

エラーをカテゴリ分類:
- 型推論エラー
- 型定義の欠落
- インポートエラー
- 設定エラー
- 依存関係エラー

### Step 3: 最小修正

各エラーに対して最小限の修正を適用:

| エラー | 修正 |
|-------|------|
| `implicitly has 'any' type` | 型アノテーション追加 |
| `Object is possibly 'undefined'` | `?.` またはnull チェック |
| `Property does not exist` | インターフェースに追加 or `?` |
| `Cannot find module` | tsconfig paths 確認、パッケージインストール |
| `Type 'X' not assignable to 'Y'` | 型変換 or 型定義修正 |

### Step 4: 検証

```bash
npx tsc --noEmit  # exit code 0 を確認
npm run build     # ビルド成功を確認
npx vitest run    # テストが壊れていないことを確認
```

## 禁止事項

- リファクタリング（エラー修正と関係ないコード変更）
- アーキテクチャ変更
- 新機能追加
- パフォーマンス最適化
- エラーに関係ない変数のリネーム

## キャッシュクリア

問題が解決しない場合:

```bash
rm -rf .next node_modules/.cache && npm run build
```
