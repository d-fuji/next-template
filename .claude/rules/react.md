---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
---

# React / Next.js コーディングルール

## React Compiler（自動メモ化）

本プロジェクトは **React 19 + Next.js 16 + React Compiler** を使用している。

### useMemo / useCallback は使わない

React Compiler が自動的にメモ化を行うため、手動の `useMemo` / `useCallback` は不要。

```tsx
// ✅ Good — React Compiler が必要に応じて自動メモ化する
const filteredItems = items.filter((item) => item.isActive);

const handleChange = (value: string) => {
  onChange(value);
};

// ❌ Bad — 手動メモ化は冗長でコードの可読性を下げる
const filteredItems = useMemo(() => items.filter((item) => item.isActive), [items]);
const handleChange = useCallback((value: string) => onChange(value), [onChange]);
```

**例外**: React Compiler が対応しない外部ライブラリの最適化が必要な場合のみ許容。

### 定数の外出し

コンポーネント外で定義できる定数（ラベルマップ、オプション配列等）はモジュールスコープに置く。

```tsx
// ✅ Good — lib/constants/ に集約
import { SEASON_LABELS } from "@/lib/constants/labels";

// ❌ Bad — コンポーネント内で定義（重複の温床）
const SEASON_LABELS = { LOW: "ロー", ... };
```

**配置先**: `src/lib/constants/` に集約。複数ファイルで使うラベル・オプションは必ず共有する。

## 制御コンポーネント

### Base UI の Select / Input は常に制御モードで使う

初期値に `undefined` を渡すと「非制御」として扱われ、後から値を設定すると制御/非制御の切替エラーが出る。

```tsx
// ✅ Good — 常に string を渡す（空文字で初期化）
<Select value={selectedValue ?? ""} onValueChange={handleChange}>

// ❌ Bad — null → undefined 変換で非制御になる
<Select value={selectedValue ?? undefined} onValueChange={handleChange}>
```

## エラーハンドリング

### error.tsx

`app/` の各レイアウトグループに `error.tsx` を配置し、予期しないエラーをキャッチする。

```
src/app/
├── (app)/
│   ├── error.tsx    ← 認証済みページのエラーバウンダリ
│   └── layout.tsx
├── (auth)/
│   └── error.tsx    ← 認証ページのエラーバウンダリ
└── error.tsx        ← ルートのエラーバウンダリ
```

### SWR フェッチャーのエラー処理

`fetcher.ts` で HTTP ステータスに応じた処理を行う。

- **401**: ログインページへリダイレクト
- **その他**: Error を throw し、SWR の `error` で UI に表示

## Hydration

### SSR/CSR の不一致を防ぐ

Base UI コンポーネントは内部で動的 ID を生成するため、SSR と CSR で ID が異なり hydration mismatch が発生する可能性がある。

**対処方針**:
- `"use client"` コンポーネント内で Base UI を使う場合、基本的に問題ない
- サーバーコンポーネント内で直接 Base UI を使わない
- `typeof window` による分岐は避ける（hydration mismatch の原因になる）

## "use client" の判断基準

```
このコンポーネントは以下のいずれかを使っているか？
├─ useState / useEffect → "use client" 必要
├─ onClick / onChange / onSubmit → "use client" 必要
├─ useSession / useRouter (next/navigation) → "use client" 必要
├─ ブラウザ API (window, document) → "use client" 必要
└─ 上記いずれもなし → Server Component のまま（"use client" 不要）
```
