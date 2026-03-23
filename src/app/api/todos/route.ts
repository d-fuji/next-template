import { createHandler } from "@/lib/api/handler";
import { container } from "@/lib/api/container";
import { todoSchema } from "@/lib/validations/todo";

/** TODO 一覧取得 */
export const GET = createHandler()
  .withAuth()
  .handle(async ({ userId }) => {
    const todos = await container.todos.getByUserId(userId);
    return { todos };
  });

/** TODO 作成 */
export const POST = createHandler()
  .withAuth()
  .withBody(todoSchema)
  .withStatus(201)
  .handle(async ({ userId, body }) => {
    const todo = await container.todos.create(userId, body.title);
    return { todo };
  });
