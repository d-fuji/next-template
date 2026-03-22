import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/health", () => {
    return HttpResponse.json({ status: "ok" });
  }),

  http.post("/api/users", async ({ request }) => {
    const body = (await request.json()) as { email?: string; name?: string };
    return HttpResponse.json(
      { id: "test-user-id", email: body.email, name: body.name },
      { status: 201 }
    );
  }),
];
