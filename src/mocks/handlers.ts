import { http, HttpResponse } from "msw";

let nextId = 1;
let todos: { id: number; title: string; completed: boolean; createdAt: string }[] = [];

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

  http.get("/api/todos", () => {
    return HttpResponse.json({ todos });
  }),

  http.post("/api/todos", async ({ request }) => {
    const body = (await request.json()) as { title: string };
    const todo = {
      id: nextId++,
      title: body.title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    todos.unshift(todo);
    return HttpResponse.json({ todo }, { status: 201 });
  }),

  http.patch("/api/todos/:id", async ({ request, params }) => {
    const id = Number(params.id);
    const body = (await request.json()) as { title?: string; completed?: boolean };
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      return HttpResponse.json({ error: "TODO が見つかりません" }, { status: 404 });
    }
    if (body.title !== undefined) todo.title = body.title;
    if (body.completed !== undefined) todo.completed = body.completed;
    return HttpResponse.json({ todo });
  }),

  http.delete("/api/todos/:id", ({ params }) => {
    const id = Number(params.id);
    todos = todos.filter((t) => t.id !== id);
    return HttpResponse.json({ success: true });
  }),
];
