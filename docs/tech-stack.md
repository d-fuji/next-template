# 技術スタック詳細

## バージョン一覧

| 技術            | バージョン | 用途                        |
| --------------- | ---------- | --------------------------- |
| Next.js         | 16         | フレームワーク (App Router) |
| TypeScript      | 5          | 言語 (strict)               |
| React           | 19         | UI                          |
| Tailwind CSS    | 4          | スタイル                    |
| shadcn/ui       | 4          | UI コンポーネント           |
| SWR             | 2          | データ取得                  |
| Prisma          | 7          | ORM                         |
| PostgreSQL      | 16         | DB (Neon for production)    |
| Auth.js         | 5 (beta)   | 認証 (next-auth v5)         |
| Vitest          | 4          | テストランナー              |
| Testing Library | 16         | コンポーネントテスト        |
| MSW             | 2          | API モック                  |
| ESLint          | 9          | リンター (flat config)      |
| Prettier        | 3          | フォーマッター              |

## 設定ファイル

### tsconfig.json

- `strict: true`
- `@/*` エイリアス → `./src/*`
- `target: ES2017`

### ESLint (eslint.config.mjs)

- ESLint 9 flat config 形式
- Next.js core-web-vitals + TypeScript + Prettier

### Prettier (.prettierrc)

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

### PostCSS (postcss.config.mjs)

- `@tailwindcss/postcss` プラグイン（Tailwind CSS v4）

### shadcn/ui (components.json)

- style: base-nova
- RSC: enabled
- アイコン: Lucide
- baseColor: neutral

### Vitest (vitest.config.ts)

- environment: jsdom
- setupFiles: `./vitest.setup.ts`
- include: `src/**/__tests__/**/*.{test,spec}.{ts,tsx}`
- `@/*` エイリアス解決

### Prisma

- インスタンス: `src/lib/prisma.ts`（環境別アダプター自動切替）
- ID 戦略: ドメイン = INTEGER (autoincrement) / 認証 = STRING (cuid)
- PrismaAdapter キャスト: `prisma as Parameters<typeof PrismaAdapter>[0]`

## テスト構成

- Vitest + jsdom + @testing-library/react
- MSW で API モック
- SWRTestProvider でキャッシュ分離
- テスト配置: `src/**/__tests__/**/*.{test,spec}.{ts,tsx}`
