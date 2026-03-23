# UI アーキテクチャルール

## Atomic Design

`src/components/` を以下の階層で構成する。

| レイヤー    | 配置先                    | 役割                                       | 例                                |
| ----------- | ------------------------- | ------------------------------------------ | --------------------------------- |
| atoms       | `components/ui/`          | 最小単位の UI 部品（shadcn/ui）             | Button, Badge, Input, Skeleton    |
| molecules   | `components/molecules/`   | atoms を組合せた小さな意味のある単位        | FormField, StatusBadge            |
| organisms   | `components/organisms/`   | molecules/atoms を組合せた独立した UI ブロック | DataTable, SummaryCard           |
| templates   | `components/templates/`   | ページのレイアウト構成                      | DashboardTemplate, SettingsLayout |

### 命名規則

- ファイル名: kebab-case（`data-table.tsx`）
- コンポーネント名: PascalCase（`DataTable`）
- 機能ドメインでサブディレクトリを切る: `organisms/settings/`, `organisms/dashboard/`

## コンテナ・プレゼンテーションパターン

すべてのコンポーネントを **Container**（データ取得・状態管理）と **Presentation**（純粋 UI）に分離する。

### Presentation コンポーネント

- props でデータを受け取り、UI を描画するだけ
- hooks でのデータ取得や副作用を持たない（`useState` で UI 状態を持つのは OK）
- テストしやすい（props を渡すだけでレンダリング可能）
- `components/` 以下に配置

### Container コンポーネント

- SWR / API 呼び出し / セッション取得など副作用を担当
- Presentation コンポーネントにデータを渡す
- 以下のいずれかの形態を取る:
  1. **page.tsx 自体が Container**: 小規模ページ向け
  2. **`*-container.tsx`**: 複雑なページ向け（`components/containers/`）
  3. **カスタムフック**: データ取得ロジックを `lib/hooks/` に切り出す

### 判断基準

```
このコンポーネントは SWR/fetch を直接呼んでいるか？
├─ YES → Container（または hooks に切り出し）
└─ NO → Presentation
```

## スタイリングルール

### shadcn/ui ファースト

UI パーツは **shadcn/ui コンポーネントを最優先** で使用する。

- 新しい UI を作る前に、まず shadcn/ui に該当コンポーネントがないか確認する
- shadcn/ui に存在するものを自作しない（Button, Card, Dialog, Table, Tabs, Select, Badge 等）
- shadcn/ui にないもの（例: Recharts のチャート）のみ自前で組む
- shadcn/ui コンポーネントのカスタマイズは className props で行う

### CSS ベタ書き禁止

**インラインスタイル（`style={{}}`）やカスタム CSS クラスの直書きを禁止する。**

理由: UI 改修コストを減らすため。Tailwind ユーティリティと shadcn/ui の className 拡張に統一する。

| 禁止                                         | 代わりに                                          |
| -------------------------------------------- | ------------------------------------------------- |
| `style={{ color: "red" }}`                   | `className="text-red-600"`                        |
| `style={{ backgroundColor: "#003D7A" }}`     | `className="bg-[#003D7A]"` or CSS 変数            |
| `globals.css` にカスタムクラスを追加          | Tailwind ユーティリティを使う                      |
| `@apply` で独自クラスを量産                   | コンポーネント内で直接 Tailwind クラスを書く        |

**例外:**
- 動的な色（API からの動的カラー等）は `style={{ backgroundColor: item.color }}` を許容する
- Recharts 等の外部ライブラリの内部スタイリングは対象外

## ディレクトリ構成

```
src/
├── components/
│   ├── ui/                        # atoms（shadcn/ui）
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── molecules/                 # atoms の組合せ
│   │   ├── form-field.tsx
│   │   └── status-badge.tsx
│   ├── organisms/                 # 独立した UI ブロック
│   │   ├── app-sidebar.tsx        # アプリ共通サイドバー
│   │   ├── app-header.tsx         # アプリ共通ヘッダー
│   │   ├── settings/              # 設定ドメイン
│   │   └── dashboard/             # ダッシュボードドメイン
│   └── templates/                 # ページレイアウト（Presentation）
│       └── dashboard-template.tsx
├── lib/
│   ├── constants/                 # 共有定数（ラベル、オプション等）
│   │   └── labels.ts
│   ├── hooks/                     # SWR フック（Container のデータ取得層）
│   │   └── use-items.ts
│   └── validations/               # Zod スキーマ
└── app/(app)/
    ├── layout.tsx                 # 認証ガード + SidebarProvider
    ├── error.tsx                  # エラーバウンダリ
    └── dashboard/page.tsx         # Container（データ取得 → Template に渡す）
```
