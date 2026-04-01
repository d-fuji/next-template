let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  const input = JSON.parse(data);
  const filePath = input.tool_input?.file_path || "";
  const newString = input.tool_input?.new_string || "";

  if (/\.(ts|tsx|js|jsx)$/.test(filePath) && /(?:^|[^/])console\.log\(/.test(newString)) {
    console.error("[Hook] console.log が追加されました: " + filePath);
  }

  console.log(data);
});
