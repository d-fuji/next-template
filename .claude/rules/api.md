---
paths:
  - "src/app/api/**"
  - "src/lib/api/**"
  - "src/lib/services/**"
---

# API 設計ルール

## アーキテクチャ

```
Route Handler (app/api/) — 宣言的なエンドポイント定義
    ↓ createHandler() で認証・バリデーション・エラーハンドリングを合成
Service Layer (lib/services/) — ビジネスロジック
    ↓ PrismaClient を DI で受け取る
DI Container (lib/api/container.ts) — サービスの生成と依存注入
    ↓
Prisma (lib/prisma.ts) — DB アクセス
```

## ルートハンドラーの書き方

### 必ず `createHandler()` を使う

ルートハンドラーに try/catch や getSessionUserId() を直接書かない。

```typescript
// ✅ Good — 宣言的
export const GET = createHandler()
  .withAuth()
  .withQuery(schema)
  .handle(async ({ userId, query }) => {
    return container.items.getByUserId(userId);
  });

// ❌ Bad — ボイラープレートの繰り返し
export async function GET(request: NextRequest) {
  try {
    const userId = await getSessionUserId();
    const query = schema.parse(...);
    // ...
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
```

### ビルダーメソッド

| メソッド | 用途 |
|---------|------|
| `.withAuth()` | 認証必須。`ctx.userId` が利用可能に |
| `.withQuery(schema)` | クエリパラメータを Zod で検証。`ctx.query` に型付きで注入 |
| `.withBody(schema)` | リクエストボディを Zod で検証。`ctx.body` に型付きで注入 |
| `.withStatus(code)` | レスポンスのステータスコード（デフォルト 200） |
| `.handle(fn)` | ハンドラー関数。戻り値は自動で `NextResponse.json` に変換 |

## サービス層

### ルール

- ビジネスロジックはサービスに書く。ルートハンドラーにロジックを書かない
- サービスは `PrismaClient` をコンストラクタで受け取る（DI）
- サービスは HTTP 層（NextRequest / NextResponse）に依存しない
- エラーは `AppError` を throw する（サービス層でも使用可能）

### 命名規則

| ファイル | クラス名 | 責務 |
|---------|----------|------|
| `users-service.ts` | `UsersService` | ユーザー管理 |
| `items-service.ts` | `ItemsService` | アイテムの CRUD |

ファイル名は `{ドメイン}-service.ts`、クラス名は `{Domain}Service` で統一する。

### Repository 層の判断基準

サービス層が直接 Prisma を呼ぶか、Repository 層を挟むかは以下で判断する:

- **Repository 不要（デフォルト）**: 単純な CRUD、1 テーブルの操作、クエリが複雑でない場合
- **Repository 追加を検討**: 複数テーブルの複雑な結合、再利用性の高いクエリ、テスト時に DB アクセスを差し替えたい場合

YAGNI の原則により、最初は Repository なしで始め、必要になった時点で導入する。

## DI コンテナ

`src/lib/api/container.ts` でサービスを生成する。

```typescript
import { container } from "@/lib/api/container";

// ルートハンドラーからはこう使う
const items = await container.items.getByUserId(userId);
```

テスト時はコンテナごとモックに差し替え可能:

```typescript
const mockContainer = {
  items: { getByUserId: vi.fn().mockResolvedValue([]) },
};
```
