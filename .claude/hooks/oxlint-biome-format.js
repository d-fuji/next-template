/**
 * PostToolUse hook: oxlint でリント → Biome でフォーマット
 *
 * Edit / Write で JS/TS ファイルを変更した直後に実行される。
 * 1. oxlint でリント（エラーがあれば Claude へフィードバック）
 * 2. biome format --write でフォーマットを自動修正
 */

const { execFileSync } = require("child_process");

let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  const input = JSON.parse(data);
  const filePath = input.tool_input?.file_path || "";

  if (!/\.(ts|tsx|js|jsx|mts|mjs)$/.test(filePath)) {
    process.stdout.write(data);
    return;
  }

  const messages = [];

  // 1. oxlint でリント
  try {
    execFileSync("npx", ["oxlint", "--format=default", filePath], {
      stdio: "pipe",
      timeout: 15000,
    });
  } catch (e) {
    const output = (e.stdout?.toString() || "") + (e.stderr?.toString() || "");
    if (output.trim()) {
      messages.push(`[oxlint] ${filePath}\n${output.trim()}`);
    }
  }

  // 2. biome format で自動フォーマット
  try {
    execFileSync("npx", ["biome", "format", "--write", filePath], {
      stdio: "pipe",
      timeout: 10000,
    });
  } catch (e) {
    const output = (e.stdout?.toString() || "") + (e.stderr?.toString() || "");
    if (output.trim()) {
      messages.push(`[biome format] ${filePath}\n${output.trim()}`);
    }
  }

  if (messages.length > 0) {
    process.stderr.write(messages.join("\n\n") + "\n");
  }

  process.stdout.write(data);
});
