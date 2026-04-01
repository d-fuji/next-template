let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  const input = JSON.parse(data);
  const filePath = input.tool_input?.file_path || "";

  if (/\.(ts|tsx|js|jsx)$/.test(filePath)) {
    const { execFileSync } = require("child_process");
    try {
      execFileSync("npx", ["prettier", "--write", filePath], {
        stdio: "pipe",
        timeout: 10000,
      });
    } catch (e) {
      // prettier not available or failed — skip silently
    }
  }

  console.log(data);
});
