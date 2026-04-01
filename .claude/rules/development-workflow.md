---
paths:
  - "src/**"
---

# 開発ワークフロー

機能実装の全体フロー。git-workflow.md の前段階。

## Feature Implementation Workflow

### 0. Research & Reuse（実装前に必須）

- **GitHub コード検索**: `gh search repos` / `gh search code` で既存実装・テンプレート・パターンを探す
- **ライブラリドキュメント**: Context7 またはベンダー公式ドキュメントで API の使い方を確認
- **パッケージレジストリ検索**: npm でユーティリティコードを書く前に既存パッケージを探す
- **車輪の再発明を避ける**: 要件の 80% 以上を満たすオープンソース実装があれば、フォーク/ラップ/ポートを優先

### 1. Plan First

- **planner** エージェントで実装計画を作成
- 依存関係とリスクを特定
- フェーズに分割

### 2. TDD Approach

- **tdd-guide** エージェント / `/tdd` スキルを使用
- テストを先に書く（RED）
- テストを通す（GREEN）
- リファクタリング（REFACTOR）
- カバレッジ 80% 以上を確認

### 3. Code Review

- **code-reviewer** エージェント / `/code-review` スキルで即座にレビュー
- CRITICAL / HIGH の問題を修正
- MEDIUM の問題も可能な限り修正

### 4. Pre-Review Checks

レビュー依頼の前に:
- 自動チェック（CI/CD）がすべてパスしていること
- マージコンフリクトが解消されていること
- ターゲットブランチと同期されていること

### 5. Commit & Push

- Conventional Commits 形式でコミット
- 詳細は `git-workflow.md` を参照
