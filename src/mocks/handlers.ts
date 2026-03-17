import { http, HttpResponse } from "msw";

// API ハンドラーを追加していく
// 例:
// http.get("/api/example", () => {
//   return HttpResponse.json({ message: "Hello" });
// }),

export const handlers = [
  http.get("/api/health", () => {
    return HttpResponse.json({ status: "ok" });
  }),
];
