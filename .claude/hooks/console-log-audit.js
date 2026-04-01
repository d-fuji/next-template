#!/usr/bin/env node
/**
 * Stop Hook: 変更ファイルの console.log を監査
 *
 * テストファイル、設定ファイル、scripts/ は除外
 */

const { execFileSync } = require("child_process");
const fs = require("fs");

const EXCLUDED_PATTERNS = [
  /\.test\.[jt]sx?$/,
  /\.spec\.[jt]sx?$/,
  /\.config\.[jt]s$/,
  /scripts\//,
  /__tests__\//,
  /__mocks__\//,
  /\.claude\//,
];

try {
  const diff = execFileSync("git", ["diff", "--name-only"], { encoding: "utf8" });
  const files = diff
    .split("\n")
    .filter((f) => /\.(ts|tsx|js|jsx)$/.test(f))
    .filter((f) => fs.existsSync(f))
    .filter((f) => !EXCLUDED_PATTERNS.some((p) => p.test(f)));

  const found = [];

  for (const f of files) {
    try {
      const content = fs.readFileSync(f, "utf8");
      if (/(?:^|[^/])console\.log\(/.test(content)) {
        found.push(f);
      }
    } catch (e) {
      // file not found — skip
    }
  }

  if (found.length) {
    console.error("[Hook] console.log が残っています:");
    found.forEach((f) => console.error("  - " + f));
    console.error("[Hook] コミット前に削除してください");
  }
} catch (e) {
  // git not available or not a repo — skip
}

console.log("{}");
