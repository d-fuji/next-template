---
name: tdd
description: テスト駆動開発。RED → GREEN → REFACTOR サイクルで spec-first に実装する。
---

# テスト駆動開発（TDD）

spec-first の TDD スキル。RED → GREEN → REFACTOR サイクルを厳守する。

## ワークフロー

### 0. 仕様確認

- `docs/specs/` で対象機能の仕様を確認
- 必要に応じて `docs/openapi.yaml`、`prisma/schema.prisma` を更新

### 1. RED — 失敗するテストを書く

- 仕様に基づき、失敗するテストを **1 つだけ** 作成
- テストが意図通り失敗することを確認

### 2. GREEN — テストを通す

- テストを通すための **最小限のコードのみ** を書く
- 余計な実装をしない

### 3. REFACTOR — リファクタリング

- 全テストがパスしたままコードを整理
- 重複排除、命名改善、構造改善

### 4. 次のサイクルへ

- 手順 1 に戻る
- 全サイクル完了後: `npm run lint` + `npm run format`
- spec → openapi → prisma の整合性チェック

## テスト規約

- 配置: 対象モジュールの隣に `__tests__/` ディレクトリ
- `describe`: 対象関数/クラス名
- `it` / `test`: `"should [期待] when [条件]"` 形式
- AAA パターン: Arrange → Act → Assert

## 禁止事項

- テストを修正して通す（実装を直す）
- `test.skip()` / `xtest()` の放置
- テストでの `any` 型使用
- 1 テストで複数の振舞い検証
- 実装の内部詳細への依存
