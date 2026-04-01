#!/usr/bin/env node
/**
 * PreToolUse Hook: Pre-commit Quality Check
 *
 * git commit 前に品質チェックを実行:
 * - ステージされたファイルの console.log / debugger 検出
 * - ハードコードされたシークレット検出
 * - コミットメッセージ形式の検証（Conventional Commits）
 *
 * Exit codes:
 *   0 - 成功（コミット許可）
 *   2 - ブロック（重大な問題あり）
 */

const { spawnSync } = require("child_process");
const fs = require("fs");

let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  const result = evaluate(data);
  process.stdout.write(result.output);
  process.exit(result.exitCode);
});

function evaluate(rawInput) {
  try {
    const input = JSON.parse(rawInput);
    const command = input.tool_input?.command || "";

    if (!command.includes("git commit")) {
      return { output: rawInput, exitCode: 0 };
    }

    // amend はスキップ
    if (command.includes("--amend")) {
      return { output: rawInput, exitCode: 0 };
    }

    const stagedFiles = getStagedFiles();
    if (stagedFiles.length === 0) {
      return { output: rawInput, exitCode: 0 };
    }

    console.error(`[Hook] ${stagedFiles.length} 個のステージファイルをチェック中...`);

    const filesToCheck = stagedFiles.filter(shouldCheckFile);
    let errorCount = 0;
    let warningCount = 0;

    for (const file of filesToCheck) {
      const issues = findFileIssues(file);
      if (issues.length > 0) {
        console.error(`\n  [FILE] ${file}`);
        for (const issue of issues) {
          const label = issue.severity === "error" ? "ERROR" : "WARNING";
          console.error(`    ${label} Line ${issue.line}: ${issue.message}`);
          if (issue.severity === "error") errorCount++;
          else warningCount++;
        }
      }
    }

    // コミットメッセージ検証
    const msgResult = validateCommitMessage(command);
    if (msgResult && msgResult.issues.length > 0) {
      console.error("\n  Commit Message Issues:");
      for (const issue of msgResult.issues) {
        console.error(`    WARNING ${issue.message}`);
        if (issue.suggestion) {
          console.error(`      TIP ${issue.suggestion}`);
        }
        warningCount++;
      }
    }

    if (errorCount > 0) {
      console.error(
        `\n[Hook] BLOCKED: ${errorCount} error(s), ${warningCount} warning(s)。修正してからコミットしてください。`
      );
      return { output: rawInput, exitCode: 2 };
    } else if (warningCount > 0) {
      console.error(`\n[Hook] WARNING: ${warningCount} 件の警告。コミットは許可されます。`);
    } else {
      console.error("\n[Hook] PASS: チェック通過!");
    }
  } catch (e) {
    // エラー時はブロックしない
  }

  return { output: rawInput, exitCode: 0 };
}

function getStagedFiles() {
  const result = spawnSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACMR"], {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  if (result.status !== 0) return [];
  return result.stdout
    .trim()
    .split("\n")
    .filter((f) => f.length > 0);
}

function getStagedFileContent(filePath) {
  const result = spawnSync("git", ["show", `:${filePath}`], {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  if (result.status !== 0) return null;
  return result.stdout;
}

function shouldCheckFile(filePath) {
  return /\.(js|jsx|ts|tsx)$/.test(filePath);
}

function findFileIssues(filePath) {
  const issues = [];

  try {
    const content = getStagedFileContent(filePath);
    if (!content) return issues;

    const lines = content.split("\n");

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // コメント行はスキップ
      if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;

      // console.log 検出
      if (line.includes("console.log")) {
        issues.push({
          type: "console.log",
          message: "console.log が残っています",
          line: lineNum,
          severity: "warning",
        });
      }

      // debugger 検出
      if (/\bdebugger\b/.test(line)) {
        issues.push({
          type: "debugger",
          message: "debugger ステートメントが残っています",
          line: lineNum,
          severity: "error",
        });
      }

      // ハードコードされたシークレット検出
      const secretPatterns = [
        { pattern: /sk-[a-zA-Z0-9]{20,}/, name: "OpenAI API key" },
        { pattern: /ghp_[a-zA-Z0-9]{36}/, name: "GitHub PAT" },
        { pattern: /AKIA[A-Z0-9]{16}/, name: "AWS Access Key" },
        { pattern: /sk_live_[a-zA-Z0-9]{20,}/, name: "Stripe Secret Key" },
        { pattern: /api[_-]?key\s*[=:]\s*['"][^'"]{10,}['"]/i, name: "API key assignment" },
      ];

      for (const { pattern, name } of secretPatterns) {
        if (pattern.test(line)) {
          issues.push({
            type: "secret",
            message: `${name} の可能性があります`,
            line: lineNum,
            severity: "error",
          });
        }
      }
    });
  } catch (e) {
    // ファイル読み取り不可 — スキップ
  }

  return issues;
}

function validateCommitMessage(command) {
  const messageMatch = command.match(/(?:-m|--message)[=\s]+["']?([^"']+)["']?/);
  if (!messageMatch) return null;

  const message = messageMatch[1];
  const issues = [];

  // Conventional Commits 形式チェック
  const conventionalCommit =
    /^(feat|fix|docs|style|refactor|test|chore|build|ci|perf|revert)(\(.+\))?:\s*.+/;
  if (!conventionalCommit.test(message)) {
    issues.push({
      type: "format",
      message: "Conventional Commits 形式ではありません",
      suggestion: 'format: type(scope): description (例: "feat(auth): add login flow")',
    });
  }

  // メッセージ長チェック
  if (message.length > 72) {
    issues.push({
      type: "length",
      message: `メッセージが長すぎます (${message.length}文字, 最大72)`,
      suggestion: "1行目は72文字以内に",
    });
  }

  return { message, issues };
}
