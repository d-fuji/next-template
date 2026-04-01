---
name: plan
description: 実装計画を作成する。planner エージェントを起動し、ユーザー確認を待ってから実装に進む。
---

# 実装計画

## ワークフロー

### Step 1: 要件分析

ユーザーのリクエストを分析し、以下を明確にする:

- 何を実装するのか
- 影響を受けるファイル・コンポーネント
- 必要な技術的判断

### Step 2: planner エージェントを起動

planner エージェントに以下を生成させる:

```markdown
# Implementation Plan: [Feature Name]

## Overview
[2-3 行の要約]

## Implementation Steps

### Phase 1: [Phase Name]
1. **[Step]** (File: path/to/file.ts)
   - Action: 具体的なアクション
   - Why: この手順の理由
   - Risk: Low/Medium/High

## Testing Strategy
- Unit tests: [対象]
- Integration tests: [対象]

## Risks & Mitigations
- **Risk**: [説明]
  - Mitigation: [対策]
```

### Step 3: ユーザー確認

**計画をユーザーに提示し、承認を待つ。承認なしに実装を開始しない。**

確認ポイント:
- スコープは適切か
- フェーズ分割は妥当か
- リスクの見落としはないか

### Step 4: 実装開始

承認後、`/tdd` スキルで TDD サイクルに入る。

## 注意事項

- 計画は具体的に（ファイルパス・関数名を明記）
- フェーズは独立してマージ可能にする
- 50 行超の関数、4 段超のネスト、重複コードを計画に含めない
