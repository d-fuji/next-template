# 技術スタック詳細

## バージョン一覧

| 技術            | バージョン | 用途                         |
| --------------- | ---------- | ---------------------------- |
| Next.js         | 16         | フレームワーク (App Router)  |
| TypeScript      | 5          | 言語 (strict)                |
| React           | 19         | UI                           |
| Tailwind CSS    | 4          | スタイル                     |
| shadcn/ui       | 4          | UI コンポーネント            |
| Base UI         | 1          | アクセシブル UI プリミティブ |
| Framer Motion   | 12         | アニメーション               |
| React Hook Form | 7          | フォーム状態管理             |
| Zod             | 4          | スキーマバリデーション       |
| SWR             | 2          | データ取得                   |
| nuqs            | 2          | URL ステート管理             |
| Recharts        | 3          | チャート                     |
| Sonner          | 2          | トースト通知                 |
| date-fns        | 4          | 日付操作                     |
| next-themes     | 0.4        | テーマ管理                   |
| @t3-oss/env     | 0.13       | 環境変数バリデーション       |
| Prisma          | 7          | ORM                          |
| PostgreSQL      | 16         | DB (Neon for production)     |
| Auth.js         | 5 (beta)   | 認証 (next-auth v5)          |
| Vitest          | 4          | テストランナー               |
| Testing Library | 16         | コンポーネントテスト         |
| MSW             | 2          | API モック                   |
| oxlint          | 0.16       | リンター                     |
| Biome           | 1          | フォーマッター               |
| tw-animate-css  | 1          | CSS アニメーション           |
| bcryptjs        | 3          | パスワードハッシュ           |

## 設定ファイル

### tsconfig.json

- `strict: true`
- `@/*` エイリアス → `./src/*`
- `target: ES2017`

### oxlint (oxlint.json)

- plugins: react, react-hooks, typescript, nextjs, jsx-a11y
- rules: no-console warn, no-debugger error, react-hooks/rules-of-hooks error, nextjs/no-img-element error

### Biome (biome.json)

```json
{
  "formatter": {
    "indentStyle": "space",
    "lineWidth": 100,
    "quoteStyle": "double",
    "trailingCommas": "es5",
    "semicolons": "always"
  },
  "linter": { "enabled": false }
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
