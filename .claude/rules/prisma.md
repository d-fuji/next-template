---
paths:
  - "prisma/**"
  - "src/lib/prisma.ts"
  - "src/generated/**"
---

# Prisma v7 運用ルール

## インポート

- `@/generated/prisma/client` のみ使用（`@prisma/client` は使わない）

## アダプター

| 環境     | アダプター             |
| -------- | ---------------------- |
| ローカル | `@prisma/adapter-pg`   |
| 本番     | `@prisma/adapter-neon` |

`src/lib/prisma.ts` で環境変数に応じて自動切替。

## ID 戦略

| 対象                 | 型      | 生成          |
| -------------------- | ------- | ------------- |
| ドメインエンティティ | INTEGER | autoincrement |
| 認証関連（User 等）  | STRING  | cuid          |

## @auth/prisma-adapter キャスト

```typescript
prisma as Parameters<typeof PrismaAdapter>[0];
```

`any` キャストは禁止。

## マイグレーション注意

- NOT NULL カラム追加: nullable で追加 → 既存値埋める → 制約追加の 3 ステップ
- Neon タイムアウト: `timeout: 120000` 以上に設定
- 破壊的変更: 段階的に（新カラム追加 → デプロイ → 参照切替 → デプロイ → 旧カラム削除 → デプロイ）
