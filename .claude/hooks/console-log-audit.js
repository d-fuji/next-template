const { execFileSync } = require("child_process");
const fs = require("fs");

try {
  const diff = execFileSync("git", ["diff", "--name-only"], { encoding: "utf8" });
  const files = diff.split("\n").filter((f) => /\.(ts|tsx|js|jsx)$/.test(f));
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
  }
} catch (e) {
  // git not available or not a repo — skip
}

console.log("{}");
