---
name: add-field
description: 既存モデルへのフィールド追加。全レイヤーの整合性を保つ 9 項目チェックリストを実行する。
---

# フィールド追加チェックリスト

既存モデルにフィールドを追加する際、全レイヤーの整合性を保つ。最もよくある漏れはシードデータとマッパーの更新忘れ。

## チェックリスト

以下の 9 項目を順に更新する:

1. **`docs/specs/*.md`** — 仕様のデータモデル表に追加
2. **`docs/openapi.yaml`** — API スキーマに追加
3. **`prisma/schema.prisma`** — カラム定義を追加
4. **`src/types/api.ts`** — 型定義を更新
5. **`src/data/*.json`** — フィクスチャデータに値追加（使用時のみ）
6. **`prisma/seed.ts`** — seed の create/upsert データに追加（**最も漏れやすい**）
7. **`src/mocks/handlers.ts`** — MSW モックデータに追加
8. **`src/lib/*-mapper.ts`** — マッパー関数に追加
9. **API ルート・UI コンポーネント** — 必要に応じて更新

## 実行手順

1. 項目 1〜3 を更新
2. `npm run db:migrate`
3. `/tdd` スキルでテスト駆動実装
4. `npx vitest run` で全テスト通過確認
5. `npm run lint` + `npm run format`
