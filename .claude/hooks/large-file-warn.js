let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  const input = JSON.parse(data);
  const content = input.tool_input?.content || "";

  if (content.split("\n").length > 800) {
    console.error("[Hook] 警告: 800行超のファイルです。分割を検討してください");
  }

  console.log(data);
});
